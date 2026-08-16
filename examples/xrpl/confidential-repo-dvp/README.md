# Confidential repo (DvP) end-to-end example

Runs a full repo lifecycle on the XRP Ledger through Ripple Custody, with both
legs settled as an atomic delivery-versus-payment `Batch` and all amounts held
as **confidential MPT balances**.

The seller posts an MMF security as collateral and receives an RLUSD loan; after
the term expires the far leg reverses the exchange at the repayment amount. Both
legs are all-or-nothing batches of two `ConfidentialMPTSend` transactions.

## What the script does

| Step              | What happens                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 0. Prepare        | Checks domain access, resolves each account's XRPL address, loads the MMF/RLUSD tickers and their decimals                 |
| 1. Security setup | Provisions the issuer's ElGamal key and sets `MPTSetCanConfidentialAmount` + the issuer encryption key on the MMF issuance |
| 2. Holder setup   | Provisions ElGamal keys for seller and buyer and opens their confidential balances for both tokens                         |
| 3. Funding        | Converts public balances to confidential ones (and merges inboxes) until each side holds what its leg needs                |
| 4. Near leg       | Atomic batch: MMF collateral from seller → buyer, RLUSD principal from buyer → seller                                      |
| 5. Term           | Waits `TERM_PERIOD_MS`                                                                                                     |
| 6. Far leg        | Atomic batch: MMF back to the seller, RLUSD repayment (principal + interest) back to the buyer                             |

Balances are printed before and after each stage.

## Prerequisites

- A Ripple Custody instance that supports confidential MPTs, and an API user
  with access to the domain you configure.
- An XRPL node exposing the confidential-MPT amendments (the `xrpl` dependency
  is a vendored build — see `vendor/README.md`).
- Four accounts managed on that instance, each with an XRPL external address:
  the MMF issuer, the repo seller, the repo buyer, and a batch submitter.
- The MMF and RLUSD MPTs already issued, with **seller and buyer onboarded
  (authorized) on both**.
- Enough balance to make the deal work, otherwise a leg fails on the ledger:
  - seller: MMF ≥ `MMF_UNITS`, and RLUSD ≥ the interest (`RLUSD_REPAYMENT − RLUSD_PRINCIPLE`)
  - buyer: RLUSD ≥ `RLUSD_PRINCIPLE`
  - every signing account: XRP for fees and reserves (the script creates 10
    tickets per settling account when none exist)

## Setup

From the repository root:

```bash
npm install
```

**1. Environment.** Copy `.env.example` to `.env` and fill it in:

```bash
cp examples/xrpl/confidential-repo-dvp/.env.example .env
```

| Variable       | Meaning                                         |
| -------------- | ----------------------------------------------- |
| `API_URL`      | Ripple Custody API base URL                     |
| `AUTH_URL`     | OAuth token endpoint of the same instance       |
| `PRIVATE_KEY`  | API user private key (secret — never commit it) |
| `PUBLIC_KEY`   | API user public key                             |
| `XRPL_WSS_URL` | WebSocket URL of the XRPL node                  |
| `DEBUG`        | `"true"` to log every SDK request; optional     |

All five non-optional variables are read through `requireEnv`, so a missing one
fails immediately rather than halfway through the flow.

**2. Instance values.** Edit `config.ts` — every id in it is a placeholder:

- `DOMAIN_ID`, `LEDGER_ID` — your domain and the XRPL ledger id in Custody
- `WALLET_MMF_ISSUER`, `WALLET_REPO_SELLER`, `WALLET_REPO_BUYER`,
  `WALLET_SUBMITTER` — the Custody account ids (`address` is filled in at
  runtime, leave it `""`)
- `MMF_ID`, `RLUSD_ID` — the two MPT issuance ids
- `MMF_UNITS`, `RLUSD_PRINCIPLE`, `RLUSD_REPAYMENT`, `TERM_PERIOD_MS` — the deal
  terms, in scaled (human) units

## Run

From the repository root:

```bash
npx tsx examples/xrpl/confidential-repo-dvp/index.ts
```

`index.ts` imports `dotenv/config`, which reads the `.env` in the current
working directory — hence running from the root. To keep the env file next to
the example instead, point tsx at it:

```bash
npx tsx --env-file=examples/xrpl/confidential-repo-dvp/.env examples/xrpl/confidential-repo-dvp/index.ts
```

Expect the run to take several minutes: every step waits for its intent to
execute and for the resulting transaction to land, and step 5 sleeps for the
full repo term.

## Re-running

The script is written to be repeatable — steps 1 to 3 detect work that is
already done (existing ElGamal keys, existing confidential balances, sufficient
spendable balance) and skip it. Steps 4 and 6 always settle a new repo.

The one exception is the issuance setup in step 1: it is skipped only when a
confidential MMF ticker already exists in Custody, which is not true until some
account there holds a confidential balance. On the first re-run the
`MPTokenIssuanceSet` may be resubmitted and fail with `tecNO_PERMISSION`.

## Files

| File                 | Contents                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `index.ts`           | The six-step flow and `main()` — start here                                                                        |
| `config.ts`          | Ids, deal terms, polling budget, `requireEnv`, runtime ticker state                                                |
| `custody-helpers.ts` | Ripple Custody calls: tickers, addresses, balances, tickets, ElGamal keys, conversions, intent/quarantine handling |
| `settlement.ts`      | The DvP batch: proof computation, batch assembly, signing, submission, hash lookup                                 |
| `output.ts`          | Section headers and the balance report                                                                             |
| `types.ts`           | `Wallet` and balance shapes                                                                                        |

## Troubleshooting

- **`MMF not found in Ripple Custody.`** — `MMF_ID` / `RLUSD_ID` do not match a
  ticker on `LEDGER_ID`, or the ticker list is paginated past the first page.
- **`Could not find XRPL address for account <id>`** — the account id is wrong,
  or it has no external XRPL address on that ledger.
- **`tecNO_PERMISSION` on `MPTokenIssuanceSet`** — confidential transfers were
  already enabled on the issuance; see "Re-running" above.
- **A leg fails on the ledger** — usually insufficient balance or a missing MPT
  authorization; check the prerequisites.
