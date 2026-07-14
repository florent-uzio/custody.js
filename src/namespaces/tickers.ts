import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_ApiTicker,
  Core_TickersCollection,
  GetTickerPathParams,
  GetTickersQueryParams,
} from "./tickers.types.js"

export function createTickers(t: Transport) {
  return {
    list: (queryParams?: GetTickersQueryParams): Promise<Core_TickersCollection> =>
      t.get(URLs.tickers, undefined, queryParams),

    get: (params: GetTickerPathParams): Promise<Core_ApiTicker> => t.get(URLs.ticker, params),
  } as const
}
