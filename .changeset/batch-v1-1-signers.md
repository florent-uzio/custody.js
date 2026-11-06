---
"@florent-uzio/custody": major
---

`xrpl.signBatchPayloadAndWait` and `xrpl.signBatchPayload` now take one `signers[]` entry from `xrpl.dryRunBatch` (Batch v1.1) instead of a payload and an address.

Under Batch v1.1 each inner signer has its own signing payload. The top-level `signingPayload` that `dryRunBatch` returns is deprecated and cannot be signed. The returned `custodyBatchSigner.participant` is now the entry's `participant`, unchanged (for example `{ type: "Account", accountId }`), as Custody requires. `SignBatchPayloadHandle` and `GetBatchSignatureParams` gain `participant`, so `getBatchSignature(handle)` returns it too. New exported types: `Core_ApiBatchSignerSigningData` and `Core_Participant`.

```ts
// before
const { signingPayload } = await custody.xrpl.dryRunBatch(batchPayload)
const signed = await custody.xrpl.signBatchPayloadAndWait(signingPayload, ACCOUNT_1)

// after
const { signers } = await custody.xrpl.dryRunBatch(batchPayload)
const mine = signers.find((s) => s.account === ACCOUNT_1)!
const signed = await custody.xrpl.signBatchPayloadAndWait(mine)
```

Handles you stored from `signBatchPayload` before this release have no `participant`. Sign again to get a new handle.
