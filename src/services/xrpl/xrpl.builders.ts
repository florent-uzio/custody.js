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
 * Builds an XRPL intent body, returning the transaction-order id alongside it.
 *
 * The id is generated here when the caller did not supply one, and the intent
 * response only carries the *request* id — so it is returned explicitly rather
 * than left for the caller to dig out of the payload union.
 */
export function buildTransactionIntent({
  operation,
  context,
  options,
}: BuildTransactionIntentProps): { body: Core_ProposeIntentBody; payloadId: string } {
  const payload = buildTransactionOrderPayload(operation, context, options)
  return {
    body: {
      request: {
        ...buildRequestEnvelope(context, options, payload),
        type: "Propose",
      },
    },
    payloadId: payload.id,
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
