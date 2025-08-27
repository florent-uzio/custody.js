import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import type { ApiService } from "../apis/index.js"
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
} from "./ledgers.types.js"

/**
 * A ledger is an accounting system, such as a blockchain, that is supported * and tracked.
 *
 * A ledger is defined by its parameters, which describe its protocol and configuration.
 * For any supported protocol, multiple ledgers instances may be registered.
 * This allows derivative ledgers, such as testnets, forks, or permissioned instances to be connected to Harmonize natively.
 */
export class LedgersService {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Get all ledgers
   * @param queryParams - The query parameters for the request
   * @returns The ledgers
   */
  public async getLedgers(
    queryParams?: GetLedgersQueryParams,
  ): Promise<Core_TrustedLedgersCollection> {
    return this.apiService.get(URLs.ledgers, queryParams)
  }

  /**
   * Get a ledger details
   * @param pathParams - The path parameters for the request
   * @returns The ledger details
   */
  public async getLedger({ ledgerId }: GetLedgerPathParams): Promise<Core_TrustedLedger> {
    return this.apiService.get(replacePathParams(URLs.ledger, { ledgerId }))
  }

  /**
   * Get ledger's fee details
   * @param pathParams - The path parameters for the request
   * @returns The ledger's fee details
   */
  public async getLedgerFees({ ledgerId }: GetLedgerFeePathParams): Promise<Core_CurrentFees> {
    return this.apiService.get(replacePathParams(URLs.ledgerFees, { ledgerId }))
  }

  /**
   * Process an ethereum contract call
   * @param pathParams - The path parameters for the request
   * @param body - The body for the request
   * @returns The ethereum contract call response
   */
  public async processEthereumContractCall(
    { ledgerId }: ProcessEthereumContractCallPathParams,
    body: ProcessEthereumContractCallBody,
  ): Promise<Core_EthereumCallResponse> {
    return this.apiService.post(replacePathParams(URLs.ledgerEthereumCall, { ledgerId }), body)
  }

  /**
   * Get trusted ledger details
   * @param pathParams - The path parameters for the request
   * @returns The trusted ledger detail
   */
  public async getTrustedLedger({
    ledgerId,
  }: GetTrustedLedgerPathParams): Promise<Core_TrustedLedger> {
    return this.apiService.get(replacePathParams(URLs.trustedLedger, { ledgerId }))
  }

  /**
   * Get trusted ledgers
   * @param queryParams - The query parameters for the request
   * @returns The trusted ledgers
   */
  public async getTrustedLedgers(
    queryParams?: GetTrustedLedgersQueryParams,
  ): Promise<Core_TrustedLedgersCollection> {
    return this.apiService.get(URLs.trustedLedgers, queryParams)
  }
}
