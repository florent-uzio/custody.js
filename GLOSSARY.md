# Glossary — custody.js

The language of this SDK and of the Ripple Custody API it wraps. Use these
terms exactly; avoid the listed synonyms so issues, tests, and code stay
consistent. Why the SDK supports many backend releases at once, and how, is in
[ADR-0001](docs/adr/0001-multi-version-support-strategy.md) and the ADRs it
links.

## Versions and specs

- **App version** — the Ripple Custody _release_ identifier, read from
  `info.x-app-version` in the spec (e.g. `1.35.4`). **Not** `info.version`,
  which is always `"v1"` (the API major, not the release). Avoid "API version"
  for the release — reserve "API version" for the `/v1` prefix. Releases are
  not monotonic: a higher app version can expose _fewer_ endpoints.

- **Backend / instance** — a running Ripple Custody deployment the SDK talks to,
  identified by its API URL. Each runs one app version.

- **Live spec** — the OpenAPI document a reachable instance serves about
  itself. The runtime source of truth for that instance's capabilities.

- **Bundled spec** — an OpenAPI document shipped with the SDK, keyed by its
  app version. Bundled specs feed the superset types and serve as the offline
  capability fallback when the live spec is not used. Every bundled spec
  belongs to a **channel** and a **surface**.

- **Channel** — the provenance of a bundled spec: **official** or **devbox**.
  Official specs are authoritative; devbox specs are types-only. App versions
  are not unique across channels. See
  [ADR-0005](docs/adr/0005-official-vs-devbox-channels.md).

- **Official spec** — a bundled spec from a real Ripple Custody release. Unique
  by app version. Official specs are the only source of offline capability
  data and the only versions a caller can pin; on a conflict with a devbox
  spec, official wins.

- **Devbox spec** — a bundled spec from a feature-branch build. May expose
  **preview features** ahead of any official release. Contributes to the
  superset types only; never to offline capability data or a version pin.

- **Preview feature** — a capability present only in a devbox spec, not yet in
  any official release (e.g. XRPL Batch today). Typed, and usable against a
  real devbox instance through auto-detection, but blocked by any pinned
  official version until an official release ships it.

- **Surface** — which of an instance's two APIs a spec describes: **public**
  or **internal**. Orthogonal to channel — both channels carry both surfaces.
  See [ADR-0007](docs/adr/0007-public-vs-internal-surfaces.md).

- **Public spec** — a spec of the customer-facing API (`/v1/…`, `Core_*`
  schemas).

- **Internal spec** — a spec of the internal API (`/internal/v1/…` and
  `/api/notifications/…`, `Internal_*` / `Notification_*` schemas) used by
  internal tooling. Disjoint from the public spec in paths and schemas, but
  reuses some of its operation ids. Shares its release's app version.

- **Internal namespace** — an SDK namespace whose endpoints live on the
  internal surface. Kept apart from the public namespaces so the two surfaces'
  operation ids never collide; not covered by the public API's compatibility
  promises.

- **Superset types** — the SDK's type universe for one surface: the union of
  every bundled spec of that surface. Permissive by design — it types every
  endpoint and schema any known version has. Grows with the number of
  _distinct_ endpoints and schemas, not with the number of versions.

## Capabilities and the guard

- **Capability** — a unit the guard can check for presence in a version. Two
  kinds:

  - **Endpoint capability** — a method and path template, e.g.
    `GET /v1/domains/{domainId}/virtual-ledgers`.
  - **Feature capability** — the presence of a named schema, e.g.
    `Core_XrplOperation_Batch`. Used for operations that ride _inside_ an
    existing endpoint (XRPL Batch and MPToken operations travel in
    `/v1/intents`).

- **Capability set** — the endpoint and feature capabilities one resolved
  version exposes. Read from the live spec, or from bundled capability data
  offline.

- **Resolved version** — the app version (and its capability set) the SDK is
  currently gating against: a pinned version, else auto-detection, else
  _unresolved_.

- **Guard** — the runtime check that a call's required capability is in the
  resolved version's capability set. It rejects only calls the resolved
  version provably cannot serve.

- **Auto-detection** — resolving the app version and capability set from the
  live spec. Lazy (on first call), cached, and the default.

- **Fail-open** — the guard's policy when no version is resolved: allow every
  call, warn once, and let the backend reject what it cannot serve. The guard
  never _invents_ a block it cannot justify.

