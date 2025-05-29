import { generateKeyPairSync, sign } from "crypto"
import type { KeyPair, KeypairDefinition } from "./keypairs.types.js"

export class Ed25519Service implements KeypairDefinition {
  generate(): KeyPair {
    // Generate ED25519 key pair
    const { privateKey, publicKey } = generateKeyPairSync("ed25519")

    // Private key in PEM (equivalent to `openssl genpkey`)
    const privateKeyPem = privateKey
      .export({
        format: "pem",
        type: "pkcs8",
      })
      .toString()

    // Public key in DER, then Base64-encoded (equivalent to `openssl ... -outform DER | base64`)
    const publicKeyDer = publicKey.export({
      format: "der",
      type: "spki",
    })

    const publicKeyDerBase64 = publicKeyDer.toString("base64")

    return {
      privateKey: privateKeyPem,
      publicKey: publicKeyDerBase64,
    }
  }

  sign(privateKeyPem: string, message: string): string {
    console.log("privateKeyPem", privateKeyPem)
    try {
      // Validate inputs
      if (typeof message !== "string") {
        throw new Error("Message must be a string")
      }
      if (
        typeof privateKeyPem !== "string" ||
        !privateKeyPem.includes("-----BEGIN PRIVATE KEY-----")
      ) {
        throw new Error("Invalid private key: Must be PEM-encoded")
      }

      // Convert message to Buffer
      const messageBuffer = Buffer.from(message)

      // Sign the message with ED25519
      const signature = sign(null, messageBuffer, privateKeyPem)

      // DER-encode: 0x30 44 02 20 <R> 02 20 <S>
      const r = signature.subarray(0, 32)
      const s = signature.subarray(32)

      const derSignature = Buffer.concat([
        Buffer.from([0x30, 0x44, 0x02, 0x20]),
        r,
        Buffer.from([0x02, 0x20]),
        s,
      ])

      return derSignature.toString("base64")
    } catch (error) {
      throw new Error("Failed to sign message", { cause: error })
    }
  }
}
