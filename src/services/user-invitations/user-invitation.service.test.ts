import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/url/index.js"
import { UserInvitationService } from "./user-invitation.service.js"

const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
}

describe("UserInvitationService", () => {
  let userInvitationService: UserInvitationService

  const mockDomainId = "domain-123"
  const mockInvitationId = "invitation-456"
  const mockIdOrCode = "code-789"

  beforeEach(() => {
    vi.clearAllMocks()
    userInvitationService = new UserInvitationService(mockApiService as any)
  })

  describe("getUserInvitations", () => {
    it("should call api.get with correct URL and return user invitations", async () => {
      const mockInvitations = {
        id: mockInvitationId,
        email: "test@example.com",
        status: "PENDING",
      }
      mockApiService.get.mockResolvedValue(mockInvitations)

      const result = await userInvitationService.getUserInvitations({
        domainId: mockDomainId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.userInvitations, { domainId: mockDomainId }),
        undefined,
      )
      expect(result).toEqual(mockInvitations)
    })

    it("should pass query parameters to api.get", async () => {
      const mockInvitations = {
        id: mockInvitationId,
        email: "test@example.com",
        status: "ACCEPTED",
      }
      mockApiService.get.mockResolvedValue(mockInvitations)

      const query = { limit: 10, offset: 0 }
      await userInvitationService.getUserInvitations(
        { domainId: mockDomainId } as any,
        query as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.userInvitations, { domainId: mockDomainId }),
        query,
      )
    })
  })

  describe("createUserInvitation", () => {
    it("should call api.post with correct URL and body, and return created invitation", async () => {
      const mockInvitationBody = {
        email: "newuser@example.com",
        role: "VIEWER",
      }
      const mockCreatedInvitation = {
        id: mockInvitationId,
        email: "newuser@example.com",
        status: "PENDING",
      }
      mockApiService.post.mockResolvedValue(mockCreatedInvitation)

      const result = await userInvitationService.createUserInvitation(
        { domainId: mockDomainId } as any,
        mockInvitationBody as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.userInvitations, { domainId: mockDomainId }),
        mockInvitationBody,
      )
      expect(result).toEqual(mockCreatedInvitation)
    })

    it("should handle invitation with additional properties", async () => {
      const mockInvitationBody = {
        email: "admin@example.com",
        role: "ADMIN",
        expiresAt: "2026-12-31T23:59:59Z",
      }
      const mockCreatedInvitation = {
        id: mockInvitationId,
        email: "admin@example.com",
        role: "ADMIN",
        status: "PENDING",
        expiresAt: "2026-12-31T23:59:59Z",
      }
      mockApiService.post.mockResolvedValue(mockCreatedInvitation)

      const result = await userInvitationService.createUserInvitation(
        { domainId: mockDomainId } as any,
        mockInvitationBody as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.userInvitations, { domainId: mockDomainId }),
        mockInvitationBody,
      )
      expect(result).toEqual(mockCreatedInvitation)
    })
  })

  describe("getUserInvitation", () => {
    it("should call api.get with correct URL and return user invitation", async () => {
      const mockInvitation = {
        id: mockInvitationId,
        email: "user@example.com",
        status: "PENDING",
      }
      mockApiService.get.mockResolvedValue(mockInvitation)

      const result = await userInvitationService.getUserInvitation({
        domainId: mockDomainId,
        id: mockInvitationId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.userInvitation, {
          domainId: mockDomainId,
          id: mockInvitationId,
        }),
      )
      expect(result).toEqual(mockInvitation)
    })
  })

  describe("cancelUserInvitation", () => {
    it("should call api.post with correct URL and return cancelled invitation", async () => {
      const mockCancelledInvitation = {
        id: mockInvitationId,
        email: "user@example.com",
        status: "CANCELLED",
      }
      mockApiService.post.mockResolvedValue(mockCancelledInvitation)

      const result = await userInvitationService.cancelUserInvitation({
        domainId: mockDomainId,
        id: mockInvitationId,
      } as any)

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.userInvitationCancel, {
          domainId: mockDomainId,
          id: mockInvitationId,
        }),
        undefined,
      )
      expect(result).toEqual(mockCancelledInvitation)
    })
  })

  describe("renewUserInvitation", () => {
    it("should call api.post with correct URL and return renewed invitation", async () => {
      const mockRenewedInvitation = {
        id: mockInvitationId,
        email: "user@example.com",
        status: "PENDING",
        expiresAt: "2027-01-31T23:59:59Z",
      }
      mockApiService.post.mockResolvedValue(mockRenewedInvitation)

      const result = await userInvitationService.renewUserInvitation({
        domainId: mockDomainId,
        id: mockInvitationId,
      } as any)

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.userInvitationRenew, {
          domainId: mockDomainId,
          id: mockInvitationId,
        }),
        undefined,
      )
      expect(result).toEqual(mockRenewedInvitation)
    })
  })

  describe("completeUserInvitation", () => {
    it("should call api.post with correct URL and return completed invitation", async () => {
      const mockCompletedInvitation = {
        id: mockInvitationId,
        email: "user@example.com",
        status: "COMPLETED",
      }
      mockApiService.post.mockResolvedValue(mockCompletedInvitation)

      const result = await userInvitationService.completeUserInvitation({
        domainId: mockDomainId,
        id: mockInvitationId,
      } as any)

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.userInvitationComplete, {
          domainId: mockDomainId,
          id: mockInvitationId,
        }),
        undefined,
      )
      expect(result).toEqual(mockCompletedInvitation)
    })
  })

  describe("fillUserInvitation", () => {
    it("should call api.post with correct URL and body", async () => {
      const mockAnswerBody = {
        firstName: "John",
        lastName: "Doe",
        acceptTerms: true,
      }
      mockApiService.post.mockResolvedValue(undefined)

      await userInvitationService.fillUserInvitation(
        { idOrCode: mockIdOrCode } as any,
        mockAnswerBody as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.publicUserInvitation, { idOrCode: mockIdOrCode }),
        mockAnswerBody,
      )
    })

    it("should handle invitation answer with additional fields", async () => {
      const mockAnswerBody = {
        firstName: "Jane",
        lastName: "Smith",
        phoneNumber: "+1234567890",
        acceptTerms: true,
        preferences: {
          newsletter: true,
        },
      }
      mockApiService.post.mockResolvedValue(undefined)

      await userInvitationService.fillUserInvitation(
        { idOrCode: mockIdOrCode } as any,
        mockAnswerBody as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.publicUserInvitation, { idOrCode: mockIdOrCode }),
        mockAnswerBody,
      )
    })
  })

  describe("getPublicUserInvitation", () => {
    it("should call api.get with correct URL and return public invitation", async () => {
      const mockPublicInvitation = {
        email: "user@example.com",
        domainName: "Example Domain",
        expiresAt: "2026-12-31T23:59:59Z",
      }
      mockApiService.get.mockResolvedValue(mockPublicInvitation)

      const result = await userInvitationService.getPublicUserInvitation({
        idOrCode: mockIdOrCode,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.publicUserInvitation, { idOrCode: mockIdOrCode }),
      )
      expect(result).toEqual(mockPublicInvitation)
    })

    it("should work with invitation ID instead of code", async () => {
      const mockPublicInvitation = {
        email: "another@example.com",
        domainName: "Another Domain",
      }
      mockApiService.get.mockResolvedValue(mockPublicInvitation)

      await userInvitationService.getPublicUserInvitation({
        idOrCode: mockInvitationId,
      } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.publicUserInvitation, { idOrCode: mockInvitationId }),
      )
    })
  })
})
