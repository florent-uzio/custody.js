// Groups out/explain.json leaf diffs by (cat, old, new) so root causes stand out.
import { readFileSync } from "node:fs"
const res = JSON.parse(readFileSync(new URL("./out/explain.json", import.meta.url), "utf8"))
const g = new Map()
for (const r of res)
  for (const d of r.diffs) {
    const k = `${d.cat} | old: ${d.old.slice(0, 90)} | new: ${d.new.slice(0, 90)}`
    const e = g.get(k) ?? { n: 0, items: new Set(), ex: d.path }
    e.n++
    e.items.add(`${r.surface}:${r.kind}:${r.id.slice(0, 50)}`)
    g.set(k, e)
  }
for (const [k, e] of [...g].sort((a, b) => b[1].n - a[1].n).slice(0, Number(process.argv[2] ?? 40)))
  console.log(
    `${String(e.n).padStart(4)}x  items=${e.items.size}  ${k}\n        e.g. ${e.ex.slice(0, 110)}`,
  )
