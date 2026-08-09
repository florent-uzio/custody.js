import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { createAccounts, findByAddress, findByAddressOrThrow } from "../accounts.js"
import type { Core_AccountAddressReference } from "../accounts.types.js"

vi.mock("../../helpers/index.js", async () => {
  const actual = await vi.importActual("../../helpers/index.js")
  return {
    ...actual,
    sleep: vi.fn(() => Promise.resolve()),
  }
})

const mockTransport = createFakeTransport()

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

    const result = await findByAddressOrThrow(mockTransport, "rAddress123")

    expect(result).toEqual(ref)
    expect(mockTransport.get).toHaveBeenCalledWith("/v1/addresses", undefined, {
      address: "rAddress123",
    })
  })

  it("should throw CustodyError when address is not found", async () => {
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ address: "rOtherAddress", accountId: "acc-2" })],
    })

    await expect(findByAddressOrThrow(mockTransport, "rAddress123")).rejects.toThrow(CustodyError)
    await expect(findByAddressOrThrow(mockTransport, "rAddress123")).rejects.toThrow(
      "Account not found for address rAddress123",
    )
  })

  it("should throw CustodyError when items array is empty", async () => {
    mockTransport.get.mockResolvedValue({ items: [] })

    await expect(findByAddressOrThrow(mockTransport, "rAddress123")).rejects.toThrow(CustodyError)
  })

  it("should find exact match among multiple addresses", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        makeRef({ address: "rAddress111", accountId: "acc-1", ledgerId: "l-1" }),
        makeRef({ address: "rAddress123", accountId: "acc-2", ledgerId: "l-2" }),
        makeRef({ address: "rAddress999", accountId: "acc-3", ledgerId: "l-3" }),
      ],
    })

    const result = await findByAddressOrThrow(mockTransport, "rAddress123")

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

    await expect(findByAddressOrThrow(mockTransport, "rAddress123")).rejects.toThrow(CustodyError)
    await expect(findByAddressOrThrow(mockTransport, "rAddress123")).rejects.toThrow(
      "Multiple accounts found for address rAddress123. Please specify ledgerId and/or domainId to disambiguate.",
    )
  })

  it("should disambiguate by ledgerId when multiple matches exist", async () => {
    const testnetRef = makeRef({ accountId: "acc-testnet", ledgerId: "xrpl-testnet" })
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" }), testnetRef],
    })

    const result = await findByAddressOrThrow(mockTransport, "rAddress123", {
      ledgerId: "xrpl-testnet",
    })

    expect(result).toEqual(testnetRef)
  })

  it("should disambiguate by domainId when multiple matches exist", async () => {
    const domainBRef = makeRef({ accountId: "acc-b", domainId: "domain-b" })
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ accountId: "acc-a", domainId: "domain-a" }), domainBRef],
    })

    const result = await findByAddressOrThrow(mockTransport, "rAddress123", {
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

    const result = await findByAddressOrThrow(mockTransport, "rAddress123", {
      ledgerId: "xrpl-testnet",
      domainId: "domain-b",
    })

    expect(result).toEqual(target)
  })

  it("should throw with ledger suffix when ledgerId is given but no match is found", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeRef({ ledgerId: "xrpl-mainnet" })] })

    await expect(
      findByAddressOrThrow(mockTransport, "rAddress123", { ledgerId: "xrpl-testnet" }),
    ).rejects.toThrow("Account not found for address rAddress123 on ledger xrpl-testnet")
  })

  it("should throw with domain suffix when domainId is given but no match is found", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeRef({ domainId: "domain-a" })] })

    await expect(
      findByAddressOrThrow(mockTransport, "rAddress123", { domainId: "domain-b" }),
    ).rejects.toThrow("Account not found for address rAddress123 in domain domain-b")
  })

  it("should throw with both suffixes when both filters are given but no match is found", async () => {
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ ledgerId: "xrpl-mainnet", domainId: "domain-a" })],
    })

    await expect(
      findByAddressOrThrow(mockTransport, "rAddress123", {
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

    const result = await findByAddress(mockTransport, "rAddress123")

    expect(result).toEqual(ref)
  })

  it("should return undefined when items array is empty", async () => {
    mockTransport.get.mockResolvedValue({ items: [] })

    const result = await findByAddress(mockTransport, "rAddress123")

    expect(result).toBeUndefined()
  })

  it("should return undefined when no items match the address", async () => {
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ address: "rOtherAddress", accountId: "acc-2" })],
    })

    const result = await findByAddress(mockTransport, "rAddress123")

    expect(result).toBeUndefined()
  })

  it("should still throw on ambiguous matches without filters", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        makeRef({ accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" }),
        makeRef({ accountId: "acc-testnet", ledgerId: "xrpl-testnet" }),
      ],
    })

    await expect(findByAddress(mockTransport, "rAddress123")).rejects.toThrow(CustodyError)
    await expect(findByAddress(mockTransport, "rAddress123")).rejects.toThrow(
      "Multiple accounts found for address rAddress123. Please specify ledgerId and/or domainId to disambiguate.",
    )
  })

  it("should return the disambiguated match when ledgerId is given", async () => {
    const testnetRef = makeRef({ accountId: "acc-testnet", ledgerId: "xrpl-testnet" })
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ accountId: "acc-mainnet", ledgerId: "xrpl-mainnet" }), testnetRef],
    })

    const result = await findByAddress(mockTransport, "rAddress123", {
      ledgerId: "xrpl-testnet",
    })

    expect(result).toEqual(testnetRef)
  })

  it("should return the disambiguated match when domainId is given", async () => {
    const domainBRef = makeRef({ accountId: "acc-b", domainId: "domain-b" })
    mockTransport.get.mockResolvedValue({
      items: [makeRef({ accountId: "acc-a", domainId: "domain-a" }), domainBRef],
    })

    const result = await findByAddress(mockTransport, "rAddress123", {
      domainId: "domain-b",
    })

    expect(result).toEqual(domainBRef)
  })

  it("should return undefined when ledgerId is given but no entry matches that ledger", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeRef({ ledgerId: "xrpl-mainnet" })] })

    const result = await findByAddress(mockTransport, "rAddress123", {
      ledgerId: "xrpl-testnet",
    })

    expect(result).toBeUndefined()
  })

  it("should return undefined when domainId is given but no entry matches that domain", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeRef({ domainId: "domain-a" })] })

    const result = await findByAddress(mockTransport, "rAddress123", {
      domainId: "domain-b",
    })

    expect(result).toBeUndefined()
  })
})

