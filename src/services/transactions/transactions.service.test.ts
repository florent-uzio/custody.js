import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { TransactionsService } from "./transactions.service.js"

const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
}

describe("TransactionsService", () => {
  let transactionsService: TransactionsService

  const mockDomainId = "domain-123"
  const mockTransactionOrderId = "order-456"
  const mockTransferId = "transfer-789"
  const mockTransactionId = "transaction-abc"

  beforeEach(() => {
    vi.clearAllMocks()
    transactionsService = new TransactionsService(mockApiService as any)
  })

  describe("getTransactionOrders", () => {
    it("should call api.get with correct URL and return transaction orders", async () => {
      const mockOrders = {
        items: [{ id: mockTransactionOrderId }],
        total: 1,
      }
      mockApiService.get.mockResolvedValue(mockOrders)

      const result = await transactionsService.getTransactionOrders({
        domainId: mockDomainId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transactionOrders, { domainId: mockDomainId }),
        undefined,
      )
      expect(result).toEqual(mockOrders)
    })

    it("should pass query parameters to api.get", async () => {
      const mockOrders = { items: [], total: 0 }
      mockApiService.get.mockResolvedValue(mockOrders)

      const query = { limit: 10, offset: 0 }
      await transactionsService.getTransactionOrders(
        { domainId: mockDomainId } as any,
        query as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transactionOrders, { domainId: mockDomainId }),
        query,
      )
    })
  })

  describe("getTransactionOrderDetails", () => {
    it("should call api.get with correct URL and return transaction order details", async () => {
      const mockOrderDetails = {
        id: mockTransactionOrderId,
        status: "PENDING",
      }
      mockApiService.get.mockResolvedValue(mockOrderDetails)

      const result = await transactionsService.getTransactionOrderDetails({
        domainId: mockDomainId,
        transactionOrderId: mockTransactionOrderId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transactionOrder, {
          domainId: mockDomainId,
          transactionOrderId: mockTransactionOrderId,
        }),
      )
      expect(result).toEqual(mockOrderDetails)
    })
  })

  describe("getTransfers", () => {
    it("should call api.get with correct URL and return transfers", async () => {
      const mockTransfers = {
        items: [{ id: mockTransferId }],
        total: 1,
      }
      mockApiService.get.mockResolvedValue(mockTransfers)

      const result = await transactionsService.getTransfers({
        domainId: mockDomainId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transactionTransfers, { domainId: mockDomainId }),
        undefined,
      )
      expect(result).toEqual(mockTransfers)
    })

    it("should pass query parameters to api.get", async () => {
      const mockTransfers = { items: [], total: 0 }
      mockApiService.get.mockResolvedValue(mockTransfers)

      const query = { limit: 5, offset: 10 }
      await transactionsService.getTransfers({ domainId: mockDomainId } as any, query as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transactionTransfers, { domainId: mockDomainId }),
        query,
      )
    })
  })

  describe("getTransferDetails", () => {
    it("should call api.get with correct URL and return transfer details", async () => {
      const mockTransferDetails = {
        id: mockTransferId,
        amount: "100",
        currency: "USD",
      }
      mockApiService.get.mockResolvedValue(mockTransferDetails)

      const result = await transactionsService.getTransferDetails({
        domainId: mockDomainId,
        transferId: mockTransferId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transactionTransfer, {
          domainId: mockDomainId,
          transferId: mockTransferId,
        }),
      )
      expect(result).toEqual(mockTransferDetails)
    })
  })

  describe("getTransactions", () => {
    it("should call api.get with correct URL and return transactions", async () => {
      const mockTransactions = {
        items: [{ id: mockTransactionId }],
        total: 1,
      }
      mockApiService.get.mockResolvedValue(mockTransactions)

      const result = await transactionsService.getTransactions({
        domainId: mockDomainId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transactions, { domainId: mockDomainId }),
        undefined,
      )
      expect(result).toEqual(mockTransactions)
    })

    it("should pass query parameters to api.get", async () => {
      const mockTransactions = { items: [], total: 0 }
      mockApiService.get.mockResolvedValue(mockTransactions)

      const query = { limit: 20, offset: 5 }
      await transactionsService.getTransactions({ domainId: mockDomainId } as any, query as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transactions, { domainId: mockDomainId }),
        query,
      )
    })
  })

  describe("getTransactionDetails", () => {
    it("should call api.get with correct URL and return transaction details", async () => {
      const mockTransactionDetails = {
        id: mockTransactionId,
        type: "PAYMENT",
        status: "CONFIRMED",
      }
      mockApiService.get.mockResolvedValue(mockTransactionDetails)

      const result = await transactionsService.getTransactionDetails({
        domainId: mockDomainId,
        transactionId: mockTransactionId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.transaction, {
          domainId: mockDomainId,
          transactionId: mockTransactionId,
        }),
      )
      expect(result).toEqual(mockTransactionDetails)
    })
  })

  describe("dryRunTransaction", () => {
    it("should call api.post with correct URL and body, and return dry run result", async () => {
      const mockDryRunBody = {
        transaction: {
          type: "PAYMENT",
          amount: "100",
          destination: "rDestination",
        },
      }
      const mockDryRunResult = {
        fee: "0.000012",
        success: true,
        warnings: [],
      }
      mockApiService.post.mockResolvedValue(mockDryRunResult)

      const result = await transactionsService.dryRunTransaction(
        { domainId: mockDomainId } as any,
        mockDryRunBody as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.transactionsDryRun, { domainId: mockDomainId }),
        mockDryRunBody,
      )
      expect(result).toEqual(mockDryRunResult)
    })

    it("should handle dry run with complex transaction parameters", async () => {
      const mockComplexBody = {
        transaction: {
          type: "TRUST_SET",
          limit: "1000000",
          currency: "USD",
          issuer: "rIssuer",
        },
        options: {
          validateOnly: true,
        },
      }
      const mockDryRunResult = {
        fee: "0.000015",
        success: false,
        errors: ["Insufficient balance"],
      }
      mockApiService.post.mockResolvedValue(mockDryRunResult)

      const result = await transactionsService.dryRunTransaction(
        { domainId: mockDomainId } as any,
        mockComplexBody as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.transactionsDryRun, { domainId: mockDomainId }),
        mockComplexBody,
      )
      expect(result).toEqual(mockDryRunResult)
    })
  })
})
