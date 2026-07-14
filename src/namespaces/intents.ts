import { URLs } from "../constants/urls.js"
import { sleep } from "../helpers/index.js"
import { CustodyError } from "../models/index.js"
import type { Transport } from "../transport/index.js"
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
  type Core_RejectIntentBody,
  type Core_RemainingDomainUsers,
  type Core_RemainingUsersIntentPathParams,
  type Core_RemainingUsersIntentQueryParams,
  type Core_TrustedIntent,
  type WaitForExecutionOptions,
  type WaitForExecutionResult,
} from "./intents.types.js"

/**
 * Wait for an intent to reach a terminal status (Executed, Failed, Expired, or Rejected).
 * Polls the intent status at regular intervals until it completes or max retries is reached.
 *
 * A 404 is treated as "not available yet" (e.g. when called immediately after proposing)
 * and is retried within the same polling loop rather than aborting the wait.
 */
async function waitForExecution(
  t: Transport,
  params: Core_GetIntentPathParams,
  options: WaitForExecutionOptions = {},
): Promise<WaitForExecutionResult> {
  const { maxRetries = 10, intervalMs = 3000, onStatusCheck } = options

  let lastIntent: Core_TrustedIntent | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const intent = await t.get<Core_TrustedIntent>(URLs.getIntent, params)
      lastIntent = intent
      const status = intent.data.state.status

      onStatusCheck?.(status, attempt)

      if (TERMINAL_STATUSES.includes(status)) {
        return {
          status,
          isTerminal: true,
          isSuccess: status === "Executed",
          intent,
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
      { reason: `Intent ${params.intentId} not found after ${maxRetries} attempts` },
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
  }
}

export function createIntents(t: Transport) {
  return {
    propose: (params: Core_ProposeIntentBody): Promise<Core_IntentResponse> =>
      t.post(URLs.intents, params),

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
    ): Promise<WaitForExecutionResult> => waitForExecution(t, params, options),
  } as const
}
