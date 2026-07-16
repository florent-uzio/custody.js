import type { KnownAppVersion } from "./models/capabilities.generated.js"
import type { KeypairAlgorithm } from "./services/keypairs/keypairs.types.js"
import type { CustodySignContext } from "./services/keypairs/signing-scheme.js"
import type { SpecSource } from "./versioning/detect.js"

export type { CustodySignContext } from "./services/keypairs/signing-scheme.js"

/** Arguments handed to a {@link CustodySigner}. */
export type CustodySignRequest = {
  /**
   * The exact bytes to sign with the raw primitive. The SDK has already applied
   * all keyless prep (canonicalization, and for ed25519 request bodies the
   * SHA-256 pre-hash) — do **not** hash these bytes again.
   */
  data: Uint8Array
  /** What is being signed, for HSM/KMS policy engines and auditing. */
  context: CustodySignContext
}

/**
 * Signs requests without exposing the private key to the SDK (e.g. via an
 * HSM/KMS). Provide a `signer` instead of a `privateKey`.
 *
 * The SDK owns canonicalization, hashing, and signature encoding; the signer
 * runs only the **raw primitive** for its `algorithm` over `data` and returns
 * the raw signature bytes. It may be async. The `algorithm` must match the
 * registered `publicKey`.
 *
 * Raw-signature contract by algorithm:
 * - `ed25519`: return the **64-byte raw** Ed25519 signature over `data`
 *   (`data` is already SHA-256 hashed for request bodies). The SDK applies
 *   Custody's DER-shaped envelope and base64 encoding.
 * - `secp256k1` / `secp256r1`: run standard **ECDSA with SHA-256** over `data`
 *   and return the **DER-encoded** signature. The SDK base64-encodes it.
 */
export type CustodySigner = {
  algorithm: KeypairAlgorithm
  sign: (request: CustodySignRequest) => Uint8Array | Promise<Uint8Array>
}

type BaseClientOptions = {
  /**
   * Pin the SDK to a specific Ripple Custody backend app version. When set,
   * calls that the version cannot serve throw `UnsupportedInVersionError`,
   * gated against the bundled capability data (no network). Setting this skips
   * live auto-detection.
   *
   * Only versions the SDK bundles are accepted — this is a closed set (explicit
   * pinning is offline-only, so a version without bundled data has no meaning;
   * use auto-detection for unbundled versions). Untyped callers that pass an
   * unbundled value still get a clear throw at construction.
   */
  apiVersion?: KnownAppVersion
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
   * Request timeout in milliseconds.
   *
   * @default 30000 (30 seconds)
   */
  timeout?: number
}

/**
 * Authentication credential — exactly one of `privateKey` or `signer`.
 *
 * - `privateKey`: the SDK holds the key (PEM) and signs internally.
 * - `signer`: the SDK delegates the raw signing primitive to you and never sees
 *   the key.
 */
type AuthCredentials =
  | {
      /** Private key (PEM) the SDK uses to sign requests internally. */
      privateKey: string
      signer?: never
    }
  | {
      /** External signer that signs on the SDK's behalf, keeping the key external. */
      signer: CustodySigner
      privateKey?: never
    }

export type RippleCustodyClientOptions = BaseClientOptions & {
  /**
   * Public key for authentication. Required in both signing modes — Custody uses
   * it to verify the signatures produced by your `privateKey` or `signer`.
   */
  publicKey: string
} & AuthCredentials
