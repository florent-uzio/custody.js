import { describe, expect, it } from "vitest"
import { Secp256k1Service } from "./secp256k1.service"

describe("Secp256k1Service", () => {
  const service = new Secp256k1Service()

  it("should generate a valid key pair", () => {
    const keyPair = service.generate()
    expect(keyPair).toHaveProperty("privateKey")
    expect(keyPair).toHaveProperty("publicKey")
    expect(typeof keyPair.privateKey).toBe("string")
    expect(typeof keyPair.publicKey).toBe("string")
    expect(keyPair.privateKey).toMatch(/-----BEGIN EC PRIVATE KEY-----/)
    expect(keyPair.publicKey.length).toBeGreaterThan(0)
  })

  it("should sign a message and return a base64 signature", () => {
    const { privateKey } = service.generate()
    const message = "hello world"
    const signature = service.sign(privateKey, message)
    expect(typeof signature).toBe("string")
    // base64 regex
    expect(signature).toMatch(/^[A-Za-z0-9+/=]+$/)
    expect(signature.length).toBeGreaterThan(0)
  })

  it("should throw an error when signing with an invalid private key", () => {
    const invalidKey = "invalid-key"
    expect(() => service.sign(invalidKey, "test")).toThrowError()
  })
})
