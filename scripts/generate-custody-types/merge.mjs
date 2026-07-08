// @ts-check
/**
 * Merge many Ripple Custody OpenAPI documents into one **superset** document.
 *
 * Ripple Custody releases are not monotonic supersets of one another: a higher
 * `x-app-version` can add some schemas/endpoints while lacking others a lower
 * version has (e.g. 1.35.0 has XRPL Batch; 1.35.4 lacks it but adds provider
 * endpoints). So we cannot simply take the newest document — we structurally
 * **union** the docs so nothing any version defines is ever dropped:
 *
 * - arrays (`oneOf`, `anyOf`, `allOf`, `enum`, `required`, `type`) are unioned
 *   and de-duplicated;
 * - objects (`paths`, `components`, `properties`, …) are merged key-by-key,
 *   recursing into shared keys;
 * - an irreconcilable scalar conflict (e.g. `type: "string"` vs `"number"` on
 *   the same schema) falls back to newest-wins and records a warning.
 *
 * Only `paths` and `components` are unioned; every other top-level field
 * (`openapi`, `info`, `servers`, …) is taken from the newest document.
 */

/** @param {any} v @returns {v is Record<string, unknown>} */
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

/** Parse an `x.y.z` app version into comparable numeric parts. */
function parseVersion(v) {
  return String(v ?? "0")
    .split(".")
    .map((n) => Number.parseInt(n, 10) || 0)
}

/** Ascending semver-ish comparator over `x-app-version` strings. */
function compareVersions(a, b) {
  const pa = parseVersion(a)
  const pb = parseVersion(b)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

function appVersion(doc) {
  return doc?.info?.["x-app-version"] ?? "0"
}

/** Union two arrays, de-duplicating by structural (JSON) identity. */
function unionArrays(a, b) {
  const out = []
  const seen = new Set()
  for (const item of [...a, ...b]) {
    const key = JSON.stringify(item)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

/**
 * Deep-union `b` into `a`, returning a new value. `path` is a dotted trail used
 * for warnings; `warnings` collects irreconcilable-conflict messages.
 */
function mergeValue(a, b, path, warnings) {
  if (a === undefined) return b
  if (b === undefined) return a

  if (Array.isArray(a) && Array.isArray(b)) {
    return unionArrays(a, b)
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    /** @type {Record<string, unknown>} */
    const out = { ...a }
    for (const key of Object.keys(b)) {
      out[key] = key in out ? mergeValue(a[key], b[key], `${path}.${key}`, warnings) : b[key]
    }
    return out
  }

  // Scalars (or mismatched kinds): if equal, keep; otherwise newest-wins + warn.
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    warnings.push(`diverging shape at ${path.replace(/^\./, "")}: kept newer value`)
    return b
  }
  return a
}

/**
 * @param {any[]} docs - parsed OpenAPI documents
 * @returns {{ merged: any, warnings: string[] }}
 */
export function mergeOpenApiDocs(docs) {
  if (docs.length === 0) throw new Error("mergeOpenApiDocs: no documents provided")

  const sorted = [...docs].sort((x, y) => compareVersions(appVersion(x), appVersion(y)))
  const newest = sorted[sorted.length - 1]
  const warnings = []

  let paths = {}
  let components = {}
  for (const doc of sorted) {
    paths = mergeValue(paths, doc.paths ?? {}, "paths", warnings)
    components = mergeValue(components, doc.components ?? {}, "components", warnings)
  }

  return { merged: { ...newest, paths, components }, warnings }
}
