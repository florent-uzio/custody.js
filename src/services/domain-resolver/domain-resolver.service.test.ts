import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import type { Core_MeReference } from "../users/users.types.js"
import { DomainResolverService, type GetMeFunction } from "./domain-resolver.service.js"

describe("DomainResolverService", () => {
  let domainResolverService: DomainResolverService
  let mockGetMe: GetMeFunction
  let mockDomainCache: DomainCacheService

  const mockDomainId = "domain-123"
  const mockUserId = "user-123"
  const mockLoginId = "login-123"

  const createMockMeReference = (
    overrides: Partial<Core_MeReference> = {},
  ): Core_MeReference =>
    ({
      loginId: { id: mockLoginId, providerId: "provider-123" },
      domains: [
        {
          id: mockDomainId,
          alias: "test-domain",
          userReference: { id: mockUserId, alias: "test-user", roles: ["admin"] },
        },
      ],
      ...overrides,
    }) as Core_MeReference

  beforeEach(() => {
    mockGetMe = vi.fn()
    mockDomainCache = {
      get: vi.fn(),
      set: vi.fn(),
      clear: vi.fn(),
    } as unknown as DomainCacheService
  })

  describe("resolveDomainOnly", () => {
    describe("without cache", () => {
      beforeEach(() => {
        domainResolverService = new DomainResolverService(mockGetMe)
      })

      it("should resolve domain and user ID for user with single domain", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(createMockMeReference())

        const result = await domainResolverService.resolveDomainOnly()

        expect(result).toEqual({
          domainId: mockDomainId,
          userId: mockUserId,
        })
        expect(mockGetMe).toHaveBeenCalledOnce()
      })

      it("should resolve domain when providedDomainId matches user domain", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(createMockMeReference())

        const result = await domainResolverService.resolveDomainOnly(mockDomainId)

        expect(result).toEqual({
          domainId: mockDomainId,
          userId: mockUserId,
        })
      })

      it("should resolve domain when user has multiple domains and domainId is provided", async () => {
        const secondDomainId = "domain-456"
        const secondUserId = "user-456"
        vi.mocked(mockGetMe).mockResolvedValue(
          createMockMeReference({
            domains: [
              {
                id: mockDomainId,
                alias: "domain-1",
                userReference: { id: mockUserId, alias: "user-1", roles: ["admin"] },
              },
              {
                id: secondDomainId,
                alias: "domain-2",
                userReference: { id: secondUserId, alias: "user-2", roles: ["viewer"] },
              },
            ],
          }),
        )

        const result = await domainResolverService.resolveDomainOnly(secondDomainId)

        expect(result).toEqual({
          domainId: secondDomainId,
          userId: secondUserId,
        })
      })

      it("should throw error when user has no login ID", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(
          createMockMeReference({ loginId: undefined as any }),
        )

        await expect(domainResolverService.resolveDomainOnly()).rejects.toThrow(
          CustodyError,
        )
        await expect(domainResolverService.resolveDomainOnly()).rejects.toThrow(
          "User has no login ID",
        )
      })

      it("should throw error when user has no domains", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(createMockMeReference({ domains: [] }))

        await expect(domainResolverService.resolveDomainOnly()).rejects.toThrow(
          CustodyError,
        )
        await expect(domainResolverService.resolveDomainOnly()).rejects.toThrow(
          "User has no domains",
        )
      })

      it("should throw error when user has multiple domains and no domainId is provided", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(
          createMockMeReference({
            domains: [
              {
                id: mockDomainId,
                alias: "domain-1",
                userReference: { id: mockUserId, alias: "user-1", roles: ["admin"] },
              },
              {
                id: "domain-456",
                alias: "domain-2",
                userReference: { id: "user-456", alias: "user-2", roles: ["viewer"] },
              },
            ],
          }),
        )

        await expect(domainResolverService.resolveDomainOnly()).rejects.toThrow(
          CustodyError,
        )
        await expect(domainResolverService.resolveDomainOnly()).rejects.toThrow(
          "User has multiple domains. Please specify domainId in the options parameter.",
        )
      })

      it("should throw error when provided domainId is not found", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(createMockMeReference())

        await expect(
          domainResolverService.resolveDomainOnly("non-existent-domain"),
        ).rejects.toThrow(CustodyError)
        await expect(
          domainResolverService.resolveDomainOnly("non-existent-domain"),
        ).rejects.toThrow("Domain with ID non-existent-domain not found for user")
      })

      it("should throw error when domain has no user reference", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(
          createMockMeReference({
            domains: [
              { id: mockDomainId, alias: "domain-1", userReference: undefined as any },
            ],
          }),
        )

        await expect(domainResolverService.resolveDomainOnly()).rejects.toThrow(
          CustodyError,
        )
        await expect(domainResolverService.resolveDomainOnly()).rejects.toThrow(
          "Primary domain has no user reference",
        )
      })
    })

    describe("with cache", () => {
      beforeEach(() => {
        domainResolverService = new DomainResolverService(mockGetMe, mockDomainCache)
      })

      it("should return cached value when available and no domainId provided", async () => {
        const cachedValue = { domainId: "cached-domain", userId: "cached-user" }
        vi.mocked(mockDomainCache.get).mockReturnValue(cachedValue)

        const result = await domainResolverService.resolveDomainOnly()

        expect(result).toEqual(cachedValue)
        expect(mockDomainCache.get).toHaveBeenCalledWith("user:domains")
        expect(mockGetMe).not.toHaveBeenCalled()
      })

      it("should not use cache when domainId is explicitly provided", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(createMockMeReference())

        await domainResolverService.resolveDomainOnly(mockDomainId)

        expect(mockDomainCache.get).not.toHaveBeenCalled()
        expect(mockGetMe).toHaveBeenCalledOnce()
      })

      it("should cache result when no domainId is provided and cache miss", async () => {
        vi.mocked(mockDomainCache.get).mockReturnValue(undefined)
        vi.mocked(mockGetMe).mockResolvedValue(createMockMeReference())

        const result = await domainResolverService.resolveDomainOnly()

        expect(mockDomainCache.set).toHaveBeenCalledWith("user:domains", {
          domainId: mockDomainId,
          userId: mockUserId,
        })
        expect(result).toEqual({
          domainId: mockDomainId,
          userId: mockUserId,
        })
      })

      it("should not cache result when domainId is explicitly provided", async () => {
        vi.mocked(mockGetMe).mockResolvedValue(createMockMeReference())

        await domainResolverService.resolveDomainOnly(mockDomainId)

        expect(mockDomainCache.set).not.toHaveBeenCalled()
      })

      it("should fetch from API when cache returns undefined", async () => {
        vi.mocked(mockDomainCache.get).mockReturnValue(undefined)
        vi.mocked(mockGetMe).mockResolvedValue(createMockMeReference())

        const result = await domainResolverService.resolveDomainOnly()

        expect(mockGetMe).toHaveBeenCalledOnce()
        expect(result).toEqual({
          domainId: mockDomainId,
          userId: mockUserId,
        })
      })
    })
  })

  describe("validateUser", () => {
    beforeEach(() => {
      domainResolverService = new DomainResolverService(mockGetMe)
    })

    it("should not throw for valid user with login ID and domains", () => {
      const me = createMockMeReference()

      expect(() => domainResolverService.validateUser(me)).not.toThrow()
    })

    it("should throw when user has no login ID", () => {
      const me = createMockMeReference({ loginId: undefined as any })

      expect(() => domainResolverService.validateUser(me)).toThrow(CustodyError)
      expect(() => domainResolverService.validateUser(me)).toThrow(
        "User has no login ID",
      )
    })

    it("should throw when user has loginId with no id property", () => {
      const me = createMockMeReference({
        loginId: { id: undefined, providerId: "provider" } as any,
      })

      expect(() => domainResolverService.validateUser(me)).toThrow(CustodyError)
      expect(() => domainResolverService.validateUser(me)).toThrow(
        "User has no login ID",
      )
    })

    it("should throw when user has empty domains array", () => {
      const me = createMockMeReference({ domains: [] })

      expect(() => domainResolverService.validateUser(me)).toThrow(CustodyError)
      expect(() => domainResolverService.validateUser(me)).toThrow(
        "User has no domains",
      )
    })
  })

  describe("resolveDomainAndUser", () => {
    beforeEach(() => {
      domainResolverService = new DomainResolverService(mockGetMe)
    })

    describe("with provided domainId", () => {
      it("should return matching domain and user ID", () => {
        const me = createMockMeReference()

        const result = domainResolverService.resolveDomainAndUser(me, mockDomainId)

        expect(result).toEqual({
          domainId: mockDomainId,
          userId: mockUserId,
        })
      })

      it("should find correct domain when user has multiple domains", () => {
        const secondDomainId = "domain-456"
        const secondUserId = "user-456"
        const me = createMockMeReference({
          domains: [
            {
              id: mockDomainId,
              alias: "domain-1",
              userReference: { id: mockUserId, alias: "user-1", roles: ["admin"] },
            },
            {
              id: secondDomainId,
              alias: "domain-2",
              userReference: { id: secondUserId, alias: "user-2", roles: ["viewer"] },
            },
          ],
        })

        const result = domainResolverService.resolveDomainAndUser(me, secondDomainId)

        expect(result).toEqual({
          domainId: secondDomainId,
          userId: secondUserId,
        })
      })

      it("should throw when domainId is not found", () => {
        const me = createMockMeReference()

        expect(() =>
          domainResolverService.resolveDomainAndUser(me, "non-existent"),
        ).toThrow(CustodyError)
        expect(() =>
          domainResolverService.resolveDomainAndUser(me, "non-existent"),
        ).toThrow("Domain with ID non-existent not found for user")
      })

      it("should throw when found domain has no ID", () => {
        const me = createMockMeReference({
          domains: [
            {
              id: undefined as any,
              alias: "domain-1",
              userReference: { id: mockUserId, alias: "user-1", roles: ["admin"] },
            },
          ],
        })

        // First it will not find the domain because id is undefined
        expect(() =>
          domainResolverService.resolveDomainAndUser(me, mockDomainId),
        ).toThrow("Domain with ID domain-123 not found for user")
      })

      it("should throw when found domain has no user reference", () => {
        const me = createMockMeReference({
          domains: [
            { id: mockDomainId, alias: "domain-1", userReference: undefined as any },
          ],
        })

        expect(() =>
          domainResolverService.resolveDomainAndUser(me, mockDomainId),
        ).toThrow(CustodyError)
        expect(() =>
          domainResolverService.resolveDomainAndUser(me, mockDomainId),
        ).toThrow(`Domain ${mockDomainId} has no user reference`)
      })

      it("should throw when found domain user reference has no ID", () => {
        const me = createMockMeReference({
          domains: [
            {
              id: mockDomainId,
              alias: "domain-1",
              userReference: { id: undefined, alias: "user-1", roles: ["admin"] } as any,
            },
          ],
        })

        expect(() =>
          domainResolverService.resolveDomainAndUser(me, mockDomainId),
        ).toThrow(CustodyError)
        expect(() =>
          domainResolverService.resolveDomainAndUser(me, mockDomainId),
        ).toThrow(`Domain ${mockDomainId} has no user reference`)
      })
    })

    describe("without provided domainId", () => {
      it("should return first domain when user has single domain", () => {
        const me = createMockMeReference()

        const result = domainResolverService.resolveDomainAndUser(me)

        expect(result).toEqual({
          domainId: mockDomainId,
          userId: mockUserId,
        })
      })

      it("should throw when user has multiple domains", () => {
        const me = createMockMeReference({
          domains: [
            {
              id: mockDomainId,
              alias: "domain-1",
              userReference: { id: mockUserId, alias: "user-1", roles: ["admin"] },
            },
            {
              id: "domain-456",
              alias: "domain-2",
              userReference: { id: "user-456", alias: "user-2", roles: ["viewer"] },
            },
          ],
        })

        expect(() => domainResolverService.resolveDomainAndUser(me)).toThrow(
          CustodyError,
        )
        expect(() => domainResolverService.resolveDomainAndUser(me)).toThrow(
          "User has multiple domains. Please specify domainId in the options parameter.",
        )
      })

      it("should throw when primary domain has no ID", () => {
        const me = createMockMeReference({
          domains: [
            {
              id: undefined as any,
              alias: "domain-1",
              userReference: { id: mockUserId, alias: "user-1", roles: ["admin"] },
            },
          ],
        })

        expect(() => domainResolverService.resolveDomainAndUser(me)).toThrow(
          CustodyError,
        )
        expect(() => domainResolverService.resolveDomainAndUser(me)).toThrow(
          "User has no primary domain",
        )
      })

      it("should throw when primary domain has no user reference", () => {
        const me = createMockMeReference({
          domains: [
            { id: mockDomainId, alias: "domain-1", userReference: undefined as any },
          ],
        })

        expect(() => domainResolverService.resolveDomainAndUser(me)).toThrow(
          CustodyError,
        )
        expect(() => domainResolverService.resolveDomainAndUser(me)).toThrow(
          "Primary domain has no user reference",
        )
      })

      it("should throw when primary domain user reference has no ID", () => {
        const me = createMockMeReference({
          domains: [
            {
              id: mockDomainId,
              alias: "domain-1",
              userReference: { id: undefined, alias: "user-1", roles: ["admin"] } as any,
            },
          ],
        })

        expect(() => domainResolverService.resolveDomainAndUser(me)).toThrow(
          CustodyError,
        )
        expect(() => domainResolverService.resolveDomainAndUser(me)).toThrow(
          "Primary domain has no user reference",
        )
      })
    })
  })
})
