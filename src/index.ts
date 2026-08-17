export { DEFAULT_TIMEOUT_MS } from "./constants/index.js"
export { RippleCustody } from "./ripple-custody.js"
export type {
  BeforeSignHook,
  CustodyDebugClient,
  CustodyDebugEvent,
  CustodyDebugLogger,
  CustodyHttpMethod,
  CustodySignContext,
  CustodySignRequest,
  CustodySignedRequest,
  CustodySigner,
  RippleCustodyClientOptions,
} from "./ripple-custody.types.js"

// out-of-band signing helpers: canonicalizeRequest produces the canonical JSON
// pre-hash input for a request body; prepareSigningInput turns it into the exact
// bytes the raw signing primitive runs over for a given algorithm and context
export { canonicalizeRequest } from "./helpers/canonicalize/index.js"
export { prepareSigningInput } from "./services/keypairs/signing-scheme.js"

// pagination: every list endpoint returns one page, so `paginate` walks the
// `nextStartingAfter` cursor for you rather than leaving each call site to
// notice the truncation on its own
export { paginate } from "./helpers/paginate/index.js"
export type { CursorPage } from "./helpers/paginate/index.js"

// shared SDK-only types
export type { LedgerId, NonXrplLedgerId, XrplLedgerId } from "./models/ledger-ids.js"

// keypairs types
export { KeypairService } from "./services/keypairs/index.js"
export type {
  KeyPair,
  KeypairAlgorithm,
  KeypairDefinition,
} from "./services/keypairs/keypairs.types.js"

// intents types
export type * from "./namespaces/intents.types.js"
export { PENDING_STATUSES, TERMINAL_STATUSES } from "./namespaces/intents.types.js"

// domains types
export type * from "./namespaces/domains.types.js"

// sponsors (gas station) types
export type * from "./namespaces/sponsors.types.js"

// omnibus types
export type * from "./namespaces/omnibus/omnibus.types.js"

// endpoints types
export type * from "./namespaces/endpoints.types.js"

// events types
export type * from "./namespaces/events.types.js"

// exports (reports) types
export type * from "./namespaces/exports.types.js"

// compliance types (all Compliance*-prefixed aliases across the 5 sub-domains)
export type * from "./namespaces/compliance/analysis.types.js"
export type * from "./namespaces/compliance/domain.types.js"
export type * from "./namespaces/compliance/policy.types.js"
export type * from "./namespaces/compliance/providers.types.js"
export type * from "./namespaces/compliance/travel-rule.types.js"

// health types
export type * from "./namespaces/health.types.js"

// backups types
export type * from "./namespaces/backups.types.js"

// providers types
export type * from "./namespaces/providers.types.js"

// trusted public keys types
export type * from "./namespaces/trusted-public-keys.types.js"

// channels (EDS) types and helpers
export { parseEventPayload, verifyWebhookSecret } from "./services/channels/index.js"
export type {
  CreateChannelPathParams,
  DeleteChannelPathParams,
  EDS_Channel,
  EDS_ChannelCreate,
  EDS_ChannelUpdate,
  EDS_Event,
  EDS_WebhookChannelCreate,
  EDS_WebhookEvent,
  GetAllChannelsEventsPathParams,
  GetChannelEventPathParams,
  GetChannelEventsPathParams,
  GetChannelPathParams,
  GetChannelsPathParams,
  TestChannelPathParams,
  UpdateChannelPathParams,
  VerifyWebhookSecretOptions,
} from "./services/channels/index.js"

// accounts types
export type * from "./namespaces/accounts.types.js"
export { TERMINAL_PARAMETERS_COMPUTE_STATUSES } from "./namespaces/accounts.types.js"

// internal-surface types (ADR-0007): the internal `operations` map itself stays
// unexported, only the namespace-facing aliases derived from it
export type * from "./namespaces/internal/cb-in-decryption.types.js"
export { TERMINAL_CB_IN_DECRYPTION_STATUSES } from "./namespaces/internal/cb-in-decryption.types.js"

// transactions types
export type * from "./namespaces/transactions.types.js"
export {
  PENDING_TRANSACTION_STATUSES,
  TERMINAL_TRANSACTION_STATUSES,
} from "./namespaces/transactions.types.js"

// users types
export type * from "./namespaces/users.types.js"

// requests types
export type * from "./namespaces/requests.types.js"

// system properties types
export type * from "./namespaces/system-properties.types.js"

// user invitations types
export type * from "./namespaces/user-invitations.types.js"

// domain resolver types — the shapes `domains.me()` takes and returns
export type { DomainResolveOptions, DomainUserReference } from "./models/domain-resolver.js"

// tickers types
export type * from "./namespaces/tickers.types.js"

// ledgers types
export type * from "./namespaces/ledgers.types.js"

// policies types
export type * from "./namespaces/policies.types.js"

// vaults types
export type * from "./namespaces/vaults.types.js"

// xrpl types and functions
export {
  batchSignersToCustodyBatchSigners,
  batchToCustodyBatchPayload,
  batchToCustodyInnerTransactions,
  isSendCryptographicFields,
  parametersComputeToCryptographicFields,
} from "./services/xrpl/index.js"
export type {
  BatchPayloadInput,
  BatchToCustodyOptions,
  BuildConfidentialSendOptions,
  BuildConfidentialSendParams,
  ConfidentialSendEntryFields,
  ConfidentialSendLeg,
  Core_ApiBatchSigningData,
  Core_ApiParametersComputeCryptographicFields,
  Core_BatchEntry,
  Core_BatchExecutionMode,
  Core_BatchInnerOperation_ConfidentialMPTSend,
  Core_BatchSigner,
  Core_CmptCryptographicFields,
  Core_IntentDryRunResponse_v0_CreateTransactionOrder,
  Core_Sequencing,
  Core_TransactionEstimate_XRPL,
  Core_XrplOperation,
  CustodyAccountSet,
  CustodyBatch,
  CustodyClawback,
  CustodyDepositPreauth,
  CustodyMpTokenAuthorize,
  CustodyMpTokenIssuanceCreate,
  CustodyMpTokenIssuanceDestroy,
  CustodyMpTokenIssuanceSet,
  CustodyOfferCreate,
  CustodyPayment,
  CustodyTicketCreate,
  CustodyTrustline,
  GetElGamalPublicKeyOptions,
  RawSignAndWaitOptions,
  RawSignAndWaitResult,
  SignBatchPayloadOptions,
  SignBatchPayloadResult,
  WaitForElGamalPublicKeyOptions,
  WaitForMptIssuanceIdOptions,
  WaitForSignatureOptions,
  XrplAccountReference,
  XrplIntentOptions,
  XrplPorts,
} from "./services/xrpl/index.js"

// genesis types
export type * from "./namespaces/genesis.types.js"

// errors types
export type { Core_ErrorMessage, CustodyError } from "./models/index.js"

// versioning (multi-version capability gating)
export type { KnownAppVersion } from "./models/capabilities.generated.js"
export type { SpecSource } from "./versioning/detect.js"
export { UnsupportedInVersionError } from "./versioning/version-guard.js"
export type { CapabilityKind } from "./versioning/version-guard.js"
