import type { components, operations } from "../../models/custody-types.js"

// Path / query param types

export type GetOmnibusPathParams = operations["getOmnibusByDomain"]["parameters"]["path"]

export type CreateOmnibusPathParams = operations["createOmnibus"]["parameters"]["path"]

export type GetOmnibusByIdPathParams = operations["getOmnibus"]["parameters"]["path"]

export type UpdateOmnibusPathParams = operations["updateOmnibus"]["parameters"]["path"]

export type LockOmnibusPathParams = operations["lockOmnibus"]["parameters"]["path"]

export type UnlockOmnibusPathParams = operations["unlockOmnibus"]["parameters"]["path"]

export type ListOmnibusInternalTransfersPathParams =
  operations["getInternalTransfers"]["parameters"]["path"]
export type ListOmnibusInternalTransfersQueryParams =
  operations["getInternalTransfers"]["parameters"]["query"]

export type GetOmnibusInternalTransferPathParams =
  operations["getInternalTransfer"]["parameters"]["path"]

export type ListOmnibusDepositWalletsPathParams =
  operations["listDepositWallets"]["parameters"]["path"]
export type ListOmnibusDepositWalletsQueryParams =
  operations["listDepositWallets"]["parameters"]["query"]

export type ListOmnibusTenantsPathParams = operations["listTenants"]["parameters"]["path"]
export type ListOmnibusTenantsQueryParams = operations["listTenants"]["parameters"]["query"]

export type CreateOmnibusTenantPathParams = operations["createTenant"]["parameters"]["path"]

export type GetOmnibusTenantPathParams = operations["getTenant"]["parameters"]["path"]

export type UpdateOmnibusTenantPathParams = operations["updateTenant"]["parameters"]["path"]

export type GetOmnibusTenantDepositWalletPathParams =
  operations["getDepositWallet"]["parameters"]["path"]

export type CreateOmnibusTenantDepositWalletPathParams =
  operations["createDepositWallet"]["parameters"]["path"]

export type CreateOmnibusInternalTransferPathParams =
  operations["createInternalTransfer"]["parameters"]["path"]

export type LockOmnibusTenantPathParams = operations["lockTenant"]["parameters"]["path"]

export type UnlockOmnibusTenantPathParams = operations["unlockTenant"]["parameters"]["path"]

export type CreateOmnibusWithdrawalPathParams = operations["createWithdrawal"]["parameters"]["path"]

// Response / body types

export type Omnibus_OmnibusResponse = components["schemas"]["Omnibus_OmnibusResponse"]
export type Omnibus_CreateOmnibusRequest = components["schemas"]["Omnibus_CreateOmnibusRequest"]
export type Omnibus_CreateOmnibusResponse = components["schemas"]["Omnibus_CreateOmnibusResponse"]
export type Omnibus_UpdateOmnibusRequest = components["schemas"]["Omnibus_UpdateOmnibusRequest"]
export type Omnibus_InternalTransferPageResponse =
  components["schemas"]["Omnibus_InternalTransferPageResponse"]
export type Omnibus_DepositWalletSummaryPageResponse =
  components["schemas"]["Omnibus_DepositWalletSummaryPageResponse"]
export type Omnibus_TenantPageResponse = components["schemas"]["Omnibus_TenantPageResponse"]
export type Omnibus_CreateOrUpdateTenantRequest =
  components["schemas"]["Omnibus_CreateOrUpdateTenantRequest"]
export type Omnibus_TenantResponse = components["schemas"]["Omnibus_TenantResponse"]
export type Omnibus_DepositWalletResponse = components["schemas"]["Omnibus_DepositWalletResponse"]
export type Omnibus_CreateInternalTransferRequest =
  components["schemas"]["Omnibus_CreateInternalTransferRequest"]
export type Omnibus_InternalTransferResponse =
  components["schemas"]["Omnibus_InternalTransferResponse"]
export type Omnibus_CreateWithdrawalRequest =
  components["schemas"]["Omnibus_CreateWithdrawalRequest"]
export type Omnibus_CreateWithdrawalResponse =
  components["schemas"]["Omnibus_CreateWithdrawalResponse"]
