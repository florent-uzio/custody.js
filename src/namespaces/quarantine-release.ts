import { isUndefined, paginate } from "../helpers/index.js"
import type { DomainUserReference } from "../models/domain-resolver.js"
import { CustodyError } from "../models/index.js"
import { buildRequestEnvelope, waitForExecution } from "./intents.js"
import type {
  Core_IntentResponse,
  Core_ProposeIntentBody,
  Core_TrustedIntent,
  IntentEnvelopeOptions,
  WaitForExecutionOptions,
} from "./intents.types.js"
import type {
  Core_TransfersCollection,
  Core_v0_ReleaseQuarantinedTransfers,
  ReleaseQuarantinedTransfersAndWaitResult,
  ReleaseQuarantinedTransfersResult,
  TransferTransactionOrderQueryParams,
} from "./transactions.types.js"

// The release flow behind `transactions.releaseQuarantinedTransfers` and
// `xrpl.releaseQuarantinedTransfers`.
//
// Internal: `src/index.ts` does not re-export this module, so its types are
// not public API. The public option and result types stay in
// `transactions.types.ts`.

/** The account a release is for, and the user its intent is authored by. */
export type QuarantineReleaseAccount = DomainUserReference & { accountId: string }

/**
 * The I/O a release needs. `XrplPorts` satisfies it as-is; the `transactions`
 * namespace backs it with the transport.
 */
export type QuarantineReleasePorts = {
  /** One page of the domain's transfers (GET /v1/domains/{domainId}/transactions/transfers) */
  listTransfers(
    domainId: string,
    query: TransferTransactionOrderQueryParams,
  ): Promise<Core_TransfersCollection>
  /** Proposes an intent (POST /v1/intents) */
  submitIntent(body: Core_ProposeIntentBody): Promise<Core_IntentResponse>
  /** Reads an intent back, for the wait (GET /v1/domains/{domainId}/intents/{intentId}) */
  getIntent(domainId: string, intentId: string): Promise<Core_TrustedIntent>
}

/**
 * What a caller of the shared release flow supplies: the selection, and how
 * to find the account and the tickers an `all: true` release is narrowed to.
 * This is the only part that differs between `transactions.*` (by account id)
 * and `xrpl.*` (by address, and MPT issuance). `TAccount` lets a caller hand
 * its own richer account (the XRPL one carries its `ledgerId`) to
 * `resolveTickerIds`.
 */
export type QuarantineReleaseTarget<
  TAccount extends QuarantineReleaseAccount = QuarantineReleaseAccount,
> = {
  selection: { all?: true; transferIds?: string[] }
  resolveAccount: () => Promise<TAccount>
  /** `undefined` releases every ticker. Only called for `all: true`. */
  resolveTickerIds: (account: TAccount) => Promise<string[] | undefined>
}

/**
 * Reads the ids of every transfer currently quarantined for an account,
 * walking every page of the collection.
 *
 * Filters on the deprecated `quarantined: true` rather than
 * `quarantineStatus: "Quarantined"`: some Ripple Custody versions answer the
 * latter with a 500 (#238), and the two return the same rows for this case.
 * The boolean only loses `Released` vs `Skipped`, which a release never needs.
 *
 * With `tickerIds`, runs one walk per ticker (the endpoint filters on a single
 * `tickerId`) and returns their union.
 *
 * Takes the lookup as a callback so it runs through whichever
 * {@link QuarantineReleasePorts} the release was given.
 */
async function collectQuarantinedTransferIds(
  listTransfers: (query: TransferTransactionOrderQueryParams) => Promise<Core_TransfersCollection>,
  accountId: string,
  tickerIds?: string[],
): Promise<string[]> {
  const ids = new Set<string>()

  for (const tickerId of tickerIds ?? [undefined]) {
    const fetchPage = (startingAfter: string | undefined) =>
      listTransfers({
        "recipient.accountId": [accountId],
        quarantined: true,
        limit: 100,
        startingAfter,
        ...(!isUndefined(tickerId) && { tickerId }),
      })

    for await (const transfer of paginate(fetchPage)) {
      ids.add(transfer.id)
    }
  }

  return [...ids]
}

/**
 * Reads the explicit transfer ids off a release selection: the list for
 * `{ transferIds }`, `undefined` for `{ all: true }`.
 *
 * The types already require exactly one of the two; this catches untyped
 * callers that pass neither, before anything is looked up or proposed.
 */
function explicitTransferIds(
  selection: QuarantineReleaseTarget["selection"],
): string[] | undefined {
  if (selection.all === true) return undefined

  if (!Array.isArray(selection.transferIds)) {
    throw new CustodyError({
      reason:
        "A release needs either `transferIds` or `all: true`. " +
        "It bypasses custody's compliance review, so nothing is released by default.",
    })
  }

  return selection.transferIds
}

/** The release intent's payload. */
const releasePayload = (
  accountId: string,
  transferIds: string[],
): Core_v0_ReleaseQuarantinedTransfers => ({
  type: "v0_ReleaseQuarantinedTransfers",
  accountId,
  transferIds,
})

/**
 * The release flow both `transactions.releaseQuarantinedTransfers` and
 * `xrpl.releaseQuarantinedTransfers` run: check the selection, find the
 * account, collect the quarantined transfer ids (unless they were given),
 * and propose one `v0_ReleaseQuarantinedTransfers` intent — or nothing, when
 * there is nothing to release.
 *
 * The callers differ only in `target` (how the account and tickers are
 * found); the I/O goes through `ports`, which `XrplPorts` satisfies as-is.
 */
export async function proposeRelease<TAccount extends QuarantineReleaseAccount>(
  ports: QuarantineReleasePorts,
  target: QuarantineReleaseTarget<TAccount>,
  options: IntentEnvelopeOptions,
): Promise<ReleaseQuarantinedTransfersResult> {
  // Checked before any request, so a bad selection costs nothing.
  const explicit = explicitTransferIds(target.selection)
  const account = await target.resolveAccount()
  const { domainId, accountId } = account

  const transferIds =
    explicit ??
    (await collectQuarantinedTransferIds(
      (query) => ports.listTransfers(domainId, query),
      accountId,
      await target.resolveTickerIds(account),
    ))

  if (transferIds.length === 0) return { proposed: false, transferIds: [], domainId }

  const requestEnvelope = buildRequestEnvelope(
    account,
    options,
    releasePayload(accountId, transferIds),
  )
  const response = await ports.submitIntent({ request: { ...requestEnvelope, type: "Propose" } })

  return { ...response, intentId: requestEnvelope.id, domainId, proposed: true, transferIds }
}

/**
 * {@link proposeRelease}, then waits for the release intent to reach a
 * terminal status. A release has no ledger transaction, so it is finished
 * when its intent is.
 */
export async function proposeReleaseAndWait<TAccount extends QuarantineReleaseAccount>(
  ports: QuarantineReleasePorts,
  target: QuarantineReleaseTarget<TAccount>,
  options: IntentEnvelopeOptions & WaitForExecutionOptions,
): Promise<ReleaseQuarantinedTransfersAndWaitResult> {
  const released = await proposeRelease(ports, target, options)
  if (!released.proposed) return released

  const { domainId, intentId } = released
  const outcome = await waitForExecution(
    () => ports.getIntent(domainId, intentId),
    intentId,
    options,
  )

  return { ...outcome, ...released }
}
