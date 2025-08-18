import { z } from "zod"
import { UserReferenceSchema, IntentResponseSchema, type UserReference, type IntentResponse } from "./common.types.js"

// Core schemas based on OpenAPI specification



// Strings Map Schema
export const StringsMapSchema = z.record(z.string(), z.string())

// Entity ID and Revision Schema
export const EntityIdAndRevisionSchema = z.object({
  /** Entity ID */
  id: z.uuid(),
  /** Revision number */
  revision: z.number().int().min(1),
})

// Intent Lock Status Schema
export const IntentLockStatusSchema = z.enum(["Unlocked", "Locked"])

// Governing Strategy Schema
export const GoverningStrategySchema = z.enum(["ConsiderDescendants", "CoerceDescendants"])

// Read Access Schema
export const ReadAccessSchema = z.object({
  /** Domains with read access */
  domains: z.array(z.string().min(1).max(50).regex(/[a-z0-9\-]+/)),
  /** Users with read access */
  users: z.array(z.string().min(1).max(50).regex(/[a-z0-9\-]+/)),
  /** Endpoints with read access */
  endpoints: z.array(z.string().min(1).max(50).regex(/[a-z0-9\-]+/)),
  /** Policies with read access */
  policies: z.array(z.string().min(1).max(50).regex(/[a-z0-9\-]+/)),
  /** Accounts with read access */
  accounts: z.array(z.string().min(1).max(50).regex(/[a-z0-9\-]+/)),
  /** Transactions with read access */
  transactions: z.array(z.string().min(1).max(50).regex(/[a-z0-9\-]+/)),
  /** Requests with read access */
  requests: z.array(z.string().min(1).max(50).regex(/[a-z0-9\-]+/)),
  /** Events with read access */
  events: z.array(z.string().min(1).max(50).regex(/[a-z0-9\-]+/)),
})

// Permissions Schema
export const PermissionsSchema = z.object({
  /** Read access permissions */
  readAccess: ReadAccessSchema,
})

// Account Key Strategy Schema
export const AccountKeyStrategySchema = z.enum(["Single", "Multi"])

// Create Account Provider Details Payload Vault Schema
export const CreateAccountProviderDetailsPayloadVaultSchema = z.object({
  /** Vault ID */
  vaultId: z.uuid(),
  /** Key strategy */
  keyStrategy: AccountKeyStrategySchema,
  /** Type */
  type: z.literal("Vault"),
})

// Create Account Provider Details Payload Schema
export const CreateAccountProviderDetailsPayloadSchema = z.discriminatedUnion("type", [
  CreateAccountProviderDetailsPayloadVaultSchema,
])

// Create Domain Genesis User Schema
export const CreateDomainGenesisUserSchema = z.object({
  /** User ID */
  id: z.uuid(),
  /** User alias */
  alias: z.string().min(1).max(75),
  /** User lock status */
  lock: IntentLockStatusSchema,
  /** User description */
  description: z.string().min(0).max(250).optional(),
  /** User custom properties */
  customProperties: StringsMapSchema,
})

// Create Domain Genesis Policy Schema
export const CreateDomainGenesisPolicySchema = z.object({
  /** Policy ID */
  id: z.uuid(),
  /** Policy alias */
  alias: z.string().min(1).max(75),
  /** Policy lock status */
  lock: IntentLockStatusSchema,
  /** Policy description */
  description: z.string().min(0).max(250).optional(),
  /** Policy custom properties */
  customProperties: StringsMapSchema,
})

// Transaction Destination Schema (placeholder - would need to be expanded)
export const TransactionDestinationSchema = z.object({
  /** Address */
  address: z.string(),
  // Additional properties would be specific to each blockchain
}).passthrough()

// XRPL Transaction Destination Schemas
export const XrplTransactionDestinationAccountSchema = z.object({
  /** Account ID */
  accountId: z.uuid(),
  /** Type */
  type: z.literal("Account"),
})

export const XrplTransactionDestinationAddressSchema = z.object({
  /** Address */
  address: z.string().min(1).max(512),
  /** Type */
  type: z.literal("Address"),
})

export const XrplTransactionDestinationEndpointSchema = z.object({
  /** Endpoint ID */
  endpointId: z.uuid(),
  /** Type */
  type: z.literal("Endpoint"),
})

export const XrplTransactionDestinationSchema = z.discriminatedUnion("type", [
  XrplTransactionDestinationAccountSchema,
  XrplTransactionDestinationAddressSchema,
  XrplTransactionDestinationEndpointSchema,
])

// XRPL Currency Schemas
export const XrplCurrencyCurrencySchema = z.object({
  /** Currency code */
  code: z.string().min(1).max(100),
  /** Issuer */
  issuer: z.string().min(25).max(35),
  /** Type */
  type: z.literal("Currency"),
})

