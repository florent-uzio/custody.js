import type { components, operations } from "../models/custody-types.js"

// Request types
export type GetTransactionOrdersPathParams = operations["getOrders"]["parameters"]["path"]
export type GetTransactionOrdersQueryParams = operations["getOrders"]["parameters"]["query"]

export type GetTransactionOrderDetailsPathParams = operations["getOrder"]["parameters"]["path"]

export type TransferTransactionOrderPathParams = operations["getTransfers"]["parameters"]["path"]
export type TransferTransactionOrderQueryParams = operations["getTransfers"]["parameters"]["query"]

export type GetTransferDetailsPathParams = operations["getTransfer"]["parameters"]["path"]

export type GetTransactionsPathParams = operations["getTransactions"]["parameters"]["path"]
export type GetTransactionsQueryParams = operations["getTransactions"]["parameters"]["query"]

export type GetTransactionDetailsPathParams = operations["getTransaction"]["parameters"]["path"]
export type GetTransactionDetailsQueryParams = operations["getTransaction"]["parameters"]["query"]

export type DryRunTransactionPathParams = operations["dryRunTransaction"]["parameters"]["path"]
export type Core_DryRunTransactionParameters =
  operations["dryRunTransaction"]["requestBody"]["content"]["application/json"]

// Response types
export type Core_TrustedTransactionOrdersCollection =
  components["schemas"]["Core_TrustedTransactionOrdersCollection"]

export type Core_TrustedTransactionOrderDetails =
  components["schemas"]["Core_TrustedTransactionOrder"]

export type Core_TransfersCollection = components["schemas"]["Core_TransfersCollection"]

export type Core_TransferDetails = components["schemas"]["Core_ApiTransfer"]

export type Core_TransactionsCollection = components["schemas"]["Core_TransactionsCollection"]

export type Core_TransactionDetails = components["schemas"]["Core_ApiTransaction"]

export type Core_TransactionDryRun = components["schemas"]["Core_TransactionDryRun"]

export type Core_TransactionProcessingStatus =
  components["schemas"]["Core_TransactionProcessingStatus"]

/**
 * Processing statuses that mean custody has finished with the transaction, one
 * way or another.
 *
 * `Completed` is not on its own a success: a transaction the ledger rejected is
 * still `Completed` from custody's side, with the rejection reported separately
 * as `ledgerTransactionData.failure`. See `WaitForTransactionResult.isSuccess`.
 */
export const TERMINAL_TRANSACTION_STATUSES: Core_TransactionProcessingStatus[] = [
  "Completed",
  "Failed",
  "Interrupted",
]

/** Processing statuses that mean the transaction is still on its way. */
export const PENDING_TRANSACTION_STATUSES: Core_TransactionProcessingStatus[] = [
  "Pending",
  "Preparing",
  "Reserved",
  "Prepared",
  "Broadcasting",
]

/**
 * Options for waiting on the transaction a transaction order produced.
 */
export type WaitForTransactionOptions = {
  /**
   * Maximum number of polling attempts (default: 10). Also bounds how long a
   * not-yet-registered transaction is waited for, since custody registers the
   * transaction against its order some time after the intent reports
   * `Executed`.
   */
  maxRetries?: number
  /** Interval between polling attempts in milliseconds (default: 3000) */
  intervalMs?: number
  /**
   * Callback function called on each status check. `undefined` is the status of
   * a transaction that is not registered yet, or one custody has registered but
   * not started processing.
   */
  onStatusCheck?: (status: Core_TransactionProcessingStatus | undefined, attempt: number) => void
}

/**
 * Result of waiting on the transaction a transaction order produced.
 */
export type WaitForTransactionResult = {
  /** The last observed processing status, `undefined` if there was none to observe */
  status?: Core_TransactionProcessingStatus
  /** Whether the transaction reached a terminal state */
  isTerminal: boolean
  /**
   * Whether the transaction completed *and* the ledger accepted it — i.e. the
   * state a caller can safely build the next transaction on.
   *
   * Both halves are needed. Custody reports `Completed` once it is done with the
   * transaction, which includes transactions the ledger then rejected; those
   * carry a `ledgerTransactionData.failure` of `FailedOnChain` or
   * `PartiallyFailedOnChain`.
   */
  isSuccess: boolean
  /**
   * The full transaction, `undefined` when custody had registered none for the
   * order by the time the attempts ran out — which is what distinguishes "the
   * order never produced a transaction" from "it produced one that is still in
   * flight".
   */
  transaction?: Core_TransactionDetails
}
