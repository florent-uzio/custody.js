import { URLs } from "../../constants/urls.js"
import {
  findByAddressOrThrow,
  initiateParametersComputeAndWait,
} from "../../namespaces/accounts.js"
import type {
  Core_ApiAccount,
  Core_ApiManifest,
  InitiateParametersComputeBody,
  InitiateParametersComputePathParams,
  WaitForParametersComputeOptions,
  WaitForParametersComputeResult,
} from "../../namespaces/accounts.types.js"
import { resolveDomainAndUser } from "../../namespaces/domains.js"
import type {
  Core_IntentDryRunRequest,
  Core_IntentDryRunResponse,
  Core_IntentResponse,
  Core_ProposeIntentBody,
  Core_TrustedIntent,
} from "../../namespaces/intents.types.js"
import type {
  Core_TransactionDetails,
  Core_TransactionsCollection,
  GetTransactionsQueryParams,
} from "../../namespaces/transactions.types.js"
import type { Core_MeReference } from "../../namespaces/users.types.js"
import type { Transport } from "../../transport/index.js"
import type { XrplPorts } from "./xrpl.ports.js"

/**
 * Production implementation of XrplPorts backed by TypedTransport (HTTP).
 *
 * Absorbs:
 * - DomainResolverService (GET /v1/me, reduced by `resolveDomainAndUser`)
 * - findByAddressOrThrow (GET /v1/addresses)
 * - intent submission (POST /v1/intents)
 * - manifest retrieval (GET /v1/domains/.../manifests/...)
 * - account details (GET /v1/domains/.../accounts/...)
 * - parameters computation (POST + GET /v1/domains/.../parameters-compute)
 */
export function createHttpPorts(transport: Transport): XrplPorts {
  return {
    async resolveContext(address, opts = {}) {
      const [me, account] = await Promise.all([
        transport.get<Core_MeReference>(URLs.me),
        findByAddressOrThrow(transport, address, {
          ledgerId: opts.ledgerId,
          domainId: opts.domainId,
        }),
      ])
      const { domainId, userId } = resolveDomainAndUser(me, opts.domainId)
      return {
        domainId,
        userId,
        accountId: account.accountId,
        ledgerId: account.ledgerId,
        address: account.address,
      }
    },

    submitIntent(body: Core_ProposeIntentBody): Promise<Core_IntentResponse> {
      return transport.post<Core_IntentResponse>(URLs.intents, body)
    },

    getIntent(domainId: string, intentId: string): Promise<Core_TrustedIntent> {
      return transport.get<Core_TrustedIntent>(URLs.getIntent, { domainId, intentId })
    },

    dryRunIntent(body: Core_IntentDryRunRequest): Promise<Core_IntentDryRunResponse> {
      return transport.post<Core_IntentDryRunResponse>(URLs.intentsDryRun, body, undefined, {
        sign: false,
      })
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

    initiateParametersComputeAndWait(
      params: InitiateParametersComputePathParams,
      body: InitiateParametersComputeBody,
      options?: WaitForParametersComputeOptions,
    ): Promise<WaitForParametersComputeResult> {
      return initiateParametersComputeAndWait(transport, params, body, options)
    },

    getAccount(domainId: string, accountId: string): Promise<Core_ApiAccount> {
      return transport.get<Core_ApiAccount>(URLs.account, { domainId, accountId })
    },

    listTransactions(
      domainId: string,
      query: GetTransactionsQueryParams,
    ): Promise<Core_TransactionsCollection> {
      return transport.get<Core_TransactionsCollection>(URLs.transactions, { domainId }, query)
    },

    getTransaction(domainId: string, transactionId: string): Promise<Core_TransactionDetails> {
      return transport.get<Core_TransactionDetails>(URLs.transaction, { domainId, transactionId })
    },
  }
}