export const XrplCurrencyTickerIdSchema = z.object({
  /** Ticker ID */
  tickerId: z.uuid(),
  /** Type */
  type: z.literal("TickerId"),
})

export const XrplCurrencySchema = z.discriminatedUnion("type", [
  XrplCurrencyCurrencySchema,
  XrplCurrencyTickerIdSchema,
])

// XRPL Trust Set Flag Schema
export const XrplTrustSetFlagSchema = z.enum([
  "tfSetFreeze",
  "tfClearFreeze", 
  "tfSetfAuth"
])

// XRPL Limit Amount Schema (simplified)
export const XrplLimitAmountSchema = z.looseObject({
  /** Currency */
  currency: XrplCurrencySchema,
  /** Value */
  value: z.string(),
  // Additional properties would be specific to limit amount
})

// XRPL Asset Quantity Schema (simplified)
export const XrplAssetQuantitySchema = z.looseObject({
  /** Currency */
  currency: XrplCurrencySchema,
  /** Value */
  value: z.string(),
  // Additional properties would be specific to asset quantity
})

// XRPL Offer Create Flag Schema (simplified)
export const XrplOfferCreateFlagSchema = z.enum([
  "tfPassive",
  "tfImmediateOrCancel",
  "tfFillOrKill",
  "tfSell"
])

// XRPL Account Set Flag Schema (simplified)
export const XrplAccountSetFlagSchema = z.enum([
  "asfRequireDest",
  "asfRequireAuth",
  "asfDisallowXRP",
  "asfDisableMaster",
  "asfAccountTxnID",
  "asfNoFreeze",
  "asfGlobalFreeze",
  "asfDefaultRipple",
  "asfDepositAuth",
  "asfAuthorizedMinter"
])

// Fee Priority Schema
export const FeePrioritySchema = z.enum(["High", "Medium", "Low"])

// XRPL Fee Strategy Schemas
export const XrplFeeStrategyPrioritySchema = z.object({
  /** Priority */
  priority: FeePrioritySchema,
  /** Type */
  type: z.literal("Priority"),
})

export const XrplFeeStrategySpecifiedAdditionalFeeSchema = z.object({
  /** Drops amount */
  drops: z.string(),
  /** Type */
  type: z.literal("SpecifiedAdditionalFee"),
})

export const XrplFeeStrategySchema = z.discriminatedUnion("type", [
  XrplFeeStrategyPrioritySchema,
  XrplFeeStrategySpecifiedAdditionalFeeSchema,
])

// XRPL Memo Schema
export const XrplMemoSchema = z.object({
  /** Memo data (hex encoded) */
  memoData: z.string().regex(/^[A-Fa-f0-9]*$/).optional(),
  /** Memo format (hex encoded) */
  memoFormat: z.string().regex(/^[A-Fa-f0-9]*$/).optional(),
  /** Memo type (hex encoded) */
  memoType: z.string().regex(/^[A-Fa-f0-9]*$/).optional(),
})

// XRPL Operation Schemas with correct fields
export const XrplOperationPaymentSchema = z.object({
  /** Type */
  type: z.literal("Payment"),
  /** Destination */
  destination: XrplTransactionDestinationSchema,
  /** Amount */
  amount: z.string(),
  /** Destination tag */
  destinationTag: z.number().int().min(0).max(4294967295).optional(),
  /** Currency */
  currency: XrplCurrencySchema.optional(),
})

export const XrplOperationTrustSetSchema = z.object({
  /** Type */
  type: z.literal("TrustSet"),
  /** Flags */
  flags: z.array(XrplTrustSetFlagSchema),
  /** Limit amount */
  limitAmount: XrplLimitAmountSchema,
  /** Enable rippling */
  enableRippling: z.boolean().optional(),
})

export const XrplOperationAccountSetSchema = z.object({
  /** Type */
  type: z.literal("AccountSet"),
  /** Set flag */
  setFlag: XrplAccountSetFlagSchema.optional(),
  /** Clear flag */
  clearFlag: XrplAccountSetFlagSchema.optional(),
  /** Transfer rate */
  transferRate: z.number().int().optional(),
})

export const XrplOperationOfferCreateSchema = z.object({
  /** Type */
  type: z.literal("OfferCreate"),
  /** Flags */
  flags: z.array(XrplOfferCreateFlagSchema),
  /** Taker gets */
  takerGets: XrplAssetQuantitySchema,
  /** Taker pays */
  takerPays: XrplAssetQuantitySchema,
})

export const XrplOperationClawbackSchema = z.object({
  /** Type */
  type: z.literal("Clawback"),
  /** Currency */
  currency: XrplCurrencySchema,
  /** Holder */
  holder: XrplTransactionDestinationSchema,
  /** Value */
  value: z.string(),
})

