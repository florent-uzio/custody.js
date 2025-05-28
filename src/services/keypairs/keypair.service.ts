import { KeypairAlgorithm, type KeyPair, type KeypairDefinition } from "./keypairs.types.js"
import { Secp256k1Service } from "./secp256k1.service.js"

/**
 * KeypairService provides a unified interface for keypair operations (generation, signing)
 * and supports multiple algorithms (currently only secp256k1).
 */
export class KeypairService {
  // Maps supported algorithms to their provider implementations
  private providers: Record<KeypairAlgorithm, KeypairDefinition>

  constructor(private readonly algorithm: KeypairAlgorithm) {
    // Initialize providers for each supported algorithm
    // @ts-expect-error TODO: Implement other algorithms when needed
    this.providers = {
      [KeypairAlgorithm.SECP256K1]: new Secp256k1Service(),
      //   [CryptoAlgorithm.SECP256R1]: new Secp256r1Service(),
      //   [CryptoAlgorithm.ED25519]: new Ed25519Service(),
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
    if (!provider) throw new Error(`Unsupported algorithm: ${this.algorithm}`)
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
    if (!provider) throw new Error(`Unsupported algorithm: ${this.algorithm}`)
    return provider.sign(privateKeyPem, message)
  }
}
