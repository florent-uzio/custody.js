# Context — custody.js

A TypeScript SDK for the Ripple Custody API. All SDK types derive from an
OpenAPI-generated file (`src/models/custody-types.ts`); see `CLAUDE.md` for the
type-authoring rules.

## Multi-version model

The Ripple Custody backend has **no API versioning** — every instance serves
`/v1/...` regardless of which app release it runs. Different instances run
different releases, and releases are **not monotonic supersets** of one another:
a higher `x-app-version` can expose _fewer_ endpoints than a lower one (e.g.
`1.35.4` lacks the provider/deposit-instruction endpoints an earlier build has).
Bundled specs also come from two **channels** — official releases and devbox
(feature-branch) builds — and `x-app-version` is not unique across them (the
devbox `1.35.0` build carries XRPL Batch that no official release has yet). See
[ADR-0005](docs/adr/0005-official-vs-devbox-channels.md).

SDK users typically do **not** know which release their instance runs and will
not check the spec by hand. So the SDK reconciles a single published surface
with many possible backends by:

1. Compiling against one **superset** type universe merged from all bundled
   specs (permissive — every endpoint/schema any known version has is typed).
2. Resolving the target instance's **capabilities** at runtime — preferring the
   instance's **live spec**, auto-detected on first call — and running a
   **fail-open guard** that blocks only calls the resolved instance provably
   cannot serve.

Design decisions are recorded in `docs/adr/`. Start with
[ADR-0001](docs/adr/0001-multi-version-support-strategy.md).

## Glossary

Use these terms exactly; avoid the listed synonyms so issues, tests, and code
stay consistent.

- **App version** — the Ripple Custody _release_ identifier, read from
  `info.x-app-version` in the spec (e.g. `1.35.4`). **Not** `info.version`,
  which is always `"v1"` (the API major, not the release). Avoid "API version"
  for the release — reserve "API version" for the `/v1` prefix.

- **Backend / instance** — a running Ripple Custody deployment the SDK talks to,
  identified by its `apiUrl`. Each runs one app version.

- **Live spec** — the OpenAPI document fetched at runtime from a reachable
  instance at `<apiUrl>/api/OpenAPI?scope=&layout=`. The runtime source of truth
  for that instance's capabilities. Appears to be unauthenticated.

- **Bundled spec** — an OpenAPI JSON committed to `openapi/`, keyed by its
  internal `info.x-app-version`. Bundled specs feed the type generator and serve
  as the offline / explicit-`apiVersion` capability fallback. They are **not**
  the primary runtime capability source. Every bundled spec belongs to a
  **channel** and a **surface** (see below).

- **Channel** — the provenance of a bundled spec, given by its subdirectory
  under `openapi/`: **official** (`openapi/official/`) or **devbox**
  (`openapi/devbox/`). Official specs are authoritative; devbox specs are
  types-only. See [ADR-0005](docs/adr/0005-official-vs-devbox-channels.md).

- **Official spec** — a bundled spec under `openapi/official/`, from a real
  Ripple Custody release. Unique by `info.x-app-version`. Official specs drive
  the offline capability dataset and are the only values `apiVersion` accepts;
  on a merge conflict, official wins.

- **Devbox spec** — a bundled spec under `openapi/devbox/`, from a feature-branch
  build. May expose **preview features** ahead of any official release. Merged
  into the superset types only (additively); **excluded** from the offline
  capability dataset and from `apiVersion`. Real devbox instances are handled at
  runtime by auto-detection reading the live spec.

- **Preview feature** — a capability present only in a devbox spec, not yet in
  any official release (e.g. XRPL Batch today). Typed in the superset and usable
  against a real devbox instance via auto-detection, but blocked by any offline
  `apiVersion` pin until an official release ships it.

- **Surface** — which of the two APIs an instance serves a bundled spec
  describes: **public** or **internal**. Orthogonal to channel — both channels
  can carry both surfaces. Given by the spec's folder: `openapi/<channel>/` is
  public, `openapi/<channel>/internal/` is internal. Each surface merges into
  its own types file. See
  [ADR-0007](docs/adr/0007-public-vs-internal-surfaces.md).

- **Public spec** — a bundled spec at a channel root, describing the customer-
  facing API (`/v1/…`, `Core_*` schemas). Generates
  `src/models/custody-types.ts`.

- **Internal spec** — a bundled spec under `openapi/<channel>/internal/`,
  describing the internal API (`/internal/v1/…` and `/api/notifications/…`,
  `Internal_*` / `Notification_*` schemas) used by internal tooling. An instance
  serves it live at `<apiUrl>/api/OpenAPI?scope=internal&layout=`. Disjoint from
  the public spec in paths and schemas, but
  reuses some of its `operationId`s, so it generates its own
  `src/models/custody-internal-types.ts`. Shares its release's
  `x-app-version`, and unions into that version's capability entry.

- **Internal namespace** — an SDK namespace whose endpoints live on the internal
  surface. All of them hang off `client.internal.*` (so the two surfaces'
  `operationId`s cannot collide on the client), import
  `src/models/custody-internal-types.ts`, name their paths in
  `src/constants/internal-urls.ts` (`InternalURLs`, deliberately non-exhaustive,
  unlike the public `URLs`), and pass `surface: "internal"` — plus `sign: false`
  on writes, since no internal body carries a signed envelope.

- **Superset types** — the merged type universe for one surface — public in
  `src/models/custody-types.ts`, internal in
  `src/models/custody-internal-types.ts` — the union of every bundled spec of
  that surface's `paths`, `operations`, and `components`. The SDK's own code
  compiles against these and nothing else. Grows with the number of _distinct_
  endpoints/schemas (bounded), not with the number of versions.

