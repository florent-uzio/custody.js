---
"@florent-uzio/custody": patch
---

Fix `rawSignAndWait` to no longer mutate the transaction object passed in; `signedTransaction` is now a copy carrying the signature.
