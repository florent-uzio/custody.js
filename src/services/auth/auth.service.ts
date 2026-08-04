import axios, { type AxiosInstance } from "axios"
import { DEFAULT_TIMEOUT_MS } from "../../constants/index.js"
import { CustodyError, type Core_ErrorMessage } from "../../models/custody-error.js"
import type { CustodyDebugLogger } from "../../ripple-custody.types.js"
import { attachDebugInterceptors } from "../debug/index.js"
import { type AuthFormData, type AuthResponse } from "./auth.service.types.js"

export type AuthServiceOptions = {
  /** The full authentication token endpoint URL (e.g., https://auth.example.com/token) */
  authUrl: string
  /**
   * Logger for every exchange on the auth client. Already resolved from the
   * client's `debug` option; `undefined` means debugging is off.
   */
  debug?: CustodyDebugLogger
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
  private readonly DEFAULT_TOKEN_VALIDITY = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

  /**
   * Stores the in-flight token refresh promise to prevent concurrent refresh requests.
   * When multiple requests need a token refresh simultaneously, they will all await
   * the same promise instead of triggering multiple auth requests.
   */
  private tokenRefreshPromise: Promise<string> | null = null

  constructor(options: AuthServiceOptions) {
    const { authUrl, debug, timeout = DEFAULT_TIMEOUT_MS } = options

    // Initialize Axios client for auth requests
    this.authClient = axios.create({
      baseURL: authUrl,
      timeout,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    // The token request is where signature failures surface, so it is logged
    // alongside API calls rather than left invisible.
    if (debug) {
      attachDebugInterceptors(this.authClient, debug, "auth")
    }
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

      // Extract expiration from the JWT's exp claim, fall back to default validity
      const exp = this.extractExpFromJwt(this.accessToken)
      this.tokenExpiration = exp ? exp * 1000 : Date.now() + this.DEFAULT_TOKEN_VALIDITY
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
  async getToken(authData: AuthFormData, forceRefresh = false): Promise<string> {
    // Return existing valid token (unless the caller demands a fresh one)
    if (!forceRefresh && this.accessToken && !this.isTokenExpired()) {
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
   * Extract the `exp` (expiration) claim from a JWT token's payload.
   * @returns The `exp` value in seconds (Unix timestamp), or null if extraction fails.
   */
  private extractExpFromJwt(token: string): number | null {
    try {
      const payload = token.split(".")[1]
      if (!payload) return null

      const decoded = JSON.parse(Buffer.from(payload, "base64url").toString())
      return typeof decoded.exp === "number" ? decoded.exp : null
    } catch {
      return null
    }
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

  /**
   * Get the current JWT token expiration, if available.
   */
  getTokenExpiration(): number | null {
    return this.tokenExpiration
  }
}
