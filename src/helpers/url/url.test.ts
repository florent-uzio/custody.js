import { describe, expect, it } from "vitest"
import { getHostname, replacePathParams, replacePathParamsSafe } from "./url.js"

describe("getHostname", () => {
  it("returns hostname from a full https URL", () => {
    expect(getHostname("https://example.com/path")).toBe("example.com")
  })

  it("returns hostname from a full http URL", () => {
    expect(getHostname("http://example.com/path")).toBe("example.com")
  })

  it("returns hostname from a domain without protocol", () => {
    expect(getHostname("example.com")).toBe("example.com")
  })

  it("returns hostname from a domain with subdomain", () => {
    expect(getHostname("sub.example.com")).toBe("sub.example.com")
  })

  it("returns hostname from a URL with port", () => {
    expect(getHostname("https://example.com:8080/path")).toBe("example.com")
  })

  it("returns hostname from a domain with port and no protocol", () => {
    expect(getHostname("example.com:3000")).toBe("example.com")
  })

  it("returns hostname from a URL with query and hash", () => {
    expect(getHostname("https://example.com/path?foo=bar#baz")).toBe("example.com")
  })

  it("returns hostname from a domain with path and no protocol", () => {
    expect(getHostname("example.com/path")).toBe("example.com")
  })

  it("returns hostname from a localhost URL", () => {
    expect(getHostname("http://localhost:3000")).toBe("localhost")
  })

  it("returns hostname from an IP address", () => {
    expect(getHostname("192.168.1.1")).toBe("192.168.1.1")
  })
})

describe("replacePathParams", () => {
  it("should replace single parameter", () => {
    const result = replacePathParams("/v1/domains/{domainId}", { domainId: "123" })
    expect(result).toBe("/v1/domains/123")
  })

  it("should replace multiple parameters", () => {
    const result = replacePathParams("/v1/domains/{domainId}/intents/{intentId}", {
      domainId: "123",
      intentId: "456",
    })
    expect(result).toBe("/v1/domains/123/intents/456")
  })

  it("should handle numeric parameters", () => {
    const result = replacePathParams("/v1/accounts/{accountId}/balances/{tickerId}", {
      accountId: 123,
      tickerId: 456,
    })
    expect(result).toBe("/v1/accounts/123/balances/456")
  })

  it("should handle mixed string and numeric parameters", () => {
    const result = replacePathParams("/v1/domains/{domainId}/accounts/{accountId}", {
      domainId: "abc-123",
      accountId: 456,
    })
    expect(result).toBe("/v1/domains/abc-123/accounts/456")
  })

  it("should handle parameters with special characters", () => {
    const result = replacePathParams("/v1/users/{userId}/invitations/{invitationId}", {
      userId: "user-123",
      invitationId: "inv-456",
    })
    expect(result).toBe("/v1/users/user-123/invitations/inv-456")
  })

  it("should handle URLs with no parameters", () => {
    const result = replacePathParams("/v1/domains", {})
    expect(result).toBe("/v1/domains")
  })

  it("should handle URLs with unused parameters", () => {
    const result = replacePathParams("/v1/domains/{domainId}", {
      domainId: "123",
      unusedParam: "456",
    })
    expect(result).toBe("/v1/domains/123")
  })

  it("should handle URLs with missing parameters", () => {
    const result = replacePathParams("/v1/domains/{domainId}/intents/{intentId}", {
      domainId: "123",
    })
    expect(result).toBe("/v1/domains/123/intents/{intentId}")
  })

  it("should handle complex nested paths", () => {
    const result = replacePathParams(
      "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances",
      {
        domainId: "domain-123",
        virtualLedgerId: "vl-456",
        accountId: "acc-789",
      },
    )
    expect(result).toBe("/v1/domains/domain-123/virtual-ledgers/vl-456/accounts/acc-789/balances")
  })

  it("should handle parameters with regex special characters", () => {
    const result = replacePathParams("/v1/domains/{domainId}/users/{userId}", {
      domainId: "domain.123",
      userId: "user+456",
    })
    expect(result).toBe("/v1/domains/domain.123/users/user+456")
  })
})

describe("replacePathParamsSafe", () => {
  it("should work with const assertions", () => {
    const urlTemplate = "/v1/domains/{domainId}/intents/{intentId}" as const
    const result = replacePathParamsSafe(urlTemplate, {
      domainId: "123",
      intentId: "456",
    })
    expect(result).toBe("/v1/domains/123/intents/456")
  })

  it("should provide type safety", () => {
    const urlTemplate = "/v1/domains/{domainId}" as const
    // This should compile without errors
    const result = replacePathParamsSafe(urlTemplate, {
      domainId: "123",
    })
    expect(result).toBe("/v1/domains/123")
  })
})
