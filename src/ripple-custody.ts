import { ApiService, AuthCredentials, AuthService, DomainService } from "./services"

export interface SDKConfig {
  credentials: AuthCredentials
  baseUrl?: string // Default: 'https://metaco.com'
  authBaseUrl?: string // Default: 'https://auth.metaco.com'
}

export class RippleCustody {
  private authService: AuthService
  private apiService: ApiService
  // private userService: UserService
  private domainService: DomainService

  constructor(config?: SDKConfig) {
    const {
      baseUrl = "https://api.metaco.8rey67.m3t4c0.services",
      authBaseUrl = "https://auth.metaco.8rey67.m3t4c0.services",
    } = config ?? {}

    this.authService = new AuthService(authBaseUrl)
    this.apiService = new ApiService(this.authService, baseUrl)
    // this.userService = new UserService(this.apiService)
    this.domainService = new DomainService(this.apiService)
  }

  public async getDomains() {
    return this.domainService.getDomains()
  }
}
