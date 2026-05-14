---
"custody": major
---

Reworked `accounts.findByAddress` (breaking).

- Split into two variants. `accounts.findByAddress(address, opts?)` returns `Core_AccountAddressReference | undefined` when no account matches the address (previously threw). The throwing behavior is preserved under the new `accounts.findByAddressOrThrow(address, opts?)`. Callers relying on the old throw-on-not-found behavior should migrate to `findByAddressOrThrow`.
- The optional `ledgerId` parameter has moved into an options bag, which also accepts a new `domainId` filter to disambiguate the same address across multiple domains: `findByAddress(address, { ledgerId?, domainId? })`.
- Both helpers now return the full `Core_AccountAddressReference` from the OpenAPI spec (`id`, `address`, `ledgerId`, `domainId`, `accountId`, `createdAt`, `custodyType`, `type`) instead of the previous lean `{ accountId, ledgerId, address }`. The hand-authored `AccountReference` type is still exported but is now an SDK-internal shape consumed by `IntentContext`, not the address-lookup return type.
- Ambiguous matches (multiple results without enough filters to disambiguate) still throw in both variants. The error message now reads `Please specify ledgerId and/or domainId to disambiguate.`
- Added three new public type exports — `LedgerId`, `XrplLedgerId`, and `NonXrplLedgerId` — backed by a loose-autocompletion union (`"ethereum" | "xrpl" | … | (string & {})`). Any `string` is still assignable, so this is non-breaking, but IDEs now suggest the supported ledgers. Applied to `FindByAddressOptions.ledgerId` (any ledger), `AccountReference.ledgerId` and `XrplIntentOptions.ledgerId` (XRPL-only).
- Supports API for Ripple Custody 1.35.0.
