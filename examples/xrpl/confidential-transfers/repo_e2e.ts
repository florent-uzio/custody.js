import {
  RippleCustody,
  batchToCustodyBatchPayload,
  type Core_ApiParametersComputeCryptographicFields,
} from "@florent-uzio/custody"
import "dotenv/config"
import crypto from "node:crypto"
import { BatchFlags, Client, GlobalFlags, type Batch, type ConfidentialMPTSend } from "xrpl"

/**
 * Example: Perform an end-to-end repo lifecycle
 *
 * Includes setup steps for both the security issuance (configuring confidentiality) and the holders (setup of encryption keys).
 * Intended to be both a Day 0 and repeatable end to end process.
 * Dependencies are listed below as input data (constants)
 *
 * The process consists of the following separate steps:
 * 1. MMF Security Confidential Transfers Setup
 * 2. Holders Confidential Transfers Setup
 * 3. Fund Confidential Positions
 * 4. Repo Near Leg (DvP)
 * 5. Wait for Term of Repo
 * 6. Repo Far Leg (DvP)
 *
 **/

type Wallet = {
  name: string
  id: string
  address: string
}

type HolderBalance = {
  mmfPublic: number
  mmfConfidentialSpendable: number
  mmfConfidentialInbox: number
  bMMFConfidential: boolean
  rlusdPublic: number
  rlusdConfidentialSpendable: number
  rlusdConfidentialInbox: number
  bRLUSDConfidential: boolean
}
type Balances = {
  sellerBalances: HolderBalance
  buyerBalances: HolderBalance
}

//**** TECHNICAL CONFIGURATION  ****/
const DOMAIN_ID = "9f425c77-6f77-41a6-85e9-e44975483efb"
const LEDGER_ID = "xrpl-custody-devnet"

//**** KEY DEPENDENCIES  ****/

// MMF Issuer - account that has issued the MMF token
// [Ripple Custody ID]
const WALLET_MMF_ISSUER: Wallet = {
  name: "MMF Issuer",
  id: "db884a4f-75f2-44df-8a91-1812d0f2c29e",
  address: "",
}

// MMF - Security to be used as collateral
// [XRPL MPT IssuanceID]
const MMF_ID =
  //"000828D603F840F28F8E8B9C728845B7A54226792AC235EC" // SEC1
  "000828DB03F840F28F8E8B9C728845B7A54226792AC235EC" // SEC2

// RLUSD - Cash to be used for the repo
// [XRPL MPT IssuanceID]
const RLUSD_ID = "000C26C5989D54A0722707111E47CCCEB57FBDFEF8E104F5"

// Repo seller - receives RLUSD loan for MMF security collateral
// It is assumed this account has onboarded with both the MMF and RLUSD MPTs
// It is assumed this account has a MMF balance sufficient to meet the collateral to be posted (else trade near leg will fail)
// It is assumed this account has sufficient RLUSD to pay the interest on the loan, or sufficient RLUSD is transferred to them prior to the far leg (else the trade far leg will fail)
// [Ripple Custody ID]
const WALLET_REPO_SELLER: Wallet =
  //{name: "Repo Seller", id: "051402a1-9d9b-4aa8-84ee-f36ae7bd3d97", address: ""} // W1.1
  { name: "Repo Seller", id: "62fa503d-8532-45cc-99f9-e99786b3aebd", address: "" } // W1.4

// Repo buyer - funds RLUSD loan taking MMF security collateral
// It is assumed this account has onboarded with both the MMF and RLUSD MPTs
// It is assumed this account has sufficient RLUSD to fund the loan (else trade near leg will fail)
// [Ripple Custody ID]
const WALLET_REPO_BUYER: Wallet =
  //{name: "Repo Buyer", id: "ee6a01d9-861d-448b-8730-2730e7795ff5", address: ""} // W1.2
  //{name: "Repo Buyer", id: "5ba96c23-16cd-432d-8af1-2e4e1a80ed09", address: ""} // W1.3
  { name: "Repo Buyer", id: "11876315-61b6-4c55-8592-fa23f109c4a3", address: "" } // W1.5

// Submitter - the wallet submitting the (batch, DvP) settlement transactions
// No requirements other than being active and managed on the Ripple Custody instance
const WALLET_SUBMITTER: Wallet = {
  name: "Batch Submitter",
  id: "eb50dde2-5a78-4d70-858d-bfce3918bf16",
  address: "",
}

//**** Repo Deal Terms  ****/
// Note: all amounts are scaled (NOT XRPL stored integer amounts)
const MMF_UNITS = 5
const RLUSD_PRINCIPLE = 50
const RLUSD_REPAYMENT = 51
const TERM_PERIOD_MS = 60000 // 1 minute

