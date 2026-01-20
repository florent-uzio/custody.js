import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { TickersService } from "./tickers.service.js"

const mockApiService = {
  get: vi.fn(),
}

describe("TickersService", () => {
  let tickersService: TickersService

  const mockTickerId = "ticker-123"

  beforeEach(() => {
    vi.clearAllMocks()
    tickersService = new TickersService(mockApiService as any)
  })

  describe("getTickers", () => {
    it("should call api.get with correct URL and return tickers", async () => {
      const mockTickers = { data: [{ id: "t-1" }], pagination: { total: 1 } }
      mockApiService.get.mockResolvedValue(mockTickers)

      const result = await tickersService.getTickers()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.tickers, undefined)
      expect(result).toEqual(mockTickers)
    })

    it("should pass query parameters to api.get", async () => {
      const mockTickers = { data: [], pagination: { total: 0 } }
      mockApiService.get.mockResolvedValue(mockTickers)

      const queryParams = { limit: 10, offset: 20 }
      await tickersService.getTickers(queryParams as any)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.tickers, queryParams)
    })
  })

  describe("getTicker", () => {
    it("should call api.get with correct URL and return ticker", async () => {
      const mockTicker = { id: mockTickerId }
      mockApiService.get.mockResolvedValue(mockTicker)

      const result = await tickersService.getTicker({ tickerId: mockTickerId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.ticker, { tickerId: mockTickerId }),
      )
      expect(result).toEqual(mockTicker)
    })
  })
})
