# Confidential MPT (cMPT) transfers

Two runnable examples:

| File       | What it does                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| `index.ts` | The whole flow, from an empty instance to a `ConfidentialMPTSend` and then a `ConfidentialMPTClawback` |
| `batch.ts` | Several `ConfidentialMPTSend` operations from different accounts, bundled into one atomic Batch        |

Start with `index.ts`. `batch.ts` does no setup and assumes a confidential MPT
whose senders already hold a spendable confidential balance.

## Prerequisites

- A Ripple Custody instance that serves the confidential MPT operations. They
  are currently devbox-only, so **do not pin `apiVersion`** on the client — the
  official releases the SDK bundles capability data for do not list these
  schemas, and a pinned version would reject the calls before they are sent.
- `PRIVATE_KEY` and `PUBLIC_KEY` in the environment.
- Funded XRPL accounts. `index.ts` funds the accounts it creates itself, from
  the faucet configured in `CONFIG.network` — set `xrplUrl` and `faucetHost` for
  the network the ledger sits on. Accounts you pass in through `CONFIG.accounts`
  are not funded: the script stops with their addresses if any reports no
  balance. Beyond the base reserve, each holder needs owner reserve for the
  MPToken and its confidential balance objects.
- For `batch.ts`, a WebSocket URL for an XRPL node on the same network — ticket
  sequences are not exposed by the custody API and have to be read from the
  ledger.

Both scripts are configured through a `CONFIG` object at the top of the file.

## The flow

Confidentiality is granted **after** the token exists. There is no creation-time
flag, and once granted it cannot be cleared — `MPTSetCanConfidentialAmount` has
no clearing counterpart.

**Phase A — token in circulation**

1. `MPTokenIssuanceCreate` — the issuer creates a regular MPT. `tfMPTCanClawback`
   has to be set here; it is what makes the clawback in step 12 possible, and it
   cannot be added later.
2. `MPTokenAuthorize` — holders authorize the token.

**Phase B — confidential enablement**

3. `v0_ProvisionElGamalKeyPair` — every participant provisions an ElGamal key
   pair, including the issuer and the auditor when one is configured. The vault
   generates and holds it; only the public half is readable.
4. `MPTokenIssuanceSet` — the issuer sets `MPTSetCanConfidentialAmount` and
   publishes `issuerEncryptionKey` (and `auditorEncryptionKey` if used) in one
   operation.
5. `Payment` — the issuer distributes regular MPT.
6. `ConfidentialMPTConvert` with `amount: "0"` — the opt-in variant. Converts
   nothing; publishes the holder's ElGamal public key and its Schnorr proof of
   knowledge. **Both** sides need this, not just the sender.
7. `ConfidentialMPTConvert` with a real amount — converts MPT into confidential
   balance, which lands in the inbox (`CB_IN`).
8. `ConfidentialMPTMergeInbox` — moves the inbox into the spendable balance
   (`CB_S`). Until this runs the holder has nothing to spend.

**Phase C — the confidential operations**

9. `ConfidentialMPTSend` — the sender transfers confidentially.
10. `ConfidentialMPTMergeInbox` — the receiver merges what arrived.
11. `ConfidentialMPTClawback` — the issuer claws back from the holder.

Each step depends on ledger state the previous one created, so the scripts poll
every intent to a terminal status before starting the next.

## Things that are easy to get wrong

**A standalone send needs no cryptographic material from you.** On
`ConfidentialMPTSend` and `ConfidentialMPTClawback`, `cryptographicFields` is
optional. A standalone operation is signed by the account's own custody key, so
the platform derives the ciphertexts, commitments and proof itself — pass the
plaintext `amount` and nothing else. You only supply them by hand inside a
Batch, where the submitter cannot compute proofs for another participant.

**Clawback has no `amount`.** The operation carries only `tokenIdentifier` and
`holder`; an amount exists solely inside the `Clawback` cryptographic fields,
and nothing in the SDK or the `parameters-compute` endpoint produces a clawback
proof today (it only supports `type: "cmpt-send"`). Omitting the fields is
therefore the only supported form, and it claws back the holder's confidential
balance rather than a chosen part of it. **Confirm the exact semantics with the
platform team before relying on this in production.**

**Encodings differ between the compute response and the Batch entry.**
`parameters-compute` returns every cryptographic field **hex**-encoded. The
Batch entry types `cryptographicFields` as **base64**, but keeps its own
top-level `senderEncryptedBalance` as **hex**. So the proof bundle needs
converting and `senderEncryptedBalance` does not:

| Field                                                     | From compute | In the Batch entry      |
| --------------------------------------------------------- | ------------ | ----------------------- |
| `senderEncryptedBalance` (top level on the inner op)      | hex          | hex — pass through      |
| `senderEncryptedAmount`, `zkProof`, the commitments, etc. | hex          | base64 — convert        |
| `signingPayload` from the dry run                         | hex          | signed as-is by the SDK |

`parametersComputeToCryptographicFields(fields)` does the conversion. The
compute response carries no `type` discriminator where the operation's union
needs one, so it also infers the variant (`Send`, `Clawback`, `Convert`,
`ConvertBack`) from the fields present. It deliberately does **not** produce the
entry's top-level `senderEncryptedBalance` — that one is hex and goes across
untouched, so it stays visible at the call site rather than hiding inside the
converter.

Older internal notes describe this the other way round (compute returning
base64). The bundled devbox spec `1.36.2` is the version the code above follows.

**Ticket sequences must match.** The `ticketSequence` a participant computes its
proof against and the `sequencing` value on its Batch entry are the same number.
A mismatch produces a proof that does not validate.

**A confidential Batch is restricted.** `ConfidentialMPTConvert` and
`ConfidentialMPTMergeInbox` are rejected inside a Batch; only
`ConfidentialMPTSend` and ordinary inner operations such as `Payment` are
accepted. The platform also rejects a Batch with more than 8 inner transactions
or signers, a participant without a matching signer, or any sequencing value of
0 or duplicated for the same account.

**Incoming sends cannot be attributed after aggregation.** A received
confidential send has no associated transfers — the amount is encrypted on
receipt and accumulates in `CB_IN`. Transfers are attached and decrypted at
merge time, so a merge covering several incoming sends cannot say who sent
what. Merging on each receipt, as `index.ts` does, keeps the mapping one-to-one.

## SDK methods used

- `client.xrpl.proposeIntent` — every XRPL operation, confidential ones included
- `client.xrpl.provisionElGamalKeyPair` — the `v0_ProvisionElGamalKeyPair` intent
- `client.xrpl.getElGamalPublicKey` — reads the base64 key back for
  `MPTokenIssuanceSet`
- `client.xrpl.getMptIssuanceIdAndWait` — resolves the issuance ID an executed
  `MPTokenIssuanceCreate` minted, polling until the ledger data is registered
  (custody fills it in shortly *after* the intent reports `Executed`, so the
  non-polling `getMptIssuanceId` throws when called straight afterwards)
- `client.accounts.initiateParametersComputeAndWait` — per-participant proof
  computation for a Batch
- `parametersComputeToCryptographicFields` — re-encodes that hex response into
  the base64 `cryptographicFields` an operation carries
- `client.xrpl.dryRunBatch` / `signBatchPayloadAndWait` / `proposeBatch` — the
  XLS-56 Batch flow
- `client.intents.getAndWait` — polls each intent to a terminal status
