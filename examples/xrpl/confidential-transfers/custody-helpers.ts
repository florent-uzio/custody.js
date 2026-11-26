import type { RippleCustody } from "@florent-uzio/custody"

import { CUSTODY, POLLING } from "./config.js"

/**
 * Small helpers shared by every step:
 * - submit             — propose an XRPL transaction and wait until it is on the ledger
 * - releaseQuarantine  — make freshly received funds spendable
 * - tokenId / address  — shorthands for the operation fields used everywhere
 */

/** The `{ Account, operation }` pair `custody.xrpl.proposeIntentAndWait` takes. */
type XrplIntent = Parameters<RippleCustody["xrpl"]["proposeIntentAndWait"]>[0]

/** An XRPL operation, e.g. `{ type: "Payment", ... }`. */
export type XrplOperation = XrplIntent["operation"]

/** The `tokenIdentifier` every MPT operation takes. */
export const tokenId = (issuanceId: string) => ({ type: "MPTokenIssuanceId", issuanceId }) as const

/** The `destination` / `holder` shape of an operation. */
export const address = (value: string) => ({ type: "Address", address: value }) as const

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Proposes an XRPL transaction signed by `account` and returns only once it is
 * validated on the ledger.
 *
 * `proposeIntentAndWait` waits for both stages (the custody intent, then the
 * ledger transaction) but reports failures instead of throwing. Every step of
 * this demo builds on the previous one, so a failure here stops the script.
 *
 * `polling` bounds how long the transaction may take to land; confidential
 * operations pass the longer `CONFIDENTIAL_POLLING`.
 */
export async function submit(
  custody: RippleCustody,
  label: string,
  account: string,
  operation: XrplOperation,
  polling = POLLING,
) {
  console.log(`→ ${label}`)

  const result = await custody.xrpl.proposeIntentAndWait(
    { Account: account, operation },
    {
      domainId: CUSTODY.domainId,
      ledgerId: CUSTODY.ledgerId,
      intent: POLLING,
      transaction: polling,
    },
  )

  // `reason` names the stage that failed and who rejected it (custody or the ledger).
  if (!result.isSuccess || result.transaction === undefined) {
    throw new Error(`[${label}] ${result.reason}`)
  }

  const hash = result.transaction.ledgerTransactionData?.ledgerTransactionId
  console.log(`  ✓ ${label}${hash ? ` (tx ${hash})` : ""}`)

  return { payloadId: result.payloadId, hash }
}

/**
 * Releases the funds custody holds in quarantine for an account.
 *
 * Ripple Custody quarantines incoming transfers (faucet XRP, an MPT payment…)
 * and a quarantined amount cannot be spent: the next send fails its dry run
 * with `CurrentlyNotEnoughFunds`. `releaseQuarantinedTransfersAndWait` finds
 * every quarantined transfer of the account and releases them in one intent.
 *
 * Custody registers the incoming transfer a few seconds after the transaction
 * is validated, so this checks a few times before concluding there is nothing
 * to release (some instances do not quarantine at all).
 */
export async function releaseQuarantine(
  custody: RippleCustody,
  accountId: string,
  label: string,
  attempts = 3,
) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    // `all: true` is required: a release bypasses custody's compliance review,
    // so releasing everything is never the default.
    const result = await custody.transactions.releaseQuarantinedTransfersAndWait(
      { domainId: CUSTODY.domainId, accountId, all: true },
      POLLING,
    )

    if (result.proposed) {
      if (!result.isSuccess) throw new Error(`[release quarantine ${label}] ${result.reason}`)

      console.log(`  ✓ released ${result.transferIds.length} quarantined transfer(s) for ${label}`)
      return
    }

    if (attempt < attempts) await sleep(2000)
  }

  console.log(`  · nothing quarantined for ${label}`)
}
