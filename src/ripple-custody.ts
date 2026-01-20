import type { SubmittableTransaction } from "xrpl"
import type { RippleCustodyClientOptions } from "./ripple-custody.types.js"
import {
  AccountsService,
  type Core_AccountAddress,
  type Core_AccountsCollection,
  type Core_AddressesCollection,
  type Core_AddressReferenceCollection,
  type Core_ApiAccount,
  type Core_ApiManifest,
  type Core_BalancesCollection,
  type Core_ManifestsCollection,
  type ForceUpdateAccountBalancesPathParams,
  type ForceUpdateAccountBalancesQueryParams,
  type GenerateNewAccountExternalAddressDeprecatedPathParams,
  type GenerateNewAccountExternalAddressDeprecatedQueryParams,
  type GenerateNewExternalAddressPathParams,
  type GetAccountAddressPathParams,
  type GetAccountBalancesPathParams,
  type GetAccountBalancesQueryParams,
  type GetAccountPathParams,
  type GetAccountQueryParams,
  type GetAccountsPathParams,
  type GetAccountsQueryParams,
  type GetAddressesPathParams,
  type GetAddressesQueryParams,
  type GetAllDomainsAddressesQueryParams,
  type GetManifestPathParams,
  type GetManifestsPathParams,
  type GetManifestsQueryParams,
} from "./services/accounts/index.js"
import { ApiService } from "./services/apis/index.js"
import { AuthService } from "./services/auth/index.js"
import { DomainCacheService } from "./services/domain-cache/index.js"
import {
  DomainService,
  type GetDomainPathParams,
  type GetDomainsQueryParams,
} from "./services/domains/index.js"
import {
  RequestsService,
  UserInvitationService,
  type Core_RequestState,
  type GetAllUserRequestsStateInDomainPathParams,
  type GetAllUserRequestsStateInDomainQueryParams,
  type GetAllUserRequestsStateQueryParams,
  type GetRequestStatePathParams,
  type GetRequestStateQueryParams,
} from "./services/index.js"
import {
  IntentsService,
  type Core_ApproveIntentBody,
  type Core_GetIntentPathParams,
  type Core_GetIntentsPathParams,
  type Core_GetIntentsQueryParams,
  type Core_IntentDryRunRequest,
  type Core_IntentDryRunResponse,
  type Core_IntentResponse,
  type Core_ProposeIntentBody,
  type Core_RejectIntentBody,
  type Core_RemainingDomainUsers,
  type Core_RemainingUsersIntentPathParams,
  type Core_RemainingUsersIntentQueryParams,
  type Core_TrustedIntent,
  type WaitForExecutionOptions,
  type WaitForExecutionResult,
} from "./services/intents/index.js"
import type {
  Core_CurrentFees,
  Core_EthereumCallResponse,
  Core_TrustedLedger,
  Core_TrustedLedgersCollection,
  GetLedgerFeePathParams,
  GetLedgerPathParams,
  GetLedgersQueryParams,
  GetTrustedLedgerPathParams,
  GetTrustedLedgersQueryParams,
  ProcessEthereumContractCallBody,
  ProcessEthereumContractCallPathParams,
} from "./services/ledgers/index.js"
import { LedgersService } from "./services/ledgers/index.js"
import type {
  Core_ApiTicker,
  Core_TickersCollection,
  GetTickerPathParams,
  GetTickersQueryParams,
} from "./services/tickers/index.js"
import { TickersService } from "./services/tickers/index.js"
import type {
  Core_DryRunTransactionParameters,
  Core_TransactionDetails,
  Core_TransactionDryRun,
  Core_TransactionsCollection,
  Core_TransferDetails,
  Core_TransfersCollection,
  Core_TrustedTransactionOrderDetails,
  Core_TrustedTransactionOrdersCollection,
  DryRunTransactionPathParams,
  GetTransactionDetailsPathParams,
  GetTransactionOrderDetailsPathParams,
  GetTransactionOrdersPathParams,
  GetTransactionOrdersQueryParams,
  GetTransactionsPathParams,
  GetTransactionsQueryParams,
  GetTransferDetailsPathParams,
  TransferTransactionOrderPathParams,
  TransferTransactionOrderQueryParams,
} from "./services/transactions/index.js"
import { TransactionsService } from "./services/transactions/index.js"
import type {
  CancelUserInvitationPathParams,
  CompleteUserInvitationPathParams,
  CoreExtensions_InvitationAnswerIn,
  CoreExtensions_InvitationIn,
  CoreExtensions_InvitationOut,
  CoreExtensions_PublicInvitationOut,
  CreateUserInvitationPathParams,
  FillUserInvitationPathParams,
  GetPublicUserInvitationPathParams,
  GetUserInvitationPathParams,
  GetUserInvitationsPathParams,
  GetUserInvitationsQueryParams,
  RenewUserInvitationPathParams,
} from "./services/user-invitations/user-invitations.types.js"
import { UsersService } from "./services/users/index.js"
import type {
  Core_ApiRoles,
  Core_MeReference,
  Core_TrustedUser,
  Core_TrustedUsersCollection,
  GetKnownUserRolesPathParams,
  GetUserPathParams,
  GetUsersPathParams,
  GetUsersQueryParams,
} from "./services/users/users.types.js"
import { VaultsService } from "./services/vaults/index.js"
import type {
  Core_ApiVault,
  Core_ExportPreparedOperationsResponse,
  Core_VaultsCollection,
  ExportPreparedOperationsPathParams,
  GetVaultPathParams,
  GetVaultsQueryParams,
  ImportPreparedOperationsRequestBody,
} from "./services/vaults/vaults.types.js"
import {
  XrplService,
  type CustodyAccountSet,
  type CustodyClawback,
  type CustodyDepositPreauth,
  type CustodyMpTokenAuthorize,
  type CustodyOfferCreate,
  type CustodyPayment,
  type CustodyTrustline,
  type XrplIntentOptions,
} from "./services/xrpl/index.js"

