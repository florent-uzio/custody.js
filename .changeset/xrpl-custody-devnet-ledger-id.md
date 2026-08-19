---
"@florent-uzio/custody": patch
---

Add `xrpl-custody-devnet` to the known `XrplLedgerId` values.

Autocomplete only. `XrplLedgerId` ends in `(string & {})`, so the ledger already worked everywhere a `ledgerId` is accepted — it just had to be typed out from memory, with a silent lookup failure as the penalty for a typo. Nothing else changes: no existing id is renamed or removed, and the type is as assignable from arbitrary strings as it was before.
