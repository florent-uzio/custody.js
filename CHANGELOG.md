# custody

## 2.6.2

### Patch Changes

- 2f3e843: Fix `accounts.forceUpdateAccountBalances` to POST to `/balances/refresh` instead of `/balances`, and fix both `forceUpdateAccountBalances` and `accounts.generateNewExternalAddressDeprecated` to send `ledgerId`/`tickerId` as query params instead of a JSON request body (both operations declare `requestBody: never`).

## 2.6.1

### Patch Changes

- c377cca: Fix non-intent POST methods (intents.dryRun, transactions.dryRun, genesis.run, ledgers.processEthereumContractCall, userInvitations.create/fill, vaults.importPreparedOperations) throwing "Failed to canonicalize request body" before sending — they now skip request signing, matching the API contract.

## 2.6.0

### Minor Changes

- 9c1cd06: Add new read namespaces, a nested compliance namespace, and upgrade dependencies.

  **New namespaces** (all typed from the OpenAPI-generated spec):

  - `client.health.liveness()` / `.readiness()` — `GET /v1/health`, `GET /v1/ready`
    (available on backend versions ≥ 1.36.1).
  - `client.systemProperties.list()` — `GET /v1/properties`.
  - `client.backups.list()` / `.get()` / `.getTrustedEntity()`.
  - `client.providers.list()` / `.get()` / `.getLocations()`.
  - `client.trustedPublicKeys.listTrustedCollection()` / `.listApi()` / `.listMessages()`.
  - `client.compliance.*` — a nested namespace (`providers`, `policy`, `domain`,
    `analysis`, `travelRule`) covering the `/v1/domains/{domainId}/compliance/*`
    endpoints.

  **Transport**: `post`/`put` now forward non-path parameters as query params
  (matching the existing `get`/`delete` behavior), which the query-bearing
  compliance endpoints require. Non-breaking for existing callers.

  **Dependencies**: upgraded axios, xrpl (v5), canonicalize (v3), uuid (v14),
  dotenv (v17), vitest (v4), and others. TypeScript is pinned to 5.9 — see
  [ADR-0006](docs/adr/0006-defer-typescript-7.md) for why TypeScript 7 is deferred.
  Removed the unused `ts-node` dev dependency.

## 2.5.0

### Minor Changes

