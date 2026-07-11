import { URLs } from "../../constants/urls.js"
import type {
  Compliance_ComplianceAnalysisResponse,
  Compliance_WalletAnalysisResponse,
  ComplianceAnalysisPathParams,
  ComplianceAnalyzeBody,
  CompliancePreviewAnalysisBody,
} from "../../services/compliance/analysis.types.js"
import type { TypedTransport } from "../../transport/index.js"

/** `client.compliance.analysis.*` — transaction/wallet compliance analysis. */
export function createComplianceAnalysis(t: TypedTransport) {
  return {
    analyze: (
      params: ComplianceAnalysisPathParams,
      body: ComplianceAnalyzeBody,
    ): Promise<Compliance_ComplianceAnalysisResponse> =>
      t.post(URLs.complianceAnalysis, body, params, { sign: false }),

    preview: (
      params: ComplianceAnalysisPathParams,
      body: CompliancePreviewAnalysisBody,
    ): Promise<Compliance_WalletAnalysisResponse> =>
      t.post(URLs.complianceAnalysisPreview, body, params, { sign: false }),
  } as const
}
