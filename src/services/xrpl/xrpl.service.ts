import dayjs from "dayjs"
import { v7 as uuidv7 } from "uuid"
import type { ApiService } from "../apis/index.js"
import { IntentContextService } from "../intent-context/index.js"
import {
  IntentsService,
  type Core_IntentResponse,
  type Core_ProposeIntentBody,
} from "../intents/index.js"
import type {
  BuildIntentProps,
  Core_XrplOperation,
  CustodyPayment,
  CustodyTrustline,
  XrplIntentOptions,
} from "./xrpl.types.js"

export class XrplService {
  private readonly intentService: IntentsService
  private readonly intentContextService: IntentContextService

  constructor(apiService: ApiService) {
    this.intentService = new IntentsService(apiService)
    this.intentContextService = new IntentContextService(apiService)
  }

  /**
   * Creates and proposes a payment intent for an XRPL payment transaction.
   * @param payment - The payment transaction details
   * @param options - Optional configuration for the payment intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async sendPayment(
    payment: CustodyPayment,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    return this.proposeXrplIntent({ ...payment, type: "Payment" }, options)
  }

  /**
   * Creates and proposes a trustline intent for an XRPL TrustSet transaction.
   * @param trustline - The trustline transaction details
   * @param options - Optional configuration for the trustline intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async createTrustline(
    trustline: CustodyTrustline,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    return this.proposeXrplIntent({ ...trustline, type: "TrustSet" }, options)
  }

  /**
   * Generic method to propose an XRPL intent with the common flow.
   * Handles context resolution and intent submission.
   * @private
   */
  private async proposeXrplIntent(
    data: Core_XrplOperation & { Account: string },
    options: XrplIntentOptions,
  ): Promise<Core_IntentResponse> {
    const context = await this.intentContextService.resolveContext(data.Account, {
      domainId: options.domainId,
    })

    // Remove Account from operation data (it's only used to find the sender)
    const { Account, ...operation } = data

    const intent = this.buildIntent({
      operation,
      context,
      options,
    })

    return this.intentService.proposeIntent(intent)
  }

  /**
   * Builds an XRPL intent body.
   * @private
   */
  private buildIntent({ operation, context, options }: BuildIntentProps): Core_ProposeIntentBody {
    const feePriority = options.feePriority ?? "Low"
    const expiryDays = options.expiryDays ?? 1

    return {
      request: {
        author: {
          domainId: context.domainId,
          id: context.userId,
        },
        customProperties: options.customProperties ?? {},
        expiryAt: dayjs().add(expiryDays, "day").toISOString(),
        id: uuidv7(),
        payload: {
          accountId: context.accountId,
          customProperties: {},
          id: uuidv7(),
          ledgerId: context.ledgerId,
          parameters: {
            feeStrategy: {
              priority: feePriority,
              type: "Priority",
            },
            memos: [],
            operation,
            type: "XRPL",
          },
          type: "v0_CreateTransactionOrder",
        },
        targetDomainId: context.domainId,
        type: "Propose",
      },
    }
  }
}
