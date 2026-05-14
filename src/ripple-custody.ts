import type { SubmittableTransaction } from "xrpl"
import {
  createAccounts,
  createChannels,
  createDomains,
  createEvents,
  createGenesis,
  createIntents,
  createLedgers,
  createPolicies,
  createRequests,
  createTickers,
  createTransactions,
  createUserInvitations,
  createUsers,
  createVaults,
} from "./namespaces/index.js"
import type { RippleCustodyClientOptions } from "./ripple-custody.types.js"
import { ApiService } from "./services/apis/index.js"
import { AuthService } from "./services/auth/index.js"
import type { Core_IntentResponse } from "./services/intents/intents.types.js"
import {
  createHttpPorts,
  XrplService,
  type BatchPayloadInput,
  type Core_ApiBatchSigningData,
  type Core_BatchSigner,
  type Core_XrplOperation,
  type RawSignAndWaitOptions,
  type RawSignAndWaitResult,
  type SignBatchPayloadOptions,
  type SignBatchPayloadResult,
  type XrplIntentOptions,
} from "./services/xrpl/index.js"
import { TypedTransport } from "./transport/index.js"

export class RippleCustody {
  // Core services (eager initialization - required for all operations)
  private readonly apiService: ApiService
  private readonly authService: AuthService
  private readonly transport: TypedTransport

  // Lazy-initialized service instances
  private _xrplService?: XrplService

  private get xrplService(): XrplService {
    return (this._xrplService ??= new XrplService(createHttpPorts(this.transport)))
  }

  // Namespace objects built from factory functions
  public readonly channels: ReturnType<typeof createChannels>
  public readonly domains: ReturnType<typeof createDomains>
  public readonly events: ReturnType<typeof createEvents>
  public readonly genesis: ReturnType<typeof createGenesis>
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

  constructor(options: RippleCustodyClientOptions) {
    const { authUrl, apiUrl, privateKey, publicKey, timeout } = options

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
    this.transport = new TypedTransport(this.apiService)

    // Initialize namespaces from factories
    this.channels = createChannels(this.transport)
    this.domains = createDomains(this.transport)
    this.events = createEvents(this.transport)
    this.genesis = createGenesis(this.transport)
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
