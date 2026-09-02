import { RippleCustody } from "@florent-uzio/custody"
import "dotenv/config"
import { Client } from "xrpl"
import {
  DOMAIN_ID,
  MMF_ID,
  MMF_UNITS,
  RLUSD_ID,
  RLUSD_PRINCIPLE,
  RLUSD_REPAYMENT,
  TERM_PERIOD_MS,
  WALLET_MMF_ISSUER,
  WALLET_REPO_BUYER,
  WALLET_REPO_SELLER,
  WALLET_SUBMITTER,
  requireEnv,
  working_data,
} from "./config.js"
import {
  createElGammal,
  fundConfidentialBalance,
  getXRPLAddress,
  proposeAndWait,
  refreshTickers,
  setupHolder,
} from "./custody-helpers.js"
import { printBalances, sectionHeader } from "./output.js"
import { atomicSettlement } from "./settlement.js"
import type { Balances } from "./types.js"

/**
 * Example: Perform an end-to-end repo lifecycle
 *
 * Includes setup steps for both the security issuance (configuring confidentiality) and the holders (setup of encryption keys).
 * Intended to be both a Day 0 and repeatable end to end process.
 * Dependencies are listed as input data (constants) in `config.ts`.
 *
 * The process consists of the following separate steps:
 * 1. MMF Security Confidential Transfers Setup
 * 2. Holders Confidential Transfers Setup
 * 3. Fund Confidential Positions
 * 4. Repo Near Leg (DvP)
 * 5. Wait for Term of Repo
 * 6. Repo Far Leg (DvP)
 *
 * The steps live here; the helpers they call are in `custody-helpers.ts`
 * (Ripple Custody), `settlement.ts` (the DvP batch) and `output.ts` (printing).
 *
 **/

let client: Client

//**** Preparation ****/
const prepare = async (custody: RippleCustody) => {
  // Fails fast when the login has no access to DOMAIN_ID. Nothing here needs
  // the user id any more — `intents.proposePayload` fills `author` in itself —
  // so `domains.me()` replaces the `users.me()` + `domains.find` bootstrap.
  await custody.domains.me({ domainId: DOMAIN_ID })
  WALLET_MMF_ISSUER.address = await getXRPLAddress(custody, WALLET_MMF_ISSUER.id)
  WALLET_REPO_SELLER.address = await getXRPLAddress(custody, WALLET_REPO_SELLER.id)
  WALLET_REPO_BUYER.address = await getXRPLAddress(custody, WALLET_REPO_BUYER.id)
  WALLET_SUBMITTER.address = await getXRPLAddress(custody, WALLET_SUBMITTER.id)
  await refreshTickers(custody)
}

//**** Security Setup  ****/
// Create Issuer El-Gammal Key and update MPT issuance with it for confidential transfers
const setupSecurity = async (custody: RippleCustody) => {
  // Issuing Account El Gamal key
  const publicKey = await createElGammal(custody, WALLET_MMF_ISSUER, "MMF Issuer")

  // MMF Confidential Transfers Setup
  if (working_data.tickerMMFConf !== "")
    console.log("MMF confidential transfers already enabled - skipping enablement.")
  else {
    // NOTE: This transaction will fail with tecNO_PERMISSION if it has already been performed (minimized by above checking for a ticker... but that only bypasses if an account in RC holds a confidential balance)
    // POTENTIAL IMPROVEMENT: Check if the token has already been setup for confidential transfers
    console.log("Setting confidential flag and issuer encryption key for MMF.")
    // `proposeAndWait` also checks the on-ledger outcome, so a tecNO_PERMISSION
    // surfaces here rather than silently later.
    await proposeAndWait(custody, "MPTokenIssuanceSet (MMF confidential)", {
      Account: WALLET_MMF_ISSUER.address,
      operation: {
        type: "MPTokenIssuanceSet",
        tokenIdentifier: { issuanceId: MMF_ID, type: "MPTokenIssuanceId" },
        flags: [],
        mutableFlags: ["MPTSetCanConfidentialAmount"],
        issuerEncryptionKey: publicKey, // base64 ElGamal public key from step 1
      },
    })
    console.log("MPT settings for confidential transfers processed.")
  }
}

//**** Holders Setup ****/
const setupHolders = async (custody: RippleCustody) => {
  await setupHolder(custody, WALLET_REPO_SELLER, "Repo Seller")
  await setupHolder(custody, WALLET_REPO_BUYER, "Repo Buyer")
}

