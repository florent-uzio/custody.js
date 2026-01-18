/**
 * Returns a promise that resolves after the specified time.
 * @param ms - The number of milliseconds to wait
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))
