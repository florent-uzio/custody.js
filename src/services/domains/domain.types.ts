/** Lock status of the domain */
export type DomainStatus = "Unlocked" | "Locked" | "Archived"

/** Governing strategy for the domain */
export type GoverningStrategy = "ConsiderDescendants" | "CoerceDescendants"

/** Read access permissions */
export type ReadAccess = {
  /** Domains with read access */
  domains: string[]
  /** Users with read access */
  users: string[]
  /** Endpoints with read access */
  endpoints: string[]
  /** Policies with read access */
  policies: string[]
  /** Accounts with read access */
  accounts: string[]
  /** Transactions with read access */
  transactions: string[]
  /** Requests with read access */
  requests: string[]
  /** Events with read access */
  events: string[]
}

/** Creator or modifier information */
export type AuditUser = {
  /** User ID (UUID) */
  id: string
  /** Domain ID (UUID) */
  domainId: string
}

/** Metadata for the domain or item */
export type Metadata = {
  /** Description (0..250 characters) */
  description: string
  /** Revision number (int64 >= 1) */
  revision: number
  /** Creation date-time (ISO) */
  createdAt: string
  /** Creator information */
  createdBy: AuditUser
  /** Last modification date-time (ISO) */
  lastModifiedAt: string
  /** Last modifier information */
  lastModifiedBy: AuditUser
  /** Custom key-value properties */
  customProperties: { [key: string]: string }
}

/** Domain or item data object */
export type DomainData = {
  /** Unique identifier (UUID) */
  id: string
  /** Parent identifier (UUID) */
  parentId: string
  /** Alias (1..75 characters) */
  alias: string
  /** Lock status, "Unlocked", "Locked" or "Archived" */
  lock: DomainStatus
  /** Governing strategy */
  governingStrategy?: GoverningStrategy
  /** Permissions */
  permissions: { readAccess: ReadAccess }
  /** Metadata */
  metadata: Metadata
}

/** A single domain entity */
export type Domain = {
  /** Domain data */
  data: DomainData
  /** Base64-encoded signature */
  signature: string
}

/** Paginated list of domains */
export type Domains = {
  /** Array of domain entries */
  items: Domain[]
  /** Total number of items */
  count: number
  /** Pagination: current page's cursor */
  currentStartingAfter?: string
  /** Pagination: next page's cursor */
  nextStartingAfter?: string
}
