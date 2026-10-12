import type { KnownAppVersion } from "./models/capabilities.generated.js"
import type { components } from "./models/custody-types.js"
import type { KeypairAlgorithm } from "./services/keypairs/keypairs.types.js"
import type { CustodySignContext } from "./services/keypairs/signing-scheme.js"
import type { SpecSource } from "./versioning/detect.js"

export type { CustodySignContext } from "./services/keypairs/signing-scheme.js"

/** Arguments handed to a {@link CustodySigner}. */
export type CustodySignRequest = {
  /**
   * The exact bytes to sign with the raw primitive. The SDK has already applied
   * all keyless prep (canonicalization, and for ed25519 request bodies the
   * SHA-256 pre-hash). For **ed25519**, sign these bytes as-is — do **not** hash
   * them again. For **secp256k1/secp256r1**, `data` is not pre-hashed: run
   * standard ECDSA-with-SHA-256, which hashes `data` as part of the operation.
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

/**
 * Every request payload the SDK signs, as a union discriminated on `type`.
 * Intent proposal, approval and rejection are the only signed bodies — every
 * other POST is sent unsigned — so narrowing on `request.type` gives full
 * autocomplete down to the operation being proposed.
 */
export type CustodySignedRequest =
  | components["schemas"]["Core_Propose"]
  | components["schemas"]["Core_Approve"]
  | components["schemas"]["Core_Reject"]

/**
 * Last chance to reshape a request payload before the SDK canonicalizes and
 * signs it. Whatever it returns is both signed and sent, so the signed bytes
 * remain the bytes on the wire. Runs only on signed POST bodies.
 *
 * Narrow the {@link CustodySignedRequest} union on `type` (`"Propose"`,
 * `"Approve"`, `"Reject"`) — and then on `payload.type` and
 * `parameters.type` — to reach a fully typed operation, and return the request
 * unchanged for anything the hook does not handle.
 *
 * This is an **escape hatch, not SDK behaviour** — its purpose is to let an
 * application work around a backend defect without waiting for an SDK release.
 * The known case is the API re-serializing set-typed array fields (e.g.
 * `MPTokenIssuanceCreate.flags`) in a different order than sent once they hold
 * five or more elements, which fails signature verification with a
 * `401 InvalidSignatureError`. Sorting such a field into the order the backend
 * re-emits makes the request verify. Treat any such ordering as temporary: it
 * is an undocumented server-side artifact, not part of the API contract.
 *
 * @see {@link https://github.com/florent-uzio/custody.js/issues/223}
 */
export type BeforeSignHook = (request: CustodySignedRequest) => CustodySignedRequest

/** Which of the SDK's two HTTP clients an exchange came from. */
export type CustodyDebugClient = "api" | "auth"

/**
 * Uppercased HTTP verb on a {@link CustodyDebugEvent}. The five listed are the
 * only verbs the SDK issues; `"UNKNOWN"` covers the case Axios's types allow but
 * its runtime does not (it marks `config.method` optional, yet always fills it in
 * before interceptors run). Trailing `(string & {})` keeps the union assignable
 * from any string, so narrowing on a verb autocompletes without the type
 * claiming more than Axios guarantees.
 */
export type CustodyHttpMethod =
  "DELETE" | "GET" | "PATCH" | "POST" | "PUT" | "UNKNOWN" | (string & {})

/** Fields every {@link CustodyDebugEvent} carries. */
type CustodyDebugEventBase = {
  client: CustodyDebugClient
  method: CustodyHttpMethod
  /**
   * Absolute URL, base URL included. Deliberately a plain `string` and not a
   * generated `paths` key: path parameters are already interpolated by the time
   * an event is emitted (`…/v1/domains/d-123/accounts`, not
   * `…/v1/domains/{domainId}/accounts`), and the `"auth"` client's URL is not an
   * API path at all.
   */
  url: string
}

/**
 * One HTTP exchange the SDK observed, handed to a {@link CustodyDebugLogger}.
 * Narrow on `kind`: a `"request"` fires just before the request goes out, and is
 * followed by exactly one `"response"` or `"error"`.
 *
 * Credentials are always masked — the `Authorization` request header and the
 * `access_token` / `id_token` / `refresh_token` response fields — so an event is
 * safe to write wherever the rest of an application's logs go. Everything else
 * is verbatim, including the auth request's `signature`, which is bound to a
 * single challenge and is the thing you need when debugging a signature failure.
 */
export type CustodyDebugEvent = CustodyDebugEventBase &
  (
    | {
        kind: "request"
        /** Final outbound headers, with the bearer token masked. */
        headers: Record<string, unknown>
        /** Query parameters, before serialization. `undefined` when there are none. */
        params?: unknown
        /** Body as passed to Axios, before serialization. */
        body?: unknown
      }
    | {
        kind: "response"
        status: number
        durationMs: number
        /** Parsed response body. */
        body?: unknown
      }
    | {
        kind: "error"
        /** Absent when the request failed without a response (timeout, DNS, socket). */
        status?: number
        durationMs: number
        /** Parsed error response body, when the server sent one. */
        body?: unknown
        /** The Axios error message. */
        message: string
      }
  )

/**
 * Receives every {@link CustodyDebugEvent} the SDK emits. Set as the `debug`
 * client option to route diagnostics into your own logger (pino, winston, a
 * test spy), to filter them, or to reshape them.
 *
 * Called synchronously on the request path, so keep it cheap and non-blocking.
 * A logger that throws is ignored rather than allowed to fail the request.
 */
export type CustodyDebugLogger = (event: CustodyDebugEvent) => void

type BaseClientOptions = {
  /**
   * Reshape a request payload just before it is canonicalized and signed. An
   * escape hatch for working around backend signature-verification defects;
   * see {@link BeforeSignHook}. Not applied when signing is skipped.
   */
  beforeSign?: BeforeSignHook
  /**
   * Log every HTTP exchange the SDK makes — both API calls and auth token
   * requests, each request paired with its response or error (status, duration,
   * error body). Off unless set.
   *
   * `true` writes to `console.error` (stderr, so it never mixes into a
   * program's stdout). Pass a {@link CustodyDebugLogger} instead to route the
   * structured {@link CustodyDebugEvent}s into your own logger.
   *
   * The bearer token is always masked, in both forms — in the `Authorization`
   * request header and in the token endpoint's response body.
   *
   * @default false
   */
  debug?: boolean | CustodyDebugLogger
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
