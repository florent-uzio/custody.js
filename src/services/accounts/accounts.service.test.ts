import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { AccountsService } from "./accounts.service.js"

// Mock ApiService
const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
}

describe("AccountsService", () => {
  let accountsService: AccountsService

  const mockDomainId = "domain-123"
  const mockAccountId = "account-456"

  beforeEach(() => {
    vi.clearAllMocks()
    accountsService = new AccountsService(mockApiService as any)
  })

  describe("getAccounts", () => {
    it("should call api.get with correct URL and return accounts", async () => {
      const mockAccounts = {
        data: [{ id: "acc-1", name: "Account 1" }],
        pagination: { total: 1 },
      }
      mockApiService.get.mockResolvedValue(mockAccounts)

      const result = await accountsService.getAccounts({ domainId: mockDomainId })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accounts, { domainId: mockDomainId }),
        undefined,
      )
      expect(result).toEqual(mockAccounts)
    })

    it("should pass query parameters to api.get", async () => {
      const mockAccounts = { data: [], pagination: { total: 0 } }
      mockApiService.get.mockResolvedValue(mockAccounts)

      const queryParams = { limit: 10, offset: 20 }
      await accountsService.getAccounts({ domainId: mockDomainId }, queryParams)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accounts, { domainId: mockDomainId }),
        queryParams,
      )
    })
  })

  describe("getAllDomainsAddresses", () => {
    it("should call api.get with addresses URL and return addresses", async () => {
      const mockAddresses = {
        data: [{ address: "r123...", domainId: mockDomainId }],
      }
      mockApiService.get.mockResolvedValue(mockAddresses)

      const result = await accountsService.getAllDomainsAddresses()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.addresses, undefined)
      expect(result).toEqual(mockAddresses)
    })

    it("should pass query parameters to api.get", async () => {
      const mockAddresses = { data: [] }
      mockApiService.get.mockResolvedValue(mockAddresses)

      const queryParams = { address: "rTestAddress123..." }
      await accountsService.getAllDomainsAddresses(queryParams)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.addresses, queryParams)
    })
  })

  describe("getAccount", () => {
    it("should call api.get with correct URL and return account", async () => {
      const mockAccount = { id: mockAccountId, name: "Test Account" }
      mockApiService.get.mockResolvedValue(mockAccount)

      const result = await accountsService.getAccount({
        domainId: mockDomainId,
        accountId: mockAccountId,
      })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.account, { domainId: mockDomainId, accountId: mockAccountId }),
        undefined,
      )
      expect(result).toEqual(mockAccount)
    })

    it("should pass query parameters to api.get", async () => {
      const mockAccount = { id: mockAccountId }
      mockApiService.get.mockResolvedValue(mockAccount)

      const queryParams = { includeBalances: true }
      await accountsService.getAccount(
        { domainId: mockDomainId, accountId: mockAccountId },
        queryParams as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.account, { domainId: mockDomainId, accountId: mockAccountId }),
        queryParams,
      )
    })
  })

  describe("getAddresses", () => {
    it("should call api.get with correct URL and return addresses", async () => {
      const mockAddresses = {
        data: [{ id: "addr-1", address: "r123..." }],
      }
      mockApiService.get.mockResolvedValue(mockAddresses)

      const result = await accountsService.getAddresses({
        domainId: mockDomainId,
        accountId: mockAccountId,
      })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accountAddresses, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        undefined,
      )
      expect(result).toEqual(mockAddresses)
    })

    it("should pass query parameters to api.get", async () => {
      const mockAddresses = { data: [] }
      mockApiService.get.mockResolvedValue(mockAddresses)

      const queryParams = { ledgerId: "xrpl-testnet" }
      await accountsService.getAddresses(
        { domainId: mockDomainId, accountId: mockAccountId },
        queryParams as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accountAddresses, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        queryParams,
      )
    })
  })

  describe("generateNewExternalAddressDeprecated", () => {
    it("should call api.post with correct URL and return new address", async () => {
      const mockAddress = { id: "addr-new", address: "rNew123..." }
      mockApiService.post.mockResolvedValue(mockAddress)

      const result = await accountsService.generateNewExternalAddressDeprecated({
        domainId: mockDomainId,
        accountId: mockAccountId,
      })

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.accountAddresses, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        undefined,
      )
      expect(result).toEqual(mockAddress)
    })

    it("should pass query parameters to api.post", async () => {
      const mockAddress = { id: "addr-new" }
      mockApiService.post.mockResolvedValue(mockAddress)

      const queryParams = { ledgerId: "xrpl-mainnet" }
      await accountsService.generateNewExternalAddressDeprecated(
        { domainId: mockDomainId, accountId: mockAccountId },
        queryParams as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.accountAddresses, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        queryParams,
      )
    })
  })

  describe("generateNewExternalAddress", () => {
    it("should call api.post with correct URL including ledgerId", async () => {
      const mockLedgerId = "xrpl-mainnet"
      const mockAddress = { id: "addr-new", address: "rNew456..." }
      mockApiService.post.mockResolvedValue(mockAddress)

      const result = await accountsService.generateNewExternalAddress({
        domainId: mockDomainId,
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
      })

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.accountAddressesByLedger, {
          domainId: mockDomainId,
          accountId: mockAccountId,
          ledgerId: mockLedgerId,
        }),
        null,
      )
      expect(result).toEqual(mockAddress)
    })
  })

  describe("getAccountAddress", () => {
    it("should call api.get with correct URL and return address", async () => {
      const mockAddressId = "addr-789"
      const mockAddress = { id: mockAddressId, address: "rAddr123..." }
      mockApiService.get.mockResolvedValue(mockAddress)

      const result = await accountsService.getAccountAddress({
        domainId: mockDomainId,
        accountId: mockAccountId,
        accountAddressId: mockAddressId,
      })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accountAddress, {
          domainId: mockDomainId,
          accountId: mockAccountId,
          accountAddressId: mockAddressId,
        }),
      )
      expect(result).toEqual(mockAddress)
    })
  })

  describe("getAccountBalances", () => {
    it("should call api.get with correct URL and return balances", async () => {
      const mockBalances = {
        data: [{ tickerId: "XRP", balance: "1000000" }],
      }
      mockApiService.get.mockResolvedValue(mockBalances)

      const result = await accountsService.getAccountBalances({
        domainId: mockDomainId,
        accountId: mockAccountId,
      })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accountBalances, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        undefined,
      )
      expect(result).toEqual(mockBalances)
    })

    it("should pass query parameters to api.get", async () => {
      const mockBalances = { data: [] }
      mockApiService.get.mockResolvedValue(mockBalances)

      const queryParams = { tickerId: "XRP" }
      await accountsService.getAccountBalances(
        { domainId: mockDomainId, accountId: mockAccountId },
        queryParams as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accountBalances, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        queryParams,
      )
    })
  })

  describe("forceUpdateAccountBalances", () => {
    it("should call api.post with correct URL", async () => {
      mockApiService.post.mockResolvedValue(undefined)

      await accountsService.forceUpdateAccountBalances({
        domainId: mockDomainId,
        accountId: mockAccountId,
      })

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.accountBalances, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        undefined,
      )
    })

    it("should pass query parameters to api.post", async () => {
      mockApiService.post.mockResolvedValue(undefined)

      const queryParams = { force: true }
      await accountsService.forceUpdateAccountBalances(
        { domainId: mockDomainId, accountId: mockAccountId },
        queryParams as any,
      )

      expect(mockApiService.post).toHaveBeenCalledWith(
        replacePathParams(URLs.accountBalances, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        queryParams,
      )
    })
  })

  describe("getManifests", () => {
    it("should call api.get with correct URL and return manifests", async () => {
      const mockManifests = {
        data: [{ id: "manifest-1", status: "active" }],
      }
      mockApiService.get.mockResolvedValue(mockManifests)

      const result = await accountsService.getManifests({
        domainId: mockDomainId,
        accountId: mockAccountId,
      })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accountManifests, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        undefined,
      )
      expect(result).toEqual(mockManifests)
    })

    it("should pass query parameters to api.get", async () => {
      const mockManifests = { data: [] }
      mockApiService.get.mockResolvedValue(mockManifests)

      const queryParams = { limit: 5 }
      await accountsService.getManifests(
        { domainId: mockDomainId, accountId: mockAccountId },
        queryParams as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accountManifests, {
          domainId: mockDomainId,
          accountId: mockAccountId,
        }),
        queryParams,
      )
    })
  })

  describe("getManifest", () => {
    it("should call api.get with correct URL and return manifest", async () => {
      const mockManifestId = "manifest-123"
      const mockManifest = { id: mockManifestId, status: "active", content: {} }
      mockApiService.get.mockResolvedValue(mockManifest)

      const result = await accountsService.getManifest({
        domainId: mockDomainId,
        accountId: mockAccountId,
        manifestId: mockManifestId,
      })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.accountManifest, {
          domainId: mockDomainId,
          accountId: mockAccountId,
          manifestId: mockManifestId,
        }),
      )
      expect(result).toEqual(mockManifest)
    })
  })

  describe("findByAddress", () => {
    const mockAddress = "rTestAddress123456789"
    const mockLedgerId = "xrpl-testnet"

    it("should return account when found", async () => {
      const mockAddressResponse = {
        items: [
          {
            address: mockAddress,
            accountId: mockAccountId,
            ledgerId: mockLedgerId,
          },
        ],
      }
      mockApiService.get.mockResolvedValue(mockAddressResponse)

      const result = await accountsService.findByAddress(mockAddress)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.addresses, { address: mockAddress })
      expect(result).toEqual({
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      })
    })

    it("should throw CustodyError when account not found", async () => {
      mockApiService.get.mockResolvedValue({ items: [] })

      await expect(accountsService.findByAddress(mockAddress)).rejects.toThrow(
        `Account not found for address ${mockAddress}`,
      )
    })

    it("should find correct account among multiple results", async () => {
      const otherAddress = "rOtherAddress987654321"
      const mockAddressResponse = {
        items: [
          {
            address: otherAddress,
            accountId: "other-account-id",
            ledgerId: "other-ledger",
          },
          {
            address: mockAddress,
            accountId: mockAccountId,
            ledgerId: mockLedgerId,
          },
        ],
      }
      mockApiService.get.mockResolvedValue(mockAddressResponse)

      const result = await accountsService.findByAddress(mockAddress)

      expect(result).toEqual({
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        address: mockAddress,
      })
    })
  })
})
