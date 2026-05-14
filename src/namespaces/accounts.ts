import { URLs } from "../constants/urls.js"
import { isUndefined } from "../helpers/index.js"
import { CustodyError } from "../models/index.js"
import type {
  AccountReference,
  Core_AccountAddress,
  Core_AccountsCollection,
  Core_AddressReferenceCollection,
  Core_AddressesCollection,
  Core_ApiAccount,
  Core_ApiManifest,
  Core_BalancesCollection,
  Core_ComplianceConfiguration,
  Core_ComplianceConfigurationsCollection,
  Core_ManifestsCollection,
  ForceUpdateAccountBalancesPathParams,
  ForceUpdateAccountBalancesQueryParams,
  GenerateNewAccountExternalAddressDeprecatedPathParams,
  GenerateNewAccountExternalAddressDeprecatedQueryParams,
  GenerateNewExternalAddressPathParams,
  GetAccountAddressPathParams,
  GetAccountBalancesPathParams,
  GetAccountBalancesQueryParams,
  GetAccountPathParams,
  GetAccountQueryParams,
  GetAccountsPathParams,
  GetAccountsQueryParams,
  GetAddressesPathParams,
  GetAddressesQueryParams,
  GetAllDomainsAddressesQueryParams,
  GetComplianceConfigurationPathParams,
  GetManifestPathParams,
  GetManifestsPathParams,
  GetManifestsQueryParams,
  ListComplianceConfigurationsPathParams,
  ListComplianceConfigurationsQueryParams,
  UpsertComplianceConfigurationBody,
  UpsertComplianceConfigurationPathParams,
} from "../services/accounts/accounts.types.js"
import type { TypedTransport } from "../transport/index.js"

/**
 * Finds an account by its blockchain address across all domains.
 * Returns `undefined` when no account matches. Throws when the match is
 * ambiguous (multiple results without a `ledgerId` to disambiguate).
 */
export async function findByAddress(
  t: TypedTransport,
  address: string,
  ledgerId?: string,
): Promise<AccountReference | undefined> {
  const addressAcrossDomains = await t.get<Core_AddressReferenceCollection>(
    URLs.addresses,
    undefined,
    { address },
  )

  const matches = addressAcrossDomains.items.filter(
    (item) => item.address === address && (isUndefined(ledgerId) || item.ledgerId === ledgerId),
  )

  if (matches.length === 0) {
    return undefined
  }

  if (matches.length > 1) {
    throw new CustodyError({
      reason: `Multiple accounts found for address ${address}. Please specify ledgerId to disambiguate.`,
    })
  }

  const account = matches[0]!
  return {
    accountId: account.accountId,
    ledgerId: account.ledgerId ?? "",
    address: account.address,
  }
}

/**
 * Like {@link findByAddress} but throws a `CustodyError` when no account is
 * found. Use this when the caller treats absence as a programmer error.
 */
export async function findByAddressOrThrow(
  t: TypedTransport,
  address: string,
  ledgerId?: string,
): Promise<AccountReference> {
  const account = await findByAddress(t, address, ledgerId)
  if (isUndefined(account)) {
    const suffix = ledgerId ? ` on ledger ${ledgerId}` : ""
    throw new CustodyError({ reason: `Account not found for address ${address}${suffix}` })
  }
  return account
}

export function createAccounts(t: TypedTransport) {
  return {
    list: (
      params: GetAccountsPathParams,
      query?: GetAccountsQueryParams,
    ): Promise<Core_AccountsCollection> => t.get(URLs.accounts, params, query),

    allDomainsAddresses: (
      query: GetAllDomainsAddressesQueryParams,
    ): Promise<Core_AddressReferenceCollection> => t.get(URLs.addresses, undefined, query),

    get: (params: GetAccountPathParams, query?: GetAccountQueryParams): Promise<Core_ApiAccount> =>
      t.get(URLs.account, params, query),

    addresses: (
      params: GetAddressesPathParams,
      query?: GetAddressesQueryParams,
    ): Promise<Core_AddressesCollection> => t.get(URLs.accountAddresses, params, query),

    generateNewExternalAddressDeprecated: (
      params: GenerateNewAccountExternalAddressDeprecatedPathParams,
      query: GenerateNewAccountExternalAddressDeprecatedQueryParams,
    ): Promise<Core_AccountAddress> => t.post(URLs.accountAddresses, query, params),

    generateNewExternalAddress: (
      params: GenerateNewExternalAddressPathParams,
    ): Promise<Core_AccountAddress> => t.post(URLs.accountAddressesByLedger, null, params),

    getAccountAddress: (params: GetAccountAddressPathParams): Promise<Core_AccountAddress> =>
      t.get(URLs.accountAddress, params),

    getAccountBalances: (
      params: GetAccountBalancesPathParams,
      query?: GetAccountBalancesQueryParams,
    ): Promise<Core_BalancesCollection> => t.get(URLs.accountBalances, params, query),

    forceUpdateAccountBalances: (
      params: ForceUpdateAccountBalancesPathParams,
      query?: ForceUpdateAccountBalancesQueryParams,
    ): Promise<void> => t.post(URLs.accountBalances, query, params),

    getManifests: (
      params: GetManifestsPathParams,
      query?: GetManifestsQueryParams,
    ): Promise<Core_ManifestsCollection> => t.get(URLs.accountManifests, params, query),

    getManifest: (params: GetManifestPathParams): Promise<Core_ApiManifest> =>
      t.get(URLs.accountManifest, params),

    listComplianceConfigurations: (
      params: ListComplianceConfigurationsPathParams,
      query?: ListComplianceConfigurationsQueryParams,
    ): Promise<Core_ComplianceConfigurationsCollection> =>
      t.get(URLs.complianceConfigurations, params, query),

    getComplianceConfiguration: (
      params: GetComplianceConfigurationPathParams,
    ): Promise<Core_ComplianceConfiguration> => t.get(URLs.accountComplianceConfiguration, params),

    upsertComplianceConfiguration: (
      params: UpsertComplianceConfigurationPathParams,
      body: UpsertComplianceConfigurationBody,
    ): Promise<Core_ComplianceConfiguration> =>
      t.put(URLs.accountComplianceConfiguration, body, params),

    findByAddress: (address: string, ledgerId?: string): Promise<AccountReference | undefined> =>
      findByAddress(t, address, ledgerId),

    findByAddressOrThrow: (address: string, ledgerId?: string): Promise<AccountReference> =>
      findByAddressOrThrow(t, address, ledgerId),
  } as const
}
