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

  constructor(errorData: Core_ErrorMessage, statusCode?: number, cause?: Error) {
    // Use the reason as the main error message, fallback to message if reason is not available
    const message = errorData.reason || errorData.message || "Unknown Custody API error"
    super(message, { cause })

    this.name = "CustodyError"
    this.errorMessage = errorData.message
    this.statusCode = statusCode

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustodyError)
    }
  }

  /**
   * Get the full error details as a structured object
   */
  public toJSON(): Core_ErrorMessage & { statusCode?: number } {
    return {
      reason: this.message,
      message: this.errorMessage,
      statusCode: this.statusCode,
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
