import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import type { ApiService } from "../apis/index.js"
import { IntentContextService, type IntentContext } from "../intent-context/index.js"
import { IntentsService } from "../intents/index.js"
import { XrplService } from "./xrpl.service.js"
import type { CustodyPayment, CustodyTrustline, XrplIntentOptions } from "./xrpl.types.js"

describe("XrplService", () => {
  let xrplService: XrplService
  let mockApiService: ApiService
  let mockIntentContext: IntentContextService
  let mockIntentsService: IntentsService

  const mockDomainId = "domain-123"
  const mockUserId = "user-123"
  const mockAccountId = "account-123"
  const mockLedgerId = "ledger-123"
  const mockAddress = "rLpUHpWU455zTvVq65EEeHss52Dk4WvQHn"

  const mockContext: IntentContext = {
    domainId: mockDomainId,
    userId: mockUserId,
    accountId: mockAccountId,
    ledgerId: mockLedgerId,
    address: mockAddress,
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
    mockIntentContext = {
      resolveContext: vi.fn(),
    } as unknown as IntentContextService

    mockIntentsService = {
      proposeIntent: vi.fn(),
    } as unknown as IntentsService

    // Create XrplService instance
    xrplService = new XrplService(mockApiService)

    // Replace internal services with mocks
    // @ts-expect-error - accessing private property for testing
    xrplService.intentContext = mockIntentContext
    // @ts-expect-error - accessing private property for testing
    xrplService.intentService = mockIntentsService
  })

  describe("sendPayment", () => {
    it("should successfully send a payment with default options", async () => {
      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.sendPayment(mockPayment)

      expect(mockIntentContext.resolveContext).toHaveBeenCalledWith(mockAddress, {
        domainId: undefined,
      })
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

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
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
      const contextWithProvidedDomain: IntentContext = {
        ...mockContext,
        domainId: providedDomainId,
        userId: "user-456",
      }

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(contextWithProvidedDomain)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.sendPayment(mockPayment, { domainId: providedDomainId })

      expect(mockIntentContext.resolveContext).toHaveBeenCalledWith(mockAddress, {
        domainId: providedDomainId,
      })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow("User has no login ID")
    })

    it("should throw error when user has no domains", async () => {
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
        new CustodyError({ reason: "User has no domains" }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow("User has no domains")
    })

    it("should throw error when user has multiple domains without domainId option", async () => {
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
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
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
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
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
        new CustodyError({ reason: "User has no primary domain" }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        "User has no primary domain",
      )
    })

    it("should throw error when domain has no user reference", async () => {
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
        new CustodyError({ reason: "Primary domain has no user reference" }),
      )

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        "Primary domain has no user reference",
      )
    })

    it("should throw error when sender account is not found", async () => {
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
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

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
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
      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
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
      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      const priorities: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"]

      for (const priority of priorities) {
        vi.clearAllMocks()
        vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
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

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.createTrustline(mockTrustline)

      expect(mockIntentContext.resolveContext).toHaveBeenCalledWith(mockAddress, {
        domainId: undefined,
      })
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

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
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

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
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
      const contextWithProvidedDomain: IntentContext = {
        ...mockContext,
        domainId: providedDomainId,
        userId: "user-456",
      }

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(contextWithProvidedDomain)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.createTrustline(mockTrustline, { domainId: providedDomainId })

      expect(mockIntentContext.resolveContext).toHaveBeenCalledWith(mockAddress, {
        domainId: providedDomainId,
      })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
        new CustodyError({ reason: "User has no login ID" }),
      )

      await expect(xrplService.createTrustline(mockTrustline)).rejects.toThrow(CustodyError)
      await expect(xrplService.createTrustline(mockTrustline)).rejects.toThrow(
        "User has no login ID",
      )
    })

    it("should throw error when sender account is not found", async () => {
      vi.mocked(mockIntentContext.resolveContext).mockRejectedValue(
        new CustodyError({ reason: `Account not found for address ${mockAddress}` }),
      )

      await expect(xrplService.createTrustline(mockTrustline)).rejects.toThrow(CustodyError)
      await expect(xrplService.createTrustline(mockTrustline)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
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

      vi.mocked(mockIntentContext.resolveContext).mockResolvedValue(mockContext)
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
})
