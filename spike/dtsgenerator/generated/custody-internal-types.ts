/**
 * SPIKE (dtsgenerator 4.0.2): generated from the merged superset of every internal spec.
 * Do not make direct changes.
 */

export declare namespace Components {
  namespace Schemas {
    export type InternalAccount = {
      id: string // uuid
      domainId: string // uuid
      alias: string
      ledgerId?: string
      providerDetails: InternalAccountProviderInformation
      lock: InternalLockStatus
      metadata: InternalEntityMetadata
    }
    export type InternalAccountCreated = {
      id: string // uuid
      type: "AccountCreated"
    }
    export type InternalAccountKeyStrategy = "VaultHard" | "VaultSoft" | "Random"
    export type InternalAccountPending = {
      domainId: string // uuid
      accountId: string // uuid
      signedPayload: string
    }
    export type InternalAccountProviderInformation = InternalAccountProviderInformationVault
    export type InternalAccountProviderInformationVault = {
      vaultId: string // uuid
      keyStrategy: InternalAccountKeyStrategy
      keyInformation: InternalVaultAccountKeyInformation
      keys?: InternalVaultAccountProviderInformationKey[]
      purposeKeys: InternalPurposeKey[]
      type: "Vault"
    }
    export type InternalAccountPublicKey =
      | InternalAccountPublicKeyExtendedPublicKey
      | InternalAccountPublicKeyPublicKey
    export type InternalAccountPublicKeyExtendedOnly =
      InternalAccountPublicKeyExtendedOnlyExtendedPublicKey
    export type InternalAccountPublicKeyExtendedOnlyExtendedPublicKey = {
      value: string // base64
      chainCode: string // base64
      type: "ExtendedPublicKey"
    }
    export type InternalAccountPublicKeyExtendedPublicKey = {
      value: string // base64
      chainCode: string // base64
      type: "ExtendedPublicKey"
    }
    export type InternalAccountPublicKeyOnly = InternalAccountPublicKeyOnlyPublicKey
    export type InternalAccountPublicKeyOnlyPublicKey = {
      value: string // base64
      type: "PublicKey"
    }
    export type InternalAccountPublicKeyPublicKey = {
      value: string // base64
      type: "PublicKey"
    }
    export type InternalAccountReference = {
      id: string // uuid
      domainId: string // uuid
    }
    export type InternalAccountUpdated = {
      id: string // uuid
      type: "AccountUpdated"
    }
    export type InternalAddressCreated = {
      id: string // uuid
      accountReference: InternalAccountReference
      type: "AddressCreated"
    }
    export type InternalAddressDetails = {
      address: string
      resolvedEndpoints: InternalResolvedEndpoint[]
    }
    /**
     * Override default change address strategy to set explicitly PrimaryAddress or GenerateNewAddress.
     */
    export type InternalAddressForChange = "GenerateNewAddress" | "PrimaryAddress"
    export type InternalAlgorandFeeStrategy = InternalAlgorandFeeStrategyPriority
    export type InternalAlgorandFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalAlgorandOperation = InternalAlgorandOperationPayment
    export type InternalAlgorandOperationPayment = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "Payment"
    }
    export type InternalAlgorandTickerProperties = InternalAlgorandTickerPropertiesNative
    export type InternalAlgorandTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalApiCbInDecryptionStatusResponse = {
      id: string // uuid
      status: string
      decryptedAmount?: string
      error?: string
    }
    export type InternalApiInitiateCbInDecryptionRequest = {
      accountId: string // uuid
      domainId: string // uuid
      ledgerId: string
      issuanceId: string
    }
    export type InternalApiInitiateCbInDecryptionResponse = {
      id: string // uuid
      status: string
    }
    export type InternalApiTicker = {
      id: string // uuid
      ledgerId: string
      kind: "Native" | "Contract" | "Token"
      name: string
      decimals?: number // int32
      symbol?: string
      ledgerDetails:
        | InternalTickerLedgerDetailsAlgorand
        | InternalTickerLedgerDetailsBitcoin
        | InternalTickerLedgerDetailsCardano
        | InternalTickerLedgerDetailsEthereum
        | InternalTickerLedgerDetailsHedera
        | InternalTickerLedgerDetailsSolana
        | InternalTickerLedgerDetailsStellar
        | InternalTickerLedgerDetailsSubstrate
        | InternalTickerLedgerDetailsTezos
        | InternalTickerLedgerDetailsTron
        | InternalTickerLedgerDetailsXRPL
      data: InternalApiTickerData
      signature?: string // base64
    }
    export type InternalApiTickerData = {
      id: string // uuid
      ledgerId: string
      kind: InternalTickerKind
      name: string
      decimals?: number // int32
      symbol?: string
      ledgerDetails: InternalTickerLedgerDetails
      lock: InternalLockStatus
      metadata?: InternalEntityMetadata
    }
    export type InternalApiTransfer = {
      id: string // uuid
      transactionId?: string // uuid
      tickerId: string // uuid
      quarantined: boolean
      quarantineStatus?: InternalQuarantineStatus
      senders: InternalSenderTransferParty[]
      recipient?: InternalRecipientTransferParty
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      kind: InternalTransferKind
      registeredAt: string // date-time
      metadata: InternalTransferMetadata
    }
    export type InternalApprovalDecision = "Approve" | "Reject"
    export type InternalAttemptInterruptTransaction = {
      transactionId: string // uuid
      reason: string
      signedPayload?: string
    }
    export type InternalBackup = {
      id: string // uuid
      data: InternalBackupData
      metadata: InternalEntityMetadata
    }
    export type InternalBackupCreated = {
      id: string // uuid
      type: "BackupCreated"
    }
    export type InternalBackupData = InternalBackupDataVaultHsm | InternalBackupDataVaultMpc
    export type InternalBackupDataVaultHsm = {
      vaultId: string // uuid
      data: InternalVaultHsmBackupData
      type: "VaultHsm"
    }
    export type InternalBackupDataVaultMpc = {
      vaultId: string // uuid
      data?: InternalVaultMpcBackupData
      type: "VaultMpc"
    }
    export type InternalBackupPending = {
      backupId: string // uuid
      vaultId: string // uuid
      signedPayload: string
    }
    export type InternalBackupPrepared = {
      backupId: string // uuid
      signedPayload: string
    }
    export type InternalBackupUpdated = {
      id: string // uuid
      type: "BackupUpdated"
    }
    export type InternalBalancesUpdated = {
      accountReference: InternalAccountReference
      tickerIds: string /* uuid */[]
      type: "BalancesUpdated"
    }
    export type InternalBatchEntry =
      | InternalBatchEntryParticipantOperation
      | InternalBatchEntrySubmitterOperation
    export type InternalBatchEntryParticipantOperation = {
      participant: InternalParticipant
      operation: InternalBatchInnerOperation
      sequencing: InternalParticipantSequencing
      sponsorship?: InternalXrplSponsorshipParams
      type: "ParticipantOperation"
    }
    export type InternalBatchEntrySubmitterOperation = {
      operation: InternalBatchInnerOperation
      sequencing: InternalSequencing
      sponsorship?: InternalXrplSponsorshipParams
      type: "SubmitterOperation"
    }
    export type InternalBatchInnerOperation =
      | InternalBatchInnerOperationAccountSet
      | InternalBatchInnerOperationClawback
      | InternalBatchInnerOperationConfidentialMPTConvert
      | InternalBatchInnerOperationConfidentialMPTConvertBack
      | InternalBatchInnerOperationConfidentialMPTMergeInbox
      | InternalBatchInnerOperationConfidentialMPTSend
      | InternalBatchInnerOperationDepositPreauth
      | InternalBatchInnerOperationEscrowFinish
      | InternalBatchInnerOperationMPTokenAuthorize
      | InternalBatchInnerOperationMPTokenIssuanceCreate
      | InternalBatchInnerOperationMPTokenIssuanceDestroy
      | InternalBatchInnerOperationMPTokenIssuanceSet
      | InternalBatchInnerOperationOfferCreate
      | InternalBatchInnerOperationPayment
      | InternalBatchInnerOperationTicketCreate
      | InternalBatchInnerOperationTrustSet
    export type InternalBatchInnerOperationAccountSet = {
      setFlag?: InternalXrplAccountSetFlag
      clearFlag?: InternalXrplAccountSetFlag
      transferRate?: number // int32
      type: "AccountSet"
    }
    export type InternalBatchInnerOperationClawback = {
      currency: InternalXrplClawbackCurrency
      holder: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Clawback"
    }
    export type InternalBatchInnerOperationConfidentialMPTConvert = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "ConfidentialMPTConvert"
    }
    export type InternalBatchInnerOperationConfidentialMPTConvertBack = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "ConfidentialMPTConvertBack"
    }
    export type InternalBatchInnerOperationConfidentialMPTMergeInbox = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      type: "ConfidentialMPTMergeInbox"
    }
    export type InternalBatchInnerOperationConfidentialMPTSend = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount?: string
      /**
       * Hex encoded string.
       */
      senderEncryptedBalance?: string // ^[A-Fa-f0-9]*$
      senderEncryptedBalanceVersion?: number // int64
      cryptographicFields?: InternalCmptCryptographicFields
      type: "ConfidentialMPTSend"
    }
    export type InternalBatchInnerOperationDepositPreauth = {
      authorize?: InternalTransactionDestination
      unauthorize?: InternalTransactionDestination
      type: "DepositPreauth"
    }
    export type InternalBatchInnerOperationEscrowFinish = {
      owner: InternalTransactionDestination
      offerSequence: number // int64
      /**
       * Hex encoded string.
       */
      condition?: string // ^[A-Fa-f0-9]*$
      credentialIds?: string /* ^[A-Fa-f0-9]*$ */[]
      /**
       * Hex encoded string.
       */
      fulfillment?: string // ^[A-Fa-f0-9]*$
      type: "EscrowFinish"
    }
    export type InternalBatchInnerOperationMPTokenAuthorize = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      flags: InternalXrplMPTokenAuthorizeFlag[]
      holder?: InternalTransactionDestination
      type: "MPTokenAuthorize"
    }
    export type InternalBatchInnerOperationMPTokenIssuanceCreate = {
      flags: InternalXrplMPTokenIssuanceCreateFlag[]
      assetScale?: number // int32
      /**
       * Transfer fee for MultiPurposeToken, must be from 0 to 50000
       */
      transferFee?: number // int32
      /**
       * This field is a unsigned 64bit integer that can store values in range from 0 to 18446744073709551615.It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumAmount?: string
      metadata?: InternalMPTokenIssuanceMetadata
      type: "MPTokenIssuanceCreate"
    }
    export type InternalBatchInnerOperationMPTokenIssuanceDestroy = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      type: "MPTokenIssuanceDestroy"
    }
    export type InternalBatchInnerOperationMPTokenIssuanceSet = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      holder?: InternalTransactionDestination
      flags: InternalXrplMPTokenIssuanceSetFlag[]
      issuerEncryptionKey?: string
      auditorEncryptionKey?: string
      mutableFlags: InternalXrplMPTokenIssuanceMutableFlag[]
      type: "MPTokenIssuanceSet"
    }
    export type InternalBatchInnerOperationOfferCreate = {
      flags: InternalXrplOfferCreateFlag[]
      takerGets: InternalXrplAssetQuantity
      takerPays: InternalXrplAssetQuantity
      type: "OfferCreate"
    }
    export type InternalBatchInnerOperationPayment = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      destinationTag?: number // int64
      currency?: InternalXrplPaymentCurrency
      flags?: InternalXrplPaymentFlag[]
      type: "Payment"
    }
    export type InternalBatchInnerOperationTicketCreate = {
      /**
       * Number of tickets to create, must be from 1 to 250
       */
      ticketCount: number // int32
      type: "TicketCreate"
    }
    export type InternalBatchInnerOperationTrustSet = {
      flags: InternalXrplTrustSetFlag[]
      limitAmount: InternalXrplLimitAmount
      enableRippling?: boolean
      type: "TrustSet"
    }
    export type InternalBatchSigner = {
      participant: InternalParticipant
      /**
       * Hex encoded string.
       */
      publicKey: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      signature: string // ^[A-Fa-f0-9]*$
    }
    export type InternalBitcoinFeeStrategy =
      | InternalBitcoinFeeStrategyPriority
      | InternalBitcoinFeeStrategySpecifiedRate
    export type InternalBitcoinFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalBitcoinFeeStrategySpecifiedRate = {
      /**
       * This field is a large decimal and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      satoshiPerVbyte: string
      type: "SpecifiedRate"
    }
    export type InternalBitcoinLikeVaultLedgerIdentifier = "btc" | "ltc" | "bch" | "doge" | "dash"
    export type InternalBitcoinOutputParameters = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      paysFee?: boolean
    }
    export type InternalBitcoinResourceStrategy = InternalBitcoinResourceStrategyOrderReplacement
    export type InternalBitcoinResourceStrategyOrderReplacement = {
      transactionOrderId: string // uuid
      reason?: string
      type: "OrderReplacement"
    }
    export type InternalBitcoinTickerProperties = InternalBitcoinTickerPropertiesNative
    export type InternalBitcoinTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalCardanoFeeStrategy = InternalCardanoFeeStrategyPriority
    export type InternalCardanoFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalCardanoOperation =
      | InternalCardanoOperationDelegateRepresentative
      | InternalCardanoOperationDelegateStaking
      | InternalCardanoOperationRegisterStaking
      | InternalCardanoOperationTransfer
      | InternalCardanoOperationUnregisterStaking
      | InternalCardanoOperationWithdrawRewards
    export type InternalCardanoOperationDelegateRepresentative = {
      parameters: InternalDelegateRepresentativeParameters
      type: "DelegateRepresentative"
    }
    export type InternalCardanoOperationDelegateStaking = {
      /**
       * A valid Cardano pool id
       * example:
       * pool1ywpt43nttzjd7883wafg255mh0hmjypwe65ercw6p2sxg5lt7ez
       */
      poolId: string
      type: "DelegateStaking"
    }
    export type InternalCardanoOperationRegisterStaking = {
      type: "RegisterStaking"
    }
    export type InternalCardanoOperationTransfer = {
      outputs: InternalCardanoOutputParameters[]
      type: "Transfer"
    }
    export type InternalCardanoOperationUnregisterStaking = {
      type: "UnregisterStaking"
    }
    export type InternalCardanoOperationWithdrawRewards = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "WithdrawRewards"
    }
    export type InternalCardanoOutputParameters = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      paysFee?: boolean
    }
    export type InternalCardanoTickerProperties = InternalCardanoTickerPropertiesNative
    export type InternalCardanoTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalCmptCryptographicFields =
      | InternalCmptCryptographicFieldsClawback
      | InternalCmptCryptographicFieldsConvert
      | InternalCmptCryptographicFieldsConvertBack
      | InternalCmptCryptographicFieldsSend
    export type InternalCmptCryptographicFieldsClawback = {
      zkProof: string // base64
      amount: number // int64
      type: "Clawback"
    }
    export type InternalCmptCryptographicFieldsConvert = {
      holderEncryptedAmount: string // base64
      issuerEncryptedAmount: string // base64
      blindingFactor: string // base64
      zkProof?: string // base64
      auditorEncryptedAmount?: string // base64
      type: "Convert"
    }
    export type InternalCmptCryptographicFieldsConvertBack = {
      holderEncryptedAmount: string // base64
      issuerEncryptedAmount: string // base64
      blindingFactor: string // base64
      balanceCommitment: string // base64
      zkProof: string // base64
      auditorEncryptedAmount?: string // base64
      type: "ConvertBack"
    }
    export type InternalCmptCryptographicFieldsSend = {
      senderEncryptedBalance?: string // base64
      senderEncryptedBalanceVersion?: number // int64
      senderEncryptedAmount: string // base64
      destinationEncryptedAmount: string // base64
      issuerEncryptedAmount: string // base64
      balanceCommitment: string // base64
      amountCommitment: string // base64
      zkProof: string // base64
      auditorEncryptedAmount?: string // base64
      type: "Send"
    }
    export type InternalComplianceConfigurationUpdated = {
      accountReference: InternalAccountReference
      skipQuarantineFrom: InternalSkipQuarantineScope
      revision: number // int64
      modifiedBy?: InternalUserReference
      type: "ComplianceConfigurationUpdated"
    }
    export type InternalContractParameters = InternalContractParametersRaw
    export type InternalContractParametersRaw = {
      /**
       * Hex encoded string.
       */
      value: string // ^[A-Fa-f0-9]*$
      type: "Raw"
    }
    export type InternalCoreExtensionsAuthentication = {
      oidcDiscoveryUrl: string
    }
    export type InternalCoreExtensionsDomainScope = "Self" | "SelfAndDescendants"
    export type InternalCoreExtensionsNotary = {
      apiPublicKey: string
      messagingPublicKey: string
    }
    export type InternalCoreExtensionsNotificationSource = "TransactionDetected" | "IntentApproved"
    export type InternalCoreExtensionsSystemInformation = {
      notary?: InternalCoreExtensionsNotary
      authentication: InternalCoreExtensionsAuthentication
    }
    export type InternalCoreExtensionsUserAvailableNotificationSourceResponse = {
      domainId: string // uuid
      availableSources: {
        [name: string]: InternalCoreExtensionsNotificationSource[]
      }
    }
    export type InternalCoreExtensionsUserNotificationPreferencesUpdateRequest = {
      domainId: string // uuid
      domainScope: InternalCoreExtensionsDomainScope
      subscriptions: InternalCoreExtensionsNotificationSource[]
    }
    export type InternalCoreExtensionsUserSubscribedNotificationSourceResponse = {
      domainId: string // uuid
      subscriptions: InternalCoreExtensionsNotificationSource[]
      scope: InternalCoreExtensionsDomainScope
    }
    export type InternalCreateDomainGenesisPolicy = {
      id: string // uuid
      alias: string
      rank: number // int32
      intentTypes?: InternalIntentType[]
      scope: InternalPolicyScope
      scriptingEngine: InternalScriptingEngine
      condition?: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyCondition
      workflow?: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalWorkflowCondition[]
      lock: InternalIntentLockStatus
      description?: string
      customProperties: InternalStringsMap
      intentOrigin?: InternalIntentOrigin
    }
    export type InternalCreateDomainGenesisUser = {
      id: string // uuid
      alias: string
      publicKey: string // base64
      roles: string /* [a-z0-9\-]+ */[]
      lock: InternalIntentLockStatus
      description?: string
      customProperties: InternalStringsMap
      /**
       * Domain-unique `loginId`-`loginProviderId` pairs. Must be specified for login and match pre-configured values.
       */
      loginIds?: InternalLoginId[]
    }
    export type InternalCreateDomainsPayload = {
      id: string // uuid
      alias: string
      lock: InternalIntentLockStatus
      governingStrategy?: InternalGoverningStrategy
      permissions: InternalPermissions
      description?: string
      customProperties: InternalStringsMap
      users: InternalCreateDomainGenesisUser[]
      policies: InternalCreateDomainGenesisPolicy[]
      descendants: InternalCreateDomainsPayload[]
    }
    export type InternalCreateLedgerGenesis = {
      id: string
      alias: string
      parameters: InternalLedgerParameters
      description?: string
      customProperties: InternalStringsMap
    }
    export type InternalCreateTransferOrderOutput = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      paysFee?: boolean
    }
    /**
     * A list of all entities created during genesis.
     */
    export type InternalCreatedEntitiesReferences = {
      rootUsers: InternalCreatedEntitiesReferencesUser[]
      rootPolicies: InternalCreatedEntitiesReferencesPolicy[]
    }
    export type InternalCreatedEntitiesReferencesPolicy = {
      id: string // uuid
    }
    export type InternalCreatedEntitiesReferencesUser = {
      id: string // uuid
    }
    export type InternalCurrentVault = {
      id: string // uuid
      publicKey: string // base64
      processingStatus: InternalVaultProcessingStatus
      vaultApiVersion?: InternalVaultApiVersion
    }
    export type InternalDecisionPayload = {
      author: InternalUserReference
      authorRoles: string /* [a-z0-9\-]+ */[]
      seenBySystemAt: string // date-time
      expiryAt?: string // date-time
      decision: InternalApprovalDecision
      approvalReason?: string
      rejectionReason?: string
      rawRequest: string
      signature: string // base64
    }
    export type InternalDecryptCbsPending = {
      decryptCbsId: string
      signedPayload: string
    }
    export type InternalDecryptCbsPrepared = {
      decryptCbsId: string
      signedPayload: string
    }
    export type InternalDelegateRepresentativeParameters =
      InternalDelegateRepresentativeParametersAlwaysAbstain
    export type InternalDelegateRepresentativeParametersAlwaysAbstain = {
      type: "AlwaysAbstain"
    }
    export type InternalDomain = {
      id: string // uuid
      parentId?: string // uuid
      alias: string
      lock: InternalLockStatus
      governingStrategy?: InternalGoverningStrategy
      permissions: InternalPermissions
      metadata: InternalEntityMetadata
    }
    export type InternalDomainCreated = {
      id: string // uuid
      parentId: string // uuid
      type: "DomainCreated"
    }
    export type InternalDomainUpdated = {
      id: string // uuid
      parentId?: string // uuid
      type: "DomainUpdated"
    }
    export type InternalElGamalKeyProvisioned = {
      id: string // uuid
      type: "ElGamalKeyProvisioned"
    }
    export type InternalElGamalKeyProvisioningFailed = {
      id: string // uuid
      type: "ElGamalKeyProvisioningFailed"
    }
    export type InternalEndpoint = {
      id: string // uuid
      domainId: string // uuid
      address: string
      ledgerId: string
      parameters?: InternalEndpointLedgerParameters
      alias: string
      lock: InternalLockStatus
      metadata: InternalEntityMetadata
      trustScore: number // int32
    }
    export type InternalEndpointCreated = {
      id: string // uuid
      type: "EndpointCreated"
    }
    export type InternalEndpointLedgerParameters = InternalEndpointLedgerParametersEthereum
    export type InternalEndpointLedgerParametersEthereum = {
      /**
       * This field can be used to provide an Application Binary Interface (ABI) for EVM-based smart contracts, Ripple Custody's front-end uses the field to provide an extended support when interacting with smart contracts, therefore it is not recommended to submit invalid ABIs in this field but Ripple Custody will not prevent the submission of invalid ABIs to tolerate use cases outside of Ripple Custody's front-end.
       */
      ABI?: string
      type: "Ethereum"
    }
    export type InternalEndpointUpdated = {
      id: string // uuid
      type: "EndpointUpdated"
    }
    export type InternalEntityIdAndRevision = {
      id: string // uuid
      revision: number // int64
    }
    export type InternalEntityMetadata = {
      description?: string
      revision: number // int64
      createdAt: string // date-time
      createdBy?: InternalUserReference
      lastModifiedAt: string // date-time
      lastModifiedBy?: InternalUserReference
      customProperties: InternalStringsMap
    }
    export type InternalEntityStringIdAndRevision = {
      id: string
      revision: number // int64
    }
    export type InternalErrorMessage = {
      reason: string
      message?: string
    }
    export type InternalEthereumFeeStrategy =
      | InternalEthereumFeeStrategyPriority
      | InternalEthereumFeeStrategySpecifiedRate
      | InternalEthereumFeeStrategySpecifiedRateEIP1559
    export type InternalEthereumFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalEthereumFeeStrategySpecifiedRate = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      gasPrice: string
      type: "SpecifiedRate"
    }
    export type InternalEthereumFeeStrategySpecifiedRateEIP1559 = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maxFeePerGas: string
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maxPriorityFeePerGas: string
      type: "SpecifiedRateEIP1559"
    }
    export type InternalEthereumLikeVaultLedgerIdentifier = "eth" | "etc"
    export type InternalEthereumResourceStrategy = InternalEthereumResourceStrategyOrderReplacement
    export type InternalEthereumResourceStrategyOrderReplacement = {
      transactionOrderId: string // uuid
      reason?: string
      type: "OrderReplacement"
    }
    export type InternalEthereumTickerProperties =
      | InternalEthereumTickerPropertiesERC1155
      | InternalEthereumTickerPropertiesERC20
      | InternalEthereumTickerPropertiesERC721
      | InternalEthereumTickerPropertiesNative
    export type InternalEthereumTickerPropertiesERC1155 = {
      address: string
      tokenId: string
      type: "ERC1155"
    }
    export type InternalEthereumTickerPropertiesERC20 = {
      address: string
      type: "ERC20"
    }
    export type InternalEthereumTickerPropertiesERC721 = {
      address: string
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      tokenId: string
      type: "ERC721"
    }
    export type InternalEthereumTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalEvaluationContext = {
      request: InternalProposalPayload
      references: InternalEvaluationContextReferences
      submitter: InternalSubmitter
      intentOrigin: InternalIntentOrigin
    }
    export type InternalEvaluationContextReferences = {
      backups: InternalMapBackup
      users: InternalMapUser
      domains: InternalMapDomain
      policies: InternalMapPolicy
      ledgers: InternalMapLedger
      endpoints: InternalMapEndpoint
      vaults: InternalMapVault
      accounts: InternalMapAccount
      tickers: InternalMapValidatedTicker
      manifests: InternalMapManifest
      systemProperties: InternalMapSystemProperty
      transactionOrders: InternalMapTransactionOrder
    }
    export type InternalEventsCollection = {
      items: InternalHarmonizeEvent[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type InternalFeePriority = "High" | "Medium" | "Low"
    /**
     * Complete genesis payload, copied in and signed by the notary at genesis.
     */
    export type InternalGenesis = {
      data: InternalGenesisData
      signature: string // base64
    }
    export type InternalGenesisCryptoSetup = {
      apiSigning: InternalKeyType
      collectionSigning: InternalKeyType
      messageSigning: InternalKeyType
    }
    export type InternalGenesisData = {
      executedAt: string // date-time
      payload: InternalGenesisPayload
    }
    export type InternalGenesisPayload = {
      rootDomainSetup: InternalRootDomainSetup
      cryptoSetup: InternalGenesisCryptoSetup
      tickers?: InternalTickerToValidate[]
      systemProperties?: InternalReadWriteSystemPropertyKeyValue[]
      ledgers?: InternalCreateLedgerGenesis[]
      systemSignaturesPublicKey?: string // base64
    }
    export type InternalGenesisSucceeded = {
      apiPublicKey: string // base64
      messagingPublicKey: string // base64
      genesis?: /* Complete genesis payload, copied in and signed by the notary at genesis. */ InternalGenesis
      createdEntitiesReferences?: /* A list of all entities created during genesis. */ InternalCreatedEntitiesReferences
      systemSignaturesPublicKey?: string // base64
      type: "GenesisSucceeded"
    }
    export type InternalGoverningStrategy = "ConsiderDescendants" | "CoerceDescendants"
    export type InternalHarmonizeEvent = {
      domainId: string // uuid
      payload: InternalHarmonizeEventPayload
      id: string // uuid
      sequenceNumber: number // int64
      savedAt: string // date-time
    }
    export type InternalHarmonizeEventPayload =
      | InternalAccountCreated
      | InternalAccountUpdated
      | InternalAddressCreated
      | InternalBackupCreated
      | InternalBackupUpdated
      | InternalBalancesUpdated
      | InternalComplianceConfigurationUpdated
      | InternalDomainCreated
      | InternalDomainUpdated
      | InternalElGamalKeyProvisioned
      | InternalElGamalKeyProvisioningFailed
      | InternalEndpointCreated
      | InternalEndpointUpdated
      | InternalGenesisSucceeded
      | InternalIntentClosed
      | InternalIntentCreated
      | InternalIntentExecuted
      | InternalIntentUpdated
      | InternalLedgerCreated
      | InternalLedgerUpdated
      | InternalManifestCreated
      | InternalManifestUpdated
      | InternalPolicyCreated
      | InternalPolicyUpdated
      | InternalQuarantineApplied
      | InternalQuarantineSkipped
      | InternalSystemPropertySet
      | InternalTickerCreated
      | InternalTickerUpdated
      | InternalTransactionCreated
      | InternalTransactionDetected
      | InternalTransactionUpdated
      | InternalTransferUpdated
      | InternalTrustedPublicKeyAdded
      | InternalTrustedPublicKeyUpdated
      | InternalUserCreated
      | InternalUserUpdated
      | InternalVaultCreated
      | InternalVaultKeyMaterialRewrapCompleted
      | InternalVaultKeyMaterialRewrapFailed
      | InternalVaultUpdated
    export type InternalHederaFeeStrategy = InternalHederaFeeStrategyPriority
    export type InternalHederaFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalHederaOperation =
      | InternalHederaOperationAccountUpdate
      | InternalHederaOperationTokenAssociate
      | InternalHederaOperationTokenDissociate
      | InternalHederaOperationTransfer
    export type InternalHederaOperationAccountUpdate = {
      maxAutomaticTokenAssociations: number // int32
      type: "AccountUpdate"
    }
    export type InternalHederaOperationTokenAssociate = {
      tokens: InternalTokenDestination[]
      type: "TokenAssociate"
    }
    export type InternalHederaOperationTokenDissociate = {
      tokens: InternalTokenDestination[]
      type: "TokenDissociate"
    }
    export type InternalHederaOperationTransfer = {
      outputs?: InternalHederaTransferOutput[]
      tokenOutputs?: InternalTokenOutput[]
      type: "Transfer"
    }
    export type InternalHederaTickerProperties =
      | InternalHederaTickerPropertiesFungibleToken
      | InternalHederaTickerPropertiesNative
      | InternalHederaTickerPropertiesNonFungibleToken
    export type InternalHederaTickerPropertiesFungibleToken = {
      /**
       * String consisting Hedera Token Id
       */
      id: string
      type: "FungibleToken"
    }
    export type InternalHederaTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalHederaTickerPropertiesNonFungibleToken = {
      /**
       * String consisting Hedera Token Id
       */
      id: string
      serialNumber: number // int64
      type: "NonFungibleToken"
    }
    export type InternalHederaTransferOutput = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
    }
    export type InternalIntentAuthor = InternalIntentAuthorService | InternalIntentAuthorUser
    export type InternalIntentAuthorService = {
      subject: string // ^[\x20-\x7E]*$
    }
    export type InternalIntentAuthorUser = {
      id: string // uuid
      domainId: string // uuid
    }
    export type InternalIntentClosed = {
      id: string // uuid
      type: "IntentClosed"
    }
    export type InternalIntentContextResponse = {
      accounts: InternalTrustedAccount[]
      domains: InternalTrustedDomain[]
      endpoints: InternalTrustedEndpoint[]
      intents: InternalTrustedIntent[]
      ledgers: InternalLedger[]
      policies: InternalTrustedPolicy[]
      tickers: InternalApiTicker[]
      transactionOrders: InternalTrustedTransactionOrder[]
      transfers: InternalApiTransfer[]
      users: InternalTrustedUser[]
      vaults: InternalTrustedVault[]
      manifests: InternalTrustedManifest[]
    }
    export type InternalIntentCreated = {
      id: string // uuid
      type: "IntentCreated"
    }
    export type InternalIntentDetails = {
      payload: InternalUserIntentPayload
      expiryAt: string // date-time
      author: InternalIntentAuthor
      targetDomainId: string // uuid
      metadata: InternalIntentMetadata
      proposalSignature: string // base64
      signingKey?: string // base64
    }
    export type InternalIntentEntity = {
      id: string // uuid
      details: InternalIntentDetails
      state: InternalIntentState
    }
    export type InternalIntentError = {
      code: InternalUserOperationRejectionCode
      message: string
    }
    export type InternalIntentExecuted = {
      id: string // uuid
      type: "IntentExecuted"
    }
    export type InternalIntentLockStatus = "Unlocked" | "Locked"
    export type InternalIntentMetadata = {
      description?: string
      createdAt: string // date-time
      customProperties: InternalStringsMap
    }
    export type InternalIntentOrigin = "UserSigned" | "SystemSigned"
    export type InternalIntentState = {
      status: InternalIntentStatus
      lastModifiedAt?: string // date-time
      error?: InternalIntentError
      progressPerPolicy?: InternalWorkflowProgress[]
    }
    export type InternalIntentStatus =
      | "Open"
      | "Approved"
      | "Executed"
      | "Failed"
      | "Expired"
      | "Rejected"
      | "Executing"
    export type InternalIntentType =
      | "v0_NotarizeData"
      | "v0_ExecuteExtension"
      | "v0_CreateDomain"
      | "v0_UpdateDomain"
      | "v0_UpdateDomainPermissions"
      | "v0_UnlockDomain"
      | "v0_LockDomain"
      | "v0_CreateUser"
      | "v0_UpdateUser"
      | "v0_UnlockUser"
      | "v0_LockUser"
      | "v0_CreatePolicy"
      | "v0_UpdatePolicy"
      | "v0_UnlockPolicy"
      | "v0_LockPolicy"
      | "v0_CreateVault"
      | "v0_UpdateVault"
      | "v0_UnlockVault"
      | "v0_LockVault"
      | "v0_RewrapVaultKeyMaterial"
      | "v0_UnlockTicker"
      | "v0_LockTicker"
      | "v0_CreateEndpoint"
      | "v0_UpdateEndpoint"
      | "v0_UnlockEndpoint"
      | "v0_LockEndpoint"
      | "v0_CreateAccount"
      | "v0_MigrateSilo3AccountBatch"
      | "v0_UpdateAccount"
      | "v0_UnlockAccount"
      | "v0_LockAccount"
      | "v0_AddAccountLedgers"
      | "v0_CreateTransactionOrder"
      | "v0_ReleaseQuarantinedTransfers"
      | "v0_CreateTicker"
      | "v0_AttemptTransactionOrderCancellation"
      | "v0_ValidateTickers"
      | "v0_UpdateTicker"
      | "v0_CreateTransferOrder"
      | "v0_SignManifest"
      | "v0_SetSystemProperty"
      | "v0_CreateLedger"
      | "v0_UpdateLedger"
      | "v0_AddTrustedPublicKeysForMigration"
      | "v0_RegisterTrustedPublicKey"
      | "v0_CreateBackup"
      | "v0_AcknowledgeBackup"
      | "v0_ProvisionElGamalKeyPair"
    export type InternalIntentUpdated = {
      id: string // uuid
      type: "IntentUpdated"
    }
    export type InternalKeyPurpose = "ElGamal"
    export type InternalKeyType = "Secp256r1" | "Secp256k1" | "Ed25519"
    export type InternalLedger = {
      id: string
      alias: string
      parameters: InternalLedgerParameters
      metadata: InternalEntityMetadata
    }
    export type InternalLedgerCreated = {
      id: string
      type: "LedgerCreated"
    }
    export type InternalLedgerParameters =
      | InternalLedgerParametersAlgorand
      | InternalLedgerParametersBitcoin
      | InternalLedgerParametersCardano
      | InternalLedgerParametersEthereum
      | InternalLedgerParametersHedera
      | InternalLedgerParametersSolana
      | InternalLedgerParametersStellar
      | InternalLedgerParametersSubstrate
      | InternalLedgerParametersTezos
      | InternalLedgerParametersTron
      | InternalLedgerParametersXRPL
    export type InternalLedgerParametersAlgorand = {
      genesisId: string
      genesisHash: string
      nativeTickerSymbol: string
      nativeTickerName: string
      nativeTickerDecimals: number // int32
      type: "Algorand"
    }
    export type InternalLedgerParametersBitcoin = {
      supportsSegWit: boolean
      vaultLedgerIdentifier: InternalBitcoinLikeVaultLedgerIdentifier
      network: InternalNetwork
      tickerSymbol: string
      tickerName: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      dustLimit: string
      type: "Bitcoin"
    }
    export type InternalLedgerParametersCardano = {
      nativeTickerSymbol: string
      nativeTickerName: string
      testnetMagic?: number // int64
      type: "Cardano"
    }
    export type InternalLedgerParametersEthereum = {
      chainId: number // int32
      vaultLedgerIdentifier: InternalEthereumLikeVaultLedgerIdentifier
      nativeTickerSymbol: string
      nativeTickerName: string
      supportsEIP1559: boolean
      type: "Ethereum"
    }
    export type InternalLedgerParametersHedera = {
      nativeTickerSymbol: string
      nativeTickerName: string
      type: "Hedera"
    }
    export type InternalLedgerParametersSolana = {
      nativeTickerSymbol: string
      nativeTickerName: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      lamportsPerSignature: string
      type: "Solana"
    }
    export type InternalLedgerParametersStellar = {
      nativeTickerSymbol: string
      nativeTickerName: string
      networkPassphrase: string
      type: "Stellar"
    }
    export type InternalLedgerParametersSubstrate = {
      genesisHash: string // ^0x[a-f0-9]{64}$
      addressPrefix: number
      nativeTickerSymbol: string
      nativeTickerName: string
      nativeTickerDecimals: number // int32
      supportedRuntimeVersions: InternalSubstrateRuntimeInfo[]
      type: "Substrate"
    }
    export type InternalLedgerParametersTezos = {
      nativeTickerSymbol: string
      nativeTickerName: string
      chainId: string
      type: "Tezos"
    }
    export type InternalLedgerParametersTron = {
      nativeTickerSymbol: string
      nativeTickerName: string
      type: "Tron"
    }
    export type InternalLedgerParametersXRPL = {
      nativeTickerSymbol: string
      nativeTickerName: string
      networkId: number // int32
      type: "XRPL"
    }
    export type InternalLedgerUpdated = {
      id: string
      type: "LedgerUpdated"
    }
    export type InternalLockStatus = "Unlocked" | "Locked" | "Archived"
    export type InternalLoginId = {
      /**
       * User identifier used by the provider.
       */
      id: string
      /**
       * Login provider. For internal login, set to `harmonize`. For external identity providers, must match the provider name.
       */
      providerId: string
    }
    export type InternalMPTokenIssuanceMetadata = InternalMPTokenIssuanceMetadataHexEncodedMetadata
    export type InternalMPTokenIssuanceMetadataHexEncodedMetadata = {
      /**
       * Hex encoded string.
       */
      value: string // ^[A-Fa-f0-9]*$
      type: "HexEncodedMetadata"
    }
    export type InternalManifest = {
      id: string // uuid
      domainId: string // uuid
      accountId: string // uuid
      ledgerId?: string
      content: InternalManifestContent
      value?: InternalManifestValue
      metadata: InternalEntityMetadata
    }
    export type InternalManifestContent =
      | InternalManifestContentEIP191
      | InternalManifestContentJWT
      | InternalManifestContentUnsafe
    export type InternalManifestContentEIP191 = {
      value: string // ^0[xX](([a-fA-F0-9][a-fA-F0-9])*)$
      type: "EIP-191"
    }
    export type InternalManifestContentJWT = {
      header: InternalManifestContentJWTHeader
      payload: InternalManifestContentJWTPayload
      type: "JWT"
    }
    export type InternalManifestContentJWTHeader = {
      type?: string
      algorithm?: string
      additionalParameters?: InternalStringsMap
    }
    export type InternalManifestContentJWTPayload = {
      issuer?: string
      subject?: string
      audience?: string
      expiration?: number // int64
      notBefore?: number // int64
      issuedAt?: number // int64
      jwtId?: string
      additionalClaims?: InternalStringsMap
    }
    export type InternalManifestContentUnsafe = {
      value: string // base64
      type: "Unsafe"
    }
    export type InternalManifestCreated = {
      id: string // uuid
      accountId?: string // uuid
      type: "ManifestCreated"
    }
    export type InternalManifestPending = {
      domainId: string // uuid
      manifestId: string // uuid
      signedPayload: string
    }
    export type InternalManifestUpdated = {
      id: string // uuid
      accountId?: string // uuid
      type: "ManifestUpdated"
    }
    export type InternalManifestValue =
      | InternalManifestValueEIP191
      | InternalManifestValueJWT
      | InternalManifestValueUnsafe
    export type InternalManifestValueEIP191 = {
      value: string // ^0[xX](([a-fA-F0-9][a-fA-F0-9])*)$
      type: "EIP-191"
    }
    export type InternalManifestValueJWT = {
      value: string
      type: "JWT"
    }
    export type InternalManifestValueUnsafe = {
      signature: string // base64
      recoveryId?: string // base64
      type: "Unsafe"
    }
    export type InternalMapAccount = {
      [name: string]: InternalAccount
    }
    export type InternalMapBackup = {
      [name: string]: InternalBackup
    }
    export type InternalMapDomain = {
      [name: string]: InternalDomain
    }
    export type InternalMapEndpoint = {
      [name: string]: InternalEndpoint
    }
    export type InternalMapLedger = {
      [name: string]: InternalLedger
    }
    export type InternalMapManifest = {
      [name: string]: InternalManifest
    }
    export type InternalMapPolicy = {
      [name: string]: InternalPolicy
    }
    export type InternalMapSystemProperty = {
      [name: string]: InternalSystemProperty
    }
    export type InternalMapTransactionOrder = {
      [name: string]: InternalTransactionOrder
    }
    export type InternalMapUser = {
      [name: string]: InternalUser
    }
    export type InternalMapValidatedTicker = {
      [name: string]: InternalValidatedTicker
    }
    export type InternalMapVault = {
      [name: string]: InternalVault
    }
    export type InternalNetwork = "mainnet" | "testnet" | "regtest"
    export type InternalNonFungibleTokenDestination =
      | InternalNonFungibleTokenDestinationNftTokenId
      | InternalNonFungibleTokenDestinationTicker
    export type InternalNonFungibleTokenDestinationNftTokenId = {
      /**
       * String consisting Hedera Token Id
       */
      tokenId: string
      serialNumber: number // int64
      type: "NftTokenId"
    }
    export type InternalNonFungibleTokenDestinationTicker = {
      tickerId: string // uuid
      type: "Ticker"
    }
    export type InternalNotaryApiKeyValue = {
      publicKey: InternalAccountPublicKeyOnly
    }
    export type InternalNotaryCollectionsKeyValue = {
      publicKey: InternalAccountPublicKeyOnly
    }
    export type InternalNotaryCommunicationKeyValue = {
      publicKey: InternalAccountPublicKeyOnly
    }
    export type InternalNotarySystemSignedIntentsEnabledValue = {
      enabled: boolean
    }
    export type InternalNotarySystemSigningKeyValue = {
      publicKey: InternalAccountPublicKeyOnly
    }
    export type InternalParametersComputePending = {
      parametersId: string
      signedPayload: string
    }
    export type InternalParametersComputePrepared = {
      parametersId: string
      signedPayload: string
    }
    export type InternalParticipant =
      | InternalParticipantAccount
      | InternalParticipantAddress
      | InternalParticipantEndpoint
    export type InternalParticipantAccount = {
      accountId: string // uuid
      type: "Account"
    }
    export type InternalParticipantAddress = {
      address: string
      type: "Address"
    }
    export type InternalParticipantEndpoint = {
      endpointId: string // uuid
      type: "Endpoint"
    }
    export type InternalParticipantSequencing =
      | InternalParticipantSequencingAccountSequence
      | InternalParticipantSequencingTicket
    export type InternalParticipantSequencingAccountSequence = {
      value: number // int64
      type: "AccountSequence"
    }
    export type InternalParticipantSequencingTicket = {
      value: number // int64
      type: "Ticket"
    }
    export type InternalPermissions = {
      readAccess: InternalReadAccess
    }
    export type InternalPolicy = {
      id: string // uuid
      domainId: string // uuid
      alias: string
      rank: number // int32
      intentTypes?: InternalIntentType[]
      scope: InternalPolicyScope
      scriptingEngine: InternalScriptingEngine
      condition?: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyCondition
      workflow?: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalWorkflowCondition[]
      lock: InternalLockStatus
      metadata: InternalEntityMetadata
      intentOrigin?: InternalIntentOrigin
    }
    /**
     * example:
     * {
     *   "left": {
     *     "left": {
     *       "expression": "true == true",
     *       "type": "Expression"
     *     },
     *     "right": {
     *       "expression": "false == true",
     *       "type": "Expression"
     *     },
     *     "type": "And"
     *   },
     *   "right": {
     *     "left": {
     *       "expression": "true == false",
     *       "type": "Expression"
     *     },
     *     "right": {
     *       "expression": "false == false",
     *       "type": "Expression"
     *     },
     *     "type": "Or"
     *   }
     * }
     */
    export type InternalPolicyCondition =
      /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyConditionAnd | InternalPolicyConditionExpression | InternalPolicyConditionOr
    export type InternalPolicyConditionAnd = {
      left: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyCondition
      right: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyCondition
      type: "And"
    }
    export type InternalPolicyConditionExpression = {
      expression: string
      type: "Expression"
    }
    export type InternalPolicyConditionOr = {
      left: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyCondition
      right: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyCondition
      type: "Or"
    }
    export type InternalPolicyCreated = {
      id: string // uuid
      type: "PolicyCreated"
    }
    export type InternalPolicyReference = {
      id: string // uuid
      revision: number // int64
      domainId: string // uuid
    }
    export type InternalPolicyScope = "Self" | "Descendants" | "SelfAndDescendants"
    export type InternalPolicyUpdated = {
      id: string // uuid
      type: "PolicyUpdated"
    }
    /**
     * Hint for specifically bitcoin ledgers to have the transaction happen with addressForChange PrimaryAddress - so change utxo goes to address \0\0 - aligned with dry-runs - rather than the default generate a new chain-internal address.
     */
    export type InternalPreferredAddressForChange = "PrimaryAddress"
    export type InternalProposalPayload = InternalPropose | InternalServicePropose
    export type InternalPropose = {
      author: InternalUserReference
      expiryAt: string // date-time
      targetDomainId: string // uuid
      id: string // uuid
      payload: InternalProposeUserIntentPayload
      description?: string
      customProperties: InternalStringsMap
      type: "Propose"
    }
    export type InternalProposeTransactionOrderParameters =
      | InternalTransactionOrderParametersAlgorand
      | InternalTransactionOrderParametersBitcoin
      | InternalTransactionOrderParametersCardano
      | InternalTransactionOrderParametersEthereum
      | InternalTransactionOrderParametersHedera
      | InternalTransactionOrderParametersSolana
      | InternalTransactionOrderParametersStellar
      | InternalTransactionOrderParametersSubstrate
      | InternalTransactionOrderParametersTezos
      | InternalTransactionOrderParametersTron
      | InternalTransactionOrderParametersXRPL
    export type InternalProposeUserIntentPayload =
      | InternalProposeV0CreateTransactionOrder
      | InternalV0AcknowledgeBackup
      | InternalV0AddAccountLedgers
      | InternalV0AddTrustedPublicKeysForMigration
      | InternalV0AttemptTransactionOrderCancellation
      | InternalV0CreateAccount
      | InternalV0CreateBackup
      | InternalV0CreateDomain
      | InternalV0CreateEndpoint
      | InternalV0CreateLedger
      | InternalV0CreatePolicy
      | InternalV0CreateTicker
      | InternalV0CreateTransferOrder
      | InternalV0CreateUser
      | InternalV0CreateVault
      | InternalV0ExecuteExtension
      | InternalV0LockAccount
      | InternalV0LockDomain
      | InternalV0LockEndpoint
      | InternalV0LockPolicy
      | InternalV0LockTicker
      | InternalV0LockUser
      | InternalV0LockVault
      | InternalV0MigrateSilo3AccountBatch
      | InternalV0NotarizeData
      | InternalV0ProvisionElGamalKeyPair
      | InternalV0RegisterTrustedPublicKey
      | InternalV0ReleaseQuarantinedTransfers
      | InternalV0RewrapVaultKeyMaterial
      | InternalV0SetSystemProperty
      | InternalV0SignManifest
      | InternalV0UnlockAccount
      | InternalV0UnlockDomain
      | InternalV0UnlockEndpoint
      | InternalV0UnlockPolicy
      | InternalV0UnlockTicker
      | InternalV0UnlockUser
      | InternalV0UnlockVault
      | InternalV0UpdateAccount
      | InternalV0UpdateDomain
      | InternalV0UpdateDomainPermissions
      | InternalV0UpdateEndpoint
      | InternalV0UpdateLedger
      | InternalV0UpdatePolicy
      | InternalV0UpdateTicker
      | InternalV0UpdateUser
      | InternalV0UpdateVault
      | InternalV0ValidateTickers
    export type InternalProposeV0CreateTransactionOrder = {
      id: string // uuid
      accountId: string // uuid
      ledgerId?: string
      parameters: InternalProposeTransactionOrderParameters
      description?: string
      customProperties: InternalStringsMap
      type: "v0_CreateTransactionOrder"
    }
    export type InternalPurposeKey = {
      ledgerId: string
      purpose: InternalKeyPurpose
      publicKey: string // base64
    }
    export type InternalQuarantineApplied = {
      transferId: string // uuid
      type: "QuarantineApplied"
    }
    export type InternalQuarantineSkipped = {
      transferId: string // uuid
      type: "QuarantineSkipped"
    }
    export type InternalQuarantineStatus = "Quarantined" | "Released" | "Skipped"
    export type InternalReadAccess = {
      domains: string /* [a-z0-9\-]+ */[]
      users: string /* [a-z0-9\-]+ */[]
      endpoints: string /* [a-z0-9\-]+ */[]
      policies: string /* [a-z0-9\-]+ */[]
      accounts: string /* [a-z0-9\-]+ */[]
      transactions: string /* [a-z0-9\-]+ */[]
      requests: string /* [a-z0-9\-]+ */[]
      events: string /* [a-z0-9\-]+ */[]
    }
    export type InternalReadWriteSystemPropertyKeyValue =
      | InternalReadWriteSystemPropertyKeyValueNotarySystemSignedIntentsEnabledProperty
      | InternalReadWriteSystemPropertyKeyValueStateReviewAuthorityProperty
    export type InternalReadWriteSystemPropertyKeyValueNotarySystemSignedIntentsEnabledProperty = {
      value: InternalNotarySystemSignedIntentsEnabledValue
      type: "NotarySystemSignedIntentsEnabledProperty"
    }
    export type InternalReadWriteSystemPropertyKeyValueStateReviewAuthorityProperty = {
      value: InternalStateReviewAuthorityValue
      type: "StateReviewAuthorityProperty"
    }
    export type InternalRecipientTransferParty =
      | InternalRecipientTransferPartyAccount
      | InternalRecipientTransferPartyAddress
    export type InternalRecipientTransferPartyAccount = {
      domainId: string // uuid
      accountId: string // uuid
      address?: string
      addressDetails?: InternalAddressDetails
      type: "Account"
    }
    export type InternalRecipientTransferPartyAddress = {
      address: string
      addressDetails: InternalAddressDetails
      type: "Address"
    }
    export type InternalResolvedEndpoint = {
      endpointId: string // uuid
      domainId: string // uuid
    }
    export type InternalRewrapPending = {
      rewrapSecretMaterialsId: string // uuid
      vaultId: string // uuid
      signedPayload: string
    }
    export type InternalRewrapPrepared = {
      rewrapSecretMaterialsId: string // uuid
      vaultId: string // uuid
      signedPayload: string
    }
    export type InternalRootDomainSetup = {
      id: string // uuid
      alias: string
      lock: InternalIntentLockStatus
      governingStrategy?: InternalGoverningStrategy
      permissions: InternalPermissions
      description?: string
      customProperties: InternalStringsMap
      users: InternalCreateDomainGenesisUser[]
      policies: InternalCreateDomainGenesisPolicy[]
      descendants?: InternalCreateDomainsPayload[]
    }
    export type InternalScriptingEngine = "Javascript_v0"
    export type InternalSenderTransferParty =
      | InternalSenderTransferPartyAccount
      | InternalSenderTransferPartyAddress
    export type InternalSenderTransferPartyAccount = {
      domainId: string // uuid
      accountId: string // uuid
      addresses?: string[]
      addressesDetails?: InternalAddressDetails[]
      type: "Account"
    }
    export type InternalSenderTransferPartyAddress = {
      address: string
      addressDetails: InternalAddressDetails
      type: "Address"
    }
    export type InternalSequencing =
      | InternalSequencingAccountSequence
      | InternalSequencingPlatformManaged
      | InternalSequencingTicket
    export type InternalSequencingAccountSequence = {
      value: number // int64
      type: "AccountSequence"
    }
    export type InternalSequencingPlatformManaged = {
      type: "PlatformManaged"
    }
    export type InternalSequencingTicket = {
      value: number // int64
      type: "Ticket"
    }
    export type InternalService = {
      subject: string // ^[\x20-\x7E]*$
      custodyRoles: string /* [A-Za-z0-9_.:\-]+ */[]
    }
    export type InternalServicePropose = {
      expiryAt: string // date-time
      targetDomainId: string // uuid
      id: string // uuid
      payload: InternalUserIntentPayload
      description?: string
      customProperties: InternalStringsMap
    }
    export type InternalSignedAccountPending = {
      domainId: string // uuid
      accountId: string // uuid
      signedPayload: string
    }
    export type InternalSignedManifestPending = {
      domainId: string // uuid
      manifestId: string // uuid
      signedPayload: string
    }
    export type InternalSignedVaultPending = {
      signedPayload: string
    }
    export type InternalSkipQuarantineScope = "None" | "Domain" | "Instance"
    export type InternalSolanaFeeStrategy = InternalSolanaFeeStrategyPriority
    export type InternalSolanaFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalSolanaMintAccount =
      | InternalSolanaMintAccountDestination
      | InternalSolanaMintAccountTicker
    export type InternalSolanaMintAccountDestination = {
      destination: InternalTransactionDestination
      type: "Destination"
    }
    export type InternalSolanaMintAccountTicker = {
      tickerId: string // uuid
      type: "Ticker"
    }
    export type InternalSolanaOperation =
      | InternalSolanaOperationBurn
      | InternalSolanaOperationCreateNonceAccount
      | InternalSolanaOperationFundAtaAccount
      | InternalSolanaOperationInitializeMint
      | InternalSolanaOperationMintTo
      | InternalSolanaOperationTransfer
      | InternalSolanaOperationTransferToken
    export type InternalSolanaOperationBurn = {
      mintAccount: InternalSolanaMintAccount
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "Burn"
    }
    export type InternalSolanaOperationCreateNonceAccount = {
      createOnAccount: string // uuid
      type: "CreateNonceAccount"
    }
    export type InternalSolanaOperationFundAtaAccount = {
      destination?: InternalTransactionDestination
      mintAccount: InternalSolanaMintAccount
      type: "FundAtaAccount"
    }
    export type InternalSolanaOperationInitializeMint = {
      mintAccount: string // uuid
      decimals: number // int32
      tokenType: InternalSolanaTokenType
      type: "InitializeMint"
    }
    export type InternalSolanaOperationMintTo = {
      destination: InternalTransactionDestination
      mintAccount: InternalSolanaMintAccount
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "MintTo"
    }
    export type InternalSolanaOperationTransfer = {
      outputs: InternalSolanaTransferOutput[]
      type: "Transfer"
    }
    export type InternalSolanaOperationTransferToken = {
      outputs: InternalSolanaTransferOutput[]
      mintAccount: InternalSolanaMintAccount
      type: "TransferToken"
    }
    export type InternalSolanaTickerProperties =
      | InternalSolanaTickerPropertiesNative
      | InternalSolanaTickerPropertiesToken
    export type InternalSolanaTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalSolanaTickerPropertiesToken = {
      mint: string
      tokenType: InternalSolanaTokenType
      type: "Token"
    }
    export type InternalSolanaTokenType = "SPL" | "SPL2022"
    export type InternalSolanaTransferOutput = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
    }
    export type InternalSortOrder = "ASC" | "DESC"
    export type InternalStateReviewAuthorityValue = {
      publicKey: InternalAccountPublicKeyOnly
    }
    export type InternalStellarAsset = {
      code: string
      issuer: string
    }
    export type InternalStellarFeeStrategy =
      | InternalStellarFeeStrategyPriority
      | InternalStellarFeeStrategySpecifiedRate
    export type InternalStellarFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalStellarFeeStrategySpecifiedRate = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      baseFee: string
      type: "SpecifiedRate"
    }
    export type InternalStellarMemo =
      | InternalStellarMemoHash
      | InternalStellarMemoId
      | InternalStellarMemoReturn
      | InternalStellarMemoText
    export type InternalStellarMemoHash = {
      /**
       * Hex encoded stellar hash.
       */
      value: string // ^[A-Fa-f0-9]*$
      type: "Hash"
    }
    export type InternalStellarMemoId = {
      /**
       * This field is a unsigned 64bit integer that can store values in range from 0 to 18446744073709551615.It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Id"
    }
    export type InternalStellarMemoReturn = {
      /**
       * Hex encoded stellar hash.
       */
      value: string // ^[A-Fa-f0-9]*$
      type: "Return"
    }
    export type InternalStellarMemoText = {
      /**
       * String encoded using either ASCII or UTF-8, up to 28-bytes long
       */
      value: string
      type: "Text"
    }
    export type InternalStellarOperation =
      | InternalStellarOperationAccountMerge
      | InternalStellarOperationChangeTrust
      | InternalStellarOperationCreateAccount
      | InternalStellarOperationPayment
      | InternalStellarOperationSetOptions
    export type InternalStellarOperationAccountMerge = {
      destination: InternalTransactionDestination
      type: "AccountMerge"
    }
    export type InternalStellarOperationChangeTrust = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      limit: string
      asset: InternalStellarAsset
      type: "ChangeTrust"
    }
    export type InternalStellarOperationCreateAccount = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      startingBalance: string
      type: "CreateAccount"
    }
    export type InternalStellarOperationPayment = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      asset?: InternalStellarAsset
      type: "Payment"
    }
    export type InternalStellarOperationSetOptions = {
      option: InternalStellarOption
      type: "SetOptions"
    }
    export type InternalStellarOption =
      | InternalStellarOptionOptionHomeDomain
      | InternalStellarOptionOptionSetFlag
    export type InternalStellarOptionFlag = "AuthImmutable"
    export type InternalStellarOptionOptionHomeDomain = {
      homeDomain: string
      type: "OptionHomeDomain"
    }
    export type InternalStellarOptionOptionSetFlag = {
      setFlag: InternalStellarOptionFlag
      type: "OptionSetFlag"
    }
    export type InternalStellarTickerProperties =
      | InternalStellarTickerPropertiesNative
      | InternalStellarTickerPropertiesToken
    export type InternalStellarTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalStellarTickerPropertiesToken = {
      code: string
      issuer: string
      type: "Token"
    }
    export type InternalStringsMap = {
      [name: string]: string
    }
    export type InternalSubmittedTransactionPending = {
      transactionId: string // uuid
    }
    export type InternalSubmittedTransactionPrepared = {
      transactionId: string // uuid
      signedPayload: string
    }
    export type InternalSubmitter = InternalService | InternalUser1
    export type InternalSubstrateBalancesMethod = InternalSubstrateBalancesMethodTransferKeepAlive
    export type InternalSubstrateBalancesMethodTransferKeepAlive = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "TransferKeepAlive"
    }
    export type InternalSubstrateChainType = "RelayChain" | "AssetHub"
    export type InternalSubstrateFeeParameters = InternalSubstrateFeeParametersTransactionPayment
    export type InternalSubstrateFeeParametersTransactionPayment = {
      baseExtrinsic: number // int64
      readWeight: number // int64
      writeWeight: number // int64
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      transactionByteFee: string
      weightToFeePolynomial: string[]
      type: "TransactionPayment"
    }
    export type InternalSubstrateFeeStrategy = InternalSubstrateFeeStrategyPriority
    export type InternalSubstrateFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalSubstrateMethodFeeParameters =
      InternalSubstrateMethodFeeParametersMethodWeight
    export type InternalSubstrateMethodFeeParametersMethodWeight = {
      base: number // int64
      reads: number // int32
      writes: number // int32
      type: "MethodWeight"
    }
    export type InternalSubstrateMethodInfo = {
      name: string
      methodId: number // int32
      feeParameters: InternalSubstrateMethodFeeParameters
    }
    export type InternalSubstratePallet =
      | InternalSubstratePalletBalances
      | InternalSubstratePalletStaking
    export type InternalSubstratePalletBalances = {
      method: InternalSubstrateBalancesMethod
      type: "Balances"
    }
    export type InternalSubstratePalletInfo = {
      name: string
      moduleId: number // int32
      methods: InternalSubstrateMethodInfo[]
    }
    export type InternalSubstratePalletStaking = {
      method: InternalSubstrateStakingMethod
      type: "Staking"
    }
    export type InternalSubstrateRuntimeInfo = {
      transactionVersion: number // int32
      feeParameters: InternalSubstrateFeeParameters
      pallets: InternalSubstratePalletInfo[]
      chainType?: InternalSubstrateChainType
    }
    export type InternalSubstrateStakingMethod =
      | InternalSubstrateStakingMethodBond
      | InternalSubstrateStakingMethodBondExtra
      | InternalSubstrateStakingMethodChill
      | InternalSubstrateStakingMethodNominate
      | InternalSubstrateStakingMethodRebond
      | InternalSubstrateStakingMethodSetController
      | InternalSubstrateStakingMethodSetPayee
      | InternalSubstrateStakingMethodUnbond
      | InternalSubstrateStakingMethodWithdrawUnbonded
    export type InternalSubstrateStakingMethodBond = {
      controller?:
        | InternalTransactionDestinationAccount
        | InternalTransactionDestinationAddress
        | InternalTransactionDestinationEndpoint
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      payee: InternalSubstrateStakingPayee
      type: "Bond"
    }
    export type InternalSubstrateStakingMethodBondExtra = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maxAdditional: string
      type: "BondExtra"
    }
    export type InternalSubstrateStakingMethodChill = {
      type: "Chill"
    }
    export type InternalSubstrateStakingMethodNominate = {
      targets: InternalTransactionDestination[]
      type: "Nominate"
    }
    export type InternalSubstrateStakingMethodRebond = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Rebond"
    }
    export type InternalSubstrateStakingMethodSetController = {
      controller?:
        | InternalTransactionDestinationAccount
        | InternalTransactionDestinationAddress
        | InternalTransactionDestinationEndpoint
      type: "SetController"
    }
    export type InternalSubstrateStakingMethodSetPayee = {
      payee: InternalSubstrateStakingPayee
      type: "SetPayee"
    }
    export type InternalSubstrateStakingMethodUnbond = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Unbond"
    }
    export type InternalSubstrateStakingMethodWithdrawUnbonded = {
      numSlashingSpans: number // int32
      type: "WithdrawUnbonded"
    }
    export type InternalSubstrateStakingPayee =
      | InternalSubstrateStakingPayeeAccount
      | InternalSubstrateStakingPayeeController
      | InternalSubstrateStakingPayeeStaked
      | InternalSubstrateStakingPayeeStash
    export type InternalSubstrateStakingPayeeAccount = {
      destination: InternalTransactionDestination
      type: "Account"
    }
    export type InternalSubstrateStakingPayeeController = {
      type: "Controller"
    }
    export type InternalSubstrateStakingPayeeStaked = {
      type: "Staked"
    }
    export type InternalSubstrateStakingPayeeStash = {
      type: "Stash"
    }
    export type InternalSubstrateTickerProperties = InternalSubstrateTickerPropertiesNative
    export type InternalSubstrateTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalSystemProperty =
      | InternalSystemPropertyNotaryApiKeySystemProperty
      | InternalSystemPropertyNotaryCollectionsKeySystemProperty
      | InternalSystemPropertyNotaryCommunicationKeySystemProperty
      | InternalSystemPropertyNotarySystemSignedIntentsEnabledSystemProperty
      | InternalSystemPropertyNotarySystemSigningKeySystemProperty
      | InternalSystemPropertyStateReviewAuthoritySystemProperty
    export type InternalSystemPropertyId =
      | "NOTARY_COMMUNICATION_KEY"
      | "NOTARY_COLLECTIONS_KEY"
      | "NOTARY_API_KEY"
      | "STATE_REVIEW_AUTHORITY"
      | "NOTARY_SYSTEM_SIGNING_KEY"
      | "NOTARY_SYSTEM_SIGNED_INTENTS_ENABLED"
    export type InternalSystemPropertyNotaryApiKeySystemProperty = {
      id: InternalSystemPropertyId
      value: InternalNotaryApiKeyValue
      metadata: InternalEntityMetadata
    }
    export type InternalSystemPropertyNotaryCollectionsKeySystemProperty = {
      id: InternalSystemPropertyId
      value: InternalNotaryCollectionsKeyValue
      metadata: InternalEntityMetadata
    }
    export type InternalSystemPropertyNotaryCommunicationKeySystemProperty = {
      id: InternalSystemPropertyId
      value: InternalNotaryCommunicationKeyValue
      metadata: InternalEntityMetadata
    }
    export type InternalSystemPropertyNotarySystemSignedIntentsEnabledSystemProperty = {
      id: InternalSystemPropertyId
      value: InternalNotarySystemSignedIntentsEnabledValue
      metadata: InternalEntityMetadata
    }
    export type InternalSystemPropertyNotarySystemSigningKeySystemProperty = {
      id: InternalSystemPropertyId
      value: InternalNotarySystemSigningKeyValue
      metadata: InternalEntityMetadata
    }
    export type InternalSystemPropertySet = {
      id: InternalSystemPropertyId
      type: "SystemPropertySet"
    }
    export type InternalSystemPropertyStateReviewAuthoritySystemProperty = {
      id: InternalSystemPropertyId
      value: InternalStateReviewAuthorityValue
      metadata: InternalEntityMetadata
    }
    export type InternalTezosFeeStrategy = InternalTezosFeeStrategyPriority
    export type InternalTezosFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalTezosOperation =
      | InternalTezosOperationDelegation
      | InternalTezosOperationReveal
      | InternalTezosOperationTransaction
      | InternalTezosOperationUndelegation
    export type InternalTezosOperationDelegation = {
      destination: InternalTransactionDestination
      type: "Delegation"
    }
    export type InternalTezosOperationReveal = {
      type: "Reveal"
    }
    export type InternalTezosOperationTransaction = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      contractParameters?: InternalContractParameters
      type: "Transaction"
    }
    export type InternalTezosOperationUndelegation = {
      type: "Undelegation"
    }
    export type InternalTezosTickerProperties = InternalTezosTickerPropertiesNative
    export type InternalTezosTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalTickerCreated = {
      id: string // uuid
      type: "TickerCreated"
    }
    export type InternalTickerKind = "Native" | "Contract" | "Token"
    export type InternalTickerLedgerDetails =
      | InternalTickerLedgerDetailsAlgorand
      | InternalTickerLedgerDetailsBitcoin
      | InternalTickerLedgerDetailsCardano
      | InternalTickerLedgerDetailsEthereum
      | InternalTickerLedgerDetailsHedera
      | InternalTickerLedgerDetailsSolana
      | InternalTickerLedgerDetailsStellar
      | InternalTickerLedgerDetailsSubstrate
      | InternalTickerLedgerDetailsTezos
      | InternalTickerLedgerDetailsTron
      | InternalTickerLedgerDetailsXRPL
    export type InternalTickerLedgerDetailsAlgorand = {
      properties: InternalAlgorandTickerProperties
      type: "Algorand"
    }
    export type InternalTickerLedgerDetailsBitcoin = {
      properties: InternalBitcoinTickerProperties
      type: "Bitcoin"
    }
    export type InternalTickerLedgerDetailsCardano = {
      properties: InternalCardanoTickerProperties
      type: "Cardano"
    }
    export type InternalTickerLedgerDetailsEthereum = {
      properties: InternalEthereumTickerProperties
      type: "Ethereum"
    }
    export type InternalTickerLedgerDetailsHedera = {
      properties: InternalHederaTickerProperties
      type: "Hedera"
    }
    export type InternalTickerLedgerDetailsSolana = {
      properties: InternalSolanaTickerProperties
      type: "Solana"
    }
    export type InternalTickerLedgerDetailsStellar = {
      properties: InternalStellarTickerProperties
      type: "Stellar"
    }
    export type InternalTickerLedgerDetailsSubstrate = {
      properties: InternalSubstrateTickerProperties
      type: "Substrate"
    }
    export type InternalTickerLedgerDetailsTezos = {
      properties: InternalTezosTickerProperties
      type: "Tezos"
    }
    export type InternalTickerLedgerDetailsTron = {
      properties: InternalTronTickerProperties
      type: "Tron"
    }
    export type InternalTickerLedgerDetailsXRPL = {
      properties: InternalXrplTickerProperties
      type: "XRPL"
    }
    export type InternalTickerToValidate = {
      id: string // uuid
      ledgerId: string
      kind: InternalValidatedTickerKind
      name: string
      decimals?: number // int32
      symbol?: string
      ledgerDetails: InternalTickerLedgerDetails
      lock: InternalIntentLockStatus
      description?: string
      customProperties: InternalStringsMap
    }
    export type InternalTickerUpdated = {
      id: string // uuid
      type: "TickerUpdated"
    }
    export type InternalTokenDestination =
      | InternalTokenDestinationTicker
      | InternalTokenDestinationTokenId
    export type InternalTokenDestinationTicker = {
      tickerId: string // uuid
      type: "Ticker"
    }
    export type InternalTokenDestinationTokenId = {
      /**
       * String consisting Hedera Token Id
       */
      tokenId: string
      type: "TokenId"
    }
    export type InternalTokenOutput =
      | InternalTokenOutputHederaFungibleTokenOutput
      | InternalTokenOutputHederaNonFungibleTokenOutput
    export type InternalTokenOutputHederaFungibleTokenOutput = {
      token: InternalTokenDestination
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "HederaFungibleTokenOutput"
    }
    export type InternalTokenOutputHederaNonFungibleTokenOutput = {
      token: InternalNonFungibleTokenDestination
      destination: InternalTransactionDestination
      type: "HederaNonFungibleTokenOutput"
    }
    export type InternalTransactionCreated = {
      id: string // uuid
      senderReferences: InternalAccountReference[]
      type: "TransactionCreated"
    }
    export type InternalTransactionDestination =
      | InternalTransactionDestinationAccount
      | InternalTransactionDestinationAddress
      | InternalTransactionDestinationEndpoint
    export type InternalTransactionDestinationAccount = {
      accountId: string // uuid
      type: "Account"
    }
    export type InternalTransactionDestinationAddress = {
      address: string
      type: "Address"
    }
    export type InternalTransactionDestinationEndpoint = {
      endpointId: string // uuid
      type: "Endpoint"
    }
    export type InternalTransactionDetected = {
      id: string // uuid
      accountReferences: InternalAccountReference[]
      type: "TransactionDetected"
    }
    export type InternalTransactionOrder = {
      id: string // uuid
      domainId: string // uuid
      accountId: string // uuid
      ledgerId?: string
      parameters: InternalTransactionOrderParameters
      metadata: InternalEntityMetadata
    }
    export type InternalTransactionOrderParameters =
      | InternalTransactionOrderParametersAlgorand
      | InternalTransactionOrderParametersBitcoin
      | InternalTransactionOrderParametersBitcoinRedirect
      | InternalTransactionOrderParametersCardano
      | InternalTransactionOrderParametersEthereum
      | InternalTransactionOrderParametersHedera
      | InternalTransactionOrderParametersSolana
      | InternalTransactionOrderParametersStellar
      | InternalTransactionOrderParametersSubstrate
      | InternalTransactionOrderParametersTezos
      | InternalTransactionOrderParametersTron
      | InternalTransactionOrderParametersXRPL
    export type InternalTransactionOrderParametersAlgorand = {
      operation: InternalAlgorandOperation
      note?: string
      feeStrategy: InternalAlgorandFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Algorand"
    }
    export type InternalTransactionOrderParametersBitcoin = {
      outputs: InternalBitcoinOutputParameters[]
      feeStrategy: InternalBitcoinFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      resourceStrategy?: InternalBitcoinResourceStrategy
      addressForChange?: /* Override default change address strategy to set explicitly PrimaryAddress or GenerateNewAddress. */ InternalAddressForChange
      type: "Bitcoin"
    }
    export type InternalTransactionOrderParametersBitcoinRedirect = {
      transferIds: string /* uuid */[]
      outputs: InternalBitcoinOutputParameters[]
      feeStrategy: InternalBitcoinFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "BitcoinRedirect"
    }
    export type InternalTransactionOrderParametersCardano = {
      operation: InternalCardanoOperation
      feeStrategy: InternalCardanoFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Cardano"
    }
    export type InternalTransactionOrderParametersEthereum = {
      destination?: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      feeStrategy: InternalEthereumFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      data?: string // ^0[xX]([a-fA-F0-9]*)$
      resourceStrategy?: InternalEthereumResourceStrategy
      type: "Ethereum"
    }
    export type InternalTransactionOrderParametersHedera = {
      operation: InternalHederaOperation
      /**
       * String encoded using UTF-8, up to 100-bytes long
       */
      memo?: string
      feeStrategy: InternalHederaFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Hedera"
    }
    export type InternalTransactionOrderParametersSolana = {
      operation: InternalSolanaOperation
      memos: string[]
      feeStrategy: InternalSolanaFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      nonceAccount?: InternalTransactionDestination
      type: "Solana"
    }
    export type InternalTransactionOrderParametersStellar = {
      operation: InternalStellarOperation
      memo?: InternalStellarMemo
      feeStrategy: InternalStellarFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Stellar"
    }
    export type InternalTransactionOrderParametersSubstrate = {
      pallet: InternalSubstratePallet
      feeStrategy: InternalSubstrateFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Substrate"
    }
    export type InternalTransactionOrderParametersTezos = {
      operation: InternalTezosOperation
      feeStrategy: InternalTezosFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Tezos"
    }
    export type InternalTransactionOrderParametersTron = {
      feeStrategy: InternalTronFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      operation: InternalTronOperation
      type: "Tron"
    }
    export type InternalTransactionOrderParametersXRPL = {
      destination?:
        | InternalTransactionDestinationAccount
        | InternalTransactionDestinationAddress
        | InternalTransactionDestinationEndpoint
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount?: string
      feeStrategy: InternalXrplFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      sourceTag?: number // int64
      destinationTag?: number // int64
      memos: InternalXrplMemo[]
      operation?: InternalXrplOperation
      sponsorship?: InternalXrplSponsorshipParams
      type: "XRPL"
    }
    export type InternalTransactionPending = {
      transactionId: string // uuid
    }
    export type InternalTransactionPrepared = {
      transactionId: string // uuid
      signedPayload: string
    }
    export type InternalTransactionUpdated = {
      id: string // uuid
      accountReferences: InternalAccountReference[]
      type: "TransactionUpdated"
    }
    export type InternalTransferKind = "Transfer" | "Fee" | "Recovery"
    export type InternalTransferMetadata =
      | InternalTransferMetadataAlgorand
      | InternalTransferMetadataBitcoin
      | InternalTransferMetadataCardano
      | InternalTransferMetadataEthereum
      | InternalTransferMetadataHedera
      | InternalTransferMetadataSolana
      | InternalTransferMetadataStellar
      | InternalTransferMetadataSubstrate
      | InternalTransferMetadataTezos
      | InternalTransferMetadataTron
      | InternalTransferMetadataXRPL
    export type InternalTransferMetadataAlgorand = {
      type: "Algorand"
    }
    export type InternalTransferMetadataBitcoin = {
      outputIndex?: number // int32
      type: "Bitcoin"
    }
    export type InternalTransferMetadataCardano = {
      type: "Cardano"
    }
    export type InternalTransferMetadataEthereum = {
      type: "Ethereum"
    }
    export type InternalTransferMetadataHedera = {
      type: "Hedera"
    }
    export type InternalTransferMetadataSolana = {
      type: "Solana"
    }
    export type InternalTransferMetadataStellar = {
      type: "Stellar"
    }
    export type InternalTransferMetadataSubstrate = {
      type: "Substrate"
    }
    export type InternalTransferMetadataTezos = {
      type: "Tezos"
    }
    export type InternalTransferMetadataTron = {
      type: "Tron"
    }
    export type InternalTransferMetadataXRPL = {
      sourceTag?: number // int64
      destinationTag?: number // int64
      type: "XRPL"
    }
    export type InternalTransferUpdated = {
      id: string // uuid
      type: "TransferUpdated"
    }
    export type InternalTronFeeStrategy = InternalTronFeeStrategyPriority
    export type InternalTronFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalTronOperation =
      | InternalTronOperationNativeTransfer
      | InternalTronOperationTRC20Transfer
    export type InternalTronOperationNativeTransfer = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "NativeTransfer"
    }
    export type InternalTronOperationTRC20Transfer = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      contractAddress: string
      type: "TRC20Transfer"
    }
    export type InternalTronTickerProperties =
      | InternalTronTickerPropertiesNative
      | InternalTronTickerPropertiesTRC20
    export type InternalTronTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalTronTickerPropertiesTRC20 = {
      contractAddress: string
      type: "TRC20"
    }
    export type InternalTrustedAccount = {
      data: InternalAccount
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalTrustedDomain = {
      data: InternalDomain
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalTrustedEndpoint = {
      data: InternalEndpoint
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalTrustedIntent = {
      data: InternalIntentEntity
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalTrustedManifest = {
      data: InternalManifest
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalTrustedPolicy = {
      data: InternalPolicy
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalTrustedPublicKeyAdded = {
      publicKey: string // base64
      signingPurpose: InternalTrustedPublicKeyPurpose
      type: "TrustedPublicKeyAdded"
    }
    export type InternalTrustedPublicKeyPurpose =
      | "ApiSignatures"
      | "TrustedCollectionSignatures"
      | "MessagingSignatures"
      | "SystemSignatures"
    export type InternalTrustedPublicKeyUpdated = {
      publicKey: string // base64
      signingPurpose: InternalTrustedPublicKeyPurpose
      type: "TrustedPublicKeyUpdated"
    }
    export type InternalTrustedTransactionOrder = {
      data: InternalTransactionOrder
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalTrustedUser = {
      data: InternalUser
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalTrustedUsersCollection = {
      items: InternalTrustedUser[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type InternalTrustedVault = {
      data: InternalVault
      signature: string // base64
      signingKey: string // base64
    }
    export type InternalUser = {
      id: string // uuid
      domainId: string // uuid
      alias: string
      publicKey: string // base64
      roles: string /* [a-z0-9\-]+ */[]
      lock: InternalLockStatus
      metadata: InternalEntityMetadata
      /**
       * Domain-unique `loginId`-`loginProviderId` pairs. Must be specified for login and match pre-configured values.
       */
      loginIds?: InternalLoginId[]
    }
    export type InternalUser1 = {
      reference: InternalUserReference
    }
    export type InternalUserCreated = {
      id: string // uuid
      type: "UserCreated"
    }
    export type InternalUserDifferentPublicKey = {
      userId: string // uuid
      publicKey: string // base64
      domainId: string // uuid
    }
    export type InternalUserIntentPayload =
      | InternalV0AcknowledgeBackup
      | InternalV0AddAccountLedgers
      | InternalV0AddTrustedPublicKeysForMigration
      | InternalV0AttemptTransactionOrderCancellation
      | InternalV0CreateAccount
      | InternalV0CreateBackup
      | InternalV0CreateDomain
      | InternalV0CreateEndpoint
      | InternalV0CreateLedger
      | InternalV0CreatePolicy
      | InternalV0CreateTicker
      | InternalV0CreateTransactionOrder
      | InternalV0CreateTransferOrder
      | InternalV0CreateUser
      | InternalV0CreateVault
      | InternalV0ExecuteExtension
      | InternalV0LockAccount
      | InternalV0LockDomain
      | InternalV0LockEndpoint
      | InternalV0LockPolicy
      | InternalV0LockTicker
      | InternalV0LockUser
      | InternalV0LockVault
      | InternalV0MigrateSilo3AccountBatch
      | InternalV0NotarizeData
      | InternalV0ProvisionElGamalKeyPair
      | InternalV0RegisterTrustedPublicKey
      | InternalV0ReleaseQuarantinedTransfers
      | InternalV0RewrapVaultKeyMaterial
      | InternalV0SetSystemProperty
      | InternalV0SignManifest
      | InternalV0UnlockAccount
      | InternalV0UnlockDomain
      | InternalV0UnlockEndpoint
      | InternalV0UnlockPolicy
      | InternalV0UnlockTicker
      | InternalV0UnlockUser
      | InternalV0UnlockVault
      | InternalV0UpdateAccount
      | InternalV0UpdateDomain
      | InternalV0UpdateDomainPermissions
      | InternalV0UpdateEndpoint
      | InternalV0UpdateLedger
      | InternalV0UpdatePolicy
      | InternalV0UpdateTicker
      | InternalV0UpdateUser
      | InternalV0UpdateVault
      | InternalV0ValidateTickers
    export type InternalUserOperationRejectionCode =
      | "AccountLocked"
      | "AccountNotReady"
      | "DecisionInvalid"
      | "DomainLocked"
      | "TickerLocked"
      | "EndpointLocked"
      | "EntityAlreadyCreated"
      | "EntityRevisionMismatch"
      | "EntityAlreadyUnlocked"
      | "EntityAlreadyLocked"
      | "LockStatusCannotBeChanged"
      | "IntentAlreadyComplete"
      | "IntentAlreadyExists"
      | "IntentMissing"
      | "InvalidParentDomain"
      | "LedgerNotFound"
      | "LedgerNotProvided"
      | "InvalidLedgerParameters"
      | "InvalidSystemPropertyParameters"
      | "MustBeExecutedInCurrentDomain"
      | "MustBeExecutedInParentDomain"
      | "MustBeExecutedInRootDomain"
      | "NoApplicablePoliciesForDomain"
      | "NonUniquePoliciesById"
      | "NonUniqueUsersByAlias"
      | "NonUniqueValidatedTickersByLedgerDetails"
      | "NonUniqueUsersById"
      | "NonUniqueUsersByPublicKey"
      | "NotApplicableForRootDomain"
      | "PolicyRevisionMismatch"
      | "PolicyScriptingExecutionFailed"
      | "PolicyWorkflowFailed"
      | "PublicKeyInvalid"
      | "LoginIdAlreadyAssigned"
      | "ProposerIntentSignatureMismatches"
      | "RequestExpired"
      | "IntentExpired"
      | "StaleIntent"
      | "RequestSubmitterLocked"
      | "RequestSubmitterNotFound"
      | "RequestSubmitterSignatureInvalid"
      | "SystemSignatureInvalid"
      | "SystemSigningKeyNotRegistered"
      | "SystemSigningKeyMismatch"
      | "SystemSignaturesKeyAlreadyRegistered"
      | "SystemSignedProcessingDisabled"
      | "UnsupportedAccountKeyStrategy"
      | "VaultNotFound"
      | "VaultLocked"
      | "VaultHasRandomKeyAccounts"
      | "VaultNotReady"
      | "InvalidDestination"
      | "InvalidTransactionOrderState"
      | "InvalidTransactionOrderParameters"
      | "InvalidTransferOrderParameters"
      | "InvalidEndpointUpdateParameters"
      | "InvalidEndpointCreateParameters"
      | "InvalidManifestContent"
      | "BatchTooLarge"
      | "MigrateSilo3AccountBatchContainsDuplicateDerivationData"
      | "MigrateSilo3AccountBatchContainsDuplicateAccountIds"
      | "MigrateSilo3AccountAlreadyImported"
      | "InvalidTickerLedgerDetails"
      | "DuplicateTickerIdsToValidate"
      | "DuplicateTickerLedgerDatasToValidate"
      | "InvalidEntityId"
      | "MissingLoginIds"
      | "DuplicatedLoginIds"
      | "FeatureFlagDisabled"
      | "InvalidCreateAccountParameters"
      | "InvalidAddAccountLedgersParameters"
      | "CurrentPublicKeyNotMatching"
      | "InvalidTrustedCollectionPublicKeySignature"
      | "InvalidMigrationKeyMaterial"
      | "InvalidEntityType"
      | "DuplicatePublicKey"
      | "UnsupportedTrustedPublicKeyPurpose"
      | "TrustedPublicKeyAlreadyActive"
      | "InvalidVaultParameters"
      | "BackupNotReady"
      | "BackupAcknowledgeDenied"
      | "VaultOperationOnExternalAccount"
      | "ExternalOperationOnVaultAccount"
      | "ValidateTickersPostProcessingFailure"
    export type InternalUserReference = {
      id: string // uuid
      domainId: string // uuid
    }
    export type InternalUserRequestPayload =
      | InternalUserRequestPayloadApprove
      | InternalUserRequestPayloadPropose
      | InternalUserRequestPayloadReject
    export type InternalUserRequestPayloadApprove = {
      author: InternalUserReference
      expiryAt?: string // date-time
      targetDomainId: string // uuid
      intentId: string // uuid
      proposalSignature: string // base64
      approvalReason?: string
      type: "Approve"
    }
    export type InternalUserRequestPayloadPropose = {
      author: InternalUserReference
      expiryAt: string // date-time
      targetDomainId: string // uuid
      id: string // uuid
      payload: InternalUserIntentPayload
      description?: string
      customProperties: InternalStringsMap
      type: "Propose"
    }
    export type InternalUserRequestPayloadReject = {
      author: InternalUserReference
      expiryAt?: string // date-time
      targetDomainId: string // uuid
      intentId: string // uuid
      proposalSignature: string // base64
      rejectReason: string
      type: "Reject"
    }
    export type InternalUserSamePublicKey = {
      domainId: string // uuid
      alias: string
      userId: string // uuid
    }
    export type InternalUserUpdated = {
      id: string // uuid
      type: "UserUpdated"
    }
    export type InternalUsersConflicts = {
      sameAlias: InternalUsersSameAlias[]
      samePublicKey: InternalUsersSamePublicKey[]
      differentPublicKey: InternalUsersDifferentPublicKey[]
    }
    export type InternalUsersDifferentPublicKey = {
      alias: string
      users: InternalUserDifferentPublicKey[]
    }
    export type InternalUsersSameAlias = {
      domainId: string // uuid
      alias: string
      userIds: string /* uuid */[]
    }
    export type InternalUsersSamePublicKey = {
      publicKey: string // base64
      users: InternalUserSamePublicKey[]
    }
    export type InternalV0AcknowledgeBackup = {
      backupId: string // uuid
      type: "v0_AcknowledgeBackup"
    }
    export type InternalV0AddAccountLedgers = {
      reference: InternalEntityIdAndRevision
      ledgerIds?: string[]
      type: "v0_AddAccountLedgers"
    }
    export type InternalV0AddTrustedPublicKeysForMigration = {
      newCollectionSigningPublicKey: string // base64
      newMessageSigningPublicKey: string // base64
      newApiSigningPublicKey: string // base64
      newKeyMaterial: string
      currentCollectionSigningPublicKey: string // base64
      currentCollectionSigningPublicKeySignature: string // base64
      type: "v0_AddTrustedPublicKeysForMigration"
    }
    export type InternalV0AttemptTransactionOrderCancellation = {
      targetTransactionOrderId: string // uuid
      replacementTransactionOrderId: string // uuid
      reason: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "v0_AttemptTransactionOrderCancellation"
    }
    export type InternalV0CreateAccount = {
      id: string // uuid
      alias: string
      providerDetails: InternalV0CreateAccountProviderDetailsPayload
      ledgerId?: string
      ledgerIds?: string[]
      lock: InternalIntentLockStatus
      description?: string
      customProperties: InternalStringsMap
      type: "v0_CreateAccount"
    }
    export type InternalV0CreateAccountProviderDetailsPayload =
      InternalV0CreateAccountProviderDetailsPayloadVault
    export type InternalV0CreateAccountProviderDetailsPayloadVault = {
      vaultId: string // uuid
      keyStrategy: InternalAccountKeyStrategy
      type: "Vault"
    }
    export type InternalV0CreateBackup = {
      id: string // uuid
      parameters: InternalVaultBackupParameters
      description?: string
      customProperties: InternalStringsMap
      type: "v0_CreateBackup"
    }
    export type InternalV0CreateDomain = {
      id: string // uuid
      alias: string
      lock: InternalIntentLockStatus
      governingStrategy?: InternalGoverningStrategy
      permissions: InternalPermissions
      description?: string
      customProperties: InternalStringsMap
      users: InternalCreateDomainGenesisUser[]
      policies: InternalCreateDomainGenesisPolicy[]
      childrenDomainIds?: string /* uuid */[]
      type: "v0_CreateDomain"
    }
    export type InternalV0CreateEndpoint = {
      id: string // uuid
      address: string
      trustScore: number // int32
      ledgerId: string
      parameters?: InternalEndpointLedgerParameters
      alias: string
      lock: InternalIntentLockStatus
      description?: string
      customProperties: InternalStringsMap
      type: "v0_CreateEndpoint"
    }
    export type InternalV0CreateLedger = {
      id: string
      alias: string
      parameters: InternalLedgerParameters
      description?: string
      customProperties: InternalStringsMap
      type: "v0_CreateLedger"
    }
    export type InternalV0CreatePolicy = {
      id: string // uuid
      alias: string
      rank: number // int32
      intentTypes?: InternalIntentType[]
      scope: InternalPolicyScope
      scriptingEngine: InternalScriptingEngine
      condition?: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyCondition
      workflow?: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalWorkflowCondition[]
      lock: InternalIntentLockStatus
      description?: string
      customProperties: InternalStringsMap
      intentOrigin?: InternalIntentOrigin
      type: "v0_CreatePolicy"
    }
    export type InternalV0CreateTicker = {
      ledgerId: string
      kind: InternalTickerKind
      name: string
      decimals?: number // int32
      symbol?: string
      ledgerDetails: InternalTickerLedgerDetails
      type: "v0_CreateTicker"
    }
    export type InternalV0CreateTransactionOrder = {
      id: string // uuid
      accountId: string // uuid
      ledgerId?: string
      parameters: InternalTransactionOrderParameters
      description?: string
      customProperties: InternalStringsMap
      type: "v0_CreateTransactionOrder"
    }
    export type InternalV0CreateTransferOrder = {
      id: string // uuid
      accountId: string // uuid
      tickerId: string // uuid
      outputs: InternalCreateTransferOrderOutput[]
      feeStrategy: InternalFeePriority
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      preferredAddressForChange?: /* Hint for specifically bitcoin ledgers to have the transaction happen with addressForChange PrimaryAddress - so change utxo goes to address \0\0 - aligned with dry-runs - rather than the default generate a new chain-internal address. */ InternalPreferredAddressForChange
      description?: string
      customProperties: InternalStringsMap
      type: "v0_CreateTransferOrder"
    }
    export type InternalV0CreateUser = {
      id: string // uuid
      alias: string
      publicKey: string // base64
      roles: string /* [a-z0-9\-]+ */[]
      lock: InternalIntentLockStatus
      description?: string
      customProperties: InternalStringsMap
      /**
       * Domain-unique `loginId`-`loginProviderId` pairs. Must be specified for login and match pre-configured values.
       */
      loginIds?: InternalLoginId[]
      type: "v0_CreateUser"
    }
    export type InternalV0CreateVault = {
      id: string // uuid
      alias: string
      parameters?: InternalVaultParameters
      publicKey: string // base64
      lock: InternalIntentLockStatus
      description?: string
      customProperties: InternalStringsMap
      type: "v0_CreateVault"
    }
    export type InternalV0ExecuteExtension = {
      payload: {
        [name: string]: {
          [key: string]: any
        }
      }
      type: "v0_ExecuteExtension"
    }
    export type InternalV0LockAccount = {
      reference: InternalEntityIdAndRevision
      type: "v0_LockAccount"
    }
    export type InternalV0LockDomain = {
      reference: InternalEntityIdAndRevision
      type: "v0_LockDomain"
    }
    export type InternalV0LockEndpoint = {
      reference: InternalEntityIdAndRevision
      type: "v0_LockEndpoint"
    }
    export type InternalV0LockPolicy = {
      reference: InternalEntityIdAndRevision
      type: "v0_LockPolicy"
    }
    export type InternalV0LockTicker = {
      reference: InternalEntityIdAndRevision
      type: "v0_LockTicker"
    }
    export type InternalV0LockUser = {
      reference: InternalEntityIdAndRevision
      type: "v0_LockUser"
    }
    export type InternalV0LockVault = {
      reference: InternalEntityIdAndRevision
      type: "v0_LockVault"
    }
    export type InternalV0MigrateSilo3AccountBatch = {
      vaultId: string // uuid
      wasColdSilo: boolean
      wasTestSilo: boolean
      accounts: InternalV3AccountToMigrate[]
      type: "v0_MigrateSilo3AccountBatch"
    }
    export type InternalV0NotarizeData = {
      data: string
      type: "v0_NotarizeData"
    }
    export type InternalV0ProvisionElGamalKeyPair = {
      accountId: string // uuid
      ledgerId: string
      type: "v0_ProvisionElGamalKeyPair"
    }
    export type InternalV0RegisterTrustedPublicKey = {
      publicKey: string // base64
      purpose: InternalTrustedPublicKeyPurpose
      type: "v0_RegisterTrustedPublicKey"
    }
    export type InternalV0ReleaseQuarantinedTransfers = {
      accountId: string // uuid
      transferIds: string /* uuid */[]
      type: "v0_ReleaseQuarantinedTransfers"
    }
    export type InternalV0RewrapVaultKeyMaterial = {
      vaultId: string // uuid
      description?: string
      customProperties: InternalStringsMap
      type: "v0_RewrapVaultKeyMaterial"
    }
    export type InternalV0SetSystemProperty = {
      revision?: number // int64
      value: InternalReadWriteSystemPropertyKeyValue
      type: "v0_SetSystemProperty"
    }
    export type InternalV0SignManifest = {
      id: string // uuid
      accountId: string // uuid
      ledgerId?: string
      content: InternalManifestContent
      description?: string
      customProperties: InternalStringsMap
      type: "v0_SignManifest"
    }
    export type InternalV0UnlockAccount = {
      reference: InternalEntityIdAndRevision
      type: "v0_UnlockAccount"
    }
    export type InternalV0UnlockDomain = {
      reference: InternalEntityIdAndRevision
      type: "v0_UnlockDomain"
    }
    export type InternalV0UnlockEndpoint = {
      reference: InternalEntityIdAndRevision
      type: "v0_UnlockEndpoint"
    }
    export type InternalV0UnlockPolicy = {
      reference: InternalEntityIdAndRevision
      type: "v0_UnlockPolicy"
    }
    export type InternalV0UnlockTicker = {
      reference: InternalEntityIdAndRevision
      type: "v0_UnlockTicker"
    }
    export type InternalV0UnlockUser = {
      reference: InternalEntityIdAndRevision
      type: "v0_UnlockUser"
    }
    export type InternalV0UnlockVault = {
      reference: InternalEntityIdAndRevision
      type: "v0_UnlockVault"
    }
    export type InternalV0UpdateAccount = {
      reference: InternalEntityIdAndRevision
      alias: string
      description?: string
      customProperties: InternalStringsMap
      type: "v0_UpdateAccount"
    }
    export type InternalV0UpdateDomain = {
      reference: InternalEntityIdAndRevision
      alias: string
      description?: string
      customProperties: InternalStringsMap
      type: "v0_UpdateDomain"
    }
    export type InternalV0UpdateDomainPermissions = {
      reference: InternalEntityIdAndRevision
      permissions: InternalPermissions
      type: "v0_UpdateDomainPermissions"
    }
    export type InternalV0UpdateEndpoint = {
      reference: InternalEntityIdAndRevision
      address: string
      trustScore: number // int32
      ledgerId?: string
      parameters?: InternalEndpointLedgerParameters
      alias: string
      description?: string
      customProperties: InternalStringsMap
      type: "v0_UpdateEndpoint"
    }
    export type InternalV0UpdateLedger = {
      reference: InternalEntityStringIdAndRevision
      alias: string
      parameters: InternalLedgerParameters
      description?: string
      customProperties: InternalStringsMap
      type: "v0_UpdateLedger"
    }
    export type InternalV0UpdatePolicy = {
      reference: InternalEntityIdAndRevision
      alias: string
      rank: number // int32
      intentTypes?: InternalIntentType[]
      scope: InternalPolicyScope
      scriptingEngine: InternalScriptingEngine
      condition?: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "expression": "true == true",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == true",
       *       "type": "Expression"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "expression": "true == false",
       *       "type": "Expression"
       *     },
       *     "right": {
       *       "expression": "false == false",
       *       "type": "Expression"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalPolicyCondition
      workflow?: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalWorkflowCondition[]
      description?: string
      customProperties: InternalStringsMap
      intentOrigin?: InternalIntentOrigin
      type: "v0_UpdatePolicy"
    }
    export type InternalV0UpdateTicker = {
      reference: InternalEntityIdAndRevision
      name: string
      decimals?: number // int32
      symbol?: string
      description?: string
      customProperties: InternalStringsMap
      type: "v0_UpdateTicker"
    }
    export type InternalV0UpdateUser = {
      reference: InternalEntityIdAndRevision
      alias: string
      roles: string /* [a-z0-9\-]+ */[]
      description?: string
      customProperties: InternalStringsMap
      /**
       * Domain-unique `loginId`-`loginProviderId` pairs. Must be specified for login and match pre-configured values.
       */
      loginIds?: InternalLoginId[]
      type: "v0_UpdateUser"
    }
    export type InternalV0UpdateVault = {
      reference: InternalEntityIdAndRevision
      alias: string
      parameters?: InternalVaultParameters
      description?: string
      customProperties: InternalStringsMap
      type: "v0_UpdateVault"
    }
    export type InternalV0ValidateTickers = {
      tickers: InternalTickerToValidate[]
      type: "v0_ValidateTickers"
    }
    export type InternalV3AccountToMigrate = {
      id: string // uuid
      alias: string
      description?: string
      ledgerId: string
      lockStatus: InternalIntentLockStatus
      /**
       * example:
       * D37D-04ACF7C4
       */
      publicId: string // ^([A-Fa-f0-9]{4})-([0-7][A-Fa-f0-9]{7})$
      customProperties: InternalStringsMap
    }
    export type InternalValidatedTicker = {
      id: string // uuid
      ledgerId: string
      kind: InternalValidatedTickerKind
      name: string
      decimals?: number // int32
      symbol?: string
      ledgerDetails: InternalTickerLedgerDetails
      lock: InternalLockStatus
      metadata: InternalEntityMetadata
    }
    export type InternalValidatedTickerKind = "Native" | "Contract" | "Token"
    export type InternalVault = {
      id: string // uuid
      publicKey: string // base64
      parameters?: InternalVaultParameters
      supportedDerivations?: InternalVaultDerivation[]
      enabledKeyStrategies?: InternalVaultKeyStrategy[]
      alias: string
      lock: InternalLockStatus
      metadata: InternalEntityMetadata
    }
    export type InternalVaultAccountKeyInformation =
      | InternalVaultAccountKeyInformationRandom
      | InternalVaultAccountKeyInformationVaultDerived
    export type InternalVaultAccountKeyInformationRandom = {
      publicKey?: InternalAccountPublicKey
      type: "Random"
    }
    export type InternalVaultAccountKeyInformationVaultDerived = {
      publicKey?: InternalAccountPublicKey
      derivationPath: string
      type: "VaultDerived"
    }
    export type InternalVaultAccountProviderInformationKey =
      | InternalVaultAccountProviderInformationKeyVaultDerived
      | InternalVaultAccountProviderInformationKeyVaultDerivedNonExtended
      | InternalVaultAccountProviderInformationKeyVaultRandom
    export type InternalVaultAccountProviderInformationKeyId =
      | "SECP256K1_CUSTODY_1"
      | "ED25519_CUSTODY_1"
      | "ED25519_CUSTODY_2"
      | "ED25519_STAKING_1"
    export type InternalVaultAccountProviderInformationKeyVaultDerived = {
      id: InternalVaultAccountProviderInformationKeyId
      derivationPath: string
      publicKey?: InternalAccountPublicKeyExtendedOnly
      type: "VaultDerived"
    }
    export type InternalVaultAccountProviderInformationKeyVaultDerivedNonExtended = {
      id: InternalVaultAccountProviderInformationKeyId
      derivationPath: string
      publicKey: InternalAccountPublicKeyOnly
      type: "VaultDerivedNonExtended"
    }
    export type InternalVaultAccountProviderInformationKeyVaultRandom = {
      id: InternalVaultAccountProviderInformationKeyId
      publicKey?: InternalAccountPublicKey
      type: "VaultRandom"
    }
    export type InternalVaultApiVersion = {
      major: number // int32
      minor: number // int32
      patch: number // int32
    }
    export type InternalVaultBackupParameters =
      | InternalVaultBackupParametersVaultHsm
      | InternalVaultBackupParametersVaultMpc
    export type InternalVaultBackupParametersVaultHsm = {
      vaultId: string // uuid
      type: "VaultHsm"
    }
    export type InternalVaultBackupParametersVaultMpc = {
      vaultId: string // uuid
      type: "VaultMpc"
    }
    export type InternalVaultCreated = {
      id: string // uuid
      type: "VaultCreated"
    }
    export type InternalVaultDerivation = "Slip10" | "SoftBip32" | "None" | "Bip32"
    export type InternalVaultHsmBackupData = {
      acknowledged: boolean
      encryptedSeed: string // base64
      hash: string
    }
    export type InternalVaultKeyMaterialRewrapCompleted = {
      id: string // uuid
      type: "VaultKeyMaterialRewrapCompleted"
    }
    export type InternalVaultKeyMaterialRewrapFailed = {
      id: string // uuid
      type: "VaultKeyMaterialRewrapFailed"
    }
    export type InternalVaultKeyStrategy = "VaultHard" | "VaultSoft" | "Random"
    export type InternalVaultMpcBackupData = {
      acknowledged: boolean
      json: string
      hash: string
    }
    export type InternalVaultParameters = InternalVaultParametersHSM | InternalVaultParametersMPC
    export type InternalVaultParametersHSM = {
      type: "HSM"
    }
    export type InternalVaultParametersMPC = {
      /**
       * 0x prefixed Hex encoded backup encryption key, supported key size between 2048 and 4096 bits.
       */
      backupEncryptionKey?: string // ^0[xX](([a-fA-F0-9][a-fA-F0-9])*)$
      type: "MPC"
    }
    export type InternalVaultProcessingStatus = "Pending" | "Preparing" | "Completed"
    export type InternalVaultUpdated = {
      id: string // uuid
      type: "VaultUpdated"
    }
    /**
     * example:
     * {
     *   "left": {
     *     "left": {
     *       "role": "Admin",
     *       "quorum": 1,
     *       "type": "RoleQuorum"
     *     },
     *     "right": {
     *       "role": "Trader",
     *       "quorum": 2,
     *       "type": "RoleQuorum"
     *     },
     *     "type": "And"
     *   },
     *   "right": {
     *     "left": {
     *       "role": "Customer",
     *       "quorum": 3,
     *       "type": "RoleQuorum"
     *     },
     *     "right": {
     *       "role": "Manager",
     *       "quorum": 4,
     *       "type": "RoleQuorum"
     *     },
     *     "type": "Or"
     *   }
     * }
     */
    export type InternalWorkflowCondition =
      /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      | InternalWorkflowConditionAnd
      | InternalWorkflowConditionOr
      | InternalWorkflowConditionRoleQuorum
    export type InternalWorkflowConditionAnd = {
      left: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalWorkflowCondition
      right: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalWorkflowCondition
      type: "And"
    }
    export type InternalWorkflowConditionOr = {
      left: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalWorkflowCondition
      right: /**
       * example:
       * {
       *   "left": {
       *     "left": {
       *       "role": "Admin",
       *       "quorum": 1,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Trader",
       *       "quorum": 2,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "And"
       *   },
       *   "right": {
       *     "left": {
       *       "role": "Customer",
       *       "quorum": 3,
       *       "type": "RoleQuorum"
       *     },
       *     "right": {
       *       "role": "Manager",
       *       "quorum": 4,
       *       "type": "RoleQuorum"
       *     },
       *     "type": "Or"
       *   }
       * }
       */
      InternalWorkflowCondition
      type: "Or"
    }
    export type InternalWorkflowConditionRoleQuorum = {
      role: string // [a-z0-9\-]+
      quorum: number // int32
      type: "RoleQuorum"
    }
    export type InternalWorkflowProgress = {
      stepProgress: InternalWorkflowStep[]
      policyReference: InternalPolicyReference
    }
    export type InternalWorkflowStep = {
      state: InternalWorkflowStepStatus
      decisions: InternalDecisionPayload[]
    }
    export type InternalWorkflowStepStatus = "Open" | "Approved" | "Failed" | "Rejected"
    export type InternalXrplAccountSetFlag =
      | "asfGlobalFreeze"
      | "asfNoFreeze"
      | "asfRequireAuth"
      | "asfAllowTrustLineClawback"
      | "asfAccountTxnID"
      | "asfDepositAuth"
      | "asfRequireDest"
      | "asfDefaultRipple"
    export type InternalXrplAssetQuantity = {
      currency?: InternalXrplIouCurrency
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
    }
    export type InternalXrplBatchExecutionMode =
      | "AllOrNothing"
      | "OnlyOne"
      | "UntilFailure"
      | "Independent"
    export type InternalXrplClawbackCurrency =
      | InternalXrplClawbackCurrencyCurrency
      | InternalXrplClawbackCurrencyMultiPurposeToken
      | InternalXrplClawbackCurrencyTickerId
    export type InternalXrplClawbackCurrencyCurrency = {
      code: string
      issuer: string
      type: "Currency"
    }
    export type InternalXrplClawbackCurrencyMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MultiPurposeToken"
    }
    export type InternalXrplClawbackCurrencyTickerId = {
      tickerId: string // uuid
      type: "TickerId"
    }
    export type InternalXrplFeeStrategy =
      | InternalXrplFeeStrategyPriority
      | InternalXrplFeeStrategySpecifiedAdditionalFee
    export type InternalXrplFeeStrategyPriority = {
      priority: InternalFeePriority
      type: "Priority"
    }
    export type InternalXrplFeeStrategySpecifiedAdditionalFee = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      drops: string
      type: "SpecifiedAdditionalFee"
    }
    export type InternalXrplIouCurrency =
      | InternalXrplIouCurrencyCurrency
      | InternalXrplIouCurrencyTickerId
    export type InternalXrplIouCurrencyCurrency = {
      code: string
      issuer: string
      type: "Currency"
    }
    export type InternalXrplIouCurrencyTickerId = {
      tickerId: string // uuid
      type: "TickerId"
    }
    export type InternalXrplLimitAmount = {
      currency: InternalXrplIouCurrency
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
    }
    export type InternalXrplMPTokenAuthorizeFlag = "tfMPTUnauthorize"
    export type InternalXrplMPTokenIdentifier =
      | InternalXrplMPTokenIdentifierMPTokenIssuanceId
      | InternalXrplMPTokenIdentifierTickerId
    export type InternalXrplMPTokenIdentifierMPTokenIssuanceId = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MPTokenIssuanceId"
    }
    export type InternalXrplMPTokenIdentifierTickerId = {
      tickerId: string // uuid
      type: "TickerId"
    }
    export type InternalXrplMPTokenIssuanceCreateFlag =
      | "tfMPTRequireAuth"
      | "tfMPTCanClawback"
      | "tfMPTCanTransfer"
      | "tfMPTCanEscrow"
      | "tfMPTCanLock"
      | "tfMPTCanTrade"
      | "tfMPTCanConfidentialAmount"
    export type InternalXrplMPTokenIssuanceMutableFlag = "MPTSetCanConfidentialAmount"
    export type InternalXrplMPTokenIssuanceSetFlag = "tfMPTLock" | "tfMPTUnlock"
    export type InternalXrplMemo = {
      /**
       * Hex encoded string.
       */
      memoData?: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string. The encoded string must only characters defined in RFC 3986 URLs
       */
      memoFormat?: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string. The encoded string must only characters defined in RFC 3986 URLs
       */
      memoType?: string // ^[A-Fa-f0-9]*$
    }
    export type InternalXrplOfferCreateFlag = "tfImmediateOrCancel" | "tfFillOrKill" | "tfSell"
    export type InternalXrplOperation =
      | InternalXrplOperationAccountSet
      | InternalXrplOperationBatch
      | InternalXrplOperationClawback
      | InternalXrplOperationConfidentialMPTClawback
      | InternalXrplOperationConfidentialMPTConvert
      | InternalXrplOperationConfidentialMPTConvertBack
      | InternalXrplOperationConfidentialMPTMergeInbox
      | InternalXrplOperationConfidentialMPTSend
      | InternalXrplOperationDepositPreauth
      | InternalXrplOperationEscrowFinish
      | InternalXrplOperationMPTokenAuthorize
      | InternalXrplOperationMPTokenIssuanceCreate
      | InternalXrplOperationMPTokenIssuanceDestroy
      | InternalXrplOperationMPTokenIssuanceSet
      | InternalXrplOperationOfferCreate
      | InternalXrplOperationPayment
      | InternalXrplOperationSponsorshipSetAsSponsee
      | InternalXrplOperationSponsorshipSetAsSponsor
      | InternalXrplOperationTicketCreate
      | InternalXrplOperationTrustSet
    export type InternalXrplOperationAccountSet = {
      setFlag?: InternalXrplAccountSetFlag
      clearFlag?: InternalXrplAccountSetFlag
      transferRate?: number // int32
      type: "AccountSet"
    }
    export type InternalXrplOperationBatch = {
      executionMode: InternalXrplBatchExecutionMode
      entries: InternalBatchEntry[]
      batchSigners: InternalBatchSigner[]
      sequencing: InternalSequencing
      lastLedgerSequence?: number // int64
      type: "Batch"
    }
    export type InternalXrplOperationClawback = {
      currency: InternalXrplClawbackCurrency
      holder: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Clawback"
    }
    export type InternalXrplOperationConfidentialMPTClawback = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      holder: InternalTransactionDestination
      cryptographicFields?: InternalCmptCryptographicFields
      type: "ConfidentialMPTClawback"
    }
    export type InternalXrplOperationConfidentialMPTConvert = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "ConfidentialMPTConvert"
    }
    export type InternalXrplOperationConfidentialMPTConvertBack = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "ConfidentialMPTConvertBack"
    }
    export type InternalXrplOperationConfidentialMPTMergeInbox = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      type: "ConfidentialMPTMergeInbox"
    }
    export type InternalXrplOperationConfidentialMPTSend = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount?: string
      /**
       * Hex encoded string.
       */
      senderEncryptedBalance?: string // ^[A-Fa-f0-9]*$
      senderEncryptedBalanceVersion?: number // int64
      cryptographicFields?: InternalCmptCryptographicFields
      type: "ConfidentialMPTSend"
    }
    export type InternalXrplOperationDepositPreauth = {
      authorize?: InternalTransactionDestination
      unauthorize?: InternalTransactionDestination
      type: "DepositPreauth"
    }
    export type InternalXrplOperationEscrowFinish = {
      owner: InternalTransactionDestination
      offerSequence: number // int64
      /**
       * Hex encoded string.
       */
      condition?: string // ^[A-Fa-f0-9]*$
      credentialIds?: string /* ^[A-Fa-f0-9]*$ */[]
      /**
       * Hex encoded string.
       */
      fulfillment?: string // ^[A-Fa-f0-9]*$
      type: "EscrowFinish"
    }
    export type InternalXrplOperationMPTokenAuthorize = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      flags: InternalXrplMPTokenAuthorizeFlag[]
      holder?: InternalTransactionDestination
      type: "MPTokenAuthorize"
    }
    export type InternalXrplOperationMPTokenIssuanceCreate = {
      flags: InternalXrplMPTokenIssuanceCreateFlag[]
      assetScale?: number // int32
      /**
       * Transfer fee for MultiPurposeToken, must be from 0 to 50000
       */
      transferFee?: number // int32
      /**
       * This field is a unsigned 64bit integer that can store values in range from 0 to 18446744073709551615.It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumAmount?: string
      metadata?: InternalMPTokenIssuanceMetadata
      type: "MPTokenIssuanceCreate"
    }
    export type InternalXrplOperationMPTokenIssuanceDestroy = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      type: "MPTokenIssuanceDestroy"
    }
    export type InternalXrplOperationMPTokenIssuanceSet = {
      tokenIdentifier: InternalXrplMPTokenIdentifier
      holder?: InternalTransactionDestination
      flags: InternalXrplMPTokenIssuanceSetFlag[]
      issuerEncryptionKey?: string
      auditorEncryptionKey?: string
      mutableFlags: InternalXrplMPTokenIssuanceMutableFlag[]
      type: "MPTokenIssuanceSet"
    }
    export type InternalXrplOperationOfferCreate = {
      flags: InternalXrplOfferCreateFlag[]
      takerGets: InternalXrplAssetQuantity
      takerPays: InternalXrplAssetQuantity
      type: "OfferCreate"
    }
    export type InternalXrplOperationPayment = {
      destination: InternalTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      destinationTag?: number // int64
      currency?: InternalXrplPaymentCurrency
      flags?: InternalXrplPaymentFlag[]
      type: "Payment"
    }
    export type InternalXrplOperationSponsorshipSetAsSponsee = {
      sponsor: InternalTransactionDestination
      type: "SponsorshipSetAsSponsee"
    }
    export type InternalXrplOperationSponsorshipSetAsSponsor = {
      sponsee: InternalTransactionDestination
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      feeAmountDelta?: string
      remainingOwnerCountDelta?: number // int32
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maxFee?: string
      flags: InternalXrplSponsorshipSetFlag[]
      type: "SponsorshipSetAsSponsor"
    }
    export type InternalXrplOperationTicketCreate = {
      /**
       * Number of tickets to create, must be from 1 to 250
       */
      ticketCount: number // int32
      type: "TicketCreate"
    }
    export type InternalXrplOperationTrustSet = {
      flags: InternalXrplTrustSetFlag[]
      limitAmount: InternalXrplLimitAmount
      enableRippling?: boolean
      type: "TrustSet"
    }
    export type InternalXrplPaymentCurrency =
      | InternalXrplPaymentCurrencyCurrency
      | InternalXrplPaymentCurrencyMultiPurposeToken
      | InternalXrplPaymentCurrencyTickerId
    export type InternalXrplPaymentCurrencyCurrency = {
      code: string
      issuer: string
      type: "Currency"
    }
    export type InternalXrplPaymentCurrencyMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MultiPurposeToken"
    }
    export type InternalXrplPaymentCurrencyTickerId = {
      tickerId: string // uuid
      type: "TickerId"
    }
    export type InternalXrplPaymentFlag = "tfSponsorCreatedAccount"
    /**
     * spfSponsorFee sponsors the transaction fee, spfSponsorReserve the owner reserve. spfSponsorReserve is rejected on transaction types for which the ledger does not allow reserve sponsorship (e.g. OfferCreate, TicketCreate, ConfidentialMPT operations)
     */
    export type InternalXrplSponsorFlag = "spfSponsorFee" | "spfSponsorReserve"
    export type InternalXrplSponsorshipParams = {
      sponsor: InternalTransactionDestination
      flags: /* spfSponsorFee sponsors the transaction fee, spfSponsorReserve the owner reserve. spfSponsorReserve is rejected on transaction types for which the ledger does not allow reserve sponsorship (e.g. OfferCreate, TicketCreate, ConfidentialMPT operations) */ InternalXrplSponsorFlag[]
    }
    export type InternalXrplSponsorshipSetFlag =
      | "tfRequireSignForFee"
      | "tfClearRequireSignForFee"
      | "tfRequireSignForReserve"
      | "tfClearRequireSignForReserve"
      | "tfDeleteObject"
    export type InternalXrplTickerProperties =
      | InternalXrplTickerPropertiesConfidentialMultiPurposeToken
      | InternalXrplTickerPropertiesFungibleToken
      | InternalXrplTickerPropertiesMultiPurposeToken
      | InternalXrplTickerPropertiesNative
    export type InternalXrplTickerPropertiesConfidentialMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "ConfidentialMultiPurposeToken"
    }
    export type InternalXrplTickerPropertiesFungibleToken = {
      currencyCode: string
      issuer: string
      type: "FungibleToken"
    }
    export type InternalXrplTickerPropertiesMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MultiPurposeToken"
    }
    export type InternalXrplTickerPropertiesNative = {
      type: "Native"
    }
    export type InternalXrplTrustSetFlag = "tfSetFreeze" | "tfClearFreeze" | "tfSetfAuth"
    export type NotificationEntityToSign = {
      entity: {
        [key: string]: any
      }
      hash: string
    }
    export type NotificationExtendedEntityToSign = {
      intentContext: {
        [key: string]: any
      }
      entity: {
        [key: string]: any
      }
      hash: string
    }
    export type NotificationRegisterMobile = {
      email: string
      pushToken: string
      nativeAppVersion: string
    }
    export type NotificationResponseSignature = {
      hash: string
      signature: string
    }
    export type NotificationSecuredRegisterMobile = {
      nonce: string
      email: string
      pushToken: string
      nativeAppVersion: string
      publicKey: string
      signature: string
    }
    export type NotificationSignEntity = {
      email: string
      hash: string
      signature: string
    }
    export type NotificationSignWeb = {
      email: string
      entity: {
        [key: string]: any
      }
      hash: string
    }
    export type NotificationUnregisterDevice = {
      pushToken: string
    }
    export type Web3ConnectorChangeAccount = {
      to: string
      ledgerId?: string
    }
    export type Web3ConnectorConnectAccount = {
      uri: string
      accountId: string
      ledgerId?: string
    }
    export type Web3ConnectorSession = {
      id: string
      description: string
      url: string
      icons: string[]
      name: string
      isConnected: boolean
      connectedOn?: string // date-time
      connectedAccountIds: string[]
      ledgerId: string
      lastActivity: string // date-time
    }
    export type Web3ConnectorSessionApproval = {
      approve: boolean
    }
    export type Web3ConnectorSessionEvent = {
      sessionId: string
      date: string // date-time
      name: string
      handled: boolean
      params: string
    }
  }
}
export declare namespace Paths {
  namespace DeleteDisconnect {
    namespace Parameters {
      export type DomainId = string
      export type SessionId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      sessionId: Parameters.SessionId
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace GetAllEvents {
    namespace Parameters {
      export type Limit = number // int32
      export type SortBy = "sequenceNumber"
      export type SortOrder = Components.Schemas.InternalSortOrder
      export type StartingAfter = string // uuid
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.InternalEventsCollection
      export type $400 = string
      export type $401 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetCbInDecryptionStatus {
    namespace Parameters {
      export type RequestId = string // uuid
    }
    export type PathParameters = {
      requestId: Parameters.RequestId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.InternalApiCbInDecryptionStatusResponse
      export type $400 = string
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetConnectedSession {
    namespace Parameters {
      export type AccountId = string
      export type ConnectedAccountIds = string[]
      export type ConnectedOnGt = string // date-time
      export type ConnectedOnLt = string // date-time
      export type DAppName = string
      export type DomainId = string
      export type LedgerId = string
      export type Name = string
      export type SortBy = "name" | "lastActivity"
      export type SortOrder = "ASC" | "DESC"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
    }
    export type QueryParameters = {
      accountId?: Parameters.AccountId
      ledgerId?: Parameters.LedgerId
      dAppName?: Parameters.DAppName
      name?: Parameters.Name
      connectedAccountIds?: Parameters.ConnectedAccountIds
      "connectedOn.lt"?: Parameters.ConnectedOnLt /* date-time */
      "connectedOn.gt"?: Parameters.ConnectedOnGt /* date-time */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.Web3ConnectorSession[]
    }
  }
  namespace GetCurrentVault {
    namespace Parameters {
      export type VaultApiVersion = string
    }
    export type QueryParameters = {
      vaultApiVersion?: Parameters.VaultApiVersion
    }
    namespace Responses {
      export type $200 = Components.Schemas.InternalCurrentVault
      export type $400 = string
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetDAppDetails {
    namespace Parameters {
      export type DomainId = string
      export type SessionId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      sessionId: Parameters.SessionId
    }
    namespace Responses {
      export type $200 = Components.Schemas.Web3ConnectorSession
      export interface $404 {}
    }
  }
  namespace GetExampleContextV0 {
    namespace Responses {
      export type $200 = Components.Schemas.InternalEvaluationContext
    }
  }
  namespace GetPendingAccounts {
    namespace Responses {
      export type $200 = Components.Schemas.InternalAccountPending[]
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetPendingBackups {
    namespace Responses {
      export type $200 = Components.Schemas.InternalBackupPending[]
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetPendingDecryptCbs {
    namespace Responses {
      export type $200 = Components.Schemas.InternalDecryptCbsPending[]
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetPendingManifests {
    namespace Responses {
      export type $200 = Components.Schemas.InternalManifestPending[]
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetPendingParametersComputes {
    namespace Responses {
      export type $200 = Components.Schemas.InternalParametersComputePending[]
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetPendingRewraps {
    namespace Responses {
      export type $200 = Components.Schemas.InternalRewrapPending[]
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetPendingTransactions {
    namespace Responses {
      export type $200 = Components.Schemas.InternalTransactionPending[]
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetPreparedTransactions {
    namespace Responses {
      export type $200 = Components.Schemas.InternalTransactionPrepared[]
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetSessionEvents {
    namespace Parameters {
      export type DomainId = string
      export type SessionId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      sessionId: Parameters.SessionId
    }
    namespace Responses {
      export type $200 = Components.Schemas.Web3ConnectorSessionEvent[]
    }
  }
  namespace GetTransactionBlocker {
    namespace Parameters {
      export type TransactionId = string // uuid
    }
    export type PathParameters = {
      transactionId: Parameters.TransactionId /* uuid */
    }
    namespace Responses {
      export type $200 = string // uuid
      export type $400 = string
      export type $401 = Components.Schemas.InternalErrorMessage
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetUsers {
    namespace Parameters {
      export type Alias = string
      export type LoginId = string
      export type LoginProviderId = string
      export type PublicKey = string
    }
    export type QueryParameters = {
      alias?: Parameters.Alias
      publicKey?: Parameters.PublicKey
      loginId?: Parameters.LoginId
      loginProviderId?: Parameters.LoginProviderId
    }
    namespace Responses {
      export type $200 = Components.Schemas.InternalTrustedUsersCollection
      export type $400 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace GetUsersConflicts {
    namespace Responses {
      export type $200 = Components.Schemas.InternalUsersConflicts
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace InitiateCbInDecryption {
    export type RequestBody = Components.Schemas.InternalApiInitiateCbInDecryptionRequest
    namespace Responses {
      export type $202 = Components.Schemas.InternalApiInitiateCbInDecryptionResponse
      export type $400 = string
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace IntentContext {
    export type RequestBody = Components.Schemas.InternalUserRequestPayload
    namespace Responses {
      export type $200 = Components.Schemas.InternalIntentContextResponse
      export type $400 = string
      export type $401 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace InternalV1MeSettingsNotifications {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
      }
      export type QueryParameters = {
        domainId?: Parameters.DomainId /* uuid */
      }
      namespace Responses {
        export type $200 =
          Components.Schemas.InternalCoreExtensionsUserSubscribedNotificationSourceResponse[]
      }
    }
    namespace Post {
      export type RequestBody =
        Components.Schemas.InternalCoreExtensionsUserNotificationPreferencesUpdateRequest
      namespace Responses {
        export type $200 =
          Components.Schemas.InternalCoreExtensionsUserSubscribedNotificationSourceResponse
      }
    }
  }
  namespace InternalV1MeSettingsNotificationsAvailable {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
      }
      export type QueryParameters = {
        domainId?: Parameters.DomainId /* uuid */
      }
      namespace Responses {
        export type $200 =
          Components.Schemas.InternalCoreExtensionsUserAvailableNotificationSourceResponse[]
      }
    }
  }
  namespace InternalV1SystemInformation {
    namespace Get {
      namespace Responses {
        export type $200 = Components.Schemas.InternalCoreExtensionsSystemInformation
      }
    }
  }
  namespace NotificationControllerDeleteEntity {
    namespace Parameters {
      export type Hash = string // [^\/#\?]+?
    }
    export type PathParameters = {
      hash: Parameters.Hash /* [^\/#\?]+? */
    }
    namespace Responses {
      export type $200 = Components.Schemas.NotificationEntityToSign
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerGetEntities {
    namespace Parameters {
      export type Email = string
    }
    export type QueryParameters = {
      email?: Parameters.Email
    }
    namespace Responses {
      export type $200 = Components.Schemas.NotificationEntityToSign
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerGetEntity {
    namespace Parameters {
      export type Hash = string // [^\/#\?]+?
    }
    export type PathParameters = {
      hash: Parameters.Hash /* [^\/#\?]+? */
    }
    namespace Responses {
      export type $200 = Components.Schemas.NotificationEntityToSign
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerGetNonce {
    namespace Parameters {
      export type Email = string
      export type PublicKey = string
    }
    export type QueryParameters = {
      email?: Parameters.Email
      publicKey?: Parameters.PublicKey
    }
    namespace Responses {
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerGetSignedEntity {
    namespace Parameters {
      export type Hash = string // [^\/#\?]+?
    }
    export type PathParameters = {
      hash: Parameters.Hash /* [^\/#\?]+? */
    }
    namespace Responses {
      export type $200 = Components.Schemas.NotificationResponseSignature
      export interface $400 {}
      export interface $404 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerRegisterMobile {
    export type RequestBody = Components.Schemas.NotificationRegisterMobile
    namespace Responses {
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerRegisterWebClient {
    namespace Parameters {
      export type Email = string
    }
    export type QueryParameters = {
      email?: Parameters.Email
    }
    namespace Responses {
      export interface $202 {}
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerSecuredRegisterMobile {
    export type RequestBody = Components.Schemas.NotificationSecuredRegisterMobile
    namespace Responses {
      export interface $400 {}
      export interface $401 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerSendSignatureToWeb {
    export type RequestBody = Components.Schemas.NotificationSignEntity
    namespace Responses {
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerSignWeb {
    export type RequestBody = Components.Schemas.NotificationSignWeb
    namespace Responses {
      export interface $202 {}
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace NotificationControllerUnregisterMobile {
    export type RequestBody = Components.Schemas.NotificationUnregisterDevice
    namespace Responses {
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace PostApproveSession {
    namespace Parameters {
      export type DomainId = string
      export type SessionId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      sessionId: Parameters.SessionId
    }
    export type RequestBody = Components.Schemas.Web3ConnectorSessionApproval
    namespace Responses {
      export interface $204 {}
      export interface $400 {}
      export interface $408 {}
    }
  }
  namespace PostChangeAccount {
    namespace Parameters {
      export type DomainId = string
      export type SessionId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      sessionId: Parameters.SessionId
    }
    export type RequestBody = Components.Schemas.Web3ConnectorChangeAccount
    namespace Responses {
      export interface $400 {}
    }
  }
  namespace PostConnect {
    namespace Parameters {
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
    }
    export type RequestBody = Components.Schemas.Web3ConnectorConnectAccount
    namespace Responses {
      export type $201 = Components.Schemas.Web3ConnectorSession
      export interface $400 {}
      export interface $408 {}
    }
  }
  namespace PostDecryptCbsResponse {
    export type RequestBody = Components.Schemas.InternalDecryptCbsPrepared
    namespace Responses {
      export interface $200 {}
      export type $400 = string
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostParametersComputeResponse {
    export type RequestBody = Components.Schemas.InternalParametersComputePrepared
    namespace Responses {
      export interface $200 {}
      export type $400 = string
      export type Default = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostPendingAccount {
    export type RequestBody = Components.Schemas.InternalSignedAccountPending
    namespace Responses {
      export interface $200 {}
      export type $400 = Components.Schemas.InternalErrorMessage
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostPendingManifest {
    export type RequestBody = Components.Schemas.InternalSignedManifestPending
    namespace Responses {
      export interface $200 {}
      export type $400 = Components.Schemas.InternalErrorMessage
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostPendingTransaction {
    export type RequestBody = Components.Schemas.InternalSubmittedTransactionPending
    namespace Responses {
      export interface $200 {}
      export type $400 = Components.Schemas.InternalErrorMessage
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostPendingVault {
    namespace Parameters {
      export type VaultApiVersion = string
    }
    export type QueryParameters = {
      vaultApiVersion?: Parameters.VaultApiVersion
    }
    export type RequestBody = Components.Schemas.InternalSignedVaultPending
    namespace Responses {
      export interface $200 {}
      export type $400 = Components.Schemas.InternalErrorMessage
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostPreparedBackup {
    export type RequestBody = Components.Schemas.InternalBackupPrepared
    namespace Responses {
      export interface $200 {}
      export type $400 = Components.Schemas.InternalErrorMessage
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostPreparedRewrap {
    export type RequestBody = Components.Schemas.InternalRewrapPrepared
    namespace Responses {
      export interface $200 {}
      export type $400 = string
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostPreparedTransaction {
    export type RequestBody = Components.Schemas.InternalSubmittedTransactionPrepared
    namespace Responses {
      export interface $200 {}
      export type $400 = Components.Schemas.InternalErrorMessage
      export type $404 = Components.Schemas.InternalErrorMessage
    }
  }
  namespace PostTransactionInterruption {
    export type RequestBody = Components.Schemas.InternalAttemptInterruptTransaction
    namespace Responses {
      export interface $200 {}
      export type $400 = Components.Schemas.InternalErrorMessage
      export type $404 = Components.Schemas.InternalErrorMessage
      export type $409 = Components.Schemas.InternalErrorMessage
    }
  }
}

export interface components {
  schemas: {
    Internal_Account: Components.Schemas.InternalAccount
    Internal_AccountCreated: Components.Schemas.InternalAccountCreated
    Internal_AccountKeyStrategy: Components.Schemas.InternalAccountKeyStrategy
    Internal_AccountPending: Components.Schemas.InternalAccountPending
    Internal_AccountProviderInformation: Components.Schemas.InternalAccountProviderInformation
    Internal_AccountProviderInformation_Vault: Components.Schemas.InternalAccountProviderInformationVault
    Internal_AccountPublicKey: Components.Schemas.InternalAccountPublicKey
    Internal_AccountPublicKeyExtendedOnly: Components.Schemas.InternalAccountPublicKeyExtendedOnly
    Internal_AccountPublicKeyExtendedOnly_ExtendedPublicKey: Components.Schemas.InternalAccountPublicKeyExtendedOnlyExtendedPublicKey
    Internal_AccountPublicKeyOnly: Components.Schemas.InternalAccountPublicKeyOnly
    Internal_AccountPublicKeyOnly_PublicKey: Components.Schemas.InternalAccountPublicKeyOnlyPublicKey
    Internal_AccountPublicKey_ExtendedPublicKey: Components.Schemas.InternalAccountPublicKeyExtendedPublicKey
    Internal_AccountPublicKey_PublicKey: Components.Schemas.InternalAccountPublicKeyPublicKey
    Internal_AccountReference: Components.Schemas.InternalAccountReference
    Internal_AccountUpdated: Components.Schemas.InternalAccountUpdated
    Internal_AddressCreated: Components.Schemas.InternalAddressCreated
    Internal_AddressDetails: Components.Schemas.InternalAddressDetails
    Internal_AddressForChange: Components.Schemas.InternalAddressForChange
    Internal_AlgorandFeeStrategy: Components.Schemas.InternalAlgorandFeeStrategy
    Internal_AlgorandFeeStrategy_Priority: Components.Schemas.InternalAlgorandFeeStrategyPriority
    Internal_AlgorandOperation: Components.Schemas.InternalAlgorandOperation
    Internal_AlgorandOperation_Payment: Components.Schemas.InternalAlgorandOperationPayment
    Internal_AlgorandTickerProperties: Components.Schemas.InternalAlgorandTickerProperties
    Internal_AlgorandTickerProperties_Native: Components.Schemas.InternalAlgorandTickerPropertiesNative
    Internal_ApiCbInDecryptionStatusResponse: Components.Schemas.InternalApiCbInDecryptionStatusResponse
    Internal_ApiInitiateCbInDecryptionRequest: Components.Schemas.InternalApiInitiateCbInDecryptionRequest
    Internal_ApiInitiateCbInDecryptionResponse: Components.Schemas.InternalApiInitiateCbInDecryptionResponse
    Internal_ApiTicker: Components.Schemas.InternalApiTicker
    Internal_ApiTickerData: Components.Schemas.InternalApiTickerData
    Internal_ApiTransfer: Components.Schemas.InternalApiTransfer
    Internal_ApprovalDecision: Components.Schemas.InternalApprovalDecision
    Internal_AttemptInterruptTransaction: Components.Schemas.InternalAttemptInterruptTransaction
    Internal_Backup: Components.Schemas.InternalBackup
    Internal_BackupCreated: Components.Schemas.InternalBackupCreated
    Internal_BackupData: Components.Schemas.InternalBackupData
    Internal_BackupData_VaultHsm: Components.Schemas.InternalBackupDataVaultHsm
    Internal_BackupData_VaultMpc: Components.Schemas.InternalBackupDataVaultMpc
    Internal_BackupPending: Components.Schemas.InternalBackupPending
    Internal_BackupPrepared: Components.Schemas.InternalBackupPrepared
    Internal_BackupUpdated: Components.Schemas.InternalBackupUpdated
    Internal_BalancesUpdated: Components.Schemas.InternalBalancesUpdated
    Internal_BatchEntry: Components.Schemas.InternalBatchEntry
    Internal_BatchEntry_ParticipantOperation: Components.Schemas.InternalBatchEntryParticipantOperation
    Internal_BatchEntry_SubmitterOperation: Components.Schemas.InternalBatchEntrySubmitterOperation
    Internal_BatchInnerOperation: Components.Schemas.InternalBatchInnerOperation
    Internal_BatchInnerOperation_AccountSet: Components.Schemas.InternalBatchInnerOperationAccountSet
    Internal_BatchInnerOperation_Clawback: Components.Schemas.InternalBatchInnerOperationClawback
    Internal_BatchInnerOperation_ConfidentialMPTConvert: Components.Schemas.InternalBatchInnerOperationConfidentialMPTConvert
    Internal_BatchInnerOperation_ConfidentialMPTConvertBack: Components.Schemas.InternalBatchInnerOperationConfidentialMPTConvertBack
    Internal_BatchInnerOperation_ConfidentialMPTMergeInbox: Components.Schemas.InternalBatchInnerOperationConfidentialMPTMergeInbox
    Internal_BatchInnerOperation_ConfidentialMPTSend: Components.Schemas.InternalBatchInnerOperationConfidentialMPTSend
    Internal_BatchInnerOperation_DepositPreauth: Components.Schemas.InternalBatchInnerOperationDepositPreauth
    Internal_BatchInnerOperation_EscrowFinish: Components.Schemas.InternalBatchInnerOperationEscrowFinish
    Internal_BatchInnerOperation_MPTokenAuthorize: Components.Schemas.InternalBatchInnerOperationMPTokenAuthorize
    Internal_BatchInnerOperation_MPTokenIssuanceCreate: Components.Schemas.InternalBatchInnerOperationMPTokenIssuanceCreate
    Internal_BatchInnerOperation_MPTokenIssuanceDestroy: Components.Schemas.InternalBatchInnerOperationMPTokenIssuanceDestroy
    Internal_BatchInnerOperation_MPTokenIssuanceSet: Components.Schemas.InternalBatchInnerOperationMPTokenIssuanceSet
    Internal_BatchInnerOperation_OfferCreate: Components.Schemas.InternalBatchInnerOperationOfferCreate
    Internal_BatchInnerOperation_Payment: Components.Schemas.InternalBatchInnerOperationPayment
    Internal_BatchInnerOperation_TicketCreate: Components.Schemas.InternalBatchInnerOperationTicketCreate
    Internal_BatchInnerOperation_TrustSet: Components.Schemas.InternalBatchInnerOperationTrustSet
    Internal_BatchSigner: Components.Schemas.InternalBatchSigner
    Internal_BitcoinFeeStrategy: Components.Schemas.InternalBitcoinFeeStrategy
    Internal_BitcoinFeeStrategy_Priority: Components.Schemas.InternalBitcoinFeeStrategyPriority
    Internal_BitcoinFeeStrategy_SpecifiedRate: Components.Schemas.InternalBitcoinFeeStrategySpecifiedRate
    Internal_BitcoinLikeVaultLedgerIdentifier: Components.Schemas.InternalBitcoinLikeVaultLedgerIdentifier
    Internal_BitcoinOutputParameters: Components.Schemas.InternalBitcoinOutputParameters
    Internal_BitcoinResourceStrategy: Components.Schemas.InternalBitcoinResourceStrategy
    Internal_BitcoinResourceStrategy_OrderReplacement: Components.Schemas.InternalBitcoinResourceStrategyOrderReplacement
    Internal_BitcoinTickerProperties: Components.Schemas.InternalBitcoinTickerProperties
    Internal_BitcoinTickerProperties_Native: Components.Schemas.InternalBitcoinTickerPropertiesNative
    Internal_CardanoFeeStrategy: Components.Schemas.InternalCardanoFeeStrategy
    Internal_CardanoFeeStrategy_Priority: Components.Schemas.InternalCardanoFeeStrategyPriority
    Internal_CardanoOperation: Components.Schemas.InternalCardanoOperation
    Internal_CardanoOperation_DelegateRepresentative: Components.Schemas.InternalCardanoOperationDelegateRepresentative
    Internal_CardanoOperation_DelegateStaking: Components.Schemas.InternalCardanoOperationDelegateStaking
    Internal_CardanoOperation_RegisterStaking: Components.Schemas.InternalCardanoOperationRegisterStaking
    Internal_CardanoOperation_Transfer: Components.Schemas.InternalCardanoOperationTransfer
    Internal_CardanoOperation_UnregisterStaking: Components.Schemas.InternalCardanoOperationUnregisterStaking
    Internal_CardanoOperation_WithdrawRewards: Components.Schemas.InternalCardanoOperationWithdrawRewards
    Internal_CardanoOutputParameters: Components.Schemas.InternalCardanoOutputParameters
    Internal_CardanoTickerProperties: Components.Schemas.InternalCardanoTickerProperties
    Internal_CardanoTickerProperties_Native: Components.Schemas.InternalCardanoTickerPropertiesNative
    Internal_CmptCryptographicFields: Components.Schemas.InternalCmptCryptographicFields
    Internal_CmptCryptographicFields_Clawback: Components.Schemas.InternalCmptCryptographicFieldsClawback
    Internal_CmptCryptographicFields_Convert: Components.Schemas.InternalCmptCryptographicFieldsConvert
    Internal_CmptCryptographicFields_ConvertBack: Components.Schemas.InternalCmptCryptographicFieldsConvertBack
    Internal_CmptCryptographicFields_Send: Components.Schemas.InternalCmptCryptographicFieldsSend
    Internal_ComplianceConfigurationUpdated: Components.Schemas.InternalComplianceConfigurationUpdated
    Internal_ContractParameters: Components.Schemas.InternalContractParameters
    Internal_ContractParameters_Raw: Components.Schemas.InternalContractParametersRaw
    Internal_CreateDomainGenesisPolicy: Components.Schemas.InternalCreateDomainGenesisPolicy
    Internal_CreateDomainGenesisUser: Components.Schemas.InternalCreateDomainGenesisUser
    Internal_CreateDomainsPayload: Components.Schemas.InternalCreateDomainsPayload
    Internal_CreateLedgerGenesis: Components.Schemas.InternalCreateLedgerGenesis
    Internal_CreateTransferOrderOutput: Components.Schemas.InternalCreateTransferOrderOutput
    Internal_CreatedEntitiesReferences: Components.Schemas.InternalCreatedEntitiesReferences
    Internal_CreatedEntitiesReferences_Policy: Components.Schemas.InternalCreatedEntitiesReferencesPolicy
    Internal_CreatedEntitiesReferences_User: Components.Schemas.InternalCreatedEntitiesReferencesUser
    Internal_CurrentVault: Components.Schemas.InternalCurrentVault
    Internal_DecisionPayload: Components.Schemas.InternalDecisionPayload
    Internal_DecryptCbsPending: Components.Schemas.InternalDecryptCbsPending
    Internal_DecryptCbsPrepared: Components.Schemas.InternalDecryptCbsPrepared
    Internal_DelegateRepresentativeParameters: Components.Schemas.InternalDelegateRepresentativeParameters
    Internal_DelegateRepresentativeParameters_AlwaysAbstain: Components.Schemas.InternalDelegateRepresentativeParametersAlwaysAbstain
    Internal_Domain: Components.Schemas.InternalDomain
    Internal_DomainCreated: Components.Schemas.InternalDomainCreated
    Internal_DomainUpdated: Components.Schemas.InternalDomainUpdated
    Internal_ElGamalKeyProvisioned: Components.Schemas.InternalElGamalKeyProvisioned
    Internal_ElGamalKeyProvisioningFailed: Components.Schemas.InternalElGamalKeyProvisioningFailed
    Internal_Endpoint: Components.Schemas.InternalEndpoint
    Internal_EndpointCreated: Components.Schemas.InternalEndpointCreated
    Internal_EndpointLedgerParameters: Components.Schemas.InternalEndpointLedgerParameters
    Internal_EndpointLedgerParameters_Ethereum: Components.Schemas.InternalEndpointLedgerParametersEthereum
    Internal_EndpointUpdated: Components.Schemas.InternalEndpointUpdated
    Internal_EntityIdAndRevision: Components.Schemas.InternalEntityIdAndRevision
    Internal_EntityMetadata: Components.Schemas.InternalEntityMetadata
    Internal_EntityStringIdAndRevision: Components.Schemas.InternalEntityStringIdAndRevision
    Internal_ErrorMessage: Components.Schemas.InternalErrorMessage
    Internal_EthereumFeeStrategy: Components.Schemas.InternalEthereumFeeStrategy
    Internal_EthereumFeeStrategy_Priority: Components.Schemas.InternalEthereumFeeStrategyPriority
    Internal_EthereumFeeStrategy_SpecifiedRate: Components.Schemas.InternalEthereumFeeStrategySpecifiedRate
    Internal_EthereumFeeStrategy_SpecifiedRateEIP1559: Components.Schemas.InternalEthereumFeeStrategySpecifiedRateEIP1559
    Internal_EthereumLikeVaultLedgerIdentifier: Components.Schemas.InternalEthereumLikeVaultLedgerIdentifier
    Internal_EthereumResourceStrategy: Components.Schemas.InternalEthereumResourceStrategy
    Internal_EthereumResourceStrategy_OrderReplacement: Components.Schemas.InternalEthereumResourceStrategyOrderReplacement
    Internal_EthereumTickerProperties: Components.Schemas.InternalEthereumTickerProperties
    Internal_EthereumTickerProperties_ERC1155: Components.Schemas.InternalEthereumTickerPropertiesERC1155
    Internal_EthereumTickerProperties_ERC20: Components.Schemas.InternalEthereumTickerPropertiesERC20
    Internal_EthereumTickerProperties_ERC721: Components.Schemas.InternalEthereumTickerPropertiesERC721
    Internal_EthereumTickerProperties_Native: Components.Schemas.InternalEthereumTickerPropertiesNative
    Internal_EvaluationContext: Components.Schemas.InternalEvaluationContext
    Internal_EvaluationContextReferences: Components.Schemas.InternalEvaluationContextReferences
    Internal_EventsCollection: Components.Schemas.InternalEventsCollection
    Internal_FeePriority: Components.Schemas.InternalFeePriority
    Internal_Genesis: Components.Schemas.InternalGenesis
    Internal_GenesisCryptoSetup: Components.Schemas.InternalGenesisCryptoSetup
    Internal_GenesisData: Components.Schemas.InternalGenesisData
    Internal_GenesisPayload: Components.Schemas.InternalGenesisPayload
    Internal_GenesisSucceeded: Components.Schemas.InternalGenesisSucceeded
    Internal_GoverningStrategy: Components.Schemas.InternalGoverningStrategy
    Internal_HarmonizeEvent: Components.Schemas.InternalHarmonizeEvent
    Internal_HarmonizeEventPayload: Components.Schemas.InternalHarmonizeEventPayload
    Internal_HederaFeeStrategy: Components.Schemas.InternalHederaFeeStrategy
    Internal_HederaFeeStrategy_Priority: Components.Schemas.InternalHederaFeeStrategyPriority
    Internal_HederaOperation: Components.Schemas.InternalHederaOperation
    Internal_HederaOperation_AccountUpdate: Components.Schemas.InternalHederaOperationAccountUpdate
    Internal_HederaOperation_TokenAssociate: Components.Schemas.InternalHederaOperationTokenAssociate
    Internal_HederaOperation_TokenDissociate: Components.Schemas.InternalHederaOperationTokenDissociate
    Internal_HederaOperation_Transfer: Components.Schemas.InternalHederaOperationTransfer
    Internal_HederaTickerProperties: Components.Schemas.InternalHederaTickerProperties
    Internal_HederaTickerProperties_FungibleToken: Components.Schemas.InternalHederaTickerPropertiesFungibleToken
    Internal_HederaTickerProperties_Native: Components.Schemas.InternalHederaTickerPropertiesNative
    Internal_HederaTickerProperties_NonFungibleToken: Components.Schemas.InternalHederaTickerPropertiesNonFungibleToken
    Internal_HederaTransferOutput: Components.Schemas.InternalHederaTransferOutput
    Internal_IntentAuthor: Components.Schemas.InternalIntentAuthor
    Internal_IntentAuthor_Service: Components.Schemas.InternalIntentAuthorService
    Internal_IntentAuthor_User: Components.Schemas.InternalIntentAuthorUser
    Internal_IntentClosed: Components.Schemas.InternalIntentClosed
    Internal_IntentContextResponse: Components.Schemas.InternalIntentContextResponse
    Internal_IntentCreated: Components.Schemas.InternalIntentCreated
    Internal_IntentDetails: Components.Schemas.InternalIntentDetails
    Internal_IntentEntity: Components.Schemas.InternalIntentEntity
    Internal_IntentError: Components.Schemas.InternalIntentError
    Internal_IntentExecuted: Components.Schemas.InternalIntentExecuted
    Internal_IntentLockStatus: Components.Schemas.InternalIntentLockStatus
    Internal_IntentMetadata: Components.Schemas.InternalIntentMetadata
    Internal_IntentOrigin: Components.Schemas.InternalIntentOrigin
    Internal_IntentState: Components.Schemas.InternalIntentState
    Internal_IntentStatus: Components.Schemas.InternalIntentStatus
    Internal_IntentType: Components.Schemas.InternalIntentType
    Internal_IntentUpdated: Components.Schemas.InternalIntentUpdated
    Internal_KeyPurpose: Components.Schemas.InternalKeyPurpose
    Internal_KeyType: Components.Schemas.InternalKeyType
    Internal_Ledger: Components.Schemas.InternalLedger
    Internal_LedgerCreated: Components.Schemas.InternalLedgerCreated
    Internal_LedgerParameters: Components.Schemas.InternalLedgerParameters
    Internal_LedgerParameters_Algorand: Components.Schemas.InternalLedgerParametersAlgorand
    Internal_LedgerParameters_Bitcoin: Components.Schemas.InternalLedgerParametersBitcoin
    Internal_LedgerParameters_Cardano: Components.Schemas.InternalLedgerParametersCardano
    Internal_LedgerParameters_Ethereum: Components.Schemas.InternalLedgerParametersEthereum
    Internal_LedgerParameters_Hedera: Components.Schemas.InternalLedgerParametersHedera
    Internal_LedgerParameters_Solana: Components.Schemas.InternalLedgerParametersSolana
    Internal_LedgerParameters_Stellar: Components.Schemas.InternalLedgerParametersStellar
    Internal_LedgerParameters_Substrate: Components.Schemas.InternalLedgerParametersSubstrate
    Internal_LedgerParameters_Tezos: Components.Schemas.InternalLedgerParametersTezos
    Internal_LedgerParameters_Tron: Components.Schemas.InternalLedgerParametersTron
    Internal_LedgerParameters_XRPL: Components.Schemas.InternalLedgerParametersXRPL
    Internal_LedgerUpdated: Components.Schemas.InternalLedgerUpdated
    Internal_LockStatus: Components.Schemas.InternalLockStatus
    Internal_LoginId: Components.Schemas.InternalLoginId
    Internal_MPTokenIssuanceMetadata: Components.Schemas.InternalMPTokenIssuanceMetadata
    Internal_MPTokenIssuanceMetadata_HexEncodedMetadata: Components.Schemas.InternalMPTokenIssuanceMetadataHexEncodedMetadata
    Internal_Manifest: Components.Schemas.InternalManifest
    Internal_ManifestContent: Components.Schemas.InternalManifestContent
    "Internal_ManifestContent_EIP-191": Components.Schemas.InternalManifestContentEIP191
    Internal_ManifestContent_JWT: Components.Schemas.InternalManifestContentJWT
    Internal_ManifestContent_JWT_Header: Components.Schemas.InternalManifestContentJWTHeader
    Internal_ManifestContent_JWT_Payload: Components.Schemas.InternalManifestContentJWTPayload
    Internal_ManifestContent_Unsafe: Components.Schemas.InternalManifestContentUnsafe
    Internal_ManifestCreated: Components.Schemas.InternalManifestCreated
    Internal_ManifestPending: Components.Schemas.InternalManifestPending
    Internal_ManifestUpdated: Components.Schemas.InternalManifestUpdated
    Internal_ManifestValue: Components.Schemas.InternalManifestValue
    "Internal_ManifestValue_EIP-191": Components.Schemas.InternalManifestValueEIP191
    Internal_ManifestValue_JWT: Components.Schemas.InternalManifestValueJWT
    Internal_ManifestValue_Unsafe: Components.Schemas.InternalManifestValueUnsafe
    Internal_Map_Account: Components.Schemas.InternalMapAccount
    Internal_Map_Backup: Components.Schemas.InternalMapBackup
    Internal_Map_Domain: Components.Schemas.InternalMapDomain
    Internal_Map_Endpoint: Components.Schemas.InternalMapEndpoint
    Internal_Map_Ledger: Components.Schemas.InternalMapLedger
    Internal_Map_Manifest: Components.Schemas.InternalMapManifest
    Internal_Map_Policy: Components.Schemas.InternalMapPolicy
    Internal_Map_SystemProperty: Components.Schemas.InternalMapSystemProperty
    Internal_Map_TransactionOrder: Components.Schemas.InternalMapTransactionOrder
    Internal_Map_User: Components.Schemas.InternalMapUser
    Internal_Map_ValidatedTicker: Components.Schemas.InternalMapValidatedTicker
    Internal_Map_Vault: Components.Schemas.InternalMapVault
    Internal_Network: Components.Schemas.InternalNetwork
    Internal_NonFungibleTokenDestination: Components.Schemas.InternalNonFungibleTokenDestination
    Internal_NonFungibleTokenDestination_NftTokenId: Components.Schemas.InternalNonFungibleTokenDestinationNftTokenId
    Internal_NonFungibleTokenDestination_Ticker: Components.Schemas.InternalNonFungibleTokenDestinationTicker
    Internal_NotaryApiKeyValue: Components.Schemas.InternalNotaryApiKeyValue
    Internal_NotaryCollectionsKeyValue: Components.Schemas.InternalNotaryCollectionsKeyValue
    Internal_NotaryCommunicationKeyValue: Components.Schemas.InternalNotaryCommunicationKeyValue
    Internal_NotarySystemSignedIntentsEnabledValue: Components.Schemas.InternalNotarySystemSignedIntentsEnabledValue
    Internal_NotarySystemSigningKeyValue: Components.Schemas.InternalNotarySystemSigningKeyValue
    Internal_ParametersComputePending: Components.Schemas.InternalParametersComputePending
    Internal_ParametersComputePrepared: Components.Schemas.InternalParametersComputePrepared
    Internal_Participant: Components.Schemas.InternalParticipant
    Internal_ParticipantSequencing: Components.Schemas.InternalParticipantSequencing
    Internal_ParticipantSequencing_AccountSequence: Components.Schemas.InternalParticipantSequencingAccountSequence
    Internal_ParticipantSequencing_Ticket: Components.Schemas.InternalParticipantSequencingTicket
    Internal_Participant_Account: Components.Schemas.InternalParticipantAccount
    Internal_Participant_Address: Components.Schemas.InternalParticipantAddress
    Internal_Participant_Endpoint: Components.Schemas.InternalParticipantEndpoint
    Internal_Permissions: Components.Schemas.InternalPermissions
    Internal_Policy: Components.Schemas.InternalPolicy
    Internal_PolicyCondition: Components.Schemas.InternalPolicyCondition
    Internal_PolicyCondition_And: Components.Schemas.InternalPolicyConditionAnd
    Internal_PolicyCondition_Expression: Components.Schemas.InternalPolicyConditionExpression
    Internal_PolicyCondition_Or: Components.Schemas.InternalPolicyConditionOr
    Internal_PolicyCreated: Components.Schemas.InternalPolicyCreated
    Internal_PolicyReference: Components.Schemas.InternalPolicyReference
    Internal_PolicyScope: Components.Schemas.InternalPolicyScope
    Internal_PolicyUpdated: Components.Schemas.InternalPolicyUpdated
    Internal_PreferredAddressForChange: Components.Schemas.InternalPreferredAddressForChange
    Internal_ProposalPayload: Components.Schemas.InternalProposalPayload
    Internal_Propose: Components.Schemas.InternalPropose
    Internal_ProposeTransactionOrderParameters: Components.Schemas.InternalProposeTransactionOrderParameters
    Internal_ProposeUserIntentPayload: Components.Schemas.InternalProposeUserIntentPayload
    Internal_Propose_v0_CreateTransactionOrder: Components.Schemas.InternalProposeV0CreateTransactionOrder
    Internal_PurposeKey: Components.Schemas.InternalPurposeKey
    Internal_QuarantineApplied: Components.Schemas.InternalQuarantineApplied
    Internal_QuarantineSkipped: Components.Schemas.InternalQuarantineSkipped
    Internal_QuarantineStatus: Components.Schemas.InternalQuarantineStatus
    Internal_ReadAccess: Components.Schemas.InternalReadAccess
    Internal_ReadWriteSystemPropertyKeyValue: Components.Schemas.InternalReadWriteSystemPropertyKeyValue
    Internal_ReadWriteSystemPropertyKeyValue_NotarySystemSignedIntentsEnabledProperty: Components.Schemas.InternalReadWriteSystemPropertyKeyValueNotarySystemSignedIntentsEnabledProperty
    Internal_ReadWriteSystemPropertyKeyValue_StateReviewAuthorityProperty: Components.Schemas.InternalReadWriteSystemPropertyKeyValueStateReviewAuthorityProperty
    Internal_RecipientTransferParty: Components.Schemas.InternalRecipientTransferParty
    Internal_RecipientTransferParty_Account: Components.Schemas.InternalRecipientTransferPartyAccount
    Internal_RecipientTransferParty_Address: Components.Schemas.InternalRecipientTransferPartyAddress
    Internal_ResolvedEndpoint: Components.Schemas.InternalResolvedEndpoint
    Internal_RewrapPending: Components.Schemas.InternalRewrapPending
    Internal_RewrapPrepared: Components.Schemas.InternalRewrapPrepared
    Internal_RootDomainSetup: Components.Schemas.InternalRootDomainSetup
    Internal_ScriptingEngine: Components.Schemas.InternalScriptingEngine
    Internal_SenderTransferParty: Components.Schemas.InternalSenderTransferParty
    Internal_SenderTransferParty_Account: Components.Schemas.InternalSenderTransferPartyAccount
    Internal_SenderTransferParty_Address: Components.Schemas.InternalSenderTransferPartyAddress
    Internal_Sequencing: Components.Schemas.InternalSequencing
    Internal_Sequencing_AccountSequence: Components.Schemas.InternalSequencingAccountSequence
    Internal_Sequencing_PlatformManaged: Components.Schemas.InternalSequencingPlatformManaged
    Internal_Sequencing_Ticket: Components.Schemas.InternalSequencingTicket
    Internal_Service: Components.Schemas.InternalService
    Internal_ServicePropose: Components.Schemas.InternalServicePropose
    Internal_SignedAccountPending: Components.Schemas.InternalSignedAccountPending
    Internal_SignedManifestPending: Components.Schemas.InternalSignedManifestPending
    Internal_SignedVaultPending: Components.Schemas.InternalSignedVaultPending
    Internal_SkipQuarantineScope: Components.Schemas.InternalSkipQuarantineScope
    Internal_SolanaFeeStrategy: Components.Schemas.InternalSolanaFeeStrategy
    Internal_SolanaFeeStrategy_Priority: Components.Schemas.InternalSolanaFeeStrategyPriority
    Internal_SolanaMintAccount: Components.Schemas.InternalSolanaMintAccount
    Internal_SolanaMintAccount_Destination: Components.Schemas.InternalSolanaMintAccountDestination
    Internal_SolanaMintAccount_Ticker: Components.Schemas.InternalSolanaMintAccountTicker
    Internal_SolanaOperation: Components.Schemas.InternalSolanaOperation
    Internal_SolanaOperation_Burn: Components.Schemas.InternalSolanaOperationBurn
    Internal_SolanaOperation_CreateNonceAccount: Components.Schemas.InternalSolanaOperationCreateNonceAccount
    Internal_SolanaOperation_FundAtaAccount: Components.Schemas.InternalSolanaOperationFundAtaAccount
    Internal_SolanaOperation_InitializeMint: Components.Schemas.InternalSolanaOperationInitializeMint
    Internal_SolanaOperation_MintTo: Components.Schemas.InternalSolanaOperationMintTo
    Internal_SolanaOperation_Transfer: Components.Schemas.InternalSolanaOperationTransfer
    Internal_SolanaOperation_TransferToken: Components.Schemas.InternalSolanaOperationTransferToken
    Internal_SolanaTickerProperties: Components.Schemas.InternalSolanaTickerProperties
    Internal_SolanaTickerProperties_Native: Components.Schemas.InternalSolanaTickerPropertiesNative
    Internal_SolanaTickerProperties_Token: Components.Schemas.InternalSolanaTickerPropertiesToken
    Internal_SolanaTokenType: Components.Schemas.InternalSolanaTokenType
    Internal_SolanaTransferOutput: Components.Schemas.InternalSolanaTransferOutput
    Internal_SortOrder: Components.Schemas.InternalSortOrder
    Internal_StateReviewAuthorityValue: Components.Schemas.InternalStateReviewAuthorityValue
    Internal_StellarAsset: Components.Schemas.InternalStellarAsset
    Internal_StellarFeeStrategy: Components.Schemas.InternalStellarFeeStrategy
    Internal_StellarFeeStrategy_Priority: Components.Schemas.InternalStellarFeeStrategyPriority
    Internal_StellarFeeStrategy_SpecifiedRate: Components.Schemas.InternalStellarFeeStrategySpecifiedRate
    Internal_StellarMemo: Components.Schemas.InternalStellarMemo
    Internal_StellarMemo_Hash: Components.Schemas.InternalStellarMemoHash
    Internal_StellarMemo_Id: Components.Schemas.InternalStellarMemoId
    Internal_StellarMemo_Return: Components.Schemas.InternalStellarMemoReturn
    Internal_StellarMemo_Text: Components.Schemas.InternalStellarMemoText
    Internal_StellarOperation: Components.Schemas.InternalStellarOperation
    Internal_StellarOperation_AccountMerge: Components.Schemas.InternalStellarOperationAccountMerge
    Internal_StellarOperation_ChangeTrust: Components.Schemas.InternalStellarOperationChangeTrust
    Internal_StellarOperation_CreateAccount: Components.Schemas.InternalStellarOperationCreateAccount
    Internal_StellarOperation_Payment: Components.Schemas.InternalStellarOperationPayment
    Internal_StellarOperation_SetOptions: Components.Schemas.InternalStellarOperationSetOptions
    Internal_StellarOption: Components.Schemas.InternalStellarOption
    Internal_StellarOption_OptionHomeDomain: Components.Schemas.InternalStellarOptionOptionHomeDomain
    Internal_StellarOption_OptionSetFlag: Components.Schemas.InternalStellarOptionOptionSetFlag
    Internal_StellarTickerProperties: Components.Schemas.InternalStellarTickerProperties
    Internal_StellarTickerProperties_Native: Components.Schemas.InternalStellarTickerPropertiesNative
    Internal_StellarTickerProperties_Token: Components.Schemas.InternalStellarTickerPropertiesToken
    Internal_Stellar_OptionFlag: Components.Schemas.InternalStellarOptionFlag
    Internal_StringsMap: Components.Schemas.InternalStringsMap
    Internal_SubmittedTransactionPending: Components.Schemas.InternalSubmittedTransactionPending
    Internal_SubmittedTransactionPrepared: Components.Schemas.InternalSubmittedTransactionPrepared
    Internal_Submitter: Components.Schemas.InternalSubmitter
    Internal_SubstrateBalancesMethod: Components.Schemas.InternalSubstrateBalancesMethod
    Internal_SubstrateBalancesMethod_TransferKeepAlive: Components.Schemas.InternalSubstrateBalancesMethodTransferKeepAlive
    Internal_SubstrateChainType: Components.Schemas.InternalSubstrateChainType
    Internal_SubstrateFeeParameters: Components.Schemas.InternalSubstrateFeeParameters
    Internal_SubstrateFeeParameters_TransactionPayment: Components.Schemas.InternalSubstrateFeeParametersTransactionPayment
    Internal_SubstrateFeeStrategy: Components.Schemas.InternalSubstrateFeeStrategy
    Internal_SubstrateFeeStrategy_Priority: Components.Schemas.InternalSubstrateFeeStrategyPriority
    Internal_SubstrateMethodFeeParameters: Components.Schemas.InternalSubstrateMethodFeeParameters
    Internal_SubstrateMethodFeeParameters_MethodWeight: Components.Schemas.InternalSubstrateMethodFeeParametersMethodWeight
    Internal_SubstrateMethodInfo: Components.Schemas.InternalSubstrateMethodInfo
    Internal_SubstratePallet: Components.Schemas.InternalSubstratePallet
    Internal_SubstratePalletInfo: Components.Schemas.InternalSubstratePalletInfo
    Internal_SubstratePallet_Balances: Components.Schemas.InternalSubstratePalletBalances
    Internal_SubstratePallet_Staking: Components.Schemas.InternalSubstratePalletStaking
    Internal_SubstrateRuntimeInfo: Components.Schemas.InternalSubstrateRuntimeInfo
    Internal_SubstrateStakingMethod: Components.Schemas.InternalSubstrateStakingMethod
    Internal_SubstrateStakingMethod_Bond: Components.Schemas.InternalSubstrateStakingMethodBond
    Internal_SubstrateStakingMethod_BondExtra: Components.Schemas.InternalSubstrateStakingMethodBondExtra
    Internal_SubstrateStakingMethod_Chill: Components.Schemas.InternalSubstrateStakingMethodChill
    Internal_SubstrateStakingMethod_Nominate: Components.Schemas.InternalSubstrateStakingMethodNominate
    Internal_SubstrateStakingMethod_Rebond: Components.Schemas.InternalSubstrateStakingMethodRebond
    Internal_SubstrateStakingMethod_SetController: Components.Schemas.InternalSubstrateStakingMethodSetController
    Internal_SubstrateStakingMethod_SetPayee: Components.Schemas.InternalSubstrateStakingMethodSetPayee
    Internal_SubstrateStakingMethod_Unbond: Components.Schemas.InternalSubstrateStakingMethodUnbond
    Internal_SubstrateStakingMethod_WithdrawUnbonded: Components.Schemas.InternalSubstrateStakingMethodWithdrawUnbonded
    Internal_SubstrateStakingPayee: Components.Schemas.InternalSubstrateStakingPayee
    Internal_SubstrateStakingPayee_Account: Components.Schemas.InternalSubstrateStakingPayeeAccount
    Internal_SubstrateStakingPayee_Controller: Components.Schemas.InternalSubstrateStakingPayeeController
    Internal_SubstrateStakingPayee_Staked: Components.Schemas.InternalSubstrateStakingPayeeStaked
    Internal_SubstrateStakingPayee_Stash: Components.Schemas.InternalSubstrateStakingPayeeStash
    Internal_SubstrateTickerProperties: Components.Schemas.InternalSubstrateTickerProperties
    Internal_SubstrateTickerProperties_Native: Components.Schemas.InternalSubstrateTickerPropertiesNative
    Internal_SystemProperty: Components.Schemas.InternalSystemProperty
    Internal_SystemPropertyId: Components.Schemas.InternalSystemPropertyId
    Internal_SystemPropertySet: Components.Schemas.InternalSystemPropertySet
    Internal_SystemProperty_NotaryApiKeySystemProperty: Components.Schemas.InternalSystemPropertyNotaryApiKeySystemProperty
    Internal_SystemProperty_NotaryCollectionsKeySystemProperty: Components.Schemas.InternalSystemPropertyNotaryCollectionsKeySystemProperty
    Internal_SystemProperty_NotaryCommunicationKeySystemProperty: Components.Schemas.InternalSystemPropertyNotaryCommunicationKeySystemProperty
    Internal_SystemProperty_NotarySystemSignedIntentsEnabledSystemProperty: Components.Schemas.InternalSystemPropertyNotarySystemSignedIntentsEnabledSystemProperty
    Internal_SystemProperty_NotarySystemSigningKeySystemProperty: Components.Schemas.InternalSystemPropertyNotarySystemSigningKeySystemProperty
    Internal_SystemProperty_StateReviewAuthoritySystemProperty: Components.Schemas.InternalSystemPropertyStateReviewAuthoritySystemProperty
    Internal_TezosFeeStrategy: Components.Schemas.InternalTezosFeeStrategy
    Internal_TezosFeeStrategy_Priority: Components.Schemas.InternalTezosFeeStrategyPriority
    Internal_TezosOperation: Components.Schemas.InternalTezosOperation
    Internal_TezosOperation_Delegation: Components.Schemas.InternalTezosOperationDelegation
    Internal_TezosOperation_Reveal: Components.Schemas.InternalTezosOperationReveal
    Internal_TezosOperation_Transaction: Components.Schemas.InternalTezosOperationTransaction
    Internal_TezosOperation_Undelegation: Components.Schemas.InternalTezosOperationUndelegation
    Internal_TezosTickerProperties: Components.Schemas.InternalTezosTickerProperties
    Internal_TezosTickerProperties_Native: Components.Schemas.InternalTezosTickerPropertiesNative
    Internal_TickerCreated: Components.Schemas.InternalTickerCreated
    Internal_TickerKind: Components.Schemas.InternalTickerKind
    Internal_TickerLedgerDetails: Components.Schemas.InternalTickerLedgerDetails
    Internal_TickerLedgerDetails_Algorand: Components.Schemas.InternalTickerLedgerDetailsAlgorand
    Internal_TickerLedgerDetails_Bitcoin: Components.Schemas.InternalTickerLedgerDetailsBitcoin
    Internal_TickerLedgerDetails_Cardano: Components.Schemas.InternalTickerLedgerDetailsCardano
    Internal_TickerLedgerDetails_Ethereum: Components.Schemas.InternalTickerLedgerDetailsEthereum
    Internal_TickerLedgerDetails_Hedera: Components.Schemas.InternalTickerLedgerDetailsHedera
    Internal_TickerLedgerDetails_Solana: Components.Schemas.InternalTickerLedgerDetailsSolana
    Internal_TickerLedgerDetails_Stellar: Components.Schemas.InternalTickerLedgerDetailsStellar
    Internal_TickerLedgerDetails_Substrate: Components.Schemas.InternalTickerLedgerDetailsSubstrate
    Internal_TickerLedgerDetails_Tezos: Components.Schemas.InternalTickerLedgerDetailsTezos
    Internal_TickerLedgerDetails_Tron: Components.Schemas.InternalTickerLedgerDetailsTron
    Internal_TickerLedgerDetails_XRPL: Components.Schemas.InternalTickerLedgerDetailsXRPL
    Internal_TickerToValidate: Components.Schemas.InternalTickerToValidate
    Internal_TickerUpdated: Components.Schemas.InternalTickerUpdated
    Internal_TokenDestination: Components.Schemas.InternalTokenDestination
    Internal_TokenDestination_Ticker: Components.Schemas.InternalTokenDestinationTicker
    Internal_TokenDestination_TokenId: Components.Schemas.InternalTokenDestinationTokenId
    Internal_TokenOutput: Components.Schemas.InternalTokenOutput
    Internal_TokenOutput_HederaFungibleTokenOutput: Components.Schemas.InternalTokenOutputHederaFungibleTokenOutput
    Internal_TokenOutput_HederaNonFungibleTokenOutput: Components.Schemas.InternalTokenOutputHederaNonFungibleTokenOutput
    Internal_TransactionCreated: Components.Schemas.InternalTransactionCreated
    Internal_TransactionDestination: Components.Schemas.InternalTransactionDestination
    Internal_TransactionDestination_Account: Components.Schemas.InternalTransactionDestinationAccount
    Internal_TransactionDestination_Address: Components.Schemas.InternalTransactionDestinationAddress
    Internal_TransactionDestination_Endpoint: Components.Schemas.InternalTransactionDestinationEndpoint
    Internal_TransactionDetected: Components.Schemas.InternalTransactionDetected
    Internal_TransactionOrder: Components.Schemas.InternalTransactionOrder
    Internal_TransactionOrderParameters: Components.Schemas.InternalTransactionOrderParameters
    Internal_TransactionOrderParameters_Algorand: Components.Schemas.InternalTransactionOrderParametersAlgorand
    Internal_TransactionOrderParameters_Bitcoin: Components.Schemas.InternalTransactionOrderParametersBitcoin
    Internal_TransactionOrderParameters_BitcoinRedirect: Components.Schemas.InternalTransactionOrderParametersBitcoinRedirect
    Internal_TransactionOrderParameters_Cardano: Components.Schemas.InternalTransactionOrderParametersCardano
    Internal_TransactionOrderParameters_Ethereum: Components.Schemas.InternalTransactionOrderParametersEthereum
    Internal_TransactionOrderParameters_Hedera: Components.Schemas.InternalTransactionOrderParametersHedera
    Internal_TransactionOrderParameters_Solana: Components.Schemas.InternalTransactionOrderParametersSolana
    Internal_TransactionOrderParameters_Stellar: Components.Schemas.InternalTransactionOrderParametersStellar
    Internal_TransactionOrderParameters_Substrate: Components.Schemas.InternalTransactionOrderParametersSubstrate
    Internal_TransactionOrderParameters_Tezos: Components.Schemas.InternalTransactionOrderParametersTezos
    Internal_TransactionOrderParameters_Tron: Components.Schemas.InternalTransactionOrderParametersTron
    Internal_TransactionOrderParameters_XRPL: Components.Schemas.InternalTransactionOrderParametersXRPL
    Internal_TransactionPending: Components.Schemas.InternalTransactionPending
    Internal_TransactionPrepared: Components.Schemas.InternalTransactionPrepared
    Internal_TransactionUpdated: Components.Schemas.InternalTransactionUpdated
    Internal_TransferKind: Components.Schemas.InternalTransferKind
    Internal_TransferMetadata: Components.Schemas.InternalTransferMetadata
    Internal_TransferMetadata_Algorand: Components.Schemas.InternalTransferMetadataAlgorand
    Internal_TransferMetadata_Bitcoin: Components.Schemas.InternalTransferMetadataBitcoin
    Internal_TransferMetadata_Cardano: Components.Schemas.InternalTransferMetadataCardano
    Internal_TransferMetadata_Ethereum: Components.Schemas.InternalTransferMetadataEthereum
    Internal_TransferMetadata_Hedera: Components.Schemas.InternalTransferMetadataHedera
    Internal_TransferMetadata_Solana: Components.Schemas.InternalTransferMetadataSolana
    Internal_TransferMetadata_Stellar: Components.Schemas.InternalTransferMetadataStellar
    Internal_TransferMetadata_Substrate: Components.Schemas.InternalTransferMetadataSubstrate
    Internal_TransferMetadata_Tezos: Components.Schemas.InternalTransferMetadataTezos
    Internal_TransferMetadata_Tron: Components.Schemas.InternalTransferMetadataTron
    Internal_TransferMetadata_XRPL: Components.Schemas.InternalTransferMetadataXRPL
    Internal_TransferUpdated: Components.Schemas.InternalTransferUpdated
    Internal_TronFeeStrategy: Components.Schemas.InternalTronFeeStrategy
    Internal_TronFeeStrategy_Priority: Components.Schemas.InternalTronFeeStrategyPriority
    Internal_TronOperation: Components.Schemas.InternalTronOperation
    Internal_TronOperation_NativeTransfer: Components.Schemas.InternalTronOperationNativeTransfer
    Internal_TronOperation_TRC20Transfer: Components.Schemas.InternalTronOperationTRC20Transfer
    Internal_TronTickerProperties: Components.Schemas.InternalTronTickerProperties
    Internal_TronTickerProperties_Native: Components.Schemas.InternalTronTickerPropertiesNative
    Internal_TronTickerProperties_TRC20: Components.Schemas.InternalTronTickerPropertiesTRC20
    Internal_TrustedAccount: Components.Schemas.InternalTrustedAccount
    Internal_TrustedDomain: Components.Schemas.InternalTrustedDomain
    Internal_TrustedEndpoint: Components.Schemas.InternalTrustedEndpoint
    Internal_TrustedIntent: Components.Schemas.InternalTrustedIntent
    Internal_TrustedManifest: Components.Schemas.InternalTrustedManifest
    Internal_TrustedPolicy: Components.Schemas.InternalTrustedPolicy
    Internal_TrustedPublicKeyAdded: Components.Schemas.InternalTrustedPublicKeyAdded
    Internal_TrustedPublicKeyPurpose: Components.Schemas.InternalTrustedPublicKeyPurpose
    Internal_TrustedPublicKeyUpdated: Components.Schemas.InternalTrustedPublicKeyUpdated
    Internal_TrustedTransactionOrder: Components.Schemas.InternalTrustedTransactionOrder
    Internal_TrustedUser: Components.Schemas.InternalTrustedUser
    Internal_TrustedUsersCollection: Components.Schemas.InternalTrustedUsersCollection
    Internal_TrustedVault: Components.Schemas.InternalTrustedVault
    Internal_User: Components.Schemas.InternalUser
    Internal_User1: Components.Schemas.InternalUser1
    Internal_UserCreated: Components.Schemas.InternalUserCreated
    Internal_UserDifferentPublicKey: Components.Schemas.InternalUserDifferentPublicKey
    Internal_UserIntentPayload: Components.Schemas.InternalUserIntentPayload
    Internal_UserOperationRejectionCode: Components.Schemas.InternalUserOperationRejectionCode
    Internal_UserReference: Components.Schemas.InternalUserReference
    Internal_UserRequestPayload: Components.Schemas.InternalUserRequestPayload
    Internal_UserRequestPayload_Approve: Components.Schemas.InternalUserRequestPayloadApprove
    Internal_UserRequestPayload_Propose: Components.Schemas.InternalUserRequestPayloadPropose
    Internal_UserRequestPayload_Reject: Components.Schemas.InternalUserRequestPayloadReject
    Internal_UserSamePublicKey: Components.Schemas.InternalUserSamePublicKey
    Internal_UserUpdated: Components.Schemas.InternalUserUpdated
    Internal_UsersConflicts: Components.Schemas.InternalUsersConflicts
    Internal_UsersDifferentPublicKey: Components.Schemas.InternalUsersDifferentPublicKey
    Internal_UsersSameAlias: Components.Schemas.InternalUsersSameAlias
    Internal_UsersSamePublicKey: Components.Schemas.InternalUsersSamePublicKey
    Internal_V3AccountToMigrate: Components.Schemas.InternalV3AccountToMigrate
    Internal_ValidatedTicker: Components.Schemas.InternalValidatedTicker
    Internal_ValidatedTickerKind: Components.Schemas.InternalValidatedTickerKind
    Internal_Vault: Components.Schemas.InternalVault
    Internal_VaultAccountKeyInformation: Components.Schemas.InternalVaultAccountKeyInformation
    Internal_VaultAccountKeyInformation_Random: Components.Schemas.InternalVaultAccountKeyInformationRandom
    Internal_VaultAccountKeyInformation_VaultDerived: Components.Schemas.InternalVaultAccountKeyInformationVaultDerived
    Internal_VaultAccountProviderInformation_Key: Components.Schemas.InternalVaultAccountProviderInformationKey
    Internal_VaultAccountProviderInformation_KeyId: Components.Schemas.InternalVaultAccountProviderInformationKeyId
    Internal_VaultAccountProviderInformation_Key_VaultDerived: Components.Schemas.InternalVaultAccountProviderInformationKeyVaultDerived
    Internal_VaultAccountProviderInformation_Key_VaultDerivedNonExtended: Components.Schemas.InternalVaultAccountProviderInformationKeyVaultDerivedNonExtended
    Internal_VaultAccountProviderInformation_Key_VaultRandom: Components.Schemas.InternalVaultAccountProviderInformationKeyVaultRandom
    Internal_VaultApiVersion: Components.Schemas.InternalVaultApiVersion
    Internal_VaultBackupParameters: Components.Schemas.InternalVaultBackupParameters
    Internal_VaultBackupParameters_VaultHsm: Components.Schemas.InternalVaultBackupParametersVaultHsm
    Internal_VaultBackupParameters_VaultMpc: Components.Schemas.InternalVaultBackupParametersVaultMpc
    Internal_VaultCreated: Components.Schemas.InternalVaultCreated
    Internal_VaultDerivation: Components.Schemas.InternalVaultDerivation
    Internal_VaultHsmBackupData: Components.Schemas.InternalVaultHsmBackupData
    Internal_VaultKeyMaterialRewrapCompleted: Components.Schemas.InternalVaultKeyMaterialRewrapCompleted
    Internal_VaultKeyMaterialRewrapFailed: Components.Schemas.InternalVaultKeyMaterialRewrapFailed
    Internal_VaultKeyStrategy: Components.Schemas.InternalVaultKeyStrategy
    Internal_VaultMpcBackupData: Components.Schemas.InternalVaultMpcBackupData
    Internal_VaultParameters: Components.Schemas.InternalVaultParameters
    Internal_VaultParameters_HSM: Components.Schemas.InternalVaultParametersHSM
    Internal_VaultParameters_MPC: Components.Schemas.InternalVaultParametersMPC
    Internal_VaultProcessingStatus: Components.Schemas.InternalVaultProcessingStatus
    Internal_VaultUpdated: Components.Schemas.InternalVaultUpdated
    Internal_WorkflowCondition: Components.Schemas.InternalWorkflowCondition
    Internal_WorkflowCondition_And: Components.Schemas.InternalWorkflowConditionAnd
    Internal_WorkflowCondition_Or: Components.Schemas.InternalWorkflowConditionOr
    Internal_WorkflowCondition_RoleQuorum: Components.Schemas.InternalWorkflowConditionRoleQuorum
    Internal_WorkflowProgress: Components.Schemas.InternalWorkflowProgress
    Internal_WorkflowStep: Components.Schemas.InternalWorkflowStep
    Internal_WorkflowStepStatus: Components.Schemas.InternalWorkflowStepStatus
    Internal_XrplClawbackCurrency: Components.Schemas.InternalXrplClawbackCurrency
    Internal_XrplClawbackCurrency_Currency: Components.Schemas.InternalXrplClawbackCurrencyCurrency
    Internal_XrplClawbackCurrency_MultiPurposeToken: Components.Schemas.InternalXrplClawbackCurrencyMultiPurposeToken
    Internal_XrplClawbackCurrency_TickerId: Components.Schemas.InternalXrplClawbackCurrencyTickerId
    Internal_XrplFeeStrategy: Components.Schemas.InternalXrplFeeStrategy
    Internal_XrplFeeStrategy_Priority: Components.Schemas.InternalXrplFeeStrategyPriority
    Internal_XrplFeeStrategy_SpecifiedAdditionalFee: Components.Schemas.InternalXrplFeeStrategySpecifiedAdditionalFee
    Internal_XrplIouCurrency: Components.Schemas.InternalXrplIouCurrency
    Internal_XrplIouCurrency_Currency: Components.Schemas.InternalXrplIouCurrencyCurrency
    Internal_XrplIouCurrency_TickerId: Components.Schemas.InternalXrplIouCurrencyTickerId
    Internal_XrplMemo: Components.Schemas.InternalXrplMemo
    Internal_XrplOperation: Components.Schemas.InternalXrplOperation
    Internal_XrplOperation_AccountSet: Components.Schemas.InternalXrplOperationAccountSet
    Internal_XrplOperation_Batch: Components.Schemas.InternalXrplOperationBatch
    Internal_XrplOperation_Clawback: Components.Schemas.InternalXrplOperationClawback
    Internal_XrplOperation_ConfidentialMPTClawback: Components.Schemas.InternalXrplOperationConfidentialMPTClawback
    Internal_XrplOperation_ConfidentialMPTConvert: Components.Schemas.InternalXrplOperationConfidentialMPTConvert
    Internal_XrplOperation_ConfidentialMPTConvertBack: Components.Schemas.InternalXrplOperationConfidentialMPTConvertBack
    Internal_XrplOperation_ConfidentialMPTMergeInbox: Components.Schemas.InternalXrplOperationConfidentialMPTMergeInbox
    Internal_XrplOperation_ConfidentialMPTSend: Components.Schemas.InternalXrplOperationConfidentialMPTSend
    Internal_XrplOperation_DepositPreauth: Components.Schemas.InternalXrplOperationDepositPreauth
    Internal_XrplOperation_EscrowFinish: Components.Schemas.InternalXrplOperationEscrowFinish
    Internal_XrplOperation_MPTokenAuthorize: Components.Schemas.InternalXrplOperationMPTokenAuthorize
    Internal_XrplOperation_MPTokenIssuanceCreate: Components.Schemas.InternalXrplOperationMPTokenIssuanceCreate
    Internal_XrplOperation_MPTokenIssuanceDestroy: Components.Schemas.InternalXrplOperationMPTokenIssuanceDestroy
    Internal_XrplOperation_MPTokenIssuanceSet: Components.Schemas.InternalXrplOperationMPTokenIssuanceSet
    Internal_XrplOperation_OfferCreate: Components.Schemas.InternalXrplOperationOfferCreate
    Internal_XrplOperation_Payment: Components.Schemas.InternalXrplOperationPayment
    Internal_XrplOperation_SponsorshipSetAsSponsee: Components.Schemas.InternalXrplOperationSponsorshipSetAsSponsee
    Internal_XrplOperation_SponsorshipSetAsSponsor: Components.Schemas.InternalXrplOperationSponsorshipSetAsSponsor
    Internal_XrplOperation_TicketCreate: Components.Schemas.InternalXrplOperationTicketCreate
    Internal_XrplOperation_TrustSet: Components.Schemas.InternalXrplOperationTrustSet
    Internal_XrplPaymentCurrency: Components.Schemas.InternalXrplPaymentCurrency
    Internal_XrplPaymentCurrency_Currency: Components.Schemas.InternalXrplPaymentCurrencyCurrency
    Internal_XrplPaymentCurrency_MultiPurposeToken: Components.Schemas.InternalXrplPaymentCurrencyMultiPurposeToken
    Internal_XrplPaymentCurrency_TickerId: Components.Schemas.InternalXrplPaymentCurrencyTickerId
    Internal_XrplSponsorshipParams: Components.Schemas.InternalXrplSponsorshipParams
    Internal_XrplTickerProperties: Components.Schemas.InternalXrplTickerProperties
    Internal_XrplTickerProperties_ConfidentialMultiPurposeToken: Components.Schemas.InternalXrplTickerPropertiesConfidentialMultiPurposeToken
    Internal_XrplTickerProperties_FungibleToken: Components.Schemas.InternalXrplTickerPropertiesFungibleToken
    Internal_XrplTickerProperties_MultiPurposeToken: Components.Schemas.InternalXrplTickerPropertiesMultiPurposeToken
    Internal_XrplTickerProperties_Native: Components.Schemas.InternalXrplTickerPropertiesNative
    Internal_Xrpl_AccountSetFlag: Components.Schemas.InternalXrplAccountSetFlag
    Internal_Xrpl_AssetQuantity: Components.Schemas.InternalXrplAssetQuantity
    Internal_Xrpl_BatchExecutionMode: Components.Schemas.InternalXrplBatchExecutionMode
    Internal_Xrpl_LimitAmount: Components.Schemas.InternalXrplLimitAmount
    Internal_Xrpl_MPTokenAuthorizeFlag: Components.Schemas.InternalXrplMPTokenAuthorizeFlag
    Internal_Xrpl_MPTokenIdentifier: Components.Schemas.InternalXrplMPTokenIdentifier
    Internal_Xrpl_MPTokenIdentifier_MPTokenIssuanceId: Components.Schemas.InternalXrplMPTokenIdentifierMPTokenIssuanceId
    Internal_Xrpl_MPTokenIdentifier_TickerId: Components.Schemas.InternalXrplMPTokenIdentifierTickerId
    Internal_Xrpl_MPTokenIssuanceCreateFlag: Components.Schemas.InternalXrplMPTokenIssuanceCreateFlag
    Internal_Xrpl_MPTokenIssuanceMutableFlag: Components.Schemas.InternalXrplMPTokenIssuanceMutableFlag
    Internal_Xrpl_MPTokenIssuanceSetFlag: Components.Schemas.InternalXrplMPTokenIssuanceSetFlag
    Internal_Xrpl_OfferCreateFlag: Components.Schemas.InternalXrplOfferCreateFlag
    Internal_Xrpl_PaymentFlag: Components.Schemas.InternalXrplPaymentFlag
    Internal_Xrpl_SponsorFlag: Components.Schemas.InternalXrplSponsorFlag
    Internal_Xrpl_SponsorshipSetFlag: Components.Schemas.InternalXrplSponsorshipSetFlag
    Internal_Xrpl_TrustSetFlag: Components.Schemas.InternalXrplTrustSetFlag
    Internal_v0_AcknowledgeBackup: Components.Schemas.InternalV0AcknowledgeBackup
    Internal_v0_AddAccountLedgers: Components.Schemas.InternalV0AddAccountLedgers
    Internal_v0_AddTrustedPublicKeysForMigration: Components.Schemas.InternalV0AddTrustedPublicKeysForMigration
    Internal_v0_AttemptTransactionOrderCancellation: Components.Schemas.InternalV0AttemptTransactionOrderCancellation
    Internal_v0_CreateAccount: Components.Schemas.InternalV0CreateAccount
    Internal_v0_CreateAccountProviderDetailsPayload: Components.Schemas.InternalV0CreateAccountProviderDetailsPayload
    Internal_v0_CreateAccountProviderDetailsPayload_Vault: Components.Schemas.InternalV0CreateAccountProviderDetailsPayloadVault
    Internal_v0_CreateBackup: Components.Schemas.InternalV0CreateBackup
    Internal_v0_CreateDomain: Components.Schemas.InternalV0CreateDomain
    Internal_v0_CreateEndpoint: Components.Schemas.InternalV0CreateEndpoint
    Internal_v0_CreateLedger: Components.Schemas.InternalV0CreateLedger
    Internal_v0_CreatePolicy: Components.Schemas.InternalV0CreatePolicy
    Internal_v0_CreateTicker: Components.Schemas.InternalV0CreateTicker
    Internal_v0_CreateTransactionOrder: Components.Schemas.InternalV0CreateTransactionOrder
    Internal_v0_CreateTransferOrder: Components.Schemas.InternalV0CreateTransferOrder
    Internal_v0_CreateUser: Components.Schemas.InternalV0CreateUser
    Internal_v0_CreateVault: Components.Schemas.InternalV0CreateVault
    Internal_v0_ExecuteExtension: Components.Schemas.InternalV0ExecuteExtension
    Internal_v0_LockAccount: Components.Schemas.InternalV0LockAccount
    Internal_v0_LockDomain: Components.Schemas.InternalV0LockDomain
    Internal_v0_LockEndpoint: Components.Schemas.InternalV0LockEndpoint
    Internal_v0_LockPolicy: Components.Schemas.InternalV0LockPolicy
    Internal_v0_LockTicker: Components.Schemas.InternalV0LockTicker
    Internal_v0_LockUser: Components.Schemas.InternalV0LockUser
    Internal_v0_LockVault: Components.Schemas.InternalV0LockVault
    Internal_v0_MigrateSilo3AccountBatch: Components.Schemas.InternalV0MigrateSilo3AccountBatch
    Internal_v0_NotarizeData: Components.Schemas.InternalV0NotarizeData
    Internal_v0_ProvisionElGamalKeyPair: Components.Schemas.InternalV0ProvisionElGamalKeyPair
    Internal_v0_RegisterTrustedPublicKey: Components.Schemas.InternalV0RegisterTrustedPublicKey
    Internal_v0_ReleaseQuarantinedTransfers: Components.Schemas.InternalV0ReleaseQuarantinedTransfers
    Internal_v0_RewrapVaultKeyMaterial: Components.Schemas.InternalV0RewrapVaultKeyMaterial
    Internal_v0_SetSystemProperty: Components.Schemas.InternalV0SetSystemProperty
    Internal_v0_SignManifest: Components.Schemas.InternalV0SignManifest
    Internal_v0_UnlockAccount: Components.Schemas.InternalV0UnlockAccount
    Internal_v0_UnlockDomain: Components.Schemas.InternalV0UnlockDomain
    Internal_v0_UnlockEndpoint: Components.Schemas.InternalV0UnlockEndpoint
    Internal_v0_UnlockPolicy: Components.Schemas.InternalV0UnlockPolicy
    Internal_v0_UnlockTicker: Components.Schemas.InternalV0UnlockTicker
    Internal_v0_UnlockUser: Components.Schemas.InternalV0UnlockUser
    Internal_v0_UnlockVault: Components.Schemas.InternalV0UnlockVault
    Internal_v0_UpdateAccount: Components.Schemas.InternalV0UpdateAccount
    Internal_v0_UpdateDomain: Components.Schemas.InternalV0UpdateDomain
    Internal_v0_UpdateDomainPermissions: Components.Schemas.InternalV0UpdateDomainPermissions
    Internal_v0_UpdateEndpoint: Components.Schemas.InternalV0UpdateEndpoint
    Internal_v0_UpdateLedger: Components.Schemas.InternalV0UpdateLedger
    Internal_v0_UpdatePolicy: Components.Schemas.InternalV0UpdatePolicy
    Internal_v0_UpdateTicker: Components.Schemas.InternalV0UpdateTicker
    Internal_v0_UpdateUser: Components.Schemas.InternalV0UpdateUser
    Internal_v0_UpdateVault: Components.Schemas.InternalV0UpdateVault
    Internal_v0_ValidateTickers: Components.Schemas.InternalV0ValidateTickers
    InternalCoreExtensions_Authentication: Components.Schemas.InternalCoreExtensionsAuthentication
    InternalCoreExtensions_DomainScope: Components.Schemas.InternalCoreExtensionsDomainScope
    InternalCoreExtensions_Notary: Components.Schemas.InternalCoreExtensionsNotary
    InternalCoreExtensions_NotificationSource: Components.Schemas.InternalCoreExtensionsNotificationSource
    InternalCoreExtensions_SystemInformation: Components.Schemas.InternalCoreExtensionsSystemInformation
    InternalCoreExtensions_UserAvailableNotificationSourceResponse: Components.Schemas.InternalCoreExtensionsUserAvailableNotificationSourceResponse
    InternalCoreExtensions_UserNotificationPreferencesUpdateRequest: Components.Schemas.InternalCoreExtensionsUserNotificationPreferencesUpdateRequest
    InternalCoreExtensions_UserSubscribedNotificationSourceResponse: Components.Schemas.InternalCoreExtensionsUserSubscribedNotificationSourceResponse
    Notification_RegisterMobile: Components.Schemas.NotificationRegisterMobile
    Notification_ResponseSignature: Components.Schemas.NotificationResponseSignature
    Notification_SecuredRegisterMobile: Components.Schemas.NotificationSecuredRegisterMobile
    Notification_SignEntity: Components.Schemas.NotificationSignEntity
    Notification_SignWeb: Components.Schemas.NotificationSignWeb
    Notification_UnregisterDevice: Components.Schemas.NotificationUnregisterDevice
    Notification_EntityToSign: Components.Schemas.NotificationEntityToSign
    Notification_ExtendedEntityToSign: Components.Schemas.NotificationExtendedEntityToSign
    Web3Connector_ConnectAccount: Components.Schemas.Web3ConnectorConnectAccount
    Web3Connector_Session: Components.Schemas.Web3ConnectorSession
    Web3Connector_SessionApproval: Components.Schemas.Web3ConnectorSessionApproval
    Web3Connector_ChangeAccount: Components.Schemas.Web3ConnectorChangeAccount
    Web3Connector_SessionEvent: Components.Schemas.Web3ConnectorSessionEvent
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type webhooks = Record<string, never>
export type $defs = Record<string, never>
export interface paths {
  "/internal/v1/vaults/current": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getCurrentVault"]
    put?: never
    post: operations["postPendingVault"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/accounts/pending": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPendingAccounts"]
    put?: never
    post: operations["postPendingAccount"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/transactions/pending": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPendingTransactions"]
    put?: never
    post: operations["postPendingTransaction"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/transactions/prepared": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPreparedTransactions"]
    put?: never
    post: operations["postPreparedTransaction"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/transactions/interrupt": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["postTransactionInterruption"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/manifests/pending": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPendingManifests"]
    put?: never
    post: operations["postPendingManifest"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/backups/pending": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPendingBackups"]
    put?: never
    post: operations["postPreparedBackup"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/rewraps/pending": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPendingRewraps"]
    put?: never
    post: operations["postPreparedRewrap"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/decrypt-cbs/pending": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPendingDecryptCbs"]
    put?: never
    post: operations["postDecryptCbsResponse"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/parameters-computed/pending": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPendingParametersComputes"]
    put?: never
    post: operations["postParametersComputeResponse"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/cmpt-cb-in": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["initiateCbInDecryption"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/cmpt-cb-in/{requestId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getCbInDecryptionStatus"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/users": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getUsers"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/users/conflicts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getUsersConflicts"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/events": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAllEvents"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/scripting": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getExampleContextV0"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/intents/context": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["intentContext"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/transaction/{transactionId}/blocker": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTransactionBlocker"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/me/settings/notifications": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: Paths.InternalV1MeSettingsNotifications.Get.QueryParameters
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.InternalV1MeSettingsNotifications.Get.Responses.$200
          }
        }
      }
    }
    put?: never
    post: {
      parameters: { query?: never; header?: never; path?: never; cookie?: never }
      requestBody?: {
        content: {
          "application/json": Paths.InternalV1MeSettingsNotifications.Post.RequestBody
          "text/json": Paths.InternalV1MeSettingsNotifications.Post.RequestBody
          "application/*+json": Components.Schemas.InternalCoreExtensionsUserNotificationPreferencesUpdateRequest
        }
      }
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.InternalV1MeSettingsNotifications.Post.Responses.$200
          }
        }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/me/settings/notifications/available": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: Paths.InternalV1MeSettingsNotificationsAvailable.Get.QueryParameters
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.InternalV1MeSettingsNotificationsAvailable.Get.Responses.$200
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/system/information": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: { query?: never; header?: never; path?: never; cookie?: never }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.InternalV1SystemInformation.Get.Responses.$200
            "text/json": Paths.InternalV1SystemInformation.Get.Responses.$200
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/register-mobile": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["NotificationController.registerMobile"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/nonce": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["NotificationController.getNonce"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/secured-register-mobile": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["NotificationController.securedRegisterMobile"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/register-web": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["NotificationController.registerWebClient"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/sign-web": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["NotificationController.signWeb"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/signature": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["NotificationController.sendSignatureToWeb"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/entity/{hash}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["NotificationController.getEntity"]
    put?: never
    post?: never
    delete: operations["NotificationController.deleteEntity"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/entity/{hash}/signature": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post?: never
    delete: operations["NotificationController.getSignedEntity"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/entities": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["NotificationController.getEntities"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/api/notifications/unregister-mobile": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["NotificationController.unregisterMobile"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/me/domains/{domainId}/session": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getConnectedSession"]
    put?: never
    post: operations["postConnect"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/me/domains/{domainId}/session/{sessionId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getDAppDetails"]
    put?: never
    post: operations["postApproveSession"]
    delete: operations["deleteDisconnect"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/me/domains/{domainId}/session/{sessionId}/change": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["postChangeAccount"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/internal/v1/me/domains/{domainId}/session/{sessionId}/events": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getSessionEvents"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export interface operations {
  getCurrentVault: {
    parameters: {
      query?: Paths.GetCurrentVault.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetCurrentVault.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetCurrentVault.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetCurrentVault.Responses.$404 }
      }
    }
  }
  postPendingVault: {
    parameters: {
      query?: Paths.PostPendingVault.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.PostPendingVault.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPendingVault.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPendingVault.Responses.$404 }
      }
    }
  }
  getPendingAccounts: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingAccounts.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingAccounts.Responses.Default }
      }
    }
  }
  postPendingAccount: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.PostPendingAccount.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPendingAccount.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPendingAccount.Responses.$404 }
      }
    }
  }
  getPendingTransactions: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingTransactions.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingTransactions.Responses.Default }
      }
    }
  }
  postPendingTransaction: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.PostPendingTransaction.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPendingTransaction.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPendingTransaction.Responses.$404 }
      }
    }
  }
  getPreparedTransactions: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPreparedTransactions.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPreparedTransactions.Responses.Default }
      }
    }
  }
  postPreparedTransaction: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.PostPreparedTransaction.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPreparedTransaction.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPreparedTransaction.Responses.$404 }
      }
    }
  }
  postTransactionInterruption: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.PostTransactionInterruption.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostTransactionInterruption.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostTransactionInterruption.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostTransactionInterruption.Responses.$409 }
      }
    }
  }
  getPendingManifests: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingManifests.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingManifests.Responses.Default }
      }
    }
  }
  postPendingManifest: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.PostPendingManifest.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPendingManifest.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPendingManifest.Responses.$404 }
      }
    }
  }
  getPendingBackups: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingBackups.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingBackups.Responses.Default }
      }
    }
  }
  postPreparedBackup: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.PostPreparedBackup.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPreparedBackup.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPreparedBackup.Responses.$404 }
      }
    }
  }
  getPendingRewraps: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingRewraps.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingRewraps.Responses.Default }
      }
    }
  }
  postPreparedRewrap: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.PostPreparedRewrap.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.PostPreparedRewrap.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostPreparedRewrap.Responses.$404 }
      }
    }
  }
  getPendingDecryptCbs: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingDecryptCbs.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingDecryptCbs.Responses.Default }
      }
    }
  }
  postDecryptCbsResponse: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.PostDecryptCbsResponse.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.PostDecryptCbsResponse.Responses.$400 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostDecryptCbsResponse.Responses.Default }
      }
    }
  }
  getPendingParametersComputes: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingParametersComputes.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPendingParametersComputes.Responses.Default }
      }
    }
  }
  postParametersComputeResponse: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: {
      content: { "application/json": Paths.PostParametersComputeResponse.RequestBody }
    }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.PostParametersComputeResponse.Responses.$400 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostParametersComputeResponse.Responses.Default }
      }
    }
  }
  initiateCbInDecryption: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.InitiateCbInDecryption.RequestBody } }
    responses: {
      202: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.InitiateCbInDecryption.Responses.$202 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.InitiateCbInDecryption.Responses.$400 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.InitiateCbInDecryption.Responses.Default }
      }
    }
  }
  getCbInDecryptionStatus: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetCbInDecryptionStatus.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetCbInDecryptionStatus.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetCbInDecryptionStatus.Responses.$400 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetCbInDecryptionStatus.Responses.Default }
      }
    }
  }
  getUsers: {
    parameters: {
      query?: Paths.GetUsers.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUsers.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUsers.Responses.$400 }
      }
    }
  }
  getUsersConflicts: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUsersConflicts.Responses.$200 }
      }
      default: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUsersConflicts.Responses.Default }
      }
    }
  }
  getAllEvents: {
    parameters: {
      query?: Paths.GetAllEvents.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllEvents.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetAllEvents.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllEvents.Responses.$401 }
      }
    }
  }
  getExampleContextV0: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetExampleContextV0.Responses.$200 }
      }
    }
  }
  intentContext: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.IntentContext.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.IntentContext.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.IntentContext.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.IntentContext.Responses.$401 }
      }
    }
  }
  getTransactionBlocker: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetTransactionBlocker.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransactionBlocker.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTransactionBlocker.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransactionBlocker.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransactionBlocker.Responses.$404 }
      }
    }
  }
  "NotificationController.registerMobile": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: {
      content: { "application/json": Paths.NotificationControllerRegisterMobile.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "text/html; charset=utf-8": unknown; "application/json": unknown }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.getNonce": {
    parameters: {
      query?: Paths.NotificationControllerGetNonce.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "text/html; charset=utf-8": unknown; "application/json": unknown }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.securedRegisterMobile": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: {
      content: { "application/json": Paths.NotificationControllerSecuredRegisterMobile.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "text/html; charset=utf-8": unknown; "application/json": unknown }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      401: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.registerWebClient": {
    parameters: {
      query?: Paths.NotificationControllerRegisterWebClient.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "text/html; charset=utf-8": unknown; "text/event-stream": unknown }
      }
      202: { headers: { [name: string]: unknown }; content?: never }
      400: { headers: { [name: string]: unknown }; content?: never }
      403: { headers: { [name: string]: unknown }; content: { "application/json": unknown } }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.signWeb": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: {
      content: { "application/json": Paths.NotificationControllerSignWeb.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "text/html; charset=utf-8": unknown; "application/json": unknown }
      }
      202: { headers: { [name: string]: unknown }; content?: never }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.sendSignatureToWeb": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: {
      content: { "application/json": Paths.NotificationControllerSendSignatureToWeb.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "text/html; charset=utf-8": unknown; "application/json": unknown }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.getEntity": {
    parameters: {
      query?: never
      header?: never
      path: Paths.NotificationControllerGetEntity.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "text/html; charset=utf-8": unknown
          "application/json": Paths.NotificationControllerGetEntity.Responses.$200
        }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.deleteEntity": {
    parameters: {
      query?: never
      header?: never
      path: Paths.NotificationControllerDeleteEntity.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "text/html; charset=utf-8": unknown
          "application/json": Paths.NotificationControllerDeleteEntity.Responses.$200
        }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.getSignedEntity": {
    parameters: {
      query?: never
      header?: never
      path: Paths.NotificationControllerGetSignedEntity.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "text/html; charset=utf-8": unknown
          "application/json": Paths.NotificationControllerGetSignedEntity.Responses.$200
        }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.getEntities": {
    parameters: {
      query?: Paths.NotificationControllerGetEntities.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "text/html; charset=utf-8": unknown
          "application/json": Paths.NotificationControllerGetEntities.Responses.$200
        }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  "NotificationController.unregisterMobile": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: {
      content: { "application/json": Paths.NotificationControllerUnregisterMobile.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "text/html; charset=utf-8": unknown; "application/json": unknown }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  getConnectedSession: {
    parameters: {
      query?: Paths.GetConnectedSession.QueryParameters
      header?: never
      path: Paths.GetConnectedSession.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetConnectedSession.Responses.$200 }
      }
    }
  }
  postConnect: {
    parameters: {
      query?: never
      header?: never
      path: Paths.PostConnect.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.PostConnect.RequestBody } }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PostConnect.Responses.$201 }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      408: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  getDAppDetails: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetDAppDetails.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetDAppDetails.Responses.$200 }
      }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  postApproveSession: {
    parameters: {
      query?: never
      header?: never
      path: Paths.PostApproveSession.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.PostApproveSession.RequestBody } }
    responses: {
      204: { headers: { [name: string]: unknown }; content?: never }
      400: { headers: { [name: string]: unknown }; content?: never }
      408: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  deleteDisconnect: {
    parameters: {
      query?: never
      header?: never
      path: Paths.DeleteDisconnect.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: { 200: { headers: { [name: string]: unknown }; content?: never } }
  }
  postChangeAccount: {
    parameters: {
      query?: never
      header?: never
      path: Paths.PostChangeAccount.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.PostChangeAccount.RequestBody } }
    responses: { 400: { headers: { [name: string]: unknown }; content?: never } }
  }
  getSessionEvents: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetSessionEvents.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSessionEvents.Responses.$200 }
      }
    }
  }
}
