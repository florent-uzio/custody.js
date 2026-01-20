import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { sleep } from "./async.js"

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
    promise.then(() => {
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
    promise.then(() => {
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

    sleep1.then(() => {
      resolved1 = true
    })
    sleep2.then(() => {
      resolved2 = true
    })
    sleep3.then(() => {
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
    expect(sleepPromise).resolves.toBeUndefined()
  })

  it("should properly chain with other promises", async () => {
    const results: string[] = []

    Promise.resolve()
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
