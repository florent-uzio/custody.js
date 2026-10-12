import { describe, expect, it, vi } from "vitest"
import {
  buildOpenApiUrl,
  detectCapabilities,
  extractCapabilitiesFromSpec,
  type SpecSource,
} from "./detect.js"

const spec = (
  version: string,
  {
    paths = {},
    schemas = {},
  }: { paths?: Record<string, unknown>; schemas?: Record<string, unknown> } = {},
) => ({
  openapi: "3.0.0",
  info: { title: "t", version: "v1", "x-app-version": version },
  paths,
  components: { schemas },
})

describe("extractCapabilitiesFromSpec", () => {
  it("reads the app version, endpoints, and schema names from a live spec", () => {
    const caps = extractCapabilitiesFromSpec(
      spec("1.40.0", {
        paths: {
          "/v1/x": { get: {}, post: {}, parameters: [] },
          "/v1/y": { get: {} },
        },
        schemas: { Foo: {}, Bar: {} },
      }),
    )

    expect(caps.appVersion).toBe("1.40.0")
    expect([...caps.endpoints].sort()).toEqual(["GET /v1/x", "GET /v1/y", "POST /v1/x"])
    expect(caps.schemas.has("Foo")).toBe(true)
    expect(caps.schemas.has("Bar")).toBe(true)
  })

  it("handles a version the SDK has never bundled", () => {
    const caps = extractCapabilitiesFromSpec(spec("9.9.9", { schemas: { Novel: {} } }))
    expect(caps.appVersion).toBe("9.9.9")
    expect(caps.schemas.has("Novel")).toBe(true)
  })
})

describe("detectCapabilities", () => {
  it("fetches via the SpecSource once and extracts capabilities", async () => {
    const source: SpecSource = {
      fetchSpec: vi.fn(async () => spec("2.0.0", { schemas: { Only: {} } })),
    }

    const caps = await detectCapabilities(source)

    expect(caps.appVersion).toBe("2.0.0")
    expect(caps.schemas.has("Only")).toBe(true)
    expect(source.fetchSpec).toHaveBeenCalledOnce()
  })
})

describe("buildOpenApiUrl", () => {
  it("appends the OpenAPI path to the apiUrl, stripping trailing slashes", () => {
    expect(buildOpenApiUrl("https://api.example.test")).toBe(
      "https://api.example.test/api/OpenAPI?scope=&layout=",
    )
    expect(buildOpenApiUrl("https://api.example.test/")).toBe(
      "https://api.example.test/api/OpenAPI?scope=&layout=",
    )
  })

  it("selects the internal document with scope=internal (ADR-0007)", () => {
    expect(buildOpenApiUrl("https://api.example.test", "internal")).toBe(
      "https://api.example.test/api/OpenAPI?scope=internal&layout=",
    )
  })
})

// --- ADR-0007: the internal surface ---

describe("detectCapabilities with an internal spec source", () => {
  const publicSpec = spec("1.36.2", {
    paths: { "/v1/users": { get: {} } },
    schemas: { Core_User: {} },
  })
  const internalSpec = spec("1.36.2", {
    paths: { "/internal/v1/users": { get: {} } },
    schemas: { Internal_User: {} },
  })

  it("unions both documents and records both surfaces", async () => {
    const source: SpecSource = { fetchSpec: vi.fn(async () => publicSpec) }
    const internalSource: SpecSource = { fetchSpec: vi.fn(async () => internalSpec) }

    const caps = await detectCapabilities(source, internalSource)

    expect(caps.appVersion).toBe("1.36.2")
    expect(caps.endpoints).toEqual(new Set(["GET /v1/users", "GET /internal/v1/users"]))
    expect(caps.schemas).toEqual(new Set(["Core_User", "Internal_User"]))
    expect([...caps.surfaces].sort()).toEqual(["internal", "public"])
  })

  it("falls back to public-only when the internal document is unavailable", async () => {
    const source: SpecSource = { fetchSpec: vi.fn(async () => publicSpec) }
    const internalSource: SpecSource = {
      fetchSpec: vi.fn(async () => {
        throw new Error("404")
      }),
    }

    const caps = await detectCapabilities(source, internalSource)

    expect(caps.endpoints).toEqual(new Set(["GET /v1/users"]))
    expect([...caps.surfaces]).toEqual(["public"])
  })

  it("still propagates a failure to fetch the public document", async () => {
    const source: SpecSource = {
      fetchSpec: vi.fn(async () => {
        throw new Error("unreachable")
      }),
    }
    const internalSource: SpecSource = { fetchSpec: vi.fn(async () => internalSpec) }

    await expect(detectCapabilities(source, internalSource)).rejects.toThrow("unreachable")
  })

  it("resolves public-only when no internal source is given", async () => {
    const source: SpecSource = { fetchSpec: vi.fn(async () => publicSpec) }

    const caps = await detectCapabilities(source)

    expect([...caps.surfaces]).toEqual(["public"])
  })
})
