import { URLs } from "../constants/urls.js"
import type {
  Core_TrustedDomain,
  Core_TrustedDomainsCollection,
  GetDomainPathParams,
  GetDomainsQueryParams,
} from "../services/domains/domain.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createDomains(t: TypedTransport) {
  return {
    list: (query?: GetDomainsQueryParams): Promise<Core_TrustedDomainsCollection> =>
      t.get(URLs.domains, undefined, query),

    get: (params: GetDomainPathParams): Promise<Core_TrustedDomain> => t.get(URLs.domain, params),
  } as const
}
