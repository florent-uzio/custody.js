import { URLs } from "../constants/urls.js"
import { isUndefined, paginate, sleep } from "../helpers/index.js"
import { CustodyError } from "../models/index.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_AccountAddress,
  Core_AccountAddressReference,
  Core_AccountsCollection,
  Core_AddressesCollection,
  Core_AddressReferenceCollection,
  Core_ApiAccount,
  Core_ApiInitiateParametersComputeResponse,
  Core_ApiManifest,
  Core_ApiParametersComputeStatusResponse,
  Core_BalancesCollection,
  Core_BalanceWithConfirmedAmount,
  Core_ComplianceConfiguration,
  Core_ComplianceConfigurationsCollection,
  Core_ManifestsCollection,
  Core_TransferabilityResponse,
  Core_TrustedDepositInstructions,
  Core_TrustedDepositInstructionsCollection,
  FindByAddressOptions,
  ForceUpdateAccountBalancesPathParams,
  ForceUpdateAccountBalancesQueryParams,
  GenerateNewAccountExternalAddressDeprecatedPathParams,
  GenerateNewAccountExternalAddressDeprecatedQueryParams,
  GenerateNewExternalAddressPathParams,
  GetAccountAddressPathParams,
  GetAccountBalancesPathParams,
  GetAccountBalancesQueryParams,
  GetAccountConfirmedBalancePathParams,
  GetAccountPathParams,
  GetAccountQueryParams,
  GetAccountsPathParams,
  GetAccountsQueryParams,
  GetAddressesPathParams,
  GetAddressesQueryParams,
  GetAllDomainsAddressesQueryParams,
  GetComplianceConfigurationPathParams,
  GetDepositInstructionPathParams,
  GetLatestAddressPathParams,
  GetLatestAddressQueryParams,
  GetManifestPathParams,
  GetManifestsPathParams,
  GetManifestsQueryParams,
  GetParametersComputeStatusPathParams,
  GetTransferabilityPathParams,
  GetTransferabilityQueryParams,
  InitiateParametersComputeBody,
  InitiateParametersComputePathParams,
  ListComplianceConfigurationsPathParams,
  ListComplianceConfigurationsQueryParams,
  ListDepositInstructionsPathParams,
  ListDepositInstructionsQueryParams,
  UpsertComplianceConfigurationBody,
  UpsertComplianceConfigurationPathParams,
  WaitForParametersComputeOptions,
  WaitForParametersComputeResult,
} from "./accounts.types.js"
import { TERMINAL_PARAMETERS_COMPUTE_STATUSES } from "./accounts.types.js"

/**
 * Finds an account by its blockchain address across all domains.
 * Returns `undefined` when no account matches. Throws when the match is
 * ambiguous (multiple results without a `ledgerId` / `domainId` to disambiguate).
 */
export async function findByAddress(
  t: Transport,
  address: string,
  opts: FindByAddressOptions = {},
): Promise<Core_AccountAddressReference | undefined> {
  const { ledgerId, domainId } = opts

  // Paginated rather than single-page: `/v1/addresses` narrows server-side on
  // `address` only, so the `AccountAddressReference` this is after shares the
  // collection with every `DepositInstructionsReference` for the same address.
  // Reading one page could push a real match off the end and report the account
  // as missing. The first request is unchanged — `startingAfter` is `undefined`
  // and dropped — so this only costs extra calls when the server volunteers a
  // cursor.
  const matches: Core_AccountAddressReference[] = []

  for await (const item of paginate((startingAfter) =>
    t.get<Core_AddressReferenceCollection>(URLs.addresses, undefined, { address, startingAfter }),
  )) {
    const isMatch =
      item.type === "AccountAddressReference" &&
      item.address === address &&
      (isUndefined(ledgerId) || item.ledgerId === ledgerId) &&
      (isUndefined(domainId) || item.domainId === domainId)

    if (isMatch) {
      matches.push(item)
      // Two is all the ambiguity check below needs, so stop rather than walking
      // the rest of the collection to count matches nobody reads.
      if (matches.length > 1) break
    }
  }

  if (matches.length === 0) {
    return undefined
  }

  if (matches.length > 1) {
    throw new CustodyError({
      reason: `Multiple accounts found for address ${address}. Please specify ledgerId and/or domainId to disambiguate.`,
    })
  }

  return matches[0]!
}

/**
 * Like {@link findByAddress} but throws a `CustodyError` when no account is
 * found. Use this when the caller treats absence as a programmer error.
 */
export async function findByAddressOrThrow(
  t: Transport,
  address: string,
  opts: FindByAddressOptions = {},
): Promise<Core_AccountAddressReference> {
  const account = await findByAddress(t, address, opts)
  if (isUndefined(account)) {
    throw new CustodyError({
      reason: `Account not found for address ${address}${notFoundSuffix(opts)}`,
    })
  }
  return account
}

function notFoundSuffix({ ledgerId, domainId }: FindByAddressOptions): string {
  const parts: string[] = []
  if (ledgerId) parts.push(`on ledger ${ledgerId}`)
  if (domainId) parts.push(`in domain ${domainId}`)
  return parts.length > 0 ? ` ${parts.join(" ")}` : ""
}

/**
 * Fills in the `type` discriminator the API requires but the generated body
 * type omits, so callers never have to restate the union's only legal value.
 * A caller-supplied `type` wins, which is what makes this forward-compatible if
 * the union gains a second member.
 */
function withParametersComputeType(
  body: InitiateParametersComputeBody,
): InitiateParametersComputeBody {
  return { ...body, type: body.type ?? "cmpt-send" }
}

