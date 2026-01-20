import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type { DomainCacheService } from "../domain-cache/index.js"
import { IntentContextService } from "../intent-context/index.js"
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
} from "./transactions.types.js"

export class TransactionsService {
  private readonly intentContextService: IntentContextService

  constructor(
    private api: ApiService,
    domainCache?: DomainCacheService,
  ) {
    this.intentContextService = new IntentContextService(api, domainCache)
  }

  /**
   * Get transaction orders
   * @param path - The path parameters for the request
   * @param query - The query parameters for the request
   * @returns The transaction orders
   */
  async getTransactionOrders(
    params?: GetTransactionOrdersPathParams,
    query?: GetTransactionOrdersQueryParams,
  ): Promise<Core_TrustedTransactionOrdersCollection> {
    const domainId = params?.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_TrustedTransactionOrdersCollection>(
      replacePathParams(URLs.transactionOrders, { domainId }),
      query,
    )
  }

  /**
   * Get transaction order details
   * @param path - The path parameters for the request
   * @returns The transaction order details
   */
  async getTransactionOrderDetails(
    params: GetTransactionOrderDetailsPathParams,
  ): Promise<Core_TrustedTransactionOrderDetails> {
    const domainId = params.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_TrustedTransactionOrderDetails>(
      replacePathParams(URLs.transactionOrder, {
        domainId,
        transactionOrderId: params.transactionOrderId,
      }),
    )
  }

  /**
   * Get transfers
   * @param path - The path parameters for the request
   * @param query - The query parameters for the request
   * @returns The transfers
   */
  async getTransfers(
    params?: TransferTransactionOrderPathParams,
    query?: TransferTransactionOrderQueryParams,
  ): Promise<Core_TransfersCollection> {
    const domainId = params?.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_TransfersCollection>(
      replacePathParams(URLs.transactionTransfers, { domainId }),
      query,
    )
  }

  /**
   * Get transfer details
   * @param path - The path parameters for the request
   * @returns The transfer details
   */
  async getTransferDetails(params: GetTransferDetailsPathParams): Promise<Core_TransferDetails> {
    const domainId = params.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_TransferDetails>(
      replacePathParams(URLs.transactionTransfer, { domainId, transferId: params.transferId }),
    )
  }

  /**
   * Get transactions
   * @param query - The query parameters for the request
   * @returns The transactions
   */
  async getTransactions(
    params?: GetTransactionsPathParams,
    query?: GetTransactionsQueryParams,
  ): Promise<Core_TransactionsCollection> {
    const domainId = params?.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_TransactionsCollection>(
      replacePathParams(URLs.transactions, { domainId }),
      query,
    )
  }

  /**
   * Get transaction details
   * @param path - The path parameters for the request
   * @returns The transaction details
   */
  async getTransactionDetails(
    params: GetTransactionDetailsPathParams,
  ): Promise<Core_TransactionDetails> {
    const domainId = params.domainId ?? (await this.resolveDomainId())
    return this.api.get<Core_TransactionDetails>(
      replacePathParams(URLs.transaction, { domainId, transactionId: params.transactionId }),
    )
  }

  /**
   * Dry run transaction
   * @param path - The path parameters for the request
   * @param body - The body parameters for the request
   * @returns The transaction details
   */
  async dryRunTransaction(
    params: DryRunTransactionPathParams | Core_DryRunTransactionParameters,
    body?: Core_DryRunTransactionParameters,
  ): Promise<Core_TransactionDryRun> {
    // Support both old (params, body) and new (body) signatures
    let domainId: string
    let transactionBody: Core_DryRunTransactionParameters

    if (body === undefined) {
      // New signature: dryRunTransaction(body)
      domainId = await this.resolveDomainId()
      transactionBody = params as Core_DryRunTransactionParameters
    } else {
      // Old signature: dryRunTransaction(params, body)
      const pathParams = params as DryRunTransactionPathParams
      domainId = pathParams.domainId ?? (await this.resolveDomainId())
      transactionBody = body
    }

    return this.api.post<Core_TransactionDryRun>(
      replacePathParams(URLs.transactionsDryRun, { domainId }),
      transactionBody,
    )
  }

  /**
   * Resolves the domain ID using the IntentContextService.
   * Uses caching to avoid repeated API calls.
   * @returns The resolved domain ID
   * @throws {CustodyError} If domain resolution fails
   */
  private async resolveDomainId(): Promise<string> {
    const { domainId } = await this.intentContextService.resolveDomainOnly()
    return domainId
  }
}
