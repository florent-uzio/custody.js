import { describe, expectTypeOf, it } from "vitest"

import type { XrplService } from "../../services/xrpl/index.js"
import type { Transport } from "../../transport/index.js"
import { createTransactions } from "../transactions.js"
import type { ReleaseQuarantinedTransfersResult } from "../transactions.types.js"

const transactions = createTransactions({} as Transport)
const xrpl = {} as XrplService
const account = { domainId: "d-1", accountId: "a-1" }
const address = "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"

describe("releaseQuarantinedTransfers selection", () => {
  it("requires exactly one of `transferIds` or `all: true`", () => {
    // Never invoked: only the compiler's verdict matters here.
    ;() => {
      void transactions.releaseQuarantinedTransfers({ ...account, transferIds: ["t-1"] })
      void transactions.releaseQuarantinedTransfers({ ...account, all: true })
      void transactions.releaseQuarantinedTransfers({ ...account, all: true, tickerId: "tk-1" })

      // @ts-expect-error — neither: nothing is released by default
      void transactions.releaseQuarantinedTransfers(account)
      // @ts-expect-error — both
      void transactions.releaseQuarantinedTransfers({ ...account, all: true, transferIds: ["t-1"] })
      // @ts-expect-error — a ticker filter only narrows `all: true`
      void transactions.releaseQuarantinedTransfers({
        ...account,
        transferIds: ["t-1"],
        tickerId: "tk",
      })
      // @ts-expect-error — `all` must be literally true
      void transactions.releaseQuarantinedTransfers({ ...account, all: false })
    }
  })

  it("XRPL: narrows `all: true` by one asset", () => {
    ;() => {
      void xrpl.releaseQuarantinedTransfers({ address, transferIds: ["t-1"] })
      void xrpl.releaseQuarantinedTransfers({ address, all: true })
      void xrpl.releaseQuarantinedTransfers({
        address,
        all: true,
        asset: { type: "MultiPurposeToken", issuanceId: "00" },
      })
      void xrpl.releaseQuarantinedTransfers({
        address,
        all: true,
        asset: { type: "Currency", code: "RLUSD", issuer: address },
      })
      void xrpl.releaseQuarantinedTransfers({ address, all: true, asset: { type: "Native" } })
      void xrpl.releaseQuarantinedTransfers({
        address,
        all: true,
        asset: { type: "TickerId", tickerId: "tk-1" },
      })

      // @ts-expect-error — neither
      void xrpl.releaseQuarantinedTransfers({ address })
      // @ts-expect-error — the ticker goes in `asset`, not beside it
      void xrpl.releaseQuarantinedTransfers({ address, all: true, tickerId: "tk" })
      const missingIssuer = {
        address,
        all: true as const,
        asset: { type: "Currency" as const, code: "RLUSD" },
      }
      // @ts-expect-error — an IOU needs its issuer
      void xrpl.releaseQuarantinedTransfers(missingIssuer)

      const assetWithIds = { address, transferIds: ["t-1"], asset: { type: "Native" as const } }
      // @ts-expect-error — `asset` only narrows `all: true`
      void xrpl.releaseQuarantinedTransfers(assetWithIds)
    }
  })
})

describe("releaseQuarantinedTransfers result", () => {
  it("carries the intent ids only once `proposed` is narrowed to true", () => {
    const result = {} as ReleaseQuarantinedTransfersResult

    // @ts-expect-error — not on the nothing-to-release branch
    result.requestId

    if (result.proposed) {
      expectTypeOf(result.requestId).toBeString()
      expectTypeOf(result.intentId).toBeString()
    } else {
      expectTypeOf(result.transferIds).toEqualTypeOf<[]>()
    }
  })
})
