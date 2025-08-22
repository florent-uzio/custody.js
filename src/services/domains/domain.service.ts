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
   * @returns {Promise<Domains>} The domains data from the API.
   */
  getDomains(params?: GetDomainsQueryParams): Promise<Core_TrustedDomainsCollection> {
    // Call the API to get domains
    return this.api.get<Core_TrustedDomainsCollection>(URLs.domains, { params })
  }

  /**
   * Fetches a specific domain by its ID.
   * @param {string} domainId - The UUID of the domain to fetch.
   * @returns {Promise<Domain>} The domain data from the API.
   * @param domainId
   * @returns
   */
  getDomain({ domainId }: GetDomainPathParams): Promise<Core_TrustedDomain> {
    // Call the API to get a specific domain
    return this.api.get<Core_TrustedDomain>(replacePathParams(URLs.domain, { domainId }))
  }
}
