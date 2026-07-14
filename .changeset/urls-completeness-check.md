---
"@florent-uzio/custody": patch
---

Add friendly `URLs` names for 4 endpoints that existed in the generated OpenAPI
types but had no entry in `src/constants/urls.ts` (`accountsTransferability`,
`accountDepositInstructions`, `accountDepositInstruction`, `systemSigningInfo`).
Also add a compile-time exhaustiveness check so a future endpoint landing in a
bundled spec without a matching `URLs` entry fails `tsc` instead of silently
becoming unreachable through any namespace.
