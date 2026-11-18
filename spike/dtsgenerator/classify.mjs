// Assigns each mismatching item to root-cause buckets (an item may hit several). Output: out/classification.json + table.
import { readFileSync, writeFileSync } from "node:fs"
const res = JSON.parse(readFileSync(new URL("./out/explain.json", import.meta.url), "utf8"))
const buckets = {
  "free-form object (additionalProperties: old {[k]: never}, new {[k]: any})": (d) =>
    d.cat === "index-signature" && /never/.test(d.old) && /any/.test(d.new),
  "Omit<discriminated union,'type'> collapsed to {} in old, precise union in new": (d) =>
    d.cat === "union-member-unmatched" &&
    (d.old === "{}" || /type: "(Account|Address|Endpoint)"/.test(d.new)),
  "allOf + required: old intersects to never, new has the properties": (d) =>
    d.cat === "prop-extra-in-new" && d.old === "",
  "schema default => required (openapi-typescript defaultNonNullable), new optional": (d) =>
    d.cat === "optionality",
  "oneOf discriminator mapping: old single merged member, new one member per mapping": (d) =>
    d.cat === "union-member-unmatched" && /^\{ properties: /.test(d.old + d.new),
}
const out = {}
const unclassified = []
for (const r of res) {
  const hit = new Set()
  for (const d of r.diffs) {
    const name = Object.keys(buckets).find((b) => buckets[b](d))
    if (name) hit.add(name)
  }
  if (r.diffs.every((d) => d.cat === "no-structural-diff-found"))
    hit.add("cascade (deeper nested diff below depth cutoff; same root causes)")
  if (hit.size === 0) unclassified.push(r)
  for (const h of hit) (out[h] ??= []).push(`${r.surface}:${r.kind}:${r.id}`)
}
writeFileSync(
  new URL("./out/classification.json", import.meta.url),
  JSON.stringify({ out, unclassified }, null, 1),
)
for (const [k, v] of Object.entries(out)) console.log(String(v.length).padStart(4), k)
console.log("unclassified:", unclassified.length)
for (const u of unclassified)
  console.log(
    "  ",
    u.surface,
    u.kind,
    u.id,
    "\n     ",
    u.diffs
      .slice(0, 3)
      .map((d) => `${d.cat} ${d.path.slice(0, 60)} | ${d.old.slice(0, 60)} | ${d.new.slice(0, 60)}`)
      .join("\n      "),
  )
