import axios, { AxiosInstance } from "axios"
import { Domain, GetDomainsParams, SDKConfig } from "./models"
import { GetUsersParams, User } from "./models/users"
import { AuthService } from "./services"

export class ApiClient {
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

  // Domains resource
  async getDomains(params: GetDomainsParams = {}): Promise<Domain[]> {
    const response = await this.apiClient.get("/domains", { params })
    return response.data
  }

  // Users resource
  async getUsers(params: GetUsersParams = {}): Promise<User[]> {
    const response = await this.apiClient.get("/users", { params })
    return response.data
  }

  // Add more methods for other endpoints here
  async getDomainById(id: string): Promise<Domain> {
    const response = await this.apiClient.get(`/domains/${id}`)
    return response.data
  }

  // Method to expose token for advanced use cases
  getToken(): string | null {
    return this.authService.getCurrentToken()
  }
}
