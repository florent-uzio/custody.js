import { URLs } from "../../constants/index.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_TrustedDomain,
  Core_TrustedDomainsCollection,
  GetDomainPathParams,
  GetDomainsQueryParams,
} from "./domain.types.js"

// Service for interacting with domain-related API endpoints
export class DomainService {
  constructor(private api: ApiService) {}

  /**
   * Fetches the list of domains from the backend.
   * @returns {Promise<Core_TrustedDomainsCollection>} The domains data from the API.
   */
  async getDomains(queryParams?: GetDomainsQueryParams): Promise<Core_TrustedDomainsCollection> {
    // Call the API to get domains
    return this.api.get<Core_TrustedDomainsCollection>(URLs.domains, queryParams)
  }

  /**
   * Fetches a specific domain by its ID.
   * @param {GetDomainPathParams} params - The parameters containing the domain ID.
   * @returns {Promise<Core_TrustedDomain>} The domain data from the API.
   */
  async getDomain({ domainId }: GetDomainPathParams): Promise<Core_TrustedDomain> {
    // Call the API to get a specific domain
    return this.api.get<Core_TrustedDomain>(replacePathParams(URLs.domain, { domainId }))
  }
}
