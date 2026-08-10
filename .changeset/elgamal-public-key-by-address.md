---
"@florent-uzio/custody": minor
---

Take an XRPL address in `client.xrpl.getElGamalPublicKey` instead of a resolved `{ domainId, accountId, ledgerId }` triple.

`client.xrpl.getElGamalPublicKey(address, options?)` now resolves the domain, account and ledger from the r-address itself, the same way `provisionElGamalKeyPair`, `proposeIntent` and `rawSign` already do — so provisioning a key and reading it back take the identical argument, and callers no longer have to look an account ID up through `client.accounts.findByAddress` first just to name the account they already have an address for. The ledger the key is read from is the one the address resolved to, which is also the ledger the intent provisioned it on.

Both `getElGamalPublicKey` and `provisionElGamalKeyPair` now validate the address with `isValidAddress` from xrpl.js before any request goes out, as `rawSignAndWait` and `signBatchPayload` already do for the addresses they take — a typo fails with `Invalid address: <value>` rather than as an account-not-found from the lookup endpoint, and the two cMPT methods reject the same inputs instead of one failing locally and the other at the API.

`options.domainId` and `options.ledgerId` disambiguate: they are only needed when the address is registered more than once — across domains under the same login, or on several ledgers (`xrpl` vs `xrpl-testnet-august-2024`) — in which case the address lookup throws and names the option to pass, rather than silently picking a match. A missing ElGamal key still throws a `CustodyError`, now naming the address alongside the account and ledger.

This is a breaking change to the method's signature: `getElGamalPublicKey({ domainId, accountId, ledgerId })` becomes `getElGamalPublicKey(address, { domainId?, ledgerId? })`, and the exported `GetElGamalPublicKeyParams` type is replaced by `GetElGamalPublicKeyOptions`. The trade-off is one extra address-resolution round-trip per call, which is what every other address-taking method on the namespace already pays.
