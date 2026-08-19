import { URLs } from "../constants/urls.js"
import { isUndefined, paginate } from "../helpers/index.js"
import { CustodyError } from "../models/index.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_ApiTicker,
  Core_TickersCollection,
  FindByXrplMptIssuanceIdOptions,
  GetTickerPathParams,
  GetTickersQueryParams,
  XrplMptIssuanceTickers,
} from "./tickers.types.js"

/**
 * Finds the tickers custody holds for one XRPL MPT issuance ID — the public
 * one, and the confidential one if the issuance currently has it.
 *
 * This is the fundamental lookup for confidential MPT work: the confidential
 * ticker id is the only way to read a confidential balance, and neither id is
 * derivable from the issuance ID. Pairs with `xrpl.getMptIssuanceId`, which
 * produces the ID this takes.
 *
 * **Both halves are optional.** `confidential` is absent whenever the issuance
 * is not confidential, which is most of them — the issuer decides, and can
 * decide later, so a half missing today may exist tomorrow. What `undefined`
 * does not mean is "already on its way": nothing arrives without the issuer
 * acting, so it is an answer to branch on rather than something to poll for.
 *
 * ```ts
 * const { public: mmf, confidential: mmfConf } = await custody.tickers.findByXrplMptIssuanceId(
 *   "00000AA1...",
 *   { ledgerId: "xrpl-testnet-august-2024" },
 * )
 * if (mmf === undefined) throw new Error("MMF not found in Ripple Custody.")
 * if (mmfConf === undefined) {
 *   // Not confidential as of this call — carry on with the public ticker, or
 *   // have the issuer enable it and look again.
 * }
 * ```
 *
 * An issuance this ledger does not know at all comes back as `{}` rather than
 * throwing, so absence is reported one way for every reason.
 *
 * `getTickers` has no `issuanceId` query parameter, so the match is client-side
 * — which is exactly why this belongs in the SDK. Filtering one page of
 * `tickers.list()` reports a ticker as missing as soon as the ledger carries
 * more tickers than a page holds; this walks every page instead, narrowed
 * server-side to `ledgerId` and reading `limit: 100` at a time.
 *
 * Both halves are `Core_ApiTickerData` — the `data` payload of the collection
 * item, not the item itself. The item's top-level twins (`id`, `ledgerId`,
 * `decimals`, `ledgerDetails`, …) are all `@deprecated` with a Mar. 2027
 * deletion target, so handing back `data` keeps callers off them.
 *
 * Every page is walked even after both halves are found, because a duplicate
 * can only be ruled out by looking at the rest of the collection. That is one
 * pass over the ledger's tickers — the same cost as the single `list()` call
 * this replaces, plus a request per extra page.
 *
 * @throws {CustodyError} When two tickers of the same kind claim the issuance
 * ID. Custody should never hold two, and returning an arbitrary one would make
 * every balance read after it a coin flip.
 */
export async function findByXrplMptIssuanceId(
  t: Transport,
  issuanceId: string,
  { ledgerId }: FindByXrplMptIssuanceIdOptions,
): Promise<XrplMptIssuanceTickers> {
  const found: XrplMptIssuanceTickers = {}

  const fetchPage = (startingAfter: string | undefined) =>
    t.get<Core_TickersCollection>(URLs.tickers, undefined, {
      ledgerId: [ledgerId],
      limit: 100,
      startingAfter,
    } satisfies GetTickersQueryParams)

  for await (const { data } of paginate(fetchPage)) {
    if (data.ledgerDetails.type !== "XRPL") continue

    const { properties } = data.ledgerDetails
    // `MultiPurposeToken` and `ConfidentialMultiPurposeToken` are the only two
    // XRPL ticker shapes carrying an issuance ID; the rest cannot match.
    if (
      properties.type !== "MultiPurposeToken" &&
      properties.type !== "ConfidentialMultiPurposeToken"
    )
      continue
    if (properties.issuanceId !== issuanceId) continue

    const half = properties.type === "MultiPurposeToken" ? "public" : "confidential"
    if (!isUndefined(found[half])) {
      throw new CustodyError({
        reason:
          `Multiple ${properties.type} tickers found for XRPL MPT issuance ${issuanceId} on ledger ${ledgerId} ` +
          `(${found[half].id} and ${data.id}).`,
      })
    }
    found[half] = data
  }

  return found
}

export function createTickers(t: Transport) {
  return {
    list: (queryParams?: GetTickersQueryParams): Promise<Core_TickersCollection> =>
      t.get(URLs.tickers, undefined, queryParams),

    get: (params: GetTickerPathParams): Promise<Core_ApiTicker> => t.get(URLs.ticker, params),

    findByXrplMptIssuanceId: (issuanceId: string, options: FindByXrplMptIssuanceIdOptions) =>
      findByXrplMptIssuanceId(t, issuanceId, options),
  } as const
}
