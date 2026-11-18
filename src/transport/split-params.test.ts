import { describe, expect, it } from "vitest"

import { splitParams } from "./split-params.js"

describe("splitParams", () => {
  it("should return original URL and no query when no params are provided", () => {
    const result = splitParams("/v1/tickers", {})
    expect(result).toEqual({ url: "/v1/tickers", query: undefined })
  })

  it("should treat all params as query when URL has no placeholders", () => {
    const result = splitParams("/v1/tickers", { limit: 10, offset: 0 })
    expect(result).toEqual({
      url: "/v1/tickers",
      query: { limit: 10, offset: 0 },
    })
  })

  it("should extract path params from URL template", () => {
    const result = splitParams("/v1/domains/{domainId}", { domainId: "d-123" })
    expect(result).toEqual({ url: "/v1/domains/d-123", query: undefined })
  })

  it("should separate path and query params", () => {
    const result = splitParams("/v1/domains/{domainId}/accounts", {
      domainId: "d-123",
      limit: 5,
      status: "active",
    })
    expect(result).toEqual({
      url: "/v1/domains/d-123/accounts",
      query: { limit: 5, status: "active" },
    })
  })

  it("should handle multiple path params", () => {
    const result = splitParams("/v1/domains/{domainId}/accounts/{accountId}", {
      domainId: "d-123",
      accountId: "a-456",
    })
    expect(result).toEqual({
      url: "/v1/domains/d-123/accounts/a-456",
      query: undefined,
    })
  })

  it("should handle multiple path params with query params", () => {
    const result = splitParams("/v1/domains/{domainId}/intents/{intentId}", {
      domainId: "d-123",
      intentId: "i-456",
      expand: true,
    })
    expect(result).toEqual({
      url: "/v1/domains/d-123/intents/i-456",
      query: { expand: true },
    })
  })

  it("should handle complex nested URL templates", () => {
    const result = splitParams(
      "/v1/domains/{domainId}/accounts/{accountId}/manifests/{manifestId}",
      {
        domainId: "d-1",
        accountId: "a-2",
        manifestId: "m-3",
      },
    )
    expect(result).toEqual({
      url: "/v1/domains/d-1/accounts/a-2/manifests/m-3",
      query: undefined,
    })
  })

  it("should handle numeric path param values", () => {
    const result = splitParams("/v1/tickers/{tickerId}", { tickerId: 42 })
    expect(result).toEqual({ url: "/v1/tickers/42", query: undefined })
  })
})
