import type { components } from "./custody-types.js"

export type Core_ErrorMessage = components["schemas"]["Core_ErrorMessage"]

/**
 * Custom error class for Custody API errors
 * Provides typed access to the error response structure
 */
export class CustodyError extends Error {
  public readonly reason: string
  /**
   * Use the Core_ErrorMessage 'reason' field as the main error message, fallback to the 'message' field if 'reason' is not available
   */
  public readonly errorMessage?: string
  public readonly statusCode?: number
  public readonly originalError?: Error

  constructor(errorData: Core_ErrorMessage, statusCode?: number, originalError?: Error) {
    // Use the reason as the main error message, fallback to message if reason is not available
    const errorMessage = errorData.reason || errorData.message || "Unknown Custody API error"
    super(errorMessage)

    this.name = "CustodyError"
    this.reason = errorData.reason
    this.errorMessage = errorData.message
    this.statusCode = statusCode
    this.originalError = originalError

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
      reason: this.reason,
      message: this.errorMessage,
      statusCode: this.statusCode,
    }
  }
}
