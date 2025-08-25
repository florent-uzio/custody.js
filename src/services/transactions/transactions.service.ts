import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_TransfersCollection,
  Core_TrustedTransactionOrderDetails,
  Core_TrustedTransactionOrdersCollection,
  GetTransactionOrderDetailsPathParams,
  GetTransactionOrdersPathParams,
  GetTransactionOrdersQueryParams,
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
    query: GetTransactionOrdersQueryParams,
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
    query: TransferTransactionOrderQueryParams,
  ): Promise<Core_TransfersCollection> {
    return this.api.get<Core_TransfersCollection>(
      replacePathParams(URLs.transactionTransfers, { domainId }),
      query,
    )
  }
}
