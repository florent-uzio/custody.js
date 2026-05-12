---
"custody": minor
---

`findByAddress` and `XrplService` now accept an optional `ledgerId` to disambiguate addresses that exist on multiple ledgers (e.g. `xrpl-mainnet` and `xrpl-testnet`) under the same login. Previously the first match was silently returned, which could route intents to the wrong ledger. When the lookup is ambiguous and no `ledgerId` is provided, a `CustodyError` is now thrown asking the caller to specify one. The new `ledgerId` option is available on `XrplIntentOptions` (and therefore on `proposeIntent`, `rawSign`, and `rawSignAndWait`).
