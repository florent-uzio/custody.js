---
"custody": minor
---

`rawSignAndWait` now returns a `signedTransaction` field — the input transaction with `TxnSignature` and `SigningPubKey` set — so callers receive a ready-to-submit `SubmittableTransaction` without having to manually apply the signature fields.
