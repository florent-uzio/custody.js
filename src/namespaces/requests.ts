import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_RequestState,
  GetAllUserRequestsStateInDomainPathParams,
  GetAllUserRequestsStateInDomainQueryParams,
  GetAllUserRequestsStateQueryParams,
  GetRequestStatePathParams,
  GetRequestStateQueryParams,
} from "./requests.types.js"

export function createRequests(t: Transport) {
  return {
    state: (
      params: GetRequestStatePathParams,
      query?: GetRequestStateQueryParams,
    ): Promise<Core_RequestState> => t.get(URLs.request, params, query),

    userStates: (query?: GetAllUserRequestsStateQueryParams): Promise<Core_RequestState[]> =>
      t.get(URLs.meRequests, undefined, query),

    userStatesInDomain: (
      params: GetAllUserRequestsStateInDomainPathParams,
      query?: GetAllUserRequestsStateInDomainQueryParams,
    ): Promise<Core_RequestState[]> => t.get(URLs.requests, params, query),
  } as const
}
