export type AuthFormData = {
  challenge: string
  publicKey: string
  signature: string
}

export interface AuthResponse {
  access_token: string
}
