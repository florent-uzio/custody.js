import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { buildDryRunBody, buildTransactionIntent } from "./xrpl.builders.js"
import type { Core_XrplOperation, IntentContext, XrplIntentOptions } from "./xrpl.types.js"

// ── Fixtures ─────────────────────────────────────────────────────
//
// These tests CHARACTERIZE the exact request envelope emitted by the XRPL
// intent builders. `ApiService.post` signs `canonicalize(body.request)`
// (RFC 8785), so key *order* is irrelevant but key *inclusion* is not — a key
// that appears or vanishes changes the server-side signature. The assertions
// below therefore lock which keys are present, especially the conditional
// `description`.

const context: IntentContext = {
  domainId: "domain-123",
  userId: "user-123",
  accountId: "account-123",
  ledgerId: "ledger-123",
  address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
}

const operation: Core_XrplOperation = {
  type: "Payment",
  amount: "1000000",
  destination: { type: "Address", address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH" },
  destinationTag: 0,
}

// Fully explicit options so no uuidv7()/dayjs()/feePriority defaults are
// exercised — the output is deterministic (given a frozen clock).
const optionsNoDescription: XrplIntentOptions = {
  feePriority: "High",
  expiryDays: 3,
  requestId: "fixed-request-id",
  payloadId: "fixed-payload-id",
  requestCustomProperties: { reference: "ref-1" },
  payloadCustomProperties: { note: "note-1" },
}

const explicitOptions: XrplIntentOptions = {
  ...optionsNoDescription,
  description: "human readable description",
}

// With a frozen clock, expiryAt = now + expiryDays.
const expectedExpiryAt = "2026-01-04T00:00:00.000Z"

const expectedPayload = {
  accountId: "account-123",
  customProperties: { note: "note-1" },
  id: "fixed-payload-id",
  ledgerId: "ledger-123",
  parameters: {
    feeStrategy: { priority: "High", type: "Priority" },
    memos: [],
    operation,
    type: "XRPL",
  },
  type: "v0_CreateTransactionOrder",
}

const expectedEnvelope = {
  author: { domainId: "domain-123", id: "user-123" },
  customProperties: { reference: "ref-1" },
  description: "human readable description",
  expiryAt: expectedExpiryAt,
  id: "fixed-request-id",
  payload: expectedPayload,
  targetDomainId: "domain-123",
}

describe("xrpl builders — request envelope characterization", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("buildDryRunBody", () => {
    it("emits the full flat envelope when description is provided", () => {
      const body = buildDryRunBody(operation, context, explicitOptions)
      expect(body).toEqual(expectedEnvelope)
    })

    it("omits the description key entirely when description is absent", () => {
      const body = buildDryRunBody(operation, context, optionsNoDescription)

      expect("description" in body).toBe(false)
      expect(body).toEqual({ ...expectedEnvelope, description: undefined })
    })
  })

  describe("buildTransactionIntent", () => {
    it("wraps the same envelope under `request` with type Propose when description is provided", () => {
      const body = buildTransactionIntent({ operation, context, options: explicitOptions })
      expect(body).toEqual({
        request: { ...expectedEnvelope, type: "Propose" },
      })
    })

    it("omits the description key entirely when description is absent", () => {
      const body = buildTransactionIntent({ operation, context, options: optionsNoDescription })

      expect("description" in body.request).toBe(false)
      expect(body).toEqual({
        request: { ...expectedEnvelope, description: undefined, type: "Propose" },
      })
    })
  })

  describe("defaults", () => {
    it("applies feePriority=Low, empty customProperties, ~1 day expiry, and generated ids", () => {
      const body = buildDryRunBody(operation, context, {})

      // Whole-object assertion avoids narrowing the payload union by hand;
      // `expect.any(String)` covers the uuidv7()-generated ids.
      expect(body).toEqual({
        author: { domainId: "domain-123", id: "user-123" },
        customProperties: {},
        expiryAt: "2026-01-02T00:00:00.000Z",
        id: expect.any(String),
        payload: {
          accountId: "account-123",
          customProperties: {},
          id: expect.any(String),
          ledgerId: "ledger-123",
          parameters: {
            feeStrategy: { priority: "Low", type: "Priority" },
            memos: [],
            operation,
            type: "XRPL",
          },
          type: "v0_CreateTransactionOrder",
        },
        targetDomainId: "domain-123",
      })
      expect(body.id.length).toBeGreaterThan(0)
    })
  })
})
