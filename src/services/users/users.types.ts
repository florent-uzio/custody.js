import type { operations } from "../../models/custody-types.js"
import type { Prettify, RequiredExceptFor } from "../../type-utils/index.js"

// Request types

// Make domainId optional for better DX
export type GetUsersPathParams = Prettify<
  RequiredExceptFor<operations["getUsers"]["parameters"]["path"], "domainId">
>
export type GetUsersQueryParams = operations["getUsers"]["parameters"]["query"]

// Make domainId optional for better DX
export type GetKnownUserRolesPathParams = Prettify<
  RequiredExceptFor<operations["getKnownUserRoles"]["parameters"]["path"], "domainId">
>

// Make domainId optional for better DX
export type GetUserPathParams = Prettify<
  RequiredExceptFor<operations["getUser"]["parameters"]["path"], "domainId">
>

// Response types

export type Core_TrustedUsersCollection =
  operations["getUsers"]["responses"]["200"]["content"]["application/json"]

export type Core_ApiRoles =
  operations["getKnownUserRoles"]["responses"]["200"]["content"]["application/json"]

export type Core_TrustedUser =
  operations["getUser"]["responses"]["200"]["content"]["application/json"]

export type Core_MeReference =
  operations["getMe"]["responses"]["200"]["content"]["application/json"]
