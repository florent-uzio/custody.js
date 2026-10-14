# Confidential MPT transfers

End-to-end example of confidential Multi-Purpose Token (MPT) transfers with
Ripple Custody: two holders pay each other while the amounts stay encrypted on
the XRP Ledger.

> **Devbox only.** This example needs a Ripple Custody instance with confidential
> MPTs enabled, connected to the custody devnet. Step 13 also uses the internal
> CB_IN decryption API (`custody.internal.cbInDecryption`), which only devbox
> instances expose.

## The accounts

| Name      | Role                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `ISSUER`  | Creates the MPT and pays Alice                                          |
| `AUDITOR` | Never transacts; every confidential amount is also encrypted to its key |
| `ALICE`   | Holder 1                                                                |
| `BOB`     | Holder 2                                                                |

## What the script does

1. Gets the four accounts: reuses those whose r-address is set in `.env`,
   creates the others, and funds any account not yet active on the ledger
   (from the faucet, or from `FUNDER_ADDRESS` when set)
2. `ISSUER` creates the MPT (`MPTokenIssuanceCreate`, confidential amounts enabled)
3. Every account gets an ElGamal key pair, generated and kept in the custody vault
4. `ISSUER` publishes its own and the `AUDITOR`'s ElGamal keys on the MPT (`MPTokenIssuanceSet`)
5. `ALICE` and `BOB` authorize the MPT (`MPTokenAuthorize`)
6. `ISSUER` pays `ALICE` 1000 MPT, publicly (`Payment`)
7. `ALICE` registers her ElGamal key by converting 0, then converts 1000 to a
   confidential balance (`ConfidentialMPTConvert`)
8. `ALICE` merges her inbox (`ConfidentialMPTMergeInbox`)
9. `BOB` registers his ElGamal key by converting 0 (`ConfidentialMPTConvert`)
10. `ALICE` sends 300 to `BOB` confidentially (`ConfidentialMPTSend`)
11. `BOB` merges his inbox
12. `BOB` sends 50 back to `ALICE` confidentially. Alice does not merge, so the
    50 stay in her inbox.
13. Prints the balances of `ALICE` and `BOB`: as custody books them, the inbox
    decrypted by the vault, and the encrypted balances on the ledger, including
    the copies encrypted to the issuer and to the auditor
14. Prints what the two confidential sends look like on the ledger

Expected result: `ALICE` 700 spendable + 50 in her inbox, `BOB` 250 spendable.

A new MPT is created on every run, so runs never interfere with each other.

### Registering a holder's key

A holder's ElGamal key must be on its MPToken entry before it can convert a
real amount or receive a confidential send — otherwise the ledger answers
`tecNO_PERMISSION`. Custody publishes it with a `ConfidentialMPTConvert` of
`"0"`, which is why both holders start with one.

### Inbox vs spendable

A confidential balance has two parts. Conversions and incoming sends land in the
**inbox**; only the **spendable** balance can be sent. `ConfidentialMPTMergeInbox`
moves the inbox into the spendable balance.

### Can the amounts be decrypted?

Not by this script. On the ledger, a confidential amount only exists as ElGamal
ciphertexts — one per key: the holder, the issuer, and the auditor (and, for a
send, the destination). Decrypting needs the matching private key, and every
private key stays in the custody vault. The SDK can ask the vault to decrypt an
account's **inbox** (step 13), but has no way to decrypt the amount of a single
transaction (step 14).

## Setup

1. Copy `.env.example` to `.env` in this directory and fill it in. The script
   always reads this file, whatever directory it is run from.
2. Install the dependencies from the repository root: `npm install`.

## Run

From the repository root:

```sh
npx tsx examples/xrpl/confidential-transfers/index.ts
```

The first run creates and funds the four accounts, then prints four lines like
`ALICE_ADDRESS=r…`. Paste them into `.env` so the next runs reuse the same
accounts instead of creating new ones.

## Files

| File                 | Contents                                                           |
| -------------------- | ------------------------------------------------------------------ |
| `index.ts`           | The 14 steps, in order                                             |
| `config.ts`          | Environment variables, account names, token settings, amounts      |
| `accounts.ts`        | Step 1: reuse or create the accounts, fund them                    |
| `mpt.ts`             | Steps 2, 4, 5, 6: the regular MPT operations                       |
| `confidential.ts`    | Steps 3, 7–12: ElGamal keys, convert, merge, confidential send     |
| `inspect.ts`         | Steps 13, 14: balances and transactions                            |
| `custody-helpers.ts` | `submit` (propose and wait for the ledger) and `releaseQuarantine` |

## Troubleshooting

- **The faucet fails (e.g. `502 Bad Gateway`)** — the custody devnet faucet is
  down. Set `FUNDER_ADDRESS` to an existing custody account holding some XRP:
  it pays the new accounts instead. Paste the `<ROLE>_ADDRESS` lines printed
  before the failure into `.env` first, so the next run funds those accounts
  rather than creating new ones.
- **`still in flight after N attempts`** — confidential transactions are slow
  (custody builds the proofs before broadcasting). Raise `CONFIDENTIAL_POLLING`
  in `config.ts`.
- **`CurrentlyNotEnoughFunds` on a send** — the funds are still quarantined in
  custody, or the inbox was not merged. Check the account in the custody UI.
- **`DEBUG=true`** logs every SDK request.
