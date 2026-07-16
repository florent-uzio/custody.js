import { describe, expect, it } from "vitest"
import { CustodyError } from "../../models/custody-error.js"
import { toSignablePayload } from "./canonicalize.js"

describe("toSignablePayload", () => {
  it("produces a stable, key-sorted canonical string", () => {
    const a = toSignablePayload({ b: 1, a: 2 })
    const b = toSignablePayload({ a: 2, b: 1 })

    expect(a).toBe(b)
    expect(a).toBe('{"a":2,"b":1}')
  })

  it("throws a CustodyError when canonicalization yields no output", () => {
    // canonicalize returns undefined for an `undefined` input
    expect(() => toSignablePayload(undefined)).toThrow(CustodyError)
  })
})