export const XrplOperationDepositPreauthSchema = z.object({
  /** Type */
  type: z.literal("DepositPreauth"),
  /** Authorize */
  authorize: XrplTransactionDestinationSchema.optional(),
  /** Unauthorize */
  unauthorize: XrplTransactionDestinationSchema.optional(),
})

export const XrplOperationSchema = z.discriminatedUnion("type", [
  XrplOperationPaymentSchema,
  XrplOperationTrustSetSchema,
  XrplOperationAccountSetSchema,
  XrplOperationOfferCreateSchema,
  XrplOperationClawbackSchema,
  XrplOperationDepositPreauthSchema,
])

// XRPL Transaction Order Parameters Schema
export const TransactionOrderParametersXrplSchema = z.object({
  /** Fee strategy */
  feeStrategy: XrplFeeStrategySchema,
  /** Memos */
  memos: z.array(XrplMemoSchema),
  /** Type */
  type: z.literal("XRPL"),
  /** Destination (deprecated) */
  destination: z.unknown().optional(),
  /** Amount (deprecated) */
  amount: z.string().optional(),
  /** Maximum fee */
  maximumFee: z.string().optional(),
  /** Source tag */
  sourceTag: z.number().int().min(0).max(4294967295).optional(),
  /** Destination tag (deprecated) */
  destinationTag: z.number().int().min(0).max(4294967295).optional(),
  /** Operation */
  operation: XrplOperationSchema.optional(),
})

// Ethereum Fee Strategy Schemas (simplified)
export const EthereumFeeStrategySchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Ethereum fee strategy
}).passthrough()

// Ethereum Resource Strategy Schema (simplified)
export const EthereumResourceStrategySchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Ethereum resource strategy
}).passthrough()

// Ethereum Transaction Order Parameters Schema
export const TransactionOrderParametersEthereumSchema = z.object({
  /** Amount */
  amount: z.string(),
  /** Fee strategy */
  feeStrategy: EthereumFeeStrategySchema,
  /** Type */
  type: z.literal("Ethereum"),
  /** Destination */
  destination: TransactionDestinationSchema.optional(),
  /** Maximum fee */
  maximumFee: z.string().optional(),
  /** Data (hex encoded) */
  data: z.string().regex(/^0[xX]([a-fA-F0-9]*)$/).optional(),
  /** Resource strategy */
  resourceStrategy: EthereumResourceStrategySchema.optional(),
})

// Bitcoin Output Parameters Schema (simplified)
export const BitcoinOutputParametersSchema = z.object({
  /** Address */
  address: z.string(),
  /** Amount */
  amount: z.string(),
  // Additional properties would be specific to Bitcoin output
}).passthrough()

// Bitcoin Fee Strategy Schema (simplified)
export const BitcoinFeeStrategySchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Bitcoin fee strategy
}).passthrough()

// Bitcoin Resource Strategy Schema (simplified)
export const BitcoinResourceStrategySchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Bitcoin resource strategy
}).passthrough()

// Bitcoin Transaction Order Parameters Schema
export const TransactionOrderParametersBitcoinSchema = z.object({
  /** Outputs */
  outputs: z.array(BitcoinOutputParametersSchema),
  /** Fee strategy */
  feeStrategy: BitcoinFeeStrategySchema,
  /** Type */
  type: z.literal("Bitcoin"),
  /** Maximum fee */
  maximumFee: z.string().optional(),
  /** Resource strategy */
  resourceStrategy: BitcoinResourceStrategySchema.optional(),
})

// Solana Operation Schema (simplified)
export const SolanaOperationSchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Solana operation
})

// Solana Fee Strategy Schema (simplified)
export const SolanaFeeStrategySchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Solana fee strategy
})

// Solana Transaction Order Parameters Schema
export const TransactionOrderParametersSolanaSchema = z.object({
  /** Operation */
  operation: SolanaOperationSchema,
  /** Memos */
  memos: z.array(z.string().min(0).max(566)),
  /** Fee strategy */
  feeStrategy: SolanaFeeStrategySchema,
  /** Type */
  type: z.literal("Solana"),
  /** Maximum fee */
  maximumFee: z.string().optional(),
  /** Nonce account */
  nonceAccount: TransactionDestinationSchema.optional(),
})

// Hedera Operation Schema (simplified)
export const HederaOperationSchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Hedera operation
}).passthrough()

// Hedera Fee Strategy Schema (simplified)
export const HederaFeeStrategySchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Hedera fee strategy
}).passthrough()

