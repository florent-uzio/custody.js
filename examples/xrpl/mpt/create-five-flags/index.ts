import { type BeforeSignHook, RippleCustody } from "@florent-uzio/custody"
import { encodeMPTokenMetadata, validateMPTokenMetadata } from "xrpl"

/**
 * Order the Custody API re-emits `MPTokenIssuanceCreate.flags` in.
 *
 * Workaround for a backend defect (see
 * https://github.com/florent-uzio/custody.js/issues/223): the API deserializes
 * `flags` into an unordered set and re-serializes that set when verifying the
 * request-body signature, while the SDK signs the canonical JSON of what it
 * actually sent. Up to 4 flags the set keeps insertion order, so any order
 * works; at 5+ it is hash-ordered and re-emitted in this one fixed order, so
 * anything else fails with `401 InvalidSignatureError`.
 *
 * This is a server-side artifact, not part of the API contract — treat it as
 * temporary and drop this file's hook once the backend verifies signatures over
 * the bytes it received.
 */
const FLAG_WIRE_ORDER = [
  "tfMPTCanTransfer",
  "tfMPTCanLock",
  "tfMPTRequireAuth",
  "tfMPTCanTrade",
  "tfMPTCanClawback",
  "tfMPTCanEscrow",
]

/**
 * Sorts `MPTokenIssuanceCreate.flags` into the order the backend re-emits, so
 * the bytes the SDK signs match the bytes the backend verifies. XRPL flags
 * collapse to a bitmask, so reordering them is semantically lossless.
 *
 * The hook runs on signed POST bodies only, just before canonicalization, and
 * whatever it returns is both signed and sent — so the signed bytes stay the
 * bytes on the wire. Every other request passes through untouched.
 */
const sortMptFlagsForWire: BeforeSignHook = (request) => {
  // Narrow the signed-request union step by step — each `type` check unlocks
  // autocomplete on the next level, down to the XRPL operation itself
  if (request.type !== "Propose") return request
  if (request.payload.type !== "v0_CreateTransactionOrder") return request
  if (request.payload.parameters.type !== "XRPL") return request

  const { operation } = request.payload.parameters
  if (operation?.type !== "MPTokenIssuanceCreate" || !operation.flags) return request

  const rank = (flag: string) => {
    const index = FLAG_WIRE_ORDER.indexOf(flag)
    return index === -1 ? FLAG_WIRE_ORDER.length : index
  }
  operation.flags = [...operation.flags].sort((a, b) => rank(a) - rank(b))

  return request
}

const createMptWithFiveFlags = async () => {
  try {
    // Initialize the Ripple Custody client with API endpoints and authentication keys
    // The private and public keys should be securely stored in environment variables
    const custody = new RippleCustody({
      apiUrl: "https://custody-api-url",
      authUrl: "https://custody-auth-url/token",
      privateKey: process.env.PRIVATE_KEY ?? "",
      publicKey: process.env.PUBLIC_KEY ?? "",
      // Without this hook, the 5-flag operation below is rejected with
      // `401 InvalidSignatureError`. Remove it to reproduce the raw backend
      // behaviour: the SDK then reports which array field caused the failure.
      beforeSign: sortMptFlagsForWire,
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
          // Five flags, deliberately not in the backend's re-emission order —
          // `beforeSign` sorts them before the request is signed and sent
          flags: [
            "tfMPTCanEscrow",
            "tfMPTCanClawback",
            "tfMPTRequireAuth",
            "tfMPTCanLock",
            "tfMPTCanTransfer",
          ],
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
    const intent = await custody.intents.getAndWait({ domainId, intentId })

    // Display the complete intent object including transaction status and details
    console.dir(intent, { depth: null })
  } catch (error) {
    console.log(error)
  }
}
