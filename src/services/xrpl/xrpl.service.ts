import { v7 as uuidv7 } from "uuid"
import { encodeForSigning, GlobalFlags, isValidAddress, type SubmittableTransaction } from "xrpl"
import { pollUntil } from "../../helpers/async/async.js"
import { isUndefined } from "../../helpers/index.js"
import type { components } from "../../models/custody-types.js"
import { CustodyError } from "../../models/index.js"
import { buildRequestEnvelope, waitForExecution } from "../../namespaces/intents.js"
import type { Core_IntentResponse, Core_ProposeIntentBody } from "../../namespaces/intents.types.js"
import { waitForOrderTransaction } from "../../namespaces/transactions.js"
import { VersionGuard, xrplOperationSchema } from "../../versioning/version-guard.js"
import { isPresent, isSendCryptographicFields } from "./xrpl.adapters.js"
import {
  buildBatchOperation,
  buildDryRunBody,
  buildSignBatchPayloadResult,
  buildTransactionIntent,
} from "./xrpl.builders.js"
import { compressPublicKey } from "./xrpl.crypto.js"
import type { XrplPorts } from "./xrpl.ports.js"
import type {
  BatchPayloadInput,
  BuildConfidentialSendOptions,
  BuildConfidentialSendParams,
  ConfidentialSendLeg,
  Core_ApiBatchSigningData,
  Core_BatchSigner,
  Core_XrplOperation,
  GetBatchSignatureParams,
  GetElGamalPublicKeyOptions,
  GetMptIssuanceIdParams,
  GetPublicKeyOptions,
  IntentContext,
  MptIssuanceIdLookup,
  ProposeIntentAndWaitOptions,
  ProposeIntentAndWaitResult,
  ProposeIntentResult,
  ProvisionElGamalKeyPairResult,
  RawSignAndWaitOptions,
  RawSignAndWaitResult,
  SignBatchPayloadHandle,
  SignBatchPayloadOptions,
  SignBatchPayloadResult,
  WaitForElGamalPublicKeyOptions,
  WaitForMptIssuanceIdOptions,
  WaitForSignatureOptions,
  XrplIntentOptions,
} from "./xrpl.types.js"
import { validateBatchSequencing } from "./xrpl.validators.js"

/**
 * Throws a uniform error for any XRPL address that fails `isValidAddress`, so a
 * typo fails before any request goes out rather than as an account-not-found
 * from the lookup endpoint.
 *
 * `label` names the offending parameter when it is not simply "the address" —
 * `signerAccount`, `signerAddress` — so the message points at the argument the
 * caller passed.
 */
function assertValidAddress(address: string, label = "address"): void {
  if (!isValidAddress(address)) {
    throw new CustodyError({ reason: `Invalid ${label}: ${address}` })
  }
}

/**
 * Orchestrates the XRPL surface of the Custody API. Every I/O call goes through
 * {@link XrplPorts}, so this class holds only sequencing, validation and
 * error-shaping — no HTTP.
 *
 * Methods are grouped by concern (intents, keys, MPT issuance, raw signing,
 * batch), each group followed by the private helpers it owns. Helper names
 * follow a consistent ladder:
 *
 * - `fetch*` — one call, no retries; returns `undefined` when the value is not
 *   readable yet
 * - `poll*` — retries a `fetch*`; returns `undefined` when the attempts run out
 * - `wait*` — retries a `fetch*`; throws when the attempts run out
 */
export class XrplService {
  constructor(
    private readonly ports: XrplPorts,
    private readonly guard: VersionGuard = new VersionGuard(undefined),
  ) {}

  // ───────────────────────────────────────────────────────────────────────────
  // Intents
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Proposes any XRPL transaction intent.
   *
   * Replaces the individual per-type methods (sendPayment, createTrustline, etc.).
   * The `operation` parameter is a discriminated union — callers specify the
   * transaction type via the `type` field (e.g. `{ type: "Payment", ... }`).
   *
   * Internally: resolves domain/user context from the Account address,
   * builds the intent envelope, and submits it to the Custody API.
   *
   * @param params - The Account address and XRPL operation
   * @param options - Optional configuration for the intent
   * @returns The proposed intent response, plus the transaction-order id
   *   (`payloadId`, pass it to {@link getMptIssuanceId} and friends) and the
   *   intent id (`intentId`, pass it to `intents.getAndWait`) it was proposed
   *   under
   * @throws {CustodyError} If the Account is not a valid XRPL address,
   *   validation fails, or the sender account is not found
   */
  public async proposeIntent(
    params: { Account: string; operation: Core_XrplOperation },
    options: XrplIntentOptions = {},
  ): Promise<ProposeIntentResult> {
    const { result } = await this.propose(params, options)
    return result
  }

