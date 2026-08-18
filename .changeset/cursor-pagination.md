---
"@florent-uzio/custody": minor
---

Add `paginate` — walk every page of a list endpoint instead of silently reading the first one.

Every `.list()`-style method in this SDK returns **exactly one page**, and nothing in the response says so at the call site. Roughly 40 methods across 20 namespaces are affected — `tickers.list`, `accounts.getAccountBalances`, `transactions.transfers`, `events.list`, `users.list`, every `virtualLedgers.*` list, and the rest. `startingAfter` has been in the generated types all along and nothing in `src/` ever passed it. So code that lists a collection and filters `items` itself gets `undefined` from a `.find()` and concludes the record does not exist — no error, no warning, no truncation signal of any kind.

```ts
import { paginate } from "@florent-uzio/custody"

for await (const ticker of paginate((startingAfter) =>
  custody.tickers.list({ limit: 100, startingAfter }),
)) {
  if (ticker.ledgerId === "xrpl-testnet") return ticker
}
```

It takes a callback rather than a method reference because it has to inject the cursor into a query the caller owns, and list methods disagree on arity — `tickers.list(query)` against `accounts.getAccountBalances(params, query)`. One callback shape covers both. Pages are fetched lazily: the request for page N+1 only goes out once page N's items are exhausted, so `break` and `return` cost nothing. `paginate` sets `startingAfter` and **never** `limit`, because the documented maximum varies by endpoint (100 on most, 1000 on a couple, unspecified elsewhere) — pass `limit: 100` yourself to cut round trips.

To drain a whole collection, accumulate in the loop. There is deliberately no `listAll`: the memory and request cost of pulling everything is real, and it should be visible in the code that pays it rather than hidden behind a name that reads as free.

Two things fail loudly rather than quietly. A cursor that does not advance — a page returning the same `nextStartingAfter` it was given — throws a `CustodyError` instead of looping forever issuing requests. And `paginate` will not typecheck against the endpoints that are not cursor-paginated (`omnibus.tenants.list` and `domains.sweepThresholds` page by offset; `channels.*` and `requests.*` return plain arrays), so it cannot be misapplied.

Also exports `CursorPage<TItem>`, the structural constraint on a cursor-paginated response, for annotating your own `fetchPage` closures. It is generic over both response families the API returns — `Core_*Collection` spells the cursor `string | undefined`, `VirtualAccounting_*PagedCollectionResponse` spells it `string | null` — and `paginate.ts` carries type-level assertions that real generated collections from both still satisfy it, so a regenerated spec that renames `items` or `nextStartingAfter` fails the build rather than rotting silently.

**`accounts.findByAddress` now reads every page, and can throw where it previously returned.** It filters client-side for an `AccountAddressReference`, but `/v1/addresses` returns those mixed in with every `DepositInstructionsReference` for the same address — so a real match could sit past the page boundary and the lookup would report the account as missing. That matters more than it sounds: `findByAddress` gates `resolveContext`, which every `custody.xrpl.*` method calls.

The behaviour change is in the ambiguity check. `findByAddress` throws `"Multiple accounts found for address …"` on more than one match, but it could only ever see page one — so a genuine duplicate hiding on a later page returned one arbitrary match and succeeded. It now raises. That is the function's documented contract finally holding rather than a new contract: pass `ledgerId` or `domainId` to disambiguate, as the error has always instructed. The first request is unchanged (`startingAfter` is `undefined` and dropped), so the single-page case costs exactly what it did before, and paging stops as soon as a second match appears rather than counting matches nobody reads.

One caveat worth knowing: `/v1/addresses` declares no cursor parameters in the spec, only `address`, yet returns a collection type carrying `nextStartingAfter`. If the server never populates it, nothing changes. If it populates it and honours `startingAfter`, the truncation bug is fixed. If it populates it and ignores `startingAfter`, you get the "Pagination stalled" error — a loud failure in place of a silent wrong answer, which is the trade throughout.

The other ~39 list methods are untouched and still return one page; `paginate` is opt-in per call site and nothing is deprecated. There is no `custody.tickers.paginate()`, no truncation warning, and no `maxPages` knob — [ADR-0008](../docs/adr/0008-cursor-pagination.md) records why each was rejected, and the README gains a Pagination section.
