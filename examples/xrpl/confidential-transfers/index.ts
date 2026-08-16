import { RippleCustody } from "@florent-uzio/custody"
import { Client, Wallet } from "xrpl"

/**
 * Example: Confidential MPT (cMPT) transfers with Ripple Custody
 *
 * Runs a confidential multi-purpose token end to end, from an empty instance
 * to a `ConfidentialMPTSend` followed by a `ConfidentialMPTClawback`:
 *
 *   Phase A — token in circulation
 *     1. Resolve or create the issuer / sender / receiver accounts
 *     2. Fund the accounts it created from the faucet (a new XRPL account
 *        cannot transact otherwise)
 *     3. Issuer creates a regular MPT (MPTokenIssuanceCreate)
 *     4. Holders authorize it (MPTokenAuthorize)
 *
 *   Phase B — confidential enablement
 *     5. Every participant provisions an ElGamal key pair
 *     6. Issuer grants the confidential property and publishes the encryption
 *        keys (MPTokenIssuanceSet)
 *     7. Issuer distributes regular MPT to the sender (Payment)
 *     8. Holders reveal their ElGamal key (ConfidentialMPTConvert, amount "0")
 *     9. Sender converts MPT to cMPT and merges its inbox
 *
 *   Phase C — the confidential operations
 *    10. Sender performs a ConfidentialMPTSend to the receiver
 *    11. Receiver merges its inbox so the funds land in its spendable balance
 *    12. Issuer performs a ConfidentialMPTClawback against the receiver
 *    13. Optionally locks the accounts this script created
 *
 * Every step is a custody intent, submitted with `custody.xrpl.proposeIntent`
 * and polled to a terminal status before the next one starts — the ledger state
 * each step depends on only exists once the previous one has executed.
 *
 * For the multi-participant batched form of step 10 — where several senders
 * each contribute a `ConfidentialMPTSend` to one atomic Batch — see `batch.ts`
 * in this folder.
 */

// ── Configuration ───────────────────────────────────────────────

const CONFIG = {
  apiUrl: "https://custody-api-url",
  authUrl: "https://custody-auth-url/token",

  /**
   * The XRPL network the ledger below sits on, used only to fund the accounts
   * this script creates.
   */
  network: {
    /** WebSocket endpoint of an XRPL node on that network. */
    xrplUrl: "wss://xrpl-node-url",
    /** Faucet hostname for the same network, e.g. "faucet.devnet.rippletest.net". */
    faucetHost: "faucet-host",
    /** XRP per account. Leave `undefined` to take whatever the faucet gives. */
    fundAmount: undefined as string | undefined,
  },

  /**
   * Accounts to run the flow with. Provide the XRPL r-address of an existing
   * Ripple Custody account, or leave it `undefined` to have the script create
   * a fresh one (which then needs `creation` filled in below).
   */
  accounts: {
    issuer: "r..." as string | undefined,
    sender: "r..." as string | undefined,
    receiver: "r..." as string | undefined,
    /**
     * Optional. When set, the auditor's ElGamal public key is published on the
     * issuance, so every confidential amount is also encrypted to the auditor.
     * Leave `undefined` for no auditor.
     */
    auditor: undefined as string | undefined,
  },

  /** Only used for the roles left `undefined` above. */
  creation: {
    /** Vault that will hold the new accounts' keys — see `custody.vaults.list()`. */
    vaultId: "00000000-0000-0000-0000-000000000000",
    keyStrategy: "VaultSoft" as const,
    /** Ledger the new accounts are created on, e.g. "xrpl-testnet-august-2024". */
    ledgerId: "xrpl",
    /**
     * Lock the accounts this script created once the flow has finished. A
     * locked account cannot be the subject of an intent, so this only ever
     * happens as the final step.
     */
    lockAfterRun: false,
  },

  /** Amounts, in the token's smallest unit (assetScale below is 0). */
  amounts: {
    /** Regular MPT the issuer sends to the sender. */
    distribute: "1000",
    /** Of that, how much the sender converts into confidential balance. */
    convert: "600",
    /** Of that, how much the sender confidentially sends to the receiver. */
    send: "250",
  },

  token: {
    assetScale: 0,
    maximumAmount: "1000000000",
    /**
     * `tfMPTCanClawback` is what makes step 12 possible, and it can only be set
     * at creation time. `tfMPTCanTransfer` lets holders move the token between
     * each other rather than only back to the issuer.
     */
    flags: ["tfMPTCanTransfer", "tfMPTCanClawback"] as const,
  },

  /** How long to wait for each intent to reach a terminal status. */
  polling: { maxRetries: 30, intervalMs: 3000 },
} as const

