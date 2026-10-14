import type { RippleCustody } from "@florent-uzio/custody"
import type { Participant } from "./accounts.js"
import { CUSTODY, POLLING, TOKEN } from "./config.js"
import { address, releaseQuarantine, submit, tokenId } from "./custody-helpers.js"

/**
 * The regular (public) MPT steps: create the token, publish the encryption
 * keys on it, let the holders opt in, and pay the first holder.
 */

/** Step 2 — the issuer creates a new MPT issuance and gets its id back. */
export async function createIssuance(custody: RippleCustody, issuer: Participant) {
  const { payloadId } = await submit(custody, "create MPT issuance", issuer.address, {
    type: "MPTokenIssuanceCreate",
    flags: [...TOKEN.flags],
    assetScale: TOKEN.assetScale,
    maximumAmount: TOKEN.maximumAmount,
  })

  // The issuance id is minted by the ledger; custody records it on the
  // transaction shortly after it is validated, hence the polling variant.
  return custody.xrpl.getMptIssuanceIdAndWait({ domainId: CUSTODY.domainId, payloadId }, POLLING)
}

/**
 * Step 4 — the issuer publishes its own and the auditor's ElGamal public keys
 * on the issuance. From now on every confidential amount is also encrypted to
 * these two keys, which is what lets the issuer and the auditor see balances.
 */
export async function registerEncryptionKeys(
  custody: RippleCustody,
  issuer: Participant,
  issuanceId: string,
  keys: { issuer: string; auditor: string },
) {
  await submit(custody, "register issuer + auditor ElGamal keys", issuer.address, {
    type: "MPTokenIssuanceSet",
    tokenIdentifier: tokenId(issuanceId),
    flags: [],
    // Empty: confidential amounts were already enabled at creation
    // (`tfMPTCanConfidentialAmount` in config.ts), so there is nothing to mutate.
    mutableFlags: [],
    issuerEncryptionKey: keys.issuer,
    auditorEncryptionKey: keys.auditor,
  })
}

/** Step 5 — a holder opts in to hold the MPT (creates its MPToken ledger entry). */
export async function authorizeHolder(
  custody: RippleCustody,
  holder: Participant,
  issuanceId: string,
) {
  await submit(custody, `${holder.role} authorizes the MPT`, holder.address, {
    type: "MPTokenAuthorize",
    tokenIdentifier: tokenId(issuanceId),
    flags: [],
  })
}

/**
 * Step 6 — a regular, fully public MPT payment from the issuer to a holder.
 * The funds arrive quarantined in custody, so they are released straight away.
 */
export async function payPublicMpt(
  custody: RippleCustody,
  from: Participant,
  to: Participant,
  issuanceId: string,
  amount: string,
) {
  await submit(custody, `pay ${amount} MPT ${from.role} → ${to.role} (public)`, from.address, {
    type: "Payment",
    destination: address(to.address),
    amount,
    currency: { type: "MultiPurposeToken", issuanceId },
  })

  await releaseQuarantine(custody, to.accountId, to.role)
}
