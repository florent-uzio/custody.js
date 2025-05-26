import axios, { AxiosError, AxiosInstance } from "axios"
import { v4 as uuidv4 } from "uuid"
import { AuthData } from "../../ripple-custody.types"
import { AuthService } from "../auth/auth.service"
import { CryptoAlgorithm, KeypairService } from "../keypairs"

export class ApiService {
  private apiClient: AxiosInstance
  private cryptoService: KeypairService
  private challenge: string

  constructor(
    private readonly authService: AuthService,
    private readonly baseUrl: string,
    private readonly algorithm: CryptoAlgorithm = CryptoAlgorithm.SECP256K1,
    private readonly authData: AuthData,
  ) {
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor for token handling
    this.apiClient.interceptors.request.use(
      async (config) => {
        const token = await this.getValidToken()
        console.log({ token })
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
          const token = await this.getValidToken(true)
          const originalRequest = error.config
          if (originalRequest && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return this.apiClient(originalRequest)
          }
        }
        return Promise.reject(error)
      },
    )

    this.cryptoService = new KeypairService(this.algorithm)

    // uuid
    this.challenge = !this.authData.challenge ? uuidv4() : this.authData.challenge
  }

  private async getValidToken(forceRefresh = false): Promise<string> {
    const signature = this.cryptoService.sign(this.authData.privateKey, this.challenge)
    if (forceRefresh || this.authService.isTokenExpired()) {
      const authData = {
        signature, // In production, store these securely
        challenge: this.challenge,
        publicKey: this.authData.publicKey,
      }
      return await this.authService.getToken(authData)
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
