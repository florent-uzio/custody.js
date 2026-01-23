import { beforeEach, describe, expect, it, vi } from "vitest"
import type { SubmittableTransaction } from "xrpl"
import { CustodyError } from "../../models/index.js"
import { AccountsService } from "../accounts/index.js"
import type { ApiService } from "../apis/index.js"
import { DomainResolverService } from "../domain-resolver/index.js"
import { IntentsService } from "../intents/index.js"
import { XrplService } from "./xrpl.service.js"
import type {
  CustodyAccountSet,
  CustodyClawback,
  CustodyDepositPreauth,
  CustodyMpTokenAuthorize,
  CustodyMpTokenIssuanceCreate,
  CustodyMpTokenIssuanceDestroy,
  CustodyMpTokenIssuanceSet,
  CustodyOfferCreate,
  CustodyPayment,
  CustodyTrustline,
  IntentContext,
  XrplIntentOptions,
} from "./xrpl.types.js"

// Mock the xrpl encodeForSigning function
vi.mock("xrpl", () => ({
  encodeForSigning: vi.fn().mockReturnValue("mockedEncodedTransaction"),
}))

describe("XrplService", () => {
  let xrplService: XrplService
  let mockApiService: ApiService
  let mockDomainResolver: DomainResolverService
  let mockAccountsService: AccountsService
  let mockIntentsService: IntentsService

  const mockDomainId = "domain-123"
  const mockUserId = "user-123"
  const mockAccountId = "account-123"
  const mockLedgerId = "ledger-123"
  const mockAddress = "rLpUHpWU455zTvVq65EEeHss52Dk4WvQHn"

  const mockDomainUserRef = {
    domainId: mockDomainId,
    userId: mockUserId,
  }

  const mockAccountRef = {
    accountId: mockAccountId,
    ledgerId: mockLedgerId,
    address: mockAddress,
  }

  const mockContext: IntentContext = {
    ...mockDomainUserRef,
    ...mockAccountRef,
  }

  const mockPayment: CustodyPayment = {
    Account: mockAddress,
    amount: "1000000",
    destination: {
      type: "Address",
      address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
    },
    destinationTag: 0,
  }

  beforeEach(() => {
    // Create mock API service
    mockApiService = {} as ApiService

    // Create mock service instances with spies
    mockDomainResolver = {
      resolve: vi.fn(),
    } as unknown as DomainResolverService

    mockAccountsService = {
      findByAddress: vi.fn(),
    } as unknown as AccountsService

    mockIntentsService = {
      proposeIntent: vi.fn(),
    } as unknown as IntentsService

    // Create XrplService instance
    xrplService = new XrplService(mockApiService)

    // Replace internal services with mocks
    // @ts-expect-error - accessing private property for testing
    xrplService.domainResolver = mockDomainResolver
    // @ts-expect-error - accessing private property for testing
    xrplService.accountsService = mockAccountsService
    // @ts-expect-error - accessing private property for testing
    xrplService.intentService = mockIntentsService
  })

  describe("sendPayment", () => {
    it("should successfully send a payment with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.sendPayment(mockPayment)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "Payment"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("Payment")
          expect(intentCall.request.payload.parameters.operation.amount).toBe("1000000")
          if (intentCall.request.payload.parameters.feeStrategy.type === "Priority") {
            expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("Low")
          }
        }
      }
      expect(intentCall.request.type).toBe("Propose")
    })

    it("should send payment with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "High",
        expiryDays: 7,
        customProperties: { orderId: "order-123" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.sendPayment(mockPayment, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("High")
      }
      expect(intentCall.request.customProperties).toEqual({ orderId: "order-123" })
      expect(intentCall.request.expiryAt).toBeDefined()
    })

    it("should pass domainId to resolveContext when user has multiple domains", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.sendPayment(mockPayment, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow("User has no login ID")
    })

    it("should throw error when user has no domains", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no domains" }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow("User has no domains")
    })

    it("should throw error when user has multiple domains without domainId option", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({
          reason: "User has multiple domains. Please specify domainId in the options parameter.",
        }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        "User has multiple domains. Please specify domainId in the options parameter.",
      )
    })

    it("should throw error when provided domainId is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({
          reason: "Domain with ID non-existent-domain not found for user",
        }),
      )

      await expect(
        xrplService.sendPayment(mockPayment, { domainId: "non-existent-domain" }),
      ).rejects.toThrow(CustodyError)
      await expect(
        xrplService.sendPayment(mockPayment, { domainId: "non-existent-domain" }),
      ).rejects.toThrow("Domain with ID non-existent-domain not found for user")
    })

    it("should throw error when domain has no ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no primary domain" }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        "User has no primary domain",
      )
    })

    it("should throw error when domain has no user reference", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "Primary domain has no user reference" }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        "Primary domain has no user reference",
      )
    })

    it("should throw error when sender account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should include all payment data in the operation", async () => {
      const paymentWithCurrency: CustodyPayment = {
        Account: mockAddress,
        amount: "1000000",
        destination: {
          type: "Address",
          address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        },
        destinationTag: 12345,
        currency: {
          type: "MultiPurposeToken",
          issuanceId: "issuance-123",
        },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.sendPayment(paymentWithCurrency)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "Payment"
      ) {
        const operation = intentCall.request.payload.parameters.operation

        expect(operation.type).toBe("Payment")
        expect(operation.amount).toBe("1000000")
        expect(operation.destination).toEqual(paymentWithCurrency.destination)
        expect(operation.destinationTag).toBe(12345)
        expect(operation.currency).toEqual(paymentWithCurrency.currency)
      }
    })

    it("should set expiry date correctly based on expiryDays option", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      const expiryDays = 5
      await xrplService.sendPayment(mockPayment, { expiryDays })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      const expiryDate = new Date(intentCall.request.expiryAt)
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() + expiryDays)

      // Allow 1 second difference for execution time
      expect(Math.abs(expiryDate.getTime() - expectedDate.getTime())).toBeLessThan(1000)
    })

    it("should use different fee priorities correctly", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      const priorities: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"]

      for (const priority of priorities) {
        vi.clearAllMocks()
        vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
        vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
        vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
          requestId: "request-123",
        } as any)

        await xrplService.sendPayment(mockPayment, { feePriority: priority })

        const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
        if (
          intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.feeStrategy.type === "Priority"
        ) {
          expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe(priority)
          expect(intentCall.request.payload.parameters.feeStrategy.type).toBe("Priority")
        }
      }
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-payment-intent-id-123"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.sendPayment(mockPayment, { intentId: customIntentId })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })
  })

  describe("createTrustline", () => {
    const mockTrustline: CustodyTrustline = {
      Account: mockAddress,
      flags: ["tfSetfAuth"],
      limitAmount: {
        currency: {
          type: "Currency",
          code: "USD",
          issuer: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        },
        value: "1000000",
      },
    }

    it("should successfully create a trustline with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.createTrustline(mockTrustline)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "TrustSet"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("TrustSet")
          expect(intentCall.request.payload.parameters.operation.flags).toEqual(["tfSetfAuth"])
          expect(intentCall.request.payload.parameters.operation.limitAmount).toEqual(
            mockTrustline.limitAmount,
          )
        }
      }
    })

    it("should create trustline with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "Medium",
        expiryDays: 3,
        customProperties: { reference: "trustline-setup" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.createTrustline(mockTrustline, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("Medium")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "trustline-setup" })
    })

    it("should create trustline with enableRippling option", async () => {
      const trustlineWithRippling: CustodyTrustline = {
        ...mockTrustline,
        enableRippling: true,
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.createTrustline(trustlineWithRippling)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "TrustSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.enableRippling).toBe(true)
      }
    })

    it("should pass domainId to resolveContext when user has multiple domains", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.createTrustline(mockTrustline, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.createTrustline(mockTrustline)).rejects.toThrow(CustodyError)
      await expect(xrplService.createTrustline(mockTrustline)).rejects.toThrow(
        "User has no login ID",
      )
    })

    it("should throw error when sender account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.createTrustline(mockTrustline)).rejects.toThrow(CustodyError)
      await expect(xrplService.createTrustline(mockTrustline)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-trustline-intent-id-456"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.createTrustline(mockTrustline, { intentId: customIntentId })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })

    it("should create trustline with multiple flags", async () => {
      const trustlineWithMultipleFlags: CustodyTrustline = {
        Account: mockAddress,
        flags: ["tfSetFreeze", "tfClearFreeze"],
        limitAmount: {
          currency: {
            type: "Currency",
            code: "EUR",
            issuer: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
          },
          value: "500000",
        },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.createTrustline(trustlineWithMultipleFlags)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "TrustSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual([
          "tfSetFreeze",
          "tfClearFreeze",
        ])
        expect(intentCall.request.payload.parameters.operation.limitAmount.value).toBe("500000")
        expect(intentCall.request.payload.parameters.operation.limitAmount.currency).toEqual({
          type: "Currency",
          code: "EUR",
          issuer: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        })
      }
    })
  })

  describe("depositPreauth", () => {
    const mockDepositPreauthAuthorize: CustodyDepositPreauth = {
      Account: mockAddress,
      authorize: {
        type: "Address",
        address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      },
    }

    const mockDepositPreauthUnauthorize: CustodyDepositPreauth = {
      Account: mockAddress,
      unauthorize: {
        type: "Address",
        address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      },
    }

    it("should successfully create a deposit preauth with authorize", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.depositPreauth(mockDepositPreauthAuthorize)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "DepositPreauth"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("DepositPreauth")
          expect(intentCall.request.payload.parameters.operation.authorize).toEqual(
            mockDepositPreauthAuthorize.authorize,
          )
        }
      }
    })

    it("should successfully create a deposit preauth with unauthorize", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.depositPreauth(mockDepositPreauthUnauthorize)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "DepositPreauth"
      ) {
        expect(intentCall.request.payload.parameters.operation.type).toBe("DepositPreauth")
        expect(intentCall.request.payload.parameters.operation.unauthorize).toEqual(
          mockDepositPreauthUnauthorize.unauthorize,
        )
        expect(intentCall.request.payload.parameters.operation.authorize).toBeUndefined()
      }
    })

    it("should create deposit preauth with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "High",
        expiryDays: 5,
        customProperties: { reference: "deposit-preauth-setup" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.depositPreauth(mockDepositPreauthAuthorize, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("High")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "deposit-preauth-setup" })
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.depositPreauth(mockDepositPreauthAuthorize, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.depositPreauth(mockDepositPreauthAuthorize)).rejects.toThrow(
        CustodyError,
      )
      await expect(xrplService.depositPreauth(mockDepositPreauthAuthorize)).rejects.toThrow(
        "User has no login ID",
      )
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.depositPreauth(mockDepositPreauthAuthorize)).rejects.toThrow(
        CustodyError,
      )
      await expect(xrplService.depositPreauth(mockDepositPreauthAuthorize)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })
  })

  describe("clawback", () => {
    const mockClawback: CustodyClawback = {
      Account: mockAddress,
      currency: {
        type: "Currency",
        code: "USD",
        issuer: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      },
      holder: {
        type: "Address",
        address: "rHolderAddress123456789",
      },
      value: "1000",
    }

    it("should successfully create a clawback with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.clawback(mockClawback)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "Clawback"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("Clawback")
          expect(intentCall.request.payload.parameters.operation.currency).toEqual(
            mockClawback.currency,
          )
          expect(intentCall.request.payload.parameters.operation.holder).toEqual(
            mockClawback.holder,
          )
          expect(intentCall.request.payload.parameters.operation.value).toBe("1000")
        }
      }
    })

    it("should create clawback with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "High",
        expiryDays: 2,
        customProperties: { reference: "clawback-enforcement" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.clawback(mockClawback, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("High")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "clawback-enforcement" })
    })

    it("should create clawback with MPT currency", async () => {
      const clawbackWithMpt: CustodyClawback = {
        Account: mockAddress,
        currency: {
          type: "MultiPurposeToken",
          issuanceId: "00000004A407AF5856CCF3C42619DAA925813FC955C72983",
        },
        holder: {
          type: "Address",
          address: "rHolderAddress123456789",
        },
        value: "500",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.clawback(clawbackWithMpt)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "Clawback"
      ) {
        expect(intentCall.request.payload.parameters.operation.currency).toEqual(
          clawbackWithMpt.currency,
        )
        expect(intentCall.request.payload.parameters.operation.value).toBe("500")
      }
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.clawback(mockClawback, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.clawback(mockClawback)).rejects.toThrow(CustodyError)
      await expect(xrplService.clawback(mockClawback)).rejects.toThrow("User has no login ID")
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.clawback(mockClawback)).rejects.toThrow(CustodyError)
      await expect(xrplService.clawback(mockClawback)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-clawback-intent-id-789"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.clawback(mockClawback, { intentId: customIntentId })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })
  })

  describe("mpTokenAuthorize", () => {
    const mockMpTokenAuthorize: CustodyMpTokenAuthorize = {
      Account: mockAddress,
      issuanceId: "00000004A407AF5856CCF3C42619DAA925813FC955C72983",
      flags: [],
    }

    it("should successfully create an MPTokenAuthorize with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.mpTokenAuthorize(mockMpTokenAuthorize)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "MPTokenAuthorize"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("MPTokenAuthorize")
          expect(intentCall.request.payload.parameters.operation.issuanceId).toBe(
            mockMpTokenAuthorize.issuanceId,
          )
          expect(intentCall.request.payload.parameters.operation.flags).toEqual([])
        }
      }
    })

    it("should create MPTokenAuthorize with tfMPTUnauthorize flag", async () => {
      const mpTokenUnauthorize: CustodyMpTokenAuthorize = {
        Account: mockAddress,
        issuanceId: "00000004A407AF5856CCF3C42619DAA925813FC955C72983",
        flags: ["tfMPTUnauthorize"],
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenAuthorize(mpTokenUnauthorize)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "MPTokenAuthorize"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual(["tfMPTUnauthorize"])
      }
    })

    it("should create MPTokenAuthorize with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "Medium",
        expiryDays: 3,
        customProperties: { reference: "mpt-authorize" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenAuthorize(mockMpTokenAuthorize, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("Medium")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "mpt-authorize" })
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenAuthorize(mockMpTokenAuthorize, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.mpTokenAuthorize(mockMpTokenAuthorize)).rejects.toThrow(CustodyError)
      await expect(xrplService.mpTokenAuthorize(mockMpTokenAuthorize)).rejects.toThrow(
        "User has no login ID",
      )
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.mpTokenAuthorize(mockMpTokenAuthorize)).rejects.toThrow(CustodyError)
      await expect(xrplService.mpTokenAuthorize(mockMpTokenAuthorize)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-mptauthorize-intent-id-7890"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenAuthorize(mockMpTokenAuthorize, { intentId: customIntentId })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })
  })

  describe("offerCreate", () => {
    const mockOfferCreate: CustodyOfferCreate = {
      Account: mockAddress,
      flags: [],
      takerGets: {
        amount: "1000000",
      },
      takerPays: {
        currency: {
          type: "Currency",
          code: "USD",
          issuer: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        },
        amount: "100",
      },
    }

    it("should successfully create an offer with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.offerCreate(mockOfferCreate)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "OfferCreate"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("OfferCreate")
          expect(intentCall.request.payload.parameters.operation.takerGets).toEqual(
            mockOfferCreate.takerGets,
          )
          expect(intentCall.request.payload.parameters.operation.takerPays).toEqual(
            mockOfferCreate.takerPays,
          )
          expect(intentCall.request.payload.parameters.operation.flags).toEqual([])
        }
      }
    })

    it("should create offer with tfSell flag", async () => {
      const offerWithSellFlag: CustodyOfferCreate = {
        ...mockOfferCreate,
        flags: ["tfSell"],
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.offerCreate(offerWithSellFlag)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "OfferCreate"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual(["tfSell"])
      }
    })

    it("should create offer with tfImmediateOrCancel flag", async () => {
      const offerWithIocFlag: CustodyOfferCreate = {
        ...mockOfferCreate,
        flags: ["tfImmediateOrCancel"],
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.offerCreate(offerWithIocFlag)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "OfferCreate"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual([
          "tfImmediateOrCancel",
        ])
      }
    })

    it("should create offer with tfFillOrKill flag", async () => {
      const offerWithFokFlag: CustodyOfferCreate = {
        ...mockOfferCreate,
        flags: ["tfFillOrKill"],
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.offerCreate(offerWithFokFlag)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "OfferCreate"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual(["tfFillOrKill"])
      }
    })

    it("should create offer with token-to-token exchange", async () => {
      const tokenToTokenOffer: CustodyOfferCreate = {
        Account: mockAddress,
        flags: [],
        takerGets: {
          currency: {
            type: "Currency",
            code: "EUR",
            issuer: "rEurIssuerAddress123456789",
          },
          amount: "500",
        },
        takerPays: {
          currency: {
            type: "Currency",
            code: "USD",
            issuer: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
          },
          amount: "600",
        },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.offerCreate(tokenToTokenOffer)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "OfferCreate"
      ) {
        expect(intentCall.request.payload.parameters.operation.takerGets).toEqual(
          tokenToTokenOffer.takerGets,
        )
        expect(intentCall.request.payload.parameters.operation.takerPays).toEqual(
          tokenToTokenOffer.takerPays,
        )
      }
    })

    it("should create offer with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "High",
        expiryDays: 7,
        customProperties: { reference: "dex-trade" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.offerCreate(mockOfferCreate, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("High")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "dex-trade" })
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.offerCreate(mockOfferCreate, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.offerCreate(mockOfferCreate)).rejects.toThrow(CustodyError)
      await expect(xrplService.offerCreate(mockOfferCreate)).rejects.toThrow("User has no login ID")
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.offerCreate(mockOfferCreate)).rejects.toThrow(CustodyError)
      await expect(xrplService.offerCreate(mockOfferCreate)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-offercreate-intent-id-789"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.offerCreate(mockOfferCreate, { intentId: customIntentId })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })
  })

  describe("accountSet", () => {
    const mockAccountSet: CustodyAccountSet = {
      Account: mockAddress,
    }

    it("should successfully create an accountSet with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.accountSet(mockAccountSet)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "AccountSet"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("AccountSet")
        }
      }
    })

    it("should create accountSet with setFlag asfRequireAuth", async () => {
      const accountSetWithFlag: CustodyAccountSet = {
        Account: mockAddress,
        setFlag: "asfRequireAuth",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(accountSetWithFlag)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "AccountSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.setFlag).toBe("asfRequireAuth")
      }
    })

    it("should create accountSet with setFlag asfGlobalFreeze", async () => {
      const accountSetWithGlobalFreeze: CustodyAccountSet = {
        Account: mockAddress,
        setFlag: "asfGlobalFreeze",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(accountSetWithGlobalFreeze)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "AccountSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.setFlag).toBe("asfGlobalFreeze")
      }
    })

    it("should create accountSet with setFlag asfAllowTrustLineClawback", async () => {
      const accountSetWithClawback: CustodyAccountSet = {
        Account: mockAddress,
        setFlag: "asfAllowTrustLineClawback",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(accountSetWithClawback)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "AccountSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.setFlag).toBe(
          "asfAllowTrustLineClawback",
        )
      }
    })

    it("should create accountSet with clearFlag", async () => {
      const accountSetWithClearFlag: CustodyAccountSet = {
        Account: mockAddress,
        clearFlag: "asfNoFreeze",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(accountSetWithClearFlag)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "AccountSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.clearFlag).toBe("asfNoFreeze")
      }
    })

    it("should create accountSet with transferRate", async () => {
      const accountSetWithTransferRate: CustodyAccountSet = {
        Account: mockAddress,
        transferRate: 1005000000,
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(accountSetWithTransferRate)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "AccountSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.transferRate).toBe(1005000000)
      }
    })

    it("should create accountSet with multiple fields", async () => {
      const accountSetWithMultipleFields: CustodyAccountSet = {
        Account: mockAddress,
        setFlag: "asfRequireAuth",
        transferRate: 1002000000,
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(accountSetWithMultipleFields)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "AccountSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.setFlag).toBe("asfRequireAuth")
        expect(intentCall.request.payload.parameters.operation.transferRate).toBe(1002000000)
      }
    })

    it("should create accountSet with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "Medium",
        expiryDays: 2,
        customProperties: { reference: "account-config" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(mockAccountSet, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("Medium")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "account-config" })
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(mockAccountSet, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.accountSet(mockAccountSet)).rejects.toThrow(CustodyError)
      await expect(xrplService.accountSet(mockAccountSet)).rejects.toThrow("User has no login ID")
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.accountSet(mockAccountSet)).rejects.toThrow(CustodyError)
      await expect(xrplService.accountSet(mockAccountSet)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-accountset-intent-id-7890"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.accountSet(mockAccountSet, { intentId: customIntentId })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })
  })

  describe("mpTokenIssuanceCreate", () => {
    const mockMpTokenIssuanceCreate: CustodyMpTokenIssuanceCreate = {
      Account: mockAddress,
      flags: [],
    }

    it("should successfully create an MPTokenIssuanceCreate with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.mpTokenIssuanceCreate(mockMpTokenIssuanceCreate)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceCreate"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("MPTokenIssuanceCreate")
          expect(intentCall.request.payload.parameters.operation.flags).toEqual([])
        }
      }
    })

    it("should create MPTokenIssuanceCreate with all optional fields", async () => {
      const fullMpTokenIssuanceCreate: CustodyMpTokenIssuanceCreate = {
        Account: mockAddress,
        flags: ["tfMPTCanTransfer", "tfMPTCanClawback", "tfMPTRequireAuth"],
        assetScale: 2,
        transferFee: 1000,
        maximumAmount: "1000000000",
        metadata: "4D50546F6B656E",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceCreate(fullMpTokenIssuanceCreate)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceCreate"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual([
          "tfMPTCanTransfer",
          "tfMPTCanClawback",
          "tfMPTRequireAuth",
        ])
        expect(intentCall.request.payload.parameters.operation.assetScale).toBe(2)
        expect(intentCall.request.payload.parameters.operation.transferFee).toBe(1000)
        expect(intentCall.request.payload.parameters.operation.maximumAmount).toBe("1000000000")
        expect(intentCall.request.payload.parameters.operation.metadata).toBe("4D50546F6B656E")
      }
    })

    it("should create MPTokenIssuanceCreate with tfMPTCanEscrow and tfMPTCanLock flags", async () => {
      const mpTokenWithEscrowAndLock: CustodyMpTokenIssuanceCreate = {
        Account: mockAddress,
        flags: ["tfMPTCanEscrow", "tfMPTCanLock"],
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceCreate(mpTokenWithEscrowAndLock)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceCreate"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual([
          "tfMPTCanEscrow",
          "tfMPTCanLock",
        ])
      }
    })

    it("should create MPTokenIssuanceCreate with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "High",
        expiryDays: 5,
        customProperties: { reference: "mpt-issuance-create" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceCreate(mockMpTokenIssuanceCreate, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("High")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "mpt-issuance-create" })
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceCreate(mockMpTokenIssuanceCreate, {
        domainId: providedDomainId,
      })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.mpTokenIssuanceCreate(mockMpTokenIssuanceCreate)).rejects.toThrow(
        CustodyError,
      )
      await expect(xrplService.mpTokenIssuanceCreate(mockMpTokenIssuanceCreate)).rejects.toThrow(
        "User has no login ID",
      )
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.mpTokenIssuanceCreate(mockMpTokenIssuanceCreate)).rejects.toThrow(
        CustodyError,
      )
      await expect(xrplService.mpTokenIssuanceCreate(mockMpTokenIssuanceCreate)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-mptissuancecreate-intent-id-123"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceCreate(mockMpTokenIssuanceCreate, {
        intentId: customIntentId,
      })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })
  })

  describe("mpTokenIssuanceSet", () => {
    const mockMpTokenIssuanceSet: CustodyMpTokenIssuanceSet = {
      Account: mockAddress,
      issuanceId: "00000004A407AF5856CCF3C42619DAA925813FC955C72983",
      flags: [],
    }

    it("should successfully create an MPTokenIssuanceSet with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.mpTokenIssuanceSet(mockMpTokenIssuanceSet)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceSet"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe("MPTokenIssuanceSet")
          expect(intentCall.request.payload.parameters.operation.issuanceId).toBe(
            mockMpTokenIssuanceSet.issuanceId,
          )
          expect(intentCall.request.payload.parameters.operation.flags).toEqual([])
        }
      }
    })

    it("should create MPTokenIssuanceSet with tfMPTLock flag", async () => {
      const mpTokenIssuanceSetWithLock: CustodyMpTokenIssuanceSet = {
        Account: mockAddress,
        issuanceId: "00000004A407AF5856CCF3C42619DAA925813FC955C72983",
        flags: ["tfMPTLock"],
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceSet(mpTokenIssuanceSetWithLock)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual(["tfMPTLock"])
      }
    })

    it("should create MPTokenIssuanceSet with tfMPTUnlock flag", async () => {
      const mpTokenIssuanceSetWithUnlock: CustodyMpTokenIssuanceSet = {
        Account: mockAddress,
        issuanceId: "00000004A407AF5856CCF3C42619DAA925813FC955C72983",
        flags: ["tfMPTUnlock"],
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceSet(mpTokenIssuanceSetWithUnlock)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.flags).toEqual(["tfMPTUnlock"])
      }
    })

    it("should create MPTokenIssuanceSet with holder specified", async () => {
      const mpTokenIssuanceSetWithHolder: CustodyMpTokenIssuanceSet = {
        Account: mockAddress,
        issuanceId: "00000004A407AF5856CCF3C42619DAA925813FC955C72983",
        flags: ["tfMPTLock"],
        holder: "rHolderAddress123456789",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceSet(mpTokenIssuanceSetWithHolder)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceSet"
      ) {
        expect(intentCall.request.payload.parameters.operation.holder).toBe(
          "rHolderAddress123456789",
        )
        expect(intentCall.request.payload.parameters.operation.flags).toEqual(["tfMPTLock"])
      }
    })

    it("should create MPTokenIssuanceSet with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "Medium",
        expiryDays: 3,
        customProperties: { reference: "mpt-issuance-set" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceSet(mockMpTokenIssuanceSet, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("Medium")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "mpt-issuance-set" })
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceSet(mockMpTokenIssuanceSet, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.mpTokenIssuanceSet(mockMpTokenIssuanceSet)).rejects.toThrow(
        CustodyError,
      )
      await expect(xrplService.mpTokenIssuanceSet(mockMpTokenIssuanceSet)).rejects.toThrow(
        "User has no login ID",
      )
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.mpTokenIssuanceSet(mockMpTokenIssuanceSet)).rejects.toThrow(
        CustodyError,
      )
      await expect(xrplService.mpTokenIssuanceSet(mockMpTokenIssuanceSet)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-mptissuanceset-intent-id-456"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceSet(mockMpTokenIssuanceSet, { intentId: customIntentId })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })
  })

  describe("mpTokenIssuanceDestroy", () => {
    const mockMpTokenIssuanceDestroy: CustodyMpTokenIssuanceDestroy = {
      Account: mockAddress,
      issuanceId: "00000004A407AF5856CCF3C42619DAA925813FC955C72983",
    }

    it("should successfully create an MPTokenIssuanceDestroy with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.mpTokenIssuanceDestroy(mockMpTokenIssuanceDestroy)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_CreateTransactionOrder") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        if (
          intentCall.request.payload.parameters.type === "XRPL" &&
          intentCall.request.payload.parameters.operation &&
          intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceDestroy"
        ) {
          expect(intentCall.request.payload.parameters.operation.type).toBe(
            "MPTokenIssuanceDestroy",
          )
          expect(intentCall.request.payload.parameters.operation.issuanceId).toBe(
            mockMpTokenIssuanceDestroy.issuanceId,
          )
        }
      }
    })

    it("should create MPTokenIssuanceDestroy with custom options", async () => {
      const options: XrplIntentOptions = {
        feePriority: "High",
        expiryDays: 1,
        customProperties: { reference: "mpt-issuance-destroy" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceDestroy(mockMpTokenIssuanceDestroy, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.feeStrategy.type === "Priority"
      ) {
        expect(intentCall.request.payload.parameters.feeStrategy.priority).toBe("High")
      }
      expect(intentCall.request.customProperties).toEqual({ reference: "mpt-issuance-destroy" })
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceDestroy(mockMpTokenIssuanceDestroy, {
        domainId: providedDomainId,
      })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.mpTokenIssuanceDestroy(mockMpTokenIssuanceDestroy)).rejects.toThrow(
        CustodyError,
      )
      await expect(xrplService.mpTokenIssuanceDestroy(mockMpTokenIssuanceDestroy)).rejects.toThrow(
        "User has no login ID",
      )
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.mpTokenIssuanceDestroy(mockMpTokenIssuanceDestroy)).rejects.toThrow(
        CustodyError,
      )
      await expect(xrplService.mpTokenIssuanceDestroy(mockMpTokenIssuanceDestroy)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-mptissuancedestroy-intent-id-789"

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceDestroy(mockMpTokenIssuanceDestroy, {
        intentId: customIntentId,
      })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })

    it("should destroy MPToken with different issuance IDs", async () => {
      const differentIssuanceId = "00000005B508BG6967DDG4D53720EBB036924GD066D83094"
      const mpTokenDestroyDifferentId: CustodyMpTokenIssuanceDestroy = {
        Account: mockAddress,
        issuanceId: differentIssuanceId,
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.mpTokenIssuanceDestroy(mpTokenDestroyDifferentId)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_CreateTransactionOrder" &&
        intentCall.request.payload.parameters.type === "XRPL" &&
        intentCall.request.payload.parameters.operation &&
        intentCall.request.payload.parameters.operation.type === "MPTokenIssuanceDestroy"
      ) {
        expect(intentCall.request.payload.parameters.operation.issuanceId).toBe(differentIssuanceId)
      }
    })
  })

  describe("rawSign", () => {
    const mockXrplTransaction: SubmittableTransaction = {
      TransactionType: "Payment",
      Account: mockAddress,
      Destination: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      Amount: "1000000",
      Fee: "12",
      Sequence: 1,
    }

    it("should successfully create a raw sign intent with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.rawSign(mockXrplTransaction)

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: undefined,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)
      expect(mockIntentsService.proposeIntent).toHaveBeenCalledOnce()
      expect(result).toEqual(mockIntentResponse)

      // Verify intent structure
      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(mockDomainId)
      expect(intentCall.request.author.id).toBe(mockUserId)
      expect(intentCall.request.type).toBe("Propose")

      if (intentCall.request.payload.type === "v0_SignManifest") {
        expect(intentCall.request.payload.accountId).toBe(mockAccountId)
        expect(intentCall.request.payload.ledgerId).toBe(mockLedgerId)
        expect(intentCall.request.payload.content.type).toBe("Unsafe")
        // Verify the content is base64 encoded
        if (intentCall.request.payload.content.type === "Unsafe") {
          expect(typeof intentCall.request.payload.content.value).toBe("string")
          expect(intentCall.request.payload.content.value.length).toBeGreaterThan(0)
        }
      }
    })

    it("should create raw sign intent with custom options", async () => {
      const options: XrplIntentOptions = {
        expiryDays: 7,
        customProperties: { reference: "raw-sign-test" },
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.rawSign(mockXrplTransaction, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.customProperties).toEqual({ reference: "raw-sign-test" })
      expect(intentCall.request.expiryAt).toBeDefined()
    })

    it("should use provided intentId when specified", async () => {
      const customIntentId = "custom-intent-id-123"
      const options: XrplIntentOptions = {
        intentId: customIntentId,
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.rawSign(mockXrplTransaction, options)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.id).toBe(customIntentId)
    })

    it("should pass domainId to resolveContext when specified", async () => {
      const providedDomainId = "domain-456"
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue({
        domainId: providedDomainId,
        userId: "user-456",
      })
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.rawSign(mockXrplTransaction, { domainId: providedDomainId })

      expect(mockDomainResolver.resolve).toHaveBeenCalledWith({
        domainId: providedDomainId,
      })
      expect(mockAccountsService.findByAddress).toHaveBeenCalledWith(mockAddress)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should handle different XRPL transaction types", async () => {
      const trustSetTransaction: SubmittableTransaction = {
        TransactionType: "TrustSet",
        Account: mockAddress,
        LimitAmount: {
          currency: "USD",
          issuer: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
          value: "1000000",
        },
        Fee: "12",
        Sequence: 1,
      }

      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.rawSign(trustSetTransaction)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (intentCall.request.payload.type === "v0_SignManifest") {
        expect(intentCall.request.payload.content.type).toBe("Unsafe")
        if (intentCall.request.payload.content.type === "Unsafe") {
          expect(typeof intentCall.request.payload.content.value).toBe("string")
        }
      }
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.rawSign(mockXrplTransaction)).rejects.toThrow(CustodyError)
      await expect(xrplService.rawSign(mockXrplTransaction)).rejects.toThrow("User has no login ID")
    })

    it("should throw error when user has no domains", async () => {
      vi.mocked(mockDomainResolver.resolve).mockRejectedValue(
        new CustodyError({ reason: "User has no domains" }),
      )

      await expect(xrplService.rawSign(mockXrplTransaction)).rejects.toThrow(CustodyError)
      await expect(xrplService.rawSign(mockXrplTransaction)).rejects.toThrow("User has no domains")
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.rawSign(mockXrplTransaction)).rejects.toThrow(CustodyError)
      await expect(xrplService.rawSign(mockXrplTransaction)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should set expiry date correctly based on expiryDays option", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      const expiryDays = 5
      await xrplService.rawSign(mockXrplTransaction, { expiryDays })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      const expiryDate = new Date(intentCall.request.expiryAt)
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() + expiryDays)

      // Allow 1 second difference for execution time
      expect(Math.abs(expiryDate.getTime() - expectedDate.getTime())).toBeLessThan(1000)
    })

    it("should encode transaction content as base64", async () => {
      vi.mocked(mockDomainResolver.resolve).mockResolvedValue(mockDomainUserRef)
      vi.mocked(mockAccountsService.findByAddress).mockResolvedValue(mockAccountRef)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.rawSign(mockXrplTransaction)

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      if (
        intentCall.request.payload.type === "v0_SignManifest" &&
        intentCall.request.payload.content.type === "Unsafe"
      ) {
        const content = intentCall.request.payload.content.value
        // Verify it's valid base64
        expect(() => Buffer.from(content, "base64")).not.toThrow()
        // Verify it decodes to the mocked encoded transaction
        const decoded = Buffer.from(content, "base64").toString()
        expect(decoded).toBe("mockedEncodedTransaction")
      }
    })
  })
})
