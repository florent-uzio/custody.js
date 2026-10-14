import { RippleCustody } from "@florent-uzio/custody"
import { Client } from "xrpl"
import { getOrCreateAccounts } from "./accounts.js"
import {
  convertToConfidential,
  ensureElGamalKey,
  mergeInbox,
  registerHolderKey,
  sendConfidential,
} from "./confidential.js"
import { AMOUNTS, CUSTODY, XRPL } from "./config.js"
import { inspectConfidentialSend, printBalances } from "./inspect.js"
import { authorizeHolder, createIssuance, payPublicMpt, registerEncryptionKeys } from "./mpt.js"

/**
 * Example: confidential MPT transfers with Ripple Custody
 *
 * Four custody accounts — an ISSUER, an AUDITOR and two holders, ALICE and BOB —
 * run a confidential multi-purpose token end to end:
 *
 *  1. Get (or create and fund) the four accounts
 *  2. ISSUER creates the MPT
 *  3. Every account gets an ElGamal key pair (kept in the custody vault)
 *  4. ISSUER publishes its own and the AUDITOR's ElGamal keys on the MPT
 *  5. ALICE and BOB authorize the MPT
 *  6. ISSUER pays ALICE 1000 MPT (public payment)
 *  7. ALICE registers her ElGamal key (convert 0), then converts 1000 to a
 *     confidential balance (lands in her inbox)
 *  8. ALICE merges her inbox (the 1000 become spendable)
 *  9. BOB registers his ElGamal key by converting 0
 * 10. ALICE sends 300 to BOB confidentially
 * 11. BOB merges his inbox
 * 12. BOB sends 50 back to ALICE confidentially (left in her inbox on purpose)
 * 13. Balances of ALICE and BOB — custody, decrypted inbox, and the ledger view
 * 14. What the two confidential sends look like on the ledger
 *
 * Each step waits for its transaction to be validated before the next one
 * starts, because every step relies on the ledger state of the previous one.
 *
 * Run from the repository root:
 *   npx tsx examples/xrpl/confidential-transfers/index.ts
 */

const step = (title: string) => console.log(`\n========== ${title} ==========`)

const main = async () => {
  const custody = new RippleCustody({
    apiUrl: CUSTODY.apiUrl,
    authUrl: CUSTODY.authUrl,
    privateKey: CUSTODY.privateKey,
    publicKey: CUSTODY.publicKey,
    debug: CUSTODY.debug,
  })

  // Used to read the ledger directly (steps 1, 13 and 14) and to call the faucet.
  const client = new Client(XRPL.wssUrl)
  await client.connect()

  try {
    step("1. Accounts")
    const { ISSUER, AUDITOR, ALICE, BOB } = await getOrCreateAccounts(custody, client)

    step("2. Create the MPT")
    const issuanceId = await createIssuance(custody, ISSUER)
    console.log(`  MPT issuance id: ${issuanceId}`)

    step("3. ElGamal keys")
    const issuerKey = await ensureElGamalKey(custody, ISSUER)
    const auditorKey = await ensureElGamalKey(custody, AUDITOR)
    await ensureElGamalKey(custody, ALICE)
    await ensureElGamalKey(custody, BOB)

    step("4. Register the issuer and auditor keys on the MPT")
    await registerEncryptionKeys(custody, ISSUER, issuanceId, {
      issuer: issuerKey,
      auditor: auditorKey,
    })

    step("5. Holders authorize the MPT")
    await authorizeHolder(custody, ALICE, issuanceId)
    await authorizeHolder(custody, BOB, issuanceId)

    step("6. ISSUER pays ALICE (public)")
    await payPublicMpt(custody, ISSUER, ALICE, issuanceId, AMOUNTS.issuerToAlice)

    step("7. ALICE converts public → confidential")
    await registerHolderKey(custody, ALICE, issuanceId)
    await convertToConfidential(custody, ALICE, issuanceId, AMOUNTS.aliceConverts)

    step("8. ALICE merges her inbox")
    await mergeInbox(custody, ALICE, issuanceId)

    step("9. BOB registers his ElGamal key (convert 0)")
    await registerHolderKey(custody, BOB, issuanceId)

    step("10. ALICE → BOB (confidential)")
    const aliceToBobHash = await sendConfidential(
      custody,
      ALICE,
      BOB,
      issuanceId,
      AMOUNTS.aliceToBob,
    )

    step("11. BOB merges his inbox")
    await mergeInbox(custody, BOB, issuanceId)

    step("12. BOB → ALICE (confidential)")
    // ALICE does not merge afterwards, so step 13 shows a non-empty inbox.
    const bobToAliceHash = await sendConfidential(
      custody,
      BOB,
      ALICE,
      issuanceId,
      AMOUNTS.bobToAlice,
    )

    step("13. Balances")
    console.log("  Expected: ALICE 700 spendable + 50 in the inbox, BOB 250 spendable")
    await printBalances(custody, client, ALICE, issuanceId)
    await printBalances(custody, client, BOB, issuanceId)

    step("14. The confidential sends on the ledger")
    await inspectConfidentialSend(client, "ALICE → BOB", aliceToBobHash)
    await inspectConfidentialSend(client, "BOB → ALICE", bobToAliceHash)
    console.log(
      "\n  The amounts cannot be decrypted here: each ciphertext needs an ElGamal private key,\n" +
        "  and those stay in the custody vault. See inspect.ts for details.",
    )

    console.log("\nDone.")
  } finally {
    await client.disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
