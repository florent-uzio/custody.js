// src/services/ApiService.ts
import axios, { AxiosError, AxiosInstance } from "axios"
import { AuthService } from "./auth.service"

export class ApiService {
  private apiClient: AxiosInstance
  private baseUrl = "https://api.metaco.8rey67.m3t4c0.services"
  private authService: AuthService
  private domain: string

  constructor(authService: AuthService, domain: string) {
    this.authService = authService
    this.domain = domain
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
  }

  private async getValidToken(forceRefresh = false): Promise<string> {
    if (forceRefresh || this.authService.isTokenExpired()) {
      const authData = {
        signature: "your-signature", // In production, store these securely
        challenge: "your-challenge",
        publicKey: "your-public-key",
      }
      return await this.authService.getToken(authData)
    }
    return this.authService.getCurrentToken() || ""
  }

  async getDomains(): Promise<any> {
    try {
      const response = await this.apiClient.get("/v1/domains")
      return response.data
    } catch (error) {
      console.error("Error fetching domains:", error)
      throw new Error("Failed to fetch domains")
    }
  }

  async getUsers(): Promise<any> {
    try {
      const response = await this.apiClient.get(`/v1/domains/${this.domain}/users`)
      return response.data
    } catch (error) {
      console.error("Error fetching users:", error)
      throw new Error("Failed to fetch users")
    }
  }
}
