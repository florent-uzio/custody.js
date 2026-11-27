import { URLs } from "../constants/urls.js"
import { isUndefined, paginate } from "../helpers/index.js"
import type { components } from "../models/custody-types.js"
import { CustodyError } from "../models/index.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_ApiTicker,
  Core_ApiTickerData,
  FindXrplTickerOptions,
  Core_TickersCollection,
  FindByXrplMptIssuanceIdOptions,
  GetTickerPathParams,
  GetTickersQueryParams,
  XrplMptIssuanceTickers,
} from "./tickers.types.js"

type XrplTickerProperties = components["schemas"]["Core_XrplTickerProperties"]

/**
 * Every XRPL ticker on `ledgerId`, with its XRPL properties, across every page.
 *
 * `getTickers` filters by ledger server-side but has no parameter for the
 * asset, so each XRPL lookup walks the ledger's whole collection and matches
 * client-side: one page would report a ticker missing as soon as the ledger
 * holds more than a page of them (ADR-0008). Reads 100 per request.
 */
async function* xrplTickers(
  t: Transport,
  ledgerId: string,
): AsyncGenerator<{ data: Core_ApiTickerData; properties: XrplTickerProperties }> {
  const fetchPage = (startingAfter: string | undefined) =>
    t.get<Core_TickersCollection>(URLs.tickers, undefined, {
      ledgerId: [ledgerId],
      limit: 100,
      startingAfter,
    } satisfies GetTickersQueryParams)

  for await (const { data } of paginate(fetchPage)) {
    if (data.ledgerDetails.type === "XRPL")
      yield { data, properties: data.ledgerDetails.properties }
  }
}

/**
 * The one XRPL ticker on `ledgerId` that `matches` accepts, or `undefined`.
 * Walks every page even after a match, because a second match can only be
 * ruled out by looking at the rest of the collection.
 *
 * @throws {CustodyError} When two tickers match: returning an arbitrary one
 * would make every balance read after it a coin flip.
 */
async function findOneXrplTicker(
  t: Transport,
  ledgerId: string,
  asset: string,
  matches: (properties: XrplTickerProperties) => boolean,
): Promise<Core_ApiTickerData | undefined> {
  let found: Core_ApiTickerData | undefined

  for await (const { data, properties } of xrplTickers(t, ledgerId)) {
    if (!matches(properties)) continue
    if (!isUndefined(found)) {
      throw new CustodyError({
        reason: `Multiple tickers found for ${asset} on ledger ${ledgerId} (${found.id} and ${data.id}).`,
      })
    }
    found = data
  }

  return found
}

/** A currency code in its 160-bit ledger form: 40 hex characters. */
const HEX_CURRENCY = /^[0-9A-F]{40}$/i

/**
 * A standard code's 160-bit form: 12 zero bytes, the 3 code bytes, 5 zero bytes.
 * Captures the code bytes.
 */
const STANDARD_HEX_CURRENCY = /^0{24}([0-9A-F]{6})0{10}$/

/** XRP's own 160-bit currency code: all zeros. */
const NATIVE_HEX_CURRENCY = "0".repeat(40)

/** A standard code: exactly 3 printable ASCII characters. */
const STANDARD_CURRENCY = /^[\x21-\x7E]{3}$/

