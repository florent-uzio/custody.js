import type * as New from "../../src/models/custody-internal-types.js"
import type * as Old from "./baseline/old-internal.js"
type Eq<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
type Present<T> = { [K in keyof T]-?: [T[K]] extends [never] ? never : K }[keyof T]
export const _1: Eq<keyof Old.paths, keyof New.paths> = true
export const _2: Eq<keyof Old.operations, keyof New.operations> = true
export const _3: Eq<keyof Old.components["schemas"], keyof New.components["schemas"]> = true
export const _4: Eq<
  Old.components["schemas"]["Internal_Account"],
  New.components["schemas"]["Internal_Account"]
> = true
export const _5: Eq<
  Old.components["schemas"]["Internal_AccountCreated"],
  New.components["schemas"]["Internal_AccountCreated"]
> = true
export const _6: Eq<
  Old.components["schemas"]["Internal_AccountKeyStrategy"],
  New.components["schemas"]["Internal_AccountKeyStrategy"]
> = true
export const _7: Eq<
  Old.components["schemas"]["Internal_AccountPending"],
  New.components["schemas"]["Internal_AccountPending"]
> = true
export const _8: Eq<
  Old.components["schemas"]["Internal_AccountProviderInformation"],
  New.components["schemas"]["Internal_AccountProviderInformation"]
> = true
export const _9: Eq<
  Old.components["schemas"]["Internal_AccountProviderInformation_Vault"],
  New.components["schemas"]["Internal_AccountProviderInformation_Vault"]
> = true
export const _10: Eq<
  Old.components["schemas"]["Internal_AccountPublicKey"],
  New.components["schemas"]["Internal_AccountPublicKey"]
> = true
export const _11: Eq<
  Old.components["schemas"]["Internal_AccountPublicKeyExtendedOnly"],
  New.components["schemas"]["Internal_AccountPublicKeyExtendedOnly"]
> = true
export const _12: Eq<
  Old.components["schemas"]["Internal_AccountPublicKeyExtendedOnly_ExtendedPublicKey"],
  New.components["schemas"]["Internal_AccountPublicKeyExtendedOnly_ExtendedPublicKey"]
> = true
export const _13: Eq<
  Old.components["schemas"]["Internal_AccountPublicKeyOnly"],
  New.components["schemas"]["Internal_AccountPublicKeyOnly"]
> = true
export const _14: Eq<
  Old.components["schemas"]["Internal_AccountPublicKeyOnly_PublicKey"],
  New.components["schemas"]["Internal_AccountPublicKeyOnly_PublicKey"]
> = true
export const _15: Eq<
  Old.components["schemas"]["Internal_AccountPublicKey_ExtendedPublicKey"],
  New.components["schemas"]["Internal_AccountPublicKey_ExtendedPublicKey"]
> = true
export const _16: Eq<
  Old.components["schemas"]["Internal_AccountPublicKey_PublicKey"],
  New.components["schemas"]["Internal_AccountPublicKey_PublicKey"]
> = true
export const _17: Eq<
  Old.components["schemas"]["Internal_AccountReference"],
  New.components["schemas"]["Internal_AccountReference"]
> = true
export const _18: Eq<
  Old.components["schemas"]["Internal_AccountUpdated"],
  New.components["schemas"]["Internal_AccountUpdated"]
> = true
export const _19: Eq<
  Old.components["schemas"]["Internal_AddressCreated"],
  New.components["schemas"]["Internal_AddressCreated"]
> = true
export const _20: Eq<
  Old.components["schemas"]["Internal_AddressDetails"],
  New.components["schemas"]["Internal_AddressDetails"]
> = true
export const _21: Eq<
  Old.components["schemas"]["Internal_AddressForChange"],
  New.components["schemas"]["Internal_AddressForChange"]
> = true
export const _22: Eq<
  Old.components["schemas"]["Internal_AlgorandFeeStrategy"],
  New.components["schemas"]["Internal_AlgorandFeeStrategy"]
> = true
export const _23: Eq<
  Old.components["schemas"]["Internal_AlgorandFeeStrategy_Priority"],
  New.components["schemas"]["Internal_AlgorandFeeStrategy_Priority"]
> = true
export const _24: Eq<
  Old.components["schemas"]["Internal_AlgorandOperation"],
  New.components["schemas"]["Internal_AlgorandOperation"]
> = true
export const _25: Eq<
  Old.components["schemas"]["Internal_AlgorandOperation_Payment"],
  New.components["schemas"]["Internal_AlgorandOperation_Payment"]
> = true
export const _26: Eq<
  Old.components["schemas"]["Internal_AlgorandTickerProperties"],
  New.components["schemas"]["Internal_AlgorandTickerProperties"]
> = true
export const _27: Eq<
  Old.components["schemas"]["Internal_AlgorandTickerProperties_Native"],
  New.components["schemas"]["Internal_AlgorandTickerProperties_Native"]
> = true
export const _28: Eq<
  Old.components["schemas"]["Internal_ApiCbInDecryptionStatusResponse"],
  New.components["schemas"]["Internal_ApiCbInDecryptionStatusResponse"]
> = true
export const _29: Eq<
  Old.components["schemas"]["Internal_ApiInitiateCbInDecryptionRequest"],
  New.components["schemas"]["Internal_ApiInitiateCbInDecryptionRequest"]
> = true
export const _30: Eq<
  Old.components["schemas"]["Internal_ApiInitiateCbInDecryptionResponse"],
  New.components["schemas"]["Internal_ApiInitiateCbInDecryptionResponse"]
> = true
export const _31: Eq<
  Old.components["schemas"]["Internal_ApiTicker"],
  New.components["schemas"]["Internal_ApiTicker"]
> = true
export const _32: Eq<
  Old.components["schemas"]["Internal_ApiTickerData"],
  New.components["schemas"]["Internal_ApiTickerData"]
> = true
export const _33: Eq<
  Old.components["schemas"]["Internal_ApiTransfer"],
  New.components["schemas"]["Internal_ApiTransfer"]
> = true
export const _34: Eq<
  Old.components["schemas"]["Internal_ApprovalDecision"],
  New.components["schemas"]["Internal_ApprovalDecision"]
> = true
export const _35: Eq<
  Old.components["schemas"]["Internal_AttemptInterruptTransaction"],
  New.components["schemas"]["Internal_AttemptInterruptTransaction"]
> = true
export const _36: Eq<
  Old.components["schemas"]["Internal_Backup"],
  New.components["schemas"]["Internal_Backup"]
> = true
export const _37: Eq<
  Old.components["schemas"]["Internal_BackupCreated"],
  New.components["schemas"]["Internal_BackupCreated"]
> = true
export const _38: Eq<
  Old.components["schemas"]["Internal_BackupData"],
  New.components["schemas"]["Internal_BackupData"]
> = true
export const _39: Eq<
  Old.components["schemas"]["Internal_BackupData_VaultHsm"],
  New.components["schemas"]["Internal_BackupData_VaultHsm"]
> = true
export const _40: Eq<
  Old.components["schemas"]["Internal_BackupData_VaultMpc"],
  New.components["schemas"]["Internal_BackupData_VaultMpc"]
> = true
export const _41: Eq<
  Old.components["schemas"]["Internal_BackupPending"],
  New.components["schemas"]["Internal_BackupPending"]
> = true
export const _42: Eq<
  Old.components["schemas"]["Internal_BackupPrepared"],
  New.components["schemas"]["Internal_BackupPrepared"]
> = true
export const _43: Eq<
  Old.components["schemas"]["Internal_BackupUpdated"],
  New.components["schemas"]["Internal_BackupUpdated"]
> = true
export const _44: Eq<
  Old.components["schemas"]["Internal_BalancesUpdated"],
  New.components["schemas"]["Internal_BalancesUpdated"]
> = true
export const _45: Eq<
  Old.components["schemas"]["Internal_BatchEntry"],
  New.components["schemas"]["Internal_BatchEntry"]
> = true
export const _46: Eq<
  Old.components["schemas"]["Internal_BatchEntry_ParticipantOperation"],
  New.components["schemas"]["Internal_BatchEntry_ParticipantOperation"]
> = true
export const _47: Eq<
  Old.components["schemas"]["Internal_BatchEntry_SubmitterOperation"],
  New.components["schemas"]["Internal_BatchEntry_SubmitterOperation"]
> = true
export const _48: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation"],
  New.components["schemas"]["Internal_BatchInnerOperation"]
> = true
export const _49: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_AccountSet"],
  New.components["schemas"]["Internal_BatchInnerOperation_AccountSet"]
> = true
export const _50: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_Clawback"],
  New.components["schemas"]["Internal_BatchInnerOperation_Clawback"]
> = true
export const _51: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_ConfidentialMPTConvert"],
  New.components["schemas"]["Internal_BatchInnerOperation_ConfidentialMPTConvert"]
> = true
export const _52: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_ConfidentialMPTConvertBack"],
  New.components["schemas"]["Internal_BatchInnerOperation_ConfidentialMPTConvertBack"]
> = true
export const _53: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_ConfidentialMPTMergeInbox"],
  New.components["schemas"]["Internal_BatchInnerOperation_ConfidentialMPTMergeInbox"]
> = true
export const _54: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_ConfidentialMPTSend"],
  New.components["schemas"]["Internal_BatchInnerOperation_ConfidentialMPTSend"]
> = true
export const _55: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_DepositPreauth"],
  New.components["schemas"]["Internal_BatchInnerOperation_DepositPreauth"]
> = true
export const _56: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_EscrowFinish"],
  New.components["schemas"]["Internal_BatchInnerOperation_EscrowFinish"]
> = true
export const _57: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_MPTokenAuthorize"],
  New.components["schemas"]["Internal_BatchInnerOperation_MPTokenAuthorize"]
> = true
export const _58: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_MPTokenIssuanceCreate"],
  New.components["schemas"]["Internal_BatchInnerOperation_MPTokenIssuanceCreate"]
> = true
export const _59: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_MPTokenIssuanceDestroy"],
  New.components["schemas"]["Internal_BatchInnerOperation_MPTokenIssuanceDestroy"]
> = true
export const _60: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_MPTokenIssuanceSet"],
  New.components["schemas"]["Internal_BatchInnerOperation_MPTokenIssuanceSet"]
> = true
export const _61: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_OfferCreate"],
  New.components["schemas"]["Internal_BatchInnerOperation_OfferCreate"]
> = true
export const _62: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_Payment"],
  New.components["schemas"]["Internal_BatchInnerOperation_Payment"]
> = true
export const _63: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_TicketCreate"],
  New.components["schemas"]["Internal_BatchInnerOperation_TicketCreate"]
> = true
export const _64: Eq<
  Old.components["schemas"]["Internal_BatchInnerOperation_TrustSet"],
  New.components["schemas"]["Internal_BatchInnerOperation_TrustSet"]
> = true
export const _65: Eq<
  Old.components["schemas"]["Internal_BatchSigner"],
  New.components["schemas"]["Internal_BatchSigner"]
> = true
export const _66: Eq<
  Old.components["schemas"]["Internal_BitcoinFeeStrategy"],
  New.components["schemas"]["Internal_BitcoinFeeStrategy"]
> = true
export const _67: Eq<
  Old.components["schemas"]["Internal_BitcoinFeeStrategy_Priority"],
  New.components["schemas"]["Internal_BitcoinFeeStrategy_Priority"]
> = true
export const _68: Eq<
  Old.components["schemas"]["Internal_BitcoinFeeStrategy_SpecifiedRate"],
  New.components["schemas"]["Internal_BitcoinFeeStrategy_SpecifiedRate"]
> = true
export const _69: Eq<
  Old.components["schemas"]["Internal_BitcoinLikeVaultLedgerIdentifier"],
  New.components["schemas"]["Internal_BitcoinLikeVaultLedgerIdentifier"]
> = true
export const _70: Eq<
  Old.components["schemas"]["Internal_BitcoinOutputParameters"],
  New.components["schemas"]["Internal_BitcoinOutputParameters"]
> = true
export const _71: Eq<
  Old.components["schemas"]["Internal_BitcoinResourceStrategy"],
  New.components["schemas"]["Internal_BitcoinResourceStrategy"]
> = true
export const _72: Eq<
  Old.components["schemas"]["Internal_BitcoinResourceStrategy_OrderReplacement"],
  New.components["schemas"]["Internal_BitcoinResourceStrategy_OrderReplacement"]
> = true
export const _73: Eq<
  Old.components["schemas"]["Internal_BitcoinTickerProperties"],
  New.components["schemas"]["Internal_BitcoinTickerProperties"]
> = true
export const _74: Eq<
  Old.components["schemas"]["Internal_BitcoinTickerProperties_Native"],
  New.components["schemas"]["Internal_BitcoinTickerProperties_Native"]
> = true
export const _75: Eq<
  Old.components["schemas"]["Internal_CardanoFeeStrategy"],
  New.components["schemas"]["Internal_CardanoFeeStrategy"]
> = true
export const _76: Eq<
  Old.components["schemas"]["Internal_CardanoFeeStrategy_Priority"],
  New.components["schemas"]["Internal_CardanoFeeStrategy_Priority"]
> = true
export const _77: Eq<
  Old.components["schemas"]["Internal_CardanoOperation"],
  New.components["schemas"]["Internal_CardanoOperation"]
> = true
export const _78: Eq<
  Old.components["schemas"]["Internal_CardanoOperation_DelegateRepresentative"],
  New.components["schemas"]["Internal_CardanoOperation_DelegateRepresentative"]
> = true
export const _79: Eq<
  Old.components["schemas"]["Internal_CardanoOperation_DelegateStaking"],
  New.components["schemas"]["Internal_CardanoOperation_DelegateStaking"]
> = true
export const _80: Eq<
  Old.components["schemas"]["Internal_CardanoOperation_RegisterStaking"],
  New.components["schemas"]["Internal_CardanoOperation_RegisterStaking"]
> = true
export const _81: Eq<
  Old.components["schemas"]["Internal_CardanoOperation_Transfer"],
  New.components["schemas"]["Internal_CardanoOperation_Transfer"]
> = true
export const _82: Eq<
  Old.components["schemas"]["Internal_CardanoOperation_UnregisterStaking"],
  New.components["schemas"]["Internal_CardanoOperation_UnregisterStaking"]
> = true
export const _83: Eq<
  Old.components["schemas"]["Internal_CardanoOperation_WithdrawRewards"],
  New.components["schemas"]["Internal_CardanoOperation_WithdrawRewards"]
> = true
export const _84: Eq<
  Old.components["schemas"]["Internal_CardanoOutputParameters"],
  New.components["schemas"]["Internal_CardanoOutputParameters"]
> = true
export const _85: Eq<
  Old.components["schemas"]["Internal_CardanoTickerProperties"],
  New.components["schemas"]["Internal_CardanoTickerProperties"]
> = true
export const _86: Eq<
  Old.components["schemas"]["Internal_CardanoTickerProperties_Native"],
  New.components["schemas"]["Internal_CardanoTickerProperties_Native"]
> = true
export const _87: Eq<
  Old.components["schemas"]["Internal_CmptCryptographicFields"],
  New.components["schemas"]["Internal_CmptCryptographicFields"]
> = true
export const _88: Eq<
  Old.components["schemas"]["Internal_CmptCryptographicFields_Clawback"],
  New.components["schemas"]["Internal_CmptCryptographicFields_Clawback"]
> = true
export const _89: Eq<
  Old.components["schemas"]["Internal_CmptCryptographicFields_Convert"],
  New.components["schemas"]["Internal_CmptCryptographicFields_Convert"]
> = true
export const _90: Eq<
  Old.components["schemas"]["Internal_CmptCryptographicFields_ConvertBack"],
  New.components["schemas"]["Internal_CmptCryptographicFields_ConvertBack"]
> = true
export const _91: Eq<
  Old.components["schemas"]["Internal_CmptCryptographicFields_Send"],
  New.components["schemas"]["Internal_CmptCryptographicFields_Send"]
> = true
export const _92: Eq<
  Old.components["schemas"]["Internal_ComplianceConfigurationUpdated"],
  New.components["schemas"]["Internal_ComplianceConfigurationUpdated"]
> = true
export const _93: Eq<
  Old.components["schemas"]["Internal_ContractParameters"],
  New.components["schemas"]["Internal_ContractParameters"]
> = true
export const _94: Eq<
  Old.components["schemas"]["Internal_ContractParameters_Raw"],
  New.components["schemas"]["Internal_ContractParameters_Raw"]
> = true
export const _95: Eq<
  Old.components["schemas"]["Internal_CreateDomainGenesisPolicy"],
  New.components["schemas"]["Internal_CreateDomainGenesisPolicy"]
> = true
export const _96: Eq<
  Old.components["schemas"]["Internal_CreateDomainGenesisUser"],
  New.components["schemas"]["Internal_CreateDomainGenesisUser"]
> = true
export const _97: Eq<
  Old.components["schemas"]["Internal_CreateDomainsPayload"],
  New.components["schemas"]["Internal_CreateDomainsPayload"]
> = true
export const _98: Eq<
  Old.components["schemas"]["Internal_CreateLedgerGenesis"],
  New.components["schemas"]["Internal_CreateLedgerGenesis"]
> = true
export const _99: Eq<
  Old.components["schemas"]["Internal_CreateTransferOrderOutput"],
  New.components["schemas"]["Internal_CreateTransferOrderOutput"]
> = true
export const _100: Eq<
  Old.components["schemas"]["Internal_CreatedEntitiesReferences"],
  New.components["schemas"]["Internal_CreatedEntitiesReferences"]
> = true
export const _101: Eq<
  Old.components["schemas"]["Internal_CreatedEntitiesReferences_Policy"],
  New.components["schemas"]["Internal_CreatedEntitiesReferences_Policy"]
> = true
export const _102: Eq<
  Old.components["schemas"]["Internal_CreatedEntitiesReferences_User"],
  New.components["schemas"]["Internal_CreatedEntitiesReferences_User"]
> = true
export const _103: Eq<
  Old.components["schemas"]["Internal_CurrentVault"],
  New.components["schemas"]["Internal_CurrentVault"]
> = true
export const _104: Eq<
  Old.components["schemas"]["Internal_DecisionPayload"],
  New.components["schemas"]["Internal_DecisionPayload"]
