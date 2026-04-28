import { type Batch, BatchFlags, Client, GlobalFlags, type Payment, xrpToDrops } from "xrpl"
import { batchToCustodyBatchPayload, RippleCustody } from "../../../../src/index"

/**
 * Example: Submit a Batch transaction with multiple inner accounts using Ripple Custody
 *
 * This demonstrates the XLS-56 batch flow for a multi-account Batch transaction:
 *  1. Initialize the custody client and an XRPL client
 *  2. Construct inner transactions from different accounts
 *  3. Build and autofill the Batch transaction via the XRPL client
 *  4. Convert the autofilled Batch to a custody `BatchPayloadInput`
 *  5. Dry-run to obtain the canonical `signingPayload` from Ripple Custody
 *  6. Sign the payload for each inner account managed by this custody instance
 *  7. Submit the Batch with the collected `batchSigners`
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

    // ── 3. Convert the autofilled Batch to a custody payload ─────

    // `batchToCustodyBatchPayload` maps Flags → executionMode, RawTransactions
    // → entries, and (when present) Sequence/LastLedgerSequence to the
    // matching custody fields.
    //
    // Note: this adapter is only a convenience for callers who already use
    // xrpl.js to build and autofill the Batch. If you prefer not to depend on
    // xrpl.js, you can build a `BatchPayloadInput` by hand and pass it
    // directly to `dryRunBatch` / `proposeBatch` — for example:
    //
    //   const batchPayload: BatchPayloadInput = {
    //     Account: ACCOUNT_3,
    //     executionMode: "AllOrNothing",
    //     entries: [
    //       { type: "ParticipantOperation", participant: { ... }, sequencing: { ... }, operation: { ... } },
    //       { type: "ParticipantOperation", participant: { ... }, sequencing: { ... }, operation: { ... } },
    //     ],
    //     // sequencing defaults to { type: "PlatformManaged" } when omitted
    //   }
    const batchPayload = batchToCustodyBatchPayload(autofilledBatch)

    // ── 4. Dry-run to obtain the canonical signing payload ───────

    // Ripple Custody resolves the inner operations and returns the exact
    // bytes each participant must sign in `signingPayload`.
    const { signingPayload } = await custody.xrpl.dryRunBatch(batchPayload)

    // ── 5. Sign the payload for each inner account ───────────────

    // `signBatchPayloadAndWait` returns:
    //   - signature / signingPubKey  (uppercase hex)
    //   - batchSigner                (xrpl.js BatchSigner shape)
    //   - custodyBatchSigner         (Ripple Custody API shape)
    const signer1 = await custody.xrpl.signBatchPayloadAndWait(signingPayload, ACCOUNT_1)
    const signer2 = await custody.xrpl.signBatchPayloadAndWait(signingPayload, ACCOUNT_2)

    console.log("Signer 1 (xrpl.js format):", signer1.batchSigner)
    console.log("Signer 2 (xrpl.js format):", signer2.batchSigner)

    // The custodyBatchSigner fields are already in the Custody API format
    const batchSigners = [signer1.custodyBatchSigner, signer2.custodyBatchSigner]

    // ── 6. Submit the Batch intent with collected signers ────────

    const { requestId } = await custody.xrpl.proposeBatch(batchPayload, batchSigners)

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
