import type { components, paths } from "../../models/custody-types.js"
import type { Prettify, RequiredExceptFor } from "../../type-utils/index.js"

// Request types

// Make domainId optional for better DX
export type GetUserInvitationsPathParams = Prettify<
  RequiredExceptFor<
    paths["/v1/domains/{domainId}/users/invitations"]["post"]["parameters"]["path"],
    "domainId"
  >
>
export type GetUserInvitationsQueryParams =
  paths["/v1/domains/{domainId}/users/invitations"]["get"]["parameters"]["query"]

// Make domainId optional for better DX
export type CreateUserInvitationPathParams = Prettify<
  RequiredExceptFor<
    paths["/v1/domains/{domainId}/users/invitations"]["post"]["parameters"]["path"],
    "domainId"
  >
>

export type CoreExtensions_InvitationIn = components["schemas"]["CoreExtensions_InvitationIn"]

// Make domainId optional for better DX
export type GetUserInvitationPathParams = Prettify<
  RequiredExceptFor<
    paths["/v1/domains/{domainId}/users/invitations/{id}"]["get"]["parameters"]["path"],
    "domainId"
  >
>

// Make domainId optional for better DX
export type CancelUserInvitationPathParams = Prettify<
  RequiredExceptFor<
    paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]["post"]["parameters"]["path"],
    "domainId"
  >
>

// Make domainId optional for better DX
export type RenewUserInvitationPathParams = Prettify<
  RequiredExceptFor<
    paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]["post"]["parameters"]["path"],
    "domainId"
  >
>

// Make domainId optional for better DX
export type CompleteUserInvitationPathParams = Prettify<
  RequiredExceptFor<
    paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]["post"]["parameters"]["path"],
    "domainId"
  >
>

export type FillUserInvitationPathParams =
  paths["/v1/users/invitations/{idOrCode}"]["post"]["parameters"]["path"]
export type CoreExtensions_InvitationAnswerIn =
  components["schemas"]["CoreExtensions_InvitationAnswerIn"]

export type GetPublicUserInvitationPathParams =
  paths["/v1/users/invitations/{idOrCode}"]["get"]["parameters"]["path"]

// Response types

export type CoreExtensions_InvitationOut = components["schemas"]["CoreExtensions_InvitationOut"]

export type CoreExtensions_PublicInvitationOut =
  components["schemas"]["CoreExtensions_PublicInvitationOut"]
