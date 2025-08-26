import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import type { ApiService } from "../apis/index.js"
import type {
  Core_ApiTicker,
  Core_TickersCollection,
  GetTickerPathParams,
  GetTickersQueryParams,
} from "./tickers.types.js"

/**
 * A ticker defines a detected currency and its respective symbol, number and parameters.
 * In particular, the number of decimals of a particular ticker is critical to the proper encoding of transfer amounts.
 */
export class TickersService {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Get all tickers
   */
  public async getTickers(queryParams?: GetTickersQueryParams): Promise<Core_TickersCollection> {
    return this.apiService.get(URLs.tickers, queryParams)
  }

  /**
   * Get a ticker details
   */
  public async getTicker({ tickerId }: GetTickerPathParams): Promise<Core_ApiTicker> {
    return this.apiService.get(replacePathParams(URLs.ticker, { tickerId }))
  }
}
