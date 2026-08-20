import type { RippleCustody } from "@florent-uzio/custody"
import type { Client } from "xrpl"
import {
  DOMAIN_ID,
  LEDGER_ID,
  MMF_ID,
  RLUSD_ID,
  TRANSACTION_POLLING,
  working_data,
} from "./config.js"
import type { Wallet } from "./types.js"

//**** RC Helper Functions ****/
// refreshTickers
// getXRPLAddress
// getBalances
// getInbox
// getTicket
// createElGammal
// setupHolder
// fundConfidentialBalance
// confidentialConvert
// mergeInbox

export async function refreshTickers(custody: RippleCustody) {
  // One call per issuance returns both halves — the public ticker and the
  // confidential one if the issuance currently has it. It walks every page of
  // the ledger's tickers, so a ticker sitting past the first page is still
  // found.
  const { public: mmf, confidential: mmfConf } = await custody.tickers.findByXrplMptIssuanceId(
    MMF_ID,
    { ledgerId: LEDGER_ID },
  )
  if (mmf === undefined)
    throw new Error(
      "MMF not found in Ripple Custody (note: this may be due to no wallet holding a >0 balance, that is a prerequisite for this example).",
    )
  working_data.tickerMMF = mmf.id
  working_data.scaleMMF = mmf.decimals ?? 0
  // Absent until the issuer has made the issuance confidential, which the rest
  // of the script treats as "not set up yet" rather than an error.
  if (mmfConf !== undefined) working_data.tickerMMFConf = mmfConf.id

  const { public: rlusd, confidential: rlusdConf } = await custody.tickers.findByXrplMptIssuanceId(
    RLUSD_ID,
    { ledgerId: LEDGER_ID },
  )
  if (rlusd === undefined) throw new Error("RLUSD not found in Ripple Custody.")
  working_data.tickerRLUSD = rlusd.id
  working_data.scaleRLUSD = rlusd.decimals ?? 0

  if (rlusdConf !== undefined) working_data.tickerRLUSDConf = rlusdConf.id
}

