import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
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
} from "./transactions.types.js"

export function createTransactions(t: Transport) {
  return {
    orders: (
      params: GetTransactionOrdersPathParams,
      query?: GetTransactionOrdersQueryParams,
    ): Promise<Core_TrustedTransactionOrdersCollection> =>
      t.get(URLs.transactionOrders, params, query),

    order: (
      params: GetTransactionOrderDetailsPathParams,
    ): Promise<Core_TrustedTransactionOrderDetails> => t.get(URLs.transactionOrder, params),

    transfers: (
      params: TransferTransactionOrderPathParams,
      query?: TransferTransactionOrderQueryParams,
    ): Promise<Core_TransfersCollection> => t.get(URLs.transactionTransfers, params, query),

    transfer: (params: GetTransferDetailsPathParams): Promise<Core_TransferDetails> =>
      t.get(URLs.transactionTransfer, params),

    transactions: (
      params: GetTransactionsPathParams,
      query?: GetTransactionsQueryParams,
    ): Promise<Core_TransactionsCollection> => t.get(URLs.transactions, params, query),

    transaction: (params: GetTransactionDetailsPathParams): Promise<Core_TransactionDetails> =>
      t.get(URLs.transaction, params),

    dryRun: (
      params: DryRunTransactionPathParams,
      body: Core_DryRunTransactionParameters,
    ): Promise<Core_TransactionDryRun> =>
      t.post(URLs.transactionsDryRun, body, params, { sign: false }),
  } as const
}
