import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_TrustedTransactionOrdersCollection,
  GetTransactionOrdersPathParams,
  GetTransactionOrdersQueryParams,
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
}