const working_data = {
  userId: "",
  tickerMMF: "",
  tickerMMFConf: "",
  scaleMMF: 0,
  tickerRLUSD: "",
  tickerRLUSDConf: "",
  scaleRLUSD: 0,
}
let client: Client

//**** Preparation ****/
const prepare = async (custody: RippleCustody) => {
  const me = await custody.users.me()
  const domain = me.domains.find((d) => d.id === DOMAIN_ID) ?? me.domains[0]
  if (domain === undefined) throw new Error("No domain found for this user.")
  working_data.userId = domain.userReference.id
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
  const mmf_amount = MMF_UNITS * Math.pow(10, working_data.scaleMMF)
  const rlusd_principal = RLUSD_PRINCIPLE * Math.pow(10, working_data.scaleRLUSD)
  const rlusd_interest = (RLUSD_REPAYMENT - RLUSD_PRINCIPLE) * Math.pow(10, working_data.scaleRLUSD)
  const [changed1, changed2] = await Promise.all([
    // The seller's two fundings run sequentially to avoid sequence number
    // clashes; the buyer is a different account, so it runs alongside them.
    (async () => {
      const bChange1 = await fundConfidentialBalance(
        custody,
        WALLET_REPO_SELLER,
        MMF_ID,
        "MMF",
        bals.sellerBalances.mmfConfidentialSpendable,
        bals.sellerBalances.mmfConfidentialInbox,
        mmf_amount,
      )
      const bChange2 = await fundConfidentialBalance(
        custody,
        WALLET_REPO_SELLER,
        RLUSD_ID,
        "RLUSD",
        bals.sellerBalances.rlusdConfidentialSpendable,
        bals.sellerBalances.rlusdConfidentialInbox,
        rlusd_interest,
      )
      return bChange1 || bChange2
    })(),
    fundConfidentialBalance(
      custody,
      WALLET_REPO_BUYER,
      RLUSD_ID,
      "RLUSD",
      bals.buyerBalances.rlusdConfidentialSpendable,
      bals.buyerBalances.rlusdConfidentialInbox,
      rlusd_principal,
    ),
  ])

  return changed1 || changed2
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
    const bChange = await fundConfidential(custody, bals)
    if (bChange) {
      // Adding a pause to ensure data consistency
      await new Promise((resolve) => setTimeout(resolve, 3000))
      console.log("Post-funding balances (scaled):")
      console.log()
      await printBalances(custody)
      console.log()
    } else console.log("No funding changes needed.")
    console.log()

    sectionHeader("4. Repo Near Leg (DvP)")
    await repoNearLeg(custody, client)
    console.log("Repo Active, Balances (scaled):")
    console.log()
    await printBalances(custody)
    console.log()

    sectionHeader(`5. Waiting for term of the Repo (${TERM_PERIOD_MS}ms).`)
    await new Promise((resolve) => setTimeout(resolve, TERM_PERIOD_MS))
    console.log()

    sectionHeader("6. Repo Far Leg (DvP)")
    await repoFarLeg(custody, client)
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

//**** RC Helper Functions ****/
// refreshTickers
// getXRPLAddress
// getBalances
// getTicket
// createElGammal
// setupHolder
// fundConfidentialBalance
// mergeInbox
// confidentialConvert
// constructConfidentialTransfer
// atomicSettlement

async function refreshTickers(custody: RippleCustody) {
  // `ledgerId` is a server-side filter, so the ledger is narrowed before the
  // page limit applies rather than after. If the ledger itself carries more
  // tickers than one page holds, paginate with `startingAfter`.
  const { items } = await custody.tickers.list({ ledgerId: [LEDGER_ID] })

  const findXrplTicker = (
    tokenType: "MultiPurposeToken" | "ConfidentialMultiPurposeToken",
    issuanceId: string,
  ) =>
    // The top-level ticker fields are deprecated (deletion target Mar. 2027);
    // `data` carries the same shape and is the one to read.
    items.find(({ data }) => {
      if (data.ledgerDetails.type !== "XRPL") return false
      const properties = data.ledgerDetails.properties
      return (
        properties.type === tokenType &&
        "issuanceId" in properties &&
        properties.issuanceId === issuanceId
      )
    })?.data

  const mmf = findXrplTicker("MultiPurposeToken", MMF_ID)
  if (mmf === undefined) throw new Error("MMF not found in Ripple Custody.")
  working_data.tickerMMF = mmf.id
  working_data.scaleMMF = mmf.decimals ?? 0

  const mmfConf = findXrplTicker("ConfidentialMultiPurposeToken", MMF_ID)
  if (mmfConf !== undefined) working_data.tickerMMFConf = mmfConf.id

  const rlusd = findXrplTicker("MultiPurposeToken", RLUSD_ID)
  if (rlusd === undefined) throw new Error("RLUSD not found in Ripple Custody.")
  working_data.tickerRLUSD = rlusd.id
  working_data.scaleRLUSD = rlusd.decimals ?? 0

  const rlusdConf = findXrplTicker("ConfidentialMultiPurposeToken", RLUSD_ID)
  if (rlusdConf !== undefined) working_data.tickerRLUSDConf = rlusdConf.id
}

async function getXRPLAddress(custody: RippleCustody, accountId: string) {
  // Ledger and scope are server-side filters here too.
  const { items } = await custody.accounts.addresses(
    { domainId: DOMAIN_ID, accountId },
    { ledgerId: [LEDGER_ID], scope: ["External"], lastOnly: true },
  )
  const address = items[0]?.address
  if (address === undefined) throw new Error(`Could not find XRPL address for account ${accountId}`)
  return address
}

// Note: balances are un-scaled (i.e. apply scale to get actual real-world balance)
async function getBalances(custody: RippleCustody, accountId: string) {
  let ret = {
    mmfPublic: 0,
    mmfConfidentialSpendable: 0,
    mmfConfidentialInbox: 0,
    bMMFConfidential: false,
    rlusdPublic: 0,
    rlusdConfidentialSpendable: 0,
    rlusdConfidentialInbox: 0,
    bRLUSDConfidential: false,
  }

  const [balances, cbin_mmf, cbin_rlusd] = await Promise.all([
    custody.accounts.getAccountBalances({ accountId, domainId: DOMAIN_ID }),
    getInbox(custody, accountId, MMF_ID),
    getInbox(custody, accountId, RLUSD_ID),
  ])

  // A ticker id is only ever held once per account, so the first match is the
  // balance. The confidential ticker ids stay "" until the ledger has minted
  // them, which no balance matches.
  const balanceOf = (tickerId: string) =>
    tickerId === "" ? undefined : balances.items.find((x) => x.tickerId === tickerId)

  const mmf = balanceOf(working_data.tickerMMF)
  if (mmf !== undefined) ret.mmfPublic = parseInt(mmf.totalAmount)
  const mmfConf = balanceOf(working_data.tickerMMFConf)
  if (mmfConf !== undefined) {
    ret.mmfConfidentialSpendable = parseInt(mmfConf.totalAmount)
    ret.bMMFConfidential = true
  }

  const rlusd = balanceOf(working_data.tickerRLUSD)
  if (rlusd !== undefined) ret.rlusdPublic = parseInt(rlusd.totalAmount)
  const rlusdConf = balanceOf(working_data.tickerRLUSDConf)
  if (rlusdConf !== undefined) {
    ret.rlusdConfidentialSpendable = parseInt(rlusdConf.totalAmount)
    ret.bRLUSDConfidential = true
  }

  if (cbin_mmf !== null) {
    ret.bMMFConfidential = true
    ret.mmfConfidentialInbox = cbin_mmf
  }

  if (cbin_rlusd !== null) {
    ret.bRLUSDConfidential = true
    ret.rlusdConfidentialInbox = cbin_rlusd
  }

  return ret
}

async function getInbox(custody: RippleCustody, accountId: string, issuanceId: string) {
  try {
    const cbin = await custody.internal.cbInDecryption.initiateAndWait({
      accountId,
      domainId: DOMAIN_ID,
      ledgerId: LEDGER_ID,
      issuanceId,
    })
    if (cbin.decryption.decryptedAmount !== undefined) {
      return parseInt(cbin.decryption.decryptedAmount)
    } else return null
  } catch (e) {
    // (no confidential inbox)
    return null
  }
}

async function getTicket(
  custody: RippleCustody,
  xrplClient: Client,
  accountAddress: string,
  bCreate: boolean,
): Promise<number> {
  // Note: creates 10 tickets if none exist
  // Does not handle concurrency... just returns the first ticket, if two processes request one it will likely be the same
  const tickets = await xrplClient.request({
    command: "account_objects",
    account: accountAddress,
    type: "ticket",
  })
  const ticket = tickets.result.account_objects.find(
    (object): object is Extract<typeof object, { LedgerEntryType: "Ticket" }> =>
      object.LedgerEntryType === "Ticket",
  )
  if (ticket !== undefined) {
    return ticket.TicketSequence
  } else {
    if (!bCreate)
      throw new Error(`[Get Ticket] No tickets found for account address ${accountAddress}`)
    console.log(`Creating tickets for account address ${accountAddress}.`)
    await proposeAndWait(custody, `TicketCreate (${accountAddress})`, {
      Account: accountAddress,
      operation: {
        type: "TicketCreate",
        ticketCount: 10,
      },
    })
    console.log(`Tickets successfully created for account address ${accountAddress}.`)
    return getTicket(custody, xrplClient, accountAddress, false)
  }
}

async function createElGammal(custody: RippleCustody, wallet: Wallet, txtAccount: string) {
  let publicKey = await custody.xrpl.findElGamalPublicKey(wallet.address, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
  })
  if (publicKey !== undefined && publicKey !== "") {
    console.log(`${txtAccount} has existing ElGamal key registered: ${publicKey}`)
  } else {
    console.log(`Generating ${txtAccount} ElGamal Key.`)
    await custody.xrpl.provisionElGamalKeyPair(wallet.address, { domainId: DOMAIN_ID })
    // The vault writes the key *after* the provisioning intent executes, so
    // read it back with the polling variant rather than a bare get.
    publicKey = await custody.xrpl.getElGamalPublicKeyAndWait(wallet.address, {
      domainId: DOMAIN_ID,
      ledgerId: LEDGER_ID,
    })
    console.log(`${txtAccount} ElGamal Key created: ${publicKey}`)
  }
  return publicKey
}