// ── Types ───────────────────────────────────────────────────────

type Role = "issuer" | "sender" | "receiver" | "auditor"

type Participant = {
  role: Role
  address: string
  accountId: string
  /** True when this script created the account, so it knows what it may lock. */
  created: boolean
}

const MPT = (issuanceId: string) => ({ type: "MPTokenIssuanceId", issuanceId }) as const
const to = (address: string) => ({ type: "Address", address }) as const

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ── Main ────────────────────────────────────────────────────────

const runConfidentialTransfers = async () => {
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

  /**
   * Proposes an intent and blocks until it reaches a terminal status, throwing
   * on anything other than `Executed`. Confidential operations build on ledger
   * state the previous step created, so running them concurrently — or reading
   * a result before its intent has executed — silently produces the wrong
   * thing rather than an error.
   */
  const execute = async (
    label: string,
    propose: (requestId: string) => Promise<unknown>,
  ): Promise<void> => {
    const requestId = crypto.randomUUID()
    console.log(`→ ${label}`)

    await propose(requestId)
    const { status, isSuccess, intent } = await custody.intents.getAndWait(
      { domainId, intentId: requestId },
      CONFIG.polling,
    )

    if (!isSuccess) {
      console.dir(intent.data.state, { depth: null })
      throw new Error(`${label} did not execute (status: ${status})`)
    }
    console.log(`  ✓ ${label}`)
  }

  // ── 1. Resolve or create the participants ─────────────────────

  /**
   * An existing account is identified by its r-address, which is what every
   * `proposeIntent` call takes; the account ID is looked up from it. A created
   * account is the reverse — the intent mints the account ID, and its address
   * only exists once the account has been provisioned on the ledger.
   */
  const resolveParticipant = async (role: Role, address?: string): Promise<Participant> => {
    if (address) {
      const account = await custody.accounts.findByAddressOrThrow(address, { domainId })
      console.log(`  ${role}: ${address} (existing)`)
      return { role, address, accountId: account.accountId, created: false }
    }

    const accountId = crypto.randomUUID()

    await execute(`create ${role} account`, async (requestId) =>
      custody.intents.propose({
        request: {
          type: "Propose",
          id: requestId,
          author: { domainId, id: domain.userReference!.id },
          targetDomainId: domainId,
          customProperties: {},
          expiryAt: new Date(Date.now() + 86_400_000).toISOString(),
          payload: {
            type: "v0_CreateAccount",
            id: accountId,
            alias: `cmpt-${role}-${accountId.slice(0, 8)}`,
            description: `Confidential MPT example — ${role}`,
            providerDetails: {
              type: "Vault",
              vaultId: CONFIG.creation.vaultId,
              keyStrategy: CONFIG.creation.keyStrategy,
            },
            ledgerIds: [CONFIG.creation.ledgerId],
            lock: "Unlocked",
            customProperties: {},
          },
        },
      }),
    )

    /**
     * `execute` already blocked until the creation intent reached `Executed`,
     * but the ledger address is provisioned asynchronously just after that, so
     * the first read can legitimately come back empty. Poll on the same budget
     * as the intents rather than reading once.
     */
    let created
    for (let attempt = 1; attempt <= CONFIG.polling.maxRetries; attempt++) {
      const { items } = await custody.accounts.addresses(
        { domainId, accountId },
        { ledgerId: [CONFIG.creation.ledgerId] },
      )
      created = items[0]
      if (created) break
      await sleep(CONFIG.polling.intervalMs)
    }

    if (!created) {
      throw new Error(`No ${CONFIG.creation.ledgerId} address provisioned for the new ${role}`)
    }

    console.log(`  ${role}: ${created.data.address} (created)`)
    return { role, address: created.data.address, accountId, created: true }
  }

  console.log("\nParticipants")
  const issuer = await resolveParticipant("issuer", CONFIG.accounts.issuer)
  const sender = await resolveParticipant("sender", CONFIG.accounts.sender)
  const receiver = await resolveParticipant("receiver", CONFIG.accounts.receiver)
  const auditor = CONFIG.accounts.auditor
    ? await resolveParticipant("auditor", CONFIG.accounts.auditor)
    : undefined

  const participants = [issuer, sender, receiver, ...(auditor ? [auditor] : [])]

  // ── 2. Fund the accounts ──────────────────────────────────────

  /**
   * A newly created XRPL account holds nothing until someone sends it XRP, and
   * every object this flow creates (the MPToken, the confidential balances)
   * raises the owner reserve on top of the base reserve. Custody can report no
   * balance rows at all for an account the ledger does not know about yet, or
   * rows sitting at zero, so both mean funding has not landed. Amounts are
   * large-integer strings, hence the `BigInt` comparison.
   */
  const isFunded = async ({ accountId }: Participant): Promise<boolean> => {
    const { items } = await custody.accounts.getAccountBalances({ domainId, accountId })
    return items.some(
      ({ totalAmount, availableAmount }) =>
        BigInt(totalAmount) > 0n || BigInt(availableAmount) > 0n,
    )
  }

  const unfunded: Participant[] = []
  for (const participant of participants) {
    if (!(await isFunded(participant))) unfunded.push(participant)
  }

  /**
   * Only the accounts this script created are funded automatically. An account
   * that was passed in through CONFIG.accounts is someone else's to top up, and
   * on a network without a public faucet there is nothing to call anyway.
   */
  const preExisting = unfunded.filter(({ created }) => !created)
  if (preExisting.length > 0) {
    console.log("\nThese pre-existing accounts hold no balance and cannot transact yet:")
    for (const { role, address } of preExisting) console.log(`  ${role}: ${address}`)
    console.log(
      "\nFund them with XRP (base reserve plus the owner reserve for the MPToken and\n" +
        "confidential balance objects), then re-run this script.",
    )
    return
  }

  if (unfunded.length > 0) {
    console.log("\nFunding the accounts this script created")

    const client = new Client(CONFIG.network.xrplUrl)
    await client.connect()
    try {
      for (const { role, address } of unfunded) {
        /**
         * `fundWallet` only reads `classicAddress` off the wallet it is handed —
         * it asks the faucet to pay that destination. The keys live in the
         * custody vault, so there is no seed here to build a real `Wallet`
         * from, and the address is all the faucet needs.
         */
        const { balance } = await client.fundWallet({ classicAddress: address } as Wallet, {
          faucetHost: CONFIG.network.faucetHost,
          ...(CONFIG.network.fundAmount && { amount: CONFIG.network.fundAmount }),
        })
        console.log(`  ${role}: ${address} funded (${balance} XRP)`)
      }
    } finally {
      await client.disconnect()
    }

    /**
     * The faucet payment is on-ledger by the time `fundWallet` returns, but
     * custody indexes the incoming deposit on its own schedule — and an
     * instance that quarantines deposits only reports the balance once the
     * funds are released. Poll on the same budget as the intents.
     */
    for (const participant of unfunded) {
      let funded = false
      for (let attempt = 1; attempt <= CONFIG.polling.maxRetries; attempt++) {
        funded = await isFunded(participant)
        if (funded) break
        await sleep(CONFIG.polling.intervalMs)
      }
      if (!funded) {
        throw new Error(
          `Custody still reports no balance for the ${participant.role} (${participant.address}) — ` +
            `if this instance quarantines deposits, the funds need releasing first.`,
        )
      }
    }
  }

  // ── 3. Issuer creates the regular MPT ─────────────────────────

  /**
   * Confidentiality is *not* granted here. The creation-time flag was removed;
   * the issuer turns it on afterwards with MPTokenIssuanceSet (step 6), which
   * is also what publishes the encryption keys.
   */
  const issuanceOrderId = crypto.randomUUID()

  await execute("create MPT", (requestId) =>
    custody.xrpl.proposeIntent(
      {
        Account: issuer.address,
        operation: {
          type: "MPTokenIssuanceCreate",
          flags: [...CONFIG.token.flags],
          assetScale: CONFIG.token.assetScale,
          maximumAmount: CONFIG.token.maximumAmount,
        },
      },
      { requestId, payloadId: issuanceOrderId, domainId },
    ),
  )

  /**
   * The issuance ID is minted by the ledger, so it is only readable once the
   * transaction the order produced is on-chain — and custody registers that
   * transaction, then fills in its ledger data, shortly *after* the intent
   * above reported `Executed`. `getMptIssuanceIdAndWait` waits that gap out;
   * its non-polling sibling `getMptIssuanceId` would throw here.
   */
  const issuanceId = await custody.xrpl.getMptIssuanceIdAndWait(
    { domainId, payloadId: issuanceOrderId },
    CONFIG.polling,
  )
  console.log(`\nMPT issuance ID: ${issuanceId}\n`)

  // ── 4. Holders authorize the MPT ──────────────────────────────

  for (const holder of [sender, receiver]) {
    await execute(`authorize MPT (${holder.role})`, (requestId) =>
      custody.xrpl.proposeIntent(
        {
          Account: holder.address,
          operation: {
            type: "MPTokenAuthorize",
            tokenIdentifier: MPT(issuanceId),
            flags: [],
          },
        },
        { requestId, domainId },
      ),
    )
  }

  // ── 5. Every participant provisions an ElGamal key pair ───────

  /**
   * The vault generates and stores the pair; only the public half leaves it.
   * Every account that touches a confidential amount needs one — including the
   * issuer, whose key every amount is also encrypted to, and the auditor when
   * one is configured.
   *
   * An account can only be provisioned once per ledger: a second attempt is
   * rejected with `ElGamal key already provisioned for account …`. So this asks
   * first — the accounts named in `CONFIG.accounts` are reused across runs,
   * while the ones this script creates are not. `findElGamalPublicKey` answers
   * with `undefined` rather than throwing when there is no key yet.
   *
   * The vault writes the key shortly *after* the intent reports `Executed`, so
   * reading it back takes `getElGamalPublicKeyAndWait`; the non-polling
   * `getElGamalPublicKey` would throw here.
   */
  const elGamalKeys = new Map<Role, string>()

  for (const participant of participants) {
    const existing = await custody.xrpl.findElGamalPublicKey(participant.address, { domainId })

    if (existing) {
      console.log(`→ ElGamal key already provisioned (${participant.role}), skipping`)
      elGamalKeys.set(participant.role, existing)
      continue
    }

    await execute(`provision ElGamal key (${participant.role})`, (requestId) =>
      custody.xrpl.provisionElGamalKeyPair(participant.address, { requestId, domainId }),
    )

    elGamalKeys.set(
      participant.role,
      await custody.xrpl.getElGamalPublicKeyAndWait(participant.address, {
        domainId,
        ...CONFIG.polling,
      }),
    )
  }

  // ── 6. Issuer grants the confidential property ────────────────

  /**
   * One atomic operation sets the mutable confidentiality flag and publishes
   * the issuer's (and optionally the auditor's) ElGamal public key. Step 5
   * collected both as it went, and they are already base64 as the API expects
   * them, so they go straight through.
   *
   * This is one-way: `MPTSetCanConfidentialAmount` has no clearing counterpart,
   * so an issuance cannot be made non-confidential again.
   */
  const issuerEncryptionKey = elGamalKeys.get("issuer")!

  const auditorEncryptionKey = auditor ? elGamalKeys.get("auditor") : undefined

  await execute("grant confidential property", (requestId) =>
    custody.xrpl.proposeIntent(
      {
        Account: issuer.address,
        operation: {
          type: "MPTokenIssuanceSet",
          tokenIdentifier: MPT(issuanceId),
          flags: [],
          mutableFlags: ["MPTSetCanConfidentialAmount"],
          issuerEncryptionKey,
          ...(auditorEncryptionKey && { auditorEncryptionKey }),
        },
      },
      { requestId, domainId },
    ),
  )

  // ── 7. Issuer distributes regular MPT to the sender ───────────

  await execute("distribute MPT to sender", (requestId) =>
    custody.xrpl.proposeIntent(
      {
        Account: issuer.address,
        operation: {
          type: "Payment",
          destination: to(sender.address),
          amount: CONFIG.amounts.distribute,
          currency: { type: "MultiPurposeToken", issuanceId },
        },
      },
      { requestId, domainId },
    ),
  )

  // ── 8. Holders reveal their ElGamal key ───────────────────────

  /**
   * `ConfidentialMPTConvert` with `amount: "0"` is the opt-in variant: it
   * converts nothing and instead publishes the holder's ElGamal public key and
   * the proof of knowledge to the ledger. Both sides of the transfer need it —
   * the receiver just as much as the sender, since amounts are encrypted to the
   * receiver's key.
   */
  for (const holder of [sender, receiver]) {
    await execute(`reveal ElGamal key (${holder.role})`, (requestId) =>
      custody.xrpl.proposeIntent(
        {
          Account: holder.address,
          operation: {
            type: "ConfidentialMPTConvert",
            tokenIdentifier: MPT(issuanceId),
            amount: "0",
          },
        },
        { requestId, domainId },
      ),
    )
  }

  // ── 9. Sender converts to cMPT and merges its inbox ───────────

  /**
   * A conversion lands in the confidential inbox (`CB_IN`), not in the
   * spendable confidential balance (`CB_S`). `ConfidentialMPTMergeInbox` is
   * what moves it across, and until it has run the sender has nothing to send.
   */
  await execute("convert MPT to cMPT (sender)", (requestId) =>
    custody.xrpl.proposeIntent(
      {
        Account: sender.address,
        operation: {
          type: "ConfidentialMPTConvert",
          tokenIdentifier: MPT(issuanceId),
          amount: CONFIG.amounts.convert,
        },
      },
      { requestId, domainId },
    ),
  )

  await execute("merge inbox (sender)", (requestId) =>
    custody.xrpl.proposeIntent(
      {
        Account: sender.address,
        operation: {
          type: "ConfidentialMPTMergeInbox",
          tokenIdentifier: MPT(issuanceId),
        },
      },
      { requestId, domainId },
    ),
  )

  // ── 10. The confidential send ─────────────────────────────────

  /**
   * The goal of this script. `amount` is the plaintext the platform encrypts on
   * the caller's behalf; it never reaches the ledger in the clear.
   *
   * `cryptographicFields`, `senderEncryptedBalance` and
   * `senderEncryptedBalanceVersion` are omitted deliberately. A standalone
   * confidential send is signed by the sender's own custody account, so the
   * platform derives the ciphertexts, commitments and zero-knowledge proof
   * itself. They are only supplied by hand inside a Batch, where the submitter
   * cannot compute proofs on another participant's behalf — see `batch.ts`.
   */
  await execute("CONFIDENTIAL SEND", (requestId) =>
    custody.xrpl.proposeIntent(
      {
        Account: sender.address,
        operation: {
          type: "ConfidentialMPTSend",
          tokenIdentifier: MPT(issuanceId),
          destination: to(receiver.address),
          amount: CONFIG.amounts.send,
        },
      },
      { requestId, domainId },
    ),
  )

  // ── 11. Receiver merges its inbox ─────────────────────────────

  /**
   * An incoming confidential send is registered in custody but carries no
   * transfers: the amount is encrypted on receipt and aggregates in `CB_IN`,
   * so it has no effect on the custodied balance until it is merged. The
   * transfers are attached to the merge and decrypted there.
   *
   * Because the inbox aggregates, a merge covering several incoming sends
   * cannot attribute them to individual senders. Merging on each receipt — as
   * here — keeps that one-to-one.
   */
  await execute("merge inbox (receiver)", (requestId) =>
    custody.xrpl.proposeIntent(
      {
        Account: receiver.address,
        operation: {
          type: "ConfidentialMPTMergeInbox",
          tokenIdentifier: MPT(issuanceId),
        },
      },
      { requestId, domainId },
    ),
  )

  // ── 12. The confidential clawback ─────────────────────────────

  /**
   * Submitted by the issuer against the holder. Like the send, the platform
   * derives `cryptographicFields`; unlike the send, the operation has no
   * plaintext `amount` field at all — the amount only exists inside those
   * derived fields, so omitting them claws back the holder's confidential
   * balance rather than a chosen part of it.
   *
   * Requires `tfMPTCanClawback` on the issuance, which is why CONFIG.token.flags
   * sets it at creation time.
   */
  await execute("CONFIDENTIAL CLAWBACK", (requestId) =>
    custody.xrpl.proposeIntent(
      {
        Account: issuer.address,
        operation: {
          type: "ConfidentialMPTClawback",
          tokenIdentifier: MPT(issuanceId),
          holder: to(receiver.address),
        },
      },
      { requestId, domainId },
    ),
  )

  // ── 13. Optionally lock the accounts this script created ──────

  if (CONFIG.creation.lockAfterRun) {
    for (const participant of participants.filter((p) => p.created)) {
      const account = await custody.accounts.get({ domainId, accountId: participant.accountId })

      await execute(`lock ${participant.role} account`, (requestId) =>
        custody.intents.propose({
          request: {
            type: "Propose",
            id: requestId,
            author: { domainId, id: domain.userReference!.id },
            targetDomainId: domainId,
            customProperties: {},
            expiryAt: new Date(Date.now() + 86_400_000).toISOString(),
            payload: {
              type: "v0_LockAccount",
              // The lock is applied against the revision it was read at, so a
              // concurrent change to the account rejects it rather than
              // silently locking something else.
              reference: { id: participant.accountId, revision: account.data.metadata.revision },
            },
          },
        }),
      )
    }
  }

  console.log("\nDone.")
  console.log(`  issuance   ${issuanceId}`)
  console.log(`  sent       ${CONFIG.amounts.send} (confidentially, ${sender.role} → receiver)`)
  console.log(`  clawed back from ${receiver.address}`)
}

runConfidentialTransfers().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
