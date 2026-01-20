import { beforeEach, describe, expect, it } from "vitest"
import { CustodyError } from "../../models/custody-error.js"
import { Ed25519Service } from "./ed25519.service"

describe("Ed25519Service", () => {
  const service = new Ed25519Service()

  describe("generate", () => {
    it("should generate a valid key pair", () => {
      const keyPair = service.generate()
      expect(keyPair).toHaveProperty("privateKey")
      expect(keyPair).toHaveProperty("publicKey")
      expect(typeof keyPair.privateKey).toBe("string")
      expect(typeof keyPair.publicKey).toBe("string")
      expect(keyPair.privateKey).toMatch(/-----BEGIN PRIVATE KEY-----/)
      expect(keyPair.publicKey.length).toBeGreaterThan(0)
    })

    it("should generate different key pairs on each call", () => {
      const keyPair1 = service.generate()
      const keyPair2 = service.generate()

      expect(keyPair1.privateKey).not.toBe(keyPair2.privateKey)
      expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey)
    })

    it("should generate PEM-formatted private key", () => {
      const { privateKey } = service.generate()
      expect(privateKey).toMatch(/-----BEGIN PRIVATE KEY-----/)
      expect(privateKey).toMatch(/-----END PRIVATE KEY-----/)
    })

    it("should generate base64-encoded public key", () => {
      const { publicKey } = service.generate()
      // Base64 regex
      expect(publicKey).toMatch(/^[A-Za-z0-9+/=]+$/)
      expect(publicKey.length).toBeGreaterThan(0)
    })
  })

  describe("sign", () => {
    let privateKey: string

    beforeEach(() => {
      privateKey = service.generate().privateKey
    })

    it("should sign a message and return a base64 signature", () => {
      const message = "hello world"
      const signature = service.sign(privateKey, message)
      expect(typeof signature).toBe("string")
      // base64 regex
      expect(signature).toMatch(/^[A-Za-z0-9+/=]+$/)
      expect(signature.length).toBeGreaterThan(0)
    })

    it("should sign a stringified JSON object (canonicalized JSON path)", () => {
      const message = '{"type":"test","data":"value"}'
      const signature = service.sign(privateKey, message)
      expect(typeof signature).toBe("string")
      expect(signature).toMatch(/^[A-Za-z0-9+/=]+$/)
    })

    it("should sign a UUID string (non-JSON path)", () => {
      const uuidMessage = "550e8400-e29b-41d4-a716-446655440000"
      const signature = service.sign(privateKey, uuidMessage)
      expect(typeof signature).toBe("string")
      expect(signature).toMatch(/^[A-Za-z0-9+/=]+$/)
    })

    it("should sign an empty string", () => {
      const signature = service.sign(privateKey, "")
      expect(typeof signature).toBe("string")
      expect(signature.length).toBeGreaterThan(0)
    })

    it("should produce consistent signatures for the same message", () => {
      const message = "test message"
      const signature1 = service.sign(privateKey, message)
      const signature2 = service.sign(privateKey, message)
      expect(signature1).toBe(signature2)
    })

    it("should produce different signatures for different messages", () => {
      const signature1 = service.sign(privateKey, "message 1")
      const signature2 = service.sign(privateKey, "message 2")
      expect(signature1).not.toBe(signature2)
    })

    it("should throw CustodyError when message is not a string", () => {
      const testCases = [null, undefined, 123, {}, []]
      for (const invalidMessage of testCases) {
        expect(() => service.sign(privateKey, invalidMessage as any)).toThrow(CustodyError)
        expect(() => service.sign(privateKey, invalidMessage as any)).toThrow(
          "Message must be a string",
        )
      }
    })

    it("should throw CustodyError when private key is not a string", () => {
      expect(() => service.sign(null as any, "message")).toThrow(CustodyError)
      expect(() => service.sign(null as any, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded",
      )
      expect(() => service.sign(undefined as any, "message")).toThrow(CustodyError)
      expect(() => service.sign(undefined as any, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded",
      )
      expect(() => service.sign(123 as any, "message")).toThrow(CustodyError)
      expect(() => service.sign(123 as any, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded",
      )
    })

    it("should throw CustodyError when private key doesn't contain PEM header", () => {
      const invalidKey = "not-a-valid-pem-key"
      expect(() => service.sign(invalidKey, "message")).toThrow(CustodyError)
      expect(() => service.sign(invalidKey, "message")).toThrow(
        "Invalid private key: Must be PEM-encoded",
      )
    })

    it("should throw CustodyError when private key is empty string", () => {
      expect(() => service.sign("", "message")).toThrow(CustodyError)
      expect(() => service.sign("", "message")).toThrow("Invalid private key: Must be PEM-encoded")
    })

    it("should throw an error when private key has PEM header but is invalid", () => {
      const invalidKey = "-----BEGIN PRIVATE KEY-----\ninvalid\n-----END PRIVATE KEY-----"
      // Crypto will throw its own error about invalid key format
      expect(() => service.sign(invalidKey, "message")).toThrow()
    })
  })
})
