---
"custody": minor
---

rawSignInnerBatchAndWait now returns batchSigner (xrpl.js BatchSigner format) and custodyBatchSigner (Ripple Custody API format) alongside the existing signature and signingPubKey fields. This removes the need for callers to manually construct BatchSigner objects or call batchSignersToCustodyBatchSigners after signing.

Changes

- src/services/xrpl/xrpl.types.ts — Added RawSignInnerBatchAndWaitResult type extending RawSignAndWaitResult with batchSigner and custodyBatchSigner fields.
- src/services/xrpl/xrpl.service.ts — Updated rawSignInnerBatchAndWait to return the new type, constructing both batch signer formats from the signer address, public key, and signature.
- src/index.ts — Exported RawSignInnerBatchAndWaitResult.
- src/services/xrpl/xrpl.service.test.ts — Extended test to verify both batchSigner and custodyBatchSigner are returned correctly.
- examples/xrpl/batch/multi-accounts/index.ts — Added example demonstrating the multi-account batch flow using the new return fields.
