// loadDocs copied (minus doc comments and stray-file checks) from
// scripts/generate-custody-types/generate.mjs — the real generator is untouched.
import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { INTERNAL_SURFACE, PUBLIC_SURFACE } from "../../scripts/generate-custody-types/merge.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const openapiDir = join(here, "..", "..", "openapi")

export function loadDocs() {
  const entries = readdirSync(openapiDir, { withFileTypes: true })
  const channels = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
  const docs = []
  for (const channel of channels) {
    const channelDir = join(openapiDir, channel)
    const channelEntries = readdirSync(channelDir, { withFileTypes: true })
    const sources = [
      { surface: PUBLIC_SURFACE, dir: channelDir },
      { surface: INTERNAL_SURFACE, dir: join(channelDir, INTERNAL_SURFACE), optional: true },
    ]
    for (const { surface, dir, optional } of sources) {
      if (optional && !channelEntries.some((e) => e.isDirectory() && e.name === INTERNAL_SURFACE)) {
        continue
      }
      for (const file of readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .sort()) {
        docs.push({ channel, surface, doc: JSON.parse(readFileSync(join(dir, file), "utf8")) })
      }
    }
  }
  return docs
}
