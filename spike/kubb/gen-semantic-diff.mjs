// @ts-check
/**
 * Emits spike/kubb/semantic-diff-<surface>.ts (+ a .json sidecar of item metadata).
 * Each item is `const _n: Eq<Old..., New...> = true` on its own line, so each
 * mismatch is a distinct tsc error at a known line.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import {
  INTERNAL_SURFACE,
  mergeOpenApiDocsBySurface,
  PUBLIC_SURFACE,
} from "../../scripts/generate-custody-types/merge.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const openapiDir = join(here, "..", "..", "openapi")

const docs = []
for (const channel of readdirSync(openapiDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()) {
  for (const [surface, dir] of [
    [PUBLIC_SURFACE, join(openapiDir, channel)],
    [INTERNAL_SURFACE, join(openapiDir, channel, INTERNAL_SURFACE)],
  ]) {
    let files = []
    try {
      files = readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .sort()
    } catch {}
    for (const f of files)
      docs.push({ doc: JSON.parse(readFileSync(join(dir, f), "utf8")), channel, surface })
  }
}
const bySurface = mergeOpenApiDocsBySurface(docs)

const BASE = { [PUBLIC_SURFACE]: "old-public", [INTERNAL_SURFACE]: "old-internal" }
const NEW = {
  [PUBLIC_SURFACE]: "../../src/models/custody-types.js",
  [INTERNAL_SURFACE]: "../../src/models/custody-internal-types.js",
}
const q = JSON.stringify
const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"]

for (const [surface, { merged }] of Object.entries(bySurface)) {
  const lines = [
    `import type * as Old from "./baseline/${BASE[surface]}.js"`,
    `import type * as New from "${NEW[surface]}"`,
    `type Eq<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false`,
  ]
  const meta = []
  const add = (kind, label, o, n) => {
    meta.push({ kind, label, line: lines.length + 1 })
    lines.push(`export const _${meta.length}: Eq<${o}, ${n}> = true`)
  }
  lines.splice(
    3,
    0,
    `type Present<T> = { [K in keyof T]-?: [T[K]] extends [never] ? never : K }[keyof T]`,
  )
  add("keys", "paths", `keyof Old.paths`, `keyof New.paths`)
  add("keys", "operations", `keyof Old.operations`, `keyof New.operations`)
  add("keys", "schemas", `keyof Old.components["schemas"]`, `keyof New.components["schemas"]`)
  for (const name of Object.keys(merged.components?.schemas ?? {})) {
    add(
      "schema",
      name,
      `Old.components["schemas"][${q(name)}]`,
      `New.components["schemas"][${q(name)}]`,
    )
  }
  for (const [path, item] of Object.entries(merged.paths)) {
    add("path-methods", path, `Present<Old.paths[${q(path)}]>`, `Present<New.paths[${q(path)}]>`)
    for (const method of METHODS) {
      const op = /** @type {any} */ (item)[method]
      if (!op) continue
      const acc = op.operationId
        ? (ns) => `${ns}.operations[${q(op.operationId)}]`
        : (ns) => `${ns}.paths[${q(path)}][${q(method)}]`
      const label = op.operationId ?? `${method.toUpperCase()} ${path}`
      const both = (suffix) => [acc("Old") + suffix, acc("New") + suffix]
      add(
        "response-codes",
        label,
        `keyof ${both(`["responses"]`)[0]}`,
        `keyof ${both(`["responses"]`)[1]}`,
      )
      const ps = op.parameters ?? []
      for (const loc of ["path", "query", "header"]) {
        if (ps.some((p) => p.in === loc)) {
          const [o, n] = both(`["parameters"][${q(loc)}]`)
          add(`param-${loc}`, label, o, n)
        }
      }
      for (const mime of Object.keys(op.requestBody?.content ?? {})) {
        if (mime !== "application/json") continue
        const [o, n] = both(`["requestBody"]`)
        add(
          "request-body",
          label,
          `NonNullable<${o}>["content"][${q(mime)}]`,
          `NonNullable<${n}>["content"][${q(mime)}]`,
        )
      }
      for (const [code, r] of Object.entries(op.responses ?? {})) {
        if (!r.content?.["application/json"]) continue
        const [o, n] = both(
          `["responses"][${/^\d+$/.test(code) ? code : q(code)}]["content"]["application/json"]`,
        )
        add("response", `${label} ${code}`, o, n)
      }
    }
  }
  writeFileSync(join(here, `semantic-diff-${surface}.ts`), lines.join("\n") + "\n")
  writeFileSync(join(here, `semantic-diff-${surface}.json`), JSON.stringify(meta))
  console.log(`${surface}: ${meta.length} items`)
}
