import { URLs } from "../../constants/index.js"
import { ApiService } from "../apis/api.service.js"
import type { ApproveIntentRequest } from "./types/approve-intent.types.js"
import type { CreateIntentRequest } from "./types/create-intents.types.js"
import type { IntentResponse } from "./types/common.types.js"
import type { RejectIntentRequest } from "./types/reject-intent.types.js"

export class IntentsService {
  constructor(private api: ApiService) {}

  /**
   * Propose an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  async createIntent(params: CreateIntentRequest): Promise<IntentResponse> {
    return this.api.post<IntentResponse>(URLs.intents, params)
  }

  /**
   * Approve an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  async approveIntent(params: ApproveIntentRequest): Promise<IntentResponse> {
    return this.api.post<IntentResponse>(URLs.intentsApprove, params)
  }

  /**
   * Reject an intent
   * @param params - The parameters for the intent
   * @returns The intent response
   */
  async rejectIntent(params: RejectIntentRequest): Promise<IntentResponse> {
    return this.api.post<IntentResponse>(URLs.intentsReject, params)
  }
}