import { batchToCustodyBatchPayload, RippleCustody } from "@florent-uzio/custody"
import { type Batch, BatchFlags, Client, GlobalFlags, type Payment, xrpToDrops } from "xrpl"

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
 *     (blocking `signBatchPayloadAndWait`, or non-blocking `signBatchPayload`
 *     + `getBatchSignature` when an operator approves signatures out-of-band)
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

    // There are two ways to sign for an inner account managed by this custody
    // instance. Both return the same data once a signature exists:
    //   - signature / signingPubKey  (uppercase hex)
    //   - batchSigner                (xrpl.js BatchSigner shape)
    //   - custodyBatchSigner         (Ripple Custody API shape)
    //
    // Which one to use depends on how signatures get approved:
    //
    //   • signBatchPayloadAndWait — proposes the sign intent AND polls until the
    //     manifest signature is available, all in one call. Convenient when
    //     signatures are approved automatically (no human in the loop), so the
    //     wait is short and blocking is acceptable.
    //
    //   • signBatchPayload + getBatchSignature — proposes the sign intent and
    //     returns a serializable handle immediately, WITHOUT waiting. Use this
    //     when an operator approves signatures out-of-band and the wait could be
    //     long (minutes/hours): persist the handle, then call getBatchSignature
    //     later (e.g. from a webhook or a different process) to fetch the
    //     signature once it has been approved.

    // ACCOUNT_1 — blocking: propose and wait for the signature in one call.
    const signer1 = await custody.xrpl.signBatchPayloadAndWait(signingPayload, ACCOUNT_1)

    // ACCOUNT_2 — non-blocking: propose now, retrieve the signature later.
    const handle2 = await custody.xrpl.signBatchPayload(signingPayload, ACCOUNT_2)

    // `handle2` is plain serializable data ({ payloadId, domainId, accountId,
    // signerAddress, signingPubKey, ... }). In a real out-of-band flow you would
    // persist it here and return, then resume once the operator has approved.

    // getBatchSignature does a single fetch by default and returns `undefined`
    // if the signature is not approved yet. Pass maxRetries/intervalMs to opt
    // into light polling. The stored handle can be passed straight in.
    const signer2 = await custody.xrpl.getBatchSignature(handle2, {
      maxRetries: 5,
      intervalMs: 3000,
    })

    if (!signer2) {
      console.log("ACCOUNT_2 signature not approved yet — retry getBatchSignature later")
      await xrplClient.disconnect()
      return
    }

    console.log("Signer 1 (xrpl.js format):", signer1.batchSigner)
    console.log("Signer 2 (xrpl.js format):", signer2.batchSigner)

    // The custodyBatchSigner fields are already in the Custody API format
    const batchSigners = [signer1.custodyBatchSigner, signer2.custodyBatchSigner]

    // ── 6. Submit the Batch intent with collected signers ────────

    // Generate or use a unique identifier to track this specific payment intent
    // This allows you to retrieve the transaction status later
    const intentId = crypto.randomUUID()
    console.log({ intentId })

    const { requestId } = await custody.xrpl.proposeBatch(batchPayload, batchSigners, {
      requestId: intentId,
    })

    console.log("Batch intent proposed, requestId:", requestId)

    // Retrieve the domain ID to poll for the intent result
    const me = await custody.users.me()
    const domain = me.domains[0]
    if (!domain) throw new Error("No domain found for this user")
    const domainId = domain.id

    // Wait for the intent to be processed and retrieve the final result
    const intent = await custody.intents.getAndWait({ domainId, intentId })

    console.dir(intent, { depth: null })

    await xrplClient.disconnect()
  } catch (error) {
    console.log(error)
  }
}

submitMultiAccountBatch()
