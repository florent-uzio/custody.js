import { RippleCustody } from "@florent-uzio/custody"

const authorizeMpt = async () => {
  try {
    // Initialize the Ripple Custody client with API endpoints and authentication keys
    // The private and public keys should be securely stored in environment variables
    const custody = new RippleCustody({
      apiUrl: "https://custody-api-url",
      authUrl: "https://custody-auth-url/token",
      privateKey: process.env.PRIVATE_KEY ?? "",
      publicKey: process.env.PUBLIC_KEY ?? "",
    })

    // Retrieve the domain ID associated with your user
    const me = await custody.users.me()
    const domain = me.domains[0]
    if (!domain) throw new Error("No domain found for this user")
    const domainId = domain.id

    // Generate or use a unique identifier to track this specific payment intent
    // This allows you to retrieve the transaction status later
    const intentId = crypto.randomUUID()

    // Can be used to filter the transactions
    const orderReferenceId = crypto.randomUUID()

    // Submit the MPTokenAuthorize transaction to Ripple Custody
    // The transaction will be queued as an "intent" and processed asynchronously
    await custody.xrpl.proposeIntent(
      {
        Account: "r...", // Your Ripple Custody account address (the sender)
        operation: {
          type: "MPTokenAuthorize",
          tokenIdentifier: {
            type: "MPTokenIssuanceId",
            issuanceId: "...",
          },
          flags: [],
        },
      },
      {
        // Optional: Provide a payloadId to track this transaction
        // If not provided, one will be generated automatically
        requestId: intentId,
        payloadId: orderReferenceId,
      },
    )

    // Wait for the intent to be processed and retrieve the final result
    // This will poll the API until the transaction is confirmed or fails
    const intent = await custody.intents.getAndWait({ domainId, intentId: intentId })

    // Display the complete intent object including transaction status and details
    console.dir(intent, { depth: null })
  } catch (error) {
    console.log(error)
  }
}