> = true
export const _105: Eq<
  Old.components["schemas"]["Internal_DecryptCbsPending"],
  New.components["schemas"]["Internal_DecryptCbsPending"]
> = true
export const _106: Eq<
  Old.components["schemas"]["Internal_DecryptCbsPrepared"],
  New.components["schemas"]["Internal_DecryptCbsPrepared"]
> = true
export const _107: Eq<
  Old.components["schemas"]["Internal_DelegateRepresentativeParameters"],
  New.components["schemas"]["Internal_DelegateRepresentativeParameters"]
> = true
export const _108: Eq<
  Old.components["schemas"]["Internal_DelegateRepresentativeParameters_AlwaysAbstain"],
  New.components["schemas"]["Internal_DelegateRepresentativeParameters_AlwaysAbstain"]
> = true
export const _109: Eq<
  Old.components["schemas"]["Internal_Domain"],
  New.components["schemas"]["Internal_Domain"]
> = true
export const _110: Eq<
  Old.components["schemas"]["Internal_DomainCreated"],
  New.components["schemas"]["Internal_DomainCreated"]
> = true
export const _111: Eq<
  Old.components["schemas"]["Internal_DomainUpdated"],
  New.components["schemas"]["Internal_DomainUpdated"]
> = true
export const _112: Eq<
  Old.components["schemas"]["Internal_ElGamalKeyProvisioned"],
  New.components["schemas"]["Internal_ElGamalKeyProvisioned"]
> = true
export const _113: Eq<
  Old.components["schemas"]["Internal_ElGamalKeyProvisioningFailed"],
  New.components["schemas"]["Internal_ElGamalKeyProvisioningFailed"]
> = true
export const _114: Eq<
  Old.components["schemas"]["Internal_Endpoint"],
  New.components["schemas"]["Internal_Endpoint"]
> = true
export const _115: Eq<
  Old.components["schemas"]["Internal_EndpointCreated"],
  New.components["schemas"]["Internal_EndpointCreated"]
> = true
export const _116: Eq<
  Old.components["schemas"]["Internal_EndpointLedgerParameters"],
  New.components["schemas"]["Internal_EndpointLedgerParameters"]
> = true
export const _117: Eq<
  Old.components["schemas"]["Internal_EndpointLedgerParameters_Ethereum"],
  New.components["schemas"]["Internal_EndpointLedgerParameters_Ethereum"]
> = true
export const _118: Eq<
  Old.components["schemas"]["Internal_EndpointUpdated"],
  New.components["schemas"]["Internal_EndpointUpdated"]
> = true
export const _119: Eq<
  Old.components["schemas"]["Internal_EntityIdAndRevision"],
  New.components["schemas"]["Internal_EntityIdAndRevision"]
> = true
export const _120: Eq<
  Old.components["schemas"]["Internal_EntityMetadata"],
  New.components["schemas"]["Internal_EntityMetadata"]
> = true
export const _121: Eq<
  Old.components["schemas"]["Internal_EntityStringIdAndRevision"],
  New.components["schemas"]["Internal_EntityStringIdAndRevision"]
> = true
export const _122: Eq<
  Old.components["schemas"]["Internal_ErrorMessage"],
  New.components["schemas"]["Internal_ErrorMessage"]
> = true
export const _123: Eq<
  Old.components["schemas"]["Internal_EthereumFeeStrategy"],
  New.components["schemas"]["Internal_EthereumFeeStrategy"]
> = true
export const _124: Eq<
  Old.components["schemas"]["Internal_EthereumFeeStrategy_Priority"],
  New.components["schemas"]["Internal_EthereumFeeStrategy_Priority"]
> = true
export const _125: Eq<
  Old.components["schemas"]["Internal_EthereumFeeStrategy_SpecifiedRate"],
  New.components["schemas"]["Internal_EthereumFeeStrategy_SpecifiedRate"]
> = true
export const _126: Eq<
  Old.components["schemas"]["Internal_EthereumFeeStrategy_SpecifiedRateEIP1559"],
  New.components["schemas"]["Internal_EthereumFeeStrategy_SpecifiedRateEIP1559"]
> = true
export const _127: Eq<
  Old.components["schemas"]["Internal_EthereumLikeVaultLedgerIdentifier"],
  New.components["schemas"]["Internal_EthereumLikeVaultLedgerIdentifier"]
> = true
export const _128: Eq<
  Old.components["schemas"]["Internal_EthereumResourceStrategy"],
  New.components["schemas"]["Internal_EthereumResourceStrategy"]
> = true
export const _129: Eq<
  Old.components["schemas"]["Internal_EthereumResourceStrategy_OrderReplacement"],
  New.components["schemas"]["Internal_EthereumResourceStrategy_OrderReplacement"]
> = true
export const _130: Eq<
  Old.components["schemas"]["Internal_EthereumTickerProperties"],
  New.components["schemas"]["Internal_EthereumTickerProperties"]
> = true
export const _131: Eq<
  Old.components["schemas"]["Internal_EthereumTickerProperties_ERC1155"],
  New.components["schemas"]["Internal_EthereumTickerProperties_ERC1155"]
> = true
export const _132: Eq<
  Old.components["schemas"]["Internal_EthereumTickerProperties_ERC20"],
  New.components["schemas"]["Internal_EthereumTickerProperties_ERC20"]
> = true
export const _133: Eq<
  Old.components["schemas"]["Internal_EthereumTickerProperties_ERC721"],
  New.components["schemas"]["Internal_EthereumTickerProperties_ERC721"]
> = true
export const _134: Eq<
  Old.components["schemas"]["Internal_EthereumTickerProperties_Native"],
  New.components["schemas"]["Internal_EthereumTickerProperties_Native"]
> = true
export const _135: Eq<
  Old.components["schemas"]["Internal_EvaluationContext"],
  New.components["schemas"]["Internal_EvaluationContext"]
> = true
export const _136: Eq<
  Old.components["schemas"]["Internal_EvaluationContextReferences"],
  New.components["schemas"]["Internal_EvaluationContextReferences"]
> = true
export const _137: Eq<
  Old.components["schemas"]["Internal_EventsCollection"],
  New.components["schemas"]["Internal_EventsCollection"]
> = true
export const _138: Eq<
  Old.components["schemas"]["Internal_FeePriority"],
  New.components["schemas"]["Internal_FeePriority"]
> = true
export const _139: Eq<
  Old.components["schemas"]["Internal_Genesis"],
  New.components["schemas"]["Internal_Genesis"]
> = true
export const _140: Eq<
  Old.components["schemas"]["Internal_GenesisCryptoSetup"],
  New.components["schemas"]["Internal_GenesisCryptoSetup"]
> = true
export const _141: Eq<
  Old.components["schemas"]["Internal_GenesisData"],
  New.components["schemas"]["Internal_GenesisData"]
> = true
export const _142: Eq<
  Old.components["schemas"]["Internal_GenesisPayload"],
  New.components["schemas"]["Internal_GenesisPayload"]
> = true
export const _143: Eq<
  Old.components["schemas"]["Internal_GenesisSucceeded"],
  New.components["schemas"]["Internal_GenesisSucceeded"]
> = true
export const _144: Eq<
  Old.components["schemas"]["Internal_GoverningStrategy"],
  New.components["schemas"]["Internal_GoverningStrategy"]
> = true
export const _145: Eq<
  Old.components["schemas"]["Internal_HarmonizeEvent"],
  New.components["schemas"]["Internal_HarmonizeEvent"]
> = true
export const _146: Eq<
  Old.components["schemas"]["Internal_HarmonizeEventPayload"],
  New.components["schemas"]["Internal_HarmonizeEventPayload"]
> = true
export const _147: Eq<
  Old.components["schemas"]["Internal_HederaFeeStrategy"],
  New.components["schemas"]["Internal_HederaFeeStrategy"]
> = true
export const _148: Eq<
  Old.components["schemas"]["Internal_HederaFeeStrategy_Priority"],
  New.components["schemas"]["Internal_HederaFeeStrategy_Priority"]
> = true
export const _149: Eq<
  Old.components["schemas"]["Internal_HederaOperation"],
  New.components["schemas"]["Internal_HederaOperation"]
> = true
export const _150: Eq<
  Old.components["schemas"]["Internal_HederaOperation_AccountUpdate"],
  New.components["schemas"]["Internal_HederaOperation_AccountUpdate"]
> = true
export const _151: Eq<
  Old.components["schemas"]["Internal_HederaOperation_TokenAssociate"],
  New.components["schemas"]["Internal_HederaOperation_TokenAssociate"]
> = true
export const _152: Eq<
  Old.components["schemas"]["Internal_HederaOperation_TokenDissociate"],
  New.components["schemas"]["Internal_HederaOperation_TokenDissociate"]
> = true
export const _153: Eq<
  Old.components["schemas"]["Internal_HederaOperation_Transfer"],
  New.components["schemas"]["Internal_HederaOperation_Transfer"]
> = true
export const _154: Eq<
  Old.components["schemas"]["Internal_HederaTickerProperties"],
  New.components["schemas"]["Internal_HederaTickerProperties"]
> = true
export const _155: Eq<
  Old.components["schemas"]["Internal_HederaTickerProperties_FungibleToken"],
  New.components["schemas"]["Internal_HederaTickerProperties_FungibleToken"]
> = true
export const _156: Eq<
  Old.components["schemas"]["Internal_HederaTickerProperties_Native"],
  New.components["schemas"]["Internal_HederaTickerProperties_Native"]
> = true
export const _157: Eq<
  Old.components["schemas"]["Internal_HederaTickerProperties_NonFungibleToken"],
  New.components["schemas"]["Internal_HederaTickerProperties_NonFungibleToken"]
> = true
export const _158: Eq<
  Old.components["schemas"]["Internal_HederaTransferOutput"],
  New.components["schemas"]["Internal_HederaTransferOutput"]
> = true
export const _159: Eq<
  Old.components["schemas"]["Internal_IntentAuthor"],
  New.components["schemas"]["Internal_IntentAuthor"]
> = true
export const _160: Eq<
  Old.components["schemas"]["Internal_IntentAuthor_Service"],
  New.components["schemas"]["Internal_IntentAuthor_Service"]
> = true
export const _161: Eq<
  Old.components["schemas"]["Internal_IntentAuthor_User"],
  New.components["schemas"]["Internal_IntentAuthor_User"]
> = true
export const _162: Eq<
  Old.components["schemas"]["Internal_IntentClosed"],
  New.components["schemas"]["Internal_IntentClosed"]
> = true
export const _163: Eq<
  Old.components["schemas"]["Internal_IntentContextResponse"],
  New.components["schemas"]["Internal_IntentContextResponse"]
> = true
export const _164: Eq<
  Old.components["schemas"]["Internal_IntentCreated"],
  New.components["schemas"]["Internal_IntentCreated"]
> = true
export const _165: Eq<
  Old.components["schemas"]["Internal_IntentDetails"],
  New.components["schemas"]["Internal_IntentDetails"]
> = true
export const _166: Eq<
  Old.components["schemas"]["Internal_IntentEntity"],
  New.components["schemas"]["Internal_IntentEntity"]
> = true
export const _167: Eq<
  Old.components["schemas"]["Internal_IntentError"],
  New.components["schemas"]["Internal_IntentError"]
> = true
export const _168: Eq<
  Old.components["schemas"]["Internal_IntentExecuted"],
  New.components["schemas"]["Internal_IntentExecuted"]
> = true
export const _169: Eq<
  Old.components["schemas"]["Internal_IntentLockStatus"],
  New.components["schemas"]["Internal_IntentLockStatus"]
> = true
export const _170: Eq<
  Old.components["schemas"]["Internal_IntentMetadata"],
  New.components["schemas"]["Internal_IntentMetadata"]
> = true
export const _171: Eq<
  Old.components["schemas"]["Internal_IntentOrigin"],
  New.components["schemas"]["Internal_IntentOrigin"]
> = true
export const _172: Eq<
  Old.components["schemas"]["Internal_IntentState"],
  New.components["schemas"]["Internal_IntentState"]
> = true
export const _173: Eq<
  Old.components["schemas"]["Internal_IntentStatus"],
  New.components["schemas"]["Internal_IntentStatus"]
> = true
export const _174: Eq<
  Old.components["schemas"]["Internal_IntentType"],
  New.components["schemas"]["Internal_IntentType"]
> = true
export const _175: Eq<
  Old.components["schemas"]["Internal_IntentUpdated"],
  New.components["schemas"]["Internal_IntentUpdated"]
> = true
export const _176: Eq<
  Old.components["schemas"]["Internal_KeyPurpose"],
  New.components["schemas"]["Internal_KeyPurpose"]
> = true
export const _177: Eq<
  Old.components["schemas"]["Internal_KeyType"],
  New.components["schemas"]["Internal_KeyType"]
> = true
export const _178: Eq<
  Old.components["schemas"]["Internal_Ledger"],
  New.components["schemas"]["Internal_Ledger"]
> = true
export const _179: Eq<
  Old.components["schemas"]["Internal_LedgerCreated"],
  New.components["schemas"]["Internal_LedgerCreated"]
> = true
export const _180: Eq<
  Old.components["schemas"]["Internal_LedgerParameters"],
  New.components["schemas"]["Internal_LedgerParameters"]
> = true
export const _181: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Algorand"],
  New.components["schemas"]["Internal_LedgerParameters_Algorand"]
> = true
export const _182: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Bitcoin"],
  New.components["schemas"]["Internal_LedgerParameters_Bitcoin"]
> = true
export const _183: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Cardano"],
  New.components["schemas"]["Internal_LedgerParameters_Cardano"]
> = true
export const _184: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Ethereum"],
  New.components["schemas"]["Internal_LedgerParameters_Ethereum"]
> = true
export const _185: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Hedera"],
  New.components["schemas"]["Internal_LedgerParameters_Hedera"]
> = true
export const _186: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Solana"],
  New.components["schemas"]["Internal_LedgerParameters_Solana"]
> = true
export const _187: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Stellar"],
  New.components["schemas"]["Internal_LedgerParameters_Stellar"]
> = true
export const _188: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Substrate"],
  New.components["schemas"]["Internal_LedgerParameters_Substrate"]
> = true
export const _189: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Tezos"],
  New.components["schemas"]["Internal_LedgerParameters_Tezos"]
> = true
export const _190: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_Tron"],
  New.components["schemas"]["Internal_LedgerParameters_Tron"]
> = true
export const _191: Eq<
  Old.components["schemas"]["Internal_LedgerParameters_XRPL"],
  New.components["schemas"]["Internal_LedgerParameters_XRPL"]
> = true
export const _192: Eq<
  Old.components["schemas"]["Internal_LedgerUpdated"],
  New.components["schemas"]["Internal_LedgerUpdated"]
> = true
export const _193: Eq<
  Old.components["schemas"]["Internal_LockStatus"],
  New.components["schemas"]["Internal_LockStatus"]
> = true
export const _194: Eq<
  Old.components["schemas"]["Internal_LoginId"],
  New.components["schemas"]["Internal_LoginId"]
> = true
export const _195: Eq<
  Old.components["schemas"]["Internal_MPTokenIssuanceMetadata"],
  New.components["schemas"]["Internal_MPTokenIssuanceMetadata"]
> = true
export const _196: Eq<
  Old.components["schemas"]["Internal_MPTokenIssuanceMetadata_HexEncodedMetadata"],
  New.components["schemas"]["Internal_MPTokenIssuanceMetadata_HexEncodedMetadata"]
> = true
export const _197: Eq<
  Old.components["schemas"]["Internal_Manifest"],
  New.components["schemas"]["Internal_Manifest"]
> = true
export const _198: Eq<
  Old.components["schemas"]["Internal_ManifestContent"],
  New.components["schemas"]["Internal_ManifestContent"]
> = true
export const _199: Eq<
  Old.components["schemas"]["Internal_ManifestContent_EIP-191"],
  New.components["schemas"]["Internal_ManifestContent_EIP-191"]
> = true
export const _200: Eq<
  Old.components["schemas"]["Internal_ManifestContent_JWT"],
  New.components["schemas"]["Internal_ManifestContent_JWT"]
> = true
export const _201: Eq<
  Old.components["schemas"]["Internal_ManifestContent_JWT_Header"],
  New.components["schemas"]["Internal_ManifestContent_JWT_Header"]
> = true
export const _202: Eq<
  Old.components["schemas"]["Internal_ManifestContent_JWT_Payload"],
  New.components["schemas"]["Internal_ManifestContent_JWT_Payload"]
> = true
export const _203: Eq<
  Old.components["schemas"]["Internal_ManifestContent_Unsafe"],
  New.components["schemas"]["Internal_ManifestContent_Unsafe"]
> = true
export const _204: Eq<
  Old.components["schemas"]["Internal_ManifestCreated"],
  New.components["schemas"]["Internal_ManifestCreated"]
> = true
export const _205: Eq<
  Old.components["schemas"]["Internal_ManifestPending"],
  New.components["schemas"]["Internal_ManifestPending"]
> = true
export const _206: Eq<
  Old.components["schemas"]["Internal_ManifestUpdated"],
  New.components["schemas"]["Internal_ManifestUpdated"]
> = true
export const _207: Eq<
  Old.components["schemas"]["Internal_ManifestValue"],
  New.components["schemas"]["Internal_ManifestValue"]
> = true
export const _208: Eq<
  Old.components["schemas"]["Internal_ManifestValue_EIP-191"],
  New.components["schemas"]["Internal_ManifestValue_EIP-191"]
> = true
export const _209: Eq<
  Old.components["schemas"]["Internal_ManifestValue_JWT"],
  New.components["schemas"]["Internal_ManifestValue_JWT"]
> = true
export const _210: Eq<
  Old.components["schemas"]["Internal_ManifestValue_Unsafe"],
  New.components["schemas"]["Internal_ManifestValue_Unsafe"]
> = true
export const _211: Eq<
  Old.components["schemas"]["Internal_Map_Account"],
  New.components["schemas"]["Internal_Map_Account"]
> = true
export const _212: Eq<
  Old.components["schemas"]["Internal_Map_Backup"],
  New.components["schemas"]["Internal_Map_Backup"]
