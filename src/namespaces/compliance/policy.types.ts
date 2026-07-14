import type { components, operations } from "../../models/custody-types.js"

// Path params

export type CompliancePolicyPathParams = operations["CreatePolicyPayload"]["parameters"]["path"]

export type ComplianceGetPolicyPathParams = operations["GetPolicy"]["parameters"]["path"]

export type ComplianceExceptionRolePathParams = operations["GetExceptionRole"]["parameters"]["path"]

// Request bodies

export type ComplianceCreatePolicyBody =
  operations["CreatePolicyPayload"]["requestBody"]["content"]["application/json"]

// Response types

export type Compliance_PolicyResponse = components["schemas"]["Compliance_PolicyResponse"]

export type Compliance_ExceptionRoleResponse =
  components["schemas"]["Compliance_ExceptionRoleResponse"]
