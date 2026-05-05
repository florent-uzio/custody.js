import { createPublicKey } from "crypto"
import dayjs from "dayjs"
import { v7 as uuidv7 } from "uuid"
import {
  encodeForSigning,
  encodeForSigningBatch,
  hashes,
  isValidAddress,
  type Batch,
  type SubmittableTransaction,
} from "xrpl"
import { sleep } from "../../helpers/async/async.js"
import { CustodyError } from "../../models/index.js"
import type { Core_IntentResponse, Core_ProposeIntentBody } from "../intents/intents.types.js"
import type { XrplPorts } from "./xrpl.ports.js"
import type {
  BuildTransactionIntentProps,
  Core_XrplOperation,
  IntentContext,
  RawSignAndWaitOptions,
  RawSignAndWaitResult,
  RawSignInnerBatchOptions,
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
    if (options.signerAccount !== undefined && !isValidAddress(options.signerAccount)) {
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
   * Proposes a raw sign intent for a Batch transaction envelope for a single
   * inner account. The batch envelope (`flags` + all inner transaction hashes)
   * is encoded using `encodeForSigningBatch` and signed with the key of the
   * specified `signerAddress`.
   *
   * All signers sign the same envelope data. Call this once per inner account
   * that is managed by this custody instance.
   *
   * @param batch - The autofilled Batch transaction (with all inner transactions)
   * @param signerAddress - The XRPL address of the inner account to sign for
   * @param options - Optional configuration for the raw sign intent
   * @returns The proposed intent response
   * @throws {CustodyError} If signerAddress is not in the batch, or the account is not found
   */
  public async rawSignInnerBatch(
    batch: Batch,
    signerAddress: string,
    options: RawSignInnerBatchOptions = {},
  ): Promise<Core_IntentResponse> {
    this.validateBatchSigner(batch, signerAddress)

    const context = await this.resolveInnerBatchContext(signerAddress, options)

    const base64Encoded = this.encodeBatchForSigning(batch)

    const { intentResponse } = await this.proposeRawSignIntent(base64Encoded, context, options)
    return intentResponse
  }

  /**
   * Signs a Batch transaction envelope for a single inner account and waits
   * for the manifest signature.
   *
   * All signers sign the same envelope (`flags` + all inner transaction hashes).
   * Call this method once per inner account managed by this custody instance.
   * Inner accounts on other custody instances sign independently with their own SDK.
   *
   * @param batch - The autofilled Batch transaction (with all inner transactions)
   * @param signerAddress - The XRPL address of the inner account to sign for
   * @param options - Optional configuration for the raw sign intent and polling
   * @returns The signature and signing public key in uppercase hex
   * @throws {CustodyError} If signerAddress is not in the batch, the account is not found,
   *   or the manifest signature is not available after maximum retries
   */
  // public async rawSignInnerBatchAndWait(
  //   batch: Batch,
  //   signerAddress: string,
  //   options: RawSignInnerBatchOptions = {},
  // ): Promise<RawSignInnerBatchAndWaitResult> {
  //   this.validateBatchSigner(batch, signerAddress)

  //   const context = await this.resolveInnerBatchContext(signerAddress, options)

  //   const signingPubKey = await this.getPublicKey({
  //     domainId: context.domainId,
  //     accountId: context.accountId,
  //   })

  //   const base64Encoded = this.encodeBatchForSigning(batch)

  //   const { payloadId } = await this.proposeRawSignIntent(base64Encoded, context, options)

  //   const signature = await this.waitForManifestSignature(
  //     context.domainId,
  //     context.accountId,
  //     payloadId,
  //     options.polling,
  //   )

  //   return {
  //     signature,
  //     signingPubKey,
  //     batchSigner: {
  //       BatchSigner: {
  //         Account: signerAddress,
  //         SigningPubKey: signingPubKey,
  //         TxnSignature: signature,
  //       },
  //     },
  //     custodyBatchSigner: {
  //       account: signerAddress,
  //       signingPubKey,
  //       txnSignature: signature,
  //     },
  //   }
  // }

  /**
   * Resolves the intent context for an inner batch signer.
   * When `accountId` and `ledgerId` are provided in options, skips the address lookup.
   * @private
   */
  private async resolveInnerBatchContext(
    signerAddress: string,
    options: RawSignInnerBatchOptions,
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
   * Validates that the signer address is involved in at least one inner transaction.
   * @private
   */
  private validateBatchSigner(batch: Batch, signerAddress: string): void {
    const involvedAccounts = new Set(
      batch.RawTransactions.map((rawTx) => rawTx.RawTransaction.Account),
    )
    if (!involvedAccounts.has(signerAddress)) {
      throw new CustodyError({
        reason: `Address ${signerAddress} is not involved in any inner transaction of the Batch`,
      })
    }
  }

  /**
   * Encodes a Batch transaction envelope for signing.
   * Computes txIDs from inner transactions and encodes with `encodeForSigningBatch`.
   * @private
   */
  private encodeBatchForSigning(batch: Batch): string {
    const txIDs = batch.RawTransactions.map((rawTx) => hashes.hashSignedTx(rawTx.RawTransaction))

    const batchEncodedHex = encodeForSigningBatch({
      flags: batch.Flags,
      txIDs,
    } as unknown as Batch)

    return Buffer.from(batchEncodedHex, "hex").toString("base64")
  }

  /**
   * Proposes a raw sign intent with base64-encoded bytes.
   * Shared by rawSign, rawSignAndWait, and signBytesAndWait.
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
