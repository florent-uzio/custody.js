import type { operations } from "../../models/custody-types.js"

// Request types

export type GetVaultsQueryParams = operations["getVaults"]["parameters"]["query"]

// Response types

export type Core_VaultsCollection =
  operations["getVaults"]["responses"]["200"]["content"]["application/json"]
