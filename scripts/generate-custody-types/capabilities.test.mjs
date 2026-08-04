import { describe, expect, it } from "vitest"
import {
  buildCapabilityDataset,
  extractCapabilities,
  renderCapabilitiesModule,
} from "./capabilities.mjs"

function doc(v, { paths = {}, schemas = {} } = {}) {
  return {
    openapi: "3.0.0",
    info: { title: "t", version: "v1", "x-app-version": v },
    paths,
    components: { schemas },
  }
}

describe("extractCapabilities", () => {
  it("reads the app version from info.x-app-version", () => {
    expect(extractCapabilities(doc("1.35.4")).version).toBe("1.35.4")
  })

  it("lists endpoints as `METHOD /path`, uppercased, sorted, ignoring non-method keys", () => {
    const d = doc("1.35.0", {
      paths: {
        "/b": { get: { operationId: "getB" }, parameters: [{ name: "x" }] },
        "/a": { post: { operationId: "postA" }, get: { operationId: "getA" } },
      },
    })

    expect(extractCapabilities(d).endpoints).toEqual(["GET /a", "GET /b", "POST /a"])
  })

  it("lists component schema names, sorted", () => {
    const d = doc("1.35.0", { schemas: { Zed: {}, Core_Batch: {}, Alpha: {} } })

    expect(extractCapabilities(d).schemas).toEqual(["Alpha", "Core_Batch", "Zed"])
  })
})

describe("buildCapabilityDataset", () => {
  it("keys each version by its endpoints and schemas", () => {
    const a = doc("1.35.0", {
      paths: { "/x": { get: {} } },
      schemas: { Core_XrplOperation_Batch: {} },
    })
    const b = doc("1.35.4", {
      paths: { "/v1/providers": { get: {} } },
      schemas: { Core_AccountProvider: {} },
    })

    const dataset = buildCapabilityDataset([{ doc: a }, { doc: b }])

    expect(dataset["1.35.0"].schemas).toContain("Core_XrplOperation_Batch")
    expect(dataset["1.35.4"].endpoints).toContain("GET /v1/providers")
  })

  it("throws when two specs of the same surface report the same app version (collision guard)", () => {
    const a = doc("1.35.0", { schemas: { Core_A: {} } })
    const b = doc("1.35.0", { schemas: { Core_B: {} } })

    expect(() => buildCapabilityDataset([{ doc: a }, { doc: b }])).toThrow(/1\.35\.0/)
  })

  it("unions a release's public and internal surfaces into one version entry (ADR-0007)", () => {
    const pub = doc("1.38.0", {
      paths: { "/v1/providers": { get: {} } },
      schemas: { Core_AccountProvider: {} },
    })
    const int = doc("1.38.0", {
      paths: { "/internal/v1/users": { get: {} } },
      schemas: { Internal_User: {} },
    })

    const dataset = buildCapabilityDataset([{ doc: pub }, { doc: int, surface: "internal" }])

    expect(Object.keys(dataset)).toEqual(["1.38.0"])
    expect(dataset["1.38.0"].endpoints).toEqual(["GET /internal/v1/users", "GET /v1/providers"])
    expect(dataset["1.38.0"].schemas).toEqual(["Core_AccountProvider", "Internal_User"])
  })
})

describe("renderCapabilitiesModule", () => {
  it("renders a generated TS module exposing CAPABILITIES as const", () => {
    const src = renderCapabilitiesModule({
      "1.35.0": {
        surfaces: ["internal", "public"],
        endpoints: ["GET /x"],
        schemas: ["Core_XrplOperation_Batch"],
      },
    })

    expect(src).toContain("export const CAPABILITIES")
    expect(src).toContain("as const")
    expect(src).toContain('"1.35.0"')
    expect(src).toContain("Core_XrplOperation_Batch")
    expect(src).toContain("KnownAppVersion")
    expect(src).toContain('surfaces: ["internal", "public"],')
  })
})
