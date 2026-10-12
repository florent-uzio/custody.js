import dayjs from "dayjs"
import { v7 as uuidv7 } from "uuid"
import { URLs } from "../constants/urls.js"
import { isUndefined, sleep } from "../helpers/index.js"
import type { DomainUserReference } from "../models/domain-resolver.js"
import { CustodyError } from "../models/index.js"
import type { Transport } from "../transport/index.js"
import { resolveDomainAndUser } from "./domains.js"
import {
  TERMINAL_STATUSES,
  type Core_ApproveIntentBody,
  type Core_GetIntentPathParams,
  type Core_GetIntentsPathParams,
  type Core_GetIntentsQueryParams,
  type Core_IntentDryRunRequest,
  type Core_IntentDryRunResponse,
  type Core_IntentResponse,
  type Core_ProposeIntentBody,
  type Core_ProposeUserIntentPayload,
  type Core_RejectIntentBody,
  type Core_RemainingDomainUsers,
  type Core_RemainingUsersIntentPathParams,
  type Core_RemainingUsersIntentQueryParams,
  type Core_TrustedIntent,
  type IntentEnvelopeOptions,
  type ProposePayloadAndWaitOptions,
  type ProposePayloadAndWaitResult,
  type ProposePayloadResult,
  type WaitForExecutionOptions,
  type WaitForExecutionResult,
} from "./intents.types.js"
import type { Core_MeReference } from "./users.types.js"

/**
 * Envelope fields shared by every intent request — dry-run, propose, and
 * raw-sign. The caller supplies the `payload`; the envelope wraps the same
 * author, expiry, id, custom-properties, and target-domain fields around it.
 *
 * Generic over the payload because it is not XRPL-specific: a transaction
 * order, a `v0_ReleaseQuarantinedTransfers` and a `v0_CreateUser` all travel in
 * this same envelope.
 *
 * `ApiService.post` signs `canonicalize(request)` (RFC 8785), so key order is
 * irrelevant but key inclusion is not — the conditional `description` key is
 * present only when provided.
 */
export function buildRequestEnvelope<TPayload>(
  context: DomainUserReference,
  options: IntentEnvelopeOptions,
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
 * Says in one sentence why a wait on an intent is not a success.
 *
 * `state.error` is the most specific surface — it carries a rejection code and
 * a message from the policy engine — so it is preferred over the status alone
 * whenever custody filled it in.
 */
function failureReason(
  intent: Core_TrustedIntent,
  isTerminal: boolean,
  maxRetries: number,
): string {
  const { id } = intent.data
  const { status, error } = intent.data.state

  if (!isTerminal) {
    return status === "Open"
      ? `Intent ${id} was still awaiting approval after ${maxRetries} attempts.`
      : `Intent ${id} was still ${status} after ${maxRetries} attempts.`
  }

  if (!isUndefined(error)) {
    return `Intent ${id} was ${status} (${error.code}): ${error.message}`
  }

  return `Intent ${id} did not execute (status: ${status}).`
}

/**
 * Wait for an intent to reach a terminal status (Executed, Failed, Expired, or Rejected).
 * Polls the intent status at regular intervals until it completes or max retries is reached.
 *
 * A 404 is treated as "not available yet" (e.g. when called immediately after proposing)
 * and is retried within the same polling loop rather than aborting the wait.
 *
 * Never throws on a failed intent — the outcome is reported through
 * `isSuccess` / `isTerminal`, with `reason` saying the same thing in one
 * sentence for the log line or the error the caller throws.
 *
 * Takes the lookup as a callback rather than a transport, so `XrplService` can
 * drive the same loop through its ports instead of restating it. `intentId` is
 * only used to name the intent in the not-found error.
 */
export async function waitForExecution(
  fetchIntent: () => Promise<Core_TrustedIntent>,
  intentId: string,
  options: WaitForExecutionOptions = {},
): Promise<WaitForExecutionResult> {
  const { maxRetries = 10, intervalMs = 3000, onStatusCheck } = options

  let lastIntent: Core_TrustedIntent | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const intent = await fetchIntent()
      lastIntent = intent
      const status = intent.data.state.status

      onStatusCheck?.(status, attempt)

      if (TERMINAL_STATUSES.includes(status)) {
        const isSuccess = status === "Executed"
        return {
          status,
          isTerminal: true,
          isSuccess,
          intent,
          reason: isSuccess ? undefined : failureReason(intent, true, maxRetries),
        }
      }
    } catch (error) {
      if (!(error instanceof CustodyError && error.statusCode === 404)) {
        throw error
      }
      // 404 → the intent is not available yet, keep polling.
    }

    if (attempt < maxRetries) {
      await sleep(intervalMs)
    }
  }

  // Retries exhausted. If the intent never materialized, surface that as a 404.
  if (!lastIntent) {
    throw new CustodyError(
      { reason: `Intent ${intentId} not found after ${maxRetries} attempts` },
      404,
    )
  }

  // The loop returns early on any terminal status, so the last observed intent is
  // necessarily non-terminal here.
  return {
    status: lastIntent.data.state.status,
    isTerminal: false,
    isSuccess: false,
    intent: lastIntent,
    reason: failureReason(lastIntent, false, maxRetries),
  }
}

