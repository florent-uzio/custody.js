import { generateKeyPairSync, sign } from "crypto"
import type { KeyPair, KeypairDefinition } from "./keypairs.types.js"

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
      throw new Error("Failed to generate key pair")
    }
  }

  /**
   * Signs a message with a secp256k1 private key
   * @param privateKeyPem Private key in PEM format
   * @param message Message to sign
   * @returns {string} The base64 encoded signature
   */
  sign(privateKeyPem: string, message: string): string {
    try {
      const signature = sign(null, Buffer.from(message), {
        key: privateKeyPem,
        dsaEncoding: "der",
      })

      return signature.toString("base64")
    } catch (error) {
      throw new Error("Failed to sign message")
    }
  }
}
