import { URLs } from "../../constants/urls.js"
import type { Transport } from "../../transport/index.js"
import { createVirtualLedgerAccounts } from "./accounts.js"
import type {
  CreateVirtualLedgerOperationPathParams,
  CreateVirtualLedgerPathParams,
  GetVirtualLedgerBalancesPathParams,
  GetVirtualLedgerPathParams,
  ListVirtualLedgerOperationsPathParams,
  ListVirtualLedgerOperationsQueryParams,
  ListVirtualLedgersPathParams,
  ListVirtualLedgersQueryParams,
  ListVirtualLedgerTransfersPathParams,
  ListVirtualLedgerTransfersQueryParams,
  UpdateVirtualLedgerPathParams,
  VirtualAccounting_BalanceCollectionResponse,
  VirtualAccounting_OperationIn,
  VirtualAccounting_OperationOut,
  VirtualAccounting_OperationOutPagedCollectionResponse,
  VirtualAccounting_TransferBasePagedCollectionResponse,
  VirtualAccounting_VirtualLedgerIn,
  VirtualAccounting_VirtualLedgerOut,
  VirtualAccounting_VirtualLedgerOutPagedCollectionResponse,
  VirtualAccounting_VirtualLedgerUpdate,
} from "./virtual-ledgers.types.js"

/**
 * Virtual ledger accounting namespace (`client.virtualLedgers.*`), mirroring the
 * `/v1/domains/{domainId}/virtual-ledgers/*` URL structure. Per-account operations
 * (balances, addresses, deposit-identification sources) are nested under `accounts`.
 */
export function createVirtualLedgers(t: Transport) {
  return {
    list: (
      params: ListVirtualLedgersPathParams,
      query?: ListVirtualLedgersQueryParams,
    ): Promise<VirtualAccounting_VirtualLedgerOutPagedCollectionResponse> =>
      t.get(URLs.virtualLedgers, params, query),

    create: (
      params: CreateVirtualLedgerPathParams,
      body: VirtualAccounting_VirtualLedgerIn,
    ): Promise<VirtualAccounting_VirtualLedgerOut> =>
      t.post(URLs.virtualLedgers, body, params, { sign: false }),

    get: (params: GetVirtualLedgerPathParams): Promise<VirtualAccounting_VirtualLedgerOut> =>
      t.get(URLs.virtualLedger, params),

    update: (
      params: UpdateVirtualLedgerPathParams,
      body: VirtualAccounting_VirtualLedgerUpdate,
    ): Promise<void> => t.put(URLs.virtualLedger, body, params),

    getBalances: (
      params: GetVirtualLedgerBalancesPathParams,
    ): Promise<VirtualAccounting_BalanceCollectionResponse> =>
      t.get(URLs.virtualLedgerBalances, params),

    listOperations: (
      params: ListVirtualLedgerOperationsPathParams,
      query?: ListVirtualLedgerOperationsQueryParams,
    ): Promise<VirtualAccounting_OperationOutPagedCollectionResponse> =>
      t.get(URLs.virtualLedgerOperations, params, query),

    createOperation: (
      params: CreateVirtualLedgerOperationPathParams,
      body: VirtualAccounting_OperationIn,
    ): Promise<VirtualAccounting_OperationOut> =>
      t.post(URLs.virtualLedgerOperations, body, params, { sign: false }),

    listTransfers: (
      params: ListVirtualLedgerTransfersPathParams,
      query?: ListVirtualLedgerTransfersQueryParams,
    ): Promise<VirtualAccounting_TransferBasePagedCollectionResponse> =>
      t.get(URLs.virtualLedgerTransfers, params, query),

    accounts: createVirtualLedgerAccounts(t),
  } as const
}