> = true
export const _213: Eq<
  Old.components["schemas"]["Internal_Map_Domain"],
  New.components["schemas"]["Internal_Map_Domain"]
> = true
export const _214: Eq<
  Old.components["schemas"]["Internal_Map_Endpoint"],
  New.components["schemas"]["Internal_Map_Endpoint"]
> = true
export const _215: Eq<
  Old.components["schemas"]["Internal_Map_Ledger"],
  New.components["schemas"]["Internal_Map_Ledger"]
> = true
export const _216: Eq<
  Old.components["schemas"]["Internal_Map_Manifest"],
  New.components["schemas"]["Internal_Map_Manifest"]
> = true
export const _217: Eq<
  Old.components["schemas"]["Internal_Map_Policy"],
  New.components["schemas"]["Internal_Map_Policy"]
> = true
export const _218: Eq<
  Old.components["schemas"]["Internal_Map_SystemProperty"],
  New.components["schemas"]["Internal_Map_SystemProperty"]
> = true
export const _219: Eq<
  Old.components["schemas"]["Internal_Map_TransactionOrder"],
  New.components["schemas"]["Internal_Map_TransactionOrder"]
> = true
export const _220: Eq<
  Old.components["schemas"]["Internal_Map_User"],
  New.components["schemas"]["Internal_Map_User"]
> = true
export const _221: Eq<
  Old.components["schemas"]["Internal_Map_ValidatedTicker"],
  New.components["schemas"]["Internal_Map_ValidatedTicker"]
> = true
export const _222: Eq<
  Old.components["schemas"]["Internal_Map_Vault"],
  New.components["schemas"]["Internal_Map_Vault"]
> = true
export const _223: Eq<
  Old.components["schemas"]["Internal_Network"],
  New.components["schemas"]["Internal_Network"]
> = true
export const _224: Eq<
  Old.components["schemas"]["Internal_NonFungibleTokenDestination"],
  New.components["schemas"]["Internal_NonFungibleTokenDestination"]
> = true
export const _225: Eq<
  Old.components["schemas"]["Internal_NonFungibleTokenDestination_NftTokenId"],
  New.components["schemas"]["Internal_NonFungibleTokenDestination_NftTokenId"]
> = true
export const _226: Eq<
  Old.components["schemas"]["Internal_NonFungibleTokenDestination_Ticker"],
  New.components["schemas"]["Internal_NonFungibleTokenDestination_Ticker"]
> = true
export const _227: Eq<
  Old.components["schemas"]["Internal_NotaryApiKeyValue"],
  New.components["schemas"]["Internal_NotaryApiKeyValue"]
> = true
export const _228: Eq<
  Old.components["schemas"]["Internal_NotaryCollectionsKeyValue"],
  New.components["schemas"]["Internal_NotaryCollectionsKeyValue"]
> = true
export const _229: Eq<
  Old.components["schemas"]["Internal_NotaryCommunicationKeyValue"],
  New.components["schemas"]["Internal_NotaryCommunicationKeyValue"]
> = true
export const _230: Eq<
  Old.components["schemas"]["Internal_NotarySystemSignedIntentsEnabledValue"],
  New.components["schemas"]["Internal_NotarySystemSignedIntentsEnabledValue"]
> = true
export const _231: Eq<
  Old.components["schemas"]["Internal_NotarySystemSigningKeyValue"],
  New.components["schemas"]["Internal_NotarySystemSigningKeyValue"]
> = true
export const _232: Eq<
  Old.components["schemas"]["Internal_ParametersComputePending"],
  New.components["schemas"]["Internal_ParametersComputePending"]
> = true
export const _233: Eq<
  Old.components["schemas"]["Internal_ParametersComputePrepared"],
  New.components["schemas"]["Internal_ParametersComputePrepared"]
> = true
export const _234: Eq<
  Old.components["schemas"]["Internal_Participant"],
  New.components["schemas"]["Internal_Participant"]
> = true
export const _235: Eq<
  Old.components["schemas"]["Internal_ParticipantSequencing"],
  New.components["schemas"]["Internal_ParticipantSequencing"]
> = true
export const _236: Eq<
  Old.components["schemas"]["Internal_ParticipantSequencing_AccountSequence"],
  New.components["schemas"]["Internal_ParticipantSequencing_AccountSequence"]
> = true
export const _237: Eq<
  Old.components["schemas"]["Internal_ParticipantSequencing_Ticket"],
  New.components["schemas"]["Internal_ParticipantSequencing_Ticket"]
> = true
export const _238: Eq<
  Old.components["schemas"]["Internal_Participant_Account"],
  New.components["schemas"]["Internal_Participant_Account"]
> = true
export const _239: Eq<
  Old.components["schemas"]["Internal_Participant_Address"],
  New.components["schemas"]["Internal_Participant_Address"]
> = true
export const _240: Eq<
  Old.components["schemas"]["Internal_Participant_Endpoint"],
  New.components["schemas"]["Internal_Participant_Endpoint"]
> = true
export const _241: Eq<
  Old.components["schemas"]["Internal_Permissions"],
  New.components["schemas"]["Internal_Permissions"]
> = true
export const _242: Eq<
  Old.components["schemas"]["Internal_Policy"],
  New.components["schemas"]["Internal_Policy"]
> = true
export const _243: Eq<
  Old.components["schemas"]["Internal_PolicyCondition"],
  New.components["schemas"]["Internal_PolicyCondition"]
> = true
export const _244: Eq<
  Old.components["schemas"]["Internal_PolicyCondition_And"],
  New.components["schemas"]["Internal_PolicyCondition_And"]
> = true
export const _245: Eq<
  Old.components["schemas"]["Internal_PolicyCondition_Expression"],
  New.components["schemas"]["Internal_PolicyCondition_Expression"]
> = true
export const _246: Eq<
  Old.components["schemas"]["Internal_PolicyCondition_Or"],
  New.components["schemas"]["Internal_PolicyCondition_Or"]
> = true
export const _247: Eq<
  Old.components["schemas"]["Internal_PolicyCreated"],
  New.components["schemas"]["Internal_PolicyCreated"]
> = true
export const _248: Eq<
  Old.components["schemas"]["Internal_PolicyReference"],
  New.components["schemas"]["Internal_PolicyReference"]
> = true
export const _249: Eq<
  Old.components["schemas"]["Internal_PolicyScope"],
  New.components["schemas"]["Internal_PolicyScope"]
> = true
export const _250: Eq<
  Old.components["schemas"]["Internal_PolicyUpdated"],
  New.components["schemas"]["Internal_PolicyUpdated"]
> = true
export const _251: Eq<
  Old.components["schemas"]["Internal_PreferredAddressForChange"],
  New.components["schemas"]["Internal_PreferredAddressForChange"]
> = true
export const _252: Eq<
  Old.components["schemas"]["Internal_ProposalPayload"],
  New.components["schemas"]["Internal_ProposalPayload"]
> = true
export const _253: Eq<
  Old.components["schemas"]["Internal_Propose"],
  New.components["schemas"]["Internal_Propose"]
> = true
export const _254: Eq<
  Old.components["schemas"]["Internal_ProposeTransactionOrderParameters"],
  New.components["schemas"]["Internal_ProposeTransactionOrderParameters"]
> = true
export const _255: Eq<
  Old.components["schemas"]["Internal_ProposeUserIntentPayload"],
  New.components["schemas"]["Internal_ProposeUserIntentPayload"]
> = true
export const _256: Eq<
  Old.components["schemas"]["Internal_Propose_v0_CreateTransactionOrder"],
  New.components["schemas"]["Internal_Propose_v0_CreateTransactionOrder"]
> = true
export const _257: Eq<
  Old.components["schemas"]["Internal_PurposeKey"],
  New.components["schemas"]["Internal_PurposeKey"]
> = true
export const _258: Eq<
  Old.components["schemas"]["Internal_QuarantineApplied"],
  New.components["schemas"]["Internal_QuarantineApplied"]
> = true
export const _259: Eq<
  Old.components["schemas"]["Internal_QuarantineSkipped"],
  New.components["schemas"]["Internal_QuarantineSkipped"]
> = true
export const _260: Eq<
  Old.components["schemas"]["Internal_QuarantineStatus"],
  New.components["schemas"]["Internal_QuarantineStatus"]
> = true
export const _261: Eq<
  Old.components["schemas"]["Internal_ReadAccess"],
  New.components["schemas"]["Internal_ReadAccess"]
> = true
export const _262: Eq<
  Old.components["schemas"]["Internal_ReadWriteSystemPropertyKeyValue"],
  New.components["schemas"]["Internal_ReadWriteSystemPropertyKeyValue"]
> = true
export const _263: Eq<
  Old.components["schemas"]["Internal_ReadWriteSystemPropertyKeyValue_NotarySystemSignedIntentsEnabledProperty"],
  New.components["schemas"]["Internal_ReadWriteSystemPropertyKeyValue_NotarySystemSignedIntentsEnabledProperty"]
> = true
export const _264: Eq<
  Old.components["schemas"]["Internal_ReadWriteSystemPropertyKeyValue_StateReviewAuthorityProperty"],
  New.components["schemas"]["Internal_ReadWriteSystemPropertyKeyValue_StateReviewAuthorityProperty"]
> = true
export const _265: Eq<
  Old.components["schemas"]["Internal_RecipientTransferParty"],
  New.components["schemas"]["Internal_RecipientTransferParty"]
> = true
export const _266: Eq<
  Old.components["schemas"]["Internal_RecipientTransferParty_Account"],
  New.components["schemas"]["Internal_RecipientTransferParty_Account"]
> = true
export const _267: Eq<
  Old.components["schemas"]["Internal_RecipientTransferParty_Address"],
  New.components["schemas"]["Internal_RecipientTransferParty_Address"]
> = true
export const _268: Eq<
  Old.components["schemas"]["Internal_ResolvedEndpoint"],
  New.components["schemas"]["Internal_ResolvedEndpoint"]
> = true
export const _269: Eq<
  Old.components["schemas"]["Internal_RewrapPending"],
  New.components["schemas"]["Internal_RewrapPending"]
> = true
export const _270: Eq<
  Old.components["schemas"]["Internal_RewrapPrepared"],
  New.components["schemas"]["Internal_RewrapPrepared"]
> = true
export const _271: Eq<
  Old.components["schemas"]["Internal_RootDomainSetup"],
  New.components["schemas"]["Internal_RootDomainSetup"]
> = true
export const _272: Eq<
  Old.components["schemas"]["Internal_ScriptingEngine"],
  New.components["schemas"]["Internal_ScriptingEngine"]
> = true
export const _273: Eq<
  Old.components["schemas"]["Internal_SenderTransferParty"],
  New.components["schemas"]["Internal_SenderTransferParty"]
> = true
export const _274: Eq<
  Old.components["schemas"]["Internal_SenderTransferParty_Account"],
  New.components["schemas"]["Internal_SenderTransferParty_Account"]
> = true
export const _275: Eq<
  Old.components["schemas"]["Internal_SenderTransferParty_Address"],
  New.components["schemas"]["Internal_SenderTransferParty_Address"]
> = true
export const _276: Eq<
  Old.components["schemas"]["Internal_Sequencing"],
  New.components["schemas"]["Internal_Sequencing"]
> = true
export const _277: Eq<
  Old.components["schemas"]["Internal_Sequencing_AccountSequence"],
  New.components["schemas"]["Internal_Sequencing_AccountSequence"]
> = true
export const _278: Eq<
  Old.components["schemas"]["Internal_Sequencing_PlatformManaged"],
  New.components["schemas"]["Internal_Sequencing_PlatformManaged"]
> = true
export const _279: Eq<
  Old.components["schemas"]["Internal_Sequencing_Ticket"],
  New.components["schemas"]["Internal_Sequencing_Ticket"]
> = true
export const _280: Eq<
  Old.components["schemas"]["Internal_Service"],
  New.components["schemas"]["Internal_Service"]
> = true
export const _281: Eq<
  Old.components["schemas"]["Internal_ServicePropose"],
  New.components["schemas"]["Internal_ServicePropose"]
> = true
export const _282: Eq<
  Old.components["schemas"]["Internal_SignedAccountPending"],
  New.components["schemas"]["Internal_SignedAccountPending"]
> = true
export const _283: Eq<
  Old.components["schemas"]["Internal_SignedManifestPending"],
  New.components["schemas"]["Internal_SignedManifestPending"]
> = true
export const _284: Eq<
  Old.components["schemas"]["Internal_SignedVaultPending"],
  New.components["schemas"]["Internal_SignedVaultPending"]
> = true
export const _285: Eq<
  Old.components["schemas"]["Internal_SkipQuarantineScope"],
  New.components["schemas"]["Internal_SkipQuarantineScope"]
> = true
export const _286: Eq<
  Old.components["schemas"]["Internal_SolanaFeeStrategy"],
  New.components["schemas"]["Internal_SolanaFeeStrategy"]
> = true
export const _287: Eq<
  Old.components["schemas"]["Internal_SolanaFeeStrategy_Priority"],
  New.components["schemas"]["Internal_SolanaFeeStrategy_Priority"]
> = true
export const _288: Eq<
  Old.components["schemas"]["Internal_SolanaMintAccount"],
  New.components["schemas"]["Internal_SolanaMintAccount"]
> = true
export const _289: Eq<
  Old.components["schemas"]["Internal_SolanaMintAccount_Destination"],
  New.components["schemas"]["Internal_SolanaMintAccount_Destination"]
> = true
export const _290: Eq<
  Old.components["schemas"]["Internal_SolanaMintAccount_Ticker"],
  New.components["schemas"]["Internal_SolanaMintAccount_Ticker"]
> = true
export const _291: Eq<
  Old.components["schemas"]["Internal_SolanaOperation"],
  New.components["schemas"]["Internal_SolanaOperation"]
> = true
export const _292: Eq<
  Old.components["schemas"]["Internal_SolanaOperation_Burn"],
  New.components["schemas"]["Internal_SolanaOperation_Burn"]
> = true
export const _293: Eq<
  Old.components["schemas"]["Internal_SolanaOperation_CreateNonceAccount"],
  New.components["schemas"]["Internal_SolanaOperation_CreateNonceAccount"]
> = true
export const _294: Eq<
  Old.components["schemas"]["Internal_SolanaOperation_FundAtaAccount"],
  New.components["schemas"]["Internal_SolanaOperation_FundAtaAccount"]
> = true
export const _295: Eq<
  Old.components["schemas"]["Internal_SolanaOperation_InitializeMint"],
  New.components["schemas"]["Internal_SolanaOperation_InitializeMint"]
> = true
export const _296: Eq<
  Old.components["schemas"]["Internal_SolanaOperation_MintTo"],
  New.components["schemas"]["Internal_SolanaOperation_MintTo"]
> = true
export const _297: Eq<
  Old.components["schemas"]["Internal_SolanaOperation_Transfer"],
  New.components["schemas"]["Internal_SolanaOperation_Transfer"]
> = true
export const _298: Eq<
  Old.components["schemas"]["Internal_SolanaOperation_TransferToken"],
  New.components["schemas"]["Internal_SolanaOperation_TransferToken"]
> = true
export const _299: Eq<
  Old.components["schemas"]["Internal_SolanaTickerProperties"],
  New.components["schemas"]["Internal_SolanaTickerProperties"]
> = true
export const _300: Eq<
  Old.components["schemas"]["Internal_SolanaTickerProperties_Native"],
  New.components["schemas"]["Internal_SolanaTickerProperties_Native"]
> = true
export const _301: Eq<
  Old.components["schemas"]["Internal_SolanaTickerProperties_Token"],
  New.components["schemas"]["Internal_SolanaTickerProperties_Token"]
> = true
export const _302: Eq<
  Old.components["schemas"]["Internal_SolanaTokenType"],
  New.components["schemas"]["Internal_SolanaTokenType"]
> = true
export const _303: Eq<
  Old.components["schemas"]["Internal_SolanaTransferOutput"],
  New.components["schemas"]["Internal_SolanaTransferOutput"]
> = true
export const _304: Eq<
  Old.components["schemas"]["Internal_SortOrder"],
  New.components["schemas"]["Internal_SortOrder"]
> = true
export const _305: Eq<
  Old.components["schemas"]["Internal_StateReviewAuthorityValue"],
  New.components["schemas"]["Internal_StateReviewAuthorityValue"]
> = true
export const _306: Eq<
  Old.components["schemas"]["Internal_StellarAsset"],
  New.components["schemas"]["Internal_StellarAsset"]
> = true
export const _307: Eq<
  Old.components["schemas"]["Internal_StellarFeeStrategy"],
  New.components["schemas"]["Internal_StellarFeeStrategy"]
> = true
export const _308: Eq<
  Old.components["schemas"]["Internal_StellarFeeStrategy_Priority"],
  New.components["schemas"]["Internal_StellarFeeStrategy_Priority"]
> = true
export const _309: Eq<
  Old.components["schemas"]["Internal_StellarFeeStrategy_SpecifiedRate"],
  New.components["schemas"]["Internal_StellarFeeStrategy_SpecifiedRate"]
> = true
export const _310: Eq<
  Old.components["schemas"]["Internal_StellarMemo"],
  New.components["schemas"]["Internal_StellarMemo"]
> = true
export const _311: Eq<
  Old.components["schemas"]["Internal_StellarMemo_Hash"],
  New.components["schemas"]["Internal_StellarMemo_Hash"]
> = true
export const _312: Eq<
  Old.components["schemas"]["Internal_StellarMemo_Id"],
  New.components["schemas"]["Internal_StellarMemo_Id"]
> = true
export const _313: Eq<
  Old.components["schemas"]["Internal_StellarMemo_Return"],
  New.components["schemas"]["Internal_StellarMemo_Return"]
> = true
export const _314: Eq<
  Old.components["schemas"]["Internal_StellarMemo_Text"],
  New.components["schemas"]["Internal_StellarMemo_Text"]
> = true
export const _315: Eq<
  Old.components["schemas"]["Internal_StellarOperation"],
  New.components["schemas"]["Internal_StellarOperation"]
> = true
export const _316: Eq<
  Old.components["schemas"]["Internal_StellarOperation_AccountMerge"],
  New.components["schemas"]["Internal_StellarOperation_AccountMerge"]