const toHex = (text: string) =>
  Array.from(new TextEncoder().encode(text), (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()

const fromHex = (hex: string) =>
  new TextDecoder().decode(Uint8Array.from(hex.match(/../g) ?? [], (pair) => parseInt(pair, 16)))

/**
 * Rejects what no XRPL IOU can be called, before any request: XRP (the native
 * asset, never an IOU) in any spelling — `"XRP"`, its 160-bit form, or the
 * all-zero code — and codes that are neither a 160-bit hex code nor 1–20 bytes
 * of text.
 */
function assertIouCurrencyCode(code: string): void {
  const bytes = new TextEncoder().encode(code).length
  if (!HEX_CURRENCY.test(code) && (bytes === 0 || bytes > 20)) {
    throw new CustodyError({
      reason: `Invalid currency code ${JSON.stringify(code)}: expected 3 characters, up to 20 bytes of text, or 40 hex characters.`,
    })
  }

  const canonical = canonicalCurrencyCode(code)
  if (canonical === "XRP" || canonical === NATIVE_HEX_CURRENCY) {
    throw new CustodyError({
      reason: "XRP is not an IOU: look its ticker up with `findXrplNative`.",
    })
  }
}

/**
 * One spelling per currency, so codes compare equal whichever form each side
 * uses: a standard code (3 ASCII characters such as `"USD"`, or its 160-bit
 * hex form) becomes its 3 characters; any other code (`"RLUSD"`, or its hex
 * form) becomes uppercase 40-character hex.
 */
function canonicalCurrencyCode(code: string): string {
  if (HEX_CURRENCY.test(code)) {
    const hex = code.toUpperCase()
    const standard = STANDARD_HEX_CURRENCY.exec(hex)?.[1]
    return standard && standard !== "000000" ? fromHex(standard) : hex
  }

  return STANDARD_CURRENCY.test(code) ? code : toHex(code).padEnd(40, "0")
}

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

  for await (const { data, properties } of xrplTickers(t, ledgerId)) {
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

/**
 * Finds the ticker custody holds for an XRPL IOU (a `FungibleToken`): the
 * currency `code` issued by `issuer`, on one ledger.
 *
 * `code` is accepted in either spelling — `"USD"`, `"RLUSD"`, or the 40-character
 * hex form the ledger uses — and compared with each ticker's code in one
 * canonical form, so it matches however custody stored it.
 *
 * ```ts
 * const rlusd = await custody.tickers.findByXrplIou("RLUSD", "rMxCK…", {
 *   ledgerId: "xrpl-testnet-august-2024",
 * })
 * if (rlusd === undefined) throw new Error("RLUSD is not tracked on this ledger.")
 * ```
 *
 * Walks every ticker of the ledger, like `findByXrplMptIssuanceId`.
 *
 * @returns The ticker's `data` payload, or `undefined` when custody tracks no
 *   ticker for that currency and issuer on the ledger
 * @throws {CustodyError} When `code` is `"XRP"` (use `findXrplNative`) or not a
 *   valid currency code, before any request; or when two tickers claim the
 *   same currency and issuer
 */
export async function findByXrplIou(
  t: Transport,
  code: string,
  issuer: string,
  { ledgerId }: FindXrplTickerOptions,
): Promise<Core_ApiTickerData | undefined> {
  assertIouCurrencyCode(code)
  const wanted = canonicalCurrencyCode(code)

  return findOneXrplTicker(
    t,
    ledgerId,
    `XRPL IOU ${code} issued by ${issuer}`,
    (properties) =>
      properties.type === "FungibleToken" &&
      properties.issuer === issuer &&
      canonicalCurrencyCode(properties.currencyCode) === wanted,
  )
}

/**
 * Finds the ticker of a ledger's native asset, XRP.
 *
 * ```ts
 * const xrp = await custody.tickers.findXrplNative({ ledgerId: "xrpl-testnet-august-2024" })
 * ```
 *
 * @returns The ticker's `data` payload, or `undefined` when custody tracks no
 *   XRP ticker on the ledger
 * @throws {CustodyError} When the ledger has two
 */
export async function findXrplNative(
  t: Transport,
  { ledgerId }: FindXrplTickerOptions,
): Promise<Core_ApiTickerData | undefined> {
  return findOneXrplTicker(t, ledgerId, "XRP", (properties) => properties.type === "Native")
}

export function createTickers(t: Transport) {
  return {
    list: (queryParams?: GetTickersQueryParams): Promise<Core_TickersCollection> =>
      t.get(URLs.tickers, undefined, queryParams),

    get: (params: GetTickerPathParams): Promise<Core_ApiTicker> => t.get(URLs.ticker, params),

    findByXrplMptIssuanceId: (issuanceId: string, options: FindByXrplMptIssuanceIdOptions) =>
      findByXrplMptIssuanceId(t, issuanceId, options),

    findByXrplIou: (code: string, issuer: string, options: FindXrplTickerOptions) =>
      findByXrplIou(t, code, issuer, options),

    findXrplNative: (options: FindXrplTickerOptions) => findXrplNative(t, options),
  } as const
}