export class RippleCustody {
  // Core services (eager initialization - required for all operations)
  private readonly apiService: ApiService
  private readonly authService: AuthService
  private readonly domainCache: DomainCacheService

  // Lazy-initialized service instances
  private _accountsService?: AccountsService
  private _domainService?: DomainService
  private _intentService?: IntentsService
  private _ledgersService?: LedgersService
  private _requestsService?: RequestsService
  private _tickersService?: TickersService
  private _transactionsService?: TransactionsService
  private _userInvitationsService?: UserInvitationService
  private _usersService?: UsersService
  private _vaultsService?: VaultsService
  private _xrplService?: XrplService

  // Lazy getters for services - instantiated on first access
  private get accountsService(): AccountsService {
    return (this._accountsService ??= new AccountsService(this.apiService))
  }
  private get domainService(): DomainService {
    return (this._domainService ??= new DomainService(this.apiService))
  }
  private get intentService(): IntentsService {
    return (this._intentService ??= new IntentsService(this.apiService, this.domainCache))
  }
  private get ledgersService(): LedgersService {
    return (this._ledgersService ??= new LedgersService(this.apiService))
  }
  private get requestsService(): RequestsService {
    return (this._requestsService ??= new RequestsService(this.apiService, this.domainCache))
  }
  private get tickersService(): TickersService {
    return (this._tickersService ??= new TickersService(this.apiService))
  }
  private get transactionsService(): TransactionsService {
    return (this._transactionsService ??= new TransactionsService(
      this.apiService,
      this.domainCache,
    ))
  }
  private get userInvitationsService(): UserInvitationService {
    return (this._userInvitationsService ??= new UserInvitationService(
      this.apiService,
      this.domainCache,
    ))
  }
  private get usersService(): UsersService {
    return (this._usersService ??= new UsersService(this.apiService, this.domainCache))
  }
  private get vaultsService(): VaultsService {
    return (this._vaultsService ??= new VaultsService(this.apiService))
  }
  private get xrplService(): XrplService {
    return (this._xrplService ??= new XrplService(this.apiService, this.domainCache))
  }

  constructor(options: RippleCustodyClientOptions) {
    const { authUrl, apiUrl, privateKey, publicKey, timeout, domainCacheTtlMs } = options

    // Initialize core services eagerly
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
    this.domainCache = new DomainCacheService({ ttlMs: domainCacheTtlMs })
  }

  // Auth namespace
  public readonly auth = {
    /**
     * @returns The current JWT token.
     */
    getCurrentToken: () => this.authService.getCurrentToken(),
  }

  // Domains namespace
  public readonly domains = {
    /**
     * Fetches the list of available domains.
     *
     * https://docs.ripple.com/products/custody/api/reference/openapi/domains/getdomains
     */
    list: async (query?: GetDomainsQueryParams) => this.domainService.getDomains(query),

    /**
     * Fetches a specific domain by its ID.
     *
     * https://docs.ripple.com/products/custody/api/reference/openapi/domains/getdomain
     * @param params - The parameters for the domain.
     */
    get: async (params: GetDomainPathParams) => this.domainService.getDomain(params),
  }

