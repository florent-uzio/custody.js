# Intents: proposing, waiting, and reading the outcome

Every write in Ripple Custody is an **intent** — a signed request the platform
approves, then executes. Nothing in the SDK mutates state without one.

This page covers what the intent lifecycle actually looks like, because the
shape that reads as obvious is wrong in two ways that cost callers real
debugging time:

- an intent reporting `Executed` means custody **accepted** the order, not that
  a transaction landed on the ledger;
- the ids the SDK generates are the only handle on the work it started, and
  they are not the same id.

## The two stages

```
propose ──► intent reaches a terminal status ──► transaction reaches a terminal state
            (Executed / Rejected / Expired /     (Completed / Failed / Interrupted,
             Failed)                              plus the ledger's own verdict)
```

Only ledger-writing intents have a second stage. A `v0_CreateUser` or a
`v0_ReleaseQuarantinedTransfers` is finished when the intent is.

Both stages can fail, and they fail for unrelated reasons: the first on policy
(no approval, expired, rejected), the second on custody's own preparation
(`InvalidUserPayload`) or on chain (`FailedOnChain`). A result that reports
`isSuccess: false` is therefore not self-explanatory, which is why every wait
carries a `reason`.

## Which method to reach for

| You want to…                                    | Call                                                                      | Returns                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Write to the XRPL and know it landed            | `xrpl.proposeIntentAndWait(params, options?)`                             | Both stages' outcome, plus `requestId` / `payloadId` / `domainId` |
| Write to the XRPL, follow it up yourself        | `xrpl.proposeIntent(params, options?)`                                    | `{ requestId, payloadId }`                                        |
| Propose any other intent and know it executed   | `intents.proposeAndWait(payload, options?)`                               | The intent outcome, plus `requestId` / `domainId`                 |
| Propose any other intent, follow it up yourself | `intents.proposePayload(payload, options?)`                               | `{ requestId, domainId }`                                         |
| Send a request envelope you assembled yourself  | `intents.propose(body)`                                                   | `{ requestId }`                                                   |
| Wait on an intent you already proposed          | `intents.getAndWait({ domainId, intentId }, options?)`                    | The intent outcome                                                |
| Wait on the transaction an order produced       | `transactions.byOrderAndWait({ domainId, transactionOrderId }, options?)` | The transaction outcome                                           |

## The XRPL path

`xrpl.proposeIntentAndWait` covers both stages in one call. It also resolves the
domain from the sender address, so there is no `users.me()` bootstrap.

```ts
const result = await custody.xrpl.proposeIntentAndWait(
  {
    Account: "r...",
    operation: { type: "Payment", destination: { type: "Address", address: "r..." }, amount: "20" },
  },
  // Both stages default to 10 attempts, 3s apart, and are configured separately
  // because they wait on different things: custody, then the ledger.
  { transaction: { maxRetries: 20 } },
)

if (result.isSuccess) {
  console.dir(result.transaction) // completed, and the ledger accepted it
} else {
  console.log(result.reason)
}
```

The top level **is** `transactions.byOrderAndWait`'s result — `status`,
`isTerminal`, `isSuccess`, `transaction`, `reason` — so anything written against
that method reads the same here. The intent stage hangs off `result.intent`.

The transaction stage is skipped entirely when the intent does not execute: no
transaction is coming, so there is nothing to wait for. That is why
`result.intent.isSuccess` is the check that separates "rejected by policy" from
"the transaction failed" — both otherwise present as `isSuccess: false` with no
transaction.

## The generic path

Everything that is not an XRPL transaction order goes through `intents`. The
envelope — `type: "Propose"`, `author`, `targetDomainId`, `expiryAt`, `id`,
`customProperties` — is built for you from the resolved domain context:

```ts
const { requestId, domainId } = await custody.intents.proposePayload(
  { type: "v0_ReleaseQuarantinedTransfers", accountId, transferIds },
  { description: "Release the transfers held for review", expiryDays: 7 },
)
```

The payload type is the full `Core_ProposeUserIntentPayload` union — around 45
`v0_*` types, transaction orders included. Those are not XRPL-specific
(`Core_ProposeTransactionOrderParameters` covers Bitcoin, Ethereum, Solana and
the rest), so this is the only path for other ledgers' transaction orders. For
the XRPL, prefer `xrpl.proposeIntent`: it additionally resolves the address to
an account, applies a fee strategy, and returns the payload id.

