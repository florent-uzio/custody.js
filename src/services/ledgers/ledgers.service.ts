import { URLs } from "../../constants/urls.js"
import type { ApiService } from "../apis/index.js"
import type { Core_TrustedLedgersCollection, GetLedgersQueryParams } from "./ledgers.types.js"

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
}
