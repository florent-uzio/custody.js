import type {
  AccountSet,
  BatchSigner,
  Clawback,
  DepositPreauth,
  MPTokenAuthorize,
  MPTokenIssuanceCreate,
  MPTokenIssuanceDestroy,
  MPTokenIssuanceSet,
  OfferCreate,
  Payment,
  TrustSet,
} from "xrpl"
import type { components } from "../../models/custody-types.js"
import type { Prettify } from "../../type-utils/index.js"
import type { AccountReference } from "../accounts/index.js"
import type { DomainUserReference } from "../domain-resolver/index.js"

/**
 * Combined context required to build an intent.
 * Contains domain/user reference and account reference.
 */
export type IntentContext = DomainUserReference & AccountReference

// Payments

export type Core_XrplOperation_Payment = components["schemas"]["Core_XrplOperation_Payment"]

export type CustodyPayment = Prettify<
  Pick<Payment, "Account"> & Omit<Core_XrplOperation_Payment, "type">
>

// Trustlines

export type Core_XrplOperation_TrustSet = components["schemas"]["Core_XrplOperation_TrustSet"]

export type CustodyTrustline = Prettify<
  Pick<TrustSet, "Account"> & Omit<Core_XrplOperation_TrustSet, "type">
>

// Deposit Preauth

export type Core_XrplOperation_DepositPreauth =
  components["schemas"]["Core_XrplOperation_DepositPreauth"]

export type CustodyDepositPreauth = Prettify<
  Pick<DepositPreauth, "Account"> & Omit<Core_XrplOperation_DepositPreauth, "type">
>

// Clawback

export type Core_XrplOperation_Clawback = components["schemas"]["Core_XrplOperation_Clawback"]
export type CustodyClawback = Prettify<
  Pick<Clawback, "Account"> & Omit<Core_XrplOperation_Clawback, "type">
>

// MPTokenAuthorize

export type Core_XrplOperation_MPTokenAuthorize =
  components["schemas"]["Core_XrplOperation_MPTokenAuthorize"]
export type CustodyMpTokenAuthorize = Prettify<
  Pick<MPTokenAuthorize, "Account"> & Omit<Core_XrplOperation_MPTokenAuthorize, "type">
>

// MPTokenIssuanceCreate
type Core_XrplOperation_MPTokenIssuanceCreate =
  components["schemas"]["Core_XrplOperation_MPTokenIssuanceCreate"]
export type CustodyMpTokenIssuanceCreate = Prettify<
  Pick<MPTokenIssuanceCreate, "Account"> & Omit<Core_XrplOperation_MPTokenIssuanceCreate, "type">
>

// MPTokenIssuanceSet
type Core_XrplOperation_MPTokenIssuanceSet =
  components["schemas"]["Core_XrplOperation_MPTokenIssuanceSet"]
export type CustodyMpTokenIssuanceSet = Prettify<
  Pick<MPTokenIssuanceSet, "Account"> & Omit<Core_XrplOperation_MPTokenIssuanceSet, "type">
>

// MPTokenIssuanceDestroy
type Core_XrplOperation_MPTokenIssuanceDestroy =
  components["schemas"]["Core_XrplOperation_MPTokenIssuanceDestroy"]
export type CustodyMpTokenIssuanceDestroy = Prettify<
  Pick<MPTokenIssuanceDestroy, "Account"> & Omit<Core_XrplOperation_MPTokenIssuanceDestroy, "type">
>

// OfferCreate

export type Core_XrplOperation_OfferCreate = components["schemas"]["Core_XrplOperation_OfferCreate"]
export type CustodyOfferCreate = Prettify<
  Pick<OfferCreate, "Account"> & Omit<Core_XrplOperation_OfferCreate, "type">
>

// TicketCreate

// export type Core_XrplOperation_TicketCreate =
//   components["schemas"]["Core_XrplOperation_TicketCreate"]
// export type CustodyTicketCreate = Prettify<
//   Pick<TicketCreate, "Account"> & Omit<Core_XrplOperation_TicketCreate, "type">
// >

// AccountSet

