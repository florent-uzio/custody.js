---
"@florent-uzio/custody": minor
---

Take an XRPL address in `client.xrpl.getPublicKey` instead of a resolved `{ domainId, accountId }` pair.

`client.xrpl.getPublicKey(address, options?)` now resolves the domain and account from the r-address itself, the same way `proposeIntent`, `rawSign`, `provisionElGamalKeyPair` and `getElGamalPublicKey` already do — so reading an account's signing key takes the same argument as every other address-taking method on the namespace, and callers no longer have to look an account ID up through `client.accounts.findByAddress` first just to name an account they already have an address for.

The address is validated with `isValidAddress` from xrpl.js before any request goes out, so a typo fails with `Invalid address: <value>` rather than as an account-not-found from the lookup endpoint.

`options.domainId` and `options.ledgerId` disambiguate: they are only needed when the address is registered more than once — across domains under the same login, or on several ledgers (`xrpl` vs `xrpl-testnet-august-2024`) — in which case the address lookup throws and names the option to pass, rather than silently picking a match.

This is a breaking change to the method's signature: `getPublicKey({ domainId, accountId })` becomes `getPublicKey(address, { domainId?, ledgerId? })`, with a new exported `GetPublicKeyOptions` type. The trade-off is one extra address-resolution round-trip per call, which is what every other address-taking method already pays. `rawSignAndWait`, `signBatchPayload` and `signBatchPayloadAndWait` read the key off the context they have already resolved, so they make no additional call.
