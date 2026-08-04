import axios from "axios"
import type { ApiSurface, ResolvedCapabilities } from "./version-guard.js"

/**
 * Fetches the target instance's live OpenAPI document. Production is backed by
 * an HTTP GET; tests supply an in-memory implementation.
 */
export interface SpecSource {
  /** Fetch and return the parsed live OpenAPI document. */
  fetchSpec(): Promise<unknown>
}

/** OpenAPI path-item keys that denote an operation. */
const HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"]

/**
 * Builds the OpenAPI document URL for an instance from its API base URL.
 * The endpoint is unauthenticated (the same one the `rc-version` skill reads).
 *
 * `scope` selects the API surface: empty (the default) returns the public
 * document, `"internal"` the internal one (ADR-0007).
 */
export function buildOpenApiUrl(apiUrl: string, scope: "" | "internal" = ""): string {
  return `${apiUrl.replace(/\/+$/, "")}/api/OpenAPI?scope=${scope}&layout=`
}

/** Default HTTP-backed spec source (plain, unauthenticated GET). */
export function createHttpSpecSource(openApiUrl: string, timeout?: number): SpecSource {
  return {
    async fetchSpec() {
      const response = await axios.get(openApiUrl, { timeout })
      return response.data
    },
  }
}

/**
 * Derives a runtime capability set from a live OpenAPI document: every
 * `METHOD /path` it serves and every component schema name it defines.
 * Accurate for any version, including ones the SDK has never bundled.
 */
export function extractCapabilitiesFromSpec(
  spec: unknown,
  surface: ApiSurface = "public",
): ResolvedCapabilities {
  const doc = (spec ?? {}) as {
    info?: { "x-app-version"?: string }
    paths?: Record<string, Record<string, unknown> | null>
    components?: { schemas?: Record<string, unknown> }
  }

  const appVersion = doc.info?.["x-app-version"] ?? "unknown"

  const endpoints = new Set<string>()
  for (const [path, item] of Object.entries(doc.paths ?? {})) {
    if (!item || typeof item !== "object") continue
    for (const method of HTTP_METHODS) {
      if (item[method]) endpoints.add(`${method.toUpperCase()} ${path}`)
    }
  }

  const schemas = new Set<string>(Object.keys(doc.components?.schemas ?? {}))

  return { appVersion, endpoints, schemas, surfaces: new Set([surface]) }
}

/**
 * Fetches the live spec(s) and derives the capability set.
 *
 * The public document is required — a failure there propagates and the guard
 * fails open as it always has. `internalSource` is **best-effort**: instances
 * that predate the internal document, or don't expose it, simply resolve to
 * public-only capabilities, and internal calls then pass through unguarded
 * rather than every one of them throwing (ADR-0007). Both are fetched
 * concurrently, once, on first use.
 */
export async function detectCapabilities(
  source: SpecSource,
  internalSource?: SpecSource,
): Promise<ResolvedCapabilities> {
  const [spec, internalSpec] = await Promise.all([
    source.fetchSpec(),
    internalSource?.fetchSpec().catch(() => undefined),
  ])

  const publicCaps = extractCapabilitiesFromSpec(spec)
  if (internalSpec === undefined) return publicCaps

  const internalCaps = extractCapabilitiesFromSpec(internalSpec, "internal")
  return {
    // The public document names the release; the internal one repeats it.
    appVersion: publicCaps.appVersion,
    endpoints: new Set([...publicCaps.endpoints, ...internalCaps.endpoints]),
    schemas: new Set([...publicCaps.schemas, ...internalCaps.schemas]),
    surfaces: new Set<ApiSurface>(["public", "internal"]),
  }
}
