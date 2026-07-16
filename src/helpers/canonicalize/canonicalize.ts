import canonicalize from "canonicalize"
import { CustodyError } from "../../models/custody-error.js"

/**
 * Produces the canonical JSON string Ripple Custody hashes and signs for a
 * request body — the same canonicalization the SDK applies internally before
 * signing. Useful for inspecting or reproducing the signing input out-of-band.
 *
 * Note: this is the pre-hash/pre-encode input, **not** the final signed bytes.
 * Reproducing a server-valid signature also requires the per-algorithm prep the
 * SDK owns (for ed25519, a SHA-256 of this string; then the algorithm-specific
 * signature encoding). See {@link CustodySigner} for the full scheme.
 *
 * @param request - The `request` payload to canonicalize.
 * @returns The canonical JSON string.
 * @throws {CustodyError} If canonicalization yields no output.
 */
export function toSignablePayload(request: unknown): string {
  const canonicalized = canonicalize(request)

  if (!canonicalized) {
    throw new CustodyError({ reason: "Failed to canonicalize request body" })
  }

  return canonicalized
}
