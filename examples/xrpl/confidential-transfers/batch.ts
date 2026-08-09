import {
  parametersComputeToCryptographicFields,
  RippleCustody,
  type Core_BatchEntry,
  type Core_BatchSigner,
} from "@florent-uzio/custody"
import { Client } from "xrpl"

/**
 * Example: several ConfidentialMPTSend operations in one atomic Batch
 *
 * The standalone confidential send in `index.ts` is signed by the sender's own
 * custody account, so the platform derives its cryptographic material. A Batch
 * is different: one submitter assembles inner operations belonging to *other*
 * accounts, and cannot compute proofs on their behalf. Each participant
 * therefore computes its own via `accounts.initiateParametersComputeAndWait`
 * and hands the result to the submitter.
 *
 * The flow:
 *   1. Every participant and the submitter reserve a ticket (TicketCreate)
 *   2. Read the resulting TicketSequences from the ledger
 *   3. Each participant computes its own confidential parameters
 *   4. Submitter assembles the Batch and dry-runs it for the signing payload
 *   5. Each participant signs that payload
 *   6. Submitter submits the Batch with the collected signers
 *
 * Prerequisites — this script does no setup. Run `index.ts` first, or point
 * CONFIG at an existing confidential MPT whose senders have already provisioned
 * their ElGamal keys, converted MPT to cMPT, and merged their inbox. A sender
 * without a spendable confidential balance has nothing to send, and one without
 * an ElGamal key makes the compute call fail with `409 AccountNotReady`.
 *
 * Constraints the platform enforces on a confidential Batch:
 *   - `ConfidentialMPTConvert` and `ConfidentialMPTMergeInbox` are rejected
 *     inside a Batch; only `ConfidentialMPTSend` and ordinary inner operations
 *     such as `Payment` are accepted
 *   - at most 8 inner transactions and 8 batch signers
 *   - every participant needs a matching signer, and no sequencing value may
 *     be 0 or collide with another for the same account
 */

// ── Configuration ───────────────────────────────────────────────

const CONFIG = {
  apiUrl: "https://custody-api-url",
  authUrl: "https://custody-auth-url/token",
  /** WebSocket endpoint of an XRPL node on the same network as the ledger below. */
  xrplUrl: "wss://xrpl-node-url",

  ledgerId: "xrpl",

  /** An MPT issuance that already carries MPTSetCanConfidentialAmount. */
  issuanceId: "00000000000000000000000000000000000000000000000000",

  /** Pays the outer Batch fee. May, but need not, also be a sender. */
  submitter: "r...",

  /**
   * The confidential sends to bundle. Each sender must already hold a spendable
   * confidential balance of at least `amount`.
   */
  sends: [
    { sender: "r...", destination: "r...", amount: "50" },
    { sender: "r...", destination: "r...", amount: "75" },
  ],

  polling: { maxRetries: 30, intervalMs: 3000 },
} as const

// ── Helpers ─────────────────────────────────────────────────────

