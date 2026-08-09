# Confidential MPT Batch Flow — Repo Use Case Reference

> **Scope**: This document describes the end-to-end sequence for issuing an MPT, granting it confidential-transfer properties, and executing a Batch of `ConfidentialMPTSend` operations across multiple participants (e.g. Komainu-managed accounts orchestrated by Licuido).

## Key Assumptions

- Confidentiality is granted **after** token creation via `MPTokenIssuanceSet`, not at creation time. The creation-time flag `tfMPTCanConfidentialAmount` has been removed.
- A Batch containing confidential operations may only include `ConfidentialMPTSend` entries (plus other regular inner ops, e.g. `Payment`). `ConfidentialMPTConvert` and `ConfidentialMPTMergeInbox` are **not supported inside a Batch** ("not yet supported in V1").
- Reconciliation-impacting operations (conversion, merge) cannot be mixed into the same batch as sends.

---

## Phase A — Token in Circulation (Before Confidential Transfers)

### Step 1 — Issuer creates the regular MPT

Submit a `v0_CreateTransactionOrder` intent with an `MPTokenIssuanceCreate` operation.

```json
{
  "type": "v0_CreateTransactionOrder",
  "id": "<order-uuid>",
  "accountId": "<issuer-account-uuid>",
  "ledgerId": "<ledger-id>",
  "parameters": {
    "type": "XRPL",
    "feeStrategy": { "type": "Priority", "priority": "Medium" },
    "maximumFee": "1000000",
    "memos": [],
    "operation": {
      "type": "MPTokenIssuanceCreate",
      "assetScale": 0,
      "maximumAmount": "1000000000",
      "transferFee": 0,
      "metadata": "<hex>",
      "flags": ["tfMPTCanTransfer", "tfMPTRequireAuth"]
    }
  }
}
```

> ⚠️ **Do not** set a confidentiality flag at creation. Confidentiality is granted post-creation via `MPTokenIssuanceSet` (Step 4).

### Step 2 — Receivers authorize the MPT

```json
{
  "type": "v0_CreateTransactionOrder",
  "id": "<order-uuid>",
  "accountId": "<receiver-account-uuid>",
  "ledgerId": "<ledger-id>",
  "parameters": {
    "type": "XRPL",
    "feeStrategy": { "type": "Priority", "priority": "Medium" },
    "maximumFee": "1000000",
    "memos": [],
    "operation": {
      "type": "MPTokenAuthorize",
      "tokenIdentifier": { "type": "MPTokenIssuanceId", "value": "<mpt-issuance-id-hex>" }
    }
  }
}
```

---

## Phase B — Confidential Enablement

### Step 3 — Every participant provisions an ElGamal key pair

Each participant (issuer, all senders/receivers, and the auditor account if used) submits this intent. The vault generates and stores the ElGamal key pair; the public key becomes queryable from the account.

```json
{
  "type": "v0_ProvisionElGamalKeyPair",
  "id": "<provision-uuid>",
  "accountId": "<participant-account-uuid>",
  "ledgerId": "<ledger-id>"
}
```

This sends the following to the network:

- `HolderElGamalPublicKey`
- `HolderEncryptedAmount`
- `IssuerEncryptedAmount`
- `AuditorEncryptedAmount` (if configured)
- `BlindingFactor`
- `ZKProof` (Schnorr PoK)

### Step 4 — Issuer grants confidential properties via `MPTokenIssuanceSet`

One atomic operation sets the mutable confidentiality flag together with the issuer's and (optionally) the auditor's ElGamal public keys, both base64-encoded.

```json
{
  "type": "v0_CreateTransactionOrder",
  "id": "<order-uuid>",
  "accountId": "<issuer-account-uuid>",
  "ledgerId": "<ledger-id>",
  "parameters": {
    "type": "XRPL",
    "feeStrategy": { "type": "Priority", "priority": "Medium" },
    "maximumFee": "1000000",
    "memos": [],
    "operation": {
      "type": "MPTokenIssuanceSet",
      "tokenIdentifier": { "type": "MPTokenIssuanceId", "value": "<mpt-issuance-id-hex>" },
      "mutableFlags": ["MPTSetCanConfidentialAmount"],
      "issuerEncryptionKey": "<issuer-elgamal-public-key-base64>",
      "auditorEncryptionKey": "<auditor-elgamal-public-key-base64>"
    }
  }
}
```

> ⚠️ `MPTClearCanConfidentialAmount` was removed at commit `cb82401ba6` — once set, the confidential property **cannot be cleared**.
> `auditorEncryptionKey` is optional; omit it if no auditor is configured.

### Step 5 — Issuer distributes regular MPT (if not already done)

