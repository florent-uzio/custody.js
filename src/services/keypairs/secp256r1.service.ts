import { createPrivateKey, generateKeyPairSync, sign } from "crypto"
import { isString } from "../../helpers/index.js"
import { CustodyError } from "../../models/custody-error.js"
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
   * 1. Create a Buffer from the message
   * 2. Sign the message with secp256r1
   * 3. Return Base64-encoded DER signature
   *
   * @param {string} privateKeyPem - PEM-encoded private key.
   * @param {string} message - Message to sign (should be canonicalized JSON for a request).
   * @returns {string} Base64-encoded DER signature.
   */
  sign(privateKeyPem: string, message: string): string {
    // Validate inputs
    if (!isString(message)) {
      throw new CustodyError({ reason: "Message must be a string" })
    }
    if (!isString(privateKeyPem)) {
      throw new CustodyError({
        reason: "Invalid private key: Must be PEM-encoded secp256r1 private key",
      })
    }

    // Validate PEM structure: must have both BEGIN and END markers
    const hasBeginMarker = privateKeyPem.includes("-----BEGIN EC PRIVATE KEY-----")
    const hasEndMarker = privateKeyPem.includes("-----END EC PRIVATE KEY-----")
    if (!hasBeginMarker || !hasEndMarker) {
      throw new CustodyError({
        reason: "Invalid private key: Must be PEM-encoded secp256r1 private key",
      })
    }

    // Validate that the key can be parsed (catches malformed keys early)
    try {
      const key = createPrivateKey(privateKeyPem)
      // Verify it's actually an EC key
      if (key.asymmetricKeyType !== "ec") {
        throw new CustodyError({
          reason: "Invalid private key: Must be a secp256r1 private key",
        })
      }
      // Verify it's secp256r1 curve (prime256v1) (if details are available)
      const keyDetails = key.asymmetricKeyDetails
      if (keyDetails && keyDetails.namedCurve !== "prime256v1") {
        throw new CustodyError({
          reason: "Invalid private key: Must be a secp256r1 private key",
        })
      }
    } catch (error) {
      if (error instanceof CustodyError) {
        throw error
      }
      throw new CustodyError({
        reason: "Invalid private key: Failed to parse PEM-encoded secp256r1 private key",
      })
    }

    // Step 1: Create a Buffer from the message
    const messageBuffer = Buffer.from(message)

    // Step 2: Sign the message using secp256r1
    const signature = sign(null, messageBuffer, {
      key: privateKeyPem,
      dsaEncoding: "der",
    })

    // Step 3: Return Base64-encoded DER signature
    return signature.toString("base64")
  }
}
