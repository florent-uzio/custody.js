import { z } from "zod"
import { UserReferenceSchema, ErrorMessageSchema } from "./common.types.js"

// Reject Schema (Core_Reject)
export const RejectSchema = z.object({
  /** Author information */
  author: UserReferenceSchema,
  /** Target domain ID */
  targetDomainId: z.uuid(),
  /** Intent ID */
  intentId: z.uuid(),
  /** Proposal signature */
  proposalSignature: z.string(),
  /** Reject reason */
  rejectReason: z.string().min(1).max(5000),
  /** Type - always "Reject" */
  type: z.literal("Reject"),
  /** Expiry timestamp (deprecated) */
  expiryAt: z.iso.datetime().optional(),
})

// Reject Intent Request Body Schema (Core_RejectIntentBody)
export const RejectIntentRequestSchema = z.object({
  /** Request data */
  request: RejectSchema,
  /** Base64-encoded signature */
  signature: z.string(),
})

// All error responses use the same Core_ErrorMessage structure
export const RejectIntentErrorResponseSchema = ErrorMessageSchema

// Inferred TypeScript types from Zod schemas
export type Reject = z.infer<typeof RejectSchema>
export type RejectIntentRequest = z.infer<typeof RejectIntentRequestSchema>
export type RejectIntentErrorResponse = z.infer<typeof RejectIntentErrorResponseSchema>
