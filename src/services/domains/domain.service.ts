import { ApiService } from "../apis/api.service"
import { Domain } from "./domain.types"

export class DomainService {
  constructor(private api: ApiService) {}

  async getDomains(): Promise<any> {
    try {
      const response = await this.api.get<Domain>("/v1/domains")
      return response
    } catch (error) {
      throw new Error("Failed to fetch domains")
    }
  }
}