  // Intents namespace
  public readonly intents = {
    /**
     * Proposes a new intent.
     *
     * @param params - The parameters for the intent.
     */
    propose: async (params: Core_ProposeIntentBody): Promise<Core_IntentResponse> =>
      this.intentService.proposeIntent(params),

    /**
     * Approves an intent.
     *
     * @param params - The parameters for the intent.
     */
    approve: async (params: Core_ApproveIntentBody): Promise<Core_IntentResponse> =>
      this.intentService.approveIntent(params),

    /**
     * Rejects an intent.
     *
     * @param params - The parameters for the intent.
     */
    reject: async (params: Core_RejectIntentBody): Promise<Core_IntentResponse> =>
      this.intentService.rejectIntent(params),

    /**
     * Gets an intent.
     *
     * @param params - The parameters for the intent.
     */
    get: async (params: Core_GetIntentPathParams): Promise<Core_TrustedIntent> =>
      this.intentService.getIntent(params),

    /**
     * Gets a list of intents.
     *
     * @param query - The query parameters for the intents.
     */
    list: async (
      params?: Core_GetIntentsPathParams,
      query?: Core_GetIntentsQueryParams,
    ): Promise<Core_IntentResponse> => this.intentService.getIntents(params, query),

    /**
     * Dry runs an intent.
     *
     * @param params - The parameters for the intent.
     */
    dryRun: async (params: Core_IntentDryRunRequest): Promise<Core_IntentDryRunResponse> =>
      this.intentService.dryRunIntent(params),

    /**
     * Gets the remaining users for an intent.
     *
     * @param params - The parameters for the intent.
     */
    remainingUsers: async (
      params: Core_RemainingUsersIntentPathParams,
      query?: Core_RemainingUsersIntentQueryParams,
    ): Promise<Core_RemainingDomainUsers> => this.intentService.remainingUsersIntent(params, query),

    /**
     * Query an intent and waits for it to reach a terminal status (Executed, Failed, Expired, or Rejected).
     * @param params - The parameters for the intent.
     * @param options - The options for the wait.
     */
    getAndWait: async (
      params: Core_GetIntentPathParams,
      options?: WaitForExecutionOptions,
    ): Promise<WaitForExecutionResult> => this.intentService.waitForExecution(params, options),
  }

  // Transactions namespace
  public readonly transactions = {
    /**
     * Get transaction orders
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The transaction orders
     */
    orders: async (
      params?: GetTransactionOrdersPathParams,
      query?: GetTransactionOrdersQueryParams,
    ): Promise<Core_TrustedTransactionOrdersCollection> =>
      this.transactionsService.getTransactionOrders(params, query),

    /**
     * Get transaction order details
     * @param params - The parameters for the request
     * @returns The transaction order details
     */
    order: async (
      params: GetTransactionOrderDetailsPathParams,
    ): Promise<Core_TrustedTransactionOrderDetails> =>
      this.transactionsService.getTransactionOrderDetails(params),

    /**
     * Get transfers
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The transfers
     */
    transfers: async (
      params?: TransferTransactionOrderPathParams,
      query?: TransferTransactionOrderQueryParams,
    ): Promise<Core_TransfersCollection> => this.transactionsService.getTransfers(params, query),

    /**
     * Get transfer details
     * @param params - The parameters for the request
     * @returns The transfer details
     */
    transfer: async (params: GetTransferDetailsPathParams): Promise<Core_TransferDetails> =>
      this.transactionsService.getTransferDetails(params),

    /**
     * Get transactions
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The transactions
     */
    transactions: async (
      params?: GetTransactionsPathParams,
      query?: GetTransactionsQueryParams,
    ): Promise<Core_TransactionsCollection> =>
      this.transactionsService.getTransactions(params, query),

    /**
     * Get transaction details
     * @param params - The parameters for the request
     * @returns The transaction details
     */
    transaction: async (
      params: GetTransactionDetailsPathParams,
    ): Promise<Core_TransactionDetails> => this.transactionsService.getTransactionDetails(params),

    /**
     * Dry run transaction
     * @param params - The parameters for the request
     * @param body - The body parameters for the request
     * @returns The transaction details
     */
    dryRun: async (
      params: DryRunTransactionPathParams | Core_DryRunTransactionParameters,
      body?: Core_DryRunTransactionParameters,
    ): Promise<Core_TransactionDryRun> => this.transactionsService.dryRunTransaction(params, body),
  }

