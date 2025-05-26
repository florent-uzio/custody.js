import { SDKConfig } from "./ripple-custody.types"
import { ApiService, AuthService, DomainService } from "./services"

export class RippleCustody {
  private authService: AuthService
  private apiService: ApiService
  // private userService: UserService
  private domainService: DomainService

  constructor(config: SDKConfig) {
    const { apiBaseUrl, authBaseUrl, keypairAlgorithm, privateKey } = config ?? {}

    this.authService = new AuthService(authBaseUrl)

    this.apiService = new ApiService({
      apiBaseUrl,
      authFormData: {
        publicKey: config?.publicKey ?? "",
      },
      authService: this.authService,
      privateKey,
      keypairAlgorithm,
    })

    // this.userService = new UserService(this.apiService)
    this.domainService = new DomainService(this.apiService)
  }

  public async getDomains() {
    return this.domainService.getDomains()
  }
}
