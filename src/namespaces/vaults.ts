import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_ApiVault,
  Core_ExportPreparedOperationsResponse,
  Core_VaultsCollection,
  ExportPreparedOperationsPathParams,
  GetVaultPathParams,
  GetVaultsQueryParams,
  ImportPreparedOperationsRequestBody,
} from "./vaults.types.js"

export function createVaults(t: Transport) {
  return {
    list: (queryParams?: GetVaultsQueryParams): Promise<Core_VaultsCollection> =>
      t.get(URLs.vaults, undefined, queryParams ?? {}),

    get: (params: GetVaultPathParams): Promise<Core_ApiVault> => t.get(URLs.vault, params),

    exportPreparedOperations: (
      params: ExportPreparedOperationsPathParams,
    ): Promise<Core_ExportPreparedOperationsResponse> =>
      t.get(URLs.vaultOperationsPrepared, params),

    importPreparedOperations: (body: ImportPreparedOperationsRequestBody): Promise<void> =>
      t.post(URLs.vaultOperationsSigned, body.files, undefined, {
        headers: { "Content-Type": "multipart/form-data" },
        sign: false,
      }),
  } as const
}
