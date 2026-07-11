import type { TypedTransport } from "../../transport/index.js"
import { createComplianceAnalysis } from "./analysis.js"
import { createComplianceDomain } from "./domain.js"
import { createCompliancePolicy } from "./policy.js"
import { createComplianceProviders } from "./providers.js"
import { createComplianceTravelRule } from "./travel-rule.js"

/**
 * Compliance namespace (`client.compliance.*`), grouped into sub-namespaces that
 * mirror the `/v1/domains/{domainId}/compliance/*` URL structure:
 * `providers`, `policy`, `domain`, `analysis`, and `travelRule`.
 */
export function createCompliance(t: TypedTransport) {
  return {
    providers: createComplianceProviders(t),
    policy: createCompliancePolicy(t),
    domain: createComplianceDomain(t),
    analysis: createComplianceAnalysis(t),
    travelRule: createComplianceTravelRule(t),
  } as const
}
