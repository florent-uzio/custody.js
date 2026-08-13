# custody

## 2.13.0-beta.11

### Minor Changes

- 5493381: Add `client.xrpl.findElGamalPublicKey` and `client.xrpl.getElGamalPublicKeyAndWait`, so a cMPT flow can both wait for a provisioned ElGamal key to become readable and check whether one already exists.

  `getElGamalPublicKeyAndWait(address, options?)` polls until the key is readable, then throws — the same `fetch`/`poll`/`wait` ladder `getMptIssuanceIdAndWait` already follows, with the same defaults (10 attempts, 3s apart). The vault writes the key some time _after_ the `provisionElGamalKeyPair` intent reports `Executed`, so `getElGamalPublicKey` called straight after `intents.getAndWait` legitimately finds nothing and throws `No ElGamal key provisioned for account …`. This waits that gap out instead of the caller sleeping for a fixed guess. The address is resolved once, before the loop, so the polling costs one account read per attempt and not two.

  `findElGamalPublicKey(address, options?)` returns `string | undefined` instead of throwing when no key is provisioned. An account can only be provisioned once per ledger — a second `provisionElGamalKeyPair` is rejected with `ElGamal key already provisioned for account <id> on ledger <id>` — so any script that may run twice against the same accounts has to establish first whether the key is already there. That question was previously unanswerable without catching `getElGamalPublicKey`'s error and guessing which failures mean "absent"; `findElGamalPublicKey` reports absence for the key alone, and still throws for an invalid address, an ambiguous lookup or a non-Vault account. The `find` / `get` pair mirrors `accounts.findByAddress` / `findByAddressOrThrow`.

  `getElGamalPublicKey` is unchanged — one read, throws when there is no key. Its documentation, and `provisionElGamalKeyPair`'s, now point at the two siblings and state that provisioning is once-per-ledger.

  `WaitForElGamalPublicKeyOptions` (the disambiguation of `GetElGamalPublicKeyOptions` plus `maxRetries` / `intervalMs` / `onAttempt`) and `GetElGamalPublicKeyOptions` itself are now exported from the package root, which the latter was not.

- a08f137: Add `client.transactions.byOrderAndWait({ domainId, transactionOrderId }, options)`, which waits for the transaction a transaction order produced and reports whether the ledger accepted it.

  This is the wait the SDK was missing between the two it already had. `intents.getAndWait` tells you custody accepted the order; `xrpl.getMptIssuanceIdAndWait` waits past the transaction-registration gap to read one specific field off the result. Neither answers "did the order's transaction actually land?" — which is the question every step of a multi-transaction flow has to answer before starting the next one, because an intent reporting `Executed` does not mean anything is on chain yet. It is the call to reach for straight after `intents.getAndWait`.

  Two things can go wrong after an intent executes, and the result covers both. Custody can fail to prepare or broadcast the transaction, which surfaces as `processing.status: "Failed"` carrying a hint — `InvalidUserPayload` for an operation the service could not build, `InvalidAmount`, `LockedDestination`, and so on. Or the transaction reaches the ledger and the ledger throws it out, which surfaces as `ledgerTransactionData.failure` of `FailedOnChain` or `PartiallyFailedOnChain` — and that case is why `isSuccess` is not simply `status === "Completed"`: custody reports `Completed` once it is done with the transaction, including transactions the ledger rejected. An on-chain failure is also treated as terminal in its own right, so the wait does not keep polling a rejected transaction until custody's processing status catches up.

  It returns rather than throws, following `intents.getAndWait`: `{ status, isTerminal, isSuccess, transaction }`, where `isSuccess` means completed _and_ accepted — the state a caller can safely build the next transaction on. The failure detail stays structured on the returned `transaction` (`processing.hint`, `processing.cause`, `processing.reason`, `ledgerTransactionData.failure`) instead of being flattened into an error message, so callers that want to branch on it do not have to catch and parse. Retries are on the caller's budget: `maxRetries` (default 10), `intervalMs` (default 3000), and an `onStatusCheck(status, attempt)` callback, whose `status` is `undefined` on an attempt where no transaction was registered yet. Exhausting the attempts returns `isTerminal: false` with the last state observed, and `transaction: undefined` when custody had registered none at all — which is what tells "this order never produced a transaction" apart from "it produced one that is still in flight".

  One subtlety it handles that hand-rolled versions of this loop tend to miss: an order can map to more than one transaction. When custody replaces a transaction — a fee-bumped resubmission, say — the superseded attempt stays in the collection under the same `orderReference.Id`, marked `Replaced`. Reading the first item back can therefore report the outcome of an attempt that no longer counts, and a replaced attempt already sitting at `Completed` will happily be mistaken for a landed one. The lookup drops the `Replaced` rows and takes the newest of the rest by `registeredAt`, sorted client-side so the choice does not depend on the endpoint's default ordering.

  The transaction order ID is the intent payload ID, so pass an explicit `options.payloadId` to `xrpl.proposeIntent` — the default is a fresh UUID the caller never sees, and without it there is no handle to wait on. Exports `WaitForTransactionOptions`, `WaitForTransactionResult`, `Core_TransactionProcessingStatus`, and the `TERMINAL_TRANSACTION_STATUSES` / `PENDING_TRANSACTION_STATUSES` arrays, mirroring what the intents namespace exports for intent statuses.

### Patch Changes

