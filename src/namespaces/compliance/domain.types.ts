import type { operations } from "../../models/custody-types.js"

// Path params

export type ComplianceDomainPathParams = operations["CreateDomainPayload"]["parameters"]["path"]

// Request bodies

export type ComplianceCreateDomainBody =
  operations["CreateDomainPayload"]["requestBody"]["content"]["application/json"]

export type ComplianceValidateDomainBody =
  operations["ValidateComplianceDomainCreation"]["requestBody"]["content"]["application/json"]
