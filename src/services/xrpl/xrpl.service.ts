import { createPublicKey } from "crypto"
import dayjs from "dayjs"
import { v7 as uuidv7 } from "uuid"
import { encodeForSigning, isValidAddress, type SubmittableTransaction } from "xrpl"
import { sleep } from "../../helpers/async/async.js"
import { isUndefined } from "../../helpers/index.js"
import { CustodyError } from "../../models/index.js"
import type {
  Core_IntentDryRunRequest,
  Core_IntentResponse,
  Core_ProposeIntentBody,
} from "../intents/intents.types.js"
import type { XrplPorts } from "./xrpl.ports.js"
import type {
  BatchPayloadInput,
  BuildTransactionIntentProps,
  Core_ApiBatchSigningData,
  Core_BatchSigner,
  Core_XrplOperation,
  Core_XrplOperation_Batch,
  IntentContext,
  RawSignAndWaitOptions,
  RawSignAndWaitResult,
  SignBatchPayloadOptions,
  SignBatchPayloadResult,
  WaitForSignatureOptions,
  XrplIntentOptions,
} from "./xrpl.types.js"

export class XrplService {
  constructor(private readonly ports: XrplPorts) {}

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
    const context = await this.ports.resolveContext(params.Account, {
      domainId: options.domainId,
    })

    const intent = this.buildTransactionIntent({
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
    })

    if (!xrplTransaction.SigningPubKey) {
      const pubKey = await this.getPublicKey({
        domainId: context.domainId,
        accountId: context.accountId,
      })
      xrplTransaction.SigningPubKey = pubKey
    }

    const encoded = encodeForSigning(xrplTransaction)
    const base64Encoded = Buffer.from(encoded, "hex").toString("base64")

    const { payloadId } = await this.proposeRawSignIntent(base64Encoded, context, options)

    const signature = await this.waitForManifestSignature(
      context.domainId,
      context.accountId,
      payloadId,
      options.polling,
    )

    xrplTransaction.TxnSignature = signature

