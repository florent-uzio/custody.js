import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import type { Core_AccountAddressReference } from "../../services/accounts/accounts.types.js"
import { findByAddress, findByAddressOrThrow } from "../accounts.js"

const mockTransport = {
  get: vi.fn(),
  post: vi.fn(),
}

function makeRef(
  overrides: Partial<Core_AccountAddressReference> = {},
): Core_AccountAddressReference {
  return {
    id: "ref-id",
    address: "rAddress123",
    ledgerId: "xrpl-mainnet",
    domainId: "domain-1",
    accountId: "acc-1",
    createdAt: "2025-01-01T00:00:00Z",
    custodyType: "SelfCustody",
    type: "AccountAddressReference",
    ...overrides,
  }
}

describe("findByAddressOrThrow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return the full account address reference when address is found", async () => {
    const ref = makeRef()
    mockTransport.get.mockResolvedValue({ items: [ref] })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123")

    expect(result).toEqual(ref)
    expect(mockTransport.get).toHaveBeenCalledWith("/v1/addresses", undefined, {
      address: "rAddress123",
    })
  })

  it("should throw CustodyError when address is not found", async () => {
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ address: "rOtherAddress", accountId: "acc-2" })],
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
        makeRef({ address: "rAddress111", accountId: "acc-1", ledgerId: "l-1" }),
        makeRef({ address: "rAddress123", accountId: "acc-2", ledgerId: "l-2" }),
        makeRef({ address: "rAddress999", accountId: "acc-3", ledgerId: "l-3" }),
      ],
    })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123")

    expect(result.accountId).toBe("acc-2")
    expect(result.ledgerId).toBe("l-2")
  })

  it("should throw when the address matches on multiple ledgers and no filter is given", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        makeRef({ accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" }),
        makeRef({ accountId: "acc-testnet", ledgerId: "xrpl-testnet" }),
      ],
    })

    await expect(findByAddressOrThrow(mockTransport as any, "rAddress123")).rejects.toThrow(
      CustodyError,
    )
    await expect(findByAddressOrThrow(mockTransport as any, "rAddress123")).rejects.toThrow(
      "Multiple accounts found for address rAddress123. Please specify ledgerId and/or domainId to disambiguate.",
    )
  })

  it("should disambiguate by ledgerId when multiple matches exist", async () => {
    const testnetRef = makeRef({ accountId: "acc-testnet", ledgerId: "xrpl-testnet" })
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" }), testnetRef],
    })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123", {
      ledgerId: "xrpl-testnet",
    })

    expect(result).toEqual(testnetRef)
  })

  it("should disambiguate by domainId when multiple matches exist", async () => {
    const domainBRef = makeRef({ accountId: "acc-b", domainId: "domain-b" })
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ accountId: "acc-a", domainId: "domain-a" }), domainBRef],
    })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123", {
      domainId: "domain-b",
    })

    expect(result).toEqual(domainBRef)
  })

  it("should disambiguate by both ledgerId and domainId combined", async () => {
    const target = makeRef({
      accountId: "acc-target",
      ledgerId: "xrpl-testnet",
      domainId: "domain-b",
    })
    mockTransport.get.mockResolvedValue({
      items: [
        makeRef({ accountId: "acc-1", ledgerId: "xrpl-mainnet", domainId: "domain-a" }),
        makeRef({ accountId: "acc-2", ledgerId: "xrpl-testnet", domainId: "domain-a" }),
        makeRef({ accountId: "acc-3", ledgerId: "xrpl-mainnet", domainId: "domain-b" }),
        target,
      ],
    })

    const result = await findByAddressOrThrow(mockTransport as any, "rAddress123", {
      ledgerId: "xrpl-testnet",
      domainId: "domain-b",
    })

    expect(result).toEqual(target)
  })

  it("should throw with ledger suffix when ledgerId is given but no match is found", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeRef({ ledgerId: "xrpl-mainnet" })] })

    await expect(
      findByAddressOrThrow(mockTransport as any, "rAddress123", { ledgerId: "xrpl-testnet" }),
    ).rejects.toThrow("Account not found for address rAddress123 on ledger xrpl-testnet")
  })

  it("should throw with domain suffix when domainId is given but no match is found", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeRef({ domainId: "domain-a" })] })

    await expect(
      findByAddressOrThrow(mockTransport as any, "rAddress123", { domainId: "domain-b" }),
    ).rejects.toThrow("Account not found for address rAddress123 in domain domain-b")
  })

  it("should throw with both suffixes when both filters are given but no match is found", async () => {
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ ledgerId: "xrpl-mainnet", domainId: "domain-a" })],
    })

    await expect(
      findByAddressOrThrow(mockTransport as any, "rAddress123", {
        ledgerId: "xrpl-testnet",
        domainId: "domain-b",
      }),
    ).rejects.toThrow(
      "Account not found for address rAddress123 on ledger xrpl-testnet in domain domain-b",
    )
  })
})

describe("findByAddress", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return the full account address reference on a single match", async () => {
    const ref = makeRef()
    mockTransport.get.mockResolvedValue({ items: [ref] })

    const result = await findByAddress(mockTransport as any, "rAddress123")

    expect(result).toEqual(ref)
  })

  it("should return undefined when items array is empty", async () => {
    mockTransport.get.mockResolvedValue({ items: [] })

    const result = await findByAddress(mockTransport as any, "rAddress123")

    expect(result).toBeUndefined()
  })

  it("should return undefined when no items match the address", async () => {
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ address: "rOtherAddress", accountId: "acc-2" })],
    })

    const result = await findByAddress(mockTransport as any, "rAddress123")

    expect(result).toBeUndefined()
  })

  it("should still throw on ambiguous matches without filters", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        makeRef({ accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" }),
        makeRef({ accountId: "acc-testnet", ledgerId: "xrpl-testnet" }),
      ],
    })

    await expect(findByAddress(mockTransport as any, "rAddress123")).rejects.toThrow(CustodyError)
    await expect(findByAddress(mockTransport as any, "rAddress123")).rejects.toThrow(
      "Multiple accounts found for address rAddress123. Please specify ledgerId and/or domainId to disambiguate.",
    )
  })

  it("should return the disambiguated match when ledgerId is given", async () => {
    const testnetRef = makeRef({ accountId: "acc-testnet", ledgerId: "xrpl-testnet" })
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" }), testnetRef],
    })

    const result = await findByAddress(mockTransport as any, "rAddress123", {
      ledgerId: "xrpl-testnet",
    })

    expect(result).toEqual(testnetRef)
  })

  it("should return the disambiguated match when domainId is given", async () => {
    const domainBRef = makeRef({ accountId: "acc-b", domainId: "domain-b" })
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ accountId: "acc-a", domainId: "domain-a" }), domainBRef],
    })

    const result = await findByAddress(mockTransport as any, "rAddress123", {
      domainId: "domain-b",
    })

    expect(result).toEqual(domainBRef)
  })

  it("should return undefined when ledgerId is given but no entry matches that ledger", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeRef({ ledgerId: "xrpl-mainnet" })] })

    const result = await findByAddress(mockTransport as any, "rAddress123", {
      ledgerId: "xrpl-testnet",
    })

    expect(result).toBeUndefined()
  })

  it("should return undefined when domainId is given but no entry matches that domain", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeRef({ domainId: "domain-a" })] })

    const result = await findByAddress(mockTransport as any, "rAddress123", {
      domainId: "domain-b",
    })

    expect(result).toBeUndefined()
  })
})
