import { CustodyError } from "../../models/index.js"
import type { BatchPayloadInput } from "./xrpl.types.js"

/**
 * Validates that a Batch's sequencing is internally consistent, surfacing the
 * rule the Custody server enforces as a local `CustodyError` before the payload
 * is sent (e.g. via `dryRunBatch`).
 *
 * A Batch must be sequenced one of two ways — mixing them is rejected:
 * - **Fully explicit**: the outer Batch and every entry use `AccountSequence`
 *   or `Ticket`.
 * - **Fully platform-managed**: the outer Batch and every entry use
 *   `PlatformManaged`. This is only possible for a submitter-only Batch, since
 *   participant entries are always explicitly sequenced.
 *
 * A frequent cause of a mixed configuration is omitting the outer `sequencing`
 * (which defaults to `PlatformManaged`, matching `buildBatchOperation`) while
 * the entries carry `AccountSequence`/`Ticket` — for example entries produced
 * by `batchToCustodyInnerTransactions`.
 *
 * @param payload - The Batch payload passed to `dryRunBatch` / `proposeBatch`
 * @throws {CustodyError} If the outer Batch and entries mix the two sequencing modes
 */
export function validateBatchSequencing(payload: BatchPayloadInput): void {
  const outerType = (payload.sequencing ?? { type: "PlatformManaged" }).type

  const slots = [
    { label: "outer Batch", type: outerType },
    ...payload.entries.map((entry, index) => ({
      label: `entry ${index} (${entry.type})`,
      type: entry.sequencing.type,
    })),
  ]

  const platformManaged = slots.filter((slot) => slot.type === "PlatformManaged")
  const explicit = slots.filter((slot) => slot.type !== "PlatformManaged")

  if (platformManaged.length > 0 && explicit.length > 0) {
    throw new CustodyError({
      reason:
        "Batch sequencing must be either fully explicit (outer Batch and every entry " +
        "AccountSequence or Ticket) or fully platform-managed (outer Batch and every entry " +
        "PlatformManaged). Mixed configurations are not allowed. " +
        `Platform-managed: ${platformManaged.map((slot) => slot.label).join(", ")}. ` +
        `Explicit: ${explicit.map((slot) => slot.label).join(", ")}.`,
    })
  }
}
