import type { components, operations } from "../../models/custody-types.js"
import type { Prettify, RequiredExceptFor } from "../../type-utils/index.js"

// Request types

// Make domainId optional for better DX
export type GetRequestStatePathParams = Prettify<
  RequiredExceptFor<operations["getRequestState"]["parameters"]["path"], "domainId">
>
export type GetRequestStateQueryParams = operations["getRequestState"]["parameters"]["query"]

export type GetAllUserRequestsStateQueryParams =
  operations["getAllUserRequestsState"]["parameters"]["query"]

// Make domainId optional for better DX
export type GetAllUserRequestsStateInDomainPathParams = Prettify<
  RequiredExceptFor<operations["getAllUserRequestsStateInDomain"]["parameters"]["path"], "domainId">
>
export type GetAllUserRequestsStateInDomainQueryParams =
  operations["getAllUserRequestsStateInDomain"]["parameters"]["query"]

// Response types

export type Core_RequestState = components["schemas"]["Core_RequestState"]
