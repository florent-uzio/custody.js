import crypto, { generateKeyPairSync } from "crypto"
import { isString, isStringifiedObject } from "../../helpers/index.js"
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
   * This implementation follows the Ripple Custody documentation exactly:
   * 1. Create SHA256 hash of canonicalized JSON
   * 2. Sign the hash with Ed25519
   * 3. Format as DER signature
   * 4. Base64 encode
   *
   * @param {string} privateKeyPem - PEM-encoded private key.
   * @param {string} message - Message to sign (should be canonicalized JSON).
   * @returns {string} Base64-encoded signature.
   */
  sign(privateKeyPem: string, message: string): string {
    try {
      // Validate inputs
      if (!isString(message)) {
        throw new Error("Message must be a string")
      }
      if (!isString(privateKeyPem) || !privateKeyPem.includes("-----BEGIN PRIVATE KEY-----")) {
        throw new Error("Invalid private key: Must be PEM-encoded")
      }

      // Following the documentation:
      // https://docs.ripple.com/products/custody/resources/openssl-examples#sign-a-payload-for-intent-submission
      let messageHash: Buffer

      if (isStringifiedObject(message)) {
        // Step 1а: Create SHA256 hash of the message (canonicalized JSON)
        // This matches: cat v0_CreateAccount_Sorted.json | sha256sum | xxd -r -p > ${tmp}
        messageHash = crypto.createHash("sha256").update(message).digest()
      } else {
        // Step 1b: Use the message as is if it's a UUID (typically for JWT)
        messageHash = Buffer.from(message)
      }

      // Step 2: Sign the hash using Ed25519
      // This matches: openssl pkeyutl -sign -inkey privateKey.pem -rawin -in ${tmp}
      const rawSignature = crypto.sign(null, messageHash, privateKeyPem)

      // Step 3: Convert to hex format (matches hexdump -v -e '/1 "%02x"')
      const hexSignature = rawSignature.toString("hex")

      // Step 4: Apply the DER encoding transformation from the documentation
      // This matches: sed 's/\(.\{64\}\)\(.\{64\}\)/30440220\10220\2/g'
      // The pattern splits the 128-character hex string into two 64-character parts
      // and wraps them in DER format: 0x30 44 02 20 <r> 02 20 <s>
      const r = hexSignature.substring(0, 64) // First 64 chars (32 bytes)
      const s = hexSignature.substring(64, 128) // Second 64 chars (32 bytes)

      // Create DER format: 0x30 44 02 20 <r> 02 20 <s>
      const derHex = `30440220${r}0220${s}`

      // Step 5: Convert hex back to binary (matches xxd -r -p)
      const derSignature = Buffer.from(derHex, "hex")

      // Step 6: Base64 encode (matches base64 -w0)
      return derSignature.toString("base64")
    } catch (error) {
      throw new Error("Failed to sign message", { cause: error })
    }
  }
}
