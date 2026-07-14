import { URLs } from "../../constants/urls.js"
import type { Transport } from "../../transport/index.js"
import type {
  ComplianceCreateDomainBody,
  ComplianceDomainPathParams,
  ComplianceValidateDomainBody,
} from "./domain.types.js"

/** `client.compliance.domain.*` — compliance domain lifecycle. */
export function createComplianceDomain(t: Transport) {
  return {
    create: (params: ComplianceDomainPathParams, body: ComplianceCreateDomainBody): Promise<void> =>
      t.post(URLs.complianceDomain, body, params, { sign: false }),

    delete: (params: ComplianceDomainPathParams): Promise<void> =>
      t.delete(URLs.complianceDomain, params),

    validate: (
      params: ComplianceDomainPathParams,
      body: ComplianceValidateDomainBody,
    ): Promise<void> => t.post(URLs.complianceDomainValidation, body, params, { sign: false }),
  } as const
}
