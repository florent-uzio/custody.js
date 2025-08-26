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
import {
  DomainService,
  type GetDomainPathParams,
  type GetDomainsQueryParams,
} from "./services/domains/index.js"
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
} from "./services/intents/index.js"
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

export class RippleCustody {
  private accountsService: AccountsService
  private authService: AuthService
  private apiService: ApiService
  private domainService: DomainService
  private intentService: IntentsService
  private transactionsService: TransactionsService
  private usersService: UsersService
  private tickersService: TickersService

  constructor(options: RippleCustodyClientOptions) {
    const { baseUrl, privateKey, publicKey } = options

    this.authService = new AuthService(baseUrl)
    this.apiService = new ApiService({
      baseUrl,
      authFormData: {
        publicKey,
      },
      authService: this.authService,
      privateKey,
    })
    this.accountsService = new AccountsService(this.apiService)
    this.domainService = new DomainService(this.apiService)
    this.intentService = new IntentsService(this.apiService)
    this.transactionsService = new TransactionsService(this.apiService)
    this.usersService = new UsersService(this.apiService)
    this.tickersService = new TickersService(this.apiService)
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
    get: async (params: Core_GetIntentPathParams): Promise<Core_IntentResponse> =>
      this.intentService.getIntent(params),

    /**
     * Gets a list of intents.
     *
     * @param query - The query parameters for the intents.
     */
    list: async (
      params: Core_GetIntentsPathParams,
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
      params: GetTransactionOrdersPathParams,
      query: GetTransactionOrdersQueryParams,
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
      params: TransferTransactionOrderPathParams,
      query: TransferTransactionOrderQueryParams,
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
      params: GetTransactionsPathParams,
      query: GetTransactionsQueryParams,
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
      params: DryRunTransactionPathParams,
      body: Core_DryRunTransactionParameters,
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
      query: GetAccountsQueryParams,
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
      query: GetAccountQueryParams,
    ): Promise<Core_ApiAccount> => this.accountsService.getAccount(params, query),

    /**
     * Get addresses
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The addresses
     */
    addresses: async (
      params: GetAddressesPathParams,
      query: GetAddressesQueryParams,
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
      query: GetAccountBalancesQueryParams,
    ): Promise<Core_BalancesCollection> => this.accountsService.getAccountBalances(params, query),

    /**
     * Update account balance forcefully
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns void
     */
    forceUpdateAccountBalances: async (
      params: ForceUpdateAccountBalancesPathParams,
      query: ForceUpdateAccountBalancesQueryParams,
    ): Promise<void> => this.accountsService.forceUpdateAccountBalances(params, query),

    /**
     * Get manifests
     * @param params - The parameters for the request
     * @param query - The query parameters for the request
     * @returns The manifests
     */
    getManifests: async (
      params: GetManifestsPathParams,
      query: GetManifestsQueryParams,
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
      params: GetUsersPathParams,
      query?: GetUsersQueryParams,
    ): Promise<Core_TrustedUsersCollection> => this.usersService.getUsers(params, query),

    /**
     * Get known user roles
     * @param params - The parameters for the request
     * @returns The known user roles
     */
    knownRoles: async (params: GetKnownUserRolesPathParams): Promise<Core_ApiRoles> =>
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

  // Tickers namespace
  public readonly tickers = {
    /**
     * Get all tickers
     * @returns The tickers
     */
    list: async (queryParams?: GetTickersQueryParams): Promise<Core_TickersCollection> =>
      this.tickersService.getTickers(queryParams ?? {}),

    /**
     * Get a ticker details
     * @param params - The parameters for the request
     * @returns The ticker details
     */
    get: async (params: GetTickerPathParams): Promise<Core_ApiTicker> =>
      this.tickersService.getTicker(params),
  }
}
