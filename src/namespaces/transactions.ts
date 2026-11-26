import { URLs } from "../constants/urls.js"
import { isUndefined, paginate, sleep } from "../helpers/index.js"
import { CustodyError } from "../models/index.js"
import type { Transport } from "../transport/index.js"
import { createIntents } from "./intents.js"
import {
  TERMINAL_TRANSACTION_STATUSES,
  type Core_DryRunTransactionParameters,
  type Core_TransactionDetails,
  type Core_TransactionDryRun,
  type Core_TransactionsCollection,
  type Core_TransferDetails,
  type Core_TransfersCollection,
  type Core_TrustedTransactionOrderDetails,
  type Core_TrustedTransactionOrdersCollection,
  type Core_v0_ReleaseQuarantinedTransfers,
  type DryRunTransactionPathParams,
  type GetTransactionDetailsPathParams,
  type GetTransactionOrderDetailsPathParams,
  type GetTransactionOrdersPathParams,
  type GetTransactionOrdersQueryParams,
  type GetTransactionsPathParams,
  type GetTransactionsQueryParams,
  type GetTransferDetailsPathParams,
  type ReleaseQuarantinedTransfersAndWaitOptions,
  type ReleaseQuarantinedTransfersAndWaitResult,
  type ReleaseQuarantinedTransfersOptions,
  type ReleaseQuarantinedTransfersParams,
  type ReleaseQuarantinedTransfersResult,
  type TransferTransactionOrderPathParams,
  type TransferTransactionOrderQueryParams,
  type WaitForTransactionOptions,
  type WaitForTransactionResult,
} from "./transactions.types.js"

/**
 * Picks the transaction an order is currently represented by.
 *
 * An order maps to more than one transaction when custody replaces one — a
 * fee-bumped resubmission leaves the superseded attempt behind under the same
 * `orderReference.Id`, marked `Replaced` on the ledger. Only the surviving
 * attempt says anything about whether the order landed, so the replaced ones are
 * dropped and the newest of the rest is taken.
 *
 * Sorted here rather than by the query, so the choice does not depend on the
 * endpoint's default ordering: `registeredAt` is required on every transaction,
 * which makes the local sort total.
 */
function currentTransaction(items: Core_TransactionDetails[]): Core_TransactionDetails | undefined {
  return items
    .filter(({ ledgerTransactionData }) => ledgerTransactionData?.ledgerStatus !== "Replaced")
    .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))[0]
}

/**
 * Says in one sentence why a terminal transaction is not a success.
 *
 * The three surfaces a failure can surface on are mutually exclusive in
 * practice but not in the types, so they are ordered most-specific first: the
 * ledger rejecting the transaction says more than custody's `Completed`, and
 * `Interrupted` carries a cause and a message where `Failed` carries a hint.
 */
function failureReason(transaction: Core_TransactionDetails): string {
  const { id, processing, ledgerTransactionData } = transaction
  const failure = ledgerTransactionData?.failure

  if (!isUndefined(failure)) {
    return `Transaction ${id} was rejected by the ledger (${failure}).`
  }

  if (processing?.status === "Interrupted") {
    return `Transaction ${id} was interrupted (${processing.cause}): ${processing.reason}`
  }

  if (processing?.status === "Failed") {
    return `Transaction ${id} failed before it reached the ledger (${processing.hint}).`
  }

  return `Transaction ${id} did not complete (status: ${processing?.status}).`
}

/**
 * Wait for the transaction a transaction order produced to reach a terminal
 * state, polling until it does or the attempts run out.
 *
 * An executed intent only means custody accepted the order. The transaction it
 * produces is registered against that order some time afterwards, and can then
 * still fail — while custody prepares and broadcasts it (`Failed`, carrying a
 * hint such as `InvalidUserPayload`), or once it is on chain
 * (`ledgerTransactionData.failure`). So neither an empty result nor a
 * non-terminal status means "nothing happened"; both mean "not yet".
 *
 * Never throws on a failed transaction — the outcome is reported through
 * `isSuccess` / `isTerminal` so the caller can read `processing.hint`,
 * `processing.cause` and `ledgerTransactionData.failure` off the returned
 * transaction instead of parsing them out of a message. `reason` says the same
 * thing in one sentence, for the log line or the error the caller throws.
 *
 * Takes the lookup as a callback rather than a transport, so `XrplService` can
 * drive the same loop through its ports instead of restating it.
 */
