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
 * - `confidential` is absent whenever the issuance is not confidential, which
 *   is most of them. Whether it ever exists is the issuer's call and can change
 *   after this lookup — but it will not appear on its own, so waiting on it is
 *   waiting on someone else to act.
 * - `public` is absent when custody tracks no plain ticker for the issuance,
 *   which a confidential-only issuance is free to be.
 * - Both are absent when the issuance is unknown to this ledger — the lookup
 *   reports that by returning `{}`, not by throwing.
 *
 * So check the half you need before using it; the pair is not a guarantee that
 * either exists, and each answer describes the moment of the call.
 */
export type XrplMptIssuanceTickers = {
  /** The `MultiPurposeToken` ticker, absent if custody tracks no plain ticker. */
  public?: Core_ApiTickerData
  /**
   * The `ConfidentialMultiPurposeToken` ticker. Absent unless the issuer has
   * made the issuance confidential.
   */
  confidential?: Core_ApiTickerData
}
