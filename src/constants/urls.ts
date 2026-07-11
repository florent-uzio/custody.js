import type { paths } from "../models/custody-types.js"

// Extract the path keys from the generated types for type safety
export type PathKeys = keyof paths

// Helper function to ensure URLs are valid paths
function createURLs<T extends Record<string, PathKeys>>(urls: T): T {
  return urls
}

export const URLs = createURLs({
  // Domains
  domains: "/v1/domains",
  domain: "/v1/domains/{domainId}",

  // Users
  users: "/v1/domains/{domainId}/users",
  userRoles: "/v1/domains/{domainId}/users/roles",
  user: "/v1/domains/{domainId}/users/{userId}",
  me: "/v1/me",
  meRequests: "/v1/me/requests",

  // Intents
  intents: "/v1/intents",
  intentsApprove: "/v1/intents/approve",
  intentsReject: "/v1/intents/reject",
  intentsDryRun: "/v1/intents/dry-run",
  domainIntents: "/v1/domains/{domainId}/intents",
  getIntent: "/v1/domains/{domainId}/intents/{intentId}",
  intentRemainingUsers: "/v1/domains/{domainId}/intents/{intentId}/remaining-users",

  // Vaults
  vaults: "/v1/vaults",
  vault: "/v1/vaults/{vaultId}",
  vaultOperationsPrepared: "/v1/vaults/{vaultId}/operations/prepared",
  vaultOperationsSigned: "/v1/vaults/operations/signed",

  // Policies
  policies: "/v1/domains/{domainId}/policies",
  policy: "/v1/domains/{domainId}/policies/{policyId}",

  // Accounts
  accounts: "/v1/domains/{domainId}/accounts",
  account: "/v1/domains/{domainId}/accounts/{accountId}",
  accountAddresses: "/v1/domains/{domainId}/accounts/{accountId}/addresses",
  accountAddressesByLedger: "/v1/domains/{domainId}/accounts/{accountId}/addresses/{ledgerId}",
  accountAddressesLatest: "/v1/domains/{domainId}/accounts/{accountId}/addresses/latest",
  accountAddress: "/v1/domains/{domainId}/accounts/{accountId}/addresses/{accountAddressId}",
  accountConfirmedBalance:
    "/v1/domains/{domainId}/accounts/{accountId}/confirmed-balance/{tickerId}",
  accountBalances: "/v1/domains/{domainId}/accounts/{accountId}/balances",
  accountBalancesRefresh: "/v1/domains/{domainId}/accounts/{accountId}/balances/refresh",
  accountManifests: "/v1/domains/{domainId}/accounts/{accountId}/manifests",
  accountManifest: "/v1/domains/{domainId}/accounts/{accountId}/manifests/{manifestId}",
  accountComplianceConfiguration:
    "/v1/domains/{domainId}/accounts/{accountId}/compliance-configuration",
  complianceConfigurations: "/v1/domains/{domainId}/compliance-configurations",

  // Compliance
  complianceProviders: "/v1/domains/{domainId}/compliance/providers",
  complianceProvider: "/v1/domains/{domainId}/compliance/providers/{provider}",
  complianceProviderScreeningRules:
    "/v1/domains/{domainId}/compliance/providers/{provider}/screening-rules",
  complianceProviderTogglePreviewScreening:
    "/v1/domains/{domainId}/compliance/providers/{provider}/toggle-preview-screening",
  complianceProviderPauseConnection:
    "/v1/domains/{domainId}/compliance/providers/{provider}/pause-connection",
  complianceProviderConnections: "/v1/domains/{domainId}/compliance/provider-connection",
  compliancePolicy: "/v1/domains/{domainId}/compliance/policy",
  compliancePolicyByType:
    "/v1/domains/{domainId}/compliance/policy/{policyType}/transaction/{transactionType}",
  complianceExceptionRole:
    "/v1/domains/{domainId}/compliance/transactionType/{transactionType}/exception-role",
  complianceDomain: "/v1/domains/{domainId}/compliance/domain",
  complianceDomainValidation: "/v1/domains/{domainId}/compliance/domain/validation",
  complianceAnalysis: "/v1/domains/{domainId}/compliance/analysis",
  complianceAnalysisPreview: "/v1/domains/{domainId}/compliance/analysis/preview",
  complianceTravelRuleMessages:
    "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages",
  complianceTravelRuleMessage:
    "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}",
  complianceTravelRulePii:
    "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/pii",
  complianceTravelRuleEncryptedPii:
    "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/encrypted-pii",
  complianceTravelRuleEncryptedPiiForPolicy:
    "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/policies/{travelRulePolicyId}/encrypted-pii",
  complianceTravelRuleDetails: "/v1/domains/{domainId}/compliance/travel-rule/details",
  complianceTravelRuleRelationships:
    "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/relationships",

  // Addresses
  addresses: "/v1/addresses",

  // Endpoints
  endpoints: "/v1/domains/{domainId}/endpoints",
  endpoint: "/v1/domains/{domainId}/endpoints/{endpointId}",

  // Transactions
  transactionOrders: "/v1/domains/{domainId}/transactions/orders",
  transactionOrder: "/v1/domains/{domainId}/transactions/orders/{transactionOrderId}",
  transactionTransfers: "/v1/domains/{domainId}/transactions/transfers",
  transactionTransfer: "/v1/domains/{domainId}/transactions/transfers/{transferId}",
  transactions: "/v1/domains/{domainId}/transactions",
  transaction: "/v1/domains/{domainId}/transactions/{transactionId}",
  transactionsDryRun: "/v1/domains/{domainId}/transactions/dry-run",

  // Tickers
  tickers: "/v1/tickers",
  ticker: "/v1/tickers/{tickerId}",

  // Ledgers
  ledgers: "/v1/ledgers",
  ledger: "/v1/ledgers/{ledgerId}",
  ledgerFees: "/v1/ledgers/{ledgerId}/fees",
  ledgerEthereumCall: "/v1/ledgers/{ledgerId}/ethereum/call",
  trustedLedgers: "/v1/trusted-ledgers",
  trustedLedger: "/v1/trusted-ledgers/{ledgerId}",

  // Requests
  requests: "/v1/domains/{domainId}/requests",
  request: "/v1/domains/{domainId}/requests/{requestId}",

  // Trusted Public Keys
  trustedPublicKeysCollection: "/v1/trusted-public-keys/trusted-collection",
  trustedPublicKeysApi: "/v1/trusted-public-keys/api",
  trustedPublicKeysMessages: "/v1/trusted-public-keys/messages",

  // Events
  events: "/v1/domains/{domainId}/events",

  // Properties
  properties: "/v1/properties",

  // User Invitations
  userInvitations: "/v1/domains/{domainId}/users/invitations",
  userInvitation: "/v1/domains/{domainId}/users/invitations/{id}",
  userInvitationCancel: "/v1/domains/{domainId}/users/invitations/{id}/cancel",
  userInvitationRenew: "/v1/domains/{domainId}/users/invitations/{id}/renew",
  userInvitationComplete: "/v1/domains/{domainId}/users/invitations/{id}/complete",
  publicUserInvitation: "/v1/users/invitations/{idOrCode}",

  // Virtual Ledgers
  virtualLedgers: "/v1/domains/{domainId}/virtual-ledgers",
  virtualLedger: "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}",
  virtualLedgerBalances: "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances",
  virtualLedgerAccounts: "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts",
  virtualLedgerAccount:
    "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}",
  virtualLedgerAccountBalances:
    "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances",
  virtualLedgerAccountDepositIdentificationSources:
    "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources",
  virtualLedgerAccountAddresses:
    "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses",
  virtualLedgerOperations: "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations",
  virtualLedgerTransfers: "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers",

  // Channels
  channels: "/v1/domains/{domainId}/channels",
  channel: "/v1/domains/{domainId}/channels/{channelId}",
  channelTest: "/v1/domains/{domainId}/channels/{channelId}/test",
  channelEvents: "/v1/domains/{domainId}/channels/{channelId}/events",
  channelEvent: "/v1/domains/{domainId}/channels/{channelId}/events/{eventId}",
  channelsEvents: "/v1/domains/{domainId}/channels/events",

  // Genesis
  genesis: "/v1/genesis",

  // Gas Station Sponsorship
  sponsor: "/v1/domain/{domainId}/account/{accountId}/sponsor",
  sponsors: "/v1/domain/{domainId}/sponsors",
  accountSponsor: "/v1/domain/{domainId}/sponsors/account/{accountId}/sponsor",
  domainSponsor: "/v1/domain/{domainId}/sponsors/domain-sponsor",
  sponsoredAccounts: "/v1/domain/{domainId}/sponsors/sponsored-accounts",
  sponsoredDomains: "/v1/domain/{domainId}/sponsors/sponsored-domains",
  entitySponsorableDomains: "/v1/domain/{domainId}/account/{entityId}/sponsorable-domains",
  entitySponsoredDomains: "/v1/domain/{domainId}/account/{entityId}/sponsored-domains",
  entitySponsorableAccounts: "/v1/domain/{domainId}/account/{entityId}/sponsorable-accounts",
  entitySponsoredAccounts: "/v1/domain/{domainId}/account/{entityId}/sponsored-accounts",
  sponsorEvents: "/v1/domain/{domainId}/sponsor/events",

  // Omnibus Accounts
  omnibus: "/v1/domains/{domainId}/omnibus",
  omnibusItem: "/v1/domains/{domainId}/omnibus/{omnibusId}",
  omnibusLock: "/v1/domains/{domainId}/omnibus/{omnibusId}/lock",
  omnibusUnlock: "/v1/domains/{domainId}/omnibus/{omnibusId}/unlock",
  omnibusInternalTransfers: "/v1/domains/{domainId}/omnibus/{omnibusId}/internal-transfers",
  omnibusDepositWallets: "/v1/domains/{domainId}/omnibus/{omnibusId}/deposit-wallets",
  omnibusTenants: "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants",
  omnibusTenant: "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}",
  omnibusTenantDepositWallet:
    "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/deposit-wallet",
  omnibusTenantInternalTransfers:
    "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/internal-transfers",
  omnibusTenantLock: "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/lock",
  omnibusTenantUnlock: "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/unlock",
  omnibusTenantWithdrawals:
    "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/withdrawals",
} as const)

// Type for the URLs object that ensures all values are valid paths
// export type URLs = typeof URLs
