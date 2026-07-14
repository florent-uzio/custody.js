import { URLs } from "../constants/urls.js"
import type { TypedTransport } from "../transport/index.js"
import type {
  CancelUserInvitationPathParams,
  CompleteUserInvitationPathParams,
  CoreExtensions_InvitationAnswerIn,
  CoreExtensions_InvitationIn,
  CoreExtensions_InvitationOut,
  CoreExtensions_PublicInvitationOut,
  CreateUserInvitationPathParams,
  FillUserInvitationPathParams,
  GetPublicUserInvitationPathParams,
  GetUserInvitationPathParams,
  GetUserInvitationsPathParams,
  GetUserInvitationsQueryParams,
  RenewUserInvitationPathParams,
} from "./user-invitations.types.js"

export function createUserInvitations(t: TypedTransport) {
  return {
    list: (
      pathParams: GetUserInvitationsPathParams,
      query?: GetUserInvitationsQueryParams,
    ): Promise<CoreExtensions_InvitationOut> => t.get(URLs.userInvitations, pathParams, query),

    get: (params: GetUserInvitationPathParams): Promise<CoreExtensions_InvitationOut> =>
      t.get(URLs.userInvitation, params),

    create: (
      pathParams: CreateUserInvitationPathParams,
      body: CoreExtensions_InvitationIn,
    ): Promise<CoreExtensions_InvitationOut> =>
      t.post(URLs.userInvitations, body, pathParams, { sign: false }),

    fill: (
      pathParams: FillUserInvitationPathParams,
      body: CoreExtensions_InvitationAnswerIn,
    ): Promise<void> => t.post(URLs.publicUserInvitation, body, pathParams, { sign: false }),

    cancel: (pathParams: CancelUserInvitationPathParams): Promise<CoreExtensions_InvitationOut> =>
      t.post(URLs.userInvitationCancel, undefined, pathParams),

    renew: (pathParams: RenewUserInvitationPathParams): Promise<CoreExtensions_InvitationOut> =>
      t.post(URLs.userInvitationRenew, undefined, pathParams),

    complete: (
      pathParams: CompleteUserInvitationPathParams,
    ): Promise<CoreExtensions_InvitationOut> =>
      t.post(URLs.userInvitationComplete, undefined, pathParams),

    getPublic: (
      pathParams: GetPublicUserInvitationPathParams,
    ): Promise<CoreExtensions_PublicInvitationOut> => t.get(URLs.publicUserInvitation, pathParams),
  } as const
}
