import { RippleCustody } from "@florent-uzio/custody"
import { encodeMPTokenMetadata, validateMPTokenMetadata } from "xrpl"

const createMpt = async () => {
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

    // Encode the MPT metadata as hex per XLS-89 and validate it before submission.
    // validateMPTokenMetadata returns an array of warning messages — empty means valid.
    // It enforces the 1024-byte ceiling and flags XLS-89 formatting issues that would
    // otherwise make the token undiscoverable by explorers and indexers.
    const metadata = encodeMPTokenMetadata({
      ticker: "ABC",
      name: "Token ABC",
      desc: "This is a token ABC",
      icon: "https://link.com",
      asset_class: "rwa",
      asset_subclass: "stablecoin",
      issuer_name: "your name",
    })

    const validationMessages = validateMPTokenMetadata(metadata)
    if (validationMessages.length > 0) {
      throw new Error(`Invalid MPTokenMetadata:\n- ${validationMessages.join("\n- ")}`)
    }

    // Submit the MPTokenIssuanceCreate transaction to Ripple Custody
    // The transaction will be queued as an "intent" and processed asynchronously
    await custody.xrpl.proposeIntent(
      {
        Account: "r...", // Your Ripple Custody account address (the sender)
        operation: {
          type: "MPTokenIssuanceCreate",
          metadata: {
            value: metadata,
            type: "HexEncodedMetadata",
          },
          flags: ["tfMPTCanTransfer", "tfMPTCanLock"],
          assetScale: 2,
          transferFee: 5000,
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
