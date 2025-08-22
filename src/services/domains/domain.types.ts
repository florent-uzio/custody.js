import type { components, operations } from "../../models/custody-types.js"

export type GetDomainsQueryParams = operations["getDomains"]["parameters"]["query"]
export type GetDomainPathParams = operations["getDomain"]["parameters"]["path"]

// Response types
export type Core_TrustedDomainsCollection = components["schemas"]["Core_TrustedDomainsCollection"]
export type Core_TrustedDomain = components["schemas"]["Core_TrustedDomain"]
