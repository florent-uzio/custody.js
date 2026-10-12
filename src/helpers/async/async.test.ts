import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { pollUntil, sleep } from "./async.js"

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should return a promise", () => {
    const result = sleep(100)
    expect(result).toBeInstanceOf(Promise)
  })

  it("should resolve after the specified time", async () => {
    const promise = sleep(1000)

    // Promise should not resolve immediately
    let resolved = false
    void promise.then(() => {
      resolved = true
    })

    expect(resolved).toBe(false)

    // Advance time by 999ms - should still not be resolved
    vi.advanceTimersByTime(999)
    await Promise.resolve()
    expect(resolved).toBe(false)

    // Advance time by 1ms more (total 1000ms) - should now be resolved
    vi.advanceTimersByTime(1)
    await Promise.resolve()
    expect(resolved).toBe(true)
  })

  it("should resolve with undefined", async () => {
    const promise = sleep(100)
    vi.advanceTimersByTime(100)
    const result = await promise
    expect(result).toBeUndefined()
  })

  it("should handle zero milliseconds", async () => {
    const promise = sleep(0)
    vi.advanceTimersByTime(0)
    await expect(promise).resolves.toBeUndefined()
  })

  it("should handle small time values", async () => {
    const promise = sleep(1)
    vi.advanceTimersByTime(1)
    await expect(promise).resolves.toBeUndefined()
  })

  it("should handle large time values", async () => {
    const promise = sleep(60000)

    let resolved = false
    void promise.then(() => {
      resolved = true
    })

    // Not resolved after 59 seconds
    vi.advanceTimersByTime(59000)
    await Promise.resolve()
    expect(resolved).toBe(false)

    // Resolved after 60 seconds
    vi.advanceTimersByTime(1000)
    await Promise.resolve()
    expect(resolved).toBe(true)
  })

  it("should allow multiple concurrent sleep calls", async () => {
    const sleep1 = sleep(100)
    const sleep2 = sleep(200)
    const sleep3 = sleep(300)

    let resolved1 = false
    let resolved2 = false
    let resolved3 = false

    void sleep1.then(() => {
      resolved1 = true
    })
    void sleep2.then(() => {
      resolved2 = true
    })
    void sleep3.then(() => {
      resolved3 = true
    })

    // After 100ms, only first should be resolved
    vi.advanceTimersByTime(100)
    await Promise.resolve()
    expect(resolved1).toBe(true)
    expect(resolved2).toBe(false)
    expect(resolved3).toBe(false)

    // After 200ms total, first two should be resolved
    vi.advanceTimersByTime(100)
    await Promise.resolve()
    expect(resolved1).toBe(true)
    expect(resolved2).toBe(true)
    expect(resolved3).toBe(false)

    // After 300ms total, all should be resolved
    vi.advanceTimersByTime(100)
    await Promise.resolve()
    expect(resolved1).toBe(true)
    expect(resolved2).toBe(true)
    expect(resolved3).toBe(true)
  })

  it("should work in async/await context", async () => {
    const sleepPromise = sleep(500)

    vi.advanceTimersByTime(500)
    await sleepPromise

    // Verify it completed
    await expect(sleepPromise).resolves.toBeUndefined()
  })

  it("should properly chain with other promises", async () => {
    const results: string[] = []

    void Promise.resolve()
      .then(() => {
        results.push("start")
        return sleep(100)
      })
      .then(() => {
        results.push("after 100ms")
        return sleep(200)
      })
      .then(() => {
        results.push("after 300ms total")
      })

    // Allow promise chain to start
    await Promise.resolve()
    expect(results).toEqual(["start"])

    // After 100ms
    await vi.advanceTimersByTimeAsync(100)
    expect(results).toEqual(["start", "after 100ms"])

    // After 300ms total
    await vi.advanceTimersByTimeAsync(200)
    expect(results).toEqual(["start", "after 100ms", "after 300ms total"])
  })
})

describe("pollUntil", () => {
  const noWait = { maxRetries: 3, intervalMs: 0 }

  // The `sleep` block above installs fake timers and never uninstalls them
  // (`restoreAllMocks` leaves them in place), so reclaim real ones here.
  beforeEach(() => {
    vi.useRealTimers()
  })

  it("returns the first defined result without further attempts", async () => {
    const attempt = vi.fn(async () => "value")

    await expect(pollUntil(attempt, noWait)).resolves.toBe("value")
    expect(attempt).toHaveBeenCalledTimes(1)
  })

  it("retries until the attempt returns a value", async () => {
    const attempt = vi
      .fn<() => Promise<string | undefined>>()
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce("value")

    await expect(pollUntil(attempt, noWait)).resolves.toBe("value")
    expect(attempt).toHaveBeenCalledTimes(3)
  })

  it("returns undefined once the attempts are exhausted", async () => {
    const attempt = vi.fn(async () => undefined)

    await expect(pollUntil(attempt, noWait)).resolves.toBeUndefined()
    expect(attempt).toHaveBeenCalledTimes(3)
  })

  it("reports the 1-based attempt number to onAttempt", async () => {
    const attempts: number[] = []

    await pollUntil(async () => undefined, { ...noWait, onAttempt: (n) => attempts.push(n) })

    expect(attempts).toEqual([1, 2, 3])
  })

  it("does not sleep after the final attempt", async () => {
    vi.useFakeTimers()
    try {
      const promise = pollUntil(async () => undefined, { maxRetries: 2, intervalMs: 1000 })

      // One interval covers the only gap there is — between attempts 1 and 2.
      await vi.advanceTimersByTimeAsync(1000)

      await expect(promise).resolves.toBeUndefined()
    } finally {
      vi.useRealTimers()
    }
  })

  it("propagates an error thrown by the attempt instead of retrying", async () => {
    const attempt = vi.fn(async () => {
      throw new Error("boom")
    })

    await expect(pollUntil(attempt, noWait)).rejects.toThrow("boom")
    expect(attempt).toHaveBeenCalledTimes(1)
  })

  it("treats a falsy-but-defined result as a value", async () => {
    const attempt = vi.fn(async () => 0)

    await expect(pollUntil(attempt, noWait)).resolves.toBe(0)
    expect(attempt).toHaveBeenCalledTimes(1)
  })
})
