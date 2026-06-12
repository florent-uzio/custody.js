import { describe, expect, it } from "vitest"
import { CustodyError } from "../../models/index.js"
import type { BatchPayloadInput, Core_BatchEntry } from "./xrpl.types.js"
import { validateBatchSequencing } from "./xrpl.validators.js"

const submitterAddress = "rSubmitterAddress"
const participantAddress = "rParticipantAddress"

const payment: Core_BatchEntry["operation"] = {
  type: "Payment",
  destination: { type: "Address", address: "rDestination" },
  amount: "1000",
}

const submitterEntry = (sequencing: Core_BatchEntry["sequencing"]): Core_BatchEntry => ({
  type: "SubmitterOperation",
  sequencing,
  operation: payment,
})

const participantEntry = (sequencing: {
  type: "AccountSequence" | "Ticket"
  value: number
}): Core_BatchEntry => ({
  type: "ParticipantOperation",
  participant: { type: "Address", address: participantAddress },
  sequencing,
  operation: payment,
})

const base = (entries: Core_BatchEntry[], sequencing?: BatchPayloadInput["sequencing"]) =>
  ({
    Account: submitterAddress,
    executionMode: "AllOrNothing",
    entries,
    ...(sequencing && { sequencing }),
  }) satisfies BatchPayloadInput

describe("validateBatchSequencing", () => {
  describe("valid configurations", () => {
    it("accepts a fully platform-managed Batch (outer + entry PlatformManaged)", () => {
      const payload = base([submitterEntry({ type: "PlatformManaged" })], {
        type: "PlatformManaged",
      })
      expect(() => validateBatchSequencing(payload)).not.toThrow()
    })

    it("accepts a fully platform-managed Batch when outer sequencing is omitted (defaults to PlatformManaged)", () => {
      const payload = base([submitterEntry({ type: "PlatformManaged" })])
      expect(() => validateBatchSequencing(payload)).not.toThrow()
    })

    it("accepts a fully explicit Batch mixing AccountSequence and Ticket across slots", () => {
      const payload = base(
        [
          submitterEntry({ type: "AccountSequence", value: 1 }),
          participantEntry({ type: "Ticket", value: 7 }),
        ],
        { type: "AccountSequence", value: 10 },
      )
      expect(() => validateBatchSequencing(payload)).not.toThrow()
    })

    it("accepts an empty Batch (only the outer slot)", () => {
      expect(() => validateBatchSequencing(base([]))).not.toThrow()
    })
  })

  describe("mixed configurations", () => {
    it("throws when the outer defaults to PlatformManaged but entries are explicit", () => {
      const payload = base([submitterEntry({ type: "AccountSequence", value: 1 })])
      expect(() => validateBatchSequencing(payload)).toThrow(CustodyError)
      expect(() => validateBatchSequencing(payload)).toThrow(/Mixed configurations are not allowed/)
    })

    it("throws when the outer is explicit but an entry is PlatformManaged", () => {
      const payload = base([submitterEntry({ type: "PlatformManaged" })], {
        type: "AccountSequence",
        value: 10,
      })
      expect(() => validateBatchSequencing(payload)).toThrow(CustodyError)
    })

    it("throws when a PlatformManaged Batch contains an (always-explicit) participant entry", () => {
      const payload = base(
        [
          submitterEntry({ type: "PlatformManaged" }),
          participantEntry({ type: "AccountSequence", value: 1 }),
        ],
        { type: "PlatformManaged" },
      )
      expect(() => validateBatchSequencing(payload)).toThrow(CustodyError)
    })

    it("names the disagreeing slots in the error", () => {
      const payload = base([submitterEntry({ type: "AccountSequence", value: 1 })], {
        type: "PlatformManaged",
      })
      expect(() => validateBatchSequencing(payload)).toThrow(/outer Batch/)
      expect(() => validateBatchSequencing(payload)).toThrow(/entry 0 \(SubmitterOperation\)/)
    })
  })
})
