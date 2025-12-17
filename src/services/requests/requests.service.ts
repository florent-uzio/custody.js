import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import type { ApiService } from "../index.js"
import type {
  Core_RequestState,
  GetAllUserRequestsStateInDomainPathParams,
  GetAllUserRequestsStateInDomainQueryParams,
  GetAllUserRequestsStateQueryParams,
  GetRequestStatePathParams,
  GetRequestStateQueryParams,
} from "./requests.types.js"

export class RequestsService {
  constructor(private api: ApiService) {}

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
    return this.api.get<Core_RequestState>(replacePathParams(URLs.request, params), query)
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
    return this.api.get<Core_RequestState>(replacePathParams(URLs.requests, params), query)
  }
}
