import { URLs } from "../../constants/index.js"
import { ApiService } from "../apis/api.service.js"
import type { Core_VaultsCollection, GetVaultsQueryParams } from "./vaults.types.js"

export class VaultsService {
  private readonly apiService: ApiService

  constructor(apiService: ApiService) {
    this.apiService = apiService
  }

  /**
   * Get vaults
   * @param queryParams - The query parameters for the request
   * @returns The vaults
   */
  public async getVaults(queryParams?: GetVaultsQueryParams): Promise<Core_VaultsCollection> {
    return this.apiService.get(URLs.vaults, queryParams)
  }
}
