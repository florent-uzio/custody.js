import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import type { ApiService } from "../index.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import { IntentContextService } from "../intent-context/index.js"
import type {
  Core_RequestState,
  GetAllUserRequestsStateInDomainPathParams,
  GetAllUserRequestsStateInDomainQueryParams,
  GetAllUserRequestsStateQueryParams,
  GetRequestStatePathParams,
  GetRequestStateQueryParams,
} from "./requests.types.js"

export class RequestsService {
  private readonly intentContextService: IntentContextService

  constructor(
    private api: ApiService,
    domainCache?: DomainCacheService,
  ) {
    this.intentContextService = new IntentContextService(api, domainCache)
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
   * Resolves the domain ID using the IntentContextService.
   * Uses caching to avoid repeated API calls.
   * @returns The resolved domain ID
   * @throws {CustodyError} If domain resolution fails
   */
  private async resolveDomainId(): Promise<string> {
    const { domainId } = await this.intentContextService.resolveDomainOnly()
    return domainId
  }
}
