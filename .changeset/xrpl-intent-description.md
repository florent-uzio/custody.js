---
"@florent-uzio/custody": minor
---

Add an optional `description` to `XrplIntentOptions`, mapped to `request.description` on the intent. It is honored across every XRPL service method that accepts intent options — `proposeIntent`, `proposeBatch`, `dryRunBatch`, `rawSign`, `rawSignAndWait`, `signBatchPayload`, and `signBatchPayloadAndWait` — and is omitted from the request when not provided.
