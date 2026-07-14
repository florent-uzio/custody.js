import { URLs } from "../../constants/urls.js"
import type { Transport } from "../../transport/index.js"
import type {
  Compliance_ExceptionRoleResponse,
  Compliance_PolicyResponse,
  ComplianceCreatePolicyBody,
  ComplianceExceptionRolePathParams,
  ComplianceGetPolicyPathParams,
  CompliancePolicyPathParams,
} from "./policy.types.js"

/** `client.compliance.policy.*` — compliance policy configuration. */
export function createCompliancePolicy(t: Transport) {
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
