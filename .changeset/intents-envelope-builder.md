---
"@florent-uzio/custody": minor
---

Add `intents.proposePayload` / `intents.proposeAndWait` and `domains.me()` — propose any intent without hand-assembling the request envelope.

`intents.propose` took a fully-formed request, so proposing anything that was not an XRPL transaction order meant rebuilding the same envelope every time: `type: "Propose"`, `targetDomainId`, `author`, `expiryAt` date arithmetic, `customProperties`, and a hand-minted UUID. The SDK already built exactly that envelope internally for XRPL; it was just not reachable from the `intents` namespace. It is now.

```ts
const { requestId, domainId } = await client.intents.proposePayload(
  { type: "v0_ReleaseQuarantinedTransfers", accountId, transferIds },
  { description: "Release the transfers held for review", expiryDays: 7 },
)
```

`author.id` also forced a bootstrap on the caller — `users.me()`, then find the domain, then read `userReference.id`, usually cached in a module-level mutable. Both propose methods absorb it, and `domains.me()` exposes the same resolution as `{ domainId, userId }` for anyone who needs the ids directly. `users.me()` still returns the raw reference for callers who want the public key, aliases or roles.

`proposeAndWait` polls to a terminal status, mirroring `intents.getAndWait`'s `isSuccess` / `isTerminal` convention rather than throwing. **It is not the right method for most production flows:** the default budget is 10 attempts 3s apart, and a custodian approving an intent by hand can take minutes, so it will honestly return `{ isTerminal: false, status: "Open" }` — "still waiting on a human", not a failure. Raising `maxRetries` only moves the problem; no polling budget is right for a person. Use `proposePayload`, keep the `requestId`, and pick the intent up from events or a webhook. Both the JSDoc and the new `examples/intents/release-quarantined-transfers` example say so.

The payload type is the full `Core_ProposeUserIntentPayload` union, transaction orders included — those are not XRPL-specific, and this is the only path for the other ledgers' transaction orders. XRPL callers should still prefer `xrpl.proposeIntent`, which additionally resolves the address to an account, applies a fee strategy, and returns the payload id.

Also adds `reason?: string` to `WaitForExecutionResult`, matching what `WaitForTransactionResult` already carries: one sentence saying why a wait did not succeed, `undefined` exactly when `isSuccess` is true. It prefers `state.error`, which carries a rejection code and a message from the policy engine and which nothing in the SDK surfaced before:

```ts
"Intent 1e9… was Rejected (PolicyViolation): approval threshold not met"
"Intent 1e9… was still awaiting approval after 10 attempts."
"Intent 1e9… did not execute (status: Expired)."
```

`intents.getAndWait` gains it too, and `xrpl.proposeIntentAndWait`'s intent-stage reason now comes from this one composition rather than a second hand-rolled one. As with the transaction `reason`, it is a message and not a contract — narrow on `status` and read `intent.data.state.error` for anything the code has to branch on.

Additive throughout: `intents.propose` is unchanged and remains the raw escape hatch, existing results gain a field, and nothing changes shape. Internally `buildRequestEnvelope` and `resolveDomainAndUser` moved to the `intents` and `domains` namespaces so both namespaces and `XrplService` can share one definition of each — only code importing those from `src/services/xrpl/` directly is affected.
