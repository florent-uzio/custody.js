import { isString } from "../../helpers/index.js"
import { CustodyError } from "../../models/custody-error.js"
import { Ed25519Service } from "./ed25519.service.js"
import { type KeyPair, type KeypairAlgorithm, type KeypairDefinition } from "./keypairs.types.js"
import { Secp256k1Service } from "./secp256k1.service.js"
import { Secp256r1Service } from "./secp256r1.service.js"

/**
 * KeypairService provides a unified interface for keypair operations (generation, signing)
 * and supports multiple algorithms (currently only secp256k1).
 */
export class KeypairService {
  // Maps supported algorithms to their provider implementations
  private providers: Record<KeypairAlgorithm, KeypairDefinition>

  constructor(private readonly algorithm: KeypairAlgorithm) {
    // Initialize providers for each supported algorithm
    this.providers = {
      ["secp256k1"]: new Secp256k1Service(),
      ["ed25519"]: new Ed25519Service(),
      ["secp256r1"]: new Secp256r1Service(),
    }
  }

  /**
   * Generates a key pair using the selected algorithm.
   * For Ripple Custody, the generated key pair uses the correct formats:
   *   - Private key: PEM format
   *   - Public key: base64 DER format
   * @returns {KeyPair} The generated key pair.
   */
  generate(): KeyPair {
    const provider = this.providers[this.algorithm]
    if (!provider) throw new CustodyError({ reason: `Unsupported algorithm: ${this.algorithm}` })
    return provider.generate()
  }

  /**
   * Signs a message using the defined algorithm and provided private key.
   * @param privateKeyPem - The private key in PEM format.
   * @param message - The message to sign.
   * @returns {string} The base64-encoded signature.
   */
  sign(privateKeyPem: string, message: string): string {
    const provider = this.providers[this.algorithm]
    if (!provider) throw new CustodyError({ reason: `Unsupported algorithm: ${this.algorithm}` })
    return provider.sign(privateKeyPem, message)
  }

  static detectKeyType(privateKey: Buffer | string): KeypairAlgorithm | "unknown" {
    let hex: string

    if (isString(privateKey)) {
      // Strip PEM headers
      const b64 = privateKey.replace(/-----(BEGIN|END)[\s\S]+?-----/g, "").replace(/\s+/g, "")
      const buf = Buffer.from(b64, "base64")
      hex = buf.toString("hex")
    } else {
      hex = privateKey.toString("hex")
    }

    if (hex.includes("2b6570")) return "ed25519" // OID 1.3.101.112
    if (hex.includes("2b8104000a")) return "secp256k1" // OID 1.3.132.0.10
    if (hex.includes("2a8648ce3d030107")) return "secp256r1" // OID 1.2.840.10045.3.1.7

    return "unknown"
  }
}
