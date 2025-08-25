import { generateKeyPairSync, sign } from "crypto"
import { isString } from "../../helpers/index.js"
import type { KeyPair, KeypairDefinition } from "./keypairs.types.js"

/**
 * Service for generating and signing with secp256k1 keypairs.
 */
export class Secp256k1Service implements KeypairDefinition {
  /**
   * Generates a secp256k1 key pair
   * @returns {KeyPair} Object containing private key in PEM format and public key in base64
   */
  generate(): KeyPair {
    try {
      const { privateKey, publicKey } = generateKeyPairSync("ec", {
        namedCurve: "secp256k1",
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
      throw new Error("Failed to generate secp256k1 key pair", { cause: error })
    }
  }

  /**
   * Signs a message using the provided PEM-encoded secp256k1 private key.
   * This implementation follows the pattern:
   * 1. Create a Buffer from the message
   * 2. Sign the message with secp256k1
   * 3. Return Base64-encoded DER signature
   *
   * @param {string} privateKeyPem - PEM-encoded private key.
   * @param {string} message - Message to sign (should be canonicalized JSON for a request).
   * @returns {string} Base64-encoded DER signature.
   */
  sign(privateKeyPem: string, message: string): string {
    try {
      // Validate inputs
      if (!isString(message)) {
        throw new Error("Message must be a string")
      }
      if (!isString(privateKeyPem) || !privateKeyPem.includes("-----BEGIN EC PRIVATE KEY-----")) {
        throw new Error("Invalid private key: Must be PEM-encoded secp256k1 private key")
      }

      // Step 1: Create a Buffer from the message
      const messageBuffer = Buffer.from(message)

      // Step 2: Sign the message using secp256k1
      const signature = sign(null, messageBuffer, {
        key: privateKeyPem,
        dsaEncoding: "der",
      })

      // Step 3: Return Base64-encoded DER signature
      return signature.toString("base64")
    } catch (error) {
      throw new Error("Failed to sign message with secp256k1", { cause: error })
    }
  }
}
