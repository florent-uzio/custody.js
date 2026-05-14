import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { findByAddress, findByAddressOrThrow } from "../accounts.js"

const mockTransport = {
  get: vi.fn(),
  post: vi.fn(),
}

describe("findByAddressOrThrow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return account reference when address is found", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        {
          address: "rAddress123",
          accountId: "acc-1",
          ledgerId: "xrpl-mainnet",
        },
      ],
    })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123")

    expect(result).toEqual({
      accountId: "acc-1",
      ledgerId: "xrpl-mainnet",
      address: "rAddress123",
    })
    expect(mockTransport.get).toHaveBeenCalledWith("/v1/addresses", undefined, {
      address: "rAddress123",
    })
  })

  it("should return empty string for ledgerId when ledgerId is null", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        {
          address: "rAddress123",
          accountId: "acc-1",
          ledgerId: null,
        },
      ],
    })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123")

    expect(result.ledgerId).toBe("")
  })

  it("should throw CustodyError when address is not found", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        {
          address: "rOtherAddress",
          accountId: "acc-2",
          ledgerId: "xrpl-mainnet",
        },
      ],
    })

    await expect(findByAddressOrThrow(mockTransport as any, "rAddress123")).rejects.toThrow(
      CustodyError,
    )
    await expect(findByAddressOrThrow(mockTransport as any, "rAddress123")).rejects.toThrow(
      "Account not found for address rAddress123",
    )
  })

  it("should throw CustodyError when items array is empty", async () => {
    mockTransport.get.mockResolvedValue({ items: [] })

    await expect(findByAddressOrThrow(mockTransport as any, "rAddress123")).rejects.toThrow(
      CustodyError,
    )
  })

  it("should find exact match among multiple addresses", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        { address: "rAddress111", accountId: "acc-1", ledgerId: "l-1" },
        { address: "rAddress123", accountId: "acc-2", ledgerId: "l-2" },
        { address: "rAddress999", accountId: "acc-3", ledgerId: "l-3" },
      ],
    })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123")

    expect(result.accountId).toBe("acc-2")
    expect(result.ledgerId).toBe("l-2")
  })

  it("should throw when the address matches on multiple ledgers and no ledgerId is given", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        { address: "rAddress123", accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" },
        { address: "rAddress123", accountId: "acc-testnet", ledgerId: "xrpl-testnet" },
      ],
    })

    await expect(findByAddressOrThrow(mockTransport as any, "rAddress123")).rejects.toThrow(
      CustodyError,
    )
    await expect(findByAddressOrThrow(mockTransport as any, "rAddress123")).rejects.toThrow(
      "Multiple accounts found for address rAddress123. Please specify ledgerId to disambiguate.",
    )
  })

  it("should disambiguate by ledgerId when multiple matches exist", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        { address: "rAddress123", accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" },
        { address: "rAddress123", accountId: "acc-testnet", ledgerId: "xrpl-testnet" },
      ],
    })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123", "xrpl-testnet")

    expect(result).toEqual({
      accountId: "acc-testnet",
      ledgerId: "xrpl-testnet",
      address: "rAddress123",
    })
  })

  it("should throw with ledger suffix when ledgerId is given but no match is found", async () => {
    mockTransport.get.mockResolvedValue({
      items: [{ address: "rAddress123", accountId: "acc-1", ledgerId: "xrpl-mainnet" }],
    })

    await expect(
      findByAddressOrThrow(mockTransport as any, "rAddress123", "xrpl-testnet"),
    ).rejects.toThrow("Account not found for address rAddress123 on ledger xrpl-testnet")
  })
})

describe("findByAddress", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return account reference on a single match", async () => {
    mockTransport.get.mockResolvedValue({
      items: [{ address: "rAddress123", accountId: "acc-1", ledgerId: "xrpl-mainnet" }],
    })

    const result = await findByAddress(mockTransport as any, "rAddress123")

    expect(result).toEqual({
      accountId: "acc-1",
      ledgerId: "xrpl-mainnet",
      address: "rAddress123",
    })
  })

  it("should return undefined when items array is empty", async () => {
    mockTransport.get.mockResolvedValue({ items: [] })

    const result = await findByAddress(mockTransport as any, "rAddress123")

    expect(result).toBeUndefined()
  })

  it("should return undefined when no items match the address", async () => {
    mockTransport.get.mockResolvedValue({
      items: [{ address: "rOtherAddress", accountId: "acc-2", ledgerId: "xrpl-mainnet" }],
    })

    const result = await findByAddress(mockTransport as any, "rAddress123")

    expect(result).toBeUndefined()
  })

  it("should still throw on ambiguous matches without ledgerId", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        { address: "rAddress123", accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" },
        { address: "rAddress123", accountId: "acc-testnet", ledgerId: "xrpl-testnet" },
      ],
    })

    await expect(findByAddress(mockTransport as any, "rAddress123")).rejects.toThrow(CustodyError)
    await expect(findByAddress(mockTransport as any, "rAddress123")).rejects.toThrow(
      "Multiple accounts found for address rAddress123. Please specify ledgerId to disambiguate.",
    )
  })

  it("should return the disambiguated match when ledgerId is given", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        { address: "rAddress123", accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" },
        { address: "rAddress123", accountId: "acc-testnet", ledgerId: "xrpl-testnet" },
      ],
    })

    const result = await findByAddress(mockTransport as any, "rAddress123", "xrpl-testnet")

    expect(result).toEqual({
      accountId: "acc-testnet",
      ledgerId: "xrpl-testnet",
      address: "rAddress123",
    })
  })

  it("should return undefined when ledgerId is given but no entry matches that ledger", async () => {
    mockTransport.get.mockResolvedValue({
      items: [{ address: "rAddress123", accountId: "acc-1", ledgerId: "xrpl-mainnet" }],
    })

    const result = await findByAddress(mockTransport as any, "rAddress123", "xrpl-testnet")

    expect(result).toBeUndefined()
  })
})
