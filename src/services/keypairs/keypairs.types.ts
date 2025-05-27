export type KeypairDefinition = {
  generate: () => KeyPair
  sign: (privateKey: string, message: string) => string
}

export type KeyPair = {
  privateKey: string
  publicKey: string
}

export enum KeypairAlgorithm {
  SECP256K1 = "secp256k1",
  SECP256R1 = "secp256r1",
  ED25519 = "ed25519",
}