//**** Fund Confidential Positions ****/
const fundConfidential = async (custody: RippleCustody, bals: Balances) => {
  const mmfAmount = MMF_UNITS * Math.pow(10, working_data.scaleMMF)
  const rlusdPrincipalAmount = RLUSD_PRINCIPLE * Math.pow(10, working_data.scaleRLUSD)
  const rlusdInterestAmount =
    (RLUSD_REPAYMENT - RLUSD_PRINCIPLE) * Math.pow(10, working_data.scaleRLUSD)
  const [sellerChanged, buyerChanged] = await Promise.all([
    // The seller's two fundings run sequentially to avoid sequence number
    // clashes; the buyer is a different account, so it runs alongside them.
    (async () => {
      const mmfChanged = await fundConfidentialBalance(
        custody,
        WALLET_REPO_SELLER,
        MMF_ID,
        "MMF",
        bals.sellerBalances.mmfConfidentialSpendable,
        bals.sellerBalances.mmfConfidentialInbox,
        mmfAmount,
      )
      const rlusdChanged = await fundConfidentialBalance(
        custody,
        WALLET_REPO_SELLER,
        RLUSD_ID,
        "RLUSD",
        bals.sellerBalances.rlusdConfidentialSpendable,
        bals.sellerBalances.rlusdConfidentialInbox,
        rlusdInterestAmount,
      )
      return mmfChanged || rlusdChanged
    })(),
    fundConfidentialBalance(
      custody,
      WALLET_REPO_BUYER,
      RLUSD_ID,
      "RLUSD",
      bals.buyerBalances.rlusdConfidentialSpendable,
      bals.buyerBalances.rlusdConfidentialInbox,
      rlusdPrincipalAmount,
    ),
  ])
  return sellerChanged || buyerChanged
}

const repoNearLeg = async (custody: RippleCustody, xrplClient: Client) => {
  return atomicSettlement(
    custody,
    xrplClient,
    WALLET_REPO_SELLER,
    WALLET_REPO_BUYER,
    MMF_UNITS,
    RLUSD_PRINCIPLE,
  )
}

const repoFarLeg = async (custody: RippleCustody, xrplClient: Client) => {
  return atomicSettlement(
    custody,
    xrplClient,
    WALLET_REPO_BUYER,
    WALLET_REPO_SELLER,
    MMF_UNITS,
    RLUSD_REPAYMENT,
  )
}

//**** MAIN E2E PROCESS ****/
const main = async () => {
  try {
    const custody = new RippleCustody({
      apiUrl: requireEnv("API_URL"),
      authUrl: requireEnv("AUTH_URL"),
      privateKey: requireEnv("PRIVATE_KEY"),
      publicKey: requireEnv("PUBLIC_KEY"),
      debug: process.env.DEBUG === "true",
    })

    client = new Client(requireEnv("XRPL_WSS_URL"))
    await client.connect()

    await prepare(custody)

    sectionHeader("1. MMF Security Confidential Transfers Setup")
    await setupSecurity(custody)
    console.log()

    sectionHeader("2. Holders Confidential Transfers Setup")
    await setupHolders(custody)
    console.log()

    sectionHeader("3. Fund Confidential Positions")
    console.log("Pre-funding balances (scaled):")
    console.log()
    const bals = await printBalances(custody)
    console.log()
    if(isNaN(bals.buyerBalances.mmfConfidentialInbox) || isNaN(bals.buyerBalances.rlusdConfidentialInbox) || isNaN(bals.sellerBalances.mmfConfidentialInbox) || isNaN(bals.sellerBalances.rlusdConfidentialInbox)) throw new Error("Confidential Inbox amount could not be determined.") // Terminating as otherwise this causes incorrect funding actions
    const fundingChanged = await fundConfidential(custody, bals)
    if (fundingChanged) {
      // Adding a pause to ensure data consistency in Ripple Custody balances
      await new Promise((resolve) => setTimeout(resolve, 5000))
      console.log("Post-funding balances (scaled):")
      console.log()
      const balsFunded = await printBalances(custody)
      console.log()
    } else console.log("No funding changes needed.")
    console.log()

    sectionHeader("4. Repo Near Leg (DvP)")
    await repoNearLeg(custody, client)
    // Adding a pause to ensure data consistency in Ripple Custody balances
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log("Repo Active, Balances (scaled):")
    console.log()
    await printBalances(custody)
    console.log()

    sectionHeader(`5. Waiting for term of the Repo (${TERM_PERIOD_MS}ms).`)
    await new Promise((resolve) => setTimeout(resolve, TERM_PERIOD_MS))
    console.log()

    sectionHeader("6. Repo Far Leg (DvP)")
    await repoFarLeg(custody, client)
    // Adding a pause to ensure data consistency in Ripple Custody balances
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log("Repo Closed, Balances (scaled):")
    console.log()
    await printBalances(custody)
    console.log()

  } catch (error) {
    console.log(error)
  } finally {
    if (client !== undefined && client !== null && client.isConnected()) await client.disconnect()
  }
}

main().catch((err) => console.log(err))