async function setupHolder(custody: RippleCustody, wallet: Wallet, txtAccount: string) {
  const bal = await getBalances(custody, wallet.id)
  if (bal.bMMFConfidential) console.log(`${txtAccount} already has confidential MMF balances.`)
  else {
    console.log(`Setting up ${txtAccount} confidential MMF balances.`)
    await createElGammal(custody, wallet, txtAccount)
    await confidentialConvert(custody, wallet, MMF_ID, "MMF", "0")
    console.log(`Setup of ${txtAccount} confidential MMF balances complete.`)
  }
  if (bal.bRLUSDConfidential) console.log(`${txtAccount} already has confidential RLUSD balances.`)
  else {
    console.log(`Setting up ${txtAccount} confidential RLUSD balances.`)
    await confidentialConvert(custody, wallet, RLUSD_ID, "RLUSD", "0")
    console.log(`Setup of ${txtAccount} confidential RLUSD balances complete.`)
  }
}

async function fundConfidentialBalance(
  custody: RippleCustody,
  wallet: Wallet,
  issuanceId: string,
  issuanceTxt: string,
  balanceSpendable: number,
  balanceInbox: number,
  requiredAmount: number,
) {
  if (balanceSpendable < requiredAmount) {
    if (balanceSpendable + balanceInbox < requiredAmount) {
      await confidentialConvert(
        custody,
        wallet,
        issuanceId,
        issuanceTxt,
        (requiredAmount - (balanceSpendable + balanceInbox)).toString(),
      )
    } else await mergeInbox(custody, wallet, issuanceId, issuanceTxt)
    return true
  } else {
    console.log(
      `${wallet.name} has sufficient ${issuanceTxt} confidential spendable balance to proceed.`,
    )
    return false
  }
}

