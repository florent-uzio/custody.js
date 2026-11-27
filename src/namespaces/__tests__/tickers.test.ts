import { beforeEach, describe, expect, it, vi } from "vitest"

import { CustodyError } from "../../models/index.js"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { findByXrplIou, findByXrplMptIssuanceId, findXrplNative } from "../tickers.js"
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

const ISSUER = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
const RLUSD_HEX = "524C555344000000000000000000000000000000"

/** An XRPL IOU (`FungibleToken`) ticker for `currencyCode` issued by `issuer`. */
const iou = (currencyCode: string, issuer = ISSUER, id = `ticker-${currencyCode}`) =>
  makeTicker({
    id,
    ledgerDetails: { type: "XRPL", properties: { type: "FungibleToken", currencyCode, issuer } },
  })

describe("findByXrplIou", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("matches a ticker stored with the hex code when given the text code", async () => {
    const rlusd = iou(RLUSD_HEX)
    mockTransport.get.mockResolvedValue({ items: [makeTicker(), rlusd] })

    const result = await findByXrplIou(mockTransport, "RLUSD", ISSUER, { ledgerId: LEDGER })

    expect(result).toEqual(rlusd.data)
  })

  it("matches a ticker stored with the text code when given the hex code", async () => {
    const rlusd = iou("RLUSD")
    mockTransport.get.mockResolvedValue({ items: [rlusd] })

    const result = await findByXrplIou(mockTransport, RLUSD_HEX, ISSUER, { ledgerId: LEDGER })

    expect(result).toEqual(rlusd.data)
  })

  it("matches a standard 3-character code against its 160-bit hex form", async () => {
    const usd = iou("0000000000000000000000005553440000000000")
    mockTransport.get.mockResolvedValue({ items: [usd] })

    expect(await findByXrplIou(mockTransport, "USD", ISSUER, { ledgerId: LEDGER })).toEqual(
      usd.data,
    )
  })

  it("does not match the same code from another issuer", async () => {
    mockTransport.get.mockResolvedValue({ items: [iou("RLUSD", "rOtherIssuer")] })

    expect(await findByXrplIou(mockTransport, "RLUSD", ISSUER, { ledgerId: LEDGER })).toBe(
      undefined,
    )
  })

  it("throws when two tickers claim the same currency and issuer", async () => {
    mockTransport.get.mockResolvedValue({
      items: [iou("RLUSD", ISSUER, "t-a"), iou(RLUSD_HEX, ISSUER, "t-b")],
    })

    await expect(
      findByXrplIou(mockTransport, "RLUSD", ISSUER, { ledgerId: LEDGER }),
    ).rejects.toThrow(CustodyError)
  })

  it("finds a match on a later page, filtering by ledger server-side", async () => {
    const rlusd = iou(RLUSD_HEX)
    mockTransport.get
      .mockResolvedValueOnce({ items: [makeTicker()], nextStartingAfter: "ticker-1" })
      .mockResolvedValueOnce({ items: [rlusd] })

    expect(await findByXrplIou(mockTransport, "RLUSD", ISSUER, { ledgerId: LEDGER })).toEqual(
      rlusd.data,
    )
    expect(mockTransport.get).toHaveBeenNthCalledWith(2, "/v1/tickers", undefined, {
      ledgerId: [LEDGER],
      limit: 100,
      startingAfter: "ticker-1",
    })
  })

  it("throws on a duplicate that only becomes visible across pages", async () => {
    mockTransport.get
      .mockResolvedValueOnce({ items: [iou("RLUSD", ISSUER, "t-a")], nextStartingAfter: "t-a" })
      .mockResolvedValueOnce({ items: [iou(RLUSD_HEX, ISSUER, "t-b")] })

    await expect(
      findByXrplIou(mockTransport, "RLUSD", ISSUER, { ledgerId: LEDGER }),
    ).rejects.toThrow(CustodyError)
  })

  it("keeps a 3-character non-ASCII code as a non-standard (hex) code", async () => {
    const euros = iou("E282ACE282ACE282AC0000000000000000000000")
    mockTransport.get.mockResolvedValue({ items: [euros] })

    expect(await findByXrplIou(mockTransport, "€€€", ISSUER, { ledgerId: LEDGER })).toEqual(
      euros.data,
    )
  })

  it.each([
    ["XRP", "is not an IOU"],
    ["0000000000000000000000005852500000000000", "is not an IOU"],
    ["0000000000000000000000000000000000000000", "is not an IOU"],
    ["", "Invalid currency code"],
    ["A_CODE_LONGER_THAN_20_BYTES", "Invalid currency code"],
  ])("rejects %j before any request", async (code, message) => {
    await expect(findByXrplIou(mockTransport, code, ISSUER, { ledgerId: LEDGER })).rejects.toThrow(
      message,
    )
    expect(mockTransport.get).not.toHaveBeenCalled()
  })
})

/** The ledger's native XRP ticker. */
const native = (id = "ticker-xrp") =>
  makeTicker({
    id,
    kind: "Native",
    ledgerDetails: { type: "XRPL", properties: { type: "Native" } },
  })

describe("findXrplNative", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the ledger's XRP ticker among its tokens", async () => {
    const xrp = native()
    mockTransport.get.mockResolvedValue({ items: [makeTicker(), iou("RLUSD"), xrp] })

    expect(await findXrplNative(mockTransport, { ledgerId: LEDGER })).toEqual(xrp.data)
    expect(mockTransport.get).toHaveBeenCalledWith("/v1/tickers", undefined, {
      ledgerId: [LEDGER],
      limit: 100,
      startingAfter: undefined,
    })
  })

  it("returns undefined when custody tracks no XRP ticker on the ledger", async () => {
    mockTransport.get.mockResolvedValue({ items: [makeTicker()] })

    expect(await findXrplNative(mockTransport, { ledgerId: LEDGER })).toBe(undefined)
  })

  it("throws when two XRP tickers exist on the ledger", async () => {
    mockTransport.get.mockResolvedValue({ items: [native("x-1"), native("x-2")] })

    await expect(findXrplNative(mockTransport, { ledgerId: LEDGER })).rejects.toThrow(CustodyError)
  })
})
