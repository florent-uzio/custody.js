import { generateKeyPairSync, sign } from "crypto"
import { isString } from "../../helpers/index.js"
import type { KeyPair, KeypairDefinition } from "./keypairs.types.js"

/**
 * Service for generating and signing with secp256r1 keypairs.
 */
export class Secp256r1Service implements KeypairDefinition {
  /**
   * Generates a secp256r1 key pair
   * @returns {KeyPair} Object containing private key in PEM format and public key in base64
   */
  generate(): KeyPair {
    try {
      const { privateKey, publicKey } = generateKeyPairSync("ec", {
        namedCurve: "prime256v1",
        publicKeyEncoding: {
          type: "spki",
          format: "der",
        },
        privateKeyEncoding: {
          type: "sec1",
          format: "pem",
        },
      })

      // Encode the DER buffer to base64
      const publicKeyDerBase64 = publicKey.toString("base64")

      return {
        privateKey: privateKey,
        publicKey: publicKeyDerBase64,
      }
    } catch (error) {
      throw new Error("Failed to generate secp256r1 key pair", { cause: error })
    }
  }

  /**
   * Signs a message using the provided PEM-encoded secp256r1 private key.
   * This implementation follows the pattern:
   * 1. Create SHA256 hash of canonicalized JSON (if applicable)
   * 2. Sign the hash with secp256r1
   * 3. Return DER-encoded, Base64-formatted signature
   *
   * @param {string} privateKeyPem - PEM-encoded private key.
   * @param {string} message - Message to sign (should be canonicalized JSON).
   * @returns {string} Base64-encoded DER signature.
   */
  sign(privateKeyPem: string, message: string): string {
    try {
      // Validate inputs
      if (!isString(message)) {
        throw new Error("Message must be a string")
      }
      if (!isString(privateKeyPem) || !privateKeyPem.includes("-----BEGIN EC PRIVATE KEY-----")) {
        throw new Error("Invalid private key: Must be PEM-encoded secp256r1 private key")
      }

      // Step 1: Create a Buffer from the message (already a string)
      const messageHash = Buffer.from(message)

      // Step 2: Sign the hash using secp256r1
      const signature = sign(null, messageHash, {
        key: privateKeyPem,
        dsaEncoding: "der",
      })

      // Step 3: Return Base64-encoded DER signature
      return signature.toString("base64")
    } catch (error) {
      throw new Error("Failed to sign message with secp256r1", { cause: error })
    }
  }
}
