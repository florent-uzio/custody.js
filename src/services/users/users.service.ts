import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
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
  constructor(private api: ApiService) {}

  /**
   * Get users
   * @param path - The path parameters for the request
   * @param query - The query parameters for the request
   * @returns The users
   */
  async getUsers(
    { domainId }: GetUsersPathParams,
    query: GetUsersQueryParams,
  ): Promise<Core_TrustedUsersCollection> {
    return this.api.get<Core_TrustedUsersCollection>(
      replacePathParams(URLs.users, { domainId }),
      query,
    )
  }

  /**
   * Get known user roles
   * @param path - The path parameters for the request
   * @returns The known user roles
   */
  async getKnownUserRoles({ domainId }: GetKnownUserRolesPathParams): Promise<Core_ApiRoles> {
    return this.api.get<Core_ApiRoles>(replacePathParams(URLs.userRoles, { domainId }))
  }

  /**
   * Get user
   * @param path - The path parameters for the request
   * @returns The user
   */
  async getUser({ domainId, userId }: GetUserPathParams): Promise<Core_TrustedUser> {
    return this.api.get<Core_TrustedUser>(replacePathParams(URLs.user, { domainId, userId }))
  }

  /**
   * List users belonging to the same public key
   * @returns The user reference
   */
  async getMe(): Promise<Core_MeReference> {
    return this.api.get<Core_MeReference>(URLs.me)
  }
}
