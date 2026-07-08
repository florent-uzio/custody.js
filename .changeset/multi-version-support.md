---
"@florent-uzio/custody": minor
---

Multi-version support (foundation): generate the SDK's types from **all** bundled OpenAPI specs in `openapi/` as one superset type universe, and emit per-version capability data for an upcoming runtime version guard.

- Types now cover endpoints and schemas from every bundled backend version — both XRPL Batch (1.35.0) and the provider/deposit endpoints unique to 1.35.4 — merged by structural union so nothing any version defines is dropped.
- `accounts.findByAddress` now returns only `AccountAddressReference` matches, discriminating against the newly-typed `DepositInstructionsReference` a 1.35.4 instance can return.

New `apiVersion` client option pins the SDK to a specific backend version and enables **runtime capability gating**:

- Calls the pinned version cannot serve throw `UnsupportedInVersionError` (exposing the missing capability, its kind, the version, and the SDK method). Endpoint availability is checked centrally in the transport; XRPL feature availability (e.g. Batch) is checked in the xrpl service, including operations passed through `xrpl.proposeIntent`. `xrpl.rawSign` is never gated.
- An unrecognized `apiVersion` throws at construction, listing the known bundled versions.

By default (no `apiVersion`), the SDK now **auto-detects** the backend's capabilities from its live OpenAPI spec:

- On the first API call it fetches `<apiUrl>/api/OpenAPI?scope=&layout=` once (cached for the client's lifetime; concurrent first calls dedupe to a single fetch) and gates against the instance's actual capabilities — accurate even for backend versions the SDK has never bundled.
- The constructor stays synchronous. `await client.ready()` front-loads detection and surfaces its errors. `autoDetectVersion: false` disables it; `openApiUrl` overrides the fetch URL; `specSource` fully overrides the fetch (advanced).

Gating **fails open**: whenever no backend version can be resolved — the live-spec fetch fails, or auto-detection is disabled with no `apiVersion` — calls pass through unchanged (the backend stays the authority) and the SDK emits a single warning per client. It never invents an `UnsupportedInVersionError` it cannot justify.