describe("forceUpdateAccountBalances", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should POST to the balances/refresh URL with an undefined body and merged path+query params", async () => {
    const accounts = createAccounts(mockTransport)

    await accounts.forceUpdateAccountBalances(
      { domainId: "d", accountId: "a" },
      { ledgerId: "xrpl" },
    )

    expect(mockTransport.post).toHaveBeenCalledWith(
      "/v1/domains/{domainId}/accounts/{accountId}/balances/refresh",
      undefined,
      { domainId: "d", accountId: "a", ledgerId: "xrpl" },
    )
  })

  it("should merge only path params into pathParams when no query is given", async () => {
    const accounts = createAccounts(mockTransport)

    await accounts.forceUpdateAccountBalances({ domainId: "d", accountId: "a" })

    expect(mockTransport.post).toHaveBeenCalledWith(
      "/v1/domains/{domainId}/accounts/{accountId}/balances/refresh",
      undefined,
      { domainId: "d", accountId: "a" },
    )
  })
})

describe("generateNewExternalAddressDeprecated", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should POST to the addresses URL with an undefined body and merged path+query params", async () => {
    const accounts = createAccounts(mockTransport)

    await accounts.generateNewExternalAddressDeprecated(
      { domainId: "d", accountId: "a" },
      { ledgerId: "xrpl" },
    )

    expect(mockTransport.post).toHaveBeenCalledWith(
      "/v1/domains/{domainId}/accounts/{accountId}/addresses",
      undefined,
      { domainId: "d", accountId: "a", ledgerId: "xrpl" },
    )
  })
})