> = true
export const _317: Eq<
  Old.components["schemas"]["Internal_StellarOperation_ChangeTrust"],
  New.components["schemas"]["Internal_StellarOperation_ChangeTrust"]
> = true
export const _318: Eq<
  Old.components["schemas"]["Internal_StellarOperation_CreateAccount"],
  New.components["schemas"]["Internal_StellarOperation_CreateAccount"]
> = true
export const _319: Eq<
  Old.components["schemas"]["Internal_StellarOperation_Payment"],
  New.components["schemas"]["Internal_StellarOperation_Payment"]
> = true
export const _320: Eq<
  Old.components["schemas"]["Internal_StellarOperation_SetOptions"],
  New.components["schemas"]["Internal_StellarOperation_SetOptions"]
> = true
export const _321: Eq<
  Old.components["schemas"]["Internal_StellarOption"],
  New.components["schemas"]["Internal_StellarOption"]
> = true
export const _322: Eq<
  Old.components["schemas"]["Internal_StellarOption_OptionHomeDomain"],
  New.components["schemas"]["Internal_StellarOption_OptionHomeDomain"]
> = true
export const _323: Eq<
  Old.components["schemas"]["Internal_StellarOption_OptionSetFlag"],
  New.components["schemas"]["Internal_StellarOption_OptionSetFlag"]
> = true
export const _324: Eq<
  Old.components["schemas"]["Internal_StellarTickerProperties"],
  New.components["schemas"]["Internal_StellarTickerProperties"]
> = true
export const _325: Eq<
  Old.components["schemas"]["Internal_StellarTickerProperties_Native"],
  New.components["schemas"]["Internal_StellarTickerProperties_Native"]
> = true
export const _326: Eq<
  Old.components["schemas"]["Internal_StellarTickerProperties_Token"],
  New.components["schemas"]["Internal_StellarTickerProperties_Token"]
> = true
export const _327: Eq<
  Old.components["schemas"]["Internal_Stellar_OptionFlag"],
  New.components["schemas"]["Internal_Stellar_OptionFlag"]
> = true
export const _328: Eq<
  Old.components["schemas"]["Internal_StringsMap"],
  New.components["schemas"]["Internal_StringsMap"]
> = true
export const _329: Eq<
  Old.components["schemas"]["Internal_SubmittedTransactionPending"],
  New.components["schemas"]["Internal_SubmittedTransactionPending"]
> = true
export const _330: Eq<
  Old.components["schemas"]["Internal_SubmittedTransactionPrepared"],
  New.components["schemas"]["Internal_SubmittedTransactionPrepared"]
> = true
export const _331: Eq<
  Old.components["schemas"]["Internal_Submitter"],
  New.components["schemas"]["Internal_Submitter"]
> = true
export const _332: Eq<
  Old.components["schemas"]["Internal_SubstrateBalancesMethod"],
  New.components["schemas"]["Internal_SubstrateBalancesMethod"]
> = true
export const _333: Eq<
  Old.components["schemas"]["Internal_SubstrateBalancesMethod_TransferKeepAlive"],
  New.components["schemas"]["Internal_SubstrateBalancesMethod_TransferKeepAlive"]
> = true
export const _334: Eq<
  Old.components["schemas"]["Internal_SubstrateChainType"],
  New.components["schemas"]["Internal_SubstrateChainType"]
> = true
export const _335: Eq<
  Old.components["schemas"]["Internal_SubstrateFeeParameters"],
  New.components["schemas"]["Internal_SubstrateFeeParameters"]
> = true
export const _336: Eq<
  Old.components["schemas"]["Internal_SubstrateFeeParameters_TransactionPayment"],
  New.components["schemas"]["Internal_SubstrateFeeParameters_TransactionPayment"]
> = true
export const _337: Eq<
  Old.components["schemas"]["Internal_SubstrateFeeStrategy"],
  New.components["schemas"]["Internal_SubstrateFeeStrategy"]
> = true
export const _338: Eq<
  Old.components["schemas"]["Internal_SubstrateFeeStrategy_Priority"],
  New.components["schemas"]["Internal_SubstrateFeeStrategy_Priority"]
> = true
export const _339: Eq<
  Old.components["schemas"]["Internal_SubstrateMethodFeeParameters"],
  New.components["schemas"]["Internal_SubstrateMethodFeeParameters"]
> = true
export const _340: Eq<
  Old.components["schemas"]["Internal_SubstrateMethodFeeParameters_MethodWeight"],
  New.components["schemas"]["Internal_SubstrateMethodFeeParameters_MethodWeight"]
> = true
export const _341: Eq<
  Old.components["schemas"]["Internal_SubstrateMethodInfo"],
  New.components["schemas"]["Internal_SubstrateMethodInfo"]
> = true
export const _342: Eq<
  Old.components["schemas"]["Internal_SubstratePallet"],
  New.components["schemas"]["Internal_SubstratePallet"]
> = true
export const _343: Eq<
  Old.components["schemas"]["Internal_SubstratePalletInfo"],
  New.components["schemas"]["Internal_SubstratePalletInfo"]
> = true
export const _344: Eq<
  Old.components["schemas"]["Internal_SubstratePallet_Balances"],
  New.components["schemas"]["Internal_SubstratePallet_Balances"]
> = true
export const _345: Eq<
  Old.components["schemas"]["Internal_SubstratePallet_Staking"],
  New.components["schemas"]["Internal_SubstratePallet_Staking"]
> = true
export const _346: Eq<
  Old.components["schemas"]["Internal_SubstrateRuntimeInfo"],
  New.components["schemas"]["Internal_SubstrateRuntimeInfo"]
> = true
export const _347: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod"],
  New.components["schemas"]["Internal_SubstrateStakingMethod"]
> = true
export const _348: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_Bond"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_Bond"]
> = true
export const _349: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_BondExtra"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_BondExtra"]
> = true
export const _350: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_Chill"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_Chill"]
> = true
export const _351: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_Nominate"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_Nominate"]
> = true
export const _352: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_Rebond"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_Rebond"]
> = true
export const _353: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_SetController"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_SetController"]
> = true
export const _354: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_SetPayee"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_SetPayee"]
> = true
export const _355: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_Unbond"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_Unbond"]
> = true
export const _356: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingMethod_WithdrawUnbonded"],
  New.components["schemas"]["Internal_SubstrateStakingMethod_WithdrawUnbonded"]
> = true
export const _357: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingPayee"],
  New.components["schemas"]["Internal_SubstrateStakingPayee"]
> = true
export const _358: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingPayee_Account"],
  New.components["schemas"]["Internal_SubstrateStakingPayee_Account"]
> = true
export const _359: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingPayee_Controller"],
  New.components["schemas"]["Internal_SubstrateStakingPayee_Controller"]
> = true
export const _360: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingPayee_Staked"],
  New.components["schemas"]["Internal_SubstrateStakingPayee_Staked"]
> = true
export const _361: Eq<
  Old.components["schemas"]["Internal_SubstrateStakingPayee_Stash"],
  New.components["schemas"]["Internal_SubstrateStakingPayee_Stash"]
> = true
export const _362: Eq<
  Old.components["schemas"]["Internal_SubstrateTickerProperties"],
  New.components["schemas"]["Internal_SubstrateTickerProperties"]
> = true
export const _363: Eq<
  Old.components["schemas"]["Internal_SubstrateTickerProperties_Native"],
  New.components["schemas"]["Internal_SubstrateTickerProperties_Native"]
> = true
export const _364: Eq<
  Old.components["schemas"]["Internal_SystemProperty"],
  New.components["schemas"]["Internal_SystemProperty"]
> = true
export const _365: Eq<
  Old.components["schemas"]["Internal_SystemPropertyId"],
  New.components["schemas"]["Internal_SystemPropertyId"]
> = true
export const _366: Eq<
  Old.components["schemas"]["Internal_SystemPropertySet"],
  New.components["schemas"]["Internal_SystemPropertySet"]
> = true
export const _367: Eq<
  Old.components["schemas"]["Internal_SystemProperty_NotaryApiKeySystemProperty"],
  New.components["schemas"]["Internal_SystemProperty_NotaryApiKeySystemProperty"]
> = true
export const _368: Eq<
  Old.components["schemas"]["Internal_SystemProperty_NotaryCollectionsKeySystemProperty"],
  New.components["schemas"]["Internal_SystemProperty_NotaryCollectionsKeySystemProperty"]
> = true
export const _369: Eq<
  Old.components["schemas"]["Internal_SystemProperty_NotaryCommunicationKeySystemProperty"],
  New.components["schemas"]["Internal_SystemProperty_NotaryCommunicationKeySystemProperty"]
> = true
export const _370: Eq<
  Old.components["schemas"]["Internal_SystemProperty_NotarySystemSignedIntentsEnabledSystemProperty"],
  New.components["schemas"]["Internal_SystemProperty_NotarySystemSignedIntentsEnabledSystemProperty"]
> = true
export const _371: Eq<
  Old.components["schemas"]["Internal_SystemProperty_NotarySystemSigningKeySystemProperty"],
  New.components["schemas"]["Internal_SystemProperty_NotarySystemSigningKeySystemProperty"]
> = true
export const _372: Eq<
  Old.components["schemas"]["Internal_SystemProperty_StateReviewAuthoritySystemProperty"],
  New.components["schemas"]["Internal_SystemProperty_StateReviewAuthoritySystemProperty"]
> = true
export const _373: Eq<
  Old.components["schemas"]["Internal_TezosFeeStrategy"],
  New.components["schemas"]["Internal_TezosFeeStrategy"]
> = true
export const _374: Eq<
  Old.components["schemas"]["Internal_TezosFeeStrategy_Priority"],
  New.components["schemas"]["Internal_TezosFeeStrategy_Priority"]
> = true
export const _375: Eq<
  Old.components["schemas"]["Internal_TezosOperation"],
  New.components["schemas"]["Internal_TezosOperation"]
> = true
export const _376: Eq<
  Old.components["schemas"]["Internal_TezosOperation_Delegation"],
  New.components["schemas"]["Internal_TezosOperation_Delegation"]
> = true
export const _377: Eq<
  Old.components["schemas"]["Internal_TezosOperation_Reveal"],
  New.components["schemas"]["Internal_TezosOperation_Reveal"]
> = true
export const _378: Eq<
  Old.components["schemas"]["Internal_TezosOperation_Transaction"],
  New.components["schemas"]["Internal_TezosOperation_Transaction"]
> = true
export const _379: Eq<
  Old.components["schemas"]["Internal_TezosOperation_Undelegation"],
  New.components["schemas"]["Internal_TezosOperation_Undelegation"]
> = true
export const _380: Eq<
  Old.components["schemas"]["Internal_TezosTickerProperties"],
  New.components["schemas"]["Internal_TezosTickerProperties"]
> = true
export const _381: Eq<
  Old.components["schemas"]["Internal_TezosTickerProperties_Native"],
  New.components["schemas"]["Internal_TezosTickerProperties_Native"]
> = true
export const _382: Eq<
  Old.components["schemas"]["Internal_TickerCreated"],
  New.components["schemas"]["Internal_TickerCreated"]
> = true
export const _383: Eq<
  Old.components["schemas"]["Internal_TickerKind"],
  New.components["schemas"]["Internal_TickerKind"]
> = true
export const _384: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails"],
  New.components["schemas"]["Internal_TickerLedgerDetails"]
> = true
export const _385: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Algorand"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Algorand"]
> = true
export const _386: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Bitcoin"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Bitcoin"]
> = true
export const _387: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Cardano"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Cardano"]
> = true
export const _388: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Ethereum"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Ethereum"]
> = true
export const _389: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Hedera"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Hedera"]
> = true
export const _390: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Solana"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Solana"]
> = true
export const _391: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Stellar"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Stellar"]
> = true
export const _392: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Substrate"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Substrate"]
> = true
export const _393: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Tezos"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Tezos"]
> = true
export const _394: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_Tron"],
  New.components["schemas"]["Internal_TickerLedgerDetails_Tron"]
> = true
export const _395: Eq<
  Old.components["schemas"]["Internal_TickerLedgerDetails_XRPL"],
  New.components["schemas"]["Internal_TickerLedgerDetails_XRPL"]
> = true
export const _396: Eq<
  Old.components["schemas"]["Internal_TickerToValidate"],
  New.components["schemas"]["Internal_TickerToValidate"]
> = true
export const _397: Eq<
  Old.components["schemas"]["Internal_TickerUpdated"],
  New.components["schemas"]["Internal_TickerUpdated"]
> = true
export const _398: Eq<
  Old.components["schemas"]["Internal_TokenDestination"],
  New.components["schemas"]["Internal_TokenDestination"]
> = true
export const _399: Eq<
  Old.components["schemas"]["Internal_TokenDestination_Ticker"],
  New.components["schemas"]["Internal_TokenDestination_Ticker"]
> = true
export const _400: Eq<
  Old.components["schemas"]["Internal_TokenDestination_TokenId"],
  New.components["schemas"]["Internal_TokenDestination_TokenId"]
> = true
export const _401: Eq<
  Old.components["schemas"]["Internal_TokenOutput"],
  New.components["schemas"]["Internal_TokenOutput"]
> = true
export const _402: Eq<
  Old.components["schemas"]["Internal_TokenOutput_HederaFungibleTokenOutput"],
  New.components["schemas"]["Internal_TokenOutput_HederaFungibleTokenOutput"]
> = true
export const _403: Eq<
  Old.components["schemas"]["Internal_TokenOutput_HederaNonFungibleTokenOutput"],
  New.components["schemas"]["Internal_TokenOutput_HederaNonFungibleTokenOutput"]
> = true
export const _404: Eq<
  Old.components["schemas"]["Internal_TransactionCreated"],
  New.components["schemas"]["Internal_TransactionCreated"]
> = true
export const _405: Eq<
  Old.components["schemas"]["Internal_TransactionDestination"],
  New.components["schemas"]["Internal_TransactionDestination"]
> = true
export const _406: Eq<
  Old.components["schemas"]["Internal_TransactionDestination_Account"],
  New.components["schemas"]["Internal_TransactionDestination_Account"]
> = true
export const _407: Eq<
  Old.components["schemas"]["Internal_TransactionDestination_Address"],
  New.components["schemas"]["Internal_TransactionDestination_Address"]
> = true
export const _408: Eq<
  Old.components["schemas"]["Internal_TransactionDestination_Endpoint"],
  New.components["schemas"]["Internal_TransactionDestination_Endpoint"]
> = true
export const _409: Eq<
  Old.components["schemas"]["Internal_TransactionDetected"],
  New.components["schemas"]["Internal_TransactionDetected"]
> = true
export const _410: Eq<
  Old.components["schemas"]["Internal_TransactionOrder"],
  New.components["schemas"]["Internal_TransactionOrder"]
> = true
export const _411: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters"],
  New.components["schemas"]["Internal_TransactionOrderParameters"]
> = true
export const _412: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Algorand"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Algorand"]
> = true
export const _413: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Bitcoin"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Bitcoin"]
> = true
export const _414: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_BitcoinRedirect"],
  New.components["schemas"]["Internal_TransactionOrderParameters_BitcoinRedirect"]
> = true
export const _415: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Cardano"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Cardano"]
> = true
export const _416: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Ethereum"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Ethereum"]
> = true
export const _417: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Hedera"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Hedera"]
> = true
export const _418: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Solana"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Solana"]
> = true
export const _419: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Stellar"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Stellar"]
> = true
export const _420: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Substrate"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Substrate"]
> = true
export const _421: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Tezos"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Tezos"]
> = true
export const _422: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_Tron"],
  New.components["schemas"]["Internal_TransactionOrderParameters_Tron"]
> = true
export const _423: Eq<
  Old.components["schemas"]["Internal_TransactionOrderParameters_XRPL"],
  New.components["schemas"]["Internal_TransactionOrderParameters_XRPL"]
> = true
export const _424: Eq<
  Old.components["schemas"]["Internal_TransactionPending"],
  New.components["schemas"]["Internal_TransactionPending"]
> = true
export const _425: Eq<
  Old.components["schemas"]["Internal_TransactionPrepared"],
  New.components["schemas"]["Internal_TransactionPrepared"]
> = true
export const _426: Eq<
  Old.components["schemas"]["Internal_TransactionUpdated"],
  New.components["schemas"]["Internal_TransactionUpdated"]
> = true
export const _427: Eq<
  Old.components["schemas"]["Internal_TransferKind"],
  New.components["schemas"]["Internal_TransferKind"]
> = true
export const _428: Eq<
  Old.components["schemas"]["Internal_TransferMetadata"],
  New.components["schemas"]["Internal_TransferMetadata"]
> = true
export const _429: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Algorand"],
  New.components["schemas"]["Internal_TransferMetadata_Algorand"]
> = true
export const _430: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Bitcoin"],
  New.components["schemas"]["Internal_TransferMetadata_Bitcoin"]
> = true
export const _431: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Cardano"],
  New.components["schemas"]["Internal_TransferMetadata_Cardano"]
> = true
export const _432: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Ethereum"],
  New.components["schemas"]["Internal_TransferMetadata_Ethereum"]
> = true
export const _433: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Hedera"],
  New.components["schemas"]["Internal_TransferMetadata_Hedera"]
> = true
export const _434: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Solana"],
  New.components["schemas"]["Internal_TransferMetadata_Solana"]
> = true
export const _435: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Stellar"],
  New.components["schemas"]["Internal_TransferMetadata_Stellar"]
> = true
export const _436: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Substrate"],
  New.components["schemas"]["Internal_TransferMetadata_Substrate"]
> = true
export const _437: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Tezos"],
  New.components["schemas"]["Internal_TransferMetadata_Tezos"]
> = true
export const _438: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_Tron"],
  New.components["schemas"]["Internal_TransferMetadata_Tron"]
> = true
export const _439: Eq<
  Old.components["schemas"]["Internal_TransferMetadata_XRPL"],
  New.components["schemas"]["Internal_TransferMetadata_XRPL"]
> = true
export const _440: Eq<
  Old.components["schemas"]["Internal_TransferUpdated"],
  New.components["schemas"]["Internal_TransferUpdated"]
