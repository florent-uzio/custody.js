import { beforeEach, describe, expect, it, vi } from "vitest"

import { URLs } from "../../constants/urls.js"
import { createFakeTransport } from "../../testing/fake-transport.js"
import type { Core_ProposeIntentBody } from "../intents.types.js"
import { createTransactions } from "../transactions.js"
import type { Core_TransfersCollection } from "../transactions.types.js"
import type { Core_MeReference } from "../users.types.js"

vi.mock("../../helpers/index.js", async () => {
  const actual = await vi.importActual("../../helpers/index.js")
  return {
    ...actual,
    sleep: vi.fn(() => Promise.resolve()),
  }
})

const mockTransport = createFakeTransport()

const me: Core_MeReference = {
  publicKey: "cHVibGlj",
  loginId: { id: "login-1", providerId: "provider-1" },
  domains: [{ id: "d-1", alias: "d-1", userReference: { id: "u-1", alias: "me", roles: [] } }],
}

/** One page of the transfers collection. Only `id` is read off each transfer. */
const page = (ids: string[], nextStartingAfter?: string): Core_TransfersCollection =>
  ({
    items: ids.map((id) => ({ id })),
    count: ids.length,
    ...(nextStartingAfter && { nextStartingAfter }),
  }) as Core_TransfersCollection

/**
 * Routes the fake transport's GETs: `/v1/me` answers the envelope's author
 * lookup, the transfers endpoint answers from `pages`, keyed by the cursor it
 * was asked for (`""` for the first page) and the `tickerId` filter, if any.
 */
function serve(pages: Record<string, Core_TransfersCollection>) {
  mockTransport.get.mockImplementation(async (url: string, _params, query) => {
    if (url === URLs.me) return me
    if (url === URLs.transactionTransfers) {
      const key = `${query?.tickerId ?? ""}|${query?.startingAfter ?? ""}`
      return pages[key] ?? page([])
    }
    throw new Error(`Unexpected GET ${url}`)
  })
  mockTransport.post.mockResolvedValue({ requestId: "r-1" })
}

/** Every transfers query the namespace sent. */
const transferQueries = () =>
  mockTransport.get.mock.calls
    .filter(([url]) => url === URLs.transactionTransfers)
    .map(([, params, query]) => ({ params, query }))

/** The payload of the nth `POST /v1/intents`. */
const proposedPayload = (nth = 0) =>
  (mockTransport.post.mock.calls[nth]?.[1] as Core_ProposeIntentBody).request.payload

describe("transactions.releaseQuarantinedTransfers", () => {
  let transactions: ReturnType<typeof createTransactions>

  beforeEach(() => {
    vi.clearAllMocks()
    mockTransport.get.mockReset()
    mockTransport.post.mockReset()
    transactions = createTransactions(mockTransport)
  })

  it("with `all: true`, releases every quarantined transfer of the account across all pages", async () => {
    serve({ "|": page(["t-1", "t-2"], "t-2"), "|t-2": page(["t-3"]) })

    const result = await transactions.releaseQuarantinedTransfers({
      domainId: "d-1",
      accountId: "a-1",
      all: true,
    })

    expect(transferQueries().map(({ query }) => query)).toEqual([
      { "recipient.accountId": ["a-1"], quarantined: true, limit: 100, startingAfter: undefined },
      { "recipient.accountId": ["a-1"], quarantined: true, limit: 100, startingAfter: "t-2" },
    ])
    expect(transferQueries()[0]?.params).toEqual({ domainId: "d-1" })

    expect(mockTransport.post).toHaveBeenCalledTimes(1)
    expect(proposedPayload()).toEqual({
      type: "v0_ReleaseQuarantinedTransfers",
      accountId: "a-1",
      transferIds: ["t-1", "t-2", "t-3"],
    })
    expect(result).toMatchObject({
      proposed: true,
      transferIds: ["t-1", "t-2", "t-3"],
      requestId: "r-1",
      domainId: "d-1",
    })
  })

  it("with explicit `transferIds`, proposes exactly those without looking transfers up", async () => {
    serve({})

    const result = await transactions.releaseQuarantinedTransfers({
      domainId: "d-1",
      accountId: "a-1",
      transferIds: ["t-9"],
    })

    expect(transferQueries()).toEqual([])
    expect(proposedPayload()).toEqual({
      type: "v0_ReleaseQuarantinedTransfers",
      accountId: "a-1",
      transferIds: ["t-9"],
    })
    expect(result).toMatchObject({ proposed: true, transferIds: ["t-9"] })
  })

  it("proposes nothing when no transfer is quarantined", async () => {
    serve({})

    const result = await transactions.releaseQuarantinedTransfers({
      domainId: "d-1",
      accountId: "a-1",
      all: true,
    })

    expect(mockTransport.post).not.toHaveBeenCalled()
    expect(result).toEqual({ proposed: false, transferIds: [], domainId: "d-1" })
  })

  it("narrows `all: true` to one ticker with `tickerId`", async () => {
    serve({ "tk-1|": page(["t-1"]) })

    const result = await transactions.releaseQuarantinedTransfers({
      domainId: "d-1",
      accountId: "a-1",
      all: true,
      tickerId: "tk-1",
    })

    expect(transferQueries().map(({ query }) => query?.tickerId)).toEqual(["tk-1"])
    expect(result).toMatchObject({ proposed: true, transferIds: ["t-1"] })
  })

  it("rejects a selection with neither `transferIds` nor `all: true` (untyped callers)", async () => {
    serve({})

    await expect(
      transactions.releaseQuarantinedTransfers({ domainId: "d-1", accountId: "a-1" } as never),
    ).rejects.toThrow("either `transferIds` or `all: true`")
    expect(mockTransport.post).not.toHaveBeenCalled()
  })
})

describe("transactions.releaseQuarantinedTransfersAndWait", () => {
  let transactions: ReturnType<typeof createTransactions>

  beforeEach(() => {
    vi.clearAllMocks()
    mockTransport.get.mockReset()
    mockTransport.post.mockReset()
    transactions = createTransactions(mockTransport)
  })

  it("waits for the release intent and reports its outcome with the released transfers", async () => {
    serve({ "|": page(["t-1"]) })
    const getTransfersOrMe = mockTransport.get.getMockImplementation()
    mockTransport.get.mockImplementation(async (url: string, params, query) =>
      url === URLs.getIntent
        ? { data: { id: params.intentId, state: { status: "Executed" } } }
        : getTransfersOrMe?.(url, params, query),
    )

    const result = await transactions.releaseQuarantinedTransfersAndWait({
      domainId: "d-1",
      accountId: "a-1",
      all: true,
    })

    expect(result).toMatchObject({
      proposed: true,
      transferIds: ["t-1"],
      isTerminal: true,
      isSuccess: true,
      status: "Executed",
      requestId: "r-1",
      domainId: "d-1",
    })
  })

  it("does not wait when there is nothing to release", async () => {
    serve({})

    const result = await transactions.releaseQuarantinedTransfersAndWait({
      domainId: "d-1",
      accountId: "a-1",
      all: true,
    })

    expect(result).toEqual({ proposed: false, transferIds: [], domainId: "d-1" })
    expect(mockTransport.get.mock.calls.some(([url]) => url === URLs.getIntent)).toBe(false)
  })
})
