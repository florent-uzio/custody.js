---
"@florent-uzio/custody": minor
---

Add `client.xrpl.findElGamalPublicKey` and `client.xrpl.getElGamalPublicKeyAndWait`, so a cMPT flow can both wait for a provisioned ElGamal key to become readable and check whether one already exists.

`getElGamalPublicKeyAndWait(address, options?)` polls until the key is readable, then throws — the same `fetch`/`poll`/`wait` ladder `getMptIssuanceIdAndWait` already follows, with the same defaults (10 attempts, 3s apart). The vault writes the key some time _after_ the `provisionElGamalKeyPair` intent reports `Executed`, so `getElGamalPublicKey` called straight after `intents.getAndWait` legitimately finds nothing and throws `No ElGamal key provisioned for account …`. This waits that gap out instead of the caller sleeping for a fixed guess. The address is resolved once, before the loop, so the polling costs one account read per attempt and not two.

`findElGamalPublicKey(address, options?)` returns `string | undefined` instead of throwing when no key is provisioned. An account can only be provisioned once per ledger — a second `provisionElGamalKeyPair` is rejected with `ElGamal key already provisioned for account <id> on ledger <id>` — so any script that may run twice against the same accounts has to establish first whether the key is already there. That question was previously unanswerable without catching `getElGamalPublicKey`'s error and guessing which failures mean "absent"; `findElGamalPublicKey` reports absence for the key alone, and still throws for an invalid address, an ambiguous lookup or a non-Vault account. The `find` / `get` pair mirrors `accounts.findByAddress` / `findByAddressOrThrow`.

`getElGamalPublicKey` is unchanged — one read, throws when there is no key. Its documentation, and `provisionElGamalKeyPair`'s, now point at the two siblings and state that provisioning is once-per-ledger.

`WaitForElGamalPublicKeyOptions` (the disambiguation of `GetElGamalPublicKeyOptions` plus `maxRetries` / `intervalMs` / `onAttempt`) and `GetElGamalPublicKeyOptions` itself are now exported from the package root, which the latter was not.
