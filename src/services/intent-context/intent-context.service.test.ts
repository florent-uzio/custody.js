import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { AccountsService } from "../accounts/index.js"
import type { ApiService } from "../apis/index.js"
import { UsersService } from "../users/index.js"
import { IntentContextService } from "./intent-context.service.js"

describe("IntentContextService", () => {
  let intentContextService: IntentContextService
  let mockApiService: ApiService
  let mockUsersService: UsersService
  let mockAccountsService: AccountsService

  const mockDomainId = "domain-123"
  const mockUserId = "user-123"
  const mockAccountId = "account-123"
  const mockLedgerId = "ledger-123"
  const mockAddress = "rLpUHpWU455zTvVq65EEeHss52Dk4WvQHn"

  beforeEach(() => {
    mockApiService = {} as ApiService

    mockUsersService = {
      getMe: vi.fn(),
    } as unknown as UsersService

    mockAccountsService = {
      getAllDomainsAddresses: vi.fn(),
    } as unknown as AccountsService

    intentContextService = new IntentContextService(mockApiService)

    // @ts-expect-error - accessing private property for testing
    intentContextService.usersService = mockUsersService
    // @ts-expect-error - accessing private property for testing
    intentContextService.accountsService = mockAccountsService
  })

  describe("validateUser", () => {
    it("should pass validation when user has login ID and domains", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      expect(() => intentContextService.validateUser(mockMe as any)).not.toThrow()
    })

    it("should throw error when user has no login ID", () => {
      const mockMe = {
        loginId: null,
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      expect(() => intentContextService.validateUser(mockMe as any)).toThrow(CustodyError)
      expect(() => intentContextService.validateUser(mockMe as any)).toThrow("User has no login ID")
    })

    it("should throw error when user has no domains", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [],
      }

      expect(() => intentContextService.validateUser(mockMe as any)).toThrow(CustodyError)
      expect(() => intentContextService.validateUser(mockMe as any)).toThrow("User has no domains")
    })
  })

  describe("resolveDomainAndUser", () => {
    it("should return the single domain when user has one domain", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      const result = intentContextService.resolveDomainAndUser(mockMe as any)

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

      const result = intentContextService.resolveDomainAndUser(mockMe as any, providedDomainId)

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

      expect(() => intentContextService.resolveDomainAndUser(mockMe as any)).toThrow(CustodyError)
      expect(() => intentContextService.resolveDomainAndUser(mockMe as any)).toThrow(
        "User has multiple domains. Please specify domainId in the options parameter.",
      )
    })

    it("should throw error when provided domainId is not found", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      expect(() =>
        intentContextService.resolveDomainAndUser(mockMe as any, "non-existent"),
      ).toThrow(CustodyError)
      expect(() =>
        intentContextService.resolveDomainAndUser(mockMe as any, "non-existent"),
      ).toThrow("Domain with ID non-existent not found for user")
    })

    it("should throw error when domain has no ID", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: undefined, userReference: { id: mockUserId } }],
      }

      expect(() => intentContextService.resolveDomainAndUser(mockMe as any)).toThrow(CustodyError)
      expect(() => intentContextService.resolveDomainAndUser(mockMe as any)).toThrow(
        "User has no primary domain",
      )
    })

    it("should throw error when domain has no user reference", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: null }],
      }

      expect(() => intentContextService.resolveDomainAndUser(mockMe as any)).toThrow(CustodyError)
      expect(() => intentContextService.resolveDomainAndUser(mockMe as any)).toThrow(
        "Primary domain has no user reference",
      )
    })

    it("should throw error when provided domain has no user reference", () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: null }],
      }

      expect(() => intentContextService.resolveDomainAndUser(mockMe as any, mockDomainId)).toThrow(
        CustodyError,
      )
      expect(() => intentContextService.resolveDomainAndUser(mockMe as any, mockDomainId)).toThrow(
        `Domain ${mockDomainId} has no user reference`,
      )
    })
  })

  describe("findAccountByAddress", () => {
    it("should return account when found", async () => {
      const mockAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockAccount],
      } as any)

      const result = await intentContextService.findAccountByAddress(mockAddress)

      expect(mockAccountsService.getAllDomainsAddresses).toHaveBeenCalledWith({
        address: mockAddress,
      })
      expect(result).toEqual(mockAccount)
    })

    it("should throw error when account is not found", async () => {
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [],
      } as any)

      await expect(intentContextService.findAccountByAddress(mockAddress)).rejects.toThrow(
        CustodyError,
      )
      await expect(intentContextService.findAccountByAddress(mockAddress)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should find correct account among multiple", async () => {
      const targetAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }
      const otherAccount = {
        accountId: "other-account",
        ledgerId: "other-ledger",
        address: "rOtherAddress123456789",
      }

      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [otherAccount, targetAccount],
      } as any)

      const result = await intentContextService.findAccountByAddress(mockAddress)

      expect(result).toEqual(targetAccount)
    })
  })

  describe("resolveContext", () => {
    it("should return full context when all data is valid", async () => {
      const mockMe = {
        loginId: { id: "login-123" },
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      const mockAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockAccount],
      } as any)

      const result = await intentContextService.resolveContext(mockAddress)

      expect(result).toEqual({
        domainId: mockDomainId,
        userId: mockUserId,
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
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

      const mockAccount = {
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)
      vi.mocked(mockAccountsService.getAllDomainsAddresses).mockResolvedValue({
        items: [mockAccount],
      } as any)

      const result = await intentContextService.resolveContext(mockAddress, {
        domainId: providedDomainId,
      })

      expect(result.domainId).toBe(providedDomainId)
      expect(result.userId).toBe("user-456")
    })

    it("should throw validation error before account lookup", async () => {
      const mockMe = {
        loginId: null,
        domains: [{ id: mockDomainId, userReference: { id: mockUserId } }],
      }

      vi.mocked(mockUsersService.getMe).mockResolvedValue(mockMe as any)

      await expect(intentContextService.resolveContext(mockAddress)).rejects.toThrow(
        "User has no login ID",
      )
      expect(mockAccountsService.getAllDomainsAddresses).not.toHaveBeenCalled()
    })
  })
})
