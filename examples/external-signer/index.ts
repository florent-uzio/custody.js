import crypto from "crypto"
import { type CustodySigner, RippleCustody, toSignablePayload } from "@florent-uzio/custody"

/**
 * Example: Authenticate with an external signer instead of a raw private key
 *
 * Provide a `signer` instead of `privateKey` so the private key never enters the
 * SDK — it can live in an HSM, a KMS, or a separate signing service.
 *
 * Contract: the SDK owns canonicalization, hashing, and signature encoding. Your
 * signer runs ONLY the raw cryptographic primitive for its `algorithm` over the
 * `data` bytes the SDK hands it, and returns the raw signature bytes:
 *
 *   - ed25519: return the 64-byte raw Ed25519 signature over `data`
 *     (`data` is already SHA-256 hashed for request bodies — do NOT hash again).
 *   - secp256k1 / secp256r1: run ECDSA with SHA-256 over `data` and return the
 *     DER-encoded signature.
 *
 * The `context` ("auth-challenge" | "request-body") is provided so HSM/KMS policy
 * engines can gate per-operation. It may be async.
 *
 * This flows through every SDK call, including the XRPL wrappers: proposing an
 * intent POSTs a request envelope that the SDK signs via your `signer`.
 */

/**
 * A signer that keeps the ECDSA private key out of the SDK.
 *
 * ⚠️ This demo uses Node's crypto over a key read from the environment purely to
 * be runnable. In production, replace the body of `sign` with a call to your
 * HSM/KMS (e.g. `await kms.sign(...)`) so the key never touches this process.
 * Reproduce exactly the raw primitive documented above for your algorithm.
 */
const buildSigner = (): CustodySigner => ({
  algorithm: "secp256k1",
  sign: async ({ data }) => {
    // Raw primitive: ECDSA-SHA256 over `data`, DER-encoded.
    return crypto.sign(null, data, {
      key: process.env.PRIVATE_KEY ?? "",
      dsaEncoding: "der",
    })
  },
})

const useExternalSigner = async () => {
  try {
    // Note: `signer` replaces `privateKey`. Provide exactly one of the two.
    // `publicKey` is still required — Custody uses it to verify your signatures.
    const custody = new RippleCustody({
      apiUrl: "https://custody-api-url",
      authUrl: "https://custody-auth-url/token",
      publicKey: process.env.PUBLIC_KEY ?? "",
      signer: buildSigner(),
    })

    // Every namespace call is signed by your `signer`, including XRPL intents.
    const me = await custody.users.me()
    const domain = me.domains[0]
    if (!domain) throw new Error("No domain found for this user")
    const domainId = domain.id

    const intentId = "e004adfe-667c-415e-be33-ce3d9684e76b"

    await custody.xrpl.proposeIntent(
      {
        Account: "r...", // Your Ripple Custody account address (the sender)
        operation: {
          type: "Payment",
          destination: { address: "r...", type: "Address" },
          amount: "20", // drops
        },
      },
      { requestId: intentId },
    )

    const intent = await custody.intents.getAndWait({ domainId, intentId })
    console.dir(intent, { depth: null })

    // Optional: inspect the canonical JSON the SDK signs for a request body.
    // (This is the pre-hash input, not the final signed bytes — see the docs.)
    const payload = toSignablePayload({ example: "request-body" })
    console.log("Canonical signable payload:", payload)
  } catch (error) {
    console.log(error)
  }
}
