import type { KnownAppVersion } from "./models/capabilities.generated.js"

export type RippleCustodyClientOptions = {
  /**
   * Pin the SDK to a specific Ripple Custody backend app version. When set,
   * calls that the version cannot serve throw `UnsupportedInVersionError`,
   * gated against the bundled capability data (no network). Known bundled
   * versions autocomplete; any other string throws at construction.
   *
   * When omitted, capability gating is disabled until a later release adds
   * live auto-detection (issue #136).
   */
  apiVersion?: KnownAppVersion | (string & {})
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
