import type { Transport } from "../../transport/index.js"
import { createCbInDecryption } from "./cb-in-decryption.js"

/**
 * Namespaces backed by the **internal** API surface (ADR-0007), grouped under a
 * single `client.internal.*` property so their `operationId` overlap with the
 * public API never surfaces as a naming collision on the client.
 *
 * Internal endpoints are not customer-facing: they exist on the instance's
 * second OpenAPI document (`/internal/v1/…`), every call sets
 * `surface: "internal"`, and an instance that doesn't serve that document lets
 * the calls through unguarded.
 */
export function createInternal(t: Transport) {
  return {
    cbInDecryption: createCbInDecryption(t),
  } as const
}
