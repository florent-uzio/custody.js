import { RippleCustody } from "../../../src/index"

/**
 * Example: Send an XRP payment using Ripple Custody
 *
 * This demonstrates the complete flow for sending an XRP payment:
 * 1. Initialize the custody client with authentication credentials
 * 2. Submit a payment transaction intent
 * 3. Wait for the intent to be processed and retrieve the result
 */
const sendXrpPayment = async () => {
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
  await custody.xrpl.sendPayment(
    {
      Account: "r...", // Your Ripple Custody account address (the sender)
      destination: {
        address: "r...", // Replace with the recipient's XRP Ledger address
        type: "Address",
      },
      amount: "20", // Amount of XRP in drops
      // Do not include the currency field for XRP payments
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
