import type { Core_MeReference } from "../users/index.js"

/**
 * Resolved context required to build an intent.
 * Contains all the identifiers needed to construct an intent payload.
 */
export type IntentContext = {
  /** The domain ID for the intent */
  domainId: string
  /** The user ID (author) for the intent */
  userId: string
  /** The custody account ID */
  accountId: string
  /** The ledger ID for the transaction */
  ledgerId: string
  /** The blockchain address */
  address: string
}

/**
 * Domain and user reference resolved from the user's context.
 */
export type DomainUserReference = {
  domainId: string
  userId: string
}

/**
 * Account reference found by address lookup.
 */
export type AccountReference = {
  accountId: string
  ledgerId: string
  address: string
}

/**
 * Options for resolving intent context.
 */
export type ResolveContextOptions = {
  /**
   * Specific domain ID to use. If not provided and user has multiple domains,
   * an error will be thrown.
   */
  domainId?: string
}

/**
 * Re-export for convenience.
 */
export type { Core_MeReference }