  /**
   * Proposes an XRPL transaction intent and waits it out to the ledger — the
   * intent reaching a terminal status, then the transaction it produced.
   *
   * The three-step shape it replaces (`proposeIntent` → `intents.getAndWait` →
   * `transactions.byOrderAndWait`) is what every write has to do, because an
   * intent reporting `Executed` only means custody accepted the order: the
   * transaction can still fail while custody prepares it, or on chain. Reach
   * for this whenever the next step depends on ledger state this one writes.
   *
   * Never throws on a failed intent or transaction — the outcome is reported
   * through `isSuccess` / `isTerminal`, as {@link intents.getAndWait} and
   * {@link transactions.byOrderAndWait} do. Propose-time errors (invalid
   * address, rejected request) still throw.
   *
   * The transaction stage is skipped when the intent does not execute: no
   * transaction is coming, so there is nothing to wait for.
   *
   * @param params - The Account address and XRPL operation
   * @param options - Intent options, plus per-stage polling configuration
   * @returns The transaction outcome ({@link WaitForTransactionResult}), the
   *   intent outcome, and the ids and domain the intent was proposed under
   * @throws {CustodyError} If the Account is not a valid XRPL address,
   *   validation fails, the sender account is not found, or the intent was
   *   never registered
   */
  public async proposeIntentAndWait(
    params: { Account: string; operation: Core_XrplOperation },
    options: ProposeIntentAndWaitOptions = {},
  ): Promise<ProposeIntentAndWaitResult> {
    const { result, context } = await this.propose(params, options)
    const { requestId, payloadId, intentId } = result
    const { domainId } = context

    const intent = await waitForExecution(
      () => this.ports.getIntent(domainId, intentId),
      intentId,
      options.intent,
    )

    if (!intent.isSuccess) {
      return {
        intentId,
        requestId,
        payloadId,
        domainId,
        intent,
        // An intent that reached a terminal status without executing ends the
        // flow: no transaction will ever be registered for the order.
        isTerminal: intent.isTerminal,
        isSuccess: false,
        // The transaction stage never ran, so `reason` has to come from this
        // one — otherwise the failure the caller logs would read as a missing
        // transaction rather than an intent that never executed.
        reason: intent.reason,
      }
    }

    const transaction = await waitForOrderTransaction(
      () => this.ports.listTransactions(domainId, { "orderReference.Id": payloadId }),
      options.transaction,
    )

    return { intentId, requestId, payloadId, domainId, intent, ...transaction }
  }

