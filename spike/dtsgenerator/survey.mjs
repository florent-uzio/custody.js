import { mergeOpenApiDocsBySurface } from "../../scripts/generate-custody-types/merge.mjs"
import { loadDocs } from "./load-docs.mjs"

const by = mergeOpenApiDocsBySurface(loadDocs())
for (const [s, { merged: d }] of Object.entries(by)) {
  const ct = {}
  const st = {}
  const noop = []
  const pin = new Set()
  let ops = 0
  let refParams = 0
  let pathLevelParams = 0
  for (const [p, item] of Object.entries(d.paths)) {
    if (item.parameters) pathLevelParams++
    for (const [m, op] of Object.entries(item)) {
      if (!["get", "put", "post", "delete", "patch", "options", "head", "trace"].includes(m))
        continue
      ops++
      if (!op.operationId) noop.push(m + " " + p)
      for (const prm of op.parameters ?? []) {
        pin.add(prm.in ?? "REF")
        if (prm.$ref) refParams++
      }
      for (const c of Object.keys(op.requestBody?.content ?? {}))
        ct["req " + c] = (ct["req " + c] ?? 0) + 1
      if (op.requestBody?.$ref) ct.reqRef = (ct.reqRef ?? 0) + 1
      for (const [code, r] of Object.entries(op.responses ?? {})) {
        st[code] = (st[code] ?? 0) + 1
        if (r.$ref) ct.respRef = (ct.respRef ?? 0) + 1
        for (const c of Object.keys(r.content ?? {})) ct["res " + c] = (ct["res " + c] ?? 0) + 1
      }
    }
  }
  console.log(s, {
    ops,
    schemas: Object.keys(d.components.schemas).length,
    noopId: noop.length,
    noopSample: noop.slice(0, 8),
    pathLevelParams,
    refParams,
    pin: [...pin],
    ct,
    statuses: st,
    compKeys: Object.keys(d.components),
  })
}
