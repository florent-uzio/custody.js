import { URLs } from "../../constants/urls.js"
import type {
  Compliance_ConfigurationDetailResponse,
  Compliance_GetScreeningRulesResponse,
  Compliance_ProviderConnectionResponse,
  Compliance_ProviderConnectionsResponse,
  ComplianceConfigureScreeningRulesBody,
  ComplianceConnectProviderBody,
  CompliancePauseConnectionQueryParams,
  ComplianceProviderPathParams,
  ComplianceProvidersPathParams,
  ComplianceTogglePreviewScreeningQueryParams,
} from "../../services/compliance/providers.types.js"
import type { TypedTransport } from "../../transport/index.js"

/**
 * `client.compliance.providers.*` — compliance provider connections and
 * screening rules. All mutations are administrative calls sent unsigned
 * (`sign: false`), consistent with the other administrative POST endpoints.
 */
export function createComplianceProviders(t: TypedTransport) {
  return {
    list: (
      params: ComplianceProvidersPathParams,
    ): Promise<Compliance_ConfigurationDetailResponse> => t.get(URLs.complianceProviders, params),

    connect: (
      params: ComplianceProvidersPathParams,
      body: ComplianceConnectProviderBody,
    ): Promise<Compliance_ProviderConnectionResponse> =>
      t.post(URLs.complianceProviders, body, params, { sign: false }),

    getScreeningRules: (
      params: ComplianceProviderPathParams,
    ): Promise<Compliance_GetScreeningRulesResponse> =>
      t.get(URLs.complianceProviderScreeningRules, params),

    configureScreeningRules: (
      params: ComplianceProviderPathParams,
      body: ComplianceConfigureScreeningRulesBody,
    ): Promise<void> =>
      t.post(URLs.complianceProviderScreeningRules, body, params, { sign: false }),

    togglePreviewScreening: (
      params: ComplianceProviderPathParams,
      query: ComplianceTogglePreviewScreeningQueryParams,
    ): Promise<void> =>
      t.put(URLs.complianceProviderTogglePreviewScreening, undefined, { ...params, ...query }),

    pauseConnection: (
      params: ComplianceProviderPathParams,
      query: CompliancePauseConnectionQueryParams,
    ): Promise<void> =>
      t.put(URLs.complianceProviderPauseConnection, undefined, { ...params, ...query }),

    deleteConnection: (params: ComplianceProviderPathParams): Promise<void> =>
      t.delete(URLs.complianceProvider, params),

    listConnections: (
      params: ComplianceProvidersPathParams,
    ): Promise<Compliance_ProviderConnectionsResponse> =>
      t.get(URLs.complianceProviderConnections, params),
  } as const
}