  /**
   * Builds and submits a transaction-order intent, returning the resolved
   * context alongside the response.
   *
   * Shared by `proposeIntent` and `proposeIntentAndWait`: the latter needs the
   * domain the address resolved to, and resolving it a second time would cost
   * another `/v1/me` and address lookup.
   * @private
   */
  private async propose(
    params: { Account: string; operation: Core_XrplOperation },
    options: XrplIntentOptions,
  ): Promise<{ result: ProposeIntentResult; context: IntentContext }> {
    assertValidAddress(params.Account)

    await this.guard.checkFeature(xrplOperationSchema(params.operation.type), "xrpl.proposeIntent")

    const context = await this.ports.resolveContext(params.Account, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const { body, payloadId, intentId } = buildTransactionIntent({
      operation: params.operation,
      context,
      options,
    })

    const intentResponse = await this.ports.submitIntent(body)
    return { result: { ...intentResponse, payloadId, intentId }, context }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Keys
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Retrieves the compressed secp256k1 public key for an XRPL account.
   *
   * Takes the same XRPL address as {@link rawSign} and
   * {@link getElGamalPublicKey}: the domain and account are resolved from it.
   * Pass `domainId` / `ledgerId` only when the address is registered more than
   * once and the lookup is ambiguous.
   *
   * @param address - XRPL address of the account whose key to read
   * @param options - Domain and ledger, when the address alone is ambiguous
   * @returns The compressed public key in uppercase hex format
   * @throws {CustodyError} If the address is not a valid XRPL address, resolves
   *   to no or several accounts, the account is not a Vault account, or the key
   *   is not found
   */
  public async getPublicKey(address: string, options: GetPublicKeyOptions = {}): Promise<string> {
    assertValidAddress(address)

    const { domainId, accountId } = await this.ports.resolveContext(address, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    return this.fetchPublicKey(domainId, accountId)
  }

  /**
   * Provisions the ElGamal key pair a confidential MPT (cMPT) account needs.
   *
   * Every participant in a confidential transfer — issuer, senders, receivers,
   * and the auditor when one is configured — must have one before any
   * confidential operation will be accepted. The vault generates and stores the
   * pair; the public half becomes readable via {@link getElGamalPublicKey} —
   * shortly *after* this intent reports `Executed`, so use
   * {@link getElGamalPublicKeyAndWait} to read it back immediately.
   *
   * An account can only be provisioned once per ledger: a second call is
   * rejected with `ElGamal key already provisioned for account …`. Check with
   * {@link findElGamalPublicKey} before provisioning an account that may already
   * have a key.
   *
   * Unlike the XRPL operations, this is its own intent type rather than a
   * transaction order, so it takes no fee strategy and no payload ID.
   *
   * @param address - XRPL address of the account to provision
   * @param options - Optional configuration for the intent
   * @returns The proposed intent response, plus the intent id it was proposed
   *   under — pass it to `intents.getAndWait` to wait for it to execute
   * @throws {CustodyError} If the address is not a valid XRPL address, or the
   *   account is not found
   */
  public async provisionElGamalKeyPair(
    address: string,
    options: XrplIntentOptions = {},
  ): Promise<ProvisionElGamalKeyPairResult> {
    assertValidAddress(address)

    await this.guard.checkFeature("Core_v0_ProvisionElGamalKeyPair", "xrpl.provisionElGamalKeyPair")

    const context = await this.ports.resolveContext(address, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const payload = {
      accountId: context.accountId,
      ledgerId: context.ledgerId,
      type: "v0_ProvisionElGamalKeyPair",
    } satisfies components["schemas"]["Core_v0_ProvisionElGamalKeyPair"]

    const requestEnvelope = buildRequestEnvelope(context, options, payload)
    const intentResponse = await this.ports.submitIntent({
      request: {
        ...requestEnvelope,
        type: "Propose",
      },
    })

    return { ...intentResponse, intentId: requestEnvelope.id }
  }

  /**
   * Retrieves the base64 ElGamal public key provisioned for an account on a
   * ledger — the value `MPTokenIssuanceSet` expects in `issuerEncryptionKey`
   * and `auditorEncryptionKey`, needing no re-encoding.
   *
   * Takes the same XRPL address as {@link provisionElGamalKeyPair}: the domain,
   * account and ledger are resolved from it. Pass `domainId` / `ledgerId` only
   * when the address is registered more than once and the lookup is ambiguous.
   *
   * Reads once and throws when there is no key. Use
   * {@link getElGamalPublicKeyAndWait} straight after provisioning, and
   * {@link findElGamalPublicKey} when the absence of a key is an expected answer
   * rather than an error.
   *
   * @param address - XRPL address of the account whose key to read
   * @param options - Domain and ledger, when the address alone is ambiguous
   * @returns The ElGamal public key, base64-encoded
   * @throws {CustodyError} If the address is not a valid XRPL address, resolves
   *   to no or several accounts, the account is not a Vault account, or no
   *   ElGamal key is provisioned for that ledger
   */
  public async getElGamalPublicKey(
    address: string,
    options: GetElGamalPublicKeyOptions = {},
  ): Promise<string> {
    const { accountId, ledgerId, publicKey } = await this.resolveAndFetchElGamalPublicKey(
      address,
      options,
    )

    if (isUndefined(publicKey)) {
      throw new CustodyError({
        reason:
          `No ElGamal key provisioned for account ${accountId} (${address}) on ledger ${ledgerId}. ` +
          "Call xrpl.provisionElGamalKeyPair first and wait for the intent to execute.",
      })
    }

    return publicKey
  }

  /**
   * Reads the base64 ElGamal public key provisioned for an account, returning
   * `undefined` instead of throwing when there is none.
   *
   * A key can only be provisioned once per account and ledger — a second
   * `provisionElGamalKeyPair` is rejected with `ElGamal key already provisioned
   * for account …` — so a re-runnable script has to establish whether the
   * account already has one. That is a question `getElGamalPublicKey` cannot
   * answer without the caller catching its error and guessing which errors mean
   * "absent"; this returns the answer.
   *
   * Takes the same XRPL address as {@link getElGamalPublicKey}, and reports
   * absence only for the key: an invalid address, an ambiguous lookup or a
   * non-Vault account still throw.
   *
   * @param address - XRPL address of the account whose key to read
   * @param options - Domain and ledger, when the address alone is ambiguous
   * @returns The ElGamal public key base64-encoded, or `undefined` if none is
   *   provisioned for that ledger
   * @throws {CustodyError} If the address is not a valid XRPL address, resolves
   *   to no or several accounts, or the account is not a Vault account
   */
  public async findElGamalPublicKey(
    address: string,
    options: GetElGamalPublicKeyOptions = {},
  ): Promise<string | undefined> {
    const { publicKey } = await this.resolveAndFetchElGamalPublicKey(address, options)

    return publicKey
  }

  /**
   * Retrieves the base64 ElGamal public key provisioned for an account, polling
   * until it is readable.
   *
   * The vault writes the key some time *after* the provisioning intent reports
   * `Executed`, so `getElGamalPublicKey` called straight after
   * `intents.getAndWait` legitimately finds nothing. This waits that gap out
   * instead of the caller sleeping for a fixed guess.
   *
   * @param address - XRPL address of the account whose key to read
   * @param options - Domain, ledger and polling configuration (default: 10
   *   attempts, 3s apart)
   * @returns The ElGamal public key, base64-encoded
   * @throws {CustodyError} If the address is not a valid XRPL address, resolves
   *   to no or several accounts, the account is not a Vault account, or no key
   *   is readable after the maximum retries
   */
  public async getElGamalPublicKeyAndWait(
    address: string,
    options: WaitForElGamalPublicKeyOptions = {},
  ): Promise<string> {
    assertValidAddress(address)

    const maxRetries = options.maxRetries ?? 10

    const { domainId, accountId, ledgerId } = await this.ports.resolveContext(address, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const publicKey = await pollUntil(
      () => this.fetchElGamalPublicKey(domainId, accountId, ledgerId),
      {
        maxRetries,
        intervalMs: options.intervalMs ?? 3000,
        onAttempt: options.onAttempt,
      },
    )

    if (isUndefined(publicKey)) {
      throw new CustodyError({
        reason:
          `No ElGamal key provisioned for account ${accountId} (${address}) on ledger ${ledgerId} ` +
          `after ${maxRetries} attempts. Confirm xrpl.provisionElGamalKeyPair executed for this account.`,
      })
    }

    return publicKey
  }

  /**
   * Resolves the address and reads the ElGamal key off the account once,
   * returning the resolved identifiers alongside it so the caller can name them
   * in an error without resolving twice.
   * @private
   */
  private async resolveAndFetchElGamalPublicKey(
    address: string,
    options: GetElGamalPublicKeyOptions,
  ): Promise<{ accountId: string; ledgerId: string; publicKey: string | undefined }> {
    assertValidAddress(address)

    const { domainId, accountId, ledgerId } = await this.ports.resolveContext(address, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    return {
      accountId,
      ledgerId,
      publicKey: await this.fetchElGamalPublicKey(domainId, accountId, ledgerId),
    }
  }

  /**
   * Reads the ElGamal public key for a ledger off an already-resolved account,
   * returning `undefined` when the account carries none for that ledger.
   * @private
   */
  private async fetchElGamalPublicKey(
    domainId: string,
    accountId: string,
    ledgerId: string,
  ): Promise<string | undefined> {
    const account = await this.ports.getAccount(domainId, accountId)

    const { providerDetails } = account.data

    if (providerDetails.type !== "Vault") {
      throw new CustodyError({ reason: "Account is not a Vault account" })
    }

    return providerDetails.purposeKeys.find(
      (k) => k.purpose === "ElGamal" && k.ledgerId === ledgerId,
    )?.publicKey
  }

  /**
   * Reads the compressed secp256k1 public key off an already-resolved account,
   * skipping the address lookup the public method performs.
   * @private
   */
  private async fetchPublicKey(domainId: string, accountId: string): Promise<string> {
    const account = await this.ports.getAccount(domainId, accountId)

    const { providerDetails } = account.data

    if (providerDetails.type !== "Vault") {
      throw new CustodyError({ reason: "Account is not a Vault account" })
    }

    const key = providerDetails.keys?.find((k) => k.id === "SECP256K1_CUSTODY_1")

    if (!key?.publicKey) {
      throw new CustodyError({
        reason: "Public key not found for key ID SECP256K1_CUSTODY_1",
      })
    }

    return compressPublicKey(key.publicKey.value)
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Confidential MPT (cMPT)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Builds one confidential MPT send as a Batch inner transaction, running the
   * parameters computation the proofs come from.
   *
   * A confidential send inside a Batch is the one confidential operation the
   * caller has to assemble: submitted on its own, the platform derives the
   * cryptographic material server-side from `xrpl.proposeIntent({ type:
   * "ConfidentialMPTSend" })`, but a Batch leg has to exist as a signed inner
   * transaction *before* the Batch is dry-run, so the material has to be
   * computed up front and spliced in by hand.
   *
   * This runs `accounts.initiateParametersComputeAndWait` for the sender,
   * narrows the untagged response union to its `Send` variant, and splits the
   * result in two — see {@link ConfidentialSendLeg} for why the halves exist:
   *
   * ```ts
   * const leg = await xrpl.buildConfidentialSend({
   *   sender: senderAddress,
   *   destination: destinationAddress,
   *   issuanceId,
   *   amount: "1000",
   *   ticketSequence,
   * })
   *
   * batch.RawTransactions.push({ RawTransaction: leg.transaction })
   *
   * const payload = batchToCustodyBatchPayload(autofilled, {
   *   confidentialSends: { [senderAddress]: leg.entryFields },
   * })
   * ```
   *
   * The computation is bound to the ticket sequence it was asked for, so a leg
   * cannot be re-sequenced after the fact — build it after the ticket exists.
   *
   * @param params - Sender and destination addresses, issuance, amount and ticket sequence
   * @param options - Domain / ledger disambiguation for the sender, and polling
   *   configuration for the computation
   * @returns The inner transaction and the custody batch entry's extra fields
   * @throws {CustodyError} If either address is invalid, the sender's account is
   *   not found, the computation does not complete, or it returns material for
   *   an operation other than a send
   */
  public async buildConfidentialSend(
    params: BuildConfidentialSendParams,
    options: BuildConfidentialSendOptions = {},
  ): Promise<ConfidentialSendLeg> {
    const { sender, destination, issuanceId, amount, ticketSequence } = params

    assertValidAddress(sender, "sender")
    assertValidAddress(destination, "destination")

    const context = await this.ports.resolveContext(sender, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const result = await this.ports.initiateParametersComputeAndWait(
      { domainId: context.domainId, accountId: context.accountId },
      {
        type: "cmpt-send",
        tokenIdentifier: { issuanceId },
        amount,
        destination,
        ledgerId: context.ledgerId,
        ...(isUndefined(ticketSequence) ? {} : { ticketSequence }),
      },
      options.polling,
    )

    if (!result.isSuccess) {
      throw new CustodyError({
        reason:
          `Confidential send computation for account ${context.accountId} (${sender}) ` +
          `did not complete (status: ${result.status}).`,
      })
    }

    const fields = result.compute.cryptographicFields

    if (isUndefined(fields) || !isSendCryptographicFields(fields)) {
      throw new CustodyError({
        reason:
          `Confidential send computation for account ${context.accountId} (${sender}) ` +
          `returned no Send cryptographic fields: ${JSON.stringify(fields)}`,
      })
    }

    return {
      transaction: {
        Account: sender,
        TransactionType: "ConfidentialMPTSend",
        Destination: destination,
        MPTokenIssuanceID: issuanceId,
        SenderEncryptedAmount: fields.senderEncryptedAmount,
        DestinationEncryptedAmount: fields.destinationEncryptedAmount,
        IssuerEncryptedAmount: fields.issuerEncryptedAmount,
        AmountCommitment: fields.amountCommitment,
        BalanceCommitment: fields.balanceCommitment,
        ZKProof: fields.zkProof,
        // The response sends an explicit `null` when no auditor key is
        // registered, so the field has to be dropped rather than passed on.
        ...(isPresent(fields.auditorEncryptedAmount) && {
          AuditorEncryptedAmount: fields.auditorEncryptedAmount,
        }),
        ...(isUndefined(ticketSequence) ? {} : { TicketSequence: ticketSequence }),
        Flags: GlobalFlags.tfInnerBatchTxn,
      },
      entryFields: {
        amount,
        // Deliberately hex, unlike the operation's base64 `cryptographicFields`
        // — the batch entry's top-level fields are passed through as returned.
        ...(isPresent(fields.senderEncryptedBalance) && {
          senderEncryptedBalance: fields.senderEncryptedBalance,
        }),
        ...(isPresent(fields.senderEncryptedBalanceVersion) && {
          senderEncryptedBalanceVersion: fields.senderEncryptedBalanceVersion,
        }),
      },
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // MPT issuance
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Resolves the MPT issuance ID an `MPTokenIssuanceCreate` produced, by
   * looking up the transaction its order registered and reading the issuance
   * off the transaction's XRPL ledger data.
   *
   * The issuance ID is minted by the ledger, so it exists only once the
   * transaction is on-chain — wait for the intent to execute before calling
   * this.
   *
   * @param params - Domain and the payload ID of the `MPTokenIssuanceCreate` order
   * @returns The 192-bit MPT issuance ID, hex-encoded
   * @throws {CustodyError} If no transaction is registered for the order, or it
   *   carries no MPT issuance (not yet on-chain, or not an issuance-creating order)
   */
  public async getMptIssuanceId({ domainId, payloadId }: GetMptIssuanceIdParams): Promise<string> {
    const lookup = await this.fetchMptIssuanceId(domainId, payloadId)

    if (!("issuanceId" in lookup)) {
      throw new CustodyError({ reason: lookup.reason })
    }

    return lookup.issuanceId
  }

  /**
   * Resolves the MPT issuance ID an `MPTokenIssuanceCreate` produced, polling
   * until it is readable.
   *
   * Custody registers the transaction an order produced, then fills in its XRPL
   * ledger data, some time *after* the intent reports `Executed` — so
   * `getMptIssuanceId` called straight after `intents.getAndWait` legitimately
   * finds nothing. This waits that gap out instead of the caller sleeping for a
   * fixed guess.
   *
   * @param params - Domain and the payload ID of the `MPTokenIssuanceCreate` order
   * @param options - Polling configuration (default: 10 attempts, 3s apart)
   * @returns The 192-bit MPT issuance ID, hex-encoded
   * @throws {CustodyError} If the issuance is still unreadable after the
   *   maximum retries, reporting why the last attempt came up empty
   */
  public async getMptIssuanceIdAndWait(
    { domainId, payloadId }: GetMptIssuanceIdParams,
    options: WaitForMptIssuanceIdOptions = {},
  ): Promise<string> {
    const maxRetries = options.maxRetries ?? 10

    let lastReason = `No transaction registered for transaction order ${payloadId}`

    const issuanceId = await pollUntil(
      async () => {
        const lookup = await this.fetchMptIssuanceId(domainId, payloadId)

        if ("issuanceId" in lookup) {
          return lookup.issuanceId
        }

        lastReason = lookup.reason
        return undefined
      },
      {
        maxRetries,
        intervalMs: options.intervalMs ?? 3000,
        onAttempt: options.onAttempt,
      },
    )

    if (isUndefined(issuanceId)) {
      throw new CustodyError({
        reason: `No MPT issuance ID for transaction order ${payloadId} after ${maxRetries} attempts. ${lastReason}`,
      })
    }

    return issuanceId
  }

  /**
   * Looks the order's transaction up once and reads the MPT issuance off its
   * XRPL ledger data, reporting the reason instead of throwing when either the
   * transaction or its ledger data has not been registered yet.
   *
   * Two calls, not one: the collection endpoint is the only way to map a
   * transaction order to its transaction, but it returns a lighter projection
   * that omits `ledgerTransactionData.ledgerData`. The issuance ID only appears
   * on the per-transaction detail response.
   * @private
   */
  private async fetchMptIssuanceId(
    domainId: string,
    payloadId: string,
  ): Promise<MptIssuanceIdLookup> {
    const { items } = await this.ports.listTransactions(domainId, {
      "orderReference.Id": payloadId,
    })

    if (items.length === 0) {
      return { reason: `No transaction registered for transaction order ${payloadId}` }
    }

    for (const { id } of items) {
      const { ledgerTransactionData } = await this.ports.getTransaction(domainId, id)
      const ledgerData = ledgerTransactionData?.ledgerData

      if (ledgerData?.type === "Xrpl" && !isUndefined(ledgerData.tokenData)) {
        return { issuanceId: ledgerData.tokenData.issuanceId }
      }
    }

    return {
      reason:
        `Transaction order ${payloadId} carries no MPT issuance ID. ` +
        "Confirm the intent executed and that the operation was MPTokenIssuanceCreate.",
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Raw signing
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Creates and proposes a raw sign intent for an XRPL transaction.
   * @param xrplTransaction - The XRPL transaction details
   * @param options - Optional configuration for the raw sign intent
   * @returns The proposed intent response, plus the manifest (payload) id and
   *   the intent id it was proposed under
   * @throws {CustodyError} If the Account is not a valid XRPL address,
   *   validation fails, or the sender account is not found
   */
  public async rawSign(
    xrplTransaction: SubmittableTransaction,
    options: XrplIntentOptions = {},
  ): Promise<ProposeIntentResult> {
    assertValidAddress(xrplTransaction.Account)

    const context = await this.ports.resolveContext(xrplTransaction.Account, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const encoded = encodeForSigning(xrplTransaction)
    const base64Encoded = Buffer.from(encoded, "hex").toString("base64")

    const { intentResponse, payloadId, intentId } = await this.proposeRawSignIntent(
      base64Encoded,
      context,
      options,
    )
    return { ...intentResponse, payloadId, intentId }
  }

  /**
   * Raw-signs an XRPL transaction and waits for the manifest signature.
   *
   * If `SigningPubKey` is not already set on the transaction, it will be
   * fetched from the custody account and set automatically.
   *
   * @param xrplTransaction - The XRPL transaction details
   * @param options - Optional configuration for the raw sign intent and polling
   * @returns The signature, signing public key in uppercase hex and the signed transaction
   * @throws {CustodyError} If the signing address is not a valid XRPL address,
   *   validation fails, the sender account is not found, or the manifest
   *   signature is not available after maximum retries
   */
  public async rawSignAndWait(
    xrplTransaction: SubmittableTransaction,
    options: RawSignAndWaitOptions = {},
  ): Promise<RawSignAndWaitResult> {
    if (!isUndefined(options.signerAccount)) {
      assertValidAddress(options.signerAccount, "signerAccount")
    }

    const signerAddress = options.signerAccount ?? xrplTransaction.Account
    assertValidAddress(signerAddress)

    const context = await this.ports.resolveContext(signerAddress, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const transaction = { ...xrplTransaction }

    if (!transaction.SigningPubKey) {
      const pubKey = await this.fetchPublicKey(context.domainId, context.accountId)
      transaction.SigningPubKey = pubKey
    }

    const encoded = encodeForSigning(transaction)
    const base64Encoded = Buffer.from(encoded, "hex").toString("base64")

    const { payloadId } = await this.proposeRawSignIntent(base64Encoded, context, options)

    const signature = await this.waitForManifestSignature(
      context.domainId,
      context.accountId,
      payloadId,
      options.polling,
    )

    transaction.TxnSignature = signature

    return {
      signature,
      signingPubKey: transaction.SigningPubKey,
      signedTransaction: transaction,
    }
  }

  /**
   * Proposes a raw sign intent with base64-encoded bytes.
   * Shared by rawSign, rawSignAndWait, and signBatchPayload.
   * @private
   */
  private async proposeRawSignIntent(
    base64Bytes: string,
    context: IntentContext,
    options: XrplIntentOptions,
  ): Promise<{ intentResponse: Core_IntentResponse; payloadId: string; intentId: string }> {
    const payloadId = options.payloadId ?? uuidv7()

    const payload = {
      id: payloadId,
      accountId: context.accountId,
      ledgerId: context.ledgerId,
      customProperties: options.payloadCustomProperties ?? {},
      content: {
        value: base64Bytes,
        type: "Unsafe",
      },
      type: "v0_SignManifest",
    } satisfies components["schemas"]["Core_v0_SignManifest"]

    const requestEnvelope = buildRequestEnvelope(context, options, payload)
    const intent: Core_ProposeIntentBody = {
      request: {
        ...requestEnvelope,
        type: "Propose",
      },
    }

    const intentResponse = await this.ports.submitIntent(intent)
    return { intentResponse, payloadId, intentId: requestEnvelope.id }
  }

  /**
   * Polls the manifest until a signature is available, then returns it as uppercase hex.
   * Throws if the signature is still unavailable after the maximum retries.
   * @private
   */
  private async waitForManifestSignature(
    domainId: string,
    accountId: string,
    manifestId: string,
    options: WaitForSignatureOptions = {},
  ): Promise<string> {
    const signature = await this.pollManifestSignature(domainId, accountId, manifestId, options)

    if (isUndefined(signature)) {
      throw new CustodyError({
        reason: "Manifest signature not available after maximum retries",
      })
    }

    return signature
  }

  /**
   * Polls the manifest for a signature, returning it as uppercase hex once
   * available, or `undefined` if still unavailable after the maximum retries.
   * @private
   */
  private async pollManifestSignature(
    domainId: string,
    accountId: string,
    manifestId: string,
    options: WaitForSignatureOptions = {},
  ): Promise<string | undefined> {
    return pollUntil(() => this.fetchManifestSignature(domainId, accountId, manifestId), {
      maxRetries: options.maxRetries ?? 3,
      intervalMs: options.intervalMs ?? 3000,
      onAttempt: options.onAttempt,
    })
  }

  /**
   * Fetches the manifest once and returns its signature as uppercase hex, or
   * `undefined` if the manifest does not exist yet (404) or has no signature.
   * @private
   */
  private async fetchManifestSignature(
    domainId: string,
    accountId: string,
    manifestId: string,
  ): Promise<string | undefined> {
    try {
      const manifest = await this.ports.getManifest(domainId, accountId, manifestId)

      const { value } = manifest.data
      if (value && value.type === "Unsafe") {
        return Buffer.from(value.signature, "base64").toString("hex").toUpperCase()
      }
    } catch (error) {
      if (!(error instanceof CustodyError && error.statusCode === 404)) {
        throw error
      }
    }

    return undefined
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Batch (XLS-56)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Step 1 of the XLS-56 Batch flow — dry-runs a Batch transaction order and
   * returns the canonical signing data. Each participant must sign
   * `signingPayload` with their own XRPL key; collect those signatures and pass
   * them to `proposeBatch` (Step 3).
   *
   * Use `signBatchPayloadAndWait` to sign for inner accounts managed by this
   * custody instance.
   *
   * @param payload - Submitter address, execution mode, and inner entries
   * @param options - Optional configuration for the dry-run intent
   * @returns The batch signing data (`signingPayload`, `signingPayloadHash`, resolved transactions)
   * @throws {CustodyError} If the submitter Account is not a valid XRPL address,
   *   the dry run fails, or it does not return batch signing data
   */
  public async dryRunBatch(
    payload: BatchPayloadInput,
    options: XrplIntentOptions = {},
  ): Promise<Core_ApiBatchSigningData> {
    assertValidAddress(payload.Account)

    await this.guard.checkFeature("Core_XrplOperation_Batch", "xrpl.dryRunBatch")
    validateBatchSequencing(payload)

    const context = await this.ports.resolveContext(payload.Account, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const operation = buildBatchOperation(payload, [])
    const body = buildDryRunBody(operation, context, options)

    const response = await this.ports.dryRunIntent(body)

    if (response.type !== "v0_CreateTransactionOrder") {
      throw new CustodyError({
        reason: `Unexpected dry-run response type: ${response.type}`,
      })
    }
    if (!response.success) {
      throw new CustodyError({
        reason: `Batch dry run failed: ${response.errors?.join(", ") ?? "unknown error"}`,
      })
    }
    if (response.estimate.type !== "XRPL" || !response.estimate.batchSigningData) {
      throw new CustodyError({
        reason: "Dry run did not return batchSigningData — confirm the operation type is Batch",
      })
    }

    return response.estimate.batchSigningData
  }

  /**
   * Step 2 of the XLS-56 Batch flow — signs the `signingPayload` returned by
   * `dryRunBatch` for a single inner account managed by this custody instance,
   * and waits for the manifest signature.
   *
   * Inner accounts on other custody instances (or non-custody participants)
   * sign independently with their own keys.
   *
   * @param signingPayload - Hex-encoded `signingPayload` from `dryRunBatch` response
   * @param signerAddress - XRPL address of the inner account to sign for
   * @param options - Optional configuration for the raw sign intent and polling
   * @returns The signature, signing public key, and pre-built BatchSigner shapes
   * @throws {CustodyError} If the signer address is invalid, the signer account
   *   is not found, or the signature is not available after maximum retries
   */
  public async signBatchPayloadAndWait(
    signingPayload: string,
    signerAddress: string,
    options: SignBatchPayloadOptions = {},
  ): Promise<SignBatchPayloadResult> {
    const handle = await this.signBatchPayload(signingPayload, signerAddress, options)

    const signature = await this.waitForManifestSignature(
      handle.domainId,
      handle.accountId,
      handle.payloadId,
      options.polling,
    )

    return buildSignBatchPayloadResult(handle, signature)
  }

  /**
   * Step 2 of the XLS-56 Batch flow (non-blocking variant) — proposes the raw
   * sign intent for the `signingPayload` returned by `dryRunBatch` for a single
   * inner account managed by this custody instance, then returns immediately
   * without waiting for the manifest signature.
   *
   * Use this when the custody instance operator approves signatures
   * out-of-band: persist the returned `SignBatchPayloadHandle` and pass it to
   * `getBatchSignature` later (possibly from another process) to fetch the
   * signature once it is available.
   *
   * @param signingPayload - Hex-encoded `signingPayload` from `dryRunBatch` response
   * @param signerAddress - XRPL address of the inner account to sign for
   * @param options - Optional configuration for the raw sign intent
   * @returns A handle with the manifest ID and the fields needed to retrieve the signature
   * @throws {CustodyError} If the signer address is invalid, or the signer
   *   account is not found
   */
  public async signBatchPayload(
    signingPayload: string,
    signerAddress: string,
    options: SignBatchPayloadOptions = {},
  ): Promise<SignBatchPayloadHandle> {
    assertValidAddress(signerAddress, "signerAddress")

    const context = await this.resolveSignerContext(signerAddress, options)

    const signingPubKey = await this.fetchPublicKey(context.domainId, context.accountId)

    const base64Encoded = Buffer.from(signingPayload, "hex").toString("base64")

    const { intentResponse, payloadId } = await this.proposeRawSignIntent(
      base64Encoded,
      context,
      options,
    )

    return {
      payloadId,
      domainId: context.domainId,
      accountId: context.accountId,
      signerAddress,
      signingPubKey,
      intentResponse,
    }
  }

  /**
   * Retrieves the signature for a payload proposed via `signBatchPayload`,
   * building the BatchSigner shapes when it is available.
   *
   * Performs a single fetch by default (`maxRetries: 1`); the operator may not
   * have approved the signature yet, in which case `undefined` is returned and
   * the caller decides when to retry. Pass `maxRetries`/`intervalMs` to opt into
   * light polling.
   *
   * @param params - Fields from the `SignBatchPayloadHandle` (a handle may be passed directly)
   * @param options - Optional polling configuration (defaults to a single attempt)
   * @returns The signature and BatchSigner shapes, or `undefined` if not yet signed
   * @throws {CustodyError} On any non-404 error fetching the manifest
   */
  public async getBatchSignature(
    params: GetBatchSignatureParams,
    options: WaitForSignatureOptions = {},
  ): Promise<SignBatchPayloadResult | undefined> {
    const signature = await this.pollManifestSignature(
      params.domainId,
      params.accountId,
      params.payloadId,
      { maxRetries: 1, ...options },
    )

    if (isUndefined(signature)) {
      return undefined
    }

    return buildSignBatchPayloadResult(params, signature)
  }

  /**
   * Step 3 of the XLS-56 Batch flow — submits the Batch as a real intent with
   * collected `batchSigners`. The payload must match the one used for
   * `dryRunBatch`; reuse `options.payloadId` and `options.requestId` if you
   * need referential identity with the dry-run.
   *
   * @param payload - Same submitter, execution mode, and entries as the dry-run
   * @param batchSigners - Signatures collected in Step 2 (one per participant)
   * @param options - Optional configuration for the intent
   * @returns The proposed intent response, plus the transaction-order id and
   *   the intent id the Batch was proposed under
   * @throws {CustodyError} If the submitter Account is not a valid XRPL address,
   *   validation fails, or the submitter account is not found
   */
  public async proposeBatch(
    payload: BatchPayloadInput,
    batchSigners: Core_BatchSigner[],
    options: XrplIntentOptions = {},
  ): Promise<ProposeIntentResult> {
    assertValidAddress(payload.Account)

    await this.guard.checkFeature("Core_XrplOperation_Batch", "xrpl.proposeBatch")
    validateBatchSequencing(payload)

    const context = await this.ports.resolveContext(payload.Account, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const operation = buildBatchOperation(payload, batchSigners)
    const { body, payloadId, intentId } = buildTransactionIntent({ operation, context, options })

    const intentResponse = await this.ports.submitIntent(body)
    return { ...intentResponse, payloadId, intentId }
  }

  /**
   * Resolves the intent context for an inner-batch signer. Skips the address
   * lookup when `accountId` and `ledgerId` are provided.
   * @private
   */
  private async resolveSignerContext(
    signerAddress: string,
    options: SignBatchPayloadOptions,
  ): Promise<IntentContext> {
    if (options.accountId && options.ledgerId) {
      const fullContext = await this.ports.resolveContext(signerAddress, {
        domainId: options.domainId,
      })
      return {
        domainId: fullContext.domainId,
        userId: fullContext.userId,
        accountId: options.accountId,
        ledgerId: options.ledgerId,
        address: signerAddress,
      }
    }
    return this.ports.resolveContext(signerAddress, { domainId: options.domainId })
  }
}
