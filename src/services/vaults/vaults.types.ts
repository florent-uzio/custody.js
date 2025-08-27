import type { operations, paths } from "../../models/custody-types.js"

// Request types

export type GetVaultsQueryParams = operations["getVaults"]["parameters"]["query"]

export type GetVaultPathParams = operations["getVault"]["parameters"]["path"]

export type ExportPreparedOperationsPathParams =
  paths["/v1/vaults/{vaultId}/operations/prepared"]["get"]["parameters"]["path"]

export type ImportPreparedOperationsRequestBody = {
  /**
   * Array of strings (binary)
   */
  files: string[]
}

// Response types

export type Core_VaultsCollection =
  operations["getVaults"]["responses"]["200"]["content"]["application/json"]

export type Core_ApiVault =
  operations["getVault"]["responses"]["200"]["content"]["application/json"]

export type Core_ExportPreparedOperationsResponse =
  paths["/v1/vaults/{vaultId}/operations/prepared"]["get"]["responses"]["200"]["content"]
