import { URLs } from "../../constants/index.js"
import { replacePathParams, sleep } from "../../helpers/index.js"
import { CustodyError } from "../../models/index.js"
import { ApiService } from "../apis/api.service.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import { IntentContextService } from "../intent-context/index.js"
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

export class IntentsService {
  private readonly intentContextService: IntentContextService

  constructor(
    private api: ApiService,
    domainCache?: DomainCacheService,
  ) {
    this.intentContextService = new IntentContextService(api, domainCache)
  }

  /**
   * Propose an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  async proposeIntent(params: Core_ProposeIntentBody): Promise<Core_IntentResponse> {
    return this.api.post<Core_IntentResponse>(URLs.intents, params)
  }

  /**
   * Approve an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  async approveIntent(params: Core_ApproveIntentBody): Promise<Core_IntentResponse> {
    return this.api.post<Core_IntentResponse>(URLs.intentsApprove, params)
  }

  /**
   * Reject an intent
   * @param body - The parameters for the intent
   * @returns The intent response
   */
  async rejectIntent(body: Core_RejectIntentBody): Promise<Core_IntentResponse> {
    return this.api.post<Core_IntentResponse>(URLs.intentsReject, body)
  }

  /**
   * Get an intent
   * @param params - The parameters for the intent
   * @param query - The query parameters for the intent
   * @returns The intent response
   */
  async getIntent(
    params: Core_GetIntentPathParams,
    query?: Core_GetIntentsQueryParams,
  ): Promise<Core_TrustedIntent> {
    const domainId = params.domainId ?? (await this.resolveDomainId())
    const url = replacePathParams(URLs.getIntent, {
      domainId,
      intentId: params.intentId,
    })
    return this.api.get<Core_TrustedIntent>(url, query)
  }

  /**
   * Get a list of intents
   * @param params - The parameters for the intents
   * @param query - The query parameters for the intents
   * @returns The list of intents
   */
  async getIntents(
    params?: Core_GetIntentsPathParams,
    query?: Core_GetIntentsQueryParams,
  ): Promise<Core_IntentResponse> {
    const domainId = params?.domainId ?? (await this.resolveDomainId())
    const url = replacePathParams(URLs.domainIntents, {
      domainId,
    })
    return this.api.get<Core_IntentResponse>(url, query)
  }

  /**
   * Dry run an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  async dryRunIntent(body: Core_IntentDryRunRequest): Promise<Core_IntentDryRunResponse> {
    return this.api.post<Core_IntentDryRunResponse>(URLs.intentsDryRun, body)
  }

  /**
   * Remaining users for an intent
   * @param params - The parameters for the intent
   * @param query - The query parameters for remaining users
   * @returns The remaining users response
   */
  async remainingUsersIntent(
    params: Core_RemainingUsersIntentPathParams,
    query?: Core_RemainingUsersIntentQueryParams,
  ): Promise<Core_RemainingDomainUsers> {
    const domainId = params.domainId ?? (await this.resolveDomainId())
    const url = replacePathParams(URLs.intentRemainingUsers, {
      domainId,
      intentId: params.intentId,
    })
    return this.api.get<Core_RemainingDomainUsers>(url, query)
  }

  /**
   * Wait for an intent to reach a terminal status (Executed, Failed, Expired, or Rejected).
   * Polls the intent status at regular intervals until it completes or max retries is reached.
   *
   * @param params - The domain and intent IDs
   * @param options - Configuration for polling behavior
   * @returns The execution result containing final status and intent
   *
   * @example
   * ```typescript
   * const result = await intentsService.waitForExecution(
   *   { domainId: "domain-123", intentId: "intent-456" },
   *   {
   *     maxRetries: 60,
   *     intervalMs: 3000,
   *     onStatusCheck: (status, attempt) => console.log(`Attempt ${attempt}: ${status}`)
   *   }
   * )
   *
   * if (result.isSuccess) {
   *   console.log("Intent executed successfully!")
   * }
   * ```
   */
  async waitForExecution(
    params: Core_GetIntentPathParams,
    options: WaitForExecutionOptions = {},
  ): Promise<WaitForExecutionResult> {
    const {
      maxRetries = 10,
      intervalMs = 3000,
      notFoundRetries = 3,
      notFoundIntervalMs = 1000,
      onStatusCheck,
    } = options

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const intent = await this.getIntentWithRetry(params, notFoundRetries, notFoundIntervalMs)
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

      // Don't sleep after the last attempt
      if (attempt < maxRetries) {
        await sleep(intervalMs)
      }
    }

    // Max retries reached without terminal status
    const finalIntent = await this.getIntentWithRetry(params, notFoundRetries, notFoundIntervalMs)
    return {
      status: finalIntent.data.state.status,
      isTerminal: false,
      isSuccess: false,
      intent: finalIntent,
    }
  }

  /**
   * Fetches an intent with retry logic for 404 errors.
   * Useful when the intent might not be immediately available after creation.
   */
  private async getIntentWithRetry(
    params: Core_GetIntentPathParams,
    maxRetries: number,
    intervalMs: number,
  ): Promise<Core_TrustedIntent> {
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.getIntent(params)
      } catch (error) {
        if (error instanceof CustodyError && error.statusCode === 404) {
          lastError = error
          // Don't sleep after the last attempt
          if (attempt < maxRetries) {
            await sleep(intervalMs)
          }
          continue
        }
        // Re-throw non-404 errors immediately
        throw error
      }
    }

    // If we've exhausted retries, throw the last 404 error
    throw lastError
  }

  /**
   * Resolves the domain ID using the IntentContextService.
   * Uses caching to avoid repeated API calls.
   * @returns The resolved domain ID
   * @throws {CustodyError} If domain resolution fails
   */
  private async resolveDomainId(): Promise<string> {
    const { domainId } = await this.intentContextService.resolveDomainOnly()
    return domainId
  }
}
