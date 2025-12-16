import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/url/index.js"
import type { ApiService } from "../index.js"
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

export class UserInvitationService {
  constructor(private api: ApiService) {}

  /**
   * Get user invitations
   * @param pathParams - The path parameters for the request
   * @param queryParams - The query parameters for the request
   * @returns The user invitations
   */
  async getUserInvitations(
    pathParams: GetUserInvitationsPathParams,
    queryParams?: GetUserInvitationsQueryParams,
  ): Promise<CoreExtensions_InvitationOut> {
    return this.api.get<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitations, pathParams),
      queryParams,
    )
  }

  /**
   * Create a user invitation
   * @param params - The path parameters for the request
   * @param body - The body of the request
   * @returns The user invitation
   */
  async createUserInvitation(
    pathParams: CreateUserInvitationPathParams,
    body: CoreExtensions_InvitationIn,
  ): Promise<CoreExtensions_InvitationOut> {
    return this.api.post<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitations, pathParams),
      body,
    )
  }

  /**
   * Get a user invitation
   * @param pathParams - The path parameters for the request
   * @returns The user invitation
   */
  async getUserInvitation(
    pathParams: GetUserInvitationPathParams,
  ): Promise<CoreExtensions_InvitationOut> {
    return this.api.get<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitation, pathParams),
    )
  }

  /**
   * Cancel a user invitation
   * @param pathParams - The path parameters for the request
   * @returns The user invitation
   */
  async cancelUserInvitation(
    pathParams: CancelUserInvitationPathParams,
  ): Promise<CoreExtensions_InvitationOut> {
    return this.api.post<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitationCancel, pathParams),
      undefined,
    )
  }

  /**
   * Renew a user invitation
   * @param pathParams - The path parameters for the request
   * @returns The user invitation
   */
  async renewUserInvitation(
    pathParams: RenewUserInvitationPathParams,
  ): Promise<CoreExtensions_InvitationOut> {
    return this.api.post<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitationRenew, pathParams),
      undefined,
    )
  }

  /**
   * Complete a user invitation
   * @param pathParams - The path parameters for the request
   * @returns The user invitation
   */
  async completeUserInvitation(
    pathParams: CompleteUserInvitationPathParams,
  ): Promise<CoreExtensions_InvitationOut> {
    return this.api.post<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitationComplete, pathParams),
      undefined,
    )
  }

  /**
   * Fill a user invitation
   * @param pathParams - The path parameters for the request
   * @param body - The body of the request
   * @returns The user invitation
   */
  async fillUserInvitation(
    pathParams: FillUserInvitationPathParams,
    body: CoreExtensions_InvitationAnswerIn,
  ): Promise<void> {
    return this.api.post<void>(replacePathParams(URLs.publicUserInvitation, pathParams), body)
  }

  /**
   * Get a public user invitation
   * @param pathParams - The path parameters for the request
   * @returns The public user invitation
   */
  async getPublicUserInvitation(
    pathParams: GetPublicUserInvitationPathParams,
  ): Promise<CoreExtensions_PublicInvitationOut> {
    return this.api.get<CoreExtensions_PublicInvitationOut>(
      replacePathParams(URLs.publicUserInvitation, pathParams),
    )
  }
}
