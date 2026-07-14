import { URLs } from "../../constants/urls.js"
import type { Transport } from "../../transport/index.js"
import type {
  CreateOmnibusPathParams,
  GetOmnibusByIdPathParams,
  GetOmnibusPathParams,
  ListOmnibusDepositWalletsPathParams,
  ListOmnibusDepositWalletsQueryParams,
  ListOmnibusInternalTransfersPathParams,
  ListOmnibusInternalTransfersQueryParams,
  LockOmnibusPathParams,
  Omnibus_CreateOmnibusRequest,
  Omnibus_CreateOmnibusResponse,
  Omnibus_DepositWalletSummaryPageResponse,
  Omnibus_InternalTransferPageResponse,
  Omnibus_OmnibusResponse,
  Omnibus_UpdateOmnibusRequest,
  UnlockOmnibusPathParams,
  UpdateOmnibusPathParams,
} from "./omnibus.types.js"
import { createOmnibusTenants } from "./tenants.js"

/**
 * Omnibus accounting namespace (`client.omnibus.*`), mirroring the
 * `/v1/domains/{domainId}/omnibus/*` URL structure. Tenant, deposit-wallet,
 * internal-transfer, and withdrawal operations are nested under `tenants`.
 */
export function createOmnibus(t: Transport) {
  return {
    get: (params: GetOmnibusPathParams): Promise<Omnibus_OmnibusResponse> =>
      t.get(URLs.omnibus, params),

    create: (
      params: CreateOmnibusPathParams,
      body: Omnibus_CreateOmnibusRequest,
    ): Promise<Omnibus_CreateOmnibusResponse> =>
      t.post(URLs.omnibus, body, params, { sign: false }),

    getById: (params: GetOmnibusByIdPathParams): Promise<Omnibus_OmnibusResponse> =>
      t.get(URLs.omnibusItem, params),

    update: (
      params: UpdateOmnibusPathParams,
      body: Omnibus_UpdateOmnibusRequest,
    ): Promise<Omnibus_OmnibusResponse> => t.put(URLs.omnibusItem, body, params),

    lock: (params: LockOmnibusPathParams): Promise<Omnibus_OmnibusResponse> =>
      t.post(URLs.omnibusLock, undefined, params, { sign: false }),

    unlock: (params: UnlockOmnibusPathParams): Promise<Omnibus_OmnibusResponse> =>
      t.post(URLs.omnibusUnlock, undefined, params, { sign: false }),

    listInternalTransfers: (
      params: ListOmnibusInternalTransfersPathParams,
      query?: ListOmnibusInternalTransfersQueryParams,
    ): Promise<Omnibus_InternalTransferPageResponse> =>
      t.get(URLs.omnibusInternalTransfers, params, query),

    listDepositWallets: (
      params: ListOmnibusDepositWalletsPathParams,
      query?: ListOmnibusDepositWalletsQueryParams,
    ): Promise<Omnibus_DepositWalletSummaryPageResponse> =>
      t.get(URLs.omnibusDepositWallets, params, query),

    tenants: createOmnibusTenants(t),
  } as const
}
