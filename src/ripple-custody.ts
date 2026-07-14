import type { SubmittableTransaction } from "xrpl"
import {
  createAccounts,
  createBackups,
  createChannels,
  createCompliance,
  createDomains,
  createEndpoints,
  createEvents,
  createGenesis,
  createHealth,
  createIntents,
  createLedgers,
  createOmnibus,
  createPolicies,
  createProviders,
  createRequests,
  createSponsors,
  createSystemProperties,
  createTickers,
  createTransactions,
  createTrustedPublicKeys,
  createUserInvitations,
  createUsers,
  createVaults,
} from "./namespaces/index.js"
import type { Core_IntentResponse } from "./namespaces/intents.types.js"
import type { RippleCustodyClientOptions } from "./ripple-custody.types.js"
import { ApiService } from "./services/apis/index.js"
import { AuthService } from "./services/auth/index.js"
import {
  createHttpPorts,
  XrplService,
  type BatchPayloadInput,
  type Core_ApiBatchSigningData,
  type Core_BatchSigner,
  type Core_XrplOperation,
  type GetBatchSignatureParams,
  type RawSignAndWaitOptions,
  type RawSignAndWaitResult,
  type SignBatchPayloadHandle,
  type SignBatchPayloadOptions,
  type SignBatchPayloadResult,
  type WaitForSignatureOptions,
  type XrplIntentOptions,
} from "./services/xrpl/index.js"
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
  public readonly backups: ReturnType<typeof createBackups>
  public readonly providers: ReturnType<typeof createProviders>
  public readonly trustedPublicKeys: ReturnType<typeof createTrustedPublicKeys>
  public readonly sponsors: ReturnType<typeof createSponsors>
  public readonly omnibus: ReturnType<typeof createOmnibus>

  constructor(options: RippleCustodyClientOptions) {
    const {
      authUrl,
      apiUrl,
      privateKey,
      publicKey,
      timeout,
      apiVersion,
      autoDetectVersion = true,
      openApiUrl,
      specSource,
    } = options

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
      this.guard = VersionGuard.deferred(() => detectCapabilities(source), warnGatingDisabled)
    } else {
      // Detection disabled and no explicit version: gating off (pass-through).
      this.guard = new VersionGuard(undefined, undefined, warnGatingDisabled)
    }

    // Only initialize core services eagerly
    this.authService = new AuthService({ authUrl, timeout })
    this.apiService = new ApiService({
      apiUrl,
      authFormData: {
        publicKey,
      },
      authService: this.authService,
      privateKey,
      timeout,
    })
    this.transport = new TypedTransport(this.apiService, this.guard)

    // Initialize namespaces from factories
    this.channels = createChannels(this.transport)
    this.compliance = createCompliance(this.transport)
    this.domains = createDomains(this.transport)
    this.endpoints = createEndpoints(this.transport)
    this.events = createEvents(this.transport)
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
    this.backups = createBackups(this.transport)
    this.providers = createProviders(this.transport)
    this.trustedPublicKeys = createTrustedPublicKeys(this.transport)
    this.sponsors = createSponsors(this.transport)
    this.omnibus = createOmnibus(this.transport)
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

  // Auth namespace
  public readonly auth = {
    /**
     * @returns The current JWT token.
     */
    getCurrentToken: () => this.authService.getCurrentToken(),

    /**
     * @returns The current JWT token expiration, if available.
     */
    getTokenExpiration: () => this.authService.getTokenExpiration(),
  }

  // Xrpl namespace
  public readonly xrpl = {
    /**
     * Propose any XRPL transaction as a custody intent.
     *
     * The `operation` uses a discriminated union on `type` — callers specify
     * which transaction type to propose (e.g. `{ type: "Payment", ... }`).
     * TypeScript autocomplete shows all available operation types and their fields.
     *
     * @param params - The Account address and XRPL operation
     * @param options - Optional configuration for the intent
     * @returns The proposed intent response
     */
    proposeIntent: async (
      params: { Account: string; operation: Core_XrplOperation },
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.proposeIntent(params, options),

    /**
     * Create an XRPL raw sign.
     * @param xrplTransaction - The XRPL transaction details
     * @param options - Optional configuration for the raw sign intent
     * @returns The proposed intent response
     */
    rawSign: async (
      xrplTransaction: SubmittableTransaction,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.rawSign(xrplTransaction, options),

    /**
     * Raw-signs an XRPL transaction and waits for the manifest signature.
     * If SigningPubKey is not set on the transaction, it will be fetched automatically.
     * @param xrplTransaction - The XRPL transaction details
     * @param options - Optional configuration for the raw sign intent and polling
     * @returns The signature and signing public key in uppercase hex
     */
    rawSignAndWait: async (
      xrplTransaction: SubmittableTransaction,
      options?: RawSignAndWaitOptions,
    ): Promise<RawSignAndWaitResult> => this.xrplService.rawSignAndWait(xrplTransaction, options),

    /**
     * Step 1 of the XLS-56 Batch flow — dry-runs a Batch and returns the
     * canonical signing data. Each participant signs `signingPayload` with
     * their own XRPL key; collect signatures and pass them to `proposeBatch`.
     *
     * @param payload - Submitter, execution mode, and inner entries
     * @param options - Optional configuration for the dry-run intent
     * @returns The batch signing data (signingPayload, hash, resolved transactions)
     */
    dryRunBatch: async (
      payload: BatchPayloadInput,
      options?: XrplIntentOptions,
    ): Promise<Core_ApiBatchSigningData> => this.xrplService.dryRunBatch(payload, options),

    /**
     * Step 2 of the XLS-56 Batch flow — signs the `signingPayload` from a dry
     * run for an inner account managed by this custody instance and waits for
     * the manifest signature. Call once per locally-managed signer.
     *
     * @param signingPayload - Hex-encoded payload from `dryRunBatch`
     * @param signerAddress - The XRPL address of the inner account to sign for
     * @param options - Optional configuration for the raw sign intent and polling
     * @returns Signature, public key, and pre-built BatchSigner shapes
     */
    signBatchPayloadAndWait: async (
      signingPayload: string,
      signerAddress: string,
      options?: SignBatchPayloadOptions,
    ): Promise<SignBatchPayloadResult> =>
      this.xrplService.signBatchPayloadAndWait(signingPayload, signerAddress, options),

    /**
     * Step 2 of the XLS-56 Batch flow (non-blocking) — proposes the raw sign
     * intent for an inner account managed by this custody instance and returns
     * immediately, without waiting for the manifest signature.
     *
     * Use when the operator approves signatures out-of-band: persist the
     * returned handle and pass it to `getBatchSignature` later to fetch the
     * signature once available.
     *
     * @param signingPayload - Hex-encoded payload from `dryRunBatch`
     * @param signerAddress - The XRPL address of the inner account to sign for
     * @param options - Optional configuration for the raw sign intent
     * @returns A handle with the manifest ID and fields needed to retrieve the signature
     */
    signBatchPayload: async (
      signingPayload: string,
      signerAddress: string,
      options?: SignBatchPayloadOptions,
    ): Promise<SignBatchPayloadHandle> =>
      this.xrplService.signBatchPayload(signingPayload, signerAddress, options),

    /**
     * Retrieves the signature for a payload proposed via `signBatchPayload`,
     * building the BatchSigner shapes when available.
     *
     * Performs a single fetch by default; returns `undefined` if the operator
     * has not approved the signature yet. Pass `maxRetries`/`intervalMs` to opt
     * into light polling.
     *
     * @param params - Fields from the `signBatchPayload` handle (a handle may be passed directly)
     * @param options - Optional polling configuration (defaults to a single attempt)
     * @returns Signature and BatchSigner shapes, or `undefined` if not yet signed
     */
    getBatchSignature: async (
      params: GetBatchSignatureParams,
      options?: WaitForSignatureOptions,
    ): Promise<SignBatchPayloadResult | undefined> =>
      this.xrplService.getBatchSignature(params, options),

    /**
     * Step 3 of the XLS-56 Batch flow — submits the Batch with collected
     * `batchSigners`. Reuse `options.payloadId`/`options.requestId` if you
     * need referential identity with the dry-run.
     *
     * @param payload - Same submitter, execution mode, and entries as the dry-run
     * @param batchSigners - Signatures collected in Step 2
     * @param options - Optional configuration for the intent
     * @returns The proposed intent response
     */
    proposeBatch: async (
      payload: BatchPayloadInput,
      batchSigners: Core_BatchSigner[],
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> =>
      this.xrplService.proposeBatch(payload, batchSigners, options),

    /**
     * Get the compressed secp256k1 public key for an XRPL account.
     * @param params - The domain ID and account ID
     * @returns The compressed public key in uppercase hex format
     */
    getPublicKey: async (params: { domainId: string; accountId: string }): Promise<string> =>
      this.xrplService.getPublicKey(params),
  }
}
