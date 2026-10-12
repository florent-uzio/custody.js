import { CustodyError } from "../../models/custody-error.js"
import type { components } from "../../models/custody-types.js"
import { isString } from "../typeof-fns/index.js"

/**
 * The structural minimum of a cursor-paginated response.
 *
 * Every collection the API returns — the `Core_*Collection` family and the
 * `VirtualAccounting_*PagedCollectionResponse` family alike — carries
 * `{ items, count, currentStartingAfter?, nextStartingAfter? }`. Only the two
 * fields below are load-bearing for pagination, so this type names those and
 * nothing else: `count` is per-page, not a total, and `currentStartingAfter`
 * only ever echoes the cursor the caller already has.
 *
 * `nextStartingAfter` is `string | null | undefined` because the two families
 * disagree on how they spell "no further pages" — the `Core_*` schemas make the
 * field optional, the `VirtualAccounting_*` schemas make it nullable. All three
 * mean the same thing here.
 *
 * This is deliberately generic rather than derived from one of the 32 generated
 * schemas: electing any single schema as canonical would reject the other
 * family, and a constraint over *all* cursor collections is not a restatement of
 * any one endpoint's contract. The canary below asserts at compile time that real
 * generated collections still satisfy it, so a server-side field rename fails the
 * build rather than rotting silently.
 */
export type CursorPage<TItem> = {
  items: TItem[]
  nextStartingAfter?: string | null
}

// ───────────────────────────────────────────────────────────────────────────────
// Compile-time canary
//
// `CursorPage` is hand-authored, so nothing else in the SDK would notice if a
// regenerated spec renamed `items` or `nextStartingAfter`. These assertions make
// that a build failure. They are purely type-level and emit no runtime code, and
// they live here rather than in `paginate.test.ts` because `tsconfig.json`
// excludes `**/*.test.ts` — a canary in the test file would never be checked.
//
// Two properties are asserted per schema, because assignability alone is not
// enough: it catches a renamed or retyped `items` (required in `CursorPage`) but
// not a renamed `nextStartingAfter`, since an optional field that has vanished
// still satisfies the constraint. `HasCursorFields` closes that hole.
//
// Both schema families are covered on purpose — the `Core_*` family spells the
// cursor as optional, the `VirtualAccounting_*` family as nullable.
//
// The aliases are unreferenced by construction — being *declared* is what runs
// the check — so `no-unused-vars` is off for the block. `argsIgnorePattern: "^_"`
// in eslint.config.js covers parameters only, not type aliases.
// ───────────────────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-unused-vars */

type Assert<TCondition extends true> = TCondition

type HasCursorFields<T> = "items" extends keyof T
  ? "nextStartingAfter" extends keyof T
    ? true
    : false
  : false

type IsCursorPageOf<TCollection, TItem> = TCollection extends CursorPage<TItem> ? true : false

type Schemas = components["schemas"]

type _TickersHasFields = Assert<HasCursorFields<Schemas["Core_TickersCollection"]>>
type _TickersIsCursorPage = Assert<
  IsCursorPageOf<Schemas["Core_TickersCollection"], Schemas["Core_ApiTicker"]>
>

type _TransactionsHasFields = Assert<HasCursorFields<Schemas["Core_TransactionsCollection"]>>
type _TransactionsIsCursorPage = Assert<
  IsCursorPageOf<Schemas["Core_TransactionsCollection"], Schemas["Core_ApiTransaction"]>
>

type _AddressRefsHasFields = Assert<HasCursorFields<Schemas["Core_AddressReferenceCollection"]>>
type _AddressRefsIsCursorPage = Assert<
  IsCursorPageOf<Schemas["Core_AddressReferenceCollection"], Schemas["Core_AddressesReference"]>
>

type _VirtualAddressesHasFields = Assert<
  HasCursorFields<Schemas["VirtualAccounting_LedgerAddressPagedCollectionResponse"]>
>
type _VirtualAddressesIsCursorPage = Assert<
  IsCursorPageOf<
    Schemas["VirtualAccounting_LedgerAddressPagedCollectionResponse"],
    Schemas["VirtualAccounting_LedgerAddress"]
  >
>

/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Walks every page of a cursor-paginated endpoint, yielding items one at a time.
 *
 * Custody's list endpoints return a single page. Nothing in the response makes
 * that obvious at the call site, so code that filters `.items` client-side
 * silently concludes a record does not exist as soon as the collection outgrows
 * one page. `paginate` closes that gap: it follows `nextStartingAfter` until the
 * server stops issuing one.
 *
 * `fetchPage` receives the cursor for the page to fetch — `undefined` on the
 * first call — and owns the rest of the query. `paginate` never sets `limit`,
 * because the documented maximum varies by endpoint (100 on most, 1000 on a
 * couple, unspecified elsewhere) and overriding an absent `limit` would change
 * the request shape invisibly. Pass `limit: 100` yourself to cut round trips.
 *
 * ```ts
 * const fetchPage = (startingAfter?: string) =>
 *   custody.tickers.list({ limit: 100, startingAfter })
 *
 * for await (const ticker of paginate(fetchPage)) {
 *   if (ticker.ledgerId === "xrpl-testnet") return ticker
 * }
 * ```
 *
 * Pages are fetched lazily, one ahead of nothing: the request for page N+1 only
 * goes out once page N's items are exhausted, so breaking out of the loop early
 * issues no further requests.
 *
 * To collect everything, drain it — but note there is no bound on how much this
 * pulls into memory, and a large collection will happily exhaust the heap:
 *
 * ```ts
 * const all: Core_ApiTicker[] = []
 * for await (const ticker of paginate(fetchPage)) {
 *   all.push(ticker)
 * }
 * ```
 *
 * `await Array.fromAsync(paginate(…))` is equivalent where the consuming
 * project's `lib` has it — TypeScript places it in `esnext`, so it is unavailable
 * under a plain `es2024` target (this package's own) despite Node ≥ 22 shipping
 * it.
 *
 * @throws {CustodyError} When a page's `nextStartingAfter` equals the cursor
 * that produced it. A cursor that does not advance is never a legitimate
 * response, and following it would loop forever issuing requests — so this
 * fails loudly instead of hanging.
 */
export async function* paginate<TItem>(
  fetchPage: (startingAfter: string | undefined) => Promise<CursorPage<TItem>>,
): AsyncGenerator<TItem, void, undefined> {
  let cursor: string | undefined

  for (;;) {
    const page = await fetchPage(cursor)

    yield* page.items

    const next = page.nextStartingAfter
    // Absent, null and empty all mean "no further pages"; the two schema
    // families spell it differently and an empty cursor is unusable regardless.
    if (!isString(next) || next === "") {
      return
    }

    if (next === cursor) {
      throw new CustodyError({
        reason:
          `Pagination stalled: the server returned the same cursor it was given (${next}). ` +
          "Following it would repeat the same page indefinitely.",
      })
    }

    cursor = next
  }
}
