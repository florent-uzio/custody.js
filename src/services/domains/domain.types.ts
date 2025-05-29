export type DomainStatus = "Unlocked" | "Locked" | "Archived"
export type GoverningStrategy = "ConsiderDescendants" | "CoerceDescendants"

export type Domain = {
  data: {
    /** Unique identifier for the domain (UUID) */
    id: string
    /** Unique identifier for the parent domain (UUID) */
    parentId: string
    /** Alias for the domain (1..75 characters) */
    alias: string
    /** Lock status of the domain */
    lock: DomainStatus
    /** Governing strategy for the domain */
    governingStrategy?: GoverningStrategy
    /** Permissions associated with the domain */
    permissions: {
      /** Read access permissions */
      readAccess: {
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
    }
    /** Metadata for the domain */
    metadata: {
      /** Description of the domain (0..250 characters) */
      description: string
      /** Revision number (int64 >= 1) */
      revision: number
      /** Creation date and time (ISO date-time) */
      createdAt: string
      /** Information about the creator */
      createdBy: {
        /** Creator's user ID (UUID) */
        id: string
        /** Creator's domain ID (UUID) */
        domainId: string
      }
      /** Last modification date and time (ISO date-time) */
      lastModifiedAt: string
      /** Information about the last modifier */
      lastModifiedBy: {
        /** Last modifier's user ID (UUID) */
        id: string
        /** Last modifier's domain ID (UUID) */
        domainId: string
      }
      /** Custom properties for the domain */
      customProperties: {
        [key: string]: string
      }
    }
  }
  /** Signature for the domain (base64 string) */
  signature: string
}
/** Represents a paginated list of items with metadata and a signature. */
export type Domains = {
  /** Array of item entries. */
  items: {
    /** The item data object. */
    data: {
      /** Unique identifier of the item (UUID). */
      id: string
      /** UUID of the parent item. */
      parentId: string
      /** Human-readable alias (1 to 75 characters). */
      alias: string
      /** Lock status of the item. Can be: "Unlocked", "Locked", or "Archived". */
      lock: DomainStatus
      /** Governing strategy for child elements. Can be: "ConsiderDescendants" or "CoerceDescendants". */
      governingStrategy?: GoverningStrategy
      /** Access permissions for the item. */
      permissions: {
        /** Read access rules. */
        readAccess: {
          /** Domains with read access. */
          domains: string[]
          /** Users with read access. */
          users: string[]
          /** Endpoints with read access. */
          endpoints: string[]
          /** Policies with read access. */
          policies: string[]
          /** Accounts with read access. */
          accounts: string[]
          /** Transactions with read access. */
          transactions: string[]
          /** Requests with read access. */
          requests: string[]
          /** Events with read access. */
          events: string[]
        }
      }
      /** Metadata for the item. */
      metadata: {
        /** Short description (max 250 characters). */
        description: string
        /** Revision number (must be >= 1). */
        revision: number
        /** ISO 8601 date-time when the item was created. */
        createdAt: string
        /** Creator information. */
        createdBy: {
          /** UUID of the creator. */
          id: string
          /** UUID of the creator's domain. */
          domainId: string
        }
        /** ISO 8601 date-time when the item was last modified. */
        lastModifiedAt: string
        /** Last modifier information. */
        lastModifiedBy: {
          /** UUID of the last modifier. */
          id: string
          /** UUID of the last modifier's domain. */
          domainId: string
        }
        /** Custom key-value properties. */
        customProperties: {
          [key: string]: string
        }
      }
    }
    /** Base64-encoded signature verifying the data. */
    signature: string
  }[]
  /** Total number of items returned. */
  count: number
  /** Cursor for pagination: current page's `startingAfter` value. */
  currentStartingAfter?: string
  /** Cursor for pagination: next page's `startingAfter` value. */
  nextStartingAfter?: string
}
