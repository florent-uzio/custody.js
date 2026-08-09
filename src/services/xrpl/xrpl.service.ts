import { v7 as uuidv7 } from "uuid"
import { encodeForSigning, isValidAddress, type SubmittableTransaction } from "xrpl"
import { sleep } from "../../helpers/async/async.js"
import { isUndefined } from "../../helpers/index.js"
import type { components } from "../../models/custody-types.js"
import { CustodyError } from "../../models/index.js"
import type { Core_IntentResponse, Core_ProposeIntentBody } from "../../namespaces/intents.types.js"
import { VersionGuard, xrplOperationSchema } from "../../versioning/version-guard.js"
import {
  buildBatchOperation,
  buildDryRunBody,
  buildRequestEnvelope,
  buildSignBatchPayloadResult,
  buildTransactionIntent,
} from "./xrpl.builders.js"
import { compressPublicKey } from "./xrpl.crypto.js"
import type { XrplPorts } from "./xrpl.ports.js"
import type {
  BatchPayloadInput,
  Core_ApiBatchSigningData,
  Core_BatchSigner,
  Core_XrplOperation,
  GetBatchSignatureParams,
  GetElGamalPublicKeyParams,
  GetMptIssuanceIdParams,
  IntentContext,
  MptIssuanceIdLookup,
  RawSignAndWaitOptions,
  RawSignAndWaitResult,
  SignBatchPayloadHandle,
  SignBatchPayloadOptions,
  SignBatchPayloadResult,
  WaitForMptIssuanceIdOptions,
  WaitForSignatureOptions,
  XrplIntentOptions,
} from "./xrpl.types.js"
import { validateBatchSequencing } from "./xrpl.validators.js"

export class XrplService {
  constructor(
    private readonly ports: XrplPorts,
    private readonly guard: VersionGuard = new VersionGuard(undefined),
  ) {}

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
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async proposeIntent(
    params: { Account: string; operation: Core_XrplOperation },
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    await this.guard.checkFeature(xrplOperationSchema(params.operation.type), "xrpl.proposeIntent")

    const context = await this.ports.resolveContext(params.Account, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const intent = buildTransactionIntent({
      operation: params.operation,
      context,
      options,
    })

    return this.ports.submitIntent(intent)
  }

  /**
   * Retrieves the compressed secp256k1 public key for an XRPL account.
   * @param domainId - The domain ID of the account
   * @param accountId - The account ID
   * @returns The compressed public key in uppercase hex format
   * @throws {CustodyError} If the account is not a Vault account or the key is not found
   */
  public async getPublicKey({
    domainId,
    accountId,
  }: {
    domainId: string
    accountId: string
  }): Promise<string> {
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

  /**
   * Provisions the ElGamal key pair a confidential MPT (cMPT) account needs.
   *
   * Every participant in a confidential transfer — issuer, senders, receivers,
   * and the auditor when one is configured — must have one before any
   * confidential operation will be accepted. The vault generates and stores the
   * pair; the public half becomes readable via {@link getElGamalPublicKey}.
   *
   * Unlike the XRPL operations, this is its own intent type rather than a
   * transaction order, so it takes no fee strategy and no payload ID.
   *
   * @param address - XRPL address of the account to provision
   * @param options - Optional configuration for the intent
   * @returns The proposed intent response
   * @throws {CustodyError} If the account is not found
   */
  public async provisionElGamalKeyPair(
    address: string,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
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

    return this.ports.submitIntent({
      request: {
        ...buildRequestEnvelope(context, options, payload),
        type: "Propose",
      },
    })
  }

  /**
   * Retrieves the base64 ElGamal public key provisioned for an account on a
   * ledger — the value `MPTokenIssuanceSet` expects in `issuerEncryptionKey`
   * and `auditorEncryptionKey`, needing no re-encoding.
   *
   * @param params - Domain, account and ledger identifying the key
   * @returns The ElGamal public key, base64-encoded
   * @throws {CustodyError} If the account is not a Vault account, or no ElGamal
   *   key is provisioned for that ledger
   */
  public async getElGamalPublicKey({
    domainId,
    accountId,
    ledgerId,
  }: GetElGamalPublicKeyParams): Promise<string> {
    const account = await this.ports.getAccount(domainId, accountId)

    const { providerDetails } = account.data

    if (providerDetails.type !== "Vault") {
      throw new CustodyError({ reason: "Account is not a Vault account" })
    }

    const key = providerDetails.purposeKeys.find(
      (k) => k.purpose === "ElGamal" && k.ledgerId === ledgerId,
    )

    if (!key) {
      throw new CustodyError({
        reason:
          `No ElGamal key provisioned for account ${accountId} on ledger ${ledgerId}. ` +
          "Call xrpl.provisionElGamalKeyPair first and wait for the intent to execute.",
      })
    }

    return key.publicKey
  }

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
    const { maxRetries = 10, intervalMs = 3000, onAttempt } = options

    let lastReason = `No transaction registered for transaction order ${payloadId}`

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      onAttempt?.(attempt)

      const lookup = await this.fetchMptIssuanceId(domainId, payloadId)
      if ("issuanceId" in lookup) {
        return lookup.issuanceId
      }
      lastReason = lookup.reason

      if (attempt < maxRetries) {
        await sleep(intervalMs)
      }
    }

    throw new CustodyError({
      reason: `No MPT issuance ID for transaction order ${payloadId} after ${maxRetries} attempts. ${lastReason}`,
    })
  }

