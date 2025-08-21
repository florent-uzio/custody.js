import { URLs } from "../../constants/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_ApproveIntentBody,
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
}