export async function waitForOrderTransaction(
  listByOrder: () => Promise<Core_TransactionsCollection>,
  options: WaitForTransactionOptions = {},
): Promise<WaitForTransactionResult> {
  const { maxRetries = 10, intervalMs = 3000, onStatusCheck } = options

  let lastTransaction: Core_TransactionDetails | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const { items } = await listByOrder()

    const transaction = currentTransaction(items)
    const status = transaction?.processing?.status
    const failure = transaction?.ledgerTransactionData?.failure

    if (transaction) {
      lastTransaction = transaction
    }

    onStatusCheck?.(status, attempt)

    // An on-chain failure is terminal in its own right: custody has done its
    // part, so its processing status can read `Completed` on a transaction the
    // ledger threw out.
    if (transaction && (failure || (status && TERMINAL_TRANSACTION_STATUSES.includes(status)))) {
      const isSuccess = status === "Completed" && !failure

      return {
        status,
        isTerminal: true,
        isSuccess,
        transaction,
        reason: isSuccess ? undefined : failureReason(transaction),
      }
    }

    if (attempt < maxRetries) {
      await sleep(intervalMs)
    }
  }

  // Retries exhausted, on a transaction that is still in flight — or that was
  // never registered, in which case `transaction` is left undefined.
  return {
    status: lastTransaction?.processing?.status,
    isTerminal: false,
    isSuccess: false,
    transaction: lastTransaction,
    reason: isUndefined(lastTransaction)
      ? `No transaction was registered for the order after ${maxRetries} attempts.`
      : `Transaction ${lastTransaction.id} was still in flight after ${maxRetries} attempts (status: ${lastTransaction.processing?.status}).`,
  }
}

/**
 * Reads the ids of every transfer currently quarantined for an account,
 * walking every page of the collection.
 *
 * Filters on the deprecated `quarantined: true` rather than
 * `quarantineStatus: "Quarantined"`: some Ripple Custody versions answer the
 * latter with a 500 (#238), and the two return the same rows for this case.
 * The boolean only loses `Released` vs `Skipped`, which a release never needs.
 *
 * With `tickerIds`, runs one walk per ticker (the endpoint filters on a single
 * `tickerId`) and returns their union.
 *
 * Takes the lookup as a callback rather than a transport, so `XrplService` can
 * drive it through its ports.
 */
export async function collectQuarantinedTransferIds(
  listTransfers: (query: TransferTransactionOrderQueryParams) => Promise<Core_TransfersCollection>,
  accountId: string,
  tickerIds?: string[],
): Promise<string[]> {
  const ids = new Set<string>()

  for (const tickerId of tickerIds ?? [undefined]) {
    const fetchPage = (startingAfter: string | undefined) =>
      listTransfers({
        "recipient.accountId": [accountId],
        quarantined: true,
        limit: 100,
        startingAfter,
        ...(!isUndefined(tickerId) && { tickerId }),
      })

    for await (const transfer of paginate(fetchPage)) {
      ids.add(transfer.id)
    }
  }

  return [...ids]
}

/**
 * Reads the explicit transfer ids off a release selection: the list for
 * `{ transferIds }`, `undefined` for `{ all: true }`.
 *
 * The types already require exactly one of the two; this catches untyped
 * callers that pass neither, before anything is looked up or proposed.
 */
export function explicitTransferIds(
  selection: { all?: true; transferIds?: string[] },
  method: string,
): string[] | undefined {
  if (selection.all === true) return undefined

  if (!Array.isArray(selection.transferIds)) {
    throw new CustodyError({
      reason:
        `${method} needs either \`transferIds\` or \`all: true\`. ` +
        "A release bypasses custody's compliance review, so nothing is released by default.",
    })
  }

  return selection.transferIds
}

/** The release intent's payload. */
export const releasePayload = (
  accountId: string,
  transferIds: string[],
): Core_v0_ReleaseQuarantinedTransfers => ({
  type: "v0_ReleaseQuarantinedTransfers",
  accountId,
  transferIds,
})

