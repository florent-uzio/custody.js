import { URLs } from "../../constants/urls.js"
import type { Transport } from "../../transport/index.js"
import type {
  Compliance_ComplianceAnalysisResponse,
  Compliance_WalletAnalysisResponse,
  ComplianceAnalysisPathParams,
  ComplianceAnalyzeBody,
  CompliancePreviewAnalysisBody,
} from "./analysis.types.js"

/** `client.compliance.analysis.*` — transaction/wallet compliance analysis. */
export function createComplianceAnalysis(t: Transport) {
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
