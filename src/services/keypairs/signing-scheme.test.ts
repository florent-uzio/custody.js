import crypto, { sign as nodeSign } from "crypto"
import { describe, expect, it } from "vitest"
import { CustodyError } from "../../models/custody-error.js"
import { KeypairService } from "./keypair.service.js"
import type { KeypairAlgorithm } from "./keypairs.types.js"
import {
  assertValidRawSignature,
  encodeSignature,
  prepareSigningInput,
  type CustodySignContext,
} from "./signing-scheme.js"

/**
 * Runs the raw signing primitive for `algorithm` over `data` — i.e. what an
 * external signer / HSM would do. ed25519 returns the 64-byte raw signature;
 * ECDSA returns the DER-encoded signature.
 */
const rawPrimitive = (algorithm: KeypairAlgorithm, privateKeyPem: string, data: Buffer): Buffer =>
  algorithm === "ed25519"
    ? crypto.sign(null, data, privateKeyPem)
    : nodeSign(null, data, { key: privateKeyPem, dsaEncoding: "der" })

describe("signing-scheme", () => {
  const algorithms: KeypairAlgorithm[] = ["ed25519", "secp256k1", "secp256r1"]
  const requestBody = JSON.stringify({ b: 1, a: 2, nested: { z: true } })
  const challenge = "e004adfe-667c-415e-be33-ce3d9684e76b"

  describe("parity with KeypairService (correctness oracle)", () => {
    for (const algorithm of algorithms) {
      // ed25519 is deterministic → exact equality. ECDSA is randomized → verify
      // via the public key instead.
      it(`reproduces KeypairService output for ${algorithm}`, () => {
        const service = new KeypairService(algorithm)
        const { privateKey, publicKey } = service.generate()

        const cases: { message: string; context: CustodySignContext }[] = [
          { message: requestBody, context: "request-body" },
          { message: challenge, context: "auth-challenge" },
        ]

        for (const { message, context } of cases) {
          const data = prepareSigningInput(algorithm, message, context)
          const raw = rawPrimitive(algorithm, privateKey, data)
          assertValidRawSignature(algorithm, raw)
          const encoded = encodeSignature(algorithm, raw)

          if (algorithm === "ed25519") {
            expect(encoded).toBe(service.sign(privateKey, message))
          } else {
            // Verify the scheme-produced signature validates as ECDSA-SHA256/DER
            const pub = crypto.createPublicKey({
              key: Buffer.from(publicKey, "base64"),
              format: "der",
              type: "spki",
            })
            const ok = crypto.verify(
              null,
              Buffer.from(message),
              { key: pub, dsaEncoding: "der" },
              Buffer.from(encoded, "base64"),
            )
            expect(ok).toBe(true)
          }
        }
      })
    }
  })

  describe("prepareSigningInput", () => {
    it("SHA-256 hashes an ed25519 request body", () => {
      const expected = crypto.createHash("sha256").update(requestBody).digest()
      expect(prepareSigningInput("ed25519", requestBody, "request-body")).toEqual(expected)
    })

    it("uses raw bytes for an ed25519 auth challenge", () => {
      expect(prepareSigningInput("ed25519", challenge, "auth-challenge")).toEqual(
        Buffer.from(challenge),
      )
    })

    it("uses raw bytes for ECDSA regardless of context", () => {
      for (const context of ["request-body", "auth-challenge"] as const) {
        expect(prepareSigningInput("secp256k1", requestBody, context)).toEqual(
          Buffer.from(requestBody),
        )
      }
    })
  })

  describe("assertValidRawSignature", () => {
    it("throws on a non-Uint8Array", () => {
      expect(() => assertValidRawSignature("secp256k1", "not-bytes" as never)).toThrow(CustodyError)
    })

    it("throws on an empty signature", () => {
      expect(() => assertValidRawSignature("secp256k1", new Uint8Array(0))).toThrow(CustodyError)
    })

    it("throws on a non-64-byte ed25519 signature", () => {
      expect(() => assertValidRawSignature("ed25519", new Uint8Array(32))).toThrow(CustodyError)
    })

    it("accepts a 64-byte ed25519 signature", () => {
      expect(() => assertValidRawSignature("ed25519", new Uint8Array(64))).not.toThrow()
    })
  })
})
