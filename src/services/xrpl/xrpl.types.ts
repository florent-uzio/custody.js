import type {
  AccountSet,
  Batch,
  BatchSigner,
  Clawback,
  DepositPreauth,
  MPTokenAuthorize,
  MPTokenIssuanceCreate,
  MPTokenIssuanceDestroy,
  MPTokenIssuanceSet,
  OfferCreate,
  Payment,
  SubmittableTransaction,
  TicketCreate,
  TrustSet,
} from "xrpl"
import type { components } from "../../models/custody-types.js"
import type { DomainUserReference } from "../../models/domain-resolver.js"
import type { XrplLedgerId } from "../../models/ledger-ids.js"
import type { Core_IntentResponse } from "../../namespaces/intents.types.js"
import type { Prettify } from "../../type-utils/index.js"

/**
 * Minimum set of account fields required to build an XRPL intent.
 * Consumed by `IntentContext`. Not an API response shape — see
 * `Core_AccountAddressReference` for the full address-lookup result.
 */
export type XrplAccountReference = {
  accountId: string
  ledgerId: XrplLedgerId
  address: string
}

/**
 * Combined context required to build an intent.
 * Contains domain/user reference and account reference.
 */
export type IntentContext = DomainUserReference & XrplAccountReference

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

export type Core_XrplOperation_TicketCreate =
  components["schemas"]["Core_XrplOperation_TicketCreate"]
export type CustodyTicketCreate = Prettify<
  Pick<TicketCreate, "Account"> & Omit<Core_XrplOperation_TicketCreate, "type">
>

// AccountSet

export type Core_XrplOperation_AccountSet = components["schemas"]["Core_XrplOperation_AccountSet"]
export type CustodyAccountSet = Prettify<
  Pick<AccountSet, "Account"> & Omit<Core_XrplOperation_AccountSet, "type">
>

// Batch
export type Core_XrplOperation_Batch = components["schemas"]["Core_XrplOperation_Batch"]
export type CustodyBatch = Prettify<Pick<Batch, "Account"> & Omit<Core_XrplOperation_Batch, "type">>

// Batch Adapters
export type CustodyBatchSigner = CustodyBatch["batchSigners"][number]
export type CustodyInnerTransaction = CustodyBatch["entries"][number]
export type CustodyOperation = CustodyInnerTransaction["operation"]
export type Core_ParticipantSequencing = components["schemas"]["Core_ParticipantSequencing"]
export type Core_BatchEntry = components["schemas"]["Core_BatchEntry"]
export type Core_BatchSigner = components["schemas"]["Core_BatchSigner"]
export type Core_Sequencing = components["schemas"]["Core_Sequencing"]
export type Core_BatchExecutionMode = components["schemas"]["Core_Xrpl_BatchExecutionMode"]
export type Core_ApiBatchSigningData = components["schemas"]["Core_ApiBatchSigningData"]
export type Core_TransactionEstimate_XRPL = components["schemas"]["Core_TransactionEstimate_XRPL"]
export type Core_IntentDryRunResponse_v0_CreateTransactionOrder =
  components["schemas"]["Core_IntentDryRunResponse_v0_CreateTransactionOrder"]

export type CustodyAccountSetFlag = CustodyAccountSet["setFlag"]

// General

export type XrplIntentOptions = {
  /**
   * Domain ID to use for the payment. If not provided and user has multiple domains, an error will be thrown.
   */
  domainId?: string
  /**
   * Ledger ID to disambiguate when the same address exists on multiple ledgers
   * under the same login (e.g. "xrpl" vs "xrpl-testnet-august-2024"). Required when
   * the address is registered on more than one ledger; otherwise optional.
   * The auto-completion is loose, you can write any value.
   */
  ledgerId?: XrplLedgerId
  /**
   * Fee strategy priority. Defaults to "Low".
   */
  feePriority?: "Low" | "Medium" | "High"
  /**
   * Number of days until the intent expires. Defaults to 1.
   */
  expiryDays?: number
  /**
   * Human-readable description for the intent request (`request.description`).
   */
  description?: string
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

// Confidential MPT (cMPT)

/**
 * The hex-encoded cryptographic material a parameters computation returns,
 * as carried on `Core_ApiParametersComputeStatusResponse.cryptographicFields`.
 */
export type Core_ApiParametersComputeCryptographicFields =
  components["schemas"]["Core_ApiParametersComputeCryptographicFields"]

/**
 * The base64-encoded cryptographic material a confidential MPT operation
 * carries. Produced from the compute response by
 * `parametersComputeToCryptographicFields`.
 */
export type Core_CmptCryptographicFields = components["schemas"]["Core_CmptCryptographicFields"]

/**
 * Identifies the account whose ElGamal public key to read, and the ledger the
 * key was provisioned for. An account holds one ElGamal key per ledger.
 */
export type GetElGamalPublicKeyParams = {
  /** Domain ID of the account */
  domainId: string
  /** Custody account ID */
  accountId: string
  /** Ledger the key was provisioned on */
  ledgerId: string
}

/**
 * Identifies the transaction order whose resulting MPT issuance ID to read.
 * `payloadId` is the `v0_CreateTransactionOrder` payload ID — the value passed
 * as `options.payloadId` to `proposeIntent`, defaulted to a fresh UUID when
 * omitted, so pass an explicit one to look the issuance up afterwards.
 */
export type GetMptIssuanceIdParams = {
  /** Domain ID of the issuer account */
  domainId: string
  /** Payload ID of the `MPTokenIssuanceCreate` transaction order */
  payloadId: string
}

/**
 * Outcome of a single MPT issuance ID lookup: the issuance, or the reason it is
 * not readable yet. Both entry points build their error from `reason`, so the
 * polling one does not have to drive its loop off exceptions.
 */
export type MptIssuanceIdLookup = { issuanceId: string } | { reason: string }

/**
 * Options for polling the MPT issuance ID an `MPTokenIssuanceCreate` produced.
 */
export type WaitForMptIssuanceIdOptions = {
  /** Maximum number of polling attempts (default: 10) */
  maxRetries?: number
  /** Interval between polling attempts in milliseconds (default: 3000) */
  intervalMs?: number
  /** Callback on each polling attempt */
  onAttempt?: (attempt: number) => void
}

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
  /**
   * XRPL address of the account whose custody key will sign the transaction.
   * Defaults to xrplTransaction.Account. Set this when the account has a regular key
   * (via SetRegularKey) and you want to sign with that regular key's custody account.
   */
  signerAccount?: string
}

