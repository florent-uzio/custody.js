import { URLs } from "../constants/urls.js"
import type {
  Core_TrustedPoliciesCollection,
  Core_TrustedPolicy,
  GetPoliciesPathParams,
  GetPoliciesQueryParams,
  GetPolicyPathParams,
} from "../services/policies/policies.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createPolicies(t: TypedTransport) {
  return {
    list: (
      params: GetPoliciesPathParams,
      query?: GetPoliciesQueryParams,
    ): Promise<Core_TrustedPoliciesCollection> => t.get(URLs.policies, params, query),

    get: (params: GetPolicyPathParams): Promise<Core_TrustedPolicy> => t.get(URLs.policy, params),
  } as const
}
