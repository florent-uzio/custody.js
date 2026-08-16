import type {
  AccountSet,
  Batch,
  BatchSigner,
  Clawback,
  ConfidentialMPTSend,
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
import type { WaitForParametersComputeOptions } from "../../namespaces/accounts.types.js"
import type {
  Core_IntentResponse,
  IntentEnvelopeOptions,
  WaitForExecutionOptions,
  WaitForExecutionResult,
} from "../../namespaces/intents.types.js"
import type {
  WaitForTransactionOptions,
  WaitForTransactionResult,
} from "../../namespaces/transactions.types.js"
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

export type Core_BatchInnerOperation_ConfidentialMPTSend =
  components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTSend"]

/**
 * The fields a Custody `ConfidentialMPTSend` batch entry carries that the XRPL
 * wire format has no room for, so they cannot be read off an xrpl.js
 * `ConfidentialMPTSend`.
 *
 * On the ledger the value only ever exists as ciphertext and the sender's
 * encrypted balance is read from ledger state at apply time — but Harmonize
 * needs all three on the entry to dry-run the Batch and re-derive the proofs.
 */
export type ConfidentialSendEntryFields = Pick<
  Core_BatchInnerOperation_ConfidentialMPTSend,
  "amount" | "senderEncryptedBalance" | "senderEncryptedBalanceVersion"
>

/**
 * Extras for `batchToCustodyBatchPayload` / `batchToCustodyInnerTransactions`.
 */
export type BatchToCustodyOptions = {
  /**
   * Keyed by the inner transaction's `Account` (XRPL address). Applied to that
   * account's `ConfidentialMPTSend` entry.
   *
   * Every key must be a valid XRPL address (checked with xrpl.js
   * `isValidAddress`) and must match an inner transaction, and that inner
   * transaction must be a `ConfidentialMPTSend` — otherwise the conversion
   * throws, since a typo would otherwise silently produce an entry the
   * platform rejects.
   */
  confidentialSends?: Record<string, ConfidentialSendEntryFields>
}

export type CustodyAccountSetFlag = CustodyAccountSet["setFlag"]

// General

/**
 * Intent options for an XRPL transaction order: the envelope fields every
 * intent shares ({@link IntentEnvelopeOptions}), plus the transaction-order
 * specifics.
 */
export type XrplIntentOptions = Prettify<
  IntentEnvelopeOptions & {
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
     * Custom properties to include in the intent payload.
     */
    payloadCustomProperties?: Record<string, string>
    /**
     * Payload ID to use for the intent. If not provided, a new UUID will be generated.
     */
    payloadId?: string
  }
>

export type Core_XrplOperation = components["schemas"]["Core_XrplOperation"]

/**
 * A proposed intent, plus the transaction-order (payload) id it was proposed
 * under.
 *
 * `Core_IntentResponse` carries only the *request* id, while lookups such as
 * {@link XrplService.getMptIssuanceId} key off the *payload* id — which the SDK
 * generates when `options.payloadId` is omitted. Returning it here means the
 * caller no longer has to pre-generate a UUID to be able to follow the order up.
 */
export type ProposeIntentResult = Prettify<Core_IntentResponse & { payloadId: string }>

/**
 * Options for {@link XrplService.proposeIntentAndWait} — the intent options
 * {@link proposeIntent} takes, plus how long to wait for each of the two stages.
 *
 * They are separate bags because the two waits are for different things: the
 * intent stage waits on custody accepting the order, the transaction stage on
 * the ledger. Each defaults to 10 attempts 3s apart, as its standalone
 * counterpart does.
 */
export type ProposeIntentAndWaitOptions = XrplIntentOptions & {
  /** Polling options for the intent stage (`intents.getAndWait`) */
  intent?: WaitForExecutionOptions
  /** Polling options for the transaction stage (`transactions.byOrderAndWait`) */
  transaction?: WaitForTransactionOptions
}

/**
 * Outcome of proposing an XRPL intent and waiting it out to the ledger.
 *
 * The top level is {@link WaitForTransactionResult}, so anything written
 * against `transactions.byOrderAndWait` reads the same here: `status`,
 * `isTerminal`, `isSuccess` and `transaction` all describe the *transaction*
 * the order produced.
 *
 * `intent` carries the other half. Both halves are needed because the flow has
 * two failure surfaces: an intent that never executes (rejected by policy,
 * expired, failed) produces no transaction at all, which at the top level is
 * indistinguishable from a transaction that was still in flight when the
 * attempts ran out. Read `intent.isSuccess` to tell those apart — or `reason`,
 * which names whichever of the two stages failed.
 */
export type ProposeIntentAndWaitResult = Prettify<
  WaitForTransactionResult & {
    /** The intent request id, as `proposeIntent` returns it */
    requestId: string
    /** The transaction-order (payload) id, as `proposeIntent` returns it */
    payloadId: string
    /**
     * The domain the intent was proposed in — resolved from `Account` unless
     * `options.domainId` pinned it. Returned so follow-ups that need it
     * (`getMptIssuanceIdAndWait`, any transaction lookup) do not have to
     * resolve it again.
     */
    domainId: string
    /**
     * Outcome of the intent stage. When `intent.isSuccess` is false no
     * transaction was ever waited for, and the transaction fields are empty
     * because none exists — not because one was slow.
     */
    intent: WaitForExecutionResult
  }
>

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
 * What {@link XrplService.buildConfidentialSend} needs to build one
 * confidential MPT Batch leg.
 *
 * `sender` and `destination` are XRPL addresses, as everywhere else in
 * `custody.xrpl` — the sender's domain, account id and ledger are resolved from
 * its address, and the destination is an address on the wire and in the compute
 * request alike.
 */
export type BuildConfidentialSendParams = {
  /** XRPL address of the sending account (must be managed by this custody instance) */
  sender: string
  /** XRPL address of the receiving account */
  destination: string
  /** The 192-bit MPT issuance ID, hex-encoded */
  issuanceId: string
  /**
   * Amount to send, in the token's smallest unit. A string because the value
   * can exceed what a JSON number holds without loss of precision.
   */
  amount: string
  /**
   * Ticket sequence to sequence the inner transaction with. Omit for a leg
   * sequenced by account sequence instead — the field is then left off both the
   * transaction and the compute request.
   */
  ticketSequence?: number
}

/**
 * Options for {@link XrplService.buildConfidentialSend} — the same
 * address-disambiguation the other `custody.xrpl` reads take, plus how long to
 * wait for the computation.
 */
export type BuildConfidentialSendOptions = {
  /** Domain ID of the sender. Required when the login has multiple domains. */
  domainId?: string
  /**
   * Ledger ID to disambiguate when the sender's address exists on multiple
   * ledgers under the same login. Also selects the ledger the computation runs
   * against.
   */
  ledgerId?: XrplLedgerId
  /**
   * Polling configuration for the parameters computation (default: 10 attempts,
   * 3s apart). A confidential compute regularly takes longer than that under
   * load — raise `maxRetries` rather than catching the failure.
   */
  polling?: WaitForParametersComputeOptions
}

/**
 * The two halves of one confidential leg: what goes on the XRPL wire, and what
 * only the Custody batch entry carries.
 *
 * `ConfidentialMPTSend` on the ledger commits to the amount as ciphertext only,
 * and the sender's encrypted balance is read from ledger state at apply time —
 * so neither the plaintext `amount` nor `senderEncryptedBalance` /
 * `senderEncryptedBalanceVersion` exists on the xrpl.js transaction. Harmonize
 * needs all three on the batch *entry* to dry-run and re-derive the proofs, so
 * they are passed to `batchToCustodyBatchPayload` through
 * {@link BatchToCustodyOptions.confidentialSends}.
 */
export type ConfidentialSendLeg = {
  /**
   * The inner transaction, ready to push onto an xrpl.js `Batch`. Always
   * carries `Flags: tfInnerBatchTxn` — this builder only produces Batch legs.
   */
  transaction: ConfidentialMPTSend
  /** The three fields to hand to `confidentialSends`, keyed by the sender's address */
  entryFields: ConfidentialSendEntryFields
}

/**
 * Disambiguation for {@link XrplService.getElGamalPublicKey} and
 * {@link XrplService.findElGamalPublicKey}. Both fields are only needed when the
 * address resolves to more than one account — the domain and ledger are
 * otherwise inferred from the address itself.
 */
export type GetElGamalPublicKeyOptions = {
  /**
   * Domain ID of the account. Required when the login has multiple domains.
   */
  domainId?: string
  /**
   * Ledger ID to disambiguate when the same address exists on multiple ledgers
   * under the same login. Also selects which of the account's per-ledger
   * ElGamal keys is returned.
   */
  ledgerId?: XrplLedgerId
}

/**
 * Options for {@link XrplService.getElGamalPublicKeyAndWait} — the
 * disambiguation {@link GetElGamalPublicKeyOptions} takes, plus how long to wait
 * for the vault to write the key after the provisioning intent executed.
 */
export type WaitForElGamalPublicKeyOptions = GetElGamalPublicKeyOptions & {
  /** Maximum number of polling attempts (default: 10) */
  maxRetries?: number
  /** Interval between polling attempts in milliseconds (default: 3000) */
  intervalMs?: number
  /** Callback on each polling attempt */
  onAttempt?: (attempt: number) => void
}

/**
 * Disambiguation for {@link XrplService.getPublicKey}. Both fields are only
 * needed when the address resolves to more than one account — the domain and
 * ledger are otherwise inferred from the address itself.
 */
export type GetPublicKeyOptions = {
  /**
   * Domain ID of the account. Required when the login has multiple domains.
   */
  domainId?: string
  /**
   * Ledger ID to disambiguate when the same address exists on multiple ledgers
   * under the same login.
   */
  ledgerId?: XrplLedgerId
}

/**
 * Identifies the transaction order whose resulting MPT issuance ID to read.
 * `payloadId` is the `v0_CreateTransactionOrder` payload ID — read it off the
 * {@link ProposeIntentResult} `proposeIntent` returned, or pass your own through
 * `options.payloadId`.
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
