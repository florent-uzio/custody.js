import { v7 as uuidv7 } from "uuid"
import { isUndefined } from "../../helpers/index.js"
import type { components } from "../../models/custody-types.js"
import { buildRequestEnvelope } from "../../namespaces/intents.js"
import type {
  Core_IntentDryRunRequest,
  Core_ProposeIntentBody,
} from "../../namespaces/intents.types.js"
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
 * Builds the `v0_CreateTransactionOrder` payload shared by the dry-run and
 * propose intents. Typed as `Core_Propose_v0_CreateTransactionOrder`, whose
 * parameters union is a subset of the dry-run one, so the result is assignable
 * to both the `Core_IntentDryRunRequest` and `Core_ProposeIntentBody` payloads.
 */
function buildTransactionOrderPayload(
  operation: Core_XrplOperation,
  context: IntentContext,
  options: XrplIntentOptions,
): components["schemas"]["Core_Propose_v0_CreateTransactionOrder"] {
  const feePriority = options.feePriority ?? "Low"
  const payloadId = options.payloadId ?? uuidv7()

  return {
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
  const payload = buildTransactionOrderPayload(operation, context, options)
  return buildRequestEnvelope(context, options, payload)
}

/**
 * Builds an XRPL intent body, returning the transaction-order id and the
 * intent id alongside it.
 *
 * Both ids are generated here when the caller did not supply one. The intent
 * id is the envelope's own `id` (`options.requestId`, or a fresh one) —
 * that is what the server assigns as the intent's id, not the *request* id
 * `Core_IntentResponse` returns — so it has to be captured from the envelope
 * before it is sent, rather than left for the caller to dig out of the
 * response.
 */
export function buildTransactionIntent({
  operation,
  context,
  options,
}: BuildTransactionIntentProps): {
  body: Core_ProposeIntentBody
  payloadId: string
  intentId: string
} {
  const payload = buildTransactionOrderPayload(operation, context, options)
  const requestEnvelope = buildRequestEnvelope(context, options, payload)
  return {
    body: {
      request: {
        ...requestEnvelope,
        type: "Propose",
      },
    },
    payloadId: payload.id,
    intentId: requestEnvelope.id,
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