    return {
      signature,
      signingPubKey: xrplTransaction.SigningPubKey,
      signedTransaction: xrplTransaction,
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
    const context = await this.ports.resolveContext(payload.Account, {
      domainId: options.domainId,
    })

    const operation = this.buildBatchOperation(payload, [])
    const body = this.buildDryRunBody(operation, context, options)

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
    const context = await this.resolveSignerContext(signerAddress, options)

    const signingPubKey = await this.getPublicKey({
      domainId: context.domainId,
      accountId: context.accountId,
    })

    const base64Encoded = Buffer.from(signingPayload, "hex").toString("base64")

    const { payloadId } = await this.proposeRawSignIntent(base64Encoded, context, options)

    const signature = await this.waitForManifestSignature(
      context.domainId,
      context.accountId,
      payloadId,
      options.polling,
    )

    return {
      signature,
      signingPubKey,
      batchSigner: {
        BatchSigner: {
          Account: signerAddress,
          SigningPubKey: signingPubKey,
          TxnSignature: signature,
        },
      },
      custodyBatchSigner: {
        participant: { type: "Address", address: signerAddress },
        publicKey: signingPubKey,
        signature,
      },
    }
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
    const context = await this.ports.resolveContext(payload.Account, {
      domainId: options.domainId,
    })

    const operation = this.buildBatchOperation(payload, batchSigners)
    const body = this.buildTransactionIntent({ operation, context, options })

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
   * Constructs a `Core_XrplOperation_Batch` from `BatchPayloadInput`.
   * @private
   */
  private buildBatchOperation(
    payload: BatchPayloadInput,
    batchSigners: Core_BatchSigner[],
  ): Core_XrplOperation_Batch {
    return {
      type: "Batch",
      executionMode: payload.executionMode,
      entries: payload.entries,
      batchSigners,
      sequencing: payload.sequencing ?? { type: "PlatformManaged" },
      ...(payload.lastLedgerSequence !== undefined && {
        lastLedgerSequence: payload.lastLedgerSequence,
      }),
    }
  }

  /**
   * Builds a `Core_IntentDryRunRequest` body for an XRPL transaction order.
   * @private
   */
  private buildDryRunBody(
    operation: Core_XrplOperation,
    context: IntentContext,
    options: XrplIntentOptions,
  ): Core_IntentDryRunRequest {
    const feePriority = options.feePriority ?? "Low"
    const expiryDays = options.expiryDays ?? 1
    const requestId = options.requestId ?? uuidv7()
    const payloadId = options.payloadId ?? uuidv7()

    return {
      author: { domainId: context.domainId, id: context.userId },
      customProperties: options.requestCustomProperties ?? {},
      expiryAt: dayjs().add(expiryDays, "day").toISOString(),
      id: requestId,
      payload: {
        accountId: context.accountId,
        customProperties: options.payloadCustomProperties ?? {},
        id: payloadId,
        ledgerId: context.ledgerId,
        parameters: {
          feeStrategy: { priority: feePriority, type: "Priority" },
          memos: [],
          operation,
          type: "XRPL",
        },
        type: "v0_CreateTransactionOrder",
      },
      targetDomainId: context.domainId,
    }
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
    const requestId = options.requestId ?? uuidv7()
    const payloadId = options.payloadId ?? uuidv7()

    const intent: Core_ProposeIntentBody = {
      request: {
        author: {
          id: context.userId,
          domainId: context.domainId,
        },
        expiryAt: dayjs()
          .add(options.expiryDays ?? 1, "day")
          .toISOString(),
        targetDomainId: context.domainId,
        id: requestId,
        customProperties: options.requestCustomProperties ?? {},
        payload: {
          id: payloadId,
          accountId: context.accountId,
          ledgerId: context.ledgerId,
          customProperties: options.payloadCustomProperties ?? {},
          content: {
            value: base64Bytes,
            type: "Unsafe",
          },
          type: "v0_SignManifest",
        },
        type: "Propose",
      },
    }

    const intentResponse = await this.ports.submitIntent(intent)
    return { intentResponse, payloadId }
  }

  /**
   * Polls the manifest until a signature is available, then returns it as uppercase hex.
   * Handles both the manifest not existing yet (404) and the manifest existing
   * but not yet having a signature.
   * @private
   */
  private async waitForManifestSignature(
    domainId: string,
    accountId: string,
    manifestId: string,
    options: WaitForSignatureOptions = {},
  ): Promise<string> {
    const { maxRetries = 3, intervalMs = 3000, onAttempt } = options

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      onAttempt?.(attempt)

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

      if (attempt < maxRetries) {
        await sleep(intervalMs)
      }
    }

    throw new CustodyError({
      reason: "Manifest signature not available after maximum retries",
    })
  }

  /**
   * Builds an XRPL intent body.
   * @private
   */
  private buildTransactionIntent({
    operation,
    context,
    options,
  }: BuildTransactionIntentProps): Core_ProposeIntentBody {
    const feePriority = options.feePriority ?? "Low"
    const expiryDays = options.expiryDays ?? 1
    const requestId = options.requestId ?? uuidv7()
    const payloadId = options.payloadId ?? uuidv7()

    return {
      request: {
        author: {
          domainId: context.domainId,
          id: context.userId,
        },
        customProperties: options.requestCustomProperties ?? {},
        expiryAt: dayjs().add(expiryDays, "day").toISOString(),
        id: requestId,
        payload: {
          accountId: context.accountId,
          customProperties: options.payloadCustomProperties ?? {},
          id: payloadId,
          ledgerId: context.ledgerId,
          parameters: {
            feeStrategy: {
              priority: feePriority,
              type: "Priority",
            },
            memos: [],
            operation,
            type: "XRPL",
          },
          type: "v0_CreateTransactionOrder",
        },
        targetDomainId: context.domainId,
        type: "Propose",
      },
    }
  }
}

/**
 * Compresses a base64-encoded SPKI/DER secp256k1 public key to its compressed hex form.
 * Uses Node.js built-in crypto via JWK export to extract the raw EC point coordinates.
 */
function compressPublicKey(base64PublicKey: string): string {
  const publicKey = createPublicKey({
    key: Buffer.from(base64PublicKey, "base64"),
    format: "der",
    type: "spki",
  })

  const jwk = publicKey.export({ format: "jwk" })
  const x = Buffer.from(jwk.x!, "base64url")
  const y = Buffer.from(jwk.y!, "base64url")
  const lastByte = y[y.length - 1]!
  const prefix = lastByte % 2 === 0 ? "02" : "03"
  return (prefix + x.toString("hex")).toUpperCase()
}
