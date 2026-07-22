// @ts-check
/**
 * Merge many Ripple Custody OpenAPI documents into one **superset** document,
 * respecting spec **channels** (ADR-0005).
 *
 * Ripple Custody releases are not monotonic supersets of one another, and specs
 * come from two channels — **official** releases and **devbox** feature-branch
 * builds — whose `x-app-version` strings are not unique across channels. So we
 * cannot simply take the newest document. Instead:
 *
 * - **Official is authoritative.** Official specs establish the superset and its
 *   identity (`info`/`servers`/…), merged newest-wins among themselves. The base
 *   document is the newest official spec, never a devbox spec.
 * - **Devbox is additive.** Devbox specs are unioned in afterwards: they may add
 *   new schemas/endpoints (e.g. XRPL Batch) and union array members, but on an
 *   irreconcilable scalar conflict the **official** value wins and a warning is
 *   recorded. A feature-branch build can never silently redefine an officially-
 *   typed shape.
 *
 * Union rules (both phases): arrays (`oneOf`, `anyOf`, `allOf`, `enum`,
 * `required`, `type`) are unioned and de-duplicated; objects (`paths`,
 * `components`, `properties`, …) are merged key-by-key, recursing into shared
 * keys. Only `paths` and `components` are unioned; every other top-level field
 * is taken from the base (newest official) document.
 */

/** @param {any} v @returns {v is Record<string, unknown>} */
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

/** Parse an `x.y.z` app version into comparable numeric parts. @param {unknown} v @returns {number[]} */
function parseVersion(v) {
  return String(v ?? "0")
    .split(".")
    .map((n) => Number.parseInt(n, 10) || 0)
}

/** Ascending semver-ish comparator over `x-app-version` strings. @param {string} a @param {string} b @returns {number} */
function compareVersions(a, b) {
  const pa = parseVersion(a)
  const pb = parseVersion(b)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

/** @param {any} doc @returns {string} */
function appVersion(doc) {
  return doc?.info?.["x-app-version"] ?? "0"
}

/**
 * Some releases emit paths with a doubled leading slash (e.g. `//v1/health`
 * instead of `/v1/health`) — a known upstream artifact. Collapse those before
 * merging so they don't get treated as a distinct path with a colliding
 * `operationId`.
 * @param {string} key
 * @returns {string}
 */
function normalizePathKey(key) {
  return key.replace(/^\/+/, "/")
}

/**
 * Normalize a doc's `paths` keys, merging any resulting collisions.
 * @param {Record<string, unknown>} paths
 * @param {string[]} warnings
 * @returns {Record<string, unknown>}
 */
function normalizeDocPaths(paths, warnings) {
  /** @type {Record<string, unknown>} */
  const out = {}
  for (const key of Object.keys(paths)) {
    const norm = normalizePathKey(key)
    out[norm] =
      norm in out ? mergeValue(out[norm], paths[key], `paths.${norm}`, warnings, "b") : paths[key]
  }
  return out
}

/**
 * Union two arrays, de-duplicating by structural (JSON) identity.
 * @param {unknown[]} a
 * @param {unknown[]} b
 * @returns {unknown[]}
 */
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
 * Deep-union `b` into `a`, returning a new value. On an irreconcilable scalar
 * conflict, `prefer` decides the winner: `"b"` keeps the incoming (newer) value
 * — official-vs-official newest-wins; `"a"` keeps the accumulated value —
 * devbox-vs-official, official wins. `path` is a dotted trail used for warnings;
 * `warnings` collects conflict messages.
 * @param {unknown} a
 * @param {unknown} b
 * @param {string} path
 * @param {string[]} warnings
 * @param {"a" | "b"} [prefer]
 * @returns {any}
 */
function mergeValue(a, b, path, warnings, prefer = "b") {
  if (a === undefined) return b
  if (b === undefined) return a

  if (Array.isArray(a) && Array.isArray(b)) {
    return unionArrays(a, b)
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    /** @type {Record<string, unknown>} */
    const out = { ...a }
    for (const key of Object.keys(b)) {
      out[key] =
        key in out ? mergeValue(a[key], b[key], `${path}.${key}`, warnings, prefer) : b[key]
    }
    return out
  }

  // Scalars (or mismatched kinds): if equal, keep; otherwise the configured
  // side wins and we warn.
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    const at = path.replace(/^\./, "")
    if (prefer === "a") {
      warnings.push(`devbox diverges from official at ${at}; kept official`)
      return a
    }
    warnings.push(`diverging shape at ${at}: kept newer value`)
    return b
  }
  return a
}

/**
 * @param {Array<{ doc: any, channel: string }>} taggedDocs - channel-tagged
 *   OpenAPI documents (channel is the spec's `openapi/<channel>/` folder).
 * @returns {{ merged: any, warnings: string[] }}
 */
export function mergeOpenApiDocs(taggedDocs) {
  if (!taggedDocs || taggedDocs.length === 0) {
    throw new Error("mergeOpenApiDocs: no documents provided")
  }

  const official = taggedDocs.filter((t) => t.channel === "official").map((t) => t.doc)
  const additive = taggedDocs.filter((t) => t.channel !== "official").map((t) => t.doc)

  // Official specs are authoritative. When none are bundled, the additive pool
  // stands in as the authority so generation still works.
  const authoritative = official.length ? official : additive
  const secondary = official.length ? additive : []

  /** @param {any} x @param {any} y */
  const byVersionAsc = (x, y) => compareVersions(appVersion(x), appVersion(y))
  const authSorted = [...authoritative].sort(byVersionAsc)
  const secSorted = [...secondary].sort(byVersionAsc)

  const base = authSorted[authSorted.length - 1]
  /** @type {string[]} */
  const warnings = []

  /** @type {Record<string, unknown>} */
  let paths = {}
  /** @type {Record<string, unknown>} */
  let components = {}
  // Phase 1: official specs, newest-wins on conflict.
  for (const doc of authSorted) {
    paths = mergeValue(paths, normalizeDocPaths(doc.paths ?? {}, warnings), "paths", warnings, "b")
    components = mergeValue(components, doc.components ?? {}, "components", warnings, "b")
  }
  // Phase 2: devbox specs, additive — official wins on conflict.
  for (const doc of secSorted) {
    paths = mergeValue(paths, normalizeDocPaths(doc.paths ?? {}, warnings), "paths", warnings, "a")
    components = mergeValue(components, doc.components ?? {}, "components", warnings, "a")
  }

  return { merged: { ...base, paths, components }, warnings }
}
