import type { RippleCustodyClientOptions } from "./ripple-custody.types.js"
import { ApiService } from "./services/apis/index.js"
import { AuthService } from "./services/auth/index.js"
import { DomainService, type GetDomainsQueryParams } from "./services/domains/index.js"
import {
  IntentsService,
  type Core_GetIntentPathParams,
  type Core_GetIntentsPathParams,
  type Core_GetIntentsQueryParams,
  type Core_IntentDryRunRequest,
  type Core_ProposeIntentBody,
} from "./services/intents/index.js"
import type { ApproveIntentRequest, RejectIntentRequest } from "./services/intents/types/index.js"

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

  // Auth namespace
  public readonly auth = {
    /**
     * @returns The current JWT token.
     */
    getCurrentToken: () => this.authService.getCurrentToken(),
  }

  // Domains namespace
  public readonly domains = {
    /**
     * Fetches the list of available domains.
     *
     * https://docs.ripple.com/products/custody/api/reference/openapi/domains/getdomains
     */
    list: (params?: GetDomainsQueryParams) => this.domainService.getDomains(params),

    /**
     * Fetches a specific domain by its ID.
     *
     * https://docs.ripple.com/products/custody/api/reference/openapi/domains/getdomain
     * @param domainId - The UUID of the domain to fetch.
     */
    get: (domainId: string) => this.domainService.getDomain(domainId),
  }

  // Intents namespace
  public readonly intents = {
    /**
     * Creates a new intent.
     *
     * @param params - The parameters for the intent.
     */
    propose: (params: Core_ProposeIntentBody) => this.intentService.proposeIntent(params),

    /**
     * Approves an intent.
     *
     * @param params - The parameters for the intent.
     */
    approve: (params: ApproveIntentRequest) => this.intentService.approveIntent(params),

    /**
     * Rejects an intent.
     *
     * @param params - The parameters for the intent.
     */
    reject: (params: RejectIntentRequest) => this.intentService.rejectIntent(params),

    /**
     * Gets an intent.
     *
     * @param params - The parameters for the intent.
     */
    get: (params: Core_GetIntentPathParams) => this.intentService.getIntent(params),

    /**
     * Gets a list of intents.
     *
     * @param query - The query parameters for the intents.
     */
    list: (params: Core_GetIntentsPathParams, query?: Core_GetIntentsQueryParams) =>
      this.intentService.getIntents(params, query),

    /**
     * Dry runs an intent.
     *
     * @param params - The parameters for the intent.
     */
    dryRun: (params: Core_IntentDryRunRequest) => this.intentService.dryRunIntent(params),
  }
}
