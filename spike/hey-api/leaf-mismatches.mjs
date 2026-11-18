// Splits mismatching schemas into "leaf" (no referenced schema also mismatches) vs "transitive".
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const lines = readFileSync(join(here, "mismatches.txt"), "utf8").trim().split("\n")
for (const surface of ["public", "internal"]) {
  const bad = new Set(
    lines.filter((l) => l.startsWith(`${surface} schema `)).map((l) => l.split(" ")[2]),
  )
  const old = readFileSync(join(here, "baseline", `old-${surface}.ts`), "utf8").split("\n")
  const start = old.findIndex((l) => l === "export interface components {")
  const blocks = {}
  let cur = null
  for (let i = start; i < old.length; i++) {
    const m = old[i].match(/^ {4}([\w$]+):/)
    if (m) ((cur = m[1]), (blocks[cur] = []))
    if (cur) blocks[cur].push(old[i])
    if (/^ {2}responses:/.test(old[i])) break
  }
  const leaf = []
  const trans = []
  for (const s of bad) {
    const refs = [
      ...(blocks[s] ?? []).join("\n").matchAll(/components\["schemas"\]\["([^"]+)"\]/g),
    ].map((m) => m[1])
    ;(refs.some((r) => bad.has(r) && r !== s) ? trans : leaf).push(s)
  }
  console.log(`${surface}: schema mismatches ${bad.size}, leaf ${leaf.length}: ${leaf.join(", ")}`)
  console.log(`${surface}: transitive ${trans.length}`)
}
