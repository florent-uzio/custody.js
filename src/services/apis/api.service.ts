import axios, { AxiosError, AxiosInstance } from "axios"
import { v4 as uuidv4 } from "uuid"
import { AuthService } from "../auth/auth.service"
import { KeypairAlgorithm, KeypairService } from "../keypairs"
import { ApiServiceOptions, PartialAuthFormData } from "./api.service.types"

/**
 * ApiService handles authenticated API requests and token management
 */
export class ApiService {
  private readonly apiClient: AxiosInstance
  private readonly authFormData: PartialAuthFormData
  private readonly authService: AuthService
  private readonly baseUrl: string
  private readonly challenge: string
  private readonly keypairAlgorithm: KeypairAlgorithm
  private readonly keypairService: KeypairService
  private readonly privateKey: string

  constructor(options: ApiServiceOptions) {
    this.authService = options.authService
    this.baseUrl = options.apiBaseUrl
    this.keypairAlgorithm = options.keypairAlgorithm ?? KeypairAlgorithm.SECP256K1
    this.authFormData = options.authFormData
    this.privateKey = options.privateKey

    // Create Axios instance for API requests
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor to inject JWT token into headers
    this.apiClient.interceptors.request.use(
      async (config) => {
        const token = await this.getValidToken(this.privateKey)
        config.headers.Authorization = `Bearer ${token}`
        return config
      },
      (error) => Promise.reject(error),
    )

    // Add response interceptor to handle 401 errors by refreshing token and retrying
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Force token refresh on 401 Unauthorized
          const token = await this.getValidToken(this.privateKey, true)
          const originalRequest = error.config

          if (originalRequest && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
            // Retry the original request with new token
            return this.apiClient(originalRequest)
          }
        }
        // Propagate error if not handled
        return Promise.reject(error)
      },
    )

    // Initialize keypair service for signing
    this.keypairService = new KeypairService(this.keypairAlgorithm)

    // Use provided challenge or generate a new one
    this.challenge = this.authFormData.challenge ? this.authFormData.challenge : uuidv4()
  }

  /**
   * Retrieves a valid JWT token, refreshing if needed.
   * @param privateKey - The private key for signing the challenge.
   * @param forceRefresh - Whether to force a token refresh.
   * @returns {Promise<string>} The valid JWT token.
   */
  private async getValidToken(privateKey: string, forceRefresh = false): Promise<string> {
    const signature = this.keypairService.sign(privateKey, this.challenge)

    if (forceRefresh || this.authService.isTokenExpired()) {
      const authData = {
        signature,
        challenge: this.challenge,
        publicKey: this.authFormData.publicKey,
      }
      return await this.authService.getToken(authData, signature)
    }
    return this.authService.getCurrentToken() || ""
  }

  /**
   * Makes a GET request to the API.
   * @param url - The endpoint URL.
   * @returns {Promise<T>} The response data.
   * @throws {Error} If the request fails.
   */
  public async get<T>(url: string): Promise<T> {
    try {
      const response = await this.apiClient.get<T>(url)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        throw new Error(`GET API request failed: ${error.message}`)
      } else {
        // Handle unexpected error
        throw new Error("An unexpected error occurred")
      }
    }
  }

  /**
   * Makes a POST request to the API.
   * @param url - The endpoint URL.
   * @param body - The request payload.
   * @returns {Promise<T>} The response data.
   */
  public async post<T>(url: string, body: any): Promise<T> {
    try {
      const response = await this.apiClient.post<T>(url, body)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        throw new Error(`POST API request failed: ${error.message}`)
      } else {
        // Handle unexpected error
        throw new Error("An unexpected error occurred")
      }
    }
  }
}
