import type { components, operations } from "../../models/custody-types.js"

// Request types

export type GetAccountsPathParams = operations["getAccounts"]["parameters"]["path"]
export type GetAccountsQueryParams = operations["getAccounts"]["parameters"]["query"]

export type GetAllDomainsAddressesQueryParams =
  operations["getAllDomainsAddresses"]["parameters"]["query"]

export type GetAccountPathParams = operations["getAccount"]["parameters"]["path"]
export type GetAccountQueryParams = operations["getAccount"]["parameters"]["query"]

export type GetAddressesPathParams = operations["getAddresses"]["parameters"]["path"]
export type GetAddressesQueryParams = operations["getAddresses"]["parameters"]["query"]

// Response types

export type Core_AccountsCollection = components["schemas"]["Core_AccountsCollection"]

export type Core_AddressReferenceCollection =
  components["schemas"]["Core_AddressReferenceCollection"]

export type Core_ApiAccount = components["schemas"]["Core_ApiAccount"]

export type Core_AddressesCollection = components["schemas"]["Core_AddressesCollection"]
