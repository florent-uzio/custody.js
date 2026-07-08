import type { KnownAppVersion } from "./models/capabilities.generated.js"
import type { SpecSource } from "./versioning/detect.js"

export type RippleCustodyClientOptions = {
  /**
   * Pin the SDK to a specific Ripple Custody backend app version. When set,
   * calls that the version cannot serve throw `UnsupportedInVersionError`,
   * gated against the bundled capability data (no network). Known bundled
   * versions autocomplete; any other string throws at construction. Setting
   * this skips live auto-detection.
   */
  apiVersion?: KnownAppVersion | (string & {})
  /**
   * Auto-detect the backend's capabilities from its live OpenAPI spec on the
   * first API call (cached thereafter). Ignored when `apiVersion` is set.
   *
   * @default true
   */
  autoDetectVersion?: boolean
  /**
   * Override the URL the live spec is fetched from during auto-detection.
   * Defaults to `<apiUrl>/api/OpenAPI?scope=&layout=`. Useful for non-standard
   * instances (e.g. devboxes) that don't follow the default convention.
   */
  openApiUrl?: string
  /**
   * Advanced: fully override how the live spec is fetched during
   * auto-detection (e.g. custom transport/proxy, or in tests). Takes precedence
   * over `openApiUrl`.
   */
  specSource?: SpecSource
  /**
   * API URL for the API endpoints
   *
   * Example: "https://api.metaco.8rey62.m3t4c0.services"
   */
  apiUrl: string
  /**
   * Authentication URL for the API endpoints
   *
   * Example: "https://auth.metaco.8rey62.m3t4c0.services"
   */
  authUrl: string
  /**
   * Private key for signing requests
   */
  privateKey: string
  /**
   * Public key for authentication
   */
  publicKey: string
  /**
   * Request timeout in milliseconds.
   *
   * @default 30000 (30 seconds)
   */
  timeout?: number
}