// Hedera Transaction Order Parameters Schema
export const TransactionOrderParametersHederaSchema = z.object({
  /** Operation */
  operation: HederaOperationSchema,
  /** Fee strategy */
  feeStrategy: HederaFeeStrategySchema,
  /** Type */
  type: z.literal("Hedera"),
  /** Memo */
  memo: z.string().min(1).max(100).optional(),
  /** Maximum fee */
  maximumFee: z.string().optional(),
})

// Cardano Operation Schema (simplified)
export const CardanoOperationSchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Cardano operation
}).passthrough()

// Cardano Fee Strategy Schema (simplified)
export const CardanoFeeStrategySchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Cardano fee strategy
}).passthrough()

// Cardano Transaction Order Parameters Schema
export const TransactionOrderParametersCardanoSchema = z.object({
  /** Operation */
  operation: CardanoOperationSchema,
  /** Fee strategy */
  feeStrategy: CardanoFeeStrategySchema,
  /** Type */
  type: z.literal("Cardano"),
  /** Maximum fee */
  maximumFee: z.string().optional(),
})

// Stellar Operation Schema (simplified)
export const StellarOperationSchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Stellar operation
})

// Stellar Fee Strategy Schema (simplified)
export const StellarFeeStrategySchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Stellar fee strategy
})

// Stellar Transaction Order Parameters Schema
export const TransactionOrderParametersStellarSchema = z.object({
  /** Operation */
  operation: StellarOperationSchema,
  /** Fee strategy */
  feeStrategy: StellarFeeStrategySchema,
  /** Type */
  type: z.literal("Stellar"),
  /** Maximum fee */
  maximumFee: z.string().optional(),
})

// Substrate Operation Schema (simplified)
export const SubstrateOperationSchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Substrate operation
})

// Substrate Fee Strategy Schema (simplified)
export const SubstrateFeeStrategySchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Substrate fee strategy
})

// Substrate Transaction Order Parameters Schema
export const TransactionOrderParametersSubstrateSchema = z.object({
  /** Operation */
  operation: SubstrateOperationSchema,
  /** Fee strategy */
  feeStrategy: SubstrateFeeStrategySchema,
  /** Type */
  type: z.literal("Substrate"),
  /** Maximum fee */
  maximumFee: z.string().optional(),
})

// Tezos Operation Schema (simplified)
export const TezosOperationSchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Tezos operation
})

// Tezos Fee Strategy Schema (simplified)
export const TezosFeeStrategySchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Tezos fee strategy
})

// Tezos Transaction Order Parameters Schema
export const TransactionOrderParametersTezosSchema = z.object({
  /** Operation */
  operation: TezosOperationSchema,
  /** Fee strategy */
  feeStrategy: TezosFeeStrategySchema,
  /** Type */
  type: z.literal("Tezos"),
  /** Maximum fee */
  maximumFee: z.string().optional(),
})

// Tron Operation Schema (simplified)
export const TronOperationSchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Tron operation
})

// Tron Fee Strategy Schema (simplified)
export const TronFeeStrategySchema = z.looseObject({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Tron fee strategy
})

// Tron Transaction Order Parameters Schema
export const TransactionOrderParametersTronSchema = z.object({
  /** Operation */
  operation: TronOperationSchema,
  /** Fee strategy */
  feeStrategy: TronFeeStrategySchema,
  /** Type */
  type: z.literal("Tron"),
  /** Maximum fee */
  maximumFee: z.string().optional(),
})

// Algorand Operation Schema (simplified)
export const AlgorandOperationSchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Algorand operation
}).passthrough()

// Algorand Fee Strategy Schema (simplified)
export const AlgorandFeeStrategySchema = z.object({
  /** Type */
  type: z.string(),
  // Additional properties would be specific to Algorand fee strategy
}).passthrough()

// Algorand Transaction Order Parameters Schema
export const TransactionOrderParametersAlgorandSchema = z.object({
  /** Operation */
  operation: AlgorandOperationSchema,
  /** Fee strategy */
  feeStrategy: AlgorandFeeStrategySchema,
  /** Type */
  type: z.literal("Algorand"),
  /** Maximum fee */
  maximumFee: z.string().optional(),
})

// Transaction Order Parameters Union Schema
export const TransactionOrderParametersSchema = z.discriminatedUnion("type", [
  TransactionOrderParametersXrplSchema,
  TransactionOrderParametersEthereumSchema,
  TransactionOrderParametersBitcoinSchema,
  TransactionOrderParametersSolanaSchema,
  TransactionOrderParametersHederaSchema,
  TransactionOrderParametersCardanoSchema,
  TransactionOrderParametersStellarSchema,
  TransactionOrderParametersSubstrateSchema,
  TransactionOrderParametersTezosSchema,
  TransactionOrderParametersTronSchema,
  TransactionOrderParametersAlgorandSchema,
])

