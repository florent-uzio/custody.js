import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
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
} from "./sponsors.types.js"

/**
 * Gas Station sponsorship namespace (`client.sponsors.*`).
 */
export function createSponsors(t: Transport) {
  return {
    get: (params: GetSponsorPathParams): Promise<GasStation_SponsorResponseDto> =>
      t.get(URLs.sponsor, params),

    create: (
      params: CreateSponsorPathParams,
      body: GasStation_CreateSponsorDto,
    ): Promise<GasStation_SponsorCreatedResponseDto> =>
      t.post(URLs.sponsor, body, params, { sign: false }),

    update: (
      params: UpdateSponsorPathParams,
      body: GasStation_UpdateSponsorDto,
    ): Promise<GasStation_SponsorResponseDto> => t.put(URLs.sponsor, body, params),

    delete: (params: DeleteSponsorPathParams, query: DeleteSponsorQueryParams): Promise<void> =>
      t.delete(URLs.sponsor, params, query),

    list: (params: ListSponsorsPathParams): Promise<GasStation_SponsorsListResponseDto> =>
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

    listEvents: (
      params: ListSponsorEventsPathParams,
      query?: ListSponsorEventsQueryParams,
    ): Promise<GasStation_EventsResponseDto> => t.get(URLs.sponsorEvents, params, query),
  } as const
}
