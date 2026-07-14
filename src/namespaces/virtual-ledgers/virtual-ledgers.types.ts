import type { components, paths } from "../../models/custody-types.js"

// Virtual Ledger (top level)

export type ListVirtualLedgersPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["parameters"]["path"]
export type ListVirtualLedgersQueryParams =
  paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["parameters"]["query"]

export type CreateVirtualLedgerPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["parameters"]["path"]

export type GetVirtualLedgerPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["get"]["parameters"]["path"]

export type UpdateVirtualLedgerPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["put"]["parameters"]["path"]

export type GetVirtualLedgerBalancesPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]["get"]["parameters"]["path"]

export type ListVirtualLedgerOperationsPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["parameters"]["path"]
export type ListVirtualLedgerOperationsQueryParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["parameters"]["query"]

export type CreateVirtualLedgerOperationPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["parameters"]["path"]

export type ListVirtualLedgerTransfersPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["parameters"]["path"]
export type ListVirtualLedgerTransfersQueryParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["parameters"]["query"]

// Virtual Ledger Accounts (nested)

export type ListVirtualLedgerAccountsPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["parameters"]["path"]
export type ListVirtualLedgerAccountsQueryParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["parameters"]["query"]

export type CreateVirtualLedgerAccountPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["parameters"]["path"]

export type UpdateVirtualLedgerAccountPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]["put"]["parameters"]["path"]

export type GetVirtualLedgerAccountBalancesPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]["get"]["parameters"]["path"]

export type AssignVirtualLedgerAccountDepositIdentificationSourcePathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]["post"]["parameters"]["path"]

export type GetVirtualLedgerAccountAddressesPathParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["parameters"]["path"]
export type GetVirtualLedgerAccountAddressesQueryParams =
  paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["parameters"]["query"]

// Response / body types

export type VirtualAccounting_VirtualLedgerOutPagedCollectionResponse =
  components["schemas"]["VirtualAccounting_VirtualLedgerOutPagedCollectionResponse"]
export type VirtualAccounting_VirtualLedgerIn =
  components["schemas"]["VirtualAccounting_VirtualLedgerIn"]
export type VirtualAccounting_VirtualLedgerOut =
  components["schemas"]["VirtualAccounting_VirtualLedgerOut"]
export type VirtualAccounting_VirtualLedgerUpdate =
  components["schemas"]["VirtualAccounting_VirtualLedgerUpdate"]
export type VirtualAccounting_BalanceCollectionResponse =
  components["schemas"]["VirtualAccounting_BalanceCollectionResponse"]
export type VirtualAccounting_OperationOutPagedCollectionResponse =
  components["schemas"]["VirtualAccounting_OperationOutPagedCollectionResponse"]
export type VirtualAccounting_OperationIn = components["schemas"]["VirtualAccounting_OperationIn"]
export type VirtualAccounting_OperationOut = components["schemas"]["VirtualAccounting_OperationOut"]
export type VirtualAccounting_TransferBasePagedCollectionResponse =
  components["schemas"]["VirtualAccounting_TransferBasePagedCollectionResponse"]
export type VirtualAccounting_VirtualAccountOutPagedCollectionResponse =
  components["schemas"]["VirtualAccounting_VirtualAccountOutPagedCollectionResponse"]
export type VirtualAccounting_VirtualAccountIn =
  components["schemas"]["VirtualAccounting_VirtualAccountIn"]
export type VirtualAccounting_VirtualAccountOut =
  components["schemas"]["VirtualAccounting_VirtualAccountOut"]
export type VirtualAccounting_VirtualAccountUpdate =
  components["schemas"]["VirtualAccounting_VirtualAccountUpdate"]
export type VirtualAccounting_DepositIdentificationSourceBaseIn =
  components["schemas"]["VirtualAccounting_DepositIdentificationSourceBaseIn"]
export type VirtualAccounting_LedgerAddressPagedCollectionResponse =
  components["schemas"]["VirtualAccounting_LedgerAddressPagedCollectionResponse"]
