import {
  batchToCustodyBatchPayload,
  type Core_ApiParametersComputeCryptographicFields,
  type RippleCustody,
} from "@florent-uzio/custody"
import { BatchFlags, GlobalFlags, type Batch, type Client, type ConfidentialMPTSend } from "xrpl"
import { DOMAIN_ID, LEDGER_ID, MMF_ID, RLUSD_ID, WALLET_SUBMITTER, working_data } from "./config.js"
import { getTicket, mergeInbox, waitForIntentTransaction } from "./custody-helpers.js"
import type { ConfidentialSendLeg, Wallet } from "./types.js"

//**** Atomic (DvP) Settlement ****/
// constructConfidentialTransfer
// atomicSettlement
// checkBatchTransactionDetails

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

/** Narrows a parameters-compute response to its `Send` variant. */
function isSendFields(
  fields: Core_ApiParametersComputeCryptographicFields,
): fields is Extract<
  Core_ApiParametersComputeCryptographicFields,
  { senderEncryptedAmount: string }
> {
  return "senderEncryptedAmount" in fields
}

export async function atomicSettlement(
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

  // Convert the autofilled Batch to a custody payload. `confidentialSends`
  // carries the three fields no xrpl.js Batch can hold (see
  // `ConfidentialSendLeg`), keyed by the sending account's address.
  const batchPayload = batchToCustodyBatchPayload(autofilledBatch, {
    confidentialSends: {
      [mmf_sender.address]: mmfLeg.custodyOnly,
      [rlusd_sender.address]: rlusdLeg.custodyOnly,
    },
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

  console.log("Submitting batch transaction.")
  // `proposeBatch` returns the payload id it generated, which is the
  // transaction order id — no need to mint UUIDs up front just to learn what
  // the SDK was about to generate.
  const { requestId, payloadId } = await custody.xrpl.proposeBatch(batchPayload, batchSigners, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
  })
  console.log(`Batch submitted (IntentId: ${requestId}, OrderId: ${payloadId}).`)
  const transaction = await waitForIntentTransaction(
    custody,
    "batch settlement",
    requestId,
    payloadId,
  )

  if (transaction.ledgerTransactionData === undefined)
    throw new Error(
      `XRPL Transaction Hash not found for completed batch transaction order ${payloadId}.`,
    )
  try {
    const batchHashes = await checkBatchTransactionDetails(
      xrplClient,
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
