import { URLs } from "../constants/urls.js"
import { sleep } from "../helpers/index.js"
import type { Transport } from "../transport/index.js"
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
  type DryRunTransactionPathParams,
  type GetTransactionDetailsPathParams,
  type GetTransactionOrderDetailsPathParams,
  type GetTransactionOrdersPathParams,
  type GetTransactionOrdersQueryParams,
  type GetTransactionsPathParams,
  type GetTransactionsQueryParams,
  type GetTransferDetailsPathParams,
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
 * transaction instead of parsing them out of a message.
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
    if (failure || (status && TERMINAL_TRANSACTION_STATUSES.includes(status))) {
      return {
        status,
        isTerminal: true,
        isSuccess: status === "Completed" && !failure,
        transaction,
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
  }
}

export function createTransactions(t: Transport) {
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
     *   when no transaction was ever registered for the order
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