  /**
   * Creates and proposes a raw sign intent for an XRPL transaction.
   * @param xrplTransaction - The XRPL transaction details
   * @param options - Optional configuration for the raw sign intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async rawSign(
    xrplTransaction: SubmittableTransaction,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    const context = await this.ports.resolveContext(xrplTransaction.Account, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const encoded = encodeForSigning(xrplTransaction)
    const base64Encoded = Buffer.from(encoded, "hex").toString("base64")

    const { intentResponse } = await this.proposeRawSignIntent(base64Encoded, context, options)
    return intentResponse
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
   * @throws {CustodyError} If validation fails, the sender account is not found,
   *   or the manifest signature is not available after maximum retries
   */
  public async rawSignAndWait(
    xrplTransaction: SubmittableTransaction,
    options: RawSignAndWaitOptions = {},
  ): Promise<RawSignAndWaitResult> {
    if (!isUndefined(options.signerAccount) && !isValidAddress(options.signerAccount)) {
      throw new CustodyError({ reason: `Invalid signerAccount address: ${options.signerAccount}` })
    }

    const signerAddress = options.signerAccount ?? xrplTransaction.Account
    const context = await this.ports.resolveContext(signerAddress, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const transaction = { ...xrplTransaction }

    if (!transaction.SigningPubKey) {
      const pubKey = await this.getPublicKey({
        domainId: context.domainId,
        accountId: context.accountId,
      })
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
   * @throws {CustodyError} If the dry run fails or does not return batch signing data
   */
  public async dryRunBatch(
    payload: BatchPayloadInput,
    options: XrplIntentOptions = {},
  ): Promise<Core_ApiBatchSigningData> {
    await this.guard.checkFeature("Core_XrplOperation_Batch", "xrpl.dryRunBatch")
    validateBatchSequencing(payload)

    const context = await this.ports.resolveContext(payload.Account, {
      domainId: options.domainId,
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
   * @throws {CustodyError} If the signer account is not found, or the signature is not
   *   available after maximum retries
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
   * @throws {CustodyError} If the signer account is not found
   */
  public async signBatchPayload(
    signingPayload: string,
    signerAddress: string,
    options: SignBatchPayloadOptions = {},
  ): Promise<SignBatchPayloadHandle> {
    if (!isValidAddress(signerAddress)) {
      throw new CustodyError({ reason: `Invalid signerAddress: ${signerAddress}` })
    }

    const context = await this.resolveSignerContext(signerAddress, options)

    const signingPubKey = await this.getPublicKey({
      domainId: context.domainId,
      accountId: context.accountId,
    })

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
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the submitter account is not found
   */
  public async proposeBatch(
    payload: BatchPayloadInput,
    batchSigners: Core_BatchSigner[],
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    await this.guard.checkFeature("Core_XrplOperation_Batch", "xrpl.proposeBatch")
    validateBatchSequencing(payload)

    const context = await this.ports.resolveContext(payload.Account, {
      domainId: options.domainId,
      ledgerId: options.ledgerId,
    })

    const operation = buildBatchOperation(payload, batchSigners)
    const body = buildTransactionIntent({ operation, context, options })

    return this.ports.submitIntent(body)
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

  /**
   * Proposes a raw sign intent with base64-encoded bytes.
   * Shared by rawSign, rawSignAndWait, and signBatchPayloadAndWait.
   * @private
   */
  private async proposeRawSignIntent(
    base64Bytes: string,
    context: IntentContext,
    options: XrplIntentOptions,
  ): Promise<{ intentResponse: Core_IntentResponse; payloadId: string }> {
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

    const intent: Core_ProposeIntentBody = {
      request: {
        ...buildRequestEnvelope(context, options, payload),
        type: "Propose",
      },
    }

    const intentResponse = await this.ports.submitIntent(intent)
    return { intentResponse, payloadId }
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
    const { maxRetries = 3, intervalMs = 3000, onAttempt } = options

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      onAttempt?.(attempt)

      const signature = await this.fetchManifestSignature(domainId, accountId, manifestId)
      if (!isUndefined(signature)) {
        return signature
      }

      if (attempt < maxRetries) {
        await sleep(intervalMs)
      }
    }

    return undefined
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
}
