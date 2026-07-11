import { URLs } from "../../constants/urls.js"
import type {
  Compliance_ExceptionRoleResponse,
  Compliance_PolicyResponse,
  ComplianceCreatePolicyBody,
  ComplianceExceptionRolePathParams,
  ComplianceGetPolicyPathParams,
  CompliancePolicyPathParams,
} from "../../services/compliance/policy.types.js"
import type { TypedTransport } from "../../transport/index.js"

/** `client.compliance.policy.*` — compliance policy configuration. */
export function createCompliancePolicy(t: TypedTransport) {
  return {
    create: (params: CompliancePolicyPathParams, body: ComplianceCreatePolicyBody): Promise<void> =>
      t.post(URLs.compliancePolicy, body, params, { sign: false }),

    get: (params: ComplianceGetPolicyPathParams): Promise<Compliance_PolicyResponse> =>
      t.get(URLs.compliancePolicyByType, params),

    getExceptionRole: (
      params: ComplianceExceptionRolePathParams,
    ): Promise<Compliance_ExceptionRoleResponse> => t.get(URLs.complianceExceptionRole, params),
  } as const
}
