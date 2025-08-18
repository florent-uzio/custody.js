import type { RippleCustodyClientOptions } from "./ripple-custody.types.js"
import { ApiService } from "./services/apis/index.js"
import { AuthService } from "./services/auth/index.js"
import { DomainService, type GetDomainsQueryParams } from "./services/domains/index.js"
import { IntentsService } from "./services/intents/index.js"
import type { ApproveIntentRequest, CreateIntentRequest, RejectIntentRequest } from "./services/intents/types/index.js"

export class RippleCustody {
  private authService: AuthService
  private apiService: ApiService
  private domainService: DomainService
  private intentService: IntentsService

  constructor(options: RippleCustodyClientOptions) {
    const { baseUrl, privateKey, publicKey } = options

    this.authService = new AuthService(baseUrl)
    this.apiService = new ApiService({
      baseUrl,
      authFormData: {
        publicKey,
      },
      authService: this.authService,
      privateKey,
    })
    this.domainService = new DomainService(this.apiService)
    this.intentService = new IntentsService(this.apiService)
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
  public async getDomains(params?: GetDomainsQueryParams) {
    return this.domainService.getDomains(params)
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

  // Intent-related methods

  /**
   * Creates a new intent.
   *
   * @param params - The parameters for the intent.
   */
  public async createIntent(params: CreateIntentRequest) {
    return this.intentService.createIntent(params)
  }

  /**
   * Approves an intent.
   *
   * @param params - The parameters for the intent.
   */
  public async approveIntent(params: ApproveIntentRequest) {
    return this.intentService.approveIntent(params)
  }

  /**
   * Rejects an intent.
   *
   * @param params - The parameters for the intent.
   */
  public async rejectIntent(params: RejectIntentRequest) {
    return this.intentService.rejectIntent(params)
  }
}
