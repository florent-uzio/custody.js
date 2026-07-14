---
"@florent-uzio/custody": minor
---

Wire the 16 `URLs` entries that had a friendly name but no namespace method calling them (follow-up to #199):

- `client.accounts` gains 5 methods: `getLatestAddress` (deprecated), `getConfirmedBalance` (deprecated), `getTransferability`, `listDepositInstructions`, `getDepositInstruction`.
- New `client.systemSigning.get()` for `GET /v1/system-signing/info`.
- New `client.virtualLedgers` namespace (`list`, `create`, `get`, `update`, `getBalances`, `listOperations`, `createOperation`, `listTransfers`), with per-account operations nested under `client.virtualLedgers.accounts` (`list`, `create`, `update`, `getBalances`, `assignDepositIdentificationSource`, `getAddresses`) — mirrors the `omnibus`/`tenants` structure.
