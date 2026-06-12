import dayjs from "dayjs"
import { v7 as uuidv7 } from "uuid"
import { isUndefined } from "../../helpers/index.js"
import type { Core_IntentDryRunRequest, Core_ProposeIntentBody } from "../intents/intents.types.js"
import type {
  BatchPayloadInput,
  BuildTransactionIntentProps,
  Core_BatchSigner,
  Core_XrplOperation,
  Core_XrplOperation_Batch,
  IntentContext,
  SignBatchPayloadResult,
  XrplIntentOptions,
} from "./xrpl.types.js"

/**
 * Constructs a `Core_XrplOperation_Batch` from `BatchPayloadInput`.
 */
export function buildBatchOperation(
  payload: BatchPayloadInput,
  batchSigners: Core_BatchSigner[],
): Core_XrplOperation_Batch {
  return {
    type: "Batch",
    executionMode: payload.executionMode,
    entries: payload.entries,
    batchSigners,
    sequencing: payload.sequencing ?? { type: "PlatformManaged" },
    ...(!isUndefined(payload.lastLedgerSequence) && {
      lastLedgerSequence: payload.lastLedgerSequence,
    }),
  }
}

/**
 * Builds a `Core_IntentDryRunRequest` body for an XRPL transaction order.
 */
export function buildDryRunBody(
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
    ...(!isUndefined(options.description) && { description: options.description }),
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
 * Builds an XRPL intent body.
 */
export function buildTransactionIntent({
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
      ...(!isUndefined(options.description) && { description: options.description }),
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

/**
 * Assembles a `SignBatchPayloadResult` from the signer details and signature.
 */
export function buildSignBatchPayloadResult(
  params: { signerAddress: string; signingPubKey: string },
  signature: string,
): SignBatchPayloadResult {
  return {
    signature,
    signingPubKey: params.signingPubKey,
    batchSigner: {
      BatchSigner: {
        Account: params.signerAddress,
        SigningPubKey: params.signingPubKey,
        TxnSignature: signature,
      },
    },
    custodyBatchSigner: {
      participant: { type: "Address", address: params.signerAddress },
      publicKey: params.signingPubKey,
      signature,
    },
  }
}
