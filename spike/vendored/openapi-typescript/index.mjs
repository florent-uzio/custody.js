import { scanDiscriminators, resolveRef } from "./lib/utils.mjs"
import transformSchema from "./transform/index.mjs"
// Pruned vendor of openapi-typescript 7.13.0 (MIT, see LICENSE).
// Only the in-memory-object -> TS AST path with default options is kept.
import { validate } from "./validate.mjs"

export { astToString } from "./lib/ts.mjs"

export default async function openapiTS(source) {
  const schema = validate(source)
  const ctx = {
    discriminators: scanDiscriminators(schema, {}),
    injectFooter: [],
    resolve($ref) {
      return resolveRef(schema, $ref, {})
    },
  }
  return transformSchema(schema, ctx)
}
