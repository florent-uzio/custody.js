# custody

## 1.1.0

### Minor Changes

- 68ca3ed: rawSignInnerBatchAndWait now returns batchSigner (xrpl.js BatchSigner format) and custodyBatchSigner (Ripple Custody API format) alongside the existing signature and signingPubKey fields. This removes the need for callers to manually construct BatchSigner objects or call batchSignersToCustodyBatchSigners after signing.

  Changes
  - src/services/xrpl/xrpl.types.ts — Added RawSignInnerBatchAndWaitResult type extending RawSignAndWaitResult with batchSigner and custodyBatchSigner fields.
  - src/services/xrpl/xrpl.service.ts — Updated rawSignInnerBatchAndWait to return the new type, constructing both batch signer formats from the signer address, public key, and signature.
  - src/index.ts — Exported RawSignInnerBatchAndWaitResult.
  - src/services/xrpl/xrpl.service.test.ts — Extended test to verify both batchSigner and custodyBatchSigner are returned correctly.
  - examples/xrpl/batch/multi-accounts/index.ts — Added example demonstrating the multi-account batch flow using the new return fields.

## 1.0.1

### Patch Changes

- dbbfca7: Handle MPT (Multi-Purpose Token) amounts in the Payment operation converter.

## 1.0.0

### Major Changes

- d9bab8f: ### Breaking: Unified XRPL intent API with `proposeIntent()`

  The 13 per-transaction-type methods on `custody.xrpl` (`sendPayment`, `createTrustline`, `depositPreauth`, `clawback`, `mpTokenAuthorize`, `offerCreate`, `accountSet`, `ticketCreate`, `batch`, `mpTokenIssuanceCreate`, `mpTokenIssuanceSet`, `mpTokenIssuanceDestroy`) have been replaced by a single `proposeIntent()` method that accepts a discriminated union on the `type` field.

  **Before:**

  ```typescript
  await custody.xrpl.sendPayment({
    Account: "rSender...",
    amount: "100",
    destination: { address: "rDest...", type: "Address" },
  })
  ```

  **After:**

  ```typescript
  await custody.xrpl.proposeIntent({
    Account: "rSender...",
    operation: {
      type: "Payment",
      amount: "100",
      destination: { address: "rDest...", type: "Address" },
    },
  })
  ```

  New XRPL transaction types are supported automatically when the OpenAPI spec is regenerated — no new SDK method required.

  ### Other changes
  - `XrplService` now accepts an `XrplPorts` interface for I/O dependencies, enabling simpler testing with in-memory adapters instead of mock-heavy setups.
  - `DomainResolverService` has been removed. Its domain resolution and user validation logic is now internal to the HTTP port adapter.
  - `rawSign`, `rawSignAndWait`, `rawSignInnerBatch`, `rawSignInnerBatchAndWait`, and `getPublicKey` are unchanged.
  - `Core_XrplOperation` and `XrplPorts` are now exported from the package.
  - `DomainResolveOptions` is no longer exported (use `domainId` in `XrplIntentOptions` instead). `DomainUserReference` remains exported.

## 0.9.0

### Minor Changes

- c2e3385: New TicketCreate support for XRPL service

## 0.8.2

### Patch Changes

- 54844a1: Add batch adapters functions

## 0.8.1

### Patch Changes

- bc028c7: Add batch transaction support to XRPL service

## 0.8.0

### Minor Changes

- df285d6: Add methods to sign XRPL transactions via custody and poll for the manifest

## 0.7.1

### Patch Changes

- 0712e4c: Fix raw signing and added getPublicKey for the XRPL

## 0.7.0

### Minor Changes

- e912ce9: Fix request and payload id in xrpl service

## 0.6.0

### Minor Changes

- ceefe79: Fix JWT refresh, update requests return types, more type exports

## 0.5.1

### Patch Changes

- 3b1dd1e: export mpt types

## 0.5.0

### Minor Changes

- e4eeb7b: compatible with 1.32

## 0.4.0

### Minor Changes

- 8f814b2: compatible with 1.31. Removed MPT create, set, destroy and several API paths.

## 0.3.0

### Minor Changes

- 77b5e52: New MPT Issuance, Set and Destroy wrappers

## 0.2.2

### Patch Changes

- 9f5d837: Auth throws CustodyError, authUrl without suffix /token

## 0.2.1

### Patch Changes

- f75c256: refactored domain and user resolver

## 0.2.0

### Minor Changes

- 56eab60: Added lots of tests, laze loading services, token race condition fix

## 0.1.0

### Minor Changes

- d298e13: New waitForExecution function for the intents and new rawSign function for xrpl

## 0.0.2

### Patch Changes

- 248956d: xrpl wrappers
