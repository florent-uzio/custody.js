// Reads semantic-diff.tsc.txt and writes mismatches.txt (one line per mismatching item) + summary counts.
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const tsc = readFileSync(join(here, "semantic-diff.tsc.txt"), "utf8")
const out = []
for (const surface of ["public", "internal"]) {
  const src = readFileSync(join(here, `semantic-diff.${surface}.ts`), "utf8").split("\n")
  const total = JSON.parse(readFileSync(join(here, `semantic-diff.${surface}.items.json`), "utf8"))
  const bad = [...tsc.matchAll(new RegExp(`semantic-diff\\.${surface}\\.ts\\((\\d+),`, "g"))].map(
    (m) => src[Number(m[1]) - 1],
  )
  const byKind = {}
  for (const l of bad) {
    const k = l.split("// ")[1].split(" ")[0]
    byKind[k] = (byKind[k] || 0) + 1
  }
  console.log(surface, "total", total.length, "mismatches", bad.length, byKind)
  for (const l of bad) out.push(`${surface} ${l.split("// ")[1]}`)
}
writeFileSync(join(here, "mismatches.txt"), out.join("\n") + "\n")
