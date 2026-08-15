import { RippleCustody } from "@florent-uzio/custody"

/**
 * Example: Send an XRP payment and follow it all the way to the ledger
 *
 * The manual version of this flow is three steps — `proposeIntent`, then
 * `intents.getAndWait`, then `transactions.byOrderAndWait` — because an intent
 * reporting `Executed` only means custody accepted the transaction order, not
 * that the transaction landed. `proposeIntentAndWait` does all three.
 *
 * It also removes the `users.me()` bootstrap: the domain is resolved from the
 * sender address and handed back on the result.
 */
const sendXrpPaymentAndWait = async () => {
  try {
    const custody = new RippleCustody({
      apiUrl: "https://custody-api-url",
      authUrl: "https://custody-auth-url/token",
      privateKey: process.env.PRIVATE_KEY ?? "",
      publicKey: process.env.PUBLIC_KEY ?? "",
    })

    const result = await custody.xrpl.proposeIntentAndWait(
      {
        Account: "r...", // Your Ripple Custody account address (the sender)
        operation: {
          type: "Payment",
          destination: {
            address: "r...", // Replace with the recipient's XRP Ledger address
            type: "Address",
          },
          amount: "20", // Amount of XRP in drops
          // Do not include the currency field for XRP payments
        },
      },
      {
        // Both stages default to 10 attempts, 3s apart. Give the ledger stage
        // longer when the network is busy
        transaction: { maxRetries: 20 },
      },
    )

    // The ids and the resolved domain, for any follow-up lookup
    const { requestId, payloadId, domainId } = result
    console.log({ requestId, payloadId, domainId })

    if (result.isSuccess) {
      // The transaction completed and the ledger accepted it — safe to build
      // the next transaction on
      console.dir(result.transaction, { depth: null })
      return
    }

    // Nothing throws on failure, so read which of the two stages fell over.
    if (!result.intent.isSuccess) {
      // The intent never executed — rejected by policy, expired, or still open
      // when the attempts ran out. No transaction was ever created
      console.log("Intent did not execute:", result.intent.status)
      console.dir(result.intent.intent.data.state.error, { depth: null })
      return
    }

    if (!result.isTerminal) {
      // Still in flight. Poll `transactions.byOrderAndWait({ domainId,
      // transactionOrderId: payloadId })` again rather than re-proposing
      console.log("Transaction still in flight:", result.status)
      return
    }

    // Terminal, but not a success: custody failed to prepare it, or the ledger
    // rejected it. `hint` only exists on the statuses that can carry one, hence
    // the `in` check
    const processing = result.transaction?.processing
    console.log({
      status: result.status,
      hint: processing && "hint" in processing ? processing.hint : undefined,
      failure: result.transaction?.ledgerTransactionData?.failure,
    })
  } catch (error) {
    console.log(error)
  }
}
