import { describe, expect, it } from "vitest"
import { mergeOpenApiDocs, mergeOpenApiDocsBySurface } from "./merge.mjs"

/** Minimal OpenAPI doc factory for tests. `v` is the x-app-version. */
function doc(v, { paths = {}, schemas = {} } = {}) {
  return {
    openapi: "3.0.0",
    info: { title: "t", version: "v1", "x-app-version": v },
    paths,
    components: { schemas },
  }
}

/** Channel-tagged doc helpers (ADR-0005). */
function official(v, opts) {
  return { doc: doc(v, opts), channel: "official" }
}
function devbox(v, opts) {
  return { doc: doc(v, opts), channel: "devbox" }
}

/** Surface-tagged variants (ADR-0007). */
function officialInternal(v, opts) {
  return { ...official(v, opts), surface: "internal" }
}
function devboxInternal(v, opts) {
  return { ...devbox(v, opts), surface: "internal" }
}

describe("mergeOpenApiDocs", () => {
  it("unions oneOf members so a member present in only one version survives", () => {
    const older = official("1.35.0", {
      schemas: {
        Op: { oneOf: [{ $ref: "#/c/Payment" }, { $ref: "#/c/Batch" }] },
      },
    })
    const newer = official("1.35.4", {
      schemas: { Op: { oneOf: [{ $ref: "#/c/Payment" }] } },
    })

    const { merged } = mergeOpenApiDocs([newer, older])
    const refs = merged.components.schemas.Op.oneOf.map((m) => m.$ref)

    expect(refs).toContain("#/c/Batch")
    expect(refs).toContain("#/c/Payment")
    expect(refs).toHaveLength(2)
  })

  it("unions enum values across versions", () => {
    const a = official("1.35.0", { schemas: { Kind: { enum: ["a", "b"] } } })
    const b = official("1.35.4", { schemas: { Kind: { enum: ["a", "b", "c"] } } })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(merged.components.schemas.Kind.enum.sort()).toEqual(["a", "b", "c"])
  })

  it("keeps schemas unique to each version", () => {
    const a = official("1.35.0", { schemas: { OnlyA: { type: "string" } } })
    const b = official("1.35.4", { schemas: { OnlyB: { type: "number" } } })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(merged.components.schemas).toHaveProperty("OnlyA")
    expect(merged.components.schemas).toHaveProperty("OnlyB")
  })

  it("unions object properties from both versions", () => {
    const a = official("1.35.0", {
      schemas: { T: { type: "object", properties: { a: { type: "string" } } } },
    })
    const b = official("1.35.4", {
      schemas: { T: { type: "object", properties: { b: { type: "number" } } } },
    })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(Object.keys(merged.components.schemas.T.properties).sort()).toEqual(["a", "b"])
  })

  it("unions paths and methods", () => {
    const a = official("1.35.0", {
      paths: { "/x": { get: { operationId: "getX" } }, "/y": { get: { operationId: "getY" } } },
    })
    const b = official("1.35.4", { paths: { "/x": { post: { operationId: "postX" } } } })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(Object.keys(merged.paths).sort()).toEqual(["/x", "/y"])
    expect(Object.keys(merged.paths["/x"]).sort()).toEqual(["get", "post"])
  })

  it("falls back to newest-wins and warns on an irreconcilable scalar conflict between official specs", () => {
    const older = official("1.35.0", { schemas: { Foo: { type: "string" } } })
    const newer = official("1.35.4", { schemas: { Foo: { type: "number" } } })

    const { merged, warnings } = mergeOpenApiDocs([older, newer])

    expect(merged.components.schemas.Foo.type).toBe("number")
    expect(warnings.some((w) => w.includes("Foo"))).toBe(true)
  })

  // --- ADR-0005: official vs devbox channels ---

  it("adds devbox-only schemas to the superset (devbox is additive)", () => {
    const off = official("1.35.4", { schemas: { Core_Payment: {} } })
    const dev = devbox("1.35.0", { schemas: { Core_XrplOperation_Batch: {} } })

    const { merged } = mergeOpenApiDocs([off, dev])

    expect(merged.components.schemas).toHaveProperty("Core_Payment")
    expect(merged.components.schemas).toHaveProperty("Core_XrplOperation_Batch")
  })

  it("unions a devbox-only oneOf member (Batch) into an existing official schema", () => {
    const off = official("1.35.4", {
      schemas: { Op: { oneOf: [{ $ref: "#/c/Payment" }] } },
    })
    const dev = devbox("1.35.0", {
      schemas: { Op: { oneOf: [{ $ref: "#/c/Payment" }, { $ref: "#/c/Batch" }] } },
    })

    const { merged } = mergeOpenApiDocs([off, dev])
    const refs = merged.components.schemas.Op.oneOf.map((m) => m.$ref)

    expect(refs).toContain("#/c/Batch")
  })

  it("keeps the official value and warns when a devbox spec conflicts on a scalar", () => {
    const off = official("1.35.4", { schemas: { Foo: { type: "string" } } })
    const dev = devbox("1.35.0", { schemas: { Foo: { type: "number" } } })

    const { merged, warnings } = mergeOpenApiDocs([off, dev])

    expect(merged.components.schemas.Foo.type).toBe("string")
    expect(warnings.some((w) => w.includes("devbox") && w.includes("Foo"))).toBe(true)
  })

  it("takes the base document identity from the newest official spec, never a devbox spec", () => {
    const off = official("1.35.4")
    const dev = devbox("2.0.0") // higher semver, but still devbox

    const { merged } = mergeOpenApiDocs([dev, off])

    expect(merged.info["x-app-version"]).toBe("1.35.4")
  })

  it("throws when given no documents", () => {
    expect(() => mergeOpenApiDocs([])).toThrow()
  })

  it("normalizes a doubled leading slash in a path key so it doesn't collide as a duplicate operationId", () => {
    const a = official("1.34.9", {
      paths: { "/v1/health": { get: { operationId: "HealthController_liveness" } } },
    })
    const b = official("1.34.10", {
      paths: { "//v1/health": { get: { operationId: "HealthController_liveness" } } },
    })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(Object.keys(merged.paths)).toEqual(["/v1/health"])
    expect(merged.paths["/v1/health"].get.operationId).toBe("HealthController_liveness")
  })
})

