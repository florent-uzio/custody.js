export { DEFAULT_TIMEOUT_MS } from "./constants/index.js"
export { RippleCustody } from "./ripple-custody.js"
export type { RippleCustodyClientOptions } from "./ripple-custody.types.js"

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
export { PENDING_STATUSES, TERMINAL_STATUSES } from "./services/intents/index.js"
export type {
  Core_ApproveIntentBody,
  Core_GetIntentPathParams,
  Core_GetIntentsPathParams,
  Core_GetIntentsQueryParams,
  Core_IntentDryRunRequest,
  Core_IntentDryRunResponse,
  Core_IntentResponse,
  Core_IntentStatus,
  Core_ProposeIntentBody,
  Core_RejectIntentBody,
  Core_RemainingDomainUsers,
  Core_RemainingUsersIntentPathParams,
  Core_RemainingUsersIntentQueryParams,
  Core_TrustedIntent,
  WaitForExecutionOptions,
  WaitForExecutionResult,
} from "./services/intents/index.js"

// domains types
export type {
  Core_TrustedDomain,
  Core_TrustedDomainsCollection,
  GetDomainPathParams,
  GetDomainsQueryParams,
} from "./services/domains/index.js"

// sponsors (gas station) types
export type {
  AddSponsoredAccountsPathParams,
  AddSponsoredDomainsPathParams,
  CreateSponsorPathParams,
  DeleteSponsorPathParams,
  DeleteSponsorQueryParams,
  GasStation_AccountSponsorResponseDto,
  GasStation_AddSponsoredAccountsDto,
  GasStation_AddSponsoredDomainsDto,
  GasStation_CreateSponsorDto,
  GasStation_DomainSponsorResponseDto,
  GasStation_EventsResponseDto,
  GasStation_SponsorCreatedResponseDto,
  GasStation_SponsorResponseDto,
  GasStation_SponsorableAccountsResponseDto,
  GasStation_SponsorableDomainsResponseDto,
  GasStation_SponsoredEntitiesResponseDto,
  GasStation_SponsoredModificationResponseDto,
  GasStation_SponsorsListResponseDto,
  GasStation_UpdateSponsorDto,
  GetAccountSponsorPathParams,
  GetDomainSponsorPathParams,
  GetSponsorPathParams,
  GetSponsorableAccountsPathParams,
  GetSponsorableAccountsQueryParams,
  GetSponsorableDomainsPathParams,
  GetSponsorableDomainsQueryParams,
  ListSponsorEventsPathParams,
  ListSponsorEventsQueryParams,
  ListSponsoredAccountsPathParams,
  ListSponsoredAccountsQueryParams,
  ListSponsoredDomainsPathParams,
  ListSponsoredDomainsQueryParams,
  ListSponsorsPathParams,
  UpdateSponsorPathParams,
} from "./services/sponsors/index.js"

// omnibus types
export type {
  CreateOmnibusInternalTransferPathParams,
  CreateOmnibusPathParams,
  CreateOmnibusTenantDepositWalletPathParams,
  CreateOmnibusTenantPathParams,
  CreateOmnibusWithdrawalPathParams,
  GetOmnibusByIdPathParams,
  GetOmnibusPathParams,
  GetOmnibusTenantDepositWalletPathParams,
  GetOmnibusTenantPathParams,
  ListOmnibusDepositWalletsPathParams,
  ListOmnibusDepositWalletsQueryParams,
  ListOmnibusInternalTransfersPathParams,
  ListOmnibusInternalTransfersQueryParams,
  ListOmnibusTenantsPathParams,
  ListOmnibusTenantsQueryParams,
  LockOmnibusPathParams,
  LockOmnibusTenantPathParams,
  Omnibus_CreateInternalTransferRequest,
  Omnibus_CreateOmnibusRequest,
  Omnibus_CreateOmnibusResponse,
  Omnibus_CreateOrUpdateTenantRequest,
  Omnibus_CreateWithdrawalRequest,
  Omnibus_CreateWithdrawalResponse,
  Omnibus_DepositWalletResponse,
  Omnibus_DepositWalletSummaryPageResponse,
  Omnibus_InternalTransferPageResponse,
  Omnibus_InternalTransferResponse,
  Omnibus_OmnibusResponse,
  Omnibus_TenantPageResponse,
  Omnibus_TenantResponse,
  Omnibus_UpdateOmnibusRequest,
  UnlockOmnibusPathParams,
  UnlockOmnibusTenantPathParams,
  UpdateOmnibusPathParams,
  UpdateOmnibusTenantPathParams,
} from "./services/omnibus/index.js"

