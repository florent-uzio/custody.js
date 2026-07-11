---
"@florent-uzio/custody": minor
---

Add new read namespaces, a nested compliance namespace, and upgrade dependencies.

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
