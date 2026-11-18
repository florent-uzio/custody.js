// Runs bisect.mjs for several schema subsets in child processes (1 GB heap cap) and reports OK / OOM / error.
import { spawnSync } from "node:child_process"
const sets = JSON.parse(process.argv[2])
for (const set of sets) {
  const r = spawnSync(
    "node",
    ["--max-old-space-size=1000", new URL("./bisect.mjs", import.meta.url).pathname, ...set],
    { encoding: "utf8" },
  )
  const all = r.stdout + r.stderr
  const verdict = /FATAL ERROR/.test(all)
    ? "OOM"
    : /OK/.test(all)
      ? "ok"
      : "ERR " + (all.match(/Error: .*/) ?? [""])[0]
  console.log(verdict.padEnd(6), set.join(" "))
}
