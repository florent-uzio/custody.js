import dayjs from "dayjs"
import { v7 as uuidv7 } from "uuid"
import { isUndefined } from "../../helpers/index.js"
import type { components } from "../../models/custody-types.js"
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
 * Envelope fields shared by every intent request — dry-run, propose, and
 * raw-sign. The caller supplies the `payload`; the envelope wraps the same
 * author, expiry, id, custom-properties, and target-domain fields around it.
 *
 * `ApiService.post` signs `canonicalize(request)` (RFC 8785), so key order is
 * irrelevant but key inclusion is not — the conditional `description` key is
 * present only when provided.
 */
export function buildRequestEnvelope<TPayload>(
  context: IntentContext,
  options: XrplIntentOptions,
  payload: TPayload,
) {
  const expiryDays = options.expiryDays ?? 1
  const requestId = options.requestId ?? uuidv7()

  return {
    author: { domainId: context.domainId, id: context.userId },
    customProperties: options.requestCustomProperties ?? {},
    ...(!isUndefined(options.description) && { description: options.description }),
    expiryAt: dayjs().add(expiryDays, "day").toISOString(),
    id: requestId,
    payload,
    targetDomainId: context.domainId,
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
 * Builds an XRPL intent body.
 */
export function buildTransactionIntent({
  operation,
  context,
  options,
}: BuildTransactionIntentProps): Core_ProposeIntentBody {
  const payload = buildTransactionOrderPayload(operation, context, options)
  return {
    request: {
      ...buildRequestEnvelope(context, options, payload),
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
