// @ts-check
/**
 * For every failing item in semantic-diff-<surface>.ts, recursively compare the Old and
 * New types with the TS checker and emit categorized reasons -> mismatches-<surface>.json
 * and a summary on stdout.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import ts from "typescript"

const here = dirname(fileURLToPath(import.meta.url))
const cfgPath = join(here, "tsconfig.json")
const cfg = ts.getParsedCommandLineOfConfigFile(
  cfgPath,
  {},
  {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: (d) => {
      throw new Error(String(d.messageText))
    },
  },
)
if (!cfg) throw new Error("no tsconfig")
const program = ts.createProgram(cfg.fileNames, cfg.options)
const checker = program.getTypeChecker()
const F = ts.TypeFlags
const str = (/** @type {ts.Type} */ t) =>
  checker.typeToString(
    t,
    undefined,
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
  )

/** @returns {string[]} reasons */
function diff(a, b, path, depth, seen) {
  if (a === b) return []
  const key = `${checker.typeToString(a).slice(0, 80)}|${path.split(".").length}`
  if (depth > 7) return []
  const out = []
  const aU = a.isUnion() ? a.types : [a]
  const bU = b.isUnion() ? b.types : [b]
  if (a.isUnion() || b.isUnion()) {
    const isO = (t) => t.flags & (F.Object | F.Intersection)
    const aObj = aU.filter(isO)
    const bObj = bU.filter(isO)
    const aPrim = aU
      .filter((t) => !isO(t))
      .map(str)
      .sort()
    const bPrim = bU
      .filter((t) => !isO(t))
      .map(str)
      .sort()
    const onlyA = aPrim.filter((x) => !bPrim.includes(x))
    const onlyB = bPrim.filter((x) => !aPrim.includes(x))
    if (onlyA.length || onlyB.length) {
      const nullish = [...onlyA, ...onlyB].some((x) => x === "null" || x === "undefined")
      const lit = [...onlyA, ...onlyB].every((x) =>
        /^["'\d]|^true$|^false$|^null$|^undefined$/.test(x),
      )
      out.push(
        `${nullish ? "nullable/undefined" : lit ? "enum/literal-set" : "union-members"} @${path}: old-only=${onlyA.join("|").slice(0, 120)} new-only=${onlyB.join("|").slice(0, 120)}`,
      )
    }
    if (aObj.length !== bObj.length)
      out.push(`union-object-arity @${path}: old=${aObj.length} new=${bObj.length}`)
    else if (aObj.length === 1) out.push(...diff(aObj[0], bObj[0], path, depth + 1, seen))
    else if (aObj.length > 1) {
      // pair members by their `type` (or first literal) discriminator when present
      const disc = (t) => {
        const p = t.getProperty("type")
        if (!p) return undefined
        const pt = checker.getTypeOfSymbol(p)
        return pt.isStringLiteral() ? pt.value : undefined
      }
      const bMap = new Map(bObj.map((t) => [disc(t), t]))
      const keyed = aObj.every((t) => disc(t) !== undefined)
      if (keyed && bObj.every((t) => disc(t) !== undefined)) {
        for (const t of aObj) {
          const u = bMap.get(disc(t))
          if (!u) out.push(`oneOf-member-missing-in-new @${path}: type=${disc(t)}`)
          else out.push(...diff(t, u, `${path}[type=${disc(t)}]`, depth + 1, seen))
        }
        for (const k of bMap.keys())
          if (!aObj.some((t) => disc(t) === k))
            out.push(`oneOf-member-extra-in-new @${path}: type=${k}`)
      } else {
        // unkeyed: match each old member to any new member with an empty diff
        const unmatchedA = aObj.filter(
          (t) => !bObj.some((u) => diff(t, u, path, depth + 1, new Set()).length === 0),
        )
        const unmatchedB = bObj.filter(
          (u) => !aObj.some((t) => diff(t, u, path, depth + 1, new Set()).length === 0),
        )
        if (unmatchedA.length || unmatchedB.length)
          out.push(
            `oneOf-structure @${path}: unmatched old=${unmatchedA.length} new=${unmatchedB.length} e.g. old=${unmatchedA[0] ? str(unmatchedA[0]).slice(0, 100) : "-"} new=${unmatchedB[0] ? str(unmatchedB[0]).slice(0, 100) : "-"}`,
          )
      }
    }
    return out
  }
  if (a.flags & F.Intersection || b.flags & F.Intersection) {
    // resolve through properties instead
  }
  const aObj = a.flags & (F.Object | F.Intersection)
  const bObj = b.flags & (F.Object | F.Intersection)
  if (aObj && bObj) {
    const aArr = checker.isArrayType(a)
    const bArr = checker.isArrayType(b)
    if (aArr !== bArr)
      return [`array-vs-nonarray @${path}: old=${str(a).slice(0, 80)} new=${str(b).slice(0, 80)}`]
    if (aArr && bArr) {
      return diff(
        checker.getTypeArguments(/** @type {any} */ (a))[0],
        checker.getTypeArguments(/** @type {any} */ (b))[0],
        path + "[]",
        depth + 1,
        seen,
      )
    }
    const pk = `${a.id ?? ""}:${b.id ?? ""}`
    if (seen.has(pk)) return []
    seen.add(pk)
    const aProps = new Map(checker.getPropertiesOfType(a).map((p) => [p.name, p]))
    const bProps = new Map(checker.getPropertiesOfType(b).map((p) => [p.name, p]))
    for (const [n, p] of aProps) {
      const q = bProps.get(n)
      if (!q) {
        out.push(`missing-in-new @${path}.${n}`)
        continue
      }
      const ao = !!(p.flags & ts.SymbolFlags.Optional)
      const bo = !!(q.flags & ts.SymbolFlags.Optional)
      if (ao !== bo)
        out.push(
          `optionality @${path}.${n}: old=${ao ? "optional" : "required"} new=${bo ? "optional" : "required"}`,
        )
      const pt = checker.getTypeOfSymbol(p)
      const qt = checker.getTypeOfSymbol(q)
      out.push(...diff(pt, qt, `${path}.${n}`, depth + 1, seen))
    }
    for (const n of bProps.keys()) if (!aProps.has(n)) out.push(`extra-in-new @${path}.${n}`)
    // index signatures (additionalProperties)
    const aIdx = checker.getIndexInfosOfType(a).map((i) => str(i.type))
    const bIdx = checker.getIndexInfosOfType(b).map((i) => str(i.type))
    if (aIdx.join() !== bIdx.join())
      out.push(`additionalProperties @${path}: old=[${aIdx.join()}] new=[${bIdx.join()}]`)
    return out
  }
  const sa = str(a)
  const sb = str(b)
  if (sa !== sb) out.push(`type @${path}: old=${sa.slice(0, 100)} new=${sb.slice(0, 100)}`)
  return out
}

const summary = {}
for (const surface of ["public", "internal"]) {
  const file = `semantic-diff-${surface}.ts`
  const sf = program.getSourceFile(join(here, file))
  if (!sf) continue
  const meta = JSON.parse(readFileSync(join(here, `semantic-diff-${surface}.json`), "utf8"))
  const diags = ts.getPreEmitDiagnostics(program, sf).filter((d) => d.code === 2322)
  const items = []
  for (const d of diags) {
    const { line } = sf.getLineAndCharacterOfPosition(d.start ?? 0)
    const m = meta.find((x) => x.line === line + 1)
    // locate the `Eq<A, B>` type reference
    let found
    const visit = (/** @type {ts.Node} */ n) => {
      if (found) return
      if (ts.isVariableStatement(n) && sf.getLineAndCharacterOfPosition(n.getStart()).line === line)
        found = n
      else ts.forEachChild(n, visit)
    }
    visit(sf)
    const decl = /** @type {ts.VariableStatement} */ (found).declarationList.declarations[0]
    const ref = /** @type {ts.TypeReferenceNode} */ (decl.type)
    const [A, B] = ref.typeArguments.map((t) => checker.getTypeFromTypeNode(t))
    const reasons = diff(A, B, "", 0, new Set())
    items.push({
      ...m,
      reasons: reasons.length
        ? reasons
        : [`(no structural reason found) old=${str(A).slice(0, 200)} new=${str(B).slice(0, 200)}`],
    })
  }
  writeFileSync(join(here, `mismatches-${surface}.json`), JSON.stringify(items, null, 1))
  const cat = {}
  for (const it of items)
    for (const r of new Set(it.reasons.map((x) => x.split(" ")[0]))) cat[r] = (cat[r] ?? 0) + 1
  const byKind = {}
  for (const it of items) byKind[it.kind] = (byKind[it.kind] ?? 0) + 1
  summary[surface] = { mismatches: items.length, byKind, byCategory: cat }
}
console.log(JSON.stringify(summary, null, 1))
