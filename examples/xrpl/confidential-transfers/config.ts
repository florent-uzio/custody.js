import dotenv from "dotenv"

/**
 * Everything the example reads from the environment, plus the demo constants.
 * Change the amounts or the token settings here, not in `index.ts`.
 */

// Load the `.env` sitting next to this file (not the one in the current
// directory), so the script reads the same settings wherever it is run from.
dotenv.config({ path: new URL(".env", import.meta.url), quiet: true })

/** Fails fast on a missing .env entry rather than passing `undefined` on. */
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (value === undefined || value === "") throw new Error(`Missing environment variable ${name}.`)
  return value
}

/** Reads an optional .env entry, treating an empty value as "not set". */
function optionalEnv(name: string): string | undefined {
  const value = process.env[name]
  return value === undefined || value === "" ? undefined : value
}

//**** RIPPLE CUSTODY ****/

export const CUSTODY = {
  apiUrl: requireEnv("API_URL"),
  authUrl: requireEnv("AUTH_URL"),
  privateKey: requireEnv("PRIVATE_KEY"),
  publicKey: requireEnv("PUBLIC_KEY"),
  debug: process.env.DEBUG === "true",

  /** Domain the four accounts live in. */
  domainId: requireEnv("DOMAIN_ID"),
  /** Custody ledger the accounts are created on. */
  ledgerId: optionalEnv("LEDGER_ID") ?? "xrpl-custody-devnet",
  /**
   * Vault that holds the keys of the accounts this script creates. Left unset,
   * the first vault returned by `custody.vaults.list()` is used.
   */
  vaultId: optionalEnv("VAULT_ID"),
}

//**** XRPL NETWORK ****/

export const XRPL = {
  /** WebSocket URL of an XRPL node with confidential MPTs enabled. */
  wssUrl: optionalEnv("XRPL_WSS_URL") ?? "wss://custody.devnet.rippletest.net:51233",
  /** Faucet for the same network, used to fund the accounts this script creates. */
  faucetHost: optionalEnv("FAUCET_HOST") ?? "custody-faucet.devnet.rippletest.net",
  /**
   * Optional: an existing, funded custody account that pays new accounts their
   * XRP instead of the faucet. Useful when the faucet is down.
   */
  funderAddress: optionalEnv("FUNDER_ADDRESS"),
  /** XRP sent to each account that is not active on the ledger yet. */
  fundAmount: "15",
}

//**** THE FOUR ACCOUNTS ****/

/**
 * The four roles of the demo:
 * - ISSUER  — creates the MPT and pays Alice
 * - AUDITOR — never transacts; its ElGamal key is published on the issuance so
 *             every confidential amount is also encrypted to it
 * - ALICE   — holder 1
 * - BOB     — holder 2
 *
 * Set `<ROLE>_ADDRESS` in .env to reuse an existing custody account; leave it
 * empty and the script creates (and funds) a new one, then prints the line to
 * paste into .env so the next run reuses it.
 */
export const ROLES = ["ISSUER", "AUDITOR", "ALICE", "BOB"] as const
export type Role = (typeof ROLES)[number]

export const existingAddress = (role: Role): string | undefined => optionalEnv(`${role}_ADDRESS`)

//**** THE TOKEN ****/

export const TOKEN = {
  /** 0 decimals, so every amount below is a whole number of tokens. */
  assetScale: 0,
  maximumAmount: "1000000000",
  /**
   * - tfMPTCanTransfer           — holders can pay each other, not only the issuer
   * - tfMPTCanConfidentialAmount — the issuance accepts confidential balances
   * - tfMPTCanClawback           — the issuer can claw balances back (not used
   *                                here, but it can only be set at creation)
   * - tfMPTCanLock               — the issuer can freeze balances (same)
   */
  flags: [
    "tfMPTCanTransfer",
    "tfMPTCanConfidentialAmount",
    "tfMPTCanClawback",
    "tfMPTCanLock",
  ] as const,
}

//**** THE AMOUNTS ****/

export const AMOUNTS = {
  /** Public MPT the issuer pays Alice (step 6). */
  issuerToAlice: "1000",
  /** How much of it Alice converts to a confidential balance (step 7). */
  aliceConverts: "1000",
  /** Confidential send Alice → Bob (step 10). */
  aliceToBob: "300",
  /** Confidential send Bob → Alice (step 12). */
  bobToAlice: "50",
}

//**** POLLING ****/

/** How long to wait for an intent, a transaction or an address to show up. */
export const POLLING = { maxRetries: 30, intervalMs: 3000 }

/**
 * How long to wait for a confidential transaction (convert, merge, send) to
 * land: up to 5 minutes. They take much longer than regular ones, because
 * custody computes ElGamal ciphertexts and zero-knowledge proofs in the vault
 * before broadcasting.
 */
export const CONFIDENTIAL_POLLING = { maxRetries: 60, intervalMs: 5000 }
