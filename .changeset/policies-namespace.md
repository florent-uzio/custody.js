---
"custody": minor
---

feat(policies): add `client.policies` namespace with `list({ domainId }, query?)` and `get({ domainId, policyId })`, mapping to `GET /v1/domains/{domainId}/policies` and `GET /v1/domains/{domainId}/policies/{policyId}` respectively. Re-exports `Core_TrustedPoliciesCollection`, `Core_TrustedPolicy`, `Core_Policy`, `Core_PolicyScope`, `Core_PolicyCondition`, `Core_PolicyCondition_And`, `Core_PolicyCondition_Or`, `Core_PolicyCondition_Expression`, `GetPoliciesPathParams`, `GetPoliciesQueryParams`, and `GetPolicyPathParams` from the package root.
