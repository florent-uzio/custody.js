import crypto from "crypto"
import { CustodyError } from "../../models/custody-error.js"
import type { KeypairAlgorithm } from "./keypairs.types.js"

/**
 * What the signer is signing. Passed to the signer so external HSM/KMS policy
 * engines can apply per-operation rules, and used by the SDK to prepare the
 * correct signing input.
 */
export type CustodySignContext = "auth-challenge" | "request-body"

/**
 * The Ripple Custody signing scheme, factored so the private-key operation (the
 * raw primitive) is isolated from the keyless prep/encode steps. This lets an
 * external signer run only the raw primitive while the SDK owns everything else.
 *
 * Verified to reproduce {@link KeypairService} output byte-for-byte
 * (see `signing-scheme.test.ts`), so signatures match what the server accepts.
 */

/**
 * Prepares the exact bytes the raw signing primitive must run over.
 *
 * - ed25519: the request body is SHA-256 hashed first (Custody's scheme); the
 *   auth challenge is signed over its raw UTF-8 bytes.
 * - secp256k1/secp256r1: the UTF-8 message bytes (ECDSA applies SHA-256 itself).
 */
export function prepareSigningInput(
  algorithm: KeypairAlgorithm,
  message: string,
  context: CustodySignContext,
): Buffer {
  if (algorithm === "ed25519" && context === "request-body") {
    return crypto.createHash("sha256").update(message).digest()
  }
  return Buffer.from(message)
}

/**
 * Runs the raw signing primitive for `algorithm` over `data` with a PEM-encoded
 * private key — the SDK-internal counterpart to an external signer's `sign`.
 * Isolated here so the internal `privateKey` path and the external `signer` path
 * share one scheme (prepare → raw primitive → encode) and produce identical
 * signatures for the same message and context.
 *
 * - ed25519: returns the 64-byte raw signature.
 * - secp256k1/secp256r1: returns the DER-encoded ECDSA-SHA256 signature.
 */
export function signRawWithPrivateKey(
  algorithm: KeypairAlgorithm,
  privateKeyPem: string,
  data: Buffer,
): Buffer {
  if (algorithm === "ed25519") {
    return crypto.sign(null, data, privateKeyPem)
  }
  return crypto.sign(null, data, { key: privateKeyPem, dsaEncoding: "der" })
}

/**
 * Encodes a raw signature into the base64 form the server expects.
 *
 * - ed25519: the 64-byte raw signature is wrapped in Custody's DER-shaped
 *   envelope (`3044 0220 <r> 0220 <s>`) before base64 encoding.
 * - secp256k1/secp256r1: the DER-encoded ECDSA signature is base64 encoded.
 */
export function encodeSignature(algorithm: KeypairAlgorithm, rawSignature: Uint8Array): string {
  const buffer = Buffer.from(rawSignature)
  if (algorithm === "ed25519") {
    const hex = buffer.toString("hex")
    const r = hex.substring(0, 64)
    const s = hex.substring(64, 128)
    return Buffer.from(`30440220${r}0220${s}`, "hex").toString("base64")
  }
  return buffer.toString("base64")
}

/**
 * Validates the raw signature an external signer returned, before the SDK
 * encodes it. Throws a clear {@link CustodyError} naming the signer rather than
 * letting a malformed value fail opaquely server-side.
 */
export function assertValidRawSignature(
  algorithm: KeypairAlgorithm,
  rawSignature: unknown,
): asserts rawSignature is Uint8Array {
  if (!(rawSignature instanceof Uint8Array) || rawSignature.length === 0) {
    throw new CustodyError({
      reason: "External signer returned an invalid signature: expected a non-empty Uint8Array.",
    })
  }
  // ed25519 raw signatures are exactly 64 bytes (r||s); the SDK relies on this
  // to build the DER-shaped envelope.
  if (algorithm === "ed25519" && rawSignature.length !== 64) {
    throw new CustodyError({
      reason: `External signer returned a ${rawSignature.length}-byte ed25519 signature; expected 64 raw bytes (r||s).`,
    })
  }
}
