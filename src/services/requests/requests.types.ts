import type { components, operations } from "../../models/custody-types.js"

// Request types

export type GetRequestStatePathParams = operations["getRequestState"]["parameters"]["path"]
export type GetRequestStateQueryParams = operations["getRequestState"]["parameters"]["query"]

export type GetAllUserRequestsStateQueryParams =
  operations["getAllUserRequestsState"]["parameters"]["query"]

export type GetAllUserRequestsStateInDomainPathParams =
  operations["getAllUserRequestsStateInDomain"]["parameters"]["path"]
export type GetAllUserRequestsStateInDomainQueryParams =
  operations["getAllUserRequestsStateInDomain"]["parameters"]["query"]

// Response types

export type Core_RequestState = components["schemas"]["Core_RequestState"]
