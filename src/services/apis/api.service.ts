import axios, { AxiosError, AxiosInstance } from "axios"
import { v4 as uuidv4 } from "uuid"
import { AuthFormData } from "../auth"
import { AuthService } from "../auth/auth.service"
import { KeypairAlgorithm, KeypairService } from "../keypairs"

type PartialAuthFormData = //Omit<AuthFormData, "signature" | "challenge"> &
  Pick<AuthFormData, "publicKey"> & Partial<Pick<AuthFormData, "challenge">>

type ApiServiceOptions = {
  authService: AuthService
  apiBaseUrl: string
  keypairAlgorithm?: KeypairAlgorithm
  authFormData: PartialAuthFormData
  privateKey: string
}

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

    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor for token handling
    this.apiClient.interceptors.request.use(
      async (config) => {
        const token = await this.getValidToken(this.privateKey)
        config.headers.Authorization = `Bearer ${token}`
        return config
      },
      (error) => Promise.reject(error),
    )

    // Add response interceptor for 401 handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Force token refresh on 401
          const token = await this.getValidToken(this.privateKey, true)
          const originalRequest = error.config
          if (originalRequest && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return this.apiClient(originalRequest)
          }
        }
        return Promise.reject(error)
      },
    )

    this.keypairService = new KeypairService(this.keypairAlgorithm)

    // uuid
    this.challenge = !this.authFormData.challenge ? uuidv4() : this.authFormData.challenge
  }

  private async getValidToken(privateKey: string, forceRefresh = false): Promise<string> {
    const signature = this.keypairService.sign(privateKey, this.challenge)
    if (forceRefresh || this.authService.isTokenExpired()) {
      const authData = {
        signature, // In production, store these securely
        challenge: this.challenge,
        publicKey: this.authFormData.publicKey,
      }
      return await this.authService.getToken(authData, signature)
    }
    return this.authService.getCurrentToken() || ""
  }

  public async get<T>(url: string): Promise<T> {
    const response = await this.apiClient.get<T>(url)
    return response.data
  }

  public async post<T>(url: string, body: any): Promise<T> {
    const response = await this.apiClient.post<T>(url, body)
    return response.data
  }
}
