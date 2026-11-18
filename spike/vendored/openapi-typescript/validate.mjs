// Replaces lib/redoc.mjs (@redocly/openapi-core lint + bundle) for an in-memory,
// already-merged, ref-local document. Keeps the two behaviours that matter:
// the OpenAPI 3.x version gate and the "operationId must be unique" error, and
// adds a check that every $ref is a local `#/...` pointer that resolves (the
// precondition that makes Redocly's bundle step an identity).
import { parseRef } from "./lib/ref-utils.mjs"

const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"]

export function validate(doc) {
  const version = Number.parseFloat(doc?.openapi)
  if (doc?.swagger) throw new Error("Unsupported Swagger version: 2.x. Use OpenAPI 3.x instead.")
  if (!doc?.openapi || Number.isNaN(version) || version < 3 || version >= 4) {
    throw new Error(`Unsupported OpenAPI version: ${doc?.openapi}`)
  }

  const seen = new Set()
  for (const [url, item] of Object.entries(doc.paths ?? {})) {
    for (const method of METHODS) {
      const id = item?.[method]?.operationId
      if (!id) continue
      if (seen.has(id))
        throw new Error(`operationId must be unique: "${id}" (${method.toUpperCase()} ${url})`)
      seen.add(id)
    }
  }

  const walk = (node, path) => {
    if (!node || typeof node !== "object") return
    if (typeof node.$ref === "string") {
      if (!node.$ref.startsWith("#/"))
        throw new Error(`Only local $refs are supported, got "${node.$ref}" at ${path}`)
      let target = doc
      for (const key of parseRef(node.$ref).pointer) target = target?.[key]
      if (target === undefined) throw new Error(`Unresolved $ref "${node.$ref}" at ${path}`)
    }
    for (const [key, value] of Object.entries(node)) walk(value, `${path}/${key}`)
  }
  walk(doc, "#")
  return doc
}
