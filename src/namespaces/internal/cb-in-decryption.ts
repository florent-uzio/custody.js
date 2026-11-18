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
 * Statuses the CB_IN status endpoint returns while a decryption request is
 * still settling, rather than because the request itself is wrong:
 *
 * - `404` — the request has not materialized yet (e.g. polled immediately
 *   after initiating);
 * - `400` — observed when several decryptions are in flight concurrently on
 *   the same instance.
 *
 * Both are retried inside the polling loop; every other status aborts the
 * wait. A `400` that is *not* transient (a genuinely malformed request id)
 * therefore costs `maxRetries * intervalMs` before surfacing — but it does
 * surface, with its own reason and status code intact.
 */
const TRANSIENT_POLL_STATUS_CODES = [400, 404]

/**
 * Wait for a CB_IN decryption to reach a terminal status (Completed or Failed).
 * Polls the decryption status at regular intervals until it finishes or max
 * retries is reached. `decryptedAmount` is populated on the returned
 * `decryption` once the status is `Completed`.
 *
 * Transient failures ({@link TRANSIENT_POLL_STATUS_CODES}) are retried within
 * the same polling loop rather than aborting the wait. If they are still
 * failing once retries are exhausted, the last one is rethrown with its
 * original reason and status code — the wait never reports "not found" for an
 * error that was something else.
 */
async function waitForCbInDecryption(
  t: Transport,
  params: GetCbInDecryptionStatusPathParams,
  options: WaitForCbInDecryptionOptions = {},
): Promise<WaitForCbInDecryptionResult> {
  const { maxRetries = 10, intervalMs = 3000, onStatusCheck } = options

  let lastDecryption: Internal_ApiCbInDecryptionStatusResponse | undefined
  let lastTransientError: CustodyError | undefined

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
      if (
        !(
          error instanceof CustodyError &&
          !isUndefined(error.statusCode) &&
          TRANSIENT_POLL_STATUS_CODES.includes(error.statusCode)
        )
      ) {
        throw error
      }
      // Transient → the decryption is not readable yet, keep polling.
      lastTransientError = error
    }

    if (attempt < maxRetries) {
      await sleep(intervalMs)
    }
  }

  // Retries exhausted and the decryption never became readable: rethrow the
  // last transient failure verbatim, so a 400 stays a 400 with the server's
  // own reason instead of being relabelled "not found".
  if (isUndefined(lastDecryption)) {
    if (!isUndefined(lastTransientError)) {
      throw new CustodyError(
        { reason: lastTransientError.reason, message: lastTransientError.errorMessage },
        lastTransientError.statusCode,
        lastTransientError,
        `CB_IN decryption ${params.requestId} never became readable: ${maxRetries} status checks all failed with this error.`,
      )
    }

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
     * max retries are exhausted, or a non-transient error occurs (see
     * {@link TRANSIENT_POLL_STATUS_CODES}).
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
