import { describe, expect, it } from "vitest"
import { CustodyError } from "../../models/custody-error.js"
import type { EDS_Event } from "./channels.types.js"
import { parseEventPayload } from "./parse-event-payload.js"

function edsEvent(inner: unknown): EDS_Event {
  return { payload: JSON.stringify(inner) }
}

describe("parseEventPayload", () => {
  it("parses an IntentExecuted event", () => {
    const inner = {
      domainId: "11111111-1111-1111-1111-111111111111",
      id: "22222222-2222-2222-2222-222222222222",
      sequenceNumber: 42,
      savedAt: "2026-04-23T10:00:00Z",
      payload: {
        id: "33333333-3333-3333-3333-333333333333",
        type: "IntentExecuted",
      },
    }

    const result = parseEventPayload(edsEvent(inner))

    expect(result.id).toBe(inner.id)
    expect(result.sequenceNumber).toBe(42)
    if (result.payload.type !== "IntentExecuted") {
      throw new Error("expected IntentExecuted discriminator")
    }
    expect(result.payload.id).toBe(inner.payload.id)
  })

  it("parses an AccountCreated event", () => {
    const inner = {
      domainId: "11111111-1111-1111-1111-111111111111",
      id: "44444444-4444-4444-4444-444444444444",
      sequenceNumber: 1,
      savedAt: "2026-04-23T10:00:00Z",
      payload: {
        id: "55555555-5555-5555-5555-555555555555",
        type: "AccountCreated",
      },
    }

    const result = parseEventPayload(edsEvent(inner))

    expect(result.payload.type).toBe("AccountCreated")
  })

  it("parses a BalancesUpdated event", () => {
    const inner = {
      domainId: "11111111-1111-1111-1111-111111111111",
      id: "66666666-6666-6666-6666-666666666666",
      sequenceNumber: 7,
      savedAt: "2026-04-23T10:00:00Z",
      payload: {
        accountReference: { type: "AccountAddressReference", accountId: "acc-1" },
        tickerIds: ["XRP"],
        type: "BalancesUpdated",
      },
    }

    const result = parseEventPayload(edsEvent(inner))

    if (result.payload.type !== "BalancesUpdated") {
      throw new Error("expected BalancesUpdated discriminator")
    }
    expect(result.payload.tickerIds).toEqual(["XRP"])
  })

  it("throws CustodyError when payload is missing", () => {
    expect(() => parseEventPayload({})).toThrow(CustodyError)
    expect(() => parseEventPayload({ payload: "" })).toThrow(CustodyError)
  })

  it("throws CustodyError on malformed JSON", () => {
    const event: EDS_Event = { payload: "{not-json" }

    expect(() => parseEventPayload(event)).toThrow(CustodyError)
    try {
      parseEventPayload(event)
    } catch (error) {
      expect(error).toBeInstanceOf(CustodyError)
      expect((error as CustodyError).message).toMatch(/JSON/i)
      expect((error as CustodyError).cause).toBeInstanceOf(SyntaxError)
    }
  })

  it("throws CustodyError when the inner type discriminator is missing", () => {
    const inner = {
      domainId: "d",
      id: "e",
      sequenceNumber: 0,
      savedAt: "t",
      payload: { id: "x" },
    }

    expect(() => parseEventPayload(edsEvent(inner))).toThrow(CustodyError)
  })

  it("throws CustodyError when the inner payload is missing entirely", () => {
    const inner = { domainId: "d", id: "e", sequenceNumber: 0, savedAt: "t" }

    expect(() => parseEventPayload(edsEvent(inner))).toThrow(CustodyError)
  })
})
