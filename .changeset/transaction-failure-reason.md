---
"@florent-uzio/custody": minor
---

Add `reason` to `WaitForTransactionResult` — one sentence saying why a wait did not succeed.

`transactions.byOrderAndWait` and `xrpl.proposeIntentAndWait` deliberately never throw, so every caller that wanted to log or re-throw the failure was writing the same assembly: dig `hint` out of `processing` with an `in` check because the union only carries it on some statuses, pull `reason` and `cause` off an `Interrupted` one, then append `ledgerTransactionData.failure` for the on-chain case. The SDK is the only place that knows which of those three surfaces applies.

```ts
const result = await client.xrpl.proposeIntentAndWait({ Account, operation })

if (!result.isSuccess) {
  throw new Error(result.reason)
  // "Transaction 6f0… was rejected by the ledger (FailedOnChain)."
  // "Transaction 6f0… failed before it reached the ledger (InvalidUserPayload)."
  // "No transaction was registered for the order after 10 attempts."
}
```

It is `undefined` exactly when `isSuccess` is true, and set on every other outcome, including the non-terminal ones — a wait that ran out of attempts is still a caller-visible failure, and "still in flight after 10 attempts" is the sentence to log for it. On `proposeIntentAndWait` it covers both stages: when the intent never executes there is no transaction to describe, so the reason names the intent and its status instead of reporting a missing transaction.

`reason` is a message, not a contract — its wording will change. Narrow on `status` and read `processing` / `ledgerTransactionData` off the returned transaction for anything the code has to branch on.

Additive: existing results gain a field, nothing changes shape.