> = true
export const _441: Eq<
  Old.components["schemas"]["Internal_TronFeeStrategy"],
  New.components["schemas"]["Internal_TronFeeStrategy"]
> = true
export const _442: Eq<
  Old.components["schemas"]["Internal_TronFeeStrategy_Priority"],
  New.components["schemas"]["Internal_TronFeeStrategy_Priority"]
> = true
export const _443: Eq<
  Old.components["schemas"]["Internal_TronOperation"],
  New.components["schemas"]["Internal_TronOperation"]
> = true
export const _444: Eq<
  Old.components["schemas"]["Internal_TronOperation_NativeTransfer"],
  New.components["schemas"]["Internal_TronOperation_NativeTransfer"]
> = true
export const _445: Eq<
  Old.components["schemas"]["Internal_TronOperation_TRC20Transfer"],
  New.components["schemas"]["Internal_TronOperation_TRC20Transfer"]
> = true
export const _446: Eq<
  Old.components["schemas"]["Internal_TronTickerProperties"],
  New.components["schemas"]["Internal_TronTickerProperties"]
> = true
export const _447: Eq<
  Old.components["schemas"]["Internal_TronTickerProperties_Native"],
  New.components["schemas"]["Internal_TronTickerProperties_Native"]
> = true
export const _448: Eq<
  Old.components["schemas"]["Internal_TronTickerProperties_TRC20"],
  New.components["schemas"]["Internal_TronTickerProperties_TRC20"]
> = true
export const _449: Eq<
  Old.components["schemas"]["Internal_TrustedAccount"],
  New.components["schemas"]["Internal_TrustedAccount"]
> = true
export const _450: Eq<
  Old.components["schemas"]["Internal_TrustedDomain"],
  New.components["schemas"]["Internal_TrustedDomain"]
> = true
export const _451: Eq<
  Old.components["schemas"]["Internal_TrustedEndpoint"],
  New.components["schemas"]["Internal_TrustedEndpoint"]
> = true
export const _452: Eq<
  Old.components["schemas"]["Internal_TrustedIntent"],
  New.components["schemas"]["Internal_TrustedIntent"]
> = true
export const _453: Eq<
  Old.components["schemas"]["Internal_TrustedManifest"],
  New.components["schemas"]["Internal_TrustedManifest"]
> = true
export const _454: Eq<
  Old.components["schemas"]["Internal_TrustedPolicy"],
  New.components["schemas"]["Internal_TrustedPolicy"]
> = true
export const _455: Eq<
  Old.components["schemas"]["Internal_TrustedPublicKeyAdded"],
  New.components["schemas"]["Internal_TrustedPublicKeyAdded"]
> = true
export const _456: Eq<
  Old.components["schemas"]["Internal_TrustedPublicKeyPurpose"],
  New.components["schemas"]["Internal_TrustedPublicKeyPurpose"]
> = true
export const _457: Eq<
  Old.components["schemas"]["Internal_TrustedPublicKeyUpdated"],
  New.components["schemas"]["Internal_TrustedPublicKeyUpdated"]
> = true
export const _458: Eq<
  Old.components["schemas"]["Internal_TrustedTransactionOrder"],
  New.components["schemas"]["Internal_TrustedTransactionOrder"]
> = true
export const _459: Eq<
  Old.components["schemas"]["Internal_TrustedUser"],
  New.components["schemas"]["Internal_TrustedUser"]
> = true
export const _460: Eq<
  Old.components["schemas"]["Internal_TrustedUsersCollection"],
  New.components["schemas"]["Internal_TrustedUsersCollection"]
> = true
export const _461: Eq<
  Old.components["schemas"]["Internal_TrustedVault"],
  New.components["schemas"]["Internal_TrustedVault"]
> = true
export const _462: Eq<
  Old.components["schemas"]["Internal_User"],
  New.components["schemas"]["Internal_User"]
> = true
export const _463: Eq<
  Old.components["schemas"]["Internal_User1"],
  New.components["schemas"]["Internal_User1"]
> = true
export const _464: Eq<
  Old.components["schemas"]["Internal_UserCreated"],
  New.components["schemas"]["Internal_UserCreated"]
> = true
export const _465: Eq<
  Old.components["schemas"]["Internal_UserDifferentPublicKey"],
  New.components["schemas"]["Internal_UserDifferentPublicKey"]
> = true
export const _466: Eq<
  Old.components["schemas"]["Internal_UserIntentPayload"],
  New.components["schemas"]["Internal_UserIntentPayload"]
> = true
export const _467: Eq<
  Old.components["schemas"]["Internal_UserOperationRejectionCode"],
  New.components["schemas"]["Internal_UserOperationRejectionCode"]
> = true
export const _468: Eq<
  Old.components["schemas"]["Internal_UserReference"],
  New.components["schemas"]["Internal_UserReference"]
> = true
export const _469: Eq<
  Old.components["schemas"]["Internal_UserRequestPayload"],
  New.components["schemas"]["Internal_UserRequestPayload"]
> = true
export const _470: Eq<
  Old.components["schemas"]["Internal_UserRequestPayload_Approve"],
  New.components["schemas"]["Internal_UserRequestPayload_Approve"]
> = true
export const _471: Eq<
  Old.components["schemas"]["Internal_UserRequestPayload_Propose"],
  New.components["schemas"]["Internal_UserRequestPayload_Propose"]
> = true
export const _472: Eq<
  Old.components["schemas"]["Internal_UserRequestPayload_Reject"],
  New.components["schemas"]["Internal_UserRequestPayload_Reject"]
> = true
export const _473: Eq<
  Old.components["schemas"]["Internal_UserSamePublicKey"],
  New.components["schemas"]["Internal_UserSamePublicKey"]
> = true
export const _474: Eq<
  Old.components["schemas"]["Internal_UserUpdated"],
  New.components["schemas"]["Internal_UserUpdated"]
> = true
export const _475: Eq<
  Old.components["schemas"]["Internal_UsersConflicts"],
  New.components["schemas"]["Internal_UsersConflicts"]
> = true
export const _476: Eq<
  Old.components["schemas"]["Internal_UsersDifferentPublicKey"],
  New.components["schemas"]["Internal_UsersDifferentPublicKey"]
> = true
export const _477: Eq<
  Old.components["schemas"]["Internal_UsersSameAlias"],
  New.components["schemas"]["Internal_UsersSameAlias"]
> = true
export const _478: Eq<
  Old.components["schemas"]["Internal_UsersSamePublicKey"],
  New.components["schemas"]["Internal_UsersSamePublicKey"]
> = true
export const _479: Eq<
  Old.components["schemas"]["Internal_V3AccountToMigrate"],
  New.components["schemas"]["Internal_V3AccountToMigrate"]
> = true
export const _480: Eq<
  Old.components["schemas"]["Internal_ValidatedTicker"],
  New.components["schemas"]["Internal_ValidatedTicker"]
> = true
export const _481: Eq<
  Old.components["schemas"]["Internal_ValidatedTickerKind"],
  New.components["schemas"]["Internal_ValidatedTickerKind"]
> = true
export const _482: Eq<
  Old.components["schemas"]["Internal_Vault"],
  New.components["schemas"]["Internal_Vault"]
> = true
export const _483: Eq<
  Old.components["schemas"]["Internal_VaultAccountKeyInformation"],
  New.components["schemas"]["Internal_VaultAccountKeyInformation"]
> = true
export const _484: Eq<
  Old.components["schemas"]["Internal_VaultAccountKeyInformation_Random"],
  New.components["schemas"]["Internal_VaultAccountKeyInformation_Random"]
> = true
export const _485: Eq<
  Old.components["schemas"]["Internal_VaultAccountKeyInformation_VaultDerived"],
  New.components["schemas"]["Internal_VaultAccountKeyInformation_VaultDerived"]
> = true
export const _486: Eq<
  Old.components["schemas"]["Internal_VaultAccountProviderInformation_Key"],
  New.components["schemas"]["Internal_VaultAccountProviderInformation_Key"]
> = true
export const _487: Eq<
  Old.components["schemas"]["Internal_VaultAccountProviderInformation_KeyId"],
  New.components["schemas"]["Internal_VaultAccountProviderInformation_KeyId"]
> = true
export const _488: Eq<
  Old.components["schemas"]["Internal_VaultAccountProviderInformation_Key_VaultDerived"],
  New.components["schemas"]["Internal_VaultAccountProviderInformation_Key_VaultDerived"]
> = true
export const _489: Eq<
  Old.components["schemas"]["Internal_VaultAccountProviderInformation_Key_VaultDerivedNonExtended"],
  New.components["schemas"]["Internal_VaultAccountProviderInformation_Key_VaultDerivedNonExtended"]
> = true
export const _490: Eq<
  Old.components["schemas"]["Internal_VaultAccountProviderInformation_Key_VaultRandom"],
  New.components["schemas"]["Internal_VaultAccountProviderInformation_Key_VaultRandom"]
> = true
export const _491: Eq<
  Old.components["schemas"]["Internal_VaultApiVersion"],
  New.components["schemas"]["Internal_VaultApiVersion"]
> = true
export const _492: Eq<
  Old.components["schemas"]["Internal_VaultBackupParameters"],
  New.components["schemas"]["Internal_VaultBackupParameters"]
> = true
export const _493: Eq<
  Old.components["schemas"]["Internal_VaultBackupParameters_VaultHsm"],
  New.components["schemas"]["Internal_VaultBackupParameters_VaultHsm"]
> = true
export const _494: Eq<
  Old.components["schemas"]["Internal_VaultBackupParameters_VaultMpc"],
  New.components["schemas"]["Internal_VaultBackupParameters_VaultMpc"]
> = true
export const _495: Eq<
  Old.components["schemas"]["Internal_VaultCreated"],
  New.components["schemas"]["Internal_VaultCreated"]
> = true
export const _496: Eq<
  Old.components["schemas"]["Internal_VaultDerivation"],
  New.components["schemas"]["Internal_VaultDerivation"]
> = true
export const _497: Eq<
  Old.components["schemas"]["Internal_VaultHsmBackupData"],
  New.components["schemas"]["Internal_VaultHsmBackupData"]
> = true
export const _498: Eq<
  Old.components["schemas"]["Internal_VaultKeyMaterialRewrapCompleted"],
  New.components["schemas"]["Internal_VaultKeyMaterialRewrapCompleted"]
> = true
export const _499: Eq<
  Old.components["schemas"]["Internal_VaultKeyMaterialRewrapFailed"],
  New.components["schemas"]["Internal_VaultKeyMaterialRewrapFailed"]
> = true
export const _500: Eq<
  Old.components["schemas"]["Internal_VaultKeyStrategy"],
  New.components["schemas"]["Internal_VaultKeyStrategy"]
> = true
export const _501: Eq<
  Old.components["schemas"]["Internal_VaultMpcBackupData"],
  New.components["schemas"]["Internal_VaultMpcBackupData"]
> = true
export const _502: Eq<
  Old.components["schemas"]["Internal_VaultParameters"],
  New.components["schemas"]["Internal_VaultParameters"]
> = true
export const _503: Eq<
  Old.components["schemas"]["Internal_VaultParameters_HSM"],
  New.components["schemas"]["Internal_VaultParameters_HSM"]
> = true
export const _504: Eq<
  Old.components["schemas"]["Internal_VaultParameters_MPC"],
  New.components["schemas"]["Internal_VaultParameters_MPC"]
> = true
export const _505: Eq<
  Old.components["schemas"]["Internal_VaultProcessingStatus"],
  New.components["schemas"]["Internal_VaultProcessingStatus"]
> = true
export const _506: Eq<
  Old.components["schemas"]["Internal_VaultUpdated"],
  New.components["schemas"]["Internal_VaultUpdated"]
> = true
export const _507: Eq<
  Old.components["schemas"]["Internal_WorkflowCondition"],
  New.components["schemas"]["Internal_WorkflowCondition"]
> = true
export const _508: Eq<
  Old.components["schemas"]["Internal_WorkflowCondition_And"],
  New.components["schemas"]["Internal_WorkflowCondition_And"]
> = true
export const _509: Eq<
  Old.components["schemas"]["Internal_WorkflowCondition_Or"],
  New.components["schemas"]["Internal_WorkflowCondition_Or"]
> = true
export const _510: Eq<
  Old.components["schemas"]["Internal_WorkflowCondition_RoleQuorum"],
  New.components["schemas"]["Internal_WorkflowCondition_RoleQuorum"]
> = true
export const _511: Eq<
  Old.components["schemas"]["Internal_WorkflowProgress"],
  New.components["schemas"]["Internal_WorkflowProgress"]
> = true
export const _512: Eq<
  Old.components["schemas"]["Internal_WorkflowStep"],
  New.components["schemas"]["Internal_WorkflowStep"]
> = true
export const _513: Eq<
  Old.components["schemas"]["Internal_WorkflowStepStatus"],
  New.components["schemas"]["Internal_WorkflowStepStatus"]
> = true
export const _514: Eq<
  Old.components["schemas"]["Internal_XrplClawbackCurrency"],
  New.components["schemas"]["Internal_XrplClawbackCurrency"]
> = true
export const _515: Eq<
  Old.components["schemas"]["Internal_XrplClawbackCurrency_Currency"],
  New.components["schemas"]["Internal_XrplClawbackCurrency_Currency"]
> = true
export const _516: Eq<
  Old.components["schemas"]["Internal_XrplClawbackCurrency_MultiPurposeToken"],
  New.components["schemas"]["Internal_XrplClawbackCurrency_MultiPurposeToken"]
> = true
export const _517: Eq<
  Old.components["schemas"]["Internal_XrplClawbackCurrency_TickerId"],
  New.components["schemas"]["Internal_XrplClawbackCurrency_TickerId"]
> = true
export const _518: Eq<
  Old.components["schemas"]["Internal_XrplFeeStrategy"],
  New.components["schemas"]["Internal_XrplFeeStrategy"]
> = true
export const _519: Eq<
  Old.components["schemas"]["Internal_XrplFeeStrategy_Priority"],
  New.components["schemas"]["Internal_XrplFeeStrategy_Priority"]
> = true
export const _520: Eq<
  Old.components["schemas"]["Internal_XrplFeeStrategy_SpecifiedAdditionalFee"],
  New.components["schemas"]["Internal_XrplFeeStrategy_SpecifiedAdditionalFee"]
> = true
export const _521: Eq<
  Old.components["schemas"]["Internal_XrplIouCurrency"],
  New.components["schemas"]["Internal_XrplIouCurrency"]
> = true
export const _522: Eq<
  Old.components["schemas"]["Internal_XrplIouCurrency_Currency"],
  New.components["schemas"]["Internal_XrplIouCurrency_Currency"]
> = true
export const _523: Eq<
  Old.components["schemas"]["Internal_XrplIouCurrency_TickerId"],
  New.components["schemas"]["Internal_XrplIouCurrency_TickerId"]
> = true
export const _524: Eq<
  Old.components["schemas"]["Internal_XrplMemo"],
  New.components["schemas"]["Internal_XrplMemo"]
> = true
export const _525: Eq<
  Old.components["schemas"]["Internal_XrplOperation"],
  New.components["schemas"]["Internal_XrplOperation"]
> = true
export const _526: Eq<
  Old.components["schemas"]["Internal_XrplOperation_AccountSet"],
  New.components["schemas"]["Internal_XrplOperation_AccountSet"]
> = true
export const _527: Eq<
  Old.components["schemas"]["Internal_XrplOperation_Batch"],
  New.components["schemas"]["Internal_XrplOperation_Batch"]
> = true
export const _528: Eq<
  Old.components["schemas"]["Internal_XrplOperation_Clawback"],
  New.components["schemas"]["Internal_XrplOperation_Clawback"]
> = true
export const _529: Eq<
  Old.components["schemas"]["Internal_XrplOperation_ConfidentialMPTClawback"],
  New.components["schemas"]["Internal_XrplOperation_ConfidentialMPTClawback"]
> = true
export const _530: Eq<
  Old.components["schemas"]["Internal_XrplOperation_ConfidentialMPTConvert"],
  New.components["schemas"]["Internal_XrplOperation_ConfidentialMPTConvert"]
> = true
export const _531: Eq<
  Old.components["schemas"]["Internal_XrplOperation_ConfidentialMPTConvertBack"],
  New.components["schemas"]["Internal_XrplOperation_ConfidentialMPTConvertBack"]
> = true
export const _532: Eq<
  Old.components["schemas"]["Internal_XrplOperation_ConfidentialMPTMergeInbox"],
  New.components["schemas"]["Internal_XrplOperation_ConfidentialMPTMergeInbox"]
> = true
export const _533: Eq<
  Old.components["schemas"]["Internal_XrplOperation_ConfidentialMPTSend"],
  New.components["schemas"]["Internal_XrplOperation_ConfidentialMPTSend"]
> = true
export const _534: Eq<
  Old.components["schemas"]["Internal_XrplOperation_DepositPreauth"],
  New.components["schemas"]["Internal_XrplOperation_DepositPreauth"]
> = true
export const _535: Eq<
  Old.components["schemas"]["Internal_XrplOperation_EscrowFinish"],
  New.components["schemas"]["Internal_XrplOperation_EscrowFinish"]
> = true
export const _536: Eq<
  Old.components["schemas"]["Internal_XrplOperation_MPTokenAuthorize"],
  New.components["schemas"]["Internal_XrplOperation_MPTokenAuthorize"]
> = true
export const _537: Eq<
  Old.components["schemas"]["Internal_XrplOperation_MPTokenIssuanceCreate"],
  New.components["schemas"]["Internal_XrplOperation_MPTokenIssuanceCreate"]
> = true
export const _538: Eq<
  Old.components["schemas"]["Internal_XrplOperation_MPTokenIssuanceDestroy"],
  New.components["schemas"]["Internal_XrplOperation_MPTokenIssuanceDestroy"]
> = true
export const _539: Eq<
  Old.components["schemas"]["Internal_XrplOperation_MPTokenIssuanceSet"],
  New.components["schemas"]["Internal_XrplOperation_MPTokenIssuanceSet"]
> = true
export const _540: Eq<
  Old.components["schemas"]["Internal_XrplOperation_OfferCreate"],
  New.components["schemas"]["Internal_XrplOperation_OfferCreate"]
