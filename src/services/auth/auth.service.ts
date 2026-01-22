import axios, { type AxiosInstance } from "axios"
import { DEFAULT_TIMEOUT_MS } from "../../constants/index.js"
import { CustodyError, type Core_ErrorMessage } from "../../models/custody-error.js"
import { type AuthFormData, type AuthResponse } from "./auth.service.types.js"

export type AuthServiceOptions = {
  /** The full authentication token endpoint URL (e.g., https://auth.example.com/token) */
  authUrl: string
  /**
   * Request timeout in milliseconds.
   * @default 30000 (30 seconds)
   */
  timeout?: number
}

export class AuthService {
  private authClient: AxiosInstance
  private accessToken: string = ""
  private tokenExpiration: number | null = null // timestamp in milliseconds
  private readonly TOKEN_VALIDITY = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

  /**
   * Stores the in-flight token refresh promise to prevent concurrent refresh requests.
   * When multiple requests need a token refresh simultaneously, they will all await
   * the same promise instead of triggering multiple auth requests.
   */
  private tokenRefreshPromise: Promise<string> | null = null

  constructor(options: AuthServiceOptions) {
    const { authUrl, timeout = DEFAULT_TIMEOUT_MS } = options

    // Initialize Axios client for auth requests
    this.authClient = axios.create({
      baseURL: authUrl,
      timeout,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  /**
   * Fetch a JWT token using the provided authentication data from Ripple Custody backend.
   * @param authData - The authentication data (challenge, publicKey, signature)
   * @returns {Promise<string>} The JWT token.
   * @throws {CustodyError} If authentication fails.
   */
  private async fetchToken(authData: AuthFormData): Promise<string> {
    // Prepare form data for token request
    const formData = new URLSearchParams()
    formData.append("grant_type", "password")
    formData.append("client_id", "customer_api")
    formData.append("signature", authData.signature)
    formData.append("challenge", authData.challenge)
    formData.append("public_key", authData.publicKey)

    try {
      // Send POST request to obtain token
      const response = await this.authClient.post<AuthResponse>("", formData)
      this.accessToken = response.data.access_token

      // Set token expiration to 4 hours from now
      this.tokenExpiration = Date.now() + this.TOKEN_VALIDITY
      return this.accessToken
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as Core_ErrorMessage
        throw new CustodyError(errorData, error.response.status, error)
      }
      throw new CustodyError(
        { reason: "Authentication request failed" },
        undefined,
        error instanceof Error ? error : undefined,
      )
    }
  }

  /**
   * Get a valid JWT token, refreshing if expired or missing.
   *
   * This method handles concurrent token refresh requests by ensuring only one
   * refresh request is made at a time. If multiple callers need a token refresh
   * simultaneously, they will all await the same promise.
   */
  async getToken(authData: AuthFormData): Promise<string> {
    // Return existing valid token
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken
    }

    // If a refresh is already in progress, wait for it
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise
    }

    // Start a new token refresh and store the promise
    this.tokenRefreshPromise = this.fetchToken(authData).finally(() => {
      // Clear the promise once completed (success or failure)
      this.tokenRefreshPromise = null
    })

    return this.tokenRefreshPromise
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
