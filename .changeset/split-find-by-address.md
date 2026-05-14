---
"custody": major
---

Split `findByAddress` into two variants. `accounts.findByAddress(address, ledgerId?)` now returns `AccountReference | undefined` when no account matches the address (previously threw). The throwing behavior is preserved under the new `accounts.findByAddressOrThrow(address, ledgerId?)`. Ambiguous matches (multiple results without a `ledgerId`) still throw in both variants. Callers relying on the old throw-on-not-found behavior should migrate to `findByAddressOrThrow`.
