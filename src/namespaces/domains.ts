import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_TrustedDomain,
  Core_TrustedDomainsCollection,
  GetDomainPathParams,
  GetDomainsQueryParams,
} from "./domains.types.js"

export function createDomains(t: Transport) {
  return {
    list: (query?: GetDomainsQueryParams): Promise<Core_TrustedDomainsCollection> =>
      t.get(URLs.domains, undefined, query),

    get: (params: GetDomainPathParams): Promise<Core_TrustedDomain> => t.get(URLs.domain, params),
  } as const
}
