import { describe, expect, it } from "vitest"
import { CustodyError } from "../models/index.js"
import {
  resolveExplicitCapabilities,
  UnsupportedInVersionError,
  VersionGuard,
} from "./version-guard.js"

/** Build a guard resolved to a real bundled version's capability set. */
const guardFor = (version: string) => new VersionGuard(resolveExplicitCapabilities(version))

describe("VersionGuard.assertFeature", () => {
  it("throws when the feature schema is absent from the resolved version", () => {
    expect(() =>
      guardFor("1.35.4").assertFeature("Core_XrplOperation_Batch", "xrpl.proposeBatch"),
    ).toThrow(UnsupportedInVersionError)
  })

  it("passes when the feature schema is present in the resolved version", () => {
    expect(() =>
      guardFor("1.35.0").assertFeature("Core_XrplOperation_Batch", "xrpl.proposeBatch"),
    ).not.toThrow()
  })

  it("passes for a feature present in every version", () => {
    expect(() =>
      guardFor("1.35.4").assertFeature("Core_XrplOperation_Payment", "xrpl.proposeIntent"),
    ).not.toThrow()
  })
})

describe("VersionGuard.assertEndpoint", () => {
  it("passes for an endpoint present in every version", () => {
    expect(() => guardFor("1.35.0").assertEndpoint("GET", "/v1/domains")).not.toThrow()
    expect(() => guardFor("1.35.4").assertEndpoint("GET", "/v1/domains")).not.toThrow()
  })

  it("throws for an endpoint the resolved version lacks", () => {
    // GET /v1/providers exists in 1.35.4 but not 1.35.0.
    expect(() => guardFor("1.35.0").assertEndpoint("GET", "/v1/providers")).toThrow(
      UnsupportedInVersionError,
    )
    expect(() => guardFor("1.35.4").assertEndpoint("GET", "/v1/providers")).not.toThrow()
  })
})

describe("pass-through guard (no resolved version)", () => {
  it("never throws for any capability", () => {
    const g = new VersionGuard(undefined)
    expect(() => g.assertFeature("Core_XrplOperation_Batch", "x")).not.toThrow()
    expect(() => g.assertEndpoint("GET", "/v1/anything")).not.toThrow()
  })
})

describe("UnsupportedInVersionError", () => {
  it("is a CustodyError exposing capability, kind, resolved version, and sdk method", () => {
    let caught: unknown
    try {
      guardFor("1.35.4").assertFeature("Core_XrplOperation_Batch", "xrpl.proposeBatch")
    } catch (e) {
      caught = e
    }

    expect(caught).toBeInstanceOf(UnsupportedInVersionError)
    expect(caught).toBeInstanceOf(CustodyError)
    const err = caught as UnsupportedInVersionError
    expect(err.capability).toBe("Core_XrplOperation_Batch")
    expect(err.kind).toBe("feature")
    expect(err.appVersion).toBe("1.35.4")
    expect(err.sdkMethod).toBe("xrpl.proposeBatch")
  })
})

describe("resolveExplicitCapabilities", () => {
  it("throws listing the known versions for an unrecognized apiVersion", () => {
    let caught: unknown
    try {
      resolveExplicitCapabilities("9.9.9")
    } catch (e) {
      caught = e
    }
    expect(caught).toBeInstanceOf(CustodyError)
    const message = (caught as Error).message
    expect(message).toContain("9.9.9")
    expect(message).toContain("1.35.0")
    expect(message).toContain("1.35.4")
  })
})