/**
 * Result of rawSignAndWait.
 */
export type RawSignAndWaitResult = {
  /** The signature in uppercase hex */
  signature: string
  /** The compressed secp256k1 public key in uppercase hex */
  signingPubKey: string
  /** The transaction with TxnSignature and SigningPubKey set, ready to submit */
  signedTransaction: SubmittableTransaction
}

type BatchSignerLookup = { accountId?: never; ledgerId?: never }
type BatchSignerDirect = {
  /** Custody account ID — skips the address lookup when provided with ledgerId */
  accountId: string
  /** Ledger ID for the account */
  ledgerId: string
}

// Batch flow (XLS-56)

/**
 * Input for `dryRunBatch` / `proposeBatch`.
 *
 * `Account` is the submitter (pays the outer Batch fee). `entries` mixes
 * `SubmitterOperation` and `ParticipantOperation`; build them by hand with
 * `Core_BatchEntry`, or convert from an autofilled xrpl.js `Batch` with
 * `batchToCustodyInnerTransactions`.
 */
export type BatchPayloadInput = {
  /** XRPL address of the submitter (the account that pays the outer Batch fee) */
  Account: string
  /** How the XRP Ledger handles inner-operation failures */
  executionMode: Core_BatchExecutionMode
  /** Inner operations (SubmitterOperation or ParticipantOperation) */
  entries: Core_BatchEntry[]
  /** Outer Batch sequencing. Defaults to `{ type: "PlatformManaged" }` */
  sequencing?: Core_Sequencing
  /** Optional last ledger sequence for the outer Batch */
  lastLedgerSequence?: number
}

/**
 * Options for signing the `signingPayload` returned by `dryRunBatch` for an
 * inner account managed by this custody instance.
 *
 * When `accountId` and `ledgerId` are provided, the address-to-account lookup
 * is skipped.
 */
export type SignBatchPayloadOptions = XrplIntentOptions & {
  /** Polling options for waiting for the manifest signature */
  polling?: WaitForSignatureOptions
} & (BatchSignerLookup | BatchSignerDirect)

/**
 * Result of `signBatchPayloadAndWait`.
 *
 * `signature` and `signingPubKey` are uppercase hex. `batchSigner` is the
 * xrpl.js `BatchSigner` shape; `custodyBatchSigner` is the Ripple Custody
 * shape — pick whichever the next step needs.
 */
export type SignBatchPayloadResult = {
  /** The signature in uppercase hex */
  signature: string
  /** The compressed secp256k1 public key in uppercase hex */
  signingPubKey: string
  /** xrpl.js BatchSigner — for inclusion in an xrpl.js Batch.BatchSigners array */
  batchSigner: BatchSigner
  /** Custody BatchSigner — for inclusion in batchSigners on `proposeBatch` */
  custodyBatchSigner: CustodyBatchSigner
}

/**
 * Serializable handle returned by `signBatchPayload`. Persist these fields
 * (e.g. to a database or queue) and pass them to `getBatchSignature` once the
 * custody instance operator has approved the signature — possibly from a
 * different process.
 */
export type SignBatchPayloadHandle = {
  /** Manifest ID to poll for the signature */
  payloadId: string
  /** Domain ID of the signer account */
  domainId: string
  /** Account ID of the signer account */
  accountId: string
  /** XRPL address of the signer */
  signerAddress: string
  /** The compressed secp256k1 public key in uppercase hex */
  signingPubKey: string
  /** The proposed intent response */
  intentResponse: Core_IntentResponse
}

/**
 * Fields `getBatchSignature` needs to fetch the signature and build the
 * BatchSigner shapes. A `SignBatchPayloadHandle` is a structural superset, so a
 * stored handle can be passed directly.
 */
export type GetBatchSignatureParams = {
  /** Manifest ID returned by `signBatchPayload` */
  payloadId: string
  /** Domain ID of the signer account */
  domainId: string
  /** Account ID of the signer account */
  accountId: string
  /** XRPL address of the signer */
  signerAddress: string
  /** The compressed secp256k1 public key in uppercase hex */
  signingPubKey: string
}
