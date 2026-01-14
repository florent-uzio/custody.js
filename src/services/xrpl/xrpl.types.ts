import type { Payment } from "xrpl"
import type { components } from "../../models/custody-types.js"

export type Core_XrplCurrency = components["schemas"]["Core_XrplCurrency"]
export type Core_XrplOperation_Payment = components["schemas"]["Core_XrplOperation_Payment"]

export type CustodyPayment = Pick<Payment, "Account"> & Omit<Core_XrplOperation_Payment, "type">

export type PaymentOptions = {
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
