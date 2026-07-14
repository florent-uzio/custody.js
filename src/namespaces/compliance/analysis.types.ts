import type { components, operations } from "../../models/custody-types.js"

// Path params

export type ComplianceAnalysisPathParams = operations["analysis"]["parameters"]["path"]

// Request bodies

export type ComplianceAnalyzeBody =
  operations["analysis"]["requestBody"]["content"]["application/json"]

export type CompliancePreviewAnalysisBody =
  operations["PreviewAnalysis"]["requestBody"]["content"]["application/json"]

// Response types

export type Compliance_ComplianceAnalysisResponse =
  components["schemas"]["Compliance_ComplianceAnalysisResponse"]

export type Compliance_WalletAnalysisResponse =
  components["schemas"]["Compliance_WalletAnalysisResponse"]
