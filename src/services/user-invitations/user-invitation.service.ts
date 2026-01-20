import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/url/index.js"
import type { ApiService } from "../index.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import { DomainResolverService } from "../domain-resolver/index.js"
import { UsersService } from "../users/index.js"
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
  private readonly domainResolver: DomainResolverService

  constructor(
    private api: ApiService,
    domainCache?: DomainCacheService,
  ) {
    const usersService = new UsersService(api)
    this.domainResolver = new DomainResolverService(() => usersService.getMe(), domainCache)
  }

  /**
   * Get user invitations
   * @param pathParams - The path parameters for the request
   * @param queryParams - The query parameters for the request
   * @returns The user invitations
   */
  async getUserInvitations(
    pathParams?: GetUserInvitationsPathParams,
    queryParams?: GetUserInvitationsQueryParams,
  ): Promise<CoreExtensions_InvitationOut> {
    const domainId = pathParams?.domainId ?? (await this.resolveDomainId())
    return this.api.get<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitations, { ...pathParams, domainId }),
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
    const domainId = pathParams.domainId ?? (await this.resolveDomainId())
    return this.api.post<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitations, { ...pathParams, domainId }),
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
    const domainId = pathParams.domainId ?? (await this.resolveDomainId())
    return this.api.get<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitation, { ...pathParams, domainId }),
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
    const domainId = pathParams.domainId ?? (await this.resolveDomainId())
    return this.api.post<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitationCancel, { ...pathParams, domainId }),
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
    const domainId = pathParams.domainId ?? (await this.resolveDomainId())
    return this.api.post<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitationRenew, { ...pathParams, domainId }),
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
    const domainId = pathParams.domainId ?? (await this.resolveDomainId())
    return this.api.post<CoreExtensions_InvitationOut>(
      replacePathParams(URLs.userInvitationComplete, { ...pathParams, domainId }),
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

  /**
   * Resolves the domain ID using the DomainResolverService.
   * Uses caching to avoid repeated API calls.
   * @returns The resolved domain ID
   * @throws {CustodyError} If domain resolution fails
   */
  private async resolveDomainId(): Promise<string> {
    const { domainId } = await this.domainResolver.resolveDomainOnly()
    return domainId
  }
}
