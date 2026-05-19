import { URLs } from "../constants/urls.js"
import type {
  Core_TrustedEndpoint,
  Core_TrustedEndpointsCollection,
  GetEndpointPathParams,
  GetEndpointsPathParams,
  GetEndpointsQueryParams,
} from "../services/endpoints/endpoints.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createEndpoints(t: TypedTransport) {
  return {
    list: (
      params: GetEndpointsPathParams,
      query?: GetEndpointsQueryParams,
    ): Promise<Core_TrustedEndpointsCollection> => t.get(URLs.endpoints, params, query),

    get: (params: GetEndpointPathParams): Promise<Core_TrustedEndpoint> =>
      t.get(URLs.endpoint, params),
  } as const
}
