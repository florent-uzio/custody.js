import { CustodyError } from "../../models/index.js"
import type { ApiService } from "../apis/index.js"
import { UsersService, type Core_MeReference } from "../users/index.js"
import type { DomainResolveOptions, DomainUserReference } from "./domain-resolver.types.js"

/**
 * Service for resolving domain and user context.
 * Provides reusable methods for user validation and domain resolution
 * that can be shared across different chain services (XRPL, EVM, etc.).
 */
export class DomainResolverService {
  private readonly usersService: UsersService

  constructor(apiService: ApiService) {
    this.usersService = new UsersService(apiService)
  }

  /**
   * Resolves the domain and user IDs in one call.
   * Fetches the current user, validates them, and resolves the domain/user reference.
   *
   * @param options - Optional configuration for domain resolution
   * @returns The domain and user reference
   * @throws {CustodyError} If validation fails or domain resolution fails
   */
  async resolve(options: DomainResolveOptions = {}): Promise<DomainUserReference> {
    const me = await this.usersService.getMe()
    this.validateUser(me)
    return this.resolveDomainAndUser(me, options.domainId)
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
