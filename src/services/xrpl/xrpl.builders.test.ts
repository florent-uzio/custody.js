import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { buildDryRunBody, buildTransactionIntent, pickOrderFields } from "./xrpl.builders.js"
import type {
  Core_XrplOperation,
  IntentContext,
  XrplIntentOptions,
  XrplTransactionOrderFields,
} from "./xrpl.types.js"

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

// Fully explicit options so no uuidv7()/dayjs() defaults are exercised — the
// output is deterministic (given a frozen clock).
const optionsNoDescription: XrplIntentOptions = {
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
    feeStrategy: { priority: "Low", type: "Priority" },
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
      const { body } = buildTransactionIntent({ operation, context, options: explicitOptions })
      expect(body).toEqual({
        request: { ...expectedEnvelope, type: "Propose" },
      })
    })

    it("omits the description key entirely when description is absent", () => {
      const { body } = buildTransactionIntent({ operation, context, options: optionsNoDescription })

      expect("description" in body.request).toBe(false)
      expect(body).toEqual({
        request: { ...expectedEnvelope, description: undefined, type: "Propose" },
      })
    })

    it("returns the caller's payload id", () => {
      const { payloadId } = buildTransactionIntent({
        operation,
        context,
        options: optionsNoDescription,
      })

      expect(payloadId).toBe("fixed-payload-id")
    })

    it("returns the generated payload id when none was supplied", () => {
      const { body, payloadId } = buildTransactionIntent({ operation, context, options: {} })

      expect(payloadId).toEqual(expect.any(String))
      expect(body.request.payload.id).toBe(payloadId)
    })
  })

  describe("order fields", () => {
    const fields: XrplTransactionOrderFields = {
      memos: [{ memoData: "68656C6C6F", memoFormat: "746578742F706C61696E" }],
      feeStrategy: { type: "SpecifiedAdditionalFee", drops: "10" },
      sourceTag: 42,
      maximumFee: "1000",
    }
    const expectedWithFields = {
      ...expectedEnvelope,
      payload: {
        ...expectedPayload,
        parameters: { ...expectedPayload.parameters, ...fields },
      },
    }

    it("passes the caller's fields into the dry-run parameters", () => {
      const body = buildDryRunBody(operation, context, explicitOptions, fields)
      expect(body).toEqual(expectedWithFields)
    })

    it("passes the caller's fields into the proposed parameters", () => {
      const { body } = buildTransactionIntent({
        operation,
        fields,
        context,
        options: explicitOptions,
      })
      expect(body).toEqual({ request: { ...expectedWithFields, type: "Propose" } })
    })

    // `toEqual` ignores undefined-valued keys, so check inclusion directly:
    // an unset sourceTag/maximumFee must not appear in the signed body.
    it("omits the sourceTag and maximumFee keys when they are unset", () => {
      const { body } = buildTransactionIntent({
        operation,
        fields: pickOrderFields({ memos: fields.memos }),
        context,
        options: explicitOptions,
      })
      const { parameters } = body.request.payload as typeof expectedPayload

      expect(Object.keys(parameters).sort()).toEqual(["feeStrategy", "memos", "operation", "type"])
    })
  })

  describe("pickOrderFields", () => {
    it("keeps only the order fields", () => {
      const params = {
        Account: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        operation,
        sourceTag: 42,
      }
      expect(pickOrderFields(params)).toEqual({ sourceTag: 42 })
      expect(pickOrderFields(params)).not.toHaveProperty("Account")
      expect(pickOrderFields(params)).not.toHaveProperty("operation")
    })
  })

  describe("defaults", () => {
    it("applies a Low priority fee strategy, empty customProperties, ~1 day expiry, and generated ids", () => {
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
