import { ApiService } from "../apis/api.service.js"
import type { Domain } from "./domain.types.js"

// Service for interacting with domain-related API endpoints
export class DomainService {
  constructor(private api: ApiService) {}

  /**
   * Fetches the list of domains from the backend.
   * @returns {Promise<Domain>} The domain data from the API.
   * @throws {Error} If the API call fails.
   */
  async getDomains(): Promise<any> {
    // Call the API to get domains
    return this.api.get<Domain>("/v1/domains")
  }
}
