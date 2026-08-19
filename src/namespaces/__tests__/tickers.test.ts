import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { findByXrplMptIssuanceId } from "../tickers.js"
import type { Core_ApiTicker, Core_ApiTickerData } from "../tickers.types.js"

const mockTransport = createFakeTransport()

const LEDGER = "xrpl-testnet-august-2024"
const ISSUANCE = "00000AA1"

/** A `Core_ApiTicker` whose `data` half carries the XRPL properties under test. */
function makeTicker(data: Partial<Core_ApiTickerData> = {}): Core_ApiTicker {
  const merged: Core_ApiTickerData = {
    id: "ticker-1",
    ledgerId: LEDGER,
    kind: "Token",
    name: "MMF",
    decimals: 2,
    lock: "Unlocked",
    ledgerDetails: {
      type: "XRPL",
      properties: { type: "MultiPurposeToken", issuanceId: ISSUANCE },
    },
    ...data,
  }

  // The top-level fields are deprecated twins of `data`; they exist on the wire
  // and are deliberately not what `findByXrplMptIssuanceId` reads.
  return {
    id: merged.id,
    ledgerId: merged.ledgerId,
    kind: merged.kind,
    name: merged.name,
    decimals: merged.decimals,
    ledgerDetails: merged.ledgerDetails,
    data: merged,
  }
}

const confidential = (overrides: Partial<Core_ApiTickerData> = {}) =>
  makeTicker({
    id: "ticker-conf",
    ledgerDetails: {
      type: "XRPL",
      properties: { type: "ConfidentialMultiPurposeToken", issuanceId: ISSUANCE },
    },
    ...overrides,
  })

describe("findByXrplMptIssuanceId", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return both halves as the `data` payload, not the deprecated item", async () => {
    const pub = makeTicker()
    const conf = confidential()
    mockTransport.get.mockResolvedValue({ items: [pub, conf] })

    const result = await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })

    expect(result).toEqual({ public: pub.data, confidential: conf.data })
  })

  it("should narrow on the ledger server-side and page 100 at a time", async () => {
    mockTransport.get.mockResolvedValue({ items: [] })

    await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })

    expect(mockTransport.get).toHaveBeenCalledWith("/v1/tickers", undefined, {
      ledgerId: [LEDGER],
      limit: 100,
      startingAfter: undefined,
    })
  })

  it("should omit the confidential half for a plain MPT issuance", async () => {
    // The common case: most issuances are not confidential, so absence is the
    // answer as of this call rather than a value still to arrive on its own.
    mockTransport.get.mockResolvedValue({ items: [makeTicker()] })

    const result = await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })

    expect(result.public).toBeDefined()
    expect(result.confidential).toBeUndefined()
  })

  it("should return the confidential half alone when custody tracks no plain ticker", async () => {
    // Neither half implies the other, so a lone confidential ticker is returned
    // on its own rather than suppressed for want of a public counterpart.
    const conf = confidential()
    mockTransport.get.mockResolvedValue({ items: [conf] })

    const result = await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })

    expect(result).toEqual({ confidential: conf.data })
  })

  it("should return an empty result when no ticker claims the issuance", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        makeTicker({
          ledgerDetails: {
            type: "XRPL",
            properties: { type: "MultiPurposeToken", issuanceId: "0000BBB2" },
          },
        }),
      ],
    })

    expect(await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })).toEqual({})
  })

  it("should ignore XRPL tickers that carry no issuance ID", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        makeTicker({
          ledgerDetails: { type: "XRPL", properties: { type: "Native" } },
        }),
        makeTicker({
          ledgerDetails: {
            type: "XRPL",
            properties: { type: "FungibleToken", currencyCode: "USD", issuer: "rIssuer" },
          },
        }),
      ],
    })

    expect(await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })).toEqual({})
  })

  it("should ignore tickers from another ledger family", async () => {
    mockTransport.get.mockResolvedValue({
      items: [
        makeTicker({
          // Same id, carried by a non-XRPL ticker: matched on `mint` rather than
          // on an XRPL issuance, so it must not be picked up.
          ledgerDetails: {
            type: "Solana",
            properties: { type: "Token", mint: ISSUANCE, tokenType: "SPL" },
          },
        }),
      ],
    })

    expect(await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })).toEqual({})
  })

  it("should find a half on a later page instead of reporting it missing", async () => {
    // The confidential ticker sorts onto a later page than the public one, so
    // reading a single page would report a confidential issuance as public-only
    // — indistinguishable from an issuance that is genuinely not confidential.
    const conf = confidential()
    mockTransport.get
      .mockResolvedValueOnce({ items: [makeTicker()], nextStartingAfter: "cursor-1" })
      .mockResolvedValueOnce({ items: [conf] })

    const result = await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })

    expect(result.confidential).toEqual(conf.data)
    expect(mockTransport.get).toHaveBeenLastCalledWith("/v1/tickers", undefined, {
      ledgerId: [LEDGER],
      limit: 100,
      startingAfter: "cursor-1",
    })
  })

  it("should throw on a duplicate that only becomes visible across pages", async () => {
    mockTransport.get
      .mockResolvedValueOnce({ items: [makeTicker()], nextStartingAfter: "cursor-1" })
      .mockResolvedValueOnce({ items: [makeTicker({ id: "ticker-2" })] })

    const found = findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })

    await expect(found).rejects.toThrow(CustodyError)
    await expect(found).rejects.toThrow(
      `Multiple MultiPurposeToken tickers found for XRPL MPT issuance ${ISSUANCE} on ledger ${LEDGER} (ticker-1 and ticker-2).`,
    )
  })

  it("should keep paging after both halves are found, so duplicates are not missed", async () => {
    mockTransport.get
      .mockResolvedValueOnce({
        items: [makeTicker(), confidential()],
        nextStartingAfter: "cursor-1",
      })
      .mockResolvedValueOnce({ items: [] })

    await findByXrplMptIssuanceId(mockTransport, ISSUANCE, { ledgerId: LEDGER })

    expect(mockTransport.get).toHaveBeenCalledTimes(2)
  })
})
