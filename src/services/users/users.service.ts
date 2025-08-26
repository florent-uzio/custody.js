import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_TrustedUsersCollection,
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
}
