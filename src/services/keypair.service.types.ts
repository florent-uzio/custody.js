// src/types/crypto.ts
export interface KeyPair {
  privateKey: string
  publicKey: string
}

export interface SignatureResult {
  signature: string // Base64 encoded signature
}