// Intent Type Schema (from Core_IntentType)
export const IntentTypeSchema = z.enum([
  "v0_NotarizeData",
  "v0_ExecuteExtension",
  "v0_CreateDomain",
  "v0_UpdateDomain",
  "v0_UpdateDomainPermissions",
  "v0_UnlockDomain",
  "v0_LockDomain",
  "v0_CreateUser",
  "v0_UpdateUser",
  "v0_UnlockUser",
  "v0_LockUser",
  "v0_CreatePolicy",
  "v0_UpdatePolicy",
  "v0_UnlockPolicy",
  "v0_LockPolicy",
  "v0_CreateVault",
  "v0_UpdateVault",
  "v0_UnlockVault",
  "v0_LockVault",
  "v0_UnlockTicker",
  "v0_LockTicker",
  "v0_CreateEndpoint",
  "v0_UpdateEndpoint",
  "v0_UnlockEndpoint",
  "v0_LockEndpoint",
  "v0_CreateAccount",
  "v0_MigrateSilo3AccountBatch",
  "v0_UpdateAccount",
  "v0_UnlockAccount",
  "v0_LockAccount",
  "v0_AddAccountLedgers",
  "v0_CreateTransactionOrder",
  "v0_ReleaseQuarantinedTransfers",
  "v0_CreateTicker",
  "v0_AttemptTransactionOrderCancellation",
  "v0_ValidateTickers",
  "v0_UpdateTicker",
  "v0_CreateTransferOrder",
  "v0_SignManifest",
  "v0_SetSystemProperty",
  "v0_CreateLedger",
  "v0_UpdateLedger",
  "v0_AddTrustedPublicKeysForMigration"
])

// Individual Intent Payload Schemas

// v0_CreateAccount Schema
export const V0CreateAccountSchema = z.object({
  /** Account ID */
  id: z.uuid(),
  /** Account alias */
  alias: z.string().min(1).max(75),
  /** Provider details */
  providerDetails: CreateAccountProviderDetailsPayloadSchema,
  /** Lock status */
  lock: IntentLockStatusSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreateAccount"),
  /** Ledger ID (deprecated) */
  ledgerId: z.string().min(1).max(100).optional(),
  /** Ledger IDs */
  ledgerIds: z.array(z.string().min(1).max(100)).optional(),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// v0_CreateDomain Schema
export const V0CreateDomainSchema = z.object({
  /** Domain ID */
  id: z.uuid(),
  /** Domain alias */
  alias: z.string().min(1).max(75),
  /** Lock status */
  lock: IntentLockStatusSchema,
  /** Permissions */
  permissions: PermissionsSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Users */
  users: z.array(CreateDomainGenesisUserSchema),
  /** Policies */
  policies: z.array(CreateDomainGenesisPolicySchema),
  /** Type */
  type: z.literal("v0_CreateDomain"),
  /** Governing strategy */
  governingStrategy: GoverningStrategySchema.optional(),
  /** Description */
  description: z.string().min(0).max(250).optional(),
  /** Children domain IDs */
  childrenDomainIds: z.array(z.uuid()).min(1).optional(),
})

// v0_CreateEndpoint Schema
export const V0CreateEndpointSchema = z.object({
  /** Endpoint ID */
  id: z.uuid(),
  /** Address */
  address: z.string().min(1).max(512),
  /** Trust score */
  trustScore: z.number().int().min(0).max(100),
  /** Ledger ID */
  ledgerId: z.string().min(1).max(100),
  /** Alias */
  alias: z.string().min(1).max(75),
  /** Lock status */
  lock: IntentLockStatusSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreateEndpoint"),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// v0_CreateLedger Schema
export const V0CreateLedgerSchema = z.object({
  /** Ledger ID */
  id: z.string().min(1).max(100),
  /** Alias */
  alias: z.string().min(1).max(75),
  /** Lock status */
  lock: IntentLockStatusSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreateLedger"),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// v0_CreatePolicy Schema
export const V0CreatePolicySchema = z.object({
  /** Policy ID */
  id: z.uuid(),
  /** Policy alias */
  alias: z.string().min(1).max(75),
  /** Lock status */
  lock: IntentLockStatusSchema,
  /** Permissions */
  permissions: PermissionsSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreatePolicy"),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// v0_CreateTicker Schema
export const V0CreateTickerSchema = z.object({
  /** Ticker ID */
  id: z.string().min(1).max(100),
  /** Alias */
  alias: z.string().min(1).max(75),
  /** Lock status */
  lock: IntentLockStatusSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreateTicker"),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// v0_CreateTransactionOrder Schema
export const V0CreateTransactionOrderSchema = z.object({
  /** Transaction order ID */
  id: z.uuid(),
  /** Account ID */
  accountId: z.uuid(),
  /** Parameters */
  parameters: TransactionOrderParametersSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreateTransactionOrder"),
  /** Ledger ID */
  ledgerId: z.string().min(1).max(100).optional(),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// v0_CreateTransferOrder Schema
export const V0CreateTransferOrderSchema = z.object({
  /** Transfer order ID */
  id: z.uuid(),
  /** Account ID */
  accountId: z.uuid(),
  /** Parameters */
  parameters: TransactionOrderParametersSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreateTransferOrder"),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// v0_CreateUser Schema
export const V0CreateUserSchema = z.object({
  /** User ID */
  id: z.uuid(),
  /** User alias */
  alias: z.string().min(1).max(75),
  /** Lock status */
  lock: IntentLockStatusSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreateUser"),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// v0_CreateVault Schema
export const V0CreateVaultSchema = z.object({
  /** Vault ID */
  id: z.uuid(),
  /** Vault alias */
  alias: z.string().min(1).max(75),
  /** Lock status */
  lock: IntentLockStatusSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type */
  type: z.literal("v0_CreateVault"),
  /** Description */
  description: z.string().min(0).max(250).optional(),
})

// Lock/Unlock schemas (all follow the same pattern)
export const V0LockAccountSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_LockAccount"),
})

export const V0LockDomainSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_LockDomain"),
})

export const V0LockEndpointSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_LockEndpoint"),
})

export const V0LockPolicySchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_LockPolicy"),
})

export const V0LockTickerSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_LockTicker"),
})

export const V0LockUserSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_LockUser"),
})

export const V0LockVaultSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_LockVault"),
})

export const V0UnlockAccountSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_UnlockAccount"),
})

