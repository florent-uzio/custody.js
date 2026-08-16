---
"@florent-uzio/custody": minor
---

Add `xrpl.buildConfidentialSend` — builds one confidential MPT Batch leg, proofs included, from a single call.

A confidential send submitted on its own needs no client-side cryptography: `xrpl.proposeIntent({ type: "ConfidentialMPTSend" })` has the platform derive the material. A Batch leg cannot work that way — the inner transaction has to exist, fully formed and signed, _before_ the Batch is dry-run — so the proofs have to be computed up front and spliced in by hand. That was roughly 90 lines of pure mechanism in every consumer: initiate the `cmpt-send` parameters computation, poll it, assert it completed, narrow an untagged response union, map nine camelCase fields onto their PascalCase transaction counterparts, remember `Flags: tfInnerBatchTxn`, and split off the three fields the XRPL wire format has no room for.

```ts
const leg = await custody.xrpl.buildConfidentialSend({
  sender: senderAddress,
  destination: destinationAddress,
  issuanceId,
  amount: "1000",
  ticketSequence,
})

batch.RawTransactions.push({ RawTransaction: leg.transaction })

const payload = batchToCustodyBatchPayload(autofilled, {
  confidentialSends: { [senderAddress]: leg.entryFields },
})
```

`sender` and `destination` are XRPL addresses, as everywhere else in `custody.xrpl` — the sender's domain, account id and ledger are resolved from its address through the same `resolveContext` the other methods use, so callers no longer have to carry custody account ids alongside addresses. Pass `domainId` / `ledgerId` only when the address is registered more than once, and `polling` to raise the computation's default budget of 10 attempts 3s apart.

The result is the `ConfidentialSendLeg` the pairing needs: `transaction` is the xrpl.js `ConfidentialMPTSend`, ready to push onto a `Batch`; `entryFields` is the already-exported `ConfidentialSendEntryFields` — the plaintext `amount`, `senderEncryptedBalance` and `senderEncryptedBalanceVersion` — which feeds straight into the `confidentialSends` option shipped alongside `batchToCustodyBatchPayload`. `senderEncryptedBalance` stays **hex**, as that option expects, unlike the operation's base64 `cryptographicFields`. `ticketSequence` is optional: omit it for a leg sequenced by account sequence and it is left off both the transaction and the compute request. `AuditorEncryptedAmount` is carried when present and dropped when the response spells it out as `null`, which it does whenever no auditor key is registered.

The builder only ever produces Batch legs, so it always stamps `Flags: tfInnerBatchTxn`. A computation that does not complete, or that returns material for some other confidential operation, throws a `CustodyError` naming the account and the status rather than yielding a half-built transaction.

Also exports `isSendCryptographicFields`, the type guard that narrows `Core_ApiParametersComputeCryptographicFields` to its `Send` variant. The parameters-compute response carries no `type` discriminator, unlike the operation union, so the variant has to be inferred from the fields present — which left every consumer hand-writing a guard over a generated union, where a wrong one fails at the ledger rather than at the call site. `buildConfidentialSend` applies it internally; reach for it directly only when building a confidential send by hand.

Internally, `accounts.initiateParametersComputeAndWait` moved to module scope in the `accounts` namespace so both that namespace and `XrplService` (through a new port) drive one definition of the initiate-then-poll pair. The `accounts` method is unchanged.