- **Capability** — a unit the guard can check for presence in a version. Two
  kinds:

  - **Endpoint capability** — a `(method, path-template)` pair, e.g.
    `GET /v1/domains/{domainId}/virtual-ledgers`.
  - **Feature capability** — the presence of a named component schema, e.g.
    `Core_XrplOperation_Batch`. Used for operations that ride _inside_ an
    existing endpoint (XRPL Batch and MPToken types live in `/v1/intents`).

- **Capability set** — the endpoint capabilities + feature capabilities a single
  resolved version exposes. Derived from the live spec at runtime, or from
  bundled per-version **capability data** offline.

- **Resolved version** — the app version (and its capability set) the SDK is
  currently gating against: from explicit `apiVersion`, else auto-detection,
  else _unresolved_. Read via `client.backendVersion()`, which triggers
  auto-detection if it hasn't run yet and throws if nothing can be resolved.

- **Guard** — the runtime check that a call's required capability is present in
  the resolved version's capability set. **Fail-open**: when the version is
  unresolved, the guard is disabled (warns once) and the backend remains the
  authority. Rejections throw `UnsupportedInVersionError`.

- **Auto-detection** — resolving the app version and capability set by fetching
  the live spec. Lazy (first call), cached, opt-outable. The default.

- **Fail-open** — the guard's policy when no version is resolved: allow all
  calls, warn once, let the backend reject unsupported operations itself. The
  guard never _invents_ a block it cannot justify.

- **Liveness probe** — the `GET /v1/health` check (`client.health.liveness()`).
  Reports whether the instance process is up. Returns `200` with a status body
  when healthy, `503` when not (which the SDK surfaces as a thrown
  `CustodyError`). Available on app versions ≥ 1.36.1.

- **Readiness probe** — the `GET /v1/ready` check
  (`client.health.readiness()`). Reports whether the instance is ready to serve
  traffic (dependencies up). Same `200`/`503` semantics as the liveness probe.
  Exposed under `client.health.*`, not top-level, so it does not collide with
  `RippleCustody.ready()` (which resolves the version guard, an unrelated
  concept). Available on app versions ≥ 1.36.1.

- **CB_IN decryption** — recovering the cleartext amount of a confidential MPT
  account's CB_IN (inbox) balance. Asynchronous: `POST /internal/v1/cmpt-cb-in`
  accepts a `(domainId, accountId, ledgerId, issuanceId)` request and returns
  `202` with a request id, and `GET /internal/v1/cmpt-cb-in/{requestId}` carries
  the `decryptedAmount` once the request reaches `Completed` (`error` on
  `Failed`). Exposed as `client.internal.cbInDecryption.*`, the first internal
  namespace. Same request-state machine as a **parameters compute**
  (`client.accounts.initiateParametersCompute`), which prepares the cryptographic
  fields of a confidential MPT transaction on the public surface.

- **System property** — an instance-wide configuration value listed by
  `GET /v1/properties` (`client.systemProperties.list()`), identified by a
  `Core_SystemPropertyId` (e.g. `NOTARY_API_KEY`, `STATE_REVIEW_AUTHORITY`).
  Returned as trusted (signed) entries in a `Core_TrustedSystemProperty`.

- **Intent** — a signed request to change state, proposed to `POST /v1/intents`
  and approved by policy before custody executes it. Every write goes through
  one. The payload is one of ~45 `v0_*` types (`Core_ProposeUserIntentPayload`);
  everything wrapped around it — `author`, `targetDomainId`, `expiryAt`, `id`,
  `customProperties` — is the **request envelope**, built by
  `buildRequestEnvelope`. Avoid "transaction" for an intent: on ledger-writing
  intents the two are distinct objects with distinct ids and distinct failures.

- **Request id vs payload id** — the two ids a ledger-writing propose generates,
  not interchangeable. The **request id** identifies the _intent_: poll and
  approve by it (`intents.getAndWait`, `intents.approve`). The **payload id**
  identifies the _transaction order_ inside it: look the resulting transaction up
  by it (`transactions.byOrderAndWait`, `xrpl.getMptIssuanceId`), where it
  appears as `orderReference.Id`. Both default to a generated UUID v7 and are
  returned by the propose methods; both can be pinned through `options`.
  Non-transaction-order intents have only a request id.

- **Terminal** — a status the work will not move on from. For an **intent**:
  `Executed`, `Failed`, `Expired`, `Rejected` (`TERMINAL_STATUSES`); `Open`,
  `Approved` and `Executing` are pending. For a **transaction**: a terminal
  processing status, or any `ledgerTransactionData.failure`. A wait reporting
  `isTerminal: false` ran out of attempts on work that was still in flight —
  that means "not yet", **not** "failed".

- **Executed ≠ landed** — an intent reaching `Executed` means custody accepted
  the transaction order, not that the transaction reached the ledger. The
  transaction is registered against the order afterwards and can still fail,
  while custody prepares it (`processing.status: "Failed"`, carrying a `hint`
  such as `InvalidUserPayload`) or on chain
  (`ledgerTransactionData.failure: "FailedOnChain"`). Custody also reports
  `Completed` for transactions the ledger rejected, so `isSuccess` on a
  transaction wait requires both halves. This is why ledger-writing intents have
  two waits, and why `xrpl.proposeIntentAndWait` covers both. See
  [docs/intents.md](docs/intents.md).
