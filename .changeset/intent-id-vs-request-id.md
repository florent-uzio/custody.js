---
"@florent-uzio/custody": patch
---

Fix `client.xrpl.proposeIntentAndWait` polling the wrong id, and add `intentId` to every propose result that was missing it.

`Core_IntentResponse.requestId` is a distinct, server-generated id for the request itself — not the id the resulting intent is polled or approved by. The actual intent id is the envelope's own `id` (`options.requestId`, or a fresh UUID v7 when omitted), which the SDK generates client-side before sending and the server then assigns to the intent it creates. `proposeIntentAndWait` was polling `getIntent` with the response's `requestId` instead of that envelope id, so once the two diverge (they are independently generated and not guaranteed to match), the wait 404-loops until it times out and reports the intent as never registered — even when it executed successfully.

`client.xrpl.proposeIntent`, `proposeIntentAndWait`, `proposeBatch`, `rawSign` and `provisionElGamalKeyPair`, and `client.intents.proposePayload` / `proposeAndWait`, now all return `intentId` alongside the existing `requestId` (and `payloadId`, where applicable) — the id to pass to `intents.getAndWait` / `getIntent`, or to poll and approve the intent by. `proposeIntentAndWait` and `intents.proposeAndWait` now poll with `intentId` internally instead of `requestId`. Additive: `requestId` is unchanged and still returned, so only exact-shape assertions on the response object are affected.

Internally, `buildTransactionIntent` and `buildRequestEnvelope`'s callers now capture the envelope before it is sent, rather than relying on the response to carry an id it never did.
