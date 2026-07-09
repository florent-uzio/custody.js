import { beforeEach, describe, expect, it, vi } from "vitest"
import { UnsupportedInVersionError, VersionGuard } from "../versioning/version-guard.js"
import { TypedTransport } from "./typed-transport.js"

const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}

describe("TypedTransport", () => {
  let transport: TypedTransport

  beforeEach(() => {
    vi.clearAllMocks()
    transport = new TypedTransport(mockApiService as any)
  })

  describe("get", () => {
    it("should call api.get with plain URL when no params provided", async () => {
      mockApiService.get.mockResolvedValue({ data: [] })

      await transport.get("/v1/tickers")

      expect(mockApiService.get).toHaveBeenCalledWith("/v1/tickers", undefined)
    })

    it("should call api.get with query params when no path params", async () => {
      mockApiService.get.mockResolvedValue({ data: [] })

      await transport.get("/v1/tickers", undefined, { limit: 10 })

      expect(mockApiService.get).toHaveBeenCalledWith("/v1/tickers", { limit: 10 })
    })

    it("should resolve path params from URL template", async () => {
      mockApiService.get.mockResolvedValue({ data: {} })

      await transport.get("/v1/domains/{domainId}", { domainId: "d-123" })

      expect(mockApiService.get).toHaveBeenCalledWith("/v1/domains/d-123", undefined)
    })

    it("should resolve path params and pass query separately", async () => {
      mockApiService.get.mockResolvedValue({ data: [] })

      await transport.get("/v1/domains/{domainId}/accounts", { domainId: "d-123" }, { limit: 5 })

      expect(mockApiService.get).toHaveBeenCalledWith("/v1/domains/d-123/accounts", { limit: 5 })
    })

    it("should resolve multiple path params", async () => {
      mockApiService.get.mockResolvedValue({ data: {} })

      await transport.get("/v1/domains/{domainId}/intents/{intentId}", {
        domainId: "d-123",
        intentId: "i-456",
      })

      expect(mockApiService.get).toHaveBeenCalledWith("/v1/domains/d-123/intents/i-456", undefined)
    })

    it("should separate mixed path and non-path params in pathParams", async () => {
      mockApiService.get.mockResolvedValue({ data: [] })

      // When path params object contains extra keys that aren't in the URL template
      await transport.get("/v1/domains/{domainId}/accounts", {
        domainId: "d-123",
        limit: 5,
      })

      // The extra 'limit' from pathParams should be merged into query
      expect(mockApiService.get).toHaveBeenCalledWith("/v1/domains/d-123/accounts", { limit: 5 })
    })

    it("should return the data from api.get", async () => {
      const mockData = { data: [{ id: "1" }], pagination: { total: 1 } }
      mockApiService.get.mockResolvedValue(mockData)

      const result = await transport.get("/v1/tickers")

      expect(result).toEqual(mockData)
    })
  })

  describe("post", () => {
    it("should call api.post with URL and body", async () => {
      const body = { request: { type: "Propose" } }
      mockApiService.post.mockResolvedValue({ data: {} })

      await transport.post("/v1/intents", body)

      expect(mockApiService.post).toHaveBeenCalledWith("/v1/intents", body, undefined)
    })

    it("should resolve path params before posting", async () => {
      const body = { data: "test" }
      mockApiService.post.mockResolvedValue({})

      await transport.post("/v1/ledgers/{ledgerId}/ethereum/call", body, { ledgerId: "eth-1" })

      expect(mockApiService.post).toHaveBeenCalledWith(
        "/v1/ledgers/eth-1/ethereum/call",
        body,
        undefined,
      )
    })

    it("should forward config to api.post", async () => {
      mockApiService.post.mockResolvedValue({})
      const config = { headers: { "Content-Type": "multipart/form-data" } }

      await transport.post("/v1/vaults/operations/signed", "files", undefined, config)

      expect(mockApiService.post).toHaveBeenCalledWith(
        "/v1/vaults/operations/signed",
        "files",
        config,
      )
    })

    it("should return the data from api.post", async () => {
      const mockResponse = { id: "intent-123", status: "Open" }
      mockApiService.post.mockResolvedValue(mockResponse)

      const result = await transport.post("/v1/intents", { request: {} })

      expect(result).toEqual(mockResponse)
    })

    it("should forward { sign: false } through config to api.post", async () => {
      const body = { name: "hook", url: "https://example.com" }
      mockApiService.post.mockResolvedValue({})

      await transport.post(
        "/v1/domains/{domainId}/channels",
        body,
        { domainId: "d-1" },
        {
          sign: false,
        },
      )

      expect(mockApiService.post).toHaveBeenCalledWith("/v1/domains/d-1/channels", body, {
        sign: false,
      })
    })
  })

  describe("patch", () => {
    it("should call api.patch with URL and body", async () => {
      const body = { name: "renamed" }
      mockApiService.patch.mockResolvedValue({})

      await transport.patch("/v1/domains/{domainId}/channels/{channelId}", body, {
        domainId: "d-1",
        channelId: "ch-1",
      })

      expect(mockApiService.patch).toHaveBeenCalledWith(
        "/v1/domains/d-1/channels/ch-1",
        body,
        undefined,
      )
    })

    it("should call api.patch with URL and body when no path params", async () => {
      const body = { name: "x" }
      mockApiService.patch.mockResolvedValue({})

      await transport.patch("/v1/some/path", body)

      expect(mockApiService.patch).toHaveBeenCalledWith("/v1/some/path", body, undefined)
    })

    it("should forward config to api.patch", async () => {
      mockApiService.patch.mockResolvedValue({})
      const config = { headers: { "X-Custom": "x" } }

      await transport.patch("/v1/some/path", { name: "x" }, undefined, config)

      expect(mockApiService.patch).toHaveBeenCalledWith("/v1/some/path", { name: "x" }, config)
    })

    it("should return the data from api.patch", async () => {
      const mockResponse = { id: "ch-1", name: "renamed" }
      mockApiService.patch.mockResolvedValue(mockResponse)

      const result = await transport.patch("/v1/some/path", { name: "renamed" })

      expect(result).toEqual(mockResponse)
    })
  })

  describe("delete", () => {
    it("should call api.delete with resolved URL when path params provided", async () => {
      mockApiService.delete.mockResolvedValue(undefined)

      await transport.delete("/v1/domains/{domainId}/channels/{channelId}", {
        domainId: "d-1",
        channelId: "ch-1",
      })

      expect(mockApiService.delete).toHaveBeenCalledWith("/v1/domains/d-1/channels/ch-1", {
        params: undefined,
      })
    })

    it("should call api.delete with plain URL when no path params", async () => {
      mockApiService.delete.mockResolvedValue(undefined)

      await transport.delete("/v1/some/path")

      expect(mockApiService.delete).toHaveBeenCalledWith("/v1/some/path", { params: undefined })
    })

    it("should resolve path params and pass query separately", async () => {
      mockApiService.delete.mockResolvedValue(undefined)

      await transport.delete(
        "/v1/domain/{domainId}/account/{accountId}/sponsor",
        { domainId: "d-1", accountId: "a-1" },
        { userId: "u-1" },
      )

      expect(mockApiService.delete).toHaveBeenCalledWith("/v1/domain/d-1/account/a-1/sponsor", {
        params: { userId: "u-1" },
      })
    })

    it("should merge extra pathParams keys into query", async () => {
      mockApiService.delete.mockResolvedValue(undefined)

      await transport.delete("/v1/domains/{domainId}/accounts", {
        domainId: "d-123",
        limit: 5,
      })

      expect(mockApiService.delete).toHaveBeenCalledWith("/v1/domains/d-123/accounts", {
        params: { limit: 5 },
      })
    })

    it("should forward config to api.delete", async () => {
      mockApiService.delete.mockResolvedValue(undefined)
      const config = { headers: { "X-Custom": "x" } }

      await transport.delete("/v1/some/path", undefined, undefined, config)

      expect(mockApiService.delete).toHaveBeenCalledWith("/v1/some/path", {
        ...config,
        params: undefined,
      })
    })

    it("should return the data from api.delete", async () => {
      const mockResponse = { deleted: true }
      mockApiService.delete.mockResolvedValue(mockResponse)

      const result = await transport.delete("/v1/some/path")

      expect(result).toEqual(mockResponse)
    })
  })

  describe("endpoint version gating", () => {
    const guard = new VersionGuard({
      appVersion: "test",
      endpoints: new Set(["GET /v1/allowed", "GET /v1/domains/{domainId}"]),
      schemas: new Set(),
    })

    beforeEach(() => {
      vi.clearAllMocks()
      transport = new TypedTransport(mockApiService as any, guard)
    })

    it("dispatches a call whose endpoint the resolved version serves", async () => {
      mockApiService.get.mockResolvedValue({ data: [] })

      await transport.get("/v1/allowed")

      expect(mockApiService.get).toHaveBeenCalledWith("/v1/allowed", undefined)
    })

    it("gates on the path template, not the resolved URL", async () => {
      mockApiService.get.mockResolvedValue({ data: {} })

      await transport.get("/v1/domains/{domainId}", { domainId: "d-1" })

      expect(mockApiService.get).toHaveBeenCalledWith("/v1/domains/d-1", undefined)
    })

    it("throws UnsupportedInVersionError and never dispatches an endpoint the version lacks", async () => {
      await expect(transport.get("/v1/forbidden")).rejects.toBeInstanceOf(UnsupportedInVersionError)
      expect(mockApiService.get).not.toHaveBeenCalled()
    })
  })
})
