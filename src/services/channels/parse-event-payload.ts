import { CustodyError } from "../../models/custody-error.js"
import type { Core_HarmonizeEvent } from "../events/events.types.js"
import type { EDS_Event } from "./channels.types.js"

/**
 * Parses the JSON-encoded `payload` on an `EDS_Event` into a fully typed
 * `Core_HarmonizeEvent`. TypeScript narrows the inner `payload.type`
 * discriminator so callers can switch on the event variant.
 *
 * Throws `CustodyError` when `payload` is missing, is not valid JSON, or
 * does not contain a `Core_HarmonizeEvent` with a string `payload.type`.
 */
export function parseEventPayload(event: EDS_Event): Core_HarmonizeEvent {
  if (!event.payload) {
    throw new CustodyError({ reason: "EDS_Event.payload is missing or empty" })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(event.payload)
  } catch (cause) {
    throw new CustodyError(
      { reason: "Failed to parse EDS_Event.payload as JSON" },
      undefined,
      cause instanceof Error ? cause : undefined,
    )
  }

  if (!isHarmonizeEvent(parsed)) {
    throw new CustodyError({
      reason: "EDS_Event.payload is not a Core_HarmonizeEvent with a type discriminator",
    })
  }

  return parsed
}

function isHarmonizeEvent(value: unknown): value is Core_HarmonizeEvent {
  if (!value || typeof value !== "object") return false
  const payload = (value as { payload?: unknown }).payload
  if (!payload || typeof payload !== "object") return false
  const type = (payload as { type?: unknown }).type
  return typeof type === "string" && type.length > 0
}
