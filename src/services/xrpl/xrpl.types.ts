import type {
  AccountSet,
  Clawback,
  DepositPreauth,
  MPTokenAuthorize,
  OfferCreate,
  Payment,
  TrustSet,
} from "xrpl"
import type { components } from "../../models/custody-types.js"
import type { Prettify } from "../../type-utils/index.js"
import type { IntentContext } from "../intent-context/index.js"

// Payments

export type Core_XrplCurrency = components["schemas"]["Core_XrplCurrency"]
export type Core_XrplOperation_Payment = components["schemas"]["Core_XrplOperation_Payment"]

export type CustodyPayment = Prettify<
  Pick<Payment, "Account"> & Omit<Core_XrplOperation_Payment, "type">
>

// Trustlines

export type Core_XrplOperation_TrustSet = components["schemas"]["Core_XrplOperation_TrustSet"]

export type CustodyTrustline = Prettify<
  Pick<TrustSet, "Account"> & Omit<Core_XrplOperation_TrustSet, "type">
>

// Deposit Preauth

export type Core_XrplOperation_DepositPreauth =
  components["schemas"]["Core_XrplOperation_DepositPreauth"]

export type CustodyDepositPreauth = Prettify<
  Pick<DepositPreauth, "Account"> & Omit<Core_XrplOperation_DepositPreauth, "type">
>

// Clawback

export type Core_XrplOperation_Clawback = components["schemas"]["Core_XrplOperation_Clawback"]
export type CustodyClawback = Prettify<
  Pick<Clawback, "Account"> & Omit<Core_XrplOperation_Clawback, "type">
>

// MPTokenAuthorize

export type Core_XrplOperation_MPTokenAuthorize =
  components["schemas"]["Core_XrplOperation_MPTokenAuthorize"]
export type CustodyMpTokenAuthorize = Prettify<
  Pick<MPTokenAuthorize, "Account"> & Omit<Core_XrplOperation_MPTokenAuthorize, "type">
>

// OfferCreate

export type Core_XrplOperation_OfferCreate = components["schemas"]["Core_XrplOperation_OfferCreate"]
export type CustodyOfferCreate = Prettify<
  Pick<OfferCreate, "Account"> & Omit<Core_XrplOperation_OfferCreate, "type">
>

// AccountSet

export type Core_XrplOperation_AccountSet = components["schemas"]["Core_XrplOperation_AccountSet"]
export type CustodyAccountSet = Prettify<
  Pick<AccountSet, "Account"> & Omit<Core_XrplOperation_AccountSet, "type">
>

// General

export type XrplIntentOptions = {
  /**
   * Domain ID to use for the payment. If not provided and user has multiple domains, an error will be thrown.
   */
  domainId?: string
  /**
   * Fee strategy priority. Defaults to "Low".
   */
  feePriority?: "Low" | "Medium" | "High"
  /**
   * Number of days until the intent expires. Defaults to 1.
   */
  expiryDays?: number
  /**
   * Custom properties to include in the intent request.
   */
  customProperties?: Record<string, string>
  /**
   * Intent ID to use for the intent. If not provided, a new UUID will be generated.
   */
  intentId?: string
}

export type Core_XrplOperation = components["schemas"]["Core_XrplOperation"]

export type BuildIntentProps = {
  operation: Core_XrplOperation
  context: IntentContext
  options: XrplIntentOptions
}