async function confidentialConvert(
  custody: RippleCustody,
  wallet: Wallet,
  mptId: string,
  txtMPT: string,
  amount: string,
) {
  const transaction = await proposeAndWait(
    custody,
    `ConfidentialMPTConvert ${amount} ${txtMPT} (${wallet.name})`,
    {
      Account: wallet.address,
      operation: {
        type: "ConfidentialMPTConvert",
        tokenIdentifier: { issuanceId: mptId, type: "MPTokenIssuanceId" },
        amount,
      },
    },
  )

  // we now need to ensure we release funds from quarantine
  console.log(
    `MPT confidential convert of ${amount} units of asset ${txtMPT} held by ${wallet.name} processed (transaction: ${transaction.id}).`,
  )
  // NOTE: Perform quarantine in parallel with merge inbox
  // REDUCING CONCURRENCY TO ENSURE STABILITY - WILL ASSESS FOR LATER ENHANCEMENT
  // await Promise.all([
  //     performQuarantineRelease(custody, wallet.id, transaction.id, amount !== "0"),
  //     mergeInbox(custody, wallet, mptId, txtMPT)
  // ]);
  await performQuarantineRelease(custody, wallet.id, transaction.id, amount !== "0")
  await mergeInbox(custody, wallet, mptId, txtMPT)
  console.log(`Quarantine release and inbox merged for Confidential Convert for ${wallet.name}`)
  return
}

async function mergeInbox(custody: RippleCustody, wallet: Wallet, mptId: string, txtMPT: string) {
  // `proposeAndWait` only returns once the transaction is on the ledger.
  await proposeAndWait(custody, `ConfidentialMPTMergeInbox ${txtMPT} (${wallet.name})`, {
    Account: wallet.address,
    operation: {
      type: "ConfidentialMPTMergeInbox",
      tokenIdentifier: { issuanceId: mptId, type: "MPTokenIssuanceId" },
    },
  })
}

