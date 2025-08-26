import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
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
  constructor(private api: ApiService) {}

  /**
   * Get transaction orders
   * @param path - The path parameters for the request
   * @param query - The query parameters for the request
   * @returns The transaction orders
   */
  async getTransactionOrders(
    { domainId }: GetTransactionOrdersPathParams,
    query?: GetTransactionOrdersQueryParams,
  ): Promise<Core_TrustedTransactionOrdersCollection> {
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
  async getTransactionOrderDetails({
    domainId,
    transactionOrderId,
  }: GetTransactionOrderDetailsPathParams): Promise<Core_TrustedTransactionOrderDetails> {
    return this.api.get<Core_TrustedTransactionOrderDetails>(
      replacePathParams(URLs.transactionOrder, { domainId, transactionOrderId }),
    )
  }

  /**
   * Get transfers
   * @param path - The path parameters for the request
   * @param query - The query parameters for the request
   * @returns The transfers
   */
  async getTransfers(
    { domainId }: TransferTransactionOrderPathParams,
    query?: TransferTransactionOrderQueryParams,
  ): Promise<Core_TransfersCollection> {
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
  async getTransferDetails({
    domainId,
    transferId,
  }: GetTransferDetailsPathParams): Promise<Core_TransferDetails> {
    return this.api.get<Core_TransferDetails>(
      replacePathParams(URLs.transactionTransfer, { domainId, transferId }),
    )
  }

  /**
   * Get transactions
   * @param query - The query parameters for the request
   * @returns The transactions
   */
  async getTransactions(
    { domainId }: GetTransactionsPathParams,
    query?: GetTransactionsQueryParams,
  ): Promise<Core_TransactionsCollection> {
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
  async getTransactionDetails({
    domainId,
    transactionId,
  }: GetTransactionDetailsPathParams): Promise<Core_TransactionDetails> {
    return this.api.get<Core_TransactionDetails>(
      replacePathParams(URLs.transaction, { domainId, transactionId }),
    )
  }

  /**
   * Dry run transaction
   * @param path - The path parameters for the request
   * @param body - The body parameters for the request
   * @returns The transaction details
   */
  async dryRunTransaction(
    { domainId }: DryRunTransactionPathParams,
    body: Core_DryRunTransactionParameters,
  ): Promise<Core_TransactionDryRun> {
    return this.api.post<Core_TransactionDryRun>(
      replacePathParams(URLs.transactionsDryRun, { domainId }),
      body,
    )
  }
}
