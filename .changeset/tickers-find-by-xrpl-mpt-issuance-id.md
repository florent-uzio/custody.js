---
"@florent-uzio/custody": minor
---

Add `tickers.findByXrplMptIssuanceId` — the tickers custody holds for one XRPL MPT issuance ID, in one call.

"Given an MPT issuance ID, what are my tickers?" is the first question any confidential-MPT flow asks: the confidential ticker id is the only way to read a confidential balance, and neither id is derivable from the issuance ID. `getTickers` has no `issuanceId` query parameter, so answering it meant listing a ledger's tickers and scanning `data.ledgerDetails.properties` client-side — twice per asset, once for `MultiPurposeToken` and once for `ConfidentialMultiPurposeToken`.

```ts
const { public: mmf, confidential: mmfConf } = await custody.tickers.findByXrplMptIssuanceId(
  MMF_ISSUANCE_ID,
  { ledgerId: "xrpl-testnet-august-2024" },
)

if (mmf === undefined) throw new Error("MMF not found in Ripple Custody.")
const scale = mmf.decimals ?? 0
```

It takes the ID `xrpl.getMptIssuanceId` produces, and the names match so the pairing is visible.

**Both halves are optional, and neither implies the other.** Most MPT issuances are not confidential, so `confidential` is usually absent _permanently_ — not pending; nothing will make it appear, and code that polls for it polls forever. `public` is likewise absent when custody tracks no plain ticker. An issuance the ledger does not know comes back as `{}` rather than throwing, so absence reads the same way for every reason.

That hand-rolled scan reads **one page**. A ledger carrying more tickers than a page holds reports the ticker as missing — no error, the `.find()` just returns `undefined`. For the confidential half that failure is especially quiet, because "truncated off page one" and "this issuance simply isn't confidential" look identical at the call site. `findByXrplMptIssuanceId` walks every page instead, narrowed server-side to `ledgerId` (the only filter the endpoint applies) and reading `limit: 100` at a time.

`ledgerId` is required: an MPT issuance ID only identifies a token within one XRPL network, and it is what keeps the walk from becoming an unfiltered sweep of every ticker on the instance.

Both halves come back as `Core_ApiTickerData` — the `data` payload of the collection item, not the item itself. The item's top-level twins (`id`, `ledgerId`, `decimals`, `ledgerDetails`, …) are all `@deprecated` with a Mar. 2027 deletion target, so returning `data` keeps callers off a surface that is going away. The result type is exported as `XrplMptIssuanceTickers`, along with `Core_ApiTickerData` and `FindByXrplMptIssuanceIdOptions`.

Two tickers of the same kind claiming one issuance ID throw a `CustodyError` naming both. Custody should never hold two, and returning an arbitrary one would make every balance read after it a coin flip — so every page is walked even once both halves are found, since a duplicate can only be ruled out by looking at the rest of the collection. That is one pass over the ledger's tickers: the same cost as the single `list()` call it replaces, plus a request per extra page.

This is the second internal call site for `paginate` after `accounts.findByAddress`, and follows it in shape — a semantic lookup that owns its own paging, not a `tickers.paginate()` / `listAll()` on the collection method, which [ADR-0008](../docs/adr/0008-cursor-pagination.md) rejects.