async function constructConfidentialTransfer(
  custody: RippleCustody,
  sender: Wallet,
  destination: Wallet,
  issuanceId: string,
  amount: string,
  ticketsequence: number,
) {
  const res = await custody.accounts.initiateParametersComputeAndWait(
    { domainId: DOMAIN_ID, accountId: sender.id },
    {
      type: "cmpt-send",
      tokenIdentifier: { issuanceId },
      amount: amount,
      destination: destination.address,
      ticketSequence: ticketsequence,
      ledgerId: LEDGER_ID,
    },
    {
      maxRetries: 20, // optional, default: 10
      intervalMs: 5000, // optional, default: 3000ms
    },
  )

  if (!res.isSuccess) {
    console.dir(res, { depth: null })
    throw new Error(`Confidential compute failed for account ${sender.name}: ${res.status}\n`)
  }
  const fields = res.compute.cryptographicFields
  if (fields === undefined || !isSendFields(fields))
    throw new Error(
      `Expected Send cryptographic fields for account ${sender.name}, got: ${JSON.stringify(fields)}`,
    )

  const transaction: ConfidentialSendLeg["transaction"] = {
    Account: sender.address,
    TransactionType: "ConfidentialMPTSend",
    Destination: destination.address,
    MPTokenIssuanceID: issuanceId,
    SenderEncryptedAmount: fields.senderEncryptedAmount,
    DestinationEncryptedAmount: fields.destinationEncryptedAmount,
    IssuerEncryptedAmount: fields.issuerEncryptedAmount,
    ...(fields.auditorEncryptedAmount !== undefined &&
      fields.auditorEncryptedAmount !== null && {
        AuditorEncryptedAmount: fields.auditorEncryptedAmount,
      }),
    AmountCommitment: fields.amountCommitment,
    BalanceCommitment: fields.balanceCommitment,
    ZKProof: fields.zkProof,
    TicketSequence: ticketsequence,
    Flags: GlobalFlags.tfInnerBatchTxn,
  }

  return {
    transaction,
    // The three fields the XRPL wire format has no room for. They have to be
    // carried alongside and grafted onto the custody batch entry below.
    custodyOnly: {
      amount,
      senderEncryptedBalance: fields.senderEncryptedBalance,
      senderEncryptedBalanceVersion: fields.senderEncryptedBalanceVersion,
    },
  }
}

/**
 * The two halves of one confidential leg: what goes on the XRPL wire, and what
 * only the Custody batch payload carries.
 *
 * `ConfidentialMPTSend` on the ledger commits to the amount as ciphertext only,
 * and the sender's encrypted balance is read from the ledger at apply time — so
 * neither the plaintext `amount` nor `senderEncryptedBalance` /
 * `senderEncryptedBalanceVersion` exists on the xrpl.js transaction. Harmonize
 * needs all three on the batch *entry* to dry-run and re-derive the proofs, and
 * `batchToCustodyBatchPayload` cannot invent what its input never held.
 */
type ConfidentialSendLeg = {
  transaction: ConfidentialMPTSend & { TicketSequence: number }
  custodyOnly: {
    amount: string
    senderEncryptedBalance?: string
    senderEncryptedBalanceVersion?: number
  }
}

/** Narrows a parameters-compute response to its `Send` variant. */
function isSendFields(
  fields: Core_ApiParametersComputeCryptographicFields,
): fields is Extract<
  Core_ApiParametersComputeCryptographicFields,
  { senderEncryptedAmount: string }
> {
  return "senderEncryptedAmount" in fields
}

