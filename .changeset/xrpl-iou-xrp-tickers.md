---
"@florent-uzio/custody": minor
---

Add `tickers.findByXrplIou(code, issuer, { ledgerId })` and `tickers.findXrplNative({ ledgerId })`, which find the custody ticker of an XRPL IOU and of a ledger's XRP. Like `findByXrplMptIssuanceId`, they read every page of the ledger's tickers and throw when two tickers match. `findByXrplIou` takes the currency code in either form (`"RLUSD"`, `"USD"` or the 40-character hex code) and compares it with each ticker's code in one canonical form, so it matches whichever form Custody stored.

`xrpl.releaseQuarantinedTransfers` narrows `all: true` with an `asset` (`XrplAsset`, composed from the generated `Core_XrplPaymentCurrency` and `Core_XrplTickerProperties_Native`) instead of `issuanceId` / `tickerId`, so an IOU or XRP can be named directly. `XrplAsset` and the XRPL release parameter and option types are now exported.

`XrplPorts` gains two required methods, `findIouTicker` and `findNativeTicker`, on top of `listTransfers` and `findMptTickers` from the unreleased quarantine-release change. A custom `XrplPorts` implementation must add all four. `createHttpPorts` already provides them.
