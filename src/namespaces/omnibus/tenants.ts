import { URLs } from "../../constants/urls.js"
import type { TypedTransport } from "../../transport/index.js"
import type {
  CreateOmnibusInternalTransferPathParams,
  CreateOmnibusTenantDepositWalletPathParams,
  CreateOmnibusTenantPathParams,
  CreateOmnibusWithdrawalPathParams,
  GetOmnibusTenantDepositWalletPathParams,
  GetOmnibusTenantPathParams,
  ListOmnibusTenantsPathParams,
  ListOmnibusTenantsQueryParams,
  LockOmnibusTenantPathParams,
  Omnibus_CreateInternalTransferRequest,
  Omnibus_CreateOrUpdateTenantRequest,
  Omnibus_CreateWithdrawalRequest,
  Omnibus_CreateWithdrawalResponse,
  Omnibus_DepositWalletResponse,
  Omnibus_InternalTransferResponse,
  Omnibus_TenantPageResponse,
  Omnibus_TenantResponse,
  UnlockOmnibusTenantPathParams,
  UpdateOmnibusTenantPathParams,
} from "./omnibus.types.js"

/**
 * Omnibus tenant sub-namespace (`client.omnibus.tenants.*`), with the
 * tenant's deposit-wallet operations nested under `depositWallet`.
 */
export function createOmnibusTenants(t: TypedTransport) {
  return {
    list: (
      params: ListOmnibusTenantsPathParams,
      query?: ListOmnibusTenantsQueryParams,
    ): Promise<Omnibus_TenantPageResponse> => t.get(URLs.omnibusTenants, params, query),

    create: (
      params: CreateOmnibusTenantPathParams,
      body: Omnibus_CreateOrUpdateTenantRequest,
    ): Promise<Omnibus_TenantResponse> =>
      t.post(URLs.omnibusTenants, body, params, { sign: false }),

    get: (params: GetOmnibusTenantPathParams): Promise<Omnibus_TenantResponse> =>
      t.get(URLs.omnibusTenant, params),

    update: (
      params: UpdateOmnibusTenantPathParams,
      body: Omnibus_CreateOrUpdateTenantRequest,
    ): Promise<Omnibus_TenantResponse> => t.put(URLs.omnibusTenant, body, params),

    lock: (params: LockOmnibusTenantPathParams): Promise<Omnibus_TenantResponse> =>
      t.post(URLs.omnibusTenantLock, undefined, params, { sign: false }),

    unlock: (params: UnlockOmnibusTenantPathParams): Promise<Omnibus_TenantResponse> =>
      t.post(URLs.omnibusTenantUnlock, undefined, params, { sign: false }),

    createInternalTransfer: (
      params: CreateOmnibusInternalTransferPathParams,
      body: Omnibus_CreateInternalTransferRequest,
    ): Promise<Omnibus_InternalTransferResponse> =>
      t.post(URLs.omnibusTenantInternalTransfers, body, params, { sign: false }),

    createWithdrawal: (
      params: CreateOmnibusWithdrawalPathParams,
      body: Omnibus_CreateWithdrawalRequest,
    ): Promise<Omnibus_CreateWithdrawalResponse> =>
      t.post(URLs.omnibusTenantWithdrawals, body, params, { sign: false }),

    depositWallet: {
      get: (
        params: GetOmnibusTenantDepositWalletPathParams,
      ): Promise<Omnibus_DepositWalletResponse> => t.get(URLs.omnibusTenantDepositWallet, params),

      create: (
        params: CreateOmnibusTenantDepositWalletPathParams,
      ): Promise<Omnibus_DepositWalletResponse> =>
        t.post(URLs.omnibusTenantDepositWallet, undefined, params, { sign: false }),
    },
  } as const
}
