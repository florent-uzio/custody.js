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
})
