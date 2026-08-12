import { beforeEach, describe, expect, it, vi } from "vitest"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { createTransactions } from "../transactions.js"
import type { Core_TransactionDetails } from "../transactions.types.js"

vi.mock("../../helpers/index.js", async () => {
  const actual = await vi.importActual("../../helpers/index.js")
  return {
    ...actual,
    sleep: vi.fn(() => Promise.resolve()),
  }
})

const mockTransport = createFakeTransport()

/**
 * Only the three branches the wait reads — processing status, on-chain failure
 * and the ledger status a replacement marks — plus the `registeredAt` it sorts
 * on. Cast because the real schema requires `ledgerId` and `relatedAccounts`,
 * which none of this behaviour depends on.
 */
const transaction = (
  fields: {
    id?: string
    registeredAt?: string
    status?: string
    hint?: string
    cause?: string
    reason?: string
    failure?: string
    ledgerStatus?: string
  } = {},
): Core_TransactionDetails => {
  const { id = "t-1", registeredAt = "2026-08-12T10:00:00Z" } = fields

  return {
    id,
    registeredAt,
    ...(fields.status && {
      processing: {
        status: fields.status,
        ...(fields.hint && { hint: fields.hint }),
        ...(fields.cause && { cause: fields.cause }),
        ...(fields.reason && { reason: fields.reason }),
      },
    }),
    ...((fields.failure || fields.ledgerStatus) && {
      ledgerTransactionData: {
        ledgerStatus: fields.ledgerStatus ?? "Confirmed",
        ledgerTransactionId: `hash-${id}`,
        statusLastUpdatedAt: registeredAt,
        ...(fields.failure && { failure: fields.failure }),
      },
    }),
  } as Core_TransactionDetails
}

const collection = (...items: Core_TransactionDetails[]) => ({ items, count: items.length })

