// export type AuthRequest = {
//   // signature: string
//   challenge: string
//   // publicKey: string
// } & Pick<KeyPair, "publicKey">

export type AuthFormData = {
  challenge: string
  publicKey: string
  signature: string
}

export interface AuthResponse {
  access_token: string
  expiresIn: number // in seconds
}

// export interface AuthCredentials {
//   privateKey?: string
//   publicKey?: string
// }

// export type AuthData = KeyPair & {
//   challenge?: string
//   // publicKey: string
//   // privateKey: string
// }
