/**
 * MPT Issuance via SetRegularKey + Disabled Master Key
 *
 * This example demonstrates how to issue an MPT (Multi-Purpose Token) using
 * a regular key setup to separate account ownership from operational control.
 *
 * Architecture:
 * - The issuer account holds the XRP and the master key
 * - A regular key account's keypair is set as the regular key
 * - The master key is disabled, leaving only the regular key active
 * - The regular key holder signs all operational transactions (MPT issuance)
 *
 * Benefit: The regular key holder can control the issuer account without
 * owning or holding any XRP, enabling regulatory compliance scenarios.
 */

import { RippleCustody } from "custody"
import {
  AccountSet,
  AccountSetAsfFlags,
  Client,
  encodeMPTokenMetadata,
  MPTokenIssuanceCreate,
  MPTokenIssuanceCreateFlags,
  SubmittableTransaction,
} from "xrpl"
// @ts-expect-error use your own way of importing the keys and URLs
import { API_URL, AUTH_URL, PRIVATE_KEY, PUBLIC_KEY, XRPL_URL } from "./config"

// ============================================================================
// Configuration
// ============================================================================

/** The account that will issue the MPT and hold the XRP reserve */
const MPT_ISSUER_ADDRESS = "rN7n7o...kw6fzRH"

/** The regular key holder account — has signing authority via SetRegularKey */
const REGULAR_KEY_ACCOUNT = "rU6K7V3P...qTQLWDw1"

// ============================================================================
// Main Execution Flow
// ============================================================================

const main = async () => {
  // Initialize Ripple Custody (for signing with Aviva Fund's key)
  const custody = new RippleCustody({
    apiUrl: API_URL,
    authUrl: AUTH_URL,
    privateKey: PRIVATE_KEY,
    publicKey: PUBLIC_KEY,
  })

  // Initialize XRPL client for transaction submission
  const client = new Client(XRPL_URL)
  await client.connect()

  try {
    console.log("=".repeat(70))
    console.log("MPT Issuance Setup: SetRegularKey + Disable Master Key")
    console.log("=".repeat(70))

    // ========================================================================
    // STEP 1: SetRegularKey — Register regular key on the issuer account
    // ========================================================================
    console.log("\n[STEP 1] SetRegularKey: Register regular key holder")

    await submitTransaction(
      custody,
      client,
      {
        Account: MPT_ISSUER_ADDRESS,
        TransactionType: "SetRegularKey",
        RegularKey: REGULAR_KEY_ACCOUNT,
      },
      "SetRegularKey transaction submitted",
    )

    // ========================================================================
    // STEP 2: AccountSet — Disable the master key
    // ========================================================================
    console.log("\n[STEP 2] AccountSet: Disable master key")

    await submitTransaction(
      custody,
      client,
      {
        Account: MPT_ISSUER_ADDRESS,
        TransactionType: "AccountSet",
        SetFlag: AccountSetAsfFlags.asfDisableMaster,
      } as AccountSet,
      "Master key disabled — only regular key can now sign",
    )

    // ========================================================================
    // STEP 3: MPTokenIssuanceCreate — Issue the MPT
    // ========================================================================
    console.log("\n[STEP 3] MPTokenIssuanceCreate: Issue the MPT")

    const mptTxn: MPTokenIssuanceCreate = {
      Account: MPT_ISSUER_ADDRESS,
      TransactionType: "MPTokenIssuanceCreate",

      // Token supply: maximum 100,000 units, define your own
      MaximumAmount: "100000",

      // Asset scale: 0 decimal places, define your own
      AssetScale: 0,

      // Permissions: allow clawback, transfer, lock, trade, and escrow, define your flags
      Flags:
        MPTokenIssuanceCreateFlags.tfMPTCanClawback |
        MPTokenIssuanceCreateFlags.tfMPTCanTransfer |
        MPTokenIssuanceCreateFlags.tfMPTCanLock |
        MPTokenIssuanceCreateFlags.tfMPTCanTrade |
        MPTokenIssuanceCreateFlags.tfMPTCanEscrow,

      // Metadata: rich information about the token
      MPTokenMetadata: encodeMPTokenMetadata({
        ticker: "TOK",
        name: "Token",
        desc: "Real-world asset backed token",
        icon: "https://example.com/icon.png",
        asset_class: "rwa",
        asset_subclass: "stablecoin",
        issuer_name: "Token Issuer",
      }),
    }

    await submitTransaction(
      custody,
      client,
      mptTxn,
      "MPT issuance successful",
      REGULAR_KEY_ACCOUNT, // Pass signer account for MPT issuance
    )

    console.log("\n" + "=".repeat(70))
    console.log("✓ All steps completed successfully")
    console.log("=".repeat(70))
    console.log("\nResult: Regular key holder now controls the MPT issuer account")
    console.log("without owning or holding any XRP directly.")
  } finally {
    await client.disconnect()
  }
}

// ============================================================================
// Helper: Submit Transaction
// ============================================================================

/**
 * Submits a transaction to the XRPL:
 * 1. Autofill with current ledger state (fee, sequence, etc.)
 * 2. Sign with Ripple Custody
 * 3. Submit and wait for ledger confirmation
 *
 * @param custody - RippleCustody instance for signing
 * @param client - XRPL Client for submission
 * @param txn - The transaction to submit
 * @param successMessage - Message to log on success
 * @param signerAccount - Optional: account to sign with (e.g., for regular key)
 */
const submitTransaction = async (
  custody: RippleCustody,
  client: Client,
  txn: SubmittableTransaction,
  successMessage: string,
  signerAccount?: string,
): Promise<void> => {
  try {
    // Step 1: Autofill transaction with current ledger state
    // This populates Fee, Sequence, and other required fields
    const autofilled = await client.autofill(txn)

    // Step 2: Sign the transaction using Ripple Custody
    console.log(`  Signing with Ripple Custody...`)
    const { signedTransaction } = await custody.xrpl.rawSignAndWait(autofilled, {
      signerAccount: signerAccount ?? undefined,
    })

    // Step 3: Submit the signed transaction to the XRPL
    // Wait for ledger confirmation before returning
    console.log(`  Submitting to ledger...`)
    const response = await client.submitAndWait(signedTransaction)

    // Log success
    console.log(`  ✓ ${successMessage}`)
    console.log(`  Hash: ${response.result.hash}`)
  } catch (error) {
    console.error(`  ✗ Transaction failed:`, error)
    throw error
  }
}

// ============================================================================
// Execution
// ============================================================================

main().catch(console.error)
