import { RippleCustody } from "../../src/index"

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

  // Generate or use a unique identifier to track this specific payment intent
  // This allows you to retrieve the transaction status later
  const intentId = "dfeddb0d-b243-4ca5-b2ec-bfbd1018938f"

  // Submit the payment transaction to Ripple Custody
  // The payment will be queued as an "intent" and processed asynchronously
  await custody.xrpl.sendPayment(
    {
      destination: {
        address: "r...", // Replace with the recipient's XRP Ledger address
        type: "Address",
      },
      amount: "10", // Amount in drops
      Account: "r...", // Your Ripple Custody account address (the sender)
    },
    {
      // Optional: Provide an intentId to track this transaction
      // If not provided, one will be generated automatically
      intentId,
    },
  )

  // Wait for the intent to be processed and retrieve the final result
  // This will poll the API until the transaction is confirmed or fails
  const intent = await custody.intents.getAndWait({
    domainId: "55e33fa1-e46f-4374-85bc-4eb18ab3b600", // Your Ripple Custody domain identifier
    intentId,
  })

  // Display the complete intent object including transaction status and details
  console.dir(intent, { depth: null })
}

/**
 * Example: Send an MPT payment using Ripple Custody
 *
 * This demonstrates the complete flow for sending an MPT payment:
 * 1. Initialize the custody client with authentication credentials
 * 2. Submit a payment transaction intent
 * 3. Wait for the intent to be processed and retrieve the result
 */
const sendMptPayment = async () => {
  // Initialize the Ripple Custody client with API endpoints and authentication keys
  // The private and public keys should be securely stored in environment variables
  const custody = new RippleCustody({
    apiUrl: "custody-api-url",
    authUrl: "custody-auth-url",
    privateKey: process.env.PRIVATE_KEY ?? "",
    publicKey: process.env.PUBLIC_KEY ?? "",
  })

  // Generate or use a unique identifier to track this specific payment intent
  // This allows you to retrieve the transaction status later
  const intentId = "dfeddb0d-b243-4ca5-b2ec-bfbd1018938f"

  // Submit the payment transaction to Ripple Custody
  // The payment will be queued as an "intent" and processed asynchronously
  await custody.xrpl.sendPayment(
    {
      Account: "r...", // Your Ripple Custody account address (the sender)
      destination: {
        address: "r...", // Replace with the recipient's XRP Ledger address
        type: "Address",
      },
      amount: "20", // Amount of MPT units
      currency: {
        type: "MultiPurposeToken",
        issuanceId: "1234...",
      },
    },
    {
      // Optional: Provide an intentId to track this transaction
      // If not provided, one will be generated automatically
      intentId,
    },
  )

  // Wait for the intent to be processed and retrieve the final result
  // This will poll the API until the transaction is confirmed or fails
  const intent = await custody.intents.getAndWait({
    domainId: "55e33fa1-e46f-4374-85bc-4eb18ab3b600", // Your Ripple Custody domain identifier
    intentId,
  })

  // Display the complete intent object including transaction status and details
  console.dir(intent, { depth: null })
}
