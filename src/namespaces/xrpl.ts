import type { SubmittableTransaction } from "xrpl"
import type {
  BatchPayloadInput,
  Core_ApiBatchSigningData,
  Core_BatchSigner,
  Core_XrplOperation,
  GetBatchSignatureParams,
  GetElGamalPublicKeyOptions,
  GetMptIssuanceIdParams,
  RawSignAndWaitOptions,
  RawSignAndWaitResult,
  SignBatchPayloadHandle,
  SignBatchPayloadOptions,
  SignBatchPayloadResult,
  WaitForMptIssuanceIdOptions,
  WaitForSignatureOptions,
  XrplIntentOptions,
  XrplService,
} from "../services/xrpl/index.js"
import type { Core_IntentResponse } from "./intents.types.js"

/**
 * XRPL namespace — propose XRPL transaction intents, raw-sign transactions,
 * and drive the XLS-56 Batch flow.
 *
 * @param getService - Accessor for the lazily-constructed `XrplService`
 */
export function createXrpl(getService: () => XrplService) {
  return {
    /**
     * Propose any XRPL transaction as a custody intent.
     *
     * The `operation` uses a discriminated union on `type` — callers specify
     * which transaction type to propose (e.g. `{ type: "Payment", ... }`).
     * TypeScript autocomplete shows all available operation types and their fields.
     *
     * @param params - The Account address and XRPL operation
     * @param options - Optional configuration for the intent
     * @returns The proposed intent response
     */
    proposeIntent: async (
      params: { Account: string; operation: Core_XrplOperation },
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => getService().proposeIntent(params, options),

    /**
     * Provision the ElGamal key pair a confidential MPT (cMPT) account needs.
     *
     * Required for every participant — issuer, senders, receivers, and the
     * auditor when configured — before any confidential operation is accepted.
     * Read the resulting public key back with `getElGamalPublicKey`.
     *
     * @param address - XRPL address of the account to provision
     * @param options - Optional configuration for the intent
     * @returns The proposed intent response
     */
    provisionElGamalKeyPair: async (
      address: string,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => getService().provisionElGamalKeyPair(address, options),

    /**
     * Read an account's base64 ElGamal public key for a ledger — the value
     * `MPTokenIssuanceSet` takes as `issuerEncryptionKey` / `auditorEncryptionKey`.
     *
     * The domain, account and ledger are resolved from the address; pass
     * `domainId` / `ledgerId` only when the address is registered more than once.
     *
     * @param address - XRPL address of the account whose key to read
     * @param options - Domain and ledger, when the address alone is ambiguous
     * @returns The ElGamal public key, base64-encoded
     */
    getElGamalPublicKey: async (
      address: string,
      options?: GetElGamalPublicKeyOptions,
    ): Promise<string> => getService().getElGamalPublicKey(address, options),

    /**
     * Resolve the MPT issuance ID an executed `MPTokenIssuanceCreate` produced,
     * from the payload ID of its transaction order.
     *
     * @param params - Domain and the payload ID of the `MPTokenIssuanceCreate` order
     * @returns The 192-bit MPT issuance ID, hex-encoded
     */
    getMptIssuanceId: async (params: GetMptIssuanceIdParams): Promise<string> =>
      getService().getMptIssuanceId(params),

    /**
     * Resolve the MPT issuance ID an executed `MPTokenIssuanceCreate` produced,
     * polling until the transaction its order registered carries the issuance.
     *
     * Custody fills that ledger data in shortly *after* the intent reports
     * `Executed`, so prefer this over `getMptIssuanceId` when reading the
     * issuance straight after `intents.getAndWait`.
     *
     * @param params - Domain and the payload ID of the `MPTokenIssuanceCreate` order
     * @param options - Polling configuration (default: 10 attempts, 3s apart)
     * @returns The 192-bit MPT issuance ID, hex-encoded
     */
    getMptIssuanceIdAndWait: async (
      params: GetMptIssuanceIdParams,
      options?: WaitForMptIssuanceIdOptions,
    ): Promise<string> => getService().getMptIssuanceIdAndWait(params, options),

    /**
     * Create an XRPL raw sign.
     * @param xrplTransaction - The XRPL transaction details
     * @param options - Optional configuration for the raw sign intent
     * @returns The proposed intent response
     */
    rawSign: async (
      xrplTransaction: SubmittableTransaction,
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => getService().rawSign(xrplTransaction, options),

    /**
     * Raw-signs an XRPL transaction and waits for the manifest signature.
     * If SigningPubKey is not set on the transaction, it will be fetched automatically.
     * @param xrplTransaction - The XRPL transaction details
     * @param options - Optional configuration for the raw sign intent and polling
     * @returns The signature and signing public key in uppercase hex
     */
    rawSignAndWait: async (
      xrplTransaction: SubmittableTransaction,
      options?: RawSignAndWaitOptions,
    ): Promise<RawSignAndWaitResult> => getService().rawSignAndWait(xrplTransaction, options),

    /**
     * Step 1 of the XLS-56 Batch flow — dry-runs a Batch and returns the
     * canonical signing data. Each participant signs `signingPayload` with
     * their own XRPL key; collect signatures and pass them to `proposeBatch`.
     *
     * @param payload - Submitter, execution mode, and inner entries
     * @param options - Optional configuration for the dry-run intent
     * @returns The batch signing data (signingPayload, hash, resolved transactions)
     */
    dryRunBatch: async (
      payload: BatchPayloadInput,
      options?: XrplIntentOptions,
    ): Promise<Core_ApiBatchSigningData> => getService().dryRunBatch(payload, options),

    /**
     * Step 2 of the XLS-56 Batch flow — signs the `signingPayload` from a dry
     * run for an inner account managed by this custody instance and waits for
     * the manifest signature. Call once per locally-managed signer.
     *
     * @param signingPayload - Hex-encoded payload from `dryRunBatch`
     * @param signerAddress - The XRPL address of the inner account to sign for
     * @param options - Optional configuration for the raw sign intent and polling
     * @returns Signature, public key, and pre-built BatchSigner shapes
     */
    signBatchPayloadAndWait: async (
      signingPayload: string,
      signerAddress: string,
      options?: SignBatchPayloadOptions,
    ): Promise<SignBatchPayloadResult> =>
      getService().signBatchPayloadAndWait(signingPayload, signerAddress, options),

    /**
     * Step 2 of the XLS-56 Batch flow (non-blocking) — proposes the raw sign
     * intent for an inner account managed by this custody instance and returns
     * immediately, without waiting for the manifest signature.
     *
     * Use when the operator approves signatures out-of-band: persist the
     * returned handle and pass it to `getBatchSignature` later to fetch the
     * signature once available.
     *
     * @param signingPayload - Hex-encoded payload from `dryRunBatch`
     * @param signerAddress - The XRPL address of the inner account to sign for
     * @param options - Optional configuration for the raw sign intent
     * @returns A handle with the manifest ID and fields needed to retrieve the signature
     */
    signBatchPayload: async (
      signingPayload: string,
      signerAddress: string,
      options?: SignBatchPayloadOptions,
    ): Promise<SignBatchPayloadHandle> =>
      getService().signBatchPayload(signingPayload, signerAddress, options),

    /**
     * Retrieves the signature for a payload proposed via `signBatchPayload`,
     * building the BatchSigner shapes when available.
     *
     * Performs a single fetch by default; returns `undefined` if the operator
     * has not approved the signature yet. Pass `maxRetries`/`intervalMs` to opt
     * into light polling.
     *
     * @param params - Fields from the `signBatchPayload` handle (a handle may be passed directly)
     * @param options - Optional polling configuration (defaults to a single attempt)
     * @returns Signature and BatchSigner shapes, or `undefined` if not yet signed
     */
    getBatchSignature: async (
      params: GetBatchSignatureParams,
      options?: WaitForSignatureOptions,
    ): Promise<SignBatchPayloadResult | undefined> =>
      getService().getBatchSignature(params, options),

    /**
     * Step 3 of the XLS-56 Batch flow — submits the Batch with collected
     * `batchSigners`. Reuse `options.payloadId`/`options.requestId` if you
     * need referential identity with the dry-run.
     *
     * @param payload - Same submitter, execution mode, and entries as the dry-run
     * @param batchSigners - Signatures collected in Step 2
     * @param options - Optional configuration for the intent
     * @returns The proposed intent response
     */
    proposeBatch: async (
      payload: BatchPayloadInput,
      batchSigners: Core_BatchSigner[],
      options?: XrplIntentOptions,
    ): Promise<Core_IntentResponse> => getService().proposeBatch(payload, batchSigners, options),

    /**
     * Get the compressed secp256k1 public key for an XRPL account.
     * @param params - The domain ID and account ID
     * @returns The compressed public key in uppercase hex format
     */
    getPublicKey: async (params: { domainId: string; accountId: string }): Promise<string> =>
      getService().getPublicKey(params),
  } as const
}
