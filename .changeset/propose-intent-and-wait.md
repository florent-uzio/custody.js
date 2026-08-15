---
"@florent-uzio/custody": minor
---

Add `client.xrpl.proposeIntentAndWait`, which proposes an XRPL transaction intent and waits it out to the ledger.

Following a write through took three calls — `xrpl.proposeIntent`, then `intents.getAndWait`, then `transactions.byOrderAndWait` — plus a `users.me()` bootstrap to learn the domain id. The sequencing is SDK knowledge, not application knowledge: an intent reporting `Executed` only means custody accepted the transaction order, and the transaction can still fail while custody prepares it or once it is on chain. Every consumer following a write was rewriting the same loop.

```ts
const result = await client.xrpl.proposeIntentAndWait({ Account, operation })

if (result.isSuccess) {
  // The transaction completed and the ledger accepted it
  console.log(result.transaction)
} else if (!result.intent.isSuccess) {
  // Rejected by policy, expired, or still open when the attempts ran out —
  // no transaction was ever created
  console.log(result.intent.status)
}
```

The result is a `WaitForTransactionResult` — `status`, `isTerminal`, `isSuccess` and `transaction` all describe the transaction, exactly as `transactions.byOrderAndWait` reports them — plus `intent` for the stage before it, and the `requestId`, `payloadId` and `domainId` the intent was proposed under. Both halves are returned because the flow has two failure surfaces: an intent that never executes produces no transaction at all, which at the top level would otherwise be indistinguishable from a transaction still in flight. `domainId` is the domain resolved from `Account`, so follow-ups such as `getMptIssuanceIdAndWait({ domainId, payloadId })` no longer need the `users.me()` bootstrap.

It never throws on a failed intent or transaction, matching `intents.getAndWait` and `transactions.byOrderAndWait`; propose-time errors (invalid address, a rejected request) still throw. The transaction stage is skipped entirely when the intent does not execute, and the polling stages are configured separately through `options.intent` and `options.transaction`, each defaulting to 10 attempts 3s apart. The address is resolved once for both stages.

Internally the two polling loops are now shared rather than restated: `waitForExecution` and `waitForOrderTransaction` take the lookup as a callback, so the namespaces drive them through the transport and `XrplService` through its ports (`XrplPorts` gains `getIntent`). Only relevant to code implementing `XrplPorts` directly.
