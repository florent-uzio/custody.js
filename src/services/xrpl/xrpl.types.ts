import type { Payment, TrustSet } from "xrpl"
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
}

export type XrplOperation = Core_XrplOperation_Payment | Core_XrplOperation_TrustSet

export type BuildIntentProps = {
  operation: XrplOperation
  context: IntentContext
  options: XrplIntentOptions
}
