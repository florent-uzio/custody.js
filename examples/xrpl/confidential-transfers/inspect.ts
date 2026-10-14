import { CustodyError, type RippleCustody } from "@florent-uzio/custody"
import type { Client, LedgerEntry } from "xrpl"
import type { Participant } from "./accounts.js"
import { CUSTODY, POLLING } from "./config.js"

/**
 * Read-only steps: what each party can see of the confidential balances
 * (step 13) and of the confidential transactions (step 14).
 */

/** Shortens a long hex ciphertext so it fits on one line. */
const short = (hex: string | undefined) => (hex ? `${hex.slice(0, 16)}…${hex.slice(-8)}` : "-")

/**
 * Step 13 — a holder's balances, from three points of view.
 *
 * 1. Custody: the balances custody books for the account. Custody holds the
 *    holder's ElGamal private key, so it knows the spendable confidential
 *    balance in clear.
 * 2. The inbox, decrypted on demand by the vault (internal, devbox-only API).
 * 3. The ledger: the holder's MPToken entry as anyone can read it. The public
 *    balance is in clear; the confidential balance only exists as ciphertexts,
 *    one of them encrypted to the issuer and one to the auditor. Those private
 *    keys live in the vault and are never exported, so this script can show
 *    the issuer's ciphertext but cannot decrypt it.
 */
export async function printBalances(
  custody: RippleCustody,
  client: Client,
  holder: Participant,
  issuanceId: string,
) {
  console.log(`\n  ${holder.role} (${holder.address})`)

  // 1. Custody's view. Custody tracks one ticker per side of the MPT.
  const tickers = await custody.tickers.findByXrplMptIssuanceId(issuanceId, {
    ledgerId: CUSTODY.ledgerId,
  })
  const { items: balances } = await custody.accounts.getAccountBalances({
    domainId: CUSTODY.domainId,
    accountId: holder.accountId,
  })
  const balanceOf = (tickerId: string | undefined) =>
    balances.find((balance) => balance.tickerId === tickerId)?.totalAmount ?? "0"

  console.log("    custody")
  console.log(`      public                  ${balanceOf(tickers.public?.id)}`)
  console.log(`      confidential spendable  ${balanceOf(tickers.confidential?.id)}`)
  console.log(`      confidential inbox      ${await decryptInbox(custody, holder, issuanceId)}`)

  // 3. The ledger's view.
  const { result } = await client.request({
    command: "ledger_entry",
    mptoken: { mpt_issuance_id: issuanceId, account: holder.address },
  })
  // xrpl.js leaves `MPToken` out of its `LedgerEntry` union, hence the cast.
  const mptoken = result.node as unknown as LedgerEntry.MPToken | undefined

  console.log("    ledger (MPToken entry)")
  console.log(`      public (MPTAmount)      ${mptoken?.MPTAmount ?? "0"}`)
  console.log(`      inbox, holder key       ${short(mptoken?.ConfidentialBalanceInbox)}`)
  console.log(`      spendable, holder key   ${short(mptoken?.ConfidentialBalanceSpending)}`)
  console.log(`      total, issuer key       ${short(mptoken?.IssuerEncryptedBalance)}`)
  console.log(`      total, auditor key      ${short(mptoken?.AuditorEncryptedBalance)}`)
}

/**
 * Asks the vault to decrypt a holder's inbox (CB_IN). Returns "-" when the
 * holder has no confidential inbox for this issuance.
 */
async function decryptInbox(custody: RippleCustody, holder: Participant, issuanceId: string) {
  try {
    const { isSuccess, status, decryption } = await custody.internal.cbInDecryption.initiateAndWait(
      {
        accountId: holder.accountId,
        domainId: CUSTODY.domainId,
        ledgerId: CUSTODY.ledgerId,
        issuanceId,
      },
      POLLING,
    )
    return isSuccess ? (decryption.decryptedAmount ?? "-") : `decryption ${status}`
  } catch (error) {
    if (error instanceof CustodyError && error.reason === "EntityNotFoundError") return "-"
    throw error
  }
}

/**
 * Step 14 — what a confidential send looks like on the ledger.
 *
 * The plaintext amount is not on the ledger. It exists only as four ElGamal
 * ciphertexts (to the sender, the destination, the issuer and the auditor),
 * plus commitments and a zero-knowledge proof that the amount is valid.
 *
 * Decrypting one of them needs the matching ElGamal private key, and every one
 * of those keys is held by the custody vault and never exported. The SDK has
 * no endpoint to decrypt a transaction's amount either (only an account's
 * inbox, see `decryptInbox`), so the amount cannot be recovered here.
 */
export async function inspectConfidentialSend(client: Client, label: string, hash: string) {
  const { result } = await client.request({ command: "tx", transaction: hash })
  const tx = result.tx_json

  console.log(`\n  ${label} — ${hash}`)

  if (tx.TransactionType !== "ConfidentialMPTSend") {
    console.log(`    unexpected transaction type ${tx.TransactionType}`)
    return
  }

  console.log(`    from                       ${tx.Account}`)
  console.log(`    to                         ${tx.Destination}`)
  console.log(`    amount                     (not on the ledger)`)
  console.log(`    encrypted to sender        ${short(tx.SenderEncryptedAmount)}`)
  console.log(`    encrypted to destination   ${short(tx.DestinationEncryptedAmount)}`)
  console.log(`    encrypted to issuer        ${short(tx.IssuerEncryptedAmount)}`)
  console.log(`    encrypted to auditor       ${short(tx.AuditorEncryptedAmount)}`)
  console.log(`    amount commitment          ${short(tx.AmountCommitment)}`)
  console.log(`    zero-knowledge proof       ${tx.ZKProof.length / 2} bytes`)
}