- 683144a: Multi-version support (foundation): generate the SDK's types from **all** bundled OpenAPI specs in `openapi/` as one superset type universe, and emit per-version capability data for an upcoming runtime version guard.

  - Types now cover endpoints and schemas from every bundled backend version — XRPL Batch (1.35.0), the provider/deposit endpoints unique to 1.35.4, system-signed intents (`Core_IntentBody`, `Core_IntentAuthor`, `GET /v1/system-signing/info`) introduced in 1.36.0, gas-station sponsorship (`/v1/domain/{domainId}/sponsors/*`, sponsor/sponsorable/sponsored account and domain endpoints) introduced in 1.36.1, and omnibus accounts (`/v1/domains/{domainId}/omnibus/*`, tenants, deposit wallets, internal transfers, lock/unlock) introduced in 1.36.2 — merged by structural union so nothing any version defines is dropped.
  - `accounts.findByAddress` now returns only `AccountAddressReference` matches, discriminating against the newly-typed `DepositInstructionsReference` a 1.35.4 instance can return.
  - `apiVersion`/`KnownAppVersion` now also accepts 1.34.8 and 1.35.1–1.35.3/1.35.5, backfilling official version history between the already-bundled releases. None of these introduce new endpoints or schemas beyond what newer bundled versions already cover, so the type superset itself is unchanged — only the set of versions `apiVersion` can pin to grows.

  `client.domains` gains callable methods for the sponsor and omnibus endpoints introduced in 1.36.1/1.36.2, alongside the existing `list`/`get`:

  - **Gas-station sponsorship**: `getSponsor`, `createSponsor`, `updateSponsor`, `deleteSponsor`, `listSponsors`, `getAccountSponsor`, `getDomainSponsor`, `listSponsoredAccounts`, `listSponsoredDomains`, `getSponsorableDomains`, `addSponsoredDomains`, `getSponsorableAccounts`, `addSponsoredAccounts`, `listSponsorEvents`.
  - **Omnibus accounts**: `getOmnibus`, `createOmnibus`, `getOmnibusById`, `updateOmnibus`, `lockOmnibus`, `unlockOmnibus`, `listOmnibusInternalTransfers`, `listOmnibusDepositWallets`, `listOmnibusTenants`, `createOmnibusTenant`, `getOmnibusTenant`, `updateOmnibusTenant`, `getOmnibusTenantDepositWallet`, `createOmnibusTenantDepositWallet`, `createOmnibusInternalTransfer`, `lockOmnibusTenant`, `unlockOmnibusTenant`, `createOmnibusWithdrawal`.
  - Both are gated automatically like every other endpoint — pinning `apiVersion` to a version that predates 1.36.1/1.36.2 throws `UnsupportedInVersionError` for these calls with no extra guard code required. Their request/response types (`GasStation_*`, `Omnibus_*`, plus path/query param types) are exported from the package root alongside every other resource's types.
  - `/v1/health` and `/v1/ready` (also new in 1.36.1) are intentionally not exposed here — they're global, domain-less system health checks, out of scope for the `domains` namespace.

  New `apiVersion` client option pins the SDK to a specific backend version and enables **runtime capability gating**:

  - Calls the pinned version cannot serve throw `UnsupportedInVersionError` (exposing the missing capability, its kind, the version, and the SDK method). Endpoint availability is checked centrally in the transport; XRPL feature availability (e.g. Batch) is checked in the xrpl service, including operations passed through `xrpl.proposeIntent`. `xrpl.rawSign` is never gated.
  - `apiVersion` accepts only versions the SDK bundles (its type is `KnownAppVersion`), so a typo is a compile error; an unbundled value from untyped code throws at construction, listing the known versions.

  By default (no `apiVersion`), the SDK now **auto-detects** the backend's capabilities from its live OpenAPI spec:

  - On the first API call it fetches `<apiUrl>/api/OpenAPI?scope=&layout=` once (cached for the client's lifetime; concurrent first calls dedupe to a single fetch) and gates against the instance's actual capabilities — accurate even for backend versions the SDK has never bundled.
  - The constructor stays synchronous. `await client.ready()` front-loads detection and surfaces its errors. `autoDetectVersion: false` disables it; `openApiUrl` overrides the fetch URL; `specSource` fully overrides the fetch (advanced).

  Gating **fails open**: whenever no backend version can be resolved — the live-spec fetch fails, or auto-detection is disabled with no `apiVersion` — calls pass through unchanged (the backend stays the authority) and the SDK emits a single warning per client. It never invents an `UnsupportedInVersionError` it cannot justify.

  Bundled specs are organized by **channel** — official releases (`openapi/official/`) and devbox/feature-branch builds (`openapi/devbox/`):

  - Both channels merge into the one superset type universe, so preview features that ship ahead of an official release (XRPL Batch today) stay typed in the main namespace. On a merge conflict, official is authoritative and devbox is additive-only.
  - The offline capability data — and therefore the versions `apiVersion` accepts — is built from **official specs only**. Pinning `apiVersion` to an official release correctly blocks preview features until an official release ships them; real devbox instances are handled by live auto-detection. `apiVersion` stays a plain official version string (no devbox/channel flag).

## 2.4.0

### Minor Changes

- 7354152: Add `validateBatchSequencing`, which catches inconsistent XLS-56 Batch sequencing locally before the payload reaches Custody. `dryRunBatch` and `proposeBatch` now run it first and throw a `CustodyError` for mixed configurations (e.g. the common case of an omitted outer `sequencing` — which defaults to `PlatformManaged` — combined with explicit `AccountSequence`/`Ticket` entries) instead of surfacing the server-side dry-run error. The function is also exported for proactive validation.
- 7354152: Add an optional `description` to `XrplIntentOptions`, mapped to `request.description` on the intent. It is honored across every XRPL service method that accepts intent options — `proposeIntent`, `proposeBatch`, `dryRunBatch`, `rawSign`, `rawSignAndWait`, `signBatchPayload`, and `signBatchPayloadAndWait` — and is omitted from the request when not provided.

## 2.3.0

### Minor Changes

- 40589c2: Add non-blocking variants for signing Batch payloads. `xrpl.signBatchPayload` proposes the raw sign intent and returns a serializable handle without waiting for the manifest signature, and `xrpl.getBatchSignature` fetches the signature (single-shot by default, optional polling) for that handle once the custody instance operator has approved it. Use these when operator approval happens out-of-band; `signBatchPayloadAndWait` remains for the synchronous case.

  `signBatchPayload` (and therefore `signBatchPayloadAndWait`) now validates `signerAddress` with `isValidAddress` and throws a `CustodyError` if it is not a valid XRPL address.

## 2.2.0

### Minor Changes

- 7ff76c6: fix: flatten intent polling retry logic in `waitForExecution` (`intents.getAndWait`)

  The nested `getIntentWithRetry` loop would throw a 404 that bypassed the outer
  `waitForExecution` retry loop, causing `getAndWait` to fail immediately when the
  intent was not yet available (e.g. right after proposing) instead of polling for it.
  - Merged `getIntentWithRetry` into `waitForExecution` as a single retry loop that
    treats a 404 as "not available yet" and keeps polling until `maxRetries`.
  - A persistent 404 (intent never materializes) now throws a `CustodyError` with
    `statusCode` 404 after `maxRetries` attempts.
  - Fixed the timeout path: the result is now derived from the last observed intent,
    so it can no longer report a terminal status with `isTerminal: false`.
  - Removed `notFoundRetries` and `notFoundIntervalMs` from `WaitForExecutionOptions`.

## 2.1.0

### Minor Changes

- a06b440: Added an `endpoints` namespace exposing the domain-scoped Endpoints API.
  - `client.endpoints.list({ domainId }, query?)` returns `Core_TrustedEndpointsCollection`, backed by `GET /v1/domains/{domainId}/endpoints` (`getEndpoints`). The optional query bag supports paging (`limit`, `startingAfter`), sorting (`sortBy`, `sortOrder`), and the same metadata / `ledgerId` / `alias` / `address` / `lock` filters defined in the OpenAPI spec.
  - `client.endpoints.get({ domainId, endpointId })` returns `Core_TrustedEndpoint`, backed by `GET /v1/domains/{domainId}/endpoints/{endpointId}` (`getEndpoint`).
  - New public type exports from the SDK barrel: `Core_TrustedEndpoint`, `Core_TrustedEndpointsCollection`, `GetEndpointPathParams`, `GetEndpointsPathParams`, `GetEndpointsQueryParams`.

## 2.0.0

### Major Changes

- ad207f0: Reworked `accounts.findByAddress` (breaking).
  - Split into two variants. `accounts.findByAddress(address, opts?)` returns `Core_AccountAddressReference | undefined` when no account matches the address (previously threw). The throwing behavior is preserved under the new `accounts.findByAddressOrThrow(address, opts?)`. Callers relying on the old throw-on-not-found behavior should migrate to `findByAddressOrThrow`.
  - The optional `ledgerId` parameter has moved into an options bag, which also accepts a new `domainId` filter to disambiguate the same address across multiple domains: `findByAddress(address, { ledgerId?, domainId? })`.
  - Both helpers now return the full `Core_AccountAddressReference` from the OpenAPI spec (`id`, `address`, `ledgerId`, `domainId`, `accountId`, `createdAt`, `custodyType`, `type`) instead of the previous lean `{ accountId, ledgerId, address }`. The hand-authored `AccountReference` type has been renamed to `XrplAccountReference` and moved to the xrpl service — it is the SDK-internal shape consumed by `IntentContext`, not the address-lookup return type.
  - Ambiguous matches (multiple results without enough filters to disambiguate) still throw in both variants. The error message now reads `Please specify ledgerId and/or domainId to disambiguate.`
  - Added three new public type exports — `LedgerId`, `XrplLedgerId`, and `NonXrplLedgerId` — backed by a loose-autocompletion union (`"ethereum" | "xrpl" | … | (string & {})`). Any `string` is still assignable, so this is non-breaking, but IDEs now suggest the supported ledgers. Applied to `FindByAddressOptions.ledgerId` (any ledger), `XrplAccountReference.ledgerId` and `XrplIntentOptions.ledgerId` (XRPL-only).
  - Supports API for Ripple Custody 1.35.0.

## 1.7.1

### Patch Changes

- 94b22d2: Provides loose autocomplete for ledgerId in XrplIntentOptions

## 1.7.0

### Minor Changes

- ebb7a38: `findByAddress` and `XrplService` now accept an optional `ledgerId` to disambiguate addresses that exist on multiple ledgers (e.g. `xrpl-mainnet` and `xrpl-testnet`) under the same login. Previously the first match was silently returned, which could route intents to the wrong ledger. When the lookup is ambiguous and no `ledgerId` is provided, a `CustodyError` is now thrown asking the caller to specify one. The new `ledgerId` option is available on `XrplIntentOptions` (and therefore on `proposeIntent`, `rawSign`, and `rawSignAndWait`).

## 1.6.0

### Minor Changes

- 9cbdfa0: Adds the Genesis endpoint and the types

## 1.5.0

### Minor Changes

- dc9222b: `rawSignAndWait` now returns a `signedTransaction` field — the input transaction with `TxnSignature` and `SigningPubKey` set — so callers receive a ready-to-submit `SubmittableTransaction` without having to manually apply the signature fields.

## 1.4.2

### Patch Changes

- ea37203: Provides an EDS Webhook Event type that includes traceId and msg. This is a custom type.

## 1.4.1

### Patch Changes

- 159a7d4: The generated EDS_WebhookChannelCreate collapsed to never because the spec's discriminator carries no mapping, so openapi-typescript injects type: "EDS_WebhookChannelCreate" and intersects it with the allOf branch's type?: "WEBHOOK". Compose the type from the generated EDS_ChannelCreate base instead, dropping the poisoned type field and re-pinning it to "WEBHOOK".

## 1.4.0

### Minor Changes

- 591ff58: feat(policies): add `client.policies` namespace with `list({ domainId }, query?)` and `get({ domainId, policyId })`, mapping to `GET /v1/domains/{domainId}/policies` and `GET /v1/domains/{domainId}/policies/{policyId}` respectively. Re-exports `Core_TrustedPoliciesCollection`, `Core_TrustedPolicy`, `Core_Policy`, `Core_PolicyScope`, `Core_PolicyCondition`, `Core_PolicyCondition_And`, `Core_PolicyCondition_Or`, `Core_PolicyCondition_Expression`, `GetPoliciesPathParams`, `GetPoliciesQueryParams`, and `GetPolicyPathParams` from the package root.

## 1.3.0

### Minor Changes

- 31a7354: feat/eds — EDS Channels & Events support

  New namespaces on RippleCustody

  client.events
  - list(params, query?) — fetches a paginated Core_EventsCollection from the Core events endpoint.

  client.channels (EDS — Event Delivery Service)
  - list(params) — list all channels for a domain
  - get(params) — get a single channel
  - create(params, body) — create a channel (sent unsigned, no signed-envelope wrapping)
  - update(params, body) — update a channel via PATCH
  - delete(params) — delete a channel
  - test(params) — trigger a test delivery on a channel
  - listEvents(params) — list events for a specific channel
  - getEvent(params) — get a single channel event
  - listAllEvents(params) — list events across all channels for a domain

  New helper

  parseEventPayload(event: EDS_Event): Core_HarmonizeEvent — parses the JSON-encoded payload string on an EDS_Event into a fully typed Core_HarmonizeEvent. Narrows the inner payload.type discriminator so callers can switch on the event variant. Throws CustodyError on missing payload, invalid JSON, or missing type discriminator.

  Transport layer changes
  - Added patch<T> and delete<T> methods to TypedTransport and ApiService
  - Added sign?: boolean option to post() — when false, the request body is forwarded as-is without canonicalization or signed-envelope wrapping (used by channel create/test which use a flat body format)

  New types exported from package root:

  EDS_Channel, EDS_ChannelCreate, EDS_ChannelUpdate, EDS_Event, EDS_WebhookChannelCreate, all channel path-param types, plus Core_EventScope, Core_EventsCollection, Core_HarmonizeEvent Core_HarmonizeEventPayload, and the event path/query param types.

## 1.2.1

### Patch Changes

- 76665c9: Release a new version as the previous 1.2.0 didnt show up

## 1.2.0

### Minor Changes

- c2673f3: chore: remove Batch transaction support — disable rawSignInnerBatch, rawSignInnerBatchAndWait, batchSignersToCustodyBatchSigners, and rawTransactionsToInnerTransactions until Batch is re-supported

  feat(accounts): add compliance configuration endpoints — `listComplianceConfigurations`, `getComplianceConfiguration`, and `upsertComplianceConfiguration` on the accounts namespace, plus a new `put()` method on `ApiService` and `TypedTransport` to support the PUT verb.

## 1.1.2

### Patch Changes

- 6b6a587: fix: guard against undefined body in `ApiService.post()` signature check

  POST requests with no body (e.g. `userInvitations.complete`, `cancel`, `renew`) crashed with `Cannot read properties of undefined (reading 'signature')` because the signing logic accessed `body.signature` without a null check.

## 1.1.1

### Patch Changes

- 2d9684c: fix: flatten manifest polling retry logic in waitForManifestSignature

  The nested `getManifestWithRetry` loop would throw a 404 that bypassed the outer `waitForManifestSignature` retry loop, causing `rawSignAndWait` and `rawSignInnerBatchAndWait` to fail immediately when the manifest wasn't ready yet.
  - Merged `getManifestWithRetry` into `waitForManifestSignature` as a single retry loop that handles both 404s and missing signatures
  - Removed `notFoundRetries` and `notFoundIntervalMs` from `WaitForSignatureOptions`
  - Changed `maxRetries` default from 10 to 3

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