export async function getXRPLAddress(custody: RippleCustody, accountId: string) {
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
export async function getBalances(custody: RippleCustody, accountId: string) {
  let ret = {
    mmfPublic: 0,
    mmfConfidentialSpendable: 0,
    mmfConfidentialInbox: 0,
    isMmfConfidential: false,
    rlusdPublic: 0,
    rlusdConfidentialSpendable: 0,
    rlusdConfidentialInbox: 0,
    isRlusdConfidential: false,
  }

  // const [balances, mmfInbox, rlusdInbox] = await Promise.all([
  //   custody.accounts.getAccountBalances({ accountId, domainId: DOMAIN_ID }),
  //   getInbox(custody, accountId, MMF_ID),
  //   getInbox(custody, accountId, RLUSD_ID),
  // ])
  const balances = await custody.accounts.getAccountBalances({ accountId, domainId: DOMAIN_ID })
  const mmfInbox = await getInbox(custody, accountId, MMF_ID)
  const rlusdInbox = await getInbox(custody, accountId, RLUSD_ID)

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
    ret.isMmfConfidential = true
  }

  const rlusd = balanceOf(working_data.tickerRLUSD)
  if (rlusd !== undefined) ret.rlusdPublic = parseInt(rlusd.totalAmount)
  const rlusdConf = balanceOf(working_data.tickerRLUSDConf)
  if (rlusdConf !== undefined) {
    ret.rlusdConfidentialSpendable = parseInt(rlusdConf.totalAmount)
    ret.isRlusdConfidential = true
  }

  if (mmfInbox !== null) {
    ret.isMmfConfidential = true
    ret.mmfConfidentialInbox = mmfInbox
  }

  if (rlusdInbox !== null) {
    ret.isRlusdConfidential = true
    ret.rlusdConfidentialInbox = rlusdInbox
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

export async function getTicket(
  custody: RippleCustody,
  xrplClient: Client,
  accountAddress: string,
  shouldCreate: boolean,
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
    if (!shouldCreate)
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

export async function createElGammal(custody: RippleCustody, wallet: Wallet, accountLabel: string) {
  let publicKey = await custody.xrpl.findElGamalPublicKey(wallet.address, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
  })
  if (publicKey !== undefined && publicKey !== "") {
    console.log(`${accountLabel} has existing ElGamal key registered: ${publicKey}`)
  } else {
    console.log(`Generating ${accountLabel} ElGamal Key.`)
    await custody.xrpl.provisionElGamalKeyPair(wallet.address, { domainId: DOMAIN_ID })
    // The vault writes the key *after* the provisioning intent executes, so
    // read it back with the polling variant rather than a bare get.
    publicKey = await custody.xrpl.getElGamalPublicKeyAndWait(wallet.address, {
      domainId: DOMAIN_ID,
      ledgerId: LEDGER_ID,
    })
    console.log(`${accountLabel} ElGamal Key created: ${publicKey}`)
  }
  return publicKey
}

export async function setupHolder(custody: RippleCustody, wallet: Wallet, accountLabel: string) {
  const bal = await getBalances(custody, wallet.id)
  if (bal.isMmfConfidential) console.log(`${accountLabel} already has confidential MMF balances.`)
  else {
    console.log(`Setting up ${accountLabel} confidential MMF balances.`)
    await createElGammal(custody, wallet, accountLabel)
    await confidentialConvert(custody, wallet, MMF_ID, "MMF", "0")
    console.log(`Setup of ${accountLabel} confidential MMF balances complete.`)
  }
  if (bal.isRlusdConfidential)
    console.log(`${accountLabel} already has confidential RLUSD balances.`)
  else {
    console.log(`Setting up ${accountLabel} confidential RLUSD balances.`)
    await confidentialConvert(custody, wallet, RLUSD_ID, "RLUSD", "0")
    console.log(`Setup of ${accountLabel} confidential RLUSD balances complete.`)
  }
}

export async function fundConfidentialBalance(
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
  tokenLabel: string,
  amount: string,
) {
  const transaction = await proposeAndWait(
    custody,
    `ConfidentialMPTConvert ${amount} ${tokenLabel} (${wallet.name})`,
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
    `MPT confidential convert of ${amount} units of asset ${tokenLabel} held by ${wallet.name} processed (transaction: ${transaction.id}).`,
  )
  // NOTE: Perform quarantine in parallel with merge inbox
  // REDUCING CONCURRENCY TO ENSURE STABILITY - WILL ASSESS FOR LATER ENHANCEMENT
  // await Promise.all([
  //     performQuarantineRelease(custody, wallet.id, transaction.id, amount !== "0"),
  //     mergeInbox(custody, wallet, mptId, tokenLabel)
  // ]);
  await performQuarantineRelease(custody, wallet.id, transaction.id, amount !== "0")
  await mergeInbox(custody, wallet, mptId, tokenLabel)
  console.log(`Quarantine release and inbox merged for Confidential Convert for ${wallet.name}`)
  return
}

export async function mergeInbox(
  custody: RippleCustody,
  wallet: Wallet,
  mptId: string,
  tokenLabel: string,
) {
  // `proposeAndWait` only returns once the transaction is on the ledger.
  await proposeAndWait(custody, `ConfidentialMPTMergeInbox ${tokenLabel} (${wallet.name})`, {
    Account: wallet.address,
    operation: {
      type: "ConfidentialMPTMergeInbox",
      tokenIdentifier: { issuanceId: mptId, type: "MPTokenIssuanceId" },
    },
  })
}

//**** RC Processing Helper Functions ****/
// proposeAndWait
// waitForIntentTransaction
// performQuarantineRelease

/**
 * Proposes an XRPL intent and returns only once the transaction it produced is
 * on the ledger.
 *
 * `proposeIntentAndWait` covers both waits — the intent reaching a terminal
 * status, then the transaction its order produced — and never throws on either
 * failing. This script wants to stop dead instead, so the only thing left here
 * is turning the reported failure into an exception.
 */
export async function proposeAndWait(
  custody: RippleCustody,
  label: string,
  params: Parameters<RippleCustody["xrpl"]["proposeIntentAndWait"]>[0],
) {
  const result = await custody.xrpl.proposeIntentAndWait(params, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
    transaction: TRANSACTION_POLLING,
  })
  // `reason` already names whichever of the two stages fell over, and whether
  // it was custody or the ledger that rejected the transaction.
  if (!result.isSuccess || result.transaction === undefined)
    throw new Error(`[${label}] ${result.reason}`)
  return result.transaction
}

/**
 * Waits for an intent to execute and then for the transaction its order
 * produced to land, reporting whichever step failed.
 *
 * The batch flow cannot use `proposeIntentAndWait` — `proposeBatch` is its own
 * propose step — so the two waits are still driven by hand here. Both report
 * their failure through `reason` rather than an exception.
 */
export async function waitForIntentTransaction(
  custody: RippleCustody,
  label: string,
  intentId: string,
  orderId: string,
) {
  const intent = await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId })
  if (!intent.isSuccess) throw new Error(`[${label}] ${intent.reason}`)

  const { isSuccess, transaction, reason } = await custody.transactions.byOrderAndWait(
    { domainId: DOMAIN_ID, transactionOrderId: orderId },
    TRANSACTION_POLLING,
  )
  if (!isSuccess || transaction === undefined) throw new Error(`[${label}] ${reason}`)

  return transaction
}

async function performQuarantineRelease(
  custody: RippleCustody,
  accountId: string,
  transactionId: string,
  expectQuarantine: boolean,
) {
  // Filter on the server: `quarantineStatus` is also set to "Released" and
  // "Skipped", both of which a truthy client-side check would wrongly pick up
  // and re-submit for release.
  const { items: quarantinedTransfers } = await custody.transactions.transfers(
    { domainId: DOMAIN_ID },
    { transactionId, quarantined: true },
  )
  if (quarantinedTransfers.length === 0) {
    if (expectQuarantine)
      console.log(
        `[Quarantine Release] Warning: no quarantined transfers found for Transaction ${transactionId}.`,
      )
    else
      console.log(
        `[Quarantine Release] Transaction complete with no quarantined funds as expected for Transaction ${transactionId}.`,
      )
  } else {
    // `proposePayload` builds the request envelope — `type: "Propose"`, `id`,
    // `targetDomainId`, `author`, `expiryAt`, `customProperties` — so only the
    // payload is written here, and the author no longer has to be looked up.
    // Waiting is separate because this script treats a release that does not
    // execute as fatal, which `proposeAndWait` would report rather than throw.
    const { requestId, intentId } = await custody.intents.proposePayload(
      {
        type: "v0_ReleaseQuarantinedTransfers",
        accountId,
        transferIds: quarantinedTransfers.map((x) => x.id),
      },
      { domainId: DOMAIN_ID },
    )
    const intent = await custody.intents.getAndWait({ domainId: DOMAIN_ID, intentId: intentId })
    if (!intent.isSuccess) throw new Error(`[Quarantine Release] ${intent.reason}`)
    console.log(`[Quarantine Release] Quarantined funds released for Transaction ${transactionId}.`)
  }
}
