// @ts-check
/**
 * Spike: generate src/models/custody-types.ts + custody-internal-types.ts with
 * Kubb (@kubb/core 5 + adapter-oas + plugin-ts + parser-ts) instead of openapi-typescript.
 *
 * Pipeline per surface:
 *   1. loadDocs (copied from scripts/generate-custody-types/generate.mjs) +
 *      mergeOpenApiDocsBySurface (imported, unchanged)
 *   2. createKubb({ input: <in-memory merged doc>, output.path: "types.ts" }) ->
 *      ONE file of named types (single-file mode) with schema names preserved
 *      (`Core_Account`) via a resolver.name override.
 *   3. A GENERATED adapter appended to that file: `paths`, `operations`,
 *      `components` built purely from the merged doc + Kubb's pointer -> name
 *      table (no per-type hand-writing).
 *
 * Run: node spike/kubb/generate.mjs [--out <dir>]   (default: src/models)
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { adapterOas } from "@kubb/adapter-oas"
import { createKubb, memoryStorage } from "@kubb/core"
import { parserTs } from "@kubb/parser-ts"
import { pluginTs, resolverTs } from "@kubb/plugin-ts"

import {
  INTERNAL_SURFACE,
  mergeOpenApiDocsBySurface,
  PUBLIC_SURFACE,
} from "../../scripts/generate-custody-types/merge.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, "..", "..")
const openapiDir = join(repoRoot, "openapi")

const outArgIdx = process.argv.indexOf("--out")
const outDir =
  outArgIdx > -1 ? resolve(process.argv[outArgIdx + 1]) : join(repoRoot, "src", "models")

const TYPES_FILE = {
  [PUBLIC_SURFACE]: "custody-types.ts",
  [INTERNAL_SURFACE]: "custody-internal-types.ts",
}

// ---- loadDocs: verbatim copy of generate.mjs (minus nothing) --------------
function loadDocs() {
  const entries = readdirSync(openapiDir, { withFileTypes: true })
  const stray = entries.filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => e.name)
  if (stray.length > 0) throw new Error(`Stray spec(s) directly in openapi/: ${stray.join(", ")}`)
  const channels = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
  const docs = []
  for (const channel of channels) {
    const channelDir = join(openapiDir, channel)
    const channelEntries = readdirSync(channelDir, { withFileTypes: true })
    const sources = [
      { surface: PUBLIC_SURFACE, dir: channelDir, prefix: `${channel}/` },
      {
        surface: INTERNAL_SURFACE,
        dir: join(channelDir, INTERNAL_SURFACE),
        prefix: `${channel}/${INTERNAL_SURFACE}/`,
        optional: true,
      },
    ]
    for (const { surface, dir, prefix, optional } of sources) {
      if (optional && !channelEntries.some((e) => e.isDirectory() && e.name === INTERNAL_SURFACE))
        continue
      const files = readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .sort()
      for (const file of files) {
        docs.push({
          file: `${prefix}${file}`,
          channel,
          surface,
          doc: JSON.parse(readFileSync(join(dir, file), "utf8")),
        })
      }
    }
  }
  return docs
}

// ---- Kubb ------------------------------------------------------------------
async function runKubb(merged) {
  const kubb = createKubb({
    input: merged, // in-memory document
    root: here,
    output: { path: "gen" },
    adapter: adapterOas(),
    parsers: [parserTs()],
    storage: memoryStorage(),
    plugins: [
      pluginTs({
        output: { path: "types.ts" }, // file extension => single-file mode
        enum: { type: "literal" },
        // Kubb hands the resolver raw names; operation-derived ones contain a
        // space ("getAccount Path") and get Kubb's PascalCase rule; schema names
        // ("Core_Account") are kept verbatim so `components["schemas"]` keys survive.
        resolver: {
          name: (n) => (/\s/.test(n) ? resolverTs.name(n) : n).replace(/[^A-Za-z0-9_$]/g, "_"),
        },
        // openapi-typescript maps int64 to `number`; Kubb defaults to `bigint`.
        printer: { nodes: { bigint: () => "number" } },
      }),
    ],
  })
  const res = await kubb.safeBuild()
  const errors = res.diagnostics.filter((d) => d.severity === "error")
  if (errors.length) throw new Error(`Kubb errors: ${JSON.stringify(errors.slice(0, 3))}`)
  const keys = await kubb.storage.readKeys()
  if (keys.length !== 1) throw new Error(`expected 1 output file, got ${keys.length}`)
  const text = /** @type {string} */ (await kubb.storage.readItem(keys[0]))
  const files = res.files
  if (files.length !== 1) throw new Error(`expected 1 file node, got ${files.length}`)
  /** pointer -> names */
  const byPointer = new Map()
  for (const s of files[0].sources) {
    if (!s.pointer) continue
    const arr = byPointer.get(s.pointer) ?? []
    arr.push(s.name)
    byPointer.set(s.pointer, arr)
  }
  return { text, byPointer, warnings: res.diagnostics.filter((d) => d.severity === "warning") }
}

