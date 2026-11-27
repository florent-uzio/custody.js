---
"@florent-uzio/custody": minor
---

Add helpers to release quarantined transfers. Ripple Custody quarantines incoming transfers, and a quarantined amount cannot be spent: the next send fails its dry run with `CurrentlyNotEnoughFunds`.

- `xrpl.releaseQuarantinedTransfers(params, options?)` takes an XRPL `address`, resolves its account, finds its quarantined transfers across every page and proposes one `v0_ReleaseQuarantinedTransfers` intent. Narrow it with an `asset`: an IOU (`{ type: "Currency", code, issuer }`), XRP (`{ type: "Native" }`), an MPT issuance (`{ type: "MultiPurposeToken", issuanceId }`, both of its tickers) or a custody ticker (`{ type: "TickerId", tickerId }`).
- `transactions.releaseQuarantinedTransfers(params, options?)` does the same by `domainId` and `accountId`, on any ledger.
- Both have an `AndWait` variant that also waits for the intent.

The selection is either explicit `transferIds` or `all: true`, with no default, because a release bypasses custody's compliance review. When nothing is quarantined, no intent is proposed and the result is `{ proposed: false }`. Transfers are filtered with `quarantined: true` rather than `quarantineStatus`, which some Custody versions answer with a 500 (#238).
