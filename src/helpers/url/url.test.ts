import { describe, expect, it } from "vitest"
import { getHostname } from "./url"

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
