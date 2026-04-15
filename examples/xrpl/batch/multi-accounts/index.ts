import { type Batch, BatchFlags, Client, GlobalFlags, type Payment, xrpToDrops } from "xrpl"
import { rawTransactionsToInnerTransactions, RippleCustody } from "../../../../src/index"

/**
 * Example: Submit a Batch transaction with multiple inner accounts using Ripple Custody
 *
 * This demonstrates the complete flow for a multi-account Batch transaction:
 * 1. Initialize the custody client and an XRPL client
 * 2. Construct inner transactions from different accounts
 * 3. Build and autofill the Batch transaction via the XRPL client
 * 4. Collect raw signatures from each inner account via Ripple Custody
 * 5. Convert inner transactions and batch signers to the Custody API format
 * 6. Propose the Batch intent to Ripple Custody for submission
 *
 * In this example, ACCOUNT_1 and ACCOUNT_2 are the inner signers (they each
 * have a transaction inside the batch), while ACCOUNT_3 is the batch submitter.
 */
const submitMultiAccountBatch = async () => {
  try {
    // Initialize the Ripple Custody client
    const custody = new RippleCustody({
      apiUrl: "https://custody-api-url",
      authUrl: "https://custody-auth-url/token",
      privateKey: process.env.PRIVATE_KEY ?? "",
      publicKey: process.env.PUBLIC_KEY ?? "",
    })

    // Accounts involved in this batch
    const ACCOUNT_1 = "r..." // Inner signer 1
    const ACCOUNT_2 = "r..." // Inner signer 2
    const ACCOUNT_3 = "r..." // Batch submitter

    // Connect to the XRPL to autofill transaction fields (Sequence, Fee, etc.)
    const xrplClient = new Client("wss://xrpl-node-url")
    await xrplClient.connect()

    // ── 1. Construct inner transactions ──────────────────────────

    // Each inner transaction must include the tfInnerBatchTxn flag
    const payment1: Payment = {
      Account: ACCOUNT_1,
      TransactionType: "Payment",
      Destination: ACCOUNT_2,
      Amount: xrpToDrops(0.016),
      Flags: GlobalFlags.tfInnerBatchTxn,
    }

    const payment2: Payment = {
      Account: ACCOUNT_2,
      TransactionType: "Payment",
      Destination: ACCOUNT_1,
      Amount: xrpToDrops(0.025),
      Flags: GlobalFlags.tfInnerBatchTxn,
    }

    // ── 2. Build and autofill the Batch transaction ──────────────

    const batch: Batch = {
      Account: ACCOUNT_3,
      TransactionType: "Batch",
      Flags: BatchFlags.tfAllOrNothing,
      RawTransactions: [{ RawTransaction: payment1 }, { RawTransaction: payment2 }],
    }

    // The second argument (signerCount) tells autofill how many signers to
    // account for when computing the fee
    const autofilledBatch = await xrplClient.autofill(batch, 2)

    // ── 3. Collect raw signatures from each inner account ────────

    // rawSignInnerBatchAndWait returns:
    //   - signature / signingPubKey  (raw hex values)
    //   - batchSigner                (xrpl.js BatchSigner format)
    //   - custodyBatchSigner         (Ripple Custody API format)
    const signer1 = await custody.xrpl.rawSignInnerBatchAndWait(autofilledBatch, ACCOUNT_1)
    const signer2 = await custody.xrpl.rawSignInnerBatchAndWait(autofilledBatch, ACCOUNT_2)

    console.log("Signer 2 (xrpl.js format):", signer1.batchSigner)
    console.log("Signer 3 (xrpl.js format):", signer2.batchSigner)

    // ── 4. Convert to Ripple Custody API format ──────────────────

    // Convert inner transactions from xrpl.js RawTransactions to the
    // Custody API innerTransactions format
    const innerTransactions = rawTransactionsToInnerTransactions(autofilledBatch.RawTransactions)

    // The custodyBatchSigner fields are already in the Custody API format,
    // so we can use them directly
    const batchSigners = [signer1.custodyBatchSigner, signer2.custodyBatchSigner]

    // ── 5. Propose the Batch intent to Ripple Custody ────────────

    const { requestId } = await custody.xrpl.proposeIntent({
      Account: ACCOUNT_3,
      operation: {
        type: "Batch",
        innerTransactions,
        batchSigners,
        executionMode: "AllOrNothing",
      },
    })

    console.log("Batch intent proposed, requestId:", requestId)

    // Retrieve the domain ID to poll for the intent result
    const me = await custody.users.me()
    const domainId = me.domains[0].id

    // Wait for the intent to be processed and retrieve the final result
    const intent = await custody.intents.getAndWait({ domainId, intentId: requestId })

    console.dir(intent, { depth: null })

    await xrplClient.disconnect()
  } catch (error) {
    console.log(error)
  }
}

submitMultiAccountBatch()