export const V0UnlockDomainSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_UnlockDomain"),
})

export const V0UnlockEndpointSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_UnlockEndpoint"),
})

export const V0UnlockPolicySchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_UnlockPolicy"),
})

export const V0UnlockTickerSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_UnlockTicker"),
})

export const V0UnlockUserSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_UnlockUser"),
})

export const V0UnlockVaultSchema = z.object({
  /** Reference */
  reference: EntityIdAndRevisionSchema,
  /** Type */
  type: z.literal("v0_UnlockVault"),
})

// Placeholder schemas for other intent types (would need to be expanded based on OpenAPI spec)
export const V0NotarizeDataSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_NotarizeData"),
  // Additional properties would be specific to this intent type
})

export const V0ExecuteExtensionSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_ExecuteExtension"),
  // Additional properties would be specific to this intent type
})

export const V0UpdateDomainSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdateDomain"),
  // Additional properties would be specific to this intent type
})

export const V0UpdateDomainPermissionsSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdateDomainPermissions"),
  // Additional properties would be specific to this intent type
})

export const V0UpdateUserSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdateUser"),
  // Additional properties would be specific to this intent type
})

export const V0UpdatePolicySchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdatePolicy"),
  // Additional properties would be specific to this intent type
})

export const V0UpdateVaultSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdateVault"),
  // Additional properties would be specific to this intent type
})

export const V0UpdateEndpointSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdateEndpoint"),
  // Additional properties would be specific to this intent type
})

export const V0UpdateAccountSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdateAccount"),
  // Additional properties would be specific to this intent type
})

export const V0UpdateTickerSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdateTicker"),
  // Additional properties would be specific to this intent type
})

export const V0UpdateLedgerSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_UpdateLedger"),
  // Additional properties would be specific to this intent type
})

export const V0MigrateSilo3AccountBatchSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_MigrateSilo3AccountBatch"),
  // Additional properties would be specific to this intent type
})

export const V0AddAccountLedgersSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_AddAccountLedgers"),
  // Additional properties would be specific to this intent type
})

export const V0ReleaseQuarantinedTransfersSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_ReleaseQuarantinedTransfers"),
  // Additional properties would be specific to this intent type
})

export const V0AttemptTransactionOrderCancellationSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_AttemptTransactionOrderCancellation"),
  // Additional properties would be specific to this intent type
})

export const V0ValidateTickersSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_ValidateTickers"),
  // Additional properties would be specific to this intent type
})

export const V0SignManifestSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_SignManifest"),
  // Additional properties would be specific to this intent type
})

export const V0SetSystemPropertySchema = z.looseObject({
  /** Type */
  type: z.literal("v0_SetSystemProperty"),
  // Additional properties would be specific to this intent type
})

export const V0AddTrustedPublicKeysForMigrationSchema = z.looseObject({
  /** Type */
  type: z.literal("v0_AddTrustedPublicKeysForMigration"),
  // Additional properties would be specific to this intent type
})