- bb3d63a: Name the `quarantineStatus` filter as the likely cause when a request fails with a bare `500 Internal server error`. Some Ripple Custody versions answer any transfers query carrying `quarantineStatus` with an internal error, even though the parameter is declared in every bundled OpenAPI spec — so `client.transactions.transfers({ domainId }, { quarantineStatus: "Quarantined" })` fails with nothing to go on, and the filter responsible has to be found by bisecting the query. The `hint` on `CustodyError` now points at it, and at the substitute: filtering on the deprecated `quarantined` boolean returns the same rows for `Quarantined` (`quarantined: true`).

  The parameter is not rewritten automatically. `Core_QuarantineStatus` has three values and the boolean has two, so only `Quarantined` has an exact equivalent — `quarantined: false` conflates `Released`, `Skipped` and the `null` the API returns on fee transfers — and silently substituting it would turn a loud 500 into wrong data for a caller filtering on `Skipped`. The hint fires only on a `500` whose request actually carried the parameter, and hedges on which server versions are affected, since only devbox `1.36.2` was observed. See [#238](https://github.com/florent-uzio/custody.js/issues/238).

## 2.13.0-beta.10

### Minor Changes

- 10d5935: Take an XRPL address in `client.xrpl.getElGamalPublicKey` instead of a resolved `{ domainId, accountId, ledgerId }` triple.

  `client.xrpl.getElGamalPublicKey(address, options?)` now resolves the domain, account and ledger from the r-address itself, the same way `provisionElGamalKeyPair`, `proposeIntent` and `rawSign` already do — so provisioning a key and reading it back take the identical argument, and callers no longer have to look an account ID up through `client.accounts.findByAddress` first just to name the account they already have an address for. The ledger the key is read from is the one the address resolved to, which is also the ledger the intent provisioned it on.

  Both `getElGamalPublicKey` and `provisionElGamalKeyPair` now validate the address with `isValidAddress` from xrpl.js before any request goes out, as `rawSignAndWait` and `signBatchPayload` already do for the addresses they take — a typo fails with `Invalid address: <value>` rather than as an account-not-found from the lookup endpoint, and the two cMPT methods reject the same inputs instead of one failing locally and the other at the API.

  `options.domainId` and `options.ledgerId` disambiguate: they are only needed when the address is registered more than once — across domains under the same login, or on several ledgers (`xrpl` vs `xrpl-testnet-august-2024`) — in which case the address lookup throws and names the option to pass, rather than silently picking a match. A missing ElGamal key still throws a `CustodyError`, now naming the address alongside the account and ledger.

  This is a breaking change to the method's signature: `getElGamalPublicKey({ domainId, accountId, ledgerId })` becomes `getElGamalPublicKey(address, { domainId?, ledgerId? })`, and the exported `GetElGamalPublicKeyParams` type is replaced by `GetElGamalPublicKeyOptions`. The trade-off is one extra address-resolution round-trip per call, which is what every other address-taking method on the namespace already pays.

- 9f8cb23: Take an XRPL address in `client.xrpl.getPublicKey` instead of a resolved `{ domainId, accountId }` pair.

  `client.xrpl.getPublicKey(address, options?)` now resolves the domain and account from the r-address itself, the same way `proposeIntent`, `rawSign`, `provisionElGamalKeyPair` and `getElGamalPublicKey` already do — so reading an account's signing key takes the same argument as every other address-taking method on the namespace, and callers no longer have to look an account ID up through `client.accounts.findByAddress` first just to name an account they already have an address for.

  The address is validated with `isValidAddress` from xrpl.js before any request goes out, so a typo fails with `Invalid address: <value>` rather than as an account-not-found from the lookup endpoint.

  `options.domainId` and `options.ledgerId` disambiguate: they are only needed when the address is registered more than once — across domains under the same login, or on several ledgers (`xrpl` vs `xrpl-testnet-august-2024`) — in which case the address lookup throws and names the option to pass, rather than silently picking a match.

  This is a breaking change to the method's signature: `getPublicKey({ domainId, accountId })` becomes `getPublicKey(address, { domainId?, ledgerId? })`, with a new exported `GetPublicKeyOptions` type. The trade-off is one extra address-resolution round-trip per call, which is what every other address-taking method already pays. `rawSignAndWait`, `signBatchPayload` and `signBatchPayloadAndWait` read the key off the context they have already resolved, so they make no additional call.

- 66d3565: Fix `client.xrpl.dryRunBatch` ignoring `options.ledgerId`, and apply the XRPL address guard uniformly across the namespace.

  **`dryRunBatch` dropped `ledgerId`.** Step 1 of the XLS-56 Batch flow resolved the submitter with `{ domainId }` alone while `proposeBatch` (Step 3) resolved it with `{ domainId, ledgerId }`. Since `ledgerId` is what disambiguates an address registered on more than one ledger, and the resolved ledger lands in the transaction order payload, a submitter present on both `xrpl` and `xrpl-testnet-august-2024` could have its dry-run signing data computed against a different ledger than the batch was ultimately submitted to — or fail the lookup as ambiguous at Step 1 while succeeding at Step 3. Both steps now pass the same disambiguation.

  **The address guard is now a real precondition everywhere.** `proposeIntent`, `rawSign`, `dryRunBatch` and `proposeBatch` did not validate the XRPL address they were given, so a typo surfaced as an account-not-found from the lookup endpoint (or, for the batch methods, after a version-detection round-trip) rather than as an immediate `Invalid address`. They now validate before any network call, matching `getPublicKey`, `getElGamalPublicKey`, `provisionElGamalKeyPair`, `rawSignAndWait` and `signBatchPayload`.

  The messages are unified on `Invalid <label>: <value>`, where the label names the offending parameter only when it is not simply the address. One message changes: `rawSignAndWait`'s `signerAccount` check now reports `Invalid signerAccount: <value>` instead of `Invalid signerAccount address: <value>`. `Invalid address: <value>` and `Invalid signerAddress: <value>` are unchanged.

  Callers passing malformed addresses to `proposeIntent`, `rawSign`, `dryRunBatch` or `proposeBatch` will now see a `CustodyError` earlier and from a different origin than before — the request never leaves the SDK.

  Internally, `XrplService` is regrouped by concern (intents, keys, MPT issuance, raw signing, batch) with each private helper placed under the group that owns it, and the duplicated retry loop behind `getMptIssuanceIdAndWait` and `pollManifestSignature` is now a single `pollUntil` helper. No public behaviour changes from either.

### Patch Changes

- cb1ebd2: Fix `parametersComputeToCryptographicFields` mangling optional fields the parameters-compute response returns as `null`. The API sends an explicit `null` — not an omitted key — for material it has no value for, most visibly `auditorEncryptedAmount` when the issuance has no auditor key registered. The generated types declare those fields as merely optional, so the helper's `undefined`-only checks let a `null` through to the hex→base64 conversion and emitted the field as an empty string, which the API then rejects.

  Every optional field in the helper — `senderEncryptedBalance`, `senderEncryptedBalanceVersion`, `auditorEncryptedAmount` on `Send`, `zkProof` and `auditorEncryptedAmount` on `Convert`, `auditorEncryptedAmount` on `ConvertBack` — is now omitted when it is `null` as well as when it is absent. The variant inference is null-aware for the same reason: a `null` `senderEncryptedAmount`, `amount`, `holderEncryptedAmount` or `balanceCommitment` no longer selects a variant just by being a present key, so a `Convert` response that spells out `balanceCommitment: null` is no longer read as a `ConvertBack`. A Clawback `amount` of `0` still discriminates. Values that are actually present convert exactly as before.

## 2.13.0-beta.9

### Minor Changes

- 9c075cb: Add the three `client.xrpl` methods and the encoding adapter a confidential MPT (cMPT) flow needed but had to hand-roll.

  `client.xrpl.provisionElGamalKeyPair(address, options)` proposes the `v0_ProvisionElGamalKeyPair` intent every cMPT participant — issuer, senders, receivers, and the auditor when one is configured — must have executed before any confidential operation is accepted. It is its own intent type rather than a transaction order, so unlike `proposeIntent` it takes no fee strategy and no payload ID; the usual `domainId` / `ledgerId` / `requestId` / `description` options apply. Without it, callers had to assemble the `Propose` envelope (author, expiry, target domain) by hand against `client.intents.propose`.

  `client.xrpl.getElGamalPublicKey({ domainId, accountId, ledgerId })` reads that key back from the account's `providerDetails.purposeKeys`, returning the base64 value `MPTokenIssuanceSet` takes as `issuerEncryptionKey` and `auditorEncryptionKey` — no re-encoding. An account holds one ElGamal key per ledger, hence the `ledgerId`; a missing key throws a `CustodyError` naming the account and ledger rather than returning `undefined`, since the calling code has nothing to do without it.

  `client.xrpl.getMptIssuanceId({ domainId, payloadId })` resolves the MPT issuance ID an executed `MPTokenIssuanceCreate` minted, from the payload ID of its transaction order — it looks the transaction up by `orderReference.Id`, then fetches that transaction by ID and reads the issuance off its XRPL ledger data. Two calls rather than one because the collection endpoint returns a lighter projection that omits `ledgerTransactionData.ledgerData` — the issuance ID only appears on the per-transaction detail response. The ID is minted by the ledger, so wait for the intent to execute first; pass an explicit `options.payloadId` to `proposeIntent`, since the default is a fresh UUID the caller never sees. `XrplPorts` gains matching `listTransactions(domainId, query)` and `getTransaction(domainId, transactionId)` ports, which is a breaking change for anyone implementing that interface by hand rather than using `createHttpPorts`.

  `client.xrpl.getMptIssuanceIdAndWait({ domainId, payloadId }, options)` is the polling form of the same lookup, and the one to reach for straight after `intents.getAndWait`. Custody registers the transaction an order produced — then fills in its XRPL ledger data — some time _after_ the intent reports `Executed`, so the non-polling call legitimately finds nothing at that point. It retries on the caller's budget (`maxRetries`, default 10; `intervalMs`, default 3000; plus an `onAttempt` callback) and, like its sibling, throws a `CustodyError` on exhaustion rather than returning `undefined` — it reports which of the two not-ready states the last attempt hit, which a bare `undefined` would throw away, and there is no branch a caller could usefully take without the ID.

  `parametersComputeToCryptographicFields(fields)` re-encodes what a parameters computation returns into what a confidential operation carries. `GET .../parameters-compute/{computeId}` returns every field **hex**-encoded while `Core_CmptCryptographicFields` is **base64**, so the response cannot be spliced into a `ConfidentialMPTSend` as-is. The compute response also carries no `type` discriminator where the operation's union requires one, so the adapter infers the variant from the fields present — `senderEncryptedAmount` means `Send`, a numeric `amount` means `Clawback`, a `balanceCommitment` alongside `holderEncryptedAmount` means `ConvertBack`, `holderEncryptedAmount` alone means `Convert` — and throws a `CustodyError` naming the observed keys when the shape matches none of them. One field has no counterpart in the output on purpose: a Batch entry's _top-level_ `senderEncryptedBalance` stays hex, so it is passed through at the call site rather than silently re-encoded. Exports `Core_ApiParametersComputeCryptographicFields` and `Core_CmptCryptographicFields` for the two ends of that conversion.

  Worth knowing before reaching for that adapter: on a standalone `ConfidentialMPTSend` or `ConfidentialMPTClawback`, `cryptographicFields` is derived by the platform and should be omitted entirely. It is only supplied by hand inside a Batch, where the submitter cannot compute proofs for another participant — which is the case the adapter exists for.

## 2.13.0-beta.8

### Patch Changes

- 4dedfaf: Fix `client.accounts.initiateParametersCompute()` and `client.accounts.initiateParametersComputeAndWait()`, which failed with `400 Invalid value for: body (Missing required field at 'type')` for every possible input. The API requires the request union's `type` discriminator, but — alone among the spec's single-member sealed unions — this schema does not declare its mapping, so the generated body type omits the field and there was no way to call the endpoint as typed. Both methods now inject `type: "cmpt-send"` before POSTing, so the field never has to be supplied; `InitiateParametersComputeBody` carries it as an optional property typed by the new `ParametersComputeType` export, and a caller-supplied value is preserved for when the union gains a second member. The override goes away once the spec declares the discriminator.

  Also surface the API's reason when an error response has a `text/plain` body instead of the usual JSON error shape — the second half of the same bug report, and what made the above take a while to diagnose. Only object bodies were preserved, so the validation text was discarded and the caller saw axios's generic `POST API request failed: Request failed with status code 400`, with the real reason only reachable by unwrapping `error.cause.response.data` by hand. String bodies are now used as the `CustodyError` reason, keeping the existing `<VERB> API request failed:` prefix so log greps still match; a blank body still falls back to the axios message. This affects every endpoint that declares a `text/plain` error response, which is where the most useful validation text lives.

  See [#229](https://github.com/florent-uzio/custody.js/issues/229).

## 2.13.0-beta.7

### Minor Changes

- cca44c3: Update the bundled devbox OpenAPI spec `1.36.2` to the current build, which replaces the cMPT compute endpoint with a generalised **parameters compute** one: `POST /v1/domains/{domainId}/accounts/{accountId}/cmpt-compute` and its status endpoint are gone, superseded by `.../parameters-compute` (operationIds `initiateParametersCompute` / `getParametersComputeStatus`). The SDK follows the API, so the four beta-only methods added in `2.13.0-beta.0` are renamed — `client.accounts.initiateCmptCompute` → `initiateParametersCompute`, `getCmptComputeStatus` → `getParametersComputeStatus`, `getCmptComputeStatusAndWait` → `getParametersComputeStatusAndWait`, `initiateCmptComputeAndWait` → `initiateParametersComputeAndWait` — along with their types (`CmptComputeStatus` → `ParametersComputeStatus`, `WaitForCmptComputeOptions` / `WaitForCmptComputeResult` → `WaitForParametersComputeOptions` / `WaitForParametersComputeResult`, `Core_ApiInitiateCmptComputeResponse` → `Core_ApiInitiateParametersComputeResponse`, `Core_ApiCmptComputeStatusResponse` → `Core_ApiParametersComputeStatusResponse`) and the exported `TERMINAL_CMPT_COMPUTE_STATUSES` → `TERMINAL_PARAMETERS_COMPUTE_STATUSES`. No aliases are kept: the old names pointed at endpoints the backend no longer serves. Behaviour, options and return shapes are otherwise unchanged.

  Two request/response changes ride along. The initiate response now returns the computation id as `id` rather than `cmptComputeId` — `initiateParametersComputeAndWait` reads the new field, so callers that only use the `*AndWait` helpers are unaffected. The initiate body is now a `oneOf` whose only member is the cMPT send request, in which `destination` is required rather than optional.

  The spec also adds `ConfidentialMPTClawback`: a `Core_XrplOperation_ConfidentialMPTClawback` transaction operation with `Core_CmptCryptographicFields_Clawback`, plus a `Clawback` member of the compute's `cryptographicFields` union. Both are typed and flow through `client.intents.propose()` / `client.transactions.dryRun()` with no new API. `batchToCustodyInnerTransactions` and `batchToCustodyBatchPayload` still reject a `ConfidentialMPTClawback`, because the API's `Core_BatchInnerOperation` union does not accept one — a clawback can only be proposed as a standalone transaction, not as a Batch inner transaction.

### Patch Changes

- 073d15d: Bundle the official OpenAPI specs for `1.34.11`, `1.34.12`, `1.34.13`, `1.39.0` and `1.39.2`, and regenerate the types. These five releases add no endpoints and no schemas — the API surface of `1.39.2` is identical to `1.38.0`, and the three `1.34.x` patches are identical to `1.34.10` — so there are no new namespaces or methods. `client.capabilities` now recognises the five versions.

  Two changes ride along in the generated types, both from `1.39.x`. `Core_Balance.totalAmount` and `Core_Balance.availableAmount` dropped their `minimum: 0` constraint and are now documented as "can be negative, zero, or positive"; the TypeScript type is unchanged (`string`), but code that assumed balances are never negative should be revisited. Nine already-deprecated fields also gained a `Deletion target: Mar. 31st 2027` note in their JSDoc — among them all of `Core_ApiTicker`, `Core_Approve.expiryAt` / `Core_Reject.expiryAt`, `Core_LedgerTransactionData.blockTime`, `Core_SenderTransferParty_Account.addresses` / `Core_RecipientTransferParty_Account.address`, `Core_TransactionOrderParameters_XRPL.amount` and `destinationTag`, and the `ledgerId` of `Core_v0_CreateAccount` / `Core_v0_UpdateEndpoint`.

## 2.13.0-beta.6

### Minor Changes

- ceb67ef: Add `client.internal.cbInDecryption` — the first namespace on the **internal** API surface (ADR-0007) — wrapping the two CB_IN inbox balance decryption endpoints for confidential MPT (cMPT) accounts: `POST /internal/v1/cmpt-cb-in` and `GET /internal/v1/cmpt-cb-in/{requestId}`. Methods: `initiate`, `getStatus`, plus `getStatusAndWait` / `initiateAndWait`, which poll to a terminal status (`Completed` / `Failed`) exactly like their `client.accounts.*CmptCompute*` counterparts — same `maxRetries` / `intervalMs` / `onStatusCheck` options, and a 404 while the request materializes is retried rather than thrown. `decryptedAmount` is populated on the returned status once the decryption reaches `Completed`.

  Everything under `client.internal.*` targets the instance's internal API rather than the customer-facing one: types come from `src/models/custody-internal-types.ts`, paths from the new `InternalURLs` map (`src/constants/internal-urls.ts`, typed against the internal document and deliberately non-exhaustive), and every call passes `surface: "internal"` — plus `sign: false` on writes, since no internal request body carries a signed envelope. Consequently these endpoints are only version-gated on instances that serve the internal OpenAPI document; elsewhere the guard fails open for that surface and the backend decides. They back internal tooling and are not covered by the public API's compatibility promises.

## 2.13.0-beta.5

### Minor Changes

- b7e61b1: Add an **internal API surface** to the OpenAPI type-generation pipeline (ADR-0007). Bundled specs are now organized by two orthogonal axes: **channel** (provenance — `openapi/official/`, `openapi/devbox/`, unchanged from ADR-0005) and **surface** (which API the spec describes — a spec at a channel root is `public`, one under `openapi/<channel>/internal/` is `internal`). The internal API (`/internal/v1/…`, `Internal_*` schemas) is disjoint from the public one in both paths and schemas, but reuses some of its `operationId`s (`getUsers`, `getAllEvents`), so each surface is merged into its own document and emitted as its own types file: `src/models/custody-types.ts` for public (output unchanged) and the new `src/models/custody-internal-types.ts` for internal. Within a surface the official-authoritative / devbox-additive merge rules are unchanged. The offline capability dataset stays official-only but now **unions both surfaces of a release** into one `x-app-version` entry, so an official internal spec dropped into `openapi/official/internal/` gates its endpoints under an `apiVersion` pin with no code change; the duplicate-version guard still fires per surface. Bundles the devbox `1.36.2` internal spec at `openapi/devbox/internal/openapi-1-36-2-internal.json`.

  Gating is now **per surface**. `TypedTransport` checks every call against the version guard, so without this the guard would reject every internal endpoint as unsupported the moment it became active — none of them appears in a public spec. `ResolvedCapabilities` (and each `capabilities.generated.ts` entry) now records the `surfaces` it actually describes, and the guard returns early for a surface it never enumerated — the same fail-open philosophy it already applies when no version resolves at all, narrowed to one surface. Auto-detection fetches the instance's internal document from `<apiUrl>/api/OpenAPI?scope=internal&layout=` concurrently with the public one and unions the two; the internal fetch is best-effort, so an instance that doesn't expose it simply resolves to `surfaces: ["public"]`. Detection is skipped when `apiVersion` is pinned or a custom `specSource` is supplied, and no new client option is introduced. Call sites opt in via `RequestConfig.surface`, which is stripped before the config reaches axios.

  No public API change: `custody-internal-types.ts` is not re-exported from the client, `apiVersion` still enumerates official releases only, and the `client.internal.*` namespaces that consume all of this will land in follow-up releases.

## 2.13.0-beta.4

### Minor Changes

- 9175c5a: Add a `debug` client option that logs every HTTP exchange the SDK makes, so a failing call can be diagnosed without patching the SDK or attaching a proxy. Both HTTP clients are covered — the API client and the auth token endpoint, the latter being where signature failures actually surface — and each request is paired with its response or error, carrying the status, round-trip duration and error body.

  `debug: true` writes to `console.error` (stderr, so diagnostics never mix into a program's stdout, which callers may be piping). Passing a `CustodyDebugLogger` instead routes the structured events into your own logger, for filtering or reshaping: it receives a `CustodyDebugEvent` discriminated on `kind` (`"request"`, then exactly one `"response"` or `"error"`) and tagged with `client` (`"api"` or `"auth"`). The logger is called synchronously on the request path, and one that throws is ignored rather than allowed to fail the request. Exports `CustodyDebugEvent`, `CustodyDebugLogger`, `CustodyDebugClient` and `CustodyHttpMethod` (the uppercased verb, narrowed from plain `string` to the five verbs the SDK issues plus any future string, following the same pattern as `CmptComputeStatus` and `LedgerId`).

  Credentials are always masked, in both forms — the `Authorization` request header and the `access_token` / `id_token` / `refresh_token` response fields — so events are safe to write wherever the rest of an application's logs go. Everything else is verbatim, including the auth request's `signature`, which is bound to a single challenge and is the thing you need when debugging a signature mismatch. Failures raised inside the request interceptor chain (a token request that never succeeded) emit nothing, since nothing went on the wire and the underlying cause is already logged on the auth client.

## 2.13.0-beta.3

### Patch Changes

- c2d89c0: Refresh the vendored [`XRPLF/xrpl.js@confidential-mpts`](https://github.com/XRPLF/xrpl.js/tree/confidential-mpts) builds from commit `63af7e9` to `031913c`, and bundle `@xrplf/mpt-crypto` alongside `xrpl` and `ripple-binary-codec`. Neither vendored package bumps its version upstream (`xrpl` is still `5.0.0`, `ripple-binary-codec` still `2.8.0`), so this is a contents-only refresh with no change to the SDK's own API. `@xrplf/mpt-crypto` (the WASM proof/ElGamal package) has to be vendored now because `xrpl` declares it as a plain dependency at `^0.1.0` rather than an optional peer dependency, and it is not published on the npm registry — without the bundle, installing this package would fail to resolve it. All three are pinned through `overrides` and packed via `bundleDependencies`, which grows the published package from ~3.6 MB to ~5.2 MB. See `vendor/README.md`.

  The refreshed `ripple-binary-codec` definitions rename the `MPTokenIssuanceCreate` / `MPTokenIssuanceSet` `MutableFlags` field to `ImmutableFlags` and drop the `MPTokenIssuanceMutable` ledger-entry flag map, so confidential MPT transactions now serialize against the current devbox rippled rather than the older field name. Per XLS-0094, `xrpl`'s separate `MPTokenIssuanceSetMutableFlags` (`tmfMPT*`) enum is also gone, folded into `MPTokenIssuanceSetFlags` as `tfMPTSetCanLock` (4) through `tfMPTSetCanClawback` (128). The three flag values `client.xrpl`'s adapters read numerically are unaffected — `tfMPTLock` (1), `tfMPTUnlock` (2) and `tfMPTSetCanHoldConfidentialBalance` (256) all keep their previous values — so `MPTokenIssuanceSet` operations still map to the Custody `flags` and `mutableFlags` fields as before. Applications that import `xrpl` directly and referenced `MPTokenIssuanceSetMutableFlags` will need to move those flags onto `Flags` when they update their own vendored copy.

## 2.13.0-beta.2

### Minor Changes

- 59381b5: Surface the backend's set-reordering signature defect instead of leaving it to be investigated, and add an opt-in escape hatch for it. `CustodyError` gains a `hint` field for SDK-authored diagnostics the API's own reason does not explain, plus a `reason` field holding that API reason on its own — group or compare errors on `reason`, since a hint carries request-specific details and is also appended to `message` so it survives into stack traces. `toJSON()` now returns `reason` (no longer the hint-bearing `message`) and the new `hint`. When a signed POST fails with a `401` signature error, the hint names the array fields in the signed body holding 5+ elements (e.g. `request.payload.parameters.operation.flags`), since the API deserializes some array fields into an unordered set and re-serializes them when verifying the signature — faithful up to 4 elements, hash-ordered at 5+, which breaks verification. The SDK still signs exactly the bytes it sends (JCS preserves array order by design) and reorders nothing by default. Adds a `beforeSign` client option: a hook that reshapes a request payload just before canonicalization and signing, so applications can sort such a field into the order the backend re-emits without waiting for an SDK release. The hook is typed against the new `CustodySignedRequest` export — the union of the only three signed bodies (`Core_Propose`, `Core_Approve`, `Core_Reject`) — so narrowing on `type` gives autocomplete down to the operation. See [#223](https://github.com/florent-uzio/custody.js/issues/223).

## 2.13.0-beta.1

### Patch Changes

- a99314f: Fix `client.accounts.initiateCmptCompute()` and `client.accounts.initiateCmptComputeAndWait()`, which threw `Failed to canonicalize request body` before sending the request. The cMPT compute endpoint takes a plain body rather than a signed envelope, so both calls now pass `{ sign: false }` and skip canonicalization/signing.

## 2.13.0-beta.0

### Minor Changes

- 401c018: Bundle devbox OpenAPI spec `1.36.2` (replacing `1.35.0`), adding confidential MPT support. The `ConfidentialMPTConvert`, `ConfidentialMPTConvertBack`, `ConfidentialMPTMergeInbox`, and `ConfidentialMPTSend` operations, the `ConfidentialMultiPurposeToken` ticker properties, and the `MPTSetCanConfidentialAmount` mutable flag are now typed on the existing transaction operation unions, so they flow through `client.intents.propose()` and `client.transactions.dryRun()` with no new API. Adds `client.accounts.initiateCmptCompute()` and `client.accounts.getCmptComputeStatus()` for the cMPT parameter computation used to obtain a confidential transfer's `cryptographicFields`; both responses narrow the spec's plain-`string` `status` to the exported `CmptComputeStatus` union (`Pending`, `Preparing`, `Completed`, `Failed`, plus any future string). Adds `client.accounts.getCmptComputeStatusAndWait()` and `client.accounts.initiateCmptComputeAndWait()`, which poll a computation to a terminal status (`Completed` / `Failed`) and return `{ status, isTerminal, isSuccess, compute }` — the same shape as `client.intents.getAndWait()`, with `cryptographicFields` on `compute` once the status is `Completed`. Pins `xrpl` and `ripple-binary-codec` to local builds of the unreleased [`XRPLF/xrpl.js@confidential-mpts`](https://github.com/XRPLF/xrpl.js/tree/confidential-mpts) branch (see `vendor/README.md`); both are bundled into the published package, so consumers get the confidential-MPT transaction models and binary-codec definitions without any extra setup. The bundle covers the SDK's internal use only — applications that import `xrpl` directly to build confidential MPT transactions must install that branch in their own project as well (see the "Beta releases" section of the README). `MPTokenIssuanceSet` operations built by `client.xrpl` now populate the newly required `mutableFlags` field from the xrpl.js `tfMPTSetCanHoldConfidentialBalance` flag, and pass through `issuerEncryptionKey` and `auditorEncryptionKey`. `batchToCustodyInnerTransactions` and `batchToCustodyBatchPayload` now accept the four confidential MPT transaction types as Batch inner transactions; the `ConfidentialMPTSend` ciphertexts, commitments and proof are re-encoded from the XRPL hex form to the base64 form the Custody API expects.

## 2.12.0

### Minor Changes

- 7d72365: Bundle OpenAPI specs for `1.34.9`, `1.34.10`, and `1.38.0`. `1.34.10` renamed the Gas Station sponsor endpoints from `/v1/domain/{domainId}/...` to `/v1/domains/{domainId}/...`; `client.sponsors.*` now targets the current path (the previous singular `domain` route was deprecated server-side). Adds `client.sponsors.getValidSponsors()`, `client.sponsors.addSponsoredAccount()`, and `client.sponsors.removeSponsoredAccount()`. `1.38.0` adds `client.domains.getSweepThresholds()`, `client.domains.updateSweepThresholds()`, and `client.omnibus.getInternalTransfer()`.

## 2.11.0

### Minor Changes

- b13b494: Add `exports` namespace with `generateMovementReport` and `generatePositionReport`, new in the 1.37.0 OpenAPI spec. Also bundles the 1.36.4 and 1.37.0 official specs (1.36.3 shipped no OpenAPI changes), which removes `omnibus.lock`/`omnibus.unlock` from the capability set for backends on 1.36.4+ — those endpoints were dropped from the server API in that release.
- a5cb81c: Add `client.backendVersion()` to read the resolved backend app version (from an explicit `apiVersion` or auto-detection, triggering detection if it hasn't run yet). Throws `CustodyError` if no version can ever be resolved or if live detection fails.

## 2.10.0

### Minor Changes

- d49c919: Add support for an external `signer` as an alternative to `privateKey`, so the
  private key can stay outside the SDK (e.g. in an HSM/KMS). Provide exactly one of
  `privateKey` or `signer` when constructing `RippleCustody`; `publicKey` remains
  required in both modes.

  The SDK owns canonicalization, hashing, and signature encoding. A `signer` is
  `{ algorithm, sign }`, where `sign({ data, context })` runs only the raw signing
  primitive for its `algorithm` and returns the raw signature bytes:

  - `ed25519`: the 64-byte raw Ed25519 signature over `data` (`data` is already
    SHA-256 hashed for request bodies).
  - `secp256k1` / `secp256r1`: the DER-encoded ECDSA-SHA256 signature over `data`.

  The `context` (`"auth-challenge"` | `"request-body"`) is passed through for
  HSM/KMS policy engines. A throwing/rejecting signer, or one that returns an
  invalid signature, surfaces a clear `CustodyError`, and concurrent token
  refreshes collapse into a single signer call. Signer failures are no longer
  double-wrapped: the `CustodyError` is rethrown as-is, so `error.cause` is the
  original signer error. The internal `privateKey` path now signs through the
  same shared signing scheme (context-driven prep → raw primitive → encode) as
  the external signer path, instead of content-sniffing the message.

  Also export `canonicalizeRequest(request)`, which returns the canonical JSON
  string the SDK signs for a request body (the pre-hash input), and
  `prepareSigningInput(algorithm, message, context)`, which turns it into the exact
  bytes the raw signing primitive runs over (for fully out-of-band signing), plus
  the `CustodySigner`, `CustodySignRequest`, and `CustodySignContext` types.

## 2.10.0-beta.0

### Minor Changes

- d49c919: Add support for an external `signer` as an alternative to `privateKey`, so the
  private key can stay outside the SDK (e.g. in an HSM/KMS). Provide exactly one of
  `privateKey` or `signer` when constructing `RippleCustody`; `publicKey` remains
  required in both modes.

  The SDK owns canonicalization, hashing, and signature encoding. A `signer` is
  `{ algorithm, sign }`, where `sign({ data, context })` runs only the raw signing
  primitive for its `algorithm` and returns the raw signature bytes:

  - `ed25519`: the 64-byte raw Ed25519 signature over `data` (`data` is already
    SHA-256 hashed for request bodies).
  - `secp256k1` / `secp256r1`: the DER-encoded ECDSA-SHA256 signature over `data`.

  The `context` (`"auth-challenge"` | `"request-body"`) is passed through for
  HSM/KMS policy engines. A throwing/rejecting signer, or one that returns an
  invalid signature, surfaces a clear `CustodyError`, and concurrent token
  refreshes collapse into a single signer call. Signer failures are no longer
  double-wrapped: the `CustodyError` is rethrown as-is, so `error.cause` is the
  original signer error. The internal `privateKey` path now signs through the
  same shared signing scheme (context-driven prep → raw primitive → encode) as
  the external signer path, instead of content-sniffing the message.

  Also export `canonicalizeRequest(request)`, which returns the canonical JSON
  string the SDK signs for a request body (the pre-hash input), and
  `prepareSigningInput(algorithm, message, context)`, which turns it into the exact
  bytes the raw signing primitive runs over (for fully out-of-band signing), plus
  the `CustodySigner`, `CustodySignRequest`, and `CustodySignContext` types.

## 2.9.0

### Minor Changes

- e4f564d: Add `verifyWebhookSecret` to authenticate inbound webhook deliveries. Ripple Custody does not sign or otherwise authenticate webhook deliveries — a channel's `url` carries no secret, key, or signature field — so this helper verifies a caller-managed secret embedded in the registered URL's query string (e.g. `?token=...`) instead. The webhook examples (`examples/webhooks/`) and README now demonstrate this trust boundary explicitly.

## 2.8.1

### Patch Changes

- 8fe97e2: Move the hand-written `auth` and `xrpl` object literals out of `RippleCustody`'s constructor body into `createAuth`/`createXrpl` factories in `src/namespaces/`, matching the wiring idiom already used by every other namespace. This is an internal reorganization with no runtime behavior change; `client.auth.*` and `client.xrpl.*` keep the same shape.

## 2.8.0

### Minor Changes

- 60973da: Wire the 16 `URLs` entries that had a friendly name but no namespace method calling them (follow-up to #199):

  - `client.accounts` gains 5 methods: `getLatestAddress` (deprecated), `getConfirmedBalance` (deprecated), `getTransferability`, `listDepositInstructions`, `getDepositInstruction`.
  - New `client.systemSigning.get()` for `GET /v1/system-signing/info`.
  - New `client.virtualLedgers` namespace (`list`, `create`, `get`, `update`, `getBalances`, `listOperations`, `createOperation`, `listTransfers`), with per-account operations nested under `client.virtualLedgers.accounts` (`list`, `create`, `update`, `getBalances`, `assignDepositIdentificationSource`, `getAddresses`) — mirrors the `omnibus`/`tenants` structure.

## 2.7.4

### Patch Changes

- ed131c5: Add friendly `URLs` names for 4 endpoints that existed in the generated OpenAPI
  types but had no entry in `src/constants/urls.ts` (`accountsTransferability`,
  `accountDepositInstructions`, `accountDepositInstruction`, `systemSigningInfo`).
  Also add a compile-time exhaustiveness check so a future endpoint landing in a
  bundled spec without a matching `URLs` entry fails `tsc` instead of silently
  becoming unreachable through any namespace.

## 2.7.3

### Patch Changes

- 9867c00: Extract a `Transport` interface (the 5 verb methods namespaces consume) from the concrete `TypedTransport` class, and ship a typed in-memory `FakeTransport` test double (`src/testing/fake-transport.ts`, not part of the published package) that satisfies it. All namespace factories now accept `Transport` instead of the concrete class, so tests no longer need an `as any` cast to pass a fake transport — `TypedTransport`'s private fields previously made that impossible to type correctly. Also fixed `TypedTransport.get()`'s `config` parameter, which was silently dropped instead of being forwarded like the other 4 verbs.

## 2.7.2

### Patch Changes

- ff124ef: Co-locate namespace type aliases with their namespace files (`src/namespaces/<name>.types.ts` beside `src/namespaces/<name>.ts`) instead of a separate type-only `src/services/<name>/` directory. `src/services/` now only holds the modules with real implementation logic (`apis`, `auth`, `channels`, `keypairs`, `xrpl`); the cross-cutting `DomainUserReference` type moved to `src/models/`. This is an internal reorganization with no runtime behavior change. Every previously-public type name is still exported from the package root; switching to wildcard re-exports also surfaces one additional, already-valid generated type that wasn't listed before (`GetTransactionDetailsQueryParams`).

## 2.7.1

### Patch Changes

- 5ed7812: Parallelize the two lookups in XRPL context resolution; fix leaked doc placeholders in Batch-related JSDoc.

## 2.7.0

### Minor Changes

- 6037c26: Promote Gas Station sponsorship and omnibus/tenant accounting from `client.domains.*` into their own first-class `client.sponsors.*` and `client.omnibus.*` namespaces.

  - `client.sponsors` — flat namespace, methods dropped the redundant `Sponsor` prefix where the namespace already implies it (e.g. `domains.createSponsor()` -> `sponsors.create()`, `domains.listSponsorEvents()` -> `sponsors.listEvents()`). Methods that describe sponsored/sponsorable accounts and domains keep their descriptive names (`getAccountSponsor`, `listSponsoredAccounts`, `getSponsorableDomains`, etc).
  - `client.omnibus` — core omnibus operations (`get`, `create`, `getById`, `update`, `lock`, `unlock`, `listInternalTransfers`, `listDepositWallets`) at the top level, with tenant operations nested under `client.omnibus.tenants.*` (including `client.omnibus.tenants.depositWallet.*`).

  This removes the corresponding methods from `client.domains`, which now only exposes `list` and `get`. Since these surfaces are new and not yet depended on, there is no deprecated alias kept on `domains` — call sites should move directly to `client.sponsors.*` / `client.omnibus.*`.

## 2.6.7

### Patch Changes

- fdd4a82: Fix `rawSignAndWait` to no longer mutate the transaction object passed in; `signedTransaction` is now a copy carrying the signature.

## 2.6.6

### Patch Changes

- c5bd223: PATCH requests now forward non-path params as query params, matching GET/POST/PUT/DELETE.

## 2.6.5

### Patch Changes

- 72be927: The automatic 401 retry now always fetches a fresh token instead of re-sending the cached one, recovering from server-side revocation and key rotation.

## 2.6.4

### Patch Changes

- bc876c1: Commit package-lock.json and install with npm ci in CI/release, pinning the published dependency tree; refresh transitive dependencies to the manifest ranges.

## 2.6.3

### Patch Changes

- c293ca4: Path parameters are now percent-encoded during URL template interpolation, preventing IDs containing reserved characters from rewriting the request path.

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
