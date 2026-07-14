import type { components, operations } from "../models/custody-types.js"

// Request types

export type GetProvidersQueryParams = operations["getProviders"]["parameters"]["query"]

export type GetProviderPathParams = operations["getProvider"]["parameters"]["path"]

export type GetProviderLocationsPathParams =
  operations["getProviderLocations"]["parameters"]["path"]

export type GetProviderLocationsQueryParams =
  operations["getProviderLocations"]["parameters"]["query"]

// Response types

export type Core_ProvidersCollection = components["schemas"]["Core_ProvidersCollection"]

export type Core_ApiProvider = components["schemas"]["Core_ApiProvider"]

export type Core_LocationsCollection = components["schemas"]["Core_LocationsCollection"]
