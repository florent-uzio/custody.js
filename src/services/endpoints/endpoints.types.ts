import type { components, operations } from "../../models/custody-types.js"

// Request types
export type GetEndpointsPathParams = operations["getEndpoints"]["parameters"]["path"]
export type GetEndpointsQueryParams = operations["getEndpoints"]["parameters"]["query"]
export type GetEndpointPathParams = operations["getEndpoint"]["parameters"]["path"]

// Response types
export type Core_TrustedEndpointsCollection =
  components["schemas"]["Core_TrustedEndpointsCollection"]
export type Core_TrustedEndpoint = components["schemas"]["Core_TrustedEndpoint"]
