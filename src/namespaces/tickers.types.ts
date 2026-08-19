import type { components, operations } from "../models/custody-types.js"
import type { XrplLedgerId } from "../models/ledger-ids.js"

// Request types

export type GetTickersQueryParams = operations["getTickers"]["parameters"]["query"]

export type GetTickerPathParams = operations["getTicker"]["parameters"]["path"]

export type FindByXrplMptIssuanceIdOptions = {
  /**
   * The XRPL ledger to search. Required: an MPT issuance ID only identifies a
   * token within one network, and this is the single filter `getTickers`
   * applies server-side.
   */
  ledgerId: XrplLedgerId
}

// Response types

export type Core_TickersCollection =
  operations["getTickers"]["responses"]["200"]["content"]["application/json"]

export type Core_ApiTicker =
  operations["getTicker"]["responses"]["200"]["content"]["application/json"]

export type Core_ApiTickerData = components["schemas"]["Core_ApiTickerData"]

/**
 * The tickers custody holds for one XRPL MPT issuance ID.
 *
 * Both halves are optional and independent, and **neither is implied by the
 * other**:
 *
 * - Most MPT issuances are not confidential at all, so `confidential` is absent
 *   permanently — not pending. Nothing will make it appear, and code that waits
 *   for it waits forever.
 * - `public` is absent when custody tracks no plain ticker for the issuance,
 *   which a confidential-only issuance is free to be.
 * - Both are absent when the issuance is unknown to this ledger — the lookup
 *   reports that by returning `{}`, not by throwing.
 *
 * So check the half you need before using it; the pair is not a guarantee that
 * either exists.
 */
export type XrplMptIssuanceTickers = {
  /** The `MultiPurposeToken` ticker, absent if custody tracks no plain ticker. */
  public?: Core_ApiTickerData
  /**
   * The `ConfidentialMultiPurposeToken` ticker. Absent unless the issuance is
   * confidential — for a plain MPT there is never one to find.
   */
  confidential?: Core_ApiTickerData
}
