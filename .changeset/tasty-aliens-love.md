---
"custody": minor
---

chore: remove Batch transaction support — disable rawSignInnerBatch, rawSignInnerBatchAndWait, batchSignersToCustodyBatchSigners, and rawTransactionsToInnerTransactions until Batch is re-supported

feat(accounts): add compliance configuration endpoints — `listComplianceConfigurations`, `getComplianceConfiguration`, and `upsertComplianceConfiguration` on the accounts namespace, plus a new `put()` method on `ApiService` and `TypedTransport` to support the PUT verb.