// Propose User Intent Payload Schema - Union of all intent types
export const ProposeUserIntentPayloadSchema = z.discriminatedUnion("type", [
  V0NotarizeDataSchema,
  V0ExecuteExtensionSchema,
  V0CreateDomainSchema,
  V0UpdateDomainSchema,
  V0UpdateDomainPermissionsSchema,
  V0UnlockDomainSchema,
  V0LockDomainSchema,
  V0CreateUserSchema,
  V0UpdateUserSchema,
  V0UnlockUserSchema,
  V0LockUserSchema,
  V0CreatePolicySchema,
  V0UpdatePolicySchema,
  V0UnlockPolicySchema,
  V0LockPolicySchema,
  V0CreateVaultSchema,
  V0UpdateVaultSchema,
  V0UnlockVaultSchema,
  V0LockVaultSchema,
  V0UnlockTickerSchema,
  V0LockTickerSchema,
  V0CreateEndpointSchema,
  V0UpdateEndpointSchema,
  V0UnlockEndpointSchema,
  V0LockEndpointSchema,
  V0CreateAccountSchema,
  V0MigrateSilo3AccountBatchSchema,
  V0UpdateAccountSchema,
  V0UnlockAccountSchema,
  V0LockAccountSchema,
  V0AddAccountLedgersSchema,
  V0CreateTransactionOrderSchema,
  V0ReleaseQuarantinedTransfersSchema,
  V0CreateTickerSchema,
  V0AttemptTransactionOrderCancellationSchema,
  V0ValidateTickersSchema,
  V0UpdateTickerSchema,
  V0CreateTransferOrderSchema,
  V0SignManifestSchema,
  V0SetSystemPropertySchema,
  V0CreateLedgerSchema,
  V0UpdateLedgerSchema,
  V0AddTrustedPublicKeysForMigrationSchema,
])

// Propose Schema (Core_Propose)
export const ProposeSchema = z.object({
  /** Author information */
  author: UserReferenceSchema,
  /** Expiration timestamp */
  expiryAt: z.iso.datetime(),
  /** Target domain ID */
  targetDomainId: z.uuid(),
  /** Intent ID */
  id: z.uuid(),
  /** Intent payload */
  payload: ProposeUserIntentPayloadSchema,
  /** Custom properties */
  customProperties: StringsMapSchema,
  /** Type - always "Propose" */
  type: z.literal("Propose"),
  /** Optional description */
  description: z.string().min(0).max(250).optional(),
})

// Create Intent Request Body Schema (Core_ProposeIntentBody)
export const CreateIntentRequestSchema = z.object({
  /** Request data */
  request: ProposeSchema,
  /** Base64-encoded signature */
  signature: z.string(),
})





// Inferred TypeScript types from Zod schemas

