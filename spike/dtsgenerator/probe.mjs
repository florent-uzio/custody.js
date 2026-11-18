// usage: node probe.mjs <file relative to openapi/> — run dtsgenerator on a single unmerged spec
import { readFileSync } from "node:fs"

import mod from "dtsgenerator"
const doc = JSON.parse(
  readFileSync(new URL(`../../openapi/${process.argv[2]}`, import.meta.url), "utf8"),
)
const t = Date.now()
const out = await mod.default({ contents: [mod.parseSchema(doc)], config: {} })
console.log(process.argv[2], out.length, "chars", Date.now() - t, "ms")
