import { describe, expect, it } from "vitest"
import { signatureMismatchHint } from "./signature-hint.js"

describe("signatureMismatchHint", () => {
  it("returns undefined when no array reaches 5 elements", () => {
    expect(signatureMismatchHint({ operation: { flags: ["a", "b", "c", "d"] } })).toBeUndefined()
  })

  it("names a nested array of 5 elements", () => {
    const hint = signatureMismatchHint({
      payload: { parameters: { operation: { flags: ["a", "b", "c", "d", "e"] } } },
    })

    expect(hint).toContain("`request.payload.parameters.operation.flags`")
  })

  it("names every offending array, including ones nested inside arrays", () => {
    const hint = signatureMismatchHint({
      operations: [{ tags: [1, 2, 3] }, { tags: [1, 2, 3, 4, 5] }],
      recipients: ["a", "b", "c", "d", "e", "f"],
    })

    expect(hint).toContain("`request.operations[1].tags`")
    expect(hint).toContain("`request.recipients`")
    expect(hint).not.toContain("operations[0]")
  })

  it("ignores objects with 5+ keys, which the backend round-trips faithfully", () => {
    const customProperties = { a: "1", b: "2", c: "3", d: "4", e: "5", f: "6" }

    expect(signatureMismatchHint({ customProperties })).toBeUndefined()
  })
})
