import type { RippleCustodyClientOptions } from "./ripple-custody.types.js"
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

export class RippleCustody {
  private authService: AuthService
  private apiService: ApiService
  private domainService: DomainService
  private intentService: IntentsService
  private transactionsService: TransactionsService

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
    this.domainService = new DomainService(this.apiService)
    this.intentService = new IntentsService(this.apiService)
    this.transactionsService = new TransactionsService(this.apiService)
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
}
