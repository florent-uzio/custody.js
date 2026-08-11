---
"@florent-uzio/custody": minor
---

Fix `client.xrpl.dryRunBatch` ignoring `options.ledgerId`, and apply the XRPL address guard uniformly across the namespace.

**`dryRunBatch` dropped `ledgerId`.** Step 1 of the XLS-56 Batch flow resolved the submitter with `{ domainId }` alone while `proposeBatch` (Step 3) resolved it with `{ domainId, ledgerId }`. Since `ledgerId` is what disambiguates an address registered on more than one ledger, and the resolved ledger lands in the transaction order payload, a submitter present on both `xrpl` and `xrpl-testnet-august-2024` could have its dry-run signing data computed against a different ledger than the batch was ultimately submitted to — or fail the lookup as ambiguous at Step 1 while succeeding at Step 3. Both steps now pass the same disambiguation.

**The address guard is now a real precondition everywhere.** `proposeIntent`, `rawSign`, `dryRunBatch` and `proposeBatch` did not validate the XRPL address they were given, so a typo surfaced as an account-not-found from the lookup endpoint (or, for the batch methods, after a version-detection round-trip) rather than as an immediate `Invalid address`. They now validate before any network call, matching `getPublicKey`, `getElGamalPublicKey`, `provisionElGamalKeyPair`, `rawSignAndWait` and `signBatchPayload`.

The messages are unified on `Invalid <label>: <value>`, where the label names the offending parameter only when it is not simply the address. One message changes: `rawSignAndWait`'s `signerAccount` check now reports `Invalid signerAccount: <value>` instead of `Invalid signerAccount address: <value>`. `Invalid address: <value>` and `Invalid signerAddress: <value>` are unchanged.

Callers passing malformed addresses to `proposeIntent`, `rawSign`, `dryRunBatch` or `proposeBatch` will now see a `CustodyError` earlier and from a different origin than before — the request never leaves the SDK.

Internally, `XrplService` is regrouped by concern (intents, keys, MPT issuance, raw signing, batch) with each private helper placed under the group that owns it, and the duplicated retry loop behind `getMptIssuanceIdAndWait` and `pollManifestSignature` is now a single `pollUntil` helper. No public behaviour changes from either.
