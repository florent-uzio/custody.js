export interface AuthRequest {
  signature: string
  challenge: string
  publicKey: string
}

export interface AuthResponse {
  access_token: string
  expiresIn: number // in seconds
}