  // Accounts namespace
  public readonly accounts = {
    /**
     * Get accounts
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The accounts
     */
    list: async (
      params: GetAccountsPathParams,
      query?: GetAccountsQueryParams,
    ): Promise<Core_AccountsCollection> => this.accountsService.getAccounts(params, query),

    /**
     * Get all domains addresses
     * @param query - The query parameters for the request
     * @returns The all domains addresses
     */
    allDomainsAddresses: async (
      query: GetAllDomainsAddressesQueryParams,
    ): Promise<Core_AddressReferenceCollection> =>
      this.accountsService.getAllDomainsAddresses(query),

    /**
     * Get account
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The account
     */
    get: async (
      params: GetAccountPathParams,
      query?: GetAccountQueryParams,
    ): Promise<Core_ApiAccount> => this.accountsService.getAccount(params, query),

    /**
     * Get addresses
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The addresses
     */
    addresses: async (
      params: GetAddressesPathParams,
      query?: GetAddressesQueryParams,
    ): Promise<Core_AddressesCollection> => this.accountsService.getAddresses(params, query),

    /**
     * Generate new account external address
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The account address
     * @deprecated Use generateNewExternalAddress instead
     */
    generateNewExternalAddressDeprecated: async (
      params: GenerateNewAccountExternalAddressDeprecatedPathParams,
      query: GenerateNewAccountExternalAddressDeprecatedQueryParams,
    ): Promise<Core_AccountAddress> =>
      this.accountsService.generateNewExternalAddressDeprecated(params, query),

    /**
     * Generate new external address
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The account address
     */
    generateNewExternalAddress: async (
      params: GenerateNewExternalAddressPathParams,
    ): Promise<Core_AccountAddress> => this.accountsService.generateNewExternalAddress(params),

    /**
     * Get account address
     * @param params - The parameters for the request
     * @returns The account address
     */
    getAccountAddress: async (params: GetAccountAddressPathParams): Promise<Core_AccountAddress> =>
      this.accountsService.getAccountAddress(params),

    /**
     * Get account confirmed balance
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The account confirmed balance
     */
    getAccountBalances: async (
      params: GetAccountBalancesPathParams,
      query?: GetAccountBalancesQueryParams,
    ): Promise<Core_BalancesCollection> => this.accountsService.getAccountBalances(params, query),

    /**
     * Update account balance forcefully
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns void
     */
    forceUpdateAccountBalances: async (
      params: ForceUpdateAccountBalancesPathParams,
      query?: ForceUpdateAccountBalancesQueryParams,
    ): Promise<void> => this.accountsService.forceUpdateAccountBalances(params, query),

    /**
     * Get manifests
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The manifests
     */
    getManifests: async (
      params: GetManifestsPathParams,
      query?: GetManifestsQueryParams,
    ): Promise<Core_ManifestsCollection> => this.accountsService.getManifests(params, query),

    /**
     * Get manifest
     * @param params - The parameters for the request
     * @returns The manifest
     */
    getManifest: async (params: GetManifestPathParams): Promise<Core_ApiManifest> =>
      this.accountsService.getManifest(params),
  }

  // Users namespace
  public readonly users = {
    /**
     * Get users
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The users
     */
    list: async (
      params?: GetUsersPathParams,
      query?: GetUsersQueryParams,
    ): Promise<Core_TrustedUsersCollection> => this.usersService.getUsers(params, query),

    /**
     * Get known user roles
     * @param params - The parameters for the request
     * @returns The known user roles
     */
    knownRoles: async (params?: GetKnownUserRolesPathParams): Promise<Core_ApiRoles> =>
      this.usersService.getKnownUserRoles(params),

    /**
     * Get user
     * @param params - The parameters for the request
     * @returns The user
     */
    get: async (params: GetUserPathParams): Promise<Core_TrustedUser> =>
      this.usersService.getUser(params),

    /**
     * List users belonging to the same public key
     * @returns The user reference
     */
    me: async (): Promise<Core_MeReference> => this.usersService.getMe(),
  }

