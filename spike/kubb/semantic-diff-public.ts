import type * as New from "../../src/models/custody-types.js"
import type * as Old from "./baseline/old-public.js"
type Eq<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
type Present<T> = { [K in keyof T]-?: [T[K]] extends [never] ? never : K }[keyof T]
export const _1: Eq<keyof Old.paths, keyof New.paths> = true
export const _2: Eq<keyof Old.operations, keyof New.operations> = true
export const _3: Eq<keyof Old.components["schemas"], keyof New.components["schemas"]> = true
export const _4: Eq<
  Old.components["schemas"]["Core_Account"],
  New.components["schemas"]["Core_Account"]
> = true
export const _5: Eq<
  Old.components["schemas"]["Core_AccountAdditionalDetails"],
  New.components["schemas"]["Core_AccountAdditionalDetails"]
> = true
export const _6: Eq<
  Old.components["schemas"]["Core_AccountAddress"],
  New.components["schemas"]["Core_AccountAddress"]
> = true
export const _7: Eq<
  Old.components["schemas"]["Core_AccountAddressData"],
  New.components["schemas"]["Core_AccountAddressData"]
> = true
export const _8: Eq<
  Old.components["schemas"]["Core_AccountAddressReference"],
  New.components["schemas"]["Core_AccountAddressReference"]
> = true
export const _9: Eq<
  Old.components["schemas"]["Core_AccountAddressScope"],
  New.components["schemas"]["Core_AccountAddressScope"]
> = true
export const _10: Eq<
  Old.components["schemas"]["Core_AccountCreated"],
  New.components["schemas"]["Core_AccountCreated"]
> = true
export const _11: Eq<
  Old.components["schemas"]["Core_AccountKeyStrategy"],
  New.components["schemas"]["Core_AccountKeyStrategy"]
> = true
export const _12: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails"]
> = true
export const _13: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails_Pending"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails_Pending"]
> = true
export const _14: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails_Pending_Hint"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails_Pending_Hint"]
> = true
export const _15: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails_Preparing"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails_Preparing"]
> = true
export const _16: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails_Preparing_Hint"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails_Preparing_Hint"]
> = true
export const _17: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails_Recovering"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails_Recovering"]
> = true
export const _18: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails_Recovering_Hint"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails_Recovering_Hint"]
> = true
export const _19: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails_Tracked"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails_Tracked"]
> = true
export const _20: Eq<
  Old.components["schemas"]["Core_AccountLedgerProcessingDetails_Tracked_Hint"],
  New.components["schemas"]["Core_AccountLedgerProcessingDetails_Tracked_Hint"]
> = true
export const _21: Eq<
  Old.components["schemas"]["Core_AccountLedgerStatus"],
  New.components["schemas"]["Core_AccountLedgerStatus"]
> = true
export const _22: Eq<
  Old.components["schemas"]["Core_AccountProcessingDetails"],
  New.components["schemas"]["Core_AccountProcessingDetails"]
> = true
export const _23: Eq<
  Old.components["schemas"]["Core_AccountProcessingDetails_Completed"],
  New.components["schemas"]["Core_AccountProcessingDetails_Completed"]
> = true
export const _24: Eq<
  Old.components["schemas"]["Core_AccountProcessingDetails_Interrupted"],
  New.components["schemas"]["Core_AccountProcessingDetails_Interrupted"]
> = true
export const _25: Eq<
  Old.components["schemas"]["Core_AccountProcessingDetails_Pending"],
  New.components["schemas"]["Core_AccountProcessingDetails_Pending"]
> = true
export const _26: Eq<
  Old.components["schemas"]["Core_AccountProcessingDetails_Preparing"],
  New.components["schemas"]["Core_AccountProcessingDetails_Preparing"]
> = true
export const _27: Eq<
  Old.components["schemas"]["Core_AccountProcessingDetails_Recovering"],
  New.components["schemas"]["Core_AccountProcessingDetails_Recovering"]
> = true
export const _28: Eq<
  Old.components["schemas"]["Core_AccountProcessingDetails_Tracked"],
  New.components["schemas"]["Core_AccountProcessingDetails_Tracked"]
> = true
export const _29: Eq<
  Old.components["schemas"]["Core_AccountProcessingStatus"],
  New.components["schemas"]["Core_AccountProcessingStatus"]
> = true
export const _30: Eq<
  Old.components["schemas"]["Core_AccountProviderInformation"],
  New.components["schemas"]["Core_AccountProviderInformation"]
> = true
export const _31: Eq<
  Old.components["schemas"]["Core_AccountProviderInformation_Vault"],
  New.components["schemas"]["Core_AccountProviderInformation_Vault"]
> = true
export const _32: Eq<
  Old.components["schemas"]["Core_AccountPublicKey"],
  New.components["schemas"]["Core_AccountPublicKey"]
> = true
export const _33: Eq<
  Old.components["schemas"]["Core_AccountPublicKeyExtendedOnly"],
  New.components["schemas"]["Core_AccountPublicKeyExtendedOnly"]
> = true
export const _34: Eq<
  Old.components["schemas"]["Core_AccountPublicKeyExtendedOnly_ExtendedPublicKey"],
  New.components["schemas"]["Core_AccountPublicKeyExtendedOnly_ExtendedPublicKey"]
> = true
export const _35: Eq<
  Old.components["schemas"]["Core_AccountPublicKeyOnly"],
  New.components["schemas"]["Core_AccountPublicKeyOnly"]
> = true
export const _36: Eq<
  Old.components["schemas"]["Core_AccountPublicKeyOnly_PublicKey"],
  New.components["schemas"]["Core_AccountPublicKeyOnly_PublicKey"]
> = true
export const _37: Eq<
  Old.components["schemas"]["Core_AccountPublicKey_ExtendedPublicKey"],
  New.components["schemas"]["Core_AccountPublicKey_ExtendedPublicKey"]
> = true
export const _38: Eq<
  Old.components["schemas"]["Core_AccountPublicKey_PublicKey"],
  New.components["schemas"]["Core_AccountPublicKey_PublicKey"]
> = true
export const _39: Eq<
  Old.components["schemas"]["Core_AccountReference"],
  New.components["schemas"]["Core_AccountReference"]
> = true
export const _40: Eq<
  Old.components["schemas"]["Core_AccountUpdated"],
  New.components["schemas"]["Core_AccountUpdated"]
> = true
export const _41: Eq<
  Old.components["schemas"]["Core_AccountsCollection"],
  New.components["schemas"]["Core_AccountsCollection"]
> = true
export const _42: Eq<
  Old.components["schemas"]["Core_AddressCreated"],
  New.components["schemas"]["Core_AddressCreated"]
> = true
export const _43: Eq<
  Old.components["schemas"]["Core_AddressDetails"],
  New.components["schemas"]["Core_AddressDetails"]
> = true
export const _44: Eq<
  Old.components["schemas"]["Core_AddressForChange"],
  New.components["schemas"]["Core_AddressForChange"]
> = true
export const _45: Eq<
  Old.components["schemas"]["Core_AddressReferenceCollection"],
  New.components["schemas"]["Core_AddressReferenceCollection"]
> = true
export const _46: Eq<
  Old.components["schemas"]["Core_AddressesCollection"],
  New.components["schemas"]["Core_AddressesCollection"]
> = true
export const _47: Eq<
  Old.components["schemas"]["Core_AddressesReference"],
  New.components["schemas"]["Core_AddressesReference"]
> = true
export const _48: Eq<
  Old.components["schemas"]["Core_AlgorandFeeStrategy"],
  New.components["schemas"]["Core_AlgorandFeeStrategy"]
> = true
export const _49: Eq<
  Old.components["schemas"]["Core_AlgorandFeeStrategy_Priority"],
  New.components["schemas"]["Core_AlgorandFeeStrategy_Priority"]
> = true
export const _50: Eq<
  Old.components["schemas"]["Core_AlgorandOperation"],
  New.components["schemas"]["Core_AlgorandOperation"]
> = true
export const _51: Eq<
  Old.components["schemas"]["Core_AlgorandOperation_Payment"],
  New.components["schemas"]["Core_AlgorandOperation_Payment"]
> = true
export const _52: Eq<
  Old.components["schemas"]["Core_AlgorandTickerProperties"],
  New.components["schemas"]["Core_AlgorandTickerProperties"]
> = true
export const _53: Eq<
  Old.components["schemas"]["Core_AlgorandTickerProperties_Native"],
  New.components["schemas"]["Core_AlgorandTickerProperties_Native"]
> = true
export const _54: Eq<
  Old.components["schemas"]["Core_ApiAccount"],
  New.components["schemas"]["Core_ApiAccount"]
> = true
export const _55: Eq<
  Old.components["schemas"]["Core_ApiAccountLedgerProcessing"],
  New.components["schemas"]["Core_ApiAccountLedgerProcessing"]
> = true
export const _56: Eq<
  Old.components["schemas"]["Core_ApiAccountLedgerProcessing_Activated"],
  New.components["schemas"]["Core_ApiAccountLedgerProcessing_Activated"]
> = true
export const _57: Eq<
  Old.components["schemas"]["Core_ApiAccountLedgerProcessing_Activating"],
  New.components["schemas"]["Core_ApiAccountLedgerProcessing_Activating"]
> = true
export const _58: Eq<
  Old.components["schemas"]["Core_ApiAccountLedgerProcessing_Available"],
  New.components["schemas"]["Core_ApiAccountLedgerProcessing_Available"]
> = true
export const _59: Eq<
  Old.components["schemas"]["Core_ApiAccountLedgerProcessing_AwaitingLedgerActivation"],
  New.components["schemas"]["Core_ApiAccountLedgerProcessing_AwaitingLedgerActivation"]
> = true
export const _60: Eq<
  Old.components["schemas"]["Core_ApiAccountLedgerProcessing_Unavailable"],
  New.components["schemas"]["Core_ApiAccountLedgerProcessing_Unavailable"]
> = true
export const _61: Eq<
  Old.components["schemas"]["Core_ApiBackup"],
  New.components["schemas"]["Core_ApiBackup"]
> = true
export const _62: Eq<
  Old.components["schemas"]["Core_ApiBackupData"],
  New.components["schemas"]["Core_ApiBackupData"]
> = true
export const _63: Eq<
  Old.components["schemas"]["Core_ApiBackupData_VaultHSM"],
  New.components["schemas"]["Core_ApiBackupData_VaultHSM"]
> = true
export const _64: Eq<
  Old.components["schemas"]["Core_ApiBackupData_VaultMPC"],
  New.components["schemas"]["Core_ApiBackupData_VaultMPC"]
> = true
export const _65: Eq<
  Old.components["schemas"]["Core_ApiBroadcastingTransactionProcessingHint"],
  New.components["schemas"]["Core_ApiBroadcastingTransactionProcessingHint"]
> = true
export const _66: Eq<
  Old.components["schemas"]["Core_ApiDryRunTransactionProcessingHint"],
  New.components["schemas"]["Core_ApiDryRunTransactionProcessingHint"]
> = true
export const _67: Eq<
  Old.components["schemas"]["Core_ApiFailedTransactionProcessingHint"],
  New.components["schemas"]["Core_ApiFailedTransactionProcessingHint"]
> = true
export const _68: Eq<
  Old.components["schemas"]["Core_ApiInterruptedTransactionCause"],
  New.components["schemas"]["Core_ApiInterruptedTransactionCause"]
> = true
export const _69: Eq<
  Old.components["schemas"]["Core_ApiManifest"],
  New.components["schemas"]["Core_ApiManifest"]
> = true
export const _70: Eq<
  Old.components["schemas"]["Core_ApiPendingAccountProcessingHint"],
  New.components["schemas"]["Core_ApiPendingAccountProcessingHint"]
> = true
export const _71: Eq<
  Old.components["schemas"]["Core_ApiPendingTransactionProcessingHint"],
  New.components["schemas"]["Core_ApiPendingTransactionProcessingHint"]
> = true
export const _72: Eq<
  Old.components["schemas"]["Core_ApiPreparingAccountProcessingHint"],
  New.components["schemas"]["Core_ApiPreparingAccountProcessingHint"]
> = true
export const _73: Eq<
  Old.components["schemas"]["Core_ApiPreparingTransactionProcessingHint"],
  New.components["schemas"]["Core_ApiPreparingTransactionProcessingHint"]
> = true
export const _74: Eq<
  Old.components["schemas"]["Core_ApiRecoveringAccountProcessingHint"],
  New.components["schemas"]["Core_ApiRecoveringAccountProcessingHint"]
> = true
export const _75: Eq<
  Old.components["schemas"]["Core_ApiRoles"],
  New.components["schemas"]["Core_ApiRoles"]
> = true
export const _76: Eq<
  Old.components["schemas"]["Core_ApiTicker"],
  New.components["schemas"]["Core_ApiTicker"]
> = true
export const _77: Eq<
  Old.components["schemas"]["Core_ApiTickerData"],
  New.components["schemas"]["Core_ApiTickerData"]
> = true
export const _78: Eq<
  Old.components["schemas"]["Core_ApiTransaction"],
  New.components["schemas"]["Core_ApiTransaction"]
> = true
export const _79: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails"]
> = true
export const _80: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails_Broadcasting"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails_Broadcasting"]
> = true
export const _81: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails_Completed"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails_Completed"]
> = true
export const _82: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails_Failed"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails_Failed"]
> = true
export const _83: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails_Interrupted"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails_Interrupted"]
> = true
export const _84: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails_Pending"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails_Pending"]
> = true
export const _85: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails_Prepared"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails_Prepared"]
> = true
export const _86: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails_Preparing"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails_Preparing"]
> = true
export const _87: Eq<
  Old.components["schemas"]["Core_ApiTransactionProcessingDetails_Reserved"],
  New.components["schemas"]["Core_ApiTransactionProcessingDetails_Reserved"]
> = true
export const _88: Eq<
  Old.components["schemas"]["Core_ApiTransfer"],
  New.components["schemas"]["Core_ApiTransfer"]
> = true
export const _89: Eq<
  Old.components["schemas"]["Core_ApiTrustedBackup"],
  New.components["schemas"]["Core_ApiTrustedBackup"]
> = true
export const _90: Eq<
  Old.components["schemas"]["Core_ApiVault"],
  New.components["schemas"]["Core_ApiVault"]
> = true
export const _91: Eq<
  Old.components["schemas"]["Core_ApprovalDecision"],
  New.components["schemas"]["Core_ApprovalDecision"]
> = true
export const _92: Eq<
  Old.components["schemas"]["Core_Approve"],
  New.components["schemas"]["Core_Approve"]
> = true
export const _93: Eq<
  Old.components["schemas"]["Core_ApproveIntentBody"],
  New.components["schemas"]["Core_ApproveIntentBody"]
> = true
export const _94: Eq<
  Old.components["schemas"]["Core_Backup"],
  New.components["schemas"]["Core_Backup"]
> = true
export const _95: Eq<
  Old.components["schemas"]["Core_BackupAdditionalDetails"],
  New.components["schemas"]["Core_BackupAdditionalDetails"]
> = true
export const _96: Eq<
  Old.components["schemas"]["Core_BackupCreated"],
  New.components["schemas"]["Core_BackupCreated"]
> = true
export const _97: Eq<
  Old.components["schemas"]["Core_BackupData"],
  New.components["schemas"]["Core_BackupData"]
> = true
export const _98: Eq<
  Old.components["schemas"]["Core_BackupData_VaultHsm"],
  New.components["schemas"]["Core_BackupData_VaultHsm"]
> = true
export const _99: Eq<
  Old.components["schemas"]["Core_BackupData_VaultMpc"],
  New.components["schemas"]["Core_BackupData_VaultMpc"]
> = true
export const _100: Eq<
  Old.components["schemas"]["Core_BackupProcessingDetails"],
  New.components["schemas"]["Core_BackupProcessingDetails"]
> = true
export const _101: Eq<
  Old.components["schemas"]["Core_BackupProcessingDetails_Completed"],
  New.components["schemas"]["Core_BackupProcessingDetails_Completed"]
> = true
export const _102: Eq<
  Old.components["schemas"]["Core_BackupProcessingDetails_Failed"],
  New.components["schemas"]["Core_BackupProcessingDetails_Failed"]
> = true
export const _103: Eq<
  Old.components["schemas"]["Core_BackupProcessingDetails_Pending"],
  New.components["schemas"]["Core_BackupProcessingDetails_Pending"]
> = true
export const _104: Eq<
  Old.components["schemas"]["Core_BackupProcessingDetails_Preparing"],
  New.components["schemas"]["Core_BackupProcessingDetails_Preparing"]
> = true
export const _105: Eq<
  Old.components["schemas"]["Core_BackupProcessingStatus"],
  New.components["schemas"]["Core_BackupProcessingStatus"]
> = true
export const _106: Eq<
  Old.components["schemas"]["Core_BackupType"],
  New.components["schemas"]["Core_BackupType"]
> = true
export const _107: Eq<
  Old.components["schemas"]["Core_BackupUpdated"],
  New.components["schemas"]["Core_BackupUpdated"]
> = true
export const _108: Eq<
  Old.components["schemas"]["Core_BackupsCollection"],
  New.components["schemas"]["Core_BackupsCollection"]
> = true
export const _109: Eq<
  Old.components["schemas"]["Core_Balance"],
  New.components["schemas"]["Core_Balance"]
> = true
export const _110: Eq<
  Old.components["schemas"]["Core_BalanceWithConfirmedAmount"],
  New.components["schemas"]["Core_BalanceWithConfirmedAmount"]
> = true
export const _111: Eq<
  Old.components["schemas"]["Core_BalancesCollection"],
  New.components["schemas"]["Core_BalancesCollection"]
> = true
export const _112: Eq<
  Old.components["schemas"]["Core_BalancesUpdated"],
  New.components["schemas"]["Core_BalancesUpdated"]
> = true
export const _113: Eq<
  Old.components["schemas"]["Core_BitcoinFee"],
  New.components["schemas"]["Core_BitcoinFee"]
> = true
export const _114: Eq<
  Old.components["schemas"]["Core_BitcoinFeeStrategy"],
  New.components["schemas"]["Core_BitcoinFeeStrategy"]
> = true
export const _115: Eq<
  Old.components["schemas"]["Core_BitcoinFeeStrategy_Priority"],
  New.components["schemas"]["Core_BitcoinFeeStrategy_Priority"]
> = true
export const _116: Eq<
  Old.components["schemas"]["Core_BitcoinFeeStrategy_SpecifiedRate"],
  New.components["schemas"]["Core_BitcoinFeeStrategy_SpecifiedRate"]
> = true
export const _117: Eq<
  Old.components["schemas"]["Core_BitcoinLikeVaultLedgerIdentifier"],
  New.components["schemas"]["Core_BitcoinLikeVaultLedgerIdentifier"]
> = true
export const _118: Eq<
  Old.components["schemas"]["Core_BitcoinOnLedgerDataInput"],
  New.components["schemas"]["Core_BitcoinOnLedgerDataInput"]
> = true
export const _119: Eq<
  Old.components["schemas"]["Core_BitcoinOnLedgerDataOutput"],
  New.components["schemas"]["Core_BitcoinOnLedgerDataOutput"]
> = true
export const _120: Eq<
  Old.components["schemas"]["Core_BitcoinOutputParameters"],
  New.components["schemas"]["Core_BitcoinOutputParameters"]
> = true
export const _121: Eq<
  Old.components["schemas"]["Core_BitcoinResourceStrategy"],
  New.components["schemas"]["Core_BitcoinResourceStrategy"]
> = true
export const _122: Eq<
  Old.components["schemas"]["Core_BitcoinResourceStrategy_OrderReplacement"],
  New.components["schemas"]["Core_BitcoinResourceStrategy_OrderReplacement"]
> = true
export const _123: Eq<
  Old.components["schemas"]["Core_BitcoinTickerProperties"],
  New.components["schemas"]["Core_BitcoinTickerProperties"]
> = true
export const _124: Eq<
  Old.components["schemas"]["Core_BitcoinTickerProperties_Native"],
  New.components["schemas"]["Core_BitcoinTickerProperties_Native"]
> = true
export const _125: Eq<
  Old.components["schemas"]["Core_CardanoFeeStrategy"],
  New.components["schemas"]["Core_CardanoFeeStrategy"]
> = true
export const _126: Eq<
  Old.components["schemas"]["Core_CardanoFeeStrategy_Priority"],
  New.components["schemas"]["Core_CardanoFeeStrategy_Priority"]
> = true
export const _127: Eq<
  Old.components["schemas"]["Core_CardanoOperation"],
  New.components["schemas"]["Core_CardanoOperation"]
> = true
export const _128: Eq<
  Old.components["schemas"]["Core_CardanoOperation_DelegateRepresentative"],
  New.components["schemas"]["Core_CardanoOperation_DelegateRepresentative"]
> = true
export const _129: Eq<
  Old.components["schemas"]["Core_CardanoOperation_DelegateStaking"],
  New.components["schemas"]["Core_CardanoOperation_DelegateStaking"]
> = true
export const _130: Eq<
  Old.components["schemas"]["Core_CardanoOperation_RegisterStaking"],
  New.components["schemas"]["Core_CardanoOperation_RegisterStaking"]
> = true
export const _131: Eq<
  Old.components["schemas"]["Core_CardanoOperation_Transfer"],
  New.components["schemas"]["Core_CardanoOperation_Transfer"]
> = true
export const _132: Eq<
  Old.components["schemas"]["Core_CardanoOperation_UnregisterStaking"],
  New.components["schemas"]["Core_CardanoOperation_UnregisterStaking"]
> = true
export const _133: Eq<
  Old.components["schemas"]["Core_CardanoOperation_WithdrawRewards"],
  New.components["schemas"]["Core_CardanoOperation_WithdrawRewards"]
> = true
export const _134: Eq<
  Old.components["schemas"]["Core_CardanoOutputParameters"],
  New.components["schemas"]["Core_CardanoOutputParameters"]
> = true
export const _135: Eq<
  Old.components["schemas"]["Core_CardanoTickerProperties"],
  New.components["schemas"]["Core_CardanoTickerProperties"]
> = true
export const _136: Eq<
  Old.components["schemas"]["Core_CardanoTickerProperties_Native"],
  New.components["schemas"]["Core_CardanoTickerProperties_Native"]
> = true
export const _137: Eq<
  Old.components["schemas"]["Core_ComplianceConfiguration"],
  New.components["schemas"]["Core_ComplianceConfiguration"]
> = true
export const _138: Eq<
  Old.components["schemas"]["Core_ComplianceConfigurationUpdated"],
  New.components["schemas"]["Core_ComplianceConfigurationUpdated"]
> = true
export const _139: Eq<
  Old.components["schemas"]["Core_ComplianceConfigurationsCollection"],
  New.components["schemas"]["Core_ComplianceConfigurationsCollection"]
> = true
export const _140: Eq<
  Old.components["schemas"]["Core_ContractParameters"],
  New.components["schemas"]["Core_ContractParameters"]
> = true
export const _141: Eq<
  Old.components["schemas"]["Core_ContractParameters_Raw"],
  New.components["schemas"]["Core_ContractParameters_Raw"]
> = true
export const _142: Eq<
  Old.components["schemas"]["Core_CreateAccountDryRunResult"],
  New.components["schemas"]["Core_CreateAccountDryRunResult"]
> = true
export const _143: Eq<
  Old.components["schemas"]["Core_CreateDomainGenesisPolicy"],
  New.components["schemas"]["Core_CreateDomainGenesisPolicy"]
> = true
export const _144: Eq<
  Old.components["schemas"]["Core_CreateDomainGenesisUser"],
  New.components["schemas"]["Core_CreateDomainGenesisUser"]
> = true
export const _145: Eq<
  Old.components["schemas"]["Core_CreateDomainsPayload"],
  New.components["schemas"]["Core_CreateDomainsPayload"]
> = true
export const _146: Eq<
  Old.components["schemas"]["Core_CreateLedgerGenesis"],
  New.components["schemas"]["Core_CreateLedgerGenesis"]
> = true
export const _147: Eq<
  Old.components["schemas"]["Core_CreateTransferOrderOutput"],
  New.components["schemas"]["Core_CreateTransferOrderOutput"]
> = true
export const _148: Eq<
  Old.components["schemas"]["Core_CreatedEntitiesReferences"],
  New.components["schemas"]["Core_CreatedEntitiesReferences"]
> = true
export const _149: Eq<
  Old.components["schemas"]["Core_CreatedEntitiesReferences_Policy"],
  New.components["schemas"]["Core_CreatedEntitiesReferences_Policy"]
> = true
export const _150: Eq<
  Old.components["schemas"]["Core_CreatedEntitiesReferences_User"],
  New.components["schemas"]["Core_CreatedEntitiesReferences_User"]
> = true
export const _151: Eq<
  Old.components["schemas"]["Core_CurrentFees"],
  New.components["schemas"]["Core_CurrentFees"]
> = true
export const _152: Eq<
  Old.components["schemas"]["Core_CurrentFees_Bitcoin"],
  New.components["schemas"]["Core_CurrentFees_Bitcoin"]
> = true
export const _153: Eq<
  Old.components["schemas"]["Core_CurrentFees_Ethereum"],
  New.components["schemas"]["Core_CurrentFees_Ethereum"]
> = true
export const _154: Eq<
  Old.components["schemas"]["Core_CurrentFees_Stellar"],
  New.components["schemas"]["Core_CurrentFees_Stellar"]
> = true
export const _155: Eq<
  Old.components["schemas"]["Core_CurrentFees_XRPL"],
  New.components["schemas"]["Core_CurrentFees_XRPL"]
> = true
export const _156: Eq<
  Old.components["schemas"]["Core_CustodyType"],
  New.components["schemas"]["Core_CustodyType"]
> = true
export const _157: Eq<
  Old.components["schemas"]["Core_DecisionPayload"],
  New.components["schemas"]["Core_DecisionPayload"]
> = true
export const _158: Eq<
  Old.components["schemas"]["Core_DelegateRepresentativeParameters"],
  New.components["schemas"]["Core_DelegateRepresentativeParameters"]
> = true
export const _159: Eq<
  Old.components["schemas"]["Core_DelegateRepresentativeParameters_AlwaysAbstain"],
  New.components["schemas"]["Core_DelegateRepresentativeParameters_AlwaysAbstain"]
> = true
export const _160: Eq<
  Old.components["schemas"]["Core_Domain"],
  New.components["schemas"]["Core_Domain"]
> = true
export const _161: Eq<
  Old.components["schemas"]["Core_DomainCreated"],
  New.components["schemas"]["Core_DomainCreated"]
> = true
export const _162: Eq<
  Old.components["schemas"]["Core_DomainUpdated"],
  New.components["schemas"]["Core_DomainUpdated"]
> = true
export const _163: Eq<
  Old.components["schemas"]["Core_DryRunTransactionParameters"],
  New.components["schemas"]["Core_DryRunTransactionParameters"]
> = true
export const _164: Eq<
  Old.components["schemas"]["Core_Endpoint"],
  New.components["schemas"]["Core_Endpoint"]
> = true
export const _165: Eq<
  Old.components["schemas"]["Core_EndpointCreated"],
  New.components["schemas"]["Core_EndpointCreated"]
> = true
export const _166: Eq<
  Old.components["schemas"]["Core_EndpointLedgerParameters"],
  New.components["schemas"]["Core_EndpointLedgerParameters"]
> = true
export const _167: Eq<
  Old.components["schemas"]["Core_EndpointLedgerParameters_Ethereum"],
  New.components["schemas"]["Core_EndpointLedgerParameters_Ethereum"]
> = true
export const _168: Eq<
  Old.components["schemas"]["Core_EndpointUpdated"],
  New.components["schemas"]["Core_EndpointUpdated"]
> = true
export const _169: Eq<
  Old.components["schemas"]["Core_EntityIdAndRevision"],
  New.components["schemas"]["Core_EntityIdAndRevision"]
> = true
export const _170: Eq<
  Old.components["schemas"]["Core_EntityMetadata"],
  New.components["schemas"]["Core_EntityMetadata"]
> = true
export const _171: Eq<
  Old.components["schemas"]["Core_EntityStringIdAndRevision"],
  New.components["schemas"]["Core_EntityStringIdAndRevision"]
> = true
export const _172: Eq<
  Old.components["schemas"]["Core_ErrorMessage"],
  New.components["schemas"]["Core_ErrorMessage"]
> = true
export const _173: Eq<
  Old.components["schemas"]["Core_EthereumCallRequest"],
  New.components["schemas"]["Core_EthereumCallRequest"]
> = true
export const _174: Eq<
  Old.components["schemas"]["Core_EthereumCaller"],
  New.components["schemas"]["Core_EthereumCaller"]
> = true
export const _175: Eq<
  Old.components["schemas"]["Core_EthereumCaller_Account"],
  New.components["schemas"]["Core_EthereumCaller_Account"]
> = true
export const _176: Eq<
  Old.components["schemas"]["Core_EthereumCaller_Address"],
  New.components["schemas"]["Core_EthereumCaller_Address"]
> = true
export const _177: Eq<
  Old.components["schemas"]["Core_EthereumEIP1559Prices"],
  New.components["schemas"]["Core_EthereumEIP1559Prices"]
> = true
export const _178: Eq<
  Old.components["schemas"]["Core_EthereumFee"],
  New.components["schemas"]["Core_EthereumFee"]
> = true
export const _179: Eq<
  Old.components["schemas"]["Core_EthereumFeeStrategy"],
  New.components["schemas"]["Core_EthereumFeeStrategy"]
> = true
export const _180: Eq<
  Old.components["schemas"]["Core_EthereumFeeStrategy_Priority"],
  New.components["schemas"]["Core_EthereumFeeStrategy_Priority"]
> = true
export const _181: Eq<
  Old.components["schemas"]["Core_EthereumFeeStrategy_SpecifiedRate"],
  New.components["schemas"]["Core_EthereumFeeStrategy_SpecifiedRate"]
> = true
export const _182: Eq<
  Old.components["schemas"]["Core_EthereumFeeStrategy_SpecifiedRateEIP1559"],
  New.components["schemas"]["Core_EthereumFeeStrategy_SpecifiedRateEIP1559"]
> = true
export const _183: Eq<
  Old.components["schemas"]["Core_EthereumLedgerLog"],
  New.components["schemas"]["Core_EthereumLedgerLog"]
> = true
export const _184: Eq<
  Old.components["schemas"]["Core_EthereumLikeVaultLedgerIdentifier"],
  New.components["schemas"]["Core_EthereumLikeVaultLedgerIdentifier"]
> = true
export const _185: Eq<
  Old.components["schemas"]["Core_EthereumResourceStrategy"],
  New.components["schemas"]["Core_EthereumResourceStrategy"]
> = true
export const _186: Eq<
  Old.components["schemas"]["Core_EthereumResourceStrategy_OrderReplacement"],
  New.components["schemas"]["Core_EthereumResourceStrategy_OrderReplacement"]
> = true
export const _187: Eq<
  Old.components["schemas"]["Core_EthereumTickerProperties"],
  New.components["schemas"]["Core_EthereumTickerProperties"]
> = true
export const _188: Eq<
  Old.components["schemas"]["Core_EthereumTickerProperties_ERC1155"],
  New.components["schemas"]["Core_EthereumTickerProperties_ERC1155"]
> = true
export const _189: Eq<
  Old.components["schemas"]["Core_EthereumTickerProperties_ERC20"],
  New.components["schemas"]["Core_EthereumTickerProperties_ERC20"]
> = true
export const _190: Eq<
  Old.components["schemas"]["Core_EthereumTickerProperties_ERC721"],
  New.components["schemas"]["Core_EthereumTickerProperties_ERC721"]
> = true
export const _191: Eq<
  Old.components["schemas"]["Core_EthereumTickerProperties_Native"],
  New.components["schemas"]["Core_EthereumTickerProperties_Native"]
> = true
export const _192: Eq<
  Old.components["schemas"]["Core_EventScope"],
  New.components["schemas"]["Core_EventScope"]
> = true
export const _193: Eq<
  Old.components["schemas"]["Core_EventsCollection"],
  New.components["schemas"]["Core_EventsCollection"]
> = true
export const _194: Eq<
  Old.components["schemas"]["Core_FeePriority"],
  New.components["schemas"]["Core_FeePriority"]
> = true
export const _195: Eq<
  Old.components["schemas"]["Core_Genesis"],
  New.components["schemas"]["Core_Genesis"]
> = true
export const _196: Eq<
  Old.components["schemas"]["Core_GenesisCryptoSetup"],
  New.components["schemas"]["Core_GenesisCryptoSetup"]
> = true
export const _197: Eq<
  Old.components["schemas"]["Core_GenesisData"],
  New.components["schemas"]["Core_GenesisData"]
> = true
export const _198: Eq<
  Old.components["schemas"]["Core_GenesisPayload"],
  New.components["schemas"]["Core_GenesisPayload"]
> = true
export const _199: Eq<
  Old.components["schemas"]["Core_GenesisRequest"],
  New.components["schemas"]["Core_GenesisRequest"]
> = true
export const _200: Eq<
  Old.components["schemas"]["Core_GenesisSucceeded"],
  New.components["schemas"]["Core_GenesisSucceeded"]
> = true
export const _201: Eq<
  Old.components["schemas"]["Core_GoverningStrategy"],
  New.components["schemas"]["Core_GoverningStrategy"]
> = true
export const _202: Eq<
  Old.components["schemas"]["Core_HarmonizeEvent"],
  New.components["schemas"]["Core_HarmonizeEvent"]
> = true
export const _203: Eq<
  Old.components["schemas"]["Core_HarmonizeEventPayload"],
  New.components["schemas"]["Core_HarmonizeEventPayload"]
> = true
export const _204: Eq<
  Old.components["schemas"]["Core_HederaFeeStrategy"],
  New.components["schemas"]["Core_HederaFeeStrategy"]
> = true
export const _205: Eq<
  Old.components["schemas"]["Core_HederaFeeStrategy_Priority"],
  New.components["schemas"]["Core_HederaFeeStrategy_Priority"]
> = true
export const _206: Eq<
  Old.components["schemas"]["Core_HederaOperation"],
  New.components["schemas"]["Core_HederaOperation"]
> = true
export const _207: Eq<
  Old.components["schemas"]["Core_HederaOperation_AccountUpdate"],
  New.components["schemas"]["Core_HederaOperation_AccountUpdate"]
> = true
export const _208: Eq<
  Old.components["schemas"]["Core_HederaOperation_TokenAssociate"],
  New.components["schemas"]["Core_HederaOperation_TokenAssociate"]
> = true
export const _209: Eq<
  Old.components["schemas"]["Core_HederaOperation_TokenDissociate"],
  New.components["schemas"]["Core_HederaOperation_TokenDissociate"]
> = true
export const _210: Eq<
  Old.components["schemas"]["Core_HederaOperation_Transfer"],
  New.components["schemas"]["Core_HederaOperation_Transfer"]
> = true
export const _211: Eq<
  Old.components["schemas"]["Core_HederaTickerProperties"],
  New.components["schemas"]["Core_HederaTickerProperties"]
> = true
export const _212: Eq<
  Old.components["schemas"]["Core_HederaTickerProperties_FungibleToken"],
  New.components["schemas"]["Core_HederaTickerProperties_FungibleToken"]
> = true
export const _213: Eq<
  Old.components["schemas"]["Core_HederaTickerProperties_Native"],
  New.components["schemas"]["Core_HederaTickerProperties_Native"]
> = true
export const _214: Eq<
  Old.components["schemas"]["Core_HederaTickerProperties_NonFungibleToken"],
  New.components["schemas"]["Core_HederaTickerProperties_NonFungibleToken"]
> = true
export const _215: Eq<
  Old.components["schemas"]["Core_HederaTransferOutput"],
  New.components["schemas"]["Core_HederaTransferOutput"]
> = true
export const _216: Eq<
  Old.components["schemas"]["Core_IntentClosed"],
  New.components["schemas"]["Core_IntentClosed"]
> = true
export const _217: Eq<
  Old.components["schemas"]["Core_IntentCreated"],
  New.components["schemas"]["Core_IntentCreated"]
> = true
export const _218: Eq<
  Old.components["schemas"]["Core_IntentDetails"],
  New.components["schemas"]["Core_IntentDetails"]
> = true
export const _219: Eq<
  Old.components["schemas"]["Core_IntentDryRunRequest"],
  New.components["schemas"]["Core_IntentDryRunRequest"]
> = true
export const _220: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse"],
  New.components["schemas"]["Core_IntentDryRunResponse"]
> = true
export const _221: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_AcknowledgeBackup"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_AcknowledgeBackup"]
> = true
export const _222: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_AddAccountLedgers"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_AddAccountLedgers"]
> = true
export const _223: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_AddTrustedPublicKeysForMigration"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_AddTrustedPublicKeysForMigration"]
> = true
export const _224: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_AttemptTransactionOrderCancellation"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_AttemptTransactionOrderCancellation"]
> = true
export const _225: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateAccount"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateAccount"]
> = true
export const _226: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateBackup"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateBackup"]
> = true
export const _227: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateDomain"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateDomain"]
> = true
export const _228: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateEndpoint"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateEndpoint"]
> = true
export const _229: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateLedger"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateLedger"]
> = true
export const _230: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreatePolicy"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreatePolicy"]
> = true
export const _231: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateTicker"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateTicker"]
> = true
export const _232: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateTransactionOrder"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateTransactionOrder"]
> = true
export const _233: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateTransferOrder"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateTransferOrder"]
> = true
export const _234: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateUser"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateUser"]
> = true
export const _235: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_CreateVault"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_CreateVault"]
> = true
export const _236: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_ExecuteExtension"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_ExecuteExtension"]
> = true
export const _237: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_LockAccount"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_LockAccount"]
> = true
export const _238: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_LockDomain"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_LockDomain"]
> = true
export const _239: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_LockEndpoint"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_LockEndpoint"]
> = true
export const _240: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_LockPolicy"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_LockPolicy"]
> = true
export const _241: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_LockTicker"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_LockTicker"]
> = true
export const _242: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_LockUser"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_LockUser"]
> = true
export const _243: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_LockVault"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_LockVault"]
> = true
export const _244: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_MigrateSilo3AccountBatch"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_MigrateSilo3AccountBatch"]
> = true
export const _245: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_NotarizeData"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_NotarizeData"]
> = true
export const _246: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_ReleaseQuarantinedTransfers"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_ReleaseQuarantinedTransfers"]
> = true
export const _247: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_RewrapVaultKeyMaterial"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_RewrapVaultKeyMaterial"]
> = true
export const _248: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_SetSystemProperty"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_SetSystemProperty"]
> = true
export const _249: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_SignManifest"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_SignManifest"]
> = true
export const _250: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockAccount"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockAccount"]
> = true
export const _251: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockDomain"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockDomain"]
> = true
export const _252: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockEndpoint"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockEndpoint"]
> = true
export const _253: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockPolicy"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockPolicy"]
> = true
export const _254: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockTicker"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockTicker"]
> = true
export const _255: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockUser"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockUser"]
> = true
export const _256: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockVault"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UnlockVault"]
> = true
export const _257: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateAccount"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateAccount"]
> = true
export const _258: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateDomain"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateDomain"]
> = true
export const _259: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateDomainPermissions"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateDomainPermissions"]
> = true
export const _260: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateEndpoint"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateEndpoint"]
> = true
export const _261: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateLedger"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateLedger"]
> = true
export const _262: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdatePolicy"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdatePolicy"]
> = true
export const _263: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateTicker"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateTicker"]
> = true
export const _264: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateUser"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateUser"]
> = true
export const _265: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateVault"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_UpdateVault"]
> = true
export const _266: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_ValidateTickers"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_ValidateTickers"]
> = true
export const _267: Eq<
  Old.components["schemas"]["Core_IntentEntity"],
  New.components["schemas"]["Core_IntentEntity"]
> = true
export const _268: Eq<
  Old.components["schemas"]["Core_IntentError"],
  New.components["schemas"]["Core_IntentError"]
> = true
export const _269: Eq<
  Old.components["schemas"]["Core_IntentExecuted"],
  New.components["schemas"]["Core_IntentExecuted"]
> = true
export const _270: Eq<
  Old.components["schemas"]["Core_IntentLockStatus"],
  New.components["schemas"]["Core_IntentLockStatus"]
> = true
export const _271: Eq<
  Old.components["schemas"]["Core_IntentMetadata"],
  New.components["schemas"]["Core_IntentMetadata"]
> = true
export const _272: Eq<
  Old.components["schemas"]["Core_IntentReference"],
  New.components["schemas"]["Core_IntentReference"]
> = true
export const _273: Eq<
  Old.components["schemas"]["Core_IntentResponse"],
  New.components["schemas"]["Core_IntentResponse"]
> = true
export const _274: Eq<
  Old.components["schemas"]["Core_IntentState"],
  New.components["schemas"]["Core_IntentState"]
> = true
export const _275: Eq<
  Old.components["schemas"]["Core_IntentStatus"],
  New.components["schemas"]["Core_IntentStatus"]
> = true
export const _276: Eq<
  Old.components["schemas"]["Core_IntentType"],
  New.components["schemas"]["Core_IntentType"]
> = true
export const _277: Eq<
  Old.components["schemas"]["Core_IntentUpdated"],
  New.components["schemas"]["Core_IntentUpdated"]
> = true
export const _278: Eq<
  Old.components["schemas"]["Core_KeyType"],
  New.components["schemas"]["Core_KeyType"]
> = true
export const _279: Eq<
  Old.components["schemas"]["Core_Ledger"],
  New.components["schemas"]["Core_Ledger"]
> = true
export const _280: Eq<
  Old.components["schemas"]["Core_LedgerCreated"],
  New.components["schemas"]["Core_LedgerCreated"]
> = true
export const _281: Eq<
  Old.components["schemas"]["Core_LedgerParameters"],
  New.components["schemas"]["Core_LedgerParameters"]
> = true
export const _282: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Algorand"],
  New.components["schemas"]["Core_LedgerParameters_Algorand"]
> = true
export const _283: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Bitcoin"],
  New.components["schemas"]["Core_LedgerParameters_Bitcoin"]
> = true
export const _284: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Cardano"],
  New.components["schemas"]["Core_LedgerParameters_Cardano"]
> = true
export const _285: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Ethereum"],
  New.components["schemas"]["Core_LedgerParameters_Ethereum"]
> = true
export const _286: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Hedera"],
  New.components["schemas"]["Core_LedgerParameters_Hedera"]
> = true
export const _287: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Solana"],
  New.components["schemas"]["Core_LedgerParameters_Solana"]
> = true
export const _288: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Stellar"],
  New.components["schemas"]["Core_LedgerParameters_Stellar"]
> = true
export const _289: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Substrate"],
  New.components["schemas"]["Core_LedgerParameters_Substrate"]
> = true
export const _290: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Tezos"],
  New.components["schemas"]["Core_LedgerParameters_Tezos"]
> = true
export const _291: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Tron"],
  New.components["schemas"]["Core_LedgerParameters_Tron"]
> = true
export const _292: Eq<
  Old.components["schemas"]["Core_LedgerParameters_XRPL"],
  New.components["schemas"]["Core_LedgerParameters_XRPL"]
> = true
export const _293: Eq<
  Old.components["schemas"]["Core_LedgerTransactionData"],
  New.components["schemas"]["Core_LedgerTransactionData"]
> = true
export const _294: Eq<
  Old.components["schemas"]["Core_LedgerTransactionFailure"],
  New.components["schemas"]["Core_LedgerTransactionFailure"]
> = true
export const _295: Eq<
  Old.components["schemas"]["Core_LedgerTransactionStatus"],
  New.components["schemas"]["Core_LedgerTransactionStatus"]
> = true
export const _296: Eq<
  Old.components["schemas"]["Core_LedgerUpdated"],
  New.components["schemas"]["Core_LedgerUpdated"]
> = true
export const _297: Eq<
  Old.components["schemas"]["Core_LockStatus"],
  New.components["schemas"]["Core_LockStatus"]
> = true
export const _298: Eq<
  Old.components["schemas"]["Core_LoginId"],
  New.components["schemas"]["Core_LoginId"]
> = true
export const _299: Eq<
  Old.components["schemas"]["Core_MPTokenIssuanceMetadata"],
  New.components["schemas"]["Core_MPTokenIssuanceMetadata"]
> = true
export const _300: Eq<
  Old.components["schemas"]["Core_MPTokenIssuanceMetadata_HexEncodedMetadata"],
  New.components["schemas"]["Core_MPTokenIssuanceMetadata_HexEncodedMetadata"]
> = true
export const _301: Eq<
  Old.components["schemas"]["Core_Manifest"],
  New.components["schemas"]["Core_Manifest"]
> = true
export const _302: Eq<
  Old.components["schemas"]["Core_ManifestAdditionalDetails"],
  New.components["schemas"]["Core_ManifestAdditionalDetails"]
> = true
export const _303: Eq<
  Old.components["schemas"]["Core_ManifestContent"],
  New.components["schemas"]["Core_ManifestContent"]
> = true
export const _304: Eq<
  Old.components["schemas"]["Core_ManifestContentType"],
  New.components["schemas"]["Core_ManifestContentType"]
> = true
export const _305: Eq<
  Old.components["schemas"]["Core_ManifestContent_EIP-191"],
  New.components["schemas"]["Core_ManifestContent_EIP-191"]
> = true
export const _306: Eq<
  Old.components["schemas"]["Core_ManifestContent_JWT"],
  New.components["schemas"]["Core_ManifestContent_JWT"]
> = true
export const _307: Eq<
  Old.components["schemas"]["Core_ManifestContent_JWT_Header"],
  New.components["schemas"]["Core_ManifestContent_JWT_Header"]
> = true
export const _308: Eq<
  Old.components["schemas"]["Core_ManifestContent_JWT_Payload"],
  New.components["schemas"]["Core_ManifestContent_JWT_Payload"]
> = true
export const _309: Eq<
  Old.components["schemas"]["Core_ManifestContent_Unsafe"],
  New.components["schemas"]["Core_ManifestContent_Unsafe"]
> = true
export const _310: Eq<
  Old.components["schemas"]["Core_ManifestCreated"],
  New.components["schemas"]["Core_ManifestCreated"]
> = true
export const _311: Eq<
  Old.components["schemas"]["Core_ManifestProcessingDetails"],
  New.components["schemas"]["Core_ManifestProcessingDetails"]
> = true
export const _312: Eq<
  Old.components["schemas"]["Core_ManifestProcessingDetails_Completed"],
  New.components["schemas"]["Core_ManifestProcessingDetails_Completed"]
> = true
export const _313: Eq<
  Old.components["schemas"]["Core_ManifestProcessingDetails_Failed"],
  New.components["schemas"]["Core_ManifestProcessingDetails_Failed"]
> = true
export const _314: Eq<
  Old.components["schemas"]["Core_ManifestProcessingDetails_Pending"],
  New.components["schemas"]["Core_ManifestProcessingDetails_Pending"]
> = true
export const _315: Eq<
  Old.components["schemas"]["Core_ManifestProcessingDetails_Preparing"],
  New.components["schemas"]["Core_ManifestProcessingDetails_Preparing"]
> = true
export const _316: Eq<
  Old.components["schemas"]["Core_ManifestProcessingStatus"],
  New.components["schemas"]["Core_ManifestProcessingStatus"]
> = true
export const _317: Eq<
  Old.components["schemas"]["Core_ManifestUpdated"],
  New.components["schemas"]["Core_ManifestUpdated"]
> = true
export const _318: Eq<
  Old.components["schemas"]["Core_ManifestValue"],
  New.components["schemas"]["Core_ManifestValue"]
> = true
export const _319: Eq<
  Old.components["schemas"]["Core_ManifestValue_EIP-191"],
  New.components["schemas"]["Core_ManifestValue_EIP-191"]
> = true
export const _320: Eq<
  Old.components["schemas"]["Core_ManifestValue_JWT"],
  New.components["schemas"]["Core_ManifestValue_JWT"]
> = true
export const _321: Eq<
  Old.components["schemas"]["Core_ManifestValue_Unsafe"],
  New.components["schemas"]["Core_ManifestValue_Unsafe"]
> = true
export const _322: Eq<
  Old.components["schemas"]["Core_ManifestsCollection"],
  New.components["schemas"]["Core_ManifestsCollection"]
> = true
export const _323: Eq<
  Old.components["schemas"]["Core_MeDomainReference"],
  New.components["schemas"]["Core_MeDomainReference"]
> = true
export const _324: Eq<
  Old.components["schemas"]["Core_MeReference"],
  New.components["schemas"]["Core_MeReference"]
> = true
export const _325: Eq<
  Old.components["schemas"]["Core_MeUserReference"],
  New.components["schemas"]["Core_MeUserReference"]
> = true
export const _326: Eq<
  Old.components["schemas"]["Core_MultiPurposeToken"],
  New.components["schemas"]["Core_MultiPurposeToken"]
> = true
export const _327: Eq<
  Old.components["schemas"]["Core_Network"],
  New.components["schemas"]["Core_Network"]
> = true
export const _328: Eq<
  Old.components["schemas"]["Core_NonFungibleTokenDestination"],
  New.components["schemas"]["Core_NonFungibleTokenDestination"]
> = true
export const _329: Eq<
  Old.components["schemas"]["Core_NonFungibleTokenDestination_NftTokenId"],
  New.components["schemas"]["Core_NonFungibleTokenDestination_NftTokenId"]
> = true
export const _330: Eq<
  Old.components["schemas"]["Core_NonFungibleTokenDestination_Ticker"],
  New.components["schemas"]["Core_NonFungibleTokenDestination_Ticker"]
> = true
export const _331: Eq<
  Old.components["schemas"]["Core_NotaryApiKeyValue"],
  New.components["schemas"]["Core_NotaryApiKeyValue"]
> = true
export const _332: Eq<
  Old.components["schemas"]["Core_NotaryCollectionsKeyValue"],
  New.components["schemas"]["Core_NotaryCollectionsKeyValue"]
> = true
export const _333: Eq<
  Old.components["schemas"]["Core_NotaryCommunicationKeyValue"],
  New.components["schemas"]["Core_NotaryCommunicationKeyValue"]
> = true
export const _334: Eq<
  Old.components["schemas"]["Core_OnLedgerData"],
  New.components["schemas"]["Core_OnLedgerData"]
> = true
export const _335: Eq<
  Old.components["schemas"]["Core_OnLedgerData_Bitcoin"],
  New.components["schemas"]["Core_OnLedgerData_Bitcoin"]
> = true
export const _336: Eq<
  Old.components["schemas"]["Core_OnLedgerData_Ethereum"],
  New.components["schemas"]["Core_OnLedgerData_Ethereum"]
> = true
export const _337: Eq<
  Old.components["schemas"]["Core_OnLedgerData_Xrpl"],
  New.components["schemas"]["Core_OnLedgerData_Xrpl"]
> = true
export const _338: Eq<
  Old.components["schemas"]["Core_Permissions"],
  New.components["schemas"]["Core_Permissions"]
> = true
export const _339: Eq<
  Old.components["schemas"]["Core_Policy"],
  New.components["schemas"]["Core_Policy"]
> = true
export const _340: Eq<
  Old.components["schemas"]["Core_PolicyCondition"],
  New.components["schemas"]["Core_PolicyCondition"]
> = true
export const _341: Eq<
  Old.components["schemas"]["Core_PolicyCondition_And"],
  New.components["schemas"]["Core_PolicyCondition_And"]
> = true
export const _342: Eq<
  Old.components["schemas"]["Core_PolicyCondition_Expression"],
  New.components["schemas"]["Core_PolicyCondition_Expression"]
> = true
export const _343: Eq<
  Old.components["schemas"]["Core_PolicyCondition_Or"],
  New.components["schemas"]["Core_PolicyCondition_Or"]
> = true
export const _344: Eq<
  Old.components["schemas"]["Core_PolicyCreated"],
  New.components["schemas"]["Core_PolicyCreated"]
> = true
export const _345: Eq<
  Old.components["schemas"]["Core_PolicyReference"],
  New.components["schemas"]["Core_PolicyReference"]
> = true
export const _346: Eq<
  Old.components["schemas"]["Core_PolicyScope"],
  New.components["schemas"]["Core_PolicyScope"]
> = true
export const _347: Eq<
  Old.components["schemas"]["Core_PolicyUpdated"],
  New.components["schemas"]["Core_PolicyUpdated"]
> = true
export const _348: Eq<
  Old.components["schemas"]["Core_PreferredAddressForChange"],
  New.components["schemas"]["Core_PreferredAddressForChange"]
> = true
export const _349: Eq<
  Old.components["schemas"]["Core_Propose"],
  New.components["schemas"]["Core_Propose"]
> = true
export const _350: Eq<
  Old.components["schemas"]["Core_ProposeIntentBody"],
  New.components["schemas"]["Core_ProposeIntentBody"]
> = true
export const _351: Eq<
  Old.components["schemas"]["Core_ProposeTransactionOrderParameters"],
  New.components["schemas"]["Core_ProposeTransactionOrderParameters"]
> = true
export const _352: Eq<
  Old.components["schemas"]["Core_ProposeUserIntentPayload"],
  New.components["schemas"]["Core_ProposeUserIntentPayload"]
> = true
export const _353: Eq<
  Old.components["schemas"]["Core_Propose_v0_CreateTransactionOrder"],
  New.components["schemas"]["Core_Propose_v0_CreateTransactionOrder"]
> = true
export const _354: Eq<
  Old.components["schemas"]["Core_QuarantineApplied"],
  New.components["schemas"]["Core_QuarantineApplied"]
> = true
export const _355: Eq<
  Old.components["schemas"]["Core_QuarantineSkipped"],
  New.components["schemas"]["Core_QuarantineSkipped"]
> = true
export const _356: Eq<
  Old.components["schemas"]["Core_QuarantineStatus"],
  New.components["schemas"]["Core_QuarantineStatus"]
> = true
export const _357: Eq<
  Old.components["schemas"]["Core_ReadAccess"],
  New.components["schemas"]["Core_ReadAccess"]
> = true
export const _358: Eq<
  Old.components["schemas"]["Core_ReadWriteSystemPropertyKeyValue"],
  New.components["schemas"]["Core_ReadWriteSystemPropertyKeyValue"]
> = true
export const _359: Eq<
  Old.components["schemas"]["Core_ReadWriteSystemPropertyKeyValue_StateReviewAuthorityProperty"],
  New.components["schemas"]["Core_ReadWriteSystemPropertyKeyValue_StateReviewAuthorityProperty"]
> = true
export const _360: Eq<
  Old.components["schemas"]["Core_RecipientTransferParty"],
  New.components["schemas"]["Core_RecipientTransferParty"]
> = true
export const _361: Eq<
  Old.components["schemas"]["Core_RecipientTransferParty_Account"],
  New.components["schemas"]["Core_RecipientTransferParty_Account"]
> = true
export const _362: Eq<
  Old.components["schemas"]["Core_RecipientTransferParty_Address"],
  New.components["schemas"]["Core_RecipientTransferParty_Address"]
> = true
export const _363: Eq<
  Old.components["schemas"]["Core_Reject"],
  New.components["schemas"]["Core_Reject"]
> = true
export const _364: Eq<
  Old.components["schemas"]["Core_RejectIntentBody"],
  New.components["schemas"]["Core_RejectIntentBody"]
> = true
export const _365: Eq<
  Old.components["schemas"]["Core_RemainingDomainUsers"],
  New.components["schemas"]["Core_RemainingDomainUsers"]
> = true
export const _366: Eq<
  Old.components["schemas"]["Core_RequestState"],
  New.components["schemas"]["Core_RequestState"]
> = true
export const _367: Eq<
  Old.components["schemas"]["Core_RequestStateHistory"],
  New.components["schemas"]["Core_RequestStateHistory"]
> = true
export const _368: Eq<
  Old.components["schemas"]["Core_RequestStateStatus"],
  New.components["schemas"]["Core_RequestStateStatus"]
> = true
export const _369: Eq<
  Old.components["schemas"]["Core_ResolvedEndpoint"],
  New.components["schemas"]["Core_ResolvedEndpoint"]
> = true
export const _370: Eq<
  Old.components["schemas"]["Core_ResultLedger"],
  New.components["schemas"]["Core_ResultLedger"]
> = true
export const _371: Eq<
  Old.components["schemas"]["Core_RootDomainSetup"],
  New.components["schemas"]["Core_RootDomainSetup"]
> = true
export const _372: Eq<
  Old.components["schemas"]["Core_ScriptingEngine"],
  New.components["schemas"]["Core_ScriptingEngine"]
> = true
export const _373: Eq<
  Old.components["schemas"]["Core_SenderTransferParty"],
  New.components["schemas"]["Core_SenderTransferParty"]
> = true
export const _374: Eq<
  Old.components["schemas"]["Core_SenderTransferParty_Account"],
  New.components["schemas"]["Core_SenderTransferParty_Account"]
> = true
export const _375: Eq<
  Old.components["schemas"]["Core_SenderTransferParty_Address"],
  New.components["schemas"]["Core_SenderTransferParty_Address"]
> = true
export const _376: Eq<
  Old.components["schemas"]["Core_SkipQuarantineScope"],
  New.components["schemas"]["Core_SkipQuarantineScope"]
> = true
export const _377: Eq<
  Old.components["schemas"]["Core_SolanaFeeStrategy"],
  New.components["schemas"]["Core_SolanaFeeStrategy"]
> = true
export const _378: Eq<
  Old.components["schemas"]["Core_SolanaFeeStrategy_Priority"],
  New.components["schemas"]["Core_SolanaFeeStrategy_Priority"]
> = true
export const _379: Eq<
  Old.components["schemas"]["Core_SolanaMintAccount"],
  New.components["schemas"]["Core_SolanaMintAccount"]
> = true
export const _380: Eq<
  Old.components["schemas"]["Core_SolanaMintAccount_Destination"],
  New.components["schemas"]["Core_SolanaMintAccount_Destination"]
> = true
export const _381: Eq<
  Old.components["schemas"]["Core_SolanaMintAccount_Ticker"],
  New.components["schemas"]["Core_SolanaMintAccount_Ticker"]
> = true
export const _382: Eq<
  Old.components["schemas"]["Core_SolanaOperation"],
  New.components["schemas"]["Core_SolanaOperation"]
> = true
export const _383: Eq<
  Old.components["schemas"]["Core_SolanaOperation_Burn"],
  New.components["schemas"]["Core_SolanaOperation_Burn"]
> = true
export const _384: Eq<
  Old.components["schemas"]["Core_SolanaOperation_CreateNonceAccount"],
  New.components["schemas"]["Core_SolanaOperation_CreateNonceAccount"]
> = true
export const _385: Eq<
  Old.components["schemas"]["Core_SolanaOperation_FundAtaAccount"],
  New.components["schemas"]["Core_SolanaOperation_FundAtaAccount"]
> = true
export const _386: Eq<
  Old.components["schemas"]["Core_SolanaOperation_InitializeMint"],
  New.components["schemas"]["Core_SolanaOperation_InitializeMint"]
> = true
export const _387: Eq<
  Old.components["schemas"]["Core_SolanaOperation_MintTo"],
  New.components["schemas"]["Core_SolanaOperation_MintTo"]
> = true
export const _388: Eq<
  Old.components["schemas"]["Core_SolanaOperation_Transfer"],
  New.components["schemas"]["Core_SolanaOperation_Transfer"]
> = true
export const _389: Eq<
  Old.components["schemas"]["Core_SolanaOperation_TransferToken"],
  New.components["schemas"]["Core_SolanaOperation_TransferToken"]
> = true
export const _390: Eq<
  Old.components["schemas"]["Core_SolanaTickerProperties"],
  New.components["schemas"]["Core_SolanaTickerProperties"]
> = true
export const _391: Eq<
  Old.components["schemas"]["Core_SolanaTickerProperties_Native"],
  New.components["schemas"]["Core_SolanaTickerProperties_Native"]
> = true
export const _392: Eq<
  Old.components["schemas"]["Core_SolanaTickerProperties_Token"],
  New.components["schemas"]["Core_SolanaTickerProperties_Token"]
> = true
export const _393: Eq<
  Old.components["schemas"]["Core_SolanaTokenType"],
  New.components["schemas"]["Core_SolanaTokenType"]
> = true
export const _394: Eq<
  Old.components["schemas"]["Core_SolanaTransferOutput"],
  New.components["schemas"]["Core_SolanaTransferOutput"]
> = true
export const _395: Eq<
  Old.components["schemas"]["Core_SortOrder"],
  New.components["schemas"]["Core_SortOrder"]
> = true
export const _396: Eq<
  Old.components["schemas"]["Core_StateReviewAuthorityValue"],
  New.components["schemas"]["Core_StateReviewAuthorityValue"]
> = true
export const _397: Eq<
  Old.components["schemas"]["Core_StellarAsset"],
  New.components["schemas"]["Core_StellarAsset"]
> = true
export const _398: Eq<
  Old.components["schemas"]["Core_StellarFee"],
  New.components["schemas"]["Core_StellarFee"]
> = true
export const _399: Eq<
  Old.components["schemas"]["Core_StellarFeeStrategy"],
  New.components["schemas"]["Core_StellarFeeStrategy"]
> = true
export const _400: Eq<
  Old.components["schemas"]["Core_StellarFeeStrategy_Priority"],
  New.components["schemas"]["Core_StellarFeeStrategy_Priority"]
> = true
export const _401: Eq<
  Old.components["schemas"]["Core_StellarFeeStrategy_SpecifiedRate"],
  New.components["schemas"]["Core_StellarFeeStrategy_SpecifiedRate"]
> = true
export const _402: Eq<
  Old.components["schemas"]["Core_StellarMemo"],
  New.components["schemas"]["Core_StellarMemo"]
> = true
export const _403: Eq<
  Old.components["schemas"]["Core_StellarMemo_Hash"],
  New.components["schemas"]["Core_StellarMemo_Hash"]
> = true
export const _404: Eq<
  Old.components["schemas"]["Core_StellarMemo_Id"],
  New.components["schemas"]["Core_StellarMemo_Id"]
> = true
export const _405: Eq<
  Old.components["schemas"]["Core_StellarMemo_Return"],
  New.components["schemas"]["Core_StellarMemo_Return"]
> = true
export const _406: Eq<
  Old.components["schemas"]["Core_StellarMemo_Text"],
  New.components["schemas"]["Core_StellarMemo_Text"]
> = true
export const _407: Eq<
  Old.components["schemas"]["Core_StellarOperation"],
  New.components["schemas"]["Core_StellarOperation"]
> = true
export const _408: Eq<
  Old.components["schemas"]["Core_StellarOperation_AccountMerge"],
  New.components["schemas"]["Core_StellarOperation_AccountMerge"]
> = true
export const _409: Eq<
  Old.components["schemas"]["Core_StellarOperation_ChangeTrust"],
  New.components["schemas"]["Core_StellarOperation_ChangeTrust"]
> = true
export const _410: Eq<
  Old.components["schemas"]["Core_StellarOperation_CreateAccount"],
  New.components["schemas"]["Core_StellarOperation_CreateAccount"]
> = true
export const _411: Eq<
  Old.components["schemas"]["Core_StellarOperation_Payment"],
  New.components["schemas"]["Core_StellarOperation_Payment"]
> = true
export const _412: Eq<
  Old.components["schemas"]["Core_StellarOperation_SetOptions"],
  New.components["schemas"]["Core_StellarOperation_SetOptions"]
> = true
export const _413: Eq<
  Old.components["schemas"]["Core_StellarOption"],
  New.components["schemas"]["Core_StellarOption"]
> = true
export const _414: Eq<
  Old.components["schemas"]["Core_StellarOption_OptionHomeDomain"],
  New.components["schemas"]["Core_StellarOption_OptionHomeDomain"]
> = true
export const _415: Eq<
  Old.components["schemas"]["Core_StellarOption_OptionSetFlag"],
  New.components["schemas"]["Core_StellarOption_OptionSetFlag"]
> = true
export const _416: Eq<
  Old.components["schemas"]["Core_StellarTickerProperties"],
  New.components["schemas"]["Core_StellarTickerProperties"]
> = true
export const _417: Eq<
  Old.components["schemas"]["Core_StellarTickerProperties_Native"],
  New.components["schemas"]["Core_StellarTickerProperties_Native"]
> = true
export const _418: Eq<
  Old.components["schemas"]["Core_StellarTickerProperties_Token"],
  New.components["schemas"]["Core_StellarTickerProperties_Token"]
> = true
export const _419: Eq<
  Old.components["schemas"]["Core_Stellar_OptionFlag"],
  New.components["schemas"]["Core_Stellar_OptionFlag"]
> = true
export const _420: Eq<
  Old.components["schemas"]["Core_StringsMap"],
  New.components["schemas"]["Core_StringsMap"]
> = true
export const _421: Eq<
  Old.components["schemas"]["Core_SubstrateBalancesMethod"],
  New.components["schemas"]["Core_SubstrateBalancesMethod"]
> = true
export const _422: Eq<
  Old.components["schemas"]["Core_SubstrateBalancesMethod_TransferKeepAlive"],
  New.components["schemas"]["Core_SubstrateBalancesMethod_TransferKeepAlive"]
> = true
export const _423: Eq<
  Old.components["schemas"]["Core_SubstrateChainType"],
  New.components["schemas"]["Core_SubstrateChainType"]
> = true
export const _424: Eq<
  Old.components["schemas"]["Core_SubstrateFeeParameters"],
  New.components["schemas"]["Core_SubstrateFeeParameters"]
> = true
export const _425: Eq<
  Old.components["schemas"]["Core_SubstrateFeeParameters_TransactionPayment"],
  New.components["schemas"]["Core_SubstrateFeeParameters_TransactionPayment"]
> = true
export const _426: Eq<
  Old.components["schemas"]["Core_SubstrateFeeStrategy"],
  New.components["schemas"]["Core_SubstrateFeeStrategy"]
> = true
export const _427: Eq<
  Old.components["schemas"]["Core_SubstrateFeeStrategy_Priority"],
  New.components["schemas"]["Core_SubstrateFeeStrategy_Priority"]
> = true
export const _428: Eq<
  Old.components["schemas"]["Core_SubstrateMethodFeeParameters"],
  New.components["schemas"]["Core_SubstrateMethodFeeParameters"]
> = true
export const _429: Eq<
  Old.components["schemas"]["Core_SubstrateMethodFeeParameters_MethodWeight"],
  New.components["schemas"]["Core_SubstrateMethodFeeParameters_MethodWeight"]
> = true
export const _430: Eq<
  Old.components["schemas"]["Core_SubstrateMethodInfo"],
  New.components["schemas"]["Core_SubstrateMethodInfo"]
> = true
export const _431: Eq<
  Old.components["schemas"]["Core_SubstratePallet"],
  New.components["schemas"]["Core_SubstratePallet"]
> = true
export const _432: Eq<
  Old.components["schemas"]["Core_SubstratePalletInfo"],
  New.components["schemas"]["Core_SubstratePalletInfo"]
> = true
export const _433: Eq<
  Old.components["schemas"]["Core_SubstratePallet_Balances"],
  New.components["schemas"]["Core_SubstratePallet_Balances"]
> = true
export const _434: Eq<
  Old.components["schemas"]["Core_SubstratePallet_Staking"],
  New.components["schemas"]["Core_SubstratePallet_Staking"]
> = true
export const _435: Eq<
  Old.components["schemas"]["Core_SubstrateRuntimeInfo"],
  New.components["schemas"]["Core_SubstrateRuntimeInfo"]
> = true
export const _436: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod"],
  New.components["schemas"]["Core_SubstrateStakingMethod"]
> = true
export const _437: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_Bond"],
  New.components["schemas"]["Core_SubstrateStakingMethod_Bond"]
> = true
export const _438: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_BondExtra"],
  New.components["schemas"]["Core_SubstrateStakingMethod_BondExtra"]
> = true
export const _439: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_Chill"],
  New.components["schemas"]["Core_SubstrateStakingMethod_Chill"]
> = true
export const _440: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_Nominate"],
  New.components["schemas"]["Core_SubstrateStakingMethod_Nominate"]
> = true
export const _441: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_Rebond"],
  New.components["schemas"]["Core_SubstrateStakingMethod_Rebond"]
> = true
export const _442: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_SetController"],
  New.components["schemas"]["Core_SubstrateStakingMethod_SetController"]
> = true
export const _443: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_SetPayee"],
  New.components["schemas"]["Core_SubstrateStakingMethod_SetPayee"]
> = true
export const _444: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_Unbond"],
  New.components["schemas"]["Core_SubstrateStakingMethod_Unbond"]
> = true
export const _445: Eq<
  Old.components["schemas"]["Core_SubstrateStakingMethod_WithdrawUnbonded"],
  New.components["schemas"]["Core_SubstrateStakingMethod_WithdrawUnbonded"]
> = true
export const _446: Eq<
  Old.components["schemas"]["Core_SubstrateStakingPayee"],
  New.components["schemas"]["Core_SubstrateStakingPayee"]
> = true
export const _447: Eq<
  Old.components["schemas"]["Core_SubstrateStakingPayee_Account"],
  New.components["schemas"]["Core_SubstrateStakingPayee_Account"]
> = true
export const _448: Eq<
  Old.components["schemas"]["Core_SubstrateStakingPayee_Controller"],
  New.components["schemas"]["Core_SubstrateStakingPayee_Controller"]
> = true
export const _449: Eq<
  Old.components["schemas"]["Core_SubstrateStakingPayee_Staked"],
  New.components["schemas"]["Core_SubstrateStakingPayee_Staked"]
> = true
export const _450: Eq<
  Old.components["schemas"]["Core_SubstrateStakingPayee_Stash"],
  New.components["schemas"]["Core_SubstrateStakingPayee_Stash"]
> = true
export const _451: Eq<
  Old.components["schemas"]["Core_SubstrateTickerProperties"],
  New.components["schemas"]["Core_SubstrateTickerProperties"]
> = true
export const _452: Eq<
  Old.components["schemas"]["Core_SubstrateTickerProperties_Native"],
  New.components["schemas"]["Core_SubstrateTickerProperties_Native"]
> = true
export const _453: Eq<
  Old.components["schemas"]["Core_SystemProperty"],
  New.components["schemas"]["Core_SystemProperty"]
> = true
export const _454: Eq<
  Old.components["schemas"]["Core_SystemPropertyId"],
  New.components["schemas"]["Core_SystemPropertyId"]
> = true
export const _455: Eq<
  Old.components["schemas"]["Core_SystemPropertySet"],
  New.components["schemas"]["Core_SystemPropertySet"]
> = true
export const _456: Eq<
  Old.components["schemas"]["Core_SystemProperty_NotaryApiKeySystemProperty"],
  New.components["schemas"]["Core_SystemProperty_NotaryApiKeySystemProperty"]
> = true
export const _457: Eq<
  Old.components["schemas"]["Core_SystemProperty_NotaryCollectionsKeySystemProperty"],
  New.components["schemas"]["Core_SystemProperty_NotaryCollectionsKeySystemProperty"]
> = true
export const _458: Eq<
  Old.components["schemas"]["Core_SystemProperty_NotaryCommunicationKeySystemProperty"],
  New.components["schemas"]["Core_SystemProperty_NotaryCommunicationKeySystemProperty"]
> = true
export const _459: Eq<
  Old.components["schemas"]["Core_SystemProperty_StateReviewAuthoritySystemProperty"],
  New.components["schemas"]["Core_SystemProperty_StateReviewAuthoritySystemProperty"]
> = true
export const _460: Eq<
  Old.components["schemas"]["Core_TezosFeeStrategy"],
  New.components["schemas"]["Core_TezosFeeStrategy"]
> = true
export const _461: Eq<
  Old.components["schemas"]["Core_TezosFeeStrategy_Priority"],
  New.components["schemas"]["Core_TezosFeeStrategy_Priority"]
> = true
export const _462: Eq<
  Old.components["schemas"]["Core_TezosOperation"],
  New.components["schemas"]["Core_TezosOperation"]
> = true
export const _463: Eq<
  Old.components["schemas"]["Core_TezosOperation_Delegation"],
  New.components["schemas"]["Core_TezosOperation_Delegation"]
> = true
export const _464: Eq<
  Old.components["schemas"]["Core_TezosOperation_Reveal"],
  New.components["schemas"]["Core_TezosOperation_Reveal"]
> = true
export const _465: Eq<
  Old.components["schemas"]["Core_TezosOperation_Transaction"],
  New.components["schemas"]["Core_TezosOperation_Transaction"]
> = true
export const _466: Eq<
  Old.components["schemas"]["Core_TezosOperation_Undelegation"],
  New.components["schemas"]["Core_TezosOperation_Undelegation"]
> = true
export const _467: Eq<
  Old.components["schemas"]["Core_TezosTickerProperties"],
  New.components["schemas"]["Core_TezosTickerProperties"]
> = true
export const _468: Eq<
  Old.components["schemas"]["Core_TezosTickerProperties_Native"],
  New.components["schemas"]["Core_TezosTickerProperties_Native"]
> = true
export const _469: Eq<
  Old.components["schemas"]["Core_TickerCreated"],
  New.components["schemas"]["Core_TickerCreated"]
> = true
export const _470: Eq<
  Old.components["schemas"]["Core_TickerKind"],
  New.components["schemas"]["Core_TickerKind"]
> = true
export const _471: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails"],
  New.components["schemas"]["Core_TickerLedgerDetails"]
> = true
export const _472: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Algorand"],
  New.components["schemas"]["Core_TickerLedgerDetails_Algorand"]
> = true
export const _473: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Bitcoin"],
  New.components["schemas"]["Core_TickerLedgerDetails_Bitcoin"]
> = true
export const _474: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Cardano"],
  New.components["schemas"]["Core_TickerLedgerDetails_Cardano"]
> = true
export const _475: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Ethereum"],
  New.components["schemas"]["Core_TickerLedgerDetails_Ethereum"]
> = true
export const _476: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Hedera"],
  New.components["schemas"]["Core_TickerLedgerDetails_Hedera"]
> = true
export const _477: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Solana"],
  New.components["schemas"]["Core_TickerLedgerDetails_Solana"]
> = true
export const _478: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Stellar"],
  New.components["schemas"]["Core_TickerLedgerDetails_Stellar"]
> = true
export const _479: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Substrate"],
  New.components["schemas"]["Core_TickerLedgerDetails_Substrate"]
> = true
export const _480: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Tezos"],
  New.components["schemas"]["Core_TickerLedgerDetails_Tezos"]
> = true
export const _481: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Tron"],
  New.components["schemas"]["Core_TickerLedgerDetails_Tron"]
> = true
export const _482: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_XRPL"],
  New.components["schemas"]["Core_TickerLedgerDetails_XRPL"]
> = true
export const _483: Eq<
  Old.components["schemas"]["Core_TickerToValidate"],
  New.components["schemas"]["Core_TickerToValidate"]
> = true
export const _484: Eq<
  Old.components["schemas"]["Core_TickerUpdated"],
  New.components["schemas"]["Core_TickerUpdated"]
> = true
export const _485: Eq<
  Old.components["schemas"]["Core_TickerValidationStatusFilter"],
  New.components["schemas"]["Core_TickerValidationStatusFilter"]
> = true
export const _486: Eq<
  Old.components["schemas"]["Core_TickersCollection"],
  New.components["schemas"]["Core_TickersCollection"]
> = true
export const _487: Eq<
  Old.components["schemas"]["Core_TokenDestination"],
  New.components["schemas"]["Core_TokenDestination"]
> = true
export const _488: Eq<
  Old.components["schemas"]["Core_TokenDestination_Ticker"],
  New.components["schemas"]["Core_TokenDestination_Ticker"]
> = true
export const _489: Eq<
  Old.components["schemas"]["Core_TokenDestination_TokenId"],
  New.components["schemas"]["Core_TokenDestination_TokenId"]
> = true
export const _490: Eq<
  Old.components["schemas"]["Core_TokenFee"],
  New.components["schemas"]["Core_TokenFee"]
> = true
export const _491: Eq<
  Old.components["schemas"]["Core_TokenOutput"],
  New.components["schemas"]["Core_TokenOutput"]
> = true
export const _492: Eq<
  Old.components["schemas"]["Core_TokenOutput_HederaFungibleTokenOutput"],
  New.components["schemas"]["Core_TokenOutput_HederaFungibleTokenOutput"]
> = true
export const _493: Eq<
  Old.components["schemas"]["Core_TokenOutput_HederaNonFungibleTokenOutput"],
  New.components["schemas"]["Core_TokenOutput_HederaNonFungibleTokenOutput"]
> = true
export const _494: Eq<
  Old.components["schemas"]["Core_TransactionCancellationDetails"],
  New.components["schemas"]["Core_TransactionCancellationDetails"]
> = true
export const _495: Eq<
  Old.components["schemas"]["Core_TransactionCancellationDetails_OffLedger"],
  New.components["schemas"]["Core_TransactionCancellationDetails_OffLedger"]
> = true
export const _496: Eq<
  Old.components["schemas"]["Core_TransactionCancellationDetails_OnLedger"],
  New.components["schemas"]["Core_TransactionCancellationDetails_OnLedger"]
> = true
export const _497: Eq<
  Old.components["schemas"]["Core_TransactionCreated"],
  New.components["schemas"]["Core_TransactionCreated"]
> = true
export const _498: Eq<
  Old.components["schemas"]["Core_TransactionDestination"],
  New.components["schemas"]["Core_TransactionDestination"]
> = true
export const _499: Eq<
  Old.components["schemas"]["Core_TransactionDestination_Account"],
  New.components["schemas"]["Core_TransactionDestination_Account"]
> = true
export const _500: Eq<
  Old.components["schemas"]["Core_TransactionDestination_Address"],
  New.components["schemas"]["Core_TransactionDestination_Address"]
> = true
export const _501: Eq<
  Old.components["schemas"]["Core_TransactionDestination_Endpoint"],
  New.components["schemas"]["Core_TransactionDestination_Endpoint"]
> = true
export const _502: Eq<
  Old.components["schemas"]["Core_TransactionDetected"],
  New.components["schemas"]["Core_TransactionDetected"]
> = true
export const _503: Eq<
  Old.components["schemas"]["Core_TransactionDryRun"],
  New.components["schemas"]["Core_TransactionDryRun"]
> = true
export const _504: Eq<
  Old.components["schemas"]["Core_TransactionDryRunResult"],
  New.components["schemas"]["Core_TransactionDryRunResult"]
> = true
export const _505: Eq<
  Old.components["schemas"]["Core_TransactionDryRunResult_Failure"],
  New.components["schemas"]["Core_TransactionDryRunResult_Failure"]
> = true
export const _506: Eq<
  Old.components["schemas"]["Core_TransactionDryRunResult_Success"],
  New.components["schemas"]["Core_TransactionDryRunResult_Success"]
> = true
export const _507: Eq<
  Old.components["schemas"]["Core_TransactionEstimate"],
  New.components["schemas"]["Core_TransactionEstimate"]
> = true
export const _508: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Algorand"],
  New.components["schemas"]["Core_TransactionEstimate_Algorand"]
> = true
export const _509: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Bitcoin"],
  New.components["schemas"]["Core_TransactionEstimate_Bitcoin"]
> = true
export const _510: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Cardano"],
  New.components["schemas"]["Core_TransactionEstimate_Cardano"]
> = true
export const _511: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Ethereum"],
  New.components["schemas"]["Core_TransactionEstimate_Ethereum"]
> = true
export const _512: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Failure"],
  New.components["schemas"]["Core_TransactionEstimate_Failure"]
> = true
export const _513: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Hedera"],
  New.components["schemas"]["Core_TransactionEstimate_Hedera"]
> = true
export const _514: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Solana"],
  New.components["schemas"]["Core_TransactionEstimate_Solana"]
> = true
export const _515: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Stellar"],
  New.components["schemas"]["Core_TransactionEstimate_Stellar"]
> = true
export const _516: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Substrate"],
  New.components["schemas"]["Core_TransactionEstimate_Substrate"]
> = true
export const _517: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Tezos"],
  New.components["schemas"]["Core_TransactionEstimate_Tezos"]
> = true
export const _518: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Tron"],
  New.components["schemas"]["Core_TransactionEstimate_Tron"]
> = true
export const _519: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_XRPL"],
  New.components["schemas"]["Core_TransactionEstimate_XRPL"]
> = true
export const _520: Eq<
  Old.components["schemas"]["Core_TransactionOrder"],
  New.components["schemas"]["Core_TransactionOrder"]
> = true
export const _521: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameterType"],
  New.components["schemas"]["Core_TransactionOrderParameterType"]
> = true
export const _522: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters"],
  New.components["schemas"]["Core_TransactionOrderParameters"]
> = true
export const _523: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Algorand"],
  New.components["schemas"]["Core_TransactionOrderParameters_Algorand"]
> = true
export const _524: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Bitcoin"],
  New.components["schemas"]["Core_TransactionOrderParameters_Bitcoin"]
> = true
export const _525: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_BitcoinRedirect"],
  New.components["schemas"]["Core_TransactionOrderParameters_BitcoinRedirect"]
> = true
export const _526: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Cardano"],
  New.components["schemas"]["Core_TransactionOrderParameters_Cardano"]
> = true
export const _527: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Ethereum"],
  New.components["schemas"]["Core_TransactionOrderParameters_Ethereum"]
> = true
export const _528: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Hedera"],
  New.components["schemas"]["Core_TransactionOrderParameters_Hedera"]
> = true
export const _529: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Solana"],
  New.components["schemas"]["Core_TransactionOrderParameters_Solana"]
> = true
export const _530: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Stellar"],
  New.components["schemas"]["Core_TransactionOrderParameters_Stellar"]
> = true
export const _531: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Substrate"],
  New.components["schemas"]["Core_TransactionOrderParameters_Substrate"]
> = true
export const _532: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Tezos"],
  New.components["schemas"]["Core_TransactionOrderParameters_Tezos"]
> = true
export const _533: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Tron"],
  New.components["schemas"]["Core_TransactionOrderParameters_Tron"]
> = true
export const _534: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_XRPL"],
  New.components["schemas"]["Core_TransactionOrderParameters_XRPL"]
> = true
export const _535: Eq<
  Old.components["schemas"]["Core_TransactionOrderReference"],
  New.components["schemas"]["Core_TransactionOrderReference"]
> = true
export const _536: Eq<
  Old.components["schemas"]["Core_TransactionProcessingStatus"],
  New.components["schemas"]["Core_TransactionProcessingStatus"]
> = true
export const _537: Eq<
  Old.components["schemas"]["Core_TransactionRelatedAccountReference"],
  New.components["schemas"]["Core_TransactionRelatedAccountReference"]
> = true
export const _538: Eq<
  Old.components["schemas"]["Core_TransactionUpdated"],
  New.components["schemas"]["Core_TransactionUpdated"]
> = true
export const _539: Eq<
  Old.components["schemas"]["Core_TransactionsCollection"],
  New.components["schemas"]["Core_TransactionsCollection"]
> = true
export const _540: Eq<
  Old.components["schemas"]["Core_TransferDryRunEstimate"],
  New.components["schemas"]["Core_TransferDryRunEstimate"]
> = true
export const _541: Eq<
  Old.components["schemas"]["Core_TransferDryRunEstimate_Failure"],
  New.components["schemas"]["Core_TransferDryRunEstimate_Failure"]
> = true
export const _542: Eq<
  Old.components["schemas"]["Core_TransferDryRunEstimate_Success"],
  New.components["schemas"]["Core_TransferDryRunEstimate_Success"]
> = true
export const _543: Eq<
  Old.components["schemas"]["Core_TransferKind"],
  New.components["schemas"]["Core_TransferKind"]
> = true
export const _544: Eq<
  Old.components["schemas"]["Core_TransferMetadata"],
  New.components["schemas"]["Core_TransferMetadata"]
> = true
export const _545: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Algorand"],
  New.components["schemas"]["Core_TransferMetadata_Algorand"]
> = true
export const _546: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Bitcoin"],
  New.components["schemas"]["Core_TransferMetadata_Bitcoin"]
> = true
export const _547: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Cardano"],
  New.components["schemas"]["Core_TransferMetadata_Cardano"]
> = true
export const _548: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Ethereum"],
  New.components["schemas"]["Core_TransferMetadata_Ethereum"]
> = true
export const _549: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Hedera"],
  New.components["schemas"]["Core_TransferMetadata_Hedera"]
> = true
export const _550: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Solana"],
  New.components["schemas"]["Core_TransferMetadata_Solana"]
> = true
export const _551: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Stellar"],
  New.components["schemas"]["Core_TransferMetadata_Stellar"]
> = true
export const _552: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Substrate"],
  New.components["schemas"]["Core_TransferMetadata_Substrate"]
> = true
export const _553: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Tezos"],
  New.components["schemas"]["Core_TransferMetadata_Tezos"]
> = true
export const _554: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Tron"],
  New.components["schemas"]["Core_TransferMetadata_Tron"]
> = true
export const _555: Eq<
  Old.components["schemas"]["Core_TransferMetadata_XRPL"],
  New.components["schemas"]["Core_TransferMetadata_XRPL"]
> = true
export const _556: Eq<
  Old.components["schemas"]["Core_TransferUpdated"],
  New.components["schemas"]["Core_TransferUpdated"]
> = true
export const _557: Eq<
  Old.components["schemas"]["Core_TransfersCollection"],
  New.components["schemas"]["Core_TransfersCollection"]
> = true
export const _558: Eq<
  Old.components["schemas"]["Core_TronFeeStrategy"],
  New.components["schemas"]["Core_TronFeeStrategy"]
> = true
export const _559: Eq<
  Old.components["schemas"]["Core_TronFeeStrategy_Priority"],
  New.components["schemas"]["Core_TronFeeStrategy_Priority"]
> = true
export const _560: Eq<
  Old.components["schemas"]["Core_TronOperation"],
  New.components["schemas"]["Core_TronOperation"]
> = true
export const _561: Eq<
  Old.components["schemas"]["Core_TronOperation_NativeTransfer"],
  New.components["schemas"]["Core_TronOperation_NativeTransfer"]
> = true
export const _562: Eq<
  Old.components["schemas"]["Core_TronOperation_TRC20Transfer"],
  New.components["schemas"]["Core_TronOperation_TRC20Transfer"]
> = true
export const _563: Eq<
  Old.components["schemas"]["Core_TronTickerProperties"],
  New.components["schemas"]["Core_TronTickerProperties"]
> = true
export const _564: Eq<
  Old.components["schemas"]["Core_TronTickerProperties_Native"],
  New.components["schemas"]["Core_TronTickerProperties_Native"]
> = true
export const _565: Eq<
  Old.components["schemas"]["Core_TronTickerProperties_TRC20"],
  New.components["schemas"]["Core_TronTickerProperties_TRC20"]
> = true
export const _566: Eq<
  Old.components["schemas"]["Core_TrustedDomain"],
  New.components["schemas"]["Core_TrustedDomain"]
> = true
export const _567: Eq<
  Old.components["schemas"]["Core_TrustedDomainsCollection"],
  New.components["schemas"]["Core_TrustedDomainsCollection"]
> = true
export const _568: Eq<
  Old.components["schemas"]["Core_TrustedEndpoint"],
  New.components["schemas"]["Core_TrustedEndpoint"]
> = true
export const _569: Eq<
  Old.components["schemas"]["Core_TrustedEndpointsCollection"],
  New.components["schemas"]["Core_TrustedEndpointsCollection"]
> = true
export const _570: Eq<
  Old.components["schemas"]["Core_TrustedIntent"],
  New.components["schemas"]["Core_TrustedIntent"]
> = true
export const _571: Eq<
  Old.components["schemas"]["Core_TrustedIntentsCollection"],
  New.components["schemas"]["Core_TrustedIntentsCollection"]
> = true
export const _572: Eq<
  Old.components["schemas"]["Core_TrustedLedger"],
  New.components["schemas"]["Core_TrustedLedger"]
> = true
export const _573: Eq<
  Old.components["schemas"]["Core_TrustedLedgersCollection"],
  New.components["schemas"]["Core_TrustedLedgersCollection"]
> = true
export const _574: Eq<
  Old.components["schemas"]["Core_TrustedPoliciesCollection"],
  New.components["schemas"]["Core_TrustedPoliciesCollection"]
> = true
export const _575: Eq<
  Old.components["schemas"]["Core_TrustedPolicy"],
  New.components["schemas"]["Core_TrustedPolicy"]
> = true
export const _576: Eq<
  Old.components["schemas"]["Core_TrustedPublicKey"],
  New.components["schemas"]["Core_TrustedPublicKey"]
> = true
export const _577: Eq<
  Old.components["schemas"]["Core_TrustedPublicKeyAdded"],
  New.components["schemas"]["Core_TrustedPublicKeyAdded"]
> = true
export const _578: Eq<
  Old.components["schemas"]["Core_TrustedPublicKeyPurpose"],
  New.components["schemas"]["Core_TrustedPublicKeyPurpose"]
> = true
export const _579: Eq<
  Old.components["schemas"]["Core_TrustedPublicKeyUpdated"],
  New.components["schemas"]["Core_TrustedPublicKeyUpdated"]
> = true
export const _580: Eq<
  Old.components["schemas"]["Core_TrustedSystemPropertiesCollection"],
  New.components["schemas"]["Core_TrustedSystemPropertiesCollection"]
> = true
export const _581: Eq<
  Old.components["schemas"]["Core_TrustedSystemProperty"],
  New.components["schemas"]["Core_TrustedSystemProperty"]
> = true
export const _582: Eq<
  Old.components["schemas"]["Core_TrustedTransactionOrder"],
  New.components["schemas"]["Core_TrustedTransactionOrder"]
> = true
export const _583: Eq<
  Old.components["schemas"]["Core_TrustedTransactionOrdersCollection"],
  New.components["schemas"]["Core_TrustedTransactionOrdersCollection"]
> = true
export const _584: Eq<
  Old.components["schemas"]["Core_TrustedTrustedPublicKey"],
  New.components["schemas"]["Core_TrustedTrustedPublicKey"]
> = true
export const _585: Eq<
  Old.components["schemas"]["Core_TrustedTrustedPublicKeysCollection"],
  New.components["schemas"]["Core_TrustedTrustedPublicKeysCollection"]
> = true
export const _586: Eq<
  Old.components["schemas"]["Core_TrustedUser"],
  New.components["schemas"]["Core_TrustedUser"]
> = true
export const _587: Eq<
  Old.components["schemas"]["Core_TrustedUsersCollection"],
  New.components["schemas"]["Core_TrustedUsersCollection"]
> = true
export const _588: Eq<
  Old.components["schemas"]["Core_UpsertComplianceConfigurationRequest"],
  New.components["schemas"]["Core_UpsertComplianceConfigurationRequest"]
> = true
export const _589: Eq<
  Old.components["schemas"]["Core_User"],
  New.components["schemas"]["Core_User"]
> = true
export const _590: Eq<
  Old.components["schemas"]["Core_UserCreated"],
  New.components["schemas"]["Core_UserCreated"]
> = true
export const _591: Eq<
  Old.components["schemas"]["Core_UserIntentPayload"],
  New.components["schemas"]["Core_UserIntentPayload"]
> = true
export const _592: Eq<
  Old.components["schemas"]["Core_UserOperationRejectionCode"],
  New.components["schemas"]["Core_UserOperationRejectionCode"]
> = true
export const _593: Eq<
  Old.components["schemas"]["Core_UserReference"],
  New.components["schemas"]["Core_UserReference"]
> = true
export const _594: Eq<
  Old.components["schemas"]["Core_UserUpdated"],
  New.components["schemas"]["Core_UserUpdated"]
> = true
export const _595: Eq<
  Old.components["schemas"]["Core_V3AccountToMigrate"],
  New.components["schemas"]["Core_V3AccountToMigrate"]
> = true
export const _596: Eq<
  Old.components["schemas"]["Core_ValidatedTickerKind"],
  New.components["schemas"]["Core_ValidatedTickerKind"]
> = true
export const _597: Eq<
  Old.components["schemas"]["Core_Vault"],
  New.components["schemas"]["Core_Vault"]
> = true
export const _598: Eq<
  Old.components["schemas"]["Core_VaultAccountKeyInformation"],
  New.components["schemas"]["Core_VaultAccountKeyInformation"]
> = true
export const _599: Eq<
  Old.components["schemas"]["Core_VaultAccountKeyInformation_Random"],
  New.components["schemas"]["Core_VaultAccountKeyInformation_Random"]
> = true
export const _600: Eq<
  Old.components["schemas"]["Core_VaultAccountKeyInformation_VaultDerived"],
  New.components["schemas"]["Core_VaultAccountKeyInformation_VaultDerived"]
> = true
export const _601: Eq<
  Old.components["schemas"]["Core_VaultAccountProviderInformation_Key"],
  New.components["schemas"]["Core_VaultAccountProviderInformation_Key"]
> = true
export const _602: Eq<
  Old.components["schemas"]["Core_VaultAccountProviderInformation_KeyId"],
  New.components["schemas"]["Core_VaultAccountProviderInformation_KeyId"]
> = true
export const _603: Eq<
  Old.components["schemas"]["Core_VaultAccountProviderInformation_Key_VaultDerived"],
  New.components["schemas"]["Core_VaultAccountProviderInformation_Key_VaultDerived"]
> = true
export const _604: Eq<
  Old.components["schemas"]["Core_VaultAccountProviderInformation_Key_VaultDerivedNonExtended"],
  New.components["schemas"]["Core_VaultAccountProviderInformation_Key_VaultDerivedNonExtended"]
> = true
export const _605: Eq<
  Old.components["schemas"]["Core_VaultAccountProviderInformation_Key_VaultRandom"],
  New.components["schemas"]["Core_VaultAccountProviderInformation_Key_VaultRandom"]
> = true
export const _606: Eq<
  Old.components["schemas"]["Core_VaultAdditionalDetails"],
  New.components["schemas"]["Core_VaultAdditionalDetails"]
> = true
export const _607: Eq<
  Old.components["schemas"]["Core_VaultBackupParameters"],
  New.components["schemas"]["Core_VaultBackupParameters"]
> = true
export const _608: Eq<
  Old.components["schemas"]["Core_VaultBackupParameters_VaultHsm"],
  New.components["schemas"]["Core_VaultBackupParameters_VaultHsm"]
> = true
export const _609: Eq<
  Old.components["schemas"]["Core_VaultBackupParameters_VaultMpc"],
  New.components["schemas"]["Core_VaultBackupParameters_VaultMpc"]
> = true
export const _610: Eq<
  Old.components["schemas"]["Core_VaultCreated"],
  New.components["schemas"]["Core_VaultCreated"]
> = true
export const _611: Eq<
  Old.components["schemas"]["Core_VaultDerivation"],
  New.components["schemas"]["Core_VaultDerivation"]
> = true
export const _612: Eq<
  Old.components["schemas"]["Core_VaultHsmBackupData"],
  New.components["schemas"]["Core_VaultHsmBackupData"]
> = true
export const _613: Eq<
  Old.components["schemas"]["Core_VaultKeyMaterialRewrapCompleted"],
  New.components["schemas"]["Core_VaultKeyMaterialRewrapCompleted"]
> = true
export const _614: Eq<
  Old.components["schemas"]["Core_VaultKeyMaterialRewrapFailed"],
  New.components["schemas"]["Core_VaultKeyMaterialRewrapFailed"]
> = true
export const _615: Eq<
  Old.components["schemas"]["Core_VaultKeyStrategy"],
  New.components["schemas"]["Core_VaultKeyStrategy"]
> = true
export const _616: Eq<
  Old.components["schemas"]["Core_VaultMpcBackupData"],
  New.components["schemas"]["Core_VaultMpcBackupData"]
> = true
export const _617: Eq<
  Old.components["schemas"]["Core_VaultParameters"],
  New.components["schemas"]["Core_VaultParameters"]
> = true
export const _618: Eq<
  Old.components["schemas"]["Core_VaultParameters_HSM"],
  New.components["schemas"]["Core_VaultParameters_HSM"]
> = true
export const _619: Eq<
  Old.components["schemas"]["Core_VaultParameters_MPC"],
  New.components["schemas"]["Core_VaultParameters_MPC"]
> = true
export const _620: Eq<
  Old.components["schemas"]["Core_VaultProcessingDetails"],
  New.components["schemas"]["Core_VaultProcessingDetails"]
> = true
export const _621: Eq<
  Old.components["schemas"]["Core_VaultProcessingDetails_Completed"],
  New.components["schemas"]["Core_VaultProcessingDetails_Completed"]
> = true
export const _622: Eq<
  Old.components["schemas"]["Core_VaultProcessingDetails_Pending"],
  New.components["schemas"]["Core_VaultProcessingDetails_Pending"]
> = true
export const _623: Eq<
  Old.components["schemas"]["Core_VaultProcessingDetails_Preparing"],
  New.components["schemas"]["Core_VaultProcessingDetails_Preparing"]
> = true
export const _624: Eq<
  Old.components["schemas"]["Core_VaultProcessingStatus"],
  New.components["schemas"]["Core_VaultProcessingStatus"]
> = true
export const _625: Eq<
  Old.components["schemas"]["Core_VaultUpdated"],
  New.components["schemas"]["Core_VaultUpdated"]
> = true
export const _626: Eq<
  Old.components["schemas"]["Core_VaultsCollection"],
  New.components["schemas"]["Core_VaultsCollection"]
> = true
export const _627: Eq<
  Old.components["schemas"]["Core_WorkflowCondition"],
  New.components["schemas"]["Core_WorkflowCondition"]
> = true
export const _628: Eq<
  Old.components["schemas"]["Core_WorkflowCondition_And"],
  New.components["schemas"]["Core_WorkflowCondition_And"]
> = true
export const _629: Eq<
  Old.components["schemas"]["Core_WorkflowCondition_Or"],
  New.components["schemas"]["Core_WorkflowCondition_Or"]
> = true
export const _630: Eq<
  Old.components["schemas"]["Core_WorkflowCondition_RoleQuorum"],
  New.components["schemas"]["Core_WorkflowCondition_RoleQuorum"]
> = true
export const _631: Eq<
  Old.components["schemas"]["Core_WorkflowProgress"],
  New.components["schemas"]["Core_WorkflowProgress"]
> = true
export const _632: Eq<
  Old.components["schemas"]["Core_WorkflowStep"],
  New.components["schemas"]["Core_WorkflowStep"]
> = true
export const _633: Eq<
  Old.components["schemas"]["Core_WorkflowStepStatus"],
  New.components["schemas"]["Core_WorkflowStepStatus"]
> = true
export const _634: Eq<
  Old.components["schemas"]["Core_XrplClawbackCurrency"],
  New.components["schemas"]["Core_XrplClawbackCurrency"]
> = true
export const _635: Eq<
  Old.components["schemas"]["Core_XrplClawbackCurrency_Currency"],
  New.components["schemas"]["Core_XrplClawbackCurrency_Currency"]
> = true
export const _636: Eq<
  Old.components["schemas"]["Core_XrplClawbackCurrency_MultiPurposeToken"],
  New.components["schemas"]["Core_XrplClawbackCurrency_MultiPurposeToken"]
> = true
export const _637: Eq<
  Old.components["schemas"]["Core_XrplClawbackCurrency_TickerId"],
  New.components["schemas"]["Core_XrplClawbackCurrency_TickerId"]
> = true
export const _638: Eq<
  Old.components["schemas"]["Core_XrplFee"],
  New.components["schemas"]["Core_XrplFee"]
> = true
export const _639: Eq<
  Old.components["schemas"]["Core_XrplFeeStrategy"],
  New.components["schemas"]["Core_XrplFeeStrategy"]
> = true
export const _640: Eq<
  Old.components["schemas"]["Core_XrplFeeStrategy_Priority"],
  New.components["schemas"]["Core_XrplFeeStrategy_Priority"]
> = true
export const _641: Eq<
  Old.components["schemas"]["Core_XrplFeeStrategy_SpecifiedAdditionalFee"],
  New.components["schemas"]["Core_XrplFeeStrategy_SpecifiedAdditionalFee"]
> = true
export const _642: Eq<
  Old.components["schemas"]["Core_XrplIouCurrency"],
  New.components["schemas"]["Core_XrplIouCurrency"]
> = true
export const _643: Eq<
  Old.components["schemas"]["Core_XrplIouCurrency_Currency"],
  New.components["schemas"]["Core_XrplIouCurrency_Currency"]
> = true
export const _644: Eq<
  Old.components["schemas"]["Core_XrplIouCurrency_TickerId"],
  New.components["schemas"]["Core_XrplIouCurrency_TickerId"]
> = true
export const _645: Eq<
  Old.components["schemas"]["Core_XrplMemo"],
  New.components["schemas"]["Core_XrplMemo"]
> = true
export const _646: Eq<
  Old.components["schemas"]["Core_XrplOnLedgerTokenData"],
  New.components["schemas"]["Core_XrplOnLedgerTokenData"]
> = true
export const _647: Eq<
  Old.components["schemas"]["Core_XrplOperation"],
  New.components["schemas"]["Core_XrplOperation"]
> = true
export const _648: Eq<
  Old.components["schemas"]["Core_XrplOperation_AccountSet"],
  New.components["schemas"]["Core_XrplOperation_AccountSet"]
> = true
export const _649: Eq<
  Old.components["schemas"]["Core_XrplOperation_Clawback"],
  New.components["schemas"]["Core_XrplOperation_Clawback"]
> = true
export const _650: Eq<
  Old.components["schemas"]["Core_XrplOperation_DepositPreauth"],
  New.components["schemas"]["Core_XrplOperation_DepositPreauth"]
> = true
export const _651: Eq<
  Old.components["schemas"]["Core_XrplOperation_EscrowFinish"],
  New.components["schemas"]["Core_XrplOperation_EscrowFinish"]
> = true
export const _652: Eq<
  Old.components["schemas"]["Core_XrplOperation_MPTokenAuthorize"],
  New.components["schemas"]["Core_XrplOperation_MPTokenAuthorize"]
> = true
export const _653: Eq<
  Old.components["schemas"]["Core_XrplOperation_MPTokenIssuanceCreate"],
  New.components["schemas"]["Core_XrplOperation_MPTokenIssuanceCreate"]
> = true
export const _654: Eq<
  Old.components["schemas"]["Core_XrplOperation_MPTokenIssuanceDestroy"],
  New.components["schemas"]["Core_XrplOperation_MPTokenIssuanceDestroy"]
> = true
export const _655: Eq<
  Old.components["schemas"]["Core_XrplOperation_MPTokenIssuanceSet"],
  New.components["schemas"]["Core_XrplOperation_MPTokenIssuanceSet"]
> = true
export const _656: Eq<
  Old.components["schemas"]["Core_XrplOperation_OfferCreate"],
  New.components["schemas"]["Core_XrplOperation_OfferCreate"]
> = true
export const _657: Eq<
  Old.components["schemas"]["Core_XrplOperation_Payment"],
  New.components["schemas"]["Core_XrplOperation_Payment"]
> = true
export const _658: Eq<
  Old.components["schemas"]["Core_XrplOperation_TrustSet"],
  New.components["schemas"]["Core_XrplOperation_TrustSet"]
> = true
export const _659: Eq<
  Old.components["schemas"]["Core_XrplPaymentCurrency"],
  New.components["schemas"]["Core_XrplPaymentCurrency"]
> = true
export const _660: Eq<
  Old.components["schemas"]["Core_XrplPaymentCurrency_Currency"],
  New.components["schemas"]["Core_XrplPaymentCurrency_Currency"]
> = true
export const _661: Eq<
  Old.components["schemas"]["Core_XrplPaymentCurrency_MultiPurposeToken"],
  New.components["schemas"]["Core_XrplPaymentCurrency_MultiPurposeToken"]
> = true
export const _662: Eq<
  Old.components["schemas"]["Core_XrplPaymentCurrency_TickerId"],
  New.components["schemas"]["Core_XrplPaymentCurrency_TickerId"]
> = true
export const _663: Eq<
  Old.components["schemas"]["Core_XrplTickerProperties"],
  New.components["schemas"]["Core_XrplTickerProperties"]
> = true
export const _664: Eq<
  Old.components["schemas"]["Core_XrplTickerProperties_FungibleToken"],
  New.components["schemas"]["Core_XrplTickerProperties_FungibleToken"]
> = true
export const _665: Eq<
  Old.components["schemas"]["Core_XrplTickerProperties_MultiPurposeToken"],
  New.components["schemas"]["Core_XrplTickerProperties_MultiPurposeToken"]
> = true
export const _666: Eq<
  Old.components["schemas"]["Core_XrplTickerProperties_Native"],
  New.components["schemas"]["Core_XrplTickerProperties_Native"]
> = true
export const _667: Eq<
  Old.components["schemas"]["Core_Xrpl_AccountSetFlag"],
  New.components["schemas"]["Core_Xrpl_AccountSetFlag"]
> = true
export const _668: Eq<
  Old.components["schemas"]["Core_Xrpl_AssetQuantity"],
  New.components["schemas"]["Core_Xrpl_AssetQuantity"]
> = true
export const _669: Eq<
  Old.components["schemas"]["Core_Xrpl_LimitAmount"],
  New.components["schemas"]["Core_Xrpl_LimitAmount"]
> = true
export const _670: Eq<
  Old.components["schemas"]["Core_Xrpl_MPTokenAuthorizeFlag"],
  New.components["schemas"]["Core_Xrpl_MPTokenAuthorizeFlag"]
> = true
export const _671: Eq<
  Old.components["schemas"]["Core_Xrpl_MPTokenIdentifier"],
  New.components["schemas"]["Core_Xrpl_MPTokenIdentifier"]
> = true
export const _672: Eq<
  Old.components["schemas"]["Core_Xrpl_MPTokenIdentifier_MPTokenIssuanceId"],
  New.components["schemas"]["Core_Xrpl_MPTokenIdentifier_MPTokenIssuanceId"]
> = true
export const _673: Eq<
  Old.components["schemas"]["Core_Xrpl_MPTokenIdentifier_TickerId"],
  New.components["schemas"]["Core_Xrpl_MPTokenIdentifier_TickerId"]
> = true
export const _674: Eq<
  Old.components["schemas"]["Core_Xrpl_MPTokenIssuanceCreateFlag"],
  New.components["schemas"]["Core_Xrpl_MPTokenIssuanceCreateFlag"]
> = true
export const _675: Eq<
  Old.components["schemas"]["Core_Xrpl_MPTokenIssuanceSetFlag"],
  New.components["schemas"]["Core_Xrpl_MPTokenIssuanceSetFlag"]
> = true
export const _676: Eq<
  Old.components["schemas"]["Core_Xrpl_OfferCreateFlag"],
  New.components["schemas"]["Core_Xrpl_OfferCreateFlag"]
> = true
export const _677: Eq<
  Old.components["schemas"]["Core_Xrpl_TrustSetFlag"],
  New.components["schemas"]["Core_Xrpl_TrustSetFlag"]
> = true
export const _678: Eq<
  Old.components["schemas"]["Core_v0_AcknowledgeBackup"],
  New.components["schemas"]["Core_v0_AcknowledgeBackup"]
> = true
export const _679: Eq<
  Old.components["schemas"]["Core_v0_AddAccountLedgers"],
  New.components["schemas"]["Core_v0_AddAccountLedgers"]
> = true
export const _680: Eq<
  Old.components["schemas"]["Core_v0_AddTrustedPublicKeysForMigration"],
  New.components["schemas"]["Core_v0_AddTrustedPublicKeysForMigration"]
> = true
export const _681: Eq<
  Old.components["schemas"]["Core_v0_AttemptTransactionOrderCancellation"],
  New.components["schemas"]["Core_v0_AttemptTransactionOrderCancellation"]
> = true
export const _682: Eq<
  Old.components["schemas"]["Core_v0_CreateAccount"],
  New.components["schemas"]["Core_v0_CreateAccount"]
> = true
export const _683: Eq<
  Old.components["schemas"]["Core_v0_CreateAccountProviderDetailsPayload"],
  New.components["schemas"]["Core_v0_CreateAccountProviderDetailsPayload"]
> = true
export const _684: Eq<
  Old.components["schemas"]["Core_v0_CreateAccountProviderDetailsPayload_Vault"],
  New.components["schemas"]["Core_v0_CreateAccountProviderDetailsPayload_Vault"]
> = true
export const _685: Eq<
  Old.components["schemas"]["Core_v0_CreateBackup"],
  New.components["schemas"]["Core_v0_CreateBackup"]
> = true
export const _686: Eq<
  Old.components["schemas"]["Core_v0_CreateDomain"],
  New.components["schemas"]["Core_v0_CreateDomain"]
> = true
export const _687: Eq<
  Old.components["schemas"]["Core_v0_CreateEndpoint"],
  New.components["schemas"]["Core_v0_CreateEndpoint"]
> = true
export const _688: Eq<
  Old.components["schemas"]["Core_v0_CreateLedger"],
  New.components["schemas"]["Core_v0_CreateLedger"]
> = true
export const _689: Eq<
  Old.components["schemas"]["Core_v0_CreatePolicy"],
  New.components["schemas"]["Core_v0_CreatePolicy"]
> = true
export const _690: Eq<
  Old.components["schemas"]["Core_v0_CreateTicker"],
  New.components["schemas"]["Core_v0_CreateTicker"]
> = true
export const _691: Eq<
  Old.components["schemas"]["Core_v0_CreateTransactionOrder"],
  New.components["schemas"]["Core_v0_CreateTransactionOrder"]
> = true
export const _692: Eq<
  Old.components["schemas"]["Core_v0_CreateTransferOrder"],
  New.components["schemas"]["Core_v0_CreateTransferOrder"]
> = true
export const _693: Eq<
  Old.components["schemas"]["Core_v0_CreateUser"],
  New.components["schemas"]["Core_v0_CreateUser"]
> = true
export const _694: Eq<
  Old.components["schemas"]["Core_v0_CreateVault"],
  New.components["schemas"]["Core_v0_CreateVault"]
> = true
export const _695: Eq<
  Old.components["schemas"]["Core_v0_ExecuteExtension"],
  New.components["schemas"]["Core_v0_ExecuteExtension"]
> = true
export const _696: Eq<
  Old.components["schemas"]["Core_v0_LockAccount"],
  New.components["schemas"]["Core_v0_LockAccount"]
> = true
export const _697: Eq<
  Old.components["schemas"]["Core_v0_LockDomain"],
  New.components["schemas"]["Core_v0_LockDomain"]
> = true
export const _698: Eq<
  Old.components["schemas"]["Core_v0_LockEndpoint"],
  New.components["schemas"]["Core_v0_LockEndpoint"]
> = true
export const _699: Eq<
  Old.components["schemas"]["Core_v0_LockPolicy"],
  New.components["schemas"]["Core_v0_LockPolicy"]
> = true
export const _700: Eq<
  Old.components["schemas"]["Core_v0_LockTicker"],
  New.components["schemas"]["Core_v0_LockTicker"]
> = true
export const _701: Eq<
  Old.components["schemas"]["Core_v0_LockUser"],
  New.components["schemas"]["Core_v0_LockUser"]
> = true
export const _702: Eq<
  Old.components["schemas"]["Core_v0_LockVault"],
  New.components["schemas"]["Core_v0_LockVault"]
> = true
export const _703: Eq<
  Old.components["schemas"]["Core_v0_MigrateSilo3AccountBatch"],
  New.components["schemas"]["Core_v0_MigrateSilo3AccountBatch"]
> = true
export const _704: Eq<
  Old.components["schemas"]["Core_v0_NotarizeData"],
  New.components["schemas"]["Core_v0_NotarizeData"]
> = true
export const _705: Eq<
  Old.components["schemas"]["Core_v0_ReleaseQuarantinedTransfers"],
  New.components["schemas"]["Core_v0_ReleaseQuarantinedTransfers"]
> = true
export const _706: Eq<
  Old.components["schemas"]["Core_v0_RewrapVaultKeyMaterial"],
  New.components["schemas"]["Core_v0_RewrapVaultKeyMaterial"]
> = true
export const _707: Eq<
  Old.components["schemas"]["Core_v0_SetSystemProperty"],
  New.components["schemas"]["Core_v0_SetSystemProperty"]
> = true
export const _708: Eq<
  Old.components["schemas"]["Core_v0_SignManifest"],
  New.components["schemas"]["Core_v0_SignManifest"]
> = true
export const _709: Eq<
  Old.components["schemas"]["Core_v0_UnlockAccount"],
  New.components["schemas"]["Core_v0_UnlockAccount"]
> = true
export const _710: Eq<
  Old.components["schemas"]["Core_v0_UnlockDomain"],
  New.components["schemas"]["Core_v0_UnlockDomain"]
> = true
export const _711: Eq<
  Old.components["schemas"]["Core_v0_UnlockEndpoint"],
  New.components["schemas"]["Core_v0_UnlockEndpoint"]
> = true
export const _712: Eq<
  Old.components["schemas"]["Core_v0_UnlockPolicy"],
  New.components["schemas"]["Core_v0_UnlockPolicy"]
> = true
export const _713: Eq<
  Old.components["schemas"]["Core_v0_UnlockTicker"],
  New.components["schemas"]["Core_v0_UnlockTicker"]
> = true
export const _714: Eq<
  Old.components["schemas"]["Core_v0_UnlockUser"],
  New.components["schemas"]["Core_v0_UnlockUser"]
> = true
export const _715: Eq<
  Old.components["schemas"]["Core_v0_UnlockVault"],
  New.components["schemas"]["Core_v0_UnlockVault"]
> = true
export const _716: Eq<
  Old.components["schemas"]["Core_v0_UpdateAccount"],
  New.components["schemas"]["Core_v0_UpdateAccount"]
> = true
export const _717: Eq<
  Old.components["schemas"]["Core_v0_UpdateDomain"],
  New.components["schemas"]["Core_v0_UpdateDomain"]
> = true
export const _718: Eq<
  Old.components["schemas"]["Core_v0_UpdateDomainPermissions"],
  New.components["schemas"]["Core_v0_UpdateDomainPermissions"]
> = true
export const _719: Eq<
  Old.components["schemas"]["Core_v0_UpdateEndpoint"],
  New.components["schemas"]["Core_v0_UpdateEndpoint"]
> = true
export const _720: Eq<
  Old.components["schemas"]["Core_v0_UpdateLedger"],
  New.components["schemas"]["Core_v0_UpdateLedger"]
> = true
export const _721: Eq<
  Old.components["schemas"]["Core_v0_UpdatePolicy"],
  New.components["schemas"]["Core_v0_UpdatePolicy"]
> = true
export const _722: Eq<
  Old.components["schemas"]["Core_v0_UpdateTicker"],
  New.components["schemas"]["Core_v0_UpdateTicker"]
> = true
export const _723: Eq<
  Old.components["schemas"]["Core_v0_UpdateUser"],
  New.components["schemas"]["Core_v0_UpdateUser"]
> = true
export const _724: Eq<
  Old.components["schemas"]["Core_v0_UpdateVault"],
  New.components["schemas"]["Core_v0_UpdateVault"]
> = true
export const _725: Eq<
  Old.components["schemas"]["Core_v0_ValidateTickers"],
  New.components["schemas"]["Core_v0_ValidateTickers"]
> = true
export const _726: Eq<
  Old.components["schemas"]["CoreExtensions_ErrorMessage"],
  New.components["schemas"]["CoreExtensions_ErrorMessage"]
> = true
export const _727: Eq<
  Old.components["schemas"]["CoreExtensions_ErrorMessages"],
  New.components["schemas"]["CoreExtensions_ErrorMessages"]
> = true
export const _728: Eq<
  Old.components["schemas"]["CoreExtensions_IntentLockStatus"],
  New.components["schemas"]["CoreExtensions_IntentLockStatus"]
> = true
export const _729: Eq<
  Old.components["schemas"]["CoreExtensions_InvitationAnswerIn"],
  New.components["schemas"]["CoreExtensions_InvitationAnswerIn"]
> = true
export const _730: Eq<
  Old.components["schemas"]["CoreExtensions_InvitationIn"],
  New.components["schemas"]["CoreExtensions_InvitationIn"]
> = true
export const _731: Eq<
  Old.components["schemas"]["CoreExtensions_InvitationOut"],
  New.components["schemas"]["CoreExtensions_InvitationOut"]
> = true
export const _732: Eq<
  Old.components["schemas"]["CoreExtensions_InvitationPaginationResult"],
  New.components["schemas"]["CoreExtensions_InvitationPaginationResult"]
> = true
export const _733: Eq<
  Old.components["schemas"]["CoreExtensions_InvitationStatus"],
  New.components["schemas"]["CoreExtensions_InvitationStatus"]
> = true
export const _734: Eq<
  Old.components["schemas"]["CoreExtensions_InvitationStatusQuery"],
  New.components["schemas"]["CoreExtensions_InvitationStatusQuery"]
> = true
export const _735: Eq<
  Old.components["schemas"]["CoreExtensions_Metadata"],
  New.components["schemas"]["CoreExtensions_Metadata"]
> = true
export const _736: Eq<
  Old.components["schemas"]["CoreExtensions_PublicInvitationOut"],
  New.components["schemas"]["CoreExtensions_PublicInvitationOut"]
> = true
export const _737: Eq<
  Old.components["schemas"]["CoreExtensions_PublicUserInvitationOut"],
  New.components["schemas"]["CoreExtensions_PublicUserInvitationOut"]
> = true
export const _738: Eq<
  Old.components["schemas"]["CoreExtensions_SortBy"],
  New.components["schemas"]["CoreExtensions_SortBy"]
> = true
export const _739: Eq<
  Old.components["schemas"]["CoreExtensions_SortOrder"],
  New.components["schemas"]["CoreExtensions_SortOrder"]
> = true
export const _740: Eq<
  Old.components["schemas"]["CoreExtensions_UserEditIn"],
  New.components["schemas"]["CoreExtensions_UserEditIn"]
> = true
export const _741: Eq<
  Old.components["schemas"]["CoreExtensions_UserEditOut"],
  New.components["schemas"]["CoreExtensions_UserEditOut"]
> = true
export const _742: Eq<
  Old.components["schemas"]["CoreExtensions_UserReference"],
  New.components["schemas"]["CoreExtensions_UserReference"]
> = true
export const _743: Eq<
  Old.components["schemas"]["VirtualAccounting_Actor"],
  New.components["schemas"]["VirtualAccounting_Actor"]
> = true
export const _744: Eq<
  Old.components["schemas"]["VirtualAccounting_ActorAddress"],
  New.components["schemas"]["VirtualAccounting_ActorAddress"]
> = true
export const _745: Eq<
  Old.components["schemas"]["VirtualAccounting_ActorType"],
  New.components["schemas"]["VirtualAccounting_ActorType"]
> = true
export const _746: Eq<
  Old.components["schemas"]["VirtualAccounting_ActorVirtualAccount"],
  New.components["schemas"]["VirtualAccounting_ActorVirtualAccount"]
> = true
export const _747: Eq<
  Old.components["schemas"]["VirtualAccounting_Balance"],
  New.components["schemas"]["VirtualAccounting_Balance"]
> = true
export const _748: Eq<
  Old.components["schemas"]["VirtualAccounting_BalanceCollectionResponse"],
  New.components["schemas"]["VirtualAccounting_BalanceCollectionResponse"]
> = true
export const _749: Eq<
  Old.components["schemas"]["VirtualAccounting_CustodyAccountDepositIdentificationSourceIn"],
  New.components["schemas"]["VirtualAccounting_CustodyAccountDepositIdentificationSourceIn"]
> = true
export const _750: Eq<
  Old.components["schemas"]["VirtualAccounting_CustodyAccountExclusionList"],
  New.components["schemas"]["VirtualAccounting_CustodyAccountExclusionList"]
> = true
export const _751: Eq<
  Old.components["schemas"]["VirtualAccounting_CustodyOperation"],
  New.components["schemas"]["VirtualAccounting_CustodyOperation"]
> = true
export const _752: Eq<
  Old.components["schemas"]["VirtualAccounting_DepositIdentificationSourceBase"],
  New.components["schemas"]["VirtualAccounting_DepositIdentificationSourceBase"]
> = true
export const _753: Eq<
  Old.components["schemas"]["VirtualAccounting_DepositIdentificationSourceBaseIn"],
  New.components["schemas"]["VirtualAccounting_DepositIdentificationSourceBaseIn"]
> = true
export const _754: Eq<
  Old.components["schemas"]["VirtualAccounting_DepositIdentificationSourceCustodyAccount"],
  New.components["schemas"]["VirtualAccounting_DepositIdentificationSourceCustodyAccount"]
> = true
export const _755: Eq<
  Old.components["schemas"]["VirtualAccounting_DepositIdentificationSourceStatus"],
  New.components["schemas"]["VirtualAccounting_DepositIdentificationSourceStatus"]
> = true
export const _756: Eq<
  Old.components["schemas"]["VirtualAccounting_DepositIdentificationSourceType"],
  New.components["schemas"]["VirtualAccounting_DepositIdentificationSourceType"]
> = true
export const _757: Eq<
  Old.components["schemas"]["VirtualAccounting_DepositIdentificationStrategy"],
  New.components["schemas"]["VirtualAccounting_DepositIdentificationStrategy"]
> = true
export const _758: Eq<
  Old.components["schemas"]["VirtualAccounting_DepositIdentificationStrategyBase"],
  New.components["schemas"]["VirtualAccounting_DepositIdentificationStrategyBase"]
> = true
export const _759: Eq<
  Old.components["schemas"]["VirtualAccounting_ExclusionList"],
  New.components["schemas"]["VirtualAccounting_ExclusionList"]
> = true
export const _760: Eq<
  Old.components["schemas"]["VirtualAccounting_ExclusionType"],
  New.components["schemas"]["VirtualAccounting_ExclusionType"]
> = true
export const _761: Eq<
  Old.components["schemas"]["VirtualAccounting_LedgerAddress"],
  New.components["schemas"]["VirtualAccounting_LedgerAddress"]
> = true
export const _762: Eq<
  Old.components["schemas"]["VirtualAccounting_LedgerAddressPagedCollectionResponse"],
  New.components["schemas"]["VirtualAccounting_LedgerAddressPagedCollectionResponse"]
> = true
export const _763: Eq<
  Old.components["schemas"]["VirtualAccounting_MaximizeSegregationDepositStrategy"],
  New.components["schemas"]["VirtualAccounting_MaximizeSegregationDepositStrategy"]
> = true
export const _764: Eq<
  Old.components["schemas"]["VirtualAccounting_NewProvisioningStrategy"],
  New.components["schemas"]["VirtualAccounting_NewProvisioningStrategy"]
> = true
export const _765: Eq<
  Old.components["schemas"]["VirtualAccounting_OperationIn"],
  New.components["schemas"]["VirtualAccounting_OperationIn"]
> = true
export const _766: Eq<
  Old.components["schemas"]["VirtualAccounting_OperationOut"],
  New.components["schemas"]["VirtualAccounting_OperationOut"]
> = true
export const _767: Eq<
  Old.components["schemas"]["VirtualAccounting_OperationOutPagedCollectionResponse"],
  New.components["schemas"]["VirtualAccounting_OperationOutPagedCollectionResponse"]
> = true
export const _768: Eq<
  Old.components["schemas"]["VirtualAccounting_OperationPayload"],
  New.components["schemas"]["VirtualAccounting_OperationPayload"]
> = true
export const _769: Eq<
  Old.components["schemas"]["VirtualAccounting_OperationSortBy"],
  New.components["schemas"]["VirtualAccounting_OperationSortBy"]
> = true
export const _770: Eq<
  Old.components["schemas"]["VirtualAccounting_OperationStatus"],
  New.components["schemas"]["VirtualAccounting_OperationStatus"]
> = true
export const _771: Eq<
  Old.components["schemas"]["VirtualAccounting_OperationTransfer"],
  New.components["schemas"]["VirtualAccounting_OperationTransfer"]
> = true
export const _772: Eq<
  Old.components["schemas"]["VirtualAccounting_OperationType"],
  New.components["schemas"]["VirtualAccounting_OperationType"]
> = true
export const _773: Eq<
  Old.components["schemas"]["VirtualAccounting_ProvisioningStrategyBase"],
  New.components["schemas"]["VirtualAccounting_ProvisioningStrategyBase"]
> = true
export const _774: Eq<
  Old.components["schemas"]["VirtualAccounting_ProvisioningStrategyType"],
  New.components["schemas"]["VirtualAccounting_ProvisioningStrategyType"]
> = true
export const _775: Eq<
  Old.components["schemas"]["VirtualAccounting_SortOrder"],
  New.components["schemas"]["VirtualAccounting_SortOrder"]
> = true
export const _776: Eq<
  Old.components["schemas"]["VirtualAccounting_Transfer"],
  New.components["schemas"]["VirtualAccounting_Transfer"]
> = true
export const _777: Eq<
  Old.components["schemas"]["VirtualAccounting_TransferBase"],
  New.components["schemas"]["VirtualAccounting_TransferBase"]
> = true
export const _778: Eq<
  Old.components["schemas"]["VirtualAccounting_TransferBasePagedCollectionResponse"],
  New.components["schemas"]["VirtualAccounting_TransferBasePagedCollectionResponse"]
> = true
export const _779: Eq<
  Old.components["schemas"]["VirtualAccounting_TransferKind"],
  New.components["schemas"]["VirtualAccounting_TransferKind"]
> = true
export const _780: Eq<
  Old.components["schemas"]["VirtualAccounting_TransferSortBy"],
  New.components["schemas"]["VirtualAccounting_TransferSortBy"]
> = true
export const _781: Eq<
  Old.components["schemas"]["VirtualAccounting_TransferStatus"],
  New.components["schemas"]["VirtualAccounting_TransferStatus"]
> = true
export const _782: Eq<
  Old.components["schemas"]["VirtualAccounting_VaMetadata"],
  New.components["schemas"]["VirtualAccounting_VaMetadata"]
> = true
export const _783: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualAccountIn"],
  New.components["schemas"]["VirtualAccounting_VirtualAccountIn"]
> = true
export const _784: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualAccountOut"],
  New.components["schemas"]["VirtualAccounting_VirtualAccountOut"]
> = true
export const _785: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualAccountOutPagedCollectionResponse"],
  New.components["schemas"]["VirtualAccounting_VirtualAccountOutPagedCollectionResponse"]
> = true
export const _786: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualAccountSortBy"],
  New.components["schemas"]["VirtualAccounting_VirtualAccountSortBy"]
> = true
export const _787: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualAccountUpdate"],
  New.components["schemas"]["VirtualAccounting_VirtualAccountUpdate"]
> = true
export const _788: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualLedgerIn"],
  New.components["schemas"]["VirtualAccounting_VirtualLedgerIn"]
> = true
export const _789: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualLedgerOut"],
  New.components["schemas"]["VirtualAccounting_VirtualLedgerOut"]
> = true
export const _790: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualLedgerOutPagedCollectionResponse"],
  New.components["schemas"]["VirtualAccounting_VirtualLedgerOutPagedCollectionResponse"]
> = true
export const _791: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualLedgerSortBy"],
  New.components["schemas"]["VirtualAccounting_VirtualLedgerSortBy"]
> = true
export const _792: Eq<
  Old.components["schemas"]["VirtualAccounting_VirtualLedgerUpdate"],
  New.components["schemas"]["VirtualAccounting_VirtualLedgerUpdate"]
> = true
export const _793: Eq<
  Old.components["schemas"]["Compliance_ErrorResponse"],
  New.components["schemas"]["Compliance_ErrorResponse"]
> = true
export const _794: Eq<
  Old.components["schemas"]["Compliance_ProviderConnectRequest"],
  New.components["schemas"]["Compliance_ProviderConnectRequest"]
> = true
export const _795: Eq<
  Old.components["schemas"]["Compliance_ProviderConnectionResponse"],
  New.components["schemas"]["Compliance_ProviderConnectionResponse"]
> = true
export const _796: Eq<
  Old.components["schemas"]["Compliance_ProviderConnectionsResponse"],
  New.components["schemas"]["Compliance_ProviderConnectionsResponse"]
> = true
export const _797: Eq<
  Old.components["schemas"]["Compliance_ConfigurationDetailResponse"],
  New.components["schemas"]["Compliance_ConfigurationDetailResponse"]
> = true
export const _798: Eq<
  Old.components["schemas"]["Compliance_ConfigurationStepResponse"],
  New.components["schemas"]["Compliance_ConfigurationStepResponse"]
> = true
export const _799: Eq<
  Old.components["schemas"]["Compliance_GetScreeningRulesResponse"],
  New.components["schemas"]["Compliance_GetScreeningRulesResponse"]
> = true
export const _800: Eq<
  Old.components["schemas"]["Compliance_ConfigureScreeningRulesRequest"],
  New.components["schemas"]["Compliance_ConfigureScreeningRulesRequest"]
> = true
export const _801: Eq<
  Old.components["schemas"]["Compliance_RiskLevelAction_Elliptic"],
  New.components["schemas"]["Compliance_RiskLevelAction_Elliptic"]
> = true
export const _802: Eq<
  Old.components["schemas"]["Compliance_RiskLevelAction_Chainalysis"],
  New.components["schemas"]["Compliance_RiskLevelAction_Chainalysis"]
> = true
export const _803: Eq<
  Old.components["schemas"]["Compliance_TransactionScreeningRule_Elliptic"],
  New.components["schemas"]["Compliance_TransactionScreeningRule_Elliptic"]
> = true
export const _804: Eq<
  Old.components["schemas"]["Compliance_TransactionScreeningRule_Chainalysis"],
  New.components["schemas"]["Compliance_TransactionScreeningRule_Chainalysis"]
> = true
export const _805: Eq<
  Old.components["schemas"]["Compliance_PolicyPayloadRequest"],
  New.components["schemas"]["Compliance_PolicyPayloadRequest"]
> = true
export const _806: Eq<
  Old.components["schemas"]["Compliance_PolicyResponse"],
  New.components["schemas"]["Compliance_PolicyResponse"]
> = true
export const _807: Eq<
  Old.components["schemas"]["Compliance_ExceptionRoleResponse"],
  New.components["schemas"]["Compliance_ExceptionRoleResponse"]
> = true
export const _808: Eq<
  Old.components["schemas"]["Compliance_DomainPayloadRequest"],
  New.components["schemas"]["Compliance_DomainPayloadRequest"]
> = true
export const _809: Eq<
  Old.components["schemas"]["Compliance_User"],
  New.components["schemas"]["Compliance_User"]
> = true
export const _810: Eq<
  Old.components["schemas"]["Compliance_LoginId"],
  New.components["schemas"]["Compliance_LoginId"]
> = true
export const _811: Eq<
  Old.components["schemas"]["Compliance_ValidateComplianceDomainCreationRequest"],
  New.components["schemas"]["Compliance_ValidateComplianceDomainCreationRequest"]
> = true
export const _812: Eq<
  Old.components["schemas"]["Compliance_ValidateComplianceDomainCreationResponse"],
  New.components["schemas"]["Compliance_ValidateComplianceDomainCreationResponse"]
> = true
export const _813: Eq<
  Old.components["schemas"]["Compliance_ComplianceAnalysisRequest"],
  New.components["schemas"]["Compliance_ComplianceAnalysisRequest"]
> = true
export const _814: Eq<
  Old.components["schemas"]["Compliance_ComplianceAnalysisRequestData"],
  New.components["schemas"]["Compliance_ComplianceAnalysisRequestData"]
> = true
export const _815: Eq<
  Old.components["schemas"]["Compliance_ComplianceAnalysis"],
  New.components["schemas"]["Compliance_ComplianceAnalysis"]
> = true
export const _816: Eq<
  Old.components["schemas"]["Compliance_ComplianceAnalysisResponse"],
  New.components["schemas"]["Compliance_ComplianceAnalysisResponse"]
> = true
export const _817: Eq<
  Old.components["schemas"]["Compliance_WalletAnalysisRequest"],
  New.components["schemas"]["Compliance_WalletAnalysisRequest"]
> = true
export const _818: Eq<
  Old.components["schemas"]["Compliance_WalletAnalysisResponse"],
  New.components["schemas"]["Compliance_WalletAnalysisResponse"]
> = true
export const _819: Eq<
  Old.components["schemas"]["Compliance_ScreeningDetail_Elliptic"],
  New.components["schemas"]["Compliance_ScreeningDetail_Elliptic"]
> = true
export const _820: Eq<
  Old.components["schemas"]["Compliance_ScreeningDetail_Chainalysis"],
  New.components["schemas"]["Compliance_ScreeningDetail_Chainalysis"]
> = true
export const _821: Eq<
  Old.components["schemas"]["Compliance_ChainalysisAlert"],
  New.components["schemas"]["Compliance_ChainalysisAlert"]
> = true
export const _822: Eq<
  Old.components["schemas"]["Compliance_CreateTransferRequest"],
  New.components["schemas"]["Compliance_CreateTransferRequest"]
> = true
export const _823: Eq<
  Old.components["schemas"]["Compliance_TransferPartyIdentifier"],
  New.components["schemas"]["Compliance_TransferPartyIdentifier"]
> = true
export const _824: Eq<
  Old.components["schemas"]["Compliance_InitiateTravelRuleResponse"],
  New.components["schemas"]["Compliance_InitiateTravelRuleResponse"]
> = true
export const _825: Eq<
  Old.components["schemas"]["Compliance_CreateTransfer201Response"],
  New.components["schemas"]["Compliance_CreateTransfer201Response"]
> = true
export const _826: Eq<
  Old.components["schemas"]["Compliance_GetTravelRuleTransferResponse"],
  New.components["schemas"]["Compliance_GetTravelRuleTransferResponse"]
> = true
export const _827: Eq<
  Old.components["schemas"]["Compliance_Transfer"],
  New.components["schemas"]["Compliance_Transfer"]
> = true
export const _828: Eq<
  Old.components["schemas"]["Compliance_TransferParty"],
  New.components["schemas"]["Compliance_TransferParty"]
> = true
export const _829: Eq<
  Old.components["schemas"]["Compliance_Agent"],
  New.components["schemas"]["Compliance_Agent"]
> = true
export const _830: Eq<
  Old.components["schemas"]["Compliance_AppendPIIRequest"],
  New.components["schemas"]["Compliance_AppendPIIRequest"]
> = true
export const _831: Eq<
  Old.components["schemas"]["Compliance_AppendPIITravelRuleResponse"],
  New.components["schemas"]["Compliance_AppendPIITravelRuleResponse"]
> = true
export const _832: Eq<
  Old.components["schemas"]["Compliance_AppendPIIResponse"],
  New.components["schemas"]["Compliance_AppendPIIResponse"]
> = true
export const _833: Eq<
  Old.components["schemas"]["Compliance_PresentPIIRequest"],
  New.components["schemas"]["Compliance_PresentPIIRequest"]
> = true
export const _834: Eq<
  Old.components["schemas"]["Compliance_PresentPIITravelRuleResponse"],
  New.components["schemas"]["Compliance_PresentPIITravelRuleResponse"]
> = true
export const _835: Eq<
  Old.components["schemas"]["Compliance_PresentPIIResponse"],
  New.components["schemas"]["Compliance_PresentPIIResponse"]
> = true
export const _836: Eq<
  Old.components["schemas"]["Compliance_IVMS101"],
  New.components["schemas"]["Compliance_IVMS101"]
> = true
export const _837: Eq<
  Old.components["schemas"]["Compliance_IVMS101Originator"],
  New.components["schemas"]["Compliance_IVMS101Originator"]
> = true
export const _838: Eq<
  Old.components["schemas"]["Compliance_IVMS101Beneficiary"],
  New.components["schemas"]["Compliance_IVMS101Beneficiary"]
> = true
export const _839: Eq<
  Old.components["schemas"]["Compliance_IVMS101Person"],
  New.components["schemas"]["Compliance_IVMS101Person"]
> = true
export const _840: Eq<
  Old.components["schemas"]["Compliance_IVMS101NaturalPerson"],
  New.components["schemas"]["Compliance_IVMS101NaturalPerson"]
> = true
export const _841: Eq<
  Old.components["schemas"]["Compliance_IVMS101LegalPerson"],
  New.components["schemas"]["Compliance_IVMS101LegalPerson"]
> = true
export const _842: Eq<
  Old.components["schemas"]["Compliance_IVMS101Name"],
  New.components["schemas"]["Compliance_IVMS101Name"]
> = true
export const _843: Eq<
  Old.components["schemas"]["Compliance_IVMS101NameIdentifier"],
  New.components["schemas"]["Compliance_IVMS101NameIdentifier"]
> = true
export const _844: Eq<
  Old.components["schemas"]["Compliance_IVMS101LegalPersonName"],
  New.components["schemas"]["Compliance_IVMS101LegalPersonName"]
> = true
export const _845: Eq<
  Old.components["schemas"]["Compliance_IVMS101LegalPersonNameIdentifier"],
  New.components["schemas"]["Compliance_IVMS101LegalPersonNameIdentifier"]
> = true
export const _846: Eq<
  Old.components["schemas"]["Compliance_IVMS101DateAndPlaceOfBirth"],
  New.components["schemas"]["Compliance_IVMS101DateAndPlaceOfBirth"]
> = true
export const _847: Eq<
  Old.components["schemas"]["Compliance_IVMS101GeographicAddress"],
  New.components["schemas"]["Compliance_IVMS101GeographicAddress"]
> = true
export const _848: Eq<
  Old.components["schemas"]["Compliance_IVMS101NationalIdentification"],
  New.components["schemas"]["Compliance_IVMS101NationalIdentification"]
> = true
export const _849: Eq<
  Old.components["schemas"]["Compliance_TravelRuleDetailsRequest"],
  New.components["schemas"]["Compliance_TravelRuleDetailsRequest"]
> = true
export const _850: Eq<
  Old.components["schemas"]["Compliance_TravelRuleDetailsRequestData"],
  New.components["schemas"]["Compliance_TravelRuleDetailsRequestData"]
> = true
export const _851: Eq<
  Old.components["schemas"]["Compliance_TravelRuleDetailsResponse"],
  New.components["schemas"]["Compliance_TravelRuleDetailsResponse"]
> = true
export const _852: Eq<
  Old.components["schemas"]["Compliance_TravelRuleDetail"],
  New.components["schemas"]["Compliance_TravelRuleDetail"]
> = true
export const _853: Eq<
  Old.components["schemas"]["Compliance_CreateRelationshipRequest"],
  New.components["schemas"]["Compliance_CreateRelationshipRequest"]
> = true
export const _854: Eq<
  Old.components["schemas"]["Compliance_RelationshipList"],
  New.components["schemas"]["Compliance_RelationshipList"]
> = true
export const _855: Eq<
  Old.components["schemas"]["Compliance_RelationshipWithProofs"],
  New.components["schemas"]["Compliance_RelationshipWithProofs"]
> = true
export const _856: Eq<
  Old.components["schemas"]["Compliance_OwnershipProof"],
  New.components["schemas"]["Compliance_OwnershipProof"]
> = true
export const _857: Eq<
  Old.components["schemas"]["EDS_ChannelCreate"],
  New.components["schemas"]["EDS_ChannelCreate"]
> = true
export const _858: Eq<
  Old.components["schemas"]["EDS_WebhookChannelCreate"],
  New.components["schemas"]["EDS_WebhookChannelCreate"]
> = true
export const _859: Eq<
  Old.components["schemas"]["EDS_Channel"],
  New.components["schemas"]["EDS_Channel"]
> = true
export const _860: Eq<
  Old.components["schemas"]["EDS_ChannelUpdate"],
  New.components["schemas"]["EDS_ChannelUpdate"]
> = true
export const _861: Eq<
  Old.components["schemas"]["EDS_Event"],
  New.components["schemas"]["EDS_Event"]
> = true
export const _862: Eq<
  Old.components["schemas"]["GasStation_AlertLimitDto"],
  New.components["schemas"]["GasStation_AlertLimitDto"]
> = true
export const _863: Eq<
  Old.components["schemas"]["GasStation_BalanceStatusDto"],
  New.components["schemas"]["GasStation_BalanceStatusDto"]
> = true
export const _864: Eq<
  Old.components["schemas"]["GasStation_SponsorResponseDto"],
  New.components["schemas"]["GasStation_SponsorResponseDto"]
> = true
export const _865: Eq<
  Old.components["schemas"]["GasStation_CreateSponsorDto"],
  New.components["schemas"]["GasStation_CreateSponsorDto"]
> = true
export const _866: Eq<
  Old.components["schemas"]["GasStation_SponsorCreatedResponseDto"],
  New.components["schemas"]["GasStation_SponsorCreatedResponseDto"]
> = true
export const _867: Eq<
  Old.components["schemas"]["GasStation_UpdateSponsorDto"],
  New.components["schemas"]["GasStation_UpdateSponsorDto"]
> = true
export const _868: Eq<
  Old.components["schemas"]["GasStation_SponsorsListResponseDto"],
  New.components["schemas"]["GasStation_SponsorsListResponseDto"]
> = true
export const _869: Eq<
  Old.components["schemas"]["GasStation_AccountSponsorResponseDto"],
  New.components["schemas"]["GasStation_AccountSponsorResponseDto"]
> = true
export const _870: Eq<
  Old.components["schemas"]["GasStation_DomainSponsorResponseDto"],
  New.components["schemas"]["GasStation_DomainSponsorResponseDto"]
> = true
export const _871: Eq<
  Old.components["schemas"]["GasStation_SponsoredEntityDto"],
  New.components["schemas"]["GasStation_SponsoredEntityDto"]
> = true
export const _872: Eq<
  Old.components["schemas"]["GasStation_SponsoredEntitiesResponseDto"],
  New.components["schemas"]["GasStation_SponsoredEntitiesResponseDto"]
> = true
export const _873: Eq<
  Old.components["schemas"]["GasStation_LedgerDto"],
  New.components["schemas"]["GasStation_LedgerDto"]
> = true
export const _874: Eq<
  Old.components["schemas"]["GasStation_SponsorshipDetailsDto"],
  New.components["schemas"]["GasStation_SponsorshipDetailsDto"]
> = true
export const _875: Eq<
  Old.components["schemas"]["GasStation_SponsorableDomainDto"],
  New.components["schemas"]["GasStation_SponsorableDomainDto"]
> = true
export const _876: Eq<
  Old.components["schemas"]["GasStation_SponsorableDomainsResponseDto"],
  New.components["schemas"]["GasStation_SponsorableDomainsResponseDto"]
> = true
export const _877: Eq<
  Old.components["schemas"]["GasStation_DomainIdentifierDto"],
  New.components["schemas"]["GasStation_DomainIdentifierDto"]
> = true
export const _878: Eq<
  Old.components["schemas"]["GasStation_AddSponsoredDomainsDto"],
  New.components["schemas"]["GasStation_AddSponsoredDomainsDto"]
> = true
export const _879: Eq<
  Old.components["schemas"]["GasStation_ConflictEntityDto"],
  New.components["schemas"]["GasStation_ConflictEntityDto"]
> = true
export const _880: Eq<
  Old.components["schemas"]["GasStation_SponsoredModificationResponseDto"],
  New.components["schemas"]["GasStation_SponsoredModificationResponseDto"]
> = true
export const _881: Eq<
  Old.components["schemas"]["GasStation_LineageDto"],
  New.components["schemas"]["GasStation_LineageDto"]
> = true
export const _882: Eq<
  Old.components["schemas"]["GasStation_SponsorableAccountDto"],
  New.components["schemas"]["GasStation_SponsorableAccountDto"]
> = true
export const _883: Eq<
  Old.components["schemas"]["GasStation_SponsorableAccountsResponseDto"],
  New.components["schemas"]["GasStation_SponsorableAccountsResponseDto"]
> = true
export const _884: Eq<
  Old.components["schemas"]["GasStation_AccountIdentifierDto"],
  New.components["schemas"]["GasStation_AccountIdentifierDto"]
> = true
export const _885: Eq<
  Old.components["schemas"]["GasStation_AddSponsoredAccountsDto"],
  New.components["schemas"]["GasStation_AddSponsoredAccountsDto"]
> = true
export const _886: Eq<
  Old.components["schemas"]["GasStation_AuditEventDto"],
  New.components["schemas"]["GasStation_AuditEventDto"]
> = true
export const _887: Eq<
  Old.components["schemas"]["GasStation_EventsResponseDto"],
  New.components["schemas"]["GasStation_EventsResponseDto"]
> = true
export const _888: Eq<
  Old.components["schemas"]["GasStation_ValidSponsorItemDto"],
  New.components["schemas"]["GasStation_ValidSponsorItemDto"]
> = true
export const _889: Eq<
  Old.components["schemas"]["GasStation_ValidSponsorsResponseDto"],
  New.components["schemas"]["GasStation_ValidSponsorsResponseDto"]
> = true
export const _890: Eq<
  Old.components["schemas"]["Core_AccountProvider"],
  New.components["schemas"]["Core_AccountProvider"]
> = true
export const _891: Eq<
  Old.components["schemas"]["Core_AccountProviderAction"],
  New.components["schemas"]["Core_AccountProviderAction"]
> = true
export const _892: Eq<
  Old.components["schemas"]["Core_AccountProviderAction_External"],
  New.components["schemas"]["Core_AccountProviderAction_External"]
> = true
export const _893: Eq<
  Old.components["schemas"]["Core_AccountProviderAdditionalDetails"],
  New.components["schemas"]["Core_AccountProviderAdditionalDetails"]
> = true
export const _894: Eq<
  Old.components["schemas"]["Core_AccountProviderCreated"],
  New.components["schemas"]["Core_AccountProviderCreated"]
> = true
export const _895: Eq<
  Old.components["schemas"]["Core_AccountProviderInformation_External"],
  New.components["schemas"]["Core_AccountProviderInformation_External"]
> = true
export const _896: Eq<
  Old.components["schemas"]["Core_AccountProviderKey"],
  New.components["schemas"]["Core_AccountProviderKey"]
> = true
export const _897: Eq<
  Old.components["schemas"]["Core_AccountProviderKeyStatus"],
  New.components["schemas"]["Core_AccountProviderKeyStatus"]
> = true
export const _898: Eq<
  Old.components["schemas"]["Core_AccountProviderProcessingDetails"],
  New.components["schemas"]["Core_AccountProviderProcessingDetails"]
> = true
export const _899: Eq<
  Old.components["schemas"]["Core_AccountProviderProcessingDetails_Completed"],
  New.components["schemas"]["Core_AccountProviderProcessingDetails_Completed"]
> = true
export const _900: Eq<
  Old.components["schemas"]["Core_AccountProviderProcessingDetails_Pending"],
  New.components["schemas"]["Core_AccountProviderProcessingDetails_Pending"]
> = true
export const _901: Eq<
  Old.components["schemas"]["Core_AccountProviderProcessingDetails_Preparing"],
  New.components["schemas"]["Core_AccountProviderProcessingDetails_Preparing"]
> = true
export const _902: Eq<
  Old.components["schemas"]["Core_AccountProviderProcessingStatus"],
  New.components["schemas"]["Core_AccountProviderProcessingStatus"]
> = true
export const _903: Eq<
  Old.components["schemas"]["Core_AccountProviderType"],
  New.components["schemas"]["Core_AccountProviderType"]
> = true
export const _904: Eq<
  Old.components["schemas"]["Core_AccountProviderType_ExternalProvider"],
  New.components["schemas"]["Core_AccountProviderType_ExternalProvider"]
> = true
export const _905: Eq<
  Old.components["schemas"]["Core_AccountProviderUpdated"],
  New.components["schemas"]["Core_AccountProviderUpdated"]
> = true
export const _906: Eq<
  Old.components["schemas"]["Core_ApiAccountProviderKey"],
  New.components["schemas"]["Core_ApiAccountProviderKey"]
> = true
export const _907: Eq<
  Old.components["schemas"]["Core_ApiLocation"],
  New.components["schemas"]["Core_ApiLocation"]
> = true
export const _908: Eq<
  Old.components["schemas"]["Core_ApiProvider"],
  New.components["schemas"]["Core_ApiProvider"]
> = true
export const _909: Eq<
  Old.components["schemas"]["Core_ApiRelatedTransaction"],
  New.components["schemas"]["Core_ApiRelatedTransaction"]
> = true
export const _910: Eq<
  Old.components["schemas"]["Core_DepositInstructions"],
  New.components["schemas"]["Core_DepositInstructions"]
> = true
export const _911: Eq<
  Old.components["schemas"]["Core_DepositInstructionsCreated"],
  New.components["schemas"]["Core_DepositInstructionsCreated"]
> = true
export const _912: Eq<
  Old.components["schemas"]["Core_DepositInstructionsDetails"],
  New.components["schemas"]["Core_DepositInstructionsDetails"]
> = true
export const _913: Eq<
  Old.components["schemas"]["Core_DepositInstructionsDetails_Address"],
  New.components["schemas"]["Core_DepositInstructionsDetails_Address"]
> = true
export const _914: Eq<
  Old.components["schemas"]["Core_DepositInstructionsProviderDetails"],
  New.components["schemas"]["Core_DepositInstructionsProviderDetails"]
> = true
export const _915: Eq<
  Old.components["schemas"]["Core_DepositInstructionsProviderDetails_Completed"],
  New.components["schemas"]["Core_DepositInstructionsProviderDetails_Completed"]
> = true
export const _916: Eq<
  Old.components["schemas"]["Core_DepositInstructionsProviderDetails_Failed"],
  New.components["schemas"]["Core_DepositInstructionsProviderDetails_Failed"]
> = true
export const _917: Eq<
  Old.components["schemas"]["Core_DepositInstructionsReference"],
  New.components["schemas"]["Core_DepositInstructionsReference"]
> = true
export const _918: Eq<
  Old.components["schemas"]["Core_DepositInstructionsUpdated"],
  New.components["schemas"]["Core_DepositInstructionsUpdated"]
> = true
export const _919: Eq<
  Old.components["schemas"]["Core_ExternalOperation"],
  New.components["schemas"]["Core_ExternalOperation"]
> = true
export const _920: Eq<
  Old.components["schemas"]["Core_ExternalOperation_Transfer"],
  New.components["schemas"]["Core_ExternalOperation_Transfer"]
> = true
export const _921: Eq<
  Old.components["schemas"]["Core_ExternalProviderTransactionReference"],
  New.components["schemas"]["Core_ExternalProviderTransactionReference"]
> = true
export const _922: Eq<
  Old.components["schemas"]["Core_ExternalTickerProperties"],
  New.components["schemas"]["Core_ExternalTickerProperties"]
> = true
export const _923: Eq<
  Old.components["schemas"]["Core_ExternalTickerProperties_Asset"],
  New.components["schemas"]["Core_ExternalTickerProperties_Asset"]
> = true
export const _924: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_AddProviderKey"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_AddProviderKey"]
> = true
export const _925: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_ConnectProvider"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_ConnectProvider"]
> = true
export const _926: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_RequestDepositInstructions"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_RequestDepositInstructions"]
> = true
export const _927: Eq<
  Old.components["schemas"]["Core_LedgerParameters_External"],
  New.components["schemas"]["Core_LedgerParameters_External"]
> = true
export const _928: Eq<
  Old.components["schemas"]["Core_Location"],
  New.components["schemas"]["Core_Location"]
> = true
export const _929: Eq<
  Old.components["schemas"]["Core_LocationCreated"],
  New.components["schemas"]["Core_LocationCreated"]
> = true
export const _930: Eq<
  Old.components["schemas"]["Core_LocationUpdated"],
  New.components["schemas"]["Core_LocationUpdated"]
> = true
export const _931: Eq<
  Old.components["schemas"]["Core_LocationsCollection"],
  New.components["schemas"]["Core_LocationsCollection"]
> = true
export const _932: Eq<
  Old.components["schemas"]["Core_OnLedgerData_External"],
  New.components["schemas"]["Core_OnLedgerData_External"]
> = true
export const _933: Eq<
  Old.components["schemas"]["Core_Output"],
  New.components["schemas"]["Core_Output"]
> = true
export const _934: Eq<
  Old.components["schemas"]["Core_ProvidersCollection"],
  New.components["schemas"]["Core_ProvidersCollection"]
> = true
export const _935: Eq<
  Old.components["schemas"]["Core_TickerBalances"],
  New.components["schemas"]["Core_TickerBalances"]
> = true
export const _936: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_External"],
  New.components["schemas"]["Core_TickerLedgerDetails_External"]
> = true
export const _937: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_External"],
  New.components["schemas"]["Core_TransactionEstimate_External"]
> = true
export const _938: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_External"],
  New.components["schemas"]["Core_TransactionOrderParameters_External"]
> = true
export const _939: Eq<
  Old.components["schemas"]["Core_TransferMetadata_External"],
  New.components["schemas"]["Core_TransferMetadata_External"]
> = true
export const _940: Eq<
  Old.components["schemas"]["Core_Transferability"],
  New.components["schemas"]["Core_Transferability"]
> = true
export const _941: Eq<
  Old.components["schemas"]["Core_TransferabilityDestination"],
  New.components["schemas"]["Core_TransferabilityDestination"]
> = true
export const _942: Eq<
  Old.components["schemas"]["Core_TransferabilityDestination_Ticker"],
  New.components["schemas"]["Core_TransferabilityDestination_Ticker"]
> = true
export const _943: Eq<
  Old.components["schemas"]["Core_TransferabilityResponse"],
  New.components["schemas"]["Core_TransferabilityResponse"]
> = true
export const _944: Eq<
  Old.components["schemas"]["Core_TransferabilitySource"],
  New.components["schemas"]["Core_TransferabilitySource"]
> = true
export const _945: Eq<
  Old.components["schemas"]["Core_TransferabilitySource_Ticker"],
  New.components["schemas"]["Core_TransferabilitySource_Ticker"]
> = true
export const _946: Eq<
  Old.components["schemas"]["Core_TransferabilityUnderlying"],
  New.components["schemas"]["Core_TransferabilityUnderlying"]
> = true
export const _947: Eq<
  Old.components["schemas"]["Core_TransferabilityUnderlying_Ticker"],
  New.components["schemas"]["Core_TransferabilityUnderlying_Ticker"]
> = true
export const _948: Eq<
  Old.components["schemas"]["Core_TrustedDepositInstructions"],
  New.components["schemas"]["Core_TrustedDepositInstructions"]
> = true
export const _949: Eq<
  Old.components["schemas"]["Core_TrustedDepositInstructionsCollection"],
  New.components["schemas"]["Core_TrustedDepositInstructionsCollection"]
> = true
export const _950: Eq<
  Old.components["schemas"]["Core_v0_AddProviderKey"],
  New.components["schemas"]["Core_v0_AddProviderKey"]
> = true
export const _951: Eq<
  Old.components["schemas"]["Core_v0_ConnectProvider"],
  New.components["schemas"]["Core_v0_ConnectProvider"]
> = true
export const _952: Eq<
  Old.components["schemas"]["Core_v0_CreateAccountProviderDetailsPayload_External"],
  New.components["schemas"]["Core_v0_CreateAccountProviderDetailsPayload_External"]
> = true
export const _953: Eq<
  Old.components["schemas"]["Core_v0_RequestDepositInstructions"],
  New.components["schemas"]["Core_v0_RequestDepositInstructions"]
> = true
export const _954: Eq<
  Old.components["schemas"]["Core_IntentAuthor"],
  New.components["schemas"]["Core_IntentAuthor"]
> = true
export const _955: Eq<
  Old.components["schemas"]["Core_IntentAuthor_Service"],
  New.components["schemas"]["Core_IntentAuthor_Service"]
> = true
export const _956: Eq<
  Old.components["schemas"]["Core_IntentAuthor_User"],
  New.components["schemas"]["Core_IntentAuthor_User"]
> = true
export const _957: Eq<
  Old.components["schemas"]["Core_IntentBody"],
  New.components["schemas"]["Core_IntentBody"]
> = true
export const _958: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_RegisterTrustedPublicKey"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_RegisterTrustedPublicKey"]
> = true
export const _959: Eq<
  Old.components["schemas"]["Core_IntentOrigin"],
  New.components["schemas"]["Core_IntentOrigin"]
> = true
export const _960: Eq<
  Old.components["schemas"]["Core_NotarySystemSignedIntentsEnabledValue"],
  New.components["schemas"]["Core_NotarySystemSignedIntentsEnabledValue"]
> = true
export const _961: Eq<
  Old.components["schemas"]["Core_NotarySystemSigningKeyValue"],
  New.components["schemas"]["Core_NotarySystemSigningKeyValue"]
> = true
export const _962: Eq<
  Old.components["schemas"]["Core_ReadWriteSystemPropertyKeyValue_NotarySystemSignedIntentsEnabledProperty"],
  New.components["schemas"]["Core_ReadWriteSystemPropertyKeyValue_NotarySystemSignedIntentsEnabledProperty"]
> = true
export const _963: Eq<
  Old.components["schemas"]["Core_SystemProperty_NotarySystemSignedIntentsEnabledSystemProperty"],
  New.components["schemas"]["Core_SystemProperty_NotarySystemSignedIntentsEnabledSystemProperty"]
> = true
export const _964: Eq<
  Old.components["schemas"]["Core_SystemProperty_NotarySystemSigningKeySystemProperty"],
  New.components["schemas"]["Core_SystemProperty_NotarySystemSigningKeySystemProperty"]
> = true
export const _965: Eq<
  Old.components["schemas"]["Core_SystemSigned"],
  New.components["schemas"]["Core_SystemSigned"]
> = true
export const _966: Eq<
  Old.components["schemas"]["Core_SystemSignedRequest"],
  New.components["schemas"]["Core_SystemSignedRequest"]
> = true
export const _967: Eq<
  Old.components["schemas"]["Core_SystemSigningInfo"],
  New.components["schemas"]["Core_SystemSigningInfo"]
> = true
export const _968: Eq<
  Old.components["schemas"]["Core_SystemSigningKey"],
  New.components["schemas"]["Core_SystemSigningKey"]
> = true
export const _969: Eq<
  Old.components["schemas"]["Core_UserSigned"],
  New.components["schemas"]["Core_UserSigned"]
> = true
export const _970: Eq<
  Old.components["schemas"]["Core_v0_RegisterTrustedPublicKey"],
  New.components["schemas"]["Core_v0_RegisterTrustedPublicKey"]
> = true
export const _971: Eq<
  Old.components["schemas"]["Omnibus_OmnibusResponse"],
  New.components["schemas"]["Omnibus_OmnibusResponse"]
> = true
export const _972: Eq<
  Old.components["schemas"]["Omnibus_TenantBalanceEntry"],
  New.components["schemas"]["Omnibus_TenantBalanceEntry"]
> = true
export const _973: Eq<
  Old.components["schemas"]["Omnibus_UpdateOmnibusRequest"],
  New.components["schemas"]["Omnibus_UpdateOmnibusRequest"]
> = true
export const _974: Eq<
  Old.components["schemas"]["Omnibus_TenantCustomProperty"],
  New.components["schemas"]["Omnibus_TenantCustomProperty"]
> = true
export const _975: Eq<
  Old.components["schemas"]["Omnibus_TenantResponse"],
  New.components["schemas"]["Omnibus_TenantResponse"]
> = true
export const _976: Eq<
  Old.components["schemas"]["Omnibus_CreateOrUpdateTenantRequest"],
  New.components["schemas"]["Omnibus_CreateOrUpdateTenantRequest"]
> = true
export const _977: Eq<
  Old.components["schemas"]["Omnibus_JsonNullableListTenantCustomProperty"],
  New.components["schemas"]["Omnibus_JsonNullableListTenantCustomProperty"]
> = true
export const _978: Eq<
  Old.components["schemas"]["Omnibus_CreateOmnibusResponse"],
  New.components["schemas"]["Omnibus_CreateOmnibusResponse"]
> = true
export const _979: Eq<
  Old.components["schemas"]["Omnibus_UnsignedIntentPayload"],
  New.components["schemas"]["Omnibus_UnsignedIntentPayload"]
> = true
export const _980: Eq<
  Old.components["schemas"]["Omnibus_UnsignedIntentPayload_author"],
  New.components["schemas"]["Omnibus_UnsignedIntentPayload_author"]
> = true
export const _981: Eq<
  Old.components["schemas"]["Omnibus_CreateOmnibusRequest"],
  New.components["schemas"]["Omnibus_CreateOmnibusRequest"]
> = true
export const _982: Eq<
  Old.components["schemas"]["Omnibus_CreateWithdrawalResponse"],
  New.components["schemas"]["Omnibus_CreateWithdrawalResponse"]
> = true
export const _983: Eq<
  Old.components["schemas"]["Omnibus_WithdrawalResponse"],
  New.components["schemas"]["Omnibus_WithdrawalResponse"]
> = true
export const _984: Eq<
  Old.components["schemas"]["Omnibus_CreateWithdrawalRequest"],
  New.components["schemas"]["Omnibus_CreateWithdrawalRequest"]
> = true
export const _985: Eq<
  Old.components["schemas"]["Omnibus_InternalTransferResponse"],
  New.components["schemas"]["Omnibus_InternalTransferResponse"]
> = true
export const _986: Eq<
  Old.components["schemas"]["Omnibus_CreateInternalTransferRequest"],
  New.components["schemas"]["Omnibus_CreateInternalTransferRequest"]
> = true
export const _987: Eq<
  Old.components["schemas"]["Omnibus_DepositAddress"],
  New.components["schemas"]["Omnibus_DepositAddress"]
> = true
export const _988: Eq<
  Old.components["schemas"]["Omnibus_DepositWalletResponse"],
  New.components["schemas"]["Omnibus_DepositWalletResponse"]
> = true
export const _989: Eq<
  Old.components["schemas"]["Omnibus_TenantPageMetadata"],
  New.components["schemas"]["Omnibus_TenantPageMetadata"]
> = true
export const _990: Eq<
  Old.components["schemas"]["Omnibus_TenantPageResponse"],
  New.components["schemas"]["Omnibus_TenantPageResponse"]
> = true
export const _991: Eq<
  Old.components["schemas"]["Omnibus_InternalTransferPageResponse"],
  New.components["schemas"]["Omnibus_InternalTransferPageResponse"]
> = true
export const _992: Eq<
  Old.components["schemas"]["Omnibus_InternalTransferSummary"],
  New.components["schemas"]["Omnibus_InternalTransferSummary"]
> = true
export const _993: Eq<
  Old.components["schemas"]["Omnibus_PageMetadata"],
  New.components["schemas"]["Omnibus_PageMetadata"]
> = true
export const _994: Eq<
  Old.components["schemas"]["Omnibus_TenantRef"],
  New.components["schemas"]["Omnibus_TenantRef"]
> = true
export const _995: Eq<
  Old.components["schemas"]["Omnibus_DepositWalletSummary"],
  New.components["schemas"]["Omnibus_DepositWalletSummary"]
> = true
export const _996: Eq<
  Old.components["schemas"]["Omnibus_DepositWalletSummaryPageResponse"],
  New.components["schemas"]["Omnibus_DepositWalletSummaryPageResponse"]
> = true
export const _997: Eq<
  Old.components["schemas"]["Omnibus_HelloWorldResponse"],
  New.components["schemas"]["Omnibus_HelloWorldResponse"]
> = true
export const _998: Eq<
  Old.components["schemas"]["Export_PositionExportDto"],
  New.components["schemas"]["Export_PositionExportDto"]
> = true
export const _999: Eq<
  Old.components["schemas"]["Export_DateRangeDto"],
  New.components["schemas"]["Export_DateRangeDto"]
> = true
export const _1000: Eq<
  Old.components["schemas"]["Export_MovementExportDto"],
  New.components["schemas"]["Export_MovementExportDto"]
> = true
export const _1001: Eq<
  Old.components["schemas"]["Omnibus_BulkUpdateSweepThresholdsResponse"],
  New.components["schemas"]["Omnibus_BulkUpdateSweepThresholdsResponse"]
> = true
export const _1002: Eq<
  Old.components["schemas"]["Omnibus_SweepThresholdConflict"],
  New.components["schemas"]["Omnibus_SweepThresholdConflict"]
> = true
export const _1003: Eq<
  Old.components["schemas"]["Omnibus_SweepThresholdConflictResponse"],
  New.components["schemas"]["Omnibus_SweepThresholdConflictResponse"]
> = true
export const _1004: Eq<
  Old.components["schemas"]["Omnibus_BulkUpdateSweepThresholdsRequest"],
  New.components["schemas"]["Omnibus_BulkUpdateSweepThresholdsRequest"]
> = true
export const _1005: Eq<
  Old.components["schemas"]["Omnibus_SweepThresholdUpdate"],
  New.components["schemas"]["Omnibus_SweepThresholdUpdate"]
> = true
export const _1006: Eq<
  Old.components["schemas"]["Omnibus_SweepThresholdConfig"],
  New.components["schemas"]["Omnibus_SweepThresholdConfig"]
> = true
export const _1007: Eq<
  Old.components["schemas"]["Omnibus_SweepThresholdPageResponse"],
  New.components["schemas"]["Omnibus_SweepThresholdPageResponse"]
> = true
export const _1008: Eq<
  Old.components["schemas"]["Core_EndpointLedgerParameters_Hedera"],
  New.components["schemas"]["Core_EndpointLedgerParameters_Hedera"]
> = true
export const _1009: Eq<
  Old.components["schemas"]["Core_EndpointLedgerParameters_Stellar"],
  New.components["schemas"]["Core_EndpointLedgerParameters_Stellar"]
> = true
export const _1010: Eq<
  Old.components["schemas"]["Core_EndpointLedgerParameters_XRPL"],
  New.components["schemas"]["Core_EndpointLedgerParameters_XRPL"]
> = true
export const _1011: Eq<
  Old.components["schemas"]["Core_TransferDestinationTag"],
  New.components["schemas"]["Core_TransferDestinationTag"]
> = true
export const _1012: Eq<
  Old.components["schemas"]["Core_TransferDestinationTag_Hedera"],
  New.components["schemas"]["Core_TransferDestinationTag_Hedera"]
> = true
export const _1013: Eq<
  Old.components["schemas"]["Core_TransferDestinationTag_Stellar"],
  New.components["schemas"]["Core_TransferDestinationTag_Stellar"]
> = true
export const _1014: Eq<
  Old.components["schemas"]["Core_TransferDestinationTag_XRPL"],
  New.components["schemas"]["Core_TransferDestinationTag_XRPL"]
> = true
export const _1015: Eq<
  Old.components["schemas"]["Omnibus_JsonNullableUUID"],
  New.components["schemas"]["Omnibus_JsonNullableUUID"]
> = true
export const _1016: Eq<
  Old.components["schemas"]["Omnibus_JsonNullableOmnibusHierarchyTenant_depositWallet"],
  New.components["schemas"]["Omnibus_JsonNullableOmnibusHierarchyTenant_depositWallet"]
> = true
export const _1017: Eq<
  Old.components["schemas"]["Omnibus_OmnibusHierarchyResponse"],
  New.components["schemas"]["Omnibus_OmnibusHierarchyResponse"]
> = true
export const _1018: Eq<
  Old.components["schemas"]["Omnibus_OmnibusHierarchyTenant"],
  New.components["schemas"]["Omnibus_OmnibusHierarchyTenant"]
> = true
export const _1019: Eq<
  Old.components["schemas"]["Export_ExportErrorDto"],
  New.components["schemas"]["Export_ExportErrorDto"]
> = true
export const _1020: Eq<
  Old.components["schemas"]["Export_ExportControlTotalsDto"],
  New.components["schemas"]["Export_ExportControlTotalsDto"]
> = true
export const _1021: Eq<
  Old.components["schemas"]["Export_ExportMetadataDto"],
  New.components["schemas"]["Export_ExportMetadataDto"]
> = true
export const _1022: Eq<
  Old.components["schemas"]["Export_PositionReportRowDto"],
  New.components["schemas"]["Export_PositionReportRowDto"]
> = true
export const _1023: Eq<
  Old.components["schemas"]["Export_PositionReportResponseDto"],
  New.components["schemas"]["Export_PositionReportResponseDto"]
> = true
export const _1024: Eq<
  Old.components["schemas"]["Export_MovementReportRowDto"],
  New.components["schemas"]["Export_MovementReportRowDto"]
> = true
export const _1025: Eq<
  Old.components["schemas"]["Export_MovementReportResponseDto"],
  New.components["schemas"]["Export_MovementReportResponseDto"]
> = true
export const _1026: Eq<
  Old.components["schemas"]["Export_OmnibusAccountTypeTotalsDto"],
  New.components["schemas"]["Export_OmnibusAccountTypeTotalsDto"]
> = true
export const _1027: Eq<
  Old.components["schemas"]["Export_OmnibusControlTotalsDto"],
  New.components["schemas"]["Export_OmnibusControlTotalsDto"]
> = true
export const _1028: Eq<
  Old.components["schemas"]["Export_OmnibusExportMetadataDto"],
  New.components["schemas"]["Export_OmnibusExportMetadataDto"]
> = true
export const _1029: Eq<
  Old.components["schemas"]["Export_OmnibusPositionReportRowDto"],
  New.components["schemas"]["Export_OmnibusPositionReportRowDto"]
> = true
export const _1030: Eq<
  Old.components["schemas"]["Export_OmnibusPositionReportResponseDto"],
  New.components["schemas"]["Export_OmnibusPositionReportResponseDto"]
> = true
export const _1031: Eq<
  Old.components["schemas"]["Export_OmnibusPositionExportDto"],
  New.components["schemas"]["Export_OmnibusPositionExportDto"]
> = true
export const _1032: Eq<
  Old.components["schemas"]["Core_AntiRewindMode"],
  New.components["schemas"]["Core_AntiRewindMode"]
> = true
export const _1033: Eq<
  Old.components["schemas"]["Core_AntiRewindModeValue"],
  New.components["schemas"]["Core_AntiRewindModeValue"]
> = true
export const _1034: Eq<
  Old.components["schemas"]["Core_AuthorizationReference"],
  New.components["schemas"]["Core_AuthorizationReference"]
> = true
export const _1035: Eq<
  Old.components["schemas"]["Core_CantonOperation"],
  New.components["schemas"]["Core_CantonOperation"]
> = true
export const _1036: Eq<
  Old.components["schemas"]["Core_CantonOperation_Accept"],
  New.components["schemas"]["Core_CantonOperation_Accept"]
> = true
export const _1037: Eq<
  Old.components["schemas"]["Core_CantonOperation_CreateNativeTransferPreapproval"],
  New.components["schemas"]["Core_CantonOperation_CreateNativeTransferPreapproval"]
> = true
export const _1038: Eq<
  Old.components["schemas"]["Core_CantonOperation_CreateParty"],
  New.components["schemas"]["Core_CantonOperation_CreateParty"]
> = true
export const _1039: Eq<
  Old.components["schemas"]["Core_CantonOperation_CreateTokenTransferPreapproval"],
  New.components["schemas"]["Core_CantonOperation_CreateTokenTransferPreapproval"]
> = true
export const _1040: Eq<
  Old.components["schemas"]["Core_CantonOperation_NativeTransfer"],
  New.components["schemas"]["Core_CantonOperation_NativeTransfer"]
> = true
export const _1041: Eq<
  Old.components["schemas"]["Core_CantonOperation_Reject"],
  New.components["schemas"]["Core_CantonOperation_Reject"]
> = true
export const _1042: Eq<
  Old.components["schemas"]["Core_CantonOperation_TokenTransfer"],
  New.components["schemas"]["Core_CantonOperation_TokenTransfer"]
> = true
export const _1043: Eq<
  Old.components["schemas"]["Core_CantonOperation_Withdraw"],
  New.components["schemas"]["Core_CantonOperation_Withdraw"]
> = true
export const _1044: Eq<
  Old.components["schemas"]["Core_CantonTickerProperties"],
  New.components["schemas"]["Core_CantonTickerProperties"]
> = true
export const _1045: Eq<
  Old.components["schemas"]["Core_CantonTickerProperties_Instrument"],
  New.components["schemas"]["Core_CantonTickerProperties_Instrument"]
> = true
export const _1046: Eq<
  Old.components["schemas"]["Core_CantonTickerProperties_Native"],
  New.components["schemas"]["Core_CantonTickerProperties_Native"]
> = true
export const _1047: Eq<
  Old.components["schemas"]["Core_EthereumFeeStrategy_Sponsored"],
  New.components["schemas"]["Core_EthereumFeeStrategy_Sponsored"]
> = true
export const _1048: Eq<
  Old.components["schemas"]["Core_EthereumOperation"],
  New.components["schemas"]["Core_EthereumOperation"]
> = true
export const _1049: Eq<
  Old.components["schemas"]["Core_EthereumOperation_SetDelegation"],
  New.components["schemas"]["Core_EthereumOperation_SetDelegation"]
> = true
export const _1050: Eq<
  Old.components["schemas"]["Core_EthereumOperation_SubmitAuthorization"],
  New.components["schemas"]["Core_EthereumOperation_SubmitAuthorization"]
> = true
export const _1051: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Canton"],
  New.components["schemas"]["Core_LedgerParameters_Canton"]
> = true
export const _1052: Eq<
  Old.components["schemas"]["Core_LedgerParameters_Sui"],
  New.components["schemas"]["Core_LedgerParameters_Sui"]
> = true
export const _1053: Eq<
  Old.components["schemas"]["Core_OnLedgerData_Canton"],
  New.components["schemas"]["Core_OnLedgerData_Canton"]
> = true
export const _1054: Eq<
  Old.components["schemas"]["Core_ReadWriteSystemPropertyKeyValue_AntiRewindModeProperty"],
  New.components["schemas"]["Core_ReadWriteSystemPropertyKeyValue_AntiRewindModeProperty"]
> = true
export const _1055: Eq<
  Old.components["schemas"]["Core_SuiFeeStrategy"],
  New.components["schemas"]["Core_SuiFeeStrategy"]
> = true
export const _1056: Eq<
  Old.components["schemas"]["Core_SuiFeeStrategy_Priority"],
  New.components["schemas"]["Core_SuiFeeStrategy_Priority"]
> = true
export const _1057: Eq<
  Old.components["schemas"]["Core_SuiOperation"],
  New.components["schemas"]["Core_SuiOperation"]
> = true
export const _1058: Eq<
  Old.components["schemas"]["Core_SuiOperation_CoinTransfer"],
  New.components["schemas"]["Core_SuiOperation_CoinTransfer"]
> = true
export const _1059: Eq<
  Old.components["schemas"]["Core_SuiOperation_NativeTransfer"],
  New.components["schemas"]["Core_SuiOperation_NativeTransfer"]
> = true
export const _1060: Eq<
  Old.components["schemas"]["Core_SuiTickerProperties"],
  New.components["schemas"]["Core_SuiTickerProperties"]
> = true
export const _1061: Eq<
  Old.components["schemas"]["Core_SuiTickerProperties_Coin"],
  New.components["schemas"]["Core_SuiTickerProperties_Coin"]
> = true
export const _1062: Eq<
  Old.components["schemas"]["Core_SuiTickerProperties_Native"],
  New.components["schemas"]["Core_SuiTickerProperties_Native"]
> = true
export const _1063: Eq<
  Old.components["schemas"]["Core_SystemProperty_AntiRewindModeSystemProperty"],
  New.components["schemas"]["Core_SystemProperty_AntiRewindModeSystemProperty"]
> = true
export const _1064: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Canton"],
  New.components["schemas"]["Core_TickerLedgerDetails_Canton"]
> = true
export const _1065: Eq<
  Old.components["schemas"]["Core_TickerLedgerDetails_Sui"],
  New.components["schemas"]["Core_TickerLedgerDetails_Sui"]
> = true
export const _1066: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Canton"],
  New.components["schemas"]["Core_TransactionEstimate_Canton"]
> = true
export const _1067: Eq<
  Old.components["schemas"]["Core_TransactionEstimate_Sui"],
  New.components["schemas"]["Core_TransactionEstimate_Sui"]
> = true
export const _1068: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Canton"],
  New.components["schemas"]["Core_TransactionOrderParameters_Canton"]
> = true
export const _1069: Eq<
  Old.components["schemas"]["Core_TransactionOrderParameters_Sui"],
  New.components["schemas"]["Core_TransactionOrderParameters_Sui"]
> = true
export const _1070: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Canton"],
  New.components["schemas"]["Core_TransferMetadata_Canton"]
> = true
export const _1071: Eq<
  Old.components["schemas"]["Core_TransferMetadata_Sui"],
  New.components["schemas"]["Core_TransferMetadata_Sui"]
> = true
export const _1072: Eq<
  Old.components["schemas"]["Core_VaultAccountProviderInformation_Key_VaultReserved"],
  New.components["schemas"]["Core_VaultAccountProviderInformation_Key_VaultReserved"]
> = true
export const _1073: Eq<
  Old.components["schemas"]["Core_ApiBatchSignerSigningData"],
  New.components["schemas"]["Core_ApiBatchSignerSigningData"]
> = true
export const _1074: Eq<
  Old.components["schemas"]["Core_ApiBatchSigningData"],
  New.components["schemas"]["Core_ApiBatchSigningData"]
> = true
export const _1075: Eq<
  Old.components["schemas"]["Core_ApiInitiateParametersComputeRequest"],
  New.components["schemas"]["Core_ApiInitiateParametersComputeRequest"]
> = true
export const _1076: Eq<
  Old.components["schemas"]["Core_ApiInitiateParametersComputeRequest_CmptSend"],
  New.components["schemas"]["Core_ApiInitiateParametersComputeRequest_CmptSend"]
> = true
export const _1077: Eq<
  Old.components["schemas"]["Core_ApiInitiateParametersComputeResponse"],
  New.components["schemas"]["Core_ApiInitiateParametersComputeResponse"]
> = true
export const _1078: Eq<
  Old.components["schemas"]["Core_ApiInnerTransactionData"],
  New.components["schemas"]["Core_ApiInnerTransactionData"]
> = true
export const _1079: Eq<
  Old.components["schemas"]["Core_ApiParametersComputeCryptographicFields"],
  New.components["schemas"]["Core_ApiParametersComputeCryptographicFields"]
> = true
export const _1080: Eq<
  Old.components["schemas"]["Core_ApiParametersComputeCryptographicFields_Clawback"],
  New.components["schemas"]["Core_ApiParametersComputeCryptographicFields_Clawback"]
> = true
export const _1081: Eq<
  Old.components["schemas"]["Core_ApiParametersComputeCryptographicFields_Convert"],
  New.components["schemas"]["Core_ApiParametersComputeCryptographicFields_Convert"]
> = true
export const _1082: Eq<
  Old.components["schemas"]["Core_ApiParametersComputeCryptographicFields_ConvertBack"],
  New.components["schemas"]["Core_ApiParametersComputeCryptographicFields_ConvertBack"]
> = true
export const _1083: Eq<
  Old.components["schemas"]["Core_ApiParametersComputeCryptographicFields_Send"],
  New.components["schemas"]["Core_ApiParametersComputeCryptographicFields_Send"]
> = true
export const _1084: Eq<
  Old.components["schemas"]["Core_ApiParametersComputeStatusResponse"],
  New.components["schemas"]["Core_ApiParametersComputeStatusResponse"]
> = true
export const _1085: Eq<
  Old.components["schemas"]["Core_BatchEntry"],
  New.components["schemas"]["Core_BatchEntry"]
> = true
export const _1086: Eq<
  Old.components["schemas"]["Core_BatchEntry_ParticipantOperation"],
  New.components["schemas"]["Core_BatchEntry_ParticipantOperation"]
> = true
export const _1087: Eq<
  Old.components["schemas"]["Core_BatchEntry_SubmitterOperation"],
  New.components["schemas"]["Core_BatchEntry_SubmitterOperation"]
> = true
export const _1088: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation"],
  New.components["schemas"]["Core_BatchInnerOperation"]
> = true
export const _1089: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_AccountSet"],
  New.components["schemas"]["Core_BatchInnerOperation_AccountSet"]
> = true
export const _1090: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_Clawback"],
  New.components["schemas"]["Core_BatchInnerOperation_Clawback"]
> = true
export const _1091: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTConvert"],
  New.components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTConvert"]
> = true
export const _1092: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTConvertBack"],
  New.components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTConvertBack"]
> = true
export const _1093: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTMergeInbox"],
  New.components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTMergeInbox"]
> = true
export const _1094: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTSend"],
  New.components["schemas"]["Core_BatchInnerOperation_ConfidentialMPTSend"]
> = true
export const _1095: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_DepositPreauth"],
  New.components["schemas"]["Core_BatchInnerOperation_DepositPreauth"]
> = true
export const _1096: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_EscrowFinish"],
  New.components["schemas"]["Core_BatchInnerOperation_EscrowFinish"]
> = true
export const _1097: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_MPTokenAuthorize"],
  New.components["schemas"]["Core_BatchInnerOperation_MPTokenAuthorize"]
> = true
export const _1098: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_MPTokenIssuanceCreate"],
  New.components["schemas"]["Core_BatchInnerOperation_MPTokenIssuanceCreate"]
> = true
export const _1099: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_MPTokenIssuanceDestroy"],
  New.components["schemas"]["Core_BatchInnerOperation_MPTokenIssuanceDestroy"]
> = true
export const _1100: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_MPTokenIssuanceSet"],
  New.components["schemas"]["Core_BatchInnerOperation_MPTokenIssuanceSet"]
> = true
export const _1101: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_OfferCreate"],
  New.components["schemas"]["Core_BatchInnerOperation_OfferCreate"]
> = true
export const _1102: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_Payment"],
  New.components["schemas"]["Core_BatchInnerOperation_Payment"]
> = true
export const _1103: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_TicketCreate"],
  New.components["schemas"]["Core_BatchInnerOperation_TicketCreate"]
> = true
export const _1104: Eq<
  Old.components["schemas"]["Core_BatchInnerOperation_TrustSet"],
  New.components["schemas"]["Core_BatchInnerOperation_TrustSet"]
> = true
export const _1105: Eq<
  Old.components["schemas"]["Core_BatchSigner"],
  New.components["schemas"]["Core_BatchSigner"]
> = true
export const _1106: Eq<
  Old.components["schemas"]["Core_CmptCryptographicFields"],
  New.components["schemas"]["Core_CmptCryptographicFields"]
> = true
export const _1107: Eq<
  Old.components["schemas"]["Core_CmptCryptographicFields_Clawback"],
  New.components["schemas"]["Core_CmptCryptographicFields_Clawback"]
> = true
export const _1108: Eq<
  Old.components["schemas"]["Core_CmptCryptographicFields_Convert"],
  New.components["schemas"]["Core_CmptCryptographicFields_Convert"]
> = true
export const _1109: Eq<
  Old.components["schemas"]["Core_CmptCryptographicFields_ConvertBack"],
  New.components["schemas"]["Core_CmptCryptographicFields_ConvertBack"]
> = true
export const _1110: Eq<
  Old.components["schemas"]["Core_CmptCryptographicFields_Send"],
  New.components["schemas"]["Core_CmptCryptographicFields_Send"]
> = true
export const _1111: Eq<
  Old.components["schemas"]["Core_ElGamalKeyProvisioned"],
  New.components["schemas"]["Core_ElGamalKeyProvisioned"]
> = true
export const _1112: Eq<
  Old.components["schemas"]["Core_ElGamalKeyProvisioningFailed"],
  New.components["schemas"]["Core_ElGamalKeyProvisioningFailed"]
> = true
export const _1113: Eq<
  Old.components["schemas"]["Core_IntentDryRunResponse_v0_ProvisionElGamalKeyPair"],
  New.components["schemas"]["Core_IntentDryRunResponse_v0_ProvisionElGamalKeyPair"]
> = true
export const _1114: Eq<
  Old.components["schemas"]["Core_KeyPurpose"],
  New.components["schemas"]["Core_KeyPurpose"]
> = true
export const _1115: Eq<
  Old.components["schemas"]["Core_Participant"],
  New.components["schemas"]["Core_Participant"]
> = true
export const _1116: Eq<
  Old.components["schemas"]["Core_ParticipantSequencing"],
  New.components["schemas"]["Core_ParticipantSequencing"]
> = true
export const _1117: Eq<
  Old.components["schemas"]["Core_ParticipantSequencing_AccountSequence"],
  New.components["schemas"]["Core_ParticipantSequencing_AccountSequence"]
> = true
export const _1118: Eq<
  Old.components["schemas"]["Core_ParticipantSequencing_Ticket"],
  New.components["schemas"]["Core_ParticipantSequencing_Ticket"]
> = true
export const _1119: Eq<
  Old.components["schemas"]["Core_Participant_Account"],
  New.components["schemas"]["Core_Participant_Account"]
> = true
export const _1120: Eq<
  Old.components["schemas"]["Core_Participant_Address"],
  New.components["schemas"]["Core_Participant_Address"]
> = true
export const _1121: Eq<
  Old.components["schemas"]["Core_Participant_Endpoint"],
  New.components["schemas"]["Core_Participant_Endpoint"]
> = true
export const _1122: Eq<
  Old.components["schemas"]["Core_PurposeKey"],
  New.components["schemas"]["Core_PurposeKey"]
> = true
export const _1123: Eq<
  Old.components["schemas"]["Core_ResolvedSequencing"],
  New.components["schemas"]["Core_ResolvedSequencing"]
> = true
export const _1124: Eq<
  Old.components["schemas"]["Core_ResolvedSequencing_AccountSequence"],
  New.components["schemas"]["Core_ResolvedSequencing_AccountSequence"]
> = true
export const _1125: Eq<
  Old.components["schemas"]["Core_ResolvedSequencing_Ticket"],
  New.components["schemas"]["Core_ResolvedSequencing_Ticket"]
> = true
export const _1126: Eq<
  Old.components["schemas"]["Core_Sequencing"],
  New.components["schemas"]["Core_Sequencing"]
> = true
export const _1127: Eq<
  Old.components["schemas"]["Core_Sequencing_AccountSequence"],
  New.components["schemas"]["Core_Sequencing_AccountSequence"]
> = true
export const _1128: Eq<
  Old.components["schemas"]["Core_Sequencing_PlatformManaged"],
  New.components["schemas"]["Core_Sequencing_PlatformManaged"]
> = true
export const _1129: Eq<
  Old.components["schemas"]["Core_Sequencing_Ticket"],
  New.components["schemas"]["Core_Sequencing_Ticket"]
> = true
export const _1130: Eq<
  Old.components["schemas"]["Core_Sponsorship"],
  New.components["schemas"]["Core_Sponsorship"]
> = true
export const _1131: Eq<
  Old.components["schemas"]["Core_SponsorshipMovement"],
  New.components["schemas"]["Core_SponsorshipMovement"]
> = true
export const _1132: Eq<
  Old.components["schemas"]["Core_SponsorshipMovementsCollection"],
  New.components["schemas"]["Core_SponsorshipMovementsCollection"]
> = true
export const _1133: Eq<
  Old.components["schemas"]["Core_SponsorshipRole"],
  New.components["schemas"]["Core_SponsorshipRole"]
> = true
export const _1134: Eq<
  Old.components["schemas"]["Core_SponsorshipsCollection"],
  New.components["schemas"]["Core_SponsorshipsCollection"]
> = true
export const _1135: Eq<
  Old.components["schemas"]["Core_XrplOperation_Batch"],
  New.components["schemas"]["Core_XrplOperation_Batch"]
> = true
export const _1136: Eq<
  Old.components["schemas"]["Core_XrplOperation_ConfidentialMPTClawback"],
  New.components["schemas"]["Core_XrplOperation_ConfidentialMPTClawback"]
> = true
export const _1137: Eq<
  Old.components["schemas"]["Core_XrplOperation_ConfidentialMPTConvert"],
  New.components["schemas"]["Core_XrplOperation_ConfidentialMPTConvert"]
> = true
export const _1138: Eq<
  Old.components["schemas"]["Core_XrplOperation_ConfidentialMPTConvertBack"],
  New.components["schemas"]["Core_XrplOperation_ConfidentialMPTConvertBack"]
> = true
export const _1139: Eq<
  Old.components["schemas"]["Core_XrplOperation_ConfidentialMPTMergeInbox"],
  New.components["schemas"]["Core_XrplOperation_ConfidentialMPTMergeInbox"]
> = true
export const _1140: Eq<
  Old.components["schemas"]["Core_XrplOperation_ConfidentialMPTSend"],
  New.components["schemas"]["Core_XrplOperation_ConfidentialMPTSend"]
> = true
export const _1141: Eq<
  Old.components["schemas"]["Core_XrplOperation_SponsorshipSetAsSponsee"],
  New.components["schemas"]["Core_XrplOperation_SponsorshipSetAsSponsee"]
> = true
export const _1142: Eq<
  Old.components["schemas"]["Core_XrplOperation_SponsorshipSetAsSponsor"],
  New.components["schemas"]["Core_XrplOperation_SponsorshipSetAsSponsor"]
> = true
export const _1143: Eq<
  Old.components["schemas"]["Core_XrplOperation_TicketCreate"],
  New.components["schemas"]["Core_XrplOperation_TicketCreate"]
> = true
export const _1144: Eq<
  Old.components["schemas"]["Core_XrplSponsorshipParams"],
  New.components["schemas"]["Core_XrplSponsorshipParams"]
> = true
export const _1145: Eq<
  Old.components["schemas"]["Core_XrplTickerProperties_ConfidentialMultiPurposeToken"],
  New.components["schemas"]["Core_XrplTickerProperties_ConfidentialMultiPurposeToken"]
> = true
export const _1146: Eq<
  Old.components["schemas"]["Core_Xrpl_BatchExecutionMode"],
  New.components["schemas"]["Core_Xrpl_BatchExecutionMode"]
> = true
export const _1147: Eq<
  Old.components["schemas"]["Core_Xrpl_CmptCryptographicFields"],
  New.components["schemas"]["Core_Xrpl_CmptCryptographicFields"]
> = true
export const _1148: Eq<
  Old.components["schemas"]["Core_Xrpl_MPTokenIssuanceMutableFlag"],
  New.components["schemas"]["Core_Xrpl_MPTokenIssuanceMutableFlag"]
> = true
export const _1149: Eq<
  Old.components["schemas"]["Core_Xrpl_PaymentFlag"],
  New.components["schemas"]["Core_Xrpl_PaymentFlag"]
> = true
export const _1150: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedAssetQuantity"],
  New.components["schemas"]["Core_Xrpl_ResolvedAssetQuantity"]
> = true
export const _1151: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation"]
> = true
export const _1152: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_AccountSet"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_AccountSet"]
> = true
export const _1153: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_Clawback"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_Clawback"]
> = true
export const _1154: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_ConfidentialMPTSend"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_ConfidentialMPTSend"]
> = true
export const _1155: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_DepositPreauth"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_DepositPreauth"]
> = true
export const _1156: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_EscrowFinish"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_EscrowFinish"]
> = true
export const _1157: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_MPTokenAuthorize"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_MPTokenAuthorize"]
> = true
export const _1158: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceCreate"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceCreate"]
> = true
export const _1159: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceDestroy"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceDestroy"]
> = true
export const _1160: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceSet"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceSet"]
> = true
export const _1161: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_OfferCreate"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_OfferCreate"]
> = true
export const _1162: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_Payment"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_Payment"]
> = true
export const _1163: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_TicketCreate"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_TicketCreate"]
> = true
export const _1164: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_TrustSet"],
  New.components["schemas"]["Core_Xrpl_ResolvedBatchInnerOperation_TrustSet"]
> = true
export const _1165: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedClawbackCurrency"],
  New.components["schemas"]["Core_Xrpl_ResolvedClawbackCurrency"]
> = true
export const _1166: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedClawbackCurrency_Fungible"],
  New.components["schemas"]["Core_Xrpl_ResolvedClawbackCurrency_Fungible"]
> = true
export const _1167: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedClawbackCurrency_MultiPurposeToken"],
  New.components["schemas"]["Core_Xrpl_ResolvedClawbackCurrency_MultiPurposeToken"]
> = true
export const _1168: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedIouCurrency"],
  New.components["schemas"]["Core_Xrpl_ResolvedIouCurrency"]
> = true
export const _1169: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedLimitAmount"],
  New.components["schemas"]["Core_Xrpl_ResolvedLimitAmount"]
> = true
export const _1170: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedMPTokenIdentifier"],
  New.components["schemas"]["Core_Xrpl_ResolvedMPTokenIdentifier"]
> = true
export const _1171: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedPaymentCurrency"],
  New.components["schemas"]["Core_Xrpl_ResolvedPaymentCurrency"]
> = true
export const _1172: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedPaymentCurrency_Fungible"],
  New.components["schemas"]["Core_Xrpl_ResolvedPaymentCurrency_Fungible"]
> = true
export const _1173: Eq<
  Old.components["schemas"]["Core_Xrpl_ResolvedPaymentCurrency_MultiPurposeToken"],
  New.components["schemas"]["Core_Xrpl_ResolvedPaymentCurrency_MultiPurposeToken"]
> = true
export const _1174: Eq<
  Old.components["schemas"]["Core_Xrpl_SponsorFlag"],
  New.components["schemas"]["Core_Xrpl_SponsorFlag"]
> = true
export const _1175: Eq<
  Old.components["schemas"]["Core_Xrpl_SponsorshipMovement"],
  New.components["schemas"]["Core_Xrpl_SponsorshipMovement"]
> = true
export const _1176: Eq<
  Old.components["schemas"]["Core_Xrpl_SponsorshipSetFlag"],
  New.components["schemas"]["Core_Xrpl_SponsorshipSetFlag"]
> = true
export const _1177: Eq<
  Old.components["schemas"]["Core_v0_ProvisionElGamalKeyPair"],
  New.components["schemas"]["Core_v0_ProvisionElGamalKeyPair"]
> = true
export const _1178: Eq<
  Present<Old.paths["/v1/backups/{backupId}"]>,
  Present<New.paths["/v1/backups/{backupId}"]>
> = true
export const _1179: Eq<
  keyof Old.operations["getBackup"]["responses"],
  keyof New.operations["getBackup"]["responses"]
> = true
export const _1180: Eq<
  Old.operations["getBackup"]["parameters"]["path"],
  New.operations["getBackup"]["parameters"]["path"]
> = true
export const _1181: Eq<
  Old.operations["getBackup"]["responses"][200]["content"]["application/json"],
  New.operations["getBackup"]["responses"][200]["content"]["application/json"]
> = true
export const _1182: Eq<
  Old.operations["getBackup"]["responses"][401]["content"]["application/json"],
  New.operations["getBackup"]["responses"][401]["content"]["application/json"]
> = true
export const _1183: Eq<
  Old.operations["getBackup"]["responses"][404]["content"]["application/json"],
  New.operations["getBackup"]["responses"][404]["content"]["application/json"]
> = true
export const _1184: Eq<Present<Old.paths["/v1/backups"]>, Present<New.paths["/v1/backups"]>> = true
export const _1185: Eq<
  keyof Old.operations["getBackups"]["responses"],
  keyof New.operations["getBackups"]["responses"]
> = true
export const _1186: Eq<
  Old.operations["getBackups"]["parameters"]["query"],
  New.operations["getBackups"]["parameters"]["query"]
> = true
export const _1187: Eq<
  Old.operations["getBackups"]["responses"][200]["content"]["application/json"],
  New.operations["getBackups"]["responses"][200]["content"]["application/json"]
> = true
export const _1188: Eq<
  Old.operations["getBackups"]["responses"][401]["content"]["application/json"],
  New.operations["getBackups"]["responses"][401]["content"]["application/json"]
> = true
export const _1189: Eq<
  Old.operations["getBackups"]["responses"][404]["content"]["application/json"],
  New.operations["getBackups"]["responses"][404]["content"]["application/json"]
> = true
export const _1190: Eq<
  Present<Old.paths["/v1/backups/{backupId}/trusted-entity"]>,
  Present<New.paths["/v1/backups/{backupId}/trusted-entity"]>
> = true
export const _1191: Eq<
  keyof Old.operations["getBackupTrustedEntity"]["responses"],
  keyof New.operations["getBackupTrustedEntity"]["responses"]
> = true
export const _1192: Eq<
  Old.operations["getBackupTrustedEntity"]["parameters"]["path"],
  New.operations["getBackupTrustedEntity"]["parameters"]["path"]
> = true
export const _1193: Eq<
  Old.operations["getBackupTrustedEntity"]["responses"][200]["content"]["application/json"],
  New.operations["getBackupTrustedEntity"]["responses"][200]["content"]["application/json"]
> = true
export const _1194: Eq<
  Old.operations["getBackupTrustedEntity"]["responses"][401]["content"]["application/json"],
  New.operations["getBackupTrustedEntity"]["responses"][401]["content"]["application/json"]
> = true
export const _1195: Eq<
  Old.operations["getBackupTrustedEntity"]["responses"][404]["content"]["application/json"],
  New.operations["getBackupTrustedEntity"]["responses"][404]["content"]["application/json"]
> = true
export const _1196: Eq<
  Present<Old.paths["/v1/domains/{domainId}"]>,
  Present<New.paths["/v1/domains/{domainId}"]>
> = true
export const _1197: Eq<
  keyof Old.operations["getDomain"]["responses"],
  keyof New.operations["getDomain"]["responses"]
> = true
export const _1198: Eq<
  Old.operations["getDomain"]["parameters"]["path"],
  New.operations["getDomain"]["parameters"]["path"]
> = true
export const _1199: Eq<
  Old.operations["getDomain"]["responses"][200]["content"]["application/json"],
  New.operations["getDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1200: Eq<
  Old.operations["getDomain"]["responses"][401]["content"]["application/json"],
  New.operations["getDomain"]["responses"][401]["content"]["application/json"]
> = true
export const _1201: Eq<
  Old.operations["getDomain"]["responses"][404]["content"]["application/json"],
  New.operations["getDomain"]["responses"][404]["content"]["application/json"]
> = true
export const _1202: Eq<Present<Old.paths["/v1/domains"]>, Present<New.paths["/v1/domains"]>> = true
export const _1203: Eq<
  keyof Old.operations["getDomains"]["responses"],
  keyof New.operations["getDomains"]["responses"]
> = true
export const _1204: Eq<
  Old.operations["getDomains"]["parameters"]["query"],
  New.operations["getDomains"]["parameters"]["query"]
> = true
export const _1205: Eq<
  Old.operations["getDomains"]["responses"][200]["content"]["application/json"],
  New.operations["getDomains"]["responses"][200]["content"]["application/json"]
> = true
export const _1206: Eq<
  Old.operations["getDomains"]["responses"][401]["content"]["application/json"],
  New.operations["getDomains"]["responses"][401]["content"]["application/json"]
> = true
export const _1207: Eq<Present<Old.paths["/v1/vaults"]>, Present<New.paths["/v1/vaults"]>> = true
export const _1208: Eq<
  keyof Old.operations["getVaults"]["responses"],
  keyof New.operations["getVaults"]["responses"]
> = true
export const _1209: Eq<
  Old.operations["getVaults"]["parameters"]["query"],
  New.operations["getVaults"]["parameters"]["query"]
> = true
export const _1210: Eq<
  Old.operations["getVaults"]["responses"][200]["content"]["application/json"],
  New.operations["getVaults"]["responses"][200]["content"]["application/json"]
> = true
export const _1211: Eq<
  Old.operations["getVaults"]["responses"][401]["content"]["application/json"],
  New.operations["getVaults"]["responses"][401]["content"]["application/json"]
> = true
export const _1212: Eq<
  Present<Old.paths["/v1/vaults/{vaultId}"]>,
  Present<New.paths["/v1/vaults/{vaultId}"]>
> = true
export const _1213: Eq<
  keyof Old.operations["getVault"]["responses"],
  keyof New.operations["getVault"]["responses"]
> = true
export const _1214: Eq<
  Old.operations["getVault"]["parameters"]["path"],
  New.operations["getVault"]["parameters"]["path"]
> = true
export const _1215: Eq<
  Old.operations["getVault"]["responses"][200]["content"]["application/json"],
  New.operations["getVault"]["responses"][200]["content"]["application/json"]
> = true
export const _1216: Eq<
  Old.operations["getVault"]["responses"][401]["content"]["application/json"],
  New.operations["getVault"]["responses"][401]["content"]["application/json"]
> = true
export const _1217: Eq<
  Old.operations["getVault"]["responses"][404]["content"]["application/json"],
  New.operations["getVault"]["responses"][404]["content"]["application/json"]
> = true
export const _1218: Eq<
  Present<Old.paths["/v1/domains/{domainId}/policies"]>,
  Present<New.paths["/v1/domains/{domainId}/policies"]>
> = true
export const _1219: Eq<
  keyof Old.operations["getPolicies"]["responses"],
  keyof New.operations["getPolicies"]["responses"]
> = true
export const _1220: Eq<
  Old.operations["getPolicies"]["parameters"]["path"],
  New.operations["getPolicies"]["parameters"]["path"]
> = true
export const _1221: Eq<
  Old.operations["getPolicies"]["parameters"]["query"],
  New.operations["getPolicies"]["parameters"]["query"]
> = true
export const _1222: Eq<
  Old.operations["getPolicies"]["responses"][200]["content"]["application/json"],
  New.operations["getPolicies"]["responses"][200]["content"]["application/json"]
> = true
export const _1223: Eq<
  Old.operations["getPolicies"]["responses"][401]["content"]["application/json"],
  New.operations["getPolicies"]["responses"][401]["content"]["application/json"]
> = true
export const _1224: Eq<
  Old.operations["getPolicies"]["responses"][404]["content"]["application/json"],
  New.operations["getPolicies"]["responses"][404]["content"]["application/json"]
> = true
export const _1225: Eq<
  Present<Old.paths["/v1/domains/{domainId}/policies/{policyId}"]>,
  Present<New.paths["/v1/domains/{domainId}/policies/{policyId}"]>
> = true
export const _1226: Eq<
  keyof Old.operations["getPolicy"]["responses"],
  keyof New.operations["getPolicy"]["responses"]
> = true
export const _1227: Eq<
  Old.operations["getPolicy"]["parameters"]["path"],
  New.operations["getPolicy"]["parameters"]["path"]
> = true
export const _1228: Eq<
  Old.operations["getPolicy"]["responses"][200]["content"]["application/json"],
  New.operations["getPolicy"]["responses"][200]["content"]["application/json"]
> = true
export const _1229: Eq<
  Old.operations["getPolicy"]["responses"][401]["content"]["application/json"],
  New.operations["getPolicy"]["responses"][401]["content"]["application/json"]
> = true
export const _1230: Eq<
  Old.operations["getPolicy"]["responses"][404]["content"]["application/json"],
  New.operations["getPolicy"]["responses"][404]["content"]["application/json"]
> = true
export const _1231: Eq<
  Present<Old.paths["/v1/domains/{domainId}/users"]>,
  Present<New.paths["/v1/domains/{domainId}/users"]>
> = true
export const _1232: Eq<
  keyof Old.operations["getUsers"]["responses"],
  keyof New.operations["getUsers"]["responses"]
> = true
export const _1233: Eq<
  Old.operations["getUsers"]["parameters"]["path"],
  New.operations["getUsers"]["parameters"]["path"]
> = true
export const _1234: Eq<
  Old.operations["getUsers"]["parameters"]["query"],
  New.operations["getUsers"]["parameters"]["query"]
> = true
export const _1235: Eq<
  Old.operations["getUsers"]["responses"][200]["content"]["application/json"],
  New.operations["getUsers"]["responses"][200]["content"]["application/json"]
> = true
export const _1236: Eq<
  Old.operations["getUsers"]["responses"][401]["content"]["application/json"],
  New.operations["getUsers"]["responses"][401]["content"]["application/json"]
> = true
export const _1237: Eq<
  Old.operations["getUsers"]["responses"][404]["content"]["application/json"],
  New.operations["getUsers"]["responses"][404]["content"]["application/json"]
> = true
export const _1238: Eq<
  Present<Old.paths["/v1/domains/{domainId}/users/roles"]>,
  Present<New.paths["/v1/domains/{domainId}/users/roles"]>
> = true
export const _1239: Eq<
  keyof Old.operations["getKnownUserRoles"]["responses"],
  keyof New.operations["getKnownUserRoles"]["responses"]
> = true
export const _1240: Eq<
  Old.operations["getKnownUserRoles"]["parameters"]["path"],
  New.operations["getKnownUserRoles"]["parameters"]["path"]
> = true
export const _1241: Eq<
  Old.operations["getKnownUserRoles"]["responses"][200]["content"]["application/json"],
  New.operations["getKnownUserRoles"]["responses"][200]["content"]["application/json"]
> = true
export const _1242: Eq<
  Old.operations["getKnownUserRoles"]["responses"][401]["content"]["application/json"],
  New.operations["getKnownUserRoles"]["responses"][401]["content"]["application/json"]
> = true
export const _1243: Eq<
  Old.operations["getKnownUserRoles"]["responses"][404]["content"]["application/json"],
  New.operations["getKnownUserRoles"]["responses"][404]["content"]["application/json"]
> = true
export const _1244: Eq<
  Present<Old.paths["/v1/domains/{domainId}/users/{userId}"]>,
  Present<New.paths["/v1/domains/{domainId}/users/{userId}"]>
> = true
export const _1245: Eq<
  keyof Old.operations["getUser"]["responses"],
  keyof New.operations["getUser"]["responses"]
> = true
export const _1246: Eq<
  Old.operations["getUser"]["parameters"]["path"],
  New.operations["getUser"]["parameters"]["path"]
> = true
export const _1247: Eq<
  Old.operations["getUser"]["responses"][200]["content"]["application/json"],
  New.operations["getUser"]["responses"][200]["content"]["application/json"]
> = true
export const _1248: Eq<
  Old.operations["getUser"]["responses"][401]["content"]["application/json"],
  New.operations["getUser"]["responses"][401]["content"]["application/json"]
> = true
export const _1249: Eq<
  Old.operations["getUser"]["responses"][404]["content"]["application/json"],
  New.operations["getUser"]["responses"][404]["content"]["application/json"]
> = true
export const _1250: Eq<Present<Old.paths["/v1/me"]>, Present<New.paths["/v1/me"]>> = true
export const _1251: Eq<
  keyof Old.operations["getMe"]["responses"],
  keyof New.operations["getMe"]["responses"]
> = true
export const _1252: Eq<
  Old.operations["getMe"]["responses"][200]["content"]["application/json"],
  New.operations["getMe"]["responses"][200]["content"]["application/json"]
> = true
export const _1253: Eq<
  Old.operations["getMe"]["responses"][401]["content"]["application/json"],
  New.operations["getMe"]["responses"][401]["content"]["application/json"]
> = true
export const _1254: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts"]>
> = true
export const _1255: Eq<
  keyof Old.operations["getAccounts"]["responses"],
  keyof New.operations["getAccounts"]["responses"]
> = true
export const _1256: Eq<
  Old.operations["getAccounts"]["parameters"]["path"],
  New.operations["getAccounts"]["parameters"]["path"]
> = true
export const _1257: Eq<
  Old.operations["getAccounts"]["parameters"]["query"],
  New.operations["getAccounts"]["parameters"]["query"]
> = true
export const _1258: Eq<
  Old.operations["getAccounts"]["responses"][200]["content"]["application/json"],
  New.operations["getAccounts"]["responses"][200]["content"]["application/json"]
> = true
export const _1259: Eq<
  Old.operations["getAccounts"]["responses"][400]["content"]["application/json"],
  New.operations["getAccounts"]["responses"][400]["content"]["application/json"]
> = true
export const _1260: Eq<
  Old.operations["getAccounts"]["responses"][401]["content"]["application/json"],
  New.operations["getAccounts"]["responses"][401]["content"]["application/json"]
> = true
export const _1261: Eq<
  Old.operations["getAccounts"]["responses"][404]["content"]["application/json"],
  New.operations["getAccounts"]["responses"][404]["content"]["application/json"]
> = true
export const _1262: Eq<
  Present<Old.paths["/v1/addresses"]>,
  Present<New.paths["/v1/addresses"]>
> = true
export const _1263: Eq<
  keyof Old.operations["getAllDomainsAddresses"]["responses"],
  keyof New.operations["getAllDomainsAddresses"]["responses"]
> = true
export const _1264: Eq<
  Old.operations["getAllDomainsAddresses"]["parameters"]["query"],
  New.operations["getAllDomainsAddresses"]["parameters"]["query"]
> = true
export const _1265: Eq<
  Old.operations["getAllDomainsAddresses"]["responses"][200]["content"]["application/json"],
  New.operations["getAllDomainsAddresses"]["responses"][200]["content"]["application/json"]
> = true
export const _1266: Eq<
  Old.operations["getAllDomainsAddresses"]["responses"][401]["content"]["application/json"],
  New.operations["getAllDomainsAddresses"]["responses"][401]["content"]["application/json"]
> = true
export const _1267: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance-configurations"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance-configurations"]>
> = true
export const _1268: Eq<
  keyof Old.operations["listComplianceConfigurations"]["responses"],
  keyof New.operations["listComplianceConfigurations"]["responses"]
> = true
export const _1269: Eq<
  Old.operations["listComplianceConfigurations"]["parameters"]["path"],
  New.operations["listComplianceConfigurations"]["parameters"]["path"]
> = true
export const _1270: Eq<
  Old.operations["listComplianceConfigurations"]["parameters"]["query"],
  New.operations["listComplianceConfigurations"]["parameters"]["query"]
> = true
export const _1271: Eq<
  Old.operations["listComplianceConfigurations"]["responses"][200]["content"]["application/json"],
  New.operations["listComplianceConfigurations"]["responses"][200]["content"]["application/json"]
> = true
export const _1272: Eq<
  Old.operations["listComplianceConfigurations"]["responses"][400]["content"]["application/json"],
  New.operations["listComplianceConfigurations"]["responses"][400]["content"]["application/json"]
> = true
export const _1273: Eq<
  Old.operations["listComplianceConfigurations"]["responses"][401]["content"]["application/json"],
  New.operations["listComplianceConfigurations"]["responses"][401]["content"]["application/json"]
> = true
export const _1274: Eq<
  Old.operations["listComplianceConfigurations"]["responses"][404]["content"]["application/json"],
  New.operations["listComplianceConfigurations"]["responses"][404]["content"]["application/json"]
> = true
export const _1275: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/compliance-configuration"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/compliance-configuration"]>
> = true
export const _1276: Eq<
  keyof Old.operations["getComplianceConfiguration"]["responses"],
  keyof New.operations["getComplianceConfiguration"]["responses"]
> = true
export const _1277: Eq<
  Old.operations["getComplianceConfiguration"]["parameters"]["path"],
  New.operations["getComplianceConfiguration"]["parameters"]["path"]
> = true
export const _1278: Eq<
  Old.operations["getComplianceConfiguration"]["responses"][200]["content"]["application/json"],
  New.operations["getComplianceConfiguration"]["responses"][200]["content"]["application/json"]
> = true
export const _1279: Eq<
  Old.operations["getComplianceConfiguration"]["responses"][400]["content"]["application/json"],
  New.operations["getComplianceConfiguration"]["responses"][400]["content"]["application/json"]
> = true
export const _1280: Eq<
  Old.operations["getComplianceConfiguration"]["responses"][401]["content"]["application/json"],
  New.operations["getComplianceConfiguration"]["responses"][401]["content"]["application/json"]
> = true
export const _1281: Eq<
  Old.operations["getComplianceConfiguration"]["responses"][404]["content"]["application/json"],
  New.operations["getComplianceConfiguration"]["responses"][404]["content"]["application/json"]
> = true
export const _1282: Eq<
  keyof Old.operations["upsertComplianceConfiguration"]["responses"],
  keyof New.operations["upsertComplianceConfiguration"]["responses"]
> = true
export const _1283: Eq<
  Old.operations["upsertComplianceConfiguration"]["parameters"]["path"],
  New.operations["upsertComplianceConfiguration"]["parameters"]["path"]
> = true
export const _1284: Eq<
  NonNullable<
    Old.operations["upsertComplianceConfiguration"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["upsertComplianceConfiguration"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1285: Eq<
  Old.operations["upsertComplianceConfiguration"]["responses"][200]["content"]["application/json"],
  New.operations["upsertComplianceConfiguration"]["responses"][200]["content"]["application/json"]
> = true
export const _1286: Eq<
  Old.operations["upsertComplianceConfiguration"]["responses"][400]["content"]["application/json"],
  New.operations["upsertComplianceConfiguration"]["responses"][400]["content"]["application/json"]
> = true
export const _1287: Eq<
  Old.operations["upsertComplianceConfiguration"]["responses"][401]["content"]["application/json"],
  New.operations["upsertComplianceConfiguration"]["responses"][401]["content"]["application/json"]
> = true
export const _1288: Eq<
  Old.operations["upsertComplianceConfiguration"]["responses"][404]["content"]["application/json"],
  New.operations["upsertComplianceConfiguration"]["responses"][404]["content"]["application/json"]
> = true
export const _1289: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}"]>
> = true
export const _1290: Eq<
  keyof Old.operations["getAccount"]["responses"],
  keyof New.operations["getAccount"]["responses"]
> = true
export const _1291: Eq<
  Old.operations["getAccount"]["parameters"]["path"],
  New.operations["getAccount"]["parameters"]["path"]
> = true
export const _1292: Eq<
  Old.operations["getAccount"]["responses"][200]["content"]["application/json"],
  New.operations["getAccount"]["responses"][200]["content"]["application/json"]
> = true
export const _1293: Eq<
  Old.operations["getAccount"]["responses"][400]["content"]["application/json"],
  New.operations["getAccount"]["responses"][400]["content"]["application/json"]
> = true
export const _1294: Eq<
  Old.operations["getAccount"]["responses"][401]["content"]["application/json"],
  New.operations["getAccount"]["responses"][401]["content"]["application/json"]
> = true
export const _1295: Eq<
  Old.operations["getAccount"]["responses"][404]["content"]["application/json"],
  New.operations["getAccount"]["responses"][404]["content"]["application/json"]
> = true
export const _1296: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/addresses"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/addresses"]>
> = true
export const _1297: Eq<
  keyof Old.operations["getAddresses"]["responses"],
  keyof New.operations["getAddresses"]["responses"]
> = true
export const _1298: Eq<
  Old.operations["getAddresses"]["parameters"]["path"],
  New.operations["getAddresses"]["parameters"]["path"]
> = true
export const _1299: Eq<
  Old.operations["getAddresses"]["parameters"]["query"],
  New.operations["getAddresses"]["parameters"]["query"]
> = true
export const _1300: Eq<
  Old.operations["getAddresses"]["responses"][200]["content"]["application/json"],
  New.operations["getAddresses"]["responses"][200]["content"]["application/json"]
> = true
export const _1301: Eq<
  Old.operations["getAddresses"]["responses"][400]["content"]["application/json"],
  New.operations["getAddresses"]["responses"][400]["content"]["application/json"]
> = true
export const _1302: Eq<
  Old.operations["getAddresses"]["responses"][401]["content"]["application/json"],
  New.operations["getAddresses"]["responses"][401]["content"]["application/json"]
> = true
export const _1303: Eq<
  Old.operations["getAddresses"]["responses"][404]["content"]["application/json"],
  New.operations["getAddresses"]["responses"][404]["content"]["application/json"]
> = true
export const _1304: Eq<
  Old.operations["getAddresses"]["responses"][409]["content"]["application/json"],
  New.operations["getAddresses"]["responses"][409]["content"]["application/json"]
> = true
export const _1305: Eq<
  keyof Old.operations["generateNewExternalAddressDeprecated"]["responses"],
  keyof New.operations["generateNewExternalAddressDeprecated"]["responses"]
> = true
export const _1306: Eq<
  Old.operations["generateNewExternalAddressDeprecated"]["parameters"]["path"],
  New.operations["generateNewExternalAddressDeprecated"]["parameters"]["path"]
> = true
export const _1307: Eq<
  Old.operations["generateNewExternalAddressDeprecated"]["parameters"]["query"],
  New.operations["generateNewExternalAddressDeprecated"]["parameters"]["query"]
> = true
export const _1308: Eq<
  Old.operations["generateNewExternalAddressDeprecated"]["responses"][200]["content"]["application/json"],
  New.operations["generateNewExternalAddressDeprecated"]["responses"][200]["content"]["application/json"]
> = true
export const _1309: Eq<
  Old.operations["generateNewExternalAddressDeprecated"]["responses"][400]["content"]["application/json"],
  New.operations["generateNewExternalAddressDeprecated"]["responses"][400]["content"]["application/json"]
> = true
export const _1310: Eq<
  Old.operations["generateNewExternalAddressDeprecated"]["responses"][401]["content"]["application/json"],
  New.operations["generateNewExternalAddressDeprecated"]["responses"][401]["content"]["application/json"]
> = true
export const _1311: Eq<
  Old.operations["generateNewExternalAddressDeprecated"]["responses"][404]["content"]["application/json"],
  New.operations["generateNewExternalAddressDeprecated"]["responses"][404]["content"]["application/json"]
> = true
export const _1312: Eq<
  Old.operations["generateNewExternalAddressDeprecated"]["responses"][409]["content"]["application/json"],
  New.operations["generateNewExternalAddressDeprecated"]["responses"][409]["content"]["application/json"]
> = true
export const _1313: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/addresses/{ledgerId}"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/addresses/{ledgerId}"]>
> = true
export const _1314: Eq<
  keyof Old.operations["generateNewExternalAddress"]["responses"],
  keyof New.operations["generateNewExternalAddress"]["responses"]
> = true
export const _1315: Eq<
  Old.operations["generateNewExternalAddress"]["parameters"]["path"],
  New.operations["generateNewExternalAddress"]["parameters"]["path"]
> = true
export const _1316: Eq<
  Old.operations["generateNewExternalAddress"]["responses"][200]["content"]["application/json"],
  New.operations["generateNewExternalAddress"]["responses"][200]["content"]["application/json"]
> = true
export const _1317: Eq<
  Old.operations["generateNewExternalAddress"]["responses"][400]["content"]["application/json"],
  New.operations["generateNewExternalAddress"]["responses"][400]["content"]["application/json"]
> = true
export const _1318: Eq<
  Old.operations["generateNewExternalAddress"]["responses"][401]["content"]["application/json"],
  New.operations["generateNewExternalAddress"]["responses"][401]["content"]["application/json"]
> = true
export const _1319: Eq<
  Old.operations["generateNewExternalAddress"]["responses"][404]["content"]["application/json"],
  New.operations["generateNewExternalAddress"]["responses"][404]["content"]["application/json"]
> = true
export const _1320: Eq<
  Old.operations["generateNewExternalAddress"]["responses"][409]["content"]["application/json"],
  New.operations["generateNewExternalAddress"]["responses"][409]["content"]["application/json"]
> = true
export const _1321: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/addresses/latest"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/addresses/latest"]>
> = true
export const _1322: Eq<
  keyof Old.operations["getLatestAddress"]["responses"],
  keyof New.operations["getLatestAddress"]["responses"]
> = true
export const _1323: Eq<
  Old.operations["getLatestAddress"]["parameters"]["path"],
  New.operations["getLatestAddress"]["parameters"]["path"]
> = true
export const _1324: Eq<
  Old.operations["getLatestAddress"]["parameters"]["query"],
  New.operations["getLatestAddress"]["parameters"]["query"]
> = true
export const _1325: Eq<
  Old.operations["getLatestAddress"]["responses"][200]["content"]["application/json"],
  New.operations["getLatestAddress"]["responses"][200]["content"]["application/json"]
> = true
export const _1326: Eq<
  Old.operations["getLatestAddress"]["responses"][400]["content"]["application/json"],
  New.operations["getLatestAddress"]["responses"][400]["content"]["application/json"]
> = true
export const _1327: Eq<
  Old.operations["getLatestAddress"]["responses"][401]["content"]["application/json"],
  New.operations["getLatestAddress"]["responses"][401]["content"]["application/json"]
> = true
export const _1328: Eq<
  Old.operations["getLatestAddress"]["responses"][404]["content"]["application/json"],
  New.operations["getLatestAddress"]["responses"][404]["content"]["application/json"]
> = true
export const _1329: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/addresses/{accountAddressId}"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/addresses/{accountAddressId}"]>
> = true
export const _1330: Eq<
  keyof Old.operations["getAccountAddress"]["responses"],
  keyof New.operations["getAccountAddress"]["responses"]
> = true
export const _1331: Eq<
  Old.operations["getAccountAddress"]["parameters"]["path"],
  New.operations["getAccountAddress"]["parameters"]["path"]
> = true
export const _1332: Eq<
  Old.operations["getAccountAddress"]["responses"][200]["content"]["application/json"],
  New.operations["getAccountAddress"]["responses"][200]["content"]["application/json"]
> = true
export const _1333: Eq<
  Old.operations["getAccountAddress"]["responses"][400]["content"]["application/json"],
  New.operations["getAccountAddress"]["responses"][400]["content"]["application/json"]
> = true
export const _1334: Eq<
  Old.operations["getAccountAddress"]["responses"][401]["content"]["application/json"],
  New.operations["getAccountAddress"]["responses"][401]["content"]["application/json"]
> = true
export const _1335: Eq<
  Old.operations["getAccountAddress"]["responses"][404]["content"]["application/json"],
  New.operations["getAccountAddress"]["responses"][404]["content"]["application/json"]
> = true
export const _1336: Eq<
  Old.operations["getAccountAddress"]["responses"][409]["content"]["application/json"],
  New.operations["getAccountAddress"]["responses"][409]["content"]["application/json"]
> = true
export const _1337: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/confirmed-balance/{tickerId}"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/confirmed-balance/{tickerId}"]>
> = true
export const _1338: Eq<
  keyof Old.operations["getAccountConfirmedBalance"]["responses"],
  keyof New.operations["getAccountConfirmedBalance"]["responses"]
> = true
export const _1339: Eq<
  Old.operations["getAccountConfirmedBalance"]["parameters"]["path"],
  New.operations["getAccountConfirmedBalance"]["parameters"]["path"]
> = true
export const _1340: Eq<
  Old.operations["getAccountConfirmedBalance"]["responses"][200]["content"]["application/json"],
  New.operations["getAccountConfirmedBalance"]["responses"][200]["content"]["application/json"]
> = true
export const _1341: Eq<
  Old.operations["getAccountConfirmedBalance"]["responses"][400]["content"]["application/json"],
  New.operations["getAccountConfirmedBalance"]["responses"][400]["content"]["application/json"]
> = true
export const _1342: Eq<
  Old.operations["getAccountConfirmedBalance"]["responses"][401]["content"]["application/json"],
  New.operations["getAccountConfirmedBalance"]["responses"][401]["content"]["application/json"]
> = true
export const _1343: Eq<
  Old.operations["getAccountConfirmedBalance"]["responses"][404]["content"]["application/json"],
  New.operations["getAccountConfirmedBalance"]["responses"][404]["content"]["application/json"]
> = true
export const _1344: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/balances"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/balances"]>
> = true
export const _1345: Eq<
  keyof Old.operations["getAccountBalances"]["responses"],
  keyof New.operations["getAccountBalances"]["responses"]
> = true
export const _1346: Eq<
  Old.operations["getAccountBalances"]["parameters"]["path"],
  New.operations["getAccountBalances"]["parameters"]["path"]
> = true
export const _1347: Eq<
  Old.operations["getAccountBalances"]["parameters"]["query"],
  New.operations["getAccountBalances"]["parameters"]["query"]
> = true
export const _1348: Eq<
  Old.operations["getAccountBalances"]["responses"][200]["content"]["application/json"],
  New.operations["getAccountBalances"]["responses"][200]["content"]["application/json"]
> = true
export const _1349: Eq<
  Old.operations["getAccountBalances"]["responses"][400]["content"]["application/json"],
  New.operations["getAccountBalances"]["responses"][400]["content"]["application/json"]
> = true
export const _1350: Eq<
  Old.operations["getAccountBalances"]["responses"][401]["content"]["application/json"],
  New.operations["getAccountBalances"]["responses"][401]["content"]["application/json"]
> = true
export const _1351: Eq<
  Old.operations["getAccountBalances"]["responses"][404]["content"]["application/json"],
  New.operations["getAccountBalances"]["responses"][404]["content"]["application/json"]
> = true
export const _1352: Eq<
  Old.operations["getAccountBalances"]["responses"][409]["content"]["application/json"],
  New.operations["getAccountBalances"]["responses"][409]["content"]["application/json"]
> = true
export const _1353: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/balances/refresh"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/balances/refresh"]>
> = true
export const _1354: Eq<
  keyof Old.operations["forceUpdateAccountBalances"]["responses"],
  keyof New.operations["forceUpdateAccountBalances"]["responses"]
> = true
export const _1355: Eq<
  Old.operations["forceUpdateAccountBalances"]["parameters"]["path"],
  New.operations["forceUpdateAccountBalances"]["parameters"]["path"]
> = true
export const _1356: Eq<
  Old.operations["forceUpdateAccountBalances"]["parameters"]["query"],
  New.operations["forceUpdateAccountBalances"]["parameters"]["query"]
> = true
export const _1357: Eq<
  Old.operations["forceUpdateAccountBalances"]["responses"][400]["content"]["application/json"],
  New.operations["forceUpdateAccountBalances"]["responses"][400]["content"]["application/json"]
> = true
export const _1358: Eq<
  Old.operations["forceUpdateAccountBalances"]["responses"][401]["content"]["application/json"],
  New.operations["forceUpdateAccountBalances"]["responses"][401]["content"]["application/json"]
> = true
export const _1359: Eq<
  Old.operations["forceUpdateAccountBalances"]["responses"][404]["content"]["application/json"],
  New.operations["forceUpdateAccountBalances"]["responses"][404]["content"]["application/json"]
> = true
export const _1360: Eq<
  Old.operations["forceUpdateAccountBalances"]["responses"][409]["content"]["application/json"],
  New.operations["forceUpdateAccountBalances"]["responses"][409]["content"]["application/json"]
> = true
export const _1361: Eq<
  Present<Old.paths["/v1/domains/{domainId}/endpoints"]>,
  Present<New.paths["/v1/domains/{domainId}/endpoints"]>
> = true
export const _1362: Eq<
  keyof Old.operations["getEndpoints"]["responses"],
  keyof New.operations["getEndpoints"]["responses"]
> = true
export const _1363: Eq<
  Old.operations["getEndpoints"]["parameters"]["path"],
  New.operations["getEndpoints"]["parameters"]["path"]
> = true
export const _1364: Eq<
  Old.operations["getEndpoints"]["parameters"]["query"],
  New.operations["getEndpoints"]["parameters"]["query"]
> = true
export const _1365: Eq<
  Old.operations["getEndpoints"]["responses"][200]["content"]["application/json"],
  New.operations["getEndpoints"]["responses"][200]["content"]["application/json"]
> = true
export const _1366: Eq<
  Old.operations["getEndpoints"]["responses"][401]["content"]["application/json"],
  New.operations["getEndpoints"]["responses"][401]["content"]["application/json"]
> = true
export const _1367: Eq<
  Old.operations["getEndpoints"]["responses"][404]["content"]["application/json"],
  New.operations["getEndpoints"]["responses"][404]["content"]["application/json"]
> = true
export const _1368: Eq<
  Present<Old.paths["/v1/domains/{domainId}/endpoints/{endpointId}"]>,
  Present<New.paths["/v1/domains/{domainId}/endpoints/{endpointId}"]>
> = true
export const _1369: Eq<
  keyof Old.operations["getEndpoint"]["responses"],
  keyof New.operations["getEndpoint"]["responses"]
> = true
export const _1370: Eq<
  Old.operations["getEndpoint"]["parameters"]["path"],
  New.operations["getEndpoint"]["parameters"]["path"]
> = true
export const _1371: Eq<
  Old.operations["getEndpoint"]["responses"][200]["content"]["application/json"],
  New.operations["getEndpoint"]["responses"][200]["content"]["application/json"]
> = true
export const _1372: Eq<
  Old.operations["getEndpoint"]["responses"][401]["content"]["application/json"],
  New.operations["getEndpoint"]["responses"][401]["content"]["application/json"]
> = true
export const _1373: Eq<
  Old.operations["getEndpoint"]["responses"][404]["content"]["application/json"],
  New.operations["getEndpoint"]["responses"][404]["content"]["application/json"]
> = true
export const _1374: Eq<
  Present<Old.paths["/v1/domains/{domainId}/transactions/orders"]>,
  Present<New.paths["/v1/domains/{domainId}/transactions/orders"]>
> = true
export const _1375: Eq<
  keyof Old.operations["getOrders"]["responses"],
  keyof New.operations["getOrders"]["responses"]
> = true
export const _1376: Eq<
  Old.operations["getOrders"]["parameters"]["path"],
  New.operations["getOrders"]["parameters"]["path"]
> = true
export const _1377: Eq<
  Old.operations["getOrders"]["parameters"]["query"],
  New.operations["getOrders"]["parameters"]["query"]
> = true
export const _1378: Eq<
  Old.operations["getOrders"]["responses"][200]["content"]["application/json"],
  New.operations["getOrders"]["responses"][200]["content"]["application/json"]
> = true
export const _1379: Eq<
  Old.operations["getOrders"]["responses"][400]["content"]["application/json"],
  New.operations["getOrders"]["responses"][400]["content"]["application/json"]
> = true
export const _1380: Eq<
  Old.operations["getOrders"]["responses"][401]["content"]["application/json"],
  New.operations["getOrders"]["responses"][401]["content"]["application/json"]
> = true
export const _1381: Eq<
  Old.operations["getOrders"]["responses"][404]["content"]["application/json"],
  New.operations["getOrders"]["responses"][404]["content"]["application/json"]
> = true
export const _1382: Eq<
  Present<Old.paths["/v1/domains/{domainId}/transactions/orders/{transactionOrderId}"]>,
  Present<New.paths["/v1/domains/{domainId}/transactions/orders/{transactionOrderId}"]>
> = true
export const _1383: Eq<
  keyof Old.operations["getOrder"]["responses"],
  keyof New.operations["getOrder"]["responses"]
> = true
export const _1384: Eq<
  Old.operations["getOrder"]["parameters"]["path"],
  New.operations["getOrder"]["parameters"]["path"]
> = true
export const _1385: Eq<
  Old.operations["getOrder"]["responses"][200]["content"]["application/json"],
  New.operations["getOrder"]["responses"][200]["content"]["application/json"]
> = true
export const _1386: Eq<
  Old.operations["getOrder"]["responses"][401]["content"]["application/json"],
  New.operations["getOrder"]["responses"][401]["content"]["application/json"]
> = true
export const _1387: Eq<
  Old.operations["getOrder"]["responses"][404]["content"]["application/json"],
  New.operations["getOrder"]["responses"][404]["content"]["application/json"]
> = true
export const _1388: Eq<
  Present<Old.paths["/v1/domains/{domainId}/transactions/transfers"]>,
  Present<New.paths["/v1/domains/{domainId}/transactions/transfers"]>
> = true
export const _1389: Eq<
  keyof Old.operations["getTransfers"]["responses"],
  keyof New.operations["getTransfers"]["responses"]
> = true
export const _1390: Eq<
  Old.operations["getTransfers"]["parameters"]["path"],
  New.operations["getTransfers"]["parameters"]["path"]
> = true
export const _1391: Eq<
  Old.operations["getTransfers"]["parameters"]["query"],
  New.operations["getTransfers"]["parameters"]["query"]
> = true
export const _1392: Eq<
  Old.operations["getTransfers"]["responses"][200]["content"]["application/json"],
  New.operations["getTransfers"]["responses"][200]["content"]["application/json"]
> = true
export const _1393: Eq<
  Old.operations["getTransfers"]["responses"][400]["content"]["application/json"],
  New.operations["getTransfers"]["responses"][400]["content"]["application/json"]
> = true
export const _1394: Eq<
  Old.operations["getTransfers"]["responses"][401]["content"]["application/json"],
  New.operations["getTransfers"]["responses"][401]["content"]["application/json"]
> = true
export const _1395: Eq<
  Old.operations["getTransfers"]["responses"][404]["content"]["application/json"],
  New.operations["getTransfers"]["responses"][404]["content"]["application/json"]
> = true
export const _1396: Eq<
  Present<Old.paths["/v1/domains/{domainId}/transactions/transfers/{transferId}"]>,
  Present<New.paths["/v1/domains/{domainId}/transactions/transfers/{transferId}"]>
> = true
export const _1397: Eq<
  keyof Old.operations["getTransfer"]["responses"],
  keyof New.operations["getTransfer"]["responses"]
> = true
export const _1398: Eq<
  Old.operations["getTransfer"]["parameters"]["path"],
  New.operations["getTransfer"]["parameters"]["path"]
> = true
export const _1399: Eq<
  Old.operations["getTransfer"]["responses"][200]["content"]["application/json"],
  New.operations["getTransfer"]["responses"][200]["content"]["application/json"]
> = true
export const _1400: Eq<
  Old.operations["getTransfer"]["responses"][401]["content"]["application/json"],
  New.operations["getTransfer"]["responses"][401]["content"]["application/json"]
> = true
export const _1401: Eq<
  Old.operations["getTransfer"]["responses"][404]["content"]["application/json"],
  New.operations["getTransfer"]["responses"][404]["content"]["application/json"]
> = true
export const _1402: Eq<
  Present<Old.paths["/v1/domains/{domainId}/transactions"]>,
  Present<New.paths["/v1/domains/{domainId}/transactions"]>
> = true
export const _1403: Eq<
  keyof Old.operations["getTransactions"]["responses"],
  keyof New.operations["getTransactions"]["responses"]
> = true
export const _1404: Eq<
  Old.operations["getTransactions"]["parameters"]["path"],
  New.operations["getTransactions"]["parameters"]["path"]
> = true
export const _1405: Eq<
  Old.operations["getTransactions"]["parameters"]["query"],
  New.operations["getTransactions"]["parameters"]["query"]
> = true
export const _1406: Eq<
  Old.operations["getTransactions"]["responses"][200]["content"]["application/json"],
  New.operations["getTransactions"]["responses"][200]["content"]["application/json"]
> = true
export const _1407: Eq<
  Old.operations["getTransactions"]["responses"][401]["content"]["application/json"],
  New.operations["getTransactions"]["responses"][401]["content"]["application/json"]
> = true
export const _1408: Eq<
  Old.operations["getTransactions"]["responses"][404]["content"]["application/json"],
  New.operations["getTransactions"]["responses"][404]["content"]["application/json"]
> = true
export const _1409: Eq<
  Present<Old.paths["/v1/domains/{domainId}/transactions/{transactionId}"]>,
  Present<New.paths["/v1/domains/{domainId}/transactions/{transactionId}"]>
> = true
export const _1410: Eq<
  keyof Old.operations["getTransaction"]["responses"],
  keyof New.operations["getTransaction"]["responses"]
> = true
export const _1411: Eq<
  Old.operations["getTransaction"]["parameters"]["path"],
  New.operations["getTransaction"]["parameters"]["path"]
> = true
export const _1412: Eq<
  Old.operations["getTransaction"]["responses"][200]["content"]["application/json"],
  New.operations["getTransaction"]["responses"][200]["content"]["application/json"]
> = true
export const _1413: Eq<
  Old.operations["getTransaction"]["responses"][401]["content"]["application/json"],
  New.operations["getTransaction"]["responses"][401]["content"]["application/json"]
> = true
export const _1414: Eq<
  Old.operations["getTransaction"]["responses"][404]["content"]["application/json"],
  New.operations["getTransaction"]["responses"][404]["content"]["application/json"]
> = true
export const _1415: Eq<
  Present<Old.paths["/v1/domains/{domainId}/transactions/dry-run"]>,
  Present<New.paths["/v1/domains/{domainId}/transactions/dry-run"]>
> = true
export const _1416: Eq<
  keyof Old.operations["dryRunTransaction"]["responses"],
  keyof New.operations["dryRunTransaction"]["responses"]
> = true
export const _1417: Eq<
  Old.operations["dryRunTransaction"]["parameters"]["path"],
  New.operations["dryRunTransaction"]["parameters"]["path"]
> = true
export const _1418: Eq<
  NonNullable<Old.operations["dryRunTransaction"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["dryRunTransaction"]["requestBody"]>["content"]["application/json"]
> = true
export const _1419: Eq<
  Old.operations["dryRunTransaction"]["responses"][200]["content"]["application/json"],
  New.operations["dryRunTransaction"]["responses"][200]["content"]["application/json"]
> = true
export const _1420: Eq<
  Old.operations["dryRunTransaction"]["responses"][400]["content"]["application/json"],
  New.operations["dryRunTransaction"]["responses"][400]["content"]["application/json"]
> = true
export const _1421: Eq<
  Old.operations["dryRunTransaction"]["responses"][401]["content"]["application/json"],
  New.operations["dryRunTransaction"]["responses"][401]["content"]["application/json"]
> = true
export const _1422: Eq<
  Old.operations["dryRunTransaction"]["responses"][404]["content"]["application/json"],
  New.operations["dryRunTransaction"]["responses"][404]["content"]["application/json"]
> = true
export const _1423: Eq<
  Old.operations["dryRunTransaction"]["responses"][504]["content"]["application/json"],
  New.operations["dryRunTransaction"]["responses"][504]["content"]["application/json"]
> = true
export const _1424: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/manifests"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/manifests"]>
> = true
export const _1425: Eq<
  keyof Old.operations["getManifests"]["responses"],
  keyof New.operations["getManifests"]["responses"]
> = true
export const _1426: Eq<
  Old.operations["getManifests"]["parameters"]["path"],
  New.operations["getManifests"]["parameters"]["path"]
> = true
export const _1427: Eq<
  Old.operations["getManifests"]["parameters"]["query"],
  New.operations["getManifests"]["parameters"]["query"]
> = true
export const _1428: Eq<
  Old.operations["getManifests"]["responses"][200]["content"]["application/json"],
  New.operations["getManifests"]["responses"][200]["content"]["application/json"]
> = true
export const _1429: Eq<
  Old.operations["getManifests"]["responses"][400]["content"]["application/json"],
  New.operations["getManifests"]["responses"][400]["content"]["application/json"]
> = true
export const _1430: Eq<
  Old.operations["getManifests"]["responses"][401]["content"]["application/json"],
  New.operations["getManifests"]["responses"][401]["content"]["application/json"]
> = true
export const _1431: Eq<
  Old.operations["getManifests"]["responses"][404]["content"]["application/json"],
  New.operations["getManifests"]["responses"][404]["content"]["application/json"]
> = true
export const _1432: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/manifests/{manifestId}"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/manifests/{manifestId}"]>
> = true
export const _1433: Eq<
  keyof Old.operations["getManifest"]["responses"],
  keyof New.operations["getManifest"]["responses"]
> = true
export const _1434: Eq<
  Old.operations["getManifest"]["parameters"]["path"],
  New.operations["getManifest"]["parameters"]["path"]
> = true
export const _1435: Eq<
  Old.operations["getManifest"]["responses"][200]["content"]["application/json"],
  New.operations["getManifest"]["responses"][200]["content"]["application/json"]
> = true
export const _1436: Eq<
  Old.operations["getManifest"]["responses"][400]["content"]["application/json"],
  New.operations["getManifest"]["responses"][400]["content"]["application/json"]
> = true
export const _1437: Eq<
  Old.operations["getManifest"]["responses"][401]["content"]["application/json"],
  New.operations["getManifest"]["responses"][401]["content"]["application/json"]
> = true
export const _1438: Eq<
  Old.operations["getManifest"]["responses"][404]["content"]["application/json"],
  New.operations["getManifest"]["responses"][404]["content"]["application/json"]
> = true
export const _1439: Eq<Present<Old.paths["/v1/intents"]>, Present<New.paths["/v1/intents"]>> = true
export const _1440: Eq<
  keyof Old.operations["createIntent"]["responses"],
  keyof New.operations["createIntent"]["responses"]
> = true
export const _1441: Eq<
  Old.operations["createIntent"]["parameters"]["header"],
  New.operations["createIntent"]["parameters"]["header"]
> = true
export const _1442: Eq<
  NonNullable<Old.operations["createIntent"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["createIntent"]["requestBody"]>["content"]["application/json"]
> = true
export const _1443: Eq<
  Old.operations["createIntent"]["responses"][202]["content"]["application/json"],
  New.operations["createIntent"]["responses"][202]["content"]["application/json"]
> = true
export const _1444: Eq<
  Old.operations["createIntent"]["responses"][400]["content"]["application/json"],
  New.operations["createIntent"]["responses"][400]["content"]["application/json"]
> = true
export const _1445: Eq<
  Old.operations["createIntent"]["responses"][401]["content"]["application/json"],
  New.operations["createIntent"]["responses"][401]["content"]["application/json"]
> = true
export const _1446: Eq<
  Old.operations["createIntent"]["responses"][403]["content"]["application/json"],
  New.operations["createIntent"]["responses"][403]["content"]["application/json"]
> = true
export const _1447: Eq<
  Old.operations["createIntent"]["responses"][404]["content"]["application/json"],
  New.operations["createIntent"]["responses"][404]["content"]["application/json"]
> = true
export const _1448: Eq<
  Old.operations["createIntent"]["responses"][409]["content"]["application/json"],
  New.operations["createIntent"]["responses"][409]["content"]["application/json"]
> = true
export const _1449: Eq<
  Old.operations["createIntent"]["responses"][503]["content"]["application/json"],
  New.operations["createIntent"]["responses"][503]["content"]["application/json"]
> = true
export const _1450: Eq<
  Present<Old.paths["/v1/intents/approve"]>,
  Present<New.paths["/v1/intents/approve"]>
> = true
export const _1451: Eq<
  keyof Old.operations["approveIntent"]["responses"],
  keyof New.operations["approveIntent"]["responses"]
> = true
export const _1452: Eq<
  Old.operations["approveIntent"]["parameters"]["header"],
  New.operations["approveIntent"]["parameters"]["header"]
> = true
export const _1453: Eq<
  NonNullable<Old.operations["approveIntent"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["approveIntent"]["requestBody"]>["content"]["application/json"]
> = true
export const _1454: Eq<
  Old.operations["approveIntent"]["responses"][202]["content"]["application/json"],
  New.operations["approveIntent"]["responses"][202]["content"]["application/json"]
> = true
export const _1455: Eq<
  Old.operations["approveIntent"]["responses"][400]["content"]["application/json"],
  New.operations["approveIntent"]["responses"][400]["content"]["application/json"]
> = true
export const _1456: Eq<
  Old.operations["approveIntent"]["responses"][401]["content"]["application/json"],
  New.operations["approveIntent"]["responses"][401]["content"]["application/json"]
> = true
export const _1457: Eq<
  Old.operations["approveIntent"]["responses"][404]["content"]["application/json"],
  New.operations["approveIntent"]["responses"][404]["content"]["application/json"]
> = true
export const _1458: Eq<
  Old.operations["approveIntent"]["responses"][409]["content"]["application/json"],
  New.operations["approveIntent"]["responses"][409]["content"]["application/json"]
> = true
export const _1459: Eq<
  Old.operations["approveIntent"]["responses"][500]["content"]["application/json"],
  New.operations["approveIntent"]["responses"][500]["content"]["application/json"]
> = true
export const _1460: Eq<
  Present<Old.paths["/v1/intents/reject"]>,
  Present<New.paths["/v1/intents/reject"]>
> = true
export const _1461: Eq<
  keyof Old.operations["rejectIntent"]["responses"],
  keyof New.operations["rejectIntent"]["responses"]
> = true
export const _1462: Eq<
  Old.operations["rejectIntent"]["parameters"]["header"],
  New.operations["rejectIntent"]["parameters"]["header"]
> = true
export const _1463: Eq<
  NonNullable<Old.operations["rejectIntent"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["rejectIntent"]["requestBody"]>["content"]["application/json"]
> = true
export const _1464: Eq<
  Old.operations["rejectIntent"]["responses"][202]["content"]["application/json"],
  New.operations["rejectIntent"]["responses"][202]["content"]["application/json"]
> = true
export const _1465: Eq<
  Old.operations["rejectIntent"]["responses"][400]["content"]["application/json"],
  New.operations["rejectIntent"]["responses"][400]["content"]["application/json"]
> = true
export const _1466: Eq<
  Old.operations["rejectIntent"]["responses"][401]["content"]["application/json"],
  New.operations["rejectIntent"]["responses"][401]["content"]["application/json"]
> = true
export const _1467: Eq<
  Old.operations["rejectIntent"]["responses"][404]["content"]["application/json"],
  New.operations["rejectIntent"]["responses"][404]["content"]["application/json"]
> = true
export const _1468: Eq<
  Old.operations["rejectIntent"]["responses"][409]["content"]["application/json"],
  New.operations["rejectIntent"]["responses"][409]["content"]["application/json"]
> = true
export const _1469: Eq<
  Old.operations["rejectIntent"]["responses"][500]["content"]["application/json"],
  New.operations["rejectIntent"]["responses"][500]["content"]["application/json"]
> = true
export const _1470: Eq<Present<Old.paths["/v1/genesis"]>, Present<New.paths["/v1/genesis"]>> = true
export const _1471: Eq<
  keyof Old.operations["runGenesis"]["responses"],
  keyof New.operations["runGenesis"]["responses"]
> = true
export const _1472: Eq<
  NonNullable<Old.operations["runGenesis"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["runGenesis"]["requestBody"]>["content"]["application/json"]
> = true
export const _1473: Eq<
  Old.operations["runGenesis"]["responses"][401]["content"]["application/json"],
  New.operations["runGenesis"]["responses"][401]["content"]["application/json"]
> = true
export const _1474: Eq<
  Old.operations["runGenesis"]["responses"][409]["content"]["application/json"],
  New.operations["runGenesis"]["responses"][409]["content"]["application/json"]
> = true
export const _1475: Eq<
  Old.operations["runGenesis"]["responses"][500]["content"]["application/json"],
  New.operations["runGenesis"]["responses"][500]["content"]["application/json"]
> = true
export const _1476: Eq<
  Present<Old.paths["/v1/domains/{domainId}/intents"]>,
  Present<New.paths["/v1/domains/{domainId}/intents"]>
> = true
export const _1477: Eq<
  keyof Old.operations["getIntents"]["responses"],
  keyof New.operations["getIntents"]["responses"]
> = true
export const _1478: Eq<
  Old.operations["getIntents"]["parameters"]["path"],
  New.operations["getIntents"]["parameters"]["path"]
> = true
export const _1479: Eq<
  Old.operations["getIntents"]["parameters"]["query"],
  New.operations["getIntents"]["parameters"]["query"]
> = true
export const _1480: Eq<
  Old.operations["getIntents"]["responses"][200]["content"]["application/json"],
  New.operations["getIntents"]["responses"][200]["content"]["application/json"]
> = true
export const _1481: Eq<
  Old.operations["getIntents"]["responses"][401]["content"]["application/json"],
  New.operations["getIntents"]["responses"][401]["content"]["application/json"]
> = true
export const _1482: Eq<
  Old.operations["getIntents"]["responses"][404]["content"]["application/json"],
  New.operations["getIntents"]["responses"][404]["content"]["application/json"]
> = true
export const _1483: Eq<
  Present<Old.paths["/v1/domains/{domainId}/intents/{intentId}"]>,
  Present<New.paths["/v1/domains/{domainId}/intents/{intentId}"]>
> = true
export const _1484: Eq<
  keyof Old.operations["getIntent"]["responses"],
  keyof New.operations["getIntent"]["responses"]
> = true
export const _1485: Eq<
  Old.operations["getIntent"]["parameters"]["path"],
  New.operations["getIntent"]["parameters"]["path"]
> = true
export const _1486: Eq<
  Old.operations["getIntent"]["responses"][200]["content"]["application/json"],
  New.operations["getIntent"]["responses"][200]["content"]["application/json"]
> = true
export const _1487: Eq<
  Old.operations["getIntent"]["responses"][401]["content"]["application/json"],
  New.operations["getIntent"]["responses"][401]["content"]["application/json"]
> = true
export const _1488: Eq<
  Old.operations["getIntent"]["responses"][404]["content"]["application/json"],
  New.operations["getIntent"]["responses"][404]["content"]["application/json"]
> = true
export const _1489: Eq<
  Present<Old.paths["/v1/domains/{domainId}/intents/{intentId}/remaining-users"]>,
  Present<New.paths["/v1/domains/{domainId}/intents/{intentId}/remaining-users"]>
> = true
export const _1490: Eq<
  keyof Old.operations["getRemainingUsers"]["responses"],
  keyof New.operations["getRemainingUsers"]["responses"]
> = true
export const _1491: Eq<
  Old.operations["getRemainingUsers"]["parameters"]["path"],
  New.operations["getRemainingUsers"]["parameters"]["path"]
> = true
export const _1492: Eq<
  Old.operations["getRemainingUsers"]["parameters"]["query"],
  New.operations["getRemainingUsers"]["parameters"]["query"]
> = true
export const _1493: Eq<
  Old.operations["getRemainingUsers"]["responses"][200]["content"]["application/json"],
  New.operations["getRemainingUsers"]["responses"][200]["content"]["application/json"]
> = true
export const _1494: Eq<
  Old.operations["getRemainingUsers"]["responses"][400]["content"]["application/json"],
  New.operations["getRemainingUsers"]["responses"][400]["content"]["application/json"]
> = true
export const _1495: Eq<
  Old.operations["getRemainingUsers"]["responses"][401]["content"]["application/json"],
  New.operations["getRemainingUsers"]["responses"][401]["content"]["application/json"]
> = true
export const _1496: Eq<
  Old.operations["getRemainingUsers"]["responses"][404]["content"]["application/json"],
  New.operations["getRemainingUsers"]["responses"][404]["content"]["application/json"]
> = true
export const _1497: Eq<
  Present<Old.paths["/v1/intents/dry-run"]>,
  Present<New.paths["/v1/intents/dry-run"]>
> = true
export const _1498: Eq<
  keyof Old.operations["intentDryRun"]["responses"],
  keyof New.operations["intentDryRun"]["responses"]
> = true
export const _1499: Eq<
  NonNullable<Old.operations["intentDryRun"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["intentDryRun"]["requestBody"]>["content"]["application/json"]
> = true
export const _1500: Eq<
  Old.operations["intentDryRun"]["responses"][200]["content"]["application/json"],
  New.operations["intentDryRun"]["responses"][200]["content"]["application/json"]
> = true
export const _1501: Eq<
  Old.operations["intentDryRun"]["responses"][401]["content"]["application/json"],
  New.operations["intentDryRun"]["responses"][401]["content"]["application/json"]
> = true
export const _1502: Eq<
  Old.operations["intentDryRun"]["responses"][404]["content"]["application/json"],
  New.operations["intentDryRun"]["responses"][404]["content"]["application/json"]
> = true
export const _1503: Eq<Present<Old.paths["/v1/tickers"]>, Present<New.paths["/v1/tickers"]>> = true
export const _1504: Eq<
  keyof Old.operations["getTickers"]["responses"],
  keyof New.operations["getTickers"]["responses"]
> = true
export const _1505: Eq<
  Old.operations["getTickers"]["parameters"]["query"],
  New.operations["getTickers"]["parameters"]["query"]
> = true
export const _1506: Eq<
  Old.operations["getTickers"]["responses"][200]["content"]["application/json"],
  New.operations["getTickers"]["responses"][200]["content"]["application/json"]
> = true
export const _1507: Eq<
  Old.operations["getTickers"]["responses"][401]["content"]["application/json"],
  New.operations["getTickers"]["responses"][401]["content"]["application/json"]
> = true
export const _1508: Eq<
  Old.operations["getTickers"]["responses"][404]["content"]["application/json"],
  New.operations["getTickers"]["responses"][404]["content"]["application/json"]
> = true
export const _1509: Eq<
  Present<Old.paths["/v1/tickers/{tickerId}"]>,
  Present<New.paths["/v1/tickers/{tickerId}"]>
> = true
export const _1510: Eq<
  keyof Old.operations["getTicker"]["responses"],
  keyof New.operations["getTicker"]["responses"]
> = true
export const _1511: Eq<
  Old.operations["getTicker"]["parameters"]["path"],
  New.operations["getTicker"]["parameters"]["path"]
> = true
export const _1512: Eq<
  Old.operations["getTicker"]["responses"][200]["content"]["application/json"],
  New.operations["getTicker"]["responses"][200]["content"]["application/json"]
> = true
export const _1513: Eq<
  Old.operations["getTicker"]["responses"][404]["content"]["application/json"],
  New.operations["getTicker"]["responses"][404]["content"]["application/json"]
> = true
export const _1514: Eq<Present<Old.paths["/v1/ledgers"]>, Present<New.paths["/v1/ledgers"]>> = true
export const _1515: Eq<
  keyof Old.operations["getLedgers"]["responses"],
  keyof New.operations["getLedgers"]["responses"]
> = true
export const _1516: Eq<
  Old.operations["getLedgers"]["parameters"]["query"],
  New.operations["getLedgers"]["parameters"]["query"]
> = true
export const _1517: Eq<
  Old.operations["getLedgers"]["responses"][200]["content"]["application/json"],
  New.operations["getLedgers"]["responses"][200]["content"]["application/json"]
> = true
export const _1518: Eq<
  Old.operations["getLedgers"]["responses"][401]["content"]["application/json"],
  New.operations["getLedgers"]["responses"][401]["content"]["application/json"]
> = true
export const _1519: Eq<
  Old.operations["getLedgers"]["responses"][404]["content"]["application/json"],
  New.operations["getLedgers"]["responses"][404]["content"]["application/json"]
> = true
export const _1520: Eq<
  Present<Old.paths["/v1/ledgers/{ledgerId}"]>,
  Present<New.paths["/v1/ledgers/{ledgerId}"]>
> = true
export const _1521: Eq<
  keyof Old.operations["getLedger"]["responses"],
  keyof New.operations["getLedger"]["responses"]
> = true
export const _1522: Eq<
  Old.operations["getLedger"]["parameters"]["path"],
  New.operations["getLedger"]["parameters"]["path"]
> = true
export const _1523: Eq<
  Old.operations["getLedger"]["responses"][200]["content"]["application/json"],
  New.operations["getLedger"]["responses"][200]["content"]["application/json"]
> = true
export const _1524: Eq<
  Old.operations["getLedger"]["responses"][401]["content"]["application/json"],
  New.operations["getLedger"]["responses"][401]["content"]["application/json"]
> = true
export const _1525: Eq<
  Old.operations["getLedger"]["responses"][404]["content"]["application/json"],
  New.operations["getLedger"]["responses"][404]["content"]["application/json"]
> = true
export const _1526: Eq<
  Present<Old.paths["/v1/ledgers/{ledgerId}/fees"]>,
  Present<New.paths["/v1/ledgers/{ledgerId}/fees"]>
> = true
export const _1527: Eq<
  keyof Old.operations["getLedgerFees"]["responses"],
  keyof New.operations["getLedgerFees"]["responses"]
> = true
export const _1528: Eq<
  Old.operations["getLedgerFees"]["parameters"]["path"],
  New.operations["getLedgerFees"]["parameters"]["path"]
> = true
export const _1529: Eq<
  Old.operations["getLedgerFees"]["responses"][200]["content"]["application/json"],
  New.operations["getLedgerFees"]["responses"][200]["content"]["application/json"]
> = true
export const _1530: Eq<
  Old.operations["getLedgerFees"]["responses"][401]["content"]["application/json"],
  New.operations["getLedgerFees"]["responses"][401]["content"]["application/json"]
> = true
export const _1531: Eq<
  Old.operations["getLedgerFees"]["responses"][404]["content"]["application/json"],
  New.operations["getLedgerFees"]["responses"][404]["content"]["application/json"]
> = true
export const _1532: Eq<
  Old.operations["getLedgerFees"]["responses"][405]["content"]["application/json"],
  New.operations["getLedgerFees"]["responses"][405]["content"]["application/json"]
> = true
export const _1533: Eq<
  Present<Old.paths["/v1/ledgers/{ledgerId}/ethereum/call"]>,
  Present<New.paths["/v1/ledgers/{ledgerId}/ethereum/call"]>
> = true
export const _1534: Eq<
  keyof Old.operations["processEthereumContractCall"]["responses"],
  keyof New.operations["processEthereumContractCall"]["responses"]
> = true
export const _1535: Eq<
  Old.operations["processEthereumContractCall"]["parameters"]["path"],
  New.operations["processEthereumContractCall"]["parameters"]["path"]
> = true
export const _1536: Eq<
  NonNullable<
    Old.operations["processEthereumContractCall"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["processEthereumContractCall"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1537: Eq<
  Old.operations["processEthereumContractCall"]["responses"][200]["content"]["application/json"],
  New.operations["processEthereumContractCall"]["responses"][200]["content"]["application/json"]
> = true
export const _1538: Eq<
  Old.operations["processEthereumContractCall"]["responses"][401]["content"]["application/json"],
  New.operations["processEthereumContractCall"]["responses"][401]["content"]["application/json"]
> = true
export const _1539: Eq<
  Old.operations["processEthereumContractCall"]["responses"][404]["content"]["application/json"],
  New.operations["processEthereumContractCall"]["responses"][404]["content"]["application/json"]
> = true
export const _1540: Eq<
  Present<Old.paths["/v1/trusted-ledgers/{ledgerId}"]>,
  Present<New.paths["/v1/trusted-ledgers/{ledgerId}"]>
> = true
export const _1541: Eq<
  keyof Old.operations["getTrustedLedger"]["responses"],
  keyof New.operations["getTrustedLedger"]["responses"]
> = true
export const _1542: Eq<
  Old.operations["getTrustedLedger"]["parameters"]["path"],
  New.operations["getTrustedLedger"]["parameters"]["path"]
> = true
export const _1543: Eq<
  Old.operations["getTrustedLedger"]["responses"][200]["content"]["application/json"],
  New.operations["getTrustedLedger"]["responses"][200]["content"]["application/json"]
> = true
export const _1544: Eq<
  Old.operations["getTrustedLedger"]["responses"][401]["content"]["application/json"],
  New.operations["getTrustedLedger"]["responses"][401]["content"]["application/json"]
> = true
export const _1545: Eq<
  Old.operations["getTrustedLedger"]["responses"][404]["content"]["application/json"],
  New.operations["getTrustedLedger"]["responses"][404]["content"]["application/json"]
> = true
export const _1546: Eq<
  Present<Old.paths["/v1/trusted-ledgers"]>,
  Present<New.paths["/v1/trusted-ledgers"]>
> = true
export const _1547: Eq<
  keyof Old.operations["getTrustedLedgers"]["responses"],
  keyof New.operations["getTrustedLedgers"]["responses"]
> = true
export const _1548: Eq<
  Old.operations["getTrustedLedgers"]["parameters"]["query"],
  New.operations["getTrustedLedgers"]["parameters"]["query"]
> = true
export const _1549: Eq<
  Old.operations["getTrustedLedgers"]["responses"][200]["content"]["application/json"],
  New.operations["getTrustedLedgers"]["responses"][200]["content"]["application/json"]
> = true
export const _1550: Eq<
  Old.operations["getTrustedLedgers"]["responses"][401]["content"]["application/json"],
  New.operations["getTrustedLedgers"]["responses"][401]["content"]["application/json"]
> = true
export const _1551: Eq<
  Old.operations["getTrustedLedgers"]["responses"][404]["content"]["application/json"],
  New.operations["getTrustedLedgers"]["responses"][404]["content"]["application/json"]
> = true
export const _1552: Eq<
  Present<Old.paths["/v1/domains/{domainId}/requests/{requestId}"]>,
  Present<New.paths["/v1/domains/{domainId}/requests/{requestId}"]>
> = true
export const _1553: Eq<
  keyof Old.operations["getRequestState"]["responses"],
  keyof New.operations["getRequestState"]["responses"]
> = true
export const _1554: Eq<
  Old.operations["getRequestState"]["parameters"]["path"],
  New.operations["getRequestState"]["parameters"]["path"]
> = true
export const _1555: Eq<
  Old.operations["getRequestState"]["responses"][200]["content"]["application/json"],
  New.operations["getRequestState"]["responses"][200]["content"]["application/json"]
> = true
export const _1556: Eq<
  Old.operations["getRequestState"]["responses"][401]["content"]["application/json"],
  New.operations["getRequestState"]["responses"][401]["content"]["application/json"]
> = true
export const _1557: Eq<
  Old.operations["getRequestState"]["responses"][404]["content"]["application/json"],
  New.operations["getRequestState"]["responses"][404]["content"]["application/json"]
> = true
export const _1558: Eq<
  Present<Old.paths["/v1/me/requests"]>,
  Present<New.paths["/v1/me/requests"]>
> = true
export const _1559: Eq<
  keyof Old.operations["getAllUserRequestsState"]["responses"],
  keyof New.operations["getAllUserRequestsState"]["responses"]
> = true
export const _1560: Eq<
  Old.operations["getAllUserRequestsState"]["parameters"]["query"],
  New.operations["getAllUserRequestsState"]["parameters"]["query"]
> = true
export const _1561: Eq<
  Old.operations["getAllUserRequestsState"]["responses"][200]["content"]["application/json"],
  New.operations["getAllUserRequestsState"]["responses"][200]["content"]["application/json"]
> = true
export const _1562: Eq<
  Old.operations["getAllUserRequestsState"]["responses"][401]["content"]["application/json"],
  New.operations["getAllUserRequestsState"]["responses"][401]["content"]["application/json"]
> = true
export const _1563: Eq<
  Present<Old.paths["/v1/domains/{domainId}/requests"]>,
  Present<New.paths["/v1/domains/{domainId}/requests"]>
> = true
export const _1564: Eq<
  keyof Old.operations["getAllUserRequestsStateInDomain"]["responses"],
  keyof New.operations["getAllUserRequestsStateInDomain"]["responses"]
> = true
export const _1565: Eq<
  Old.operations["getAllUserRequestsStateInDomain"]["parameters"]["path"],
  New.operations["getAllUserRequestsStateInDomain"]["parameters"]["path"]
> = true
export const _1566: Eq<
  Old.operations["getAllUserRequestsStateInDomain"]["parameters"]["query"],
  New.operations["getAllUserRequestsStateInDomain"]["parameters"]["query"]
> = true
export const _1567: Eq<
  Old.operations["getAllUserRequestsStateInDomain"]["responses"][200]["content"]["application/json"],
  New.operations["getAllUserRequestsStateInDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1568: Eq<
  Old.operations["getAllUserRequestsStateInDomain"]["responses"][401]["content"]["application/json"],
  New.operations["getAllUserRequestsStateInDomain"]["responses"][401]["content"]["application/json"]
> = true
export const _1569: Eq<
  Present<Old.paths["/v1/trusted-public-keys/trusted-collection"]>,
  Present<New.paths["/v1/trusted-public-keys/trusted-collection"]>
> = true
export const _1570: Eq<
  keyof Old.operations["getTrustedPublicKeysTrustedCollection"]["responses"],
  keyof New.operations["getTrustedPublicKeysTrustedCollection"]["responses"]
> = true
export const _1571: Eq<
  Old.operations["getTrustedPublicKeysTrustedCollection"]["parameters"]["query"],
  New.operations["getTrustedPublicKeysTrustedCollection"]["parameters"]["query"]
> = true
export const _1572: Eq<
  Old.operations["getTrustedPublicKeysTrustedCollection"]["responses"][200]["content"]["application/json"],
  New.operations["getTrustedPublicKeysTrustedCollection"]["responses"][200]["content"]["application/json"]
> = true
export const _1573: Eq<
  Old.operations["getTrustedPublicKeysTrustedCollection"]["responses"][401]["content"]["application/json"],
  New.operations["getTrustedPublicKeysTrustedCollection"]["responses"][401]["content"]["application/json"]
> = true
export const _1574: Eq<
  Old.operations["getTrustedPublicKeysTrustedCollection"]["responses"][404]["content"]["application/json"],
  New.operations["getTrustedPublicKeysTrustedCollection"]["responses"][404]["content"]["application/json"]
> = true
export const _1575: Eq<
  Present<Old.paths["/v1/trusted-public-keys/api"]>,
  Present<New.paths["/v1/trusted-public-keys/api"]>
> = true
export const _1576: Eq<
  keyof Old.operations["getTrustedPublicKeysApi"]["responses"],
  keyof New.operations["getTrustedPublicKeysApi"]["responses"]
> = true
export const _1577: Eq<
  Old.operations["getTrustedPublicKeysApi"]["parameters"]["query"],
  New.operations["getTrustedPublicKeysApi"]["parameters"]["query"]
> = true
export const _1578: Eq<
  Old.operations["getTrustedPublicKeysApi"]["responses"][200]["content"]["application/json"],
  New.operations["getTrustedPublicKeysApi"]["responses"][200]["content"]["application/json"]
> = true
export const _1579: Eq<
  Old.operations["getTrustedPublicKeysApi"]["responses"][401]["content"]["application/json"],
  New.operations["getTrustedPublicKeysApi"]["responses"][401]["content"]["application/json"]
> = true
export const _1580: Eq<
  Old.operations["getTrustedPublicKeysApi"]["responses"][404]["content"]["application/json"],
  New.operations["getTrustedPublicKeysApi"]["responses"][404]["content"]["application/json"]
> = true
export const _1581: Eq<
  Present<Old.paths["/v1/trusted-public-keys/messages"]>,
  Present<New.paths["/v1/trusted-public-keys/messages"]>
> = true
export const _1582: Eq<
  keyof Old.operations["getTrustedPublicKeysMessages"]["responses"],
  keyof New.operations["getTrustedPublicKeysMessages"]["responses"]
> = true
export const _1583: Eq<
  Old.operations["getTrustedPublicKeysMessages"]["parameters"]["query"],
  New.operations["getTrustedPublicKeysMessages"]["parameters"]["query"]
> = true
export const _1584: Eq<
  Old.operations["getTrustedPublicKeysMessages"]["responses"][200]["content"]["application/json"],
  New.operations["getTrustedPublicKeysMessages"]["responses"][200]["content"]["application/json"]
> = true
export const _1585: Eq<
  Old.operations["getTrustedPublicKeysMessages"]["responses"][401]["content"]["application/json"],
  New.operations["getTrustedPublicKeysMessages"]["responses"][401]["content"]["application/json"]
> = true
export const _1586: Eq<
  Old.operations["getTrustedPublicKeysMessages"]["responses"][404]["content"]["application/json"],
  New.operations["getTrustedPublicKeysMessages"]["responses"][404]["content"]["application/json"]
> = true
export const _1587: Eq<
  Present<Old.paths["/v1/domains/{domainId}/events"]>,
  Present<New.paths["/v1/domains/{domainId}/events"]>
> = true
export const _1588: Eq<
  keyof Old.operations["getEvents"]["responses"],
  keyof New.operations["getEvents"]["responses"]
> = true
export const _1589: Eq<
  Old.operations["getEvents"]["parameters"]["path"],
  New.operations["getEvents"]["parameters"]["path"]
> = true
export const _1590: Eq<
  Old.operations["getEvents"]["parameters"]["query"],
  New.operations["getEvents"]["parameters"]["query"]
> = true
export const _1591: Eq<
  Old.operations["getEvents"]["responses"][200]["content"]["application/json"],
  New.operations["getEvents"]["responses"][200]["content"]["application/json"]
> = true
export const _1592: Eq<
  Old.operations["getEvents"]["responses"][400]["content"]["application/json"],
  New.operations["getEvents"]["responses"][400]["content"]["application/json"]
> = true
export const _1593: Eq<
  Old.operations["getEvents"]["responses"][401]["content"]["application/json"],
  New.operations["getEvents"]["responses"][401]["content"]["application/json"]
> = true
export const _1594: Eq<
  Old.operations["getEvents"]["responses"][404]["content"]["application/json"],
  New.operations["getEvents"]["responses"][404]["content"]["application/json"]
> = true
export const _1595: Eq<
  Present<Old.paths["/v1/properties"]>,
  Present<New.paths["/v1/properties"]>
> = true
export const _1596: Eq<
  keyof Old.operations["getSystemProperties"]["responses"],
  keyof New.operations["getSystemProperties"]["responses"]
> = true
export const _1597: Eq<
  Old.operations["getSystemProperties"]["parameters"]["query"],
  New.operations["getSystemProperties"]["parameters"]["query"]
> = true
export const _1598: Eq<
  Old.operations["getSystemProperties"]["responses"][200]["content"]["application/json"],
  New.operations["getSystemProperties"]["responses"][200]["content"]["application/json"]
> = true
export const _1599: Eq<
  Old.operations["getSystemProperties"]["responses"][401]["content"]["application/json"],
  New.operations["getSystemProperties"]["responses"][401]["content"]["application/json"]
> = true
export const _1600: Eq<
  Old.operations["getSystemProperties"]["responses"][404]["content"]["application/json"],
  New.operations["getSystemProperties"]["responses"][404]["content"]["application/json"]
> = true
export const _1601: Eq<
  Present<Old.paths["/v1/domains/{domainId}/users/invitations"]>,
  Present<New.paths["/v1/domains/{domainId}/users/invitations"]>
> = true
export const _1602: Eq<
  keyof Old.paths["/v1/domains/{domainId}/users/invitations"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/users/invitations"]["get"]["responses"]
> = true
export const _1603: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/users/invitations"]["get"]["parameters"]["path"]
> = true
export const _1604: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations"]["get"]["parameters"]["query"],
  New.paths["/v1/domains/{domainId}/users/invitations"]["get"]["parameters"]["query"]
> = true
export const _1605: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/users/invitations"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1606: Eq<
  keyof Old.paths["/v1/domains/{domainId}/users/invitations"]["post"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/users/invitations"]["post"]["responses"]
> = true
export const _1607: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations"]["post"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/users/invitations"]["post"]["parameters"]["path"]
> = true
export const _1608: Eq<
  NonNullable<
    Old.paths["/v1/domains/{domainId}/users/invitations"]["post"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/v1/domains/{domainId}/users/invitations"]["post"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1609: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations"]["post"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/users/invitations"]["post"]["responses"][200]["content"]["application/json"]
> = true
export const _1610: Eq<
  Present<Old.paths["/v1/domains/{domainId}/users/invitations/{id}"]>,
  Present<New.paths["/v1/domains/{domainId}/users/invitations/{id}"]>
> = true
export const _1611: Eq<
  keyof Old.paths["/v1/domains/{domainId}/users/invitations/{id}"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/users/invitations/{id}"]["get"]["responses"]
> = true
export const _1612: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations/{id}"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/users/invitations/{id}"]["get"]["parameters"]["path"]
> = true
export const _1613: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations/{id}"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/users/invitations/{id}"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1614: Eq<
  Present<Old.paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]>,
  Present<New.paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]>
> = true
export const _1615: Eq<
  keyof Old.paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]["post"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]["post"]["responses"]
> = true
export const _1616: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]["post"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]["post"]["parameters"]["path"]
> = true
export const _1617: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]["post"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/users/invitations/{id}/cancel"]["post"]["responses"][200]["content"]["application/json"]
> = true
export const _1618: Eq<
  Present<Old.paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]>,
  Present<New.paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]>
> = true
export const _1619: Eq<
  keyof Old.paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]["post"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]["post"]["responses"]
> = true
export const _1620: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]["post"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]["post"]["parameters"]["path"]
> = true
export const _1621: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]["post"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/users/invitations/{id}/renew"]["post"]["responses"][200]["content"]["application/json"]
> = true
export const _1622: Eq<
  Present<Old.paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]>,
  Present<New.paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]>
> = true
export const _1623: Eq<
  keyof Old.paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]["post"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]["post"]["responses"]
> = true
export const _1624: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]["post"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]["post"]["parameters"]["path"]
> = true
export const _1625: Eq<
  Old.paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]["post"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/users/invitations/{id}/complete"]["post"]["responses"][200]["content"]["application/json"]
> = true
export const _1626: Eq<
  Present<Old.paths["/v1/users/invitations/{idOrCode}"]>,
  Present<New.paths["/v1/users/invitations/{idOrCode}"]>
> = true
export const _1627: Eq<
  keyof Old.paths["/v1/users/invitations/{idOrCode}"]["get"]["responses"],
  keyof New.paths["/v1/users/invitations/{idOrCode}"]["get"]["responses"]
> = true
export const _1628: Eq<
  Old.paths["/v1/users/invitations/{idOrCode}"]["get"]["parameters"]["path"],
  New.paths["/v1/users/invitations/{idOrCode}"]["get"]["parameters"]["path"]
> = true
export const _1629: Eq<
  Old.paths["/v1/users/invitations/{idOrCode}"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/users/invitations/{idOrCode}"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1630: Eq<
  keyof Old.paths["/v1/users/invitations/{idOrCode}"]["post"]["responses"],
  keyof New.paths["/v1/users/invitations/{idOrCode}"]["post"]["responses"]
> = true
export const _1631: Eq<
  Old.paths["/v1/users/invitations/{idOrCode}"]["post"]["parameters"]["path"],
  New.paths["/v1/users/invitations/{idOrCode}"]["post"]["parameters"]["path"]
> = true
export const _1632: Eq<
  NonNullable<
    Old.paths["/v1/users/invitations/{idOrCode}"]["post"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/v1/users/invitations/{idOrCode}"]["post"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1633: Eq<
  Present<Old.paths["/v1/vaults/{vaultId}/operations/prepared"]>,
  Present<New.paths["/v1/vaults/{vaultId}/operations/prepared"]>
> = true
export const _1634: Eq<
  keyof Old.paths["/v1/vaults/{vaultId}/operations/prepared"]["get"]["responses"],
  keyof New.paths["/v1/vaults/{vaultId}/operations/prepared"]["get"]["responses"]
> = true
export const _1635: Eq<
  Old.paths["/v1/vaults/{vaultId}/operations/prepared"]["get"]["parameters"]["path"],
  New.paths["/v1/vaults/{vaultId}/operations/prepared"]["get"]["parameters"]["path"]
> = true
export const _1636: Eq<
  Present<Old.paths["/v1/vaults/operations/signed"]>,
  Present<New.paths["/v1/vaults/operations/signed"]>
> = true
export const _1637: Eq<
  keyof Old.paths["/v1/vaults/operations/signed"]["post"]["responses"],
  keyof New.paths["/v1/vaults/operations/signed"]["post"]["responses"]
> = true
export const _1638: Eq<
  Old.paths["/v1/vaults/operations/signed"]["post"]["responses"][400]["content"]["application/json"],
  New.paths["/v1/vaults/operations/signed"]["post"]["responses"][400]["content"]["application/json"]
> = true
export const _1639: Eq<
  Present<Old.paths["/v1/domains/{domainId}/virtual-ledgers"]>,
  Present<New.paths["/v1/domains/{domainId}/virtual-ledgers"]>
> = true
export const _1640: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["responses"]
> = true
export const _1641: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["parameters"]["path"]
> = true
export const _1642: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["parameters"]["query"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["parameters"]["query"]
> = true
export const _1643: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1644: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["responses"]
> = true
export const _1645: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["parameters"]["path"]
> = true
export const _1646: Eq<
  NonNullable<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1647: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["responses"][201]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers"]["post"]["responses"][201]["content"]["application/json"]
> = true
export const _1648: Eq<
  Present<Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]>,
  Present<New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]>
> = true
export const _1649: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["get"]["responses"]
> = true
export const _1650: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["get"]["parameters"]["path"]
> = true
export const _1651: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1652: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["put"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["put"]["responses"]
> = true
export const _1653: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["put"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["put"]["parameters"]["path"]
> = true
export const _1654: Eq<
  NonNullable<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["put"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}"]["put"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1655: Eq<
  Present<Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]>,
  Present<New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]>
> = true
export const _1656: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]["get"]["responses"]
> = true
export const _1657: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]["get"]["parameters"]["path"]
> = true
export const _1658: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1659: Eq<
  Present<Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]>,
  Present<New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]>
> = true
export const _1660: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["responses"]
> = true
export const _1661: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["parameters"]["path"]
> = true
export const _1662: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["parameters"]["query"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["parameters"]["query"]
> = true
export const _1663: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1664: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["responses"]
> = true
export const _1665: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["parameters"]["path"]
> = true
export const _1666: Eq<
  NonNullable<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1667: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["responses"][201]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts"]["post"]["responses"][201]["content"]["application/json"]
> = true
export const _1668: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]
  >
> = true
export const _1669: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]["put"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]["put"]["responses"]
> = true
export const _1670: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]["put"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]["put"]["parameters"]["path"]
> = true
export const _1671: Eq<
  NonNullable<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]["put"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}"]["put"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1672: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]
  >
> = true
export const _1673: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]["get"]["responses"]
> = true
export const _1674: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]["get"]["parameters"]["path"]
> = true
export const _1675: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1676: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]
  >
> = true
export const _1677: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]["post"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]["post"]["responses"]
> = true
export const _1678: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]["post"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]["post"]["parameters"]["path"]
> = true
export const _1679: Eq<
  NonNullable<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]["post"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources"]["post"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1680: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]
  >
> = true
export const _1681: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["responses"]
> = true
export const _1682: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["parameters"]["path"]
> = true
export const _1683: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["parameters"]["query"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["parameters"]["query"]
> = true
export const _1684: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1685: Eq<
  Present<Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]>,
  Present<New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]>
> = true
export const _1686: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["responses"]
> = true
export const _1687: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["parameters"]["path"]
> = true
export const _1688: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["parameters"]["query"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["parameters"]["query"]
> = true
export const _1689: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1690: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["responses"]
> = true
export const _1691: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["parameters"]["path"]
> = true
export const _1692: Eq<
  NonNullable<
    Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1693: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["responses"][201]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations"]["post"]["responses"][201]["content"]["application/json"]
> = true
export const _1694: Eq<
  Present<Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]>,
  Present<New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]>
> = true
export const _1695: Eq<
  keyof Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["responses"],
  keyof New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["responses"]
> = true
export const _1696: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["parameters"]["path"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["parameters"]["path"]
> = true
export const _1697: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["parameters"]["query"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["parameters"]["query"]
> = true
export const _1698: Eq<
  Old.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _1699: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/providers"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/providers"]>
> = true
export const _1700: Eq<
  keyof Old.operations["GetAllProvidersForDomain"]["responses"],
  keyof New.operations["GetAllProvidersForDomain"]["responses"]
> = true
export const _1701: Eq<
  Old.operations["GetAllProvidersForDomain"]["parameters"]["path"],
  New.operations["GetAllProvidersForDomain"]["parameters"]["path"]
> = true
export const _1702: Eq<
  Old.operations["GetAllProvidersForDomain"]["responses"][200]["content"]["application/json"],
  New.operations["GetAllProvidersForDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1703: Eq<
  keyof Old.operations["ConnectProvider"]["responses"],
  keyof New.operations["ConnectProvider"]["responses"]
> = true
export const _1704: Eq<
  Old.operations["ConnectProvider"]["parameters"]["path"],
  New.operations["ConnectProvider"]["parameters"]["path"]
> = true
export const _1705: Eq<
  NonNullable<Old.operations["ConnectProvider"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["ConnectProvider"]["requestBody"]>["content"]["application/json"]
> = true
export const _1706: Eq<
  Old.operations["ConnectProvider"]["responses"][202]["content"]["application/json"],
  New.operations["ConnectProvider"]["responses"][202]["content"]["application/json"]
> = true
export const _1707: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/providers/{provider}/screening-rules"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/providers/{provider}/screening-rules"]>
> = true
export const _1708: Eq<
  keyof Old.operations["GetScreeningRulesForDomainAndProvider"]["responses"],
  keyof New.operations["GetScreeningRulesForDomainAndProvider"]["responses"]
> = true
export const _1709: Eq<
  Old.operations["GetScreeningRulesForDomainAndProvider"]["parameters"]["path"],
  New.operations["GetScreeningRulesForDomainAndProvider"]["parameters"]["path"]
> = true
export const _1710: Eq<
  Old.operations["GetScreeningRulesForDomainAndProvider"]["responses"][200]["content"]["application/json"],
  New.operations["GetScreeningRulesForDomainAndProvider"]["responses"][200]["content"]["application/json"]
> = true
export const _1711: Eq<
  keyof Old.operations["ConfigureScreeningRulesForDomainAndProvider"]["responses"],
  keyof New.operations["ConfigureScreeningRulesForDomainAndProvider"]["responses"]
> = true
export const _1712: Eq<
  Old.operations["ConfigureScreeningRulesForDomainAndProvider"]["parameters"]["path"],
  New.operations["ConfigureScreeningRulesForDomainAndProvider"]["parameters"]["path"]
> = true
export const _1713: Eq<
  NonNullable<
    Old.operations["ConfigureScreeningRulesForDomainAndProvider"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["ConfigureScreeningRulesForDomainAndProvider"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1714: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/compliance/providers/{provider}/toggle-preview-screening"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/compliance/providers/{provider}/toggle-preview-screening"]
  >
> = true
export const _1715: Eq<
  keyof Old.operations["TogglePreviewScreening"]["responses"],
  keyof New.operations["TogglePreviewScreening"]["responses"]
> = true
export const _1716: Eq<
  Old.operations["TogglePreviewScreening"]["parameters"]["path"],
  New.operations["TogglePreviewScreening"]["parameters"]["path"]
> = true
export const _1717: Eq<
  Old.operations["TogglePreviewScreening"]["parameters"]["query"],
  New.operations["TogglePreviewScreening"]["parameters"]["query"]
> = true
export const _1718: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/providers/{provider}/pause-connection"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/providers/{provider}/pause-connection"]>
> = true
export const _1719: Eq<
  keyof Old.operations["PauseProviderConnection"]["responses"],
  keyof New.operations["PauseProviderConnection"]["responses"]
> = true
export const _1720: Eq<
  Old.operations["PauseProviderConnection"]["parameters"]["path"],
  New.operations["PauseProviderConnection"]["parameters"]["path"]
> = true
export const _1721: Eq<
  Old.operations["PauseProviderConnection"]["parameters"]["query"],
  New.operations["PauseProviderConnection"]["parameters"]["query"]
> = true
export const _1722: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/policy"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/policy"]>
> = true
export const _1723: Eq<
  keyof Old.operations["CreatePolicyPayload"]["responses"],
  keyof New.operations["CreatePolicyPayload"]["responses"]
> = true
export const _1724: Eq<
  Old.operations["CreatePolicyPayload"]["parameters"]["path"],
  New.operations["CreatePolicyPayload"]["parameters"]["path"]
> = true
export const _1725: Eq<
  NonNullable<Old.operations["CreatePolicyPayload"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["CreatePolicyPayload"]["requestBody"]>["content"]["application/json"]
> = true
export const _1726: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/domain"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/domain"]>
> = true
export const _1727: Eq<
  keyof Old.operations["CreateDomainPayload"]["responses"],
  keyof New.operations["CreateDomainPayload"]["responses"]
> = true
export const _1728: Eq<
  Old.operations["CreateDomainPayload"]["parameters"]["path"],
  New.operations["CreateDomainPayload"]["parameters"]["path"]
> = true
export const _1729: Eq<
  NonNullable<Old.operations["CreateDomainPayload"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["CreateDomainPayload"]["requestBody"]>["content"]["application/json"]
> = true
export const _1730: Eq<
  keyof Old.operations["DeleteComplianceDomain"]["responses"],
  keyof New.operations["DeleteComplianceDomain"]["responses"]
> = true
export const _1731: Eq<
  Old.operations["DeleteComplianceDomain"]["parameters"]["path"],
  New.operations["DeleteComplianceDomain"]["parameters"]["path"]
> = true
export const _1732: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/domain/validation"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/domain/validation"]>
> = true
export const _1733: Eq<
  keyof Old.operations["ValidateComplianceDomainCreation"]["responses"],
  keyof New.operations["ValidateComplianceDomainCreation"]["responses"]
> = true
export const _1734: Eq<
  Old.operations["ValidateComplianceDomainCreation"]["parameters"]["path"],
  New.operations["ValidateComplianceDomainCreation"]["parameters"]["path"]
> = true
export const _1735: Eq<
  NonNullable<
    Old.operations["ValidateComplianceDomainCreation"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["ValidateComplianceDomainCreation"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1736: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/analysis"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/analysis"]>
> = true
export const _1737: Eq<
  keyof Old.operations["analysis"]["responses"],
  keyof New.operations["analysis"]["responses"]
> = true
export const _1738: Eq<
  Old.operations["analysis"]["parameters"]["path"],
  New.operations["analysis"]["parameters"]["path"]
> = true
export const _1739: Eq<
  NonNullable<Old.operations["analysis"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["analysis"]["requestBody"]>["content"]["application/json"]
> = true
export const _1740: Eq<
  Old.operations["analysis"]["responses"][200]["content"]["application/json"],
  New.operations["analysis"]["responses"][200]["content"]["application/json"]
> = true
export const _1741: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/analysis/preview"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/analysis/preview"]>
> = true
export const _1742: Eq<
  keyof Old.operations["PreviewAnalysis"]["responses"],
  keyof New.operations["PreviewAnalysis"]["responses"]
> = true
export const _1743: Eq<
  Old.operations["PreviewAnalysis"]["parameters"]["path"],
  New.operations["PreviewAnalysis"]["parameters"]["path"]
> = true
export const _1744: Eq<
  NonNullable<Old.operations["PreviewAnalysis"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["PreviewAnalysis"]["requestBody"]>["content"]["application/json"]
> = true
export const _1745: Eq<
  Old.operations["PreviewAnalysis"]["responses"][200]["content"]["application/json"],
  New.operations["PreviewAnalysis"]["responses"][200]["content"]["application/json"]
> = true
export const _1746: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/compliance/transactionType/{transactionType}/exception-role"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/compliance/transactionType/{transactionType}/exception-role"]
  >
> = true
export const _1747: Eq<
  keyof Old.operations["GetExceptionRole"]["responses"],
  keyof New.operations["GetExceptionRole"]["responses"]
> = true
export const _1748: Eq<
  Old.operations["GetExceptionRole"]["parameters"]["path"],
  New.operations["GetExceptionRole"]["parameters"]["path"]
> = true
export const _1749: Eq<
  Old.operations["GetExceptionRole"]["responses"][200]["content"]["application/json"],
  New.operations["GetExceptionRole"]["responses"][200]["content"]["application/json"]
> = true
export const _1750: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/provider-connection"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/provider-connection"]>
> = true
export const _1751: Eq<
  keyof Old.operations["GetAllProviderConnectionForDomain"]["responses"],
  keyof New.operations["GetAllProviderConnectionForDomain"]["responses"]
> = true
export const _1752: Eq<
  Old.operations["GetAllProviderConnectionForDomain"]["parameters"]["path"],
  New.operations["GetAllProviderConnectionForDomain"]["parameters"]["path"]
> = true
export const _1753: Eq<
  Old.operations["GetAllProviderConnectionForDomain"]["responses"][200]["content"]["application/json"],
  New.operations["GetAllProviderConnectionForDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1754: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/compliance/policy/{policyType}/transaction/{transactionType}"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/compliance/policy/{policyType}/transaction/{transactionType}"]
  >
> = true
export const _1755: Eq<
  keyof Old.operations["GetPolicy"]["responses"],
  keyof New.operations["GetPolicy"]["responses"]
> = true
export const _1756: Eq<
  Old.operations["GetPolicy"]["parameters"]["path"],
  New.operations["GetPolicy"]["parameters"]["path"]
> = true
export const _1757: Eq<
  Old.operations["GetPolicy"]["responses"][200]["content"]["application/json"],
  New.operations["GetPolicy"]["responses"][200]["content"]["application/json"]
> = true
export const _1758: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/providers/{provider}"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/providers/{provider}"]>
> = true
export const _1759: Eq<
  keyof Old.operations["DeleteProviderConnectionAndScreeningRules"]["responses"],
  keyof New.operations["DeleteProviderConnectionAndScreeningRules"]["responses"]
> = true
export const _1760: Eq<
  Old.operations["DeleteProviderConnectionAndScreeningRules"]["parameters"]["path"],
  New.operations["DeleteProviderConnectionAndScreeningRules"]["parameters"]["path"]
> = true
export const _1761: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages"]>
> = true
export const _1762: Eq<
  keyof Old.operations["CreateTravelRuleTransfer"]["responses"],
  keyof New.operations["CreateTravelRuleTransfer"]["responses"]
> = true
export const _1763: Eq<
  Old.operations["CreateTravelRuleTransfer"]["parameters"]["path"],
  New.operations["CreateTravelRuleTransfer"]["parameters"]["path"]
> = true
export const _1764: Eq<
  NonNullable<
    Old.operations["CreateTravelRuleTransfer"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["CreateTravelRuleTransfer"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1765: Eq<
  Old.operations["CreateTravelRuleTransfer"]["responses"][200]["content"]["application/json"],
  New.operations["CreateTravelRuleTransfer"]["responses"][200]["content"]["application/json"]
> = true
export const _1766: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}"]
  >
> = true
export const _1767: Eq<
  keyof Old.operations["GetTravelRuleTransfer"]["responses"],
  keyof New.operations["GetTravelRuleTransfer"]["responses"]
> = true
export const _1768: Eq<
  Old.operations["GetTravelRuleTransfer"]["parameters"]["path"],
  New.operations["GetTravelRuleTransfer"]["parameters"]["path"]
> = true
export const _1769: Eq<
  Old.operations["GetTravelRuleTransfer"]["parameters"]["query"],
  New.operations["GetTravelRuleTransfer"]["parameters"]["query"]
> = true
export const _1770: Eq<
  Old.operations["GetTravelRuleTransfer"]["responses"][200]["content"]["application/json"],
  New.operations["GetTravelRuleTransfer"]["responses"][200]["content"]["application/json"]
> = true
export const _1771: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/pii"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/pii"]
  >
> = true
export const _1772: Eq<
  keyof Old.operations["AppendPIIToTransfer"]["responses"],
  keyof New.operations["AppendPIIToTransfer"]["responses"]
> = true
export const _1773: Eq<
  Old.operations["AppendPIIToTransfer"]["parameters"]["path"],
  New.operations["AppendPIIToTransfer"]["parameters"]["path"]
> = true
export const _1774: Eq<
  NonNullable<Old.operations["AppendPIIToTransfer"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["AppendPIIToTransfer"]["requestBody"]>["content"]["application/json"]
> = true
export const _1775: Eq<
  Old.operations["AppendPIIToTransfer"]["responses"][200]["content"]["application/json"],
  New.operations["AppendPIIToTransfer"]["responses"][200]["content"]["application/json"]
> = true
export const _1776: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/encrypted-pii"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/encrypted-pii"]
  >
> = true
export const _1777: Eq<
  keyof Old.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["responses"],
  keyof New.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["responses"]
> = true
export const _1778: Eq<
  Old.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["parameters"]["path"],
  New.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["parameters"]["path"]
> = true
export const _1779: Eq<
  Old.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["parameters"]["query"],
  New.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["parameters"]["query"]
> = true
export const _1780: Eq<
  NonNullable<
    Old.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1781: Eq<
  Old.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["responses"][202]["content"]["application/json"],
  New.operations["PresentEncryptedPIIToTransferWithoutPolicy"]["responses"][202]["content"]["application/json"]
> = true
export const _1782: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/policies/{travelRulePolicyId}/encrypted-pii"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/policies/{travelRulePolicyId}/encrypted-pii"]
  >
> = true
export const _1783: Eq<
  keyof Old.operations["PresentEncryptedPIIToTransfer"]["responses"],
  keyof New.operations["PresentEncryptedPIIToTransfer"]["responses"]
> = true
export const _1784: Eq<
  Old.operations["PresentEncryptedPIIToTransfer"]["parameters"]["path"],
  New.operations["PresentEncryptedPIIToTransfer"]["parameters"]["path"]
> = true
export const _1785: Eq<
  Old.operations["PresentEncryptedPIIToTransfer"]["parameters"]["query"],
  New.operations["PresentEncryptedPIIToTransfer"]["parameters"]["query"]
> = true
export const _1786: Eq<
  NonNullable<
    Old.operations["PresentEncryptedPIIToTransfer"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["PresentEncryptedPIIToTransfer"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1787: Eq<
  Old.operations["PresentEncryptedPIIToTransfer"]["responses"][202]["content"]["application/json"],
  New.operations["PresentEncryptedPIIToTransfer"]["responses"][202]["content"]["application/json"]
> = true
export const _1788: Eq<
  Present<Old.paths["/v1/domains/{domainId}/compliance/travel-rule/details"]>,
  Present<New.paths["/v1/domains/{domainId}/compliance/travel-rule/details"]>
> = true
export const _1789: Eq<
  keyof Old.operations["GetTravelRuleDetails"]["responses"],
  keyof New.operations["GetTravelRuleDetails"]["responses"]
> = true
export const _1790: Eq<
  Old.operations["GetTravelRuleDetails"]["parameters"]["path"],
  New.operations["GetTravelRuleDetails"]["parameters"]["path"]
> = true
export const _1791: Eq<
  NonNullable<Old.operations["GetTravelRuleDetails"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["GetTravelRuleDetails"]["requestBody"]>["content"]["application/json"]
> = true
export const _1792: Eq<
  Old.operations["GetTravelRuleDetails"]["responses"][200]["content"]["application/json"],
  New.operations["GetTravelRuleDetails"]["responses"][200]["content"]["application/json"]
> = true
export const _1793: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/relationships"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/relationships"]
  >
> = true
export const _1794: Eq<
  keyof Old.operations["ListRelationships"]["responses"],
  keyof New.operations["ListRelationships"]["responses"]
> = true
export const _1795: Eq<
  Old.operations["ListRelationships"]["parameters"]["path"],
  New.operations["ListRelationships"]["parameters"]["path"]
> = true
export const _1796: Eq<
  Old.operations["ListRelationships"]["parameters"]["query"],
  New.operations["ListRelationships"]["parameters"]["query"]
> = true
export const _1797: Eq<
  Old.operations["ListRelationships"]["responses"][200]["content"]["application/json"],
  New.operations["ListRelationships"]["responses"][200]["content"]["application/json"]
> = true
export const _1798: Eq<
  keyof Old.operations["CreateRelationship"]["responses"],
  keyof New.operations["CreateRelationship"]["responses"]
> = true
export const _1799: Eq<
  Old.operations["CreateRelationship"]["parameters"]["path"],
  New.operations["CreateRelationship"]["parameters"]["path"]
> = true
export const _1800: Eq<
  NonNullable<Old.operations["CreateRelationship"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["CreateRelationship"]["requestBody"]>["content"]["application/json"]
> = true
export const _1801: Eq<
  Present<Old.paths["/v1/domains/{domainId}/channels"]>,
  Present<New.paths["/v1/domains/{domainId}/channels"]>
> = true
export const _1802: Eq<
  keyof Old.operations["getAllChannels"]["responses"],
  keyof New.operations["getAllChannels"]["responses"]
> = true
export const _1803: Eq<
  Old.operations["getAllChannels"]["parameters"]["path"],
  New.operations["getAllChannels"]["parameters"]["path"]
> = true
export const _1804: Eq<
  keyof Old.operations["createChannel"]["responses"],
  keyof New.operations["createChannel"]["responses"]
> = true
export const _1805: Eq<
  Old.operations["createChannel"]["parameters"]["path"],
  New.operations["createChannel"]["parameters"]["path"]
> = true
export const _1806: Eq<
  NonNullable<Old.operations["createChannel"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["createChannel"]["requestBody"]>["content"]["application/json"]
> = true
export const _1807: Eq<
  Present<Old.paths["/v1/domains/{domainId}/channels/{channelId}/test"]>,
  Present<New.paths["/v1/domains/{domainId}/channels/{channelId}/test"]>
> = true
export const _1808: Eq<
  keyof Old.operations["testChannel"]["responses"],
  keyof New.operations["testChannel"]["responses"]
> = true
export const _1809: Eq<
  Old.operations["testChannel"]["parameters"]["path"],
  New.operations["testChannel"]["parameters"]["path"]
> = true
export const _1810: Eq<
  Present<Old.paths["/v1/domains/{domainId}/channels/{channelId}"]>,
  Present<New.paths["/v1/domains/{domainId}/channels/{channelId}"]>
> = true
export const _1811: Eq<
  keyof Old.operations["getChannel"]["responses"],
  keyof New.operations["getChannel"]["responses"]
> = true
export const _1812: Eq<
  Old.operations["getChannel"]["parameters"]["path"],
  New.operations["getChannel"]["parameters"]["path"]
> = true
export const _1813: Eq<
  keyof Old.operations["deleteChannel"]["responses"],
  keyof New.operations["deleteChannel"]["responses"]
> = true
export const _1814: Eq<
  Old.operations["deleteChannel"]["parameters"]["path"],
  New.operations["deleteChannel"]["parameters"]["path"]
> = true
export const _1815: Eq<
  keyof Old.operations["updateChannel"]["responses"],
  keyof New.operations["updateChannel"]["responses"]
> = true
export const _1816: Eq<
  Old.operations["updateChannel"]["parameters"]["path"],
  New.operations["updateChannel"]["parameters"]["path"]
> = true
export const _1817: Eq<
  NonNullable<Old.operations["updateChannel"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["updateChannel"]["requestBody"]>["content"]["application/json"]
> = true
export const _1818: Eq<
  Present<Old.paths["/v1/domains/{domainId}/channels/{channelId}/events"]>,
  Present<New.paths["/v1/domains/{domainId}/channels/{channelId}/events"]>
> = true
export const _1819: Eq<
  keyof Old.operations["getAllChannelEvents"]["responses"],
  keyof New.operations["getAllChannelEvents"]["responses"]
> = true
export const _1820: Eq<
  Old.operations["getAllChannelEvents"]["parameters"]["path"],
  New.operations["getAllChannelEvents"]["parameters"]["path"]
> = true
export const _1821: Eq<
  Present<Old.paths["/v1/domains/{domainId}/channels/{channelId}/events/{eventId}"]>,
  Present<New.paths["/v1/domains/{domainId}/channels/{channelId}/events/{eventId}"]>
> = true
export const _1822: Eq<
  keyof Old.operations["getEvent"]["responses"],
  keyof New.operations["getEvent"]["responses"]
> = true
export const _1823: Eq<
  Old.operations["getEvent"]["parameters"]["path"],
  New.operations["getEvent"]["parameters"]["path"]
> = true
export const _1824: Eq<
  Present<Old.paths["/v1/domains/{domainId}/channels/events"]>,
  Present<New.paths["/v1/domains/{domainId}/channels/events"]>
> = true
export const _1825: Eq<
  keyof Old.operations["getAllEvents"]["responses"],
  keyof New.operations["getAllEvents"]["responses"]
> = true
export const _1826: Eq<
  Old.operations["getAllEvents"]["parameters"]["path"],
  New.operations["getAllEvents"]["parameters"]["path"]
> = true
export const _1827: Eq<
  Present<Old.paths["/v1/domain/{domainId}/account/{accountId}/sponsor"]>,
  Present<New.paths["/v1/domain/{domainId}/account/{accountId}/sponsor"]>
> = true
export const _1828: Eq<
  keyof Old.operations["SponsorController_getSponsor_legacyDomain"]["responses"],
  keyof New.operations["SponsorController_getSponsor_legacyDomain"]["responses"]
> = true
export const _1829: Eq<
  Old.operations["SponsorController_getSponsor_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorController_getSponsor_legacyDomain"]["parameters"]["path"]
> = true
export const _1830: Eq<
  Old.operations["SponsorController_getSponsor_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorController_getSponsor_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1831: Eq<
  keyof Old.operations["SponsorController_updateSponsor_legacyDomain"]["responses"],
  keyof New.operations["SponsorController_updateSponsor_legacyDomain"]["responses"]
> = true
export const _1832: Eq<
  Old.operations["SponsorController_updateSponsor_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorController_updateSponsor_legacyDomain"]["parameters"]["path"]
> = true
export const _1833: Eq<
  NonNullable<
    Old.operations["SponsorController_updateSponsor_legacyDomain"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["SponsorController_updateSponsor_legacyDomain"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1834: Eq<
  Old.operations["SponsorController_updateSponsor_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorController_updateSponsor_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1835: Eq<
  keyof Old.operations["SponsorController_createSponsor_legacyDomain"]["responses"],
  keyof New.operations["SponsorController_createSponsor_legacyDomain"]["responses"]
> = true
export const _1836: Eq<
  Old.operations["SponsorController_createSponsor_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorController_createSponsor_legacyDomain"]["parameters"]["path"]
> = true
export const _1837: Eq<
  NonNullable<
    Old.operations["SponsorController_createSponsor_legacyDomain"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["SponsorController_createSponsor_legacyDomain"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1838: Eq<
  Old.operations["SponsorController_createSponsor_legacyDomain"]["responses"][201]["content"]["application/json"],
  New.operations["SponsorController_createSponsor_legacyDomain"]["responses"][201]["content"]["application/json"]
> = true
export const _1839: Eq<
  keyof Old.operations["SponsorController_deleteSponsor_legacyDomain"]["responses"],
  keyof New.operations["SponsorController_deleteSponsor_legacyDomain"]["responses"]
> = true
export const _1840: Eq<
  Old.operations["SponsorController_deleteSponsor_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorController_deleteSponsor_legacyDomain"]["parameters"]["path"]
> = true
export const _1841: Eq<
  Old.operations["SponsorController_deleteSponsor_legacyDomain"]["parameters"]["query"],
  New.operations["SponsorController_deleteSponsor_legacyDomain"]["parameters"]["query"]
> = true
export const _1842: Eq<
  Present<Old.paths["/v1/domain/{domainId}/sponsors"]>,
  Present<New.paths["/v1/domain/{domainId}/sponsors"]>
> = true
export const _1843: Eq<
  keyof Old.operations["SponsorsController_listSponsors_legacyDomain"]["responses"],
  keyof New.operations["SponsorsController_listSponsors_legacyDomain"]["responses"]
> = true
export const _1844: Eq<
  Old.operations["SponsorsController_listSponsors_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorsController_listSponsors_legacyDomain"]["parameters"]["path"]
> = true
export const _1845: Eq<
  Old.operations["SponsorsController_listSponsors_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_listSponsors_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1846: Eq<
  Present<Old.paths["/v1/domain/{domainId}/sponsors/account/{accountId}/sponsor"]>,
  Present<New.paths["/v1/domain/{domainId}/sponsors/account/{accountId}/sponsor"]>
> = true
export const _1847: Eq<
  keyof Old.operations["SponsorsController_getAccountSponsor_legacyDomain"]["responses"],
  keyof New.operations["SponsorsController_getAccountSponsor_legacyDomain"]["responses"]
> = true
export const _1848: Eq<
  Old.operations["SponsorsController_getAccountSponsor_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorsController_getAccountSponsor_legacyDomain"]["parameters"]["path"]
> = true
export const _1849: Eq<
  Old.operations["SponsorsController_getAccountSponsor_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_getAccountSponsor_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1850: Eq<
  Present<Old.paths["/v1/domain/{domainId}/sponsors/domain-sponsor"]>,
  Present<New.paths["/v1/domain/{domainId}/sponsors/domain-sponsor"]>
> = true
export const _1851: Eq<
  keyof Old.operations["SponsorsController_getDomainSponsor_legacyDomain"]["responses"],
  keyof New.operations["SponsorsController_getDomainSponsor_legacyDomain"]["responses"]
> = true
export const _1852: Eq<
  Old.operations["SponsorsController_getDomainSponsor_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorsController_getDomainSponsor_legacyDomain"]["parameters"]["path"]
> = true
export const _1853: Eq<
  Old.operations["SponsorsController_getDomainSponsor_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_getDomainSponsor_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1854: Eq<
  Present<Old.paths["/v1/domain/{domainId}/sponsors/sponsored-accounts"]>,
  Present<New.paths["/v1/domain/{domainId}/sponsors/sponsored-accounts"]>
> = true
export const _1855: Eq<
  keyof Old.operations["SponsorsController_listSponsoredAccounts_legacyDomain"]["responses"],
  keyof New.operations["SponsorsController_listSponsoredAccounts_legacyDomain"]["responses"]
> = true
export const _1856: Eq<
  Old.operations["SponsorsController_listSponsoredAccounts_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorsController_listSponsoredAccounts_legacyDomain"]["parameters"]["path"]
> = true
export const _1857: Eq<
  Old.operations["SponsorsController_listSponsoredAccounts_legacyDomain"]["parameters"]["query"],
  New.operations["SponsorsController_listSponsoredAccounts_legacyDomain"]["parameters"]["query"]
> = true
export const _1858: Eq<
  Old.operations["SponsorsController_listSponsoredAccounts_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_listSponsoredAccounts_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1859: Eq<
  Present<Old.paths["/v1/domain/{domainId}/sponsors/sponsored-domains"]>,
  Present<New.paths["/v1/domain/{domainId}/sponsors/sponsored-domains"]>
> = true
export const _1860: Eq<
  keyof Old.operations["SponsorsController_listSponsoredDomains_legacyDomain"]["responses"],
  keyof New.operations["SponsorsController_listSponsoredDomains_legacyDomain"]["responses"]
> = true
export const _1861: Eq<
  Old.operations["SponsorsController_listSponsoredDomains_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorsController_listSponsoredDomains_legacyDomain"]["parameters"]["path"]
> = true
export const _1862: Eq<
  Old.operations["SponsorsController_listSponsoredDomains_legacyDomain"]["parameters"]["query"],
  New.operations["SponsorsController_listSponsoredDomains_legacyDomain"]["parameters"]["query"]
> = true
export const _1863: Eq<
  Old.operations["SponsorsController_listSponsoredDomains_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_listSponsoredDomains_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1864: Eq<
  Present<Old.paths["/v1/domain/{domainId}/account/{entityId}/sponsorable-domains"]>,
  Present<New.paths["/v1/domain/{domainId}/account/{entityId}/sponsorable-domains"]>
> = true
export const _1865: Eq<
  keyof Old.operations["SponsorListController_getSponsorableDomains_legacyDomain"]["responses"],
  keyof New.operations["SponsorListController_getSponsorableDomains_legacyDomain"]["responses"]
> = true
export const _1866: Eq<
  Old.operations["SponsorListController_getSponsorableDomains_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorListController_getSponsorableDomains_legacyDomain"]["parameters"]["path"]
> = true
export const _1867: Eq<
  Old.operations["SponsorListController_getSponsorableDomains_legacyDomain"]["parameters"]["query"],
  New.operations["SponsorListController_getSponsorableDomains_legacyDomain"]["parameters"]["query"]
> = true
export const _1868: Eq<
  Old.operations["SponsorListController_getSponsorableDomains_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorListController_getSponsorableDomains_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1869: Eq<
  Present<Old.paths["/v1/domain/{domainId}/account/{entityId}/sponsored-domains"]>,
  Present<New.paths["/v1/domain/{domainId}/account/{entityId}/sponsored-domains"]>
> = true
export const _1870: Eq<
  keyof Old.operations["SponsorListController_addSponsoredDomains_legacyDomain"]["responses"],
  keyof New.operations["SponsorListController_addSponsoredDomains_legacyDomain"]["responses"]
> = true
export const _1871: Eq<
  Old.operations["SponsorListController_addSponsoredDomains_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorListController_addSponsoredDomains_legacyDomain"]["parameters"]["path"]
> = true
export const _1872: Eq<
  NonNullable<
    Old.operations["SponsorListController_addSponsoredDomains_legacyDomain"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["SponsorListController_addSponsoredDomains_legacyDomain"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1873: Eq<
  Old.operations["SponsorListController_addSponsoredDomains_legacyDomain"]["responses"][201]["content"]["application/json"],
  New.operations["SponsorListController_addSponsoredDomains_legacyDomain"]["responses"][201]["content"]["application/json"]
> = true
export const _1874: Eq<
  Present<Old.paths["/v1/domain/{domainId}/account/{entityId}/sponsorable-accounts"]>,
  Present<New.paths["/v1/domain/{domainId}/account/{entityId}/sponsorable-accounts"]>
> = true
export const _1875: Eq<
  keyof Old.operations["SponsorListController_getSponsorableAccounts_legacyDomain"]["responses"],
  keyof New.operations["SponsorListController_getSponsorableAccounts_legacyDomain"]["responses"]
> = true
export const _1876: Eq<
  Old.operations["SponsorListController_getSponsorableAccounts_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorListController_getSponsorableAccounts_legacyDomain"]["parameters"]["path"]
> = true
export const _1877: Eq<
  Old.operations["SponsorListController_getSponsorableAccounts_legacyDomain"]["parameters"]["query"],
  New.operations["SponsorListController_getSponsorableAccounts_legacyDomain"]["parameters"]["query"]
> = true
export const _1878: Eq<
  Old.operations["SponsorListController_getSponsorableAccounts_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorListController_getSponsorableAccounts_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1879: Eq<
  Present<Old.paths["/v1/domain/{domainId}/account/{entityId}/sponsored-accounts"]>,
  Present<New.paths["/v1/domain/{domainId}/account/{entityId}/sponsored-accounts"]>
> = true
export const _1880: Eq<
  keyof Old.operations["SponsorListController_addSponsoredAccounts_legacyDomain"]["responses"],
  keyof New.operations["SponsorListController_addSponsoredAccounts_legacyDomain"]["responses"]
> = true
export const _1881: Eq<
  Old.operations["SponsorListController_addSponsoredAccounts_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorListController_addSponsoredAccounts_legacyDomain"]["parameters"]["path"]
> = true
export const _1882: Eq<
  NonNullable<
    Old.operations["SponsorListController_addSponsoredAccounts_legacyDomain"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["SponsorListController_addSponsoredAccounts_legacyDomain"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1883: Eq<
  Old.operations["SponsorListController_addSponsoredAccounts_legacyDomain"]["responses"][201]["content"]["application/json"],
  New.operations["SponsorListController_addSponsoredAccounts_legacyDomain"]["responses"][201]["content"]["application/json"]
> = true
export const _1884: Eq<
  Present<Old.paths["/v1/domain/{domainId}/sponsor/events"]>,
  Present<New.paths["/v1/domain/{domainId}/sponsor/events"]>
> = true
export const _1885: Eq<
  keyof Old.operations["EventController_getEvents_legacyDomain"]["responses"],
  keyof New.operations["EventController_getEvents_legacyDomain"]["responses"]
> = true
export const _1886: Eq<
  Old.operations["EventController_getEvents_legacyDomain"]["parameters"]["path"],
  New.operations["EventController_getEvents_legacyDomain"]["parameters"]["path"]
> = true
export const _1887: Eq<
  Old.operations["EventController_getEvents_legacyDomain"]["parameters"]["query"],
  New.operations["EventController_getEvents_legacyDomain"]["parameters"]["query"]
> = true
export const _1888: Eq<
  Old.operations["EventController_getEvents_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["EventController_getEvents_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1889: Eq<Present<Old.paths["/v1/health"]>, Present<New.paths["/v1/health"]>> = true
export const _1890: Eq<
  keyof Old.operations["HealthController_liveness"]["responses"],
  keyof New.operations["HealthController_liveness"]["responses"]
> = true
export const _1891: Eq<
  Old.operations["HealthController_liveness"]["responses"][200]["content"]["application/json"],
  New.operations["HealthController_liveness"]["responses"][200]["content"]["application/json"]
> = true
export const _1892: Eq<
  Old.operations["HealthController_liveness"]["responses"][503]["content"]["application/json"],
  New.operations["HealthController_liveness"]["responses"][503]["content"]["application/json"]
> = true
export const _1893: Eq<Present<Old.paths["/v1/ready"]>, Present<New.paths["/v1/ready"]>> = true
export const _1894: Eq<
  keyof Old.operations["HealthController_readiness"]["responses"],
  keyof New.operations["HealthController_readiness"]["responses"]
> = true
export const _1895: Eq<
  Old.operations["HealthController_readiness"]["responses"][200]["content"]["application/json"],
  New.operations["HealthController_readiness"]["responses"][200]["content"]["application/json"]
> = true
export const _1896: Eq<
  Old.operations["HealthController_readiness"]["responses"][503]["content"]["application/json"],
  New.operations["HealthController_readiness"]["responses"][503]["content"]["application/json"]
> = true
export const _1897: Eq<
  Present<Old.paths["/v1/domains/{domainId}/account/{accountId}/sponsor"]>,
  Present<New.paths["/v1/domains/{domainId}/account/{accountId}/sponsor"]>
> = true
export const _1898: Eq<
  keyof Old.operations["SponsorController_getSponsor"]["responses"],
  keyof New.operations["SponsorController_getSponsor"]["responses"]
> = true
export const _1899: Eq<
  Old.operations["SponsorController_getSponsor"]["parameters"]["path"],
  New.operations["SponsorController_getSponsor"]["parameters"]["path"]
> = true
export const _1900: Eq<
  Old.operations["SponsorController_getSponsor"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorController_getSponsor"]["responses"][200]["content"]["application/json"]
> = true
export const _1901: Eq<
  keyof Old.operations["SponsorController_updateSponsor"]["responses"],
  keyof New.operations["SponsorController_updateSponsor"]["responses"]
> = true
export const _1902: Eq<
  Old.operations["SponsorController_updateSponsor"]["parameters"]["path"],
  New.operations["SponsorController_updateSponsor"]["parameters"]["path"]
> = true
export const _1903: Eq<
  NonNullable<
    Old.operations["SponsorController_updateSponsor"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["SponsorController_updateSponsor"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1904: Eq<
  Old.operations["SponsorController_updateSponsor"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorController_updateSponsor"]["responses"][200]["content"]["application/json"]
> = true
export const _1905: Eq<
  keyof Old.operations["SponsorController_createSponsor"]["responses"],
  keyof New.operations["SponsorController_createSponsor"]["responses"]
> = true
export const _1906: Eq<
  Old.operations["SponsorController_createSponsor"]["parameters"]["path"],
  New.operations["SponsorController_createSponsor"]["parameters"]["path"]
> = true
export const _1907: Eq<
  NonNullable<
    Old.operations["SponsorController_createSponsor"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["SponsorController_createSponsor"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1908: Eq<
  Old.operations["SponsorController_createSponsor"]["responses"][201]["content"]["application/json"],
  New.operations["SponsorController_createSponsor"]["responses"][201]["content"]["application/json"]
> = true
export const _1909: Eq<
  keyof Old.operations["SponsorController_deleteSponsor"]["responses"],
  keyof New.operations["SponsorController_deleteSponsor"]["responses"]
> = true
export const _1910: Eq<
  Old.operations["SponsorController_deleteSponsor"]["parameters"]["path"],
  New.operations["SponsorController_deleteSponsor"]["parameters"]["path"]
> = true
export const _1911: Eq<
  Old.operations["SponsorController_deleteSponsor"]["parameters"]["query"],
  New.operations["SponsorController_deleteSponsor"]["parameters"]["query"]
> = true
export const _1912: Eq<
  Present<Old.paths["/v1/domains/{domainId}/sponsors"]>,
  Present<New.paths["/v1/domains/{domainId}/sponsors"]>
> = true
export const _1913: Eq<
  keyof Old.operations["SponsorsController_listSponsors"]["responses"],
  keyof New.operations["SponsorsController_listSponsors"]["responses"]
> = true
export const _1914: Eq<
  Old.operations["SponsorsController_listSponsors"]["parameters"]["path"],
  New.operations["SponsorsController_listSponsors"]["parameters"]["path"]
> = true
export const _1915: Eq<
  Old.operations["SponsorsController_listSponsors"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_listSponsors"]["responses"][200]["content"]["application/json"]
> = true
export const _1916: Eq<
  Present<Old.paths["/v1/domains/{domainId}/sponsors/account/{accountId}/sponsor"]>,
  Present<New.paths["/v1/domains/{domainId}/sponsors/account/{accountId}/sponsor"]>
> = true
export const _1917: Eq<
  keyof Old.operations["SponsorsController_getAccountSponsor"]["responses"],
  keyof New.operations["SponsorsController_getAccountSponsor"]["responses"]
> = true
export const _1918: Eq<
  Old.operations["SponsorsController_getAccountSponsor"]["parameters"]["path"],
  New.operations["SponsorsController_getAccountSponsor"]["parameters"]["path"]
> = true
export const _1919: Eq<
  Old.operations["SponsorsController_getAccountSponsor"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_getAccountSponsor"]["responses"][200]["content"]["application/json"]
> = true
export const _1920: Eq<
  Present<Old.paths["/v1/domains/{domainId}/sponsors/account/{accountId}/valid-sponsors"]>,
  Present<New.paths["/v1/domains/{domainId}/sponsors/account/{accountId}/valid-sponsors"]>
> = true
export const _1921: Eq<
  keyof Old.operations["SponsorsController_getValidSponsors"]["responses"],
  keyof New.operations["SponsorsController_getValidSponsors"]["responses"]
> = true
export const _1922: Eq<
  Old.operations["SponsorsController_getValidSponsors"]["parameters"]["path"],
  New.operations["SponsorsController_getValidSponsors"]["parameters"]["path"]
> = true
export const _1923: Eq<
  Old.operations["SponsorsController_getValidSponsors"]["parameters"]["query"],
  New.operations["SponsorsController_getValidSponsors"]["parameters"]["query"]
> = true
export const _1924: Eq<
  Old.operations["SponsorsController_getValidSponsors"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_getValidSponsors"]["responses"][200]["content"]["application/json"]
> = true
export const _1925: Eq<
  Present<Old.paths["/v1/domains/{domainId}/sponsors/domain-sponsor"]>,
  Present<New.paths["/v1/domains/{domainId}/sponsors/domain-sponsor"]>
> = true
export const _1926: Eq<
  keyof Old.operations["SponsorsController_getDomainSponsor"]["responses"],
  keyof New.operations["SponsorsController_getDomainSponsor"]["responses"]
> = true
export const _1927: Eq<
  Old.operations["SponsorsController_getDomainSponsor"]["parameters"]["path"],
  New.operations["SponsorsController_getDomainSponsor"]["parameters"]["path"]
> = true
export const _1928: Eq<
  Old.operations["SponsorsController_getDomainSponsor"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_getDomainSponsor"]["responses"][200]["content"]["application/json"]
> = true
export const _1929: Eq<
  Present<Old.paths["/v1/domains/{domainId}/sponsors/sponsored-accounts"]>,
  Present<New.paths["/v1/domains/{domainId}/sponsors/sponsored-accounts"]>
> = true
export const _1930: Eq<
  keyof Old.operations["SponsorsController_listSponsoredAccounts"]["responses"],
  keyof New.operations["SponsorsController_listSponsoredAccounts"]["responses"]
> = true
export const _1931: Eq<
  Old.operations["SponsorsController_listSponsoredAccounts"]["parameters"]["path"],
  New.operations["SponsorsController_listSponsoredAccounts"]["parameters"]["path"]
> = true
export const _1932: Eq<
  Old.operations["SponsorsController_listSponsoredAccounts"]["parameters"]["query"],
  New.operations["SponsorsController_listSponsoredAccounts"]["parameters"]["query"]
> = true
export const _1933: Eq<
  Old.operations["SponsorsController_listSponsoredAccounts"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_listSponsoredAccounts"]["responses"][200]["content"]["application/json"]
> = true
export const _1934: Eq<
  Present<Old.paths["/v1/domains/{domainId}/sponsors/sponsored-domains"]>,
  Present<New.paths["/v1/domains/{domainId}/sponsors/sponsored-domains"]>
> = true
export const _1935: Eq<
  keyof Old.operations["SponsorsController_listSponsoredDomains"]["responses"],
  keyof New.operations["SponsorsController_listSponsoredDomains"]["responses"]
> = true
export const _1936: Eq<
  Old.operations["SponsorsController_listSponsoredDomains"]["parameters"]["path"],
  New.operations["SponsorsController_listSponsoredDomains"]["parameters"]["path"]
> = true
export const _1937: Eq<
  Old.operations["SponsorsController_listSponsoredDomains"]["parameters"]["query"],
  New.operations["SponsorsController_listSponsoredDomains"]["parameters"]["query"]
> = true
export const _1938: Eq<
  Old.operations["SponsorsController_listSponsoredDomains"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_listSponsoredDomains"]["responses"][200]["content"]["application/json"]
> = true
export const _1939: Eq<
  Present<Old.paths["/v1/domains/{domainId}/account/{entityId}/sponsorable-domains"]>,
  Present<New.paths["/v1/domains/{domainId}/account/{entityId}/sponsorable-domains"]>
> = true
export const _1940: Eq<
  keyof Old.operations["SponsorListController_getSponsorableDomains"]["responses"],
  keyof New.operations["SponsorListController_getSponsorableDomains"]["responses"]
> = true
export const _1941: Eq<
  Old.operations["SponsorListController_getSponsorableDomains"]["parameters"]["path"],
  New.operations["SponsorListController_getSponsorableDomains"]["parameters"]["path"]
> = true
export const _1942: Eq<
  Old.operations["SponsorListController_getSponsorableDomains"]["parameters"]["query"],
  New.operations["SponsorListController_getSponsorableDomains"]["parameters"]["query"]
> = true
export const _1943: Eq<
  Old.operations["SponsorListController_getSponsorableDomains"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorListController_getSponsorableDomains"]["responses"][200]["content"]["application/json"]
> = true
export const _1944: Eq<
  Present<Old.paths["/v1/domains/{domainId}/account/{entityId}/sponsored-domains"]>,
  Present<New.paths["/v1/domains/{domainId}/account/{entityId}/sponsored-domains"]>
> = true
export const _1945: Eq<
  keyof Old.operations["SponsorListController_addSponsoredDomains"]["responses"],
  keyof New.operations["SponsorListController_addSponsoredDomains"]["responses"]
> = true
export const _1946: Eq<
  Old.operations["SponsorListController_addSponsoredDomains"]["parameters"]["path"],
  New.operations["SponsorListController_addSponsoredDomains"]["parameters"]["path"]
> = true
export const _1947: Eq<
  NonNullable<
    Old.operations["SponsorListController_addSponsoredDomains"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["SponsorListController_addSponsoredDomains"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1948: Eq<
  Old.operations["SponsorListController_addSponsoredDomains"]["responses"][201]["content"]["application/json"],
  New.operations["SponsorListController_addSponsoredDomains"]["responses"][201]["content"]["application/json"]
> = true
export const _1949: Eq<
  Present<Old.paths["/v1/domains/{domainId}/account/{entityId}/sponsorable-accounts"]>,
  Present<New.paths["/v1/domains/{domainId}/account/{entityId}/sponsorable-accounts"]>
> = true
export const _1950: Eq<
  keyof Old.operations["SponsorListController_getSponsorableAccounts"]["responses"],
  keyof New.operations["SponsorListController_getSponsorableAccounts"]["responses"]
> = true
export const _1951: Eq<
  Old.operations["SponsorListController_getSponsorableAccounts"]["parameters"]["path"],
  New.operations["SponsorListController_getSponsorableAccounts"]["parameters"]["path"]
> = true
export const _1952: Eq<
  Old.operations["SponsorListController_getSponsorableAccounts"]["parameters"]["query"],
  New.operations["SponsorListController_getSponsorableAccounts"]["parameters"]["query"]
> = true
export const _1953: Eq<
  Old.operations["SponsorListController_getSponsorableAccounts"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorListController_getSponsorableAccounts"]["responses"][200]["content"]["application/json"]
> = true
export const _1954: Eq<
  Present<Old.paths["/v1/domains/{domainId}/account/{entityId}/sponsored-accounts"]>,
  Present<New.paths["/v1/domains/{domainId}/account/{entityId}/sponsored-accounts"]>
> = true
export const _1955: Eq<
  keyof Old.operations["SponsorListController_addSponsoredAccounts"]["responses"],
  keyof New.operations["SponsorListController_addSponsoredAccounts"]["responses"]
> = true
export const _1956: Eq<
  Old.operations["SponsorListController_addSponsoredAccounts"]["parameters"]["path"],
  New.operations["SponsorListController_addSponsoredAccounts"]["parameters"]["path"]
> = true
export const _1957: Eq<
  NonNullable<
    Old.operations["SponsorListController_addSponsoredAccounts"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["SponsorListController_addSponsoredAccounts"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _1958: Eq<
  Old.operations["SponsorListController_addSponsoredAccounts"]["responses"][201]["content"]["application/json"],
  New.operations["SponsorListController_addSponsoredAccounts"]["responses"][201]["content"]["application/json"]
> = true
export const _1959: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/account/{entityId}/sponsored-accounts/domains/{sponsoredAccountDomainId}/accounts/{sponsoredAccountId}"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/account/{entityId}/sponsored-accounts/domains/{sponsoredAccountDomainId}/accounts/{sponsoredAccountId}"]
  >
> = true
export const _1960: Eq<
  keyof Old.operations["SponsorListController_addSponsoredAccount"]["responses"],
  keyof New.operations["SponsorListController_addSponsoredAccount"]["responses"]
> = true
export const _1961: Eq<
  Old.operations["SponsorListController_addSponsoredAccount"]["parameters"]["path"],
  New.operations["SponsorListController_addSponsoredAccount"]["parameters"]["path"]
> = true
export const _1962: Eq<
  keyof Old.operations["SponsorListController_removeSponsoredAccount"]["responses"],
  keyof New.operations["SponsorListController_removeSponsoredAccount"]["responses"]
> = true
export const _1963: Eq<
  Old.operations["SponsorListController_removeSponsoredAccount"]["parameters"]["path"],
  New.operations["SponsorListController_removeSponsoredAccount"]["parameters"]["path"]
> = true
export const _1964: Eq<
  Present<Old.paths["/v1/domains/{domainId}/sponsor/events"]>,
  Present<New.paths["/v1/domains/{domainId}/sponsor/events"]>
> = true
export const _1965: Eq<
  keyof Old.operations["EventController_getEvents"]["responses"],
  keyof New.operations["EventController_getEvents"]["responses"]
> = true
export const _1966: Eq<
  Old.operations["EventController_getEvents"]["parameters"]["path"],
  New.operations["EventController_getEvents"]["parameters"]["path"]
> = true
export const _1967: Eq<
  Old.operations["EventController_getEvents"]["parameters"]["query"],
  New.operations["EventController_getEvents"]["parameters"]["query"]
> = true
export const _1968: Eq<
  Old.operations["EventController_getEvents"]["responses"][200]["content"]["application/json"],
  New.operations["EventController_getEvents"]["responses"][200]["content"]["application/json"]
> = true
export const _1969: Eq<
  Present<Old.paths["/v1/domain/{domainId}/sponsors/account/{accountId}/valid-sponsors"]>,
  Present<New.paths["/v1/domain/{domainId}/sponsors/account/{accountId}/valid-sponsors"]>
> = true
export const _1970: Eq<
  keyof Old.operations["SponsorsController_getValidSponsors_legacyDomain"]["responses"],
  keyof New.operations["SponsorsController_getValidSponsors_legacyDomain"]["responses"]
> = true
export const _1971: Eq<
  Old.operations["SponsorsController_getValidSponsors_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorsController_getValidSponsors_legacyDomain"]["parameters"]["path"]
> = true
export const _1972: Eq<
  Old.operations["SponsorsController_getValidSponsors_legacyDomain"]["parameters"]["query"],
  New.operations["SponsorsController_getValidSponsors_legacyDomain"]["parameters"]["query"]
> = true
export const _1973: Eq<
  Old.operations["SponsorsController_getValidSponsors_legacyDomain"]["responses"][200]["content"]["application/json"],
  New.operations["SponsorsController_getValidSponsors_legacyDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _1974: Eq<
  Present<
    Old.paths["/v1/domain/{domainId}/account/{entityId}/sponsored-accounts/domains/{sponsoredAccountDomainId}/accounts/{sponsoredAccountId}"]
  >,
  Present<
    New.paths["/v1/domain/{domainId}/account/{entityId}/sponsored-accounts/domains/{sponsoredAccountDomainId}/accounts/{sponsoredAccountId}"]
  >
> = true
export const _1975: Eq<
  keyof Old.operations["SponsorListController_addSponsoredAccount_legacyDomain"]["responses"],
  keyof New.operations["SponsorListController_addSponsoredAccount_legacyDomain"]["responses"]
> = true
export const _1976: Eq<
  Old.operations["SponsorListController_addSponsoredAccount_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorListController_addSponsoredAccount_legacyDomain"]["parameters"]["path"]
> = true
export const _1977: Eq<
  keyof Old.operations["SponsorListController_removeSponsoredAccount_legacyDomain"]["responses"],
  keyof New.operations["SponsorListController_removeSponsoredAccount_legacyDomain"]["responses"]
> = true
export const _1978: Eq<
  Old.operations["SponsorListController_removeSponsoredAccount_legacyDomain"]["parameters"]["path"],
  New.operations["SponsorListController_removeSponsoredAccount_legacyDomain"]["parameters"]["path"]
> = true
export const _1979: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/transferability"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/transferability"]>
> = true
export const _1980: Eq<
  keyof Old.operations["transferability"]["responses"],
  keyof New.operations["transferability"]["responses"]
> = true
export const _1981: Eq<
  Old.operations["transferability"]["parameters"]["path"],
  New.operations["transferability"]["parameters"]["path"]
> = true
export const _1982: Eq<
  Old.operations["transferability"]["parameters"]["query"],
  New.operations["transferability"]["parameters"]["query"]
> = true
export const _1983: Eq<
  Old.operations["transferability"]["responses"][200]["content"]["application/json"],
  New.operations["transferability"]["responses"][200]["content"]["application/json"]
> = true
export const _1984: Eq<
  Old.operations["transferability"]["responses"][401]["content"]["application/json"],
  New.operations["transferability"]["responses"][401]["content"]["application/json"]
> = true
export const _1985: Eq<
  Old.operations["transferability"]["responses"][404]["content"]["application/json"],
  New.operations["transferability"]["responses"][404]["content"]["application/json"]
> = true
export const _1986: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/accounts/{accountId}/deposit-instructions/{instructions-id}"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/accounts/{accountId}/deposit-instructions/{instructions-id}"]
  >
> = true
export const _1987: Eq<
  keyof Old.operations["deposit-instructions-by-id"]["responses"],
  keyof New.operations["deposit-instructions-by-id"]["responses"]
> = true
export const _1988: Eq<
  Old.operations["deposit-instructions-by-id"]["parameters"]["path"],
  New.operations["deposit-instructions-by-id"]["parameters"]["path"]
> = true
export const _1989: Eq<
  Old.operations["deposit-instructions-by-id"]["responses"][200]["content"]["application/json"],
  New.operations["deposit-instructions-by-id"]["responses"][200]["content"]["application/json"]
> = true
export const _1990: Eq<
  Old.operations["deposit-instructions-by-id"]["responses"][400]["content"]["application/json"],
  New.operations["deposit-instructions-by-id"]["responses"][400]["content"]["application/json"]
> = true
export const _1991: Eq<
  Old.operations["deposit-instructions-by-id"]["responses"][401]["content"]["application/json"],
  New.operations["deposit-instructions-by-id"]["responses"][401]["content"]["application/json"]
> = true
export const _1992: Eq<
  Old.operations["deposit-instructions-by-id"]["responses"][404]["content"]["application/json"],
  New.operations["deposit-instructions-by-id"]["responses"][404]["content"]["application/json"]
> = true
export const _1993: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/deposit-instructions"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/deposit-instructions"]>
> = true
export const _1994: Eq<
  keyof Old.operations["deposit-instructions"]["responses"],
  keyof New.operations["deposit-instructions"]["responses"]
> = true
export const _1995: Eq<
  Old.operations["deposit-instructions"]["parameters"]["path"],
  New.operations["deposit-instructions"]["parameters"]["path"]
> = true
export const _1996: Eq<
  Old.operations["deposit-instructions"]["parameters"]["query"],
  New.operations["deposit-instructions"]["parameters"]["query"]
> = true
export const _1997: Eq<
  Old.operations["deposit-instructions"]["responses"][200]["content"]["application/json"],
  New.operations["deposit-instructions"]["responses"][200]["content"]["application/json"]
> = true
export const _1998: Eq<
  Old.operations["deposit-instructions"]["responses"][400]["content"]["application/json"],
  New.operations["deposit-instructions"]["responses"][400]["content"]["application/json"]
> = true
export const _1999: Eq<
  Old.operations["deposit-instructions"]["responses"][401]["content"]["application/json"],
  New.operations["deposit-instructions"]["responses"][401]["content"]["application/json"]
> = true
export const _2000: Eq<
  Present<Old.paths["/v1/providers/{providerId}"]>,
  Present<New.paths["/v1/providers/{providerId}"]>
> = true
export const _2001: Eq<
  keyof Old.operations["getProvider"]["responses"],
  keyof New.operations["getProvider"]["responses"]
> = true
export const _2002: Eq<
  Old.operations["getProvider"]["parameters"]["path"],
  New.operations["getProvider"]["parameters"]["path"]
> = true
export const _2003: Eq<
  Old.operations["getProvider"]["responses"][200]["content"]["application/json"],
  New.operations["getProvider"]["responses"][200]["content"]["application/json"]
> = true
export const _2004: Eq<
  Old.operations["getProvider"]["responses"][401]["content"]["application/json"],
  New.operations["getProvider"]["responses"][401]["content"]["application/json"]
> = true
export const _2005: Eq<
  Old.operations["getProvider"]["responses"][404]["content"]["application/json"],
  New.operations["getProvider"]["responses"][404]["content"]["application/json"]
> = true
export const _2006: Eq<
  Present<Old.paths["/v1/providers"]>,
  Present<New.paths["/v1/providers"]>
> = true
export const _2007: Eq<
  keyof Old.operations["getProviders"]["responses"],
  keyof New.operations["getProviders"]["responses"]
> = true
export const _2008: Eq<
  Old.operations["getProviders"]["parameters"]["query"],
  New.operations["getProviders"]["parameters"]["query"]
> = true
export const _2009: Eq<
  Old.operations["getProviders"]["responses"][200]["content"]["application/json"],
  New.operations["getProviders"]["responses"][200]["content"]["application/json"]
> = true
export const _2010: Eq<
  Old.operations["getProviders"]["responses"][401]["content"]["application/json"],
  New.operations["getProviders"]["responses"][401]["content"]["application/json"]
> = true
export const _2011: Eq<
  Present<Old.paths["/v1/providers/{providerId}/locations"]>,
  Present<New.paths["/v1/providers/{providerId}/locations"]>
> = true
export const _2012: Eq<
  keyof Old.operations["getProviderLocations"]["responses"],
  keyof New.operations["getProviderLocations"]["responses"]
> = true
export const _2013: Eq<
  Old.operations["getProviderLocations"]["parameters"]["path"],
  New.operations["getProviderLocations"]["parameters"]["path"]
> = true
export const _2014: Eq<
  Old.operations["getProviderLocations"]["parameters"]["query"],
  New.operations["getProviderLocations"]["parameters"]["query"]
> = true
export const _2015: Eq<
  Old.operations["getProviderLocations"]["responses"][200]["content"]["application/json"],
  New.operations["getProviderLocations"]["responses"][200]["content"]["application/json"]
> = true
export const _2016: Eq<
  Old.operations["getProviderLocations"]["responses"][401]["content"]["application/json"],
  New.operations["getProviderLocations"]["responses"][401]["content"]["application/json"]
> = true
export const _2017: Eq<
  Old.operations["getProviderLocations"]["responses"][404]["content"]["application/json"],
  New.operations["getProviderLocations"]["responses"][404]["content"]["application/json"]
> = true
export const _2018: Eq<
  Present<Old.paths["/v1/system-signing/info"]>,
  Present<New.paths["/v1/system-signing/info"]>
> = true
export const _2019: Eq<
  keyof Old.operations["getSystemSigningInfo"]["responses"],
  keyof New.operations["getSystemSigningInfo"]["responses"]
> = true
export const _2020: Eq<
  Old.operations["getSystemSigningInfo"]["responses"][200]["content"]["application/json"],
  New.operations["getSystemSigningInfo"]["responses"][200]["content"]["application/json"]
> = true
export const _2021: Eq<
  Old.operations["getSystemSigningInfo"]["responses"][401]["content"]["application/json"],
  New.operations["getSystemSigningInfo"]["responses"][401]["content"]["application/json"]
> = true
export const _2022: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}"]>
> = true
export const _2023: Eq<
  keyof Old.operations["getOmnibus"]["responses"],
  keyof New.operations["getOmnibus"]["responses"]
> = true
export const _2024: Eq<
  Old.operations["getOmnibus"]["parameters"]["path"],
  New.operations["getOmnibus"]["parameters"]["path"]
> = true
export const _2025: Eq<
  Old.operations["getOmnibus"]["responses"][200]["content"]["application/json"],
  New.operations["getOmnibus"]["responses"][200]["content"]["application/json"]
> = true
export const _2026: Eq<
  Old.operations["getOmnibus"]["responses"][404]["content"]["application/json"],
  New.operations["getOmnibus"]["responses"][404]["content"]["application/json"]
> = true
export const _2027: Eq<
  keyof Old.operations["updateOmnibus"]["responses"],
  keyof New.operations["updateOmnibus"]["responses"]
> = true
export const _2028: Eq<
  Old.operations["updateOmnibus"]["parameters"]["path"],
  New.operations["updateOmnibus"]["parameters"]["path"]
> = true
export const _2029: Eq<
  NonNullable<Old.operations["updateOmnibus"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["updateOmnibus"]["requestBody"]>["content"]["application/json"]
> = true
export const _2030: Eq<
  Old.operations["updateOmnibus"]["responses"][200]["content"]["application/json"],
  New.operations["updateOmnibus"]["responses"][200]["content"]["application/json"]
> = true
export const _2031: Eq<
  Old.operations["updateOmnibus"]["responses"][404]["content"]["application/json"],
  New.operations["updateOmnibus"]["responses"][404]["content"]["application/json"]
> = true
export const _2032: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}"]>
> = true
export const _2033: Eq<
  keyof Old.operations["getTenant"]["responses"],
  keyof New.operations["getTenant"]["responses"]
> = true
export const _2034: Eq<
  Old.operations["getTenant"]["parameters"]["path"],
  New.operations["getTenant"]["parameters"]["path"]
> = true
export const _2035: Eq<
  Old.operations["getTenant"]["responses"][200]["content"]["application/json"],
  New.operations["getTenant"]["responses"][200]["content"]["application/json"]
> = true
export const _2036: Eq<
  Old.operations["getTenant"]["responses"][404]["content"]["application/json"],
  New.operations["getTenant"]["responses"][404]["content"]["application/json"]
> = true
export const _2037: Eq<
  keyof Old.operations["updateTenant"]["responses"],
  keyof New.operations["updateTenant"]["responses"]
> = true
export const _2038: Eq<
  Old.operations["updateTenant"]["parameters"]["path"],
  New.operations["updateTenant"]["parameters"]["path"]
> = true
export const _2039: Eq<
  NonNullable<Old.operations["updateTenant"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["updateTenant"]["requestBody"]>["content"]["application/json"]
> = true
export const _2040: Eq<
  Old.operations["updateTenant"]["responses"][200]["content"]["application/json"],
  New.operations["updateTenant"]["responses"][200]["content"]["application/json"]
> = true
export const _2041: Eq<
  Old.operations["updateTenant"]["responses"][404]["content"]["application/json"],
  New.operations["updateTenant"]["responses"][404]["content"]["application/json"]
> = true
export const _2042: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus"]>
> = true
export const _2043: Eq<
  keyof Old.operations["getOmnibusByDomain"]["responses"],
  keyof New.operations["getOmnibusByDomain"]["responses"]
> = true
export const _2044: Eq<
  Old.operations["getOmnibusByDomain"]["parameters"]["path"],
  New.operations["getOmnibusByDomain"]["parameters"]["path"]
> = true
export const _2045: Eq<
  Old.operations["getOmnibusByDomain"]["responses"][200]["content"]["application/json"],
  New.operations["getOmnibusByDomain"]["responses"][200]["content"]["application/json"]
> = true
export const _2046: Eq<
  Old.operations["getOmnibusByDomain"]["responses"][404]["content"]["application/json"],
  New.operations["getOmnibusByDomain"]["responses"][404]["content"]["application/json"]
> = true
export const _2047: Eq<
  keyof Old.operations["createOmnibus"]["responses"],
  keyof New.operations["createOmnibus"]["responses"]
> = true
export const _2048: Eq<
  Old.operations["createOmnibus"]["parameters"]["path"],
  New.operations["createOmnibus"]["parameters"]["path"]
> = true
export const _2049: Eq<
  NonNullable<Old.operations["createOmnibus"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["createOmnibus"]["requestBody"]>["content"]["application/json"]
> = true
export const _2050: Eq<
  Old.operations["createOmnibus"]["responses"][201]["content"]["application/json"],
  New.operations["createOmnibus"]["responses"][201]["content"]["application/json"]
> = true
export const _2051: Eq<
  Old.operations["createOmnibus"]["responses"][400]["content"]["application/json"],
  New.operations["createOmnibus"]["responses"][400]["content"]["application/json"]
> = true
export const _2052: Eq<
  Old.operations["createOmnibus"]["responses"][409]["content"]["application/json"],
  New.operations["createOmnibus"]["responses"][409]["content"]["application/json"]
> = true
export const _2053: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/unlock"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/unlock"]>
> = true
export const _2054: Eq<
  keyof Old.operations["unlockOmnibus"]["responses"],
  keyof New.operations["unlockOmnibus"]["responses"]
> = true
export const _2055: Eq<
  Old.operations["unlockOmnibus"]["parameters"]["path"],
  New.operations["unlockOmnibus"]["parameters"]["path"]
> = true
export const _2056: Eq<
  Old.operations["unlockOmnibus"]["responses"][200]["content"]["application/json"],
  New.operations["unlockOmnibus"]["responses"][200]["content"]["application/json"]
> = true
export const _2057: Eq<
  Old.operations["unlockOmnibus"]["responses"][404]["content"]["application/json"],
  New.operations["unlockOmnibus"]["responses"][404]["content"]["application/json"]
> = true
export const _2058: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants"]>
> = true
export const _2059: Eq<
  keyof Old.operations["listTenants"]["responses"],
  keyof New.operations["listTenants"]["responses"]
> = true
export const _2060: Eq<
  Old.operations["listTenants"]["parameters"]["path"],
  New.operations["listTenants"]["parameters"]["path"]
> = true
export const _2061: Eq<
  Old.operations["listTenants"]["parameters"]["query"],
  New.operations["listTenants"]["parameters"]["query"]
> = true
export const _2062: Eq<
  Old.operations["listTenants"]["responses"][200]["content"]["application/json"],
  New.operations["listTenants"]["responses"][200]["content"]["application/json"]
> = true
export const _2063: Eq<
  Old.operations["listTenants"]["responses"][404]["content"]["application/json"],
  New.operations["listTenants"]["responses"][404]["content"]["application/json"]
> = true
export const _2064: Eq<
  keyof Old.operations["createTenant"]["responses"],
  keyof New.operations["createTenant"]["responses"]
> = true
export const _2065: Eq<
  Old.operations["createTenant"]["parameters"]["path"],
  New.operations["createTenant"]["parameters"]["path"]
> = true
export const _2066: Eq<
  NonNullable<Old.operations["createTenant"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["createTenant"]["requestBody"]>["content"]["application/json"]
> = true
export const _2067: Eq<
  Old.operations["createTenant"]["responses"][201]["content"]["application/json"],
  New.operations["createTenant"]["responses"][201]["content"]["application/json"]
> = true
export const _2068: Eq<
  Old.operations["createTenant"]["responses"][404]["content"]["application/json"],
  New.operations["createTenant"]["responses"][404]["content"]["application/json"]
> = true
export const _2069: Eq<
  Old.operations["createTenant"]["responses"][409]["content"]["application/json"],
  New.operations["createTenant"]["responses"][409]["content"]["application/json"]
> = true
export const _2070: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/withdrawals"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/withdrawals"]>
> = true
export const _2071: Eq<
  keyof Old.operations["createWithdrawal"]["responses"],
  keyof New.operations["createWithdrawal"]["responses"]
> = true
export const _2072: Eq<
  Old.operations["createWithdrawal"]["parameters"]["path"],
  New.operations["createWithdrawal"]["parameters"]["path"]
> = true
export const _2073: Eq<
  Old.operations["createWithdrawal"]["parameters"]["header"],
  New.operations["createWithdrawal"]["parameters"]["header"]
> = true
export const _2074: Eq<
  NonNullable<Old.operations["createWithdrawal"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["createWithdrawal"]["requestBody"]>["content"]["application/json"]
> = true
export const _2075: Eq<
  Old.operations["createWithdrawal"]["responses"][201]["content"]["application/json"],
  New.operations["createWithdrawal"]["responses"][201]["content"]["application/json"]
> = true
export const _2076: Eq<
  Old.operations["createWithdrawal"]["responses"][400]["content"]["application/json"],
  New.operations["createWithdrawal"]["responses"][400]["content"]["application/json"]
> = true
export const _2077: Eq<
  Old.operations["createWithdrawal"]["responses"][404]["content"]["application/json"],
  New.operations["createWithdrawal"]["responses"][404]["content"]["application/json"]
> = true
export const _2078: Eq<
  Old.operations["createWithdrawal"]["responses"][409]["content"]["application/json"],
  New.operations["createWithdrawal"]["responses"][409]["content"]["application/json"]
> = true
export const _2079: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/unlock"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/unlock"]>
> = true
export const _2080: Eq<
  keyof Old.operations["unlockTenant"]["responses"],
  keyof New.operations["unlockTenant"]["responses"]
> = true
export const _2081: Eq<
  Old.operations["unlockTenant"]["parameters"]["path"],
  New.operations["unlockTenant"]["parameters"]["path"]
> = true
export const _2082: Eq<
  Old.operations["unlockTenant"]["responses"][200]["content"]["application/json"],
  New.operations["unlockTenant"]["responses"][200]["content"]["application/json"]
> = true
export const _2083: Eq<
  Old.operations["unlockTenant"]["responses"][404]["content"]["application/json"],
  New.operations["unlockTenant"]["responses"][404]["content"]["application/json"]
> = true
export const _2084: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/lock"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/lock"]>
> = true
export const _2085: Eq<
  keyof Old.operations["lockTenant"]["responses"],
  keyof New.operations["lockTenant"]["responses"]
> = true
export const _2086: Eq<
  Old.operations["lockTenant"]["parameters"]["path"],
  New.operations["lockTenant"]["parameters"]["path"]
> = true
export const _2087: Eq<
  Old.operations["lockTenant"]["responses"][200]["content"]["application/json"],
  New.operations["lockTenant"]["responses"][200]["content"]["application/json"]
> = true
export const _2088: Eq<
  Old.operations["lockTenant"]["responses"][404]["content"]["application/json"],
  New.operations["lockTenant"]["responses"][404]["content"]["application/json"]
> = true
export const _2089: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/internal-transfers"]
  >,
  Present<
    New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/internal-transfers"]
  >
> = true
export const _2090: Eq<
  keyof Old.operations["createInternalTransfer"]["responses"],
  keyof New.operations["createInternalTransfer"]["responses"]
> = true
export const _2091: Eq<
  Old.operations["createInternalTransfer"]["parameters"]["path"],
  New.operations["createInternalTransfer"]["parameters"]["path"]
> = true
export const _2092: Eq<
  Old.operations["createInternalTransfer"]["parameters"]["header"],
  New.operations["createInternalTransfer"]["parameters"]["header"]
> = true
export const _2093: Eq<
  NonNullable<
    Old.operations["createInternalTransfer"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["createInternalTransfer"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _2094: Eq<
  Old.operations["createInternalTransfer"]["responses"][201]["content"]["application/json"],
  New.operations["createInternalTransfer"]["responses"][201]["content"]["application/json"]
> = true
export const _2095: Eq<
  Old.operations["createInternalTransfer"]["responses"][202]["content"]["application/json"],
  New.operations["createInternalTransfer"]["responses"][202]["content"]["application/json"]
> = true
export const _2096: Eq<
  Old.operations["createInternalTransfer"]["responses"][400]["content"]["application/json"],
  New.operations["createInternalTransfer"]["responses"][400]["content"]["application/json"]
> = true
export const _2097: Eq<
  Old.operations["createInternalTransfer"]["responses"][404]["content"]["application/json"],
  New.operations["createInternalTransfer"]["responses"][404]["content"]["application/json"]
> = true
export const _2098: Eq<
  Old.operations["createInternalTransfer"]["responses"][409]["content"]["application/json"],
  New.operations["createInternalTransfer"]["responses"][409]["content"]["application/json"]
> = true
export const _2099: Eq<
  Old.operations["createInternalTransfer"]["responses"][500]["content"]["application/json"],
  New.operations["createInternalTransfer"]["responses"][500]["content"]["application/json"]
> = true
export const _2100: Eq<
  Present<
    Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/deposit-wallet"]
  >,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/deposit-wallet"]>
> = true
export const _2101: Eq<
  keyof Old.operations["getDepositWallet"]["responses"],
  keyof New.operations["getDepositWallet"]["responses"]
> = true
export const _2102: Eq<
  Old.operations["getDepositWallet"]["parameters"]["path"],
  New.operations["getDepositWallet"]["parameters"]["path"]
> = true
export const _2103: Eq<
  Old.operations["getDepositWallet"]["responses"][200]["content"]["application/json"],
  New.operations["getDepositWallet"]["responses"][200]["content"]["application/json"]
> = true
export const _2104: Eq<
  Old.operations["getDepositWallet"]["responses"][404]["content"]["application/json"],
  New.operations["getDepositWallet"]["responses"][404]["content"]["application/json"]
> = true
export const _2105: Eq<
  keyof Old.operations["createDepositWallet"]["responses"],
  keyof New.operations["createDepositWallet"]["responses"]
> = true
export const _2106: Eq<
  Old.operations["createDepositWallet"]["parameters"]["path"],
  New.operations["createDepositWallet"]["parameters"]["path"]
> = true
export const _2107: Eq<
  Old.operations["createDepositWallet"]["responses"][200]["content"]["application/json"],
  New.operations["createDepositWallet"]["responses"][200]["content"]["application/json"]
> = true
export const _2108: Eq<
  Old.operations["createDepositWallet"]["responses"][201]["content"]["application/json"],
  New.operations["createDepositWallet"]["responses"][201]["content"]["application/json"]
> = true
export const _2109: Eq<
  Old.operations["createDepositWallet"]["responses"][404]["content"]["application/json"],
  New.operations["createDepositWallet"]["responses"][404]["content"]["application/json"]
> = true
export const _2110: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/lock"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/lock"]>
> = true
export const _2111: Eq<
  keyof Old.operations["lockOmnibus"]["responses"],
  keyof New.operations["lockOmnibus"]["responses"]
> = true
export const _2112: Eq<
  Old.operations["lockOmnibus"]["parameters"]["path"],
  New.operations["lockOmnibus"]["parameters"]["path"]
> = true
export const _2113: Eq<
  Old.operations["lockOmnibus"]["responses"][200]["content"]["application/json"],
  New.operations["lockOmnibus"]["responses"][200]["content"]["application/json"]
> = true
export const _2114: Eq<
  Old.operations["lockOmnibus"]["responses"][404]["content"]["application/json"],
  New.operations["lockOmnibus"]["responses"][404]["content"]["application/json"]
> = true
export const _2115: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/internal-transfers"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/internal-transfers"]>
> = true
export const _2116: Eq<
  keyof Old.operations["getInternalTransfers"]["responses"],
  keyof New.operations["getInternalTransfers"]["responses"]
> = true
export const _2117: Eq<
  Old.operations["getInternalTransfers"]["parameters"]["path"],
  New.operations["getInternalTransfers"]["parameters"]["path"]
> = true
export const _2118: Eq<
  Old.operations["getInternalTransfers"]["parameters"]["query"],
  New.operations["getInternalTransfers"]["parameters"]["query"]
> = true
export const _2119: Eq<
  Old.operations["getInternalTransfers"]["responses"][200]["content"]["application/json"],
  New.operations["getInternalTransfers"]["responses"][200]["content"]["application/json"]
> = true
export const _2120: Eq<
  Old.operations["getInternalTransfers"]["responses"][400]["content"]["application/json"],
  New.operations["getInternalTransfers"]["responses"][400]["content"]["application/json"]
> = true
export const _2121: Eq<
  Old.operations["getInternalTransfers"]["responses"][404]["content"]["application/json"],
  New.operations["getInternalTransfers"]["responses"][404]["content"]["application/json"]
> = true
export const _2122: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/deposit-wallets"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/deposit-wallets"]>
> = true
export const _2123: Eq<
  keyof Old.operations["listDepositWallets"]["responses"],
  keyof New.operations["listDepositWallets"]["responses"]
> = true
export const _2124: Eq<
  Old.operations["listDepositWallets"]["parameters"]["path"],
  New.operations["listDepositWallets"]["parameters"]["path"]
> = true
export const _2125: Eq<
  Old.operations["listDepositWallets"]["parameters"]["query"],
  New.operations["listDepositWallets"]["parameters"]["query"]
> = true
export const _2126: Eq<
  Old.operations["listDepositWallets"]["responses"][200]["content"]["application/json"],
  New.operations["listDepositWallets"]["responses"][200]["content"]["application/json"]
> = true
export const _2127: Eq<
  Old.operations["listDepositWallets"]["responses"][404]["content"]["application/json"],
  New.operations["listDepositWallets"]["responses"][404]["content"]["application/json"]
> = true
export const _2128: Eq<
  Present<Old.paths["/v1/exports/position"]>,
  Present<New.paths["/v1/exports/position"]>
> = true
export const _2129: Eq<
  keyof Old.operations["PositionReportController_generatePositionReport"]["responses"],
  keyof New.operations["PositionReportController_generatePositionReport"]["responses"]
> = true
export const _2130: Eq<
  NonNullable<
    Old.operations["PositionReportController_generatePositionReport"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["PositionReportController_generatePositionReport"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _2131: Eq<
  Old.operations["PositionReportController_generatePositionReport"]["responses"][201]["content"]["application/json"],
  New.operations["PositionReportController_generatePositionReport"]["responses"][201]["content"]["application/json"]
> = true
export const _2132: Eq<
  Old.operations["PositionReportController_generatePositionReport"]["responses"][400]["content"]["application/json"],
  New.operations["PositionReportController_generatePositionReport"]["responses"][400]["content"]["application/json"]
> = true
export const _2133: Eq<
  Old.operations["PositionReportController_generatePositionReport"]["responses"][401]["content"]["application/json"],
  New.operations["PositionReportController_generatePositionReport"]["responses"][401]["content"]["application/json"]
> = true
export const _2134: Eq<
  Old.operations["PositionReportController_generatePositionReport"]["responses"][403]["content"]["application/json"],
  New.operations["PositionReportController_generatePositionReport"]["responses"][403]["content"]["application/json"]
> = true
export const _2135: Eq<
  Old.operations["PositionReportController_generatePositionReport"]["responses"][413]["content"]["application/json"],
  New.operations["PositionReportController_generatePositionReport"]["responses"][413]["content"]["application/json"]
> = true
export const _2136: Eq<
  Old.operations["PositionReportController_generatePositionReport"]["responses"][429]["content"]["application/json"],
  New.operations["PositionReportController_generatePositionReport"]["responses"][429]["content"]["application/json"]
> = true
export const _2137: Eq<
  Old.operations["PositionReportController_generatePositionReport"]["responses"][502]["content"]["application/json"],
  New.operations["PositionReportController_generatePositionReport"]["responses"][502]["content"]["application/json"]
> = true
export const _2138: Eq<
  Present<Old.paths["/v1/exports/movement"]>,
  Present<New.paths["/v1/exports/movement"]>
> = true
export const _2139: Eq<
  keyof Old.operations["MovementReportController_generateMovementReport"]["responses"],
  keyof New.operations["MovementReportController_generateMovementReport"]["responses"]
> = true
export const _2140: Eq<
  NonNullable<
    Old.operations["MovementReportController_generateMovementReport"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["MovementReportController_generateMovementReport"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _2141: Eq<
  Old.operations["MovementReportController_generateMovementReport"]["responses"][201]["content"]["application/json"],
  New.operations["MovementReportController_generateMovementReport"]["responses"][201]["content"]["application/json"]
> = true
export const _2142: Eq<
  Old.operations["MovementReportController_generateMovementReport"]["responses"][400]["content"]["application/json"],
  New.operations["MovementReportController_generateMovementReport"]["responses"][400]["content"]["application/json"]
> = true
export const _2143: Eq<
  Old.operations["MovementReportController_generateMovementReport"]["responses"][401]["content"]["application/json"],
  New.operations["MovementReportController_generateMovementReport"]["responses"][401]["content"]["application/json"]
> = true
export const _2144: Eq<
  Old.operations["MovementReportController_generateMovementReport"]["responses"][403]["content"]["application/json"],
  New.operations["MovementReportController_generateMovementReport"]["responses"][403]["content"]["application/json"]
> = true
export const _2145: Eq<
  Old.operations["MovementReportController_generateMovementReport"]["responses"][413]["content"]["application/json"],
  New.operations["MovementReportController_generateMovementReport"]["responses"][413]["content"]["application/json"]
> = true
export const _2146: Eq<
  Old.operations["MovementReportController_generateMovementReport"]["responses"][429]["content"]["application/json"],
  New.operations["MovementReportController_generateMovementReport"]["responses"][429]["content"]["application/json"]
> = true
export const _2147: Eq<
  Old.operations["MovementReportController_generateMovementReport"]["responses"][502]["content"]["application/json"],
  New.operations["MovementReportController_generateMovementReport"]["responses"][502]["content"]["application/json"]
> = true
export const _2148: Eq<
  Present<Old.paths["/v1/domains/{domainId}/sweep-thresholds"]>,
  Present<New.paths["/v1/domains/{domainId}/sweep-thresholds"]>
> = true
export const _2149: Eq<
  keyof Old.operations["getSweepThresholds"]["responses"],
  keyof New.operations["getSweepThresholds"]["responses"]
> = true
export const _2150: Eq<
  Old.operations["getSweepThresholds"]["parameters"]["path"],
  New.operations["getSweepThresholds"]["parameters"]["path"]
> = true
export const _2151: Eq<
  Old.operations["getSweepThresholds"]["parameters"]["query"],
  New.operations["getSweepThresholds"]["parameters"]["query"]
> = true
export const _2152: Eq<
  Old.operations["getSweepThresholds"]["responses"][200]["content"]["application/json"],
  New.operations["getSweepThresholds"]["responses"][200]["content"]["application/json"]
> = true
export const _2153: Eq<
  Old.operations["getSweepThresholds"]["responses"][400]["content"]["application/json"],
  New.operations["getSweepThresholds"]["responses"][400]["content"]["application/json"]
> = true
export const _2154: Eq<
  Old.operations["getSweepThresholds"]["responses"][403]["content"]["application/json"],
  New.operations["getSweepThresholds"]["responses"][403]["content"]["application/json"]
> = true
export const _2155: Eq<
  Old.operations["getSweepThresholds"]["responses"][404]["content"]["application/json"],
  New.operations["getSweepThresholds"]["responses"][404]["content"]["application/json"]
> = true
export const _2156: Eq<
  keyof Old.operations["updateSweepThresholds"]["responses"],
  keyof New.operations["updateSweepThresholds"]["responses"]
> = true
export const _2157: Eq<
  Old.operations["updateSweepThresholds"]["parameters"]["path"],
  New.operations["updateSweepThresholds"]["parameters"]["path"]
> = true
export const _2158: Eq<
  NonNullable<
    Old.operations["updateSweepThresholds"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<New.operations["updateSweepThresholds"]["requestBody"]>["content"]["application/json"]
> = true
export const _2159: Eq<
  Old.operations["updateSweepThresholds"]["responses"][200]["content"]["application/json"],
  New.operations["updateSweepThresholds"]["responses"][200]["content"]["application/json"]
> = true
export const _2160: Eq<
  Old.operations["updateSweepThresholds"]["responses"][400]["content"]["application/json"],
  New.operations["updateSweepThresholds"]["responses"][400]["content"]["application/json"]
> = true
export const _2161: Eq<
  Old.operations["updateSweepThresholds"]["responses"][403]["content"]["application/json"],
  New.operations["updateSweepThresholds"]["responses"][403]["content"]["application/json"]
> = true
export const _2162: Eq<
  Old.operations["updateSweepThresholds"]["responses"][404]["content"]["application/json"],
  New.operations["updateSweepThresholds"]["responses"][404]["content"]["application/json"]
> = true
export const _2163: Eq<
  Old.operations["updateSweepThresholds"]["responses"][409]["content"]["application/json"],
  New.operations["updateSweepThresholds"]["responses"][409]["content"]["application/json"]
> = true
export const _2164: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/internal-transfers/{operationId}"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/internal-transfers/{operationId}"]>
> = true
export const _2165: Eq<
  keyof Old.operations["getInternalTransfer"]["responses"],
  keyof New.operations["getInternalTransfer"]["responses"]
> = true
export const _2166: Eq<
  Old.operations["getInternalTransfer"]["parameters"]["path"],
  New.operations["getInternalTransfer"]["parameters"]["path"]
> = true
export const _2167: Eq<
  Old.operations["getInternalTransfer"]["responses"][200]["content"]["application/json"],
  New.operations["getInternalTransfer"]["responses"][200]["content"]["application/json"]
> = true
export const _2168: Eq<
  Old.operations["getInternalTransfer"]["responses"][404]["content"]["application/json"],
  New.operations["getInternalTransfer"]["responses"][404]["content"]["application/json"]
> = true
export const _2169: Eq<
  Present<Old.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/hierarchy"]>,
  Present<New.paths["/v1/domains/{domainId}/omnibus/{omnibusId}/hierarchy"]>
> = true
export const _2170: Eq<
  keyof Old.operations["getOmnibusHierarchy"]["responses"],
  keyof New.operations["getOmnibusHierarchy"]["responses"]
> = true
export const _2171: Eq<
  Old.operations["getOmnibusHierarchy"]["parameters"]["path"],
  New.operations["getOmnibusHierarchy"]["parameters"]["path"]
> = true
export const _2172: Eq<
  Old.operations["getOmnibusHierarchy"]["parameters"]["query"],
  New.operations["getOmnibusHierarchy"]["parameters"]["query"]
> = true
export const _2173: Eq<
  Old.operations["getOmnibusHierarchy"]["responses"][200]["content"]["application/json"],
  New.operations["getOmnibusHierarchy"]["responses"][200]["content"]["application/json"]
> = true
export const _2174: Eq<
  Old.operations["getOmnibusHierarchy"]["responses"][404]["content"]["application/json"],
  New.operations["getOmnibusHierarchy"]["responses"][404]["content"]["application/json"]
> = true
export const _2175: Eq<
  Present<Old.paths["/v1/exports/position/omnibus"]>,
  Present<New.paths["/v1/exports/position/omnibus"]>
> = true
export const _2176: Eq<
  keyof Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"],
  keyof New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"]
> = true
export const _2177: Eq<
  NonNullable<
    Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _2178: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][201]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][201]["content"]["application/json"]
> = true
export const _2179: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][400]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][400]["content"]["application/json"]
> = true
export const _2180: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][401]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][401]["content"]["application/json"]
> = true
export const _2181: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][403]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][403]["content"]["application/json"]
> = true
export const _2182: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][404]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][404]["content"]["application/json"]
> = true
export const _2183: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][413]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][413]["content"]["application/json"]
> = true
export const _2184: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][422]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][422]["content"]["application/json"]
> = true
export const _2185: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][429]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][429]["content"]["application/json"]
> = true
export const _2186: Eq<
  Old.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][502]["content"]["application/json"],
  New.operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][502]["content"]["application/json"]
> = true
export const _2187: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/sponsorships"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/sponsorships"]>
> = true
export const _2188: Eq<
  keyof Old.operations["getAccountSponsorships"]["responses"],
  keyof New.operations["getAccountSponsorships"]["responses"]
> = true
export const _2189: Eq<
  Old.operations["getAccountSponsorships"]["parameters"]["path"],
  New.operations["getAccountSponsorships"]["parameters"]["path"]
> = true
export const _2190: Eq<
  Old.operations["getAccountSponsorships"]["parameters"]["query"],
  New.operations["getAccountSponsorships"]["parameters"]["query"]
> = true
export const _2191: Eq<
  Old.operations["getAccountSponsorships"]["responses"][200]["content"]["application/json"],
  New.operations["getAccountSponsorships"]["responses"][200]["content"]["application/json"]
> = true
export const _2192: Eq<
  Old.operations["getAccountSponsorships"]["responses"][400]["content"]["application/json"],
  New.operations["getAccountSponsorships"]["responses"][400]["content"]["application/json"]
> = true
export const _2193: Eq<
  Old.operations["getAccountSponsorships"]["responses"][401]["content"]["application/json"],
  New.operations["getAccountSponsorships"]["responses"][401]["content"]["application/json"]
> = true
export const _2194: Eq<
  Old.operations["getAccountSponsorships"]["responses"][404]["content"]["application/json"],
  New.operations["getAccountSponsorships"]["responses"][404]["content"]["application/json"]
> = true
export const _2195: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/sponsorship-movements"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/sponsorship-movements"]>
> = true
export const _2196: Eq<
  keyof Old.operations["getAccountSponsorshipMovements"]["responses"],
  keyof New.operations["getAccountSponsorshipMovements"]["responses"]
> = true
export const _2197: Eq<
  Old.operations["getAccountSponsorshipMovements"]["parameters"]["path"],
  New.operations["getAccountSponsorshipMovements"]["parameters"]["path"]
> = true
export const _2198: Eq<
  Old.operations["getAccountSponsorshipMovements"]["parameters"]["query"],
  New.operations["getAccountSponsorshipMovements"]["parameters"]["query"]
> = true
export const _2199: Eq<
  Old.operations["getAccountSponsorshipMovements"]["responses"][200]["content"]["application/json"],
  New.operations["getAccountSponsorshipMovements"]["responses"][200]["content"]["application/json"]
> = true
export const _2200: Eq<
  Old.operations["getAccountSponsorshipMovements"]["responses"][400]["content"]["application/json"],
  New.operations["getAccountSponsorshipMovements"]["responses"][400]["content"]["application/json"]
> = true
export const _2201: Eq<
  Old.operations["getAccountSponsorshipMovements"]["responses"][401]["content"]["application/json"],
  New.operations["getAccountSponsorshipMovements"]["responses"][401]["content"]["application/json"]
> = true
export const _2202: Eq<
  Old.operations["getAccountSponsorshipMovements"]["responses"][404]["content"]["application/json"],
  New.operations["getAccountSponsorshipMovements"]["responses"][404]["content"]["application/json"]
> = true
export const _2203: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/parameters-compute"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/parameters-compute"]>
> = true
export const _2204: Eq<
  keyof Old.operations["initiateParametersCompute"]["responses"],
  keyof New.operations["initiateParametersCompute"]["responses"]
> = true
export const _2205: Eq<
  Old.operations["initiateParametersCompute"]["parameters"]["path"],
  New.operations["initiateParametersCompute"]["parameters"]["path"]
> = true
export const _2206: Eq<
  NonNullable<
    Old.operations["initiateParametersCompute"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["initiateParametersCompute"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _2207: Eq<
  Old.operations["initiateParametersCompute"]["responses"][200]["content"]["application/json"],
  New.operations["initiateParametersCompute"]["responses"][200]["content"]["application/json"]
> = true
export const _2208: Eq<
  Old.operations["initiateParametersCompute"]["responses"][401]["content"]["application/json"],
  New.operations["initiateParametersCompute"]["responses"][401]["content"]["application/json"]
> = true
export const _2209: Eq<
  Old.operations["initiateParametersCompute"]["responses"][409]["content"]["application/json"],
  New.operations["initiateParametersCompute"]["responses"][409]["content"]["application/json"]
> = true
export const _2210: Eq<
  Present<Old.paths["/v1/domains/{domainId}/accounts/{accountId}/parameters-compute/{computeId}"]>,
  Present<New.paths["/v1/domains/{domainId}/accounts/{accountId}/parameters-compute/{computeId}"]>
> = true
export const _2211: Eq<
  keyof Old.operations["getParametersComputeStatus"]["responses"],
  keyof New.operations["getParametersComputeStatus"]["responses"]
> = true
export const _2212: Eq<
  Old.operations["getParametersComputeStatus"]["parameters"]["path"],
  New.operations["getParametersComputeStatus"]["parameters"]["path"]
> = true
export const _2213: Eq<
  Old.operations["getParametersComputeStatus"]["responses"][200]["content"]["application/json"],
  New.operations["getParametersComputeStatus"]["responses"][200]["content"]["application/json"]
> = true
export const _2214: Eq<
  Old.operations["getParametersComputeStatus"]["responses"][401]["content"]["application/json"],
  New.operations["getParametersComputeStatus"]["responses"][401]["content"]["application/json"]
> = true
export const _2215: Eq<
  Old.operations["getParametersComputeStatus"]["responses"][404]["content"]["application/json"],
  New.operations["getParametersComputeStatus"]["responses"][404]["content"]["application/json"]
> = true
