import type { components, paths } from "../../models/custody-types.js"

// Request types

export type GetUserInvitationsPathParams =
  paths["/v1/domains/{domainId}/users/invitations"]["post"]["parameters"]["path"]
export type GetUserInvitationsQueryParams =
  paths["/v1/domains/{domainId}/users/invitations"]["get"]["parameters"]["query"]

export type CreateUserInvitationPathParams =
  paths["/v1/domains/{domainId}/users/invitations"]["post"]["parameters"]["path"]

export type CoreExtensions_InvitationIn = components["schemas"]["CoreExtensions_InvitationIn"]

export type GetUserInvitationPathParams =
  paths["/v1/domains/{domainId}/users/invitations/{id}"]["get"]["parameters"]["path"]

export type CancelUserInvitationPathParams =
  paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]["post"]["parameters"]["path"]

export type RenewUserInvitationPathParams =
  paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]["post"]["parameters"]["path"]

export type CompleteUserInvitationPathParams =
  paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]["post"]["parameters"]["path"]

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
