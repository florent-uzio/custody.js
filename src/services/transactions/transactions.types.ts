import type { components, operations } from "../../models/custody-types.js"

// Request types
export type GetTransactionOrdersPathParams = operations["getOrders"]["parameters"]["path"]
export type GetTransactionOrdersQueryParams = operations["getOrders"]["parameters"]["query"]

export type GetTransactionOrderDetailsPathParams = operations["getOrder"]["parameters"]["path"]

// Response types
export type Core_TrustedTransactionOrdersCollection =
  components["schemas"]["Core_TrustedTransactionOrdersCollection"]

export type Core_TrustedTransactionOrderDetails =
  components["schemas"]["Core_TrustedTransactionOrder"]
