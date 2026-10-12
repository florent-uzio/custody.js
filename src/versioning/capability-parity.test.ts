// @ts-expect-error - works
import { existsSync, readdirSync, readFileSync } from "node:fs"
// @ts-expect-error - works
import { dirname, join } from "node:path"
// @ts-expect-error - works
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { extractCapabilities } from "../../scripts/generate-custody-types/capabilities.mjs"
import { extractCapabilitiesFromSpec } from "./detect.js"

const here = dirname(fileURLToPath(import.meta.url))

const openapiDir = join(here, "../../openapi")

// Both channels, and both surfaces within each channel (ADR-0007): the internal
// specs feed the same capability dataset, so they need the same parity check.
const specDirs = ["official", "devbox"]
  .flatMap((channel) => [join(openapiDir, channel), join(openapiDir, channel, "internal")])
  .filter((dir: string) => existsSync(dir))

const specFiles = specDirs.flatMap((dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(dir, entry.name)),
)

describe("capability extraction parity", () => {
  it("found at least one bundled spec in each channel to test against", () => {
    expect(specFiles.length).toBeGreaterThan(0)
  })

  it.each(specFiles)("runtime and generator agree on %s", (file) => {
    const doc: unknown = JSON.parse(readFileSync(file, "utf8"))

    const runtime = extractCapabilitiesFromSpec(doc)
    const generated = extractCapabilities(doc)

    expect([...runtime.endpoints].sort()).toEqual([...generated.endpoints].sort())
    expect([...runtime.schemas].sort()).toEqual([...generated.schemas].sort())
    expect(runtime.appVersion).toBe(generated.version)
  })

  it("agrees on the missing-version default for a spec with no info/paths/components", () => {
    const doc = {}

    const runtime = extractCapabilitiesFromSpec(doc)
    const generated = extractCapabilities(doc)

    expect(runtime.appVersion).toBe("unknown")
    expect(generated.version).toBe("unknown")
    expect([...runtime.endpoints]).toEqual([])
    expect(generated.endpoints).toEqual([])
    expect([...runtime.schemas]).toEqual([])
    expect(generated.schemas).toEqual([])
  })
})
