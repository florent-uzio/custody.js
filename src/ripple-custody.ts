import axios, { AxiosInstance } from "axios"
import { SDKConfig } from "./models"
import { AuthService } from "./services"

export class RippleCustody {
  private apiClient: AxiosInstance
  private authService: AuthService

  constructor(config: SDKConfig) {
    const baseUrl = config.baseUrl || "https://metaco.com"
    const authBaseUrl = config.authBaseUrl || "https://auth.metaco.com"

    this.authService = new AuthService()
    this.apiClient = axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
    })

    // this.apiClient.interceptors.request.use(async (axiosConfig) => {
    // const token = await this.authService.getToken(config.credentials) // Challenge should come from API in real scenario
    // axiosConfig.headers.Authorization = `Bearer ${token}`
    // return axiosConfig
    // })
  }
}
