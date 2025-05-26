export interface KeypairProvider {
  generate: () => KeyPair
  sign: (privateKeyPem: string, message: string) => string
}

// src/types/crypto.ts
export interface KeyPair {
  privateKey: string
  publicKey: string
}
