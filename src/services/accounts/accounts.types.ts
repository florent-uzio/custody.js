import type { components, operations } from "../../models/custody-types.js"
import type { LedgerId } from "../../models/ledger-ids.js"

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

export type ListComplianceConfigurationsPathParams =
  operations["listComplianceConfigurations"]["parameters"]["path"]
export type ListComplianceConfigurationsQueryParams =
  operations["listComplianceConfigurations"]["parameters"]["query"]

export type GetComplianceConfigurationPathParams =
  operations["getComplianceConfiguration"]["parameters"]["path"]

export type UpsertComplianceConfigurationPathParams =
  operations["upsertComplianceConfiguration"]["parameters"]["path"]
export type UpsertComplianceConfigurationBody =
  operations["upsertComplianceConfiguration"]["requestBody"]["content"]["application/json"]

// Response types

export type Core_AccountsCollection =
  operations["getAccounts"]["responses"]["200"]["content"]["application/json"]

export type Core_AddressReferenceCollection =
  operations["getAllDomainsAddresses"]["responses"]["200"]["content"]["application/json"]

export type Core_AccountAddressReference = components["schemas"]["Core_AccountAddressReference"]

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

export type Core_ComplianceConfigurationsCollection =
  operations["listComplianceConfigurations"]["responses"]["200"]["content"]["application/json"]

export type Core_ComplianceConfiguration =
  operations["getComplianceConfiguration"]["responses"]["200"]["content"]["application/json"]

/**
 * Optional filters for {@link findByAddress} / {@link findByAddressOrThrow}.
 * Both filters are applied client-side; the `/v1/addresses` endpoint only
 * accepts `address` as a query parameter.
 */
export type FindByAddressOptions = {
  /** Disambiguates when the same address exists on multiple ledgers. */
  ledgerId?: LedgerId
  /** Disambiguates when the same address belongs to multiple domains. */
  domainId?: string
}