const runConfidentialBatch = async () => {
  const custody = new RippleCustody({
    apiUrl: CONFIG.apiUrl,
    authUrl: CONFIG.authUrl,
    privateKey: process.env.PRIVATE_KEY ?? "",
    publicKey: process.env.PUBLIC_KEY ?? "",
  })

  const me = await custody.users.me()
  const domain = me.domains[0]
  if (!domain) throw new Error("No domain found for this user")
  const domainId = domain.id

  const execute = async (
    label: string,
    propose: (requestId: string) => Promise<unknown>,
  ): Promise<void> => {
    const requestId = crypto.randomUUID()
    console.log(`→ ${label}`)
    await propose(requestId)

    const { status, isSuccess } = await custody.intents.getAndWait(
      { domainId, intentId: requestId },
      CONFIG.polling,
    )
    if (!isSuccess) throw new Error(`${label} did not execute (status: ${status})`)
    console.log(`  ✓ ${label}`)
  }

  const xrplClient = new Client(CONFIG.xrplUrl)
  await xrplClient.connect()

  try {
    // Every account that owns an inner operation, plus the submitter.
    const addresses = [...new Set([CONFIG.submitter, ...CONFIG.sends.map((s) => s.sender)])]

    // ── 1. Reserve one ticket per account ───────────────────────

    /**
     * Only the account holder can create its own tickets, so in an orchestrated
     * setup each custodian issues these for their own accounts — in bulk and
     * ahead of time rather than one per transaction.
     */
    for (const address of addresses) {
      await execute(`reserve ticket (${address})`, (requestId) =>
        custody.xrpl.proposeIntent(
          { Account: address, operation: { type: "TicketCreate", ticketCount: 1 } },
          { requestId, domainId },
        ),
      )
    }

    // ── 2. Read the ticket sequences from the ledger ────────────

    /**
     * Custody does not surface ticket sequences, so they come from the ledger.
     * Each `Ticket` object carries the `TicketSequence` used both as the entry's
     * sequencing value and as the `ticketSequence` the proof is computed
     * against — the two must match, or the proof will not validate.
     */
    const ticketOf = new Map<string, number>()

    for (const address of addresses) {
      const { result } = await xrplClient.request({
        command: "account_objects",
        account: address,
        type: "ticket",
      })

      const ticket = result.account_objects.find(
        (object): object is Extract<typeof object, { LedgerEntryType: "Ticket" }> =>
          object.LedgerEntryType === "Ticket",
      )
      if (!ticket) throw new Error(`No ticket found on the ledger for ${address}`)

      ticketOf.set(address, ticket.TicketSequence)
      console.log(`  ticket ${ticket.TicketSequence} for ${address}`)
    }

    // ── 3. Each participant computes its own parameters ─────────

    /**
     * A direct authenticated call rather than an intent — it is not gated by an
     * approval policy. The platform forwards it to the vault and stores the
     * result for retrieval; `initiateParametersComputeAndWait` initiates and
     * polls to a terminal status in one call.
     */
    const entries: Core_BatchEntry[] = []

    for (const send of CONFIG.sends) {
      const account = await custody.accounts.findByAddressOrThrow(send.sender, { domainId })
      const ticketSequence = ticketOf.get(send.sender)!

      const { isSuccess, status, compute } =
        await custody.accounts.initiateParametersComputeAndWait(
          { domainId, accountId: account.accountId },
          {
            tokenIdentifier: { issuanceId: CONFIG.issuanceId },
            amount: send.amount,
            destination: send.destination,
            ticketSequence,
            ledgerId: CONFIG.ledgerId,
          },
          CONFIG.polling,
        )

      if (!isSuccess || !compute.cryptographicFields) {
        throw new Error(`Parameters compute failed for ${send.sender} (status: ${status})`)
      }

      const fields = compute.cryptographicFields
      if (!("senderEncryptedAmount" in fields)) {
        throw new Error(`Expected Send cryptographic fields for ${send.sender}`)
      }

      console.log(`  ✓ computed parameters for ${send.sender}`)

      entries.push({
        type: "ParticipantOperation",
        participant: { type: "Account", accountId: account.accountId },
        sequencing: { type: "Ticket", value: ticketSequence },
        operation: {
          type: "ConfidentialMPTSend",
          tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: CONFIG.issuanceId },
          destination: { type: "Address", address: send.destination },
          // The compute response is hex throughout, but the entry mixes
          // encodings: `cryptographicFields` is base64 — which is what
          // parametersComputeToCryptographicFields produces — while this
          // top-level `senderEncryptedBalance` stays hex and passes through
          // untouched. The platform rejects an entry missing any of the three.
          senderEncryptedBalance: fields.senderEncryptedBalance,
          senderEncryptedBalanceVersion: fields.senderEncryptedBalanceVersion,
          cryptographicFields: parametersComputeToCryptographicFields(fields),
        },
      })
    }

    // ── 4. Assemble the Batch and dry-run it ────────────────────

    /**
     * The dry run resolves the inner operations and returns the exact bytes
     * every participant signs. The same payload object must be submitted in
     * step 6, otherwise the signatures cover different bytes.
     */
    const batchPayload = {
      Account: CONFIG.submitter,
      executionMode: "AllOrNothing" as const,
      sequencing: { type: "Ticket" as const, value: ticketOf.get(CONFIG.submitter)! },
      entries,
    }

    const { signingPayload } = await custody.xrpl.dryRunBatch(batchPayload, { domainId })
    console.log(`\nSigning payload: ${signingPayload.slice(0, 32)}…`)

    // ── 5. Each participant signs the payload ───────────────────

    /**
     * Every participant signs the *same* bytes with its own key. Accounts on
     * another custody instance sign independently — pass their resulting
     * BatchSigner in rather than calling this for them.
     */
    const batchSigners: Core_BatchSigner[] = []

    for (const send of CONFIG.sends) {
      const signer = await custody.xrpl.signBatchPayloadAndWait(signingPayload, send.sender, {
        domainId,
        polling: CONFIG.polling,
      })
      batchSigners.push(signer.custodyBatchSigner)
      console.log(`  ✓ signed by ${send.sender}`)
    }

    // ── 6. Submit the Batch ─────────────────────────────────────

    await execute("submit confidential Batch", (requestId) =>
      custody.xrpl.proposeBatch(batchPayload, batchSigners, { requestId, domainId }),
    )

    console.log("\nDone. Each receiver must now run ConfidentialMPTMergeInbox to")
    console.log("move the funds from its confidential inbox into its spendable balance.")
  } finally {
    await xrplClient.disconnect()
  }
}

runConfidentialBatch().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