> = true
export const _541: Eq<
  Old.components["schemas"]["Internal_XrplOperation_Payment"],
  New.components["schemas"]["Internal_XrplOperation_Payment"]
> = true
export const _542: Eq<
  Old.components["schemas"]["Internal_XrplOperation_SponsorshipSetAsSponsee"],
  New.components["schemas"]["Internal_XrplOperation_SponsorshipSetAsSponsee"]
> = true
export const _543: Eq<
  Old.components["schemas"]["Internal_XrplOperation_SponsorshipSetAsSponsor"],
  New.components["schemas"]["Internal_XrplOperation_SponsorshipSetAsSponsor"]
> = true
export const _544: Eq<
  Old.components["schemas"]["Internal_XrplOperation_TicketCreate"],
  New.components["schemas"]["Internal_XrplOperation_TicketCreate"]
> = true
export const _545: Eq<
  Old.components["schemas"]["Internal_XrplOperation_TrustSet"],
  New.components["schemas"]["Internal_XrplOperation_TrustSet"]
> = true
export const _546: Eq<
  Old.components["schemas"]["Internal_XrplPaymentCurrency"],
  New.components["schemas"]["Internal_XrplPaymentCurrency"]
> = true
export const _547: Eq<
  Old.components["schemas"]["Internal_XrplPaymentCurrency_Currency"],
  New.components["schemas"]["Internal_XrplPaymentCurrency_Currency"]
> = true
export const _548: Eq<
  Old.components["schemas"]["Internal_XrplPaymentCurrency_MultiPurposeToken"],
  New.components["schemas"]["Internal_XrplPaymentCurrency_MultiPurposeToken"]
> = true
export const _549: Eq<
  Old.components["schemas"]["Internal_XrplPaymentCurrency_TickerId"],
  New.components["schemas"]["Internal_XrplPaymentCurrency_TickerId"]
> = true
export const _550: Eq<
  Old.components["schemas"]["Internal_XrplSponsorshipParams"],
  New.components["schemas"]["Internal_XrplSponsorshipParams"]
> = true
export const _551: Eq<
  Old.components["schemas"]["Internal_XrplTickerProperties"],
  New.components["schemas"]["Internal_XrplTickerProperties"]
> = true
export const _552: Eq<
  Old.components["schemas"]["Internal_XrplTickerProperties_ConfidentialMultiPurposeToken"],
  New.components["schemas"]["Internal_XrplTickerProperties_ConfidentialMultiPurposeToken"]
> = true
export const _553: Eq<
  Old.components["schemas"]["Internal_XrplTickerProperties_FungibleToken"],
  New.components["schemas"]["Internal_XrplTickerProperties_FungibleToken"]
> = true
export const _554: Eq<
  Old.components["schemas"]["Internal_XrplTickerProperties_MultiPurposeToken"],
  New.components["schemas"]["Internal_XrplTickerProperties_MultiPurposeToken"]
> = true
export const _555: Eq<
  Old.components["schemas"]["Internal_XrplTickerProperties_Native"],
  New.components["schemas"]["Internal_XrplTickerProperties_Native"]
> = true
export const _556: Eq<
  Old.components["schemas"]["Internal_Xrpl_AccountSetFlag"],
  New.components["schemas"]["Internal_Xrpl_AccountSetFlag"]
> = true
export const _557: Eq<
  Old.components["schemas"]["Internal_Xrpl_AssetQuantity"],
  New.components["schemas"]["Internal_Xrpl_AssetQuantity"]
> = true
export const _558: Eq<
  Old.components["schemas"]["Internal_Xrpl_BatchExecutionMode"],
  New.components["schemas"]["Internal_Xrpl_BatchExecutionMode"]
> = true
export const _559: Eq<
  Old.components["schemas"]["Internal_Xrpl_LimitAmount"],
  New.components["schemas"]["Internal_Xrpl_LimitAmount"]
> = true
export const _560: Eq<
  Old.components["schemas"]["Internal_Xrpl_MPTokenAuthorizeFlag"],
  New.components["schemas"]["Internal_Xrpl_MPTokenAuthorizeFlag"]
> = true
export const _561: Eq<
  Old.components["schemas"]["Internal_Xrpl_MPTokenIdentifier"],
  New.components["schemas"]["Internal_Xrpl_MPTokenIdentifier"]
> = true
export const _562: Eq<
  Old.components["schemas"]["Internal_Xrpl_MPTokenIdentifier_MPTokenIssuanceId"],
  New.components["schemas"]["Internal_Xrpl_MPTokenIdentifier_MPTokenIssuanceId"]
> = true
export const _563: Eq<
  Old.components["schemas"]["Internal_Xrpl_MPTokenIdentifier_TickerId"],
  New.components["schemas"]["Internal_Xrpl_MPTokenIdentifier_TickerId"]
> = true
export const _564: Eq<
  Old.components["schemas"]["Internal_Xrpl_MPTokenIssuanceCreateFlag"],
  New.components["schemas"]["Internal_Xrpl_MPTokenIssuanceCreateFlag"]
> = true
export const _565: Eq<
  Old.components["schemas"]["Internal_Xrpl_MPTokenIssuanceMutableFlag"],
  New.components["schemas"]["Internal_Xrpl_MPTokenIssuanceMutableFlag"]
> = true
export const _566: Eq<
  Old.components["schemas"]["Internal_Xrpl_MPTokenIssuanceSetFlag"],
  New.components["schemas"]["Internal_Xrpl_MPTokenIssuanceSetFlag"]
> = true
export const _567: Eq<
  Old.components["schemas"]["Internal_Xrpl_OfferCreateFlag"],
  New.components["schemas"]["Internal_Xrpl_OfferCreateFlag"]
> = true
export const _568: Eq<
  Old.components["schemas"]["Internal_Xrpl_PaymentFlag"],
  New.components["schemas"]["Internal_Xrpl_PaymentFlag"]
> = true
export const _569: Eq<
  Old.components["schemas"]["Internal_Xrpl_SponsorFlag"],
  New.components["schemas"]["Internal_Xrpl_SponsorFlag"]
> = true
export const _570: Eq<
  Old.components["schemas"]["Internal_Xrpl_SponsorshipSetFlag"],
  New.components["schemas"]["Internal_Xrpl_SponsorshipSetFlag"]
> = true
export const _571: Eq<
  Old.components["schemas"]["Internal_Xrpl_TrustSetFlag"],
  New.components["schemas"]["Internal_Xrpl_TrustSetFlag"]
> = true
export const _572: Eq<
  Old.components["schemas"]["Internal_v0_AcknowledgeBackup"],
  New.components["schemas"]["Internal_v0_AcknowledgeBackup"]
> = true
export const _573: Eq<
  Old.components["schemas"]["Internal_v0_AddAccountLedgers"],
  New.components["schemas"]["Internal_v0_AddAccountLedgers"]
> = true
export const _574: Eq<
  Old.components["schemas"]["Internal_v0_AddTrustedPublicKeysForMigration"],
  New.components["schemas"]["Internal_v0_AddTrustedPublicKeysForMigration"]
> = true
export const _575: Eq<
  Old.components["schemas"]["Internal_v0_AttemptTransactionOrderCancellation"],
  New.components["schemas"]["Internal_v0_AttemptTransactionOrderCancellation"]
> = true
export const _576: Eq<
  Old.components["schemas"]["Internal_v0_CreateAccount"],
  New.components["schemas"]["Internal_v0_CreateAccount"]
> = true
export const _577: Eq<
  Old.components["schemas"]["Internal_v0_CreateAccountProviderDetailsPayload"],
  New.components["schemas"]["Internal_v0_CreateAccountProviderDetailsPayload"]
> = true
export const _578: Eq<
  Old.components["schemas"]["Internal_v0_CreateAccountProviderDetailsPayload_Vault"],
  New.components["schemas"]["Internal_v0_CreateAccountProviderDetailsPayload_Vault"]
> = true
export const _579: Eq<
  Old.components["schemas"]["Internal_v0_CreateBackup"],
  New.components["schemas"]["Internal_v0_CreateBackup"]
> = true
export const _580: Eq<
  Old.components["schemas"]["Internal_v0_CreateDomain"],
  New.components["schemas"]["Internal_v0_CreateDomain"]
> = true
export const _581: Eq<
  Old.components["schemas"]["Internal_v0_CreateEndpoint"],
  New.components["schemas"]["Internal_v0_CreateEndpoint"]
> = true
export const _582: Eq<
  Old.components["schemas"]["Internal_v0_CreateLedger"],
  New.components["schemas"]["Internal_v0_CreateLedger"]
> = true
export const _583: Eq<
  Old.components["schemas"]["Internal_v0_CreatePolicy"],
  New.components["schemas"]["Internal_v0_CreatePolicy"]
> = true
export const _584: Eq<
  Old.components["schemas"]["Internal_v0_CreateTicker"],
  New.components["schemas"]["Internal_v0_CreateTicker"]
> = true
export const _585: Eq<
  Old.components["schemas"]["Internal_v0_CreateTransactionOrder"],
  New.components["schemas"]["Internal_v0_CreateTransactionOrder"]
> = true
export const _586: Eq<
  Old.components["schemas"]["Internal_v0_CreateTransferOrder"],
  New.components["schemas"]["Internal_v0_CreateTransferOrder"]
> = true
export const _587: Eq<
  Old.components["schemas"]["Internal_v0_CreateUser"],
  New.components["schemas"]["Internal_v0_CreateUser"]
> = true
export const _588: Eq<
  Old.components["schemas"]["Internal_v0_CreateVault"],
  New.components["schemas"]["Internal_v0_CreateVault"]
> = true
export const _589: Eq<
  Old.components["schemas"]["Internal_v0_ExecuteExtension"],
  New.components["schemas"]["Internal_v0_ExecuteExtension"]
> = true
export const _590: Eq<
  Old.components["schemas"]["Internal_v0_LockAccount"],
  New.components["schemas"]["Internal_v0_LockAccount"]
> = true
export const _591: Eq<
  Old.components["schemas"]["Internal_v0_LockDomain"],
  New.components["schemas"]["Internal_v0_LockDomain"]
> = true
export const _592: Eq<
  Old.components["schemas"]["Internal_v0_LockEndpoint"],
  New.components["schemas"]["Internal_v0_LockEndpoint"]
> = true
export const _593: Eq<
  Old.components["schemas"]["Internal_v0_LockPolicy"],
  New.components["schemas"]["Internal_v0_LockPolicy"]
> = true
export const _594: Eq<
  Old.components["schemas"]["Internal_v0_LockTicker"],
  New.components["schemas"]["Internal_v0_LockTicker"]
> = true
export const _595: Eq<
  Old.components["schemas"]["Internal_v0_LockUser"],
  New.components["schemas"]["Internal_v0_LockUser"]
> = true
export const _596: Eq<
  Old.components["schemas"]["Internal_v0_LockVault"],
  New.components["schemas"]["Internal_v0_LockVault"]
> = true
export const _597: Eq<
  Old.components["schemas"]["Internal_v0_MigrateSilo3AccountBatch"],
  New.components["schemas"]["Internal_v0_MigrateSilo3AccountBatch"]
> = true
export const _598: Eq<
  Old.components["schemas"]["Internal_v0_NotarizeData"],
  New.components["schemas"]["Internal_v0_NotarizeData"]
> = true
export const _599: Eq<
  Old.components["schemas"]["Internal_v0_ProvisionElGamalKeyPair"],
  New.components["schemas"]["Internal_v0_ProvisionElGamalKeyPair"]
> = true
export const _600: Eq<
  Old.components["schemas"]["Internal_v0_RegisterTrustedPublicKey"],
  New.components["schemas"]["Internal_v0_RegisterTrustedPublicKey"]
> = true
export const _601: Eq<
  Old.components["schemas"]["Internal_v0_ReleaseQuarantinedTransfers"],
  New.components["schemas"]["Internal_v0_ReleaseQuarantinedTransfers"]
> = true
export const _602: Eq<
  Old.components["schemas"]["Internal_v0_RewrapVaultKeyMaterial"],
  New.components["schemas"]["Internal_v0_RewrapVaultKeyMaterial"]
> = true
export const _603: Eq<
  Old.components["schemas"]["Internal_v0_SetSystemProperty"],
  New.components["schemas"]["Internal_v0_SetSystemProperty"]
> = true
export const _604: Eq<
  Old.components["schemas"]["Internal_v0_SignManifest"],
  New.components["schemas"]["Internal_v0_SignManifest"]
> = true
export const _605: Eq<
  Old.components["schemas"]["Internal_v0_UnlockAccount"],
  New.components["schemas"]["Internal_v0_UnlockAccount"]
> = true
export const _606: Eq<
  Old.components["schemas"]["Internal_v0_UnlockDomain"],
  New.components["schemas"]["Internal_v0_UnlockDomain"]
> = true
export const _607: Eq<
  Old.components["schemas"]["Internal_v0_UnlockEndpoint"],
  New.components["schemas"]["Internal_v0_UnlockEndpoint"]
> = true
export const _608: Eq<
  Old.components["schemas"]["Internal_v0_UnlockPolicy"],
  New.components["schemas"]["Internal_v0_UnlockPolicy"]
> = true
export const _609: Eq<
  Old.components["schemas"]["Internal_v0_UnlockTicker"],
  New.components["schemas"]["Internal_v0_UnlockTicker"]
> = true
export const _610: Eq<
  Old.components["schemas"]["Internal_v0_UnlockUser"],
  New.components["schemas"]["Internal_v0_UnlockUser"]
> = true
export const _611: Eq<
  Old.components["schemas"]["Internal_v0_UnlockVault"],
  New.components["schemas"]["Internal_v0_UnlockVault"]
> = true
export const _612: Eq<
  Old.components["schemas"]["Internal_v0_UpdateAccount"],
  New.components["schemas"]["Internal_v0_UpdateAccount"]
> = true
export const _613: Eq<
  Old.components["schemas"]["Internal_v0_UpdateDomain"],
  New.components["schemas"]["Internal_v0_UpdateDomain"]
> = true
export const _614: Eq<
  Old.components["schemas"]["Internal_v0_UpdateDomainPermissions"],
  New.components["schemas"]["Internal_v0_UpdateDomainPermissions"]
> = true
export const _615: Eq<
  Old.components["schemas"]["Internal_v0_UpdateEndpoint"],
  New.components["schemas"]["Internal_v0_UpdateEndpoint"]
> = true
export const _616: Eq<
  Old.components["schemas"]["Internal_v0_UpdateLedger"],
  New.components["schemas"]["Internal_v0_UpdateLedger"]
> = true
export const _617: Eq<
  Old.components["schemas"]["Internal_v0_UpdatePolicy"],
  New.components["schemas"]["Internal_v0_UpdatePolicy"]
> = true
export const _618: Eq<
  Old.components["schemas"]["Internal_v0_UpdateTicker"],
  New.components["schemas"]["Internal_v0_UpdateTicker"]
> = true
export const _619: Eq<
  Old.components["schemas"]["Internal_v0_UpdateUser"],
  New.components["schemas"]["Internal_v0_UpdateUser"]
> = true
export const _620: Eq<
  Old.components["schemas"]["Internal_v0_UpdateVault"],
  New.components["schemas"]["Internal_v0_UpdateVault"]
> = true
export const _621: Eq<
  Old.components["schemas"]["Internal_v0_ValidateTickers"],
  New.components["schemas"]["Internal_v0_ValidateTickers"]
> = true
export const _622: Eq<
  Old.components["schemas"]["InternalCoreExtensions_Authentication"],
  New.components["schemas"]["InternalCoreExtensions_Authentication"]
> = true
export const _623: Eq<
  Old.components["schemas"]["InternalCoreExtensions_DomainScope"],
  New.components["schemas"]["InternalCoreExtensions_DomainScope"]
> = true
export const _624: Eq<
  Old.components["schemas"]["InternalCoreExtensions_Notary"],
  New.components["schemas"]["InternalCoreExtensions_Notary"]
> = true
export const _625: Eq<
  Old.components["schemas"]["InternalCoreExtensions_NotificationSource"],
  New.components["schemas"]["InternalCoreExtensions_NotificationSource"]
> = true
export const _626: Eq<
  Old.components["schemas"]["InternalCoreExtensions_SystemInformation"],
  New.components["schemas"]["InternalCoreExtensions_SystemInformation"]
> = true
export const _627: Eq<
  Old.components["schemas"]["InternalCoreExtensions_UserAvailableNotificationSourceResponse"],
  New.components["schemas"]["InternalCoreExtensions_UserAvailableNotificationSourceResponse"]
> = true
export const _628: Eq<
  Old.components["schemas"]["InternalCoreExtensions_UserNotificationPreferencesUpdateRequest"],
  New.components["schemas"]["InternalCoreExtensions_UserNotificationPreferencesUpdateRequest"]
> = true
export const _629: Eq<
  Old.components["schemas"]["InternalCoreExtensions_UserSubscribedNotificationSourceResponse"],
  New.components["schemas"]["InternalCoreExtensions_UserSubscribedNotificationSourceResponse"]
> = true
export const _630: Eq<
  Old.components["schemas"]["Notification_RegisterMobile"],
  New.components["schemas"]["Notification_RegisterMobile"]
> = true
export const _631: Eq<
  Old.components["schemas"]["Notification_ResponseSignature"],
  New.components["schemas"]["Notification_ResponseSignature"]
> = true
export const _632: Eq<
  Old.components["schemas"]["Notification_SecuredRegisterMobile"],
  New.components["schemas"]["Notification_SecuredRegisterMobile"]
> = true
export const _633: Eq<
  Old.components["schemas"]["Notification_SignEntity"],
  New.components["schemas"]["Notification_SignEntity"]
> = true
export const _634: Eq<
  Old.components["schemas"]["Notification_SignWeb"],
  New.components["schemas"]["Notification_SignWeb"]
> = true
export const _635: Eq<
  Old.components["schemas"]["Notification_UnregisterDevice"],
  New.components["schemas"]["Notification_UnregisterDevice"]
> = true
export const _636: Eq<
  Old.components["schemas"]["Notification_EntityToSign"],
  New.components["schemas"]["Notification_EntityToSign"]
