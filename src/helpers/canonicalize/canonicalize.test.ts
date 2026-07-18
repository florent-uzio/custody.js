import { describe, expect, it } from "vitest"
import { CustodyError } from "../../models/custody-error.js"
import { canonicalizeRequest } from "./canonicalize.js"

describe("canonicalizeRequest", () => {
  it("produces a stable, key-sorted canonical string", () => {
    const a = canonicalizeRequest({ b: 1, a: 2 })
    const b = canonicalizeRequest({ a: 2, b: 1 })

    expect(a).toBe(b)
    expect(a).toBe('{"a":2,"b":1}')
  })

  it("throws a CustodyError when canonicalization yields no output", () => {
    // canonicalize returns undefined for an `undefined` input
    expect(() => canonicalizeRequest(undefined)).toThrow(CustodyError)
  })
})
