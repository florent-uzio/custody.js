// Times the CURRENT pipeline (openapi-typescript 7.13.0) without writing any file, for comparison.
import openapiTS, { astToString } from "openapi-typescript"

import { mergeOpenApiDocsBySurface } from "../../scripts/generate-custody-types/merge.mjs"
import { loadDocs } from "./load-docs.mjs"

const by = mergeOpenApiDocsBySurface(loadDocs())
const t = Date.now()
for (const { merged } of Object.values(by)) astToString(await openapiTS(merged))
console.log("openapi-typescript (both surfaces):", Date.now() - t, "ms")
