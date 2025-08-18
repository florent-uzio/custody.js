import { URLs } from "../../constants/index.js"
import { ApiService } from "../apis/api.service.js"
import type { Domain, Domains, GetDomainsQueryParams } from "./domain.types.js"

// Service for interacting with domain-related API endpoints
export class DomainService {
  constructor(private api: ApiService) {}

  /**
   * Fetches the list of domains from the backend.
   * @returns {Promise<Domains>} The domains data from the API.
   */
  async getDomains(params?: GetDomainsQueryParams): Promise<Domains> {
    // Call the API to get domains
    return this.api.get<Domains>(URLs.domains, { params })
  }

  /**
   * Fetches a specific domain by its ID.
   * @param {string} domainId - The UUID of the domain to fetch.
   * @returns {Promise<Domain>} The domain data from the API.
   * @param domainId
   * @returns
   */
  async getDomain(domainId: string): Promise<Domain> {
    // Call the API to get a specific domain
    return this.api.get<Domain>(`${URLs.domains}/${domainId}`)
  }
}
