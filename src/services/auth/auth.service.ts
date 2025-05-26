import axios, { AxiosInstance } from "axios"
import { AuthRequest, AuthResponse } from "./auth.service.types"

export class AuthService {
  private authClient: AxiosInstance
  // private baseUrl = "https://auth.metaco.8rey67.m3t4c0.services"
  private accessToken: string | null = null
  private tokenExpiration: number | null = null // timestamp in milliseconds
  private readonly TOKEN_VALIDITY = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

  constructor(private authBaseUrl: string) {
    this.authClient = axios.create({
      baseURL: this.authBaseUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  /**
   * Fetch a JWT token using the provided authentication data from Ripple Custody backend.
   * @param authData
   * @returns {Promise<string>} The JWT token.
   * @throws {Error} If authentication fails.
   */
  private async fetchToken(authData: AuthRequest): Promise<string> {
    const formData = new URLSearchParams()
    formData.append("grant_type", "password")
    formData.append("client_id", "customer_api")
    formData.append("signature", authData.signature)
    formData.append("challenge", authData.challenge)
    formData.append("public_key", authData.publicKey)

    const response = await this.authClient.post<AuthResponse>("/token", formData)
    this.accessToken = response.data.access_token

    // Set token expiration to 4 hours from now
    this.tokenExpiration = Date.now() + this.TOKEN_VALIDITY
    return this.accessToken
  }

  async getToken(authData: AuthRequest): Promise<string> {
    try {
      if (!this.accessToken || this.isTokenExpired()) {
        return await this.fetchToken(authData)
      }
      return this.accessToken
    } catch (error) {
      console.error("Authentication error:", error)
      throw new Error("Failed to obtain JWT token")
    }
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpiration) return true

    // Consider token expired 5 minutes before actual expiration for safety
    const bufferTime = 5 * 60 * 1000

    return Date.now() > this.tokenExpiration - bufferTime
  }

  getCurrentToken(): string | null {
    return this.accessToken
  }
}
