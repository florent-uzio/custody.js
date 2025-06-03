import type { SDKConfig } from "./ripple-custody.types.js"
import { ApiService, AuthService, DomainService } from "./services/index.js"

export class RippleCustody {
  private authService: AuthService
  private apiService: ApiService
  // private userService: UserService
  private domainService: DomainService

  constructor(config: SDKConfig) {
    const { apiBaseUrl, authBaseUrl, privateKey } = config

    this.authService = new AuthService(authBaseUrl)

    this.apiService = new ApiService({
      apiBaseUrl,
      authFormData: {
        publicKey: config?.publicKey ?? "",
      },
      authService: this.authService,
      privateKey,
    })

    // this.userService = new UserService(this.apiService)
    this.domainService = new DomainService(this.apiService)
  }

  // Auth-related methods

  /**
   * @returns The current JWT token.
   */
  public getCurrentToken() {
    return this.authService.getCurrentToken()
  }

  // Domain-related methods

  /**
   * Fetches the list of available domains.
   *
   * https://docs.ripple.com/products/custody/api/reference/openapi/domains/getdomains
   */
  public async getDomains() {
    return this.domainService.getDomains()
  }

  /**
   * Fetches a specific domain by its ID.
   *
   * https://docs.ripple.com/products/custody/api/reference/openapi/domains/getdomain
   * @param domainId - The UUID of the domain to fetch.
   */
  public async getDomain(domainId: string) {
    return this.domainService.getDomain(domainId)
  }
}
