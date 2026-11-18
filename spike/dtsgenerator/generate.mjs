import { writeFileSync } from "node:fs"
// @ts-check
/**
 * Spike generator: dtsgenerator 4.x -> src/models/custody{,-internal}-types.ts
 *
 *   node spike/dtsgenerator/generate.mjs [--keep-min-items]
 *
 * Pipeline per surface:
 *   load (copied) -> mergeOpenApiDocsBySurface (real, imported) -> sanitize ->
 *   dtsGenerator -> `declare namespace` => `export declare namespace` ->
 *   GENERATED adapter exporting `paths` / `operations` / `components`.
 */
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import dtsgen from "dtsgenerator"

import {
  INTERNAL_SURFACE,
  mergeOpenApiDocsBySurface,
  PUBLIC_SURFACE,
} from "../../scripts/generate-custody-types/merge.mjs"
import { loadDocs } from "./load-docs.mjs"

const require = createRequire(import.meta.url)
// dtsgenerator has no `exports` map, so its internal name mangler can be reused (brittle: see RESULTS.md).
const { toTypeName } = require("dtsgenerator/dist/core/validateIdentifier.js")

const here = dirname(fileURLToPath(import.meta.url))
const modelsDir = join(here, "..", "..", "src", "models")
const TARGET = 99 // ScriptTarget.Latest-ish; only used for identifier validity
const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"]
const TYPES_FILE = {
  [PUBLIC_SURFACE]: "custody-types.ts",
  [INTERNAL_SURFACE]: "custody-internal-types.ts",
}

