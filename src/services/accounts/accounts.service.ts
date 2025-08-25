import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { ApiService } from "../apis/api.service.js"
import type {
  Core_AccountsCollection,
  Core_AddressesCollection,
  Core_AddressReferenceCollection,
  Core_ApiAccount,
  GetAccountPathParams,
  GetAccountQueryParams,
  GetAccountsPathParams,
  GetAccountsQueryParams,
  GetAddressesPathParams,
  GetAddressesQueryParams,
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

  /**
   * Get account
   * @param pathParams - The path parameters for the request
   * @returns The account
   */
  async getAccount(
    { domainId, accountId }: GetAccountPathParams,
    queryParams: GetAccountQueryParams,
  ): Promise<Core_ApiAccount> {
    return this.api.get<Core_ApiAccount>(
      replacePathParams(URLs.account, { domainId, accountId }),
      queryParams,
    )
  }

  /**
   * Get addresses
   * @param pathParams - The path parameters for the request
   * @param queryParams - The query parameters for the request
   * @returns The addresses
   */
  async getAddresses(
    { domainId, accountId }: GetAddressesPathParams,
    queryParams: GetAddressesQueryParams,
  ): Promise<Core_AddressesCollection> {
    return this.api.get<Core_AddressesCollection>(
      replacePathParams(URLs.accountAddresses, { domainId, accountId }),
      queryParams,
    )
  }
}
