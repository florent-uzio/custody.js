import { z } from "zod"

// User Reference Schema (Core_UserReference) - Shared across all intent operations
export const UserReferenceSchema = z.object({
  /** User ID */
  id: z.uuid(),
  /** Domain ID */
  domainId: z.uuid(),
})

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
export type UserReference = z.infer<typeof UserReferenceSchema>
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>
export type IntentResponse = z.infer<typeof IntentResponseSchema>
