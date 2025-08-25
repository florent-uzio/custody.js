import type { components, operations } from "../../models/custody-types.js"

// Request types
export type GetTransactionOrdersPathParams = operations["getOrders"]["parameters"]["path"]
export type GetTransactionOrdersQueryParams = operations["getOrders"]["parameters"]["query"]

export type GetTransactionOrderDetailsPathParams = operations["getOrder"]["parameters"]["path"]

export type TransferTransactionOrderPathParams = operations["getTransfers"]["parameters"]["path"]
export type TransferTransactionOrderQueryParams = operations["getTransfers"]["parameters"]["query"]

export type GetTransferDetailsPathParams = operations["getTransfer"]["parameters"]["path"]

export type GetTransactionsPathParams = operations["getTransactions"]["parameters"]["path"]
export type GetTransactionsQueryParams = operations["getTransactions"]["parameters"]["query"]

export type GetTransactionDetailsPathParams = operations["getTransaction"]["parameters"]["path"]
export type GetTransactionDetailsQueryParams = operations["getTransaction"]["parameters"]["query"]

// Response types
export type Core_TrustedTransactionOrdersCollection =
  components["schemas"]["Core_TrustedTransactionOrdersCollection"]

export type Core_TrustedTransactionOrderDetails =
  components["schemas"]["Core_TrustedTransactionOrder"]

export type Core_TransfersCollection = components["schemas"]["Core_TransfersCollection"]

export type Core_TransferDetails = components["schemas"]["Core_ApiTransfer"]

export type Core_TransactionsCollection = components["schemas"]["Core_TransactionsCollection"]

export type Core_TransactionDetails = components["schemas"]["Core_ApiTransaction"]
