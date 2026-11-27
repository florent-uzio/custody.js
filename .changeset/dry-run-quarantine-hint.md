---
"@florent-uzio/custody": minor
---

When an XRPL dry run fails with `CurrentlyNotEnoughFunds` and the sending account has quarantined transfers, say so: `xrpl.dryRunIntent` sets the new optional `quarantineHint` on `DryRunIntentResult`, and `xrpl.proposeIntent*` with `dryRun: true` append it to the `CustodyError`. The hint counts the account's quarantined transfers across every asset and points at `releaseQuarantinedTransfers`. The lookup runs only on that failure, and a failed lookup leaves the error as Custody gave it.
