import type { paths } from "../models/custody-internal-types.js"

// Extract the path keys from the generated internal types for type safety
export type InternalPathKeys = keyof paths

// Helper function to ensure URLs are valid internal paths
function createInternalURLs<T extends Record<string, InternalPathKeys>>(urls: T): T {
  return urls
}

/**
 * Friendly names for the endpoints of the **internal** API surface (ADR-0007),
 * typed against `custody-internal-types.ts` instead of the public document.
 *
 * Unlike `URLs`, this map is deliberately **not** exhaustive and carries no
 * completeness assertion: the internal spec describes 42 endpoints, and only
 * the ones an implemented `client.internal.*` namespace calls are named here.
 */
export const InternalURLs = createInternalURLs({
  // CB_IN decryption (confidential MPTs)
  cmptCbIn: "/internal/v1/cmpt-cb-in",
  cmptCbInStatus: "/internal/v1/cmpt-cb-in/{requestId}",
} as const)
