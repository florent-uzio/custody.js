import axios, { type AxiosInstance } from "axios"
import { getHostname } from "../../helpers/index.js"
import { type AuthFormData, type AuthResponse } from "./auth.service.types.js"

export class AuthService {
  private authClient: AxiosInstance
  private accessToken: string = ""
  private tokenExpiration: number | null = null // timestamp in milliseconds
  private readonly TOKEN_VALIDITY = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

  constructor(private readonly baseUrl: string) {
    // Initialize Axios client for auth requests
    this.authClient = axios.create({
      baseURL: `https://auth.${getHostname(this.baseUrl)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  /**
   * Fetch a JWT token using the provided authentication data from Ripple Custody backend.
   * @param authData - The authentication data (challenge, publicKey, signature)
   * @param signature - The signature for the challenge
   * @returns {Promise<string>} The JWT token.
   * @throws {Error} If authentication fails.
   */
  private async fetchToken(authData: AuthFormData): Promise<string> {
    // Prepare form data for token request
    const formData = new URLSearchParams()
    formData.append("grant_type", "password")
    formData.append("client_id", "customer_api")
    formData.append("signature", authData.signature)
    formData.append("challenge", authData.challenge)
    formData.append("public_key", authData.publicKey)

    // Send POST request to obtain token
    const response = await this.authClient.post<AuthResponse>("/token", formData)
    this.accessToken = response.data.access_token

    // Set token expiration to 4 hours from now
    this.tokenExpiration = Date.now() + this.TOKEN_VALIDITY
    return this.accessToken
  }

  /**
   * Get a valid JWT token, refreshing if expired or missing.
   */
  async getToken(authData: AuthFormData): Promise<string> {
    if (!this.accessToken || this.isTokenExpired()) {
      return this.fetchToken(authData)
    }
    return this.accessToken
  }

  /**
   * Check if the current token is expired or about to expire.
   */
  isTokenExpired(): boolean {
    if (!this.tokenExpiration) return true

    // Consider token expired 5 minutes before actual expiration for safety
    const bufferTime = 5 * 60 * 1000

    return Date.now() > this.tokenExpiration - bufferTime
  }

  /**
   * Get the current JWT token, if available.
   */
  getCurrentToken(): string | null {
    return this.accessToken
  }
}
