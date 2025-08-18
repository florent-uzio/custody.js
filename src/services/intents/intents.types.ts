import { z } from "zod"

// Core schemas based on OpenAPI specification

// User Reference Schema
export const UserReferenceSchema = z.object({
  /** User ID */
  id: z.string().uuid(),
  /** Domain ID */
  domainId: z.string().uuid(),
})

// Strings Map Schema
export const StringsMapSchema = z.record(z.string(), z.string())

// Intent Type Schema (from Core_IntentType)
export const IntentTypeSchema = z.enum([
  "v0_NotarizeData",
  "v0_ExecuteExtension",
  "v0_CreateDomain",
  "v0_UpdateDomain",
  "v0_UpdateDomainPermissions",
  "v0_UnlockDomain",
  "v0_LockDomain",
  "v0_CreateUser",
  "v0_UpdateUser",
  "v0_UnlockUser",
  "v0_LockUser",
  "v0_CreatePolicy",
  "v0_UpdatePolicy",
  "v0_UnlockPolicy",
  "v0_LockPolicy",
  "v0_CreateVault",
  "v0_UpdateVault",
  "v0_UnlockVault",
  "v0_LockVault",
  "v0_UnlockTicker",
  "v0_LockTicker",
  "v0_CreateEndpoint",
  "v0_UpdateEndpoint",
  "v0_UnlockEndpoint",
  "v0_LockEndpoint",
  "v0_CreateAccount",
  "v0_MigrateSilo3AccountBatch",
  "v0_UpdateAccount",
  "v0_UnlockAccount",
  "v0_LockAccount",
  "v0_AddAccountLedgers",
  "v0_CreateTransactionOrder",
  "v0_ReleaseQuarantinedTransfers",
  "v0_CreateTicker",
  "v0_AttemptTransactionOrderCancellation",
  "v0_ValidateTickers",
  "v0_UpdateTicker",
  "v0_CreateTransferOrder",
  "v0_SignManifest",
  "v0_SetSystemProperty",
  "v0_CreateLedger",
  "v0_UpdateLedger",
  "v0_AddTrustedPublicKeysForMigration"
])

// Propose User Intent Payload Schema (simplified - this would need to be expanded based on specific intent types)
export const ProposeUserIntentPayloadSchema = z.looseObject({
  /** Intent type */
  type: IntentTypeSchema,
  /** Additional payload properties would be specific to each intent type */
  // This is a simplified version - in practice, each intent type would have its own schema
})

// Propose Schema (Core_Propose)
export const ProposeSchema = z.object({
  /** Author information */
  author: UserReferenceSchema,
  /** Expiration timestamp */
  expiryAt: z.iso.datetime(),
  /** Target domain ID */
  targetDomainId: z.uuid(),
  /** Intent ID */
  id: z.uuid(),
  /** Intent payload */
  payload: ProposeUserIntentPayloadSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type - always "Propose" */
  type: z.literal("Propose"),
  /** Optional description */
  description: z.string().min(0).max(250).optional(),
})

// Create Intent Request Body Schema (Core_ProposeIntentBody)
export const CreateIntentRequestSchema = z.object({
  /** Request data */
  request: ProposeSchema,
  /** Base64-encoded signature */
  signature: z.string(),
})

// Intent Response Schema (Core_IntentResponse)
export const IntentResponseSchema = z.object({
  /** Request ID */
  requestId: z.uuid(),
})

// Error Message Schema (Core_ErrorMessage)
export const ErrorMessageSchema = z.object({
  /** Error reason */
  reason: z.string(),
  /** Error message */
  message: z.string().optional(),
})

// Inferred TypeScript types from Zod schemas
export type UserReference = z.infer<typeof UserReferenceSchema>
export type StringsMap = z.infer<typeof StringsMapSchema>
export type IntentType = z.infer<typeof IntentTypeSchema>
export type ProposeUserIntentPayload = z.infer<typeof ProposeUserIntentPayloadSchema>
export type Propose = z.infer<typeof ProposeSchema>
export type CreateIntentRequest = z.infer<typeof CreateIntentRequestSchema>
export type IntentResponse = z.infer<typeof IntentResponseSchema>
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>
