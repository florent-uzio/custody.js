import { beforeEach, describe, expect, it } from "vitest"
import { CustodyError } from "../../models/custody-error.js"
import { Ed25519Service } from "./ed25519.service.js"
import { Secp256k1Service } from "./secp256k1.service.js"

describe("Secp256k1Service", () => {
  const service = new Secp256k1Service()

  describe("generate", () => {
    it("should generate a valid key pair", () => {
      const keypair = service.generate()

      expect(keypair.privateKey).toBeDefined()
      expect(keypair.publicKey).toBeDefined()
      expect(keypair.privateKey).toContain("-----BEGIN EC PRIVATE KEY-----")
      expect(keypair.privateKey).toContain("-----END EC PRIVATE KEY-----")
      expect(keypair.publicKey).toMatch(/^[A-Za-z0-9+/]+={0,2}$/) // Base64 format
    })

    it("should generate different key pairs on each call", () => {
      const keyPair1 = service.generate()
      const keyPair2 = service.generate()

      expect(keyPair1.privateKey).not.toBe(keyPair2.privateKey)
      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey)
    })

    it("should generate PEM-formatted private key", () => {
      const { privateKey } = service.generate()
      expect(privateKey).toMatch(/-----BEGIN EC PRIVATE KEY-----/)
      expect(privateKey).toMatch(/-----END EC PRIVATE KEY-----/)
    })

    it("should generate base64-encoded public key", () => {
      const { publicKey } = service.generate()
      // Base64 regex
      expect(publicKey).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
      expect(publicKey.length).toBeGreaterThan(0)
    })
  })

  describe("sign", () => {
    let privateKey: string

    beforeEach(() => {
      privateKey = service.generate().privateKey
    })

    it("should sign a message and return a base64 signature", () => {
      const message = '{"test": "data"}'
      const signature = service.sign(privateKey, message)

      expect(signature).toBeDefined()
      expect(signature).toMatch(/^[A-Za-z0-9+/]+={0,2}$/) // Base64 format
      expect(signature.length).toBeGreaterThan(0)
    })

    it("should sign a stringified JSON object", () => {
      const message = '{"type":"test","data":"value"}'
      const signature = service.sign(privateKey, message)
      expect(typeof signature).toBe("string")
      expect(signature).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    })

    it("should sign a UUID string", () => {
      const uuidMessage = "550e8400-e29b-41d4-a716-446655440000"
      const signature = service.sign(privateKey, uuidMessage)
      expect(typeof signature).toBe("string")
      expect(signature).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    })

    it("should sign an empty string", () => {
      const signature = service.sign(privateKey, "")
      expect(typeof signature).toBe("string")
      expect(signature.length).toBeGreaterThan(0)
    })

    it("should produce different signatures for the same message (ECDSA is probabilistic)", () => {
      // ECDSA/secp256k1 uses randomness (nonce) during signing, so the same message
      // signed with the same key produces different signatures each time.
      // This is expected behavior and a security feature.
      const message = "test message"
      const signature1 = service.sign(privateKey, message)
      const signature2 = service.sign(privateKey, message)
      expect(signature1).not.toBe(signature2)
      // Both signatures should be valid base64 strings
      expect(signature1).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
      expect(signature2).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    })

    it("should produce different signatures for different messages", () => {
      const signature1 = service.sign(privateKey, "message 1")
      const signature2 = service.sign(privateKey, "message 2")
      expect(signature1).not.toBe(signature2)
    })

    it("should throw an error when message is not a string", () => {
      const testCases = [null, undefined, 123, {}, []]
      for (const invalidMessage of testCases) {
        expect(() => service.sign(privateKey, invalidMessage as any)).toThrow(
          "Message must be a string",
        )
      }
    })

    it("should throw an error when private key is not a string", () => {
      expect(() => service.sign(null as any, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded secp256k1 private key",
      )
      expect(() => service.sign(undefined as any, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded secp256k1 private key",
      )
      expect(() => service.sign(123 as any, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded secp256k1 private key",
      )
    })

    it("should throw an error when private key doesn't contain PEM header", () => {
      const invalidKey = "not-a-valid-pem-key"
      expect(() => service.sign(invalidKey, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded secp256k1 private key",
      )
    })

    it("should throw an error when private key is empty string", () => {
      expect(() => service.sign("", "message")).toThrow(
        "Invalid private key: Must be PEM-encoded secp256k1 private key",
      )
    })

    it("should throw CustodyError when private key has PEM header but is invalid", () => {
      const invalidKey = "-----BEGIN EC PRIVATE KEY-----\ninvalid\n-----END EC PRIVATE KEY-----"
      // Validation now catches malformed keys early
      expect(() => service.sign(invalidKey, "message")).toThrow(CustodyError)
      expect(() => service.sign(invalidKey, "message")).toThrow(
        "Invalid private key: Failed to parse PEM-encoded secp256k1 private key",
      )
    })

    it("should throw CustodyError when private key is wrong curve", () => {
      // Generate a valid Ed25519 key (different curve)
      const ed25519Service = new Ed25519Service()
      const wrongCurveKey = ed25519Service.generate().privateKey

      expect(() => service.sign(wrongCurveKey, "message")).toThrow(CustodyError)
      expect(() => service.sign(wrongCurveKey, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded secp256k1 private key",
      )
    })
  })
})
