import type { components, operations } from "../../models/custody-types.js"

// Request types

export type GetSystemPropertiesQueryParams =
  operations["getSystemProperties"]["parameters"]["query"]

// Response types

export type Core_TrustedSystemPropertiesCollection =
  components["schemas"]["Core_TrustedSystemPropertiesCollection"]

export type Core_TrustedSystemProperty = components["schemas"]["Core_TrustedSystemProperty"]

export type Core_SystemProperty = components["schemas"]["Core_SystemProperty"]

export type Core_SystemPropertyId = components["schemas"]["Core_SystemPropertyId"]
