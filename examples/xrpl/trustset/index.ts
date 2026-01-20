import { RippleCustody } from "../../../src/index"

/**
 * Example: Send a TrustSet using Ripple Custody
 *
 * This demonstrates the complete flow for sending a TrustSet:
 * 1. Initialize the custody client with authentication credentials
 * 2. Submit a trustset transaction intent
 * 3. Wait for the intent to be processed and retrieve the result
 */
const createTrustline = async () => {
  // Initialize the Ripple Custody client with API endpoints and authentication keys
  // The private and public keys should be securely stored in environment variables
  const custody = new RippleCustody({
    apiUrl: "custody-api-url",
    authUrl: "custody-auth-url",
    privateKey: process.env.PRIVATE_KEY ?? "",
    publicKey: process.env.PUBLIC_KEY ?? "",
  })

  // Retrieve the domain ID associated with your user
  const me = await custody.users.me()
  const domainId = me.domains[0].id

  // Generate or use a unique identifier to track this specific payment intent
  // This allows you to retrieve the transaction status later
  const intentId = "e004adfe-667c-415e-be33-ce3d9684e76b"

  // Submit the payment transaction to Ripple Custody
  // The payment will be queued as an "intent" and processed asynchronously
  await custody.xrpl.createTrustline(
    {
      Account: "r...", // Your Ripple Custody account address (the sender)
      limitAmount: {
        currency: {
          code: "ABC",
          type: "Currency",
          issuer: "r...",
        },
        value: "10000",
      },
      flags: [],
    },
    {
      // Optional: Provide an intentId to track this transaction
      // If not provided, one will be generated automatically
      intentId,
    },
  )

  // Wait for the intent to be processed and retrieve the final result
  // This will poll the API until the transaction is confirmed or fails
  const intent = await custody.intents.getAndWait({ domainId, intentId })

  // Display the complete intent object including transaction status and details
  console.dir(intent, { depth: null })
}
