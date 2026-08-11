import { generateKeyPairSync } from "node:crypto"
import { describe, expect, it, vi } from "vitest"
import type { KnownAppVersion } from "./models/capabilities.generated.js"
import { CustodyError } from "./models/index.js"
import { RippleCustody } from "./ripple-custody.js"
import type { SpecSource } from "./versioning/detect.js"
import { UnsupportedInVersionError } from "./versioning/version-guard.js"

const { privateKey, publicKey } = generateKeyPairSync("ed25519", {
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
})

const creds = {
  apiUrl: "https://api.example.test",
  authUrl: "https://auth.example.test",
  privateKey,
  publicKey,
}

describe("RippleCustody apiVersion option", () => {
  it("throws at construction for an unrecognized apiVersion, listing known versions", () => {
    let caught: unknown
    try {
      // Cast simulates an untyped / JS caller — the typed surface only accepts
      // bundled versions, but the runtime backstop still guards against others.
      new RippleCustody({ ...creds, apiVersion: "9.9.9" as KnownAppVersion })
    } catch (e) {
      caught = e
    }

    expect(caught).toBeInstanceOf(CustodyError)
    const message = (caught as Error).message
    expect(message).toContain("9.9.9")
    expect(message).toContain("1.35.0")
  })

  it("constructs with a known apiVersion", () => {
    expect(() => new RippleCustody({ ...creds, apiVersion: "1.35.0" })).not.toThrow()
  })

  it("constructs with no apiVersion (auto-detect enabled by default)", () => {
    expect(() => new RippleCustody({ ...creds })).not.toThrow()
  })

  it("gates exports.generateMovementReport against a pre-1.37.0 apiVersion", async () => {
    const client = new RippleCustody({ ...creds, apiVersion: "1.36.2" })

    await expect(client.exports.generateMovementReport({} as any)).rejects.toBeInstanceOf(
      UnsupportedInVersionError,
    )
  })
})

describe("RippleCustody live-spec auto-detection", () => {
  // A live spec that lacks the XRPL Batch operation type (like 1.35.4).
  const noBatchSpec = {
    info: { "x-app-version": "1.99.0" },
    paths: { "/v1/intents": { post: {} } },
    components: { schemas: { Core_XrplOperation_Payment: {} } },
  }

  const fakeSource = (spec: unknown): SpecSource => ({ fetchSpec: vi.fn(async () => spec) })

  const batchPayload = {
    Account: "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
    executionMode: "AllOrNothing",
    entries: [],
  } as any

  it("auto-detects on first call and gates xrpl.proposeBatch against the live spec", async () => {
    const specSource = fakeSource(noBatchSpec)
    const client = new RippleCustody({ ...creds, specSource })

    await expect(client.xrpl.proposeBatch(batchPayload, [])).rejects.toBeInstanceOf(
      UnsupportedInVersionError,
    )
    expect(specSource.fetchSpec).toHaveBeenCalledOnce()
  })

  it("caches detection: concurrent triggers dedupe to a single fetch", async () => {
    const specSource = fakeSource(noBatchSpec)
    const client = new RippleCustody({ ...creds, specSource })

    await Promise.all([client.ready(), client.ready(), client.ready()])
    await client.ready()

    expect(specSource.fetchSpec).toHaveBeenCalledOnce()
  })

  it("ready() surfaces detection errors", async () => {
    const client = new RippleCustody({
      ...creds,
      specSource: {
        fetchSpec: async () => {
          throw new Error("spec endpoint unreachable")
        },
      },
    })

    await expect(client.ready()).rejects.toThrow("spec endpoint unreachable")
  })

  it("autoDetectVersion: false disables detection (no fetch)", async () => {
    const specSource = fakeSource(noBatchSpec)
    const client = new RippleCustody({ ...creds, specSource, autoDetectVersion: false })

    await client.ready()

    expect(specSource.fetchSpec).not.toHaveBeenCalled()
  })

  it("an explicit apiVersion skips detection entirely", async () => {
    const specSource = fakeSource(noBatchSpec)
    const client = new RippleCustody({ ...creds, specSource, apiVersion: "1.35.0" })

    await client.ready()

    expect(specSource.fetchSpec).not.toHaveBeenCalled()
  })
})

describe("RippleCustody fail-open (unresolved version)", () => {
  // Mixed sequencing makes proposeBatch throw a validation error *after* the
  // version guard runs but *before* any network — so we observe guard behavior
  // without a real backend.
  const mixedSequencingPayload = {
    Account: "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
    executionMode: "AllOrNothing",
    entries: [
      {
        type: "SubmitterOperation",
        sequencing: { type: "PlatformManaged" },
        operation: {
          type: "Payment",
          destination: { type: "Address", address: "rD" },
          amount: "1",
        },
      },
    ],
    sequencing: { type: "AccountSequence", value: 1 },
  } as any

  it("fails open with a single warning when detection fails (no UnsupportedInVersionError)", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const client = new RippleCustody({
      ...creds,
      specSource: {
        fetchSpec: async () => {
          throw new Error("spec endpoint unreachable")
        },
      },
    })

    const error = await client.xrpl.proposeBatch(mixedSequencingPayload, []).catch((e) => e)

    expect(error).not.toBeInstanceOf(UnsupportedInVersionError)
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })

  it("warns once when auto-detect is disabled and no apiVersion is set", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const client = new RippleCustody({ ...creds, autoDetectVersion: false })

    await client.xrpl.proposeBatch(mixedSequencingPayload, []).catch(() => {})
    await client.xrpl.proposeBatch(mixedSequencingPayload, []).catch(() => {})

    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })
})

describe("RippleCustody.backendVersion()", () => {
  const fakeSource = (spec: unknown) => ({ fetchSpec: vi.fn(async () => spec) })

  it("returns the explicit apiVersion without triggering detection", async () => {
    const specSource = fakeSource({ info: { "x-app-version": "1.99.0" } })
    const client = new RippleCustody({ ...creds, specSource, apiVersion: "1.35.0" })

    await expect(client.backendVersion()).resolves.toBe("1.35.0")
    expect(specSource.fetchSpec).not.toHaveBeenCalled()
  })

  it("auto-detects and returns the live spec's x-app-version", async () => {
    const specSource = fakeSource({ info: { "x-app-version": "1.36.4" } })
    const client = new RippleCustody({ ...creds, specSource })

    await expect(client.backendVersion()).resolves.toBe("1.36.4")
  })

  it('returns "unknown" when the live spec has no x-app-version', async () => {
    const specSource = fakeSource({ info: {} })
    const client = new RippleCustody({ ...creds, specSource })

    await expect(client.backendVersion()).resolves.toBe("unknown")
  })

  it("throws a CustodyError when live detection fails", async () => {
    const client = new RippleCustody({
      ...creds,
      specSource: {
        fetchSpec: async () => {
          throw new Error("spec endpoint unreachable")
        },
      },
    })

    await expect(client.backendVersion()).rejects.toBeInstanceOf(CustodyError)
    await expect(client.backendVersion()).rejects.toThrow(/live OpenAPI spec failed/)
  })

  it("throws a CustodyError when nothing can ever be resolved", async () => {
    const client = new RippleCustody({ ...creds, autoDetectVersion: false })

    await expect(client.backendVersion()).rejects.toBeInstanceOf(CustodyError)
    await expect(client.backendVersion()).rejects.toThrow(/`autoDetectVersion` is disabled/)
  })
})
