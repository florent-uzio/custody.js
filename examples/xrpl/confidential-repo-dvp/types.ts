import type { components } from "../../../src/models/custody-internal-types.js"

export type Wallet = {
  name: string
  id: string
  address: string
}

/**
 * The two MPT ticker flavors `findXrplTicker` looks up: the plain issuance and
 * its confidential counterpart. Narrowed from `Internal_XrplTickerProperties`,
 * whose `type` also covers `FungibleToken` and `Native` tickers this example
 * never queries.
 */
export type MptTickerType = Extract<
  components["schemas"]["Internal_XrplTickerProperties"]["type"],
  "MultiPurposeToken" | "ConfidentialMultiPurposeToken"
>

export type HolderBalance = {
  mmfPublic: number
  mmfConfidentialSpendable: number
  mmfConfidentialInbox: number
  isMmfConfidential: boolean
  rlusdPublic: number
  rlusdConfidentialSpendable: number
  rlusdConfidentialInbox: number
  isRlusdConfidential: boolean
}

export type Balances = {
  sellerBalances: HolderBalance
  buyerBalances: HolderBalance
}
