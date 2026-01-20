import type { components, operations } from "../../models/custody-types.js"
import type { Prettify, RequiredExceptFor } from "../../type-utils/index.js"

// Request types

// Make domainId optional for better DX
export type GetTransactionOrdersPathParams = Prettify<
  RequiredExceptFor<operations["getOrders"]["parameters"]["path"], "domainId">
>
export type GetTransactionOrdersQueryParams = operations["getOrders"]["parameters"]["query"]

// Make domainId optional for better DX
export type GetTransactionOrderDetailsPathParams = Prettify<
  RequiredExceptFor<operations["getOrder"]["parameters"]["path"], "domainId">
>

// Make domainId optional for better DX
export type TransferTransactionOrderPathParams = Prettify<
  RequiredExceptFor<operations["getTransfers"]["parameters"]["path"], "domainId">
>
export type TransferTransactionOrderQueryParams = operations["getTransfers"]["parameters"]["query"]

// Make domainId optional for better DX
export type GetTransferDetailsPathParams = Prettify<
  RequiredExceptFor<operations["getTransfer"]["parameters"]["path"], "domainId">
>

// Make domainId optional for better DX
export type GetTransactionsPathParams = Prettify<
  RequiredExceptFor<operations["getTransactions"]["parameters"]["path"], "domainId">
>
export type GetTransactionsQueryParams = operations["getTransactions"]["parameters"]["query"]

// Make domainId optional for better DX
export type GetTransactionDetailsPathParams = Prettify<
  RequiredExceptFor<operations["getTransaction"]["parameters"]["path"], "domainId">
>
export type GetTransactionDetailsQueryParams = operations["getTransaction"]["parameters"]["query"]

// Make domainId optional for better DX
export type DryRunTransactionPathParams = Prettify<
  RequiredExceptFor<operations["dryRunTransaction"]["parameters"]["path"], "domainId">
>
export type Core_DryRunTransactionParameters =
  operations["dryRunTransaction"]["requestBody"]["content"]["application/json"]

// Response types
export type Core_TrustedTransactionOrdersCollection =
  components["schemas"]["Core_TrustedTransactionOrdersCollection"]

export type Core_TrustedTransactionOrderDetails =
  components["schemas"]["Core_TrustedTransactionOrder"]

export type Core_TransfersCollection = components["schemas"]["Core_TransfersCollection"]

export type Core_TransferDetails = components["schemas"]["Core_ApiTransfer"]

export type Core_TransactionsCollection = components["schemas"]["Core_TransactionsCollection"]

export type Core_TransactionDetails = components["schemas"]["Core_ApiTransaction"]

export type Core_TransactionDryRun = components["schemas"]["Core_TransactionDryRun"]
