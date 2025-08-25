export { RippleCustody } from "./ripple-custody.js"
export type { RippleCustodyClientOptions } from "./ripple-custody.types.js"

// intents types
export type {
  Core_ApproveIntentBody,
  Core_GetIntentPathParams,
  Core_GetIntentsPathParams,
  Core_GetIntentsQueryParams,
  Core_IntentDryRunRequest,
  Core_IntentDryRunResponse,
  Core_IntentResponse,
  Core_ProposeIntentBody,
  Core_RejectIntentBody,
  Core_RemainingDomainUsers,
  Core_RemainingUsersIntentPathParams,
  Core_RemainingUsersIntentQueryParams,
} from "./services/intents/index.js"

// domains types
export type {
  Core_TrustedDomain,
  Core_TrustedDomainsCollection,
  GetDomainPathParams,
  GetDomainsQueryParams,
} from "./services/domains/index.js"

// accounts types
export type {
  Core_AccountsCollection,
  Core_AddressReferenceCollection,
  GetAccountsPathParams,
  GetAccountsQueryParams,
  GetAllDomainsAddressesQueryParams,
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
