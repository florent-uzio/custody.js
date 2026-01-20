import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import type { ApiService } from "../index.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import { DomainResolverService } from "../domain-resolver/index.js"
import { UsersService } from "../users/index.js"
import type {
  Core_RequestState,
  GetAllUserRequestsStateInDomainPathParams,
  GetAllUserRequestsStateInDomainQueryParams,
  GetAllUserRequestsStateQueryParams,
  GetRequestStatePathParams,
  GetRequestStateQueryParams,
} from "./requests.types.js"

export class RequestsService {
  private readonly domainResolver: DomainResolverService

  constructor(
    private api: ApiService,
    domainCache?: DomainCacheService,
  ) {
    const usersService = new UsersService(api)
    this.domainResolver = new DomainResolverService(() => usersService.getMe(), domainCache)
  }

  /**
   * Get the state of a request
   * @param params - The path parameters for the request
   * @param query - The query parameters for the request
   * @returns The request state
   */
  async getRequestState(
    params: GetRequestStatePathParams,
    query?: GetRequestStateQueryParams,
  ): Promise<Core_RequestState> {
    const domainId = params.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_RequestState>(
      replacePathParams(URLs.request, { ...params, domainId }),
      query,
    )
  }

  /**
   * Get the state of all requests for the current user
   * @param query - The query parameters for the request
   * @returns The request state
   */
  async getAllUserRequestsState(
    query?: GetAllUserRequestsStateQueryParams,
  ): Promise<Core_RequestState> {
    return this.api.get<Core_RequestState>(URLs.meRequests, query)
  }

  /**
   * Get the state of all requests for a user in a domain
   * @param params - The path parameters for the request
   * @param query - The query parameters for the request
   * @returns The request state
   */
  async getAllUserRequestsStateInDomain(
    params: GetAllUserRequestsStateInDomainPathParams,
    query?: GetAllUserRequestsStateInDomainQueryParams,
  ): Promise<Core_RequestState> {
    const domainId = params.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_RequestState>(
      replacePathParams(URLs.requests, { ...params, domainId }),
      query,
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
