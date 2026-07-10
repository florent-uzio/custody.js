import { describe, expect, it, vi } from "vitest"
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
    // Core_AccountProvider is present in 1.35.4 but not 1.35.0.
    expect(() =>
      guardFor("1.35.4").assertFeature("Core_AccountProvider", "accounts.getProvider"),
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

describe("VersionGuard deferred (lazy) resolution", () => {
  it("resolves once and dedupes concurrent ensureResolved calls to a single resolver invocation", async () => {
    const resolver = vi.fn(async () => resolveExplicitCapabilities("1.35.4"))
    const g = VersionGuard.deferred(resolver)

    await Promise.all([g.ensureResolved(), g.ensureResolved(), g.ensureResolved()])
    await g.ensureResolved()

    expect(resolver).toHaveBeenCalledTimes(1)
  })

  it("checkFeature resolves then gates against the detected capabilities", async () => {
    const g = VersionGuard.deferred(async () => resolveExplicitCapabilities("1.35.4"))

    await expect(
      g.checkFeature("Core_XrplOperation_Batch", "xrpl.proposeBatch"),
    ).rejects.toBeInstanceOf(UnsupportedInVersionError)
  })

  it("checkFeature passes when the detected version has the feature", async () => {
    const g = VersionGuard.deferred(async () => resolveExplicitCapabilities("1.35.4"))

    await expect(
      g.checkFeature("Core_AccountProvider", "accounts.getProvider"),
    ).resolves.toBeUndefined()
  })

  it("checkEndpoint resolves then gates against the detected capabilities", async () => {
    const g = VersionGuard.deferred(async () => resolveExplicitCapabilities("1.35.0"))

    await expect(g.checkEndpoint("GET", "/v1/providers")).rejects.toBeInstanceOf(
      UnsupportedInVersionError,
    )
  })

  it("surfaces resolver (detection) errors through ensureResolved, and retries afterward", async () => {
    const resolver = vi
      .fn<() => Promise<ReturnType<typeof resolveExplicitCapabilities>>>()
      .mockRejectedValueOnce(new Error("spec fetch failed"))
      .mockResolvedValueOnce(resolveExplicitCapabilities("1.35.0"))
    const g = VersionGuard.deferred(resolver)

    await expect(g.ensureResolved()).rejects.toThrow("spec fetch failed")
    await expect(g.ensureResolved()).resolves.toBeUndefined()
    expect(resolver).toHaveBeenCalledTimes(2)
  })
})

describe("VersionGuard fail-open (unresolved version)", () => {
  it("fails open — checks pass through, no UnsupportedInVersionError — when detection fails", async () => {
    const onFailOpen = vi.fn()
    const g = VersionGuard.deferred(async () => {
      throw new Error("detection failed")
    }, onFailOpen)

    await expect(
      g.checkFeature("Core_XrplOperation_Batch", "xrpl.proposeBatch"),
    ).resolves.toBeUndefined()
    await expect(g.checkEndpoint("GET", "/v1/providers")).resolves.toBeUndefined()
    expect(onFailOpen).toHaveBeenCalledOnce()
  })

  it("fails open and fires onFailOpen once when explicitly disabled (no resolved version)", async () => {
    const onFailOpen = vi.fn()
    const g = new VersionGuard(undefined, undefined, onFailOpen)

    await g.checkFeature("Core_XrplOperation_Batch", "x")
    await g.checkFeature("Core_XrplOperation_Batch", "x")

    expect(onFailOpen).toHaveBeenCalledOnce()
  })

  it("does not re-run detection after failing open", async () => {
    const resolver = vi.fn(async () => {
      throw new Error("boom")
    })
    const g = VersionGuard.deferred(resolver, () => {})

    await g.checkFeature("Core_XrplOperation_Batch", "x")
    await g.checkFeature("Core_XrplOperation_Batch", "x")
    await g.checkEndpoint("GET", "/x")

    expect(resolver).toHaveBeenCalledOnce()
  })

  it("never fires onFailOpen when a version resolves, and still gates", async () => {
    const onFailOpen = vi.fn()
    const g = VersionGuard.deferred(async () => resolveExplicitCapabilities("1.35.0"), onFailOpen)

    await g.checkEndpoint("GET", "/v1/domains")
    await expect(g.checkFeature("Core_XrplOperation_Payment", "x")).resolves.toBeUndefined()
    await expect(g.checkEndpoint("GET", "/v1/providers")).rejects.toBeInstanceOf(
      UnsupportedInVersionError,
    )
    expect(onFailOpen).not.toHaveBeenCalled()
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
