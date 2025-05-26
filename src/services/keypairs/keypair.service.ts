// src/services/crypto/crypto.service.ts
import { KeyPair, KeypairAlgorithm, KeypairDefinition } from "./keypairs.types"
import { Secp256k1Service } from "./secp256k1.service"

export class KeypairService {
  private providers: Record<KeypairAlgorithm, KeypairDefinition>

  constructor(private algorithm: KeypairAlgorithm = KeypairAlgorithm.SECP256K1) {
    // @ts-expect-error to implement
    this.providers = {
      [KeypairAlgorithm.SECP256K1]: new Secp256k1Service(),
      //   [CryptoAlgorithm.SECP256R1]: new Secp256r1Service(),
      //   [CryptoAlgorithm.ED25519]: new Ed25519Service(),
    }
  }

  generate(algorithm: KeypairAlgorithm): KeyPair {
    const provider = this.providers[algorithm]
    if (!provider) throw new Error(`Unsupported algorithm: ${algorithm}`)
    return provider.generate()
  }

  sign(privateKeyPem: string, message: string): string {
    const provider = this.providers[this.algorithm]
    if (!provider) throw new Error(`Unsupported algorithm: ${this.algorithm}`)
    return provider.sign(privateKeyPem, message)
  }
}
