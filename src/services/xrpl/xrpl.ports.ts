import type { XrplLedgerId } from "../../models/ledger-ids.js"
import type { Core_ApiAccount, Core_ApiManifest } from "../accounts/accounts.types.js"
import type {
  Core_IntentDryRunRequest,
  Core_IntentDryRunResponse,
  Core_IntentResponse,
  Core_ProposeIntentBody,
} from "../intents/intents.types.js"
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
   * Retrieves full account details (needed for public key retrieval).
   * Wraps GET /v1/domains/{domainId}/accounts/{accountId}.
   */
  getAccount(domainId: string, accountId: string): Promise<Core_ApiAccount>
}
