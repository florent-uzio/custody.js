---
"@florent-uzio/custody": minor
---

Allow memos on XRPL transaction orders. `client.xrpl.proposeIntent` and `proposeIntentAndWait` accept an optional `memos` next to `Account` and `operation` (typed as the new `XrplTransactionOrderParams`), and `BatchPayloadInput` gains an optional `memos` for the outer Batch in `dryRunBatch` and `proposeBatch`. Each memo is a `Core_XrplMemo` (`memoData`, `memoType` and `memoFormat`, all hex-encoded, now exported), and memos default to none, as before. `batchToCustodyBatchPayload` now maps the outer xrpl.js Batch's `Memos` instead of dropping them; memos on inner transactions are still dropped, because the API has no field for them. `client.intents.proposePayload` already accepted memos through `parameters.memos`.
