import { CustodyError } from "../../models/index.js"
import { AccountsService } from "../accounts/index.js"
import type { ApiService } from "../apis/index.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import { UsersService, type Core_MeReference } from "../users/index.js"
import type {
  AccountReference,
  DomainUserReference,
  IntentContext,
  ResolveContextOptions,
} from "./intent-context.types.js"

const DOMAIN_CACHE_KEY = "user:domains"

/**
 * Service for resolving the context required to build intents.
 * Provides reusable methods for user validation, domain resolution, and account lookup
 * that can be shared across different chain services (XRPL, EVM, etc.).
 */
export class IntentContextService {
  private readonly usersService: UsersService
  private readonly accountsService: AccountsService
  private readonly domainCache?: DomainCacheService

  constructor(apiService: ApiService, domainCache?: DomainCacheService) {
    this.usersService = new UsersService(apiService)
    this.accountsService = new AccountsService(apiService)
    this.domainCache = domainCache
  }

  /**
   * Resolves the full intent context in one call.
   * Fetches the current user, validates them, resolves domain/user IDs, and finds the account.
   *
   * @param address - The blockchain address to find the account for
   * @param options - Optional configuration for context resolution
   * @returns The complete intent context
   * @throws {CustodyError} If validation fails or the account is not found
   */
  async resolveContext(
    address: string,
    options: ResolveContextOptions = {},
  ): Promise<IntentContext> {
    const { domainId, userId } = await this.resolveDomainOnly(options)
    const account = await this.findAccountByAddress(address)

    return {
      domainId,
      userId,
      ...account,
    }
  }

  /**
   * Resolves only the domain and user IDs without account lookup.
   * Useful for operations that don't require account information.
   * Uses caching to avoid repeated API calls.
   *
   * @param options - Optional configuration for context resolution
   * @returns The resolved domain and user IDs
   * @throws {CustodyError} If validation fails or domain resolution fails
   */
  async resolveDomainOnly(options: ResolveContextOptions = {}): Promise<DomainUserReference> {
    // Check cache first if domainId is not explicitly provided
    if (!options.domainId && this.domainCache) {
      const cached = this.domainCache.get<DomainUserReference>(DOMAIN_CACHE_KEY)
      if (cached) {
        return cached
      }
    }

    const me = await this.usersService.getMe()
    this.validateUser(me)

    const result = this.resolveDomainAndUser(me, options.domainId)

    // Cache the result if no explicit domainId was provided (meaning it's the user's default)
    if (!options.domainId && this.domainCache) {
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

  /**
   * Finds an account by its blockchain address across all domains.
   *
   * @param address - The blockchain address to search for
   * @returns The account reference containing accountId, ledgerId, and address
   * @throws {CustodyError} If no account is found for the address
   */
  async findAccountByAddress(address: string): Promise<AccountReference> {
    const addressAcrossDomains = await this.accountsService.getAllDomainsAddresses({ address })
    const account = addressAcrossDomains.items.find((item) => item.address === address)

    if (!account) {
      throw new CustodyError({ reason: `Account not found for address ${address}` })
    }

    return {
      accountId: account.accountId,
      ledgerId: account.ledgerId,
      address: account.address,
    }
  }
}
