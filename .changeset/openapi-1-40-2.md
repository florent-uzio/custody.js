---
"@florent-uzio/custody": minor
---

Bundle the official OpenAPI specs for `1.34.14`, `1.34.15`, `1.40.0`, `1.40.1` and `1.40.2`, and regenerate the types. None of these releases adds, removes or renames an endpoint — the path/operation set of `1.40.2` is identical to `1.39.2` (163 operations), and the two `1.34.x` patches are byte-identical to `1.34.13` apart from `info.x-app-version` — so there are no new namespaces or methods. `client.capabilities` now recognises the five versions.

The type changes all come from `1.40.0` and revolve around per-ledger destination tags / memos:

- `Core_EndpointLedgerParameters` is no longer an alias for `Core_EndpointLedgerParameters_Ethereum`; it is now a discriminated union (on `type`) over `Ethereum | Hedera | Stellar | XRPL`, with the new `Core_EndpointLedgerParameters_Hedera` (`memo?: string`), `Core_EndpointLedgerParameters_Stellar` (`memo?: Core_StellarMemo`) and `Core_EndpointLedgerParameters_XRPL` (`destinationTag?: number`) members. Code that read Ethereum-specific fields (for example `ABI`) off an endpoint's `ledgerParameters` without first narrowing on `type` now has to narrow.
- New `Core_TransferDestinationTag` union (`Hedera` / `Stellar` / `XRPL` members, `memo` / `destinationTag` required on each), surfaced as the optional `tag` field on `Core_CreateTransferOrderOutput`.
- `Core_TransferMetadata_Hedera` gained an optional `memo` (UTF-8, up to 100 bytes) and `Core_TransferMetadata_Stellar` an optional `memo: Core_StellarMemo`.
- `Core_UserOperationRejectionCode` gained `ConflictingDestinationTag`.

`1.40.1` is API-identical to `1.40.0`; `1.40.2` only adds `Invalid endpoint address (InvalidEndpointAddressError)` to the documented 400 cases of `POST /v1/intents`.
