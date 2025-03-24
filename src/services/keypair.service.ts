// src/services/CryptoService.ts
import { generateKeyPairSync, sign } from "crypto"
import { KeyPair, SignatureResult } from "./keypair.service.types"

export class CryptoService {
  /**
   * Generates a secp256k1 key pair
   * @returns {KeyPair} Object containing private key in PEM format and public key in base64
   */
  generateKeyPair(): KeyPair {
    try {
      const { privateKey, publicKey } = generateKeyPairSync("ec", {
        namedCurve: "secp256k1",
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      })

      const publicKeyBase64 = Buffer.from(
        publicKey
          .replace("-----BEGIN PUBLIC KEY-----", "")
          .replace("-----END PUBLIC KEY-----", "")
          .replace(/\n/g, ""),
      ).toString("base64")

      return {
        privateKeyPem: privateKey,
        publicKeyBase64: publicKeyBase64,
      }
    } catch (error) {
      console.error("Key pair generation error:", error)
      throw new Error("Failed to generate key pair")
    }
  }

  /**
   * Signs a message with a secp256k1 private key
   * @param privateKeyPem Private key in PEM format
   * @param message Message to sign
   * @returns {SignatureResult} Object containing the base64 encoded signature
   */
  signMessage(privateKeyPem: string, message: string): SignatureResult {
    try {
      const signature = sign(null, Buffer.from(message), {
        key: privateKeyPem,
        dsaEncoding: "der",
      })

      return {
        signature: signature.toString("base64"),
      }
    } catch (error) {
      console.error("Signing error:", error)
      throw new Error("Failed to sign message")
    }
  }
}
