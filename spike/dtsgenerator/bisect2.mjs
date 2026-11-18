// usage: node bisect2.mjs <spec> <path-substring>... — keep only paths containing one of the substrings (all schemas kept)
import { readFileSync } from "node:fs"

import mod from "dtsgenerator"
const doc = JSON.parse(
  readFileSync(new URL(`../../openapi/${process.argv[2]}`, import.meta.url), "utf8"),
)
const subs = process.argv.slice(3)
if (subs[0] === "NONE") doc.paths = {}
else if (subs.length)
  doc.paths = Object.fromEntries(
    Object.entries(doc.paths).filter(([p]) => subs.some((s) => p === s)),
  )
const t = Date.now()
const out = await mod.default({ contents: [mod.parseSchema(doc)], config: {} })
console.log(Object.keys(doc.paths).length, "paths OK", out.length, Date.now() - t, "ms")
