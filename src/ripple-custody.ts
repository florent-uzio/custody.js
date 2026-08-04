import { CustodyError } from "./models/index.js"
import {
  createAccounts,
  createAuth,
  createBackups,
  createChannels,
  createCompliance,
  createDomains,
  createEndpoints,
  createEvents,
  createExports,
  createGenesis,
  createHealth,
  createIntents,
  createInternal,
  createLedgers,
  createOmnibus,
  createPolicies,
  createProviders,
  createRequests,
  createSponsors,
  createSystemProperties,
  createSystemSigning,
  createTickers,
  createTransactions,
  createTrustedPublicKeys,
  createUserInvitations,
  createUsers,
  createVaults,
  createVirtualLedgers,
  createXrpl,
} from "./namespaces/index.js"
import type { RippleCustodyClientOptions } from "./ripple-custody.types.js"
import { ApiService } from "./services/apis/index.js"
import { AuthService } from "./services/auth/index.js"
import { resolveDebugLogger } from "./services/debug/index.js"
import { createHttpPorts, XrplService } from "./services/xrpl/index.js"
import { TypedTransport } from "./transport/index.js"
import { buildOpenApiUrl, createHttpSpecSource, detectCapabilities } from "./versioning/detect.js"
import { resolveExplicitCapabilities, VersionGuard } from "./versioning/version-guard.js"

export class RippleCustody {
  // Core services (eager initialization - required for all operations)
  private readonly apiService: ApiService
  private readonly authService: AuthService
  private readonly transport: TypedTransport

  // Runtime version guard (pass-through unless an apiVersion is resolved)
  private readonly guard: VersionGuard

  // Lazy-initialized service instances
  private _xrplService?: XrplService

  private get xrplService(): XrplService {
    return (this._xrplService ??= new XrplService(createHttpPorts(this.transport), this.guard))
  }

  // Namespace objects built from factory functions
  public readonly channels: ReturnType<typeof createChannels>
  public readonly compliance: ReturnType<typeof createCompliance>
  public readonly domains: ReturnType<typeof createDomains>
  public readonly endpoints: ReturnType<typeof createEndpoints>
  public readonly events: ReturnType<typeof createEvents>
  public readonly exports: ReturnType<typeof createExports>
  public readonly genesis: ReturnType<typeof createGenesis>
  public readonly health: ReturnType<typeof createHealth>
  public readonly intents: ReturnType<typeof createIntents>
  public readonly transactions: ReturnType<typeof createTransactions>
  public readonly accounts: ReturnType<typeof createAccounts>
  public readonly users: ReturnType<typeof createUsers>
  public readonly userInvitations: ReturnType<typeof createUserInvitations>
  public readonly tickers: ReturnType<typeof createTickers>
  public readonly ledgers: ReturnType<typeof createLedgers>
  public readonly policies: ReturnType<typeof createPolicies>
  public readonly vaults: ReturnType<typeof createVaults>
  public readonly requests: ReturnType<typeof createRequests>
  public readonly systemProperties: ReturnType<typeof createSystemProperties>
  public readonly systemSigning: ReturnType<typeof createSystemSigning>
  public readonly backups: ReturnType<typeof createBackups>
  public readonly providers: ReturnType<typeof createProviders>
  public readonly trustedPublicKeys: ReturnType<typeof createTrustedPublicKeys>
  public readonly sponsors: ReturnType<typeof createSponsors>
  public readonly omnibus: ReturnType<typeof createOmnibus>
  public readonly virtualLedgers: ReturnType<typeof createVirtualLedgers>
  public readonly auth: ReturnType<typeof createAuth>
  public readonly xrpl: ReturnType<typeof createXrpl>
  /** Namespaces served by the instance's internal API (ADR-0007). */
  public readonly internal: ReturnType<typeof createInternal>