async function atomicSettlement(
  custody: RippleCustody,
  xrplClient: Client,
  mmf_sender: Wallet,
  rlusd_sender: Wallet,
  mmf_units: number,
  rlusd_units: number,
) {
  console.log(
    `Atomic Settlement: ${mmf_sender.name} sending ${mmf_units} MMF units, ${rlusd_sender.name} sending ${rlusd_units} RLUSD.`,
  )
  console.log("Constructing inner transactions for batch.")
  const mmfUnscaledAmount = mmf_units * Math.pow(10, working_data.scaleMMF)
  const rlusdUnscaledAmount = rlusd_units * Math.pow(10, working_data.scaleRLUSD)
  // REDUCING CONCURRENCY TO ENSURE STABILITY - WILL ASSESS FOR LATER ENHANCEMENT
  // const [innerTrxn1, innerTrxn2] = await Promise.all([
  //     getTicket(custody, xrplClient, mmf_sender.address, true)
  //     .then(function(ticketsequence) {return constructConfidentialTransfer(custody, mmf_sender, rlusd_sender, MMF_ID, mmfUnscaledAmount.toString(), ticketsequence)}),
  //     getTicket(custody, xrplClient, rlusd_sender.address, true)
  //     .then(function(ticketsequence) {return constructConfidentialTransfer(custody, rlusd_sender, mmf_sender, RLUSD_ID, rlusdUnscaledAmount.toString(), ticketsequence)}),
  // ]);
  const mmfTicket = await getTicket(custody, xrplClient, mmf_sender.address, true)
  const mmfLeg = await constructConfidentialTransfer(
    custody,
    mmf_sender,
    rlusd_sender,
    MMF_ID,
    mmfUnscaledAmount.toString(),
    mmfTicket,
  )
  const rlusdTicket = await getTicket(custody, xrplClient, rlusd_sender.address, true)
  const rlusdLeg = await constructConfidentialTransfer(
    custody,
    rlusd_sender,
    mmf_sender,
    RLUSD_ID,
    rlusdUnscaledAmount.toString(),
    rlusdTicket,
  )

  console.log("Constructing batch transaction.")
  const batch: Batch = {
    Account: WALLET_SUBMITTER.address,
    TransactionType: "Batch",
    Flags: BatchFlags.tfAllOrNothing,
    RawTransactions: [
      { RawTransaction: mmfLeg.transaction },
      { RawTransaction: rlusdLeg.transaction },
    ],
  }
  // Second argument tells xrpl client how many signers to account for in calculation of the fee
  const autofilledBatch = await xrplClient.autofill(batch, 2)

  // Convert the autofilled Batch to a custody payload, then graft on the three
  // fields no xrpl.js Batch can carry (see `ConfidentialSendLeg`).
  const batchPayload = batchToCustodyBatchPayload(autofilledBatch)
  const custodyOnlyByAddress = new Map([
    [mmf_sender.address, mmfLeg.custodyOnly],
    [rlusd_sender.address, rlusdLeg.custodyOnly],
  ])

  for (const entry of batchPayload.entries) {
    if (entry.type !== "ParticipantOperation" || entry.participant.type !== "Address")
      throw new Error("Expected every batch entry to be a ParticipantOperation keyed by address.")
    if (entry.operation.type !== "ConfidentialMPTSend")
      throw new Error(`Unexpected inner operation ${entry.operation.type} in batch payload.`)

    const custodyOnly = custodyOnlyByAddress.get(entry.participant.address)
    if (custodyOnly === undefined)
      throw new Error(`Unknown participant ${entry.participant.address} in batch payload.`)

    entry.operation.amount = custodyOnly.amount
    entry.operation.senderEncryptedBalance = custodyOnly.senderEncryptedBalance
    entry.operation.senderEncryptedBalanceVersion = custodyOnly.senderEncryptedBalanceVersion
  }

  // Dry-run to obtain the canonical signing payload
  const { signingPayload } = await custody.xrpl.dryRunBatch(batchPayload, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
  })

  console.log("Retrieving participant signatures for batch.")
  const [signer1, signer2] = await Promise.all([
    custody.xrpl.signBatchPayloadAndWait(signingPayload, mmf_sender.address, {
      domainId: DOMAIN_ID,
    }),
    custody.xrpl.signBatchPayloadAndWait(signingPayload, rlusd_sender.address, {
      domainId: DOMAIN_ID,
    }),
  ])

  // The custodyBatchSigner fields are already in the Custody API format
  const batchSigners = [signer1.custodyBatchSigner, signer2.custodyBatchSigner]

  // The transaction order carries the payload id, so choose it up front rather
  // than digging it back out of the executed intent.
  const intentId = crypto.randomUUID()
  const orderId = crypto.randomUUID()
  console.log(`Submitting batch transaction (IntentId: ${intentId}, OrderId: ${orderId}).`)
  await custody.xrpl.proposeBatch(batchPayload, batchSigners, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
    requestId: intentId,
    payloadId: orderId,
  })
  const transaction = await waitForIntentTransaction(custody, "batch settlement", intentId, orderId)

  if (transaction.ledgerTransactionData === undefined)
    throw new Error(
      `XRPL Transaction Hash not found for completed batch transaction order ${orderId}.`,
    )
  try {
    const batchHashes = await checkBatchTransactionDetails(
      client,
      transaction.ledgerTransactionData.ledgerTransactionId,
    )
    console.log("Batch transaction successfully processed - XRPL Hashes:")
    console.log(`  Batch:     ${batchHashes.batch}`)
    console.log(`  MMF Leg:   ${batchHashes.mmf}`)
    console.log(`  RLUSD Leg: ${batchHashes.rlusd}`)
  } catch (error) {
    throw new Error(
      "Error getting XRPL transactions for atomic settlement batch - please check records.",
    )
  }

  console.log("Merging Inboxes.")
  // REDUCING CONCURRENCY TO ENSURE STABILITY - WILL ASSESS FOR LATER ENHANCEMENT
  // await Promise.all([
  //     mergeInbox(custody, mmf_sender, RLUSD_ID, "RLUSD"),
  //     mergeInbox(custody, rlusd_sender, MMF_ID, "MMF")
  // ]);
  await mergeInbox(custody, mmf_sender, RLUSD_ID, "RLUSD")
  await mergeInbox(custody, rlusd_sender, MMF_ID, "MMF")
  console.log("Inboxes Successfully Merged.")
}