// ---- Generated adapter -------------------------------------------------------
const esc = (/** @type {string} */ s) => s.replace(/~/g, "~0").replace(/\//g, "~1")
const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"]
const isJsonMime = (/** @type {string} */ m) => m === "application/json"

function buildAdapter(merged, byPointer, report) {
  const missing = (/** @type {string} */ what) => {
    report.unresolved.push(what)
    return "unknown"
  }
  const one = (
    /** @type {string} */ pointer,
    /** @type {(n: string) => boolean} */ pick = () => true,
  ) => (byPointer.get(pointer) ?? []).find(pick)

  /**
   * Type for one media type of a request body / response. Order: Kubb's per-content
   * name -> Kubb's whole-body name (only when it is the sole media type) -> the
   * referenced component -> `string` for string schemas -> `unknown` (counted).
   */
  function contentType(ptr, mime, mimes, schema, where) {
    const specific = one(`${ptr}/content/${esc(mime)}/schema`)
    if (specific) return specific
    if (isJsonMime(mime) || mimes.length === 1) {
      const whole = one(ptr)
      if (whole) return whole
    }
    const ref = schema?.$ref?.match(/^#\/components\/schemas\/(.+)$/)?.[1]
    if (ref && one(`#/components/schemas/${esc(ref)}`))
      return /** @type {string} */ (one(`#/components/schemas/${esc(ref)}`))
    if (schema?.type === "string") return "string"
    if (!isJsonMime(mime)) report.nonJson[ptr.includes("/responses/") ? "response" : "request"]++
    else missing(`${where}: ${mime}`)
    return "unknown"
  }

  /** @param {string} path @param {string} method @param {any} op */
  function operationBody(path, method, op) {
    const base = `#/paths/${esc(path)}/${method}`
    const where = `${method.toUpperCase()} ${path}`
    const params = op.parameters ?? []
    const names = byPointer.get(`${base}/parameters`) ?? []
    const group = (/** @type {string} */ loc, /** @type {RegExp} */ re) => {
      const ps = params.filter((p) => p.in === loc)
      if (ps.length === 0) return `${loc === "path" ? "path" : loc}?: never`
      const name = names.find((n) => re.test(n))
      const t = name ?? missing(`${where}: ${loc} params type`)
      const required = loc === "path" || ps.some((p) => p.required)
      return `${loc}${required ? "" : "?"}: ${t}`
    }
    const parametersBlock = `parameters: {
      ${group("query", /Query\d*$/)}
      ${group("header", /Headers\d*$/)}
      ${group("path", /Path\d*$/)}
      ${group("cookie", /Cookies\d*$/)}
    }`

    let requestBody = "requestBody?: never"
    if (op.requestBody) {
      const content = op.requestBody.content ?? {}
      const mimes = Object.keys(content)
      // Kubb types an optional body as `X | undefined`; the `requestBody?` marker already says that.
      const entries = mimes.map(
        (m) =>
          `${JSON.stringify(m)}: Exclude<${contentType(`${base}/requestBody`, m, mimes, content[m]?.schema, `${where}: request body`)}, undefined>`,
      )
      requestBody = `requestBody${op.requestBody.required ? "" : "?"}: { content: { ${entries.join("; ")} } }`
    }

    const respEntries = Object.entries(op.responses ?? {}).map(([code, r]) => {
      const mimes = Object.keys(r.content ?? {})
      const key = /^\d+$/.test(code) ? code : JSON.stringify(code)
      if (mimes.length === 0)
        return `${key}: { headers: { [name: string]: unknown }; content?: never }`
      const entries = mimes.map(
        (m) =>
          `${JSON.stringify(m)}: ${contentType(`${base}/responses/${code}`, m, mimes, r.content[m]?.schema, `${where}: response ${code}`)}`,
      )
      return `${key}: { headers: { [name: string]: unknown }; content: { ${entries.join("; ")} } }`
    })
    return `{
    ${parametersBlock}
    ${requestBody}
    responses: { ${respEntries.join("; ")} }
  }`
  }

  const opsOut = []
  const seenIds = new Set()
  const pathsOut = []
  for (const [path, item] of Object.entries(merged.paths)) {
    const lines = [`parameters: { query?: never; header?: never; path?: never; cookie?: never }`]
    for (const method of METHODS) {
      const op = /** @type {any} */ (item)[method]
      if (!op) {
        lines.push(`${method}?: never`)
        continue
      }
      const body = operationBody(path, method, op)
      if (op.operationId) {
        if (seenIds.has(op.operationId)) report.duplicateOperationIds.push(op.operationId)
        seenIds.add(op.operationId)
        opsOut.push(`${JSON.stringify(op.operationId)}: ${body}`)
        lines.push(`${method}: operations[${JSON.stringify(op.operationId)}]`)
      } else {
        report.inlineOps++
        lines.push(`${method}: ${body}`)
      }
    }
    pathsOut.push(`${JSON.stringify(path)}: { ${lines.join("; ")} }`)
  }

  const schemaEntries = Object.keys(merged.components?.schemas ?? {}).map((name) => {
    const n = one(`#/components/schemas/${esc(name)}`, (x) => true) ?? missing(`schema ${name}`)
    if (n !== name) report.renamedSchemas.push(`${name} -> ${n}`)
    return `${JSON.stringify(name)}: ${n}`
  })

  return `
// ---- generated adapter: openapi-typescript-compatible shape ---------------------
export interface paths { ${pathsOut.join("\n")} }
export type webhooks = Record<string, never>
export interface components {
  schemas: { ${schemaEntries.join("\n")} }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations { ${opsOut.join("\n")} }
`
}

async function main() {
  const t0 = Date.now()
  const docs = loadDocs()
  const bySurface = mergeOpenApiDocsBySurface(
    docs.map((d) => ({ doc: d.doc, channel: d.channel, surface: d.surface })),
  )
  mkdirSync(outDir, { recursive: true })
  const reports = {}
  for (const [surface, { merged }] of Object.entries(bySurface)) {
    const t1 = Date.now()
    const { text, byPointer, warnings } = await runKubb(merged)
    const report = {
      unresolved: [],
      nonJson: { request: 0, response: 0 },
      duplicateOperationIds: [],
      inlineOps: 0,
      renamedSchemas: [],
      kubbWarnings: warnings.length,
    }
    // drop Kubb banner; un-export the per-type declarations so the module's public
    // surface stays exactly `paths | components | operations | webhooks | $defs`
    // (src/models/index.ts re-exports `*`, and a flat export of every type collides).
    const body = text
      .replace(/^\/\*\*[\s\S]*?\*\/\s*/, "")
      .replace(/^export (type|interface) /gm, "$1 ")
    const adapter = buildAdapter(merged, byPointer, report)
    const adapterLoc = adapter.split("\n").length
    const header = `/**
 * Generated by spike/kubb/generate.mjs (Kubb 5 + generated openapi-typescript-shaped adapter).
 * Merged superset of every ${surface} spec in openapi/. Do not make direct changes.
 */
/* eslint-disable */
`
    const target = join(outDir, TYPES_FILE[surface])
    writeFileSync(target, header + body + adapter)
    reports[surface] = {
      ...report,
      ms: Date.now() - t1,
      adapterLines: adapterLoc,
      kubbLines: body.split("\n").length,
    }
    console.log(
      `[${surface}] wrote ${target} (${report.unresolved.length} unresolved, ${report.renamedSchemas.length} renamed schemas, ` +
        `${report.inlineOps} inline ops, ${report.nonJson.request}+${report.nonJson.response} non-JSON, ${Date.now() - t1} ms)`,
    )
  }
  writeFileSync(join(here, "generate-report.json"), JSON.stringify(reports, null, 2))
  console.log(`total ${Date.now() - t0} ms`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
