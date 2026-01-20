import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { RequestsService } from "./requests.service.js"

const mockApiService = {
  get: vi.fn(),
}

describe("RequestsService", () => {
  let requestsService: RequestsService

  const mockDomainId = "domain-123"
  const mockRequestId = "request-456"

  beforeEach(() => {
    vi.clearAllMocks()
    requestsService = new RequestsService(mockApiService as any)
  })

  describe("getRequestState", () => {
    it("should call api.get with correct URL and return request state", async () => {
      const mockState = { state: "PENDING" }
      mockApiService.get.mockResolvedValue(mockState)

      const result = await requestsService.getRequestState({
        domainId: mockDomainId,
        requestId: mockRequestId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.request, { domainId: mockDomainId, requestId: mockRequestId }),
        undefined,
      )
      expect(result).toEqual(mockState)
    })

    it("should pass query parameters to api.get", async () => {
      const mockState = { state: "APPROVED" }
      mockApiService.get.mockResolvedValue(mockState)

      const query = { include: "details" }
      await requestsService.getRequestState(
        { domainId: mockDomainId, requestId: mockRequestId } as any,
        query as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.request, { domainId: mockDomainId, requestId: mockRequestId }),
        query,
      )
    })
  })

  describe("getAllUserRequestsState", () => {
    it("should call api.get with correct URL and return request state", async () => {
      const mockState = { state: "PENDING" }
      mockApiService.get.mockResolvedValue(mockState)

      const result = await requestsService.getAllUserRequestsState()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.meRequests, undefined)
      expect(result).toEqual(mockState)
    })

    it("should pass query parameters to api.get", async () => {
      const mockState = { state: "PENDING" }
      mockApiService.get.mockResolvedValue(mockState)

      const query = { limit: 10, offset: 0 }
      await requestsService.getAllUserRequestsState(query as any)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.meRequests, query)
    })
  })

  describe("getAllUserRequestsStateInDomain", () => {
    it("should call api.get with correct URL and return request state", async () => {
      const mockState = { state: "PENDING" }
      mockApiService.get.mockResolvedValue(mockState)

      const result = await requestsService.getAllUserRequestsStateInDomain({
        domainId: mockDomainId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.requests, { domainId: mockDomainId }),
        undefined,
      )
      expect(result).toEqual(mockState)
    })

    it("should pass query parameters to api.get", async () => {
      const mockState = { state: "PENDING" }
      mockApiService.get.mockResolvedValue(mockState)

      const query = { limit: 5, offset: 10 }
      await requestsService.getAllUserRequestsStateInDomain(
        { domainId: mockDomainId } as any,
        query as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.requests, { domainId: mockDomainId }),
        query,
      )
    })
  })
})