export type StringsMap = z.infer<typeof StringsMapSchema>
export type EntityIdAndRevision = z.infer<typeof EntityIdAndRevisionSchema>
export type IntentLockStatus = z.infer<typeof IntentLockStatusSchema>
export type GoverningStrategy = z.infer<typeof GoverningStrategySchema>
export type ReadAccess = z.infer<typeof ReadAccessSchema>
export type Permissions = z.infer<typeof PermissionsSchema>
export type AccountKeyStrategy = z.infer<typeof AccountKeyStrategySchema>
export type CreateAccountProviderDetailsPayloadVault = z.infer<typeof CreateAccountProviderDetailsPayloadVaultSchema>
export type CreateAccountProviderDetailsPayload = z.infer<typeof CreateAccountProviderDetailsPayloadSchema>
export type CreateDomainGenesisUser = z.infer<typeof CreateDomainGenesisUserSchema>
export type CreateDomainGenesisPolicy = z.infer<typeof CreateDomainGenesisPolicySchema>
export type TransactionDestination = z.infer<typeof TransactionDestinationSchema>
export type XrplTransactionDestinationAccount = z.infer<typeof XrplTransactionDestinationAccountSchema>
export type XrplTransactionDestinationAddress = z.infer<typeof XrplTransactionDestinationAddressSchema>
export type XrplTransactionDestinationEndpoint = z.infer<typeof XrplTransactionDestinationEndpointSchema>
export type XrplTransactionDestination = z.infer<typeof XrplTransactionDestinationSchema>
export type XrplCurrencyCurrency = z.infer<typeof XrplCurrencyCurrencySchema>
export type XrplCurrencyTickerId = z.infer<typeof XrplCurrencyTickerIdSchema>
export type XrplCurrency = z.infer<typeof XrplCurrencySchema>
export type XrplTrustSetFlag = z.infer<typeof XrplTrustSetFlagSchema>
export type XrplLimitAmount = z.infer<typeof XrplLimitAmountSchema>
export type XrplAssetQuantity = z.infer<typeof XrplAssetQuantitySchema>
export type XrplOfferCreateFlag = z.infer<typeof XrplOfferCreateFlagSchema>
export type XrplAccountSetFlag = z.infer<typeof XrplAccountSetFlagSchema>
export type FeePriority = z.infer<typeof FeePrioritySchema>
export type XrplFeeStrategyPriority = z.infer<typeof XrplFeeStrategyPrioritySchema>
export type XrplFeeStrategySpecifiedAdditionalFee = z.infer<typeof XrplFeeStrategySpecifiedAdditionalFeeSchema>
export type XrplFeeStrategy = z.infer<typeof XrplFeeStrategySchema>
export type XrplMemo = z.infer<typeof XrplMemoSchema>
export type XrplOperationPayment = z.infer<typeof XrplOperationPaymentSchema>
export type XrplOperationTrustSet = z.infer<typeof XrplOperationTrustSetSchema>
export type XrplOperationAccountSet = z.infer<typeof XrplOperationAccountSetSchema>
export type XrplOperationOfferCreate = z.infer<typeof XrplOperationOfferCreateSchema>
export type XrplOperationClawback = z.infer<typeof XrplOperationClawbackSchema>
export type XrplOperationDepositPreauth = z.infer<typeof XrplOperationDepositPreauthSchema>
export type XrplOperation = z.infer<typeof XrplOperationSchema>
export type TransactionOrderParametersXrpl = z.infer<typeof TransactionOrderParametersXrplSchema>
export type TransactionOrderParametersEthereum = z.infer<typeof TransactionOrderParametersEthereumSchema>
export type TransactionOrderParametersBitcoin = z.infer<typeof TransactionOrderParametersBitcoinSchema>
export type TransactionOrderParametersSolana = z.infer<typeof TransactionOrderParametersSolanaSchema>
export type TransactionOrderParametersHedera = z.infer<typeof TransactionOrderParametersHederaSchema>
export type TransactionOrderParametersCardano = z.infer<typeof TransactionOrderParametersCardanoSchema>
export type TransactionOrderParametersStellar = z.infer<typeof TransactionOrderParametersStellarSchema>
export type TransactionOrderParametersSubstrate = z.infer<typeof TransactionOrderParametersSubstrateSchema>
export type TransactionOrderParametersTezos = z.infer<typeof TransactionOrderParametersTezosSchema>
export type TransactionOrderParametersTron = z.infer<typeof TransactionOrderParametersTronSchema>
export type TransactionOrderParametersAlgorand = z.infer<typeof TransactionOrderParametersAlgorandSchema>
export type TransactionOrderParameters = z.infer<typeof TransactionOrderParametersSchema>
export type IntentType = z.infer<typeof IntentTypeSchema>
export type ProposeUserIntentPayload = z.infer<typeof ProposeUserIntentPayloadSchema>
export type Propose = z.infer<typeof ProposeSchema>
export type CreateIntentRequest = z.infer<typeof CreateIntentRequestSchema>



// Individual intent type exports
export type V0CreateAccount = z.infer<typeof V0CreateAccountSchema>
export type V0CreateDomain = z.infer<typeof V0CreateDomainSchema>
export type V0CreateEndpoint = z.infer<typeof V0CreateEndpointSchema>
export type V0CreateLedger = z.infer<typeof V0CreateLedgerSchema>
export type V0CreatePolicy = z.infer<typeof V0CreatePolicySchema>
export type V0CreateTicker = z.infer<typeof V0CreateTickerSchema>
export type V0CreateTransactionOrder = z.infer<typeof V0CreateTransactionOrderSchema>
export type V0CreateTransferOrder = z.infer<typeof V0CreateTransferOrderSchema>
export type V0CreateUser = z.infer<typeof V0CreateUserSchema>
export type V0CreateVault = z.infer<typeof V0CreateVaultSchema>
export type V0LockAccount = z.infer<typeof V0LockAccountSchema>
export type V0LockDomain = z.infer<typeof V0LockDomainSchema>
export type V0LockEndpoint = z.infer<typeof V0LockEndpointSchema>
export type V0LockPolicy = z.infer<typeof V0LockPolicySchema>
export type V0LockTicker = z.infer<typeof V0LockTickerSchema>
export type V0LockUser = z.infer<typeof V0LockUserSchema>
export type V0LockVault = z.infer<typeof V0LockVaultSchema>
export type V0UnlockAccount = z.infer<typeof V0UnlockAccountSchema>
export type V0UnlockDomain = z.infer<typeof V0UnlockDomainSchema>
export type V0UnlockEndpoint = z.infer<typeof V0UnlockEndpointSchema>
export type V0UnlockPolicy = z.infer<typeof V0UnlockPolicySchema>
export type V0UnlockTicker = z.infer<typeof V0UnlockTickerSchema>
export type V0UnlockUser = z.infer<typeof V0UnlockUserSchema>
export type V0UnlockVault = z.infer<typeof V0UnlockVaultSchema>
