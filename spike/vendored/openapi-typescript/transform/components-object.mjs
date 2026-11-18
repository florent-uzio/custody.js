import ts from "typescript-printer"

import { tsPropertyIndex, addJSDocComment, NEVER } from "../lib/ts.mjs"
import { getEntries, createRef } from "../lib/utils.mjs"
import transformSchemaObject from "./schema-object.mjs"

// Pruned: only `components.schemas` is exercised. The other component maps are
// emitted as `never` (as upstream does when empty); populated ones are rejected.
const COMPONENT_KEYS = [
  "schemas",
  "responses",
  "parameters",
  "requestBodies",
  "headers",
  "pathItems",
]
function transformComponentsObject(componentsObject, ctx) {
  const type = []
  for (const key of COMPONENT_KEYS) {
    const items = []
    if (componentsObject[key]) {
      if (key !== "schemas" && Object.keys(componentsObject[key]).length) {
        throw new Error(`Unsupported components.${key}: not exercised by the bundled specs`)
      }
      for (const [name, item] of getEntries(componentsObject[key])) {
        const subType = transformSchemaObject(item, {
          path: createRef(["components", key, name]),
          schema: item,
          ctx,
        })
        const property = ts.factory.createPropertySignature(
          void 0,
          tsPropertyIndex(name),
          void 0,
          subType,
        )
        addJSDocComment(item, property)
        items.push(property)
      }
    }
    type.push(
      ts.factory.createPropertySignature(
        void 0,
        tsPropertyIndex(key),
        void 0,
        items.length ? ts.factory.createTypeLiteralNode(items) : NEVER,
      ),
    )
  }
  return ts.factory.createTypeLiteralNode(type)
}

export { transformComponentsObject as default }
