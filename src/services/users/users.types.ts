import type { operations } from "../../models/custody-types.js"

// Request types

export type GetUsersPathParams = operations["getUsers"]["parameters"]["path"]
export type GetUsersQueryParams = operations["getUsers"]["parameters"]["query"]

export type GetKnownUserRolesPathParams = operations["getKnownUserRoles"]["parameters"]["path"]

// Response types

export type Core_TrustedUsersCollection =
  operations["getUsers"]["responses"]["200"]["content"]["application/json"]

export type Core_ApiRoles =
  operations["getKnownUserRoles"]["responses"]["200"]["content"]["application/json"]
