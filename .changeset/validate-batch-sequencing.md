---
"@florent-uzio/custody": minor
---

Add `validateBatchSequencing`, which catches inconsistent XLS-56 Batch sequencing locally before the payload reaches Custody. `dryRunBatch` and `proposeBatch` now run it first and throw a `CustodyError` for mixed configurations (e.g. the common case of an omitted outer `sequencing` — which defaults to `PlatformManaged` — combined with explicit `AccountSequence`/`Ticket` entries) instead of surfacing the server-side dry-run error. The function is also exported for proactive validation.
