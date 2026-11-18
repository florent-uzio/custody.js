import { describe, expect, it } from "vitest"

import { diffOpenApiSpecs, formatDiff } from "./diff-openapi.mjs"

function doc(v, { paths = {}, schemas = {} } = {}) {
  return { info: { "x-app-version": v }, paths, components: { schemas } }
}

describe("diffOpenApiSpecs", () => {
  it("reports operations added, removed and changed, ignoring non-method keys", () => {
    const before = doc("1.0.0", {
      paths: {
        "/a": { get: { operationId: "getA" }, parameters: [{ name: "x" }] },
        "/b": { post: { operationId: "postB" } },
      },
    })
    const after = doc("1.0.1", {
      paths: {
        "/a": { get: { operationId: "getA", deprecated: true }, parameters: [{ name: "y" }] },
        "/c": { put: { operationId: "putC" } },
      },
    })

    expect(diffOpenApiSpecs(before, after).operations).toEqual({
      added: ["PUT /c"],
      removed: ["POST /b"],
      changed: ["GET /a"],
    })
  })

  it("reports schemas added, removed and changed", () => {
    const before = doc("1.0.0", { schemas: { Keep: { type: "string" }, Gone: {}, Edit: {} } })
    const after = doc("1.0.1", { schemas: { Keep: { type: "string" }, Edit: { a: 1 }, New: {} } })

    expect(diffOpenApiSpecs(before, after).schemas).toEqual({
      added: ["New"],
      removed: ["Gone"],
      changed: ["Edit"],
    })
  })

  it("treats key order as irrelevant", () => {
    const before = doc("1.0.0", { schemas: { S: { a: 1, b: 2 } } })
    const after = doc("1.0.1", { schemas: { S: { b: 2, a: 1 } } })

    expect(diffOpenApiSpecs(before, after).schemas.changed).toEqual([])
  })
})

describe("formatDiff", () => {
  it("prints the versions and a count per category", () => {
    const out = formatDiff(diffOpenApiSpecs(doc("1.0.0"), doc("1.0.1", { schemas: { New: {} } })))

    expect(out).toContain("OpenAPI diff 1.0.0 -> 1.0.1")
    expect(out).toContain("schemas added: 1\n  New")
    expect(out).toContain("operations changed: 0")
  })
})
