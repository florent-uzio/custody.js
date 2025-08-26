import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_ApiRoles,
  Core_TrustedUsersCollection,
  GetKnownUserRolesPathParams,
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
}