/** Mirror of dtsgenerator's (non-exported) convertKeyToTypeName in jsonSchema.js. */
const convertKey = (key) =>
  key
    .replace(/\/(.)/g, (_m, p1) => p1.toUpperCase())
    .replace(/}/g, "")
    .replace(/{/g, "$")
    .replace(/^\//, "")
    .replace(/[^0-9A-Za-z_$]+/g, "_")
const tn = (s) => toTypeName(convertKey(s), TARGET)

const isJsonMime = (m) =>
  /^application\/(?:[a-z0-9-_.]+\+)?json5?$/.test(m.toLowerCase().split(";")[0].trim()) ||
  m.toLowerCase().startsWith("text/json")

/**
 * Workarounds required to get dtsgenerator to run / to be faithful:
 *  1. strip minItems/maxItems: dtsgenerator expands them into tuple types; the specs contain
 *     `maxItems: 2147483647` (springdoc default) which makes it allocate until the heap is exhausted
 *     (OOM at 12 GB on the real specs), and minItems: 1 would turn arrays into `[T, ...T[]]`.
 *  2. when a response/requestBody has a JSON media type AND other media types, keep only the JSON one:
 *     dtsgenerator merges the schemas of all media types into a single type per response.
 *     (The adapter re-adds the non-JSON keys from the ORIGINAL doc.)
 */
function sanitize(doc, keepMinItems) {
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (node && typeof node === "object") {
      delete node.maxItems
      if (!keepMinItems) delete node.minItems
      for (const v of Object.values(node)) walk(v)
    }
  }
  walk(doc)
  /** 3. operationIds that dtsgenerator maps to the same namespace (e.g. `getPolicy` / `GetPolicy`) get merged
   *     into ONE namespace (silently wrong types): rename the later ones in the sanitized doc. */
  const overrides = new Map()
  const usedNs = new Set()
  for (const [p, item] of Object.entries(doc.paths)) {
    for (const m of METHODS) {
      const op = item[m]
      if (!op) continue
      if (op.operationId) {
        let name = tn(op.operationId)
        if (usedNs.has(name)) {
          const renamed = `${op.operationId}_dup${usedNs.size}`
          console.warn(
            `  ! operationId collision: ${op.operationId} -> ${name}; renaming to ${renamed}`,
          )
          op.operationId = renamed
          name = tn(renamed)
          overrides.set(`${m} ${p}`, name)
        }
        usedNs.add(name)
      }
      const pick = (holder) => {
        const c = holder?.content
        if (!c) return
        const json =
          Object.keys(c).find((k) => k === "application/json") ?? Object.keys(c).find(isJsonMime)
        if (json) for (const k of Object.keys(c)) if (k !== json) delete c[k]
      }
      pick(op.requestBody)
      for (const r of Object.values(op.responses ?? {})) pick(r)
    }
  }
  return overrides
}

const q = (s) => JSON.stringify(s)

/** Mirror of dtsgenerator's checkValidMIMEType (utils.js): media types it emits a type for. */
function mimeValid(mime) {
  const type = mime.toLowerCase().split(";")[0].trim()
  const special = [
    "application/octet-stream",
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "application/jwt",
    "application/vnd.apple.pkpass",
  ]
  if (special.includes(type)) return true
  if (type.startsWith("text/") || type.startsWith("image/")) return true
  return /^application\/(?:[a-z0-9-_.]+\+)?json5?$/.test(type)
}

/** Generic fallback for media types dtsgenerator ignores (e.g. the any-type wildcard) or that have no schema. */
function schemaType(schema) {
  if (!schema) return "unknown"
  if (schema.$ref) {
    const m = /^#\/components\/schemas\/(.+)$/.exec(schema.$ref)
    return m ? `Components.Schemas.${toTypeName(m[1], TARGET)}` : "unknown"
  }
  if (schema.type === "string") return "string"
  if (schema.type === "array") return `${schemaType(schema.items)}[]`
  return "unknown"
}

/** Type for one media type of a request body / response; `generated` is the member dtsgenerator emits. */
function contentType(content, mime, generated) {
  if (!content[mime]?.schema) return "unknown"
  const keys = Object.keys(content)
  // dtsgenerator emits ONE type per body (merged over its valid media types, after sanitize()).
  const usesGenerated = mimeValid(mime) && (isJsonMime(mime) || keys.every((k) => !isJsonMime(k)))
  return usesGenerated ? generated : schemaType(content[mime].schema)
}

/** Emit an `operations[...]`-shaped object type for one operation. `ns` = `Paths.X` or `Paths.X.Get`. */
function emitOperation(op, ns) {
  const params = op.parameters ?? []
  const byIn = (where) => params.filter((p) => p.in === where)
  const kind = (where, iface) => {
    const ps = byIn(where)
    if (ps.length === 0) return `${where}?: never`
    const required = where === "path" || ps.some((p) => p.required)
    return `${where}${required ? "" : "?"}: ${ns}.${iface}`
  }
  const lines = []
  lines.push(
    `parameters: { ${kind("query", "QueryParameters")}; ${kind("header", "HeaderParameters")}; ${kind("path", "PathParameters")}; cookie?: never }`,
  )
  if (op.requestBody) {
    const rb = op.requestBody
    const content = Object.keys(rb.content ?? {})
      .map((mime) => `${q(mime)}: ${contentType(rb.content, mime, `${ns}.RequestBody`)}`)
      .join("; ")
    lines.push(`requestBody${rb.required ? "" : "?"}: { content: { ${content} } }`)
  } else {
    lines.push("requestBody?: never")
  }
  const responses = Object.entries(op.responses ?? {}).map(([code, r]) => {
    const key = code === "default" ? "default" : code
    const tsKey = code === "default" ? "Default" : `$${code}`
    const mimes = Object.keys(r.content ?? {})
    const content =
      mimes.length === 0
        ? "content?: never"
        : `content: { ${mimes
            .map(
              (mime) => `${q(mime)}: ${contentType(r.content, mime, `${ns}.Responses.${tsKey}`)}`,
            )
            .join("; ")} }`
    return `${key}: { headers: { [name: string]: unknown }; ${content} }`
  })
  lines.push(`responses: { ${responses.join("; ")} }`)
  return `{ ${lines.join("; ")} }`
}

function buildAdapter(doc, overrides) {
  const out = []
  const schemaKeys = Object.keys(doc.components?.schemas ?? {})
  const seen = new Map()
  for (const k of schemaKeys) {
    const n = toTypeName(k, TARGET)
    if (seen.has(n)) throw new Error(`name collision: ${k} and ${seen.get(n)} both -> ${n}`)
    seen.set(n, k)
  }
  out.push("export interface components {")
  out.push("  schemas: {")
  for (const k of schemaKeys) out.push(`    ${q(k)}: Components.Schemas.${toTypeName(k, TARGET)}`)
  out.push("  }")
  out.push(
    "  responses: never; parameters: never; requestBodies: never; headers: never; pathItems: never",
  )
  out.push("}")
  out.push("export type webhooks = Record<string, never>")
  out.push("export type $defs = Record<string, never>")

  const ops = []
  const pathsOut = []
  const withMethodSeen = new Set()
  for (const [p, item] of Object.entries(doc.paths)) {
    const members = []
    for (const m of METHODS) {
      const op = item[m]
      if (!op) {
        members.push(`${m}?: never`)
        continue
      }
      if (op.operationId) {
        const ns = `Paths.${overrides.get(`${m} ${p}`) ?? tn(op.operationId)}`
        ops.push(`  ${q(op.operationId)}: ${emitOperation(op, ns)}`)
        members.push(`${m}: operations[${q(op.operationId)}]`)
      } else {
        const ns = `Paths.${tn(p)}.${toTypeName(m, TARGET)}`
        withMethodSeen.add(ns)
        members.push(`${m}: ${emitOperation(op, ns)}`)
      }
    }
    pathsOut.push(
      `  ${q(p)}: { parameters: { query?: never; header?: never; path?: never; cookie?: never }; ${members.join("; ")} }`,
    )
  }
  out.push("export interface paths {", ...pathsOut, "}")
  out.push("export interface operations {", ...ops, "}")
  return out.join("\n")
}

async function main() {
  const keepMinItems = process.argv.includes("--keep-min-items")
  const docs = loadDocs()
  const bySurface = mergeOpenApiDocsBySurface(
    docs.map((d) => ({ doc: d.doc, channel: d.channel, surface: d.surface })),
  )
  for (const [surface, { merged }] of Object.entries(bySurface)) {
    const original = structuredClone(merged)
    const overrides = sanitize(merged, keepMinItems)
    const t = Date.now()
    const dts = await dtsgen.default({ contents: [dtsgen.parseSchema(merged)], config: {} })
    const ms = Date.now() - t
    let body = dts.replace(/^declare namespace /gm, "export declare namespace ")
    // Interfaces are not assignable to Record<string, unknown> (no implicit index signature), which the
    // transport layer relies on; type-literal aliases are. No dtsgenerator interface uses `extends`.
    if (!process.argv.includes("--keep-interfaces")) {
      body = body.replace(/^(\s+export) interface (\w+) \{/gm, "$1 type $2 = {")
    }
    const header = `/**\n * SPIKE (dtsgenerator ${require("dtsgenerator/package.json").version}): generated from the merged superset of every ${surface} spec.\n * Do not make direct changes.\n */\n\n`
    writeFileSync(
      join(modelsDir, TYPES_FILE[surface]),
      header + body + "\n" + buildAdapter(original, overrides) + "\n",
    )
    console.log(`${surface}: dtsGenerator ${ms} ms, ${dts.length} chars`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
