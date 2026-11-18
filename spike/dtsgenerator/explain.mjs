// Deep structural diff of every mismatching semantic-diff item, using the TypeScript checker.
// usage: node explain.mjs  -> writes out/explain.json (+ prints a leaf-category histogram)
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import ts from "typescript"

const here = fileURLToPath(new URL(".", import.meta.url))
const rows = JSON.parse(readFileSync(here + "out/mismatches.json", "utf8"))
const manifests = {
  public: JSON.parse(readFileSync(here + "semantic-diff.public.manifest.json", "utf8")),
  internal: JSON.parse(readFileSync(here + "semantic-diff.internal.manifest.json", "utf8")),
}
const helpers = [
  `type Json<R> = R extends { content: infer C } ? (C extends { "application/json": infer U } ? U : "no-json") : "no-content"`,
  `type Body<O> = O extends { requestBody: infer R } ? Json<NonNullable<R>> : O extends { requestBody?: infer R } ? Json<NonNullable<R>> : "no-body"`,
]
const lines = [
  `import type * as OldP from "./baseline/custody-types.js"`,
  `import type * as NewP from "../../src/models/custody-types.js"`,
  `import type * as OldI from "./baseline/custody-internal-types.js"`,
  `import type * as NewI from "../../src/models/custody-internal-types.js"`,
  ...helpers,
]
rows.forEach((r, i) => {
  const m = manifests[r.surface][r.line]
  const sfx = r.surface === "public" ? "P" : "I"
  const fix = (e) => e.replaceAll("Old.", `Old${sfx}.`).replaceAll("New.", `New${sfx}.`)
  lines.push(`export type O${i} = ${fix(m.old)}`, `export type N${i} = ${fix(m.new)}`)
})
const probe = here + "probe.ts"
writeFileSync(probe, lines.join("\n") + "\n")
const program = ts.createProgram([probe], {
  strict: true,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  target: ts.ScriptTarget.ES2022,
  skipLibCheck: true,
  noEmit: true,
})
const checker = program.getTypeChecker()
const sf = program.getSourceFile(probe)
const aliases = new Map()
ts.forEachChild(sf, (n) => {
  if (ts.isTypeAliasDeclaration(n)) aliases.set(n.name.text, checker.getTypeAtLocation(n.name))
})
const FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.InTypeAlias |
  ts.TypeFormatFlags.UseStructuralFallback
const str = (t, max = 140) => {
  const s = checker.typeToString(t, undefined, FLAGS)
  return s.length > max ? s.slice(0, max) + "..." : s
}
const eq = (a, b) => checker.isTypeAssignableTo(a, b) && checker.isTypeAssignableTo(b, a)
const sym = (t) => checker.getPropertiesOfType(t)

function diff(a, b, path, out, seen, depth) {
  if (eq(a, b)) return
  const key = `${checker.getTypeAtLocation ? "" : ""}${a.id}:${b.id}`
  if (seen.has(key) || depth > 14) return
  seen.add(key)
  // unions: pair by identical members, then pair the leftovers by discriminant or position
  const am = a.isUnion() ? a.types : [a]
  const bm = b.isUnion() ? b.types : [b]
  if (am.length > 1 || bm.length > 1) {
    const aLeft = am.filter((x) => !bm.some((y) => eq(x, y)))
    const bLeft = bm.filter((y) => !am.some((x) => eq(x, y)))
    if (aLeft.length === 0 && bLeft.length === 0) return
    const disc = (t) => {
      for (const p of sym(t)) {
        const pt = checker.getTypeOfSymbol(p)
        if (
          pt.isStringLiteral() &&
          (p.name === "type" || p.name === "kind" || p.name === "provider")
        )
          return `${p.name}=${pt.value}`
      }
      return undefined
    }
    const used = new Set()
    for (const x of aLeft) {
      const d = disc(x)
      const y = bLeft.find(
        (y) => !used.has(y) && ((d && disc(y) === d) || (!d && sym(x).length === sym(y).length)),
      )
      if (y) {
        used.add(y)
        diff(x, y, `${path}|${d ?? "?"}`, out, seen, depth + 1)
      } else out.push({ path, cat: "union-member-unmatched", old: str(x), new: "(none)" })
    }
    for (const y of bLeft)
      if (!used.has(y))
        out.push({ path, cat: "union-member-unmatched", old: "(none)", new: str(y) })
    return
  }
  if (checker.isArrayType(a) && checker.isArrayType(b))
    return diff(
      checker.getTypeArguments(a)[0],
      checker.getTypeArguments(b)[0],
      `${path}[]`,
      out,
      seen,
      depth + 1,
    )
  const as = sym(a)
  const bs = sym(b)
  const aIdx = checker.getIndexInfosOfType(a)
  const bIdx = checker.getIndexInfosOfType(b)
  if (as.length || bs.length || aIdx.length || bIdx.length) {
    if (aIdx.length || bIdx.length) {
      const ai = aIdx.map((i) => str(i.type, 60)).join(",")
      const bi = bIdx.map((i) => str(i.type, 60)).join(",")
      if (ai !== bi)
        out.push({
          path,
          cat: "index-signature",
          old: ai ? `[k]: ${ai}` : "(none)",
          new: bi ? `[k]: ${bi}` : "(none)",
        })
    }
    const bmap = new Map(bs.map((p) => [p.name, p]))
    const amap = new Map(as.map((p) => [p.name, p]))
    for (const p of as) {
      const q = bmap.get(p.name)
      if (!q) {
        out.push({
          path: `${path}.${p.name}`,
          cat: "prop-missing-in-new",
          old: str(checker.getTypeOfSymbol(p)),
          new: "",
        })
        continue
      }
      const po = !!(p.flags & ts.SymbolFlags.Optional)
      const qo = !!(q.flags & ts.SymbolFlags.Optional)
      if (po !== qo)
        out.push({
          path: `${path}.${p.name}`,
          cat: "optionality",
          old: po ? "optional" : "required",
          new: qo ? "optional" : "required",
        })
      const pt = checker.getNonNullableType(checker.getTypeOfSymbol(p))
      const qt = checker.getNonNullableType(checker.getTypeOfSymbol(q))
      diff(pt, qt, `${path}.${p.name}`, out, seen, depth + 1)
    }
    for (const q of bs)
      if (!amap.has(q.name))
        out.push({
          path: `${path}.${q.name}`,
          cat: "prop-extra-in-new",
          old: "",
          new: str(checker.getTypeOfSymbol(q)),
        })
    return
  }
  out.push({ path, cat: "leaf", old: str(a), new: str(b) })
}

const results = []
rows.forEach((r, i) => {
  const out = []
  diff(aliases.get(`O${i}`), aliases.get(`N${i}`), "$", out, new Set(), 0)
  if (out.length === 0)
    out.push({
      path: "$",
      cat: "no-structural-diff-found",
      old: str(aliases.get(`O${i}`)),
      new: str(aliases.get(`N${i}`)),
    })
  results.push({ ...r, diffs: out })
})
writeFileSync(here + "out/explain.json", JSON.stringify(results, null, 1))
const hist = {}
for (const r of results) for (const d of r.diffs) hist[d.cat] = (hist[d.cat] ?? 0) + 1
console.log(hist)
