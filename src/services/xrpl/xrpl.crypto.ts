import { createPublicKey } from "crypto"

/**
 * Compresses a base64-encoded SPKI/DER secp256k1 public key to its compressed hex form.
 * Uses Node.js built-in crypto via JWK export to extract the raw EC point coordinates.
 */
export function compressPublicKey(base64PublicKey: string): string {
  const publicKey = createPublicKey({
    key: Buffer.from(base64PublicKey, "base64"),
    format: "der",
    type: "spki",
  })

  const jwk = publicKey.export({ format: "jwk" })
  const x = Buffer.from(jwk.x!, "base64url")
  const y = Buffer.from(jwk.y!, "base64url")
  const lastByte = y[y.length - 1]!
  const prefix = lastByte % 2 === 0 ? "02" : "03"
  return (prefix + x.toString("hex")).toUpperCase()
}