  public readonly userInvitations = {
    /**
     * Get user invitations
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The user invitations
     */
    list: async (
      pathParams?: GetUserInvitationsPathParams,
      query?: GetUserInvitationsQueryParams,
    ): Promise<CoreExtensions_InvitationOut> =>
      this.userInvitationsService.getUserInvitations(pathParams, query),

    /**
     * Get a user invitation
     * @param params - The parameters for the request
     * @returns The user invitation
     */
    get: async (params: GetUserInvitationPathParams): Promise<CoreExtensions_InvitationOut> =>
      this.userInvitationsService.getUserInvitation(params),

    /**
     * Create a user invitation
     * @param pathParams - The path parameters for the request
     * @param body - The body for the request
     * @returns The user invitation
     */
    create: async (
      pathParams: CreateUserInvitationPathParams,
      body: CoreExtensions_InvitationIn,
    ): Promise<CoreExtensions_InvitationOut> =>
      this.userInvitationsService.createUserInvitation(pathParams, body),

    /**
     * Cancel a user invitation
     * @param pathParams - The path parameters for the request
     * @returns The user invitation
     */
    cancel: async (
      pathParams: CancelUserInvitationPathParams,
    ): Promise<CoreExtensions_InvitationOut> =>
      this.userInvitationsService.cancelUserInvitation(pathParams),

    /**
     * Renew a user invitation
     * @param pathParams - The path parameters for the request
     * @returns The user invitation
     */
    renew: async (
      pathParams: RenewUserInvitationPathParams,
    ): Promise<CoreExtensions_InvitationOut> =>
      this.userInvitationsService.renewUserInvitation(pathParams),

    /**
     * Complete a user invitation
     * @param pathParams - The path parameters for the request
     * @returns The user invitation
     */
    complete: async (
      pathParams: CompleteUserInvitationPathParams,
    ): Promise<CoreExtensions_InvitationOut> =>
      this.userInvitationsService.completeUserInvitation(pathParams),

    /**
     * Fill a user invitation
     * @param pathParams - The path parameters for the request
     * @param body - The body for the request
     * @returns void
     */
    fill: async (
      pathParams: FillUserInvitationPathParams,
      body: CoreExtensions_InvitationAnswerIn,
    ): Promise<void> => this.userInvitationsService.fillUserInvitation(pathParams, body),

    /**
     * Get a public user invitation
     * @param pathParams - The path parameters for the request
     * @returns The public user invitation
     */
    getPublic: async (
      pathParams: GetPublicUserInvitationPathParams,
    ): Promise<CoreExtensions_PublicInvitationOut> =>
      this.userInvitationsService.getPublicUserInvitation(pathParams),
  }

  // Tickers namespace
  public readonly tickers = {
    /**
     * Get all tickers
     * @returns The tickers
     */
    list: async (queryParams?: GetTickersQueryParams): Promise<Core_TickersCollection> =>
      this.tickersService.getTickers(queryParams),

    /**
     * Get a ticker details
     * @param params - The parameters for the request
     * @returns The ticker details
     */
    get: async (params: GetTickerPathParams): Promise<Core_ApiTicker> =>
      this.tickersService.getTicker(params),
  }

  // Ledgers namespace
  public readonly ledgers = {
    /**
     * Get all ledgers
     * @param queryParams - The query parameters for the request
     * @returns The ledgers
     */
    list: async (queryParams?: GetLedgersQueryParams): Promise<Core_TrustedLedgersCollection> =>
      this.ledgersService.getLedgers(queryParams ?? {}),

    /**
     * Get a ledger details
     * @param params - The parameters for the request
     * @returns The ledger details
     */
    get: async (params: GetLedgerPathParams): Promise<Core_TrustedLedger> =>
      this.ledgersService.getLedger(params),

    /**
     * Get ledger's fee details
     * @param params - The parameters for the request
     * @returns The ledger's fee details
     */
    fees: async (params: GetLedgerFeePathParams): Promise<Core_CurrentFees> =>
      this.ledgersService.getLedgerFees(params),

    /**
     * Process an ethereum contract call
     * @param params - The parameters for the request
     * @param body - The body for the request
     * @returns The ethereum contract call response
     */
    processEthereumContractCall: async (
      params: ProcessEthereumContractCallPathParams,
      body: ProcessEthereumContractCallBody,
    ): Promise<Core_EthereumCallResponse> =>
      this.ledgersService.processEthereumContractCall(params, body),

    /**
     * Get trusted ledger details
     * @param params - The parameters for the request
     * @returns The trusted ledger detail
     */
    trusted: async (params: GetTrustedLedgerPathParams): Promise<Core_TrustedLedger> =>
      this.ledgersService.getTrustedLedger(params),

    /**
     * Get trusted ledgers
     * @param queryParams - The query parameters for the request
     * @returns The trusted ledgers
     */
    trustedList: async (
      queryParams?: GetTrustedLedgersQueryParams,
    ): Promise<Core_TrustedLedgersCollection> =>
      this.ledgersService.getTrustedLedgers(queryParams ?? {}),
  }

