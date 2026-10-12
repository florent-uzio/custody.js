import type { components } from "./custody-types.js"

export type Core_ErrorMessage = components["schemas"]["Core_ErrorMessage"]

/**
 * Custom error class for Custody API errors
 * Provides typed access to the error response structure
 */
export class CustodyError extends Error {
  /**
   * Optional additional message from the API (Core_ErrorMessage.message field)
   * The main error reason is stored in the inherited `message` property
   */
  public readonly errorMessage?: string
  public readonly statusCode?: number
  /**
   * The failure reason on its own, with no SDK-authored `hint` appended —
   * unlike the inherited `message`. Compare or group errors on this, so a hint
   * carrying request-specific details never fragments the grouping.
   */
  public readonly reason: string
  /**
   * SDK-authored diagnostic about a failure the API's own reason does not
   * explain (e.g. which request field likely broke signature verification).
   * Also appended to `message`, since stack traces and unhandled rejections
   * print that and never these fields.
   */
  public readonly hint?: string

  constructor(errorData: Core_ErrorMessage, statusCode?: number, cause?: Error, hint?: string) {
    // Use the reason as the main error message, fallback to message if reason is not available
    const reason = errorData.reason || errorData.message || "Unknown Custody API error"
    super(hint ? `${reason}\n\n${hint}` : reason, { cause })

    this.name = "CustodyError"
    this.errorMessage = errorData.message
    this.statusCode = statusCode
    this.reason = reason
    this.hint = hint

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustodyError)
    }
  }

  /**
   * Get the full error details as a structured object
   */
  public toJSON(): Core_ErrorMessage & { statusCode?: number; hint?: string } {
    return {
      reason: this.reason,
      message: this.errorMessage,
      statusCode: this.statusCode,
      hint: this.hint,
    }
  }

  /**
   * Custom inspect for cleaner console.log output in Node.js
   * Returns the same fields as toJSON() plus name and cause for debugging
   * Full cause details are still accessible via error.cause
   */
  [Symbol.for("nodejs.util.inspect.custom")](): object {
    return {
      name: this.name,
      ...this.toJSON(),
      cause: this.cause instanceof Error ? this.cause.message : undefined,
    }
  }
}