```json
{
  "type": "Payment",
  "destination": { "type": "Address", "address": "<receiver-xrpl-address>" },
  "amount": "<amount-string>",
  "currency": { "type": "MultiPurposeToken", "issuanceId": "<mpt-issuance-id-hex>" }
}
```

### Step 6 — Holders opt in / reveal their ElGamal key

Uses `ConfidentialMPTConvert` with `amount: "0"`. The `amount` field is mandatory; `"0"` is the key-reveal (opt-in) variant. The holder's secret key is sent to the vault only at this point, and the vault publishes `HolderElGamalPublicKey` plus the Schnorr proof-of-knowledge to the network.

```json
{
  "type": "v0_CreateTransactionOrder",
  "id": "<order-uuid>",
  "accountId": "<holder-account-uuid>",
  "ledgerId": "<ledger-id>",
  "parameters": {
    "type": "XRPL",
    "feeStrategy": { "type": "Priority", "priority": "Medium" },
    "maximumFee": "1000000",
    "memos": [],
    "operation": {
      "type": "ConfidentialMPTConvert",
      "tokenIdentifier": { "type": "MPTokenIssuanceId", "value": "<mpt-issuance-id-hex>" },
      "amount": "0"
    }
  }
}
```

### Step 7 — Holders convert MPT to cMPT

Same operation, non-zero amount. The vault computes `HolderEncryptedAmount`, `IssuerEncryptedAmount`, `AuditorEncryptedAmount` (if configured), `BlindingFactor`, and `ZKProof`. The converted balance lands in the confidential inbox (`CB_IN`).

```json
{
  "type": "ConfidentialMPTConvert",
  "tokenIdentifier": { "type": "MPTokenIssuanceId", "value": "<mpt-issuance-id-hex>" },
  "amount": "<amount-string>"
}
```

### Step 8 — Holders merge the inbox into the spendable balance

`ConfidentialMPTMergeInbox` is proof-free from the user's perspective. Internally, the platform performs a CBS-decryption round trip with the vault (internal endpoints `GET/POST /decrypt-cbs/pending`) to decrypt the new spendable balance `CB_S`.

```json
{
  "type": "ConfidentialMPTMergeInbox",
  "tokenIdentifier": { "type": "MPTokenIssuanceId", "value": "<mpt-issuance-id-hex>" }
}
```

From this point, participants can transact in cMPT.

---

## Phase C — Batch Preparation

### Step 9 — Reserve tickets

Every account that owns an inner operation **and** the outer submitter must reserve tickets via `TicketCreate`. Record the returned ticket sequence numbers — they're used as integer sequencing values in the batch and in `cmpt-compute`.

```json
{
  "type": "TicketCreate",
  "ticketCount": 2
}
```

> **Aviva pilot note (Komainu + Licuido):** Komainu manages the accounts; Licuido acts as the orchestration layer. Since only the account holder can reserve tickets, Komainu must either authorize ticket creation or submit the `TicketCreate` intents themselves for each of their accounts (bulk creation periodically is recommended over per-transaction creation). When assembling the batch (Step 11), the orchestration layer retrieves the XRPL addresses of the Komainu accounts and their available tickets directly from the ledger via `account_objects` with `"type": "ticket"`. Each returned `Ticket` object carries a `TicketSequence`, used as the sequencing value in the batch and in `cmpt-compute` (Step 10). See the [`account_objects` reference](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects) and the Batch usage guide's Aviva pilot note.

### Step 10 — Each participant computes their confidential parameters (`cmpt-compute`)

This is the participant-facing endpoint that replaces the earlier `cmpt-zkp` proposal. It's a direct authenticated REST call (Bearer token) — **no intent, no approval-policy gating**. The platform forwards the request through ledger-accounting to the notary/vault (two-step protocol: compute, then later sign) and stores the resulting cryptographic fields for retrieval.

**Initiate:**

```
POST /v1/domains/{domainId}/accounts/{participantAccountId}/cmpt-compute
```

```json
{
  "tokenIdentifier": { "issuanceId": "<mpt-issuance-id-hex>" },
  "amount": 50,
  "destination": "<destination-xrpl-address>",
  "ticketSequence": "<participant-ticket-seq-integer>"
}
```

Response:

```json
{ "cmptComputeId": "<uuid>", "status": "Pending" }
```

> Requires the account to have an ElGamal key provisioned — returns `409 AccountNotReady` otherwise.

**Poll:**

```
GET /v1/domains/{domainId}/accounts/{participantAccountId}/cmpt-compute/{cmptComputeId}
```

Poll until `status` is `"Completed"` (or `"Failed"`). The completed response carries the cryptographic fields:

