import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import type { ApiService } from "../apis/index.js"
import { UsersService } from "../users/index.js"
import { DomainResolverService } from "./domain-resolver.service.js"

describe("DomainResolverService", () => {
  let domainResolverService: DomainResolverService
  let mockApiService: ApiService
  let mockUsersService: UsersService

  const mockDomainId = "domain-123"
  const mockUserId = "user-123"

  beforeEach(() => {
    mockApiService = {} as ApiService

    mockUsersService = {
      getMe: vi.fn(),
    } as unknown as UsersService

    domainResolverService = new DomainResolverService(mockApiService)

    // @ts-expect-error - accessing private property for testing
    domainResolverService.usersService = mockUsersService
  })

  describe("validateUser", () => {
    it("should pass validation when user has login ID and domains", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      expect(() => domainResolverService.validateUser(mockMe as any)).not.toThrow()
    })

    it("should throw error when user has no login ID", () => {
      const mockMe = {
        loginId: null,
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      expect(() => domainResolverService.validateUser(mockMe as any)).toThrow(CustodyError)
      expect(() => domainResolverService.validateUser(mockMe as any)).toThrow(
        "User has no login ID",
      )
    })

    it("should throw error when user has no domains", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [],
      }

      expect(() => domainResolverService.validateUser(mockMe as any)).toThrow(CustodyError)
      expect(() => domainResolverService.validateUser(mockMe as any)).toThrow("User has no domains")
    })
  })

  describe("resolveDomainAndUser", () => {
    it("should return the single domain when user has one domain", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      const result = domainResolverService.resolveDomainAndUser(mockMe as any)

      expect(result).toEqual({ domainId: mockDomainId, userId: mockUserId })
    })

    it("should return provided domain when domainId is specified", () => {
      const providedDomainId = "domain-456"
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          { id: mockDomainId, userReference: { id: mockUserId } },
          { id: providedDomainId, userReference: { id: "user-456" } },
        ],
      }

      const result = domainResolverService.resolveDomainAndUser(mockMe as any, providedDomainId)

      expect(result).toEqual({ domainId: providedDomainId, userId: "user-456" })
    })

    it("should throw error when user has multiple domains without domainId", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          { id: "domain-1", userReference: { id: "user-1" } },
          { id: "domain-2", userReference: { id: "user-2" } },
        ],
      }

      expect(() => domainResolverService.resolveDomainAndUser(mockMe as any)).toThrow(CustodyError)
      expect(() => domainResolverService.resolveDomainAndUser(mockMe as any)).toThrow(
        "User has multiple domains. Please specify domainId in the options parameter.",
      )
    })

    it("should throw error when provided domainId is not found", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      expect(() =>
        domainResolverService.resolveDomainAndUser(mockMe as any, "non-existent"),
      ).toThrow(CustodyError)
      expect(() =>
        domainResolverService.resolveDomainAndUser(mockMe as any, "non-existent"),
      ).toThrow("Domain with ID non-existent not found for user")
    })

    it("should throw error when domain has no ID", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: undefined, userReference: { id: mockUserId } }],
      }

      expect(() => domainResolverService.resolveDomainAndUser(mockMe as any)).toThrow(CustodyError)
      expect(() => domainResolverService.resolveDomainAndUser(mockMe as any)).toThrow(
        "User has no primary domain",
      )
    })

    it("should throw error when domain has no user reference", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: null }],
      }

      expect(() => domainResolverService.resolveDomainAndUser(mockMe as any)).toThrow(CustodyError)
      expect(() => domainResolverService.resolveDomainAndUser(mockMe as any)).toThrow(
        "Primary domain has no user reference",
      )
    })

    it("should throw error when provided domain has no user reference", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: null }],
      }

      expect(() => domainResolverService.resolveDomainAndUser(mockMe as any, mockDomainId)).toThrow(
        CustodyError,
      )
      expect(() => domainResolverService.resolveDomainAndUser(mockMe as any, mockDomainId)).toThrow(
        `Domain ${mockDomainId} has no user reference`,
      )
    })
  })

  describe("resolve", () => {
    it("should return domain and user reference when all data is valid", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      const result = await domainResolverService.resolve()

      expect(result).toEqual({
        domainId: mockDomainId,
        userId: mockUserId,
      })
    })

    it("should use provided domainId", async () => {
      const providedDomainId = "domain-456"
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [
          { id: mockDomainId, userReference: { id: mockUserId } },
          { id: providedDomainId, userReference: { id: "user-456" } },
        ],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      const result = await domainResolverService.resolve({ domainId: providedDomainId })

      expect(result.domainId).toBe(providedDomainId)
      expect(result.userId).toBe("user-456")
    })

    it("should throw validation error for invalid user", async () => {
      const mockMe = {
        loginId: null,
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      await expect(domainResolverService.resolve()).rejects.toThrow("User has no login ID")
    })
  })
})
