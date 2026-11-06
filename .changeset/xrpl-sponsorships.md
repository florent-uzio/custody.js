---
"@florent-uzio/custody": minor
---

XRPL sponsorships (XLS-68) on `client.xrpl`. A sponsor account can pay another account's transaction fees and/or owner reserves.

- `xrpl.proposeIntent`, `proposeIntentAndWait` and `dryRunIntent` accept order-level `sponsorship: { sponsor, flags }`, next to `memos` and `sourceTag`. The key is left off the order when not set.
- `SponsorshipSetAsSponsor` and `SponsorshipSetAsSponsee` operations go through `proposeIntent`.
- `batchToCustodyInnerTransactions` / `batchToCustodyBatchPayload` map each inner transaction's `Sponsor` + `SponsorFlags` to the entry's `sponsorship`, and a Payment's `tfSponsorCreatedAccount` flag to its `flags`. Inconsistent sponsor fields throw a `CustodyError`.
- New exported types: `Core_XrplSponsorshipParams`, `Core_Xrpl_SponsorFlag`, `Core_Xrpl_PaymentFlag`.
- New example: `examples/xrpl/sponsorship/`.
