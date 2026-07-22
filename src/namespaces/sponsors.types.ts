import type { components, operations } from "../models/custody-types.js"

// Path / query param types

export type GetSponsorPathParams = operations["SponsorController_getSponsor"]["parameters"]["path"]

export type CreateSponsorPathParams =
  operations["SponsorController_createSponsor"]["parameters"]["path"]

export type UpdateSponsorPathParams =
  operations["SponsorController_updateSponsor"]["parameters"]["path"]

export type DeleteSponsorPathParams =
  operations["SponsorController_deleteSponsor"]["parameters"]["path"]
export type DeleteSponsorQueryParams =
  operations["SponsorController_deleteSponsor"]["parameters"]["query"]

export type ListSponsorsPathParams =
  operations["SponsorsController_listSponsors"]["parameters"]["path"]

export type GetAccountSponsorPathParams =
  operations["SponsorsController_getAccountSponsor"]["parameters"]["path"]

export type GetDomainSponsorPathParams =
  operations["SponsorsController_getDomainSponsor"]["parameters"]["path"]

export type GetValidSponsorsPathParams =
  operations["SponsorsController_getValidSponsors"]["parameters"]["path"]
export type GetValidSponsorsQueryParams =
  operations["SponsorsController_getValidSponsors"]["parameters"]["query"]

export type ListSponsoredAccountsPathParams =
  operations["SponsorsController_listSponsoredAccounts"]["parameters"]["path"]
export type ListSponsoredAccountsQueryParams =
  operations["SponsorsController_listSponsoredAccounts"]["parameters"]["query"]

export type ListSponsoredDomainsPathParams =
  operations["SponsorsController_listSponsoredDomains"]["parameters"]["path"]
export type ListSponsoredDomainsQueryParams =
  operations["SponsorsController_listSponsoredDomains"]["parameters"]["query"]

export type GetSponsorableDomainsPathParams =
  operations["SponsorListController_getSponsorableDomains"]["parameters"]["path"]
export type GetSponsorableDomainsQueryParams =
  operations["SponsorListController_getSponsorableDomains"]["parameters"]["query"]

export type AddSponsoredDomainsPathParams =
  operations["SponsorListController_addSponsoredDomains"]["parameters"]["path"]

export type GetSponsorableAccountsPathParams =
  operations["SponsorListController_getSponsorableAccounts"]["parameters"]["path"]
export type GetSponsorableAccountsQueryParams =
  operations["SponsorListController_getSponsorableAccounts"]["parameters"]["query"]

export type AddSponsoredAccountsPathParams =
  operations["SponsorListController_addSponsoredAccounts"]["parameters"]["path"]

export type AddSponsoredAccountPathParams =
  operations["SponsorListController_addSponsoredAccount"]["parameters"]["path"]

export type RemoveSponsoredAccountPathParams =
  operations["SponsorListController_removeSponsoredAccount"]["parameters"]["path"]

export type ListSponsorEventsPathParams =
  operations["EventController_getEvents"]["parameters"]["path"]
export type ListSponsorEventsQueryParams =
  operations["EventController_getEvents"]["parameters"]["query"]

// Response / body types

export type GasStation_SponsorResponseDto = components["schemas"]["GasStation_SponsorResponseDto"]
export type GasStation_CreateSponsorDto = components["schemas"]["GasStation_CreateSponsorDto"]
export type GasStation_SponsorCreatedResponseDto =
  components["schemas"]["GasStation_SponsorCreatedResponseDto"]
export type GasStation_UpdateSponsorDto = components["schemas"]["GasStation_UpdateSponsorDto"]
export type GasStation_SponsorsListResponseDto =
  components["schemas"]["GasStation_SponsorsListResponseDto"]
export type GasStation_AccountSponsorResponseDto =
  components["schemas"]["GasStation_AccountSponsorResponseDto"]
export type GasStation_DomainSponsorResponseDto =
  components["schemas"]["GasStation_DomainSponsorResponseDto"]
export type GasStation_SponsoredEntitiesResponseDto =
  components["schemas"]["GasStation_SponsoredEntitiesResponseDto"]
export type GasStation_SponsorableDomainsResponseDto =
  components["schemas"]["GasStation_SponsorableDomainsResponseDto"]
export type GasStation_AddSponsoredDomainsDto =
  components["schemas"]["GasStation_AddSponsoredDomainsDto"]
export type GasStation_SponsoredModificationResponseDto =
  components["schemas"]["GasStation_SponsoredModificationResponseDto"]
export type GasStation_SponsorableAccountsResponseDto =
  components["schemas"]["GasStation_SponsorableAccountsResponseDto"]
export type GasStation_AddSponsoredAccountsDto =
  components["schemas"]["GasStation_AddSponsoredAccountsDto"]
export type GasStation_EventsResponseDto = components["schemas"]["GasStation_EventsResponseDto"]
export type GasStation_ValidSponsorsResponseDto =
  components["schemas"]["GasStation_ValidSponsorsResponseDto"]
