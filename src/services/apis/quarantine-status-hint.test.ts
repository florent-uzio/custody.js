import { describe, expect, it } from "vitest"
import { quarantineStatusHint } from "./quarantine-status-hint.js"

describe("quarantineStatusHint", () => {
  it("returns undefined when the request had no query params", () => {
    expect(quarantineStatusHint(undefined)).toBeUndefined()
  })

  it("returns undefined when the query filtered on something else", () => {
    expect(quarantineStatusHint({ accountId: "acc-1", quarantined: true })).toBeUndefined()
  })

  it("names the parameter and the substitute when the query carried it", () => {
    const hint = quarantineStatusHint({ quarantineStatus: "Quarantined" })

    expect(hint).toContain("`quarantineStatus`")
    expect(hint).toContain("`quarantined: true`")
    expect(hint).toContain("https://github.com/florent-uzio/custody.js/issues/238")
  })

  it("fires whatever value the parameter holds, since the filter fails on all of them", () => {
    expect(quarantineStatusHint({ quarantineStatus: "Skipped" })).toBeDefined()
  })

  it("ignores a parameter left explicitly undefined, which axios never sends", () => {
    expect(quarantineStatusHint({ quarantineStatus: undefined })).toBeUndefined()
  })
})
