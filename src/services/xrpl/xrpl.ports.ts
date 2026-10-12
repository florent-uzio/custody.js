import type { XrplLedgerId } from "../../models/ledger-ids.js"
import type {
  Core_ApiAccount,
  Core_ApiManifest,
  InitiateParametersComputeBody,
  InitiateParametersComputePathParams,
  WaitForParametersComputeOptions,
  WaitForParametersComputeResult,
} from "../../namespaces/accounts.types.js"
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
import type { IntentContext } from "./xrpl.types.js"

/**
 * I/O ports for XrplService.
 *
 * Production: backed by TypedTransport (HTTP).
 * Tests: backed by plain in-memory objects.
 */
export interface XrplPorts {
  /**
   * Resolves the full intent context (domain, user, account) for a given XRPL address.
   * Absorbs domain resolution (GET /v1/me) and account lookup (GET /v1/addresses).
   */
  resolveContext(
    address: string,
    opts?: { domainId?: string; ledgerId?: XrplLedgerId },
  ): Promise<IntentContext>

  /**
   * Submits a proposed intent to the custody platform.
   * Wraps POST /v1/intents.
   */
  submitIntent(body: Core_ProposeIntentBody): Promise<Core_IntentResponse>

  /**
   * Retrieves a proposed intent, for polling it to a terminal status. Throws a
   * 404 `CustodyError` while custody has not registered it yet.
   * Wraps GET /v1/domains/{domainId}/intents/{intentId}.
   */
  getIntent(domainId: string, intentId: string): Promise<Core_TrustedIntent>

  /**
   * Dry-runs an intent and returns the resolved estimate (including
   * `batchSigningData` for Batch operations).
   * Wraps POST /v1/intents/dry-run.
   */
  dryRunIntent(body: Core_IntentDryRunRequest): Promise<Core_IntentDryRunResponse>

  /**
   * Retrieves a manifest for polling signature availability.
   * Wraps GET /v1/domains/{domainId}/accounts/{accountId}/manifests/{manifestId}.
   */
  getManifest(domainId: string, accountId: string, manifestId: string): Promise<Core_ApiManifest>

  /**
   * Initiates a confidential-MPT parameters computation and polls it to a
   * terminal status, returning the cryptographic material it produced.
   * Wraps POST + GET /v1/domains/.../accounts/.../parameters-compute.
   */
  initiateParametersComputeAndWait(
    params: InitiateParametersComputePathParams,
    body: InitiateParametersComputeBody,
    options?: WaitForParametersComputeOptions,
  ): Promise<WaitForParametersComputeResult>

  /**
   * Retrieves full account details (needed for public key retrieval).
   * Wraps GET /v1/domains/{domainId}/accounts/{accountId}.
   */
  getAccount(domainId: string, accountId: string): Promise<Core_ApiAccount>

  /**
   * Lists the domain's transactions, filtered by the given query (the SDK uses
   * `orderReference.Id` to find the transaction a transaction order produced).
   * Wraps GET /v1/domains/{domainId}/transactions.
   */
  listTransactions(
    domainId: string,
    query: GetTransactionsQueryParams,
  ): Promise<Core_TransactionsCollection>

  /**
   * Retrieves a single transaction. The collection endpoint returns a lighter
   * projection that omits `ledgerTransactionData.ledgerData`, so reading on-ledger
   * data requires this detail call.
   * Wraps GET /v1/domains/{domainId}/transactions/{transactionId}.
   */
  getTransaction(domainId: string, transactionId: string): Promise<Core_TransactionDetails>
}