export function createIntents(t: Transport) {
  /**
   * Resolves the domain/user pair the envelope's `author` needs.
   * One `/v1/me` per propose — the same lookup `XrplPorts.resolveContext` makes.
   */
  const resolveContext = async (domainId?: string): Promise<DomainUserReference> =>
    resolveDomainAndUser(await t.get<Core_MeReference>(URLs.me), domainId)

  return {
    propose: (params: Core_ProposeIntentBody): Promise<Core_IntentResponse> =>
      t.post(URLs.intents, params),

    /**
     * Proposes a `v0_*` payload, building the request envelope around it.
     *
     * Everything but the payload — `type: "Propose"`, `author`, `targetDomainId`,
     * `expiryAt`, `id`, `customProperties` — is filled in from the resolved
     * domain context and the options, so the caller supplies only the intent
     * it actually wants. `propose` remains the raw escape hatch for callers who
     * have assembled the envelope themselves.
     *
     * For XRPL transaction orders prefer `xrpl.proposeIntent`, which also
     * resolves the address to an account, applies a fee strategy and returns the
     * payload id. This path accepts them too — it is the only path for the other
     * ledgers' transaction orders, which have no typed service of their own.
     *
     * @param payload - The `v0_*` intent payload
     * @param options - Envelope fields; `domainId` pins the domain
     * @returns The intent id to poll or approve it by, the server's own
     *   request id, and the domain it resolved
     * @throws {CustodyError} If the domain cannot be resolved, or the propose
     *   call is rejected
     */
    proposePayload: async (
      payload: Core_ProposeUserIntentPayload,
      options: IntentEnvelopeOptions = {},
    ): Promise<ProposePayloadResult> => {
      const context = await resolveContext(options.domainId)
      const requestEnvelope = buildRequestEnvelope(context, options, payload)
      const request: Core_ProposeIntentBody["request"] = { ...requestEnvelope, type: "Propose" }
      const response = await t.post<Core_IntentResponse>(URLs.intents, { request })

      return { ...response, intentId: requestEnvelope.id, domainId: context.domainId }
    },

    /**
     * Proposes a `v0_*` payload and polls it to a terminal status.
     *
     * **Approval flows.** Most intents are gated on a custodian approving them,
     * and the default wait is 10 attempts 3s apart — 30 seconds. A real operator
     * can take minutes, so against production this will routinely return
     * `{ isTerminal: false, status: "Open" }`, which means "still waiting on a
     * human", not "failed". That outcome is honest, not an error, so it is
     * reported rather than thrown, and `reason` says so in words.
     *
     * Raising `maxRetries` only moves the problem: no polling budget is right
     * for a human. In production prefer `proposePayload`, keep the `intentId`,
     * and pick the intent up later from events or a webhook. Reserve this method
     * for development, auto-approved policies, and tests.
     *
     * Never throws on a rejected or expired intent — the outcome is reported
     * through `isSuccess` / `isTerminal`, as `getAndWait` does. Propose-time
     * errors still throw.
     *
     * @param payload - The `v0_*` intent payload
     * @param options - Envelope fields, plus polling configuration
     * @returns The wait outcome, plus the ids and domain it was proposed under
     * @throws {CustodyError} If the domain cannot be resolved, the propose call
     *   is rejected, or the intent is never registered
     */
    proposeAndWait: async (
      payload: Core_ProposeUserIntentPayload,
      options: ProposePayloadAndWaitOptions = {},
    ): Promise<ProposePayloadAndWaitResult> => {
      const context = await resolveContext(options.domainId)
      const requestEnvelope = buildRequestEnvelope(context, options, payload)
      const request: Core_ProposeIntentBody["request"] = { ...requestEnvelope, type: "Propose" }
      const { requestId } = await t.post<Core_IntentResponse>(URLs.intents, { request })
      const { domainId } = context
      const intentId = requestEnvelope.id

      const result = await waitForExecution(
        () => t.get<Core_TrustedIntent>(URLs.getIntent, { domainId, intentId }),
        intentId,
        options,
      )

      return { ...result, intentId, requestId, domainId }
    },

    approve: (params: Core_ApproveIntentBody): Promise<Core_IntentResponse> =>
      t.post(URLs.intentsApprove, params),

    reject: (params: Core_RejectIntentBody): Promise<Core_IntentResponse> =>
      t.post(URLs.intentsReject, params),

    get: (
      params: Core_GetIntentPathParams,
      query?: Core_GetIntentsQueryParams,
    ): Promise<Core_TrustedIntent> => t.get(URLs.getIntent, params, query),

    list: (
      params: Core_GetIntentsPathParams,
      query?: Core_GetIntentsQueryParams,
    ): Promise<Core_IntentResponse> => t.get(URLs.domainIntents, params, query),

    dryRun: (params: Core_IntentDryRunRequest): Promise<Core_IntentDryRunResponse> =>
      t.post(URLs.intentsDryRun, params, undefined, { sign: false }),

    remainingUsers: (
      params: Core_RemainingUsersIntentPathParams,
      query?: Core_RemainingUsersIntentQueryParams,
    ): Promise<Core_RemainingDomainUsers> => t.get(URLs.intentRemainingUsers, params, query),

    getAndWait: (
      params: Core_GetIntentPathParams,
      options?: WaitForExecutionOptions,
    ): Promise<WaitForExecutionResult> =>
      waitForExecution(
        () => t.get<Core_TrustedIntent>(URLs.getIntent, params),
        params.intentId,
        options,
      ),
  } as const
}
