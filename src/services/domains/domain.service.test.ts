import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/index.js"
import { replacePathParams } from "../../helpers/index.js"
import { DomainService } from "./domain.service.js"

// Mock ApiService
const mockApiService = {
  get: vi.fn(),
}

describe("DomainService", () => {
  let domainService: DomainService

  beforeEach(() => {
    vi.clearAllMocks()
    domainService = new DomainService(mockApiService as any)
  })

  describe("getDomains", () => {
    it("should call api.get with domains URL and return domains", async () => {
      const mockDomains = {
        data: [
          { id: "domain-1", name: "Test Domain 1" },
          { id: "domain-2", name: "Test Domain 2" },
        ],
        pagination: { total: 2 },
      }
      mockApiService.get.mockResolvedValue(mockDomains)

      const result = await domainService.getDomains()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.domains, undefined)
      expect(result).toEqual(mockDomains)
    })

    it("should pass query parameters to api.get", async () => {
      const mockDomains = { data: [], pagination: { total: 0 } }
      mockApiService.get.mockResolvedValue(mockDomains)

      const queryParams = { limit: 10, offset: 5 }
      await domainService.getDomains(queryParams as any)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.domains, queryParams)
    })

    it("should return empty collection when no domains exist", async () => {
      const mockEmptyDomains = { data: [], pagination: { total: 0 } }
      mockApiService.get.mockResolvedValue(mockEmptyDomains)

      const result = await domainService.getDomains()

      expect(result).toEqual(mockEmptyDomains)
    })
  })

  describe("getDomain", () => {
    const mockDomainId = "domain-123"

    it("should call api.get with correct URL and return domain", async () => {
      const mockDomain = {
        id: mockDomainId,
        name: "Test Domain",
        status: "active",
      }
      mockApiService.get.mockResolvedValue(mockDomain)

      const result = await domainService.getDomain({ domainId: mockDomainId })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.domain, { domainId: mockDomainId }),
      )
      expect(result).toEqual(mockDomain)
    })

    it("should construct URL correctly with domainId", async () => {
      const mockDomain = { id: mockDomainId }
      mockApiService.get.mockResolvedValue(mockDomain)

      await domainService.getDomain({ domainId: mockDomainId })

      // Verify the URL is correctly constructed
      const expectedUrl = `/v1/domains/${mockDomainId}`
      expect(mockApiService.get).toHaveBeenCalledWith(expectedUrl)
    })

    it("should handle different domain IDs", async () => {
      const differentDomainId = "another-domain-456"
      const mockDomain = { id: differentDomainId, name: "Another Domain" }
      mockApiService.get.mockResolvedValue(mockDomain)

      const result = await domainService.getDomain({ domainId: differentDomainId })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.domain, { domainId: differentDomainId }),
      )
      expect(result).toEqual(mockDomain)
    })
  })
})
