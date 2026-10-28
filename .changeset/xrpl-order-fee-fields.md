---
"@florent-uzio/custody": minor
---

Expose the remaining transaction-level fields of an XRPL order. `sourceTag`, `maximumFee` and `feeStrategy` are now optional on `XrplTransactionOrderParams` (`client.xrpl.proposeIntent` / `proposeIntentAndWait`) and `BatchPayloadInput` (`dryRunBatch` / `proposeBatch`), next to `memos`. The four are exported together as `XrplTransactionOrderFields`, and `Core_XrplFeeStrategy` is exported too. `feeStrategy` accepts `{ type: "SpecifiedAdditionalFee", drops }`, which was not reachable before, and still defaults to `{ type: "Priority", priority: "Low" }`. `sourceTag` and `maximumFee` are left off the order when omitted. `batchToCustodyBatchPayload` now maps the outer Batch's `SourceTag`; it does not map `Fee` to `maximumFee`.

**Breaking:** `feePriority` is removed from `XrplIntentOptions`. Replace `options.feePriority: "High"` with `feeStrategy: { type: "Priority", priority: "High" }` in the params.