// --- ADR-0007: public vs internal surfaces ---

describe("mergeOpenApiDocsBySurface", () => {
  it("merges each surface into its own document", () => {
    const pub = official("1.38.0", { schemas: { Core_Account: {} } })
    const int = devboxInternal("1.36.2", { schemas: { Internal_Account: {} } })

    const bySurface = mergeOpenApiDocsBySurface([pub, int])

    expect(Object.keys(bySurface).sort()).toEqual(["internal", "public"])
    expect(bySurface.public.merged.components.schemas).toEqual({ Core_Account: {} })
    expect(bySurface.internal.merged.components.schemas).toEqual({ Internal_Account: {} })
  })

  it("keeps an operationId that exists on both surfaces addressable in each document", () => {
    const pub = official("1.38.0", {
      paths: { "/v1/domains/{domainId}/users": { get: { operationId: "getUsers" } } },
    })
    const int = devboxInternal("1.36.2", {
      paths: { "/internal/v1/users": { get: { operationId: "getUsers" } } },
    })

    const bySurface = mergeOpenApiDocsBySurface([pub, int])

    expect(Object.keys(bySurface.public.merged.paths)).toEqual(["/v1/domains/{domainId}/users"])
    expect(Object.keys(bySurface.internal.merged.paths)).toEqual(["/internal/v1/users"])
  })

  it("treats an untagged document as public", () => {
    const bySurface = mergeOpenApiDocsBySurface([official("1.38.0", { schemas: { Core_A: {} } })])

    expect(Object.keys(bySurface)).toEqual(["public"])
  })

  it("omits a surface that has no bundled specs", () => {
    const bySurface = mergeOpenApiDocsBySurface([devboxInternal("1.36.2")])

    expect(Object.keys(bySurface)).toEqual(["internal"])
  })

  it("applies the official-wins rule within the internal surface", () => {
    const off = officialInternal("1.38.0", { schemas: { Internal_Foo: { type: "string" } } })
    const dev = devboxInternal("1.36.2", { schemas: { Internal_Foo: { type: "number" } } })

    const { merged, warnings } = mergeOpenApiDocsBySurface([off, dev]).internal

    expect(merged.components.schemas.Internal_Foo.type).toBe("string")
    expect(warnings.some((w) => w.includes("devbox") && w.includes("Internal_Foo"))).toBe(true)
  })

  it("takes each surface's document identity from its own newest official spec", () => {
    const pub = official("1.38.0")
    const int = officialInternal("1.36.2")

    const bySurface = mergeOpenApiDocsBySurface([pub, devboxInternal("2.0.0"), int])

    expect(bySurface.public.merged.info["x-app-version"]).toBe("1.38.0")
    expect(bySurface.internal.merged.info["x-app-version"]).toBe("1.36.2")
  })

  it("throws when given no documents", () => {
    expect(() => mergeOpenApiDocsBySurface([])).toThrow()
  })
})