describe("createTransactions", () => {
  let transactions: ReturnType<typeof createTransactions>

  beforeEach(() => {
    vi.clearAllMocks()
    transactions = createTransactions(mockTransport)
  })

  describe("byOrderAndWait (waitForOrderTransaction)", () => {
    const params = { domainId: "d-1", transactionOrderId: "o-1" }

    it("should query the transactions collection filtered by the order ID", async () => {
      mockTransport.get.mockResolvedValue(collection(transaction({ status: "Completed" })))

      await transactions.byOrderAndWait(params)

      expect(mockTransport.get).toHaveBeenCalledWith(
        "/v1/domains/{domainId}/transactions",
        { domainId: "d-1" },
        { "orderReference.Id": "o-1" },
      )
    })

    it("should report success on a completed transaction", async () => {
      const completed = transaction({ status: "Completed" })
      mockTransport.get.mockResolvedValue(collection(completed))

      const result = await transactions.byOrderAndWait(params)

      expect(result).toEqual({
        status: "Completed",
        isTerminal: true,
        isSuccess: true,
        transaction: completed,
      })
    })

    it("should report a failed transaction as terminal but not successful, keeping the hint", async () => {
      mockTransport.get.mockResolvedValue(
        collection(transaction({ status: "Failed", hint: "InvalidUserPayload" })),
      )

      const result = await transactions.byOrderAndWait(params)

      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
      expect(result.status).toBe("Failed")
      expect(result.transaction?.processing).toEqual({
        status: "Failed",
        hint: "InvalidUserPayload",
      })
    })

    it("should report an interrupted transaction as terminal but not successful", async () => {
      mockTransport.get.mockResolvedValue(
        collection(
          transaction({ status: "Interrupted", cause: "Cancelled", reason: "cancelled by user" }),
        ),
      )

      const result = await transactions.byOrderAndWait(params)

      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
      expect(result.status).toBe("Interrupted")
    })

    // Custody reports `Completed` once it is done with the transaction, which
    // includes ones the ledger then threw out — so the status alone would call
    // this a success.
    it("should not report success when the ledger rejected a completed transaction", async () => {
      mockTransport.get.mockResolvedValue(
        collection(transaction({ status: "Completed", failure: "FailedOnChain" })),
      )

      const result = await transactions.byOrderAndWait(params)

      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
      expect(result.transaction?.ledgerTransactionData?.failure).toBe("FailedOnChain")
    })

    it("should treat an on-chain failure as terminal even before processing catches up", async () => {
      mockTransport.get.mockResolvedValue(
        collection(transaction({ status: "Broadcasting", failure: "PartiallyFailedOnChain" })),
      )

      const result = await transactions.byOrderAndWait(params)

      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
      expect(result.status).toBe("Broadcasting")
    })

    it("should poll while no transaction is registered for the order yet", async () => {
      mockTransport.get
        .mockResolvedValueOnce(collection())
        .mockResolvedValueOnce(collection())
        .mockResolvedValueOnce(collection(transaction({ status: "Completed" })))

      const result = await transactions.byOrderAndWait(params, { maxRetries: 5 })

      expect(result.isSuccess).toBe(true)
      expect(mockTransport.get).toHaveBeenCalledTimes(3)
    })

    it("should poll while the transaction is still in flight", async () => {
      mockTransport.get
        .mockResolvedValueOnce(collection(transaction({ status: "Preparing" })))
        .mockResolvedValueOnce(collection(transaction({ status: "Broadcasting" })))
        .mockResolvedValueOnce(collection(transaction({ status: "Completed" })))

      const result = await transactions.byOrderAndWait(params, { maxRetries: 5 })

      expect(result.isSuccess).toBe(true)
      expect(mockTransport.get).toHaveBeenCalledTimes(3)
    })

    it("should ignore a replaced transaction and follow its replacement", async () => {
      const replaced = transaction({
        id: "t-old",
        registeredAt: "2026-08-12T10:00:00Z",
        status: "Completed",
        ledgerStatus: "Replaced",
      })
      const replacement = transaction({
        id: "t-new",
        registeredAt: "2026-08-12T10:05:00Z",
        status: "Broadcasting",
      })

      mockTransport.get
        .mockResolvedValueOnce(collection(replaced, replacement))
        .mockResolvedValueOnce(
          collection(
            replaced,
            transaction({
              id: "t-new",
              registeredAt: "2026-08-12T10:05:00Z",
              status: "Completed",
            }),
          ),
        )

      const result = await transactions.byOrderAndWait(params, { maxRetries: 5 })

      expect(result.isSuccess).toBe(true)
      expect(result.transaction?.id).toBe("t-new")
      // The replaced attempt was already `Completed`, so a first-item read would
      // have returned after one call.
      expect(mockTransport.get).toHaveBeenCalledTimes(2)
    })

    it("should take the newest transaction regardless of the order items arrive in", async () => {
      mockTransport.get.mockResolvedValue(
        collection(
          transaction({ id: "t-old", registeredAt: "2026-08-12T10:00:00Z", status: "Failed" }),
          transaction({ id: "t-new", registeredAt: "2026-08-12T10:05:00Z", status: "Completed" }),
        ),
      )

      const result = await transactions.byOrderAndWait(params)

      expect(result.transaction?.id).toBe("t-new")
      expect(result.isSuccess).toBe(true)
    })

    it("should return a non-terminal result when max retries are exceeded", async () => {
      const inFlight = transaction({ status: "Broadcasting" })
      mockTransport.get.mockResolvedValue(collection(inFlight))

      const result = await transactions.byOrderAndWait(params, { maxRetries: 2 })

      expect(mockTransport.get).toHaveBeenCalledTimes(2)
      expect(result).toEqual({
        status: "Broadcasting",
        isTerminal: false,
        isSuccess: false,
        transaction: inFlight,
      })
    })

    // What tells a caller "this order never produced a transaction" apart from
    // "it produced one that is still in flight".
    it("should return no transaction when none was ever registered", async () => {
      mockTransport.get.mockResolvedValue(collection())

      const result = await transactions.byOrderAndWait(params, { maxRetries: 2 })

      expect(result).toEqual({
        status: undefined,
        isTerminal: false,
        isSuccess: false,
        transaction: undefined,
      })
    })

    it("should call onStatusCheck on each attempt, including before the transaction exists", async () => {
      const onStatusCheck = vi.fn()
      mockTransport.get
        .mockResolvedValueOnce(collection())
        .mockResolvedValueOnce(collection(transaction({ status: "Completed" })))

      await transactions.byOrderAndWait(params, { maxRetries: 5, onStatusCheck })

      expect(onStatusCheck).toHaveBeenNthCalledWith(1, undefined, 1)
      expect(onStatusCheck).toHaveBeenNthCalledWith(2, "Completed", 2)
    })

    it("should propagate transport errors rather than polling through them", async () => {
      mockTransport.get.mockRejectedValue(new Error("boom"))

      await expect(transactions.byOrderAndWait(params)).rejects.toThrow("boom")
      expect(mockTransport.get).toHaveBeenCalledTimes(1)
    })
  })
})
