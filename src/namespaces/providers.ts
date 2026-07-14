import { URLs } from "../constants/urls.js"
import type { TypedTransport } from "../transport/index.js"
import type {
  Core_ApiProvider,
  Core_LocationsCollection,
  Core_ProvidersCollection,
  GetProviderLocationsPathParams,
  GetProviderLocationsQueryParams,
  GetProviderPathParams,
  GetProvidersQueryParams,
} from "./providers.types.js"

export function createProviders(t: TypedTransport) {
  return {
    list: (queryParams?: GetProvidersQueryParams): Promise<Core_ProvidersCollection> =>
      t.get(URLs.providers, undefined, queryParams),

    get: (params: GetProviderPathParams): Promise<Core_ApiProvider> => t.get(URLs.provider, params),

    getLocations: (
      params: GetProviderLocationsPathParams,
      queryParams?: GetProviderLocationsQueryParams,
    ): Promise<Core_LocationsCollection> => t.get(URLs.providerLocations, params, queryParams),
  } as const
}