//**** RC Processing Helper Functions ****/
// proposeAndWait
// waitForIntentTransaction
// performQuarantineRelease

/** Polling budget for the transaction an order produces: 12 attempts, 5s apart. */
const TRANSACTION_POLLING = { maxRetries: 12, intervalMs: 5000 }

/**
 * Proposes an XRPL intent and returns only once the transaction it produced is
 * on the ledger.
 *
 * `payloadId` is the transaction order id, so choosing it here is what lets
 * `transactions.byOrderAndWait` find the transaction — the alternative is
 * reading it back off the executed intent payload, which is typed as the union
 * of every intent payload the API knows and so needs narrowing to touch.
 */
async function proposeAndWait(
  custody: RippleCustody,
  label: string,
  params: Parameters<RippleCustody["xrpl"]["proposeIntent"]>[0],
) {
  const intentId = crypto.randomUUID()
  const orderId = crypto.randomUUID()
  await custody.xrpl.proposeIntent(params, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
    requestId: intentId,
    payloadId: orderId,
  })
  return waitForIntentTransaction(custody, label, intentId, orderId)
}

/**
 * Waits for an intent to execute and then for the transaction its order
 * produced to land, reporting whichever step failed.
 *
 * An executed intent only means custody accepted the order: the transaction can
 * still fail while custody prepares it, or once the ledger has it.
 */
async function waitForIntentTransaction(
  custody: RippleCustody,
  label: string,
  intentId: string,
  orderId: string,
) {
  const intent = await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId })
  if (!intent.isSuccess)
    throw new Error(`[${label}] intent ${intentId} did not execute (status: ${intent.status}).`)

  const { isSuccess, status, transaction } = await custody.transactions.byOrderAndWait(
    { domainId: DOMAIN_ID, transactionOrderId: orderId },
    TRANSACTION_POLLING,
  )
  if (transaction === undefined)
    throw new Error(`[${label}] no transaction registered for order ${orderId}.`)
  if (!isSuccess) {
    const processing = transaction.processing
    const hint = processing !== undefined && "hint" in processing ? processing.hint : undefined
    throw new Error(
      `[${label}] transaction ${transaction.id} (order ${orderId}) did not complete — status ${status}` +
        `, hint ${hint}, ledger failure ${transaction.ledgerTransactionData?.failure}.`,
    )
  }

  return transaction
}

async function performQuarantineRelease(
  custody: RippleCustody,
  accountId: string,
  transactionId: string,
  bQuarantine: boolean,
) {
  // Filter on the server: `quarantineStatus` is also set to "Released" and
  // "Skipped", both of which a truthy client-side check would wrongly pick up
  // and re-submit for release.
  const { items: qtransfers } = await custody.transactions.transfers(
    { domainId: DOMAIN_ID },
    { transactionId, quarantineStatus: "Quarantined" },
  )
  if (qtransfers.length === 0) {
    if (bQuarantine)
      console.log(
        `[Quarantine Release] Warning: no quarantined transfers found for Transaction ${transactionId}.`,
      )
    else
      console.log(
        `[Quarantine Release] Transaction complete with no quarantined funds as expected for Transaction ${transactionId}.`,
      )
  } else {
    const quarantineIntentId = crypto.randomUUID()
    await custody.intents.propose({
      request: {
        type: "Propose",
        id: quarantineIntentId,
        targetDomainId: DOMAIN_ID,
        author: { id: working_data.userId, domainId: DOMAIN_ID },
        expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        payload: {
          type: "v0_ReleaseQuarantinedTransfers",
          accountId,
          transferIds: qtransfers.map((x) => x.id),
        },
        customProperties: {},
      },
    })
    await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId: quarantineIntentId })
    console.log(`[Quarantine Release] Quarantined funds released for Transaction ${transactionId}.`)
  }
}

//**** XRPL Helper Functions ****/
// checkBatchTransactionDetails

