import { generateKeyPairSync } from "crypto"
import { describe, expect, it } from "vitest"
import { compressPublicKey } from "./xrpl.crypto.js"

type Vector = {
  /** Base64-encoded SPKI/DER public key, as passed to compressPublicKey. */
  der: string
  /** Uppercased hex of the JWK `x` coordinate (32 bytes). */
  xHex: string
  /** Whether the `y` coordinate is even (drives the "02"/"03" prefix). */
  even: boolean
}

/**
 * Generates a secp256k1 keypair and derives the values compressPublicKey works
 * from: the SPKI/DER base64 input, the `x` coordinate hex, and the parity of
 * `y` (computed the same way the function does — via JWK export).
 */
function makeVector(): Vector {
  const { publicKey } = generateKeyPairSync("ec", { namedCurve: "secp256k1" })
  const der = publicKey.export({ format: "der", type: "spki" }).toString("base64")
  const jwk = publicKey.export({ format: "jwk" })
  const x = Buffer.from(jwk.x!, "base64url")
  const y = Buffer.from(jwk.y!, "base64url")
  return {
    der,
    xHex: x.toString("hex").toUpperCase(),
    even: y[y.length - 1]! % 2 === 0,
  }
}

/**
 * Loops (bounded) until it has one even-`y` and one odd-`y` key so both prefix
 * branches are exercised deterministically. secp256k1 y-parity is ~50/50, so a
 * handful of attempts is overwhelmingly enough; 32 keeps flakiness negligible.
 */
function makeEvenAndOddVectors(): { even: Vector; odd: Vector } {
  let even: Vector | undefined
  let odd: Vector | undefined
  for (let i = 0; i < 32 && (!even || !odd); i++) {
    const v = makeVector()
    if (v.even) even ??= v
    else odd ??= v
  }
  if (!even || !odd) {
    throw new Error("Failed to generate both even and odd parity keys in 32 attempts")
  }
  return { even, odd }
}

describe("compressPublicKey", () => {
  const { even, odd } = makeEvenAndOddVectors()

  it("returns a 33-byte compressed key as uppercase hex with a 02/03 prefix", () => {
    expect(compressPublicKey(even.der)).toMatch(/^0[23][0-9A-F]{64}$/)
    expect(compressPublicKey(odd.der)).toMatch(/^0[23][0-9A-F]{64}$/)
  })

  it('uses the "02" prefix for an even-y key', () => {
    const result = compressPublicKey(even.der)
    expect(result.slice(0, 2)).toBe("02")
    expect(result.slice(2)).toBe(even.xHex)
  })

  it('uses the "03" prefix for an odd-y key', () => {
    const result = compressPublicKey(odd.der)
    expect(result.slice(0, 2)).toBe("03")
    expect(result.slice(2)).toBe(odd.xHex)
  })
})
