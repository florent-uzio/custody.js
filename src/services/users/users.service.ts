import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { CustodyError } from "../../models/custody-error.js"
import { ApiService } from "../apis/api.service.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import { DomainResolverService } from "../domain-resolver/index.js"
import type {
  Core_ApiRoles,
  Core_MeReference,
  Core_TrustedUser,
  Core_TrustedUsersCollection,
  GetKnownUserRolesPathParams,
  GetUserPathParams,
  GetUsersPathParams,
  GetUsersQueryParams,
} from "./users.types.js"

export class UsersService {
  private readonly domainResolver?: DomainResolverService

  constructor(
    private api: ApiService,
    domainCache?: DomainCacheService,
  ) {
    // Only create domain resolver if cache is provided
    // The resolver uses getMe() from this service via function injection to avoid circular deps
    if (domainCache) {
      this.domainResolver = new DomainResolverService(() => this.getMe(), domainCache)
    }
  }

  /**
   * Get users
   * @param pathParams - The path parameters for the request
   * @param queryParams - The query parameters for the request
   * @returns The users
   */
  async getUsers(
    params?: GetUsersPathParams,
    queryParams?: GetUsersQueryParams,
  ): Promise<Core_TrustedUsersCollection> {
    const domainId = params?.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_TrustedUsersCollection>(
      replacePathParams(URLs.users, { domainId }),
      queryParams,
    )
  }

  /**
   * Get known user roles
   * @param pathParams - The path parameters for the request
   * @returns The known user roles
   */
  async getKnownUserRoles(params?: GetKnownUserRolesPathParams): Promise<Core_ApiRoles> {
    const domainId = params?.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_ApiRoles>(replacePathParams(URLs.userRoles, { domainId }))
  }

  /**
   * Get user
   * @param pathParams - The path parameters for the request
   * @returns The user
   */
  async getUser(params: GetUserPathParams): Promise<Core_TrustedUser> {
    const domainId = params.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_TrustedUser>(
      replacePathParams(URLs.user, { domainId, userId: params.userId }),
    )
  }

  /**
   * List users belonging to the same public key
   * @returns The user reference
   */
  async getMe(): Promise<Core_MeReference> {
    return this.api.get<Core_MeReference>(URLs.me)
  }

  /**
   * Resolves the domain ID using DomainResolverService.
   * @returns The resolved domain ID
   * @throws {CustodyError} If user has multiple domains and none is specified
   */
  private async resolveDomainId(): Promise<string> {
    if (!this.domainResolver) {
      throw new CustodyError({
        reason:
          "Domain resolution requires domain caching to be enabled. Please specify domainId explicitly.",
      })
    }
    const { domainId } = await this.domainResolver.resolveDomainOnly()
    return domainId
  }
}
