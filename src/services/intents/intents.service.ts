import { URLs } from "../../constants/index.js"
import { ApiService } from "../apis/api.service.js"
import type { CreateIntentRequest, IntentResponse } from "./types/create-intents.types.js"

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
}