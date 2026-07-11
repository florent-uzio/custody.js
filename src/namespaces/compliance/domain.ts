import { URLs } from "../../constants/urls.js"
import type {
  ComplianceCreateDomainBody,
  ComplianceDomainPathParams,
  ComplianceValidateDomainBody,
} from "../../services/compliance/domain.types.js"
import type { TypedTransport } from "../../transport/index.js"

/** `client.compliance.domain.*` — compliance domain lifecycle. */
export function createComplianceDomain(t: TypedTransport) {
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
