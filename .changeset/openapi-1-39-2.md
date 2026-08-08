---
"@florent-uzio/custody": patch
---

Bundle the official OpenAPI specs for `1.34.11`, `1.34.12`, `1.34.13`, `1.39.0` and `1.39.2`, and regenerate the types. These five releases add no endpoints and no schemas — the API surface of `1.39.2` is identical to `1.38.0`, and the three `1.34.x` patches are identical to `1.34.10` — so there are no new namespaces or methods. `client.capabilities` now recognises the five versions.

Two changes ride along in the generated types, both from `1.39.x`. `Core_Balance.totalAmount` and `Core_Balance.availableAmount` dropped their `minimum: 0` constraint and are now documented as "can be negative, zero, or positive"; the TypeScript type is unchanged (`string`), but code that assumed balances are never negative should be revisited. Nine already-deprecated fields also gained a `Deletion target: Mar. 31st 2027` note in their JSDoc — among them all of `Core_ApiTicker`, `Core_Approve.expiryAt` / `Core_Reject.expiryAt`, `Core_LedgerTransactionData.blockTime`, `Core_SenderTransferParty_Account.addresses` / `Core_RecipientTransferParty_Account.address`, `Core_TransactionOrderParameters_XRPL.amount` and `destinationTag`, and the `ledgerId` of `Core_v0_CreateAccount` / `Core_v0_UpdateEndpoint`.
