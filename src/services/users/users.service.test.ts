import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { UsersService } from "./users.service.js"

const mockApiService = {
  get: vi.fn(),
}

describe("UsersService", () => {
  let usersService: UsersService

  const mockDomainId = "domain-123"
  const mockUserId = "user-456"

  beforeEach(() => {
    vi.clearAllMocks()
    usersService = new UsersService(mockApiService as any)
  })

  describe("getUsers", () => {
    it("should call api.get with correct URL and return users collection", async () => {
      const mockUsers = {
        items: [
          { id: mockUserId, email: "user@example.com", role: "VIEWER" },
          { id: "user-789", email: "admin@example.com", role: "ADMIN" },
        ],
        total: 2,
      }
      mockApiService.get.mockResolvedValue(mockUsers)

      const result = await usersService.getUsers({ domainId: mockDomainId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.users, { domainId: mockDomainId }),
        undefined,
      )
      expect(result).toEqual(mockUsers)
    })

    it("should pass query parameters to api.get", async () => {
      const mockUsers = {
        items: [],
        total: 0,
      }
      mockApiService.get.mockResolvedValue(mockUsers)

      const query = { limit: 10, offset: 0 }
      await usersService.getUsers({ domainId: mockDomainId } as any, query as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.users, { domainId: mockDomainId }),
        query,
      )
    })

    it("should handle pagination query parameters", async () => {
      const mockUsers = {
        items: [{ id: mockUserId, email: "user@example.com" }],
        total: 100,
      }
      mockApiService.get.mockResolvedValue(mockUsers)

      const query = { limit: 25, offset: 50 }
      await usersService.getUsers({ domainId: mockDomainId } as any, query as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.users, { domainId: mockDomainId }),
        query,
      )
    })
  })

  describe("getKnownUserRoles", () => {
    it("should call api.get with correct URL and return user roles", async () => {
      const mockRoles = {
        roles: ["ADMIN", "VIEWER", "EDITOR", "OPERATOR"],
      }
      mockApiService.get.mockResolvedValue(mockRoles)

      const result = await usersService.getKnownUserRoles({ domainId: mockDomainId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.userRoles, { domainId: mockDomainId }),
      )
      expect(result).toEqual(mockRoles)
    })

    it("should handle empty roles list", async () => {
      const mockRoles = {
        roles: [],
      }
      mockApiService.get.mockResolvedValue(mockRoles)

      const result = await usersService.getKnownUserRoles({ domainId: mockDomainId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.userRoles, { domainId: mockDomainId }),
      )
      expect(result).toEqual(mockRoles)
    })
  })

  describe("getUser", () => {
    it("should call api.get with correct URL and return user details", async () => {
      const mockUser = {
        id: mockUserId,
        email: "user@example.com",
        role: "ADMIN",
        firstName: "John",
        lastName: "Doe",
        status: "ACTIVE",
      }
      mockApiService.get.mockResolvedValue(mockUser)

      const result = await usersService.getUser({
        domainId: mockDomainId,
        userId: mockUserId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.user, { domainId: mockDomainId, userId: mockUserId }),
      )
      expect(result).toEqual(mockUser)
    })

    it("should handle different user roles", async () => {
      const mockUser = {
        id: mockUserId,
        email: "viewer@example.com",
        role: "VIEWER",
      }
      mockApiService.get.mockResolvedValue(mockUser)

      const result = await usersService.getUser({
        domainId: mockDomainId,
        userId: mockUserId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.user, { domainId: mockDomainId, userId: mockUserId }),
      )
      expect(result).toEqual(mockUser)
    })
  })

  describe("getMe", () => {
    it("should call api.get with correct URL and return current user reference", async () => {
      const mockMeReference = {
        id: "current-user-123",
        email: "me@example.com",
        domains: [
          { id: "domain-1", role: "ADMIN" },
          { id: "domain-2", role: "VIEWER" },
        ],
      }
      mockApiService.get.mockResolvedValue(mockMeReference)

      const result = await usersService.getMe()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.me)
      expect(result).toEqual(mockMeReference)
    })

    it("should handle user with no domains", async () => {
      const mockMeReference = {
        id: "current-user-456",
        email: "newuser@example.com",
        domains: [],
      }
      mockApiService.get.mockResolvedValue(mockMeReference)

      const result = await usersService.getMe()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.me)
      expect(result).toEqual(mockMeReference)
    })

    it("should handle user with multiple domains and roles", async () => {
      const mockMeReference = {
        id: "current-user-789",
        email: "multiuser@example.com",
        domains: [
          { id: "domain-1", role: "ADMIN" },
          { id: "domain-2", role: "EDITOR" },
          { id: "domain-3", role: "OPERATOR" },
          { id: "domain-4", role: "VIEWER" },
        ],
      }
      mockApiService.get.mockResolvedValue(mockMeReference)

      const result = await usersService.getMe()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.me)
      expect(result).toEqual(mockMeReference)
    })
  })
})
