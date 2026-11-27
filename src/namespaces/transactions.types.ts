import type { components, operations } from "../models/custody-types.js"
import type { Prettify } from "../type-utils/index.js"
import type {
  IntentEnvelopeOptions,
  ProposePayloadAndWaitOptions,
  ProposePayloadAndWaitResult,
  ProposePayloadResult,
} from "./intents.types.js"

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
  /**
   * One sentence saying why `isSuccess` is false, `undefined` when it is true.
   *
   * A convenience for logs and thrown errors, composed from whichever of
   * `processing.hint`, `processing.cause` / `processing.reason` and
   * `ledgerTransactionData.failure` applies — the same assembly every caller
   * was writing by hand. It is a message, not a contract: narrow on `status`
   * and read the transaction for anything the code has to branch on.
   */
  reason?: string
}

// Quarantine release

export type Core_v0_ReleaseQuarantinedTransfers =
  components["schemas"]["Core_v0_ReleaseQuarantinedTransfers"]

/** Release exactly these transfers. */
export type ReleaseTransferIdsSelection = {
  /** The transfers to release. Passed to custody as-is, unchecked. */
  transferIds: string[]
  all?: never
  tickerId?: never
}

/** Release every transfer currently quarantined for the account. */
export type ReleaseAllSelection = {
  all: true
  /** Only release transfers of this ticker. */
  tickerId?: string
  transferIds?: never
}

/**
 * Which of an account's quarantined transfers to release: exactly one of
 * explicit `transferIds`, or `all: true` (optionally narrowed to one ticker).
 *
 * There is deliberately no default. A release bypasses custody's compliance
 * review of those transfers, so "release everything" has to be asked for by
 * name rather than fall out of an omitted field.
 */
export type QuarantinedTransferSelection = ReleaseTransferIdsSelection | ReleaseAllSelection

/** Parameters of `transactions.releaseQuarantinedTransfers`. */
export type ReleaseQuarantinedTransfersParams = {
  /** Domain the account belongs to. */
  domainId: string
  /** Custody account (UUID) the quarantined transfers were received by. */
  accountId: string
} & QuarantinedTransferSelection

/** Envelope options for a release. The domain comes from the params. */
export type ReleaseQuarantinedTransfersOptions = Omit<IntentEnvelopeOptions, "domainId">

/** Envelope options for a release, plus how long to wait for its intent. */
export type ReleaseQuarantinedTransfersAndWaitOptions = Omit<
  ProposePayloadAndWaitOptions,
  "domainId"
>

/**
 * Outcome of a release that found nothing to release: no intent was proposed.
 *
 * Custody registers an incoming transfer a few seconds after the ledger
 * validates it, so this can be the answer straight after a receive. That is
 * the caller's to retry; the release does not poll for transfers to appear.
 */
export type NothingToRelease = {
  proposed: false
  transferIds: []
  /** The domain the lookup ran in */
  domainId: string
}

/**
 * Outcome of `releaseQuarantinedTransfers`: either nothing to release, or the
 * ids of the release intent and the transfers it covers.
 */
export type ReleaseQuarantinedTransfersResult =
  | NothingToRelease
  | Prettify<
      ProposePayloadResult & {
        proposed: true
        /** The transfers the release intent covers */
        transferIds: string[]
      }
    >

/**
 * Outcome of `releaseQuarantinedTransfersAndWait`: either nothing to release,
 * or the release intent's wait outcome ({@link ProposePayloadAndWaitResult})
 * and the transfers it covers. A release has no ledger transaction behind it,
 * so it is finished when its intent is.
 */
export type ReleaseQuarantinedTransfersAndWaitResult =
  | NothingToRelease
  | Prettify<
      ProposePayloadAndWaitResult & {
        proposed: true
        /** The transfers the release intent covers */
        transferIds: string[]
      }
    >
