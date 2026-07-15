import { describe, expect, it } from "vitest"
import { verifyWebhookSecret } from "./verify-webhook-secret.js"

describe("verifyWebhookSecret", () => {
  it("returns true when the query param matches the expected secret", () => {
    const result = verifyWebhookSecret({
      url: "https://host/webhook?token=SECRET",
      expectedSecret: "SECRET",
    })

    expect(result).toBe(true)
  })

  it("accepts a path+query url (e.g. Node's req.url)", () => {
    const result = verifyWebhookSecret({
      url: "/webhook?token=SECRET",
      expectedSecret: "SECRET",
    })

    expect(result).toBe(true)
  })

  it("supports a custom param name", () => {
    const result = verifyWebhookSecret({
      url: "https://host/webhook?secret=SECRET",
      expectedSecret: "SECRET",
      paramName: "secret",
    })

    expect(result).toBe(true)
  })

  it("returns false when the secret does not match", () => {
    const result = verifyWebhookSecret({
      url: "https://host/webhook?token=WRONG",
      expectedSecret: "SECRET",
    })

    expect(result).toBe(false)
  })

  it("returns false when the query param is missing", () => {
    const result = verifyWebhookSecret({
      url: "https://host/webhook",
      expectedSecret: "SECRET",
    })

    expect(result).toBe(false)
  })

  it("returns false when the query param is present but empty", () => {
    const result = verifyWebhookSecret({
      url: "https://host/webhook?token=",
      expectedSecret: "SECRET",
    })

    expect(result).toBe(false)
  })
})
