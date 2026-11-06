---
"@florent-uzio/custody": minor
---

`batchToCustodyBatchPayload` now maps the outer Batch's XLS-68 `Sponsor` + `SponsorFlags` to order-level `sponsorship`. Before, the outer sponsorship was silently dropped. The key is left off when the Batch has no `Sponsor`, and inconsistent sponsor fields throw a `CustodyError`. Only `spfSponsorFee` is valid on an outer Batch: the ledger rejects `spfSponsorReserve` there.
