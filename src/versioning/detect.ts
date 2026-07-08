import axios from "axios"
import type { ResolvedCapabilities } from "./version-guard.js"

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
 */
export function buildOpenApiUrl(apiUrl: string): string {
  return `${apiUrl.replace(/\/+$/, "")}/api/OpenAPI?scope=&layout=`
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
export function extractCapabilitiesFromSpec(spec: unknown): ResolvedCapabilities {
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

  return { appVersion, endpoints, schemas }
}

/** Fetches the live spec via `source` and derives its capability set. */
export async function detectCapabilities(source: SpecSource): Promise<ResolvedCapabilities> {
  const spec = await source.fetchSpec()
  return extractCapabilitiesFromSpec(spec)
}
