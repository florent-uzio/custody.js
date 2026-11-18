// @ts-check
/**
 * Report what changed between two OpenAPI specs: operations and component
 * schemas added, removed or changed. Used when syncing a new Custody release to
 * decide whether the SDK needs a new namespace or method.
 *
 * Usage:
 *   npm run diff:openapi -- <old> <new>
 *
 * Each argument is either an official version (`1.43.7`, resolved to
 * `openapi/official/openapi-1-43-7.json`) or a path to a `.json` spec.
 */

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { isDeepStrictEqual } from "node:util"

/** OpenAPI path-item keys that denote an operation. */
const HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"]

/**
 * @param {any} doc
 * @returns {Map<string, any>} operations keyed by `METHOD /path`
 */
function operationsOf(doc) {
  const ops = new Map()
  for (const [path, item] of Object.entries(doc?.paths ?? {})) {
    if (item === null || typeof item !== "object") continue
    for (const method of HTTP_METHODS) {
      if (item[method]) ops.set(`${method.toUpperCase()} ${path}`, item[method])
    }
  }
  return ops
}

/**
 * @param {Map<string, any>} before
 * @param {Map<string, any>} after
 */
function diffMaps(before, after) {
  const added = [...after.keys()].filter((k) => !before.has(k)).sort()
  const removed = [...before.keys()].filter((k) => !after.has(k)).sort()
  const changed = [...before.keys()]
    .filter((k) => after.has(k) && !isDeepStrictEqual(before.get(k), after.get(k)))
    .sort()
  return { added, removed, changed }
}

/**
 * @param {any} before
 * @param {any} after
 */
export function diffOpenApiSpecs(before, after) {
  return {
    versions: {
      before: before?.info?.["x-app-version"] ?? "unknown",
      after: after?.info?.["x-app-version"] ?? "unknown",
    },
    operations: diffMaps(operationsOf(before), operationsOf(after)),
    schemas: diffMaps(
      new Map(Object.entries(before?.components?.schemas ?? {})),
      new Map(Object.entries(after?.components?.schemas ?? {})),
    ),
  }
}

/** @param {ReturnType<typeof diffOpenApiSpecs>} diff */
export function formatDiff(diff) {
  const lines = [`OpenAPI diff ${diff.versions.before} -> ${diff.versions.after}`]
  for (const kind of /** @type {const} */ (["operations", "schemas"])) {
    for (const change of /** @type {const} */ (["added", "removed", "changed"])) {
      const items = diff[kind][change]
      lines.push(`${kind} ${change}: ${items.length}`)
      for (const item of items) lines.push(`  ${item}`)
    }
  }
  return lines.join("\n")
}

/** @param {string} arg */
function resolveSpecPath(arg) {
  if (arg.endsWith(".json")) return arg
  const repoRoot = join(fileURLToPath(import.meta.url), "..", "..")
  return join(repoRoot, "openapi", "official", `openapi-${arg.replaceAll(".", "-")}.json`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [oldArg, newArg] = process.argv.slice(2)
  if (!oldArg || !newArg) {
    console.error("Usage: npm run diff:openapi -- <old version|path.json> <new version|path.json>")
    process.exit(1)
  }
  const load = (/** @type {string} */ arg) => JSON.parse(readFileSync(resolveSpecPath(arg), "utf8"))
  console.log(formatDiff(diffOpenApiSpecs(load(oldArg), load(newArg))))
}
