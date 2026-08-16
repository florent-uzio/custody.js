import type { ConfidentialMPTSend } from "xrpl"

export type Wallet = {
  name: string
  id: string
  address: string
}

export type HolderBalance = {
  mmfPublic: number
  mmfConfidentialSpendable: number
  mmfConfidentialInbox: number
  bMMFConfidential: boolean
  rlusdPublic: number
  rlusdConfidentialSpendable: number
  rlusdConfidentialInbox: number
  bRLUSDConfidential: boolean
}

export type Balances = {
  sellerBalances: HolderBalance
  buyerBalances: HolderBalance
}

/**
 * The two halves of one confidential leg: what goes on the XRPL wire, and what
 * only the Custody batch payload carries.
 *
 * `ConfidentialMPTSend` on the ledger commits to the amount as ciphertext only,
 * and the sender's encrypted balance is read from the ledger at apply time — so
 * neither the plaintext `amount` nor `senderEncryptedBalance` /
 * `senderEncryptedBalanceVersion` exists on the xrpl.js transaction. Harmonize
 * needs all three on the batch *entry* to dry-run and re-derive the proofs, so
 * they are passed to `batchToCustodyBatchPayload` via `confidentialSends`.
 */
export type ConfidentialSendLeg = {
  transaction: ConfidentialMPTSend & { TicketSequence: number }
  custodyOnly: {
    amount: string
    senderEncryptedBalance?: string
    senderEncryptedBalanceVersion?: number
  }
}
