import { describe, expect, it } from "vitest"
import { mergeOpenApiDocs } from "./merge.mjs"

/** Minimal OpenAPI doc factory for tests. `v` is the x-app-version. */
function doc(v, { paths = {}, schemas = {} } = {}) {
  return {
    openapi: "3.0.0",
    info: { title: "t", version: "v1", "x-app-version": v },
    paths,
    components: { schemas },
  }
}

describe("mergeOpenApiDocs", () => {
  it("unions oneOf members so a member present in only one version survives", () => {
    const older = doc("1.35.0", {
      schemas: {
        Op: { oneOf: [{ $ref: "#/c/Payment" }, { $ref: "#/c/Batch" }] },
      },
    })
    const newer = doc("1.35.4", {
      schemas: { Op: { oneOf: [{ $ref: "#/c/Payment" }] } },
    })

    const { merged } = mergeOpenApiDocs([newer, older])
    const refs = merged.components.schemas.Op.oneOf.map((m) => m.$ref)

    expect(refs).toContain("#/c/Batch")
    expect(refs).toContain("#/c/Payment")
    expect(refs).toHaveLength(2)
  })

  it("unions enum values across versions", () => {
    const a = doc("1.35.0", { schemas: { Kind: { enum: ["a", "b"] } } })
    const b = doc("1.35.4", { schemas: { Kind: { enum: ["a", "b", "c"] } } })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(merged.components.schemas.Kind.enum.sort()).toEqual(["a", "b", "c"])
  })

  it("keeps schemas unique to each version", () => {
    const a = doc("1.35.0", { schemas: { OnlyA: { type: "string" } } })
    const b = doc("1.35.4", { schemas: { OnlyB: { type: "number" } } })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(merged.components.schemas).toHaveProperty("OnlyA")
    expect(merged.components.schemas).toHaveProperty("OnlyB")
  })

  it("unions object properties from both versions", () => {
    const a = doc("1.35.0", {
      schemas: { T: { type: "object", properties: { a: { type: "string" } } } },
    })
    const b = doc("1.35.4", {
      schemas: { T: { type: "object", properties: { b: { type: "number" } } } },
    })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(Object.keys(merged.components.schemas.T.properties).sort()).toEqual(["a", "b"])
  })

  it("unions paths and methods", () => {
    const a = doc("1.35.0", {
      paths: { "/x": { get: { operationId: "getX" } }, "/y": { get: { operationId: "getY" } } },
    })
    const b = doc("1.35.4", { paths: { "/x": { post: { operationId: "postX" } } } })

    const { merged } = mergeOpenApiDocs([a, b])

    expect(Object.keys(merged.paths).sort()).toEqual(["/x", "/y"])
    expect(Object.keys(merged.paths["/x"]).sort()).toEqual(["get", "post"])
  })

  it("falls back to newest-wins and warns on an irreconcilable scalar conflict", () => {
    const older = doc("1.35.0", { schemas: { Foo: { type: "string" } } })
    const newer = doc("1.35.4", { schemas: { Foo: { type: "number" } } })

    const { merged, warnings } = mergeOpenApiDocs([older, newer])

    expect(merged.components.schemas.Foo.type).toBe("number")
    expect(warnings.some((w) => w.includes("Foo"))).toBe(true)
  })
})
