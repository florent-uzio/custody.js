import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { LedgersService } from "./ledgers.service.js"

const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
}

describe("LedgersService", () => {
  let ledgersService: LedgersService

  const mockLedgerId = "ledger-123"

  beforeEach(() => {
    vi.clearAllMocks()
    ledgersService = new LedgersService(mockApiService as any)
  })

  describe("getLedgers", () => {
    it("should call api.get with correct URL and return ledgers", async () => {
      const mockLedgers = { data: [{ id: "ledger-1" }], pagination: { total: 1 } }
      mockApiService.get.mockResolvedValue(mockLedgers)

      const result = await ledgersService.getLedgers()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.ledgers, undefined)
      expect(result).toEqual(mockLedgers)
    })

    it("should pass query parameters to api.get", async () => {
      const mockLedgers = { data: [], pagination: { total: 0 } }
      mockApiService.get.mockResolvedValue(mockLedgers)

      const queryParams = { limit: 10, offset: 20 }
      await ledgersService.getLedgers(queryParams as any)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.ledgers, queryParams)
    })
  })

  describe("getLedger", () => {
    it("should call api.get with correct URL and return ledger", async () => {
      const mockLedger = { id: mockLedgerId }
      mockApiService.get.mockResolvedValue(mockLedger)

      const result = await ledgersService.getLedger({ ledgerId: mockLedgerId })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.ledger, { ledgerId: mockLedgerId }),
      )
      expect(result).toEqual(mockLedger)
    })
  })

  describe("getLedgerFees", () => {
    it("should call api.get with correct URL and return ledger fees", async () => {
      const mockFees = { fee: "123" }
      mockApiService.get.mockResolvedValue(mockFees)

      const result = await ledgersService.getLedgerFees({ ledgerId: mockLedgerId })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.ledgerFees, { ledgerId: mockLedgerId }),
      )
      expect(result).toEqual(mockFees)
    })
  })

  describe("processEthereumContractCall", () => {
    it("should call api.post with correct URL and body", async () => {
      const mockResponse = "0xresult"
      mockApiService.post.mockResolvedValue(mockResponse)

      const body = {
        contractAddress: "0xContractAddress",
        from: { address: "0xFromAddress", type: "Address" as const },
        data: "0x1234",
        value: "0x0",
      }

      const result = await ledgersService.processEthereumContractCall(
        { ledgerId: mockLedgerId },
        body as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.ledgerEthereumCall, { ledgerId: mockLedgerId }),
        body,
      )
      expect(result).toEqual(mockResponse)
    })

    it("should support Account caller type", async () => {
      const mockResponse = "0xresult"
      mockApiService.post.mockResolvedValue(mockResponse)

      const body = {
        contractAddress: "0xContractAddress",
        from: { domainId: "domain-123", accountId: "account-456", type: "Account" as const },
      }

      await ledgersService.processEthereumContractCall({ ledgerId: mockLedgerId }, body as any)

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.ledgerEthereumCall, { ledgerId: mockLedgerId }),
        body,
      )
    })
  })

  describe("getTrustedLedger", () => {
    it("should call api.get with correct URL and return trusted ledger", async () => {
      const mockTrustedLedger = { id: mockLedgerId }
      mockApiService.get.mockResolvedValue(mockTrustedLedger)

      const result = await ledgersService.getTrustedLedger({ ledgerId: mockLedgerId })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.trustedLedger, { ledgerId: mockLedgerId }),
      )
      expect(result).toEqual(mockTrustedLedger)
    })
  })

  describe("getTrustedLedgers", () => {
    it("should call api.get with correct URL and return trusted ledgers", async () => {
      const mockTrustedLedgers = { data: [{ id: "trusted-1" }], pagination: { total: 1 } }
      mockApiService.get.mockResolvedValue(mockTrustedLedgers)

      const result = await ledgersService.getTrustedLedgers()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.trustedLedgers, undefined)
      expect(result).toEqual(mockTrustedLedgers)
    })

    it("should pass query parameters to api.get", async () => {
      const mockTrustedLedgers = { data: [], pagination: { total: 0 } }
      mockApiService.get.mockResolvedValue(mockTrustedLedgers)

      const queryParams = { limit: 5, offset: 10 }
      await ledgersService.getTrustedLedgers(queryParams as any)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.trustedLedgers, queryParams)
    })
  })
})
