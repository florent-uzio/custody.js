import { describe, expect, it } from "vitest"
import { CustodyError } from "./custody-error.js"

describe("CustodyError", () => {
  it("keeps `reason` free of the hint and appends it to `message`", () => {
    const error = new CustodyError({ reason: "InvalidSignatureError" }, 401, undefined, "Try X.")

    expect(error.reason).toBe("InvalidSignatureError")
    expect(error.hint).toBe("Try X.")
    expect(error.message).toBe("InvalidSignatureError\n\nTry X.")
  })

  it("leaves `message` as the reason when there is no hint", () => {
    const error = new CustodyError({ reason: "Forbidden", message: "Insufficient permissions" })

    expect(error.message).toBe("Forbidden")
    expect(error.hint).toBeUndefined()
    expect(error.toJSON()).toEqual({
      reason: "Forbidden",
      message: "Insufficient permissions",
      statusCode: undefined,
      hint: undefined,
    })
  })

  it("serializes the reason rather than the hint-bearing message", () => {
    const error = new CustodyError({ reason: "InvalidSignatureError" }, 401, undefined, "Try X.")

    expect(error.toJSON()).toEqual({
      reason: "InvalidSignatureError",
      message: undefined,
      statusCode: 401,
      hint: "Try X.",
    })
  })
})
