import { InternalURLs } from "../../constants/internal-urls.js"
import { isUndefined, sleep } from "../../helpers/index.js"
import { CustodyError } from "../../models/index.js"
import type { RequestConfig, Transport } from "../../transport/index.js"
import type {
  GetCbInDecryptionStatusPathParams,
  InitiateCbInDecryptionBody,
  Internal_ApiCbInDecryptionStatusResponse,
  Internal_ApiInitiateCbInDecryptionResponse,
  WaitForCbInDecryptionOptions,
  WaitForCbInDecryptionResult,
} from "./cb-in-decryption.types.js"
import { TERMINAL_CB_IN_DECRYPTION_STATUSES } from "./cb-in-decryption.types.js"

/** Reads target the internal surface so the version guard doesn't gate them. */
const INTERNAL: RequestConfig = { surface: "internal" }

/**
 * Writes additionally opt out of signing: the internal bodies carry no
 * `request` property for the signer to canonicalize (ADR-0007 §5).
 */
const INTERNAL_UNSIGNED: RequestConfig = { sign: false, surface: "internal" }

/**
 * Wait for a CB_IN decryption to reach a terminal status (Completed or Failed).
 * Polls the decryption status at regular intervals until it finishes or max
 * retries is reached. `decryptedAmount` is populated on the returned
 * `decryption` once the status is `Completed`.
 *
 * A 404 is treated as "not available yet" (e.g. when called immediately after
 * initiating) and is retried within the same polling loop rather than aborting
 * the wait.
 */
async function waitForCbInDecryption(
  t: Transport,
  params: GetCbInDecryptionStatusPathParams,
  options: WaitForCbInDecryptionOptions = {},
): Promise<WaitForCbInDecryptionResult> {
  const { maxRetries = 10, intervalMs = 3000, onStatusCheck } = options

  let lastDecryption: Internal_ApiCbInDecryptionStatusResponse | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const decryption = await t.get<Internal_ApiCbInDecryptionStatusResponse>(
        InternalURLs.cmptCbInStatus,
        params,
        undefined,
        INTERNAL,
      )
      lastDecryption = decryption
      const { status } = decryption

      onStatusCheck?.(status, attempt)

      if (TERMINAL_CB_IN_DECRYPTION_STATUSES.includes(status)) {
        return {
          status,
          isTerminal: true,
          isSuccess: status === "Completed",
          decryption,
        }
      }
    } catch (error) {
      if (!(error instanceof CustodyError && [400,404].includes(error.statusCode ?? 0))) {
        throw error
      }
      // 404 → the decryption is not available yet, keep polling.
    }

    if (attempt < maxRetries) {
      await sleep(intervalMs)
    }
  }

  // Retries exhausted. If the decryption never materialized, surface that as a 404.
  if (isUndefined(lastDecryption)) {
    throw new CustodyError(
      {
        reason: `CB_IN decryption ${params.requestId} not found after ${maxRetries} attempts`,
      },
      404,
    )
  }

  // The loop returns early on any terminal status, so the last observed
  // decryption is necessarily non-terminal here.
  return {
    status: lastDecryption.status,
    isTerminal: false,
    isSuccess: false,
    decryption: lastDecryption,
  }
}

/**
 * CB_IN inbox balance decryption for confidential MPT (cMPT) accounts
 * (`client.internal.cbInDecryption.*`), on the internal API surface
 * (`/internal/v1/cmpt-cb-in`).
 *
 * Decryption is asynchronous: `initiate` returns a request id with a transient
 * status, and the status endpoint carries the `decryptedAmount` once the
 * request reaches `Completed`.
 */
export function createCbInDecryption(t: Transport) {
  return {
    initiate: (
      body: InitiateCbInDecryptionBody,
    ): Promise<Internal_ApiInitiateCbInDecryptionResponse> =>
      t.post(InternalURLs.cmptCbIn, body, undefined, INTERNAL_UNSIGNED),

    getStatus: (
      params: GetCbInDecryptionStatusPathParams,
    ): Promise<Internal_ApiCbInDecryptionStatusResponse> =>
      t.get(InternalURLs.cmptCbInStatus, params, undefined, INTERNAL),

    /**
     * Polls {@link getStatus} until the decryption reaches a terminal status,
     * max retries are exhausted, or a non-404 error occurs.
     */
    getStatusAndWait: (
      params: GetCbInDecryptionStatusPathParams,
      options?: WaitForCbInDecryptionOptions,
    ): Promise<WaitForCbInDecryptionResult> => waitForCbInDecryption(t, params, options),

    /**
     * Initiates a CB_IN decryption and polls the returned request id until it
     * reaches a terminal status. Convenience wrapper over {@link initiate} +
     * {@link getStatusAndWait}.
     */
    initiateAndWait: async (
      body: InitiateCbInDecryptionBody,
      options?: WaitForCbInDecryptionOptions,
    ): Promise<WaitForCbInDecryptionResult> => {
      const { id } = await t.post<Internal_ApiInitiateCbInDecryptionResponse>(
        InternalURLs.cmptCbIn,
        body,
        undefined,
        INTERNAL_UNSIGNED,
      )
      return waitForCbInDecryption(t, { requestId: id }, options)
    },
  } as const
}
