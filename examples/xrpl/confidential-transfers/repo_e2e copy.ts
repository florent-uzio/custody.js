import { RippleCustody, batchToCustodyBatchPayload } from "@florent-uzio/custody"
import "dotenv/config"
import crypto from "node:crypto"
import { BatchFlags, Client, GlobalFlags, type Batch } from "xrpl"

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
  working_data.userId = me.domains[0].userReference.id
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
    // POTENTIAL IMPROVEMENTS: (1) Check if the token has already been setup for confidential transfers
    //    (2) Check the outcome of the transaction from the intent
    console.log("Setting confidential flag and issuer encryption key for MMF.")
    const intentId = crypto.randomUUID()
    await custody.xrpl.proposeIntent(
      {
        Account: WALLET_MMF_ISSUER.address,
        operation: {
          type: "MPTokenIssuanceSet",
          tokenIdentifier: { issuanceId: MMF_ID, type: "MPTokenIssuanceId" },
          flags: [],
          mutableFlags: ["MPTSetCanConfidentialAmount"],
          issuerEncryptionKey: publicKey, // base64 ElGamal public key from step 1
        },
      },
      { domainId: DOMAIN_ID, ledgerId: LEDGER_ID, requestId: intentId },
    )
    await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId })
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
    new Promise(async function (resolve, reject) {
      // will do these sequencially to avoid sequence number clashes
      try {
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
        const bChange = bChange1 || bChange2
        resolve(bChange)
      } catch (error) {
        reject(error)
      }
    }),
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
      apiUrl: process.env.API_URL,
      authUrl: process.env.AUTH_URL,
      privateKey: process.env.PRIVATE_KEY,
      publicKey: process.env.PUBLIC_KEY,
      debug: process.env.DEBUG === "true",
    })

    client = new Client(process.env.XRPL_WSS_URL)
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
  const tickers = await custody.tickers.list()

  const mmfArr = tickers.items.filter(
    (x) =>
      x.ledgerId === LEDGER_ID &&
      x.ledgerDetails.type === "XRPL" &&
      x.ledgerDetails.properties.type === "MultiPurposeToken" &&
      x.ledgerDetails.properties.issuanceId === MMF_ID,
  )
  if (mmfArr.length === 0) throw new Error("MMF not found in Ripple Custody.")
  else {
    working_data.tickerMMF = mmfArr[0].id
    working_data.scaleMMF = mmfArr[0].data.decimals === undefined ? 0 : mmfArr[0].data.decimals
  }

  const mmfArrConf = tickers.items.filter(
    (x) =>
      x.ledgerId === LEDGER_ID &&
      x.ledgerDetails.type === "XRPL" &&
      x.ledgerDetails.properties.type === "ConfidentialMultiPurposeToken" &&
      x.ledgerDetails.properties.issuanceId === MMF_ID,
  )
  if (mmfArrConf.length > 0) working_data.tickerMMFConf = mmfArrConf[0].id

  const rlusdArr = tickers.items.filter(
    (x) =>
      x.ledgerId === LEDGER_ID &&
      x.ledgerDetails.type === "XRPL" &&
      x.ledgerDetails.properties.type === "MultiPurposeToken" &&
      x.ledgerDetails.properties.issuanceId === RLUSD_ID,
  )
  if (rlusdArr.length === 0) throw new Error("RLUSD not found in Ripple Custody.")
  else {
    working_data.tickerRLUSD = rlusdArr[0].id
    working_data.scaleRLUSD =
      rlusdArr[0].data.decimals === undefined ? 0 : rlusdArr[0].data.decimals
  }

  const rlusdArrConf = tickers.items.filter(
    (x) =>
      x.ledgerId === LEDGER_ID &&
      x.ledgerDetails.type === "XRPL" &&
      x.ledgerDetails.properties.type === "ConfidentialMultiPurposeToken" &&
      x.ledgerDetails.properties.issuanceId === RLUSD_ID,
  )
  if (rlusdArrConf.length > 0) working_data.tickerRLUSDConf = rlusdArrConf[0].id
}

