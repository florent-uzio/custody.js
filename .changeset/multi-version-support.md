---
"@florent-uzio/custody": minor
---

Multi-version support (foundation): generate the SDK's types from **all** bundled OpenAPI specs in `openapi/` as one superset type universe, and emit per-version capability data for an upcoming runtime version guard.

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
