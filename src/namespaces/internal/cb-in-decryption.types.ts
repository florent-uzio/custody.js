import type { operations } from "../../models/custody-internal-types.js"
import type { Prettify } from "../../type-utils/prettify.js"

// Request types

export type InitiateCbInDecryptionBody =
  operations["initiateCbInDecryption"]["requestBody"]["content"]["application/json"]

export type GetCbInDecryptionStatusPathParams =
  operations["getCbInDecryptionStatus"]["parameters"]["path"]

// Response types

/**
 * Statuses returned by the CB_IN decryption endpoints. `Pending` and
 * `Preparing` are transient; `Completed` and `Failed` are terminal
 * (`decryptedAmount` is only populated on `Completed`, `error` on `Failed`).
 *
 * The internal spec types `status` as a bare `string`, so these literals mirror
 * the ones the cMPT compute endpoints return. The trailing `(string & {})`
 * keeps the union assignable from any string, so the SDK never blocks consumers
 * when the API returns a status not listed here.
 *
 * TODO: remove this type and drop the `status` overrides below once the
 * OpenAPI spec declares the enum — the generated type will then carry the
 * literals itself.
 */
export type CbInDecryptionStatus = "Pending" | "Preparing" | "Completed" | "Failed" | (string & {})

export type Internal_ApiInitiateCbInDecryptionResponse = Prettify<
  Omit<
    operations["initiateCbInDecryption"]["responses"]["202"]["content"]["application/json"],
    "status"
  > & { status: CbInDecryptionStatus }
>

export type Internal_ApiCbInDecryptionStatusResponse = Prettify<
  Omit<
    operations["getCbInDecryptionStatus"]["responses"]["200"]["content"]["application/json"],
    "status"
  > & { status: CbInDecryptionStatus }
>

/** Statuses that indicate the CB_IN decryption has finished processing */
export const TERMINAL_CB_IN_DECRYPTION_STATUSES: CbInDecryptionStatus[] = ["Completed", "Failed"]

/**
 * Options for waiting for a CB_IN decryption to finish.
 */
export type WaitForCbInDecryptionOptions = {
  /**
   * Maximum number of polling attempts (default: 10). Also bounds how long a
   * not-yet-available (404) decryption is waited for, since 404s are retried
   * within the same loop.
   */
  maxRetries?: number
  /** Interval between polling attempts in milliseconds (default: 3000) */
  intervalMs?: number
  /**
   * Callback function called on each status check.
   * Useful for logging or updating UI.
   */
  onStatusCheck?: (status: CbInDecryptionStatus, attempt: number) => void
}

/**
 * Result of waiting for a CB_IN decryption to finish.
 */
export type WaitForCbInDecryptionResult = {
  /** The final status of the decryption */
  status: CbInDecryptionStatus
  /** Whether the decryption reached a terminal status */
  isTerminal: boolean
  /** Whether the decryption completed successfully */
  isSuccess: boolean
  /** The full status response — `decryptedAmount` is populated on `Completed` */
  decryption: Internal_ApiCbInDecryptionStatusResponse
}