## Health

- **Liveness probe** — whether the instance process is up (`GET /v1/health`).
  `200` with a status body when healthy, `503` when not. App versions ≥ 1.36.1.

- **Readiness probe** — whether the instance is ready to serve traffic, its
  dependencies included (`GET /v1/ready`). Same `200` / `503` semantics as the
  liveness probe. App versions ≥ 1.36.1. Not to be confused with resolving the
  guard, which the client also calls "ready".

## Collections

- **Cursor collection** — a list response that pages with an opaque cursor,
  shaped `{ items, count, currentStartingAfter?, nextStartingAfter? }`. `count`
  is the size of _this page_, never a total, and there is no "has more" flag —
  the collection is exhausted when `nextStartingAfter` is absent. Not every list
  is one: some page by offset, and some return bare arrays. See
  [ADR-0008](docs/adr/0008-cursor-pagination.md).

- **Cursor page** — one page of a cursor collection. A single list call returns
  exactly one, without saying so, which is why filtering one page silently
  reports records as missing. Avoid "offset" and "page number" for this — the
  cursor is opaque and unordered.

## Intents

- **Intent** — a signed request to change state, approved by policy before
  custody executes it. Every write goes through one. Its **payload** is one of
  ~45 `v0_*` types; everything wrapped around the payload — author, target
  domain, expiry, id, custom properties — is the **request envelope**. Avoid
  "transaction" for an intent: on ledger-writing intents the two are distinct
  objects with distinct ids and distinct failures. See
  [docs/intents.md](docs/intents.md).

- **Intent id vs payload id** — the two ids a ledger-writing propose
  generates, not interchangeable. The **intent id** identifies the _intent_:
  it is the request envelope's id, and you poll and approve by it. The
  **payload id** identifies the _transaction order_ inside it: look the
  resulting transaction up by it, where it appears as `orderReference.Id`.
  Non-transaction-order intents have only an intent id. Custody also returns a
  **request id** for the propose request itself; avoid it for the intent — it
  is not the id to poll or approve by.

- **Terminal** — a status the work will not move on from. For an **intent**:
  `Executed`, `Failed`, `Expired`, `Rejected`; `Open`, `Approved` and
  `Executing` are pending. For a **transaction**: a terminal processing status,
  or any ledger failure. A wait that ends on a non-terminal status ran out of
  attempts on work still in flight — "not yet", **not** "failed".

- **Executed ≠ landed** — an intent reaching `Executed` means custody accepted
  the transaction order, not that the transaction reached the ledger. The
  transaction is registered against the order afterwards and can still fail,
  while custody prepares it (`processing.status: "Failed"`, with a hint such as
  `InvalidUserPayload`) or on chain (`FailedOnChain`). Custody also reports
  `Completed` for transactions the ledger rejected, so a success needs both
  custody's status and the ledger's verdict. This is why a ledger-writing
  intent has two waits.

- **System property** — an instance-wide configuration value, identified by a
  system property id (e.g. `NOTARY_API_KEY`, `STATE_REVIEW_AUTHORITY`) and
  returned as a trusted (signed) entry.

## Confidential MPT

- **Parameters compute** — custody preparing the cryptographic fields of a
  confidential MPT transaction. Asynchronous: a request is accepted, then read
  back until it is `Completed` or `Failed`.

- **CB_IN decryption** — recovering the cleartext amount of a confidential MPT
  account's CB_IN (inbox) balance, on the internal surface. Same asynchronous
  request lifecycle as a parameters compute; the decrypted amount is on the
  `Completed` request.

## Quarantine

- **Quarantine** — custody holding an incoming transfer back for compliance
  review. Until it is released, the transferred amount counts as unavailable:
  spending it fails the dry run with `CurrentlyNotEnoughFunds` although the
  funds are on the ledger. Any received asset can be quarantined (XRP, IOU,
  MPT). A transfer's `quarantineStatus` is `Quarantined`, `Released`, or
  `Skipped` (never quarantined); the deprecated `quarantined` boolean is `true`
  only for `Quarantined`.

- **Release** — the `v0_ReleaseQuarantinedTransfers` intent: makes one
  account's quarantined transfers spendable, bypassing their compliance review.
  Finished when its intent is — there is no ledger transaction behind it.
  Avoid "unlock" and "unfreeze", which name different things on the ledger.
