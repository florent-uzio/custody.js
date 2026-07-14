import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_TrustedEndpoint,
  Core_TrustedEndpointsCollection,
  GetEndpointPathParams,
  GetEndpointsPathParams,
  GetEndpointsQueryParams,
} from "./endpoints.types.js"

export function createEndpoints(t: Transport) {
  return {
    list: (
      params: GetEndpointsPathParams,
      query?: GetEndpointsQueryParams,
    ): Promise<Core_TrustedEndpointsCollection> => t.get(URLs.endpoints, params, query),

    get: (params: GetEndpointPathParams): Promise<Core_TrustedEndpoint> =>
      t.get(URLs.endpoint, params),
  } as const
}
