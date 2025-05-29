import { generateKeyPairSync, sign } from "crypto"
import type { KeyPair, KeypairDefinition } from "./keypairs.types.js"

/**
 * Service for generating and signing with Ed25519 keypairs.
 */
export class Ed25519Service implements KeypairDefinition {
  /**
   * Generates a new Ed25519 key pair.
   * @returns {KeyPair} The generated key pair with PEM private key and Base64 DER public key.
   */
  generate(): KeyPair {
    // Generate Ed25519 key pair
    const { privateKey, publicKey } = generateKeyPairSync("ed25519")

    // Export private key in PEM format (PKCS#8)
    const privateKeyPem = privateKey
      .export({
        format: "pem",
        type: "pkcs8",
      })
      .toString()

    // Export public key in DER format (SPKI), then encode as Base64
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

  /**
   * Signs a message using the provided PEM-encoded Ed25519 private key.
   * @param {string} privateKeyPem - PEM-encoded private key.
   * @param {string} message - Message to sign.
   * @returns {string} Base64-encoded signature.
   */
  sign(privateKeyPem: string, message: string): string {
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

      // Sign the message with Ed25519
      // The returned signature is already in raw format (64 bytes)
      const signature = sign(null, messageBuffer, privateKeyPem)

      // Split compact signature into r and s (32 bytes each)
      const r = signature.subarray(0, 32)
      const s = signature.subarray(32)

      // DER-encode: 0x30 44 02 20 <r> 02 20 <s>
      const derSignature = Buffer.concat([
        Buffer.from([0x30, 0x44, 0x02, 0x20]),
        r,
        Buffer.from([0x02, 0x20]),
        s,
      ])

      // Return Base64-encoded signature
      return derSignature.toString("base64")
    } catch (error) {
      throw new Error("Failed to sign message", { cause: error })
    }
  }
}
