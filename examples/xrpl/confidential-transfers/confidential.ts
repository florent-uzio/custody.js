import type { RippleCustody } from "@florent-uzio/custody"
import type { Participant } from "./accounts.js"
import { CONFIDENTIAL_POLLING, CUSTODY, POLLING } from "./config.js"
import { address, releaseQuarantine, submit, tokenId } from "./custody-helpers.js"

/**
 * The confidential steps.
 *
 * A holder's confidential balance has two parts:
 * - the inbox     (CB_IN) — where conversions and incoming sends land
 * - the spendable (CB_S)  — what a confidential send can spend from
 * `ConfidentialMPTMergeInbox` moves the inbox into the spendable balance.
 *
 * Amounts are passed in clear to custody, which encrypts them and builds the
 * zero-knowledge proofs inside the vault. Only ciphertexts reach the ledger.
 */

/**
 * Step 3 — make sure an account has an ElGamal key pair, and return its public key.
 *
 * The pair is generated and kept inside the custody vault; only the public
 * key ever leaves it. An account can only be provisioned once per ledger, so
 * a reused account keeps the key it already has.
 */
export async function ensureElGamalKey(custody: RippleCustody, participant: Participant) {
  const options = { domainId: CUSTODY.domainId, ledgerId: CUSTODY.ledgerId }

  const existing = await custody.xrpl.findElGamalPublicKey(participant.address, options)
  if (existing) {
    console.log(`  · ${participant.role} already has an ElGamal key`)
    return existing
  }

  console.log(`→ provision ElGamal key for ${participant.role}`)
  await custody.xrpl.provisionElGamalKeyPair(participant.address, options)

  // The vault writes the key shortly after the intent executes, so poll for it.
  const publicKey = await custody.xrpl.getElGamalPublicKeyAndWait(participant.address, {
    ...options,
    ...POLLING,
  })
  console.log(`  ✓ ${participant.role} ElGamal key provisioned`)
  return publicKey
}

/**
 * Steps 7 and 9 — register a holder's ElGamal public key on its MPToken entry.
 *
 * Done with a `ConfidentialMPTConvert` of `"0"`: custody attaches the holder's
 * key and a proof that it owns it, and converts nothing. A holder must do this
 * before converting a real amount or receiving a confidential send; otherwise
 * the ledger rejects the transaction with `tecNO_PERMISSION`.
 */
export async function registerHolderKey(
  custody: RippleCustody,
  holder: Participant,
  issuanceId: string,
) {
  await submit(
    custody,
    `${holder.role} registers its ElGamal key (convert 0)`,
    holder.address,
    {
      type: "ConfidentialMPTConvert",
      tokenIdentifier: tokenId(issuanceId),
      amount: "0",
    },
    CONFIDENTIAL_POLLING,
  )
}

/**
 * Step 7 — convert part of a holder's public balance into its confidential
 * inbox. The holder's key must already be registered (`registerHolderKey`).
 */
export async function convertToConfidential(
  custody: RippleCustody,
  holder: Participant,
  issuanceId: string,
  amount: string,
) {
  await submit(
    custody,
    `${holder.role} converts ${amount} MPT to confidential`,
    holder.address,
    {
      type: "ConfidentialMPTConvert",
      tokenIdentifier: tokenId(issuanceId),
      amount,
    },
    CONFIDENTIAL_POLLING,
  )
}

/** Steps 8 and 11 — move a holder's inbox into its spendable confidential balance. */
export async function mergeInbox(custody: RippleCustody, holder: Participant, issuanceId: string) {
  await submit(
    custody,
    `${holder.role} merges its inbox`,
    holder.address,
    {
      type: "ConfidentialMPTMergeInbox",
      tokenIdentifier: tokenId(issuanceId),
    },
    CONFIDENTIAL_POLLING,
  )

  // The merge is where custody decrypts and books the incoming amount, and
  // that booking can be quarantined like any other incoming transfer.
  await releaseQuarantine(custody, holder.accountId, holder.role)
}

/**
 * Steps 10 and 12 — a confidential payment. The amount is encrypted four times
 * on the ledger: to the sender, the destination, the issuer and the auditor.
 *
 * Returns the ledger transaction hash, used in step 14 to inspect it.
 */
export async function sendConfidential(
  custody: RippleCustody,
  from: Participant,
  to: Participant,
  issuanceId: string,
  amount: string,
) {
  const { hash } = await submit(
    custody,
    `send ${amount} MPT ${from.role} → ${to.role} (confidential)`,
    from.address,
    {
      type: "ConfidentialMPTSend",
      tokenIdentifier: tokenId(issuanceId),
      destination: address(to.address),
      amount,
    },
    CONFIDENTIAL_POLLING,
  )

  if (!hash) throw new Error("The confidential send has no ledger transaction hash")
  return hash
}
