import { batchToCustodyBatchPayload, type RippleCustody } from "@florent-uzio/custody"
import {
  BatchFlags,
  decode,
  encode,
  hashes,
  type Batch,
  type Client,
  type ConfidentialMPTSend,
} from "xrpl"
import { DOMAIN_ID, LEDGER_ID, MMF_ID, RLUSD_ID, WALLET_SUBMITTER, working_data } from "./config.js"
import { getTicket, mergeInbox, waitForIntentTransaction } from "./custody-helpers.js"
import type { Wallet } from "./types.js"

//**** Atomic (DvP) Settlement ****/
// atomicSettlement
// checkBatchTransactionDetails

export async function atomicSettlement(
  custody: RippleCustody,
  xrplClient: Client,
  mmfSender: Wallet,
  rlusdSender: Wallet,
  mmfUnits: number,
  rlusdUnits: number,
) {
  console.log(
    `Atomic Settlement: ${mmfSender.name} sending ${mmfUnits} MMF units, ${rlusdSender.name} sending ${rlusdUnits} RLUSD.`,
  )
  console.log("Constructing inner transactions for batch.")
  const mmfUnscaledAmount = mmfUnits * Math.pow(10, working_data.scaleMMF)
  const rlusdUnscaledAmount = rlusdUnits * Math.pow(10, working_data.scaleRLUSD)
  // REDUCING CONCURRENCY TO ENSURE STABILITY - WILL ASSESS FOR LATER ENHANCEMENT
  // const [innerTrxn1, innerTrxn2] = await Promise.all([
  //     getTicket(custody, xrplClient, mmfSender.address, true)
  //     .then(function(ticketSequence) {return custody.xrpl.buildConfidentialSend({sender: mmfSender.address, destination: rlusdSender.address, issuanceId: MMF_ID, amount: mmfUnscaledAmount.toString(), ticketSequence}, {domainId: DOMAIN_ID, ledgerId: LEDGER_ID})}),
  //     getTicket(custody, xrplClient, rlusdSender.address, true)
  //     .then(function(ticketSequence) {return custody.xrpl.buildConfidentialSend({sender: rlusdSender.address, destination: mmfSender.address, issuanceId: RLUSD_ID, amount: rlusdUnscaledAmount.toString(), ticketSequence}, {domainId: DOMAIN_ID, ledgerId: LEDGER_ID})}),
  // ]);
  const mmfTicket = await getTicket(custody, xrplClient, mmfSender.address, true)
  const mmfLeg = await custody.xrpl.buildConfidentialSend(
    {
      sender: mmfSender.address,
      destination: rlusdSender.address,
      issuanceId: MMF_ID,
      amount: mmfUnscaledAmount.toString(),
      ticketSequence: mmfTicket,
    },
    {
      domainId: DOMAIN_ID,
      ledgerId: LEDGER_ID,
      polling: {
        maxRetries: 20, // optional, default: 10
        intervalMs: 5000, // optional, default: 3000ms
      },
    },
  )
  const rlusdTicket = await getTicket(custody, xrplClient, rlusdSender.address, true)
  const rlusdLeg = await custody.xrpl.buildConfidentialSend(
    {
      sender: rlusdSender.address,
      destination: mmfSender.address,
      issuanceId: RLUSD_ID,
      amount: rlusdUnscaledAmount.toString(),
      ticketSequence: rlusdTicket,
    },
    {
      domainId: DOMAIN_ID,
      ledgerId: LEDGER_ID,
      polling: { maxRetries: 20, intervalMs: 5000 },
    },
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
      [mmfSender.address]: mmfLeg.entryFields,
      [rlusdSender.address]: rlusdLeg.entryFields,
    },
  })

  // Dry-run to obtain the canonical signing payload
  const { signingPayload } = await custody.xrpl.dryRunBatch(batchPayload, {
    domainId: DOMAIN_ID,
    ledgerId: LEDGER_ID,
  })

  console.log("Retrieving participant signatures for batch.")
  const [signer1, signer2] = await Promise.all([
    custody.xrpl.signBatchPayloadAndWait(signingPayload, mmfSender.address, {
      domainId: DOMAIN_ID,
    }),
    custody.xrpl.signBatchPayloadAndWait(signingPayload, rlusdSender.address, {
      domainId: DOMAIN_ID,
    }),
  ])

  // The custodyBatchSigner fields are already in the Custody API format
  const batchSigners = [signer1.custodyBatchSigner, signer2.custodyBatchSigner]

  console.log("Submitting batch transaction.")
  // `proposeBatch` returns the payload id it generated, which is the
  // transaction order id — no need to mint UUIDs up front just to learn what
  // the SDK was about to generate.
  const { requestId, payloadId, intentId } = await custody.xrpl.proposeBatch(
    batchPayload,
    batchSigners,
    {
      domainId: DOMAIN_ID,
      ledgerId: LEDGER_ID,
    },
  )
  console.log(`Batch submitted (IntentId: ${intentId}, OrderId: ${payloadId}).`)
  const transaction = await waitForIntentTransaction(
    custody,
    "batch settlement",
    intentId,
    payloadId,
  )

  const { ledgerTransactionData } = transaction
  if (ledgerTransactionData?.rawTransaction === undefined)
    throw new Error(
      `XRPL raw transaction not found for completed batch transaction order ${payloadId}.`,
    )
  try {
    const batchHashes = checkBatchTransactionDetails(
      ledgerTransactionData.rawTransaction,
      ledgerTransactionData.ledgerTransactionId,
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
  //     mergeInbox(custody, mmfSender, RLUSD_ID, "RLUSD"),
  //     mergeInbox(custody, rlusdSender, MMF_ID, "MMF")
  // ]);
  await mergeInbox(custody, mmfSender, RLUSD_ID, "RLUSD")
  await mergeInbox(custody, rlusdSender, MMF_ID, "MMF")
  // Add a wait to ensure balances are updated within Ripple Custody
  await new Promise((resolve) => setTimeout(resolve, 10000))
  console.log("Inboxes Successfully Merged.")
}

/**
 * Derives the two inner transaction ids from the batch blob Custody reports for
 * the settled transaction.
 *
 * An inner batch transaction is never signed on its own — it carries
 * `tfInnerBatchTxn`, an empty `SigningPubKey` and no `TxnSignature` — but its id
 * is still the ordinary transaction id, `SHA512Half(0x54584E00 || bytes)`. That
 * is exactly what `hashes.hashSignedTx` computes, so the ids can be worked out
 * from the blob alone with no round trip to the ledger.
 *
 * Note it is `hashSignedTx` and not the similarly named `hashTx`: the latter
 * prefixes with `TRANSACTION_SIGN` (`0x53545800`) and yields the signing hash,
 * not the transaction id.
 */
function checkBatchTransactionDetails(rawTransaction: string, batchHash: string) {
  // `decode` types the inner transactions loosely; this batch is known to hold
  // nothing but confidential sends.
  const { RawTransactions } = decode(rawTransaction) as unknown as Batch
  const legs = RawTransactions as { RawTransaction: ConfidentialMPTSend }[]

  const hashOf = (issuanceId: string, label: string) => {
    const leg = legs.find((t) => t.RawTransaction.MPTokenIssuanceID === issuanceId)
    if (leg === undefined)
      throw new Error(`No ${label} leg found in batch transaction ${batchHash}.`)
    return hashes.hashSignedTx(encode(leg.RawTransaction))
  }

  return { batch: batchHash, mmf: hashOf(MMF_ID, "MMF"), rlusd: hashOf(RLUSD_ID, "RLUSD") }
}
