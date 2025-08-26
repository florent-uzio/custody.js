import type { operations } from "../../models/custody-types.js"

// Request types

export type GetTickerPathParams = operations["getTicker"]["parameters"]["path"]

// Response types

export type Core_TickersCollection =
  operations["getTickers"]["responses"]["200"]["content"]["application/json"]

export type Core_ApiTicker =
  operations["getTicker"]["responses"]["200"]["content"]["application/json"]
