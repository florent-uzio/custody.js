import { URLs } from "../../constants/urls.js"
import type { Transport } from "../../transport/index.js"
import type {
  AssignVirtualLedgerAccountDepositIdentificationSourcePathParams,
  CreateVirtualLedgerAccountPathParams,
  GetVirtualLedgerAccountAddressesPathParams,
  GetVirtualLedgerAccountAddressesQueryParams,
  GetVirtualLedgerAccountBalancesPathParams,
  ListVirtualLedgerAccountsPathParams,
  ListVirtualLedgerAccountsQueryParams,
  UpdateVirtualLedgerAccountPathParams,
  VirtualAccounting_BalanceCollectionResponse,
  VirtualAccounting_DepositIdentificationSourceBaseIn,
  VirtualAccounting_LedgerAddressPagedCollectionResponse,
  VirtualAccounting_VirtualAccountIn,
  VirtualAccounting_VirtualAccountOut,
  VirtualAccounting_VirtualAccountOutPagedCollectionResponse,
  VirtualAccounting_VirtualAccountUpdate,
} from "./virtual-ledgers.types.js"

/**
 * Virtual ledger account sub-namespace (`client.virtualLedgers.accounts.*`).
 */
export function createVirtualLedgerAccounts(t: Transport) {
  return {
    list: (
      params: ListVirtualLedgerAccountsPathParams,
      query?: ListVirtualLedgerAccountsQueryParams,
    ): Promise<VirtualAccounting_VirtualAccountOutPagedCollectionResponse> =>
      t.get(URLs.virtualLedgerAccounts, params, query),

    create: (
      params: CreateVirtualLedgerAccountPathParams,
      body: VirtualAccounting_VirtualAccountIn,
    ): Promise<VirtualAccounting_VirtualAccountOut> =>
      t.post(URLs.virtualLedgerAccounts, body, params, { sign: false }),

    update: (
      params: UpdateVirtualLedgerAccountPathParams,
      body: VirtualAccounting_VirtualAccountUpdate,
    ): Promise<void> => t.put(URLs.virtualLedgerAccount, body, params),

    getBalances: (
      params: GetVirtualLedgerAccountBalancesPathParams,
    ): Promise<VirtualAccounting_BalanceCollectionResponse> =>
      t.get(URLs.virtualLedgerAccountBalances, params),

    assignDepositIdentificationSource: (
      params: AssignVirtualLedgerAccountDepositIdentificationSourcePathParams,
      body: VirtualAccounting_DepositIdentificationSourceBaseIn,
    ): Promise<void> =>
      t.post(URLs.virtualLedgerAccountDepositIdentificationSources, body, params, {
        sign: false,
      }),

    getAddresses: (
      params: GetVirtualLedgerAccountAddressesPathParams,
      query?: GetVirtualLedgerAccountAddressesQueryParams,
    ): Promise<VirtualAccounting_LedgerAddressPagedCollectionResponse> =>
      t.get(URLs.virtualLedgerAccountAddresses, params, query),
  } as const
}
