import type { operations } from "../../models/custody-types.js"

// Request types

export type GetLedgersQueryParams = operations["getLedgers"]["parameters"]["query"]

export type GetLedgerPathParams = operations["getLedger"]["parameters"]["path"]

// Response types

export type Core_TrustedLedgersCollection =
  operations["getLedgers"]["responses"]["200"]["content"]["application/json"]

export type Core_TrustedLedger =
  operations["getLedger"]["responses"]["200"]["content"]["application/json"]
