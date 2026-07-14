import type { components, operations } from "../models/custody-types.js"

// Request types
export type GetPoliciesPathParams = operations["getPolicies"]["parameters"]["path"]
export type GetPoliciesQueryParams = operations["getPolicies"]["parameters"]["query"]
export type GetPolicyPathParams = operations["getPolicy"]["parameters"]["path"]

// Response types
export type Core_TrustedPoliciesCollection = components["schemas"]["Core_TrustedPoliciesCollection"]
export type Core_TrustedPolicy = components["schemas"]["Core_TrustedPolicy"]
export type Core_Policy = components["schemas"]["Core_Policy"]
export type Core_PolicyScope = components["schemas"]["Core_PolicyScope"]
export type Core_PolicyCondition = components["schemas"]["Core_PolicyCondition"]
export type Core_PolicyCondition_And = components["schemas"]["Core_PolicyCondition_And"]
export type Core_PolicyCondition_Or = components["schemas"]["Core_PolicyCondition_Or"]
export type Core_PolicyCondition_Expression =
  components["schemas"]["Core_PolicyCondition_Expression"]
