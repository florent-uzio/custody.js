import { generateKeyPairSync } from "node:crypto"
import { describe, expect, it } from "vitest"
import { CustodyError } from "./models/index.js"
import { RippleCustody } from "./ripple-custody.js"

const { privateKey, publicKey } = generateKeyPairSync("ed25519", {
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
})

const creds = {
  apiUrl: "https://api.example.test",
  authUrl: "https://auth.example.test",
  privateKey,
  publicKey,
}

describe("RippleCustody apiVersion option", () => {
  it("throws at construction for an unrecognized apiVersion, listing known versions", () => {
    let caught: unknown
    try {
      new RippleCustody({ ...creds, apiVersion: "9.9.9" })
    } catch (e) {
      caught = e
    }

    expect(caught).toBeInstanceOf(CustodyError)
    const message = (caught as Error).message
    expect(message).toContain("9.9.9")
    expect(message).toContain("1.35.0")
  })

  it("constructs with a known apiVersion", () => {
    expect(() => new RippleCustody({ ...creds, apiVersion: "1.35.0" })).not.toThrow()
  })

  it("constructs with no apiVersion (gating disabled, pass-through)", () => {
    expect(() => new RippleCustody({ ...creds })).not.toThrow()
  })
})