async function getXRPLAddress(custody: RippleCustody, accountId: string) {
  const addresses = await custody.accounts.addresses({ domainId: DOMAIN_ID, accountId: accountId })
  const xrpl_address = addresses.items.filter(
    (x) => x.ledgerId === LEDGER_ID && x.scope === "External",
  )
  if (xrpl_address.length === 0)
    throw new Error("Could not find XRPL address for account " + accountId)
  else return xrpl_address[0].address
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

  const mmfArr = balances.items.filter((x) => x.tickerId === working_data.tickerMMF)
  if (mmfArr.length > 0) ret.mmfPublic = parseInt(mmfArr[0].totalAmount)
  const mmfConfArr = balances.items.filter((x) => x.tickerId === working_data.tickerMMFConf)
  if (mmfConfArr.length > 0) {
    ret.mmfConfidentialSpendable = parseInt(mmfConfArr[0].totalAmount)
    ret.bMMFConfidential = true
  }

  const rlusdArr = balances.items.filter((x) => x.tickerId === working_data.tickerRLUSD)
  if (rlusdArr.length > 0) ret.rlusdPublic = parseInt(rlusdArr[0].totalAmount)
  const rlusdConfArr = balances.items.filter((x) => x.tickerId === working_data.tickerRLUSDConf)
  if (rlusdConfArr.length > 0) {
    ret.rlusdConfidentialSpendable = parseInt(rlusdConfArr[0].totalAmount)
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
) {
  // Note: creates 10 tickets if none exist
  // Does not handle concurrency... just returns the first ticket, if two processes request one it will likely be the same
  const tickets = await xrplClient.request({
    command: "account_objects",
    account: accountAddress,
    type: "ticket",
  })
  if (tickets.result.account_objects.length > 0) {
    return tickets.result.account_objects[0].TicketSequence
  } else {
    if (!bCreate)
      throw new Error(`[Get Ticket] No tickets found for account address ${accountAddress}`)
    console.log(`Creating tickets for account address ${accountAddress}.`)
    const intentId = crypto.randomUUID()
    await custody.xrpl.proposeIntent(
      {
        Account: accountAddress,
        operation: {
          type: "TicketCreate",
          ticketCount: 10,
        },
      },
      { domainId: DOMAIN_ID, ledgerId: LEDGER_ID, requestId: intentId },
    )
    const intent = await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId })

    // Ensure transaction is processed
    const accountId = intent.intent.data.details.payload.accountId
    const orderId = intent.intent.data.details.payload.id
    await waitForTransaction(custody, accountId, orderId, 12, 5000)
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
    publicKey = await custody.xrpl.getElGamalPublicKey(wallet.address, {
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
  const intentId = crypto.randomUUID()
  await custody.xrpl.proposeIntent(
    {
      Account: wallet.address,
      operation: {
        type: "ConfidentialMPTConvert",
        tokenIdentifier: { issuanceId: mptId, type: "MPTokenIssuanceId" },
        amount,
      },
    },
    { domainId: DOMAIN_ID, ledgerId: LEDGER_ID, requestId: intentId },
  )
  const intent = await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId })

  // we now need to ensure we release funds from quarantine
  const accountId = intent.intent.data.details.payload.accountId
  const orderId = intent.intent.data.details.payload.id
  console.log(
    `MPT confidential convert of ${amount} units of asset ${txtMPT} held by ${wallet.name} processed (intent: ${intentId}, orderId: ${orderId}).`,
  )
  // NOTE: Perform quarantine in parallel with merge inbox
  const transaction = await waitForTransaction(custody, accountId, orderId, 12, 5000)
  const transactionId = transaction.id
  // REDUCING CONCURRENCY TO ENSURE STABILITY - WILL ASSESS FOR LATER ENHANCEMENT
  // await Promise.all([
  //     performQuarantineRelease(custody, accountId, transactionId, amount !== "0"),
  //     mergeInbox(custody, wallet, mptId, txtMPT)
  // ]);
  await performQuarantineRelease(custody, accountId, transactionId, amount !== "0")
  await mergeInbox(custody, wallet, mptId, txtMPT)
  console.log(`Quarantine release and inbox merged for Confidential Convert for ${wallet.name}`)
  return
}

