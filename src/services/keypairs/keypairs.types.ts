export type KeypairDefinition = {
  generate: () => KeyPair
  sign: (privateKey: string, message: string) => string
}

export type KeyPair = {
  privateKey: string
  publicKey: string
}

export type KeypairAlgorithm = "secp256k1" | "secp256r1" | "ed25519"