  // Vaults namespace
  public readonly vaults = {
    /**
     * Get vaults
     * @param queryParams - The query parameters for the request
     * @returns The vaults
     */
    list: async (queryParams?: GetVaultsQueryParams): Promise<Core_VaultsCollection> =>
      this.vaultsService.getVaults(queryParams ?? {}),

    /**
     * Get vault
     * @param params - The parameters for the request
     * @returns The vault
     */
    get: async (params: GetVaultPathParams): Promise<Core_ApiVault> =>
      this.vaultsService.getVault(params),

    /**
     * Export prepared operations
     * @param params - The parameters for the request
     * @returns The prepared operations (binary)
     */
    exportPreparedOperations: async (
      params: ExportPreparedOperationsPathParams,
    ): Promise<Core_ExportPreparedOperationsResponse> =>
      this.vaultsService.exportPreparedOperations(params),

    /**
     * Import prepared operations (signed)
     * @param body - The body for the request
     * @returns void
     */
    importPreparedOperations: async (body: ImportPreparedOperationsRequestBody): Promise<void> =>
      this.vaultsService.importPreparedOperations(body),
  }

  // Requests namespace
  public readonly requests = {
    /**
     * Get the state of a request
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The request state
     */
    state: async (
      params: GetRequestStatePathParams,
      query?: GetRequestStateQueryParams,
    ): Promise<Core_RequestState> => this.requestsService.getRequestState(params, query),

    /**
     * Get the state of all requests for the current user
     * @param query - The query parameters for the request
     * @returns The request state
     */
    userStates: async (query?: GetAllUserRequestsStateQueryParams): Promise<Core_RequestState> =>
      this.requestsService.getAllUserRequestsState(query),

    /**
     * Get the state of all requests for a user in a domain
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The request state
     */
    userStatesInDomain: async (
      params: GetAllUserRequestsStateInDomainPathParams,
      query?: GetAllUserRequestsStateInDomainQueryParams,
    ): Promise<Core_RequestState> =>
      this.requestsService.getAllUserRequestsStateInDomain(params, query),
  }

  // Xrpl namespace
  public readonly xrpl = {
    /**
     * Send an XRPL Payment. If you want to send XRP, do not specify the currency field.
     * @param params - The payment transaction details
     * @param options - Optional configuration for the payment intent
     * @returns The proposed intent response
     */
    sendPayment: async (
      params: CustodyPayment,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.sendPayment(params, options),

    /**
     * Create an XRPL TrustSet.
     * @param params - The trustline transaction details
     * @param options - Optional configuration for the trustline intent
     * @returns The proposed intent response
     */
    createTrustline: async (
      params: CustodyTrustline,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.createTrustline(params, options),

    /**
     * Create an XRPL DepositPreauth.
     * @param params - The deposit preauth transaction details
     * @param options - Optional configuration for the deposit preauth intent
     * @returns The proposed intent response
     */
    depositPreauth: async (
      params: CustodyDepositPreauth,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.depositPreauth(params, options),

    /**
     * Create an XRPL Clawback.
     * @param params - The clawback transaction details
     * @param options - Optional configuration for the clawback intent
     * @returns The proposed intent response
     */
    clawback: async (
      params: CustodyClawback,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.clawback(params, options),

    /**
     * Create an XRPL MPTokenAuthorize.
     * @param params - The MPTokenAuthorize transaction details
     * @param options - Optional configuration for the MPTokenAuthorize intent
     * @returns The proposed intent response
     */
    mpTokenAuthorize: async (
      params: CustodyMpTokenAuthorize,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.mpTokenAuthorize(params, options),

    /**
     * Create an XRPL OfferCreate.
     * @param params - The OfferCreate transaction details
     * @param options - Optional configuration for the OfferCreate intent
     * @returns The proposed intent response
     */
    offerCreate: async (
      params: CustodyOfferCreate,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.offerCreate(params, options),

    /**
     * Create an XRPL AccountSet.
     * @param params - The AccountSet transaction details
     * @param options - Optional configuration for the AccountSet intent
     * @returns The proposed intent response
     */
    accountSet: async (
      params: CustodyAccountSet,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => this.xrplService.accountSet(params, options),

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
  }
}
