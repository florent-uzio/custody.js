import type { Wallet } from "./types.js"

/**
 * Every input the repo example depends on: instance/ledger ids, the accounts
 * and tokens involved, the deal terms, and the ticker data discovered at
 * runtime. Change the deal here, not in `index.ts`.
 *
 * All ids below are placeholders — replace them with the ones from your own
 * Ripple Custody instance before running the example.
 */

//**** TECHNICAL CONFIGURATION  ****/
// Domain the accounts below belong to, and the ledger they are managed on.
export const DOMAIN_ID = "00000000-0000-0000-0000-000000000000"
export const LEDGER_ID = "xrpl-your-ledger"

//**** KEY DEPENDENCIES  ****/

// MMF Issuer - account that has issued the MMF token
// [Ripple Custody ID]
export const WALLET_MMF_ISSUER: Wallet = {
  name: "MMF Issuer",
  id: "00000000-0000-0000-0000-00000000000a",
  address: "",
}

// MMF - Security to be used as collateral
// [XRPL MPT IssuanceID]
export const MMF_ID = "00000000000000000000000000000000000000000000000A"

// RLUSD - Cash to be used for the repo
// [XRPL MPT IssuanceID]
export const RLUSD_ID = "00000000000000000000000000000000000000000000000B"

// Repo seller - receives RLUSD loan for MMF security collateral
// It is assumed this account has onboarded with both the MMF and RLUSD MPTs
// It is assumed this account has a MMF balance sufficient to meet the collateral to be posted (else trade near leg will fail)
// It is assumed this account has sufficient RLUSD to pay the interest on the loan, or sufficient RLUSD is transferred to them prior to the far leg (else the trade far leg will fail)
// [Ripple Custody ID]
export const WALLET_REPO_SELLER: Wallet = {
  name: "Repo Seller",
  id: "00000000-0000-0000-0000-00000000000b",
  address: "",
}

// Repo buyer - funds RLUSD loan taking MMF security collateral
// It is assumed this account has onboarded with both the MMF and RLUSD MPTs
// It is assumed this account has sufficient RLUSD to fund the loan (else trade near leg will fail)
// [Ripple Custody ID]
export const WALLET_REPO_BUYER: Wallet = {
  name: "Repo Buyer",
  id: "00000000-0000-0000-0000-00000000000c",
  address: "",
}

// Submitter - the wallet submitting the (batch, DvP) settlement transactions
// No requirements other than being active and managed on the Ripple Custody instance
export const WALLET_SUBMITTER: Wallet = {
  name: "Batch Submitter",
  id: "00000000-0000-0000-0000-00000000000d",
  address: "",
}

//**** Repo Deal Terms  ****/
// Note: all amounts are scaled (NOT XRPL stored integer amounts)
export const MMF_UNITS = 5
export const RLUSD_PRINCIPLE = 50
export const RLUSD_REPAYMENT = 51
export const TERM_PERIOD_MS = 60000 // 1 minute

/** Polling budget for the transaction an order produces: 20 attempts, 5s apart. */
export const TRANSACTION_POLLING = { maxRetries: 20, intervalMs: 5000 }

/**
 * Ticker ids and scales resolved from Ripple Custody at startup by
 * `refreshTickers`, and the wallet addresses filled in by `prepare`. Mutable on
 * purpose: everything downstream reads it rather than threading it through.
 */
export const working_data = {
  tickerMMF: "",
  tickerMMFConf: "",
  scaleMMF: 0,
  tickerRLUSD: "",
  tickerRLUSDConf: "",
  scaleRLUSD: 0,
}

/** Fails fast on a missing .env entry rather than passing `undefined` on. */
export function requireEnv(name: string) {
  const value = process.env[name]
  if (value === undefined || value === "") throw new Error(`Missing environment variable ${name}.`)
  return value
}
