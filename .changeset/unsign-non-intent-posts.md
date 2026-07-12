---
"@florent-uzio/custody": patch
---

Fix non-intent POST methods (intents.dryRun, transactions.dryRun, genesis.run, ledgers.processEthereumContractCall, userInvitations.create/fill, vaults.importPreparedOperations) throwing "Failed to canonicalize request body" before sending — they now skip request signing, matching the API contract.
