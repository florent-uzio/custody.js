---
"@florent-uzio/custody": patch
---

Fix `client.accounts.initiateCmptCompute()` and `client.accounts.initiateCmptComputeAndWait()`, which threw `Failed to canonicalize request body` before sending the request. The cMPT compute endpoint takes a plain body rather than a signed envelope, so both calls now pass `{ sign: false }` and skip canonicalization/signing.