async function checkBatchTransactionDetails(client: Client, batchhash: string) {
  const tx = await client.request({
    command: "tx",
    transaction: batchhash,
  })
  const ledger = tx.result.ledger_index
  // The `tx` response types the inner transactions loosely; this batch is known
  // to hold nothing but confidential sends.
  const rawTransactions = (tx.result.tx_json as Batch).RawTransactions as {
    RawTransaction: ConfidentialMPTSend
  }[]

  // Only need one account as both transactions will be associated to both accounts
  const mmf_sender = rawTransactions.find((t) => t.RawTransaction.MPTokenIssuanceID === MMF_ID)
    ?.RawTransaction.Account
  if (mmf_sender === undefined)
    throw new Error(`No MMF leg found in batch transaction ${batchhash}.`)

  const { result } = await client.request({
    command: "account_tx",
    account: mmf_sender,
    ledger_index: ledger,
  })
  // Inner transactions point back at their batch through ParentBatchID, which
  // xrpl.js does not carry on its metadata type yet.
  const itx = result.transactions.filter(
    (t) => (t.meta as { ParentBatchID?: string } | undefined)?.ParentBatchID === batchhash,
  )

  const hashOf = (issuanceId: string, label: string) => {
    const hash = itx.find((t) => t.tx_json?.MPTokenIssuanceID === issuanceId)?.hash
    if (hash === undefined)
      throw new Error(`No ${label} leg found for batch transaction ${batchhash}.`)
    return hash
  }

  return { batch: batchhash, mmf: hashOf(MMF_ID, "MMF"), rlusd: hashOf(RLUSD_ID, "RLUSD") }
}

//**** Output Helper Functions ****/
// requireEnv
// sectionHeader
// printBalances

/** Fails fast on a missing .env entry rather than passing `undefined` on. */
function requireEnv(name: string) {
  const value = process.env[name]
  if (value === undefined || value === "") throw new Error(`Missing environment variable ${name}.`)
  return value
}

function sectionHeader(title: string) {
  console.log("=========================================================")
  console.log(title)
  console.log("=========================================================")
}

async function printBalances(custody: RippleCustody) {
  const mmf_denom = Math.pow(10, working_data.scaleMMF)
  const rlusd_denom = Math.pow(10, working_data.scaleRLUSD)

  // REDUCING CONCURRENCY TO ENSURE STABILITY - WILL ASSESS FOR LATER ENHANCEMENT
  const [sellerBalances, buyerBalances] = await Promise.all([
    getBalances(custody, WALLET_REPO_SELLER.id),
    getBalances(custody, WALLET_REPO_BUYER.id),
  ])
  // const sellerBalances = await getBalances(custody, WALLET_REPO_SELLER.id);
  // const buyerBalances = await getBalances(custody, WALLET_REPO_BUYER.id);

  if (isNaN(buyerBalances.rlusdConfidentialInbox / rlusd_denom)) console.log("NAN!")

  console.log(`Repo Seller (${WALLET_REPO_SELLER.id} / ${WALLET_REPO_SELLER.address}):`)
  console.log(
    `  MMF Total: ${(sellerBalances.mmfPublic + sellerBalances.mmfConfidentialSpendable + sellerBalances.mmfConfidentialInbox) / mmf_denom}`,
  )
  console.log(`    Public: ${sellerBalances.mmfPublic / mmf_denom}`)
  console.log(`    Confidential Spendable: ${sellerBalances.mmfConfidentialSpendable / mmf_denom}`)
  console.log(`    Confidential Inbox: ${sellerBalances.mmfConfidentialInbox / mmf_denom}`)
  console.log(
    `  RLUSD Total: ${(sellerBalances.rlusdPublic + sellerBalances.rlusdConfidentialSpendable + sellerBalances.rlusdConfidentialInbox) / rlusd_denom}`,
  )
  console.log(`    Public: ${sellerBalances.rlusdPublic / rlusd_denom}`)
  console.log(
    `    Confidential Spendable: ${sellerBalances.rlusdConfidentialSpendable / rlusd_denom}`,
  )
  console.log(`    Confidential Inbox: ${sellerBalances.rlusdConfidentialInbox / rlusd_denom}`)

  console.log(`Repo Buyer (${WALLET_REPO_BUYER.id} / ${WALLET_REPO_BUYER.address}):`)
  console.log(
    `  MMF Total: ${(buyerBalances.mmfPublic + buyerBalances.mmfConfidentialSpendable + buyerBalances.mmfConfidentialInbox) / mmf_denom}`,
  )
  console.log(`    Public: ${buyerBalances.mmfPublic / mmf_denom}`)
  console.log(`    Confidential Spendable: ${buyerBalances.mmfConfidentialSpendable / mmf_denom}`)
  console.log(`    Confidential Inbox: ${buyerBalances.mmfConfidentialInbox / mmf_denom}`)
  console.log(
    `  RLUSD Total: ${(buyerBalances.rlusdPublic + buyerBalances.rlusdConfidentialSpendable + buyerBalances.rlusdConfidentialInbox) / rlusd_denom}`,
  )
  console.log(`    Public: ${buyerBalances.rlusdPublic / rlusd_denom}`)
  console.log(
    `    Confidential Spendable: ${buyerBalances.rlusdConfidentialSpendable / rlusd_denom}`,
  )
  console.log(`    Confidential Inbox: ${buyerBalances.rlusdConfidentialInbox / rlusd_denom}`)

  return { sellerBalances, buyerBalances }
}
