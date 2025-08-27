import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import canonicalize from "canonicalize"
import { v4 as uuidv4 } from "uuid"
import { getHostname, isObject } from "../../helpers/index.js"
import { CustodyError, type Core_ErrorMessage } from "../../models/custody-error.js"
import { AuthService } from "../auth/auth.service.js"
import { KeypairService } from "../keypairs/index.js"
import { type ApiServiceOptions, type PartialAuthFormData } from "./api.service.types.js"

/**
 * ApiService handles authenticated API requests and token management
 */
export class ApiService {
  private readonly apiClient: AxiosInstance
  private readonly authFormData: PartialAuthFormData
  private readonly authService: AuthService
  private readonly apiUrl: string
  private readonly challenge: string
  private readonly keypairService: KeypairService
  private readonly privateKey: string

  constructor(options: ApiServiceOptions) {
    this.authService = options.authService
    this.apiUrl = `https://api.${getHostname(options.baseUrl)}`
    this.authFormData = options.authFormData
    this.privateKey = options.privateKey

    // Create Axios instance for API requests
    this.apiClient = axios.create({
      baseURL: this.apiUrl,
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

    // Validate provided private key
    const privateKeyAlgorithm = KeypairService.detectKeyType(this.privateKey)
    if (privateKeyAlgorithm === "unknown") {
      throw new Error("Unsupported private key algorithm. Please provide a valid private key.")
    }

    // Initialize keypair service for signing
    this.keypairService = new KeypairService(privateKeyAlgorithm)

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
    if (forceRefresh || this.authService.isTokenExpired()) {
      const authData = {
        signature: this.keypairService.sign(privateKey, this.challenge),
        challenge: this.challenge,
        publicKey: this.authFormData.publicKey,
      }
      return await this.authService.getToken(authData)
    }
    return this.authService.getCurrentToken() || ""
  }

  /**
   * Makes a GET request to the API.
   * @param url - The endpoint URL.
   * @returns {Promise<T>} The response data.
   * @throws {CustodyError} If the request fails with a typed error response.
   */
  public async get<T>(url: string, params?: AxiosRequestConfig["params"]): Promise<T> {
    try {
      const response = await this.apiClient.get<T>(url, params)
      return response.data
    } catch (error) {
      if (axios.isAxiosError<Core_ErrorMessage>(error)) {
        // Check if the error response contains the expected error structure
        const errorData = error.response?.data
        if (isObject(errorData)) {
          throw new CustodyError(errorData, error.response?.status, error)
        }
        // Fallback for unexpected error formats
        throw new CustodyError(
          { reason: `GET API request failed: ${error.message}` },
          error.response?.status,
          error,
        )
      } else {
        // Re-throw non-Axios errors as CustodyError
        throw new CustodyError(
          { reason: error instanceof Error ? error.message : "Unknown error occurred" },
          undefined,
          error instanceof Error ? error : undefined,
        )
      }
    }
  }

  /**
   * Makes a POST request to the API.
   * @param url - The endpoint URL.
   * @param body - The request payload.
   * @returns {Promise<T>} The response data.
   * @throws {CustodyError} If the request fails with a typed error response.
   */
  public async post<T>(url: string, body: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      // Sign the request if signature is missing
      if (!body.signature || body.signature === "") {
        // Canonicalize the request body
        // @ts-expect-error canonicalize works fine but has complex types
        const canonicalizedRequest = canonicalize(body.request)

        if (!canonicalizedRequest) {
          throw new CustodyError({ reason: "Failed to canonicalize request body" })
        }

        // Sign the canonicalized request
        const signature = this.keypairService.sign(this.privateKey, canonicalizedRequest)

        body.signature = signature
      }

      const response = await this.apiClient.post<T>(url, body, config)
      return response.data
    } catch (error) {
      if (axios.isAxiosError<Core_ErrorMessage>(error)) {
        // Check if the error response contains the expected error structure
        const errorData = error.response?.data
        if (isObject(errorData)) {
          throw new CustodyError(errorData, error.response?.status, error)
        }
        // Fallback for unexpected error formats
        throw new CustodyError(
          { reason: `POST API request failed: ${error.message}` },
          error.response?.status,
          error,
        )
      } else {
        // Re-throw non-Axios errors as CustodyError
        throw new CustodyError(
          { reason: error instanceof Error ? error.message : "Unknown error occurred" },
          undefined,
          error instanceof Error ? error : undefined,
        )
      }
    }
  }
}
