import { describe, expect, it } from "vitest"
import { Secp256r1Service } from "./secp256r1.service.js"

describe("Secp256r1Service", () => {
  const service = new Secp256r1Service()

  it("should generate a valid key pair", () => {
    const keypair = service.generate()

    expect(keypair.privateKey).toBeDefined()
    expect(keypair.publicKey).toBeDefined()
    expect(keypair.privateKey).toContain("-----BEGIN EC PRIVATE KEY-----")
    expect(keypair.privateKey).toContain("-----END EC PRIVATE KEY-----")
    expect(keypair.publicKey).toMatch(/^[A-Za-z0-9+/]+={0,2}$/) // Base64 format
  })

  it("should sign a message and return a base64 signature", () => {
    const keypair = service.generate()
    const message = '{"test": "data"}'
    const signature = service.sign(keypair.privateKey, message)

    expect(signature).toBeDefined()
    expect(signature).toMatch(/^[A-Za-z0-9+/]+={0,2}$/) // Base64 format
    expect(signature.length).toBeGreaterThan(0)
  })

  it("should throw an error when signing with an invalid private key", () => {
    const invalidPrivateKey = "invalid-key"
    const message = '{"test": "data"}'

    expect(() => {
      service.sign(invalidPrivateKey, message)
    }).toThrow("Failed to sign message with secp256r1")
  })

  it("should handle non-stringified object messages", () => {
    const keypair = service.generate()
    const message = "simple-uuid-message"
    const signature = service.sign(keypair.privateKey, message)

    expect(signature).toBeDefined()
    expect(signature).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
  })
})