`intents.propose` still takes a fully-assembled `Core_ProposeIntentBody` for
callers who build the envelope themselves.

## Approval flows: do not wait in production

`proposeAndWait` and `getAndWait` default to 10 attempts 3s apart — **30
seconds**. A custodian approving an intent by hand can take minutes. Against a
real deployment these will routinely return:

```ts
{ isTerminal: false, status: "Open", isSuccess: false,
  reason: "Intent 1e9… was still awaiting approval after 10 attempts." }
```

That is the honest answer — "still waiting on a human", not a failure — which is
why it is reported rather than thrown.

**Raising `maxRetries` does not fix this.** No polling budget is right for a
person; the right budget is a property of the operator's deployment, not of the
SDK. In production:

```ts
const { requestId, domainId } = await custody.intents.proposePayload(payload)
// …persist the ids, then pick the intent up when the approval lands —
// from a webhook (client.channels), the event log (client.events), or a sweep
const intent = await custody.intents.get({ domainId, intentId: requestId })
```

Reserve the waiting variants for development, auto-approved policies, and tests.

## The two ids

They are different ids and they are not interchangeable:

| Id          | What it identifies                                          | Where it comes from                                                                              |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `requestId` | The **intent** — poll and approve by this                   | Returned by every propose method; override with `options.requestId`                              |
| `payloadId` | The **transaction order** — look the transaction up by this | Returned by `xrpl.proposeIntent` / `proposeBatch` / `rawSign`; override with `options.payloadId` |

Both are generated as UUID v7s when you do not supply them, and both are
returned — you never have to pre-mint an id to learn what the SDK is about to
use:

```ts
const { requestId, payloadId } = await custody.xrpl.proposeIntent({ Account, operation })

await custody.intents.getAndWait({ domainId, intentId: requestId })
await custody.transactions.byOrderAndWait({ domainId, transactionOrderId: payloadId })
const issuanceId = await custody.xrpl.getMptIssuanceIdAndWait({ domainId, payloadId })
```

`domainId` is returned by `proposePayload`, `intents.proposeAndWait` and
`xrpl.proposeIntentAndWait` for exactly this reason: every follow-up is
domain-scoped, and the XRPL methods resolve the domain from an address the
caller may not be able to map themselves. `domains.me()` returns the same
`{ domainId, userId }` pair directly for anyone who needs it outside a propose.

## Reading a failure

Every wait result carries three booleans-worth of meaning and one sentence:

- **`isSuccess`** — the state you can safely build the next step on. For a
  transaction that means custody completed it _and_ the ledger accepted it;
  custody reports `Completed` even for transactions the ledger threw out.
- **`isTerminal`** — whether the flow is over. False means "not yet", not
  "failed": the attempts ran out while the work was still in flight.
- **`reason`** — one sentence saying why `isSuccess` is false, `undefined`
  exactly when it is true.

```ts
if (!result.isSuccess) {
  throw new Error(result.reason)
  // "Intent 1e9… was Rejected (PolicyViolation): approval threshold not met"
  // "Intent 1e9… was still awaiting approval after 10 attempts."
  // "Transaction 6f0… was rejected by the ledger (FailedOnChain)."
  // "Transaction 6f0… failed before it reached the ledger (InvalidUserPayload)."
  // "No transaction was registered for the order after 10 attempts."
}
```

`reason` exists because the information is spread across surfaces that are
mutually exclusive in practice but not in the types — `intent.data.state.error`,
`processing.hint`, `processing.cause` / `processing.reason`, and
`ledgerTransactionData.failure` — so reading it by hand means narrowing a union
on every call site. It is composed most-specific-first: a ledger rejection
outranks the `Completed` status sitting next to it, and a policy `error` outranks
the bare status.

> **`reason` is a message, not a contract.** Its wording will change between
> releases. Narrow on `status` and read `intent.data.state.error` /
> `processing` / `ledgerTransactionData` for anything the code has to branch on.

Nothing in either stage throws on a failed intent or transaction — the outcome is
the return value. Propose-time errors (invalid address, malformed request,
rejected signature) still throw `CustodyError`.

## Examples

- [`examples/xrpl/propose-and-wait`](../examples/xrpl/propose-and-wait/index.ts) —
  the XRPL path, including reading the two failure branches apart
- [`examples/intents/release-quarantined-transfers`](../examples/intents/release-quarantined-transfers/index.ts) —
  the generic path, and why to prefer `proposePayload` in production
