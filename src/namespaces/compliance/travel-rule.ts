import { URLs } from "../../constants/urls.js"
import type {
  Compliance_AppendPIITravelRuleResponse,
  Compliance_GetTravelRuleTransferResponse,
  Compliance_InitiateTravelRuleResponse,
  Compliance_PresentPIITravelRuleResponse,
  Compliance_RelationshipList,
  Compliance_TravelRuleDetailsResponse,
  ComplianceAppendPiiBody,
  ComplianceCreateRelationshipBody,
  ComplianceCreateTransferBody,
  ComplianceGetTravelRuleTransferQueryParams,
  ComplianceListRelationshipsQueryParams,
  CompliancePresentEncryptedPiiQueryParams,
  CompliancePresentPiiBody,
  ComplianceTravelRuleDetailsBody,
  ComplianceTravelRuleDomainPathParams,
  ComplianceTravelRuleMessagePathParams,
  ComplianceTravelRulePolicyPathParams,
  ComplianceTravelRuleProviderPathParams,
} from "../../services/compliance/travel-rule.types.js"
import type { TypedTransport } from "../../transport/index.js"

/**
 * `client.compliance.travelRule.*` — travel-rule messaging (IVMS-101 PII
 * transfers and counterparty relationships). PII payloads are caller-supplied
 * and passed through untouched; the SDK performs no client-side encryption.
 */
export function createComplianceTravelRule(t: TypedTransport) {
  return {
    createTransfer: (
      params: ComplianceTravelRuleProviderPathParams,
      body: ComplianceCreateTransferBody,
    ): Promise<Compliance_InitiateTravelRuleResponse> =>
      t.post(URLs.complianceTravelRuleMessages, body, params, { sign: false }),

    getTransfer: (
      params: ComplianceTravelRuleMessagePathParams,
      query?: ComplianceGetTravelRuleTransferQueryParams,
    ): Promise<Compliance_GetTravelRuleTransferResponse> =>
      t.get(URLs.complianceTravelRuleMessage, params, query),

    appendPii: (
      params: ComplianceTravelRuleMessagePathParams,
      body: ComplianceAppendPiiBody,
    ): Promise<Compliance_AppendPIITravelRuleResponse> =>
      t.post(URLs.complianceTravelRulePii, body, params, { sign: false }),

    presentEncryptedPii: (
      params: ComplianceTravelRuleMessagePathParams,
      body: CompliancePresentPiiBody,
      query?: CompliancePresentEncryptedPiiQueryParams,
    ): Promise<Compliance_PresentPIITravelRuleResponse> =>
      t.post(URLs.complianceTravelRuleEncryptedPii, body, { ...params, ...query }, { sign: false }),

    presentEncryptedPiiForPolicy: (
      params: ComplianceTravelRulePolicyPathParams,
      body: CompliancePresentPiiBody,
      query?: CompliancePresentEncryptedPiiQueryParams,
    ): Promise<Compliance_PresentPIITravelRuleResponse> =>
      t.post(
        URLs.complianceTravelRuleEncryptedPiiForPolicy,
        body,
        { ...params, ...query },
        {
          sign: false,
        },
      ),

    getDetails: (
      params: ComplianceTravelRuleDomainPathParams,
      body: ComplianceTravelRuleDetailsBody,
    ): Promise<Compliance_TravelRuleDetailsResponse> =>
      t.post(URLs.complianceTravelRuleDetails, body, params, { sign: false }),

    listRelationships: (
      params: ComplianceTravelRuleProviderPathParams,
      query?: ComplianceListRelationshipsQueryParams,
    ): Promise<Compliance_RelationshipList> =>
      t.get(URLs.complianceTravelRuleRelationships, params, query),

    createRelationship: (
      params: ComplianceTravelRuleProviderPathParams,
      body: ComplianceCreateRelationshipBody,
    ): Promise<void> =>
      t.post(URLs.complianceTravelRuleRelationships, body, params, { sign: false }),
  } as const
}
