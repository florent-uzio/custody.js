import { URLs } from "../../constants/index.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_ApiVault,
  Core_ExportPreparedOperationsResponse,
  Core_VaultsCollection,
  ExportPreparedOperationsPathParams,
  GetVaultPathParams,
  GetVaultsQueryParams,
} from "./vaults.types.js"

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

  /**
   * Get vault
   * @param vaultId - The vault ID
   * @returns The vault
   */
  public async getVault({ vaultId }: GetVaultPathParams): Promise<Core_ApiVault> {
    return this.apiService.get(replacePathParams(URLs.vault, { vaultId }))
  }

  /**
   * Export prepared operations
   */
  public async exportPreparedOperations({
    vaultId,
  }: ExportPreparedOperationsPathParams): Promise<Core_ExportPreparedOperationsResponse> {
    return this.apiService.get(replacePathParams(URLs.vaultOperationsPrepared, { vaultId }))
  }
}
