// @ts-expect-error - works
import { readdirSync, readFileSync } from "node:fs"
// @ts-expect-error - works
import { dirname, join } from "node:path"
// @ts-expect-error - works
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { extractCapabilities } from "../../scripts/generate-custody-types/capabilities.mjs"
import { extractCapabilitiesFromSpec } from "./detect.js"

const here = dirname(fileURLToPath(import.meta.url))

const specDirs = [join(here, "../../openapi/official"), join(here, "../../openapi/devbox")]

const specFiles = specDirs.flatMap((dir) =>
  readdirSync(dir)
    .filter((name: string) => name.endsWith(".json"))
    .map((name: string) => join(dir, name)),
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
