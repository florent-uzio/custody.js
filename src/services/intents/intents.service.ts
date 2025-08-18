import { URLs } from "../../constants/index.js"
import { ApiService } from "../apis/api.service.js"
import type { CreateIntentRequest, IntentResponse } from "./intents.types.js"

export class IntentsService {
  constructor(private api: ApiService) {}

  async createIntent(params: CreateIntentRequest): Promise<IntentResponse> {
    return this.api.post<IntentResponse>(URLs.intents, params)
  }
}