```json
{
  "id": "<compute-uuid>",
  "status": "Completed",
  "cryptographicFields": {
    "type": "Send",
    "senderEncryptedBalance": "<base64>",
    "senderEncryptedBalanceVersion": 0,
    "senderEncryptedAmount": "<base64>",
    "destinationEncryptedAmount": "<base64>",
    "issuerEncryptedAmount": "<base64>",
    "balanceCommitment": "<base64>",
    "amountCommitment": "<base64>",
    "zkProof": "<base64>",
    "auditorEncryptedAmount": "<base64, only when an auditor is configured>"
  }
}
```

Each participant runs this for their own `ConfidentialMPTSend` inner operation — including the submitter, for submitter-owned sends — and hands the resulting fields to the orchestrator. **The submitter cannot compute proofs on behalf of other accounts.**

The returned confidential values are incorporated into the corresponding fields of the `ConfidentialMPTSendPayload`, together with the participant's pre-created ticket values.

### Step 11 — Orchestrator assembles the batch and dry-runs it

```
POST /v1/domains/{domainId}/transactions/dry-run
```

Direct Bearer-token request, no Propose envelope. An empty `batchSigners[]` signals that the response should contain the batch signing payload. `ConfidentialMPTSend` inner operations must carry the fields collected in Step 10 — the platform rejects entries missing `cryptographicFields`, `senderEncryptedBalance`, or `senderEncryptedBalanceVersion`.

```json
{
  "accountId": "<submitter-account-uuid>",
  "ledgerId": "<ledger-id>",
  "parameters": {
    "type": "XRPL",
    "feeStrategy": { "type": "Priority", "priority": "Medium" },
    "maximumFee": "1000000000",
    "memos": [],
    "operation": {
      "type": "Batch",
      "executionMode": "AllOrNothing",
      "sequencing": { "type": "Ticket", "value": "<submitter-ticket-seq>" },
      "batchSigners": [],
      "entries": [
        {
          "type": "ParticipantOperation",
          "participant": { "type": "Account", "accountId": "<participant-1-uuid>" },
          "operation": {
            "type": "ConfidentialMPTSend",
            "tokenIdentifier": { "type": "MPTokenIssuanceId", "value": "<mpt-issuance-id-hex>" },
            "destination": { "type": "Address", "address": "<recipient-xrpl-address>" },
            "amount": "<amount-string>",
            "senderEncryptedBalance": "<hex>",
            "senderEncryptedBalanceVersion": 0,
            "cryptographicFields": {
              "type": "Send",
              "senderEncryptedAmount": "<base64>",
              "destinationEncryptedAmount": "<base64>",
              "issuerEncryptedAmount": "<base64>",
              "balanceCommitment": "<base64>",
              "amountCommitment": "<base64>",
              "zkProof": "<base64>",
              "auditorEncryptedAmount": "<base64, optional>"
            }
          },
          "sequencing": { "type": "Ticket", "value": "<participant-1-ticket-seq>" }
        },
        {
          "type": "ParticipantOperation",
          "participant": { "type": "Account", "accountId": "<participant-2-uuid>" },
          "operation": { "type": "ConfidentialMPTSend", "...": "as above for participant 2" },
          "sequencing": { "type": "Ticket", "value": "<participant-2-ticket-seq>" }
        }
      ]
    }
  }
}
```