async function mergeInbox(custody: RippleCustody, wallet: Wallet, mptId: string, txtMPT: string) {
  const intentId = crypto.randomUUID()
  await custody.xrpl.proposeIntent(
    {
      Account: wallet.address,
      operation: {
        type: "ConfidentialMPTMergeInbox",
        tokenIdentifier: { issuanceId: mptId, type: "MPTokenIssuanceId" },
      },
    },
    { domainId: DOMAIN_ID, ledgerId: LEDGER_ID, requestId: intentId },
  )
  const intent = await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId })

  // Ensure the transaction has been processed before returning
  const accountId = intent.intent.data.details.payload.accountId
  const orderId = intent.intent.data.details.payload.id
  await waitForTransaction(custody, accountId, orderId, 12, 5000)
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
  if (res.compute.cryptographicFields === undefined)
    throw new Error("Unknown contents for cryptographic fields in compute response: " + res)
  const fields = res.compute.cryptographicFields

  return {
    Account: sender.address,
    TransactionType: "ConfidentialMPTSend",
    Destination: destination.address,
    MPTokenIssuanceID: issuanceId,
    SenderEncryptedBalanceVersion: fields.senderEncryptedBalanceVersion,
    SenderEncryptedBalance: fields.senderEncryptedBalance,
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
  const innerTrxn1 = await getTicket(custody, xrplClient, mmf_sender.address, true).then(
    function (ticketseqeunce) {
      return constructConfidentialTransfer(
        custody,
        mmf_sender,
        rlusd_sender,
        MMF_ID,
        mmfUnscaledAmount.toString(),
        ticketseqeunce,
      )
    },
  )
  const innerTrxn2 = await getTicket(custody, xrplClient, rlusd_sender.address, true).then(
    function (ticketseqeunce) {
      return constructConfidentialTransfer(
        custody,
        rlusd_sender,
        mmf_sender,
        RLUSD_ID,
        rlusdUnscaledAmount.toString(),
        ticketseqeunce,
      )
    },
  )

  console.log("Constructing batch transaction.")
  const batch: Batch = {
    Account: WALLET_SUBMITTER.address,
    TransactionType: "Batch",
    Flags: BatchFlags.tfAllOrNothing,
    RawTransactions: [{ RawTransaction: innerTrxn1 }, { RawTransaction: innerTrxn2 }],
  }
  // Second argument tells xrpl client how many signers to account for in calculation of the fee
  const autofilledBatch = await xrplClient.autofill(batch, 2)

  // Convert the autofilled Batch to a custody payload
  const batchPayload = batchToCustodyBatchPayload(autofilledBatch)
  batchPayload.entries.forEach(function (e) {
    if (e.participant.address === mmf_sender.address) {
      e.operation.amount = mmfUnscaledAmount.toString()
      e.operation.senderEncryptedBalance = innerTrxn1.SenderEncryptedBalance
      e.operation.senderEncryptedBalanceVersion = innerTrxn1.SenderEncryptedBalanceVersion
    } else if (e.participant.address === rlusd_sender.address) {
      e.operation.amount = rlusdUnscaledAmount.toString()
      e.operation.senderEncryptedBalance = innerTrxn2.SenderEncryptedBalance
      e.operation.senderEncryptedBalanceVersion = innerTrxn2.SenderEncryptedBalanceVersion
    } else throw new Error(`Unknown participant ${e.participant.address} in batch payload.`)
  })

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

  const intentId = crypto.randomUUID()
  console.log(`Submitting batch transaction (IntentId: ${intentId}).`)
  await custody.xrpl.proposeBatch(batchPayload, batchSigners, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
    requestId: intentId,
  })
  const intent_batch = await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId })

  // Ensure the transaction has been processed before returning
  const accountId = intent_batch.intent.data.details.payload.accountId
  const orderId = intent_batch.intent.data.details.payload.id
  const transaction = await waitForTransaction(custody, accountId, orderId, 12, 5000)
  if (transaction.ledgerTransactionData == undefined)
    throw new Error(
      `XRPL Transaction Hash not found for completed batch transaction order ${orderId}.`,
    )
  try {
    const batchHashes = await checkBatchTransactionDetails(
      client,
      transaction.ledgerTransactionData?.ledgerTransactionId,
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
// waitForTransaction
// performQuarantineRelease

async function waitForTransaction(
  custody: RippleCustody,
  accountId: string,
  orderId: string,
  numRetries: number,
  waitMS: number,
) {
  const { items } = await custody.transactions.transactions(
    { domainId: DOMAIN_ID },
    { "orderReference.Id": orderId, accountId: accountId, limit: 1 },
  )
  // There should always be a transaction record
  if (items.length === 0) {
    if (numRetries === 0)
      throw new Error(`Critical Error: Transaction for Order ${orderId} not found.`)
    else {
      await new Promise((resolve) => setTimeout(resolve, waitMS))
      return waitForTransaction(custody, accountId, orderId, numRetries - 1, waitMS * 1.5)
    }
  } else if (items[0].processing?.status === "Failed")
    throw new Error(
      `Critical Failure: Transaction ${items[0]?.id} (Order ${orderId}) failed - hint ${items[0].processing.hint}.`,
    )
  else if (items[0].processing?.status === "Completed") return items[0]
  else if (numRetries > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMS))
    return waitForTransaction(custody, accountId, orderId, numRetries - 1, waitMS * 1.5)
  } else
    throw new Error(
      `Transaction ${items[0].id} (Order ${orderId}) in status ${items[0].processing?.status} - maximum retries reached so giving up.`,
    )
}

async function performQuarantineRelease(
  custody: RippleCustody,
  accountId: string,
  transactionId: string,
  bQuarantine: boolean,
) {
  const transfers = await custody.transactions.transfers({ domainId: DOMAIN_ID }, { transactionId })
  const qtransfers = transfers.items.filter((x) => x.quarantineStatus)
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
  // Only need one account as both transactions will be associated to both accounts
  const mmf_sender = tx.result.tx_json.RawTransactions.filter(
    (t) => t.RawTransaction.MPTokenIssuanceID == MMF_ID,
  )[0].RawTransaction.Account
  //const rlusd_sender = tx.result.tx_json.RawTransactions.filter((t) => (t.RawTransaction.MPTokenIssuanceID == RLUSD_ID))[0].RawTransaction.Account
  const itx = (
    await client.request({ command: "account_tx", account: mmf_sender, ledger_index: ledger })
  ).result.transactions.filter((t) => (t.meta.ParentBatchID = batchhash))
  const mmfHash = itx.filter((t) => t.tx_json.MPTokenIssuanceID == MMF_ID)[0].hash
  const rlusdHash = itx.filter((t) => t.tx_json.MPTokenIssuanceID == RLUSD_ID)[0].hash
  return { batch: batchhash, mmf: mmfHash, rlusd: rlusdHash }
}

//**** Output Helper Functions ****/
// sectionHeader
// printBalances

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
