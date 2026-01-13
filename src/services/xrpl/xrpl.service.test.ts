import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { AccountsService } from "../accounts/index.js"
import type { ApiService } from "../apis/index.js"
import { IntentsService } from "../intents/index.js"
import { UsersService } from "../users/index.js"
import { XrplService } from "./xrpl.service.js"
import type { CustodyPayment, PaymentOptions } from "./xrpl.types.js"

describe("XrplService", () => {
  let xrplService: XrplService
  let mockApiService: ApiService
  let mockUsersService: UsersService
  let mockAccountsService: AccountsService
  let mockIntentsService: IntentsService

  const mockDomainId = "domain-123"
  const mockUserId = "user-123"
  const mockAccountId = "account-123"
  const mockLedgerId = "ledger-123"
  const mockAddress = "rLpUHpWU455zTvVq65EEeHss52Dk4WvQHn"

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
    mockUsersService = {
      getMe: vi.fn(),
    } as unknown as UsersService

    mockAccountsService = {
      getAllDomainsAddresses: vi.fn(),
    } as unknown as AccountsService

    mockIntentsService = {
      proposeIntent: vi.fn(),
    } as unknown as IntentsService

    // Create XrplService instance
    xrplService = new XrplService(mockApiService)

    // Replace internal services with mocks
    // @ts-expect-error - accessing private property for testing
    xrplService.userService = mockUsersService
    // @ts-expect-error - accessing private property for testing
    xrplService.accountsService = mockAccountsService
    // @ts-expect-error - accessing private property for testing
    xrplService.intentService = mockIntentsService
  })

  describe("sendPayment", () => {
    it("should successfully send a payment with default options", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
        ],
      }

      const mockSenderAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      const mockIntentResponse = {
        requestId: "request-123",
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockSenderAccount],
      } as any)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue(mockIntentResponse as any)

      const result = await xrplService.sendPayment(mockPayment)

      expect(mockUsersService.getMe).toHaveBeenCalledOnce()
      expect(mockAccountsService.getAllDomainsAddresses).toHaveBeenCalledWith({
        address: mockAddress,
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
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
        ],
      }

      const mockSenderAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      const options: PaymentOptions = {
        feePriority: "High",
        expiryDays: 7,
        customProperties: { orderId: "order-123" },
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockSenderAccount],
      } as any)
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

    it("should use provided domainId when user has multiple domains", async () => {
      const providedDomainId = "domain-456"
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
          {
            id: providedDomainId,
            userReference: { id: "user-456" },
          },
        ],
      }

      const mockSenderAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockSenderAccount],
      } as any)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      await xrplService.sendPayment(mockPayment, { domainId: providedDomainId })

      const intentCall = vi.mocked(mockIntentsService.proposeIntent).mock.calls[0][0]
      expect(intentCall.request.author.domainId).toBe(providedDomainId)
      expect(intentCall.request.author.id).toBe("user-456")
    })

    it("should throw error when user has no login ID", async () => {
      const mockMe = {
        loginId: null,
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
        ],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow("User has no login ID")
    })

    it("should throw error when user has no domains", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow("User has no domains")
    })

    it("should throw error when user has multiple domains without domainId option", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: "domain-1",
            userReference: { id: "user-1" },
          },
          {
            id: "domain-2",
            userReference: { id: "user-2" },
          },
        ],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        "User has multiple domains. Please specify domainId in the options parameter.",
      )
    })

    it("should throw error when provided domainId is not found", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
        ],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      await expect(
        xrplService.sendPayment(mockPayment, { domainId: "non-existent-domain" }),
      ).rejects.toThrow(CustodyError)
      await expect(
        xrplService.sendPayment(mockPayment, { domainId: "non-existent-domain" }),
      ).rejects.toThrow("Domain with ID non-existent-domain not found for user")
    })

    it("should throw error when domain has no ID", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: undefined,
            userReference: { id: mockUserId },
          },
        ],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        "User has no primary domain",
      )
    })

    it("should throw error when domain has no user reference", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: null,
          },
        ],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        "Primary domain has no user reference",
      )
    })

    it("should throw error when sender account is not found", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
        ],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [],
      } as any)

      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(CustodyError)
      await expect(xrplService.sendPayment(mockPayment)).rejects.toThrow(
        `Sender account not found for address ${mockAddress}`,
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

      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
        ],
      }

      const mockSenderAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockSenderAccount],
      } as any)
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
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
        ],
      }

      const mockSenderAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockSenderAccount],
      } as any)
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
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          {
            id: mockDomainId,
            userReference: { id: mockUserId },
          },
        ],
      }

      const mockSenderAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockSenderAccount],
      } as any)
      vi.mocked(mockIntentsService.proposeIntent).mockResolvedValue({
        requestId: "request-123",
      } as any)

      const priorities: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"]

      for (const priority of priorities) {
        vi.clearAllMocks()
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
})
