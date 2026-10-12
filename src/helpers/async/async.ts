import { isUndefined } from "../typeof-fns/index.js"

/**
 * Returns a promise that resolves after the specified time.
 * @param ms - The number of milliseconds to wait
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Options shared by every polling loop built on {@link pollUntil}.
 */
export type PollUntilOptions = {
  /** Maximum number of polling attempts */
  maxRetries: number
  /** Interval between polling attempts in milliseconds */
  intervalMs: number
  /** Callback on each polling attempt, receiving the 1-based attempt number */
  onAttempt?: (attempt: number) => void
}

/**
 * Runs `attempt` up to `maxRetries` times, `intervalMs` apart, and returns the
 * first defined result — or `undefined` once the attempts are exhausted. No
 * sleep follows the final attempt, so the loop never adds latency to its own
 * failure.
 *
 * `attempt` signals "not yet" by returning `undefined`, not by throwing: a real
 * error propagates and ends the loop. When the caller needs to know *why* the
 * last attempt came up empty, it records that in a closure variable and reads it
 * after the loop.
 */
export const pollUntil = async <T>(
  attempt: () => Promise<T | undefined>,
  { maxRetries, intervalMs, onAttempt }: PollUntilOptions,
): Promise<T | undefined> => {
  for (let i = 1; i <= maxRetries; i++) {
    onAttempt?.(i)

    const result = await attempt()
    if (!isUndefined(result)) {
      return result
    }

    if (i < maxRetries) {
      await sleep(intervalMs)
    }
  }

  return undefined
}
