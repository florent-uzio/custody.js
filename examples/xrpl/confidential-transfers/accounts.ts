import type { RippleCustody } from "@florent-uzio/custody"
import { xrpToDrops, type Client, type Wallet } from "xrpl"
import { CUSTODY, POLLING, ROLES, XRPL, existingAddress, type Role } from "./config.js"
import { address, releaseQuarantine, sleep, submit } from "./custody-helpers.js"

/**
 * Step 1 — get the four custody accounts (issuer, auditor, Alice, Bob).
 *
 * Each role is reused when its r-address is set in .env, and created otherwise.
 * Any account not yet active on the ledger (just created, or left unfunded by
 * an earlier run that failed) is then funded with XRP.
 */

/** A custody account taking part in the demo. */
export type Participant = {
  role: Role
  /** XRPL r-address — what every XRPL operation is signed with. */
  address: string
  /** Custody account id — what balances, quarantine and decryption are keyed on. */
  accountId: string
  /** True when this run created the account. */
  created: boolean
}

export type Participants = Record<Role, Participant>

export async function getOrCreateAccounts(
  custody: RippleCustody,
  client: Client,
): Promise<Participants> {
  const participants = {} as Participants

  for (const role of ROLES) {
    const address = existingAddress(role)
    participants[role] = address
      ? await useExistingAccount(custody, role, address)
      : await createAccount(custody, role)
  }

  // Printed before funding, so the accounts are not lost if funding fails.
  const created = ROLES.map((role) => participants[role]).filter((p) => p.created)
  if (created.length > 0) {
    console.log("\nAdd these lines to your .env to reuse the new accounts next time:")
    for (const { role, address } of created) console.log(`  ${role}_ADDRESS=${address}`)
  }

  const unfunded: Participant[] = []
  for (const role of ROLES) {
    if (!(await isActiveOnLedger(client, participants[role].address))) {
      unfunded.push(participants[role])
    }
  }
  if (unfunded.length > 0) await fund(custody, client, unfunded)

  return participants
}

/** Looks the custody account id up from the r-address given in .env. */
async function useExistingAccount(
  custody: RippleCustody,
  role: Role,
  address: string,
): Promise<Participant> {
  const { accountId } = await custody.accounts.findByAddressOrThrow(address, {
    domainId: CUSTODY.domainId,
  })
  console.log(`  ${role}: ${address} (existing)`)
  return { role, address, accountId, created: false }
}

/**
 * Creates a custody account with a `v0_CreateAccount` intent, then waits for
 * its XRPL address. The address is derived by the vault a moment after the
 * intent executes, so it has to be polled for.
 */
async function createAccount(custody: RippleCustody, role: Role): Promise<Participant> {
  console.log(`→ create ${role} account`)

  const vaultId = CUSTODY.vaultId ?? (await firstVaultId(custody))
  const accountId = crypto.randomUUID()

  const { intentId } = await custody.intents.proposePayload(
    {
      type: "v0_CreateAccount",
      id: accountId,
      alias: `cmpt-${role.toLowerCase()}-${accountId.slice(0, 8)}`,
      description: `Confidential transfers example — ${role}`,
      providerDetails: { type: "Vault", vaultId, keyStrategy: "VaultHard" },
      ledgerIds: [CUSTODY.ledgerId],
      lock: "Unlocked",
      customProperties: {},
    },
    { domainId: CUSTODY.domainId },
  )

  const intent = await custody.intents.getAndWait({ domainId: CUSTODY.domainId, intentId }, POLLING)
  if (!intent.isSuccess) throw new Error(`[create ${role} account] ${intent.reason}`)

  for (let attempt = 1; attempt <= POLLING.maxRetries; attempt++) {
    const { items } = await custody.accounts.addresses(
      { domainId: CUSTODY.domainId, accountId },
      { ledgerId: [CUSTODY.ledgerId] },
    )
    const address = items[0]?.data.address
    if (address) {
      console.log(`  ${role}: ${address} (created)`)
      return { role, address, accountId, created: true }
    }
    await sleep(POLLING.intervalMs)
  }

  throw new Error(`No ${CUSTODY.ledgerId} address was provisioned for the new ${role} account`)
}

async function firstVaultId(custody: RippleCustody): Promise<string> {
  const { items } = await custody.vaults.list()
  const vault = items[0]
  if (!vault) throw new Error("No vault found — set VAULT_ID in .env")
  return vault.data.id
}

/** An XRPL account only exists on the ledger once it has received XRP. */
async function isActiveOnLedger(client: Client, account: string): Promise<boolean> {
  try {
    await client.request({ command: "account_info", account })
    return true
  } catch (error) {
    if (error instanceof Error && "data" in error) {
      const { data } = error as { data?: { error?: string } }
      if (data?.error === "actNotFound") return false
    }
    throw error
  }
}

/**
 * Funds accounts with XRP, so they can pay transaction fees and reserves.
 *
 * - FUNDER_ADDRESS set: an XRP payment from that (already funded) custody account
 * - otherwise:          the faucet. The keys live in the custody vault, so there
 *                       is no seed to build a real xrpl.js `Wallet` from — but
 *                       `fundWallet` only reads `classicAddress`.
 *
 * The XRP then arrives in custody quarantined, so it is released right away.
 */
async function fund(custody: RippleCustody, client: Client, participants: Participant[]) {
  for (const { role, address: destination } of participants) {
    if (XRPL.funderAddress) {
      await submit(custody, `fund ${role} with ${XRPL.fundAmount} XRP`, XRPL.funderAddress, {
        type: "Payment",
        destination: address(destination),
        amount: xrpToDrops(XRPL.fundAmount), // no `currency`: this is XRP, in drops
      })
    } else {
      console.log(`→ fund ${role} from the faucet`)
      const { balance } = await client.fundWallet({ classicAddress: destination } as Wallet, {
        faucetHost: XRPL.faucetHost,
        amount: XRPL.fundAmount,
      })
      console.log(`  ✓ ${role} funded (${balance} XRP)`)
    }
  }

  for (const { role, accountId } of participants) {
    await releaseQuarantine(custody, accountId, role, 10)
  }
}
