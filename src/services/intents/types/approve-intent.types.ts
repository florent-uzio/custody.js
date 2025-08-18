import { z } from "zod"
import { ErrorMessageSchema, UserReferenceSchema } from "./common.types.js"

// Approve Schema (Core_Approve)
export const ApproveSchema = z.object({
  /** Author information */
  author: UserReferenceSchema,
  /** Target domain ID */
  targetDomainId: z.uuid(),
  /** Intent ID */
  intentId: z.uuid(),
  /** Proposal signature */
  proposalSignature: z.string(),
  /** Type - always "Approve" */
  type: z.literal("Approve"),
  /** Expiry timestamp (deprecated) */
  expiryAt: z.iso.datetime().optional(),
  /** Approval reason */
  approvalReason: z.string().min(0).max(5000).optional(),
})

// Approve Intent Request Body Schema (Core_ApproveIntentBody)
export const ApproveIntentRequestSchema = z.object({
  /** Request data */
  request: ApproveSchema,
  /** Base64-encoded signature */
  signature: z.string(),
})

// All error responses use the same Core_ErrorMessage structure
export const ApproveIntentErrorResponseSchema = ErrorMessageSchema

// Inferred TypeScript types from Zod schemas
export type Approve = z.infer<typeof ApproveSchema>
export type ApproveIntentRequest = z.infer<typeof ApproveIntentRequestSchema>
export type ApproveIntentErrorResponse = z.infer<typeof ApproveIntentErrorResponseSchema>
