import { URLs } from "../constants/urls.js"
import type { DomainResolveOptions, DomainUserReference } from "../models/domain-resolver.js"
import { CustodyError } from "../models/index.js"
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
import type { Core_MeReference } from "./users.types.js"

/**
 * Reduces a `/v1/me` reference to the domain and user the caller is acting as.
 *
 * Every intent envelope needs this pair (`author.domainId` / `author.id`), and
 * so does every domain-scoped read, so the rule lives here rather than in any
 * one caller: `domains.me` and `XrplPorts.resolveContext` both go through it
 * and can therefore never disagree on what "which domain am I in" means.
 *
 * Pure — the lookup is the caller's, only the reduction is here.
 *
 * @throws {CustodyError} If the login has no domains, if `providedDomainId` is
 *   not one of them, or if it is omitted while the login has several.
 */
export function resolveDomainAndUser(
  me: Core_MeReference,
  providedDomainId?: string,
): DomainUserReference {
  if (!me.loginId?.id) {
    throw new CustodyError({ reason: "User has no login ID" })
  }

  if (me.domains.length === 0) {
    throw new CustodyError({ reason: "User has no domains" })
  }

  if (providedDomainId) {
    const domain = me.domains.find((d) => d.id === providedDomainId)
    if (!domain) {
      throw new CustodyError({
        reason: `Domain with ID ${providedDomainId} not found for user`,
      })
    }
    if (!domain.userReference?.id) {
      throw new CustodyError({ reason: `Domain ${providedDomainId} has no user reference` })
    }
    return { domainId: providedDomainId, userId: domain.userReference.id }
  }

  if (me.domains.length > 1) {
    throw new CustodyError({
      reason: "User has multiple domains. Please specify domainId in the options parameter.",
    })
  }

  const domain = me.domains[0]
  if (!domain?.id) {
    throw new CustodyError({ reason: "User has no primary domain" })
  }
  if (!domain.userReference?.id) {
    throw new CustodyError({ reason: "Primary domain has no user reference" })
  }

  return { domainId: domain.id, userId: domain.userReference.id }
}

export function createDomains(t: Transport) {
  return {
    list: (query?: GetDomainsQueryParams): Promise<Core_TrustedDomainsCollection> =>
      t.get(URLs.domains, undefined, query),

    get: (params: GetDomainPathParams): Promise<Core_TrustedDomain> => t.get(URLs.domain, params),

    /**
     * Resolves the domain and user the caller is acting as.
     *
     * Almost every other call is domain-scoped, and the ids are buried in the
     * `/v1/me` payload behind a domain lookup and a `userReference` hop — so
     * `users.me()` followed by `me.domains.find(...)` was the bootstrap every
     * consumer had to write before it could do anything else. This returns the
     * pair directly.
     *
     * `users.me()` still returns the raw reference (public key, every domain,
     * aliases, roles) for callers who need more than the pair.
     *
     * @param options - `domainId` pins the domain when the login has several
     * @returns The resolved `{ domainId, userId }`
     * @throws {CustodyError} If the login has no domains, if `options.domainId`
     *   is not one of them, or if it is omitted while the login has several
     */
    me: async (options: DomainResolveOptions = {}): Promise<DomainUserReference> =>
      resolveDomainAndUser(await t.get<Core_MeReference>(URLs.me), options.domainId),

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
