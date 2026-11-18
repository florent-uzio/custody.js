import { UNKNOWN } from "../lib/ts.mjs"
import transformSchemaObject from "./schema-object.mjs"

function transformHeaderObject(headerObject, options) {
  if (headerObject.schema) {
    return transformSchemaObject(headerObject.schema, options)
  }
  if (headerObject.content) {
    throw new Error("Unsupported header `content`: not exercised by the bundled specs")
  }
  return UNKNOWN
}

export { transformHeaderObject as default }
