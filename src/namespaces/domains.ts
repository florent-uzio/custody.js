import { URLs } from "../constants/urls.js"
import type {
  Core_TrustedDomain,
  Core_TrustedDomainsCollection,
  GetDomainPathParams,
  GetDomainsQueryParams,
} from "../services/domains/domain.types.js"
import type {
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
} from "../services/omnibus/omnibus.types.js"
import type {
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
  GasStation_SponsorableAccountsResponseDto,
  GasStation_SponsorableDomainsResponseDto,
  GasStation_SponsorCreatedResponseDto,
  GasStation_SponsoredEntitiesResponseDto,
  GasStation_SponsoredModificationResponseDto,
  GasStation_SponsorResponseDto,
  GasStation_SponsorsListResponseDto,
  GasStation_UpdateSponsorDto,
  GetAccountSponsorPathParams,
  GetDomainSponsorPathParams,
  GetSponsorableAccountsPathParams,
  GetSponsorableAccountsQueryParams,
  GetSponsorableDomainsPathParams,
  GetSponsorableDomainsQueryParams,
  GetSponsorPathParams,
  ListSponsoredAccountsPathParams,
  ListSponsoredAccountsQueryParams,
  ListSponsoredDomainsPathParams,
  ListSponsoredDomainsQueryParams,
  ListSponsorEventsPathParams,
  ListSponsorEventsQueryParams,
  ListSponsorsPathParams,
  UpdateSponsorPathParams,
} from "../services/sponsors/sponsors.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createDomains(t: TypedTransport) {
  return {
    list: (query?: GetDomainsQueryParams): Promise<Core_TrustedDomainsCollection> =>
      t.get(URLs.domains, undefined, query),

    get: (params: GetDomainPathParams): Promise<Core_TrustedDomain> => t.get(URLs.domain, params),

    // Gas Station Sponsorship

    getSponsor: (params: GetSponsorPathParams): Promise<GasStation_SponsorResponseDto> =>
      t.get(URLs.sponsor, params),

    createSponsor: (
      params: CreateSponsorPathParams,
      body: GasStation_CreateSponsorDto,
    ): Promise<GasStation_SponsorCreatedResponseDto> =>
      t.post(URLs.sponsor, body, params, { sign: false }),

    updateSponsor: (
      params: UpdateSponsorPathParams,
      body: GasStation_UpdateSponsorDto,
    ): Promise<GasStation_SponsorResponseDto> => t.put(URLs.sponsor, body, params),

    deleteSponsor: (
      params: DeleteSponsorPathParams,
      query: DeleteSponsorQueryParams,
    ): Promise<void> => t.delete(URLs.sponsor, params, query),

    listSponsors: (params: ListSponsorsPathParams): Promise<GasStation_SponsorsListResponseDto> =>
      t.get(URLs.sponsors, params),

    getAccountSponsor: (
      params: GetAccountSponsorPathParams,
    ): Promise<GasStation_AccountSponsorResponseDto> => t.get(URLs.accountSponsor, params),

    getDomainSponsor: (
      params: GetDomainSponsorPathParams,
    ): Promise<GasStation_DomainSponsorResponseDto> => t.get(URLs.domainSponsor, params),

    listSponsoredAccounts: (
      params: ListSponsoredAccountsPathParams,
      query?: ListSponsoredAccountsQueryParams,
    ): Promise<GasStation_SponsoredEntitiesResponseDto> =>
      t.get(URLs.sponsoredAccounts, params, query),

    listSponsoredDomains: (
      params: ListSponsoredDomainsPathParams,
      query?: ListSponsoredDomainsQueryParams,
    ): Promise<GasStation_SponsoredEntitiesResponseDto> =>
      t.get(URLs.sponsoredDomains, params, query),

    getSponsorableDomains: (
      params: GetSponsorableDomainsPathParams,
      query?: GetSponsorableDomainsQueryParams,
    ): Promise<GasStation_SponsorableDomainsResponseDto> =>
      t.get(URLs.entitySponsorableDomains, params, query),

    addSponsoredDomains: (
      params: AddSponsoredDomainsPathParams,
      body: GasStation_AddSponsoredDomainsDto,
    ): Promise<GasStation_SponsoredModificationResponseDto> =>
      t.post(URLs.entitySponsoredDomains, body, params, { sign: false }),

    getSponsorableAccounts: (
      params: GetSponsorableAccountsPathParams,
      query?: GetSponsorableAccountsQueryParams,
    ): Promise<GasStation_SponsorableAccountsResponseDto> =>
      t.get(URLs.entitySponsorableAccounts, params, query),

    addSponsoredAccounts: (
      params: AddSponsoredAccountsPathParams,
      body: GasStation_AddSponsoredAccountsDto,
    ): Promise<GasStation_SponsoredModificationResponseDto> =>
      t.post(URLs.entitySponsoredAccounts, body, params, { sign: false }),

    listSponsorEvents: (
      params: ListSponsorEventsPathParams,
      query?: ListSponsorEventsQueryParams,
    ): Promise<GasStation_EventsResponseDto> => t.get(URLs.sponsorEvents, params, query),

    // Omnibus Accounts

    getOmnibus: (params: GetOmnibusPathParams): Promise<Omnibus_OmnibusResponse> =>
      t.get(URLs.omnibus, params),

    createOmnibus: (
      params: CreateOmnibusPathParams,
      body: Omnibus_CreateOmnibusRequest,
    ): Promise<Omnibus_CreateOmnibusResponse> =>
      t.post(URLs.omnibus, body, params, { sign: false }),

    getOmnibusById: (params: GetOmnibusByIdPathParams): Promise<Omnibus_OmnibusResponse> =>
      t.get(URLs.omnibusItem, params),

    updateOmnibus: (
      params: UpdateOmnibusPathParams,
      body: Omnibus_UpdateOmnibusRequest,
    ): Promise<Omnibus_OmnibusResponse> => t.put(URLs.omnibusItem, body, params),

    lockOmnibus: (params: LockOmnibusPathParams): Promise<Omnibus_OmnibusResponse> =>
      t.post(URLs.omnibusLock, undefined, params, { sign: false }),

    unlockOmnibus: (params: UnlockOmnibusPathParams): Promise<Omnibus_OmnibusResponse> =>
      t.post(URLs.omnibusUnlock, undefined, params, { sign: false }),

    listOmnibusInternalTransfers: (
      params: ListOmnibusInternalTransfersPathParams,
      query?: ListOmnibusInternalTransfersQueryParams,
    ): Promise<Omnibus_InternalTransferPageResponse> =>
      t.get(URLs.omnibusInternalTransfers, params, query),

    listOmnibusDepositWallets: (
      params: ListOmnibusDepositWalletsPathParams,
      query?: ListOmnibusDepositWalletsQueryParams,
    ): Promise<Omnibus_DepositWalletSummaryPageResponse> =>
      t.get(URLs.omnibusDepositWallets, params, query),

    listOmnibusTenants: (
      params: ListOmnibusTenantsPathParams,
      query?: ListOmnibusTenantsQueryParams,
    ): Promise<Omnibus_TenantPageResponse> => t.get(URLs.omnibusTenants, params, query),

    createOmnibusTenant: (
      params: CreateOmnibusTenantPathParams,
      body: Omnibus_CreateOrUpdateTenantRequest,
    ): Promise<Omnibus_TenantResponse> =>
      t.post(URLs.omnibusTenants, body, params, { sign: false }),

    getOmnibusTenant: (params: GetOmnibusTenantPathParams): Promise<Omnibus_TenantResponse> =>
      t.get(URLs.omnibusTenant, params),

    updateOmnibusTenant: (
      params: UpdateOmnibusTenantPathParams,
      body: Omnibus_CreateOrUpdateTenantRequest,
    ): Promise<Omnibus_TenantResponse> => t.put(URLs.omnibusTenant, body, params),

    getOmnibusTenantDepositWallet: (
      params: GetOmnibusTenantDepositWalletPathParams,
    ): Promise<Omnibus_DepositWalletResponse> => t.get(URLs.omnibusTenantDepositWallet, params),

    createOmnibusTenantDepositWallet: (
      params: CreateOmnibusTenantDepositWalletPathParams,
    ): Promise<Omnibus_DepositWalletResponse> =>
      t.post(URLs.omnibusTenantDepositWallet, undefined, params, { sign: false }),

    createOmnibusInternalTransfer: (
      params: CreateOmnibusInternalTransferPathParams,
      body: Omnibus_CreateInternalTransferRequest,
    ): Promise<Omnibus_InternalTransferResponse> =>
      t.post(URLs.omnibusTenantInternalTransfers, body, params, { sign: false }),

    lockOmnibusTenant: (params: LockOmnibusTenantPathParams): Promise<Omnibus_TenantResponse> =>
      t.post(URLs.omnibusTenantLock, undefined, params, { sign: false }),

    unlockOmnibusTenant: (params: UnlockOmnibusTenantPathParams): Promise<Omnibus_TenantResponse> =>
      t.post(URLs.omnibusTenantUnlock, undefined, params, { sign: false }),

    createOmnibusWithdrawal: (
      params: CreateOmnibusWithdrawalPathParams,
      body: Omnibus_CreateWithdrawalRequest,
    ): Promise<Omnibus_CreateWithdrawalResponse> =>
      t.post(URLs.omnibusTenantWithdrawals, body, params, { sign: false }),
  } as const
}
