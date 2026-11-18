import ts from "typescript-printer"

import { tsModifiers, tsRecord, NEVER, STRING } from "../lib/ts.mjs"
import transformComponentsObject from "./components-object.mjs"
import transformPathsObject from "./paths-object.mjs"

// Pruned: `webhooks` and `$defs` are not exercised by our specs; they are
// emitted as `Record<string, never>` (as upstream does for an absent root),
// and a spec that actually uses them is rejected.
const transformers = {
  paths: transformPathsObject,
  webhooks: undefined,
  components: transformComponentsObject,
  $defs: undefined,
}
function emptyRoot(root) {
  return ts.factory.createTypeAliasDeclaration(
    tsModifiers({ export: true }),
    root,
    void 0,
    tsRecord(STRING, NEVER),
  )
}
function transformSchema(schema, ctx) {
  const type = []
  for (const root of Object.keys(transformers)) {
    if (schema[root] && typeof schema[root] === "object") {
      if (!transformers[root]) {
        throw new Error(`Unsupported root "${root}": not exercised by the bundled specs`)
      }
      const subType = transformers[root](schema[root], ctx)
      if (subType.members?.length) {
        type.push(
          ts.factory.createInterfaceDeclaration(
            tsModifiers({ export: true }),
            root,
            void 0,
            void 0,
            subType.members,
          ),
        )
      } else {
        type.push(emptyRoot(root))
      }
    } else {
      type.push(emptyRoot(root))
    }
  }
  const hasOperations = ctx.injectFooter.some((node) => node?.name?.escapedText === "operations")
  for (const injectedType of ctx.injectFooter) {
    type.push(injectedType)
  }
  if (!hasOperations) {
    type.push(emptyRoot("operations"))
  }
  return type
}

export { transformSchema as default }