export type Core_XrplOperation_AccountSet = components["schemas"]["Core_XrplOperation_AccountSet"]
export type CustodyAccountSet = Prettify<
  Pick<AccountSet, "Account"> & Omit<Core_XrplOperation_AccountSet, "type">
>

// Batch

//TODO: delete comment once Batch is supported
// export type Core_XrplOperation_Batch = components["schemas"]["Core_XrplOperation_Batch"]
// export type CustodyBatch = Prettify<Pick<Batch, "Account"> & Omit<Core_XrplOperation_Batch, "type">>

// Batch Adapters

//TODO: delete comment once Batch is supported
// export type CustodyBatchSigner = CustodyBatch["batchSigners"][number]
// export type CustodyInnerTransaction = CustodyBatch["innerTransactions"][number]
// export type CustodyOperation = CustodyInnerTransaction["operation"]

export type CustodyAccountSetFlag = CustodyAccountSet["setFlag"]

// General

export type XrplIntentOptions = {
  /**
   * Domain ID to use for the payment. If not provided and user has multiple domains, an error will be thrown.
   */
  domainId?: string
  /**
   * Fee strategy priority. Defaults to "Low".
   */
  feePriority?: "Low" | "Medium" | "High"
  /**
   * Number of days until the intent expires. Defaults to 1.
   */
  expiryDays?: number
  /**
   * Custom properties to include in the intent request.
   */
  requestCustomProperties?: Record<string, string>
  /**
   * Custom properties to include in the intent payload.
   */
  payloadCustomProperties?: Record<string, string>
  /**
   * Request ID to use for the intent. If not provided, a new UUID will be generated.
   */
  requestId?: string
  /**
   * Payload ID to use for the intent. If not provided, a new UUID will be generated.
   */
  payloadId?: string
}

export type Core_XrplOperation = components["schemas"]["Core_XrplOperation"]

export type BuildTransactionIntentProps = {
  operation: Core_XrplOperation
  context: IntentContext
  options: XrplIntentOptions
}

// Raw sign & wait

/**
 * Options for polling the manifest signature after a raw sign intent.
 */
export type WaitForSignatureOptions = {
  /** Maximum number of polling attempts (default: 3) */
  maxRetries?: number
  /** Interval between polling attempts in milliseconds (default: 3000) */
  intervalMs?: number
  /** Callback on each polling attempt */
  onAttempt?: (attempt: number) => void
}

/**
 * Options for rawSignAndWait: intent options + polling configuration.
 */
export type RawSignAndWaitOptions = XrplIntentOptions & {
  /** Polling options for waiting for the manifest signature */
  polling?: WaitForSignatureOptions
}

/**
 * Result of rawSignAndWait.
 */
export type RawSignAndWaitResult = {
  /** The signature in uppercase hex */
  signature: string
  /** The compressed secp256k1 public key in uppercase hex */
  signingPubKey: string
}

/**
 * Result of rawSignInnerBatchAndWait.
 * Extends RawSignAndWaitResult with batch signer representations.
 */
export type RawSignInnerBatchAndWaitResult = RawSignAndWaitResult & {
  /** The batch signer in xrpl.js format */
  batchSigner: BatchSigner
  /** The batch signer in Ripple Custody API format */
  //TODO: delete comment once Batch is supported
  // custodyBatchSigner: CustodyBatchSigner
}

type BatchSignerLookup = { accountId?: never; ledgerId?: never }
type BatchSignerDirect = {
  /** Custody account ID — skips the address lookup when provided with ledgerId */
  accountId: string
  /** Ledger ID for the account */
  ledgerId: string
}

/**
 * Options for rawSignInnerBatch / rawSignInnerBatchAndWait: intent options + polling configuration.
 *
 * When `accountId` and `ledgerId` are provided, the address-to-account lookup is
 * skipped, saving an API call.
 */
export type RawSignInnerBatchOptions = XrplIntentOptions & {
  /** Polling options for waiting for the manifest signature */
  polling?: WaitForSignatureOptions
} & (BatchSignerLookup | BatchSignerDirect)