// endpoints types
export type {
  Core_TrustedEndpoint,
  Core_TrustedEndpointsCollection,
  GetEndpointPathParams,
  GetEndpointsPathParams,
  GetEndpointsQueryParams,
} from "./services/endpoints/index.js"

// events types
export type {
  Core_EventScope,
  Core_EventsCollection,
  Core_HarmonizeEvent,
  Core_HarmonizeEventPayload,
  GetEventsPathParams,
  GetEventsQueryParams,
} from "./services/events/index.js"

// compliance types (all Compliance*-prefixed aliases across the 5 sub-domains)
export type * from "./services/compliance/index.js"

// channels (EDS) types and helpers
export { parseEventPayload } from "./services/channels/index.js"
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
} from "./services/channels/index.js"

// accounts types
export type {
  Core_AccountAddress,
  Core_AccountAddressReference,
  Core_AccountsCollection,
  Core_AddressReferenceCollection,
  Core_AddressesCollection,
  Core_ApiAccount,
  Core_ApiManifest,
  Core_BalancesCollection,
  Core_ComplianceConfiguration,
  Core_ComplianceConfigurationsCollection,
  Core_ManifestsCollection,
  FindByAddressOptions,
  ForceUpdateAccountBalancesPathParams,
  ForceUpdateAccountBalancesQueryParams,
  GenerateNewAccountExternalAddressDeprecatedPathParams,
  GenerateNewAccountExternalAddressDeprecatedQueryParams,
  GenerateNewExternalAddressPathParams,
  GetAccountAddressPathParams,
  GetAccountBalancesPathParams,
  GetAccountBalancesQueryParams,
  GetAccountPathParams,
  GetAccountQueryParams,
  GetAccountsPathParams,
  GetAccountsQueryParams,
  GetAddressesPathParams,
  GetAddressesQueryParams,
  GetAllDomainsAddressesQueryParams,
  GetComplianceConfigurationPathParams,
  GetManifestPathParams,
  GetManifestsPathParams,
  GetManifestsQueryParams,
  ListComplianceConfigurationsPathParams,
  ListComplianceConfigurationsQueryParams,
  UpsertComplianceConfigurationBody,
  UpsertComplianceConfigurationPathParams,
} from "./services/accounts/index.js"

// transactions types
export type {
  Core_DryRunTransactionParameters,
  Core_TransactionDetails,
  Core_TransactionDryRun,
  Core_TransactionsCollection,
  Core_TransferDetails,
  Core_TransfersCollection,
  Core_TrustedTransactionOrderDetails,
  Core_TrustedTransactionOrdersCollection,
  DryRunTransactionPathParams,
  GetTransactionDetailsPathParams,
  GetTransactionOrderDetailsPathParams,
  GetTransactionOrdersPathParams,
  GetTransactionOrdersQueryParams,
  GetTransactionsPathParams,
  GetTransactionsQueryParams,
  GetTransferDetailsPathParams,
  TransferTransactionOrderPathParams,
  TransferTransactionOrderQueryParams,
} from "./services/transactions/index.js"

// users types
export type {
  Core_ApiRoles,
  Core_MeReference,
  Core_TrustedUser,
  Core_TrustedUsersCollection,
  GetKnownUserRolesPathParams,
  GetUserPathParams,
  GetUsersPathParams,
  GetUsersQueryParams,
} from "./services/users/index.js"

