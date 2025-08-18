import { z } from "zod"

/** Governing strategy for the domain */
export type GoverningStrategy = "ConsiderDescendants" | "CoerceDescendants"

// Zod schemas for Domain Status and Governing Strategy
export const DomainStatusSchema = z.enum(["Unlocked", "Locked", "Archived"])
export const GoverningStrategySchema = z.enum(["ConsiderDescendants", "CoerceDescendants"])

// Zod schema for Domain
export const DomainSchema = z.object({
  data: z.object({
    id: z.string(),
    parentId: z.string(),
    alias: z.string().min(1).max(75),
    lock: DomainStatusSchema,
    governingStrategy: GoverningStrategySchema.optional(),
    permissions: z.object({
      readAccess: z.object({
        domains: z.array(z.string()),
        users: z.array(z.string()),
        endpoints: z.array(z.string()),
        policies: z.array(z.string()),
        accounts: z.array(z.string()),
        transactions: z.array(z.string()),
        requests: z.array(z.string()),
        events: z.array(z.string()),
      }),
    }),
    metadata: z.object({
      description: z.string().max(250),
      revision: z.number().int().min(1),
      createdAt: z.string(),
      createdBy: z.object({
        id: z.string(),
        domainId: z.string(),
      }),
      lastModifiedAt: z.string(),
      lastModifiedBy: z.object({
        id: z.string(),
        domainId: z.string(),
      }),
      customProperties: z.record(z.string(), z.string()),
    }),
  }),
  signature: z.string(),
  signingKey: z.string(),
})

// Domain type
export type Domain = z.infer<typeof DomainSchema>

// Zod schema for Domains (response)
export const DomainsSchema = z.object({
  items: z.array(DomainSchema),
  count: z.number(),
  currentStartingAfter: z.string().optional(),
  nextStartingAfter: z.string().optional(),
})

// Get Domains Query Parameters Schema
export const GetDomainsQueryParamsSchema = z.object({
  /** Maximum number of items to return (default: 100, max: 100) */
  limit: z.number().int().min(1).max(100).optional(),
  /** Cursor for pagination - return items after this cursor */
  startingAfter: z.string().optional(),
  /** Filter by domain alias (case-insensitive partial match) */
  alias: z.string().optional(),
  /** Filter by lock status */
  lock: DomainStatusSchema.optional(),
  /** Filter by governing strategy */
  governingStrategy: GoverningStrategySchema.optional(),
  /** Filter by parent domain ID */
  parentId: z.string().optional(),
  /** Include archived domains in results (default: false) */
  includeArchived: z.boolean().optional(),
  /** Sort order: "asc" or "desc" (default: "asc") */
  sortOrder: z.enum(["asc", "desc"]).optional(),
  /** Sort field: "alias", "createdAt", "lastModifiedAt" (default: "alias") */
  sortBy: z.enum(["alias", "createdAt", "lastModifiedAt"]).optional(),
})

// Inferred TypeScript types from Zod schemas
export type GetDomainsQueryParams = z.infer<typeof GetDomainsQueryParamsSchema>
export type Domains = z.infer<typeof DomainsSchema>