> = true
export const _637: Eq<
  Old.components["schemas"]["Notification_ExtendedEntityToSign"],
  New.components["schemas"]["Notification_ExtendedEntityToSign"]
> = true
export const _638: Eq<
  Old.components["schemas"]["Web3Connector_ConnectAccount"],
  New.components["schemas"]["Web3Connector_ConnectAccount"]
> = true
export const _639: Eq<
  Old.components["schemas"]["Web3Connector_Session"],
  New.components["schemas"]["Web3Connector_Session"]
> = true
export const _640: Eq<
  Old.components["schemas"]["Web3Connector_SessionApproval"],
  New.components["schemas"]["Web3Connector_SessionApproval"]
> = true
export const _641: Eq<
  Old.components["schemas"]["Web3Connector_ChangeAccount"],
  New.components["schemas"]["Web3Connector_ChangeAccount"]
> = true
export const _642: Eq<
  Old.components["schemas"]["Web3Connector_SessionEvent"],
  New.components["schemas"]["Web3Connector_SessionEvent"]
> = true
export const _643: Eq<
  Present<Old.paths["/internal/v1/vaults/current"]>,
  Present<New.paths["/internal/v1/vaults/current"]>
> = true
export const _644: Eq<
  keyof Old.operations["getCurrentVault"]["responses"],
  keyof New.operations["getCurrentVault"]["responses"]
> = true
export const _645: Eq<
  Old.operations["getCurrentVault"]["parameters"]["query"],
  New.operations["getCurrentVault"]["parameters"]["query"]
> = true
export const _646: Eq<
  Old.operations["getCurrentVault"]["responses"][200]["content"]["application/json"],
  New.operations["getCurrentVault"]["responses"][200]["content"]["application/json"]
> = true
export const _647: Eq<
  Old.operations["getCurrentVault"]["responses"][404]["content"]["application/json"],
  New.operations["getCurrentVault"]["responses"][404]["content"]["application/json"]
> = true
export const _648: Eq<
  keyof Old.operations["postPendingVault"]["responses"],
  keyof New.operations["postPendingVault"]["responses"]
> = true
export const _649: Eq<
  Old.operations["postPendingVault"]["parameters"]["query"],
  New.operations["postPendingVault"]["parameters"]["query"]
