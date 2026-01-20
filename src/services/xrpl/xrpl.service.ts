import dayjs from "dayjs"
import { v7 as uuidv7 } from "uuid"
import { encodeForSigning, type SubmittableTransaction } from "xrpl"
import type { ApiService } from "../apis/index.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import { IntentContextService } from "../intent-context/index.js"
import {
  IntentsService,
  type Core_IntentResponse,
  type Core_ProposeIntentBody,
} from "../intents/index.js"
import type {
  BuildIntentProps,
  Core_XrplOperation,
  CustodyAccountSet,
  CustodyClawback,
  CustodyDepositPreauth,
  CustodyMpTokenAuthorize,
  CustodyOfferCreate,
  CustodyPayment,
  CustodyTrustline,
  XrplIntentOptions,
} from "./xrpl.types.js"

export class XrplService {
  private readonly intentService: IntentsService
  private readonly intentContextService: IntentContextService

  constructor(apiService: ApiService, domainCache?: DomainCacheService) {
    this.intentService = new IntentsService(apiService, domainCache)
    this.intentContextService = new IntentContextService(apiService, domainCache)
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
   * Creates and proposes a deposit preauth intent for an XRPL DepositPreauth transaction.
   * @param depositPreauth - The deposit preauth transaction details
   * @param options - Optional configuration for the deposit preauth intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async depositPreauth(
    depositPreauth: CustodyDepositPreauth,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    return this.proposeXrplIntent({ ...depositPreauth, type: "DepositPreauth" }, options)
  }

  /**
   * Creates and proposes a clawback intent for an XRPL Clawback transaction.
   * @param clawback - The clawback transaction details
   * @param options - Optional configuration for the clawback intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async clawback(
    clawback: CustodyClawback,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    return this.proposeXrplIntent({ ...clawback, type: "Clawback" }, options)
  }

  /**
   * Creates and proposes a MPTokenAuthorize intent for an XRPL MPTokenAuthorize transaction.
   * @param mpTokenAuthorize - The MPTokenAuthorize transaction details
   * @param options - Optional configuration for the MPTokenAuthorize intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async mpTokenAuthorize(
    mpTokenAuthorize: CustodyMpTokenAuthorize,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    return this.proposeXrplIntent({ ...mpTokenAuthorize, type: "MPTokenAuthorize" }, options)
  }

  /**
   * Creates and proposes a OfferCreate intent for an XRPL OfferCreate transaction.
   * @param offerCreate - The OfferCreate transaction details
   * @param options - Optional configuration for the OfferCreate intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async offerCreate(
    offerCreate: CustodyOfferCreate,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    return this.proposeXrplIntent({ ...offerCreate, type: "OfferCreate" }, options)
  }

  /**
   * Creates and proposes a AccountSet intent for an XRPL AccountSet transaction.
   * @param accountSet - The AccountSet transaction details
   * @param options - Optional configuration for the AccountSet intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async accountSet(
    accountSet: CustodyAccountSet,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    return this.proposeXrplIntent({ ...accountSet, type: "AccountSet" }, options)
  }

  /**
   * Creates and proposes a raw sign intent for an XRPL transaction.
   * @param xrplTransaction - The XRPL transaction details
   * @param options - Optional configuration for the raw sign intent
   * @returns The proposed intent response
   * @throws {CustodyError} If validation fails or the sender account is not found
   */
  public async rawSign(
    xrplTransaction: SubmittableTransaction,
    options: XrplIntentOptions = {},
  ): Promise<Core_IntentResponse> {
    const context = await this.intentContextService.resolveContext(xrplTransaction.Account, {
      domainId: options.domainId,
    })

    const encoded = encodeForSigning(xrplTransaction)

    const base64Encoded = Buffer.from(encoded).toString("base64")

    const intentId = options.intentId ?? uuidv7()

    const intent: Core_ProposeIntentBody = {
      request: {
        author: {
          id: context.userId,
          domainId: context.domainId,
        },
        expiryAt: dayjs()
          .add(options.expiryDays ?? 1, "day")
          .toISOString(),
        targetDomainId: context.domainId,
        id: intentId,
        customProperties: options.customProperties ?? {},
        payload: {
          id: uuidv7(),
          accountId: context.accountId,
          ledgerId: context.ledgerId,
          customProperties: {},
          content: {
            value: base64Encoded,
            type: "Unsafe",
          },
          type: "v0_SignManifest",
        },
        type: "Propose",
      },
    }

    return this.intentService.proposeIntent(intent)
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
    const intentId = options.intentId ?? uuidv7()

    return {
      request: {
        author: {
          domainId: context.domainId,
          id: context.userId,
        },
        customProperties: options.customProperties ?? {},
        expiryAt: dayjs().add(expiryDays, "day").toISOString(),
        id: intentId,
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
