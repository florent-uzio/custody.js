import { SDKConfig } from "./ripple-custody.types"
import { ApiService, AuthService, CryptoAlgorithm, DomainService } from "./services"

export class RippleCustody {
  private authService: AuthService
  private apiService: ApiService
  // private userService: UserService
  private domainService: DomainService

  constructor(config?: SDKConfig) {
    const {
      apiBaseUrl = "https://api.metaco.8rey67.m3t4c0.services",
      authBaseUrl = "https://auth.metaco.8rey67.m3t4c0.services",
      cryptoAlgorithm = CryptoAlgorithm.SECP256K1,
      authData,
    } = config ?? {}

    if (!authData) {
      throw new Error("authData is required to initialize RippleCustody")
    }

    this.authService = new AuthService(authBaseUrl)
    this.apiService = new ApiService(this.authService, apiBaseUrl, cryptoAlgorithm, authData)
    // this.userService = new UserService(this.apiService)
    this.domainService = new DomainService(this.apiService)
  }

  public async getDomains() {
    return this.domainService.getDomains()
  }
}