export function createTransactions(t: Transport) {
  const intents = createIntents(t)

  /** Resolves a selection to the transfer ids it names. */
  const selectTransferIds = async (
    params: ReleaseQuarantinedTransfersParams,
  ): Promise<string[]> => {
    const explicit = explicitTransferIds(params, "transactions.releaseQuarantinedTransfers")
    if (!isUndefined(explicit)) return explicit

    return collectQuarantinedTransferIds(
      (query) =>
        t.get<Core_TransfersCollection>(
          URLs.transactionTransfers,
          { domainId: params.domainId },
          query,
        ),
      params.accountId,
      isUndefined(params.tickerId) ? undefined : [params.tickerId],
    )
  }

  return {
    orders: (
      params: GetTransactionOrdersPathParams,
      query?: GetTransactionOrdersQueryParams,
    ): Promise<Core_TrustedTransactionOrdersCollection> =>
      t.get(URLs.transactionOrders, params, query),

    order: (
      params: GetTransactionOrderDetailsPathParams,
    ): Promise<Core_TrustedTransactionOrderDetails> => t.get(URLs.transactionOrder, params),

    transfers: (
      params: TransferTransactionOrderPathParams,
      query?: TransferTransactionOrderQueryParams,
    ): Promise<Core_TransfersCollection> => t.get(URLs.transactionTransfers, params, query),

    transfer: (params: GetTransferDetailsPathParams): Promise<Core_TransferDetails> =>
      t.get(URLs.transactionTransfer, params),

    /**
     * Releases the transfers custody holds in quarantine for an account, so
     * the funds become spendable.
     *
     * A quarantined amount is unavailable: spending it fails the dry run with
     * `CurrentlyNotEnoughFunds` although the funds are on the ledger. With
     * `all: true`, reads every quarantined transfer of the account (every
     * page, optionally for one `tickerId`) and proposes one
     * `v0_ReleaseQuarantinedTransfers` intent; explicit `transferIds` are
     * proposed as given.
     *
     * Works by custody account on any ledger. For an XRPL address, prefer
     * `xrpl.releaseQuarantinedTransfers`, which resolves the address and an
     * MPT issuance's tickers itself.
     *
     * A release bypasses custody's compliance review of those transfers, so
     * the selection has no default. Proposes nothing (`proposed: false`) when
     * nothing is quarantined; custody registers an incoming transfer a few
     * seconds after the ledger validates it, so retrying is the caller's call.
     *
     * @param params - Domain, account, and which quarantined transfers to release
     * @param options - Envelope fields
     * @returns `proposed: false` when there was nothing to release; otherwise
     *   the release intent's ids and the transfers it covers
     * @throws {CustodyError} If the selection names neither `transferIds` nor
     *   `all: true`, or the propose call is rejected
     */
    releaseQuarantinedTransfers: async (
      params: ReleaseQuarantinedTransfersParams,
      options: ReleaseQuarantinedTransfersOptions = {},
    ): Promise<ReleaseQuarantinedTransfersResult> => {
      const { domainId, accountId } = params
      const transferIds = await selectTransferIds(params)

      if (transferIds.length === 0) return { proposed: false, transferIds: [], domainId }

      const result = await intents.proposePayload(releasePayload(accountId, transferIds), {
        ...options,
        domainId,
      })

      return { ...result, proposed: true, transferIds }
    },

    /**
     * `releaseQuarantinedTransfers`, then polls the release intent to a
     * terminal status. A release has no ledger transaction, so it is done when
     * its intent is. Same approval caveat as `intents.proposeAndWait`: a human
     * approver outlasts the default 30-second wait, which then reports
     * `isTerminal: false` rather than failing.
     *
     * @param params - Domain, account, and which quarantined transfers to release
     * @param options - Envelope fields, plus polling configuration
     * @returns `proposed: false` when there was nothing to release; otherwise
     *   the intent's wait outcome, its ids and the transfers it covers
     * @throws {CustodyError} As `releaseQuarantinedTransfers`, or if the
     *   intent is never registered
     */
    releaseQuarantinedTransfersAndWait: async (
      params: ReleaseQuarantinedTransfersParams,
      options: ReleaseQuarantinedTransfersAndWaitOptions = {},
    ): Promise<ReleaseQuarantinedTransfersAndWaitResult> => {
      const { domainId, accountId } = params
      const transferIds = await selectTransferIds(params)

      if (transferIds.length === 0) return { proposed: false, transferIds: [], domainId }

      const result = await intents.proposeAndWait(releasePayload(accountId, transferIds), {
        ...options,
        domainId,
      })

      return { ...result, proposed: true, transferIds }
    },

    transactions: (
      params: GetTransactionsPathParams,
      query?: GetTransactionsQueryParams,
    ): Promise<Core_TransactionsCollection> => t.get(URLs.transactions, params, query),

    transaction: (params: GetTransactionDetailsPathParams): Promise<Core_TransactionDetails> =>
      t.get(URLs.transaction, params),

    /**
     * Waits for the transaction a transaction order produced to reach a terminal
     * state, and reports whether it completed and the ledger accepted it.
     *
     * The one to reach for after `intents.getAndWait`, when the next step
     * depends on ledger state this one writes: an intent reporting `Executed`
     * only means custody accepted the order, not that the transaction landed.
     *
     * The order ID is the intent payload ID — read it off the `payloadId`
     * `xrpl.proposeIntent` returns, or pin it yourself with
     * `options.payloadId`.
     *
     * @param params - Domain and the ID of the transaction order
     * @param options - Polling configuration (default: 10 attempts, 3s apart)
     * @returns The terminal state, or the last state observed before the
     *   attempts ran out (`isTerminal: false`); `transaction` is `undefined`
     *   when no transaction was ever registered for the order, and `reason`
     *   says in one sentence why `isSuccess` is false
     */
    byOrderAndWait: (
      { domainId, transactionOrderId }: GetTransactionOrderDetailsPathParams,
      options?: WaitForTransactionOptions,
    ): Promise<WaitForTransactionResult> =>
      waitForOrderTransaction(
        () =>
          t.get<Core_TransactionsCollection>(
            URLs.transactions,
            { domainId },
            { "orderReference.Id": transactionOrderId },
          ),
        options,
      ),

    dryRun: (
      params: DryRunTransactionPathParams,
      body: Core_DryRunTransactionParameters,
    ): Promise<Core_TransactionDryRun> =>
      t.post(URLs.transactionsDryRun, body, params, { sign: false }),
  } as const
}
