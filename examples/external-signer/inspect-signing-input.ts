import { canonicalizeRequest, prepareSigningInput } from "@florent-uzio/custody"

/**
 * Example: Inspect the exact bytes Ripple Custody signs, without making a
 * network call
 *
 * `canonicalizeRequest` and `prepareSigningInput` are the same two steps the
 * SDK runs internally (for both the `privateKey` and `signer` paths) before
 * handing bytes to the raw signing primitive. Useful for:
 *
 *   - Debugging a signature mismatch against the server
 *   - Reproducing the signing input in another language/process to verify an
 *     external signer (HSM/KMS) implementation before wiring it up for real
 *   - Understanding what a `CustodySigner.sign` call actually receives
 *
 * This does not sign or send anything — it only reproduces the pre-signing
 * bytes for inspection.
 */
const inspectSigningInput = () => {
  // Any request body you'd otherwise pass to a namespace method.
  const request = {
    Account: "r...",
    operation: {
      type: "Payment",
      destination: { address: "r...", type: "Address" },
      amount: "20",
    },
  }

  // Step 1: the canonical JSON string the SDK hashes/signs for a request body.
  const canonical = canonicalizeRequest(request)
  console.log("Canonical JSON:", canonical)

  // Step 2: the exact bytes the raw signing primitive runs over, per algorithm.
  // For ed25519 + "request-body" this is the SHA-256 hash of `canonical`; for
  // secp256k1/secp256r1, or for "auth-challenge", it's the raw UTF-8 bytes.
  const signingInput = prepareSigningInput("ed25519", canonical, "request-body")
  console.log("Signing input (hex):", signingInput.toString("hex"))

  // An auth challenge is a plain string (not a JSON request body), so it skips
  // canonicalizeRequest and goes straight to prepareSigningInput.
  const challenge = "example-auth-challenge-string"
  const challengeInput = prepareSigningInput("ed25519", challenge, "auth-challenge")
  console.log("Auth challenge signing input (hex):", challengeInput.toString("hex"))
}

inspectSigningInput()
