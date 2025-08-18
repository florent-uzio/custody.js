import { z } from "zod"

// Error Message Schema (Core_ErrorMessage) - Shared across all intent operations
export const ErrorMessageSchema = z.object({
  /** Error reason */
  reason: z.string(),
  /** Error message */
  message: z.string().optional(),
})

// Intent Response Schema (Core_IntentResponse) - Shared across all intent operations
export const IntentResponseSchema = z.object({
  /** Request ID */
  requestId: z.uuid(),
})

// Inferred TypeScript types from Zod schemas
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>
export type IntentResponse = z.infer<typeof IntentResponseSchema>
