import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_AccountsCollection,
  Core_AddressReferenceCollection,
  GetAccountsPathParams,
  GetAccountsQueryParams,
  GetAllDomainsAddressesQueryParams,
} from "./accounts.types.js"

export class AccountsService {
  constructor(private readonly api: ApiService) {}

  /**
   * Get accounts
   * @param pathParams - The path parameters for the request
   * @param queryParams - The query parameters for the request
   * @returns The accounts
   */
  async getAccounts(
    { domainId }: GetAccountsPathParams,
    queryParams: GetAccountsQueryParams,
  ): Promise<Core_AccountsCollection> {
    return this.api.get<Core_AccountsCollection>(
      replacePathParams(URLs.accounts, { domainId }),
      queryParams,
    )
  }

  /**
   * Get all domains addresses
   * @param queryParams - The query parameters for the request
   * @returns The all domains addresses
   */
  async getAllDomainsAddresses(
    queryParams: GetAllDomainsAddressesQueryParams,
  ): Promise<Core_AddressReferenceCollection> {
    return this.api.get<Core_AddressReferenceCollection>(URLs.addresses, queryParams)
  }
}
