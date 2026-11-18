// Joins tsc output with the manifests: prints totals + mismatches by kind. Usage: node semantic-diff-report.mjs [--list]
import { readFileSync, writeFileSync } from "node:fs"

const tsc = readFileSync(new URL("./out/semantic-diff-tsc.txt", import.meta.url), "utf8")
const summary = {}
const rows = []
for (const surface of ["public", "internal"]) {
  const manifest = JSON.parse(
    readFileSync(new URL(`./semantic-diff.${surface}.manifest.json`, import.meta.url), "utf8"),
  )
  const total = {}
  for (const v of Object.values(manifest)) total[v.kind] = (total[v.kind] ?? 0) + 1
  const bad = {}
  const re = new RegExp(`semantic-diff\\.${surface}\\.ts\\((\\d+),\\d+\\): error`, "g")
  for (const m of tsc.matchAll(re)) {
    const item = manifest[m[1]]
    if (!item) continue
    bad[item.kind] = (bad[item.kind] ?? 0) + 1
    rows.push({ surface, line: Number(m[1]), ...item })
  }
  summary[surface] = { total, mismatches: bad }
}
console.log(JSON.stringify(summary, null, 1))
writeFileSync(new URL("./out/mismatches.json", import.meta.url), JSON.stringify(rows, null, 1))
if (process.argv.includes("--list")) for (const r of rows) console.log(r.surface, r.kind, r.id)
