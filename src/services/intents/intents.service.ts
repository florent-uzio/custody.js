import { URLs } from "../../constants/index.js"
import { replacePathParams } from "../../helpers/url/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_ApproveIntentBody,
  Core_GetIntentPathParams,
  Core_GetIntentsPathParams,
  Core_GetIntentsQueryParams,
  Core_IntentDryRunRequest,
  Core_IntentDryRunResponse,
  Core_IntentResponse,
  Core_ProposeIntentBody,
  Core_RejectIntentBody,
  Core_RemainingDomainUsers,
  Core_RemainingUsersIntentPathParams,
  Core_RemainingUsersIntentQueryParams,
} from "./intents.types.js"

export class IntentsService {
  constructor(private api: ApiService) {}

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
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  async rejectIntent(params: Core_RejectIntentBody): Promise<Core_IntentResponse> {
    return this.api.post<Core_IntentResponse>(URLs.intentsReject, params)
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
  ): Promise<Core_IntentResponse> {
    const url = replacePathParams(URLs.getIntent, {
      domainId: params.domainId,
      intentId: params.intentId,
    })
    return this.api.get<Core_IntentResponse>(url, query)
  }

  /**
   * Get a list of intents
   * @param params - The parameters for the intents
   * @param query - The query parameters for the intents
   * @returns The list of intents
   */
  async getIntents(
    params: Core_GetIntentsPathParams,
    query?: Core_GetIntentsQueryParams,
  ): Promise<Core_IntentResponse> {
    const url = replacePathParams(URLs.domainIntents, {
      domainId: params.domainId,
    })
    return this.api.get<Core_IntentResponse>(url, query)
  }

  /**
   * Dry run an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  async dryRunIntent(params: Core_IntentDryRunRequest): Promise<Core_IntentDryRunResponse> {
    return this.api.post<Core_IntentDryRunResponse>(URLs.intentsDryRun, params)
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
    const url = replacePathParams(URLs.intentRemainingUsers, {
      domainId: params.domainId,
      intentId: params.intentId,
    })
    return this.api.get<Core_RemainingDomainUsers>(url, query)
  }
}
