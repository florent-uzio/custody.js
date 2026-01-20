import { CustodyError } from "../../models/index.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import type { Core_MeReference } from "../users/users.types.js"

/**
 * Cache key for storing user's domain and user ID information.
 * Cached value format: { domainId: string, userId: string }
 */
const DOMAIN_CACHE_KEY = "user:domains"

/**
 * Domain and user reference resolved from the user's context.
 */
export type DomainUserReference = {
  domainId: string
  userId: string
}

/**
 * Function type for fetching user's me reference.
 * This allows dependency injection to avoid circular dependencies.
 */
export type GetMeFunction = () => Promise<Core_MeReference>

/**
 * Service for resolving domain information from user context.
 * This is a standalone service that can be used by any service that needs
 * to resolve domain IDs without creating circular dependencies.
 */
export class DomainResolverService {
  constructor(
    private readonly getMe: GetMeFunction,
    private readonly domainCache?: DomainCacheService,
  ) {}

  /**
   * Resolves only the domain and user IDs without account lookup.
   * Useful for operations that don't require account information.
   * Uses caching to avoid repeated API calls.
   *
   * @param providedDomainId - Optional specific domain ID to use
   * @returns The resolved domain and user IDs
   * @throws {CustodyError} If validation fails or domain resolution fails
   */
  async resolveDomainOnly(providedDomainId?: string): Promise<DomainUserReference> {
    // Check cache first if domainId is not explicitly provided
    if (!providedDomainId && this.domainCache) {
      const cached = this.domainCache.get<DomainUserReference>(DOMAIN_CACHE_KEY)
      if (cached) {
        return cached
      }
    }

    const me = await this.getMe()
    this.validateUser(me)

    const result = this.resolveDomainAndUser(me, providedDomainId)

    // Cache the result if no explicit domainId was provided (meaning it's the user's default)
    if (!providedDomainId && this.domainCache) {
      this.domainCache.set(DOMAIN_CACHE_KEY, result)
    }

    return result
  }

  /**
   * Validates that the user has the required login ID and domains.
   * @param me - The user reference to validate
   * @throws {CustodyError} If the user has no login ID or no domains
   */
  validateUser(me: Core_MeReference): void {
    if (!me.loginId?.id) {
      throw new CustodyError({ reason: "User has no login ID" })
    }

    if (me.domains.length === 0) {
      throw new CustodyError({ reason: "User has no domains" })
    }
  }

  /**
   * Resolves the domain ID and user ID to use for an intent.
   * If a specific domain ID is provided, validates it exists for the user.
   * If not provided and user has multiple domains, throws an error.
   *
   * @param me - The user reference containing domain information
   * @param providedDomainId - Optional specific domain ID to use
   * @returns The resolved domain and user IDs
   * @throws {CustodyError} If domain resolution fails
   */
  resolveDomainAndUser(me: Core_MeReference, providedDomainId?: string): DomainUserReference {
    if (providedDomainId) {
      const domain = me.domains.find((d) => d.id === providedDomainId)
      if (!domain) {
        throw new CustodyError({
          reason: `Domain with ID ${providedDomainId} not found for user`,
        })
      }
      if (!domain.id) {
        throw new CustodyError({ reason: `Domain ${providedDomainId} has no ID` })
      }
      if (!domain.userReference?.id) {
        throw new CustodyError({ reason: `Domain ${providedDomainId} has no user reference` })
      }
      return { domainId: domain.id, userId: domain.userReference.id }
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
}