> ⚠️ **Encoding mismatch to watch:** the top-level `senderEncryptedBalance` on the inner operation is **hex-encoded** (schema pattern `^[A-Fa-f0-9]*$`), while the `cmpt-compute` status response returns **base64** fields, and the `cryptographicFields` values inside the batch entry are also **base64**. Convert `senderEncryptedBalance` from base64 to hex when copying it to the inner-op top level. Verify one payload end-to-end with the dev team before scripting this.
>
> See also the [initial Batch user guide](https://docs.google.com/document/d/1KTaCxVr0oqYPho4nonRfdcdwV7TqCvhg8mW06G7j9vc/edit?tab=t.0) for an approach to handling this mismatch.

**Response** — extract and store `estimate.batchSigningData.signingPayload` (the same hex byte sequence every participant signs):

```json
{
  "result": "Success",
  "estimate": {
    "type": "Xrpl",
    "batchSigningData": {
      "signingPayload": "<hex>",
      "signingPayloadHash": "<hex>",
      "executionMode": "AllOrNothing",
      "transactions": ["...resolved inner transactions for participant review..."]
    }
  }
}
```

> The signing payload for a cMPT batch is assembled from per-inner-transaction hashes; `ConfidentialMPTSend` entries are encoded by the dedicated `XrplCmptSendInnerTxEncoder`. `ConfidentialMPTConvert` and `ConfidentialMPTMergeInbox` are still rejected inside a Batch ("not yet supported in V1") — a repo batch may only contain `Payment`s and `ConfidentialMPTSend`s (plus other regular inner ops).

#### Receiving side: incoming `ConfidentialMPTSend` and sender attribution

The receiving side of a `ConfidentialMPTSend` behaves differently from a normal transfer and is worth calling out explicitly:

- The incoming transaction is registered in custody, but under the current implementation it has **no associated transfers** — the transferred amount is encrypted at the moment of receipt and lands in the confidential inbox (`CB_IN`), so it has no impact on the custodied balance. For that reason, these transfers are not processed immediately.
- **Consequence:** transfers from different senders are aggregated in `CB_IN`.
- Funds are released to the custodied balance via `ConfidentialMPTMergeInbox`: the associated transfers are attached to the merge operation and decrypted at that point, since they now impact the custody balance.
- **Caveat:** because the inbox balance is aggregated, a merge **cannot** show who the individual senders were.

**Workaround via the orchestration layer (Licuido):** Licuido can steer around this by:

1. Retrieving incoming transactions of operation type `ConfidentialMPTSend` (identifiable via the Transaction Details `ledgerData` field).
2. Taking the transaction hash and retrieving transaction details over the network to identify the sender.
3. Triggering `ConfidentialMPTMergeInbox` immediately upon each receipt — merging per-transfer means each merge corresponds to a single transfer, so the sender of each confidential transfer stays known.

### Step 12 — Each participant signs the payload via `v0_SignManifest`

Convert `signingPayload` from hex to base64 raw bytes, then each participant submits a `SignManifest` intent (standard Propose envelope, user signature required):

```json
{
  "type": "v0_SignManifest",
  "id": "<fresh-manifest-uuid>",
  "accountId": "<participant-account-uuid>",
  "ledgerId": "<ledger-id>",
  "content": { "type": "Unsafe", "value": "<signing-payload-base64>" },
  "description": "Batch participant signature",
  "customProperties": {}
}
```

**Poll:**

```
GET /v1/domains/{domainId}/accounts/{participantAccountId}/manifests/{manifestId}
```

until `data.value.signature` is present.

| Field                  | Meaning                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `data.content.value`   | The input payload (base64) — identical for every participant            |
| `data.value.signature` | The participant's DER ECDSA signature (base64) — unique per participant |

Conversion steps:

- Convert the signature base64 → hex (~140–144 hex chars).
- Obtain each participant's public key from `GET /v1/domains/{domainId}/accounts/{accountId}` → `providerDetails.keys[id="SECP256K1_CUSTODY_1"].publicKey.value` (SPKI DER, base64) and convert it to compressed secp256k1 hex (66 chars, `02`/`03` prefix).

### Step 13 — Submitter submits the final batch

Identical operation body to the dry-run, submitted as a `v0_CreateTransactionOrder` intent, now with `batchSigners` populated:

```json
"batchSigners": [
  {
    "participant": { "type": "Account", "accountId": "<participant-1-uuid>" },
    "publicKey": "<compressed-secp256k1-hex-66-chars>",
    "signature": "<der-ecdsa-hex-~140-chars>"
  },
  {
    "participant": { "type": "Account", "accountId": "<participant-2-uuid>" },
    "publicKey": "<hex>",
    "signature": "<hex>"
  }
]
```

---

## Platform Validation Rules

_(verified in `XrplBatch.ValidatedBatch`)_

The batch is **rejected** if any of the following holds:

- More than 8 batch signers, or more than 8 inner transactions.
- Duplicate signers for the same participant.
- A signer referencing an account not present as a `ParticipantOperation`.
- A `ParticipantOperation` participant without a matching `BatchSigner`.
- Empty `publicKey` or `signature`.
- A `Ticket` or `AccountSequence` value of `0` anywhere (outer or inner).
- The outer sequencing value collides with any `SubmitterOperation` sequencing value.
- Two `SubmitterOperation`s share a `Ticket`/`AccountSequence` value.
- Two `ParticipantOperation`s of the same participant share a `Ticket`/`AccountSequence` value.
- Any `ConfidentialMPTSend` batch entry is missing `cryptographicFields`, `senderEncryptedBalance`, or `senderEncryptedBalanceVersion`.

---

## Quick Reference — Encoding Cheat Sheet

| Field                                                           | Encoding                                              |
| --------------------------------------------------------------- | ----------------------------------------------------- |
| `cmpt-compute` response fields (`senderEncryptedBalance`, etc.) | base64                                                |
| `cryptographicFields` inside a batch entry                      | base64                                                |
| Top-level `senderEncryptedBalance` on the inner op              | **hex** (convert from base64!)                        |
| `signingPayload` from dry-run                                   | hex                                                   |
| `signingPayload` sent to `v0_SignManifest`                      | base64 (convert from hex)                             |
| `data.value.signature` from manifest poll                       | base64 (convert to hex for batch submission)          |
| Public key from account `providerDetails`                       | base64 SPKI DER (convert to compressed secp256k1 hex) |
