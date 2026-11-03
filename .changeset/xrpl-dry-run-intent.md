---
"@florent-uzio/custody": minor
---

Dry run a single XRPL operation before proposing it (#294). `xrpl.dryRunIntent(params, options)` dry-runs the same `v0_CreateTransactionOrder` request `proposeIntent` would send and returns Custody's verdict (`success`, `errors`, `result`, `estimate`) with the `intentId` and `payloadId` it was built under, without throwing on a failed dry run. `proposeIntent` and `proposeIntentAndWait` accept `dryRun: true` to dry-run first and propose the exact request that passed (same ids and expiry), throwing a `CustodyError` with Custody's reasons and proposing nothing when it fails. `ProposeIntentOptions` and `DryRunIntentResult` are exported from the package root.
