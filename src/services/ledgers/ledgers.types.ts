import type { operations } from "../../models/custody-types.js"

// Request types

export type GetLedgersQueryParams = operations["getLedgers"]["parameters"]["query"]

// Response types

export type Core_TrustedLedgersCollection =
  operations["getLedgers"]["responses"]["200"]["content"]["application/json"]
