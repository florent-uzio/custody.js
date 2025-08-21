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
} from "./intents.types.js"

export class IntentsService {
  constructor(private api: ApiService) {}

  /**
   * Propose an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  proposeIntent(params: Core_ProposeIntentBody) {
    return this.api.post<Core_IntentResponse>(URLs.intents, params)
  }

  /**
   * Approve an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  approveIntent(params: Core_ApproveIntentBody) {
    return this.api.post<Core_IntentResponse>(URLs.intentsApprove, params)
  }

  /**
   * Reject an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  rejectIntent(params: Core_RejectIntentBody) {
    return this.api.post<Core_IntentResponse>(URLs.intentsReject, params)
  }

  /**
   * Get an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  getIntent(params: Core_GetIntentPathParams, query?: Core_GetIntentsQueryParams) {
    const url = replacePathParams(URLs.getIntent, {
      domainId: params.domainId,
      intentId: params.intentId,
    })
    return this.api.get<Core_IntentResponse>(url, { params: query })
  }

  /**
   * Get a list of intents
   * @param params - The parameters for the intents
   * @param query - The query parameters for the intents
   * @returns The list of intents
   */
  getIntents(params: Core_GetIntentsPathParams, query?: Core_GetIntentsQueryParams) {
    const url = replacePathParams(URLs.domainIntents, {
      domainId: params.domainId,
    })
    return this.api.get<Core_IntentResponse>(url, { params: query })
  }

  /**
   * Dry run an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  dryRunIntent(params: Core_IntentDryRunRequest) {
    return this.api.post<Core_IntentDryRunResponse>(URLs.intentsDryRun, params)
  }
}
