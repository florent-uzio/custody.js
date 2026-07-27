import type { components, operations } from "../models/custody-types.js"
import type { LedgerId } from "../models/ledger-ids.js"
import type { Prettify } from "../type-utils/prettify.js"

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

export type GetLatestAddressPathParams = operations["getLatestAddress"]["parameters"]["path"]
export type GetLatestAddressQueryParams = operations["getLatestAddress"]["parameters"]["query"]

export type GetAccountConfirmedBalancePathParams =
  operations["getAccountConfirmedBalance"]["parameters"]["path"]

export type GetTransferabilityPathParams = operations["transferability"]["parameters"]["path"]
export type GetTransferabilityQueryParams = operations["transferability"]["parameters"]["query"]

export type ListDepositInstructionsPathParams =
  operations["deposit-instructions"]["parameters"]["path"]
export type ListDepositInstructionsQueryParams =
  operations["deposit-instructions"]["parameters"]["query"]

export type GetDepositInstructionPathParams =
  operations["deposit-instructions-by-id"]["parameters"]["path"]

export type InitiateCmptComputePathParams = operations["initiateCmptCompute"]["parameters"]["path"]
export type InitiateCmptComputeBody =
  operations["initiateCmptCompute"]["requestBody"]["content"]["application/json"]

export type GetCmptComputeStatusPathParams =
  operations["getCmptComputeStatus"]["parameters"]["path"]

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

export type Core_BalanceWithConfirmedAmount =
  operations["getAccountConfirmedBalance"]["responses"]["200"]["content"]["application/json"]

export type Core_TransferabilityResponse =
  operations["transferability"]["responses"]["200"]["content"]["application/json"]

export type Core_TrustedDepositInstructionsCollection =
  operations["deposit-instructions"]["responses"]["200"]["content"]["application/json"]

export type Core_TrustedDepositInstructions =
  operations["deposit-instructions-by-id"]["responses"]["200"]["content"]["application/json"]

/**
 * Statuses returned by the cMPT compute endpoints. `Pending` and `Preparing`
 * are transient; `Completed` and `Failed` are terminal (`cryptographicFields`
 * is only populated on `Completed`).
 *
 * Trailing `(string & {})` keeps the union assignable from any string, so the
 * SDK never blocks consumers when the API adds a new status.
 *
 * TODO: remove this type and drop the `status` overrides below once the
 * OpenAPI spec declares the enum — the generated type will then carry the
 * literals itself.
 */
export type CmptComputeStatus = "Pending" | "Preparing" | "Completed" | "Failed" | (string & {})

export type Core_ApiInitiateCmptComputeResponse = Prettify<
  Omit<
    operations["initiateCmptCompute"]["responses"]["200"]["content"]["application/json"],
    "status"
  > & { status: CmptComputeStatus }
>

export type Core_ApiCmptComputeStatusResponse = Prettify<
  Omit<
    operations["getCmptComputeStatus"]["responses"]["200"]["content"]["application/json"],
    "status"
  > & { status: CmptComputeStatus }
>

/** Statuses that indicate the cMPT computation has finished processing */
export const TERMINAL_CMPT_COMPUTE_STATUSES: CmptComputeStatus[] = ["Completed", "Failed"]

/**
 * Options for waiting for a cMPT computation to finish.
 */
export type WaitForCmptComputeOptions = {
  /**
   * Maximum number of polling attempts (default: 10). Also bounds how long a
   * not-yet-available (404) computation is waited for, since 404s are retried
   * within the same loop.
   */
  maxRetries?: number
  /** Interval between polling attempts in milliseconds (default: 3000) */
  intervalMs?: number
  /**
   * Callback function called on each status check.
   * Useful for logging or updating UI.
   */
  onStatusCheck?: (status: CmptComputeStatus, attempt: number) => void
}

/**
 * Result of waiting for a cMPT computation to finish.
 */
export type WaitForCmptComputeResult = {
  /** The final status of the computation */
  status: CmptComputeStatus
  /** Whether the computation reached a terminal status */
  isTerminal: boolean
  /** Whether the computation completed successfully */
  isSuccess: boolean
  /** The full status response — `cryptographicFields` is populated on `Completed` */
  compute: Core_ApiCmptComputeStatusResponse
}

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
