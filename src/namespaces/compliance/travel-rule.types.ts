import type { components, operations } from "../../models/custody-types.js"

// Path params

export type ComplianceTravelRuleProviderPathParams =
  operations["CreateTravelRuleTransfer"]["parameters"]["path"]

export type ComplianceTravelRuleMessagePathParams =
  operations["GetTravelRuleTransfer"]["parameters"]["path"]

export type ComplianceTravelRulePolicyPathParams =
  operations["PresentEncryptedPIIToTransfer"]["parameters"]["path"]

export type ComplianceTravelRuleDomainPathParams =
  operations["GetTravelRuleDetails"]["parameters"]["path"]

// Query params

export type ComplianceGetTravelRuleTransferQueryParams =
  operations["GetTravelRuleTransfer"]["parameters"]["query"]

export type CompliancePresentEncryptedPiiQueryParams =
  operations["PresentEncryptedPIIToTransferWithoutPolicy"]["parameters"]["query"]

export type ComplianceListRelationshipsQueryParams =
  operations["ListRelationships"]["parameters"]["query"]

// Request bodies

export type ComplianceCreateTransferBody =
  operations["CreateTravelRuleTransfer"]["requestBody"]["content"]["application/json"]

export type ComplianceAppendPiiBody =
  operations["AppendPIIToTransfer"]["requestBody"]["content"]["application/json"]

export type CompliancePresentPiiBody =
  operations["PresentEncryptedPIIToTransferWithoutPolicy"]["requestBody"]["content"]["application/json"]

export type ComplianceTravelRuleDetailsBody =
  operations["GetTravelRuleDetails"]["requestBody"]["content"]["application/json"]

export type ComplianceCreateRelationshipBody =
  operations["CreateRelationship"]["requestBody"]["content"]["application/json"]

// Response types

export type Compliance_InitiateTravelRuleResponse =
  components["schemas"]["Compliance_InitiateTravelRuleResponse"]

export type Compliance_GetTravelRuleTransferResponse =
  components["schemas"]["Compliance_GetTravelRuleTransferResponse"]

export type Compliance_AppendPIITravelRuleResponse =
  components["schemas"]["Compliance_AppendPIITravelRuleResponse"]

export type Compliance_PresentPIITravelRuleResponse =
  components["schemas"]["Compliance_PresentPIITravelRuleResponse"]

export type Compliance_TravelRuleDetailsResponse =
  components["schemas"]["Compliance_TravelRuleDetailsResponse"]

export type Compliance_RelationshipList = components["schemas"]["Compliance_RelationshipList"]