> = true
export const _650: Eq<
  NonNullable<Old.operations["postPendingVault"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["postPendingVault"]["requestBody"]>["content"]["application/json"]
> = true
export const _651: Eq<
  Old.operations["postPendingVault"]["responses"][400]["content"]["application/json"],
  New.operations["postPendingVault"]["responses"][400]["content"]["application/json"]
> = true
export const _652: Eq<
  Old.operations["postPendingVault"]["responses"][404]["content"]["application/json"],
  New.operations["postPendingVault"]["responses"][404]["content"]["application/json"]
> = true
export const _653: Eq<
  Present<Old.paths["/internal/v1/accounts/pending"]>,
  Present<New.paths["/internal/v1/accounts/pending"]>
> = true
export const _654: Eq<
  keyof Old.operations["getPendingAccounts"]["responses"],
  keyof New.operations["getPendingAccounts"]["responses"]
> = true
export const _655: Eq<
  Old.operations["getPendingAccounts"]["responses"][200]["content"]["application/json"],
  New.operations["getPendingAccounts"]["responses"][200]["content"]["application/json"]
> = true
export const _656: Eq<
  Old.operations["getPendingAccounts"]["responses"]["default"]["content"]["application/json"],
  New.operations["getPendingAccounts"]["responses"]["default"]["content"]["application/json"]
> = true
export const _657: Eq<
  keyof Old.operations["postPendingAccount"]["responses"],
  keyof New.operations["postPendingAccount"]["responses"]
> = true
export const _658: Eq<
  NonNullable<Old.operations["postPendingAccount"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["postPendingAccount"]["requestBody"]>["content"]["application/json"]
> = true
export const _659: Eq<
  Old.operations["postPendingAccount"]["responses"][400]["content"]["application/json"],
  New.operations["postPendingAccount"]["responses"][400]["content"]["application/json"]
> = true
export const _660: Eq<
  Old.operations["postPendingAccount"]["responses"][404]["content"]["application/json"],
  New.operations["postPendingAccount"]["responses"][404]["content"]["application/json"]
> = true
export const _661: Eq<
  Present<Old.paths["/internal/v1/transactions/pending"]>,
  Present<New.paths["/internal/v1/transactions/pending"]>
> = true
export const _662: Eq<
  keyof Old.operations["getPendingTransactions"]["responses"],
  keyof New.operations["getPendingTransactions"]["responses"]
> = true
export const _663: Eq<
  Old.operations["getPendingTransactions"]["responses"][200]["content"]["application/json"],
  New.operations["getPendingTransactions"]["responses"][200]["content"]["application/json"]
> = true
export const _664: Eq<
  Old.operations["getPendingTransactions"]["responses"]["default"]["content"]["application/json"],
  New.operations["getPendingTransactions"]["responses"]["default"]["content"]["application/json"]
> = true
export const _665: Eq<
  keyof Old.operations["postPendingTransaction"]["responses"],
  keyof New.operations["postPendingTransaction"]["responses"]
> = true
export const _666: Eq<
  NonNullable<
    Old.operations["postPendingTransaction"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["postPendingTransaction"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _667: Eq<
  Old.operations["postPendingTransaction"]["responses"][400]["content"]["application/json"],
  New.operations["postPendingTransaction"]["responses"][400]["content"]["application/json"]
> = true
export const _668: Eq<
  Old.operations["postPendingTransaction"]["responses"][404]["content"]["application/json"],
  New.operations["postPendingTransaction"]["responses"][404]["content"]["application/json"]
> = true
export const _669: Eq<
  Present<Old.paths["/internal/v1/transactions/prepared"]>,
  Present<New.paths["/internal/v1/transactions/prepared"]>
> = true
export const _670: Eq<
  keyof Old.operations["getPreparedTransactions"]["responses"],
  keyof New.operations["getPreparedTransactions"]["responses"]
> = true
export const _671: Eq<
  Old.operations["getPreparedTransactions"]["responses"][200]["content"]["application/json"],
  New.operations["getPreparedTransactions"]["responses"][200]["content"]["application/json"]
> = true
export const _672: Eq<
  Old.operations["getPreparedTransactions"]["responses"]["default"]["content"]["application/json"],
  New.operations["getPreparedTransactions"]["responses"]["default"]["content"]["application/json"]
> = true
export const _673: Eq<
  keyof Old.operations["postPreparedTransaction"]["responses"],
  keyof New.operations["postPreparedTransaction"]["responses"]
> = true
export const _674: Eq<
  NonNullable<
    Old.operations["postPreparedTransaction"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["postPreparedTransaction"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _675: Eq<
  Old.operations["postPreparedTransaction"]["responses"][400]["content"]["application/json"],
  New.operations["postPreparedTransaction"]["responses"][400]["content"]["application/json"]
> = true
export const _676: Eq<
  Old.operations["postPreparedTransaction"]["responses"][404]["content"]["application/json"],
  New.operations["postPreparedTransaction"]["responses"][404]["content"]["application/json"]
> = true
export const _677: Eq<
  Present<Old.paths["/internal/v1/transactions/interrupt"]>,
  Present<New.paths["/internal/v1/transactions/interrupt"]>
> = true
export const _678: Eq<
  keyof Old.operations["postTransactionInterruption"]["responses"],
  keyof New.operations["postTransactionInterruption"]["responses"]
> = true
export const _679: Eq<
  NonNullable<
    Old.operations["postTransactionInterruption"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["postTransactionInterruption"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _680: Eq<
  Old.operations["postTransactionInterruption"]["responses"][400]["content"]["application/json"],
  New.operations["postTransactionInterruption"]["responses"][400]["content"]["application/json"]
> = true
export const _681: Eq<
  Old.operations["postTransactionInterruption"]["responses"][404]["content"]["application/json"],
  New.operations["postTransactionInterruption"]["responses"][404]["content"]["application/json"]
> = true
export const _682: Eq<
  Old.operations["postTransactionInterruption"]["responses"][409]["content"]["application/json"],
  New.operations["postTransactionInterruption"]["responses"][409]["content"]["application/json"]
> = true
export const _683: Eq<
  Present<Old.paths["/internal/v1/manifests/pending"]>,
  Present<New.paths["/internal/v1/manifests/pending"]>
> = true
export const _684: Eq<
  keyof Old.operations["getPendingManifests"]["responses"],
  keyof New.operations["getPendingManifests"]["responses"]
> = true
export const _685: Eq<
  Old.operations["getPendingManifests"]["responses"][200]["content"]["application/json"],
  New.operations["getPendingManifests"]["responses"][200]["content"]["application/json"]
> = true
export const _686: Eq<
  Old.operations["getPendingManifests"]["responses"]["default"]["content"]["application/json"],
  New.operations["getPendingManifests"]["responses"]["default"]["content"]["application/json"]
> = true
export const _687: Eq<
  keyof Old.operations["postPendingManifest"]["responses"],
  keyof New.operations["postPendingManifest"]["responses"]
> = true
export const _688: Eq<
  NonNullable<Old.operations["postPendingManifest"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["postPendingManifest"]["requestBody"]>["content"]["application/json"]
> = true
export const _689: Eq<
  Old.operations["postPendingManifest"]["responses"][400]["content"]["application/json"],
  New.operations["postPendingManifest"]["responses"][400]["content"]["application/json"]
> = true
export const _690: Eq<
  Old.operations["postPendingManifest"]["responses"][404]["content"]["application/json"],
  New.operations["postPendingManifest"]["responses"][404]["content"]["application/json"]
> = true
export const _691: Eq<
  Present<Old.paths["/internal/v1/backups/pending"]>,
  Present<New.paths["/internal/v1/backups/pending"]>
> = true
export const _692: Eq<
  keyof Old.operations["getPendingBackups"]["responses"],
  keyof New.operations["getPendingBackups"]["responses"]
> = true
export const _693: Eq<
  Old.operations["getPendingBackups"]["responses"][200]["content"]["application/json"],
  New.operations["getPendingBackups"]["responses"][200]["content"]["application/json"]
> = true
export const _694: Eq<
  Old.operations["getPendingBackups"]["responses"]["default"]["content"]["application/json"],
  New.operations["getPendingBackups"]["responses"]["default"]["content"]["application/json"]
> = true
export const _695: Eq<
  keyof Old.operations["postPreparedBackup"]["responses"],
  keyof New.operations["postPreparedBackup"]["responses"]
> = true
export const _696: Eq<
  NonNullable<Old.operations["postPreparedBackup"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["postPreparedBackup"]["requestBody"]>["content"]["application/json"]
> = true
export const _697: Eq<
  Old.operations["postPreparedBackup"]["responses"][400]["content"]["application/json"],
  New.operations["postPreparedBackup"]["responses"][400]["content"]["application/json"]
> = true
export const _698: Eq<
  Old.operations["postPreparedBackup"]["responses"][404]["content"]["application/json"],
  New.operations["postPreparedBackup"]["responses"][404]["content"]["application/json"]
> = true
export const _699: Eq<
  Present<Old.paths["/internal/v1/rewraps/pending"]>,
  Present<New.paths["/internal/v1/rewraps/pending"]>
> = true
export const _700: Eq<
  keyof Old.operations["getPendingRewraps"]["responses"],
  keyof New.operations["getPendingRewraps"]["responses"]
> = true
export const _701: Eq<
  Old.operations["getPendingRewraps"]["responses"][200]["content"]["application/json"],
  New.operations["getPendingRewraps"]["responses"][200]["content"]["application/json"]
> = true
export const _702: Eq<
  Old.operations["getPendingRewraps"]["responses"]["default"]["content"]["application/json"],
  New.operations["getPendingRewraps"]["responses"]["default"]["content"]["application/json"]
> = true
export const _703: Eq<
  keyof Old.operations["postPreparedRewrap"]["responses"],
  keyof New.operations["postPreparedRewrap"]["responses"]
> = true
export const _704: Eq<
  NonNullable<Old.operations["postPreparedRewrap"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["postPreparedRewrap"]["requestBody"]>["content"]["application/json"]
> = true
export const _705: Eq<
  Old.operations["postPreparedRewrap"]["responses"][404]["content"]["application/json"],
  New.operations["postPreparedRewrap"]["responses"][404]["content"]["application/json"]
> = true
export const _706: Eq<
  Present<Old.paths["/internal/v1/decrypt-cbs/pending"]>,
  Present<New.paths["/internal/v1/decrypt-cbs/pending"]>
> = true
export const _707: Eq<
  keyof Old.operations["getPendingDecryptCbs"]["responses"],
  keyof New.operations["getPendingDecryptCbs"]["responses"]
> = true
export const _708: Eq<
  Old.operations["getPendingDecryptCbs"]["responses"][200]["content"]["application/json"],
  New.operations["getPendingDecryptCbs"]["responses"][200]["content"]["application/json"]
> = true
export const _709: Eq<
  Old.operations["getPendingDecryptCbs"]["responses"]["default"]["content"]["application/json"],
  New.operations["getPendingDecryptCbs"]["responses"]["default"]["content"]["application/json"]
> = true
export const _710: Eq<
  keyof Old.operations["postDecryptCbsResponse"]["responses"],
  keyof New.operations["postDecryptCbsResponse"]["responses"]
> = true
export const _711: Eq<
  NonNullable<
    Old.operations["postDecryptCbsResponse"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["postDecryptCbsResponse"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _712: Eq<
  Old.operations["postDecryptCbsResponse"]["responses"]["default"]["content"]["application/json"],
  New.operations["postDecryptCbsResponse"]["responses"]["default"]["content"]["application/json"]
> = true
export const _713: Eq<
  Present<Old.paths["/internal/v1/parameters-computed/pending"]>,
  Present<New.paths["/internal/v1/parameters-computed/pending"]>
> = true
export const _714: Eq<
  keyof Old.operations["getPendingParametersComputes"]["responses"],
  keyof New.operations["getPendingParametersComputes"]["responses"]
> = true
export const _715: Eq<
  Old.operations["getPendingParametersComputes"]["responses"][200]["content"]["application/json"],
  New.operations["getPendingParametersComputes"]["responses"][200]["content"]["application/json"]
> = true
export const _716: Eq<
  Old.operations["getPendingParametersComputes"]["responses"]["default"]["content"]["application/json"],
  New.operations["getPendingParametersComputes"]["responses"]["default"]["content"]["application/json"]
> = true
export const _717: Eq<
  keyof Old.operations["postParametersComputeResponse"]["responses"],
  keyof New.operations["postParametersComputeResponse"]["responses"]
> = true
export const _718: Eq<
  NonNullable<
    Old.operations["postParametersComputeResponse"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["postParametersComputeResponse"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _719: Eq<
  Old.operations["postParametersComputeResponse"]["responses"]["default"]["content"]["application/json"],
  New.operations["postParametersComputeResponse"]["responses"]["default"]["content"]["application/json"]
> = true
export const _720: Eq<
  Present<Old.paths["/internal/v1/cmpt-cb-in"]>,
  Present<New.paths["/internal/v1/cmpt-cb-in"]>
> = true
export const _721: Eq<
  keyof Old.operations["initiateCbInDecryption"]["responses"],
  keyof New.operations["initiateCbInDecryption"]["responses"]
> = true
export const _722: Eq<
  NonNullable<
    Old.operations["initiateCbInDecryption"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["initiateCbInDecryption"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _723: Eq<
  Old.operations["initiateCbInDecryption"]["responses"][202]["content"]["application/json"],
  New.operations["initiateCbInDecryption"]["responses"][202]["content"]["application/json"]
> = true
export const _724: Eq<
  Old.operations["initiateCbInDecryption"]["responses"]["default"]["content"]["application/json"],
  New.operations["initiateCbInDecryption"]["responses"]["default"]["content"]["application/json"]
> = true
export const _725: Eq<
  Present<Old.paths["/internal/v1/cmpt-cb-in/{requestId}"]>,
  Present<New.paths["/internal/v1/cmpt-cb-in/{requestId}"]>
> = true
export const _726: Eq<
  keyof Old.operations["getCbInDecryptionStatus"]["responses"],
  keyof New.operations["getCbInDecryptionStatus"]["responses"]
> = true
export const _727: Eq<
  Old.operations["getCbInDecryptionStatus"]["parameters"]["path"],
  New.operations["getCbInDecryptionStatus"]["parameters"]["path"]
> = true
export const _728: Eq<
  Old.operations["getCbInDecryptionStatus"]["responses"][200]["content"]["application/json"],
  New.operations["getCbInDecryptionStatus"]["responses"][200]["content"]["application/json"]
> = true
export const _729: Eq<
  Old.operations["getCbInDecryptionStatus"]["responses"]["default"]["content"]["application/json"],
  New.operations["getCbInDecryptionStatus"]["responses"]["default"]["content"]["application/json"]
> = true
export const _730: Eq<
  Present<Old.paths["/internal/v1/users"]>,
  Present<New.paths["/internal/v1/users"]>
> = true
export const _731: Eq<
  keyof Old.operations["getUsers"]["responses"],
  keyof New.operations["getUsers"]["responses"]
> = true
export const _732: Eq<
  Old.operations["getUsers"]["parameters"]["query"],
  New.operations["getUsers"]["parameters"]["query"]
> = true
export const _733: Eq<
  Old.operations["getUsers"]["responses"][200]["content"]["application/json"],
  New.operations["getUsers"]["responses"][200]["content"]["application/json"]
> = true
export const _734: Eq<
  Old.operations["getUsers"]["responses"][400]["content"]["application/json"],
  New.operations["getUsers"]["responses"][400]["content"]["application/json"]
> = true
export const _735: Eq<
  Present<Old.paths["/internal/v1/users/conflicts"]>,
  Present<New.paths["/internal/v1/users/conflicts"]>
> = true
export const _736: Eq<
  keyof Old.operations["getUsersConflicts"]["responses"],
  keyof New.operations["getUsersConflicts"]["responses"]
> = true
export const _737: Eq<
  Old.operations["getUsersConflicts"]["responses"][200]["content"]["application/json"],
  New.operations["getUsersConflicts"]["responses"][200]["content"]["application/json"]
> = true
export const _738: Eq<
  Old.operations["getUsersConflicts"]["responses"]["default"]["content"]["application/json"],
  New.operations["getUsersConflicts"]["responses"]["default"]["content"]["application/json"]
> = true
export const _739: Eq<
  Present<Old.paths["/internal/v1/events"]>,
  Present<New.paths["/internal/v1/events"]>
> = true
export const _740: Eq<
  keyof Old.operations["getAllEvents"]["responses"],
  keyof New.operations["getAllEvents"]["responses"]
> = true
export const _741: Eq<
  Old.operations["getAllEvents"]["parameters"]["query"],
  New.operations["getAllEvents"]["parameters"]["query"]
> = true
export const _742: Eq<
  Old.operations["getAllEvents"]["responses"][200]["content"]["application/json"],
  New.operations["getAllEvents"]["responses"][200]["content"]["application/json"]
> = true
export const _743: Eq<
  Old.operations["getAllEvents"]["responses"][401]["content"]["application/json"],
  New.operations["getAllEvents"]["responses"][401]["content"]["application/json"]
> = true
export const _744: Eq<
  Present<Old.paths["/internal/v1/scripting"]>,
  Present<New.paths["/internal/v1/scripting"]>
> = true
export const _745: Eq<
  keyof Old.operations["getExampleContextV0"]["responses"],
  keyof New.operations["getExampleContextV0"]["responses"]
> = true
export const _746: Eq<
  Old.operations["getExampleContextV0"]["responses"][200]["content"]["application/json"],
  New.operations["getExampleContextV0"]["responses"][200]["content"]["application/json"]
> = true
export const _747: Eq<
  Present<Old.paths["/internal/v1/intents/context"]>,
  Present<New.paths["/internal/v1/intents/context"]>
> = true
export const _748: Eq<
  keyof Old.operations["intentContext"]["responses"],
  keyof New.operations["intentContext"]["responses"]
> = true
export const _749: Eq<
  NonNullable<Old.operations["intentContext"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["intentContext"]["requestBody"]>["content"]["application/json"]
> = true
export const _750: Eq<
  Old.operations["intentContext"]["responses"][200]["content"]["application/json"],
  New.operations["intentContext"]["responses"][200]["content"]["application/json"]
> = true
export const _751: Eq<
  Old.operations["intentContext"]["responses"][401]["content"]["application/json"],
  New.operations["intentContext"]["responses"][401]["content"]["application/json"]
> = true
export const _752: Eq<
  Present<Old.paths["/internal/v1/transaction/{transactionId}/blocker"]>,
  Present<New.paths["/internal/v1/transaction/{transactionId}/blocker"]>
> = true
export const _753: Eq<
  keyof Old.operations["getTransactionBlocker"]["responses"],
  keyof New.operations["getTransactionBlocker"]["responses"]
> = true
export const _754: Eq<
  Old.operations["getTransactionBlocker"]["parameters"]["path"],
  New.operations["getTransactionBlocker"]["parameters"]["path"]
> = true
export const _755: Eq<
  Old.operations["getTransactionBlocker"]["responses"][200]["content"]["application/json"],
  New.operations["getTransactionBlocker"]["responses"][200]["content"]["application/json"]
> = true
export const _756: Eq<
  Old.operations["getTransactionBlocker"]["responses"][401]["content"]["application/json"],
  New.operations["getTransactionBlocker"]["responses"][401]["content"]["application/json"]
> = true
export const _757: Eq<
  Old.operations["getTransactionBlocker"]["responses"][404]["content"]["application/json"],
  New.operations["getTransactionBlocker"]["responses"][404]["content"]["application/json"]
> = true
export const _758: Eq<
  Present<Old.paths["/internal/v1/me/settings/notifications"]>,
  Present<New.paths["/internal/v1/me/settings/notifications"]>
> = true
export const _759: Eq<
  keyof Old.paths["/internal/v1/me/settings/notifications"]["get"]["responses"],
  keyof New.paths["/internal/v1/me/settings/notifications"]["get"]["responses"]
> = true
export const _760: Eq<
  Old.paths["/internal/v1/me/settings/notifications"]["get"]["parameters"]["query"],
  New.paths["/internal/v1/me/settings/notifications"]["get"]["parameters"]["query"]
> = true
export const _761: Eq<
  Old.paths["/internal/v1/me/settings/notifications"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/internal/v1/me/settings/notifications"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _762: Eq<
  keyof Old.paths["/internal/v1/me/settings/notifications"]["post"]["responses"],
  keyof New.paths["/internal/v1/me/settings/notifications"]["post"]["responses"]
> = true
export const _763: Eq<
  NonNullable<
    Old.paths["/internal/v1/me/settings/notifications"]["post"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.paths["/internal/v1/me/settings/notifications"]["post"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _764: Eq<
  Old.paths["/internal/v1/me/settings/notifications"]["post"]["responses"][200]["content"]["application/json"],
  New.paths["/internal/v1/me/settings/notifications"]["post"]["responses"][200]["content"]["application/json"]
> = true
export const _765: Eq<
  Present<Old.paths["/internal/v1/me/settings/notifications/available"]>,
  Present<New.paths["/internal/v1/me/settings/notifications/available"]>
> = true
export const _766: Eq<
  keyof Old.paths["/internal/v1/me/settings/notifications/available"]["get"]["responses"],
  keyof New.paths["/internal/v1/me/settings/notifications/available"]["get"]["responses"]
> = true
export const _767: Eq<
  Old.paths["/internal/v1/me/settings/notifications/available"]["get"]["parameters"]["query"],
  New.paths["/internal/v1/me/settings/notifications/available"]["get"]["parameters"]["query"]
> = true
export const _768: Eq<
  Old.paths["/internal/v1/me/settings/notifications/available"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/internal/v1/me/settings/notifications/available"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _769: Eq<
  Present<Old.paths["/internal/v1/system/information"]>,
  Present<New.paths["/internal/v1/system/information"]>
> = true
export const _770: Eq<
  keyof Old.paths["/internal/v1/system/information"]["get"]["responses"],
  keyof New.paths["/internal/v1/system/information"]["get"]["responses"]
> = true
export const _771: Eq<
  Old.paths["/internal/v1/system/information"]["get"]["responses"][200]["content"]["application/json"],
  New.paths["/internal/v1/system/information"]["get"]["responses"][200]["content"]["application/json"]
> = true
export const _772: Eq<
  Present<Old.paths["/api/notifications/register-mobile"]>,
  Present<New.paths["/api/notifications/register-mobile"]>
> = true
export const _773: Eq<
  keyof Old.operations["NotificationController.registerMobile"]["responses"],
  keyof New.operations["NotificationController.registerMobile"]["responses"]
> = true
export const _774: Eq<
  NonNullable<
    Old.operations["NotificationController.registerMobile"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["NotificationController.registerMobile"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _775: Eq<
  Old.operations["NotificationController.registerMobile"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.registerMobile"]["responses"][200]["content"]["application/json"]
> = true
export const _776: Eq<
  Present<Old.paths["/api/notifications/nonce"]>,
  Present<New.paths["/api/notifications/nonce"]>
> = true
export const _777: Eq<
  keyof Old.operations["NotificationController.getNonce"]["responses"],
  keyof New.operations["NotificationController.getNonce"]["responses"]
> = true
export const _778: Eq<
  Old.operations["NotificationController.getNonce"]["parameters"]["query"],
  New.operations["NotificationController.getNonce"]["parameters"]["query"]
> = true
export const _779: Eq<
  Old.operations["NotificationController.getNonce"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.getNonce"]["responses"][200]["content"]["application/json"]
> = true
export const _780: Eq<
  Present<Old.paths["/api/notifications/secured-register-mobile"]>,
  Present<New.paths["/api/notifications/secured-register-mobile"]>
> = true
export const _781: Eq<
  keyof Old.operations["NotificationController.securedRegisterMobile"]["responses"],
  keyof New.operations["NotificationController.securedRegisterMobile"]["responses"]
> = true
export const _782: Eq<
  NonNullable<
    Old.operations["NotificationController.securedRegisterMobile"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["NotificationController.securedRegisterMobile"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _783: Eq<
  Old.operations["NotificationController.securedRegisterMobile"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.securedRegisterMobile"]["responses"][200]["content"]["application/json"]
> = true
export const _784: Eq<
  Present<Old.paths["/api/notifications/register-web"]>,
  Present<New.paths["/api/notifications/register-web"]>
> = true
export const _785: Eq<
  keyof Old.operations["NotificationController.registerWebClient"]["responses"],
  keyof New.operations["NotificationController.registerWebClient"]["responses"]
> = true
export const _786: Eq<
  Old.operations["NotificationController.registerWebClient"]["parameters"]["query"],
  New.operations["NotificationController.registerWebClient"]["parameters"]["query"]
> = true
export const _787: Eq<
  Old.operations["NotificationController.registerWebClient"]["responses"][403]["content"]["application/json"],
  New.operations["NotificationController.registerWebClient"]["responses"][403]["content"]["application/json"]
> = true
export const _788: Eq<
  Present<Old.paths["/api/notifications/sign-web"]>,
  Present<New.paths["/api/notifications/sign-web"]>
> = true
export const _789: Eq<
  keyof Old.operations["NotificationController.signWeb"]["responses"],
  keyof New.operations["NotificationController.signWeb"]["responses"]
> = true
export const _790: Eq<
  NonNullable<
    Old.operations["NotificationController.signWeb"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["NotificationController.signWeb"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _791: Eq<
  Old.operations["NotificationController.signWeb"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.signWeb"]["responses"][200]["content"]["application/json"]
> = true
export const _792: Eq<
  Present<Old.paths["/api/notifications/signature"]>,
  Present<New.paths["/api/notifications/signature"]>
> = true
export const _793: Eq<
  keyof Old.operations["NotificationController.sendSignatureToWeb"]["responses"],
  keyof New.operations["NotificationController.sendSignatureToWeb"]["responses"]
> = true
export const _794: Eq<
  NonNullable<
    Old.operations["NotificationController.sendSignatureToWeb"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["NotificationController.sendSignatureToWeb"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _795: Eq<
  Old.operations["NotificationController.sendSignatureToWeb"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.sendSignatureToWeb"]["responses"][200]["content"]["application/json"]
> = true
export const _796: Eq<
  Present<Old.paths["/api/notifications/entity/{hash}"]>,
  Present<New.paths["/api/notifications/entity/{hash}"]>
> = true
export const _797: Eq<
  keyof Old.operations["NotificationController.getEntity"]["responses"],
  keyof New.operations["NotificationController.getEntity"]["responses"]
> = true
export const _798: Eq<
  Old.operations["NotificationController.getEntity"]["parameters"]["path"],
  New.operations["NotificationController.getEntity"]["parameters"]["path"]
> = true
export const _799: Eq<
  Old.operations["NotificationController.getEntity"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.getEntity"]["responses"][200]["content"]["application/json"]
> = true
export const _800: Eq<
  keyof Old.operations["NotificationController.deleteEntity"]["responses"],
  keyof New.operations["NotificationController.deleteEntity"]["responses"]
> = true
export const _801: Eq<
  Old.operations["NotificationController.deleteEntity"]["parameters"]["path"],
  New.operations["NotificationController.deleteEntity"]["parameters"]["path"]
> = true
export const _802: Eq<
  Old.operations["NotificationController.deleteEntity"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.deleteEntity"]["responses"][200]["content"]["application/json"]
> = true
export const _803: Eq<
  Present<Old.paths["/api/notifications/entity/{hash}/signature"]>,
  Present<New.paths["/api/notifications/entity/{hash}/signature"]>
> = true
export const _804: Eq<
  keyof Old.operations["NotificationController.getSignedEntity"]["responses"],
  keyof New.operations["NotificationController.getSignedEntity"]["responses"]
> = true
export const _805: Eq<
  Old.operations["NotificationController.getSignedEntity"]["parameters"]["path"],
  New.operations["NotificationController.getSignedEntity"]["parameters"]["path"]
> = true
export const _806: Eq<
  Old.operations["NotificationController.getSignedEntity"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.getSignedEntity"]["responses"][200]["content"]["application/json"]
> = true
export const _807: Eq<
  Present<Old.paths["/api/notifications/entities"]>,
  Present<New.paths["/api/notifications/entities"]>
> = true
export const _808: Eq<
  keyof Old.operations["NotificationController.getEntities"]["responses"],
  keyof New.operations["NotificationController.getEntities"]["responses"]
> = true
export const _809: Eq<
  Old.operations["NotificationController.getEntities"]["parameters"]["query"],
  New.operations["NotificationController.getEntities"]["parameters"]["query"]
> = true
export const _810: Eq<
  Old.operations["NotificationController.getEntities"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.getEntities"]["responses"][200]["content"]["application/json"]
> = true
export const _811: Eq<
  Present<Old.paths["/api/notifications/unregister-mobile"]>,
  Present<New.paths["/api/notifications/unregister-mobile"]>
> = true
export const _812: Eq<
  keyof Old.operations["NotificationController.unregisterMobile"]["responses"],
  keyof New.operations["NotificationController.unregisterMobile"]["responses"]
> = true
export const _813: Eq<
  NonNullable<
    Old.operations["NotificationController.unregisterMobile"]["requestBody"]
  >["content"]["application/json"],
  NonNullable<
    New.operations["NotificationController.unregisterMobile"]["requestBody"]
  >["content"]["application/json"]
> = true
export const _814: Eq<
  Old.operations["NotificationController.unregisterMobile"]["responses"][200]["content"]["application/json"],
  New.operations["NotificationController.unregisterMobile"]["responses"][200]["content"]["application/json"]
> = true
export const _815: Eq<
  Present<Old.paths["/internal/v1/me/domains/{domainId}/session"]>,
  Present<New.paths["/internal/v1/me/domains/{domainId}/session"]>
> = true
export const _816: Eq<
  keyof Old.operations["getConnectedSession"]["responses"],
  keyof New.operations["getConnectedSession"]["responses"]
> = true
export const _817: Eq<
  Old.operations["getConnectedSession"]["parameters"]["path"],
  New.operations["getConnectedSession"]["parameters"]["path"]
> = true
export const _818: Eq<
  Old.operations["getConnectedSession"]["parameters"]["query"],
  New.operations["getConnectedSession"]["parameters"]["query"]
> = true
export const _819: Eq<
  Old.operations["getConnectedSession"]["responses"][200]["content"]["application/json"],
  New.operations["getConnectedSession"]["responses"][200]["content"]["application/json"]
> = true
export const _820: Eq<
  keyof Old.operations["postConnect"]["responses"],
  keyof New.operations["postConnect"]["responses"]
> = true
export const _821: Eq<
  Old.operations["postConnect"]["parameters"]["path"],
  New.operations["postConnect"]["parameters"]["path"]
> = true
export const _822: Eq<
  NonNullable<Old.operations["postConnect"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["postConnect"]["requestBody"]>["content"]["application/json"]
> = true
export const _823: Eq<
  Old.operations["postConnect"]["responses"][201]["content"]["application/json"],
  New.operations["postConnect"]["responses"][201]["content"]["application/json"]
> = true
export const _824: Eq<
  Present<Old.paths["/internal/v1/me/domains/{domainId}/session/{sessionId}"]>,
  Present<New.paths["/internal/v1/me/domains/{domainId}/session/{sessionId}"]>
> = true
export const _825: Eq<
  keyof Old.operations["getDAppDetails"]["responses"],
  keyof New.operations["getDAppDetails"]["responses"]
> = true
export const _826: Eq<
  Old.operations["getDAppDetails"]["parameters"]["path"],
  New.operations["getDAppDetails"]["parameters"]["path"]
> = true
export const _827: Eq<
  Old.operations["getDAppDetails"]["responses"][200]["content"]["application/json"],
  New.operations["getDAppDetails"]["responses"][200]["content"]["application/json"]
> = true
export const _828: Eq<
  keyof Old.operations["postApproveSession"]["responses"],
  keyof New.operations["postApproveSession"]["responses"]
> = true
export const _829: Eq<
  Old.operations["postApproveSession"]["parameters"]["path"],
  New.operations["postApproveSession"]["parameters"]["path"]
> = true
export const _830: Eq<
  NonNullable<Old.operations["postApproveSession"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["postApproveSession"]["requestBody"]>["content"]["application/json"]
> = true
export const _831: Eq<
  keyof Old.operations["deleteDisconnect"]["responses"],
  keyof New.operations["deleteDisconnect"]["responses"]
> = true
export const _832: Eq<
  Old.operations["deleteDisconnect"]["parameters"]["path"],
  New.operations["deleteDisconnect"]["parameters"]["path"]
> = true
export const _833: Eq<
  Present<Old.paths["/internal/v1/me/domains/{domainId}/session/{sessionId}/change"]>,
  Present<New.paths["/internal/v1/me/domains/{domainId}/session/{sessionId}/change"]>
> = true
export const _834: Eq<
  keyof Old.operations["postChangeAccount"]["responses"],
  keyof New.operations["postChangeAccount"]["responses"]
> = true
export const _835: Eq<
  Old.operations["postChangeAccount"]["parameters"]["path"],
  New.operations["postChangeAccount"]["parameters"]["path"]
> = true
export const _836: Eq<
  NonNullable<Old.operations["postChangeAccount"]["requestBody"]>["content"]["application/json"],
  NonNullable<New.operations["postChangeAccount"]["requestBody"]>["content"]["application/json"]
> = true
export const _837: Eq<
  Present<Old.paths["/internal/v1/me/domains/{domainId}/session/{sessionId}/events"]>,
  Present<New.paths["/internal/v1/me/domains/{domainId}/session/{sessionId}/events"]>
> = true
export const _838: Eq<
  keyof Old.operations["getSessionEvents"]["responses"],
  keyof New.operations["getSessionEvents"]["responses"]
> = true
export const _839: Eq<
  Old.operations["getSessionEvents"]["parameters"]["path"],
  New.operations["getSessionEvents"]["parameters"]["path"]
> = true
export const _840: Eq<
  Old.operations["getSessionEvents"]["responses"][200]["content"]["application/json"],
  New.operations["getSessionEvents"]["responses"][200]["content"]["application/json"]
> = true
