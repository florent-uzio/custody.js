import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_TrustedDomain,
  Core_TrustedDomainsCollection,
  GetDomainPathParams,
  GetDomainsQueryParams,
  GetSweepThresholdsPathParams,
  GetSweepThresholdsQueryParams,
  Omnibus_BulkUpdateSweepThresholdsRequest,
  Omnibus_BulkUpdateSweepThresholdsResponse,
  Omnibus_SweepThresholdPageResponse,
  UpdateSweepThresholdsPathParams,
} from "./domains.types.js"

export function createDomains(t: Transport) {
  return {
    list: (query?: GetDomainsQueryParams): Promise<Core_TrustedDomainsCollection> =>
      t.get(URLs.domains, undefined, query),

    get: (params: GetDomainPathParams): Promise<Core_TrustedDomain> => t.get(URLs.domain, params),

    getSweepThresholds: (
      params: GetSweepThresholdsPathParams,
      query?: GetSweepThresholdsQueryParams,
    ): Promise<Omnibus_SweepThresholdPageResponse> => t.get(URLs.sweepThresholds, params, query),

    updateSweepThresholds: (
      params: UpdateSweepThresholdsPathParams,
      body: Omnibus_BulkUpdateSweepThresholdsRequest,
    ): Promise<Omnibus_BulkUpdateSweepThresholdsResponse> =>
      t.put(URLs.sweepThresholds, body, params),
  } as const
}
