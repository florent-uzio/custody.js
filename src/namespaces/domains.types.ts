import type { components, operations } from "../models/custody-types.js"

// Request types
export type GetDomainsQueryParams = operations["getDomains"]["parameters"]["query"]
export type GetDomainPathParams = operations["getDomain"]["parameters"]["path"]

export type GetSweepThresholdsPathParams = operations["getSweepThresholds"]["parameters"]["path"]
export type GetSweepThresholdsQueryParams = operations["getSweepThresholds"]["parameters"]["query"]

export type UpdateSweepThresholdsPathParams =
  operations["updateSweepThresholds"]["parameters"]["path"]

// Response types
export type Core_TrustedDomainsCollection = components["schemas"]["Core_TrustedDomainsCollection"]
export type Core_TrustedDomain = components["schemas"]["Core_TrustedDomain"]

export type Omnibus_SweepThresholdPageResponse =
  components["schemas"]["Omnibus_SweepThresholdPageResponse"]
export type Omnibus_BulkUpdateSweepThresholdsRequest =
  components["schemas"]["Omnibus_BulkUpdateSweepThresholdsRequest"]
export type Omnibus_BulkUpdateSweepThresholdsResponse =
  components["schemas"]["Omnibus_BulkUpdateSweepThresholdsResponse"]
