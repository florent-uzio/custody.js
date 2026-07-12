---
"@florent-uzio/custody": patch
---

Fix `accounts.forceUpdateAccountBalances` to POST to `/balances/refresh` instead of `/balances`, and fix both `forceUpdateAccountBalances` and `accounts.generateNewExternalAddressDeprecated` to send `ledgerId`/`tickerId` as query params instead of a JSON request body (both operations declare `requestBody: never`).
