import { ApiService } from "../apis/api.service.js"
import type { Domains } from "./domain.types.js"

// Service for interacting with domain-related API endpoints
export class DomainService {
  constructor(private api: ApiService) {}

  /**
   * Fetches the list of domains from the backend.
   * @returns {Promise<Domains>} The domains data from the API.
   */
  async getDomains(): Promise<Domains> {
    // Call the API to get domains
    return this.api.get<Domains>("/v1/domains")
  }

  /**
   * Fetches a specific domain by its ID.
   * @param {string} domainId - The UUID of the domain to fetch.
   * @returns {Promise<Domain>} The domain data from the API.
   * @param domainId
   * @returns
   */
  async getDomain(domainId: string): Promise<any> {
    // Call the API to get a specific domain
    return this.api.get<DomainService>(`/v1/domains/${domainId}`)
  }
}
