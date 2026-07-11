import type { components, operations } from "../../models/custody-types.js"

// Path params

export type ComplianceProvidersPathParams =
  operations["GetAllProvidersForDomain"]["parameters"]["path"]

export type ComplianceProviderPathParams =
  operations["GetScreeningRulesForDomainAndProvider"]["parameters"]["path"]

// Query params

export type ComplianceTogglePreviewScreeningQueryParams =
  operations["TogglePreviewScreening"]["parameters"]["query"]

export type CompliancePauseConnectionQueryParams =
  operations["PauseProviderConnection"]["parameters"]["query"]

// Request bodies

export type ComplianceConnectProviderBody =
  operations["ConnectProvider"]["requestBody"]["content"]["application/json"]

export type ComplianceConfigureScreeningRulesBody =
  operations["ConfigureScreeningRulesForDomainAndProvider"]["requestBody"]["content"]["application/json"]

// Response types

export type Compliance_ConfigurationDetailResponse =
  components["schemas"]["Compliance_ConfigurationDetailResponse"]

export type Compliance_ProviderConnectionResponse =
  components["schemas"]["Compliance_ProviderConnectionResponse"]

export type Compliance_GetScreeningRulesResponse =
  components["schemas"]["Compliance_GetScreeningRulesResponse"]

export type Compliance_ProviderConnectionsResponse =
  components["schemas"]["Compliance_ProviderConnectionsResponse"]
