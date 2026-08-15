---
"@florent-uzio/custody": minor
---

Return the payload ID from `client.xrpl.proposeIntent`, `rawSign` and `proposeBatch` instead of hiding it.

All three generate a `payloadId` when `options.payloadId` is omitted, but returned a bare `Core_IntentResponse`, which carries only `requestId`. The generated ID was therefore unrecoverable, and every follow-up keyed on the payload ID — `getMptIssuanceId`, `getMptIssuanceIdAndWait`, and any transaction lookup by `orderReference.Id` — forced the caller to pre-generate a UUID and pass it in just to learn what the SDK was about to generate anyway. The examples in this repo all did exactly that.

They now return `ProposeIntentResult` — `Core_IntentResponse & { payloadId: string }` — so `const { requestId, payloadId } = await client.xrpl.proposeIntent(...)` feeds straight into `getMptIssuanceIdAndWait({ domainId, payloadId })`. The field is added, not replaced: `requestId` is still there and existing callers keep working, so the only case that changes is exact-shape assertions on the response object. `options.payloadId` still overrides the generated value and is echoed back unchanged, which stays the way to correlate a `dryRunBatch` with its `proposeBatch`.

`provisionElGamalKeyPair` is unchanged: it proposes its own intent type rather than a transaction order, so it has no payload ID to surface.

Internally, `buildTransactionIntent` now returns `{ body, payloadId }` rather than the body alone — relevant only to code importing that builder directly.
