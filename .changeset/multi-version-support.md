---
"@florent-uzio/custody": minor
---

Multi-version support (foundation): generate the SDK's types from **all** bundled OpenAPI specs in `openapi/` as one superset type universe, and emit per-version capability data for an upcoming runtime version guard.

- Types now cover endpoints and schemas from every bundled backend version — both XRPL Batch (1.35.0) and the provider/deposit endpoints unique to 1.35.4 — merged by structural union so nothing any version defines is dropped.
- `accounts.findByAddress` now returns only `AccountAddressReference` matches, discriminating against the newly-typed `DepositInstructionsReference` a 1.35.4 instance can return.