// requests types
export type {
  Core_RequestState,
  GetAllUserRequestsStateInDomainPathParams,
  GetAllUserRequestsStateInDomainQueryParams,
  GetAllUserRequestsStateQueryParams,
  GetRequestStatePathParams,
  GetRequestStateQueryParams,
} from "./services/requests/index.js"

// user invitations types
export type {
  CancelUserInvitationPathParams,
  CompleteUserInvitationPathParams,
  CoreExtensions_InvitationAnswerIn,
  CoreExtensions_InvitationIn,
  CoreExtensions_InvitationOut,
  CoreExtensions_PublicInvitationOut,
  CreateUserInvitationPathParams,
  FillUserInvitationPathParams,
  GetPublicUserInvitationPathParams,
  GetUserInvitationPathParams,
  GetUserInvitationsPathParams,
  GetUserInvitationsQueryParams,
  RenewUserInvitationPathParams,
} from "./services/user-invitations/index.js"

// domain resolver types (DomainUserReference kept for callers who need it)
export type { DomainUserReference } from "./services/domain-resolver/index.js"

// tickers types
export type {
  Core_ApiTicker,
  Core_TickersCollection,
  GetTickerPathParams,
  GetTickersQueryParams,
} from "./services/tickers/index.js"

// ledgers types
export type {
  Core_CurrentFees,
  Core_EthereumCallResponse,
  Core_TrustedLedger,
  Core_TrustedLedgersCollection,
  GetLedgerFeePathParams,
  GetLedgerPathParams,
  GetLedgersQueryParams,
  GetTrustedLedgerPathParams,
  GetTrustedLedgersQueryParams,
  ProcessEthereumContractCallBody,
  ProcessEthereumContractCallPathParams,
} from "./services/ledgers/index.js"

// policies types
export type {
  Core_Policy,
  Core_PolicyCondition,
  Core_PolicyCondition_And,
  Core_PolicyCondition_Expression,
  Core_PolicyCondition_Or,
  Core_PolicyScope,
  Core_TrustedPoliciesCollection,
  Core_TrustedPolicy,
  GetPoliciesPathParams,
  GetPoliciesQueryParams,
  GetPolicyPathParams,
} from "./services/policies/index.js"

// vaults types
export type {
  Core_ApiVault,
  Core_ExportPreparedOperationsResponse,
  Core_VaultsCollection,
  ExportPreparedOperationsPathParams,
  GetVaultPathParams,
  GetVaultsQueryParams,
  ImportPreparedOperationsRequestBody,
} from "./services/vaults/index.js"

// xrpl types and functions
export {
  batchSignersToCustodyBatchSigners,
  batchToCustodyBatchPayload,
  batchToCustodyInnerTransactions,
} from "./services/xrpl/index.js"
export type {
  BatchPayloadInput,
  Core_ApiBatchSigningData,
  Core_BatchEntry,
  Core_BatchExecutionMode,
  Core_BatchSigner,
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
  RawSignAndWaitOptions,
  RawSignAndWaitResult,
  SignBatchPayloadOptions,
  SignBatchPayloadResult,
  WaitForSignatureOptions,
  XrplAccountReference,
  XrplIntentOptions,
  XrplPorts,
} from "./services/xrpl/index.js"

// genesis types
export type {
  Core_CreateLedgerGenesis,
  Core_GenesisCryptoSetup,
  Core_GenesisRequest,
  Core_RootDomainSetup,
  RunGenesisBody,
} from "./services/genesis/index.js"

// errors types
export type { Core_ErrorMessage, CustodyError } from "./models/index.js"

// versioning (multi-version capability gating)
export type { KnownAppVersion } from "./models/capabilities.generated.js"
export type { SpecSource } from "./versioning/detect.js"
export { UnsupportedInVersionError } from "./versioning/version-guard.js"
export type { CapabilityKind } from "./versioning/version-guard.js"
