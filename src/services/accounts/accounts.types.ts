import type { components, operations } from "../../models/custody-types.js"

// Request types

export type GetAccountsPathParams = operations["getAccounts"]["parameters"]["path"]
export type GetAccountsQueryParams = operations["getAccounts"]["parameters"]["query"]

export type GetAllDomainsAddressesQueryParams =
  operations["getAllDomainsAddresses"]["parameters"]["query"]

// Response types

export type Core_AccountsCollection = components["schemas"]["Core_AccountsCollection"]

export type Core_AddressReferenceCollection =
  components["schemas"]["Core_AddressReferenceCollection"]
