import { URLs } from "../../constants/urls.js"
import { CustodyError } from "../../models/index.js"
import type { TypedTransport } from "../../transport/index.js"
import type {
  AccountReference,
  Core_AddressReferenceCollection,
  Core_ApiAccount,
  Core_ApiManifest,
} from "../accounts/accounts.types.js"
import type {
  Core_IntentDryRunRequest,
  Core_IntentDryRunResponse,
  Core_IntentResponse,
  Core_ProposeIntentBody,
} from "../intents/intents.types.js"
import type { Core_MeReference } from "../users/users.types.js"
import type { XrplPorts } from "./xrpl.ports.js"

/**
 * Production implementation of XrplPorts backed by TypedTransport (HTTP).
 *
 * Absorbs:
 * - DomainResolverService (GET /v1/me + validation + domain resolution)
 * - findByAddress (GET /v1/addresses)
 * - intent submission (POST /v1/intents)
 * - manifest retrieval (GET /v1/domains/.../manifests/...)
 * - account details (GET /v1/domains/.../accounts/...)
 */
export function createHttpPorts(transport: TypedTransport): XrplPorts {
  return {
    async resolveContext(address, opts = {}) {
      const me = await transport.get<Core_MeReference>(URLs.me)
      const { domainId, userId } = resolveDomainAndUser(me, opts.domainId)
      const account = await findByAddress(transport, address)
      return { domainId, userId, ...account }
    },

    submitIntent(body: Core_ProposeIntentBody): Promise<Core_IntentResponse> {
      return transport.post<Core_IntentResponse>(URLs.intents, body)
    },

    dryRunIntent(body: Core_IntentDryRunRequest): Promise<Core_IntentDryRunResponse> {
      return transport.post<Core_IntentDryRunResponse>(URLs.intentsDryRun, body)
    },

    getManifest(
      domainId: string,
      accountId: string,
      manifestId: string,
    ): Promise<Core_ApiManifest> {
      return transport.get<Core_ApiManifest>(URLs.accountManifest, {
        domainId,
        accountId,
        manifestId,
      })
    },

    getAccount(domainId: string, accountId: string): Promise<Core_ApiAccount> {
      return transport.get<Core_ApiAccount>(URLs.account, { domainId, accountId })
    },
  }
}

// ── Inlined from DomainResolverService ─────────────────────────

function resolveDomainAndUser(
  me: Core_MeReference,
  providedDomainId?: string,
): { domainId: string; userId: string } {
  if (!me.loginId?.id) {
    throw new CustodyError({ reason: "User has no login ID" })
  }

  if (me.domains.length === 0) {
    throw new CustodyError({ reason: "User has no domains" })
  }

  if (providedDomainId) {
    const domain = me.domains.find((d) => d.id === providedDomainId)
    if (!domain) {
      throw new CustodyError({
        reason: `Domain with ID ${providedDomainId} not found for user`,
      })
    }
    if (!domain.id) {
      throw new CustodyError({ reason: `Domain ${providedDomainId} has no ID` })
    }
    if (!domain.userReference?.id) {
      throw new CustodyError({ reason: `Domain ${providedDomainId} has no user reference` })
    }
    return { domainId: domain.id, userId: domain.userReference.id }
  }

  if (me.domains.length > 1) {
    throw new CustodyError({
      reason: "User has multiple domains. Please specify domainId in the options parameter.",
    })
  }

  const domain = me.domains[0]
  if (!domain?.id) {
    throw new CustodyError({ reason: "User has no primary domain" })
  }
  if (!domain.userReference?.id) {
    throw new CustodyError({ reason: "Primary domain has no user reference" })
  }

  return { domainId: domain.id, userId: domain.userReference.id }
}

// ── Inlined from accounts namespace findByAddress ──────────────

async function findByAddress(
  transport: TypedTransport,
  address: string,
): Promise<AccountReference> {
  const addressAcrossDomains = await transport.get<Core_AddressReferenceCollection>(
    URLs.addresses,
    undefined,
    { address },
  )
  const account = addressAcrossDomains.items.find((item) => item.address === address)

  if (!account) {
    throw new CustodyError({ reason: `Account not found for address ${address}` })
  }

  return {
    accountId: account.accountId,
    ledgerId: account.ledgerId ?? "",
    address: account.address,
  }
}
