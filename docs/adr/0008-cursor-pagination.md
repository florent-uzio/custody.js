# ADR-0008 — Cursor pagination as one generic helper

- Status: Accepted (2026-08-17, on `feat/issue-248-pagination`)
- Date: 2026-08-17
- Related: ADR-0004 (type-generation pipeline), ADR-0007 (public vs internal
  surfaces), [#248](https://github.com/florent-uzio/custody.js/issues/248)

## Context

Roughly **40 namespace methods** across ~20 namespaces return a paginated
collection — `tickers.list`, `accounts.addresses` / `balances` / `manifests`,
`transactions.list` / `transfers` / `orders`, `events.list`, `users.list`,
`vaults.list`, every `virtual-ledgers.*` list, the `sponsors.*` lists, and the
rest. Every one of them returns **exactly one page**, and until this ADR nothing
in `src/` read a cursor: `startingAfter` was typed by the generated `operations`
map and never passed.

The failure mode is the bad kind — no error, no warning. Code lists a collection,
filters `.items` client-side, gets `undefined` from `.find()`, and concludes the
record does not exist. That is not hypothetical: `findByAddress`
(`src/namespaces/accounts.ts`) did exactly this against `/v1/addresses`, and it
gates `resolveContext`, which **every** `custody.xrpl.*` method calls.

Three facts about the API shape decide the design.

1. **The envelope is uniform.** 32 generated collection schemas share
   `{ items, count, currentStartingAfter?, nextStartingAfter? }`. There is no
   `hasMore` and no `totalElements`, so end-of-collection is `nextStartingAfter`
   being absent — **authoritative**, not a `count < limit` heuristic.
   Two families differ only in spelling: `Core_*Collection` makes the cursor
   optional (`string | undefined`), `VirtualAccounting_*PagedCollectionResponse`
   makes it nullable (`string | null`).
2. **`limit` is not uniform.** In `openapi-1-39-2.json`: `maximum` is `100` on 29
   endpoints, `1000` on 2, unspecified on 5; `default` is unspecified on 26,
   `20` on 8 (all gas-station), `100` on 2. There is no single ceiling a helper
   could safely inject.
3. **Two endpoints are not cursor-based at all.** `omnibus.tenants.list` and
   `domains.sweepThresholds` return `Omnibus_*PageResponse`, a page/offset
   envelope. `channels.*` and `requests.*` return bare arrays with no pagination
   of any kind.

Call-site arity is also not uniform: `tickers.list(query?)` takes a query only,
while `accounts.addresses(params, query?)` takes path params first. So a helper
that accepts a **bound method reference** cannot type uniformly across both
without overloads.

## Decision

**1. One generic free function, `paginate`, yielding items.**

```ts
export async function* paginate<TItem>(
  fetchPage: (startingAfter: string | undefined) => Promise<CursorPage<TItem>>,
): AsyncGenerator<TItem, void, undefined>
```

It lives in `src/helpers/paginate/`, is exported from the package root beside
`canonicalizeRequest` and `prepareSigningInput`, and is **not** a method on
`RippleCustody` — it needs no client state, and `RippleCustody` is a container of
namespaces, not of loose methods.

`fetchPage` receives the cursor positionally (`undefined` on the first call) and
owns the rest of the query. Pages are fetched lazily: the request for page N+1
only goes out once page N's items are exhausted, so `break` costs nothing.

**2. `paginate` never sets `limit`.** It writes `startingAfter` and nothing else.
Given fact (2) above there is no safe default, and silently overriding an absent
`limit` would change request shape in a way the caller cannot see. Callers pass
`limit: 100` themselves; the JSDoc says so.

**3. Draining is the caller's `for await` loop, not a second symbol.** Three
lines accumulate into an array, and the unbounded-memory risk a `listAll` would
have carried sits with the caller who wrote them, explicitly, rather than hiding
behind an innocuous method name.

`await Array.fromAsync(paginate(…))` does the same in one line, and is what the
first draft of this ADR recommended — but **it does not typecheck in this
package**. TypeScript places `Array.fromAsync` in `lib: esnext`, not `es2024`,
so it is unavailable under this repo's `target: es2024` even though Node ≥ 22
implements it. Raising `lib` to `esnext` for one convenience was rejected: it
would admit every other ESNext API project-wide, unreviewed, for a three-line
saving. Consumer projects whose own `lib` includes it can still use it — the docs
say so.

**4. A non-advancing cursor throws.** If a page's `nextStartingAfter` equals the
cursor that produced it, `paginate` throws a `CustodyError` ("Pagination
stalled"). This is an invariant, not policy: no legitimate response repeats its
own cursor, and following it would spin forever issuing requests. There is
deliberately **no `maxPages` / `maxItems`** option — that would invent a
truncation behaviour the API does not have, and a caller who wants a bound
already has `break`.

Absent, `null` and empty-string cursors all mean end-of-collection. An **empty
page that still carries a cursor is followed**, not treated as the end — the
cursor is authoritative, and server-side filtering can legitimately empty a page
while later pages still hold matches.

**5. `CursorPage<TItem>` is hand-authored, generic, and guarded by a
compile-time canary.**

```ts
export type CursorPage<TItem> = {
  items: TItem[]
  nextStartingAfter?: string | null
}
```

`CLAUDE.md` forbids hand-written types that mirror OpenAPI schemas. This one is
permitted under the same clause as `WaitForExecutionOptions`: it is a structural
constraint over _every_ cursor collection, not a restatement of one endpoint's
contract, and it is generic, so it cannot drift from a specific schema. Deriving
it from a generated schema instead is not possible without electing one family as
canonical — and `Core_*`'s `string | undefined` cursor would **reject** every
`VirtualAccounting_*` collection, whose cursor is `string | null`.

The honest risk in hand-authoring is silent rot, so `paginate.ts` carries
type-level assertions that real generated collections from **both** families
still satisfy `CursorPage`. Two properties are asserted per schema, because
assignability alone is insufficient: it catches a renamed or retyped `items`
(required in `CursorPage`) but **not** a renamed `nextStartingAfter`, since a
vanished optional field still satisfies the constraint. `HasCursorFields<T>`
closes that hole by asserting key presence.

The canary lives in `paginate.ts`, **not** `paginate.test.ts`, because
`tsconfig.json` excludes `**/*.test.ts` and Vitest does not typecheck — type
assertions in the test file would never be checked by `build`, `typecheck` or
`ci`. The assertions are pure types and emit no runtime code. Verified: renaming
`nextStartingAfter` in `Core_TickersCollection` fails `tsc`.

**6. `findByAddress` is the only internal call site converted.** It filters
client-side on `type === "AccountAddressReference"` over
`Core_AddressReferenceCollection`, which mixes in every
`DepositInstructionsReference` for the same address — so a real match can be
pushed off page one. It also stops paging as soon as a second match appears,
since the ambiguity check needs only two.

Two other sites were considered and rejected. `fetchMptIssuanceId`
(`xrpl.service.ts`) filters on `orderReference.Id`; a single transaction order
yielding >100 transactions is not a realistic shape.
`waitForOrderTransaction` filters the same way but is a **polling predicate** —
draining would multiply requests per poll tick by the page count to answer a
question that only needs _any_ match, making it strictly worse.

**7. No truncation warning, anywhere.** The debug facility already emits
`{ kind: "response", …, body }` with the **full parsed body, `nextStartingAfter`
included**, so instrumented consumers can already see truncation with no SDK
change. A new `kind: "truncated"` would widen a union documented as "one HTTP
exchange the SDK observed" to carry something that is not an exchange. And
`console.warn` — the only channel that reaches consumers who have `debug` off,
i.e. the ones with the bug — is unignorable noise in a library for every caller
paging deliberately. The channels that actually reach them are the changeset and
the README.

## Consequences

- **`findByAddress` can now throw where it previously returned.** A genuine
  duplicate hiding on page two was invisible, so the call returned one arbitrary
  match and succeeded; it now raises `"Multiple accounts found for address …"`.
  This is not a contract change — the JSDoc already documented the ambiguity
  throw — it is that contract finally being honoured. Shipped as **`minor`**
  accordingly: nothing in the public documentation promised the old behaviour.
- **`findByAddress`'s first request is unchanged.** `startingAfter` is
  `undefined` on the first call and dropped by axios, so the single-page case
  costs exactly what it did before — one request, byte-identical.
- **`/v1/addresses` declares no cursor params**, only `address`, yet returns
  `Core_AddressReferenceCollection` with a `nextStartingAfter` field. If the
  server never populates it, `findByAddress` behaves exactly as before. If it
  populates it and honours `startingAfter`, the truncation bug is fixed. If it
  populates it and _ignores_ `startingAfter`, the cursor-advance assertion from
  §4 raises "Pagination stalled" — a loud failure replacing a silent wrong
  answer, which is the trade this ADR makes throughout.
- **The other ~39 list methods are unchanged.** They still return one page.
  `paginate` is opt-in per call site; nothing is deprecated.
- **Batch-oriented consumers get no help.** An item iterator hides page
  boundaries, so code wanting to process 500 rows at a time calls `list` in its
  own loop — exactly what it does today, nothing lost.
- **The page/offset endpoints are out of scope.** `omnibus.tenants.list` and
  `domains.sweepThresholds` do not satisfy `CursorPage` and will not compile
  against `paginate`, which is the correct outcome rather than a silent misuse.
- CONTEXT.md gains **Cursor page** and **Cursor collection**.

## Rejected alternatives

- **A `paginate` / `listAll` method on each of the ~40 collection methods.**
  The obvious shape, and the one a future reader will propose on seeing 40
  un-paginated lists. It doubles a large surface permanently, must be added to
  every new list method forever, and buys nothing a generic helper does not — the
  call site is three lines either way. This ADR exists largely to record that
  rejection so it is not re-proposed as an obvious improvement.
- **A `listAll(query?)` drain returning an array.** Unbounded memory and
  unbounded request count, with the unboundedness hidden behind an innocuous
  name. A three-line `for await` accumulate gives the same capability while making
  the caller own the cost.

- **Raising `tsconfig` `lib` to `esnext` so `Array.fromAsync` typechecks.** One
  line, and it would make the drain idiom a one-liner — but it admits every
  ESNext API project-wide with no review, and this repo is deliberately
  conservative about compiler config (cf. ADR-0006 deferring TypeScript 7). Not
  worth it for a three-line saving in documentation.
- **A page-yielding iterator.** Preserves `count` and allows batching, but forces
  a nested loop on the common case — the thing the helper exists to remove. And
  `count` is per-page, not a total, so it preserves less than it appears to.
- **Both an item iterator and a page iterator.** Covers everything; is two
  permanent symbols for a second use case with no demonstrated demand.
- **`paginate` as a method on `RippleCustody`.** More discoverable by
  autocomplete, but it needs no client state, it breaks the
  container-of-namespaces shape, and once present it invites the reasonable
  expectation that `custody.tickers.paginate(…)` exists — the 40-method surface
  above.
- **Accepting a bound method reference**, `paginate(custody.tickers.list, query)`.
  Terser, but list arity is not uniform (`(query?)` vs `(params, query?)`), so it
  needs overloads and loses `this`.
- **`paginate` defaulting `limit` to 100.** Fewer round trips by default, but the
  documented maximum varies by endpoint and it changes the request the caller
  believes it made.
- **A `maxPages` / `maxItems` guardrail.** Policy dressed as safety: it invents
  truncation the API does not have, and it is the same silent-truncation failure
  mode this issue was filed about, only with a different cause.
- **An internal-only helper, nothing public** (option 1 in #248). Fixes the SDK's
  own correctness in a day with zero permanence risk, but knowingly leaves every
  consumer holding the footgun. "The SDK is correct but you aren't" is a bad
  place for an SDK to sit.
- **Converting `waitForOrderTransaction` and `fetchMptIssuanceId` as well.** See
  §6 — one is a hot polling loop where draining is actively harmful, the other
  has no realistic multi-page shape.
- **A `kind: "truncated"` debug event, or a `console.warn`.** See §7 — the
  information is already in the `"response"` event's body, and the only channel
  reaching the affected consumers is one no library should use.
- **Deriving `CursorPage` from a generated schema.** Anchored against renames,
  but no single schema can serve both families (`string | undefined` vs
  `string | null`), it drags in a required `count` that pagination does not use,
  and it reads badly in an error message. The compile-time canary buys the
  anchoring without electing a canonical schema.
- **A `.test-d.ts` type-test suite via `vitest --typecheck`.** The natural home
  for the canary, but it introduces a new testing convention and a CI script
  change for six lines of assertions that `tsc` already checks when they sit in
  source.
- **An `examples/pagination/` script.** Every existing example is an end-to-end
  XRPL flow; this would be ~40 lines of client bootstrap around a 3-line point,
  and the only single-concept example — inviting one per feature. The README
  snippet is the same three lines, and the JSDoc puts them in the editor.