const PARAMETERS_STATUS_URL =
  "/v1/domains/{domainId}/accounts/{accountId}/parameters-compute/{computeId}"
const PARAMETERS_COMPUTE_URL = "/v1/domains/{domainId}/accounts/{accountId}/parameters-compute"
const cryptographicFields = { zkProof: "DEADBEEF" }

describe("getParametersComputeStatusAndWait", () => {
  const params = { domainId: "d-1", accountId: "a-1", computeId: "c-1" }
  let accounts: ReturnType<typeof createAccounts>

  beforeEach(() => {
    vi.clearAllMocks()
    accounts = createAccounts(mockTransport)
  })

  it("should return immediately when the computation is already Completed", async () => {
    const compute = { id: "c-1", status: "Completed", cryptographicFields }
    mockTransport.get.mockResolvedValue(compute)

    const result = await accounts.getParametersComputeStatusAndWait(params)

    expect(result).toEqual({
      status: "Completed",
      isTerminal: true,
      isSuccess: true,
      compute,
    })
    expect(mockTransport.get).toHaveBeenCalledWith(PARAMETERS_STATUS_URL, params)
  })

  it("should return isSuccess false for Failed status", async () => {
    mockTransport.get.mockResolvedValue({ id: "c-1", status: "Failed" })

    const result = await accounts.getParametersComputeStatusAndWait(params)

    expect(result.isTerminal).toBe(true)
    expect(result.isSuccess).toBe(false)
    expect(result.status).toBe("Failed")
  })

  it("should poll through Pending and Preparing until terminal", async () => {
    mockTransport.get
      .mockResolvedValueOnce({ id: "c-1", status: "Pending" })
      .mockResolvedValueOnce({ id: "c-1", status: "Preparing" })
      .mockResolvedValueOnce({ id: "c-1", status: "Completed", cryptographicFields })

    const result = await accounts.getParametersComputeStatusAndWait(params, { maxRetries: 5 })

    expect(result.isSuccess).toBe(true)
    expect(result.compute.cryptographicFields).toEqual(cryptographicFields)
    expect(mockTransport.get).toHaveBeenCalledTimes(3)
  })

  it("should return a non-terminal result when max retries are exceeded", async () => {
    mockTransport.get.mockResolvedValue({ id: "c-1", status: "Preparing" })

    const result = await accounts.getParametersComputeStatusAndWait(params, { maxRetries: 2 })

    // 2 attempts in the polling loop, no extra fetch afterwards
    expect(mockTransport.get).toHaveBeenCalledTimes(2)
    expect(result.isTerminal).toBe(false)
    expect(result.isSuccess).toBe(false)
    expect(result.status).toBe("Preparing")
  })

  it("should call onStatusCheck on each attempt", async () => {
    const onStatusCheck = vi.fn()
    mockTransport.get
      .mockResolvedValueOnce({ id: "c-1", status: "Pending" })
      .mockResolvedValueOnce({ id: "c-1", status: "Completed", cryptographicFields })

    await accounts.getParametersComputeStatusAndWait(params, { onStatusCheck })

    expect(onStatusCheck).toHaveBeenCalledWith("Pending", 1)
    expect(onStatusCheck).toHaveBeenCalledWith("Completed", 2)
  })

  it("should keep polling through 404s until the computation materializes", async () => {
    const notFoundError = new CustodyError({ reason: "Not found" }, 404)
    mockTransport.get
      .mockRejectedValueOnce(notFoundError)
      .mockRejectedValueOnce(notFoundError)
      .mockResolvedValueOnce({ id: "c-1", status: "Completed", cryptographicFields })

    const result = await accounts.getParametersComputeStatusAndWait(params, { maxRetries: 10 })

    expect(result.isSuccess).toBe(true)
    expect(mockTransport.get).toHaveBeenCalledTimes(3)
  })

  it("should throw 404 when the computation never materializes", async () => {
    mockTransport.get.mockRejectedValue(new CustodyError({ reason: "Not found" }, 404))

    await expect(
      accounts.getParametersComputeStatusAndWait(params, { maxRetries: 2 }),
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it("should throw non-404 errors immediately", async () => {
    mockTransport.get.mockRejectedValue(new CustodyError({ reason: "Server error" }, 500))

    await expect(accounts.getParametersComputeStatusAndWait(params)).rejects.toThrow("Server error")
    expect(mockTransport.get).toHaveBeenCalledTimes(1)
  })
})

describe("initiateParametersCompute", () => {
  const params = { domainId: "d-1", accountId: "a-1" }
  const body = {
    tokenIdentifier: { issuanceId: "mpt-1" },
    amount: "100",
    destination: "rDestination",
    ledgerId: "xrpl",
  } as Parameters<ReturnType<typeof createAccounts>["initiateParametersCompute"]>[1]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should inject the type discriminator the API requires", async () => {
    const accounts = createAccounts(mockTransport)
    mockTransport.post.mockResolvedValue({ id: "c-1", status: "Pending" })

    await accounts.initiateParametersCompute(params, body)

    expect(mockTransport.post).toHaveBeenCalledWith(
      PARAMETERS_COMPUTE_URL,
      { ...body, type: "cmpt-send" },
      params,
      { sign: false },
    )
  })
})

describe("initiateParametersComputeAndWait", () => {
  const params = { domainId: "d-1", accountId: "a-1" }
  const body = {
    tokenIdentifier: { issuanceId: "mpt-1" },
    amount: "100",
    destination: "rDestination",
    ledgerId: "xrpl",
  } as Parameters<ReturnType<typeof createAccounts>["initiateParametersComputeAndWait"]>[1]
  let accounts: ReturnType<typeof createAccounts>

  beforeEach(() => {
    vi.clearAllMocks()
    accounts = createAccounts(mockTransport)
  })

  it("should initiate then poll the returned compute id until Completed", async () => {
    mockTransport.post.mockResolvedValue({ id: "c-9", status: "Pending" })
    mockTransport.get
      .mockResolvedValueOnce({ id: "c-9", status: "Preparing" })
      .mockResolvedValueOnce({ id: "c-9", status: "Completed", cryptographicFields })

    const result = await accounts.initiateParametersComputeAndWait(params, body)

    expect(mockTransport.post).toHaveBeenCalledWith(
      PARAMETERS_COMPUTE_URL,
      { ...body, type: "cmpt-send" },
      params,
      { sign: false },
    )
    expect(mockTransport.get).toHaveBeenCalledWith(PARAMETERS_STATUS_URL, {
      ...params,
      computeId: "c-9",
    })
    expect(result.isSuccess).toBe(true)
    expect(result.compute.cryptographicFields).toEqual(cryptographicFields)
  })

  it("should surface a Failed computation without throwing", async () => {
    mockTransport.post.mockResolvedValue({ id: "c-9", status: "Pending" })
    mockTransport.get.mockResolvedValue({ id: "c-9", status: "Failed" })

    const result = await accounts.initiateParametersComputeAndWait(params, body)

    expect(result.isTerminal).toBe(true)
    expect(result.isSuccess).toBe(false)
  })

  it("should keep a caller-supplied type discriminator", async () => {
    mockTransport.post.mockResolvedValue({ id: "c-9", status: "Completed", cryptographicFields })
    mockTransport.get.mockResolvedValue({ id: "c-9", status: "Completed", cryptographicFields })

    await accounts.initiateParametersComputeAndWait(params, { ...body, type: "cmpt-send" })

    expect(mockTransport.post).toHaveBeenCalledWith(
      PARAMETERS_COMPUTE_URL,
      { ...body, type: "cmpt-send" },
      params,
      { sign: false },
    )
  })

  it("should not poll when initiating fails", async () => {
    mockTransport.post.mockRejectedValue(new CustodyError({ reason: "Account not ready" }, 409))

    await expect(accounts.initiateParametersComputeAndWait(params, body)).rejects.toThrow(
      "Account not ready",
    )
    expect(mockTransport.get).not.toHaveBeenCalled()
  })
})
