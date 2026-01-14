import dayjs from "dayjs"
import { v7 as uuidv7 } from "uuid"
import { CustodyError } from "../../models/index.js"
import { AccountsService } from "../accounts/index.js"
import type { ApiService } from "../apis/index.js"
import {
  IntentsService,
  type Core_IntentResponse,
  type Core_ProposeIntentBody,
} from "../intents/index.js"
import { UsersService, type Core_MeReference } from "../users/index.js"
import type { CustodyPayment, PaymentOptions } from "./xrpl.types.js"

export class XrplService {
  private readonly intentService: IntentsService
  private readonly userService: UsersService
  private readonly accountsService: AccountsService
  constructor(apiService: ApiService) {
    this.intentService = new IntentsService(apiService)
    this.userService = new UsersService(apiService)
    this.accountsService = new AccountsService(apiService)
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
    options: PaymentOptions = {},
  ): Promise<Core_IntentResponse> {
    const me = await this.userService.getMe()
    this.validateUser(me)

    const { domainId, userId } = this.resolveDomainAndUser(me, options.domainId)

    const senderAccount = await this.findSenderAccount(payment.Account)

    const paymentIntent = this.buildPaymentIntent(
      payment,
      {
        domainId,
        userId,
        accountId: senderAccount.accountId,
        ledgerId: senderAccount.ledgerId,
      },
      options,
    )

    return this.intentService.proposeIntent(paymentIntent)
  }

  /**
   * Validates that the user has the required login ID and domains.
   * @private
   */
  private validateUser(me: Core_MeReference): void {
    if (!me.loginId?.id) {
      throw new CustodyError({ reason: "User has no login ID" })
    }

    if (me.domains.length === 0) {
      throw new CustodyError({ reason: "User has no domains" })
    }
  }

  /**
   * Resolves the domain ID and user ID to use for the payment.
   * @private
   */
  private resolveDomainAndUser(
    me: Core_MeReference,
    providedDomainId?: string,
  ): { domainId: string; userId: string } {
    if (providedDomainId) {
      const domain = me.domains.find((d) => d.id === providedDomainId)
      if (!domain) {
        throw new CustodyError({
          reason: `Domain with ID ${providedDomainId} not found for user`,
        })
      }
      if (!domain.id) {
        throw new CustodyError({ reason: `Domain ${providedDomainId} has no ID` })
      }
      if (!domain.userReference?.id) {
        throw new CustodyError({ reason: `Domain ${providedDomainId} has no user reference` })
      }
      return { domainId: domain.id, userId: domain.userReference.id }
    }

    if (me.domains.length > 1) {
      throw new CustodyError({
        reason: "User has multiple domains. Please specify domainId in the options parameter.",
      })
    }

    const domain = me.domains[0]
    if (!domain?.id) {
      throw new CustodyError({ reason: "User has no primary domain" })
    }
    if (!domain.userReference?.id) {
      throw new CustodyError({ reason: "Primary domain has no user reference" })
    }

    return { domainId: domain.id, userId: domain.userReference.id }
  }

  /**
   * Finds the sender account by address across all domains.
   * @private
   */
  private async findSenderAccount(address: string): Promise<{
    accountId: string
    ledgerId: string
    address: string
  }> {
    const addressAcrossDomains = await this.accountsService.getAllDomainsAddresses({ address })
    const senderAccount = addressAcrossDomains.items.find((account) => account.address === address)

    if (!senderAccount) {
      throw new CustodyError({ reason: `Sender account not found for address ${address}` })
    }

    return senderAccount
  }

  /**
   * Builds the payment intent request body.
   * @private
   */
  private buildPaymentIntent(
    payment: CustodyPayment,
    context: {
      domainId: string
      userId: string
      accountId: string
      ledgerId: string
    },
    options: PaymentOptions,
  ): Core_ProposeIntentBody {
    const { Account, ...paymentData } = payment
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
            operation: {
              ...paymentData,
              type: "Payment",
            },
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
