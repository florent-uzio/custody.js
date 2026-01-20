import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/index.js"
import { replacePathParams } from "../../helpers/index.js"
import { VaultsService } from "./vaults.service.js"

const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
}

describe("VaultsService", () => {
  let vaultsService: VaultsService

  const mockVaultId = "vault-123"

  beforeEach(() => {
    vi.clearAllMocks()
    vaultsService = new VaultsService(mockApiService as any)
  })

  describe("getVaults", () => {
    it("should call api.get with correct URL and return vaults collection", async () => {
      const mockVaults = {
        items: [
          { id: mockVaultId, name: "Main Vault", status: "ACTIVE" },
          { id: "vault-456", name: "Cold Storage", status: "ACTIVE" },
        ],
        total: 2,
      }
      mockApiService.get.mockResolvedValue(mockVaults)

      const result = await vaultsService.getVaults()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.vaults, undefined)
      expect(result).toEqual(mockVaults)
    })

    it("should pass query parameters to api.get", async () => {
      const mockVaults = {
        items: [],
        total: 0,
      }
      mockApiService.get.mockResolvedValue(mockVaults)

      const query = { limit: 10, offset: 0 }
      await vaultsService.getVaults(query as any)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.vaults, query)
    })

    it("should handle pagination query parameters", async () => {
      const mockVaults = {
        items: [{ id: mockVaultId, name: "Vault 1" }],
        total: 50,
      }
      mockApiService.get.mockResolvedValue(mockVaults)

      const query = { limit: 20, offset: 40 }
      await vaultsService.getVaults(query as any)

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.vaults, query)
    })

    it("should handle empty vaults collection", async () => {
      const mockVaults = {
        items: [],
        total: 0,
      }
      mockApiService.get.mockResolvedValue(mockVaults)

      const result = await vaultsService.getVaults()

      expect(mockApiService.get).toHaveBeenCalledWith(URLs.vaults, undefined)
      expect(result).toEqual(mockVaults)
    })
  })

  describe("getVault", () => {
    it("should call api.get with correct URL and return vault details", async () => {
      const mockVault = {
        id: mockVaultId,
        name: "Main Vault",
        status: "ACTIVE",
        type: "HOT_WALLET",
        createdAt: "2026-01-01T00:00:00Z",
      }
      mockApiService.get.mockResolvedValue(mockVault)

      const result = await vaultsService.getVault({ vaultId: mockVaultId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.vault, { vaultId: mockVaultId }),
      )
      expect(result).toEqual(mockVault)
    })

    it("should handle different vault types", async () => {
      const mockVault = {
        id: mockVaultId,
        name: "Cold Storage Vault",
        status: "ACTIVE",
        type: "COLD_WALLET",
      }
      mockApiService.get.mockResolvedValue(mockVault)

      const result = await vaultsService.getVault({ vaultId: mockVaultId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.vault, { vaultId: mockVaultId }),
      )
      expect(result).toEqual(mockVault)
    })

    it("should handle vault with additional metadata", async () => {
      const mockVault = {
        id: mockVaultId,
        name: "Enterprise Vault",
        status: "ACTIVE",
        type: "MULTI_SIG",
        description: "Multi-signature vault for enterprise operations",
        balance: "1000000",
        currency: "USD",
      }
      mockApiService.get.mockResolvedValue(mockVault)

      const result = await vaultsService.getVault({ vaultId: mockVaultId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.vault, { vaultId: mockVaultId }),
      )
      expect(result).toEqual(mockVault)
    })
  })

  describe("exportPreparedOperations", () => {
    it("should call api.get with correct URL and return prepared operations", async () => {
      const mockPreparedOperations = {
        operations: [
          { id: "op-1", type: "TRANSFER", status: "PREPARED" },
          { id: "op-2", type: "PAYMENT", status: "PREPARED" },
        ],
        count: 2,
      }
      mockApiService.get.mockResolvedValue(mockPreparedOperations)

      const result = await vaultsService.exportPreparedOperations({ vaultId: mockVaultId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.vaultOperationsPrepared, { vaultId: mockVaultId }),
      )
      expect(result).toEqual(mockPreparedOperations)
    })

    it("should handle empty prepared operations", async () => {
      const mockPreparedOperations = {
        operations: [],
        count: 0,
      }
      mockApiService.get.mockResolvedValue(mockPreparedOperations)

      const result = await vaultsService.exportPreparedOperations({ vaultId: mockVaultId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.vaultOperationsPrepared, { vaultId: mockVaultId }),
      )
      expect(result).toEqual(mockPreparedOperations)
    })

    it("should handle prepared operations with complex data", async () => {
      const mockPreparedOperations = {
        operations: [
          {
            id: "op-1",
            type: "TRANSFER",
            status: "PREPARED",
            amount: "1000",
            destination: "rDestination",
            fee: "0.00001",
          },
        ],
        count: 1,
        metadata: {
          exportedAt: "2026-01-20T12:00:00Z",
          exportedBy: "user-123",
        },
      }
      mockApiService.get.mockResolvedValue(mockPreparedOperations)

      const result = await vaultsService.exportPreparedOperations({ vaultId: mockVaultId } as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.vaultOperationsPrepared, { vaultId: mockVaultId }),
      )
      expect(result).toEqual(mockPreparedOperations)
    })
  })

  describe("importPreparedOperations", () => {
    it("should call api.post with correct URL, files, and headers", async () => {
      const mockFiles = ["file1-binary-data", "file2-binary-data"]
      mockApiService.post.mockResolvedValue(undefined)

      await vaultsService.importPreparedOperations({ files: mockFiles })

      expect(mockApiService.post).toHaveBeenCalledWith(URLs.vaultOperationsSigned, mockFiles, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    })

    it("should handle single file import", async () => {
      const mockFiles = ["single-file-binary-data"]
      mockApiService.post.mockResolvedValue(undefined)

      await vaultsService.importPreparedOperations({ files: mockFiles })

      expect(mockApiService.post).toHaveBeenCalledWith(URLs.vaultOperationsSigned, mockFiles, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    })

    it("should handle multiple files import", async () => {
      const mockFiles = [
        "file1-binary-data",
        "file2-binary-data",
        "file3-binary-data",
        "file4-binary-data",
      ]
      mockApiService.post.mockResolvedValue(undefined)

      await vaultsService.importPreparedOperations({ files: mockFiles })

      expect(mockApiService.post).toHaveBeenCalledWith(URLs.vaultOperationsSigned, mockFiles, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    })

    it("should handle empty files array", async () => {
      const mockFiles: string[] = []
      mockApiService.post.mockResolvedValue(undefined)

      await vaultsService.importPreparedOperations({ files: mockFiles })

      expect(mockApiService.post).toHaveBeenCalledWith(URLs.vaultOperationsSigned, mockFiles, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    })
  })
})
