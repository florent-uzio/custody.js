// src/types/crypto.ts
export interface KeyPair {
  privateKeyPem: string // PEM formatted private key
  publicKeyBase64: string // Base64 encoded public key
}

export interface SignatureResult {
  signature: string // Base64 encoded signature
}