  constructor(options: RippleCustodyClientOptions) {
    const {
      authUrl,
      apiUrl,
      privateKey,
      signer,
      publicKey,
      timeout,
      apiVersion,
      autoDetectVersion = true,
      openApiUrl,
      specSource,
      beforeSign,
      debug,
    } = options

    // Resolve `true` into the built-in console sink once, so both HTTP clients
    // report through the same logger.
    const debugLogger = resolveDebugLogger(debug)

    // Fires once if the guard ever passes calls through because no backend
    // version could be resolved (detection failed, or gating is disabled).
    const warnGatingDisabled = () =>
      console.warn(
        "[ripple-custody] Could not resolve the backend version; capability gating is " +
          "disabled. Calls pass through and the backend enforces what it supports. " +
          "Set `apiVersion`, or ensure the instance's OpenAPI endpoint is reachable.",
      )

    // Resolve the version guard first so an unknown apiVersion fails fast,
    // before any key parsing or service construction.
    if (apiVersion) {
      // Explicit version: validate now and gate against bundled capability data.
      this.guard = new VersionGuard(resolveExplicitCapabilities(apiVersion))
    } else if (autoDetectVersion) {
      // Auto-detect: lazily fetch the live instance spec on first use.
      const source =
        specSource ?? createHttpSpecSource(openApiUrl ?? buildOpenApiUrl(apiUrl), timeout)
      // The internal surface has its own document (ADR-0007), fetched
      // best-effort alongside the public one. A custom `specSource` replaces
      // spec fetching wholesale, so we don't go behind it with an HTTP call.
      const internalSource = specSource
        ? undefined
        : createHttpSpecSource(buildOpenApiUrl(apiUrl, "internal"), timeout)
      this.guard = VersionGuard.deferred(
        () => detectCapabilities(source, internalSource),
        warnGatingDisabled,
      )
    } else {
      // Detection disabled and no explicit version: gating off (pass-through).
      this.guard = new VersionGuard(undefined, undefined, warnGatingDisabled)
    }

    // Only initialize core services eagerly
    this.authService = new AuthService({ authUrl, debug: debugLogger, timeout })
    this.apiService = new ApiService({
      apiUrl,
      authFormData: {
        publicKey,
      },
      authService: this.authService,
      beforeSign,
      debug: debugLogger,
      privateKey,
      signer,
      timeout,
    })
    this.transport = new TypedTransport(this.apiService, this.guard)

    // Initialize namespaces from factories
    this.channels = createChannels(this.transport)
    this.compliance = createCompliance(this.transport)
    this.domains = createDomains(this.transport)
    this.endpoints = createEndpoints(this.transport)
    this.events = createEvents(this.transport)
    this.exports = createExports(this.transport)
    this.genesis = createGenesis(this.transport)
    this.health = createHealth(this.transport)
    this.intents = createIntents(this.transport)
    this.transactions = createTransactions(this.transport)
    this.accounts = createAccounts(this.transport)
    this.users = createUsers(this.transport)
    this.userInvitations = createUserInvitations(this.transport)
    this.tickers = createTickers(this.transport)
    this.ledgers = createLedgers(this.transport)
    this.policies = createPolicies(this.transport)
    this.vaults = createVaults(this.transport)
    this.requests = createRequests(this.transport)
    this.systemProperties = createSystemProperties(this.transport)
    this.systemSigning = createSystemSigning(this.transport)
    this.backups = createBackups(this.transport)
    this.providers = createProviders(this.transport)
    this.trustedPublicKeys = createTrustedPublicKeys(this.transport)
    this.sponsors = createSponsors(this.transport)
    this.omnibus = createOmnibus(this.transport)
    this.virtualLedgers = createVirtualLedgers(this.transport)
    this.auth = createAuth(this.authService)
    this.xrpl = createXrpl(() => this.xrplService)
    this.internal = createInternal(this.transport)
  }

  /**
   * Resolves the backend version/capabilities up front. Optional: when
   * auto-detection is enabled, this otherwise happens lazily on the first API
   * call. Await it to front-load the live-spec fetch and surface any detection
   * error explicitly. Resolves immediately when an explicit `apiVersion` was
   * given or auto-detection is disabled.
   */
  public ready(): Promise<void> {
    return this.guard.ensureResolved()
  }

  /**
   * Returns the backend app version the SDK is resolved against (e.g.
   * `"1.36.4"`), triggering auto-detection if it hasn't run yet. Returns
   * `"unknown"` if a live spec was reached but had no `x-app-version`.
   *
   * Throws `CustodyError` if no version can ever be resolved (`apiVersion`
   * unset and `autoDetectVersion: false`), or if live detection fails (e.g.
   * the instance's OpenAPI endpoint is unreachable).
   */
  public async backendVersion(): Promise<string> {
    try {
      await this.guard.ensureResolved()
    } catch (error) {
      throw new CustodyError(
        {
          reason: "Could not determine the backend version: fetching the live OpenAPI spec failed.",
        },
        undefined,
        error as Error,
      )
    }

    const { appVersion } = this.guard
    if (appVersion === undefined) {
      throw new CustodyError({
        reason:
          "Could not determine the backend version: no `apiVersion` was set and " +
          "`autoDetectVersion` is disabled, so nothing was ever resolved.",
      })
    }
    return appVersion
  }
}
