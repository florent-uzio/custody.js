// usage: node bisect.mjs <schemaName>: take 1.37.0 and overlay one schema from 1.38.0; run dtsgenerator on it.
import { readFileSync, writeFileSync } from "node:fs"

import mod from "dtsgenerator"
const rd = (v) =>
  JSON.parse(
    readFileSync(new URL(`../../openapi/official/openapi-${v}.json`, import.meta.url), "utf8"),
  )
const a = rd("1-37-0"),
  b = rd("1-38-0")
for (const name of process.argv.slice(2)) a.components.schemas[name] = b.components.schemas[name]
const t = Date.now()
const out = await mod.default({ contents: [mod.parseSchema(a)], config: {} })
console.log(process.argv.slice(2).join(","), "OK", out.length, Date.now() - t, "ms")
