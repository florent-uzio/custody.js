---
"@florent-uzio/custody": patch
---

Co-locate namespace type aliases with their namespace files (`src/namespaces/<name>.types.ts` beside `src/namespaces/<name>.ts`) instead of a separate type-only `src/services/<name>/` directory. `src/services/` now only holds the modules with real implementation logic (`apis`, `auth`, `channels`, `keypairs`, `xrpl`); the cross-cutting `DomainUserReference` type moved to `src/models/`. This is an internal reorganization with no runtime behavior change. Every previously-public type name is still exported from the package root; switching to wildcard re-exports also surfaces one additional, already-valid generated type that wasn't listed before (`GetTransactionDetailsQueryParams`).
