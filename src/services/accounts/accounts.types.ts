import type { operations } from "../../models/custody-types.js"

// Request types

export type GetAccountsPathParams = operations["getAccounts"]["parameters"]["path"]
export type GetAccountsQueryParams = operations["getAccounts"]["parameters"]["query"]

export type GetAllDomainsAddressesQueryParams =
  operations["getAllDomainsAddresses"]["parameters"]["query"]

export type GetAccountPathParams = operations["getAccount"]["parameters"]["path"]
export type GetAccountQueryParams = operations["getAccount"]["parameters"]["query"]

export type GetAddressesPathParams = operations["getAddresses"]["parameters"]["path"]
export type GetAddressesQueryParams = operations["getAddresses"]["parameters"]["query"]

export type GenerateNewAccountExternalAddressDeprecatedPathParams =
  operations["generateNewExternalAddressDeprecated"]["parameters"]["path"]
export type GenerateNewAccountExternalAddressDeprecatedQueryParams =
  operations["generateNewExternalAddressDeprecated"]["parameters"]["query"]

export type GenerateNewExternalAddressPathParams =
  operations["generateNewExternalAddress"]["parameters"]["path"]

export type GetAccountAddressPathParams = operations["getAccountAddress"]["parameters"]["path"]

export type GetAccountBalancesPathParams = operations["getAccountBalances"]["parameters"]["path"]
export type GetAccountBalancesQueryParams = operations["getAccountBalances"]["parameters"]["query"]

export type ForceUpdateAccountBalancesPathParams =
  operations["forceUpdateAccountBalances"]["parameters"]["path"]
export type ForceUpdateAccountBalancesQueryParams =
  operations["forceUpdateAccountBalances"]["parameters"]["query"]

export type GetManifestsPathParams = operations["getManifests"]["parameters"]["path"]
export type GetManifestsQueryParams = operations["getManifests"]["parameters"]["query"]

export type GetManifestPathParams = operations["getManifest"]["parameters"]["path"]

// Response types

export type Core_AccountsCollection =
  operations["getAccounts"]["responses"]["200"]["content"]["application/json"]

export type Core_AddressReferenceCollection =
  operations["getAllDomainsAddresses"]["responses"]["200"]["content"]["application/json"]

export type Core_ApiAccount =
  operations["getAccount"]["responses"]["200"]["content"]["application/json"]

export type Core_AddressesCollection =
  operations["getAddresses"]["responses"]["200"]["content"]["application/json"]

export type Core_AccountAddress =
  operations["getAccountAddress"]["responses"]["200"]["content"]["application/json"]

export type Core_BalancesCollection =
  operations["getAccountBalances"]["responses"]["200"]["content"]["application/json"]

export type Core_ManifestsCollection =
  operations["getManifests"]["responses"]["200"]["content"]["application/json"]

export type Core_ApiManifest =
  operations["getManifest"]["responses"]["200"]["content"]["application/json"]

/**
 * Account reference found by address lookup.
 */
export type AccountReference = {
  accountId: string
  ledgerId: string
  address: string
}