/**
 * Wait for a parameters computation to reach a terminal status (Completed or Failed).
 * Polls the compute status at regular intervals until it finishes or max retries
 * is reached. `cryptographicFields` is populated on the returned `compute` once
 * the status is `Completed`.
 *
 * A 404 is treated as "not available yet" (e.g. when called immediately after
 * initiating) and is retried within the same polling loop rather than aborting
 * the wait.
 */
async function waitForParametersCompute(
  t: Transport,
  params: GetParametersComputeStatusPathParams,
  options: WaitForParametersComputeOptions = {},
): Promise<WaitForParametersComputeResult> {
  const { maxRetries = 10, intervalMs = 3000, onStatusCheck } = options

  let lastCompute: Core_ApiParametersComputeStatusResponse | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const compute = await t.get<Core_ApiParametersComputeStatusResponse>(
        URLs.accountParametersComputeStatus,
        params,
      )
      lastCompute = compute
      const { status } = compute

      onStatusCheck?.(status, attempt)

      if (TERMINAL_PARAMETERS_COMPUTE_STATUSES.includes(status)) {
        return {
          status,
          isTerminal: true,
          isSuccess: status === "Completed",
          compute,
        }
      }
    } catch (error) {
      if (!(error instanceof CustodyError && error.statusCode === 404)) {
        throw error
      }
      // 404 → the computation is not available yet, keep polling.
    }

    if (attempt < maxRetries) {
      await sleep(intervalMs)
    }
  }

  // Retries exhausted. If the computation never materialized, surface that as a 404.
  if (isUndefined(lastCompute)) {
    throw new CustodyError(
      {
        reason: `parameters computation ${params.computeId} not found after ${maxRetries} attempts`,
      },
      404,
    )
  }

  // The loop returns early on any terminal status, so the last observed
  // computation is necessarily non-terminal here.
  return {
    status: lastCompute.status,
    isTerminal: false,
    isSuccess: false,
    compute: lastCompute,
  }
}

/**
 * Initiates a parameters computation and polls it to a terminal status.
 *
 * Lives at module scope rather than inside {@link createAccounts} because
 * `XrplService` drives the same two calls through its ports to build a
 * confidential send — see `xrpl.buildConfidentialSend`.
 */
export async function initiateParametersComputeAndWait(
  t: Transport,
  params: InitiateParametersComputePathParams,
  body: InitiateParametersComputeBody,
  options?: WaitForParametersComputeOptions,
): Promise<WaitForParametersComputeResult> {
  const { id } = await t.post<Core_ApiInitiateParametersComputeResponse>(
    URLs.accountParametersCompute,
    withParametersComputeType(body),
    params,
    { sign: false },
  )

  return waitForParametersCompute(t, { ...params, computeId: id }, options)
}

export function createAccounts(t: Transport) {
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
    ): Promise<Core_AccountAddress> =>
      t.post(URLs.accountAddresses, undefined, { ...params, ...query }),

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
    ): Promise<void> => t.post(URLs.accountBalancesRefresh, undefined, { ...params, ...query }),

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

    findByAddress: (
      address: string,
      opts?: FindByAddressOptions,
    ): Promise<Core_AccountAddressReference | undefined> => findByAddress(t, address, opts),

    findByAddressOrThrow: (
      address: string,
      opts?: FindByAddressOptions,
    ): Promise<Core_AccountAddressReference> => findByAddressOrThrow(t, address, opts),

    /** @deprecated Use {@link getAccountAddress} instead. */
    getLatestAddress: (
      params: GetLatestAddressPathParams,
      query?: GetLatestAddressQueryParams,
    ): Promise<Core_AccountAddress> => t.get(URLs.accountAddressesLatest, params, query),

    /** @deprecated Use {@link getAccountBalances} instead. */
    getConfirmedBalance: (
      params: GetAccountConfirmedBalancePathParams,
    ): Promise<Core_BalanceWithConfirmedAmount> => t.get(URLs.accountConfirmedBalance, params),

    getTransferability: (
      params: GetTransferabilityPathParams,
      query?: GetTransferabilityQueryParams,
    ): Promise<Core_TransferabilityResponse> => t.get(URLs.accountsTransferability, params, query),

    listDepositInstructions: (
      params: ListDepositInstructionsPathParams,
      query?: ListDepositInstructionsQueryParams,
    ): Promise<Core_TrustedDepositInstructionsCollection> =>
      t.get(URLs.accountDepositInstructions, params, query),

    getDepositInstruction: (
      params: GetDepositInstructionPathParams,
    ): Promise<Core_TrustedDepositInstructions> => t.get(URLs.accountDepositInstruction, params),

    initiateParametersCompute: (
      params: InitiateParametersComputePathParams,
      body: InitiateParametersComputeBody,
    ): Promise<Core_ApiInitiateParametersComputeResponse> =>
      t.post(URLs.accountParametersCompute, withParametersComputeType(body), params, {
        sign: false,
      }),

    getParametersComputeStatus: (
      params: GetParametersComputeStatusPathParams,
    ): Promise<Core_ApiParametersComputeStatusResponse> =>
      t.get(URLs.accountParametersComputeStatus, params),

    getParametersComputeStatusAndWait: (
      params: GetParametersComputeStatusPathParams,
      options?: WaitForParametersComputeOptions,
    ): Promise<WaitForParametersComputeResult> => waitForParametersCompute(t, params, options),

    /**
     * Initiates a parameters computation and waits for it to finish, so the caller
     * gets the `cryptographicFields` needed to build a confidential transfer in
     * a single call.
     */
    initiateParametersComputeAndWait: (
      params: InitiateParametersComputePathParams,
      body: InitiateParametersComputeBody,
      options?: WaitForParametersComputeOptions,
    ): Promise<WaitForParametersComputeResult> =>
      initiateParametersComputeAndWait(t, params, body, options),
  } as const
}
