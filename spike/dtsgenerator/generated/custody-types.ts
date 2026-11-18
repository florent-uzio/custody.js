/**
 * SPIKE (dtsgenerator 4.0.2): generated from the merged superset of every public spec.
 * Do not make direct changes.
 */

export declare namespace Components {
  namespace Schemas {
    /**
     * Agent involved in the transfer
     */
    export type ComplianceAgent = {
      /**
       * The DID identifier of the agent
       */
      "@id": string
      /**
       * The party this agent is acting for
       */
      for?: string
      /**
       * The role of the agent
       */
      role: "VASP" | "Custodian" | "SettlementAddress" | "SourceAddress" | "Gateway" | "Unknown"
    }
    /**
     * Request to append PII to a travel rule transfer
     */
    export type ComplianceAppendPIIRequest = {
      ivms101: /* IVMS101 data structure for travel rule compliance */ ComplianceIVMS101
      originator?: /* Identifier for a party in a transfer */ ComplianceTransferPartyIdentifier
      beneficiary?: /* Identifier for a party in a transfer */ ComplianceTransferPartyIdentifier
    }
    /**
     * Direct response from the provider for append PII
     */
    export type ComplianceAppendPIIResponse = {
      /**
       * Success message
       */
      message?: string
    }
    /**
     * Response from appending PII to a travel rule transfer
     */
    export type ComplianceAppendPIITravelRuleResponse = {
      appendPIIResponse?: /* Direct response from the provider for append PII */ ComplianceAppendPIIResponse
      suggestedIntentId?: string // uuid
      complianceTravelRuleId?: string // uuid
    }
    export type ComplianceChainalysisAlert = {
      alertLevel: "SEVERE" | "HIGH" | "MEDIUM" | "LOW" | "NO_RISK_DETECTED"
      exposureType: "DIRECT"
      externalLink: string
      category?: string
    }
    export type ComplianceComplianceAnalysis =
      | {
          provider: "ELLIPTIC"
          id?: string // uuid
          domainId?: string // uuid
          intentId?: string // uuid
          transferId?: string // uuid
          transactionOrderId?: string // uuid
          transactionHash?: string
          addressHash?: string
          errorDetails?: string
          warningDetails?: string
          screenedAt?: string // date-time
          ledgerId: string
          analysisType: "WALLET" | "TRANSACTION"
          screeningStatus: string
          riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN"
          screeningDetail?: ComplianceScreeningDetailElliptic
        }
      | {
          provider: "CHAINALYSIS"
          id?: string // uuid
          domainId?: string // uuid
          intentId?: string // uuid
          transferId?: string // uuid
          transactionOrderId?: string // uuid
          transactionHash?: string
          addressHash?: string
          errorDetails?: string
          warningDetails?: string
          screenedAt?: string // date-time
          ledgerId: string
          analysisType: "WALLET" | "TRANSACTION"
          screeningStatus: string
          riskLevel?: "UNKNOWN" | "SEVERE" | "HIGH" | "MEDIUM" | "LOW" | "NO_RISK_DETECTED"
          screeningDetail?: ComplianceScreeningDetailChainalysis
        }
      | {
          provider: "ELLIPTIC"
          id?: string // uuid
          domainId?: string // uuid
          intentId?: string // uuid
          transferId?: string // uuid
          transactionOrderId?: string // uuid
          transactionHash?: string
          addressHash?: string
          errorDetails?: string
          warningDetails?: string
          screenedAt?: string // date-time
          ledgerId: string
          analysisType: "WALLET" | "TRANSACTION"
          screeningStatus: string
          riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN" | "NOT_SCREENABLE"
          screeningDetail?: ComplianceScreeningDetailElliptic
        }
      | {
          provider: "CHAINALYSIS"
          id?: string // uuid
          domainId?: string // uuid
          intentId?: string // uuid
          transferId?: string // uuid
          transactionOrderId?: string // uuid
          transactionHash?: string
          addressHash?: string
          errorDetails?: string
          warningDetails?: string
          screenedAt?: string // date-time
          ledgerId: string
          analysisType: "WALLET" | "TRANSACTION"
          screeningStatus: string
          riskLevel?:
            | "UNKNOWN"
            | "SEVERE"
            | "HIGH"
            | "MEDIUM"
            | "LOW"
            | "NO_RISK_DETECTED"
            | "NOT_SCREENABLE"
          screeningDetail?: ComplianceScreeningDetailChainalysis
        }
    export type ComplianceComplianceAnalysisRequest = {
      data: ComplianceComplianceAnalysisRequestData[]
    }
    export type ComplianceComplianceAnalysisRequestData = {
      domainId?: string // uuid
      id?: string // uuid
    }
    export type ComplianceComplianceAnalysisResponse = {
      result: ComplianceComplianceAnalysis[]
    }
    export type ComplianceConfigurationDetailResponse = {
      domainId?: string // uuid
      connectionDetails?: ComplianceProviderConnectionResponse[]
      configurationSteps?: ComplianceConfigurationStepResponse[]
    }
    export type ComplianceConfigurationStepResponse = {
      name?:
        | "ADD_RISK_SETTING_RULES"
        | "ADD_POLICY_FOR_OUTGOING_ORDERS"
        | "ADD_POLICY_FOR_AUTOMATIC_RELEASE_QUARANTINED_TRANSFERS"
        | "ADD_EXCEPTION_FOR_OUTGOING_ORDERS"
        | "ADD_EXCEPTION_FOR_RELEASE_QUARANTINED_TRANSFERS"
      mandatory?: boolean
      shared?: boolean
      configurationStepType?: "RISK_SETTING" | "POLICY" | "AGENT"
      provider?: "ELLIPTIC" | "CHAINALYSIS"
      status?: "START" | "PENDING" | "VIEW"
    }
    export type ComplianceConfigureScreeningRulesRequest = {
      rules: (
        | ComplianceTransactionScreeningRuleElliptic
        | ComplianceTransactionScreeningRuleChainalysis
      )[]
    }
    /**
     * Request to create a relationship with a travel rule provider
     */
    export type ComplianceCreateRelationshipRequest = {
      /**
       * The DID of the source entity. Defaults to the entityDID from the domain credentials.
       * example:
       * did:web:ripple.com:test:us
       */
      from?: string // did ^did:[a-z0-9]+:.+$
      /**
       * The DID of the target entity.
       * example:
       * did:web:example.com:test:counterparty
       */
      to: string // did ^did:[a-z0-9]+:.+$
    }
    /**
     * Direct response from the travel rule provider when creating a transfer
     */
    export type ComplianceCreateTransfer201Response = {
      transfer?: /* Travel rule transfer details from the provider */ ComplianceTransfer
    }
    /**
     * Request to create a travel rule transfer
     */
    export type ComplianceCreateTransferRequest = {
      originator: /* Identifier for a party in a transfer */ ComplianceTransferPartyIdentifier
      beneficiary: /* Identifier for a party in a transfer */ ComplianceTransferPartyIdentifier
      /**
       * Asset identifier (e.g., bip122:000000000019d6689c085ae165831e93/slip44:0)
       */
      asset: string
      /**
       * Transfer amount
       */
      amount: string
      /**
       * Reference identifier for the transfer
       */
      ref: string // ^[a-zA-Z0-9_-]{1,64}$
      /**
       * Agents involved in the transfer (e.g., VASP, SourceAddress, SettlementAddress)
       */
      agents: /* Agent involved in the transfer */ ComplianceAgent[]
      /**
       * Settlement identifier for the transfer
       */
      settlementId?: string
      /**
       * The fiat value of the transaction
       */
      transactionValue?: {
        /**
         * The fiat amount
         * example:
         * 150.75
         */
        amount: string
        /**
         * The currency code (e.g., USD)
         * example:
         * USD
         */
        currency: string
      }
      /**
       * Optional analytics alias
       * example:
       * My Wallet
       */
      blockchainAnalyticsAlias?: string
    }
    export type ComplianceDomainPayloadRequest = {
      domainName: string
      domainType: "COMPLIANCE" | "BUSINESS"
      users?: ComplianceUser[]
      permissions: {
        [key: string]: any
      }
      childrenDomainIds?: string /* uuid */[]
      additionalPolicies?: (
        | "ADD_POLICY_FOR_OUTGOING_ORDERS"
        | "ADD_POLICY_FOR_AUTOMATIC_RELEASE_QUARANTINED_TRANSFERS"
      )[]
    }
    export type ComplianceErrorResponse = {
      reason: string
      message?: string
    }
    export type ComplianceExceptionRoleResponse = {
      complianceDomainId: string // uuid
      domainId: string // uuid
      policyId: string // uuid
      transactionType: "INCOMING" | "OUTGOING"
      exceptionRole?: string
    }
    export type ComplianceGetScreeningRulesResponse = {
      rules?: (
        | ComplianceTransactionScreeningRuleElliptic
        | ComplianceTransactionScreeningRuleChainalysis
      )[]
    }
    /**
     * Response from getting a travel rule transfer
     */
    export type ComplianceGetTravelRuleTransferResponse = {
      transfer?: /* Travel rule transfer details from the provider */ ComplianceTransfer
      /**
       * The intentId the client needs to initiate the intent with
       */
      suggestedIntentId?: string // uuid
      /**
       * The id associated with this travel rule record on Compliance side
       */
      complianceTravelRuleId?: string // uuid
    }
    /**
     * IVMS101 data structure for travel rule compliance
     */
    export type ComplianceIVMS101 = {
      originator?: /* Originator information in IVMS101 format */ ComplianceIVMS101Originator
      beneficiary?: /* Beneficiary information in IVMS101 format */ ComplianceIVMS101Beneficiary
    }
    /**
     * Beneficiary information in IVMS101 format
     */
    export type ComplianceIVMS101Beneficiary = {
      beneficiaryPerson?: /* Person information in IVMS101 format */ ComplianceIVMS101Person[]
      accountNumber?: string
    }
    export type ComplianceIVMS101DateAndPlaceOfBirth = {
      dateOfBirth: string // date
      placeOfBirth: string
    }
    export type ComplianceIVMS101GeographicAddress = {
      /**
       * Type of address (e.g., HOME, BIZZ, GEOG)
       */
      addressType: string
      /**
       * Street name - required if addressLine not provided
       */
      streetName?: string
      /**
       * Building number - required if addressLine not provided
       */
      buildingNumber?: string
      /**
       * Full address line(s) - use this OR streetName/buildingNumber
       */
      addressLine?: string[]
      /**
       * Postal code (optional)
       */
      postCode?: string
      /**
       * Town or city name
       */
      townName: string
      /**
       * State, province, or region (e.g., NY)
       */
      countrySubDivision?: string
      /**
       * Country code (ISO-3166 Alpha-2, e.g., US)
       */
      country: string
    }
    /**
     * Legal person (organization) information
     */
    export type ComplianceIVMS101LegalPerson = {
      name: /* Name information for legal person */ ComplianceIVMS101LegalPersonName
      geographicAddress?: ComplianceIVMS101GeographicAddress[]
      nationalIdentification?: /* National identification information */ ComplianceIVMS101NationalIdentification
      /**
       * Customer identification number assigned by the VASP
       */
      customerIdentification?: string
      /**
       * ISO-3166-1 alpha-2 country code where the legal person is registered
       */
      countryOfRegistration?: string
    }
    /**
     * Name information for legal person
     */
    export type ComplianceIVMS101LegalPersonName = {
      nameIdentifier: ComplianceIVMS101LegalPersonNameIdentifier[]
    }
    export type ComplianceIVMS101LegalPersonNameIdentifier = {
      /**
       * Legal person name
       */
      legalPersonName: string
      /**
       * Type of legal person name identifier (e.g., LEGL, SHRT, TRAD)
       */
      legalPersonNameIdentifierType: string
    }
    /**
     * Name information for natural person
     */
    export type ComplianceIVMS101Name = {
      nameIdentifier: ComplianceIVMS101NameIdentifier[]
    }
    export type ComplianceIVMS101NameIdentifier = {
      /**
       * Primary name identifier (e.g., surname)
       */
      primaryIdentifier: string
      /**
       * Secondary name identifier (e.g., given name)
       */
      secondaryIdentifier?: string
      /**
       * Type of name identifier (e.g., LEGL, BIRT, MAID, TRAD)
       */
      naturalPersonNameIdentifierType: string
    }
    /**
     * National identification information
     */
    export type ComplianceIVMS101NationalIdentification = {
      /**
       * National identifier number
       */
      nationalIdentifier: string
      /**
       * Type of national identifier (e.g., ARNU, CCPT, RAID, DRLC, FIIN, TXID, SOCS, IDCD, LEIX, MISC)
       */
      nationalIdentifierType: string
      /**
       * Authority that issued the identifier (optional)
       */
      registrationAuthority?: string
      /**
       * Country of issue (ISO-3166 Alpha-2)
       */
      countryOfIssue?: string
    }
    /**
     * Natural person information
     */
    export type ComplianceIVMS101NaturalPerson = {
      name: /* Name information for natural person */ ComplianceIVMS101Name
      dateAndPlaceOfBirth?: ComplianceIVMS101DateAndPlaceOfBirth
      geographicAddress?: ComplianceIVMS101GeographicAddress[]
      nationalIdentification?: /* National identification information */ ComplianceIVMS101NationalIdentification
      /**
       * Customer identification number assigned by the VASP
       */
      customerIdentification?: string
    }
    /**
     * Originator information in IVMS101 format
     */
    export type ComplianceIVMS101Originator = {
      originatorPerson?: /* Person information in IVMS101 format */ ComplianceIVMS101Person[]
      accountNumber?: string
    }
    /**
     * Person information in IVMS101 format
     */
    export type ComplianceIVMS101Person = {
      naturalPerson?: /* Natural person information */ ComplianceIVMS101NaturalPerson
      legalPerson?: /* Legal person (organization) information */ ComplianceIVMS101LegalPerson
    }
    /**
     * Response from creating a travel rule transfer
     */
    export type ComplianceInitiateTravelRuleResponse = {
      createTransfer201Response?: /* Direct response from the travel rule provider when creating a transfer */ ComplianceCreateTransfer201Response
      /**
       * The intentId the client needs to initiate the intent with
       */
      suggestedIntentId?: string // uuid
      /**
       * The id associated with this travel rule record on Compliance side
       */
      complianceTravelRuleId?: string // uuid
    }
    export type ComplianceLoginId = {
      providerId: string
      id: string
    }
    /**
     * Proof of ownership for an address or entity
     */
    export type ComplianceOwnershipProof = {
      /**
       * The blockchain address being proven
       * example:
       * 0x1234567890abcdef1234567890abcdef12345678
       */
      address: string
      /**
       * The blockchain network
       * example:
       * ethereum
       */
      chain?: string
      /**
       * Status of the ownership proof
       * example:
       * VERIFIED
       */
      status: "PENDING" | "CONFIRMED" | "VERIFIED" | "REJECTED"
      /**
       * Cryptographic signature proving ownership
       * example:
       * 0xabcdef...
       */
      signature?: string
      /**
       * The message that was signed
       * example:
       * I own this address
       */
      message?: string
      /**
       * When the proof was created
       * example:
       * 2026-03-10T14:30:00.0000000+00:00
       */
      timestamp?: string // date-time
    }
    export type CompliancePolicyPayloadRequest = {
      policyType: "AUTOMATIC" | "EXCEPTION"
      transactionType: "INCOMING" | "OUTGOING"
      approvalWorkflow?: {
        [key: string]: any
      }
      exceptionRole?: string
      lockStatus: "Locked" | "Unlocked" | "Archived"
    }
    export type CompliancePolicyResponse = {
      policyId?: string
      policyName: string
      policyType: "AUTOMATIC" | "EXCEPTION"
      transactionType: "INCOMING" | "OUTGOING"
      approvalWorkflow?: {
        [key: string]: any
      }
      exceptionRole?: string
      rank?: number
      error?: string
      lockStatus: "Locked" | "Unlocked" | "Archived"
    }
    /**
     * Request to present encrypted PII to a travel rule transfer
     */
    export type CompliancePresentPIIRequest = {
      ivms101: /* IVMS101 data structure for travel rule compliance */ ComplianceIVMS101
    }
    /**
     * Direct response from the provider for present PII
     */
    export type CompliancePresentPIIResponse = {
      /**
       * Success message
       */
      message?: string
    }
    /**
     * Response from presenting encrypted PII to a travel rule transfer
     */
    export type CompliancePresentPIITravelRuleResponse = {
      presentPIIResponse?: /* Direct response from the provider for present PII */ CompliancePresentPIIResponse
      suggestedIntentId?: string // uuid
      complianceTravelRuleId?: string // uuid
    }
    export type ComplianceProviderConnectRequest =
      | {
          provider: "ELLIPTIC"
          credential: {
            apiKey: string
            secret: string
          }
        }
      | {
          provider: "CHAINALYSIS"
          credential: {
            apiKey: string
          }
        }
      | {
          provider: "NOTABENE"
          credential: {
            clientId: string
            clientSecret: string
            entityDid: string
            audience: string
          }
        }
    export type ComplianceProviderConnectionResponse = {
      connectionId?: string // uuid
      provider?: "ELLIPTIC" | "CHAINALYSIS" | "NOTABENE"
      status?: "CONNECTED" | "PAUSED"
      readyForScreening?: boolean
      previewScreeningEnabled?: boolean
    }
    export type ComplianceProviderConnectionsResponse = {
      domainId?: string // uuid
      complianceDomainId?: string // uuid
      domainType?: "COMPLIANCE" | "BUSINESS"
      data?: ComplianceProviderConnectionResponse[]
    }
    /**
     * List of relationships from the travel rule provider
     */
    export type ComplianceRelationshipList = {
      /**
       * Array of relationship objects with ownership proofs
       */
      relationships?: /* A relationship between two entities with ownership proofs */ ComplianceRelationshipWithProofs[]
    }
    /**
     * A relationship between two entities with ownership proofs
     */
    export type ComplianceRelationshipWithProofs = {
      /**
       * Unique identifier for the relationship
       * example:
       * urn:uuid:12345678-1234-1234-1234-123456789abc
       */
      "@id": string
      /**
       * Decentralized Identifier (DID) of the source entity
       * example:
       * did:web:ripple.com:test:us
       */
      from: string // did ^did:[a-z0-9]+:.+$
      /**
       * Decentralized Identifier (DID) of the target entity
       * example:
       * did:web:example.com:test:counterparty
       */
      to: string // did ^did:[a-z0-9]+:.+$
      /**
       * Decentralized Identifier (DID) of the custodian entity (optional)
       * example:
       * did:web:custodian.com:test:vault
       */
      custodian?: string // did ^did:[a-z0-9]+:.+$
      /**
       * Current state of the relationship
       * example:
       * CONFIRMED
       */
      status: "UNCONFIRMED" | "CONFIRMED" | "REJECTED"
      /**
       * Decentralized Identifier (DID) of the entity that confirmed the relationship
       * example:
       * did:web:example.com:test:counterparty
       */
      confirmedBy?: string // did ^did:[a-z0-9]+:.+$
      /**
       * Ownership proofs associated with this relationship
       */
      proofs?: /* Proof of ownership for an address or entity */ ComplianceOwnershipProof[]
    }
    export type ComplianceRiskLevelActionChainalysis = {
      action: "APPROVE" | "REJECT" | "REQUIRE_EXPLICIT_DECISION"
    }
    export type ComplianceRiskLevelActionElliptic = {
      condition:
        | "EQUALS"
        | "GREATER_THAN"
        | "LESS_THAN"
        | "GREATER_THAN_OR_EQUALS"
        | "LESS_THAN_OR_EQUALS"
      threshold: number
      action: "APPROVE" | "REJECT" | "REQUIRE_EXPLICIT_DECISION"
    }
    export type ComplianceScreeningDetailChainalysis = {
      alerts?: ComplianceChainalysisAlert[]
      directCounterparty?: string
    }
    export type ComplianceScreeningDetailElliptic = {
      walletCategory?: string
      referenceLink: string
      referenceId: string
      riskScoreValue: string
    }
    export type ComplianceTransactionScreeningRuleChainalysis = {
      transactionType: "INCOMING" | "OUTGOING"
      lowRisk: ComplianceRiskLevelActionChainalysis
      highRisk: ComplianceRiskLevelActionChainalysis
      mediumRisk?: ComplianceRiskLevelActionChainalysis
      severeRisk?: ComplianceRiskLevelActionChainalysis
      unknownRisk?: ComplianceRiskLevelActionChainalysis
      unknownCategory?: ComplianceRiskLevelActionChainalysis
      /**
       * Action for incoming transfers the provider could not screen. INCOMING only; rejected on OUTGOING. Optional: when omitted, the stored rule is left unchanged. A stored rule cannot be deleted; set it to REQUIRE_EXPLICIT_DECISION, which behaves the same as having no rule.
       */
      notScreenable?: {
        action: "APPROVE" | "REJECT" | "REQUIRE_EXPLICIT_DECISION"
      }
    }
    export type ComplianceTransactionScreeningRuleElliptic = {
      transactionType: "INCOMING" | "OUTGOING"
      lowRisk: ComplianceRiskLevelActionElliptic
      highRisk: ComplianceRiskLevelActionElliptic
    }
    /**
     * Travel rule transfer details from the provider
     */
    export type ComplianceTransfer = {
      /**
       * The ID of the transfer
       */
      "@id"?: string // uuid
      /**
       * The ID of the transfer (alternative field name)
       */
      id?: string // uuid
      /**
       * The status of the transfer
       */
      status?:
        | "OUTGOING"
        | "INCOMING"
        | "REJECTED"
        | "AUTHORIZED"
        | "FLAGGED"
        | "SETTLED"
        | "FLAGGED-SETTLEMENT"
        | "RETURNED"
        | "FROZEN"
        | "CLEARED"
      /**
       * The direction of the transfer
       */
      direction?: "INCOMING" | "OUTGOING"
      /**
       * The reference provided in the request
       */
      ref?: string
      /**
       * The asset being transferred
       */
      asset?: string
      /**
       * The amount being transferred
       */
      amount?: string
      originator?: /* Party information in a transfer */ ComplianceTransferParty
      beneficiary?: /* Party information in a transfer */ ComplianceTransferParty
      agents?: /* Agent involved in the transfer */ ComplianceAgent[]
      /**
       * The transaction id of the settlement transaction
       */
      settlementId?: string
      /**
       * Whether the transfer requires travel rule compliance
       */
      isTravelRule?: boolean
      /**
       * URL for the presentation definition
       */
      presentationDefinitionUrl?: string
      /**
       * When the transfer was created
       */
      createdAt?: string // date-time
      /**
       * When the transfer was last updated
       */
      updatedAt?: string // date-time
      /**
       * When the transfer was settled
       */
      settledAt?: string // date-time
      /**
       * When the transfer was rejected
       */
      rejectedAt?: string // date-time
      /**
       * Reason for rejection if the transfer was rejected
       */
      rejectionReason?: string
    }
    /**
     * Party information in a transfer
     */
    export type ComplianceTransferParty = {
      /**
       * The DID identifier of the party
       */
      "@id"?: string
      /**
       * The account number of the party
       */
      accountNumber?: string
      /**
       * The name of the party
       */
      name?: string
    }
    /**
     * Identifier for a party in a transfer
     */
    export type ComplianceTransferPartyIdentifier = {
      /**
       * DID or identifier for the party
       */
      "@id": string
    }
    /**
     * Individual travel rule detail for a single request
     */
    export type ComplianceTravelRuleDetail = {
      provider?: "NOTABENE"
      id?: string // uuid
      domainId?: string // uuid
      intentId?: string // uuid
      transferId?: string // uuid
      transactionOrderId?: string // uuid
      travelRuleStatus?:
        | "OUTGOING"
        | "INCOMING"
        | "REJECTED"
        | "AUTHORIZED"
        | "FLAGGED"
        | "SETTLED"
        | "FLAGGED_SETTLEMENT"
        | "RETURNED"
        | "FROZEN"
        | "CLEARED"
      travelRuleMessageId?: string
      compliedAt?: string // date-time
      errorDetails?: string
      direction?: "INCOMING" | "OUTGOING"
      transfer?: /* Travel rule transfer details from the provider */ ComplianceTransfer
    }
    /**
     * Request to retrieve travel rule details for a batch of domain and ID pairs
     */
    export type ComplianceTravelRuleDetailsRequest = {
      data: ComplianceTravelRuleDetailsRequestData[]
    }
    export type ComplianceTravelRuleDetailsRequestData = {
      /**
       * The custody domain ID
       */
      domainId: string // uuid
      /**
       * The ID to look up. Can be an intent ID, transfer ID, or transaction order ID associated with a travel rule record
       */
      id: string // uuid
    }
    /**
     * Response containing travel rule details for a batch of requests
     */
    export type ComplianceTravelRuleDetailsResponse = {
      /**
       * List of travel rule details
       */
      result: /* Individual travel rule detail for a single request */ ComplianceTravelRuleDetail[]
    }
    export type ComplianceUser = {
      id: string // uuid
      alias: string
      publicKey?: string
      roles: string[]
      lockStatus: "Locked" | "Unlocked" | "Archived"
      loginIds?: ComplianceLoginId[]
    }
    export type ComplianceValidateComplianceDomainCreationRequest = {
      childrenDomainIds?: string /* uuid */[]
    }
    export type ComplianceValidateComplianceDomainCreationResponse = {
      allowed?: boolean
      reason?: string
    }
    export type ComplianceWalletAnalysisRequest =
      | {
          provider: "ELLIPTIC"
          walletAddress: string
        }
      | {
          provider: "CHAINALYSIS"
          walletAddress: string
          transactionAmount: number
          ledger: string
          tickerId: string
        }
      | {
          provider: "ELLIPTIC"
          walletAddress: string
          /**
           * Harmonize ledger id of the wallet
           */
          ledger: string
          /**
           * Harmonize ticker id of the asset; when omitted the Elliptic asset pre-check is skipped and the wallet is screened on its address only
           */
          tickerId?: string
        }
    export type ComplianceWalletAnalysisResponse =
      | {
          provider: "CHAINALYSIS"
          walletAddress: string
          transactionAmount?: number
          ledger: string
          transactionType: "INCOMING" | "OUTGOING"
          screenedAt?: string // date-time
          errorDetails?: string
          warningDetails?: string
          riskLevel?: "UNKNOWN" | "SEVERE" | "HIGH" | "MEDIUM" | "LOW" | "NO_RISK_DETECTED"
          screeningDetail?: ComplianceScreeningDetailChainalysis
        }
      | {
          provider: "ELLIPTIC"
          walletAddress: string
          transactionAmount?: number
          ledger: string
          transactionType: "INCOMING" | "OUTGOING"
          screenedAt?: string // date-time
          errorDetails?: string
          warningDetails?: string
          riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN"
          screeningDetail?: ComplianceScreeningDetailElliptic
        }
      | {
          provider: "CHAINALYSIS"
          walletAddress: string
          transactionAmount?: number
          ledger: string
          transactionType: "INCOMING" | "OUTGOING"
          screenedAt?: string // date-time
          errorDetails?: string
          warningDetails?: string
          riskLevel?:
            | "UNKNOWN"
            | "SEVERE"
            | "HIGH"
            | "MEDIUM"
            | "LOW"
            | "NO_RISK_DETECTED"
            | "NOT_SCREENABLE"
          screeningDetail?: ComplianceScreeningDetailChainalysis
        }
      | {
          provider: "ELLIPTIC"
          walletAddress: string
          transactionAmount?: number
          ledger: string
          transactionType: "INCOMING" | "OUTGOING"
          screenedAt?: string // date-time
          errorDetails?: string
          warningDetails?: string
          riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN" | "NOT_SCREENABLE"
          screeningDetail?: ComplianceScreeningDetailElliptic
        }
    export type CoreAccount = {
      id: string // uuid
      domainId: string // uuid
      alias: string
      ledgerId?: string
      providerDetails: CoreAccountProviderInformation
      lock: CoreLockStatus
      metadata: CoreEntityMetadata
      ledgerIds?: string[]
    }
    export type CoreAccountAdditionalDetails = {
      processing: CoreAccountProcessingDetails
      /**
       * Deletion target: Mar. 31st 2027
       */
      lastBalancesUpdateRequestedAt?: string // date-time
      /**
       * Deletion target: Mar. 31st 2027
       */
      lastBalancesUpdateProcessedAt?: string // date-time
      ledgers: CoreApiAccountLedgerProcessing[]
    }
    export type CoreAccountAddress = {
      data: CoreAccountAddressData
      /**
       * Deletion target: Dec. 1st 2024
       */
      id: string // uuid
      /**
       * Deletion target: Dec. 1st 2024
       */
      ledgerId: string
      /**
       * Deletion target: Dec. 1st 2024
       */
      address: string
      /**
       * Deletion target: Dec. 1st 2024
       */
      keyPath?: string
      signature?: string // base64
      signingKey?: string // base64
      /**
       * Deletion target: Dec. 1st 2024
       */
      createdAt: string // date-time
      /**
       * Deletion target: Dec. 1st 2024
       * example:
       * External
       */
      scope: "Internal" | "External"
    }
    export type CoreAccountAddressData = {
      id: string // uuid
      ledgerId: string
      domainId?: string // uuid
      accountId?: string // uuid
      address: string
      keyPath?: string
      createdAt: string // date-time
      /**
       * example:
       * External
       */
      scope: "Internal" | "External"
    }
    export type CoreAccountAddressReference = {
      id: string // uuid
      address: string
      ledgerId: string
      domainId: string // uuid
      accountId: string // uuid
      createdAt: string // date-time
      custodyType: CoreCustodyType
      type: "AccountAddressReference"
    }
    export type CoreAccountAddressScope = "Internal" | "External"
    export type CoreAccountCreated = {
      id: string // uuid
      type: "AccountCreated"
    }
    export type CoreAccountKeyStrategy = "VaultHard" | "VaultSoft" | "Random"
    export type CoreAccountLedgerProcessingDetails =
      | CoreAccountLedgerProcessingDetailsPending
      | CoreAccountLedgerProcessingDetailsPreparing
      | CoreAccountLedgerProcessingDetailsRecovering
      | CoreAccountLedgerProcessingDetailsTracked
    export type CoreAccountLedgerProcessingDetailsPending = {
      hint?: CoreAccountLedgerProcessingDetailsPendingHint
      status: "Pending"
    }
    export type CoreAccountLedgerProcessingDetailsPendingHint = "TransientIssue" | "InternalError"
    export type CoreAccountLedgerProcessingDetailsPreparing = {
      hint?: CoreAccountLedgerProcessingDetailsPreparingHint
      status: "Preparing"
    }
    export type CoreAccountLedgerProcessingDetailsPreparingHint = "TransientIssue" | "InternalError"
    export type CoreAccountLedgerProcessingDetailsRecovering = {
      hint?: CoreAccountLedgerProcessingDetailsRecoveringHint
      status: "Recovering"
    }
    export type CoreAccountLedgerProcessingDetailsRecoveringHint =
      | "TransientIssue"
      | "InternalError"
    export type CoreAccountLedgerProcessingDetailsTracked = {
      hint?: CoreAccountLedgerProcessingDetailsTrackedHint
      status: "Tracked"
    }
    export type CoreAccountLedgerProcessingDetailsTrackedHint = "TransientIssue" | "InternalError"
    export type CoreAccountLedgerStatus = "Activating" | "AwaitingLedgerActivation" | "Activated"
    export type CoreAccountProcessingDetails =
      | CoreAccountProcessingDetailsCompleted
      | CoreAccountProcessingDetailsInterrupted
      | CoreAccountProcessingDetailsPending
      | CoreAccountProcessingDetailsPreparing
      | CoreAccountProcessingDetailsRecovering
      | CoreAccountProcessingDetailsTracked
    export type CoreAccountProcessingDetailsCompleted = {
      status: "Completed"
    }
    export type CoreAccountProcessingDetailsInterrupted = {
      reason: string
      status: "Interrupted"
    }
    export type CoreAccountProcessingDetailsPending = {
      hint?: CoreApiPendingAccountProcessingHint
      status: "Pending"
    }
    export type CoreAccountProcessingDetailsPreparing = {
      hint?: CoreApiPreparingAccountProcessingHint
      status: "Preparing"
    }
    export type CoreAccountProcessingDetailsRecovering = {
      hint?: CoreApiRecoveringAccountProcessingHint
      status: "Recovering"
    }
    export type CoreAccountProcessingDetailsTracked = {
      status: "Tracked"
    }
    export type CoreAccountProcessingStatus =
      | "Pending"
      | "Preparing"
      | "Tracked"
      | "Recovering"
      | "Completed"
      | "Interrupted"
    export type CoreAccountProvider = {
      id: string // uuid
      provider: CoreAccountProviderType
      alias: string
      lock: CoreLockStatus
      metadata: CoreEntityMetadata
    }
    export type CoreAccountProviderAction = CoreAccountProviderActionExternal
    export type CoreAccountProviderActionExternal = {
      publicKey: CoreApiAccountProviderKey
      type: "External"
    }
    export type CoreAccountProviderAdditionalDetails = {
      processing: CoreAccountProviderProcessingDetails
    }
    export type CoreAccountProviderCreated = {
      id: string // uuid
      type: "AccountProviderCreated"
    }
    export type CoreAccountProviderInformation =
      | CoreAccountProviderInformationVault
      | CoreAccountProviderInformationExternal
    export type CoreAccountProviderInformationExternal = {
      providerId: string // uuid
      locationId: string // uuid
      providerAccountId?: string // uuid
      type: "External"
    }
    export type CoreAccountProviderInformationVault = {
      vaultId: string // uuid
      keyStrategy: CoreAccountKeyStrategy
      keyInformation: CoreVaultAccountKeyInformation
      keys?: CoreVaultAccountProviderInformationKey[]
      type: "Vault"
      purposeKeys: CorePurposeKey[]
    }
    export type CoreAccountProviderKey = {
      publicKey: string // base64
      status?: CoreAccountProviderKeyStatus
      predecessor?: string // base64
      keySignature?: string // base64
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      validAfterSequenceId?: string
      details?: string
    }
    export type CoreAccountProviderKeyStatus =
      | "AwaitingActivation"
      | "ActivationFailed"
      | "Active"
      | "Replaced"
    export type CoreAccountProviderProcessingDetails =
      | CoreAccountProviderProcessingDetailsCompleted
      | CoreAccountProviderProcessingDetailsPending
      | CoreAccountProviderProcessingDetailsPreparing
    export type CoreAccountProviderProcessingDetailsCompleted = {
      type: "Completed"
    }
    export type CoreAccountProviderProcessingDetailsPending = {
      type: "Pending"
    }
    export type CoreAccountProviderProcessingDetailsPreparing = {
      type: "Preparing"
    }
    export type CoreAccountProviderProcessingStatus = "Pending" | "Preparing" | "Completed"
    export type CoreAccountProviderType = CoreAccountProviderTypeExternalProvider
    export type CoreAccountProviderTypeExternalProvider = {
      publicKeys: CoreAccountProviderKey[]
      type: "ExternalProvider"
    }
    export type CoreAccountProviderUpdated = {
      id: string // uuid
      type: "AccountProviderUpdated"
    }
    export type CoreAccountPublicKey =
      | CoreAccountPublicKeyExtendedPublicKey
      | CoreAccountPublicKeyPublicKey
    export type CoreAccountPublicKeyExtendedOnly = CoreAccountPublicKeyExtendedOnlyExtendedPublicKey
    export type CoreAccountPublicKeyExtendedOnlyExtendedPublicKey = {
      value: string // base64
      chainCode: string // base64
      type: "ExtendedPublicKey"
    }
    export type CoreAccountPublicKeyExtendedPublicKey = {
      value: string // base64
      chainCode: string // base64
      type: "ExtendedPublicKey"
    }
    export type CoreAccountPublicKeyOnly = CoreAccountPublicKeyOnlyPublicKey
    export type CoreAccountPublicKeyOnlyPublicKey = {
      value: string // base64
      type: "PublicKey"
    }
    export type CoreAccountPublicKeyPublicKey = {
      value: string // base64
      type: "PublicKey"
    }
    export type CoreAccountReference = {
      id: string // uuid
      domainId: string // uuid
    }
    export type CoreAccountUpdated = {
      id: string // uuid
      type: "AccountUpdated"
    }
    export type CoreAccountsCollection = {
      items: CoreApiAccount[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreAddressCreated = {
      id: string // uuid
      accountReference: CoreAccountReference
      type: "AddressCreated"
    }
    export type CoreAddressDetails = {
      address: string
      resolvedEndpoints: CoreResolvedEndpoint[]
    }
    /**
     * Override default change address strategy to set explicitly PrimaryAddress or GenerateNewAddress.
     */
    export type CoreAddressForChange = "GenerateNewAddress" | "PrimaryAddress"
    export type CoreAddressReferenceCollection = {
      items: CoreAddressesReference[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreAddressesCollection = {
      items: CoreAccountAddress[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreAddressesReference =
      | CoreAccountAddressReference
      | CoreDepositInstructionsReference
    export type CoreAlgorandFeeStrategy = CoreAlgorandFeeStrategyPriority
    export type CoreAlgorandFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreAlgorandOperation = CoreAlgorandOperationPayment
    export type CoreAlgorandOperationPayment = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "Payment"
    }
    export type CoreAlgorandTickerProperties = CoreAlgorandTickerPropertiesNative
    export type CoreAlgorandTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreAntiRewindMode = "STRICT" | "BALANCED" | "DISABLED"
    export type CoreAntiRewindModeValue = {
      mode: CoreAntiRewindMode
    }
    export type CoreApiAccount = {
      data: CoreAccount
      signature: string // base64
      signingKey: string // base64
      additionalDetails?: CoreAccountAdditionalDetails
    }
    export type CoreApiAccountLedgerProcessing =
      | CoreApiAccountLedgerProcessingActivated
      | CoreApiAccountLedgerProcessingActivating
      | CoreApiAccountLedgerProcessingAvailable
      | CoreApiAccountLedgerProcessingAwaitingLedgerActivation
      | CoreApiAccountLedgerProcessingUnavailable
    export type CoreApiAccountLedgerProcessingActivated = {
      ledgerId: string
      lastBalancesUpdateRequestedAt?: string // date-time
      lastBalancesUpdateProcessedAt?: string // date-time
      status: "Activated"
    }
    export type CoreApiAccountLedgerProcessingActivating = {
      ledgerId: string
      processing: CoreAccountLedgerProcessingDetails
      status: "Activating"
    }
    export type CoreApiAccountLedgerProcessingAvailable = {
      ledgerId: string
      status: "Available"
    }
    export type CoreApiAccountLedgerProcessingAwaitingLedgerActivation = {
      ledgerId: string
      status: "AwaitingLedgerActivation"
    }
    export type CoreApiAccountLedgerProcessingUnavailable = {
      ledgerId: string
      status: "Unavailable"
    }
    export type CoreApiAccountProviderKey = {
      publicKey: string // base64
    }
    export type CoreApiBackup = {
      id: string // uuid
      data: CoreApiBackupData
      metadata: CoreEntityMetadata
      additionalDetails?: CoreBackupAdditionalDetails
    }
    export type CoreApiBackupData = CoreApiBackupDataVaultHSM | CoreApiBackupDataVaultMPC
    export type CoreApiBackupDataVaultHSM = {
      vaultId: string // uuid
      acknowledged: boolean
      type: "VaultHSM"
    }
    export type CoreApiBackupDataVaultMPC = {
      vaultId: string // uuid
      acknowledged: boolean
      type: "VaultMPC"
    }
    export type CoreApiBatchSignerSigningData = {
      participant: CoreParticipant
      account: string
      /**
       * Hex encoded string.
       */
      signingPayload: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      signingPayloadHash: string // ^[A-Fa-f0-9]*$
    }
    export type CoreApiBatchSigningData = {
      /**
       * Deprecated: not signable under Batch v1.1; use signers[].signingPayload
       */
      signingPayload: string // ^[A-Fa-f0-9]*$
      /**
       * Deprecated: not signable under Batch v1.1; use signers[].signingPayload
       */
      signingPayloadHash: string // ^[A-Fa-f0-9]*$
      executionMode: CoreXrplBatchExecutionMode
      transactions: CoreApiInnerTransactionData[]
      /**
       * One entry per required BatchSigner, sorted by AccountID. Sign signingPayload and return the signature in batchSigners with the same participant.
       */
      signers: CoreApiBatchSignerSigningData[]
    }
    export type CoreApiBroadcastingTransactionProcessingHint =
      | "CurrentlyFeesTooSmall"
      | "CurrentlyRejectedByLedger"
      | "InternalError"
      | "TransientIssue"
    export type CoreApiDryRunTransactionProcessingHint =
      | "AccountAlreadyActivatedOnLedger"
      | "AccountNotReadyOnLedger"
      | "BroadcastExpired"
      | "CurrentlyFeesTooLarge"
      | "CurrentlyFeesTooSmall"
      | "CurrentlyFundsTooFragmented"
      | "CurrentlyNotEnoughFunds"
      | "CurrentlyUnusableDestination"
      | "InternalError"
      | "InvalidAccountStateOnLedger"
      | "InvalidAmount"
      | "InvalidContractParameters"
      | "InvalidDestination"
      | "InvalidUserPayload"
      | "LockedDestination"
      | "OnLedgerFailure"
      | "ReplacementTransactionFeesTooLow"
      | "TransactionEstimationFailure"
      | "TransactionNotEligibleForReplacement"
      | "TransactionRejected"
      | "TransientIssue"
      | "InvalidBatchSignature"
    export type CoreApiFailedTransactionProcessingHint =
      | "AccountAlreadyActivatedOnLedger"
      | "BroadcastExpired"
      | "InternalError"
      | "InvalidAccountStateOnLedger"
      | "InvalidAmount"
      | "InvalidContractParameters"
      | "InvalidDestination"
      | "InvalidUserPayload"
      | "LockedDestination"
      | "OnLedgerFailure"
      | "ReplacementTransactionFeesTooLow"
      | "TransactionNotEligibleForReplacement"
      | "TransactionRejected"
      | "TransientIssue"
      | "InvalidBatchSignature"
    export type CoreApiInitiateParametersComputeRequest =
      CoreApiInitiateParametersComputeRequestCmptSend
    export type CoreApiInitiateParametersComputeRequestCmptSend = {
      tokenIdentifier: CoreXrplResolvedMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      destination: string
      ticketSequence?: number // int32
      ledgerId: string
    }
    export type CoreApiInitiateParametersComputeResponse = {
      id: string // uuid
      status: string
    }
    export type CoreApiInnerTransactionData = {
      account: string
      operation: CoreXrplResolvedBatchInnerOperation
      sequencing: CoreResolvedSequencing
    }
    export type CoreApiInterruptedTransactionCause = "Cancellation" | "Internal" | "Replacement"
    export type CoreApiLocation = {
      data: CoreLocation
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreApiManifest = {
      data: CoreManifest
      signature: string // base64
      signingKey: string // base64
      additionalDetails?: CoreManifestAdditionalDetails
    }
    export type CoreApiParametersComputeCryptographicFields =
      | CoreApiParametersComputeCryptographicFieldsClawback
      | CoreApiParametersComputeCryptographicFieldsConvert
      | CoreApiParametersComputeCryptographicFieldsConvertBack
      | CoreApiParametersComputeCryptographicFieldsSend
    export type CoreApiParametersComputeCryptographicFieldsClawback = {
      /**
       * Hex encoded string.
       */
      zkProof: string // ^[A-Fa-f0-9]*$
      amount: number // int64
    }
    export type CoreApiParametersComputeCryptographicFieldsConvert = {
      /**
       * Hex encoded string.
       */
      holderEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      issuerEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      blindingFactor: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      zkProof?: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      auditorEncryptedAmount?: string // ^[A-Fa-f0-9]*$
    }
    export type CoreApiParametersComputeCryptographicFieldsConvertBack = {
      /**
       * Hex encoded string.
       */
      holderEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      issuerEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      blindingFactor: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      balanceCommitment: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      zkProof: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      auditorEncryptedAmount?: string // ^[A-Fa-f0-9]*$
    }
    export type CoreApiParametersComputeCryptographicFieldsSend = {
      /**
       * Hex encoded string.
       */
      senderEncryptedBalance?: string // ^[A-Fa-f0-9]*$
      senderEncryptedBalanceVersion?: number // int64
      /**
       * Hex encoded string.
       */
      senderEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      destinationEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      issuerEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      balanceCommitment: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      amountCommitment: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      zkProof: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      auditorEncryptedAmount?: string // ^[A-Fa-f0-9]*$
    }
    export type CoreApiParametersComputeStatusResponse = {
      id: string // uuid
      status: string
      cryptographicFields?: CoreApiParametersComputeCryptographicFields
    }
    export type CoreApiPendingAccountProcessingHint = "TransientIssue" | "InternalError"
    export type CoreApiPendingTransactionProcessingHint = "InternalError" | "TransientIssue"
    export type CoreApiPreparingAccountProcessingHint = "TransientIssue" | "InternalError"
    export type CoreApiPreparingTransactionProcessingHint =
      | "AccountAlreadyActivatedOnLedger"
      | "AccountNotReadyOnLedger"
      | "CurrentlyFeesTooLarge"
      | "CurrentlyFeesTooSmall"
      | "CurrentlyFundsTooFragmented"
      | "CurrentlyNotEnoughFunds"
      | "CurrentlyUnusableDestination"
      | "InternalError"
      | "InvalidAccountStateOnLedger"
      | "InvalidContractParameters"
      | "InvalidDestination"
      | "OnLedgerFailure"
      | "TransactionEstimationFailure"
      | "TransientIssue"
    export type CoreApiProvider = {
      data: CoreAccountProvider
      signature: string // base64
      signingKey: string // base64
      additionalDetails?: CoreAccountProviderAdditionalDetails
    }
    export type CoreApiRecoveringAccountProcessingHint = "TransientIssue" | "InternalError"
    export type CoreApiRelatedTransaction = {
      id: string // uuid
    }
    export type CoreApiRoles = {
      roles: string /* [a-z0-9\-]+ */[]
    }
    export type CoreApiTicker = {
      /**
       * Deletion target: Mar. 31st 2027
       */
      id: string // uuid
      /**
       * Deletion target: Mar. 31st 2027
       */
      ledgerId: string
      kind: CoreTickerKind
      /**
       * Deletion target: Mar. 31st 2027
       */
      name: string
      /**
       * Deletion target: Mar. 31st 2027
       */
      decimals?: number // int32
      /**
       * Deletion target: Mar. 31st 2027
       */
      symbol?: string
      ledgerDetails: CoreTickerLedgerDetails
      data: CoreApiTickerData
      signature?: string // base64
    }
    export type CoreApiTickerData = {
      id: string // uuid
      ledgerId: string
      kind: CoreTickerKind
      name: string
      decimals?: number // int32
      symbol?: string
      ledgerDetails: CoreTickerLedgerDetails
      lock: CoreLockStatus
      metadata?: CoreEntityMetadata
    }
    export type CoreApiTransaction = {
      id: string // uuid
      ledgerId: string
      orderReference?: CoreTransactionOrderReference
      relatedAccounts: CoreTransactionRelatedAccountReference[]
      processing?: CoreApiTransactionProcessingDetails
      registeredAt: string // date-time
      ledgerTransactionData?: CoreLedgerTransactionData
      relatedTransactions: CoreApiRelatedTransaction[]
    }
    export type CoreApiTransactionProcessingDetails =
      | CoreApiTransactionProcessingDetailsBroadcasting
      | CoreApiTransactionProcessingDetailsCompleted
      | CoreApiTransactionProcessingDetailsFailed
      | CoreApiTransactionProcessingDetailsInterrupted
      | CoreApiTransactionProcessingDetailsPending
      | CoreApiTransactionProcessingDetailsPrepared
      | CoreApiTransactionProcessingDetailsPreparing
      | CoreApiTransactionProcessingDetailsReserved
    export type CoreApiTransactionProcessingDetailsBroadcasting = {
      hint?: CoreApiBroadcastingTransactionProcessingHint
      status: "Broadcasting"
    }
    export type CoreApiTransactionProcessingDetailsCompleted = {
      status: "Completed"
    }
    export type CoreApiTransactionProcessingDetailsFailed = {
      hint: CoreApiFailedTransactionProcessingHint
      status: "Failed"
    }
    export type CoreApiTransactionProcessingDetailsInterrupted = {
      reason: string
      cause: CoreApiInterruptedTransactionCause
      status: "Interrupted"
    }
    export type CoreApiTransactionProcessingDetailsPending = {
      hint?: CoreApiPendingTransactionProcessingHint
      status: "Pending"
    }
    export type CoreApiTransactionProcessingDetailsPrepared = {
      status: "Prepared"
    }
    export type CoreApiTransactionProcessingDetailsPreparing = {
      hint?: CoreApiPreparingTransactionProcessingHint
      status: "Preparing"
    }
    export type CoreApiTransactionProcessingDetailsReserved = {
      status: "Reserved"
    }
    export type CoreApiTransfer = {
      id: string // uuid
      transactionId?: string // uuid
      tickerId: string // uuid
      quarantined: boolean
      quarantineStatus?: CoreQuarantineStatus
      senders: CoreSenderTransferParty[]
      recipient?: CoreRecipientTransferParty
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      kind: CoreTransferKind
      registeredAt: string // date-time
      metadata: CoreTransferMetadata
    }
    export type CoreApiTrustedBackup = {
      data: CoreBackup
      signature: string // base64
      signingKey: string // base64
      additionalDetails?: CoreBackupAdditionalDetails
    }
    export type CoreApiVault = {
      data: CoreVault
      signature: string // base64
      signingKey: string // base64
      additionalDetails?: CoreVaultAdditionalDetails
    }
    export type CoreApprovalDecision = "Approve" | "Reject"
    export type CoreApprove = {
      author: CoreUserReference
      /**
       * Deletion target: Mar. 31st 2027
       */
      expiryAt?: string // date-time
      targetDomainId: string // uuid
      intentId: string // uuid
      proposalSignature: string // base64
      approvalReason?: string
      type: "Approve"
    }
    export type CoreApproveIntentBody = {
      request: CoreApprove
      signature: string // base64
    }
    export type CoreAuthorizationReference = {
      transactionOrderId: string // uuid
    }
    export type CoreBackup = {
      id: string // uuid
      data: CoreBackupData
      metadata: CoreEntityMetadata
    }
    export type CoreBackupAdditionalDetails = {
      processing: CoreBackupProcessingDetails
    }
    export type CoreBackupCreated = {
      id: string // uuid
      type: "BackupCreated"
    }
    export type CoreBackupData = CoreBackupDataVaultHsm | CoreBackupDataVaultMpc
    export type CoreBackupDataVaultHsm = {
      vaultId: string // uuid
      data: CoreVaultHsmBackupData
      type: "VaultHsm"
    }
    export type CoreBackupDataVaultMpc = {
      vaultId: string // uuid
      data?: CoreVaultMpcBackupData
      type: "VaultMpc"
    }
    export type CoreBackupProcessingDetails =
      | CoreBackupProcessingDetailsCompleted
      | CoreBackupProcessingDetailsFailed
      | CoreBackupProcessingDetailsPending
      | CoreBackupProcessingDetailsPreparing
    export type CoreBackupProcessingDetailsCompleted = {
      status: "Completed"
    }
    export type CoreBackupProcessingDetailsFailed = {
      status: "Failed"
    }
    export type CoreBackupProcessingDetailsPending = {
      status: "Pending"
    }
    export type CoreBackupProcessingDetailsPreparing = {
      status: "Preparing"
    }
    export type CoreBackupProcessingStatus = "Pending" | "Preparing" | "Completed" | "Failed"
    export type CoreBackupType = "VaultHsm" | "VaultMpc"
    export type CoreBackupUpdated = {
      id: string // uuid
      type: "BackupUpdated"
    }
    export type CoreBackupsCollection = {
      items: CoreApiBackup[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreBalance = {
      accountReference: CoreAccountReference
      tickerId: string // uuid
      /**
       * This field is a large integer that can be negative, zero, or positive. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      totalAmount: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      reservedAmount: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      quarantinedAmount: string
      /**
       * This field is a large integer that can be negative, zero, or positive. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      availableAmount: string
      lastUpdatedAt: string // date-time
    }
    export type CoreBalanceWithConfirmedAmount = {
      accountReference: CoreAccountReference
      tickerId: string // uuid
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      confirmedAmount: string
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      unconfirmedAmount: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      reservedAmount: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      quarantinedAmount: string
    }
    export type CoreBalancesCollection = {
      items: CoreBalance[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreBalancesUpdated = {
      accountReference: CoreAccountReference
      tickerIds: string /* uuid */[]
      type: "BalancesUpdated"
    }
    export type CoreBatchEntry =
      | CoreBatchEntryParticipantOperation
      | CoreBatchEntrySubmitterOperation
    export type CoreBatchEntryParticipantOperation = {
      participant: CoreParticipant
      operation: CoreBatchInnerOperation
      sequencing: CoreParticipantSequencing
      sponsorship?: CoreXrplSponsorshipParams
      type: "ParticipantOperation"
    }
    export type CoreBatchEntrySubmitterOperation = {
      operation: CoreBatchInnerOperation
      sequencing: CoreSequencing
      sponsorship?: CoreXrplSponsorshipParams
      type: "SubmitterOperation"
    }
    export type CoreBatchInnerOperation =
      | CoreBatchInnerOperationAccountSet
      | CoreBatchInnerOperationClawback
      | CoreBatchInnerOperationConfidentialMPTConvert
      | CoreBatchInnerOperationConfidentialMPTConvertBack
      | CoreBatchInnerOperationConfidentialMPTMergeInbox
      | CoreBatchInnerOperationConfidentialMPTSend
      | CoreBatchInnerOperationDepositPreauth
      | CoreBatchInnerOperationEscrowFinish
      | CoreBatchInnerOperationMPTokenAuthorize
      | CoreBatchInnerOperationMPTokenIssuanceCreate
      | CoreBatchInnerOperationMPTokenIssuanceDestroy
      | CoreBatchInnerOperationMPTokenIssuanceSet
      | CoreBatchInnerOperationOfferCreate
      | CoreBatchInnerOperationPayment
      | CoreBatchInnerOperationTicketCreate
      | CoreBatchInnerOperationTrustSet
    export type CoreBatchInnerOperationAccountSet = {
      setFlag?: CoreXrplAccountSetFlag
      clearFlag?: CoreXrplAccountSetFlag
      transferRate?: number // int32
      type: "AccountSet"
    }
    export type CoreBatchInnerOperationClawback = {
      currency: CoreXrplClawbackCurrency
      holder: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Clawback"
    }
    export type CoreBatchInnerOperationConfidentialMPTConvert = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "ConfidentialMPTConvert"
    }
    export type CoreBatchInnerOperationConfidentialMPTConvertBack = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "ConfidentialMPTConvertBack"
    }
    export type CoreBatchInnerOperationConfidentialMPTMergeInbox = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      type: "ConfidentialMPTMergeInbox"
    }
    export type CoreBatchInnerOperationConfidentialMPTSend = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount?: string
      /**
       * Hex encoded string.
       */
      senderEncryptedBalance?: string // ^[A-Fa-f0-9]*$
      senderEncryptedBalanceVersion?: number // int64
      cryptographicFields?: CoreCmptCryptographicFields
      type: "ConfidentialMPTSend"
    }
    export type CoreBatchInnerOperationDepositPreauth = {
      authorize?: CoreTransactionDestination
      unauthorize?: CoreTransactionDestination
      type: "DepositPreauth"
    }
    export type CoreBatchInnerOperationEscrowFinish = {
      owner: CoreTransactionDestination
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
    export type CoreBatchInnerOperationMPTokenAuthorize = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      flags: CoreXrplMPTokenAuthorizeFlag[]
      holder?: CoreTransactionDestination
      type: "MPTokenAuthorize"
    }
    export type CoreBatchInnerOperationMPTokenIssuanceCreate = {
      flags: CoreXrplMPTokenIssuanceCreateFlag[]
      assetScale?: number // int32
      /**
       * Transfer fee for MultiPurposeToken, must be from 0 to 50000
       */
      transferFee?: number // int32
      /**
       * This field is a unsigned 64bit integer that can store values in range from 0 to 18446744073709551615.It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumAmount?: string
      metadata?: CoreMPTokenIssuanceMetadata
      type: "MPTokenIssuanceCreate"
    }
    export type CoreBatchInnerOperationMPTokenIssuanceDestroy = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      type: "MPTokenIssuanceDestroy"
    }
    export type CoreBatchInnerOperationMPTokenIssuanceSet = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      holder?: CoreTransactionDestination
      flags: CoreXrplMPTokenIssuanceSetFlag[]
      issuerEncryptionKey?: string
      auditorEncryptionKey?: string
      mutableFlags: CoreXrplMPTokenIssuanceMutableFlag[]
      type: "MPTokenIssuanceSet"
    }
    export type CoreBatchInnerOperationOfferCreate = {
      flags: CoreXrplOfferCreateFlag[]
      takerGets: CoreXrplAssetQuantity
      takerPays: CoreXrplAssetQuantity
      type: "OfferCreate"
    }
    export type CoreBatchInnerOperationPayment = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      destinationTag?: number // int64
      currency?: CoreXrplPaymentCurrency
      flags?: CoreXrplPaymentFlag[]
      type: "Payment"
    }
    export type CoreBatchInnerOperationTicketCreate = {
      /**
       * Number of tickets to create, must be from 1 to 250
       */
      ticketCount: number // int32
      type: "TicketCreate"
    }
    export type CoreBatchInnerOperationTrustSet = {
      flags: CoreXrplTrustSetFlag[]
      limitAmount: CoreXrplLimitAmount
      enableRippling?: boolean
      type: "TrustSet"
    }
    export type CoreBatchSigner = {
      participant: CoreParticipant
      /**
       * Hex encoded string.
       */
      publicKey: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      signature: string // ^[A-Fa-f0-9]*$
    }
    export type CoreBitcoinFee = {
      /**
       * This field is a large decimal and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      satoshiPerVbyte: string
    }
    export type CoreBitcoinFeeStrategy =
      | CoreBitcoinFeeStrategyPriority
      | CoreBitcoinFeeStrategySpecifiedRate
    export type CoreBitcoinFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreBitcoinFeeStrategySpecifiedRate = {
      /**
       * This field is a large decimal and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      satoshiPerVbyte: string
      type: "SpecifiedRate"
    }
    export type CoreBitcoinLikeVaultLedgerIdentifier = "btc" | "ltc" | "bch" | "doge" | "dash"
    export type CoreBitcoinOnLedgerDataInput = {
      accountReference?: CoreAccountReference
      address?: string
      index: number // int32
      scriptPubKey?: string
      transactionHash?: string
    }
    export type CoreBitcoinOnLedgerDataOutput = {
      accountReference?: CoreAccountReference
      address?: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      index: number // int32
      scriptPubKey: string
    }
    export type CoreBitcoinOutputParameters = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      paysFee?: boolean
    }
    export type CoreBitcoinResourceStrategy = CoreBitcoinResourceStrategyOrderReplacement
    export type CoreBitcoinResourceStrategyOrderReplacement = {
      transactionOrderId: string // uuid
      reason?: string
      type: "OrderReplacement"
    }
    export type CoreBitcoinTickerProperties = CoreBitcoinTickerPropertiesNative
    export type CoreBitcoinTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreCantonOperation =
      | CoreCantonOperationAccept
      | CoreCantonOperationCreateNativeTransferPreapproval
      | CoreCantonOperationCreateParty
      | CoreCantonOperationCreateTokenTransferPreapproval
      | CoreCantonOperationNativeTransfer
      | CoreCantonOperationReject
      | CoreCantonOperationTokenTransfer
      | CoreCantonOperationWithdraw
    export type CoreCantonOperationAccept = {
      contractId: string
      type: "Accept"
    }
    export type CoreCantonOperationCreateNativeTransferPreapproval = {
      type: "CreateNativeTransferPreapproval"
    }
    export type CoreCantonOperationCreateParty = {
      type: "CreateParty"
    }
    export type CoreCantonOperationCreateTokenTransferPreapproval = {
      tickerId: string // uuid
      type: "CreateTokenTransferPreapproval"
    }
    export type CoreCantonOperationNativeTransfer = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      executeBefore?: string // date-time
      memo?: string
      type: "NativeTransfer"
    }
    export type CoreCantonOperationReject = {
      contractId: string
      type: "Reject"
    }
    export type CoreCantonOperationTokenTransfer = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      tickerId: string // uuid
      executeBefore?: string // date-time
      memo?: string
      type: "TokenTransfer"
    }
    export type CoreCantonOperationWithdraw = {
      contractId: string
      type: "Withdraw"
    }
    export type CoreCantonTickerProperties =
      | CoreCantonTickerPropertiesInstrument
      | CoreCantonTickerPropertiesNative
    export type CoreCantonTickerPropertiesInstrument = {
      instrumentAdmin: string
      instrumentId: string
      type: "Instrument"
    }
    export type CoreCantonTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreCardanoFeeStrategy = CoreCardanoFeeStrategyPriority
    export type CoreCardanoFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreCardanoOperation =
      | CoreCardanoOperationDelegateRepresentative
      | CoreCardanoOperationDelegateStaking
      | CoreCardanoOperationRegisterStaking
      | CoreCardanoOperationTransfer
      | CoreCardanoOperationUnregisterStaking
      | CoreCardanoOperationWithdrawRewards
    export type CoreCardanoOperationDelegateRepresentative = {
      parameters: CoreDelegateRepresentativeParameters
      type: "DelegateRepresentative"
    }
    export type CoreCardanoOperationDelegateStaking = {
      /**
       * A valid Cardano pool id
       * example:
       * pool1ywpt43nttzjd7883wafg255mh0hmjypwe65ercw6p2sxg5lt7ez
       */
      poolId: string
      type: "DelegateStaking"
    }
    export type CoreCardanoOperationRegisterStaking = {
      type: "RegisterStaking"
    }
    export type CoreCardanoOperationTransfer = {
      outputs: CoreCardanoOutputParameters[]
      type: "Transfer"
    }
    export type CoreCardanoOperationUnregisterStaking = {
      type: "UnregisterStaking"
    }
    export type CoreCardanoOperationWithdrawRewards = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "WithdrawRewards"
    }
    export type CoreCardanoOutputParameters = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      paysFee?: boolean
    }
    export type CoreCardanoTickerProperties = CoreCardanoTickerPropertiesNative
    export type CoreCardanoTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreCmptCryptographicFields =
      | CoreCmptCryptographicFieldsClawback
      | CoreCmptCryptographicFieldsConvert
      | CoreCmptCryptographicFieldsConvertBack
      | CoreCmptCryptographicFieldsSend
    export type CoreCmptCryptographicFieldsClawback = {
      zkProof: string // base64
      amount: number // int64
      type: "Clawback"
    }
    export type CoreCmptCryptographicFieldsConvert = {
      holderEncryptedAmount: string // base64
      issuerEncryptedAmount: string // base64
      blindingFactor: string // base64
      zkProof?: string // base64
      auditorEncryptedAmount?: string // base64
      type: "Convert"
    }
    export type CoreCmptCryptographicFieldsConvertBack = {
      holderEncryptedAmount: string // base64
      issuerEncryptedAmount: string // base64
      blindingFactor: string // base64
      balanceCommitment: string // base64
      zkProof: string // base64
      auditorEncryptedAmount?: string // base64
      type: "ConvertBack"
    }
    export type CoreCmptCryptographicFieldsSend = {
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
    export type CoreComplianceConfiguration = {
      accountId: string // uuid
      domainId: string // uuid
      skipQuarantineFrom: CoreSkipQuarantineScope
      metadata: CoreEntityMetadata
    }
    export type CoreComplianceConfigurationUpdated = {
      accountReference: CoreAccountReference
      skipQuarantineFrom: CoreSkipQuarantineScope
      revision: number // int64
      modifiedBy?: CoreUserReference
      type: "ComplianceConfigurationUpdated"
    }
    export type CoreComplianceConfigurationsCollection = {
      items: CoreComplianceConfiguration[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreContractParameters = CoreContractParametersRaw
    export type CoreContractParametersRaw = {
      /**
       * Hex encoded string.
       */
      value: string // ^[A-Fa-f0-9]*$
      type: "Raw"
    }
    export type CoreCreateAccountDryRunResult = {
      ledgers: CoreResultLedger[]
    }
    export type CoreCreateDomainGenesisPolicy = {
      id: string // uuid
      alias: string
      rank: number // int32
      intentTypes?: CoreIntentType[]
      scope: CorePolicyScope
      scriptingEngine: CoreScriptingEngine
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
      CorePolicyCondition
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
      CoreWorkflowCondition[]
      lock: CoreIntentLockStatus
      description?: string
      customProperties: CoreStringsMap
      intentOrigin?: CoreIntentOrigin
    }
    export type CoreCreateDomainGenesisUser = {
      id: string // uuid
      alias: string
      publicKey: string // base64
      roles: string /* [a-z0-9\-]+ */[]
      lock: CoreIntentLockStatus
      description?: string
      customProperties: CoreStringsMap
      /**
       * Domain-unique `loginId`-`loginProviderId` pairs. Must be specified for login and match pre-configured values. Required when proposing or dry-running the intent; absent only on intents created before login ids existed.
       */
      loginIds?: CoreLoginId[]
    }
    export type CoreCreateDomainsPayload = {
      id: string // uuid
      alias: string
      lock: CoreIntentLockStatus
      governingStrategy?: CoreGoverningStrategy
      permissions: CorePermissions
      description?: string
      customProperties: CoreStringsMap
      users: CoreCreateDomainGenesisUser[]
      policies: CoreCreateDomainGenesisPolicy[]
      descendants: CoreCreateDomainsPayload[]
    }
    export type CoreCreateLedgerGenesis = {
      id: string
      alias: string
      parameters: CoreLedgerParameters
      description?: string
      customProperties: CoreStringsMap
    }
    export type CoreCreateTransferOrderOutput = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      paysFee?: boolean
      tag?: CoreTransferDestinationTag
    }
    /**
     * A list of all entities created during genesis.
     */
    export type CoreCreatedEntitiesReferences = {
      rootUsers: CoreCreatedEntitiesReferencesUser[]
      rootPolicies: CoreCreatedEntitiesReferencesPolicy[]
    }
    export type CoreCreatedEntitiesReferencesPolicy = {
      id: string // uuid
    }
    export type CoreCreatedEntitiesReferencesUser = {
      id: string // uuid
    }
    export type CoreCurrentFees =
      | CoreCurrentFeesBitcoin
      | CoreCurrentFeesEthereum
      | CoreCurrentFeesStellar
      | CoreCurrentFeesXRPL
    export type CoreCurrentFeesBitcoin = {
      high: CoreBitcoinFee
      medium: CoreBitcoinFee
      low: CoreBitcoinFee
      type: "Bitcoin"
    }
    export type CoreCurrentFeesEthereum = {
      high: CoreEthereumFee
      medium: CoreEthereumFee
      low: CoreEthereumFee
      type: "Ethereum"
    }
    export type CoreCurrentFeesStellar = {
      high: CoreStellarFee
      medium: CoreStellarFee
      low: CoreStellarFee
      type: "Stellar"
    }
    export type CoreCurrentFeesXRPL = {
      high: CoreXrplFee
      medium: CoreXrplFee
      low: CoreXrplFee
      type: "XRPL"
    }
    export type CoreCustodyType = "SelfCustody" | "SubCustody"
    export type CoreDecisionPayload = {
      author: CoreUserReference
      authorRoles: string /* [a-z0-9\-]+ */[]
      seenBySystemAt: string // date-time
      expiryAt?: string // date-time
      decision: CoreApprovalDecision
      approvalReason?: string
      rejectionReason?: string
      rawRequest: string
      signature: string // base64
    }
    export type CoreDelegateRepresentativeParameters =
      CoreDelegateRepresentativeParametersAlwaysAbstain
    export type CoreDelegateRepresentativeParametersAlwaysAbstain = {
      type: "AlwaysAbstain"
    }
    export type CoreDepositInstructions = {
      id: string // uuid
      tickerId: string // uuid
      account: CoreAccountReference
      providerDetails?: CoreDepositInstructionsProviderDetails
      expiryAt?: string // date-time
      instructions?: CoreDepositInstructionsDetails
      metadata: CoreEntityMetadata
    }
    export type CoreDepositInstructionsCreated = {
      id: string // uuid
      type: "DepositInstructionsCreated"
    }
    export type CoreDepositInstructionsDetails = CoreDepositInstructionsDetailsAddress
    export type CoreDepositInstructionsDetailsAddress = {
      address: string
      memo?: string
      tag?: string
      type: "Address"
    }
    export type CoreDepositInstructionsProviderDetails =
      | CoreDepositInstructionsProviderDetailsCompleted
      | CoreDepositInstructionsProviderDetailsFailed
    export type CoreDepositInstructionsProviderDetailsCompleted = {
      expiryAt: string // date-time
      instructions: CoreDepositInstructionsDetails
      status: "Completed"
    }
    export type CoreDepositInstructionsProviderDetailsFailed = {
      failureReason: string
      status: "Failed"
    }
    export type CoreDepositInstructionsReference = {
      id: string // uuid
      address: string
      ledgerId?: string
      domainId: string // uuid
      accountId: string // uuid
      createdAt: string // date-time
      custodyType: CoreCustodyType
      type: "DepositInstructionsReference"
    }
    export type CoreDepositInstructionsUpdated = {
      id: string // uuid
      type: "DepositInstructionsUpdated"
    }
    export type CoreDomain = {
      id: string // uuid
      parentId?: string // uuid
      alias: string
      lock: CoreLockStatus
      governingStrategy?: CoreGoverningStrategy
      permissions: CorePermissions
      metadata: CoreEntityMetadata
    }
    export type CoreDomainCreated = {
      id: string // uuid
      parentId: string // uuid
      type: "DomainCreated"
    }
    export type CoreDomainUpdated = {
      id: string // uuid
      parentId?: string // uuid
      type: "DomainUpdated"
    }
    export type CoreDryRunTransactionParameters = {
      accountId: string // uuid
      ledgerId?: string
      parameters: CoreTransactionOrderParameters
    }
    export type CoreElGamalKeyProvisioned = {
      id: string // uuid
      type: "ElGamalKeyProvisioned"
    }
    export type CoreElGamalKeyProvisioningFailed = {
      id: string // uuid
      type: "ElGamalKeyProvisioningFailed"
    }
    export type CoreEndpoint = {
      id: string // uuid
      domainId: string // uuid
      address: string
      ledgerId: string
      parameters?: CoreEndpointLedgerParameters
      alias: string
      lock: CoreLockStatus
      metadata: CoreEntityMetadata
      trustScore: number // int32
    }
    export type CoreEndpointCreated = {
      id: string // uuid
      type: "EndpointCreated"
    }
    export type CoreEndpointLedgerParameters =
      | CoreEndpointLedgerParametersEthereum
      | CoreEndpointLedgerParametersHedera
      | CoreEndpointLedgerParametersStellar
      | CoreEndpointLedgerParametersXRPL
    export type CoreEndpointLedgerParametersEthereum = {
      /**
       * This field can be used to provide an Application Binary Interface (ABI) for EVM-based smart contracts, Ripple Custody's front-end uses the field to provide an extended support when interacting with smart contracts, therefore it is not recommended to submit invalid ABIs in this field but Ripple Custody will not prevent the submission of invalid ABIs to tolerate use cases outside of Ripple Custody's front-end.
       */
      ABI?: string
      type: "Ethereum"
    }
    export type CoreEndpointLedgerParametersHedera = {
      /**
       * String encoded using UTF-8, up to 100-bytes long
       */
      memo?: string
      type: "Hedera"
    }
    export type CoreEndpointLedgerParametersStellar = {
      memo?: CoreStellarMemo
      type: "Stellar"
    }
    export type CoreEndpointLedgerParametersXRPL = {
      destinationTag?: number // int64
      type: "XRPL"
    }
    export type CoreEndpointUpdated = {
      id: string // uuid
      type: "EndpointUpdated"
    }
    export type CoreEntityIdAndRevision = {
      id: string // uuid
      revision: number // int64
    }
    export type CoreEntityMetadata = {
      description?: string
      revision: number // int64
      createdAt: string // date-time
      createdBy?: CoreUserReference
      lastModifiedAt: string // date-time
      lastModifiedBy?: CoreUserReference
      customProperties: CoreStringsMap
    }
    export type CoreEntityStringIdAndRevision = {
      id: string
      revision: number // int64
    }
    export type CoreErrorMessage = {
      reason: string
      message?: string
    }
    export type CoreEthereumCallRequest = {
      contractAddress: string
      from: CoreEthereumCaller
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value?: string
      data?: string // ^0[xX]([a-fA-F0-9]*)$
    }
    export type CoreEthereumCaller = CoreEthereumCallerAccount | CoreEthereumCallerAddress
    export type CoreEthereumCallerAccount = {
      domainId: string // uuid
      accountId: string // uuid
      type: "Account"
    }
    export type CoreEthereumCallerAddress = {
      address: string
      type: "Address"
    }
    export type CoreEthereumEIP1559Prices = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      basePrice: string
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      priorityPrice: string
    }
    export type CoreEthereumFee = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      gasPrice: string
      eip1559Prices?: CoreEthereumEIP1559Prices
    }
    export type CoreEthereumFeeStrategy =
      | CoreEthereumFeeStrategyPriority
      | CoreEthereumFeeStrategySpecifiedRate
      | CoreEthereumFeeStrategySpecifiedRateEIP1559
      | CoreEthereumFeeStrategySponsored
    export type CoreEthereumFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreEthereumFeeStrategySpecifiedRate = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      gasPrice: string
      type: "SpecifiedRate"
    }
    export type CoreEthereumFeeStrategySpecifiedRateEIP1559 = {
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
    export type CoreEthereumFeeStrategySponsored = {
      sponsor?: string // uuid
      type: "Sponsored"
    }
    export type CoreEthereumLedgerLog = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      logIndex: string
      address: string
      data: string // ^0[xX]([a-fA-F0-9]*)$
      topics: string /* ^0[xX]([a-fA-F0-9]*)$ */[]
    }
    export type CoreEthereumLikeVaultLedgerIdentifier = "eth" | "etc"
    export type CoreEthereumOperation =
      | CoreEthereumOperationSetDelegation
      | CoreEthereumOperationSubmitAuthorization
    export type CoreEthereumOperationSetDelegation = {
      delegationContract: string
      type: "SetDelegation"
    }
    export type CoreEthereumOperationSubmitAuthorization = {
      authorizations: CoreAuthorizationReference[]
      type: "SubmitAuthorization"
    }
    export type CoreEthereumResourceStrategy = CoreEthereumResourceStrategyOrderReplacement
    export type CoreEthereumResourceStrategyOrderReplacement = {
      transactionOrderId: string // uuid
      reason?: string
      type: "OrderReplacement"
    }
    export type CoreEthereumTickerProperties =
      | CoreEthereumTickerPropertiesERC1155
      | CoreEthereumTickerPropertiesERC20
      | CoreEthereumTickerPropertiesERC721
      | CoreEthereumTickerPropertiesNative
    export type CoreEthereumTickerPropertiesERC1155 = {
      address: string
      tokenId: string
      type: "ERC1155"
    }
    export type CoreEthereumTickerPropertiesERC20 = {
      address: string
      type: "ERC20"
    }
    export type CoreEthereumTickerPropertiesERC721 = {
      address: string
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      tokenId: string
      type: "ERC721"
    }
    export type CoreEthereumTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreEventScope = "Self" | "SelfAndDescendants"
    export type CoreEventsCollection = {
      items: CoreHarmonizeEvent[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreExtensionsErrorMessage = {
      reason: string
      message: string
    }
    export type CoreExtensionsErrorMessages = {
      reason: string
      message: string
      additionalDetails: CoreExtensionsErrorMessage[]
    }
    export type CoreExtensionsIntentLockStatus = "Unlocked" | "Locked"
    export type CoreExtensionsInvitationAnswerIn = {
      publicKey: string
    }
    export type CoreExtensionsInvitationIn = {
      user: CoreExtensionsUserEditIn
      numberSecondsOfValidity: number // int32
    }
    export type CoreExtensionsInvitationOut = {
      id: string // uuid
      code: string
      status: CoreExtensionsInvitationStatus
      validUntil: string // date-time
      user: CoreExtensionsUserEditOut
      metadata: CoreExtensionsMetadata
    }
    export type CoreExtensionsInvitationPaginationResult = {
      items: CoreExtensionsInvitationOut[]
      count: number // int32
      currentStartingAfter?: string | null // uuid
      nextStartingAfter?: string | null // uuid
    }
    export type CoreExtensionsInvitationStatus =
      | "Pending"
      | "DeviceRegistered"
      | "Expired"
      | "Cancelled"
      | "Completed"
    export type CoreExtensionsInvitationStatusQuery =
      | "Pending"
      | "DeviceRegistered"
      | "Expired"
      | "Cancelled"
      | "Completed"
      | "Active"
    export type CoreExtensionsMetadata = {
      createdAt: string // date-time
      lastModifiedAt: string // date-time
      createdBy: CoreExtensionsUserReference
    }
    export type CoreExtensionsPublicInvitationOut = {
      user: CoreExtensionsPublicUserInvitationOut
      status: CoreExtensionsInvitationStatus
    }
    export type CoreExtensionsPublicUserInvitationOut = {
      alias: string
    }
    export type CoreExtensionsSortBy =
      | "Code"
      | "ValidUntil"
      | "CreatedAt"
      | "LastModifiedAt"
      | "Alias"
    export type CoreExtensionsSortOrder = "ASC" | "DESC"
    export type CoreExtensionsUserEditIn = {
      alias: string
      customProperties: {
        [name: string]: string
      }
      description?: string | null
      id: string // uuid
      lock: CoreExtensionsIntentLockStatus
      roles: string[]
    }
    export type CoreExtensionsUserEditOut = {
      alias: string
      customProperties: {
        [name: string]: string
      }
      description?: string | null
      id: string // uuid
      domainId: string // uuid
      lock: CoreExtensionsIntentLockStatus
      roles: string[]
      publicKey?: string | null
    }
    export type CoreExtensionsUserReference = {
      id: string // uuid
      domainId: string // uuid
    }
    export type CoreExternalOperation = CoreExternalOperationTransfer
    export type CoreExternalOperationTransfer = {
      outputs: CoreOutput[]
      tickerId: string // uuid
      memo?: string
      type: "Transfer"
    }
    export type CoreExternalProviderTransactionReference = {
      id: string // uuid
      type: string
    }
    export type CoreExternalTickerProperties = CoreExternalTickerPropertiesAsset
    export type CoreExternalTickerPropertiesAsset = {
      providerAssetId: string
      type: "Asset"
    }
    export type CoreFeePriority = "High" | "Medium" | "Low"
    /**
     * Complete genesis payload, copied in and signed by the notary at genesis.
     */
    export type CoreGenesis = {
      data: CoreGenesisData
      signature: string // base64
    }
    export type CoreGenesisCryptoSetup = {
      apiSigning: CoreKeyType
      collectionSigning: CoreKeyType
      messageSigning: CoreKeyType
    }
    export type CoreGenesisData = {
      executedAt: string // date-time
      payload: CoreGenesisPayload
    }
    export type CoreGenesisPayload = {
      rootDomainSetup: CoreRootDomainSetup
      cryptoSetup: CoreGenesisCryptoSetup
      tickers?: CoreTickerToValidate[]
      systemProperties?: CoreReadWriteSystemPropertyKeyValue[]
      ledgers?: CoreCreateLedgerGenesis[]
      systemSignaturesPublicKey?: string // base64
      antiRewindMode?: CoreAntiRewindMode
    }
    export type CoreGenesisRequest = {
      rootDomainSetup: CoreRootDomainSetup
      cryptoSetup?: CoreGenesisCryptoSetup
      tickers?: CoreTickerToValidate[]
      systemProperties?: CoreReadWriteSystemPropertyKeyValue[]
      ledgers?: CoreCreateLedgerGenesis[]
      systemSignaturesPublicKey?: string // base64
      antiRewindMode: CoreAntiRewindMode
    }
    export type CoreGenesisSucceeded = {
      apiPublicKey: string // base64
      messagingPublicKey: string // base64
      genesis?: /* Complete genesis payload, copied in and signed by the notary at genesis. */ CoreGenesis
      createdEntitiesReferences?: /* A list of all entities created during genesis. */ CoreCreatedEntitiesReferences
      type: "GenesisSucceeded"
      systemSignaturesPublicKey?: string // base64
    }
    export type CoreGoverningStrategy = "ConsiderDescendants" | "CoerceDescendants"
    export type CoreHarmonizeEvent = {
      domainId: string // uuid
      payload: CoreHarmonizeEventPayload
      id: string // uuid
      sequenceNumber: number // int64
      savedAt: string // date-time
    }
    export type CoreHarmonizeEventPayload =
      | CoreAccountCreated
      | CoreAccountUpdated
      | CoreAddressCreated
      | CoreBackupCreated
      | CoreBackupUpdated
      | CoreBalancesUpdated
      | CoreComplianceConfigurationUpdated
      | CoreDomainCreated
      | CoreDomainUpdated
      | CoreEndpointCreated
      | CoreEndpointUpdated
      | CoreGenesisSucceeded
      | CoreIntentClosed
      | CoreIntentCreated
      | CoreIntentExecuted
      | CoreIntentUpdated
      | CoreLedgerCreated
      | CoreLedgerUpdated
      | CoreManifestCreated
      | CoreManifestUpdated
      | CorePolicyCreated
      | CorePolicyUpdated
      | CoreQuarantineApplied
      | CoreQuarantineSkipped
      | CoreSystemPropertySet
      | CoreTickerCreated
      | CoreTickerUpdated
      | CoreTransactionCreated
      | CoreTransactionDetected
      | CoreTransactionUpdated
      | CoreTransferUpdated
      | CoreTrustedPublicKeyAdded
      | CoreTrustedPublicKeyUpdated
      | CoreUserCreated
      | CoreUserUpdated
      | CoreVaultCreated
      | CoreVaultKeyMaterialRewrapCompleted
      | CoreVaultKeyMaterialRewrapFailed
      | CoreVaultUpdated
      | CoreAccountProviderCreated
      | CoreAccountProviderUpdated
      | CoreDepositInstructionsCreated
      | CoreDepositInstructionsUpdated
      | CoreLocationCreated
      | CoreLocationUpdated
      | CoreElGamalKeyProvisioned
      | CoreElGamalKeyProvisioningFailed
    export type CoreHederaFeeStrategy = CoreHederaFeeStrategyPriority
    export type CoreHederaFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreHederaOperation =
      | CoreHederaOperationAccountUpdate
      | CoreHederaOperationTokenAssociate
      | CoreHederaOperationTokenDissociate
      | CoreHederaOperationTransfer
    export type CoreHederaOperationAccountUpdate = {
      maxAutomaticTokenAssociations: number // int32
      type: "AccountUpdate"
    }
    export type CoreHederaOperationTokenAssociate = {
      tokens: CoreTokenDestination[]
      type: "TokenAssociate"
    }
    export type CoreHederaOperationTokenDissociate = {
      tokens: CoreTokenDestination[]
      type: "TokenDissociate"
    }
    export type CoreHederaOperationTransfer = {
      outputs?: CoreHederaTransferOutput[]
      tokenOutputs?: CoreTokenOutput[]
      type: "Transfer"
    }
    export type CoreHederaTickerProperties =
      | CoreHederaTickerPropertiesFungibleToken
      | CoreHederaTickerPropertiesNative
      | CoreHederaTickerPropertiesNonFungibleToken
    export type CoreHederaTickerPropertiesFungibleToken = {
      /**
       * String consisting Hedera Token Id
       */
      id: string
      type: "FungibleToken"
    }
    export type CoreHederaTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreHederaTickerPropertiesNonFungibleToken = {
      /**
       * String consisting Hedera Token Id
       */
      id: string
      serialNumber: number // int64
      type: "NonFungibleToken"
    }
    export type CoreHederaTransferOutput = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
    }
    export type CoreIntentAuthor = CoreIntentAuthorService | CoreIntentAuthorUser
    export type CoreIntentAuthorService = {
      subject: string // ^[\x20-\x7E]*$
    }
    export type CoreIntentAuthorUser = {
      id: string // uuid
      domainId: string // uuid
    }
    export type CoreIntentBody = CoreSystemSigned | CoreUserSigned
    export type CoreIntentClosed = {
      id: string // uuid
      type: "IntentClosed"
    }
    export type CoreIntentCreated = {
      id: string // uuid
      type: "IntentCreated"
    }
    export type CoreIntentDetails = {
      payload: CoreUserIntentPayload
      expiryAt: string // date-time
      author: CoreIntentAuthor
      targetDomainId: string // uuid
      metadata: CoreIntentMetadata
      proposalSignature: string // base64
      signingKey?: string // base64
    }
    export type CoreIntentDryRunRequest = {
      author: CoreUserReference
      expiryAt: string // date-time
      targetDomainId: string // uuid
      id: string // uuid
      payload: CoreUserIntentPayload
      description?: string
      customProperties: CoreStringsMap
    }
    export type CoreIntentDryRunResponse =
      | CoreIntentDryRunResponseV0AcknowledgeBackup
      | CoreIntentDryRunResponseV0AddAccountLedgers
      | CoreIntentDryRunResponseV0AddTrustedPublicKeysForMigration
      | CoreIntentDryRunResponseV0AttemptTransactionOrderCancellation
      | CoreIntentDryRunResponseV0CreateAccount
      | CoreIntentDryRunResponseV0CreateBackup
      | CoreIntentDryRunResponseV0CreateDomain
      | CoreIntentDryRunResponseV0CreateEndpoint
      | CoreIntentDryRunResponseV0CreateLedger
      | CoreIntentDryRunResponseV0CreatePolicy
      | CoreIntentDryRunResponseV0CreateTicker
      | CoreIntentDryRunResponseV0CreateTransactionOrder
      | CoreIntentDryRunResponseV0CreateTransferOrder
      | CoreIntentDryRunResponseV0CreateUser
      | CoreIntentDryRunResponseV0CreateVault
      | CoreIntentDryRunResponseV0ExecuteExtension
      | CoreIntentDryRunResponseV0LockAccount
      | CoreIntentDryRunResponseV0LockDomain
      | CoreIntentDryRunResponseV0LockEndpoint
      | CoreIntentDryRunResponseV0LockPolicy
      | CoreIntentDryRunResponseV0LockTicker
      | CoreIntentDryRunResponseV0LockUser
      | CoreIntentDryRunResponseV0LockVault
      | CoreIntentDryRunResponseV0MigrateSilo3AccountBatch
      | CoreIntentDryRunResponseV0NotarizeData
      | CoreIntentDryRunResponseV0ReleaseQuarantinedTransfers
      | CoreIntentDryRunResponseV0RewrapVaultKeyMaterial
      | CoreIntentDryRunResponseV0SetSystemProperty
      | CoreIntentDryRunResponseV0SignManifest
      | CoreIntentDryRunResponseV0UnlockAccount
      | CoreIntentDryRunResponseV0UnlockDomain
      | CoreIntentDryRunResponseV0UnlockEndpoint
      | CoreIntentDryRunResponseV0UnlockPolicy
      | CoreIntentDryRunResponseV0UnlockTicker
      | CoreIntentDryRunResponseV0UnlockUser
      | CoreIntentDryRunResponseV0UnlockVault
      | CoreIntentDryRunResponseV0UpdateAccount
      | CoreIntentDryRunResponseV0UpdateDomain
      | CoreIntentDryRunResponseV0UpdateDomainPermissions
      | CoreIntentDryRunResponseV0UpdateEndpoint
      | CoreIntentDryRunResponseV0UpdateLedger
      | CoreIntentDryRunResponseV0UpdatePolicy
      | CoreIntentDryRunResponseV0UpdateTicker
      | CoreIntentDryRunResponseV0UpdateUser
      | CoreIntentDryRunResponseV0UpdateVault
      | CoreIntentDryRunResponseV0ValidateTickers
      | CoreIntentDryRunResponseV0AddProviderKey
      | CoreIntentDryRunResponseV0ConnectProvider
      | CoreIntentDryRunResponseV0RequestDepositInstructions
      | CoreIntentDryRunResponseV0RegisterTrustedPublicKey
      | CoreIntentDryRunResponseV0ProvisionElGamalKeyPair
    export type CoreIntentDryRunResponseV0AcknowledgeBackup = {
      success: boolean
      errors?: string[]
      type: "v0_AcknowledgeBackup"
    }
    export type CoreIntentDryRunResponseV0AddAccountLedgers = {
      success: boolean
      errors?: string[]
      type: "v0_AddAccountLedgers"
    }
    export type CoreIntentDryRunResponseV0AddProviderKey = {
      success: boolean
      errors?: string[]
      type: "v0_AddProviderKey"
    }
    export type CoreIntentDryRunResponseV0AddTrustedPublicKeysForMigration = {
      success: boolean
      errors?: string[]
      type: "v0_AddTrustedPublicKeysForMigration"
    }
    export type CoreIntentDryRunResponseV0AttemptTransactionOrderCancellation = {
      success: boolean
      errors?: string[]
      cancellation?: CoreTransactionCancellationDetails
      type: "v0_AttemptTransactionOrderCancellation"
    }
    export type CoreIntentDryRunResponseV0ConnectProvider = {
      success: boolean
      errors?: string[]
      type: "v0_ConnectProvider"
    }
    export type CoreIntentDryRunResponseV0CreateAccount = {
      success: boolean
      errors?: string[]
      result: CoreCreateAccountDryRunResult
      type: "v0_CreateAccount"
    }
    export type CoreIntentDryRunResponseV0CreateBackup = {
      success: boolean
      errors?: string[]
      type: "v0_CreateBackup"
    }
    export type CoreIntentDryRunResponseV0CreateDomain = {
      success: boolean
      errors?: string[]
      type: "v0_CreateDomain"
    }
    export type CoreIntentDryRunResponseV0CreateEndpoint = {
      success: boolean
      errors?: string[]
      type: "v0_CreateEndpoint"
    }
    export type CoreIntentDryRunResponseV0CreateLedger = {
      success: boolean
      errors?: string[]
      type: "v0_CreateLedger"
    }
    export type CoreIntentDryRunResponseV0CreatePolicy = {
      success: boolean
      errors?: string[]
      type: "v0_CreatePolicy"
    }
    export type CoreIntentDryRunResponseV0CreateTicker = {
      success: boolean
      errors?: string[]
      type: "v0_CreateTicker"
    }
    export type CoreIntentDryRunResponseV0CreateTransactionOrder = {
      success: boolean
      errors?: string[]
      result: CoreTransactionDryRunResult
      estimate: CoreTransactionEstimate
      type: "v0_CreateTransactionOrder"
    }
    export type CoreIntentDryRunResponseV0CreateTransferOrder = {
      success: boolean
      errors?: string[]
      result: CoreTransactionDryRunResult
      estimate: CoreTransferDryRunEstimate
      type: "v0_CreateTransferOrder"
    }
    export type CoreIntentDryRunResponseV0CreateUser = {
      success: boolean
      errors?: string[]
      type: "v0_CreateUser"
    }
    export type CoreIntentDryRunResponseV0CreateVault = {
      success: boolean
      errors?: string[]
      type: "v0_CreateVault"
    }
    export type CoreIntentDryRunResponseV0ExecuteExtension = {
      success: boolean
      errors?: string[]
      type: "v0_ExecuteExtension"
    }
    export type CoreIntentDryRunResponseV0LockAccount = {
      success: boolean
      errors?: string[]
      type: "v0_LockAccount"
    }
    export type CoreIntentDryRunResponseV0LockDomain = {
      success: boolean
      errors?: string[]
      type: "v0_LockDomain"
    }
    export type CoreIntentDryRunResponseV0LockEndpoint = {
      success: boolean
      errors?: string[]
      type: "v0_LockEndpoint"
    }
    export type CoreIntentDryRunResponseV0LockPolicy = {
      success: boolean
      errors?: string[]
      type: "v0_LockPolicy"
    }
    export type CoreIntentDryRunResponseV0LockTicker = {
      success: boolean
      errors?: string[]
      type: "v0_LockTicker"
    }
    export type CoreIntentDryRunResponseV0LockUser = {
      success: boolean
      errors?: string[]
      type: "v0_LockUser"
    }
    export type CoreIntentDryRunResponseV0LockVault = {
      success: boolean
      errors?: string[]
      type: "v0_LockVault"
    }
    export type CoreIntentDryRunResponseV0MigrateSilo3AccountBatch = {
      success: boolean
      errors?: string[]
      type: "v0_MigrateSilo3AccountBatch"
    }
    export type CoreIntentDryRunResponseV0NotarizeData = {
      success: boolean
      errors?: string[]
      type: "v0_NotarizeData"
    }
    export type CoreIntentDryRunResponseV0ProvisionElGamalKeyPair = {
      success: boolean
      errors?: string[]
      type: "v0_ProvisionElGamalKeyPair"
    }
    export type CoreIntentDryRunResponseV0RegisterTrustedPublicKey = {
      success: boolean
      errors?: string[]
      type: "v0_RegisterTrustedPublicKey"
    }
    export type CoreIntentDryRunResponseV0ReleaseQuarantinedTransfers = {
      success: boolean
      errors?: string[]
      type: "v0_ReleaseQuarantinedTransfers"
    }
    export type CoreIntentDryRunResponseV0RequestDepositInstructions = {
      success: boolean
      errors?: string[]
      type: "v0_RequestDepositInstructions"
    }
    export type CoreIntentDryRunResponseV0RewrapVaultKeyMaterial = {
      success: boolean
      errors?: string[]
      type: "v0_RewrapVaultKeyMaterial"
    }
    export type CoreIntentDryRunResponseV0SetSystemProperty = {
      success: boolean
      errors?: string[]
      type: "v0_SetSystemProperty"
    }
    export type CoreIntentDryRunResponseV0SignManifest = {
      success: boolean
      errors?: string[]
      type: "v0_SignManifest"
    }
    export type CoreIntentDryRunResponseV0UnlockAccount = {
      success: boolean
      errors?: string[]
      type: "v0_UnlockAccount"
    }
    export type CoreIntentDryRunResponseV0UnlockDomain = {
      success: boolean
      errors?: string[]
      type: "v0_UnlockDomain"
    }
    export type CoreIntentDryRunResponseV0UnlockEndpoint = {
      success: boolean
      errors?: string[]
      type: "v0_UnlockEndpoint"
    }
    export type CoreIntentDryRunResponseV0UnlockPolicy = {
      success: boolean
      errors?: string[]
      type: "v0_UnlockPolicy"
    }
    export type CoreIntentDryRunResponseV0UnlockTicker = {
      success: boolean
      errors?: string[]
      type: "v0_UnlockTicker"
    }
    export type CoreIntentDryRunResponseV0UnlockUser = {
      success: boolean
      errors?: string[]
      type: "v0_UnlockUser"
    }
    export type CoreIntentDryRunResponseV0UnlockVault = {
      success: boolean
      errors?: string[]
      type: "v0_UnlockVault"
    }
    export type CoreIntentDryRunResponseV0UpdateAccount = {
      success: boolean
      errors?: string[]
      type: "v0_UpdateAccount"
    }
    export type CoreIntentDryRunResponseV0UpdateDomain = {
      success: boolean
      errors?: string[]
      type: "v0_UpdateDomain"
    }
    export type CoreIntentDryRunResponseV0UpdateDomainPermissions = {
      success: boolean
      errors?: string[]
      type: "v0_UpdateDomainPermissions"
    }
    export type CoreIntentDryRunResponseV0UpdateEndpoint = {
      success: boolean
      errors?: string[]
      type: "v0_UpdateEndpoint"
    }
    export type CoreIntentDryRunResponseV0UpdateLedger = {
      success: boolean
      errors?: string[]
      type: "v0_UpdateLedger"
    }
    export type CoreIntentDryRunResponseV0UpdatePolicy = {
      success: boolean
      errors?: string[]
      type: "v0_UpdatePolicy"
    }
    export type CoreIntentDryRunResponseV0UpdateTicker = {
      success: boolean
      errors?: string[]
      type: "v0_UpdateTicker"
    }
    export type CoreIntentDryRunResponseV0UpdateUser = {
      success: boolean
      errors?: string[]
      type: "v0_UpdateUser"
    }
    export type CoreIntentDryRunResponseV0UpdateVault = {
      success: boolean
      errors?: string[]
      type: "v0_UpdateVault"
    }
    export type CoreIntentDryRunResponseV0ValidateTickers = {
      success: boolean
      errors?: string[]
      type: "v0_ValidateTickers"
    }
    export type CoreIntentEntity = {
      id: string // uuid
      details: CoreIntentDetails
      state: CoreIntentState
    }
    export type CoreIntentError = {
      code: CoreUserOperationRejectionCode
      message: string
    }
    export type CoreIntentExecuted = {
      id: string // uuid
      type: "IntentExecuted"
    }
    export type CoreIntentLockStatus = "Unlocked" | "Locked"
    export type CoreIntentMetadata = {
      description?: string
      createdAt: string // date-time
      customProperties: CoreStringsMap
    }
    export type CoreIntentOrigin = "UserSigned" | "SystemSigned"
    export type CoreIntentReference = {
      domainId: string // uuid
      id: string // uuid
    }
    export type CoreIntentResponse = {
      requestId: string // uuid
    }
    export type CoreIntentState = {
      status: CoreIntentStatus
      lastModifiedAt?: string // date-time
      error?: CoreIntentError
      progressPerPolicy?: CoreWorkflowProgress[]
    }
    export type CoreIntentStatus =
      | "Open"
      | "Approved"
      | "Executed"
      | "Failed"
      | "Expired"
      | "Rejected"
      | "Executing"
    export type CoreIntentType =
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
      | "v0_CreateBackup"
      | "v0_AcknowledgeBackup"
      | "v0_ConnectProvider"
      | "v0_RequestDepositInstructions"
      | "v0_AddProviderKey"
      | "v0_RegisterTrustedPublicKey"
      | "v0_ProvisionElGamalKeyPair"
    export type CoreIntentUpdated = {
      id: string // uuid
      type: "IntentUpdated"
    }
    export type CoreKeyPurpose = "ElGamal"
    export type CoreKeyType = "Secp256r1" | "Secp256k1" | "Ed25519"
    export type CoreLedger = {
      id: string
      alias: string
      parameters: CoreLedgerParameters
      metadata: CoreEntityMetadata
    }
    export type CoreLedgerCreated = {
      id: string
      type: "LedgerCreated"
    }
    export type CoreLedgerParameters =
      | CoreLedgerParametersAlgorand
      | CoreLedgerParametersBitcoin
      | CoreLedgerParametersCardano
      | CoreLedgerParametersEthereum
      | CoreLedgerParametersHedera
      | CoreLedgerParametersSolana
      | CoreLedgerParametersStellar
      | CoreLedgerParametersSubstrate
      | CoreLedgerParametersTezos
      | CoreLedgerParametersTron
      | CoreLedgerParametersXRPL
      | CoreLedgerParametersExternal
      | CoreLedgerParametersCanton
      | CoreLedgerParametersSui
    export type CoreLedgerParametersAlgorand = {
      genesisId: string
      genesisHash: string
      nativeTickerSymbol: string
      nativeTickerName: string
      nativeTickerDecimals: number // int32
      type: "Algorand"
    }
    export type CoreLedgerParametersBitcoin = {
      supportsSegWit: boolean
      vaultLedgerIdentifier: CoreBitcoinLikeVaultLedgerIdentifier
      network: CoreNetwork
      tickerSymbol: string
      tickerName: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      dustLimit: string
      type: "Bitcoin"
    }
    export type CoreLedgerParametersCanton = {
      synchronizerId: string
      operatorId: string
      dsoPartyId: string
      daRegistryOperator: string
      type: "Canton"
    }
    export type CoreLedgerParametersCardano = {
      nativeTickerSymbol: string
      nativeTickerName: string
      testnetMagic?: number // int64
      type: "Cardano"
    }
    export type CoreLedgerParametersEthereum = {
      chainId: number // int32
      vaultLedgerIdentifier: CoreEthereumLikeVaultLedgerIdentifier
      nativeTickerSymbol: string
      nativeTickerName: string
      supportsEIP1559: boolean
      type: "Ethereum"
    }
    export type CoreLedgerParametersExternal = {
      type: "External"
    }
    export type CoreLedgerParametersHedera = {
      nativeTickerSymbol: string
      nativeTickerName: string
      type: "Hedera"
    }
    export type CoreLedgerParametersSolana = {
      nativeTickerSymbol: string
      nativeTickerName: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      lamportsPerSignature: string
      type: "Solana"
    }
    export type CoreLedgerParametersStellar = {
      nativeTickerSymbol: string
      nativeTickerName: string
      networkPassphrase: string
      type: "Stellar"
    }
    export type CoreLedgerParametersSubstrate = {
      genesisHash: string // ^0x[a-f0-9]{64}$
      addressPrefix: number
      nativeTickerSymbol: string
      nativeTickerName: string
      nativeTickerDecimals: number // int32
      supportedRuntimeVersions: CoreSubstrateRuntimeInfo[]
      type: "Substrate"
    }
    export type CoreLedgerParametersSui = {
      nativeTickerSymbol: string
      nativeTickerName: string
      type: "Sui"
    }
    export type CoreLedgerParametersTezos = {
      nativeTickerSymbol: string
      nativeTickerName: string
      chainId: string
      type: "Tezos"
    }
    export type CoreLedgerParametersTron = {
      nativeTickerSymbol: string
      nativeTickerName: string
      type: "Tron"
    }
    export type CoreLedgerParametersXRPL = {
      nativeTickerSymbol: string
      nativeTickerName: string
      networkId: number // int32
      type: "XRPL"
    }
    export type CoreLedgerTransactionData = {
      ledgerStatus: CoreLedgerTransactionStatus
      failure?: CoreLedgerTransactionFailure
      ledgerTransactionId: string
      rawTransaction?: string
      /**
       * Deletion target: Mar. 31st 2027
       */
      blockTime?: string // date-time
      statusLastUpdatedAt: string // date-time
      providerStatusLastUpdatedAt?: string // date-time
      ledgerData?: CoreOnLedgerData
      sponsoringTransactionHash?: string
    }
    export type CoreLedgerTransactionFailure = "FailedOnChain" | "PartiallyFailedOnChain"
    export type CoreLedgerTransactionStatus = "Detected" | "Confirmed" | "Expired" | "Replaced"
    export type CoreLedgerUpdated = {
      id: string
      type: "LedgerUpdated"
    }
    export type CoreLocation = {
      id: string // uuid
      providerId: string // uuid
      /**
       * ID of the location as reported by the provider
       */
      providerLocationId: string
      alias: string
      metadata: CoreEntityMetadata
    }
    export type CoreLocationCreated = {
      id: string // uuid
      type: "LocationCreated"
    }
    export type CoreLocationUpdated = {
      id: string // uuid
      type: "LocationUpdated"
    }
    export type CoreLocationsCollection = {
      items: CoreApiLocation[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreLockStatus = "Unlocked" | "Locked" | "Archived"
    export type CoreLoginId = {
      /**
       * User identifier used by the provider.
       */
      id: string
      /**
       * Login provider. For internal login, set to `harmonize`. For external identity providers, must match the provider name.
       */
      providerId: string
    }
    export type CoreMPTokenIssuanceMetadata = CoreMPTokenIssuanceMetadataHexEncodedMetadata
    export type CoreMPTokenIssuanceMetadataHexEncodedMetadata = {
      /**
       * Hex encoded string.
       */
      value: string // ^[A-Fa-f0-9]*$
      type: "HexEncodedMetadata"
    }
    export type CoreManifest = {
      id: string // uuid
      domainId: string // uuid
      accountId: string // uuid
      ledgerId?: string
      content: CoreManifestContent
      value?: CoreManifestValue
      metadata: CoreEntityMetadata
      address?: string
    }
    export type CoreManifestAdditionalDetails = {
      processing: CoreManifestProcessingDetails
    }
    export type CoreManifestContent =
      | CoreManifestContentEIP191
      | CoreManifestContentJWT
      | CoreManifestContentUnsafe
    export type CoreManifestContentEIP191 = {
      value: string // ^0[xX](([a-fA-F0-9][a-fA-F0-9])*)$
      type: "EIP-191"
    }
    export type CoreManifestContentJWT = {
      header: CoreManifestContentJWTHeader
      payload: CoreManifestContentJWTPayload
      type: "JWT"
    }
    export type CoreManifestContentJWTHeader = {
      type?: string
      algorithm?: string
      additionalParameters?: CoreStringsMap
    }
    export type CoreManifestContentJWTPayload = {
      issuer?: string
      subject?: string
      audience?: string
      expiration?: number // int64
      notBefore?: number // int64
      issuedAt?: number // int64
      jwtId?: string
      additionalClaims?: CoreStringsMap
    }
    export type CoreManifestContentType = "EIP-191" | "JWT" | "Unsafe"
    export type CoreManifestContentUnsafe = {
      value: string // base64
      type: "Unsafe"
    }
    export type CoreManifestCreated = {
      id: string // uuid
      accountId?: string // uuid
      type: "ManifestCreated"
    }
    export type CoreManifestProcessingDetails =
      | CoreManifestProcessingDetailsCompleted
      | CoreManifestProcessingDetailsFailed
      | CoreManifestProcessingDetailsPending
      | CoreManifestProcessingDetailsPreparing
    export type CoreManifestProcessingDetailsCompleted = {
      type: "Completed"
    }
    export type CoreManifestProcessingDetailsFailed = {
      type: "Failed"
    }
    export type CoreManifestProcessingDetailsPending = {
      type: "Pending"
    }
    export type CoreManifestProcessingDetailsPreparing = {
      type: "Preparing"
    }
    export type CoreManifestProcessingStatus = "Pending" | "Preparing" | "Completed" | "Failed"
    export type CoreManifestUpdated = {
      id: string // uuid
      accountId?: string // uuid
      type: "ManifestUpdated"
    }
    export type CoreManifestValue =
      | CoreManifestValueEIP191
      | CoreManifestValueJWT
      | CoreManifestValueUnsafe
    export type CoreManifestValueEIP191 = {
      value: string // ^0[xX](([a-fA-F0-9][a-fA-F0-9])*)$
      type: "EIP-191"
    }
    export type CoreManifestValueJWT = {
      value: string
      type: "JWT"
    }
    export type CoreManifestValueUnsafe = {
      signature: string // base64
      recoveryId?: string // base64
      type: "Unsafe"
    }
    export type CoreManifestsCollection = {
      items: CoreApiManifest[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreMeDomainReference = {
      id: string // uuid
      alias: string
      userReference: CoreMeUserReference
    }
    export type CoreMeReference = {
      publicKey: string // base64
      domains: CoreMeDomainReference[]
      loginId?: CoreLoginId
    }
    export type CoreMeUserReference = {
      id: string // uuid
      alias: string
      roles: string /* [a-z0-9\-]+ */[]
    }
    export type CoreMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
    }
    export type CoreNetwork = "mainnet" | "testnet" | "regtest"
    export type CoreNonFungibleTokenDestination =
      | CoreNonFungibleTokenDestinationNftTokenId
      | CoreNonFungibleTokenDestinationTicker
    export type CoreNonFungibleTokenDestinationNftTokenId = {
      /**
       * String consisting Hedera Token Id
       */
      tokenId: string
      serialNumber: number // int64
      type: "NftTokenId"
    }
    export type CoreNonFungibleTokenDestinationTicker = {
      tickerId: string // uuid
      type: "Ticker"
    }
    export type CoreNotaryApiKeyValue = {
      publicKey: CoreAccountPublicKeyOnly
    }
    export type CoreNotaryCollectionsKeyValue = {
      publicKey: CoreAccountPublicKeyOnly
    }
    export type CoreNotaryCommunicationKeyValue = {
      publicKey: CoreAccountPublicKeyOnly
    }
    export type CoreNotarySystemSignedIntentsEnabledValue = {
      enabled: boolean
    }
    export type CoreNotarySystemSigningKeyValue = {
      publicKey: CoreAccountPublicKeyOnly
    }
    export type CoreOnLedgerData =
      | CoreOnLedgerDataBitcoin
      | CoreOnLedgerDataEthereum
      | CoreOnLedgerDataXrpl
      | CoreOnLedgerDataExternal
      | CoreOnLedgerDataCanton
    export type CoreOnLedgerDataBitcoin = {
      inputs: CoreBitcoinOnLedgerDataInput[]
      outputs: CoreBitcoinOnLedgerDataOutput[]
      type: "Bitcoin"
    }
    export type CoreOnLedgerDataCanton = {
      contractId?: string
      sender?: string
      receiver?: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount?: string
      instrumentId?: string
      executeBefore?: string // date-time
      type: "Canton"
      memo?: string
    }
    export type CoreOnLedgerDataEthereum = {
      logs: CoreEthereumLedgerLog[]
      createdContractAddresses?: string[]
      deletedContractAddresses?: string[]
      type: "Ethereum"
    }
    export type CoreOnLedgerDataExternal = {
      underlyingLedgerTransactionIds: string[]
      providerTransactions: CoreExternalProviderTransactionReference[]
      type: "External"
    }
    export type CoreOnLedgerDataXrpl = {
      tokenData?: CoreXrplOnLedgerTokenData
      type: "Xrpl"
      transactionType?: string
    }
    export type CoreOutput = {
      destination: CoreTransactionDestination
      destinationTag?: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
    }
    export type CoreParticipant =
      | CoreParticipantAccount
      | CoreParticipantAddress
      | CoreParticipantEndpoint
    export type CoreParticipantAccount = {
      accountId: string // uuid
      type: "Account"
    }
    export type CoreParticipantAddress = {
      address: string
      type: "Address"
    }
    export type CoreParticipantEndpoint = {
      endpointId: string // uuid
      type: "Endpoint"
    }
    export type CoreParticipantSequencing =
      | CoreParticipantSequencingAccountSequence
      | CoreParticipantSequencingTicket
    export type CoreParticipantSequencingAccountSequence = {
      value: number // int64
      type: "AccountSequence"
    }
    export type CoreParticipantSequencingTicket = {
      value: number // int64
      type: "Ticket"
    }
    export type CorePermissions = {
      readAccess: CoreReadAccess
    }
    export type CorePolicy = {
      id: string // uuid
      domainId: string // uuid
      alias: string
      rank: number // int32
      intentTypes?: CoreIntentType[]
      scope: CorePolicyScope
      scriptingEngine: CoreScriptingEngine
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
      CorePolicyCondition
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
      CoreWorkflowCondition[]
      lock: CoreLockStatus
      metadata: CoreEntityMetadata
      intentOrigin?: CoreIntentOrigin
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
    export type CorePolicyCondition =
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
      CorePolicyConditionAnd | CorePolicyConditionExpression | CorePolicyConditionOr
    export type CorePolicyConditionAnd = {
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
      CorePolicyCondition
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
      CorePolicyCondition
      type: "And"
    }
    export type CorePolicyConditionExpression = {
      expression: string
      type: "Expression"
    }
    export type CorePolicyConditionOr = {
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
      CorePolicyCondition
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
      CorePolicyCondition
      type: "Or"
    }
    export type CorePolicyCreated = {
      id: string // uuid
      type: "PolicyCreated"
    }
    export type CorePolicyReference = {
      id: string // uuid
      revision: number // int64
      domainId: string // uuid
    }
    export type CorePolicyScope = "Self" | "Descendants" | "SelfAndDescendants"
    export type CorePolicyUpdated = {
      id: string // uuid
      type: "PolicyUpdated"
    }
    /**
     * Hint for specifically bitcoin ledgers to have the transaction happen with addressForChange PrimaryAddress - so change utxo goes to address \0\0 - aligned with dry-runs - rather than the default generate a new chain-internal address.
     */
    export type CorePreferredAddressForChange = "PrimaryAddress"
    export type CorePropose = {
      author: CoreUserReference
      expiryAt: string // date-time
      targetDomainId: string // uuid
      id: string // uuid
      payload: CoreProposeUserIntentPayload
      description?: string
      customProperties: CoreStringsMap
      type: "Propose"
    }
    export type CoreProposeIntentBody = {
      request: CorePropose
      signature: string // base64
    }
    export type CoreProposeTransactionOrderParameters =
      | CoreTransactionOrderParametersAlgorand
      | CoreTransactionOrderParametersBitcoin
      | CoreTransactionOrderParametersCardano
      | CoreTransactionOrderParametersEthereum
      | CoreTransactionOrderParametersHedera
      | CoreTransactionOrderParametersSolana
      | CoreTransactionOrderParametersStellar
      | CoreTransactionOrderParametersSubstrate
      | CoreTransactionOrderParametersTezos
      | CoreTransactionOrderParametersTron
      | CoreTransactionOrderParametersXRPL
      | CoreTransactionOrderParametersExternal
      | CoreTransactionOrderParametersCanton
      | CoreTransactionOrderParametersSui
    export type CoreProposeUserIntentPayload =
      | CoreProposeV0CreateTransactionOrder
      | CoreV0AcknowledgeBackup
      | CoreV0AddAccountLedgers
      | CoreV0AddTrustedPublicKeysForMigration
      | CoreV0AttemptTransactionOrderCancellation
      | CoreV0CreateAccount
      | CoreV0CreateBackup
      | CoreV0CreateDomain
      | CoreV0CreateEndpoint
      | CoreV0CreateLedger
      | CoreV0CreatePolicy
      | CoreV0CreateTicker
      | CoreV0CreateTransferOrder
      | CoreV0CreateUser
      | CoreV0CreateVault
      | CoreV0ExecuteExtension
      | CoreV0LockAccount
      | CoreV0LockDomain
      | CoreV0LockEndpoint
      | CoreV0LockPolicy
      | CoreV0LockTicker
      | CoreV0LockUser
      | CoreV0LockVault
      | CoreV0MigrateSilo3AccountBatch
      | CoreV0NotarizeData
      | CoreV0ReleaseQuarantinedTransfers
      | CoreV0RewrapVaultKeyMaterial
      | CoreV0SetSystemProperty
      | CoreV0SignManifest
      | CoreV0UnlockAccount
      | CoreV0UnlockDomain
      | CoreV0UnlockEndpoint
      | CoreV0UnlockPolicy
      | CoreV0UnlockTicker
      | CoreV0UnlockUser
      | CoreV0UnlockVault
      | CoreV0UpdateAccount
      | CoreV0UpdateDomain
      | CoreV0UpdateDomainPermissions
      | CoreV0UpdateEndpoint
      | CoreV0UpdateLedger
      | CoreV0UpdatePolicy
      | CoreV0UpdateTicker
      | CoreV0UpdateUser
      | CoreV0UpdateVault
      | CoreV0ValidateTickers
      | CoreV0AddProviderKey
      | CoreV0ConnectProvider
      | CoreV0RequestDepositInstructions
      | CoreV0RegisterTrustedPublicKey
      | CoreV0ProvisionElGamalKeyPair
    export type CoreProposeV0CreateTransactionOrder = {
      id: string // uuid
      accountId: string // uuid
      ledgerId?: string
      parameters: CoreProposeTransactionOrderParameters
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreateTransactionOrder"
    }
    export type CoreProvidersCollection = {
      items: CoreApiProvider[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CorePurposeKey = {
      ledgerId: string
      purpose: CoreKeyPurpose
      publicKey: string // base64
    }
    export type CoreQuarantineApplied = {
      transferId: string // uuid
      type: "QuarantineApplied"
    }
    export type CoreQuarantineSkipped = {
      transferId: string // uuid
      type: "QuarantineSkipped"
    }
    export type CoreQuarantineStatus = "Quarantined" | "Released" | "Skipped"
    export type CoreReadAccess = {
      domains: string /* [a-z0-9\-]+ */[]
      users: string /* [a-z0-9\-]+ */[]
      endpoints: string /* [a-z0-9\-]+ */[]
      policies: string /* [a-z0-9\-]+ */[]
      accounts: string /* [a-z0-9\-]+ */[]
      transactions: string /* [a-z0-9\-]+ */[]
      requests: string /* [a-z0-9\-]+ */[]
      events: string /* [a-z0-9\-]+ */[]
    }
    export type CoreReadWriteSystemPropertyKeyValue =
      | CoreReadWriteSystemPropertyKeyValueStateReviewAuthorityProperty
      | CoreReadWriteSystemPropertyKeyValueNotarySystemSignedIntentsEnabledProperty
      | CoreReadWriteSystemPropertyKeyValueAntiRewindModeProperty
    export type CoreReadWriteSystemPropertyKeyValueAntiRewindModeProperty = {
      value: CoreAntiRewindModeValue
      type: "AntiRewindModeProperty"
    }
    export type CoreReadWriteSystemPropertyKeyValueNotarySystemSignedIntentsEnabledProperty = {
      value: CoreNotarySystemSignedIntentsEnabledValue
      type: "NotarySystemSignedIntentsEnabledProperty"
    }
    export type CoreReadWriteSystemPropertyKeyValueStateReviewAuthorityProperty = {
      value: CoreStateReviewAuthorityValue
      type: "StateReviewAuthorityProperty"
    }
    export type CoreRecipientTransferParty =
      | CoreRecipientTransferPartyAccount
      | CoreRecipientTransferPartyAddress
    export type CoreRecipientTransferPartyAccount = {
      domainId: string // uuid
      accountId: string // uuid
      /**
       * Deletion target: Mar. 31st 2027
       */
      address?: string
      addressDetails?: CoreAddressDetails
      type: "Account"
    }
    export type CoreRecipientTransferPartyAddress = {
      address: string
      addressDetails: CoreAddressDetails
      type: "Address"
    }
    export type CoreReject = {
      author: CoreUserReference
      /**
       * Deletion target: Mar. 31st 2027
       */
      expiryAt?: string // date-time
      targetDomainId: string // uuid
      intentId: string // uuid
      proposalSignature: string // base64
      rejectReason: string
      type: "Reject"
    }
    export type CoreRejectIntentBody = {
      request: CoreReject
      signature: string // base64
    }
    export type CoreRemainingDomainUsers = {
      domainId: string // uuid
      users: string /* uuid */[]
    }
    export type CoreRequestState = {
      id: string // uuid
      requester: CoreIntentAuthor
      status: CoreRequestStateStatus
      history: CoreRequestStateHistory[]
      lastModifiedAt: string // date-time
      intent?: CoreIntentReference
    }
    export type CoreRequestStateHistory = {
      source: string
      status: CoreRequestStateStatus
      hint?: string
      createdAt: string // date-time
    }
    export type CoreRequestStateStatus = "Processing" | "Failed" | "Succeeded"
    export type CoreResolvedEndpoint = {
      endpointId: string // uuid
      domainId: string // uuid
    }
    export type CoreResolvedSequencing =
      | CoreResolvedSequencingAccountSequence
      | CoreResolvedSequencingTicket
    export type CoreResolvedSequencingAccountSequence = {
      value: number // int64
      type: "AccountSequence"
    }
    export type CoreResolvedSequencingTicket = {
      value: number // int64
      type: "Ticket"
    }
    export type CoreResultLedger = {
      ledgerId: string
      available: boolean
    }
    export type CoreRootDomainSetup = {
      id: string // uuid
      alias: string
      lock: CoreIntentLockStatus
      governingStrategy?: CoreGoverningStrategy
      permissions: CorePermissions
      description?: string
      customProperties: CoreStringsMap
      users: CoreCreateDomainGenesisUser[]
      policies: CoreCreateDomainGenesisPolicy[]
      descendants?: CoreCreateDomainsPayload[]
    }
    export type CoreScriptingEngine = "Javascript_v0"
    export type CoreSenderTransferParty =
      | CoreSenderTransferPartyAccount
      | CoreSenderTransferPartyAddress
    export type CoreSenderTransferPartyAccount = {
      domainId: string // uuid
      accountId: string // uuid
      /**
       * Deletion target: Mar. 31st 2027
       */
      addresses?: string[]
      addressesDetails?: CoreAddressDetails[]
      type: "Account"
    }
    export type CoreSenderTransferPartyAddress = {
      address: string
      addressDetails: CoreAddressDetails
      type: "Address"
    }
    export type CoreSequencing =
      | CoreSequencingAccountSequence
      | CoreSequencingPlatformManaged
      | CoreSequencingTicket
    export type CoreSequencingAccountSequence = {
      value: number // int64
      type: "AccountSequence"
    }
    export type CoreSequencingPlatformManaged = {
      type: "PlatformManaged"
    }
    export type CoreSequencingTicket = {
      value: number // int64
      type: "Ticket"
    }
    export type CoreSkipQuarantineScope = "None" | "Domain" | "Instance"
    export type CoreSolanaFeeStrategy = CoreSolanaFeeStrategyPriority
    export type CoreSolanaFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreSolanaMintAccount =
      | CoreSolanaMintAccountDestination
      | CoreSolanaMintAccountTicker
    export type CoreSolanaMintAccountDestination = {
      destination: CoreTransactionDestination
      type: "Destination"
    }
    export type CoreSolanaMintAccountTicker = {
      tickerId: string // uuid
      type: "Ticker"
    }
    export type CoreSolanaOperation =
      | CoreSolanaOperationBurn
      | CoreSolanaOperationCreateNonceAccount
      | CoreSolanaOperationFundAtaAccount
      | CoreSolanaOperationInitializeMint
      | CoreSolanaOperationMintTo
      | CoreSolanaOperationTransfer
      | CoreSolanaOperationTransferToken
    export type CoreSolanaOperationBurn = {
      mintAccount: CoreSolanaMintAccount
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "Burn"
    }
    export type CoreSolanaOperationCreateNonceAccount = {
      createOnAccount: string // uuid
      type: "CreateNonceAccount"
      nonceAuthority?: CoreTransactionDestination
    }
    export type CoreSolanaOperationFundAtaAccount = {
      destination?: CoreTransactionDestination
      mintAccount: CoreSolanaMintAccount
      type: "FundAtaAccount"
    }
    export type CoreSolanaOperationInitializeMint = {
      mintAccount: string // uuid
      decimals: number // int32
      tokenType: CoreSolanaTokenType
      type: "InitializeMint"
    }
    export type CoreSolanaOperationMintTo = {
      destination: CoreTransactionDestination
      mintAccount: CoreSolanaMintAccount
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "MintTo"
    }
    export type CoreSolanaOperationTransfer = {
      outputs: CoreSolanaTransferOutput[]
      type: "Transfer"
    }
    export type CoreSolanaOperationTransferToken = {
      outputs: CoreSolanaTransferOutput[]
      mintAccount: CoreSolanaMintAccount
      type: "TransferToken"
    }
    export type CoreSolanaTickerProperties =
      | CoreSolanaTickerPropertiesNative
      | CoreSolanaTickerPropertiesToken
    export type CoreSolanaTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreSolanaTickerPropertiesToken = {
      mint: string
      tokenType: CoreSolanaTokenType
      type: "Token"
    }
    export type CoreSolanaTokenType = "SPL" | "SPL2022"
    export type CoreSolanaTransferOutput = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
    }
    export type CoreSortOrder = "ASC" | "DESC"
    export type CoreSponsorship = {
      id: string // uuid
      role: CoreSponsorshipRole
      ledgerId: string
      index: string
      sponsor: string
      sponsee: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      feeAmount: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maxFee?: string
      remainingOwnerCount: number // int32
      requireSignForFee: boolean
      requireSignForReserve: boolean
      active: boolean
      lastUpdatedAt: string // date-time
    }
    export type CoreSponsorshipMovement = {
      id: string // uuid
      movement: CoreXrplSponsorshipMovement
      sponsorshipIndex: string
      sponsor: string
      sponsee: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      onLedgerTransactionId: string
      transactionId?: string // uuid
      registeredAt: string // date-time
    }
    export type CoreSponsorshipMovementsCollection = {
      items: CoreSponsorshipMovement[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreSponsorshipRole = "Sponsor" | "Sponsee"
    export type CoreSponsorshipsCollection = {
      items: CoreSponsorship[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreStateReviewAuthorityValue = {
      publicKey: CoreAccountPublicKeyOnly
    }
    export type CoreStellarAsset = {
      code: string
      issuer: string
    }
    export type CoreStellarFee = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      baseFeeStroops: string
    }
    export type CoreStellarFeeStrategy =
      | CoreStellarFeeStrategyPriority
      | CoreStellarFeeStrategySpecifiedRate
    export type CoreStellarFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreStellarFeeStrategySpecifiedRate = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      baseFee: string
      type: "SpecifiedRate"
    }
    export type CoreStellarMemo =
      | CoreStellarMemoHash
      | CoreStellarMemoId
      | CoreStellarMemoReturn
      | CoreStellarMemoText
    export type CoreStellarMemoHash = {
      /**
       * Hex encoded stellar hash.
       */
      value: string // ^[A-Fa-f0-9]*$
      type: "Hash"
    }
    export type CoreStellarMemoId = {
      /**
       * This field is a unsigned 64bit integer that can store values in range from 0 to 18446744073709551615.It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Id"
    }
    export type CoreStellarMemoReturn = {
      /**
       * Hex encoded stellar hash.
       */
      value: string // ^[A-Fa-f0-9]*$
      type: "Return"
    }
    export type CoreStellarMemoText = {
      /**
       * String encoded using either ASCII or UTF-8, up to 28-bytes long
       */
      value: string
      type: "Text"
    }
    export type CoreStellarOperation =
      | CoreStellarOperationAccountMerge
      | CoreStellarOperationChangeTrust
      | CoreStellarOperationCreateAccount
      | CoreStellarOperationPayment
      | CoreStellarOperationSetOptions
    export type CoreStellarOperationAccountMerge = {
      destination: CoreTransactionDestination
      type: "AccountMerge"
    }
    export type CoreStellarOperationChangeTrust = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      limit: string
      asset: CoreStellarAsset
      type: "ChangeTrust"
    }
    export type CoreStellarOperationCreateAccount = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      startingBalance: string
      type: "CreateAccount"
    }
    export type CoreStellarOperationPayment = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      asset?: CoreStellarAsset
      type: "Payment"
    }
    export type CoreStellarOperationSetOptions = {
      option: CoreStellarOption
      type: "SetOptions"
    }
    export type CoreStellarOption =
      | CoreStellarOptionOptionHomeDomain
      | CoreStellarOptionOptionSetFlag
    export type CoreStellarOptionFlag = "AuthImmutable"
    export type CoreStellarOptionOptionHomeDomain = {
      homeDomain: string
      type: "OptionHomeDomain"
    }
    export type CoreStellarOptionOptionSetFlag = {
      setFlag: CoreStellarOptionFlag
      type: "OptionSetFlag"
    }
    export type CoreStellarTickerProperties =
      | CoreStellarTickerPropertiesNative
      | CoreStellarTickerPropertiesToken
    export type CoreStellarTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreStellarTickerPropertiesToken = {
      code: string
      issuer: string
      type: "Token"
    }
    export type CoreStringsMap = {
      [name: string]: string
    }
    export type CoreSubstrateBalancesMethod = CoreSubstrateBalancesMethodTransferKeepAlive
    export type CoreSubstrateBalancesMethodTransferKeepAlive = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "TransferKeepAlive"
    }
    export type CoreSubstrateChainType = "RelayChain" | "AssetHub"
    export type CoreSubstrateFeeParameters = CoreSubstrateFeeParametersTransactionPayment
    export type CoreSubstrateFeeParametersTransactionPayment = {
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
    export type CoreSubstrateFeeStrategy = CoreSubstrateFeeStrategyPriority
    export type CoreSubstrateFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreSubstrateMethodFeeParameters = CoreSubstrateMethodFeeParametersMethodWeight
    export type CoreSubstrateMethodFeeParametersMethodWeight = {
      base: number // int64
      reads: number // int32
      writes: number // int32
      type: "MethodWeight"
    }
    export type CoreSubstrateMethodInfo = {
      name: string
      methodId: number // int32
      feeParameters: CoreSubstrateMethodFeeParameters
    }
    export type CoreSubstratePallet = CoreSubstratePalletBalances | CoreSubstratePalletStaking
    export type CoreSubstratePalletBalances = {
      method: CoreSubstrateBalancesMethod
      type: "Balances"
    }
    export type CoreSubstratePalletInfo = {
      name: string
      moduleId: number // int32
      methods: CoreSubstrateMethodInfo[]
    }
    export type CoreSubstratePalletStaking = {
      method: CoreSubstrateStakingMethod
      type: "Staking"
    }
    export type CoreSubstrateRuntimeInfo = {
      transactionVersion: number // int32
      feeParameters: CoreSubstrateFeeParameters
      pallets: CoreSubstratePalletInfo[]
      chainType?: CoreSubstrateChainType
    }
    export type CoreSubstrateStakingMethod =
      | CoreSubstrateStakingMethodBond
      | CoreSubstrateStakingMethodBondExtra
      | CoreSubstrateStakingMethodChill
      | CoreSubstrateStakingMethodNominate
      | CoreSubstrateStakingMethodRebond
      | CoreSubstrateStakingMethodSetController
      | CoreSubstrateStakingMethodSetPayee
      | CoreSubstrateStakingMethodUnbond
      | CoreSubstrateStakingMethodWithdrawUnbonded
    export type CoreSubstrateStakingMethodBond = {
      controller?: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      payee: CoreSubstrateStakingPayee
      type: "Bond"
    }
    export type CoreSubstrateStakingMethodBondExtra = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maxAdditional: string
      type: "BondExtra"
    }
    export type CoreSubstrateStakingMethodChill = {
      type: "Chill"
    }
    export type CoreSubstrateStakingMethodNominate = {
      targets: CoreTransactionDestination[]
      type: "Nominate"
    }
    export type CoreSubstrateStakingMethodRebond = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Rebond"
    }
    export type CoreSubstrateStakingMethodSetController = {
      controller?: CoreTransactionDestination
      type: "SetController"
    }
    export type CoreSubstrateStakingMethodSetPayee = {
      payee: CoreSubstrateStakingPayee
      type: "SetPayee"
    }
    export type CoreSubstrateStakingMethodUnbond = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Unbond"
    }
    export type CoreSubstrateStakingMethodWithdrawUnbonded = {
      numSlashingSpans: number // int32
      type: "WithdrawUnbonded"
    }
    export type CoreSubstrateStakingPayee =
      | CoreSubstrateStakingPayeeAccount
      | CoreSubstrateStakingPayeeController
      | CoreSubstrateStakingPayeeStaked
      | CoreSubstrateStakingPayeeStash
    export type CoreSubstrateStakingPayeeAccount = {
      destination: CoreTransactionDestination
      type: "Account"
    }
    export type CoreSubstrateStakingPayeeController = {
      type: "Controller"
    }
    export type CoreSubstrateStakingPayeeStaked = {
      type: "Staked"
    }
    export type CoreSubstrateStakingPayeeStash = {
      type: "Stash"
    }
    export type CoreSubstrateTickerProperties = CoreSubstrateTickerPropertiesNative
    export type CoreSubstrateTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreSuiFeeStrategy = CoreSuiFeeStrategyPriority
    export type CoreSuiFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreSuiOperation = CoreSuiOperationCoinTransfer | CoreSuiOperationNativeTransfer
    export type CoreSuiOperationCoinTransfer = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      /**
       * Move coin type tag, e.g. 0x2::sui::SUI (no generic type parameters).
       */
      coinType: string // ^0x[0-9a-fA-F]{1,64}::[A-Za-z_][A-Za-z0-9_]*::[A-Za-z_][A-Za-z0-9_]*$
      type: "CoinTransfer"
    }
    export type CoreSuiOperationNativeTransfer = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "NativeTransfer"
    }
    export type CoreSuiTickerProperties =
      | CoreSuiTickerPropertiesCoin
      | CoreSuiTickerPropertiesNative
    export type CoreSuiTickerPropertiesCoin = {
      /**
       * Move coin type tag, e.g. 0x2::sui::SUI (no generic type parameters).
       */
      coinType: string // ^0x[0-9a-fA-F]{1,64}::[A-Za-z_][A-Za-z0-9_]*::[A-Za-z_][A-Za-z0-9_]*$
      type: "Coin"
    }
    export type CoreSuiTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreSystemProperty =
      | CoreSystemPropertyNotaryApiKeySystemProperty
      | CoreSystemPropertyNotaryCollectionsKeySystemProperty
      | CoreSystemPropertyNotaryCommunicationKeySystemProperty
      | CoreSystemPropertyStateReviewAuthoritySystemProperty
      | CoreSystemPropertyNotarySystemSignedIntentsEnabledSystemProperty
      | CoreSystemPropertyNotarySystemSigningKeySystemProperty
      | CoreSystemPropertyAntiRewindModeSystemProperty
    export type CoreSystemPropertyAntiRewindModeSystemProperty = {
      id: CoreSystemPropertyId
      value: CoreAntiRewindModeValue
      metadata: CoreEntityMetadata
    }
    export type CoreSystemPropertyId =
      | "NOTARY_COMMUNICATION_KEY"
      | "NOTARY_COLLECTIONS_KEY"
      | "NOTARY_API_KEY"
      | "STATE_REVIEW_AUTHORITY"
      | "NOTARY_SYSTEM_SIGNING_KEY"
      | "NOTARY_SYSTEM_SIGNED_INTENTS_ENABLED"
      | "ANTI_REWIND_MODE"
    export type CoreSystemPropertyNotaryApiKeySystemProperty = {
      id: CoreSystemPropertyId
      value: CoreNotaryApiKeyValue
      metadata: CoreEntityMetadata
    }
    export type CoreSystemPropertyNotaryCollectionsKeySystemProperty = {
      id: CoreSystemPropertyId
      value: CoreNotaryCollectionsKeyValue
      metadata: CoreEntityMetadata
    }
    export type CoreSystemPropertyNotaryCommunicationKeySystemProperty = {
      id: CoreSystemPropertyId
      value: CoreNotaryCommunicationKeyValue
      metadata: CoreEntityMetadata
    }
    export type CoreSystemPropertyNotarySystemSignedIntentsEnabledSystemProperty = {
      id: CoreSystemPropertyId
      value: CoreNotarySystemSignedIntentsEnabledValue
      metadata: CoreEntityMetadata
    }
    export type CoreSystemPropertyNotarySystemSigningKeySystemProperty = {
      id: CoreSystemPropertyId
      value: CoreNotarySystemSigningKeyValue
      metadata: CoreEntityMetadata
    }
    export type CoreSystemPropertySet = {
      id: CoreSystemPropertyId
      type: "SystemPropertySet"
    }
    export type CoreSystemPropertyStateReviewAuthoritySystemProperty = {
      id: CoreSystemPropertyId
      value: CoreStateReviewAuthorityValue
      metadata: CoreEntityMetadata
    }
    export type CoreSystemSigned = {
      request: CoreSystemSignedRequest
    }
    export type CoreSystemSignedRequest = {
      targetDomainId: string // uuid
      id: string // uuid
      expiryAt: string // date-time
      payload: CoreUserIntentPayload
      description?: string
      customProperties: CoreStringsMap
      type: "SystemSigned"
    }
    export type CoreSystemSigningInfo = {
      signingKeys: CoreSystemSigningKey[]
    }
    export type CoreSystemSigningKey = {
      publicKey: string // base64
      createdAt: string // date-time
      active: boolean
    }
    export type CoreTezosFeeStrategy = CoreTezosFeeStrategyPriority
    export type CoreTezosFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreTezosOperation =
      | CoreTezosOperationDelegation
      | CoreTezosOperationReveal
      | CoreTezosOperationTransaction
      | CoreTezosOperationUndelegation
    export type CoreTezosOperationDelegation = {
      destination: CoreTransactionDestination
      type: "Delegation"
    }
    export type CoreTezosOperationReveal = {
      type: "Reveal"
    }
    export type CoreTezosOperationTransaction = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      contractParameters?: CoreContractParameters
      type: "Transaction"
    }
    export type CoreTezosOperationUndelegation = {
      type: "Undelegation"
    }
    export type CoreTezosTickerProperties = CoreTezosTickerPropertiesNative
    export type CoreTezosTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreTickerBalances = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      totalAmount: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      reservedAmount: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      quarantinedAmount: string
    }
    export type CoreTickerCreated = {
      id: string // uuid
      type: "TickerCreated"
    }
    export type CoreTickerKind = "Native" | "Contract" | "Token"
    export type CoreTickerLedgerDetails =
      | CoreTickerLedgerDetailsAlgorand
      | CoreTickerLedgerDetailsBitcoin
      | CoreTickerLedgerDetailsCardano
      | CoreTickerLedgerDetailsEthereum
      | CoreTickerLedgerDetailsHedera
      | CoreTickerLedgerDetailsSolana
      | CoreTickerLedgerDetailsStellar
      | CoreTickerLedgerDetailsSubstrate
      | CoreTickerLedgerDetailsTezos
      | CoreTickerLedgerDetailsTron
      | CoreTickerLedgerDetailsXRPL
      | CoreTickerLedgerDetailsExternal
      | CoreTickerLedgerDetailsCanton
      | CoreTickerLedgerDetailsSui
    export type CoreTickerLedgerDetailsAlgorand = {
      properties: CoreAlgorandTickerProperties
      type: "Algorand"
    }
    export type CoreTickerLedgerDetailsBitcoin = {
      properties: CoreBitcoinTickerProperties
      type: "Bitcoin"
    }
    export type CoreTickerLedgerDetailsCanton = {
      properties: CoreCantonTickerProperties
      type: "Canton"
    }
    export type CoreTickerLedgerDetailsCardano = {
      properties: CoreCardanoTickerProperties
      type: "Cardano"
    }
    export type CoreTickerLedgerDetailsEthereum = {
      properties: CoreEthereumTickerProperties
      type: "Ethereum"
    }
    export type CoreTickerLedgerDetailsExternal = {
      properties: CoreExternalTickerProperties
      type: "External"
    }
    export type CoreTickerLedgerDetailsHedera = {
      properties: CoreHederaTickerProperties
      type: "Hedera"
    }
    export type CoreTickerLedgerDetailsSolana = {
      properties: CoreSolanaTickerProperties
      type: "Solana"
    }
    export type CoreTickerLedgerDetailsStellar = {
      properties: CoreStellarTickerProperties
      type: "Stellar"
    }
    export type CoreTickerLedgerDetailsSubstrate = {
      properties: CoreSubstrateTickerProperties
      type: "Substrate"
    }
    export type CoreTickerLedgerDetailsSui = {
      properties: CoreSuiTickerProperties
      type: "Sui"
    }
    export type CoreTickerLedgerDetailsTezos = {
      properties: CoreTezosTickerProperties
      type: "Tezos"
    }
    export type CoreTickerLedgerDetailsTron = {
      properties: CoreTronTickerProperties
      type: "Tron"
    }
    export type CoreTickerLedgerDetailsXRPL = {
      properties: CoreXrplTickerProperties
      type: "XRPL"
    }
    export type CoreTickerToValidate = {
      id: string // uuid
      ledgerId: string
      kind: CoreValidatedTickerKind
      name: string
      decimals?: number // int32
      symbol?: string
      ledgerDetails: CoreTickerLedgerDetails
      lock: CoreIntentLockStatus
      description?: string
      customProperties: CoreStringsMap
    }
    export type CoreTickerUpdated = {
      id: string // uuid
      type: "TickerUpdated"
    }
    export type CoreTickerValidationStatusFilter = "Validated" | "NonValidated"
    export type CoreTickersCollection = {
      items: CoreApiTicker[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTokenDestination = CoreTokenDestinationTicker | CoreTokenDestinationTokenId
    export type CoreTokenDestinationTicker = {
      tickerId: string // uuid
      type: "Ticker"
    }
    export type CoreTokenDestinationTokenId = {
      /**
       * String consisting Hedera Token Id
       */
      tokenId: string
      type: "TokenId"
    }
    export type CoreTokenFee = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      tickerId: string // uuid
      paidByRecipient: boolean
    }
    export type CoreTokenOutput =
      | CoreTokenOutputHederaFungibleTokenOutput
      | CoreTokenOutputHederaNonFungibleTokenOutput
    export type CoreTokenOutputHederaFungibleTokenOutput = {
      token: CoreTokenDestination
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "HederaFungibleTokenOutput"
    }
    export type CoreTokenOutputHederaNonFungibleTokenOutput = {
      token: CoreNonFungibleTokenDestination
      destination: CoreTransactionDestination
      type: "HederaNonFungibleTokenOutput"
    }
    export type CoreTransactionCancellationDetails =
      | CoreTransactionCancellationDetailsOffLedger
      | CoreTransactionCancellationDetailsOnLedger
    export type CoreTransactionCancellationDetailsOffLedger = {
      type: "OffLedger"
    }
    export type CoreTransactionCancellationDetailsOnLedger = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "OnLedger"
    }
    export type CoreTransactionCreated = {
      id: string // uuid
      senderReferences: CoreAccountReference[]
      type: "TransactionCreated"
    }
    export type CoreTransactionDestination =
      | CoreTransactionDestinationAccount
      | CoreTransactionDestinationAddress
      | CoreTransactionDestinationEndpoint
    export type CoreTransactionDestinationAccount = {
      accountId: string // uuid
      type: "Account"
    }
    export type CoreTransactionDestinationAddress = {
      address: string
      type: "Address"
    }
    export type CoreTransactionDestinationEndpoint = {
      endpointId: string // uuid
      type: "Endpoint"
    }
    export type CoreTransactionDetected = {
      id: string // uuid
      accountReferences: CoreAccountReference[]
      type: "TransactionDetected"
    }
    export type CoreTransactionDryRun = {
      result: CoreTransactionDryRunResult
      estimate: CoreTransactionEstimate
    }
    export type CoreTransactionDryRunResult =
      | CoreTransactionDryRunResultFailure
      | CoreTransactionDryRunResultSuccess
    export type CoreTransactionDryRunResultFailure = {
      hint: CoreApiDryRunTransactionProcessingHint
      reason: string
      type: "Failure"
    }
    export type CoreTransactionDryRunResultSuccess = {
      type: "Success"
    }
    export type CoreTransactionEstimate =
      | CoreTransactionEstimateAlgorand
      | CoreTransactionEstimateBitcoin
      | CoreTransactionEstimateCardano
      | CoreTransactionEstimateEthereum
      | CoreTransactionEstimateFailure
      | CoreTransactionEstimateHedera
      | CoreTransactionEstimateSolana
      | CoreTransactionEstimateStellar
      | CoreTransactionEstimateSubstrate
      | CoreTransactionEstimateTezos
      | CoreTransactionEstimateTron
      | CoreTransactionEstimateXRPL
      | CoreTransactionEstimateExternal
      | CoreTransactionEstimateCanton
      | CoreTransactionEstimateSui
    export type CoreTransactionEstimateAlgorand = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "Algorand"
    }
    export type CoreTransactionEstimateBitcoin = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      vbytes: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      feeEstimationMargin: string
      type: "Bitcoin"
    }
    export type CoreTransactionEstimateCanton = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "Canton"
    }
    export type CoreTransactionEstimateCardano = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "Cardano"
    }
    export type CoreTransactionEstimateEthereum = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      gas: string
      defaultedToBlockGasLimit: boolean
      nodeErrorMessage?: string
      type: "Ethereum"
    }
    export type CoreTransactionEstimateExternal = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      tickerId: string // uuid
      type: "External"
    }
    export type CoreTransactionEstimateFailure = {
      hint: CoreApiDryRunTransactionProcessingHint
      reason: string
      type: "Failure"
    }
    export type CoreTransactionEstimateHedera = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      tokenFees?: CoreTokenFee[]
      type: "Hedera"
    }
    export type CoreTransactionEstimateSolana = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "Solana"
    }
    export type CoreTransactionEstimateStellar = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "Stellar"
    }
    export type CoreTransactionEstimateSubstrate = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "Substrate"
    }
    export type CoreTransactionEstimateSui = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      storageRebate?: string
      type: "Sui"
    }
    export type CoreTransactionEstimateTezos = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      minimalFee: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "Tezos"
    }
    export type CoreTransactionEstimateTron = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "Tron"
    }
    export type CoreTransactionEstimateXRPL = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      minimumCostInDrops: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      type: "XRPL"
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      totalReserveRequired?: string
      batchSigningData?: CoreApiBatchSigningData
    }
    export type CoreTransactionOrder = {
      id: string // uuid
      domainId: string // uuid
      accountId: string // uuid
      ledgerId?: string
      parameters: CoreTransactionOrderParameters
      metadata: CoreEntityMetadata
    }
    export type CoreTransactionOrderParameterType =
      | "Algorand"
      | "Bitcoin"
      | "BitcoinRedirect"
      | "Cardano"
      | "Ethereum"
      | "Hedera"
      | "Solana"
      | "Substrate"
      | "Tezos"
      | "XRPL"
      | "Stellar"
      | "Tron"
      | "External"
      | "Canton"
      | "Sui"
    export type CoreTransactionOrderParameters =
      | CoreTransactionOrderParametersAlgorand
      | CoreTransactionOrderParametersBitcoin
      | CoreTransactionOrderParametersBitcoinRedirect
      | CoreTransactionOrderParametersCardano
      | CoreTransactionOrderParametersEthereum
      | CoreTransactionOrderParametersHedera
      | CoreTransactionOrderParametersSolana
      | CoreTransactionOrderParametersStellar
      | CoreTransactionOrderParametersSubstrate
      | CoreTransactionOrderParametersTezos
      | CoreTransactionOrderParametersTron
      | CoreTransactionOrderParametersXRPL
      | CoreTransactionOrderParametersExternal
      | CoreTransactionOrderParametersCanton
      | CoreTransactionOrderParametersSui
    export type CoreTransactionOrderParametersAlgorand = {
      operation: CoreAlgorandOperation
      note?: string
      feeStrategy: CoreAlgorandFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Algorand"
    }
    export type CoreTransactionOrderParametersBitcoin = {
      outputs: CoreBitcoinOutputParameters[]
      feeStrategy: CoreBitcoinFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      resourceStrategy?: CoreBitcoinResourceStrategy
      addressForChange?: /* Override default change address strategy to set explicitly PrimaryAddress or GenerateNewAddress. */ CoreAddressForChange
      type: "Bitcoin"
    }
    export type CoreTransactionOrderParametersBitcoinRedirect = {
      transferIds: string /* uuid */[]
      outputs: CoreBitcoinOutputParameters[]
      feeStrategy: CoreBitcoinFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "BitcoinRedirect"
    }
    export type CoreTransactionOrderParametersCanton = {
      operation: CoreCantonOperation
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Canton"
    }
    export type CoreTransactionOrderParametersCardano = {
      operation: CoreCardanoOperation
      feeStrategy: CoreCardanoFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Cardano"
    }
    export type CoreTransactionOrderParametersEthereum = {
      destination?: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      feeStrategy: CoreEthereumFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      data?: string // ^0[xX]([a-fA-F0-9]*)$
      resourceStrategy?: CoreEthereumResourceStrategy
      type: "Ethereum"
      operation?: CoreEthereumOperation
    }
    export type CoreTransactionOrderParametersExternal = {
      operation: CoreExternalOperation
      type: "External"
    }
    export type CoreTransactionOrderParametersHedera = {
      operation: CoreHederaOperation
      /**
       * String encoded using UTF-8, up to 100-bytes long
       */
      memo?: string
      feeStrategy: CoreHederaFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Hedera"
    }
    export type CoreTransactionOrderParametersSolana = {
      operation: CoreSolanaOperation
      memos: string[]
      feeStrategy: CoreSolanaFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      nonceAccount?: CoreTransactionDestination
      type: "Solana"
      nonceAuthority?: string // uuid
    }
    export type CoreTransactionOrderParametersStellar = {
      operation: CoreStellarOperation
      memo?: CoreStellarMemo
      feeStrategy: CoreStellarFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Stellar"
    }
    export type CoreTransactionOrderParametersSubstrate = {
      pallet: CoreSubstratePallet
      feeStrategy: CoreSubstrateFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Substrate"
    }
    export type CoreTransactionOrderParametersSui = {
      operation: CoreSuiOperation
      feeStrategy: CoreSuiFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      /**
       * Expiry window in whole Sui epochs (approximately 24 hours each) from preparation; omit for the platform default.
       */
      validityEpochs?: number // int32
      type: "Sui"
    }
    export type CoreTransactionOrderParametersTezos = {
      operation: CoreTezosOperation
      feeStrategy: CoreTezosFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "Tezos"
    }
    export type CoreTransactionOrderParametersTron = {
      feeStrategy: CoreTronFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      operation: CoreTronOperation
      type: "Tron"
    }
    export type CoreTransactionOrderParametersXRPL = {
      destination?: CoreTransactionDestination
      /**
       * Deletion target: Mar. 31st 2027. This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount?: string
      feeStrategy: CoreXrplFeeStrategy
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      sourceTag?: number // int64
      /**
       * Deletion target: Mar. 31st 2027
       */
      destinationTag?: number // int64
      memos: CoreXrplMemo[]
      operation?: CoreXrplOperation
      type: "XRPL"
      sponsorship?: CoreXrplSponsorshipParams
    }
    export type CoreTransactionOrderReference = {
      id: string // uuid
      domainId: string // uuid
    }
    export type CoreTransactionProcessingStatus =
      | "Pending"
      | "Preparing"
      | "Reserved"
      | "Prepared"
      | "Broadcasting"
      | "Completed"
      | "Interrupted"
      | "Failed"
    export type CoreTransactionRelatedAccountReference = {
      id: string // uuid
      domainId: string // uuid
      sender: boolean
    }
    export type CoreTransactionUpdated = {
      id: string // uuid
      accountReferences: CoreAccountReference[]
      type: "TransactionUpdated"
    }
    export type CoreTransactionsCollection = {
      items: CoreApiTransaction[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTransferDestinationTag =
      | CoreTransferDestinationTagHedera
      | CoreTransferDestinationTagStellar
      | CoreTransferDestinationTagXRPL
    export type CoreTransferDestinationTagHedera = {
      /**
       * String encoded using UTF-8, up to 100-bytes long
       */
      memo: string
      type: "Hedera"
    }
    export type CoreTransferDestinationTagStellar = {
      memo: CoreStellarMemo
      type: "Stellar"
    }
    export type CoreTransferDestinationTagXRPL = {
      destinationTag: number // int64
      type: "XRPL"
    }
    export type CoreTransferDryRunEstimate =
      | CoreTransferDryRunEstimateFailure
      | CoreTransferDryRunEstimateSuccess
    export type CoreTransferDryRunEstimateFailure = {
      hint: CoreApiDryRunTransactionProcessingHint
      reason: string
      type: "Failure"
    }
    export type CoreTransferDryRunEstimateSuccess = {
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      fee: string
      tickerId: string // uuid
      tokenFees?: CoreTokenFee[]
      type: "Success"
    }
    export type CoreTransferKind = "Transfer" | "Fee" | "Recovery"
    export type CoreTransferMetadata =
      | CoreTransferMetadataAlgorand
      | CoreTransferMetadataBitcoin
      | CoreTransferMetadataCardano
      | CoreTransferMetadataEthereum
      | CoreTransferMetadataHedera
      | CoreTransferMetadataSolana
      | CoreTransferMetadataStellar
      | CoreTransferMetadataSubstrate
      | CoreTransferMetadataTezos
      | CoreTransferMetadataTron
      | CoreTransferMetadataXRPL
      | CoreTransferMetadataExternal
      | CoreTransferMetadataCanton
      | CoreTransferMetadataSui
    export type CoreTransferMetadataAlgorand = {
      type: "Algorand"
    }
    export type CoreTransferMetadataBitcoin = {
      outputIndex?: number // int32
      type: "Bitcoin"
    }
    export type CoreTransferMetadataCanton = {
      type: "Canton"
      memo?: string
    }
    export type CoreTransferMetadataCardano = {
      type: "Cardano"
    }
    export type CoreTransferMetadataEthereum = {
      type: "Ethereum"
    }
    export type CoreTransferMetadataExternal = {
      type: "External"
    }
    export type CoreTransferMetadataHedera = {
      type: "Hedera"
      /**
       * String encoded using UTF-8, up to 100-bytes long
       */
      memo?: string
    }
    export type CoreTransferMetadataSolana = {
      type: "Solana"
    }
    export type CoreTransferMetadataStellar = {
      type: "Stellar"
      memo?: CoreStellarMemo
    }
    export type CoreTransferMetadataSubstrate = {
      type: "Substrate"
    }
    export type CoreTransferMetadataSui = {
      type: "Sui"
    }
    export type CoreTransferMetadataTezos = {
      type: "Tezos"
    }
    export type CoreTransferMetadataTron = {
      type: "Tron"
    }
    export type CoreTransferMetadataXRPL = {
      sourceTag?: number // int64
      destinationTag?: number // int64
      type: "XRPL"
    }
    export type CoreTransferUpdated = {
      id: string // uuid
      type: "TransferUpdated"
    }
    export type CoreTransferability = {
      source?: CoreTransferabilitySource
      underlying?: CoreTransferabilityUnderlying
      destination?: CoreTransferabilityDestination
    }
    export type CoreTransferabilityDestination = CoreTransferabilityDestinationTicker
    export type CoreTransferabilityDestinationTicker = {
      tickerId: string // uuid
      type: "Ticker"
    }
    export type CoreTransferabilityResponse = {
      items: CoreTransferability[]
    }
    export type CoreTransferabilitySource = CoreTransferabilitySourceTicker
    export type CoreTransferabilitySourceTicker = {
      tickerId: string // uuid
      balances: CoreTickerBalances
      type: "Ticker"
    }
    export type CoreTransferabilityUnderlying = CoreTransferabilityUnderlyingTicker
    export type CoreTransferabilityUnderlyingTicker = {
      tickerId: string // uuid
      type: "Ticker"
    }
    export type CoreTransfersCollection = {
      items: CoreApiTransfer[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTronFeeStrategy = CoreTronFeeStrategyPriority
    export type CoreTronFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreTronOperation = CoreTronOperationNativeTransfer | CoreTronOperationTRC20Transfer
    export type CoreTronOperationNativeTransfer = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "NativeTransfer"
    }
    export type CoreTronOperationTRC20Transfer = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      contractAddress: string
      type: "TRC20Transfer"
    }
    export type CoreTronTickerProperties =
      | CoreTronTickerPropertiesNative
      | CoreTronTickerPropertiesTRC20
    export type CoreTronTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreTronTickerPropertiesTRC20 = {
      contractAddress: string
      type: "TRC20"
    }
    export type CoreTrustedDepositInstructions = {
      data: CoreDepositInstructions
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedDepositInstructionsCollection = {
      items: CoreTrustedDepositInstructions[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedDomain = {
      data: CoreDomain
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedDomainsCollection = {
      items: CoreTrustedDomain[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedEndpoint = {
      data: CoreEndpoint
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedEndpointsCollection = {
      items: CoreTrustedEndpoint[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedIntent = {
      data: CoreIntentEntity
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedIntentsCollection = {
      items: CoreTrustedIntent[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedLedger = {
      data: CoreLedger
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedLedgersCollection = {
      items: CoreTrustedLedger[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedPoliciesCollection = {
      items: CoreTrustedPolicy[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedPolicy = {
      data: CorePolicy
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedPublicKey = {
      publicKey: string // base64
      signature?: string // base64
      signedBy?: string // base64
      purpose: CoreTrustedPublicKeyPurpose
      metadata: CoreEntityMetadata
    }
    export type CoreTrustedPublicKeyAdded = {
      publicKey: string // base64
      signingPurpose: CoreTrustedPublicKeyPurpose
      type: "TrustedPublicKeyAdded"
    }
    export type CoreTrustedPublicKeyPurpose =
      | "ApiSignatures"
      | "TrustedCollectionSignatures"
      | "MessagingSignatures"
      | "SystemSignatures"
    export type CoreTrustedPublicKeyUpdated = {
      publicKey: string // base64
      signingPurpose: CoreTrustedPublicKeyPurpose
      type: "TrustedPublicKeyUpdated"
    }
    export type CoreTrustedSystemPropertiesCollection = {
      items: CoreTrustedSystemProperty[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedSystemProperty = {
      data: CoreSystemProperty
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedTransactionOrder = {
      data: CoreTransactionOrder
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedTransactionOrdersCollection = {
      items: CoreTrustedTransactionOrder[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedTrustedPublicKey = {
      data: CoreTrustedPublicKey
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedTrustedPublicKeysCollection = {
      items: CoreTrustedTrustedPublicKey[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreTrustedUser = {
      data: CoreUser
      signature: string // base64
      signingKey: string // base64
    }
    export type CoreTrustedUsersCollection = {
      items: CoreTrustedUser[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type CoreUpsertComplianceConfigurationRequest = {
      skipQuarantineFrom: CoreSkipQuarantineScope
      revision: number // int64
    }
    export type CoreUser = {
      id: string // uuid
      domainId: string // uuid
      alias: string
      publicKey: string // base64
      roles: string /* [a-z0-9\-]+ */[]
      lock: CoreLockStatus
      metadata: CoreEntityMetadata
      /**
       * Domain-unique `loginId`-`loginProviderId` pairs. Must be specified for login and match pre-configured values.
       */
      loginIds?: CoreLoginId[]
    }
    export type CoreUserCreated = {
      id: string // uuid
      type: "UserCreated"
    }
    export type CoreUserIntentPayload =
      | CoreV0AcknowledgeBackup
      | CoreV0AddAccountLedgers
      | CoreV0AddTrustedPublicKeysForMigration
      | CoreV0AttemptTransactionOrderCancellation
      | CoreV0CreateAccount
      | CoreV0CreateBackup
      | CoreV0CreateDomain
      | CoreV0CreateEndpoint
      | CoreV0CreateLedger
      | CoreV0CreatePolicy
      | CoreV0CreateTicker
      | CoreV0CreateTransactionOrder
      | CoreV0CreateTransferOrder
      | CoreV0CreateUser
      | CoreV0CreateVault
      | CoreV0ExecuteExtension
      | CoreV0LockAccount
      | CoreV0LockDomain
      | CoreV0LockEndpoint
      | CoreV0LockPolicy
      | CoreV0LockTicker
      | CoreV0LockUser
      | CoreV0LockVault
      | CoreV0MigrateSilo3AccountBatch
      | CoreV0NotarizeData
      | CoreV0ReleaseQuarantinedTransfers
      | CoreV0RewrapVaultKeyMaterial
      | CoreV0SetSystemProperty
      | CoreV0SignManifest
      | CoreV0UnlockAccount
      | CoreV0UnlockDomain
      | CoreV0UnlockEndpoint
      | CoreV0UnlockPolicy
      | CoreV0UnlockTicker
      | CoreV0UnlockUser
      | CoreV0UnlockVault
      | CoreV0UpdateAccount
      | CoreV0UpdateDomain
      | CoreV0UpdateDomainPermissions
      | CoreV0UpdateEndpoint
      | CoreV0UpdateLedger
      | CoreV0UpdatePolicy
      | CoreV0UpdateTicker
      | CoreV0UpdateUser
      | CoreV0UpdateVault
      | CoreV0ValidateTickers
      | CoreV0AddProviderKey
      | CoreV0ConnectProvider
      | CoreV0RequestDepositInstructions
      | CoreV0RegisterTrustedPublicKey
      | CoreV0ProvisionElGamalKeyPair
    export type CoreUserOperationRejectionCode =
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
      | "InvalidVaultParameters"
      | "BackupNotReady"
      | "BackupAcknowledgeDenied"
      | "VaultOperationOnExternalAccount"
      | "ExternalOperationOnVaultAccount"
      | "ValidateTickersPostProcessingFailure"
      | "ExternalProviderNotFound"
      | "ExternalProviderLocked"
      | "ExternalProviderUnexpectedState"
      | "LocationNotFound"
      | "TickerUnderlyingAssetIsNotInMetacoAssets"
      | "DepositInstructionPostProcessingFailure"
      | "SystemSignatureInvalid"
      | "SystemSigningKeyNotRegistered"
      | "SystemSigningKeyMismatch"
      | "SystemSignaturesKeyAlreadyRegistered"
      | "SystemSignedProcessingDisabled"
      | "UnsupportedTrustedPublicKeyPurpose"
      | "TrustedPublicKeyAlreadyActive"
      | "ConflictingDestinationTag"
      | "SignManifestAddressResolutionFailure"
    export type CoreUserReference = {
      id: string // uuid
      domainId: string // uuid
    }
    export type CoreUserSigned = {
      request: CorePropose
      signature: string // base64
    }
    export type CoreUserUpdated = {
      id: string // uuid
      type: "UserUpdated"
    }
    export type CoreV0AcknowledgeBackup = {
      backupId: string // uuid
      type: "v0_AcknowledgeBackup"
    }
    export type CoreV0AddAccountLedgers = {
      reference: CoreEntityIdAndRevision
      ledgerIds?: string[]
      type: "v0_AddAccountLedgers"
    }
    export type CoreV0AddProviderKey = {
      providerId: string // uuid
      publicKey: string // base64
      type: "v0_AddProviderKey"
    }
    export type CoreV0AddTrustedPublicKeysForMigration = {
      newCollectionSigningPublicKey: string // base64
      newMessageSigningPublicKey: string // base64
      newApiSigningPublicKey: string // base64
      newKeyMaterial: string
      currentCollectionSigningPublicKey: string // base64
      currentCollectionSigningPublicKeySignature: string // base64
      type: "v0_AddTrustedPublicKeysForMigration"
    }
    export type CoreV0AttemptTransactionOrderCancellation = {
      targetTransactionOrderId: string // uuid
      replacementTransactionOrderId: string // uuid
      reason: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      type: "v0_AttemptTransactionOrderCancellation"
    }
    export type CoreV0ConnectProvider = {
      id: string // uuid
      alias: string
      provider: CoreAccountProviderAction
      lock: CoreLockStatus
      description?: string
      customProperties: CoreStringsMap
      type: "v0_ConnectProvider"
    }
    export type CoreV0CreateAccount = {
      id: string // uuid
      alias: string
      providerDetails: CoreV0CreateAccountProviderDetailsPayload
      /**
       * Deletion target: Mar. 31st 2027
       */
      ledgerId?: string
      ledgerIds?: string[]
      lock: CoreIntentLockStatus
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreateAccount"
    }
    export type CoreV0CreateAccountProviderDetailsPayload =
      | CoreV0CreateAccountProviderDetailsPayloadVault
      | CoreV0CreateAccountProviderDetailsPayloadExternal
    export type CoreV0CreateAccountProviderDetailsPayloadExternal = {
      providerId: string // uuid
      locationId: string // uuid
      type: "External"
    }
    export type CoreV0CreateAccountProviderDetailsPayloadVault = {
      vaultId: string // uuid
      keyStrategy: CoreAccountKeyStrategy
      type: "Vault"
    }
    export type CoreV0CreateBackup = {
      id: string // uuid
      parameters: CoreVaultBackupParameters
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreateBackup"
    }
    export type CoreV0CreateDomain = {
      id: string // uuid
      alias: string
      lock: CoreIntentLockStatus
      governingStrategy?: CoreGoverningStrategy
      permissions: CorePermissions
      description?: string
      customProperties: CoreStringsMap
      users: CoreCreateDomainGenesisUser[]
      policies: CoreCreateDomainGenesisPolicy[]
      childrenDomainIds?: string /* uuid */[]
      type: "v0_CreateDomain"
    }
    export type CoreV0CreateEndpoint = {
      id: string // uuid
      address: string
      trustScore: number // int32
      ledgerId: string
      parameters?: CoreEndpointLedgerParameters
      alias: string
      lock: CoreIntentLockStatus
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreateEndpoint"
      /**
       * Whether an endpoint duplicating the address, ledger and tag of an existing one is accepted. Defaults to true. Deletion target: Oct. 1st 2027 — after this date such an endpoint is always rejected.
       */
      allowDuplicate?: boolean
    }
    export type CoreV0CreateLedger = {
      id: string
      alias: string
      parameters: CoreLedgerParameters
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreateLedger"
    }
    export type CoreV0CreatePolicy = {
      id: string // uuid
      alias: string
      rank: number // int32
      intentTypes?: CoreIntentType[]
      scope: CorePolicyScope
      scriptingEngine: CoreScriptingEngine
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
      CorePolicyCondition
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
      CoreWorkflowCondition[]
      lock: CoreIntentLockStatus
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreatePolicy"
      intentOrigin?: CoreIntentOrigin
    }
    export type CoreV0CreateTicker = {
      ledgerId: string
      kind: CoreTickerKind
      name: string
      decimals?: number // int32
      symbol?: string
      ledgerDetails: CoreTickerLedgerDetails
      type: "v0_CreateTicker"
    }
    export type CoreV0CreateTransactionOrder = {
      id: string // uuid
      accountId: string // uuid
      ledgerId?: string
      parameters: CoreTransactionOrderParameters
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreateTransactionOrder"
    }
    export type CoreV0CreateTransferOrder = {
      id: string // uuid
      accountId: string // uuid
      tickerId: string // uuid
      outputs: CoreCreateTransferOrderOutput[]
      feeStrategy: CoreFeePriority
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumFee?: string
      preferredAddressForChange?: /* Hint for specifically bitcoin ledgers to have the transaction happen with addressForChange PrimaryAddress - so change utxo goes to address \0\0 - aligned with dry-runs - rather than the default generate a new chain-internal address. */ CorePreferredAddressForChange
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreateTransferOrder"
      memo?: string
    }
    export type CoreV0CreateUser = {
      id: string // uuid
      alias: string
      publicKey: string // base64
      roles: string /* [a-z0-9\-]+ */[]
      lock: CoreIntentLockStatus
      description?: string
      customProperties: CoreStringsMap
      /**
       * Domain-unique `loginId`-`loginProviderId` pairs. Must be specified for login and match pre-configured values. Required when proposing or dry-running the intent; absent only on intents created before login ids existed.
       */
      loginIds?: CoreLoginId[]
      type: "v0_CreateUser"
    }
    export type CoreV0CreateVault = {
      id: string // uuid
      alias: string
      parameters?: CoreVaultParameters
      publicKey: string // base64
      lock: CoreIntentLockStatus
      description?: string
      customProperties: CoreStringsMap
      type: "v0_CreateVault"
    }
    export type CoreV0ExecuteExtension = {
      payload: {
        [name: string]: {
          [key: string]: any
        }
      }
      type: "v0_ExecuteExtension"
    }
    export type CoreV0LockAccount = {
      reference: CoreEntityIdAndRevision
      type: "v0_LockAccount"
    }
    export type CoreV0LockDomain = {
      reference: CoreEntityIdAndRevision
      type: "v0_LockDomain"
    }
    export type CoreV0LockEndpoint = {
      reference: CoreEntityIdAndRevision
      type: "v0_LockEndpoint"
    }
    export type CoreV0LockPolicy = {
      reference: CoreEntityIdAndRevision
      type: "v0_LockPolicy"
    }
    export type CoreV0LockTicker = {
      reference: CoreEntityIdAndRevision
      type: "v0_LockTicker"
    }
    export type CoreV0LockUser = {
      reference: CoreEntityIdAndRevision
      type: "v0_LockUser"
    }
    export type CoreV0LockVault = {
      reference: CoreEntityIdAndRevision
      type: "v0_LockVault"
    }
    export type CoreV0MigrateSilo3AccountBatch = {
      vaultId: string // uuid
      wasColdSilo: boolean
      wasTestSilo: boolean
      accounts: CoreV3AccountToMigrate[]
      type: "v0_MigrateSilo3AccountBatch"
    }
    export type CoreV0NotarizeData = {
      data: string
      type: "v0_NotarizeData"
    }
    export type CoreV0ProvisionElGamalKeyPair = {
      accountId: string // uuid
      ledgerId: string
      type: "v0_ProvisionElGamalKeyPair"
    }
    export type CoreV0RegisterTrustedPublicKey = {
      publicKey: string // base64
      purpose: CoreTrustedPublicKeyPurpose
      type: "v0_RegisterTrustedPublicKey"
    }
    export type CoreV0ReleaseQuarantinedTransfers = {
      accountId: string // uuid
      transferIds: string /* uuid */[]
      type: "v0_ReleaseQuarantinedTransfers"
    }
    export type CoreV0RequestDepositInstructions = {
      id: string // uuid
      accountId: string // uuid
      tickerId: string // uuid
      description?: string
      customProperties: CoreStringsMap
      type: "v0_RequestDepositInstructions"
    }
    export type CoreV0RewrapVaultKeyMaterial = {
      vaultId: string // uuid
      description?: string
      customProperties: CoreStringsMap
      type: "v0_RewrapVaultKeyMaterial"
    }
    export type CoreV0SetSystemProperty = {
      revision?: number // int64
      value: CoreReadWriteSystemPropertyKeyValue
      type: "v0_SetSystemProperty"
    }
    export type CoreV0SignManifest = {
      id: string // uuid
      accountId: string // uuid
      ledgerId?: string
      content: CoreManifestContent
      description?: string
      customProperties: CoreStringsMap
      type: "v0_SignManifest"
      address?: string
    }
    export type CoreV0UnlockAccount = {
      reference: CoreEntityIdAndRevision
      type: "v0_UnlockAccount"
    }
    export type CoreV0UnlockDomain = {
      reference: CoreEntityIdAndRevision
      type: "v0_UnlockDomain"
    }
    export type CoreV0UnlockEndpoint = {
      reference: CoreEntityIdAndRevision
      type: "v0_UnlockEndpoint"
    }
    export type CoreV0UnlockPolicy = {
      reference: CoreEntityIdAndRevision
      type: "v0_UnlockPolicy"
    }
    export type CoreV0UnlockTicker = {
      reference: CoreEntityIdAndRevision
      type: "v0_UnlockTicker"
    }
    export type CoreV0UnlockUser = {
      reference: CoreEntityIdAndRevision
      type: "v0_UnlockUser"
    }
    export type CoreV0UnlockVault = {
      reference: CoreEntityIdAndRevision
      type: "v0_UnlockVault"
    }
    export type CoreV0UpdateAccount = {
      reference: CoreEntityIdAndRevision
      alias: string
      description?: string
      customProperties: CoreStringsMap
      type: "v0_UpdateAccount"
    }
    export type CoreV0UpdateDomain = {
      reference: CoreEntityIdAndRevision
      alias: string
      description?: string
      customProperties: CoreStringsMap
      type: "v0_UpdateDomain"
    }
    export type CoreV0UpdateDomainPermissions = {
      reference: CoreEntityIdAndRevision
      permissions: CorePermissions
      type: "v0_UpdateDomainPermissions"
    }
    export type CoreV0UpdateEndpoint = {
      reference: CoreEntityIdAndRevision
      address: string
      trustScore: number // int32
      /**
       * Deletion target: Mar. 31st 2027
       */
      ledgerId?: string
      parameters?: CoreEndpointLedgerParameters
      alias: string
      description?: string
      customProperties: CoreStringsMap
      type: "v0_UpdateEndpoint"
      /**
       * Whether an endpoint duplicating the address, ledger and tag of an existing one is accepted. Defaults to true. Deletion target: Oct. 1st 2027 — after this date such an endpoint is always rejected.
       */
      allowDuplicate?: boolean
    }
    export type CoreV0UpdateLedger = {
      reference: CoreEntityStringIdAndRevision
      alias: string
      parameters: CoreLedgerParameters
      description?: string
      customProperties: CoreStringsMap
      type: "v0_UpdateLedger"
    }
    export type CoreV0UpdatePolicy = {
      reference: CoreEntityIdAndRevision
      alias: string
      rank: number // int32
      intentTypes?: CoreIntentType[]
      scope: CorePolicyScope
      scriptingEngine: CoreScriptingEngine
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
      CorePolicyCondition
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
      CoreWorkflowCondition[]
      description?: string
      customProperties: CoreStringsMap
      type: "v0_UpdatePolicy"
      intentOrigin?: CoreIntentOrigin
    }
    export type CoreV0UpdateTicker = {
      reference: CoreEntityIdAndRevision
      name: string
      decimals?: number // int32
      symbol?: string
      description?: string
      customProperties: CoreStringsMap
      type: "v0_UpdateTicker"
    }
    export type CoreV0UpdateUser = {
      reference: CoreEntityIdAndRevision
      alias: string
      roles: string /* [a-z0-9\-]+ */[]
      description?: string
      customProperties: CoreStringsMap
      /**
       * Domain-unique `loginId`-`loginProviderId` pairs. Must be specified for login and match pre-configured values. Required when proposing or dry-running the intent; absent only on intents created before login ids existed.
       */
      loginIds?: CoreLoginId[]
      type: "v0_UpdateUser"
    }
    export type CoreV0UpdateVault = {
      reference: CoreEntityIdAndRevision
      alias: string
      parameters?: CoreVaultParameters
      description?: string
      customProperties: CoreStringsMap
      type: "v0_UpdateVault"
    }
    export type CoreV0ValidateTickers = {
      tickers: CoreTickerToValidate[]
      type: "v0_ValidateTickers"
    }
    export type CoreV3AccountToMigrate = {
      id: string // uuid
      alias: string
      description?: string
      ledgerId: string
      lockStatus: CoreIntentLockStatus
      /**
       * example:
       * D37D-04ACF7C4
       */
      publicId: string // ^([A-Fa-f0-9]{4})-([0-7][A-Fa-f0-9]{7})$
      customProperties: CoreStringsMap
    }
    export type CoreValidatedTickerKind = "Native" | "Contract" | "Token"
    export type CoreVault = {
      id: string // uuid
      publicKey: string // base64
      parameters?: CoreVaultParameters
      supportedDerivations?: CoreVaultDerivation[]
      enabledKeyStrategies?: CoreVaultKeyStrategy[]
      alias: string
      lock: CoreLockStatus
      metadata: CoreEntityMetadata
    }
    export type CoreVaultAccountKeyInformation =
      | CoreVaultAccountKeyInformationRandom
      | CoreVaultAccountKeyInformationVaultDerived
    export type CoreVaultAccountKeyInformationRandom = {
      publicKey?: CoreAccountPublicKey
      type: "Random"
    }
    export type CoreVaultAccountKeyInformationVaultDerived = {
      publicKey?: CoreAccountPublicKey
      derivationPath: string
      type: "VaultDerived"
    }
    export type CoreVaultAccountProviderInformationKey =
      | CoreVaultAccountProviderInformationKeyVaultDerived
      | CoreVaultAccountProviderInformationKeyVaultDerivedNonExtended
      | CoreVaultAccountProviderInformationKeyVaultRandom
      | CoreVaultAccountProviderInformationKeyVaultReserved
    export type CoreVaultAccountProviderInformationKeyId =
      | "SECP256K1_CUSTODY_1"
      | "ED25519_CUSTODY_1"
      | "ED25519_CUSTODY_2"
      | "ED25519_STAKING_1"
      | "ED25519_CANTON_PARTY_1"
    export type CoreVaultAccountProviderInformationKeyVaultDerived = {
      id: CoreVaultAccountProviderInformationKeyId
      derivationPath: string
      publicKey?: CoreAccountPublicKeyExtendedOnly
      type: "VaultDerived"
    }
    export type CoreVaultAccountProviderInformationKeyVaultDerivedNonExtended = {
      id: CoreVaultAccountProviderInformationKeyId
      derivationPath: string
      publicKey: CoreAccountPublicKeyOnly
      type: "VaultDerivedNonExtended"
    }
    export type CoreVaultAccountProviderInformationKeyVaultRandom = {
      id: CoreVaultAccountProviderInformationKeyId
      publicKey?: CoreAccountPublicKey
      type: "VaultRandom"
    }
    export type CoreVaultAccountProviderInformationKeyVaultReserved = {
      id: CoreVaultAccountProviderInformationKeyId
      publicKey?: CoreAccountPublicKeyOnly
      type: "VaultReserved"
    }
    export type CoreVaultAdditionalDetails = {
      processing: CoreVaultProcessingDetails
    }
    export type CoreVaultBackupParameters =
      | CoreVaultBackupParametersVaultHsm
      | CoreVaultBackupParametersVaultMpc
    export type CoreVaultBackupParametersVaultHsm = {
      vaultId: string // uuid
      type: "VaultHsm"
    }
    export type CoreVaultBackupParametersVaultMpc = {
      vaultId: string // uuid
      type: "VaultMpc"
    }
    export type CoreVaultCreated = {
      id: string // uuid
      type: "VaultCreated"
    }
    export type CoreVaultDerivation = "Slip10" | "SoftBip32" | "None" | "Bip32"
    export type CoreVaultHsmBackupData = {
      acknowledged: boolean
      encryptedSeed: string // base64
      hash: string
    }
    export type CoreVaultKeyMaterialRewrapCompleted = {
      id: string // uuid
      type: "VaultKeyMaterialRewrapCompleted"
    }
    export type CoreVaultKeyMaterialRewrapFailed = {
      id: string // uuid
      type: "VaultKeyMaterialRewrapFailed"
    }
    export type CoreVaultKeyStrategy = "VaultHard" | "VaultSoft" | "Random"
    export type CoreVaultMpcBackupData = {
      acknowledged: boolean
      json: string
      hash: string
    }
    export type CoreVaultParameters = CoreVaultParametersHSM | CoreVaultParametersMPC
    export type CoreVaultParametersHSM = {
      type: "HSM"
    }
    export type CoreVaultParametersMPC = {
      /**
       * 0x prefixed Hex encoded backup encryption key, supported key size between 2048 and 4096 bits.
       */
      backupEncryptionKey?: string // ^0[xX](([a-fA-F0-9][a-fA-F0-9])*)$
      type: "MPC"
    }
    export type CoreVaultProcessingDetails =
      | CoreVaultProcessingDetailsCompleted
      | CoreVaultProcessingDetailsPending
      | CoreVaultProcessingDetailsPreparing
    export type CoreVaultProcessingDetailsCompleted = {
      status: "Completed"
    }
    export type CoreVaultProcessingDetailsPending = {
      status: "Pending"
    }
    export type CoreVaultProcessingDetailsPreparing = {
      status: "Preparing"
    }
    export type CoreVaultProcessingStatus = "Pending" | "Preparing" | "Completed"
    export type CoreVaultUpdated = {
      id: string // uuid
      type: "VaultUpdated"
    }
    export type CoreVaultsCollection = {
      items: CoreApiVault[]
      count: number // int32
      currentStartingAfter?: string
      nextStartingAfter?: string
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
    export type CoreWorkflowCondition =
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
      CoreWorkflowConditionAnd | CoreWorkflowConditionOr | CoreWorkflowConditionRoleQuorum
    export type CoreWorkflowConditionAnd = {
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
      CoreWorkflowCondition
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
      CoreWorkflowCondition
      type: "And"
    }
    export type CoreWorkflowConditionOr = {
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
      CoreWorkflowCondition
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
      CoreWorkflowCondition
      type: "Or"
    }
    export type CoreWorkflowConditionRoleQuorum = {
      role: string // [a-z0-9\-]+
      quorum: number // int32
      type: "RoleQuorum"
    }
    export type CoreWorkflowProgress = {
      stepProgress: CoreWorkflowStep[]
      policyReference: CorePolicyReference
    }
    export type CoreWorkflowStep = {
      state: CoreWorkflowStepStatus
      decisions: CoreDecisionPayload[]
    }
    export type CoreWorkflowStepStatus = "Open" | "Approved" | "Failed" | "Rejected"
    export type CoreXrplAccountSetFlag =
      | "asfGlobalFreeze"
      | "asfNoFreeze"
      | "asfRequireAuth"
      | "asfAllowTrustLineClawback"
      | "asfAccountTxnID"
      | "asfDepositAuth"
      | "asfRequireDest"
      | "asfDefaultRipple"
    export type CoreXrplAssetQuantity = {
      currency?: CoreXrplIouCurrency
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
    }
    export type CoreXrplBatchExecutionMode =
      | "AllOrNothing"
      | "OnlyOne"
      | "UntilFailure"
      | "Independent"
    export type CoreXrplClawbackCurrency =
      | CoreXrplClawbackCurrencyCurrency
      | CoreXrplClawbackCurrencyMultiPurposeToken
      | CoreXrplClawbackCurrencyTickerId
    export type CoreXrplClawbackCurrencyCurrency = {
      code: string
      issuer: string
      type: "Currency"
    }
    export type CoreXrplClawbackCurrencyMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MultiPurposeToken"
    }
    export type CoreXrplClawbackCurrencyTickerId = {
      tickerId: string // uuid
      type: "TickerId"
    }
    export type CoreXrplCmptCryptographicFields = {
      /**
       * Hex encoded string.
       */
      senderEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      destinationEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      issuerEncryptedAmount: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      balanceCommitment: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      amountCommitment: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      zkProof: string // ^[A-Fa-f0-9]*$
      /**
       * Hex encoded string.
       */
      auditorEncryptedAmount?: string // ^[A-Fa-f0-9]*$
    }
    export type CoreXrplFee = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      multiplier: string
    }
    export type CoreXrplFeeStrategy =
      | CoreXrplFeeStrategyPriority
      | CoreXrplFeeStrategySpecifiedAdditionalFee
    export type CoreXrplFeeStrategyPriority = {
      priority: CoreFeePriority
      type: "Priority"
    }
    export type CoreXrplFeeStrategySpecifiedAdditionalFee = {
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      drops: string
      type: "SpecifiedAdditionalFee"
    }
    export type CoreXrplIouCurrency = CoreXrplIouCurrencyCurrency | CoreXrplIouCurrencyTickerId
    export type CoreXrplIouCurrencyCurrency = {
      code: string
      issuer: string
      type: "Currency"
    }
    export type CoreXrplIouCurrencyTickerId = {
      tickerId: string // uuid
      type: "TickerId"
    }
    export type CoreXrplLimitAmount = {
      currency: CoreXrplIouCurrency
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
    }
    export type CoreXrplMPTokenAuthorizeFlag = "tfMPTUnauthorize"
    export type CoreXrplMPTokenIdentifier =
      | CoreXrplMPTokenIdentifierMPTokenIssuanceId
      | CoreXrplMPTokenIdentifierTickerId
    export type CoreXrplMPTokenIdentifierMPTokenIssuanceId = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MPTokenIssuanceId"
    }
    export type CoreXrplMPTokenIdentifierTickerId = {
      tickerId: string // uuid
      type: "TickerId"
    }
    export type CoreXrplMPTokenIssuanceCreateFlag =
      | "tfMPTRequireAuth"
      | "tfMPTCanClawback"
      | "tfMPTCanTransfer"
      | "tfMPTCanEscrow"
      | "tfMPTCanLock"
      | "tfMPTCanTrade"
      | "tfMPTCanConfidentialAmount"
    export type CoreXrplMPTokenIssuanceMutableFlag = "MPTSetCanConfidentialAmount"
    export type CoreXrplMPTokenIssuanceSetFlag = "tfMPTLock" | "tfMPTUnlock"
    export type CoreXrplMemo = {
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
    export type CoreXrplOfferCreateFlag = "tfImmediateOrCancel" | "tfFillOrKill" | "tfSell"
    export type CoreXrplOnLedgerTokenData = CoreMultiPurposeToken
    export type CoreXrplOperation =
      | CoreXrplOperationAccountSet
      | CoreXrplOperationClawback
      | CoreXrplOperationDepositPreauth
      | CoreXrplOperationEscrowFinish
      | CoreXrplOperationMPTokenAuthorize
      | CoreXrplOperationMPTokenIssuanceCreate
      | CoreXrplOperationMPTokenIssuanceDestroy
      | CoreXrplOperationMPTokenIssuanceSet
      | CoreXrplOperationOfferCreate
      | CoreXrplOperationPayment
      | CoreXrplOperationTrustSet
      | CoreXrplOperationBatch
      | CoreXrplOperationConfidentialMPTClawback
      | CoreXrplOperationConfidentialMPTConvert
      | CoreXrplOperationConfidentialMPTConvertBack
      | CoreXrplOperationConfidentialMPTMergeInbox
      | CoreXrplOperationConfidentialMPTSend
      | CoreXrplOperationSponsorshipSetAsSponsee
      | CoreXrplOperationSponsorshipSetAsSponsor
      | CoreXrplOperationTicketCreate
    export type CoreXrplOperationAccountSet = {
      setFlag?: CoreXrplAccountSetFlag
      clearFlag?: CoreXrplAccountSetFlag
      transferRate?: number // int32
      type: "AccountSet"
    }
    export type CoreXrplOperationBatch = {
      executionMode: CoreXrplBatchExecutionMode
      entries: CoreBatchEntry[]
      batchSigners: CoreBatchSigner[]
      sequencing: CoreSequencing
      lastLedgerSequence?: number // int64
      type: "Batch"
    }
    export type CoreXrplOperationClawback = {
      currency: CoreXrplClawbackCurrency
      holder: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Clawback"
    }
    export type CoreXrplOperationConfidentialMPTClawback = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      holder: CoreTransactionDestination
      cryptographicFields?: CoreCmptCryptographicFields
      type: "ConfidentialMPTClawback"
    }
    export type CoreXrplOperationConfidentialMPTConvert = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "ConfidentialMPTConvert"
    }
    export type CoreXrplOperationConfidentialMPTConvertBack = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      type: "ConfidentialMPTConvertBack"
    }
    export type CoreXrplOperationConfidentialMPTMergeInbox = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      type: "ConfidentialMPTMergeInbox"
    }
    export type CoreXrplOperationConfidentialMPTSend = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount?: string
      /**
       * Hex encoded string.
       */
      senderEncryptedBalance?: string // ^[A-Fa-f0-9]*$
      senderEncryptedBalanceVersion?: number // int64
      cryptographicFields?: CoreCmptCryptographicFields
      type: "ConfidentialMPTSend"
    }
    export type CoreXrplOperationDepositPreauth = {
      authorize?: CoreTransactionDestination
      unauthorize?: CoreTransactionDestination
      type: "DepositPreauth"
    }
    export type CoreXrplOperationEscrowFinish = {
      owner: CoreTransactionDestination
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
    export type CoreXrplOperationMPTokenAuthorize = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      flags: CoreXrplMPTokenAuthorizeFlag[]
      holder?: CoreTransactionDestination
      type: "MPTokenAuthorize"
    }
    export type CoreXrplOperationMPTokenIssuanceCreate = {
      flags: CoreXrplMPTokenIssuanceCreateFlag[]
      assetScale?: number // int32
      /**
       * Transfer fee for MultiPurposeToken, must be from 0 to 50000
       */
      transferFee?: number // int32
      /**
       * This field is a unsigned 64bit integer that can store values in range from 0 to 18446744073709551615.It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumAmount?: string
      metadata?: CoreMPTokenIssuanceMetadata
      type: "MPTokenIssuanceCreate"
    }
    export type CoreXrplOperationMPTokenIssuanceDestroy = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      type: "MPTokenIssuanceDestroy"
    }
    export type CoreXrplOperationMPTokenIssuanceSet = {
      tokenIdentifier: CoreXrplMPTokenIdentifier
      holder?: CoreTransactionDestination
      flags: CoreXrplMPTokenIssuanceSetFlag[]
      type: "MPTokenIssuanceSet"
      issuerEncryptionKey?: string
      auditorEncryptionKey?: string
      mutableFlags: CoreXrplMPTokenIssuanceMutableFlag[]
    }
    export type CoreXrplOperationOfferCreate = {
      flags: CoreXrplOfferCreateFlag[]
      takerGets: CoreXrplAssetQuantity
      takerPays: CoreXrplAssetQuantity
      type: "OfferCreate"
    }
    export type CoreXrplOperationPayment = {
      destination: CoreTransactionDestination
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      destinationTag?: number // int64
      currency?: CoreXrplPaymentCurrency
      type: "Payment"
      flags?: CoreXrplPaymentFlag[]
    }
    export type CoreXrplOperationSponsorshipSetAsSponsee = {
      sponsor: CoreTransactionDestination
      type: "SponsorshipSetAsSponsee"
    }
    export type CoreXrplOperationSponsorshipSetAsSponsor = {
      sponsee: CoreTransactionDestination
      /**
       * This field is a large integer and represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      feeAmountDelta?: string
      remainingOwnerCountDelta?: number // int32
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maxFee?: string
      flags: CoreXrplSponsorshipSetFlag[]
      type: "SponsorshipSetAsSponsor"
    }
    export type CoreXrplOperationTicketCreate = {
      /**
       * Number of tickets to create, must be from 1 to 250
       */
      ticketCount: number // int32
      type: "TicketCreate"
    }
    export type CoreXrplOperationTrustSet = {
      flags: CoreXrplTrustSetFlag[]
      limitAmount: CoreXrplLimitAmount
      enableRippling?: boolean
      type: "TrustSet"
    }
    export type CoreXrplPaymentCurrency =
      | CoreXrplPaymentCurrencyCurrency
      | CoreXrplPaymentCurrencyMultiPurposeToken
      | CoreXrplPaymentCurrencyTickerId
    export type CoreXrplPaymentCurrencyCurrency = {
      code: string
      issuer: string
      type: "Currency"
    }
    export type CoreXrplPaymentCurrencyMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MultiPurposeToken"
    }
    export type CoreXrplPaymentCurrencyTickerId = {
      tickerId: string // uuid
      type: "TickerId"
    }
    export type CoreXrplPaymentFlag = "tfSponsorCreatedAccount"
    export type CoreXrplResolvedAssetQuantity = {
      currency?: CoreXrplResolvedIouCurrency
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
    }
    export type CoreXrplResolvedBatchInnerOperation =
      | CoreXrplResolvedBatchInnerOperationAccountSet
      | CoreXrplResolvedBatchInnerOperationClawback
      | CoreXrplResolvedBatchInnerOperationConfidentialMPTSend
      | CoreXrplResolvedBatchInnerOperationDepositPreauth
      | CoreXrplResolvedBatchInnerOperationEscrowFinish
      | CoreXrplResolvedBatchInnerOperationMPTokenAuthorize
      | CoreXrplResolvedBatchInnerOperationMPTokenIssuanceCreate
      | CoreXrplResolvedBatchInnerOperationMPTokenIssuanceDestroy
      | CoreXrplResolvedBatchInnerOperationMPTokenIssuanceSet
      | CoreXrplResolvedBatchInnerOperationOfferCreate
      | CoreXrplResolvedBatchInnerOperationPayment
      | CoreXrplResolvedBatchInnerOperationTicketCreate
      | CoreXrplResolvedBatchInnerOperationTrustSet
    export type CoreXrplResolvedBatchInnerOperationAccountSet = {
      setFlag?: CoreXrplAccountSetFlag
      clearFlag?: CoreXrplAccountSetFlag
      transferRate?: number // int32
      type: "AccountSet"
    }
    export type CoreXrplResolvedBatchInnerOperationClawback = {
      currency: CoreXrplResolvedClawbackCurrency
      holder: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
      type: "Clawback"
    }
    export type CoreXrplResolvedBatchInnerOperationConfidentialMPTSend = {
      tokenIdentifier: CoreXrplResolvedMPTokenIdentifier
      destination: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      /**
       * Hex encoded string.
       */
      senderEncryptedBalance: string // ^[A-Fa-f0-9]*$
      senderEncryptedBalanceVersion: number // int64
      cryptographicFields: CoreXrplCmptCryptographicFields
      type: "ConfidentialMPTSend"
    }
    export type CoreXrplResolvedBatchInnerOperationDepositPreauth = {
      authorize?: string
      unauthorize?: string
      type: "DepositPreauth"
    }
    export type CoreXrplResolvedBatchInnerOperationEscrowFinish = {
      owner: string
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
    export type CoreXrplResolvedBatchInnerOperationMPTokenAuthorize = {
      tokenIdentifier: CoreXrplResolvedMPTokenIdentifier
      flags: CoreXrplMPTokenAuthorizeFlag[]
      holder?: string
      type: "MPTokenAuthorize"
    }
    export type CoreXrplResolvedBatchInnerOperationMPTokenIssuanceCreate = {
      flags: CoreXrplMPTokenIssuanceCreateFlag[]
      assetScale?: number // int32
      /**
       * Transfer fee for MultiPurposeToken, must be from 0 to 50000
       */
      transferFee?: number // int32
      /**
       * This field is a unsigned 64bit integer that can store values in range from 0 to 18446744073709551615.It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      maximumAmount?: string
      metadata?: CoreMPTokenIssuanceMetadata
      type: "MPTokenIssuanceCreate"
    }
    export type CoreXrplResolvedBatchInnerOperationMPTokenIssuanceDestroy = {
      tokenIdentifier: CoreXrplResolvedMPTokenIdentifier
      type: "MPTokenIssuanceDestroy"
    }
    export type CoreXrplResolvedBatchInnerOperationMPTokenIssuanceSet = {
      tokenIdentifier: CoreXrplResolvedMPTokenIdentifier
      holder?: string
      flags: CoreXrplMPTokenIssuanceSetFlag[]
      issuerEncryptionKey?: string
      auditorEncryptionKey?: string
      mutableFlags: CoreXrplMPTokenIssuanceMutableFlag[]
      type: "MPTokenIssuanceSet"
    }
    export type CoreXrplResolvedBatchInnerOperationOfferCreate = {
      flags: CoreXrplOfferCreateFlag[]
      takerGets: CoreXrplResolvedAssetQuantity
      takerPays: CoreXrplResolvedAssetQuantity
      type: "OfferCreate"
    }
    export type CoreXrplResolvedBatchInnerOperationPayment = {
      destination: string
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      amount: string
      destinationTag?: number // int64
      currency?: CoreXrplResolvedPaymentCurrency
      type: "Payment"
    }
    export type CoreXrplResolvedBatchInnerOperationTicketCreate = {
      /**
       * Number of tickets to create, must be from 1 to 250
       */
      ticketCount: number // int32
      type: "TicketCreate"
    }
    export type CoreXrplResolvedBatchInnerOperationTrustSet = {
      flags: CoreXrplTrustSetFlag[]
      limitAmount: CoreXrplResolvedLimitAmount
      enableRippling?: boolean
      type: "TrustSet"
    }
    export type CoreXrplResolvedClawbackCurrency =
      | CoreXrplResolvedClawbackCurrencyFungible
      | CoreXrplResolvedClawbackCurrencyMultiPurposeToken
    export type CoreXrplResolvedClawbackCurrencyFungible = {
      code: string
      issuer: string
      type: "Fungible"
    }
    export type CoreXrplResolvedClawbackCurrencyMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MultiPurposeToken"
    }
    export type CoreXrplResolvedIouCurrency = {
      code: string
      issuer: string
    }
    export type CoreXrplResolvedLimitAmount = {
      currency: CoreXrplResolvedIouCurrency
      /**
       * This field is a large integer that can be positive or zero. It is represented as a string because it may contain value that cannot be expressed with JSON number without a loss of precision.
       */
      value: string
    }
    export type CoreXrplResolvedMPTokenIdentifier = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
    }
    export type CoreXrplResolvedPaymentCurrency =
      | CoreXrplResolvedPaymentCurrencyFungible
      | CoreXrplResolvedPaymentCurrencyMultiPurposeToken
    export type CoreXrplResolvedPaymentCurrencyFungible = {
      code: string
      issuer: string
      type: "Fungible"
    }
    export type CoreXrplResolvedPaymentCurrencyMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MultiPurposeToken"
    }
    /**
     * spfSponsorFee sponsors the transaction fee, spfSponsorReserve the owner reserve. spfSponsorReserve is rejected on transaction types for which the ledger does not allow reserve sponsorship (e.g. OfferCreate, TicketCreate, ConfidentialMPT operations)
     */
    export type CoreXrplSponsorFlag = "spfSponsorFee" | "spfSponsorReserve"
    export type CoreXrplSponsorshipMovement = "Funded" | "Spent" | "Returned"
    export type CoreXrplSponsorshipParams = {
      sponsor: CoreTransactionDestination
      flags: /* spfSponsorFee sponsors the transaction fee, spfSponsorReserve the owner reserve. spfSponsorReserve is rejected on transaction types for which the ledger does not allow reserve sponsorship (e.g. OfferCreate, TicketCreate, ConfidentialMPT operations) */ CoreXrplSponsorFlag[]
    }
    export type CoreXrplSponsorshipSetFlag =
      | "tfRequireSignForFee"
      | "tfClearRequireSignForFee"
      | "tfRequireSignForReserve"
      | "tfClearRequireSignForReserve"
      | "tfDeleteObject"
    export type CoreXrplTickerProperties =
      | CoreXrplTickerPropertiesFungibleToken
      | CoreXrplTickerPropertiesMultiPurposeToken
      | CoreXrplTickerPropertiesNative
      | CoreXrplTickerPropertiesConfidentialMultiPurposeToken
    export type CoreXrplTickerPropertiesConfidentialMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "ConfidentialMultiPurposeToken"
    }
    export type CoreXrplTickerPropertiesFungibleToken = {
      currencyCode: string
      issuer: string
      type: "FungibleToken"
    }
    export type CoreXrplTickerPropertiesMultiPurposeToken = {
      /**
       * XRPL MPToken Issuance ID (192-bit integer hex encoded)
       */
      issuanceId: string // ^[A-Fa-f0-9]*$
      type: "MultiPurposeToken"
    }
    export type CoreXrplTickerPropertiesNative = {
      type: "Native"
    }
    export type CoreXrplTrustSetFlag = "tfSetFreeze" | "tfClearFreeze" | "tfSetfAuth"
    export type EDSChannel = {
      id?: string // uuid
      domainId?: string // uuid
      name?: string
      supportedEventTypes?: string[]
      type?: "WEBHOOK"
      status?: "ACTIVE" | "DISABLED"
      maxRetries?: number // int32
      url?: string
      createdBy?: string // uuid
      lastUpdatedBy?: string // uuid
      createdAt?: string // date-time
      lastUpdatedAt?: string // date-time
      errorRate?: number // double
    }
    export type EDSChannelCreate = {
      id: string // uuid
      name: string
      supportedEventTypes: string[]
      status?: "ACTIVE" | "DISABLED"
      maxRetries?: number // int32
      createdBy: string // uuid
      type: string
    }
    export type EDSChannelUpdate = {
      name?: string
      supportedEventTypes?: string[]
      status?: "active" | "disabled"
      maxRetries?: number // int32
      lastUpdatedBy?: string // uuid
    }
    export type EDSEvent = {
      id?: string // uuid
      channelId?: string // uuid
      channelName?: string
      type?: string
      status?: "PENDING" | "SUCCESS" | "FAILED"
      createdAt?: string // date-time
      lastUpdatedAt?: string // date-time
      retriedCount?: number // int32
      payload?: string
    }
    export type EDSWebhookChannelCreate = {
      id: string // uuid
      name: string
      supportedEventTypes: string[]
      status?: "ACTIVE" | "DISABLED"
      maxRetries?: number // int32
      createdBy: string // uuid
      type: "WEBHOOK"
      url: string
    }
    export type ExportDateRangeDto = {
      /**
       * Start of date range (ISO-8601)
       */
      start: string
      /**
       * End of date range (ISO-8601)
       */
      end: string
    }
    export type ExportExportControlTotalsDto = {
      /**
       * Sum of all totalBalance values (Position Report only). BigNumber-formatted string.
       * example:
       * 429.04029589
       */
      balanceTotalAmount?: string
      /**
       * Sum of all reservedBalance values (Position Report only). BigNumber-formatted string.
       * example:
       * 2.0033804
       */
      balanceReservedAmount?: string
      /**
       * Sum of all quarantineBalance values (Position Report only). BigNumber-formatted string.
       * example:
       * 122.2
       */
      balanceQuarantinedAmount?: string
      /**
       * Sum of all enrichedTransactionValue values (Movement Report only). BigNumber-formatted string.
       * example:
       * 154.54
       */
      valueSum?: string
    }
    export type ExportExportErrorDto = {
      /**
       * HTTP status code.
       */
      statusCode: number
      /**
       * Client-safe error message. Validation errors (400) return an array of messages.
       */
      message:
        | /* Client-safe error message. Validation errors (400) return an array of messages. */ string
        | string[]
      /**
       * HTTP error name.
       */
      error?: string
    }
    export type ExportExportMetadataDto = {
      /**
       * Unique identifier of this export. Also returned in the X-Export-Id header.
       * example:
       * cef02796-daca-425f-91ed-f670eb8ec99f
       */
      exportId: string
      /**
       * Identity that requested the export.
       * example:
       * harmonize:hmz@metaco.com
       */
      requestAuthor: string
      /**
       * Generation timestamp (ISO-8601).
       * example:
       * 2026-08-27T09:15:00Z
       */
      generatedAt: string
      /**
       * Echo of the request filter parameters.
       * example:
       * {
       *   "domainId": "5cd224fe-193e-8bce-c94c-c6c05245e2d1",
       *   "asOfTimestamp": "2026-08-21T16:32:03.9740000+00:00",
       *   "includeZeroBalances": true
       * }
       */
      filters: {
        [key: string]: any
      }
      /**
       * Echoed from the request — Position Report only (ISO-8601).
       * example:
       * 2026-08-27T00:00:00Z
       */
      asOfTimestamp?: string
      /**
       * Echoed from the request — Movement Report only (ISO-8601).
       * example:
       * 2026-07-25T00:00:00Z
       */
      dateRangeStart?: string
      /**
       * Echoed from the request — Movement Report only (ISO-8601).
       * example:
       * 2026-08-27T00:00:00Z
       */
      dateRangeEnd?: string
      /**
       * Number of data rows. Position: one row per (account, ticker). Movement: one row per transfer.
       * example:
       * 22
       */
      recordCount: number
      /**
       * Reconciliation control totals across all rows.
       */
      controlTotals: {
        /**
         * Sum of all totalBalance values (Position Report only). BigNumber-formatted string.
         * example:
         * 429.04029589
         */
        balanceTotalAmount?: string
        /**
         * Sum of all reservedBalance values (Position Report only). BigNumber-formatted string.
         * example:
         * 2.0033804
         */
        balanceReservedAmount?: string
        /**
         * Sum of all quarantineBalance values (Position Report only). BigNumber-formatted string.
         * example:
         * 122.2
         */
        balanceQuarantinedAmount?: string
        /**
         * Sum of all enrichedTransactionValue values (Movement Report only). BigNumber-formatted string.
         * example:
         * 154.54
         */
        valueSum?: string
      }
    }
    export type ExportMovementExportDto = {
      /**
       * Domain UUID to export movement data for
       */
      domainId: string
      /**
       * Date range for transaction history
       */
      dateRange: {
        /**
         * Start of date range (ISO-8601)
         */
        start: string
        /**
         * End of date range (ISO-8601)
         */
        end: string
      }
      /**
       * Include data from child domains
       */
      includeChildDomains?: boolean
      /**
       * Filter by vault UUIDs
       */
      vaultIds?: string[]
      /**
       * Filter by ticker UUIDs
       */
      tickerIds?: string[]
      /**
       * Filter by account UUIDs
       */
      accountIds?: string[]
      /**
       * Filter by custody status. Defaults to ["Completed"] (settled only) for reconciliation. Pass all values for full visibility.
       */
      custodyStatus?: (
        | "Broadcasting"
        | "Completed"
        | "Failed"
        | "Interrupted"
        | "Pending"
        | "Prepared"
        | "Preparing"
        | "Reserved"
      )[]
      /**
       * Filter by ledger status. Defaults to ["Confirmed"] (settled only) for reconciliation. Pass all values for full visibility.
       */
      ledgerStatus?: ("Detected" | "Confirmed" | "Expired" | "Replaced")[]
      /**
       * Output format
       */
      format: "CSV" | "JSON"
    }
    export type ExportMovementReportResponseDto = {
      /**
       * File-level metadata and reconciliation control totals.
       */
      metadata: {
        /**
         * Unique identifier of this export. Also returned in the X-Export-Id header.
         * example:
         * cef02796-daca-425f-91ed-f670eb8ec99f
         */
        exportId: string
        /**
         * Identity that requested the export.
         * example:
         * harmonize:hmz@metaco.com
         */
        requestAuthor: string
        /**
         * Generation timestamp (ISO-8601).
         * example:
         * 2026-08-27T09:15:00Z
         */
        generatedAt: string
        /**
         * Echo of the request filter parameters.
         * example:
         * {
         *   "domainId": "5cd224fe-193e-8bce-c94c-c6c05245e2d1",
         *   "asOfTimestamp": "2026-08-21T16:32:03.9740000+00:00",
         *   "includeZeroBalances": true
         * }
         */
        filters: {
          [key: string]: any
        }
        /**
         * Echoed from the request — Position Report only (ISO-8601).
         * example:
         * 2026-08-27T00:00:00Z
         */
        asOfTimestamp?: string
        /**
         * Echoed from the request — Movement Report only (ISO-8601).
         * example:
         * 2026-07-25T00:00:00Z
         */
        dateRangeStart?: string
        /**
         * Echoed from the request — Movement Report only (ISO-8601).
         * example:
         * 2026-08-27T00:00:00Z
         */
        dateRangeEnd?: string
        /**
         * Number of data rows. Position: one row per (account, ticker). Movement: one row per transfer.
         * example:
         * 22
         */
        recordCount: number
        /**
         * Reconciliation control totals across all rows.
         */
        controlTotals: {
          /**
           * Sum of all totalBalance values (Position Report only). BigNumber-formatted string.
           * example:
           * 429.04029589
           */
          balanceTotalAmount?: string
          /**
           * Sum of all reservedBalance values (Position Report only). BigNumber-formatted string.
           * example:
           * 2.0033804
           */
          balanceReservedAmount?: string
          /**
           * Sum of all quarantineBalance values (Position Report only). BigNumber-formatted string.
           * example:
           * 122.2
           */
          balanceQuarantinedAmount?: string
          /**
           * Sum of all enrichedTransactionValue values (Movement Report only). BigNumber-formatted string.
           * example:
           * 154.54
           */
          valueSum?: string
        }
      }
      /**
       * One row per transfer within the requested date range. Virtual (tenant-to-tenant) omnibus movements settle off-chain and never appear here.
       */
      data: ExportMovementReportRowDto[]
    }
    export type ExportMovementReportRowDto = {
      /**
       * Domain UUID the report row belongs to.
       */
      domainId: string
      /**
       * Domain display name.
       * example:
       * My root domain
       */
      domainName: string
      /**
       * Transfer registration time (ISO-8601).
       */
      registeredAt: string
      /**
       * Transaction UUID. Repeats across rows of the same transaction.
       */
      transactionId: string
      /**
       * On-ledger transaction identifier (hash).
       */
      onLedgerTransactionId: string
      /**
       * Transfer UUID — one row per transfer.
       */
      transferId: string
      /**
       * Transfer kind.
       * example:
       * Transfer
       */
      transferKind: string
      /**
       * Transfer value in display units. BigNumber-formatted string.
       * example:
       * 3.999800
       */
      enrichedTransactionValue: string
      /**
       * Transfer value in raw base units.
       * example:
       * 3999800
       */
      rawTransactionValue: string
      /**
       * Blockchain network name as configured by the operator.
       * example:
       * XRPL Testnet August 2024
       */
      ledgerName: string
      /**
       * Asset UUID.
       */
      tickerId: string
      /**
       * Asset display name.
       * example:
       * XRP Testnet August 2024
       */
      tickerName: string
      /**
       * Asset symbol.
       * example:
       * tXRP
       */
      tickerSymbol: string
      /**
       * Whether the transfer is currently quarantined.
       */
      quarantined: boolean
      /**
       * Custody-side status. One of 'Broadcasting', 'Completed', 'Failed', 'Interrupted', 'Pending', 'Prepared', 'Preparing', 'Reserved'.
       * example:
       * Completed
       */
      custodyStatus: string
      /**
       * Ledger-side status. One of 'Detected', 'Confirmed', 'Expired', 'Replaced'.
       * example:
       * Confirmed
       */
      ledgerStatus: string
      /**
       * Ledger status last-updated time (ISO-8601).
       */
      ledgerTimestamp: string
      /**
       * On-chain block time (ISO-8601). Empty until on-chain confirmation.
       */
      blockTime: string
      /**
       * Sender address. Pipe-separated when a transfer has multiple sender addresses (e.g. UTXO multi-input).
       */
      senderAddress: string
      /**
       * Sender account domain UUID. Empty for off-platform senders.
       */
      senderDomainId: string
      /**
       * Sender memo/destination tag. Empty when not applicable.
       */
      senderMemoTag: string
      /**
       * True if the sender is within the platform — including senders whose identity columns are redacted because their domain is outside the requester's access.
       */
      senderInternal: boolean
      /**
       * Sender account display name. Empty for off-platform senders and when the sender's domain is outside the requester's access.
       */
      senderName: string
      /**
       * Sender account UUID. Empty for off-platform senders and when the sender's domain is outside the requester's access.
       */
      senderId: string
      /**
       * One of 'vault', 'gas station', 'external', 'omnibus', 'deposit wallet'. 'external' identifies an account held at a subcustodian Provider — its vault columns are empty. 'omnibus' (a domain's omnibus wallet) and 'deposit wallet' (an omnibus tenant's deposit wallet) are emitted only when omnibus support is enabled for the environment. Empty for off-platform senders and when the sender's domain is outside the requester's access; pipe-separated for multi-sender transfers.
       * example:
       * deposit wallet
       */
      senderAccountType: string
      /**
       * Sender vault backing type ('MPC', 'HSM', …), or 'external' when the sender is off-platform. Empty when the sender's domain is outside the requester's access.
       */
      senderVaultType: string
      /**
       * Sender vault UUID. Empty for off-platform senders and when the sender's domain is outside the requester's access.
       */
      senderVaultId: string
      /**
       * Sender vault display name. Empty for off-platform senders and when the sender's domain is outside the requester's access.
       */
      senderVaultName: string
      /**
       * Recipient address.
       */
      recipientAddress: string
      /**
       * Recipient account domain UUID. Empty for off-platform recipients.
       */
      recipientDomainId: string
      /**
       * Memo type for Stellar/Hedera ('Text', 'Id', 'Hash', 'Return'). Empty for XRPL and when no memo.
       */
      recipientMemoType: string
      /**
       * Recipient memo/destination tag. Empty when not applicable.
       */
      recipientMemoTag: string
      /**
       * True if the recipient is within the platform — including recipients whose identity columns are redacted because their domain is outside the requester's access.
       */
      recipientInternal: boolean
      /**
       * Recipient account display name. Empty for off-platform recipients and when the recipient's domain is outside the requester's access.
       */
      recipientName: string
      /**
       * Recipient account UUID. Empty for off-platform recipients and when the recipient's domain is outside the requester's access.
       */
      recipientId: string
      /**
       * One of 'vault', 'gas station', 'external', 'omnibus', 'deposit wallet'. 'external' identifies an account held at a subcustodian Provider — its vault columns are empty. 'omnibus' (a domain's omnibus wallet) and 'deposit wallet' (an omnibus tenant's deposit wallet) are emitted only when omnibus support is enabled for the environment. Empty for off-platform recipients and when the recipient's domain is outside the requester's access.
       * example:
       * omnibus
       */
      recipientAccountType: string
      /**
       * Recipient vault backing type ('MPC', 'HSM', …), or 'external' when the recipient is off-platform. Empty when the recipient's domain is outside the requester's access.
       */
      recipientVaultType: string
      /**
       * Recipient vault UUID. Empty for off-platform recipients and when the recipient's domain is outside the requester's access.
       */
      recipientVaultId: string
      /**
       * Recipient vault display name. Empty for off-platform recipients and when the recipient's domain is outside the requester's access.
       */
      recipientVaultName: string
      /**
       * Transaction TYPE (contract v1.3, last column); repeats across rows of the same transaction. A transaction created from an order takes the category of the order's ledger operation (an Ethereum order with call data is 'contract call'); one without a stored order takes it from the kinds of all its transfers: 'transfer' if any is Transfer, else 'recovery', else 'fee', else 'other'. Never empty.
       * example:
       * transfer
       */
      type:
        | "transfer"
        | "contract call"
        | "token management"
        | "staking"
        | "account settings"
        | "recovery"
        | "fee"
        | "other"
    }
    export type ExportOmnibusAccountTypeTotalsDto = {
      /**
       * Number of rows of this accountType.
       * example:
       * 2
       */
      recordCount: number
      /**
       * Signed BigNumber sum across all tickers.
       * example:
       * 18.9998
       */
      availableBalance: string
      /**
       * Signed BigNumber sum across all tickers.
       * example:
       * 0
       */
      reservedBalance: string
      /**
       * Signed BigNumber sum across all tickers.
       * example:
       * 0
       */
      quarantineBalance: string
      /**
       * Signed BigNumber sum across all tickers.
       * example:
       * 1.0002
       */
      feeBalance: string
      /**
       * Signed BigNumber sum across all tickers.
       * example:
       * 0
       */
      confiscationBalance: string
      /**
       * Signed BigNumber sum across all tickers.
       * example:
       * 18.9998
       */
      totalBalance: string
    }
    export type ExportOmnibusControlTotalsDto = {
      /**
       * Totals over the 'omnibus' (pool wallet) rows.
       */
      omnibus: {
        /**
         * Number of rows of this accountType.
         * example:
         * 2
         */
        recordCount: number
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 18.9998
         */
        availableBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        reservedBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        quarantineBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 1.0002
         */
        feeBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        confiscationBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 18.9998
         */
        totalBalance: string
      }
      /**
       * Totals over the 'deposit wallet' rows.
       */
      depositWallet: {
        /**
         * Number of rows of this accountType.
         * example:
         * 2
         */
        recordCount: number
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 18.9998
         */
        availableBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        reservedBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        quarantineBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 1.0002
         */
        feeBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        confiscationBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 18.9998
         */
        totalBalance: string
      }
      /**
       * Totals over the 'virtual account' (tenant) rows.
       */
      virtualAccount: {
        /**
         * Number of rows of this accountType.
         * example:
         * 2
         */
        recordCount: number
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 18.9998
         */
        availableBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        reservedBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        quarantineBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 1.0002
         */
        feeBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 0
         */
        confiscationBalance: string
        /**
         * Signed BigNumber sum across all tickers.
         * example:
         * 18.9998
         */
        totalBalance: string
      }
    }
    export type ExportOmnibusExportMetadataDto = {
      /**
       * Unique identifier of this export. Also returned in the X-Export-Id header.
       * example:
       * ecca7eb1-a2f3-4351-bf46-e4f9e8f55272
       */
      exportId: string
      /**
       * Identity that requested the export.
       * example:
       * harmonize:hmz@metaco.com
       */
      requestAuthor: string
      /**
       * Generation timestamp (ISO-8601).
       * example:
       * 2026-08-31T08:28:26.767Z
       */
      generatedAt: string
      /**
       * Echo of the request filter parameters.
       * example:
       * {
       *   "domainId": "c73e9e5e-e803-4dc0-93c5-be71c3396ae9",
       *   "asOfTimestamp": "2026-08-31T08:27:21.2980000+00:00",
       *   "includeZeroBalances": true
       * }
       */
      filters: {
        [key: string]: any
      }
      /**
       * Echoed from the request (ISO-8601).
       */
      asOfTimestamp: string
      /**
       * Number of data rows — one per (account, ticker).
       * example:
       * 4
       */
      recordCount: number
      /**
       * Reconciliation control totals, strictly per accountType — never summed across types (the omnibus wallet's balance IS the pool backing the virtual rows; a grand total would double-count by construction). Sums span all tickers, so they are integrity checksums rather than balances; per-ticker reconciliation is done from the rows.
       */
      controlTotals: {
        /**
         * Totals over the 'omnibus' (pool wallet) rows.
         */
        omnibus: {
          /**
           * Number of rows of this accountType.
           * example:
           * 2
           */
          recordCount: number
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 18.9998
           */
          availableBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          reservedBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          quarantineBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 1.0002
           */
          feeBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          confiscationBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 18.9998
           */
          totalBalance: string
        }
        /**
         * Totals over the 'deposit wallet' rows.
         */
        depositWallet: {
          /**
           * Number of rows of this accountType.
           * example:
           * 2
           */
          recordCount: number
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 18.9998
           */
          availableBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          reservedBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          quarantineBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 1.0002
           */
          feeBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          confiscationBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 18.9998
           */
          totalBalance: string
        }
        /**
         * Totals over the 'virtual account' (tenant) rows.
         */
        virtualAccount: {
          /**
           * Number of rows of this accountType.
           * example:
           * 2
           */
          recordCount: number
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 18.9998
           */
          availableBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          reservedBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          quarantineBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 1.0002
           */
          feeBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 0
           */
          confiscationBalance: string
          /**
           * Signed BigNumber sum across all tickers.
           * example:
           * 18.9998
           */
          totalBalance: string
        }
      }
    }
    export type ExportOmnibusPositionExportDto = {
      /**
       * Domain UUID whose omnibus structure to export
       */
      domainId: string
      /**
       * Point-in-time timestamp for balance snapshot (ISO-8601)
       */
      asOfTimestamp: string
      /**
       * Filter by virtual account (tenant) UUIDs. Filters virtual-account rows and their deposit wallets; the omnibus wallet row is always kept.
       */
      tenantIds?: string[]
      /**
       * Filter by ticker UUIDs
       */
      tickerIds?: string[]
      /**
       * Include accounts with zero balances
       */
      includeZeroBalances?: boolean
      /**
       * Output format
       */
      format: "CSV" | "JSON"
    }
    export type ExportOmnibusPositionReportResponseDto = {
      /**
       * File-level metadata and per-accountType control totals.
       */
      metadata: {
        /**
         * Unique identifier of this export. Also returned in the X-Export-Id header.
         * example:
         * ecca7eb1-a2f3-4351-bf46-e4f9e8f55272
         */
        exportId: string
        /**
         * Identity that requested the export.
         * example:
         * harmonize:hmz@metaco.com
         */
        requestAuthor: string
        /**
         * Generation timestamp (ISO-8601).
         * example:
         * 2026-08-31T08:28:26.767Z
         */
        generatedAt: string
        /**
         * Echo of the request filter parameters.
         * example:
         * {
         *   "domainId": "c73e9e5e-e803-4dc0-93c5-be71c3396ae9",
         *   "asOfTimestamp": "2026-08-31T08:27:21.2980000+00:00",
         *   "includeZeroBalances": true
         * }
         */
        filters: {
          [key: string]: any
        }
        /**
         * Echoed from the request (ISO-8601).
         */
        asOfTimestamp: string
        /**
         * Number of data rows — one per (account, ticker).
         * example:
         * 4
         */
        recordCount: number
        /**
         * Reconciliation control totals, strictly per accountType — never summed across types (the omnibus wallet's balance IS the pool backing the virtual rows; a grand total would double-count by construction). Sums span all tickers, so they are integrity checksums rather than balances; per-ticker reconciliation is done from the rows.
         */
        controlTotals: {
          /**
           * Totals over the 'omnibus' (pool wallet) rows.
           */
          omnibus: {
            /**
             * Number of rows of this accountType.
             * example:
             * 2
             */
            recordCount: number
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 18.9998
             */
            availableBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            reservedBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            quarantineBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 1.0002
             */
            feeBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            confiscationBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 18.9998
             */
            totalBalance: string
          }
          /**
           * Totals over the 'deposit wallet' rows.
           */
          depositWallet: {
            /**
             * Number of rows of this accountType.
             * example:
             * 2
             */
            recordCount: number
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 18.9998
             */
            availableBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            reservedBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            quarantineBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 1.0002
             */
            feeBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            confiscationBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 18.9998
             */
            totalBalance: string
          }
          /**
           * Totals over the 'virtual account' (tenant) rows.
           */
          virtualAccount: {
            /**
             * Number of rows of this accountType.
             * example:
             * 2
             */
            recordCount: number
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 18.9998
             */
            availableBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            reservedBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            quarantineBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 1.0002
             */
            feeBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 0
             */
            confiscationBalance: string
            /**
             * Signed BigNumber sum across all tickers.
             * example:
             * 18.9998
             */
            totalBalance: string
          }
        }
      }
      /**
       * One row per (account, ticker) across the three row kinds. Rows are Accounting-driven: never-funded tenants produce no rows; funded-then-drained tenants appear with total 0 under includeZeroBalances. Per-ticker reconciliation: Σ virtual-account availableBalance equals the omnibus wallet row's totalBalance (net of in-flight sweeps).
       */
      data: ExportOmnibusPositionReportRowDto[]
    }
    export type ExportOmnibusPositionReportRowDto = {
      /**
       * Domain UUID owning the omnibus structure.
       */
      domainId: string
      /**
       * Domain display name.
       * example:
       * TEST_SG_SUB_DOMAIN
       */
      domainName: string
      /**
       * Row kind: 'omnibus' (the pool wallet), 'deposit wallet' (a tenant's on-chain deposit wallet), or 'virtual account' (a tenant's off-chain claim on the pool).
       * example:
       * virtual account
       */
      accountType: string
      /**
       * Unified row identity together with accountType: the custody accountId on 'omnibus' and 'deposit wallet' rows, the tenantId on 'virtual account' rows — identical to the Accounting Service account identity. Joining to custody data requires filtering accountType IN ('omnibus','deposit wallet'); virtual-row ids resolve only in the Accounting/Omnibus services.
       */
      accountId: string
      /**
       * Custody account alias on on-chain rows; tenant alias on virtual rows.
       * example:
       * SG_OMNIBUS-host
       */
      accountName: string
      /**
       * Owning tenantId — populated on 'deposit wallet' rows only (the deposit-wallet → virtual-account ownership edge). Empty on omnibus and virtual rows.
       */
      mappedVirtualAccountId: string
      /**
       * True on the host tenant row — the catch-all tenant absorbing untagged direct deposits and pool-side costs; its balance may be negative (fee debt) and is never filtered.
       */
      isHost: boolean
      /**
       * Omnibus wallet custody accountId; empty on the 'omnibus' row itself.
       */
      parentOmnibusAccountId: string
      /**
       * Asset UUID.
       */
      tickerId: string
      /**
       * Asset kind.
       * example:
       * Native
       */
      tickerKind: string
      /**
       * Asset display name.
       * example:
       * XRP Testnet August 2024
       */
      tickerName: string
      /**
       * Asset symbol.
       * example:
       * tXRP
       */
      tickerSymbol: string
      /**
       * Blockchain network name as configured by the operator.
       * example:
       * XRPL Testnet August 2024
       */
      ledgerName: string
      /**
       * Available balance — the headline number for virtual rows. Signed BigNumber string in display units, passed through from Accounting unmodified.
       * example:
       * -1.000200
       */
      availableBalance: string
      /**
       * Reserved balance (in-flight outbound on custody rows). Passed through from Accounting; 0 in practice on virtual rows (Accounting carries no tenant holds).
       * example:
       * 0.000000
       */
      reservedBalance: string
      /**
       * Quarantined balance (compliance holds on custody rows). Passed through from Accounting; 0 in practice on virtual rows.
       * example:
       * 0.000000
       */
      quarantineBalance: string
      /**
       * Cumulative fees bucket (informational — not a component of totalBalance). Itemizes the host tenant's absorbed network fees and reserves.
       * example:
       * 1.000200
       */
      feeBalance: string
      /**
       * Cumulative confiscation bucket (informational — not a component of totalBalance).
       * example:
       * 0.000000
       */
      confiscationBalance: string
      /**
       * Total balance = available + reserved + quarantine. Signed; the host tenant may be negative.
       * example:
       * -1.000200
       */
      totalBalance: string
      /**
       * DB write time of the latest contributing accounting entry (ISO-8601) — not on-chain block time.
       * example:
       * 2026-08-25T10:57:46.932669Z
       */
      ledgerBalanceTimestamp: string
    }
    export type ExportPositionExportDto = {
      /**
       * Domain UUID to export position data for
       */
      domainId: string
      /**
       * Point-in-time timestamp for balance snapshot (ISO-8601)
       */
      asOfTimestamp: string
      /**
       * Include data from child domains
       */
      includeChildDomains?: boolean
      /**
       * Filter by vault UUIDs
       */
      vaultIds?: string[]
      /**
       * Filter by ticker UUIDs
       */
      tickerIds?: string[]
      /**
       * Filter by account UUIDs
       */
      accountIds?: string[]
      /**
       * Include accounts with zero balances
       */
      includeZeroBalances?: boolean
      /**
       * Output format
       */
      format: "CSV" | "JSON"
    }
    export type ExportPositionReportResponseDto = {
      /**
       * File-level metadata and reconciliation control totals.
       */
      metadata: {
        /**
         * Unique identifier of this export. Also returned in the X-Export-Id header.
         * example:
         * cef02796-daca-425f-91ed-f670eb8ec99f
         */
        exportId: string
        /**
         * Identity that requested the export.
         * example:
         * harmonize:hmz@metaco.com
         */
        requestAuthor: string
        /**
         * Generation timestamp (ISO-8601).
         * example:
         * 2026-08-27T09:15:00Z
         */
        generatedAt: string
        /**
         * Echo of the request filter parameters.
         * example:
         * {
         *   "domainId": "5cd224fe-193e-8bce-c94c-c6c05245e2d1",
         *   "asOfTimestamp": "2026-08-21T16:32:03.9740000+00:00",
         *   "includeZeroBalances": true
         * }
         */
        filters: {
          [key: string]: any
        }
        /**
         * Echoed from the request — Position Report only (ISO-8601).
         * example:
         * 2026-08-27T00:00:00Z
         */
        asOfTimestamp?: string
        /**
         * Echoed from the request — Movement Report only (ISO-8601).
         * example:
         * 2026-07-25T00:00:00Z
         */
        dateRangeStart?: string
        /**
         * Echoed from the request — Movement Report only (ISO-8601).
         * example:
         * 2026-08-27T00:00:00Z
         */
        dateRangeEnd?: string
        /**
         * Number of data rows. Position: one row per (account, ticker). Movement: one row per transfer.
         * example:
         * 22
         */
        recordCount: number
        /**
         * Reconciliation control totals across all rows.
         */
        controlTotals: {
          /**
           * Sum of all totalBalance values (Position Report only). BigNumber-formatted string.
           * example:
           * 429.04029589
           */
          balanceTotalAmount?: string
          /**
           * Sum of all reservedBalance values (Position Report only). BigNumber-formatted string.
           * example:
           * 2.0033804
           */
          balanceReservedAmount?: string
          /**
           * Sum of all quarantineBalance values (Position Report only). BigNumber-formatted string.
           * example:
           * 122.2
           */
          balanceQuarantinedAmount?: string
          /**
           * Sum of all enrichedTransactionValue values (Movement Report only). BigNumber-formatted string.
           * example:
           * 154.54
           */
          valueSum?: string
        }
      }
      /**
       * One row per (account, ticker). With omnibus support enabled, contains on-chain custody accounts only — virtual (tenant) balances are excluded and control totals represent on-chain holdings.
       */
      data: ExportPositionReportRowDto[]
    }
    export type ExportPositionReportRowDto = {
      /**
       * Domain UUID owning the account.
       */
      domainId: string
      /**
       * Domain display name.
       * example:
       * My root domain
       */
      domainName: string
      /**
       * Vault backing type passed through from the core system, such as 'MPC' or 'HSM'. Empty for accounts without a vault (external).
       * example:
       * HSM
       */
      vaultType: string
      /**
       * Vault UUID. Empty for accounts without a vault (external).
       */
      vaultId: string
      /**
       * Vault display name. Empty for accounts without a vault (external).
       */
      vaultName: string
      /**
       * Account UUID.
       */
      accountId: string
      /**
       * Account display name.
       * example:
       * omnibus
       */
      accountName: string
      /**
       * One of 'vault', 'gas station', 'external', 'omnibus', 'deposit wallet'. 'external' identifies an account held at a subcustodian Provider — its vault columns are empty. 'omnibus' (a domain's omnibus wallet) and 'deposit wallet' (an omnibus tenant's deposit wallet) are emitted only when omnibus support is enabled for the environment.
       * example:
       * omnibus
       */
      accountType: string
      /**
       * Blockchain network name as configured by the operator.
       * example:
       * XRPL Testnet August 2024
       */
      ledgerName: string
      /**
       * On-chain address of the account on this ledger.
       */
      addressOnLedger: string
      /**
       * Asset UUID.
       */
      tickerId: string
      /**
       * Asset kind.
       * example:
       * Native
       */
      tickerKind: string
      /**
       * Asset display name.
       * example:
       * XRP Testnet August 2024
       */
      tickerName: string
      /**
       * Asset symbol.
       * example:
       * tXRP
       */
      tickerSymbol: string
      /**
       * Reserved balance. BigNumber-formatted string in display units.
       * example:
       * 0.000000
       */
      reservedBalance: string
      /**
       * Quarantined balance. BigNumber-formatted string in display units.
       * example:
       * 0.000000
       */
      quarantineBalance: string
      /**
       * Total balance. BigNumber-formatted string in display units.
       * example:
       * 51.994800
       */
      totalBalance: string
      /**
       * DB write time of the latest contributing accounting entry (ISO-8601) — not on-chain block time.
       * example:
       * 2026-08-21T14:27:15.03518Z
       */
      ledgerBalanceTimestamp: string
    }
    export type GasStationAccountIdentifierDto = {
      /**
       * Account ID to sponsor
       */
      accountId: string
      /**
       * Domain ID of the account
       */
      domainId: string
    }
    export type GasStationAccountSponsorResponseDto = {
      /**
       * Whether the account is sponsored by a gas station
       */
      isSponsored: boolean
      /**
       * Gas station account ID that is sponsoring
       */
      sponsorAccountId?: string
      type?: "domain" | "account" | "none"
      accountIds?: string[]
      includeSubDomains?: boolean
      alertLimit?: GasStationAlertLimitDto[]
      /**
       * Balance status per configured alert. Omitted if balance fetch fails.
       */
      balanceStatus?: GasStationBalanceStatusDto[]
      /**
       * Number of tickers in critical status. Omitted if balance fetch fails.
       */
      criticalCount?: number
    }
    export type GasStationAddSponsoredAccountsDto = {
      accounts: GasStationAccountIdentifierDto[]
      /**
       * UUID of the user performing the action. Optional — only honored when the caller is a service principal; otherwise the authenticated user from the JWT is used.
       */
      userId?: string
    }
    export type GasStationAddSponsoredDomainsDto = {
      domains: GasStationDomainIdentifierDto[]
      /**
       * UUID of the user performing the action. Optional — only honored when the caller is a service principal; otherwise the authenticated user from the JWT is used.
       */
      userId?: string
    }
    export type GasStationAlertLimitDto = {
      /**
       * Ticker/token UUID
       */
      tickerId: string
      /**
       * Alert threshold amount
       */
      amount: string
    }
    export type GasStationAuditEventDto = {
      id: string
      eventType: "CREATE" | "UPDATE" | "DELETE"
      accountId: string
      domainId: string
      /**
       * Sponsor configuration snapshot at the time of the event
       */
      payload: {
        [key: string]: any
      }
      timestamp: string
    }
    export type GasStationBalanceStatusDto = {
      /**
       * Ticker UUID
       */
      tickerId: string
      /**
       * Ticker symbol for display (e.g., SOL, ETH, XRP)
       */
      tickerSymbol: string
      /**
       * Configured alert threshold amount
       */
      threshold: string
      /**
       * Current balance from Core
       */
      currentBalance: string
      /**
       * Balance status: critical if currentBalance <= threshold
       */
      status: "healthy" | "critical"
    }
    export type GasStationConflictEntityDto = {
      /**
       * Account ID that conflicted (for account conflicts)
       */
      accountId?: string
      /**
       * Domain ID of the conflicting entity
       */
      domainId: string
      /**
       * Reason for the conflict
       * example:
       * ALREADY_SPONSORED
       */
      reason: "ALREADY_SPONSORED"
      /**
       * Account ID of the existing sponsor
       */
      existingSponsorAccountId: string
    }
    export type GasStationCreateSponsorDto = {
      /**
       * Type of sponsorship
       */
      type: "domain" | "account" | "none"
      /**
       * Array of account UUIDs to sponsor
       */
      accountIds?: string[]
      /**
       * Include subdomains in sponsorship
       */
      includeSubDomains: boolean
      /**
       * Alert thresholds per ticker
       */
      alertLimit: GasStationAlertLimitDto[]
      /**
       * UUID of the user performing the action; recorded on the audit trail. Optional — only honored when the caller is a service principal; otherwise the authenticated user from the JWT is used.
       */
      userId?: string
    }
    export type GasStationDomainIdentifierDto = {
      /**
       * Domain ID to sponsor
       */
      domainId: string
    }
    export type GasStationDomainSponsorResponseDto = {
      /**
       * Whether the domain is sponsored domain-wide by a gas station
       */
      isSponsored: boolean
      /**
       * Gas station account ID that is sponsoring
       */
      sponsorAccountId?: string
      type?: "domain"
      /**
       * Whether the resolving sponsor extends to sub-domains
       */
      includeSubDomains?: boolean
    }
    export type GasStationEventsResponseDto = {
      items: GasStationAuditEventDto[]
      count: number
      currentStartingAfter?: string
      nextStartingAfter?: string
    }
    export type GasStationLedgerDto = {
      id: string
      alias: string
    }
    export type GasStationLineageDto = {
      /**
       * Parent domain ID
       */
      domainId: string
      /**
       * Parent domain name
       */
      domain: string
      /**
       * Subdomain ID
       */
      subdomainId: string
      /**
       * Subdomain name
       */
      subdomain: string
    }
    export type GasStationSponsorCreatedResponseDto = {
      id: string
      status: string
      createdAt: string
    }
    export type GasStationSponsorResponseDto = {
      type: string
      accountIds: string[]
      includeSubDomains: boolean
      alertLimit: GasStationAlertLimitDto[]
      /**
       * Balance status per configured alert. Omitted if balance fetch fails.
       */
      balanceStatus?: GasStationBalanceStatusDto[]
      /**
       * Number of tickers in critical status. Omitted if balance fetch fails.
       */
      criticalCount?: number
    }
    export type GasStationSponsorableAccountDto = {
      /**
       * Account UUID
       */
      accountId: string
      /**
       * Account name
       */
      name: string
      /**
       * Domain lineage (parent domain and subdomain)
       */
      lineage: {
        /**
         * Parent domain ID
         */
        domainId: string
        /**
         * Parent domain name
         */
        domain: string
        /**
         * Subdomain ID
         */
        subdomainId: string
        /**
         * Subdomain name
         */
        subdomain: string
      }
      ledgers: GasStationLedgerDto[]
      sponsorshipStatus: "sponsored" | "not_sponsored" | "sponsored_by_other"
      /**
       * Only present if sponsored by another gas station
       */
      sponsorshipDetails?: {
        /**
         * The sponsoring gas station account ID
         */
        sponsorAccountId: string
        /**
         * The sponsoring gas station account name
         */
        sponsorAccountName: string
        /**
         * How this was sponsored
         */
        sponsorType: "account" | "domain"
        /**
         * If sponsored via domain, the domain ID
         */
        sponsoredDomainId?: string
        /**
         * If sponsored via domain, the domain name
         */
        sponsoredDomainName?: string
      }
    }
    export type GasStationSponsorableAccountsResponseDto = {
      items: GasStationSponsorableAccountDto[]
      total: number
      /**
       * Current page number (0-indexed)
       */
      page: number
      /**
       * Page size
       */
      pageSize: number
      /**
       * All available ledgers for filter dropdown
       */
      availableLedgers: GasStationLedgerDto[]
    }
    export type GasStationSponsorableDomainDto = {
      /**
       * Domain UUID
       */
      domainId: string
      /**
       * Domain name
       */
      name: string
      ledgers: GasStationLedgerDto[]
      sponsorshipStatus: "sponsored" | "not_sponsored" | "sponsored_by_other"
      /**
       * Only present if sponsored by another gas station
       */
      sponsorshipDetails?: {
        /**
         * The sponsoring gas station account ID
         */
        sponsorAccountId: string
        /**
         * The sponsoring gas station account name
         */
        sponsorAccountName: string
        /**
         * How this was sponsored
         */
        sponsorType: "account" | "domain"
        /**
         * If sponsored via domain, the domain ID
         */
        sponsoredDomainId?: string
        /**
         * If sponsored via domain, the domain name
         */
        sponsoredDomainName?: string
      }
      /**
       * Account IDs within this domain
       */
      accountIds: string[]
      /**
       * Parent domain UUID, null only for absolute root (typically filtered out)
       */
      parentId?: {
        [key: string]: any
      }
      /**
       * Nesting depth relative to sponsor domain (0 = direct child of sponsor domain)
       */
      depth: number
      /**
       * Whether any accounts in this domain are individually sponsored by another gas station
       */
      hasAccountsSponsoredByOther: boolean
      /**
       * Nested subdomains (hierarchical)
       */
      children: GasStationSponsorableDomainDto[]
    }
    export type GasStationSponsorableDomainsResponseDto = {
      items: GasStationSponsorableDomainDto[]
      total: number
      /**
       * Current page number (0-indexed)
       */
      page: number
      /**
       * Page size
       */
      pageSize: number
      /**
       * All available ledgers for filter dropdown
       */
      availableLedgers: GasStationLedgerDto[]
    }
    export type GasStationSponsoredEntitiesResponseDto = {
      /**
       * List of sponsored entities
       */
      items: GasStationSponsoredEntityDto[]
      /**
       * Total count of items in current page
       */
      count: number
      /**
       * Current pagination cursor
       */
      currentStartingAfter?: string
      /**
       * Next pagination cursor for fetching more items
       */
      nextStartingAfter?: string
    }
    export type GasStationSponsoredEntityDto = {
      /**
       * Entity ID (Account or Domain UUID)
       */
      id: string // uuid
      /**
       * Entity display name/alias
       */
      alias: string
      /**
       * Whether the entity is sponsored by a Gas Station
       */
      isSponsored: boolean
      /**
       * Domain hierarchy from root to entity (for Lineage column)
       */
      path: string[]
    }
    export type GasStationSponsoredModificationResponseDto = {
      /**
       * Whether the operation completed (true even for partial success)
       */
      success: boolean
      /**
       * Number of entities successfully added
       */
      count: number
      /**
       * Entities that could not be added due to conflicts
       */
      conflicts?: GasStationConflictEntityDto[]
    }
    export type GasStationSponsorsListResponseDto = {
      /**
       * List of gas station account IDs in the domain
       */
      items: string[]
    }
    export type GasStationSponsorshipDetailsDto = {
      /**
       * The sponsoring gas station account ID
       */
      sponsorAccountId: string
      /**
       * The sponsoring gas station account name
       */
      sponsorAccountName: string
      /**
       * How this was sponsored
       */
      sponsorType: "account" | "domain"
      /**
       * If sponsored via domain, the domain ID
       */
      sponsoredDomainId?: string
      /**
       * If sponsored via domain, the domain name
       */
      sponsoredDomainName?: string
    }
    export type GasStationUpdateSponsorDto = {
      /**
       * Type of sponsorship
       */
      type: "domain" | "account" | "none"
      /**
       * Array of account UUIDs to sponsor
       */
      accountIds?: string[]
      /**
       * Include subdomains in sponsorship
       */
      includeSubDomains: boolean
      /**
       * Alert thresholds per ticker
       */
      alertLimit: GasStationAlertLimitDto[]
      /**
       * UUID of the user performing the action; recorded on the audit trail. Optional — only honored when the caller is a service principal; otherwise the authenticated user from the JWT is used.
       */
      userId?: string
    }
    export type GasStationValidSponsorItemDto = {
      /**
       * Gas station account ID that can be chosen as sponsor
       */
      accountId: string
      /**
       * Alias of the gas station account, if known
       */
      accountAlias?: string
      /**
       * Domain ID the gas station belongs to
       */
      domainId: string
      /**
       * Alias of the domain the gas station belongs to, if known
       */
      domainAlias?: string
    }
    export type GasStationValidSponsorsResponseDto = {
      /**
       * Whether the account is already effectively sponsored
       */
      isSponsored: boolean
      /**
       * The existing sponsor when the account is already sponsored
       */
      sponsor?: {
        /**
         * Whether the account is sponsored by a gas station
         */
        isSponsored: boolean
        /**
         * Gas station account ID that is sponsoring
         */
        sponsorAccountId?: string
        type?: "domain" | "account" | "none"
        accountIds?: string[]
        includeSubDomains?: boolean
        alertLimit?: GasStationAlertLimitDto[]
        /**
         * Balance status per configured alert. Omitted if balance fetch fails.
         */
        balanceStatus?: GasStationBalanceStatusDto[]
        /**
         * Number of tickers in critical status. Omitted if balance fetch fails.
         */
        criticalCount?: number
      }
      /**
       * Gas stations that could be chosen as sponsor. Empty when the account is already sponsored, unless includeAll=true was requested, in which case the lineage candidates are still listed (the current sponsor may appear among them).
       */
      items: GasStationValidSponsorItemDto[]
    }
    export type OmnibusBulkUpdateSweepThresholdsRequest = {
      /**
       * List of threshold updates to apply atomically
       */
      updates: OmnibusSweepThresholdUpdate[]
    }
    export type OmnibusBulkUpdateSweepThresholdsResponse = {
      /**
       * Number of thresholds successfully updated
       */
      updatedCount: number // int32
      /**
       * Success message
       */
      message?: string
    }
    export type OmnibusCreateInternalTransferRequest = {
      /**
       * Destination tenant ID (funds are credited to this tenant)
       */
      destTenantId: string // uuid
      /**
       * Positive integer in the ticker's smallest unit (e.g., wei for ETH, satoshis for BTC, drops for XRP). No leading zeros; zero is not allowed.
       */
      amount: string // ^[1-9][0-9]*$
      /**
       * Identifier of the ticker to transfer
       */
      tickerId: string // uuid
      /**
       * Identifier of the blockchain ledger; must match on both source and destination
       */
      ledgerId: string // .*\S.*
    }
    export type OmnibusCreateOmnibusRequest = {
      /**
       * Alias for the omnibus account
       */
      alias: string // .*\S.*
      /**
       * Identifier of the vault where the omnibus account keys will be stored
       */
      vaultId: string // uuid
      keyStrategy: "VaultHard" | "VaultSoft" | "Random"
      lockStatus?: "Unlocked" | "Locked"
      /**
       * List of ledger IDs to activate on the omnibus account. If omitted, all enabled ledgers compatible with the vault and key strategy are activated automatically.
       */
      ledgerIds?: string[]
      /**
       * Optional description for the omnibus account
       */
      description?: string
      /**
       * Custom key-value properties for the omnibus account
       */
      customProperties?: {
        [name: string]: string
      }
      /**
       * List of custody account IDs to ignore during event processing (e.g., Gas Station account)
       */
      ignoredAccountIds?: string /* uuid */[]
      /**
       * Entity ID of the Gas Station account that will sponsor fees for this omnibus account.
       */
      sponsoringGasStationId?: string // uuid
    }
    export type OmnibusCreateOmnibusResponse = {
      omnibus: OmnibusOmnibusResponse
      unsignedIntent: /* Complete Propose object ready to be signed and submitted to Custody via POST /v1/intents. The frontend signs this object and sends it as the "request" field in ProposeIntentBody.  */ OmnibusUnsignedIntentPayload
    }
    export type OmnibusCreateOrUpdateTenantRequest = {
      /**
       * Alias for the tenant within the omnibus structure
       */
      alias: string // .*\S.*
      /**
       * Optional description for the tenant (max 250 characters)
       */
      description?: string
      status?: "LOCKED" | "UNLOCKED"
      customProperties?: OmnibusJsonNullableListTenantCustomProperty
    }
    export type OmnibusCreateWithdrawalRequest = {
      /**
       * Positive integer in the ticker's smallest unit (e.g., wei for ETH, satoshis for BTC, drops for XRP). No leading zeros; zero is not allowed.
       */
      amount: string // ^[1-9][0-9]*$
      /**
       * Identifier of the ticker to withdraw
       */
      tickerId: string // uuid
      /**
       * Identifier of the blockchain ledger to broadcast on
       */
      ledgerId: string // .*\S.*
      /**
       * External destination address. Must be outside this omnibus.
       */
      destAddress: string // .*\S.*
    }
    /**
     * unsignedIntent is present on a fresh create and on an idempotent replay of a still-pending withdrawal; it is omitted when replaying a terminal (COMPLETED/FAILED/CANCELLED) withdrawal, where there is nothing left to sign.
     */
    export type OmnibusCreateWithdrawalResponse = {
      withdrawal: OmnibusWithdrawalResponse
      unsignedIntent: /* Complete Propose object ready to be signed and submitted to Custody via POST /v1/intents. The frontend signs this object and sends it as the "request" field in ProposeIntentBody.  */ OmnibusUnsignedIntentPayload
    }
    export type OmnibusDepositAddress = {
      /**
       * Identifier of the blockchain ledger
       */
      ledgerId: string
      /**
       * Blockchain address for receiving deposits
       */
      address: string
    }
    export type OmnibusDepositWalletResponse = {
      /**
       * Unique identifier of the deposit wallet
       */
      depositWalletId: string // uuid
      /**
       * Identifier of the custody account backing this deposit wallet
       */
      custodyAccountId: string // uuid
      status: "CREATING" | "ACTIVE" | "INACTIVE"
      /**
       * List of deposit addresses, one per ledger. Empty when status is CREATING.
       */
      addresses: OmnibusDepositAddress[]
    }
    export type OmnibusDepositWalletSummary = {
      /**
       * Internal deposit wallet identifier
       */
      id: string // uuid
      /**
       * Custody account backing this deposit wallet
       */
      custodyAccountId: string // uuid
      /**
       * Tenant that owns this deposit wallet
       */
      tenantId: string // uuid
      /**
       * Owning tenant's alias (for display/search)
       */
      alias: string
      status: "CREATING" | "ACTIVE" | "INACTIVE"
      /**
       * Omnibus structure this deposit wallet belongs to
       */
      omnibusId: string // uuid
    }
    export type OmnibusDepositWalletSummaryPageResponse = {
      /**
       * Deposit wallet summaries in this page
       */
      content: OmnibusDepositWalletSummary[]
      page: OmnibusPageMetadata
    }
    export type OmnibusHelloWorldResponse = {
      /**
       * Dummy response
       */
      message: string
    }
    export type OmnibusInternalTransferPageResponse = {
      content: OmnibusInternalTransferSummary[]
      page: OmnibusPageMetadata
    }
    export type OmnibusInternalTransferResponse = {
      /**
       * Operation ID for this internal transfer
       */
      operationId: string // uuid
      /**
       * Transfer ID for this movement
       */
      transferId: string // uuid
      status: "COMPLETED" | "FAILED" | "PENDING_VERIFICATION" | "PENDING"
      /**
       * Source tenant (debited)
       */
      sourceTenantId: string // uuid
      /**
       * Destination tenant (credited)
       */
      destTenantId: string // uuid
      /**
       * Positive integer in the ticker's smallest unit
       */
      amount: string
      tickerId: string // uuid
      ledgerId: string
    }
    export type OmnibusInternalTransferSummary = {
      /**
       * Operation ID for this internal transfer
       */
      operationId: string // uuid
      /**
       * Transfer ID for this movement
       */
      transferId: string // uuid
      status:
        | "PENDING"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "FAILED"
        | "CANCELLED"
        | "PENDING_VERIFICATION"
      sourceTenant: OmnibusTenantRef
      destTenant: OmnibusTenantRef
      /**
       * Transfer amount in the ticker's smallest unit (positive integer string)
       */
      amount: string
      /**
       * Ticker identifier
       */
      tickerId: string // uuid
      /**
       * Blockchain ledger identifier
       */
      ledgerId: string
      /**
       * Always "0" for internal transfers
       */
      feeAmount: string
      /**
       * Timestamp when the transfer was confirmed on-chain; absent until COMPLETED
       */
      confirmedAt?: string // date-time
      /**
       * Timestamp when the operation was created
       */
      createdAt: string // date-time
      /**
       * Timestamp of the last status change on the underlying operation
       */
      updatedAt: string // date-time
    }
    export type OmnibusJsonNullableListTenantCustomProperty = {
      present?: boolean
    }
    export type OmnibusJsonNullableOmnibusHierarchyTenantDepositWallet = {
      present?: boolean
    }
    export type OmnibusJsonNullableUUID = {
      present?: boolean
    }
    /**
     * Full omnibus structure hierarchy: structure header repeated on every page, one element per tenant (including Host) with its deposit wallet embedded, and always-populated pagination totals.
     */
    export type OmnibusOmnibusHierarchyResponse = {
      omnibus: OmnibusOmnibusResponse
      hostTenantId?: OmnibusJsonNullableUUID
      /**
       * One element per tenant, including the Host tenant
       */
      content: OmnibusOmnibusHierarchyTenant[]
      page: OmnibusPageMetadata
    }
    export type OmnibusOmnibusHierarchyTenant = {
      /**
       * Unique identifier of the tenant
       */
      id: string // uuid
      /**
       * Alias of the tenant
       */
      alias: string
      /**
       * Whether this tenant is the host tenant of the omnibus structure
       */
      isHost: boolean
      status: "LOCKED" | "UNLOCKED"
      /**
       * Timestamp when the tenant was created
       */
      createdAt: string // date-time
      /**
       * Timestamp when the tenant was last updated
       */
      updatedAt: string // date-time
      depositWallet?: OmnibusJsonNullableOmnibusHierarchyTenantDepositWallet
    }
    export type OmnibusOmnibusResponse = {
      /**
       * Unique identifier of the omnibus structure
       */
      id: string // uuid
      /**
       * Identifier of the domain this omnibus structure belongs to
       */
      domainId: string // uuid
      /**
       * Identifier of the custody account backing this omnibus structure
       */
      custodyAccountId: string // uuid
      /**
       * Alias of the omnibus structure
       */
      alias: string
      status: "CREATING" | "PENDING_SPONSORSHIP" | "UNLOCKED" | "LOCKED" | "FAILED" | "ACTIVE"
      /**
       * List of custody account IDs to ignore during event processing
       */
      ignoredAccountIds: string /* uuid */[]
      /**
       * Timestamp when the omnibus structure was created
       */
      createdAt: string // date-time
      /**
       * Timestamp when the omnibus structure was last updated
       */
      updatedAt: string // date-time
      /**
       * Entity ID of the Gas Station account that sponsors fees for this omnibus account
       */
      sponsoringGasStationId?: OmnibusJsonNullableUUID // uuid
      /**
       * Balances of the host tenant per ticker/ledger combination
       */
      balances?: OmnibusTenantBalanceEntry[]
      lockStatus: "UNLOCKED" | "LOCKED"
    }
    export type OmnibusPageMetadata = {
      /**
       * Current page number (0-indexed)
       */
      number: number // int32
      /**
       * Number of elements per page
       */
      size: number // int32
      /**
       * Total number of elements across all pages
       */
      totalElements: number // int32
      /**
       * Total number of pages
       */
      totalPages: number // int32
      /**
       * Whether this is the first page
       */
      first: boolean
      /**
       * Whether this is the last page
       */
      last: boolean
    }
    export type OmnibusSweepThresholdConfig = {
      /**
       * Unique identifier of this threshold configuration. Absent for assets that have never been explicitly configured (implicit "0" default).
       */
      id?: string // uuid
      /**
       * Domain ID (1:1 with omnibus)
       */
      domainId: string // uuid
      /**
       * Custody ticker UUID
       */
      tickerId: string // uuid
      /**
       * Ticker symbol (e.g., "BTC", "ETH", "USDC")
       */
      tickerSymbol: string
      /**
       * Full ticker name (e.g., "Bitcoin", "Ethereum")
       */
      tickerName?: string
      /**
       * Number of decimal places for this ticker
       */
      tickerDecimals?: number // int32
      /**
       * Custody ledger ID (e.g., "ethereum-mainnet", "polygon-mainnet")
       */
      ledgerId: string
      /**
       * Human-readable ledger name (e.g., "Ethereum", "Polygon")
       */
      ledgerName: string
      /**
       * Smart contract address for token tickers (e.g., ERC-20 USDC address). Null for native assets like BTC, ETH, XRP.
       */
      contractAddress?: string
      /**
       * Minimum sweep amount in the ticker's smallest unit (e.g., satoshis for BTC, wei for ETH). Set to "0" for immediate sweep (no threshold).
       */
      minSweepAmount: string
      /**
       * Human-readable formatted amount (e.g., "0.1 BTC", "25 USDC"). Calculated from minSweepAmount using tickerDecimals.
       */
      minSweepAmountFormatted?: string
      /**
       * Timestamp when this configuration was created. Absent for assets that have never been explicitly configured.
       */
      createdAt?: string // date-time
      /**
       * Timestamp when this configuration was last updated. Absent for assets that have never been explicitly configured.
       */
      updatedAt?: string // date-time
      /**
       * Optimistic-lock version of the stored row. Absent for assets that have never been explicitly configured (implicit "0" default, no row). Echo this value back in the matching SweepThresholdUpdate on save.
       */
      version?: number // int64
    }
    export type OmnibusSweepThresholdConflict = {
      /**
       * Ticker UUID of the conflicting asset
       */
      tickerId: string // uuid
      /**
       * Ledger ID of the conflicting asset
       */
      ledgerId: string
      /**
       * The stored row's current optimistic-lock version. Absent if the asset has no stored row yet (a version was sent for a first-time configuration).
       */
      currentVersion?: number // int64
      /**
       * The stored row's current minimum sweep amount in the ticker's smallest unit. "0" if the asset has no stored row yet.
       */
      currentMinSweepAmount: string
      /**
       * Human-readable formatted current amount (e.g., "0.1 BTC"), mirroring the SweepThresholdConfig field so the client can display it directly.
       */
      currentMinSweepAmountFormatted?: string
    }
    export type OmnibusSweepThresholdConflictResponse = {
      /**
       * HTTP reason phrase (e.g., "Conflict")
       */
      reason?: string
      /**
       * Human-readable summary of the conflict
       */
      message?: string
      /**
       * Stable machine code identifying this as a stale-version conflict. Distinguishes it from other 409s (e.g., data-integrity violations) that do not carry this code and should not trigger a refresh-and-reverify flow.
       */
      errorCode: "STALE_SWEEP_THRESHOLD_VERSION"
      /**
       * The rows that conflicted, with their current stored values. Present and non-empty only for stale-version 409s.
       */
      conflicts: OmnibusSweepThresholdConflict[]
    }
    export type OmnibusSweepThresholdPageResponse = {
      /**
       * Sweep threshold configurations in this page
       */
      content: OmnibusSweepThresholdConfig[]
      page: OmnibusPageMetadata
    }
    export type OmnibusSweepThresholdUpdate = {
      /**
       * Ticker UUID to update
       */
      tickerId: string // uuid
      /**
       * Ledger ID to update
       */
      ledgerId: string
      /**
       * New minimum sweep amount in smallest unit. Must be a non-negative integer string (e.g., "10000000000000000" for 0.01 ETH).
       */
      minSweepAmount: string // ^[0-9]+$
      /**
       * Optimistic-lock version from the GET row being edited. Required to update an already-configured asset. Omit (or null) only when configuring an asset for the first time (no stored row yet); sending a version for such an asset is treated as a conflict.
       */
      version?: number // int64
    }
    export type OmnibusTenantBalanceEntry = {
      /**
       * Ticker identifier
       */
      tickerId: string // uuid
      /**
       * Ledger identifier
       */
      ledgerId: string
      /**
       * Reserved amount
       */
      reserved: string
      /**
       * Quarantined amount
       */
      quarantined: string
      /**
       * Available balance from accounting service; absent if the accounting service is unavailable
       */
      availableBalance?: string
    }
    export type OmnibusTenantCustomProperty = {
      /**
       * Property key
       */
      key: string // .*\S.*
      /**
       * Property value
       */
      value: string // .*\S.*
    }
    /**
     * Pagination metadata for tenant listings. Unlike the shared PageMetadata, totalElements/totalPages are optional: the alias-search path uses a cursor-style (Slice) query that does not compute totals, while the full-list path still populates them.
     */
    export type OmnibusTenantPageMetadata = {
      /**
       * Current page number (0-indexed)
       */
      number: number // int32
      /**
       * Number of elements per page
       */
      size: number // int32
      /**
       * Total number of elements across all pages. Absent for cursor-style (Slice) responses such as alias search, where totals are not computed.
       */
      totalElements?: number // int32
      /**
       * Total number of pages. Absent for cursor-style (Slice) responses such as alias search, where totals are not computed.
       */
      totalPages?: number // int32
      /**
       * Whether this is the first page
       */
      first: boolean
      /**
       * Whether this is the last page
       */
      last: boolean
    }
    export type OmnibusTenantPageResponse = {
      content: OmnibusTenantResponse[]
      page: /* Pagination metadata for tenant listings. Unlike the shared PageMetadata, totalElements/totalPages are optional: the alias-search path uses a cursor-style (Slice) query that does not compute totals, while the full-list path still populates them. */ OmnibusTenantPageMetadata
    }
    export type OmnibusTenantRef = {
      id: string // uuid
      alias: string
      isHost: boolean
    }
    export type OmnibusTenantResponse = {
      /**
       * Unique identifier of the tenant
       */
      id: string // uuid
      /**
       * Identifier of the omnibus structure this tenant belongs to
       */
      omnibusId: string // uuid
      /**
       * Alias of the tenant
       */
      alias: string
      /**
       * Whether this tenant is the host tenant of the omnibus structure. This field is immutable and set at creation time.
       */
      isHost: boolean
      status: "LOCKED" | "UNLOCKED"
      /**
       * Timestamp when the tenant was created
       */
      createdAt: string // date-time
      /**
       * Timestamp when the tenant was last updated
       */
      updatedAt: string // date-time
      /**
       * Balances per ticker/ledger combination
       */
      balances?: OmnibusTenantBalanceEntry[]
      /**
       * Description of the tenant
       */
      description?: string
      /**
       * Custom key-value properties
       */
      customProperties?: OmnibusTenantCustomProperty[]
    }
    /**
     * Complete Propose object ready to be signed and submitted to Custody via POST /v1/intents. The frontend signs this object and sends it as the "request" field in ProposeIntentBody.
     */
    export type OmnibusUnsignedIntentPayload = {
      /**
       * Intent type, always "Propose"
       */
      type: "Propose"
      /**
       * Unique identifier for the intent
       */
      id: string // uuid
      author: /* The user proposing the intent */ OmnibusUnsignedIntentPayloadAuthor
      /**
       * Expiry time for the intent
       */
      expiryAt: string // date-time
      /**
       * Domain where the intent will be executed
       */
      targetDomainId: string // uuid
      /**
       * The intent payload
       */
      payload: any
      /**
       * Description of the intent
       */
      description?: string
      /**
       * Intent-level custom properties
       */
      customProperties: {
        [name: string]: string
      }
    }
    /**
     * The user proposing the intent
     */
    export type OmnibusUnsignedIntentPayloadAuthor = {
      domainId: string // uuid
      id: string // uuid
    }
    export type OmnibusUpdateOmnibusRequest = {
      /**
       * Entity ID of the Gas Station account that will sponsor fees for this omnibus account
       */
      sponsoringGasStationId: string // uuid
    }
    export type OmnibusWithdrawalResponse = {
      /**
       * Operation ID for the withdrawal
       */
      operationId: string // uuid
      /**
       * Transfer ID for the on-chain movement
       */
      transferId: string // uuid
      status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELLED"
      /**
       * Positive integer in the ticker's smallest unit
       */
      amount: string
      tickerId: string // uuid
      ledgerId: string
      /**
       * External destination address
       */
      destAddress: string
      /**
       * Estimated on-chain fee captured at dry-run time
       */
      estimatedFee?: string
      /**
       * Custody TransactionOrder ID generated for this withdrawal
       */
      custodyTransactionOrderId?: string // uuid
      /**
       * Timestamp of the underlying operation row creation
       */
      createdAt: string // date-time
      /**
       * Timestamp of the last status change on the underlying operation
       */
      updatedAt: string // date-time
    }
    export type VirtualAccountingActor =
      | VirtualAccountingActorAddress
      | VirtualAccountingActorVirtualAccount
    export type VirtualAccountingActorAddress = {
      address?: string
      type: "Address"
    }
    export type VirtualAccountingActorType = "Address" | "VirtualAccount"
    export type VirtualAccountingActorVirtualAccount = {
      virtualAccountId?: string // uuid
      virtualLedgerId?: string // uuid
      type: "VirtualAccount"
    }
    export type VirtualAccountingBalance = {
      tickerId: string // uuid
      amount: string
      reserved: string
    }
    export type VirtualAccountingBalanceCollectionResponse = {
      items: VirtualAccountingBalance[]
      count: number // int32
    }
    export type VirtualAccountingCustodyAccountDepositIdentificationSourceIn = {
      id?: string // uuid
      provisioningStrategy?: VirtualAccountingProvisioningStrategyBase
      type: "CustodyAccount"
    }
    export type VirtualAccountingCustodyAccountExclusionList = {
      exclusionReason: string
      custodyAccountId?: string // uuid
      custodyDomainId?: string // uuid
      type: "CustodyAccount"
    }
    export type VirtualAccountingCustodyOperation = {
      transactionOrderId: string // uuid
      domainId: string // uuid
    }
    export type VirtualAccountingDepositIdentificationSourceBase =
      VirtualAccountingDepositIdentificationSourceCustodyAccount
    export type VirtualAccountingDepositIdentificationSourceBaseIn =
      VirtualAccountingCustodyAccountDepositIdentificationSourceIn
    export type VirtualAccountingDepositIdentificationSourceCustodyAccount = {
      id?: string // uuid
      custodyAccountId?: string // uuid
      custodyDomainId?: string // uuid
      status?: VirtualAccountingDepositIdentificationSourceStatus
      type: "CustodyAccount"
    }
    export type VirtualAccountingDepositIdentificationSourceStatus =
      | "Active"
      | "Pending"
      | "Inactive"
    export type VirtualAccountingDepositIdentificationSourceType = "CustodyAccount"
    export type VirtualAccountingDepositIdentificationStrategy =
      | "MaximizeSegregation"
      | "MinimizeSegregation"
    export type VirtualAccountingDepositIdentificationStrategyBase =
      VirtualAccountingMaximizeSegregationDepositStrategy
    export type VirtualAccountingExclusionList = {
      exclusionReason: string
    } & VirtualAccountingCustodyAccountExclusionList
    export type VirtualAccountingExclusionType = "CustodyAccount"
    export type VirtualAccountingLedgerAddress = {
      id: string // uuid
      address: string
      ledgerId: string
      createdAt: string // date-time
      custodyAccountId: string // uuid
      custodyDomainId: string // uuid
    }
    export type VirtualAccountingLedgerAddressPagedCollectionResponse = {
      items: VirtualAccountingLedgerAddress[]
      count: number // int32
      currentStartingAfter?: string | null // uuid
      nextStartingAfter?: string | null // uuid
    }
    export type VirtualAccountingMaximizeSegregationDepositStrategy = {
      type: "MaximizeSegregation"
    }
    export type VirtualAccountingNewProvisioningStrategy = {
      type: "New"
    }
    export type VirtualAccountingOperationIn = {
      id: string // uuid
      request: VirtualAccountingOperationPayload
    }
    export type VirtualAccountingOperationOut = {
      id: string // uuid
      request: VirtualAccountingOperationPayload
      status: VirtualAccountingOperationStatus
      custodyOperation?: VirtualAccountingCustodyOperation
    }
    export type VirtualAccountingOperationOutPagedCollectionResponse = {
      items: VirtualAccountingOperationOut[]
      count: number // int32
      currentStartingAfter?: string | null // uuid
      nextStartingAfter?: string | null // uuid
    }
    export type VirtualAccountingOperationPayload = {
      id: string // uuid
    } & VirtualAccountingOperationTransfer
    export type VirtualAccountingOperationSortBy = "Id" | "Status"
    export type VirtualAccountingOperationStatus = "Pending" | "Completed" | "Failed"
    export type VirtualAccountingOperationTransfer = {
      id: string // uuid
      virtualAccountId?: string // uuid
      tickerId?: string // uuid
      destination?: VirtualAccountingActor
      amount?: string // ^\d+$
      description?: string
      customProperties?: {
        [name: string]: string
      }
      type: "Transfer"
    }
    export type VirtualAccountingOperationType = "Transfer"
    export type VirtualAccountingProvisioningStrategyBase = VirtualAccountingNewProvisioningStrategy
    export type VirtualAccountingProvisioningStrategyType = "New"
    export type VirtualAccountingSortOrder = "ASC" | "DESC"
    export type VirtualAccountingTransfer = {
      id: string // uuid
      status: VirtualAccountingTransferStatus
      operationId?: string | null // uuid
      custodyTransferId?: string | null // uuid
      tickerId?: string // uuid
      senders?: VirtualAccountingActor[]
      recipient?: VirtualAccountingActor
      amount?: string
      registeredAt?: string // date-time
      kind: "Transfer"
    }
    export type VirtualAccountingTransferBase = {
      id: string // uuid
      status: VirtualAccountingTransferStatus
    } & VirtualAccountingTransfer
    export type VirtualAccountingTransferBasePagedCollectionResponse = {
      items: VirtualAccountingTransferBase[]
      count: number // int32
      currentStartingAfter?: string | null // uuid
      nextStartingAfter?: string | null // uuid
    }
    export type VirtualAccountingTransferKind = "Transfer"
    export type VirtualAccountingTransferSortBy = "Id" | "TickerId" | "Status" | "RegisteredAt"
    export type VirtualAccountingTransferStatus = "None" | "Pending" | "Failed" | "Completed"
    export type VirtualAccountingVaMetadata = {
      description: string
      createdAt: string // date-time
      lastModifiedAt: string // date-time
      customProperties: {
        [name: string]: string
      }
    }
    export type VirtualAccountingVirtualAccountIn = {
      id: string // uuid
      alias: string
      description: string
      customProperties: {
        [name: string]: string
      }
    }
    export type VirtualAccountingVirtualAccountOut = {
      id: string // uuid
      alias: string
      depositIdentificationSource: VirtualAccountingDepositIdentificationSourceBase[]
      metadata: VirtualAccountingVaMetadata
    }
    export type VirtualAccountingVirtualAccountOutPagedCollectionResponse = {
      items: VirtualAccountingVirtualAccountOut[]
      count: number // int32
      currentStartingAfter?: string | null // uuid
      nextStartingAfter?: string | null // uuid
    }
    export type VirtualAccountingVirtualAccountSortBy =
      | "Id"
      | "Alias"
      | "VirtualLedgerId"
      | "CreatedAt"
      | "LastUpdatedAt"
    export type VirtualAccountingVirtualAccountUpdate = {
      alias: string
      description: string
      customProperties: {
        [name: string]: string
      }
    }
    export type VirtualAccountingVirtualLedgerIn = {
      id: string // uuid
      alias: string
      depositIdentificationStrategy: VirtualAccountingDepositIdentificationStrategyBase
      exclusionList: VirtualAccountingExclusionList[]
      description: string
      customProperties: {
        [name: string]: string
      }
    }
    export type VirtualAccountingVirtualLedgerOut = {
      id: string // uuid
      alias: string
      depositIdentificationStrategy: VirtualAccountingDepositIdentificationStrategyBase
      exclusionList: VirtualAccountingExclusionList[]
      metadata: VirtualAccountingVaMetadata
    }
    export type VirtualAccountingVirtualLedgerOutPagedCollectionResponse = {
      items: VirtualAccountingVirtualLedgerOut[]
      count: number // int32
      currentStartingAfter?: string | null // uuid
      nextStartingAfter?: string | null // uuid
    }
    export type VirtualAccountingVirtualLedgerSortBy =
      | "Id"
      | "Alias"
      | "CreatedAt"
      | "LastUpdatedAt"
    export type VirtualAccountingVirtualLedgerUpdate = {
      alias: string
      exclusionList: VirtualAccountingExclusionList[]
      description: string
      customProperties: {
        [name: string]: string
      }
    }
  }
}
export declare namespace Paths {
  namespace Analysis {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.ComplianceComplianceAnalysisRequest
    namespace Responses {
      export type $200 = Components.Schemas.ComplianceComplianceAnalysisResponse
    }
  }
  namespace AppendPIIToTransfer {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Provider = "NOTABENE"
      export type TravelRuleId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
      travelRuleId: Parameters.TravelRuleId /* uuid */
    }
    export type RequestBody =
      /* Request to append PII to a travel rule transfer */ Components.Schemas.ComplianceAppendPIIRequest
    namespace Responses {
      export type $200 =
        /* Response from appending PII to a travel rule transfer */ Components.Schemas.ComplianceAppendPIITravelRuleResponse
    }
  }
  namespace ApproveIntent {
    export type HeaderParameters = {
      requestId?: Parameters.RequestId /* uuid */
    }
    namespace Parameters {
      export type RequestId = string // uuid
    }
    export type RequestBody = Components.Schemas.CoreApproveIntentBody
    namespace Responses {
      export type $202 = Components.Schemas.CoreIntentResponse
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
      export type $500 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace ConfigureScreeningRulesForDomainAndProvider {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Provider = "ELLIPTIC" | "CHAINALYSIS"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
    }
    export type RequestBody = Components.Schemas.ComplianceConfigureScreeningRulesRequest
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace ConnectProvider {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.ComplianceProviderConnectRequest
    namespace Responses {
      export type $202 = Components.Schemas.ComplianceProviderConnectionResponse
    }
  }
  namespace CreateChannel {
    namespace Parameters {
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
    }
    export type RequestBody = Components.Schemas.EDSWebhookChannelCreate
  }
  namespace CreateDepositWallet {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type TenantId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      tenantId: Parameters.TenantId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusDepositWalletResponse
      export type $201 = Components.Schemas.OmnibusDepositWalletResponse
      export type $404 = Components.Schemas.OmnibusDepositWalletResponse
    }
  }
  namespace CreateDomainPayload {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.ComplianceDomainPayloadRequest
  }
  namespace CreateIntent {
    export type HeaderParameters = {
      requestId?: Parameters.RequestId /* uuid */
    }
    namespace Parameters {
      export type RequestId = string // uuid
    }
    export type RequestBody = Components.Schemas.CoreIntentBody
    namespace Responses {
      export type $202 = Components.Schemas.CoreIntentResponse
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $403 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
      export type $503 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace CreateInternalTransfer {
    export type HeaderParameters = {
      "Idempotency-Key": Parameters.IdempotencyKey
    }
    namespace Parameters {
      export type DomainId = string // uuid
      export type IdempotencyKey = string
      export type OmnibusId = string // uuid
      export type TenantId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      tenantId: Parameters.TenantId /* uuid */
    }
    export type RequestBody = Components.Schemas.OmnibusCreateInternalTransferRequest
    namespace Responses {
      export type $201 = Components.Schemas.OmnibusInternalTransferResponse
      export type $202 = Components.Schemas.OmnibusInternalTransferResponse
      export type $400 = Components.Schemas.OmnibusInternalTransferResponse
      export type $404 = Components.Schemas.OmnibusInternalTransferResponse
      export type $409 = Components.Schemas.OmnibusInternalTransferResponse
      export type $500 = Components.Schemas.OmnibusInternalTransferResponse
    }
  }
  namespace CreateOmnibus {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.OmnibusCreateOmnibusRequest
    namespace Responses {
      export type $201 = Components.Schemas.OmnibusCreateOmnibusResponse
      export type $400 = Components.Schemas.OmnibusCreateOmnibusResponse
      export type $409 = Components.Schemas.OmnibusCreateOmnibusResponse
    }
  }
  namespace CreatePolicyPayload {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.CompliancePolicyPayloadRequest
  }
  namespace CreateRelationship {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Provider = "NOTABENE"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
    }
    export type RequestBody =
      /* Request to create a relationship with a travel rule provider */ Components.Schemas.ComplianceCreateRelationshipRequest
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace CreateTenant {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    export type RequestBody = Components.Schemas.OmnibusCreateOrUpdateTenantRequest
    namespace Responses {
      export type $201 = Components.Schemas.OmnibusTenantResponse
      export type $404 = Components.Schemas.OmnibusTenantResponse
      export type $409 = Components.Schemas.OmnibusTenantResponse
    }
  }
  namespace CreateTravelRuleTransfer {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Provider = "NOTABENE"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
    }
    export type RequestBody =
      /* Request to create a travel rule transfer */ Components.Schemas.ComplianceCreateTransferRequest
    namespace Responses {
      export type $200 =
        /* Response from creating a travel rule transfer */ Components.Schemas.ComplianceInitiateTravelRuleResponse
    }
  }
  namespace CreateWithdrawal {
    export type HeaderParameters = {
      "Idempotency-Key": Parameters.IdempotencyKey
    }
    namespace Parameters {
      export type DomainId = string // uuid
      export type IdempotencyKey = string
      export type OmnibusId = string // uuid
      export type TenantId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      tenantId: Parameters.TenantId /* uuid */
    }
    export type RequestBody = Components.Schemas.OmnibusCreateWithdrawalRequest
    namespace Responses {
      export type $201 =
        /* unsignedIntent is present on a fresh create and on an idempotent replay of a still-pending withdrawal; it is omitted when replaying a terminal (COMPLETED/FAILED/CANCELLED) withdrawal, where there is nothing left to sign.  */ Components.Schemas.OmnibusCreateWithdrawalResponse
      export type $400 =
        /* unsignedIntent is present on a fresh create and on an idempotent replay of a still-pending withdrawal; it is omitted when replaying a terminal (COMPLETED/FAILED/CANCELLED) withdrawal, where there is nothing left to sign.  */ Components.Schemas.OmnibusCreateWithdrawalResponse
      export type $404 =
        /* unsignedIntent is present on a fresh create and on an idempotent replay of a still-pending withdrawal; it is omitted when replaying a terminal (COMPLETED/FAILED/CANCELLED) withdrawal, where there is nothing left to sign.  */ Components.Schemas.OmnibusCreateWithdrawalResponse
      export type $409 =
        /* unsignedIntent is present on a fresh create and on an idempotent replay of a still-pending withdrawal; it is omitted when replaying a terminal (COMPLETED/FAILED/CANCELLED) withdrawal, where there is nothing left to sign.  */ Components.Schemas.OmnibusCreateWithdrawalResponse
    }
  }
  namespace DeleteChannel {
    namespace Parameters {
      export type ChannelId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      channelId: Parameters.ChannelId
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace DeleteComplianceDomain {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export interface $202 {}
    }
  }
  namespace DeleteProviderConnectionAndScreeningRules {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Provider = "ELLIPTIC" | "CHAINALYSIS" | "NOTABENE"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
    }
    namespace Responses {
      export interface $204 {}
    }
  }
  namespace DepositInstructions {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type LastOnly = boolean
      export type Limit = number // int32
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type SortBy = "id" | "tickerId" | "instructions.address" | "metadata.createdAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
      export type TickerId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      tickerId?: Parameters.TickerId /* uuid */
      lastOnly?: Parameters.LastOnly
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedDepositInstructionsCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace DepositInstructionsById {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type InstructionsId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
      "instructions-id": Parameters.InstructionsId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedDepositInstructions
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace DryRunTransaction {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.CoreDryRunTransactionParameters
    namespace Responses {
      export type $200 = Components.Schemas.CoreTransactionDryRun
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $504 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace EventControllerGetEvents {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
      export type EndDate = string
      export type EventType = "CREATE" | "UPDATE" | "DELETE"
      export type Limit = number
      export type StartDate = string
      export type StartingAfter = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
    }
    export type QueryParameters = {
      accountId?: Parameters.AccountId
      startDate?: Parameters.StartDate
      endDate?: Parameters.EndDate
      eventType?: Parameters.EventType
      limit?: Parameters.Limit
      startingAfter?: Parameters.StartingAfter
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationEventsResponseDto
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace EventControllerGetEventsLegacyDomain {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
      export type EndDate = string
      export type EventType = "CREATE" | "UPDATE" | "DELETE"
      export type Limit = number
      export type StartDate = string
      export type StartingAfter = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
    }
    export type QueryParameters = {
      accountId?: Parameters.AccountId
      startDate?: Parameters.StartDate
      endDate?: Parameters.EndDate
      eventType?: Parameters.EventType
      limit?: Parameters.Limit
      startingAfter?: Parameters.StartingAfter
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationEventsResponseDto
      export interface $400 {}
      export interface $500 {}
    }
  }
  namespace ForceUpdateAccountBalances {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type LedgerId = string
      export type TickerId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      ledgerId?: Parameters.LedgerId
      tickerId?: Parameters.TickerId /* uuid */
    }
    namespace Responses {
      export interface $200 {}
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GenerateNewExternalAddress {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type LedgerId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
      ledgerId: Parameters.LedgerId
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreAccountAddress
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GenerateNewExternalAddressDeprecated {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type LedgerId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      ledgerId?: Parameters.LedgerId
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreAccountAddress
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAccount {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiAccount
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAccountAddress {
    namespace Parameters {
      export type AccountAddressId = string // uuid
      export type AccountId = string // uuid
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
      accountAddressId: Parameters.AccountAddressId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreAccountAddress
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAccountBalances {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type Limit = number // int32
      export type SortBy =
        | "id"
        | "tickerId"
        | "totalAmount"
        | "reservedAmount"
        | "quarantinedAmount"
        | "lastUpdatedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
      export type TickerId = string /* uuid */[]
      export type TickerLedgerId = string[]
      export type TickerLock = Components.Schemas.CoreLockStatus[]
      export type TickerName = string[]
      export type TickerSymbol = string[]
      export type TickerValidationStatus = Components.Schemas.CoreTickerValidationStatusFilter
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      "ticker.id"?: Parameters.TickerId
      "ticker.name"?: Parameters.TickerName
      "ticker.symbol"?: Parameters.TickerSymbol
      "ticker.ledgerId"?: Parameters.TickerLedgerId
      "ticker.validationStatus"?: Parameters.TickerValidationStatus
      "ticker.lock"?: Parameters.TickerLock
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreBalancesCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAccountConfirmedBalance {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type TickerId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
      tickerId: Parameters.TickerId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreBalanceWithConfirmedAmount
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAccountSponsorshipMovements {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type LedgerId = string
      export type Limit = number // int32
      export type Movement = Components.Schemas.CoreXrplSponsorshipMovement[]
      export type SortBy = "registeredAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type SponsorshipIndex = string
      export type StartingAfter = string // uuid
      export type TransactionId = string /* uuid */[]
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      ledgerId: Parameters.LedgerId
      transactionId?: Parameters.TransactionId
      movement?: Parameters.Movement
      sponsorshipIndex?: Parameters.SponsorshipIndex
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreSponsorshipMovementsCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAccountSponsorships {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type IncludeInactive = boolean
      export type LedgerId = string
      export type Limit = number // int32
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      ledgerId: Parameters.LedgerId
      includeInactive?: Parameters.IncludeInactive
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreSponsorshipsCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAccounts {
    namespace Parameters {
      export type AdditionalDetailsLedgersLedgerId = string[]
      export type AdditionalDetailsLedgersStatus = Components.Schemas.CoreAccountLedgerStatus[]
      export type AdditionalDetailsProcessingStatus = Components.Schemas.CoreAccountProcessingStatus
      export type Alias = string
      export type DomainId = string // uuid
      export type LedgerId = string
      export type Limit = number // int32
      export type Lock = Components.Schemas.CoreLockStatus[]
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type ProviderDetailsVaultId = string // uuid
      export type SortBy =
        | "id"
        | "alias"
        | "ledgerId"
        | "lock"
        | "metadata.createdAt"
        | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      ledgerId?: Parameters.LedgerId
      alias?: Parameters.Alias
      "providerDetails.vaultId"?: Parameters.ProviderDetailsVaultId /* uuid */
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
      lock?: Parameters.Lock
      "additionalDetails.processingStatus"?: Parameters.AdditionalDetailsProcessingStatus
      "additionalDetails.ledgers.ledgerId"?: Parameters.AdditionalDetailsLedgersLedgerId
      "additionalDetails.ledgers.status"?: Parameters.AdditionalDetailsLedgersStatus
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreAccountsCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAddresses {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type LastOnly = boolean
      export type LedgerId = string[]
      export type Limit = number // int32
      export type Scope = Components.Schemas.CoreAccountAddressScope[]
      export type SortBy = "id" | "ledgerId" | "address" | "createdAt" | "scope"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      ledgerId?: Parameters.LedgerId
      lastOnly?: Parameters.LastOnly
      scope?: Parameters.Scope
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreAddressesCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAllChannelEvents {
    namespace Parameters {
      export type ChannelId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      channelId: Parameters.ChannelId
    }
  }
  namespace GetAllChannels {
    namespace Parameters {
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
    }
  }
  namespace GetAllDomainsAddresses {
    namespace Parameters {
      export type Address = string
    }
    export type QueryParameters = {
      address: Parameters.Address
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreAddressReferenceCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAllEvents {
    namespace Parameters {
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
    }
  }
  namespace GetAllProviderConnectionForDomain {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.ComplianceProviderConnectionsResponse
    }
  }
  namespace GetAllProvidersForDomain {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.ComplianceConfigurationDetailResponse
    }
  }
  namespace GetAllUserRequestsState {
    namespace Parameters {
      export type Limit = number // int32
      export type SortBy = "id"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreRequestState[]
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetAllUserRequestsStateInDomain {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Limit = number // int32
      export type SortBy = "id"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreRequestState[]
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetBackup {
    namespace Parameters {
      export type BackupId = string // uuid
    }
    export type PathParameters = {
      backupId: Parameters.BackupId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiBackup
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetBackupTrustedEntity {
    namespace Parameters {
      export type BackupId = string // uuid
    }
    export type PathParameters = {
      backupId: Parameters.BackupId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiTrustedBackup
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetBackups {
    namespace Parameters {
      export type Acknowledged = boolean
      export type AdditionalDetailsProcessingStatus = Components.Schemas.CoreBackupProcessingStatus
      export type DataType = Components.Schemas.CoreBackupType
      export type LastOnly = boolean
      export type Limit = number // int32
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type SortBy = "id" | "alias" | "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
      export type VaultId = string // uuid
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      vaultId?: Parameters.VaultId /* uuid */
      lastOnly?: Parameters.LastOnly
      acknowledged?: Parameters.Acknowledged
      "data.type"?: Parameters.DataType
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
      "additionalDetails.processingStatus"?: Parameters.AdditionalDetailsProcessingStatus
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreBackupsCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetChannel {
    namespace Parameters {
      export type ChannelId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      channelId: Parameters.ChannelId
    }
  }
  namespace GetComplianceConfiguration {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreComplianceConfiguration
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetDepositWallet {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type TenantId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      tenantId: Parameters.TenantId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusDepositWalletResponse
      export type $404 = Components.Schemas.OmnibusDepositWalletResponse
    }
  }
  namespace GetDomain {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedDomain
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetDomains {
    namespace Parameters {
      export type Alias = string
      export type Limit = number // int32
      export type Lock = Components.Schemas.CoreLockStatus[]
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type ParentId = string // uuid
      export type SortBy =
        | "id"
        | "parentId"
        | "alias"
        | "lock"
        | "metadata.createdAt"
        | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      parentId?: Parameters.ParentId /* uuid */
      alias?: Parameters.Alias
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
      lock?: Parameters.Lock
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedDomainsCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetEndpoint {
    namespace Parameters {
      export type DomainId = string // uuid
      export type EndpointId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      endpointId: Parameters.EndpointId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedEndpoint
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetEndpoints {
    namespace Parameters {
      export type Address = string[]
      export type Alias = string
      export type DomainId = string // uuid
      export type LedgerId = string[]
      export type Limit = number // int32
      export type Lock = Components.Schemas.CoreLockStatus[]
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type SortBy =
        | "id"
        | "alias"
        | "address"
        | "ledgerId"
        | "trustScore"
        | "lock"
        | "metadata.createdAt"
        | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      ledgerId?: Parameters.LedgerId
      alias?: Parameters.Alias
      address?: Parameters.Address
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
      lock?: Parameters.Lock
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedEndpointsCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetEvent {
    namespace Parameters {
      export type ChannelId = string
      export type DomainId = string
      export type EventId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      channelId: Parameters.ChannelId
      eventId: Parameters.EventId
    }
  }
  namespace GetEvents {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Limit = number // int32
      export type Scope = Components.Schemas.CoreEventScope
      export type SortBy = "sequenceNumber"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      scope?: Parameters.Scope
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreEventsCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetExceptionRole {
    namespace Parameters {
      export type DomainId = string // uuid
      export type TransactionType = "INCOMING" | "OUTGOING"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      transactionType: Parameters.TransactionType
    }
    namespace Responses {
      export type $200 = Components.Schemas.ComplianceExceptionRoleResponse
    }
  }
  namespace GetIntent {
    namespace Parameters {
      export type DomainId = string // uuid
      export type IntentId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      intentId: Parameters.IntentId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedIntent
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetIntents {
    namespace Parameters {
      export type DetailsAuthorDomainId = string // uuid
      export type DetailsAuthorId = string // uuid
      export type DetailsAuthorSubject = string // ^[\x20-\x7E]*$
      export type DetailsMetadataCustomProperties = string[]
      export type DetailsMetadataDescription = string
      export type DetailsPayloadType = Components.Schemas.CoreIntentType[]
      export type DetailsTargetDomainId = string /* uuid */[]
      export type DomainId = string // uuid
      export type EntityId = string
      export type Limit = number // int32
      export type PolicyId = string // uuid
      export type Revision = number // int64
      export type SortBy =
        | "id"
        | "state.status"
        | "details.expiryAt"
        | "details.metadata.createdAt"
        | "state.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string
      export type StateStatus = Components.Schemas.CoreIntentStatus[]
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      "details.payload.type"?: Parameters.DetailsPayloadType
      "details.author.domainId"?: Parameters.DetailsAuthorDomainId /* uuid */
      "details.author.id"?: Parameters.DetailsAuthorId /* uuid */
      "details.targetDomainId"?: Parameters.DetailsTargetDomainId
      "details.metadata.description"?: Parameters.DetailsMetadataDescription
      "details.metadata.customProperties"?: Parameters.DetailsMetadataCustomProperties
      "state.status"?: Parameters.StateStatus
      entityId?: Parameters.EntityId
      revision?: Parameters.Revision /* int64 */
      policyId?: Parameters.PolicyId /* uuid */
      "details.author.subject"?: Parameters.DetailsAuthorSubject /* ^[\x20-\x7E]*$ */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedIntentsCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetInternalTransfer {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type OperationId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      operationId: Parameters.OperationId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusInternalTransferResponse
      export type $404 = Components.Schemas.OmnibusInternalTransferResponse
    }
  }
  namespace GetInternalTransfers {
    namespace Parameters {
      export type CreatedAfter = string // date-time
      export type CreatedBefore = string // date-time
      export type DomainId = string // uuid
      export type LedgerIds = string[]
      export type OmnibusId = string // uuid
      export type Page = number // int32
      export type Role = "SOURCE" | "DEST"
      export type Size = number // int32
      export type Sort = string
      export type Status = (
        | "PENDING"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "FAILED"
        | "CANCELLED"
        | "PENDING_VERIFICATION"
      )[]
      export type TenantId = string // uuid
      export type TickerId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    export type QueryParameters = {
      page?: Parameters.Page /* int32 */
      size?: Parameters.Size /* int32 */
      tenantId?: Parameters.TenantId /* uuid */
      role?: Parameters.Role
      status?: Parameters.Status
      tickerId?: Parameters.TickerId /* uuid */
      ledgerIds?: Parameters.LedgerIds
      createdAfter?: Parameters.CreatedAfter /* date-time */
      createdBefore?: Parameters.CreatedBefore /* date-time */
      sort?: Parameters.Sort
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusInternalTransferPageResponse
      export type $400 = Components.Schemas.OmnibusInternalTransferPageResponse
      export type $404 = Components.Schemas.OmnibusInternalTransferPageResponse
    }
  }
  namespace GetKnownUserRoles {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiRoles
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetLatestAddress {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type LedgerId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      ledgerId?: Parameters.LedgerId
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreAccountAddress
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetLedger {
    namespace Parameters {
      export type LedgerId = string
    }
    export type PathParameters = {
      ledgerId: Parameters.LedgerId
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedLedger
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetLedgerFees {
    namespace Parameters {
      export type LedgerId = string
    }
    export type PathParameters = {
      ledgerId: Parameters.LedgerId
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreCurrentFees
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $405 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetLedgers {
    namespace Parameters {
      export type Limit = number // int32
      export type SortBy = "id" | "alias" | "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedLedgersCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetManifest {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type ManifestId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
      manifestId: Parameters.ManifestId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiManifest
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetManifests {
    namespace Parameters {
      export type AccountId = string // uuid
      export type AdditionalDetailsProcessingStatus =
        Components.Schemas.CoreManifestProcessingStatus
      export type ContentType = Components.Schemas.CoreManifestContentType[]
      export type DomainId = string // uuid
      export type Limit = number // int32
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type SortBy = "id" | "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "content.type"?: Parameters.ContentType
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
      "additionalDetails.processingStatus"?: Parameters.AdditionalDetailsProcessingStatus
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreManifestsCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetMe {
    namespace Responses {
      export type $200 = Components.Schemas.CoreMeReference
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetOmnibus {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusOmnibusResponse
      export type $404 = Components.Schemas.OmnibusOmnibusResponse
    }
  }
  namespace GetOmnibusByDomain {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusOmnibusResponse
      export type $404 = Components.Schemas.OmnibusOmnibusResponse
    }
  }
  namespace GetOmnibusHierarchy {
    namespace Parameters {
      export type CreatedBefore = string // date-time
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type Page = number // int32
      export type Size = number // int32
      export type Status = "LOCKED" | "UNLOCKED"
      export type TenantIds = string /* uuid */[]
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    export type QueryParameters = {
      page?: Parameters.Page /* int32 */
      size?: Parameters.Size /* int32 */
      status?: Parameters.Status
      createdBefore?: Parameters.CreatedBefore /* date-time */
      tenantIds?: Parameters.TenantIds
    }
    namespace Responses {
      export type $200 =
        /* Full omnibus structure hierarchy: structure header repeated on every page, one element per tenant (including Host) with its deposit wallet embedded, and always-populated pagination totals. */ Components.Schemas.OmnibusOmnibusHierarchyResponse
      export type $404 =
        /* Full omnibus structure hierarchy: structure header repeated on every page, one element per tenant (including Host) with its deposit wallet embedded, and always-populated pagination totals. */ Components.Schemas.OmnibusOmnibusHierarchyResponse
    }
  }
  namespace GetOrder {
    namespace Parameters {
      export type DomainId = string // uuid
      export type TransactionOrderId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      transactionOrderId: Parameters.TransactionOrderId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedTransactionOrder
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetOrders {
    namespace Parameters {
      export type AccountId = string /* uuid */[]
      export type DomainId = string // uuid
      export type IntentId = string // uuid
      export type LedgerId = string[]
      export type Limit = number // int32
      export type MetadataCreatedAtGt = string // date-time
      export type MetadataCreatedAtLt = string // date-time
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedAtGt = string // date-time
      export type MetadataLastModifiedAtLt = string // date-time
      export type MetadataLastModifiedBy = string // uuid
      export type ParametersType = Components.Schemas.CoreTransactionOrderParameterType
      export type SortBy = "id" | "accountId" | "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      accountId?: Parameters.AccountId
      ledgerId?: Parameters.LedgerId
      intentId?: Parameters.IntentId /* uuid */
      "parameters.type"?: Parameters.ParametersType
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.createdAt.lt"?: Parameters.MetadataCreatedAtLt /* date-time */
      "metadata.createdAt.gt"?: Parameters.MetadataCreatedAtGt /* date-time */
      "metadata.lastModifiedAt.lt"?: Parameters.MetadataLastModifiedAtLt /* date-time */
      "metadata.lastModifiedAt.gt"?: Parameters.MetadataLastModifiedAtGt /* date-time */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedTransactionOrdersCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetParametersComputeStatus {
    namespace Parameters {
      export type AccountId = string // uuid
      export type ComputeId = string // uuid
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
      computeId: Parameters.ComputeId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiParametersComputeStatusResponse
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetPolicies {
    namespace Parameters {
      export type Alias = string
      export type DomainId = string // uuid
      export type IntentTypes = Components.Schemas.CoreIntentType[]
      export type Limit = number // int32
      export type Lock = Components.Schemas.CoreLockStatus[]
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type Scope = Components.Schemas.CorePolicyScope
      export type ScriptingEngine = Components.Schemas.CoreScriptingEngine
      export type SortBy =
        | "id"
        | "alias"
        | "rank"
        | "scope"
        | "lock"
        | "metadata.createdAt"
        | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      alias?: Parameters.Alias
      intentTypes?: Parameters.IntentTypes
      scope?: Parameters.Scope
      scriptingEngine?: Parameters.ScriptingEngine
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
      lock?: Parameters.Lock
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedPoliciesCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetPolicy {
    namespace Parameters {
      export type DomainId = string // uuid
      export type PolicyId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      policyId: Parameters.PolicyId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedPolicy
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetPolicyDup76 {
    namespace Parameters {
      export type DomainId = string // uuid
      export type PolicyType = "AUTOMATIC" | "EXCEPTION"
      export type TransactionType = "INCOMING" | "OUTGOING"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      policyType: Parameters.PolicyType
      transactionType: Parameters.TransactionType
    }
    namespace Responses {
      export type $200 = Components.Schemas.CompliancePolicyResponse
    }
  }
  namespace GetProvider {
    namespace Parameters {
      export type ProviderId = string // uuid
    }
    export type PathParameters = {
      providerId: Parameters.ProviderId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiProvider
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetProviderLocations {
    namespace Parameters {
      export type Limit = number // int32
      export type ProviderId = string // uuid
      export type ProviderLocationId = string[]
      export type SortBy =
        | "data.id"
        | "data.alias"
        | "data.metadata.createdAt"
        | "data.metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      providerId: Parameters.ProviderId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      providerLocationId?: Parameters.ProviderLocationId
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreLocationsCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetProviders {
    namespace Parameters {
      export type AdditionalDetailsProcessingStatus =
        Components.Schemas.CoreAccountProviderProcessingStatus
      export type Alias = string
      export type Limit = number // int32
      export type Lock = Components.Schemas.CoreLockStatus[]
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type SortBy =
        | "id"
        | "alias"
        | "lock"
        | "metadata.createdAt"
        | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      alias?: Parameters.Alias
      lock?: Parameters.Lock
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
      "additionalDetails.processingStatus"?: Parameters.AdditionalDetailsProcessingStatus
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreProvidersCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetRemainingUsers {
    namespace Parameters {
      export type DomainId = string // uuid
      export type IntentId = string // uuid
      export type UsersLock = Components.Schemas.CoreLockStatus[]
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      intentId: Parameters.IntentId /* uuid */
    }
    export type QueryParameters = {
      "users.lock"?: Parameters.UsersLock
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreRemainingDomainUsers[]
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetRequestState {
    namespace Parameters {
      export type DomainId = string // uuid
      export type RequestId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      requestId: Parameters.RequestId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreRequestState
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetScreeningRulesForDomainAndProvider {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Provider = "ELLIPTIC" | "CHAINALYSIS"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
    }
    namespace Responses {
      export type $200 = Components.Schemas.ComplianceGetScreeningRulesResponse
    }
  }
  namespace GetSweepThresholds {
    namespace Parameters {
      export type DomainId = string // uuid
      export type LedgerId = string
      export type Page = number // int32
      export type Size = number // int32
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      page?: Parameters.Page /* int32 */
      size?: Parameters.Size /* int32 */
      ledgerId?: Parameters.LedgerId
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusSweepThresholdPageResponse
      export type $400 = Components.Schemas.OmnibusSweepThresholdPageResponse
      export type $403 = Components.Schemas.OmnibusSweepThresholdPageResponse
      export type $404 = Components.Schemas.OmnibusSweepThresholdPageResponse
    }
  }
  namespace GetSystemProperties {
    namespace Parameters {
      export type Id = Components.Schemas.CoreSystemPropertyId[]
      export type Limit = number // int32
      export type SortBy = "id" | "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = Components.Schemas.CoreSystemPropertyId
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      id?: Parameters.Id
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedSystemPropertiesCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetSystemSigningInfo {
    namespace Responses {
      export type $200 = Components.Schemas.CoreSystemSigningInfo
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTenant {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type TenantId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      tenantId: Parameters.TenantId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusTenantResponse
      export type $404 = Components.Schemas.OmnibusTenantResponse
    }
  }
  namespace GetTicker {
    namespace Parameters {
      export type TickerId = string // uuid
    }
    export type PathParameters = {
      tickerId: Parameters.TickerId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiTicker
      export type $400 = string
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTickers {
    namespace Parameters {
      export type AssetCode = string[]
      export type AssetReference = string[]
      export type Issuer = string[]
      export type Kind = Components.Schemas.CoreTickerKind
      export type LedgerId = string[]
      export type Limit = number // int32
      export type Lock = Components.Schemas.CoreLockStatus[]
      export type Name = string[]
      export type SortBy = "id" | "ledgerId" | "kind" | "name" | "symbol"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
      export type Symbol = string[]
      export type ValidationStatus = Components.Schemas.CoreTickerValidationStatusFilter
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      ledgerId?: Parameters.LedgerId
      kind?: Parameters.Kind
      name?: Parameters.Name
      symbol?: Parameters.Symbol
      validationStatus?: Parameters.ValidationStatus
      lock?: Parameters.Lock
      issuer?: Parameters.Issuer
      assetCode?: Parameters.AssetCode
      assetReference?: Parameters.AssetReference
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTickersCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTransaction {
    namespace Parameters {
      export type DomainId = string // uuid
      export type TransactionId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      transactionId: Parameters.TransactionId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiTransaction
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTransactions {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type LedgerId = string
      export type LedgerTransactionDataLedgerStatus = Components.Schemas.CoreLedgerTransactionStatus
      export type LedgerTransactionDataLedgerTransactionId = string
      export type Limit = number // int32
      export type OrderReferenceDomainId = string // uuid
      export type OrderReferenceId = string // uuid
      export type ProcessingStatus = Components.Schemas.CoreTransactionProcessingStatus
      export type SortBy =
        | "id"
        | "ledgerId"
        | "processingStatus"
        | "registeredAt"
        | "ledgerTransactionData.ledgerStatus"
        | "ledgerTransactionData.statusLastUpdatedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      ledgerId?: Parameters.LedgerId
      "orderReference.Id"?: Parameters.OrderReferenceId /* uuid */
      "orderReference.domainId"?: Parameters.OrderReferenceDomainId /* uuid */
      accountId?: Parameters.AccountId /* uuid */
      "processing.status"?: Parameters.ProcessingStatus
      "ledgerTransactionData.ledgerStatus"?: Parameters.LedgerTransactionDataLedgerStatus
      "ledgerTransactionData.ledgerTransactionId"?: Parameters.LedgerTransactionDataLedgerTransactionId
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTransactionsCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTransfer {
    namespace Parameters {
      export type DomainId = string // uuid
      export type TransferId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      transferId: Parameters.TransferId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiTransfer
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTransfers {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type Kind = Components.Schemas.CoreTransferKind
      export type Limit = number // int32
      export type QuarantineStatus = Components.Schemas.CoreQuarantineStatus
      export type Quarantined = boolean
      export type RecipientAccountId = string /* uuid */[]
      export type RecipientAddressDetailsAddress = string[]
      export type RegisteredAtGt = string // date-time
      export type RegisteredAtLt = string // date-time
      export type SortBy =
        | "id"
        | "transactionId"
        | "tickerId"
        | "quarantined"
        | "value"
        | "kind"
        | "registeredAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
      export type TickerId = string // uuid
      export type TickerLedgerId = string[]
      export type TickerLock = Components.Schemas.CoreLockStatus[]
      export type TickerValidationStatus = Components.Schemas.CoreTickerValidationStatusFilter
      export type TransactionId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      transactionId?: Parameters.TransactionId /* uuid */
      tickerId?: Parameters.TickerId /* uuid */
      quarantined?: Parameters.Quarantined
      quarantineStatus?: Parameters.QuarantineStatus
      kind?: Parameters.Kind
      accountId?: Parameters.AccountId /* uuid */
      "recipient.accountId"?: Parameters.RecipientAccountId
      "registeredAt.lt"?: Parameters.RegisteredAtLt /* date-time */
      "registeredAt.gt"?: Parameters.RegisteredAtGt /* date-time */
      "recipient.addressDetails.address"?: Parameters.RecipientAddressDetailsAddress
      "ticker.ledgerId"?: Parameters.TickerLedgerId
      "ticker.validationStatus"?: Parameters.TickerValidationStatus
      "ticker.lock"?: Parameters.TickerLock
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTransfersCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTravelRuleDetails {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody =
      /* Request to retrieve travel rule details for a batch of domain and ID pairs */ Components.Schemas.ComplianceTravelRuleDetailsRequest
    namespace Responses {
      export type $200 =
        /* Response containing travel rule details for a batch of requests */ Components.Schemas.ComplianceTravelRuleDetailsResponse
    }
  }
  namespace GetTravelRuleTransfer {
    namespace Parameters {
      export type Decrypt = boolean
      export type DomainId = string // uuid
      export type Provider = "NOTABENE"
      export type TravelRuleId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
      travelRuleId: Parameters.TravelRuleId /* uuid */
    }
    export type QueryParameters = {
      decrypt?: Parameters.Decrypt
    }
    namespace Responses {
      export type $200 =
        /* Response from getting a travel rule transfer */ Components.Schemas.ComplianceGetTravelRuleTransferResponse
    }
  }
  namespace GetTrustedLedger {
    namespace Parameters {
      export type LedgerId = string
    }
    export type PathParameters = {
      ledgerId: Parameters.LedgerId
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedLedger
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTrustedLedgers {
    namespace Parameters {
      export type Limit = number // int32
      export type SortBy = "id" | "alias" | "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedLedgersCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTrustedPublicKeysApi {
    namespace Parameters {
      export type Limit = number // int32
      export type SortBy = "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedTrustedPublicKeysCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTrustedPublicKeysMessages {
    namespace Parameters {
      export type Limit = number // int32
      export type SortBy = "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedTrustedPublicKeysCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetTrustedPublicKeysTrustedCollection {
    namespace Parameters {
      export type Limit = number // int32
      export type SortBy = "metadata.createdAt" | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedTrustedPublicKeysCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetUser {
    namespace Parameters {
      export type DomainId = string // uuid
      export type UserId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      userId: Parameters.UserId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedUser
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetUsers {
    namespace Parameters {
      export type Alias = string
      export type DomainId = string // uuid
      export type Limit = number // int32
      export type Lock = Components.Schemas.CoreLockStatus[]
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type PublicKey = string
      export type Roles = string[]
      export type SortBy =
        | "id"
        | "alias"
        | "lock"
        | "metadata.createdAt"
        | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      alias?: Parameters.Alias
      publicKey?: Parameters.PublicKey
      roles?: Parameters.Roles
      "roles[]"?: Parameters.Roles
      lock?: Parameters.Lock
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTrustedUsersCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetVault {
    namespace Parameters {
      export type VaultId = string // uuid
    }
    export type PathParameters = {
      vaultId: Parameters.VaultId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiVault
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace GetVaults {
    namespace Parameters {
      export type AdditionalDetailsProcessingStatus = Components.Schemas.CoreVaultProcessingStatus
      export type Alias = string
      export type Limit = number // int32
      export type Lock = Components.Schemas.CoreLockStatus[]
      export type MetadataCreatedBy = string // uuid
      export type MetadataCustomProperties = string[]
      export type MetadataDescription = string
      export type MetadataLastModifiedBy = string // uuid
      export type PublicKey = string
      export type SortBy =
        | "id"
        | "alias"
        | "lock"
        | "metadata.createdAt"
        | "metadata.lastModifiedAt"
      export type SortOrder = Components.Schemas.CoreSortOrder
      export type StartingAfter = string // uuid
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      alias?: Parameters.Alias
      publicKey?: Parameters.PublicKey
      lock?: Parameters.Lock
      "metadata.createdBy"?: Parameters.MetadataCreatedBy /* uuid */
      "metadata.lastModifiedBy"?: Parameters.MetadataLastModifiedBy /* uuid */
      "metadata.description"?: Parameters.MetadataDescription
      "metadata.customProperties"?: Parameters.MetadataCustomProperties
      "additionalDetails.processingStatus"?: Parameters.AdditionalDetailsProcessingStatus
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreVaultsCollection
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace HealthControllerLiveness {
    namespace Responses {
      export interface $200 {
        /**
         * example:
         * ok
         */
        status?: string
        /**
         * example:
         * {
         *   "database": {
         *     "status": "up"
         *   }
         * }
         */
        info?: {
          [name: string]: {
            status: string
          }
        } | null
        error?: {
          [name: string]: {
            status: string
          }
        } | null
        /**
         * example:
         * {
         *   "database": {
         *     "status": "up"
         *   }
         * }
         */
        details?: {
          [name: string]: {
            status: string
          }
        }
      }
      export interface $503 {
        /**
         * example:
         * error
         */
        status?: string
        /**
         * example:
         * {
         *   "database": {
         *     "status": "up"
         *   }
         * }
         */
        info?: {
          [name: string]: {
            status: string
          }
        } | null
        /**
         * example:
         * {
         *   "redis": {
         *     "status": "down",
         *     "message": "Could not connect"
         *   }
         * }
         */
        error?: {
          [name: string]: {
            status: string
          }
        } | null
        /**
         * example:
         * {
         *   "database": {
         *     "status": "up"
         *   },
         *   "redis": {
         *     "status": "down",
         *     "message": "Could not connect"
         *   }
         * }
         */
        details?: {
          [name: string]: {
            status: string
          }
        }
      }
    }
  }
  namespace HealthControllerReadiness {
    namespace Responses {
      export interface $200 {
        /**
         * example:
         * ok
         */
        status?: string
        /**
         * example:
         * {
         *   "database": {
         *     "status": "up"
         *   }
         * }
         */
        info?: {
          [name: string]: {
            status: string
          }
        } | null
        error?: {
          [name: string]: {
            status: string
          }
        } | null
        /**
         * example:
         * {
         *   "database": {
         *     "status": "up"
         *   }
         * }
         */
        details?: {
          [name: string]: {
            status: string
          }
        }
      }
      export interface $503 {
        /**
         * example:
         * error
         */
        status?: string
        /**
         * example:
         * {
         *   "database": {
         *     "status": "up"
         *   }
         * }
         */
        info?: {
          [name: string]: {
            status: string
          }
        } | null
        /**
         * example:
         * {
         *   "redis": {
         *     "status": "down",
         *     "message": "Could not connect"
         *   }
         * }
         */
        error?: {
          [name: string]: {
            status: string
          }
        } | null
        /**
         * example:
         * {
         *   "database": {
         *     "status": "up"
         *   },
         *   "redis": {
         *     "status": "down",
         *     "message": "Could not connect"
         *   }
         * }
         */
        details?: {
          [name: string]: {
            status: string
          }
        }
      }
    }
  }
  namespace InitiateParametersCompute {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type RequestBody = Components.Schemas.CoreApiInitiateParametersComputeRequest
    namespace Responses {
      export type $200 = Components.Schemas.CoreApiInitiateParametersComputeResponse
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace IntentDryRun {
    export type RequestBody = Components.Schemas.CoreIntentDryRunRequest
    namespace Responses {
      export type $200 = Components.Schemas.CoreIntentDryRunResponse
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace ListComplianceConfigurations {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Limit = number // int32
      export type StartingAfter = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit /* int32 */
      startingAfter?: Parameters.StartingAfter /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreComplianceConfigurationsCollection
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace ListDepositWallets {
    namespace Parameters {
      export type CustodyAccountIds = string /* uuid */[]
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type Page = number // int32
      export type Search = string
      export type Size = number // int32
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    export type QueryParameters = {
      page?: Parameters.Page /* int32 */
      size?: Parameters.Size /* int32 */
      search?: Parameters.Search
      custodyAccountIds?: Parameters.CustodyAccountIds
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusDepositWalletSummaryPageResponse
      export type $404 = Components.Schemas.OmnibusDepositWalletSummaryPageResponse
    }
  }
  namespace ListRelationships {
    namespace Parameters {
      export type Custodian = string // did ^did:[a-z0-9]+:.+$
      export type DomainId = string // uuid
      export type From = string // did ^did:[a-z0-9]+:.+$
      export type Provider = "NOTABENE"
      export type To = string // did ^did:[a-z0-9]+:.+$
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
    }
    export type QueryParameters = {
      from?: Parameters.From /* did ^did:[a-z0-9]+:.+$ */
      to?: Parameters.To /* did ^did:[a-z0-9]+:.+$ */
      custodian?: Parameters.Custodian /* did ^did:[a-z0-9]+:.+$ */
    }
    namespace Responses {
      export type $200 =
        /* List of relationships from the travel rule provider */ Components.Schemas.ComplianceRelationshipList
    }
  }
  namespace ListTenants {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type Page = number // int32
      export type Search = string
      export type Size = number // int32
      export type Status = "LOCKED" | "UNLOCKED"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    export type QueryParameters = {
      page?: Parameters.Page /* int32 */
      size?: Parameters.Size /* int32 */
      search?: Parameters.Search
      status?: Parameters.Status
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusTenantPageResponse
      export type $404 = Components.Schemas.OmnibusTenantPageResponse
    }
  }
  namespace LockOmnibus {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusOmnibusResponse
      export type $404 = Components.Schemas.OmnibusOmnibusResponse
    }
  }
  namespace LockTenant {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type TenantId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      tenantId: Parameters.TenantId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusTenantResponse
      export type $404 = Components.Schemas.OmnibusTenantResponse
    }
  }
  namespace MovementReportControllerGenerateMovementReport {
    export type RequestBody = Components.Schemas.ExportMovementExportDto
    namespace Responses {
      export type $201 = Components.Schemas.ExportMovementReportResponseDto
      export type $400 = Components.Schemas.ExportExportErrorDto
      export type $401 = Components.Schemas.ExportExportErrorDto
      export type $403 = Components.Schemas.ExportExportErrorDto
      export type $413 = Components.Schemas.ExportExportErrorDto
      export type $429 = Components.Schemas.ExportExportErrorDto
      export type $502 = Components.Schemas.ExportExportErrorDto
    }
  }
  namespace OmnibusPositionReportControllerGenerateOmnibusPositionReport {
    export type RequestBody = Components.Schemas.ExportOmnibusPositionExportDto
    namespace Responses {
      export type $201 = Components.Schemas.ExportOmnibusPositionReportResponseDto
      export type $400 = Components.Schemas.ExportExportErrorDto
      export type $401 = Components.Schemas.ExportExportErrorDto
      export type $403 = Components.Schemas.ExportExportErrorDto
      export type $404 = Components.Schemas.ExportExportErrorDto
      export type $413 = Components.Schemas.ExportExportErrorDto
      export type $422 = Components.Schemas.ExportExportErrorDto
      export type $429 = Components.Schemas.ExportExportErrorDto
      export type $502 = Components.Schemas.ExportExportErrorDto
    }
  }
  namespace PauseProviderConnection {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Paused = boolean
      export type Provider = "ELLIPTIC" | "CHAINALYSIS" | "NOTABENE"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
    }
    export type QueryParameters = {
      paused: Parameters.Paused
    }
    namespace Responses {
      export interface $202 {}
    }
  }
  namespace PositionReportControllerGeneratePositionReport {
    export type RequestBody = Components.Schemas.ExportPositionExportDto
    namespace Responses {
      export type $201 = Components.Schemas.ExportPositionReportResponseDto
      export type $400 = Components.Schemas.ExportExportErrorDto
      export type $401 = Components.Schemas.ExportExportErrorDto
      export type $403 = Components.Schemas.ExportExportErrorDto
      export type $413 = Components.Schemas.ExportExportErrorDto
      export type $429 = Components.Schemas.ExportExportErrorDto
      export type $502 = Components.Schemas.ExportExportErrorDto
    }
  }
  namespace PresentEncryptedPIIToTransfer {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Provider = "NOTABENE"
      export type SkipValidation = boolean
      export type TravelRuleId = string // uuid
      export type TravelRulePolicyId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
      travelRuleId: Parameters.TravelRuleId /* uuid */
      travelRulePolicyId: Parameters.TravelRulePolicyId
    }
    export type QueryParameters = {
      skipValidation?: Parameters.SkipValidation
    }
    export type RequestBody =
      /* Request to present encrypted PII to a travel rule transfer */ Components.Schemas.CompliancePresentPIIRequest
    namespace Responses {
      export type $202 =
        /* Response from presenting encrypted PII to a travel rule transfer */ Components.Schemas.CompliancePresentPIITravelRuleResponse
    }
  }
  namespace PresentEncryptedPIIToTransferWithoutPolicy {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Provider = "NOTABENE"
      export type SkipValidation = boolean
      export type TravelRuleId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
      travelRuleId: Parameters.TravelRuleId /* uuid */
    }
    export type QueryParameters = {
      skipValidation?: Parameters.SkipValidation
    }
    export type RequestBody =
      /* Request to present encrypted PII to a travel rule transfer */ Components.Schemas.CompliancePresentPIIRequest
    namespace Responses {
      export type $202 =
        /* Response from presenting encrypted PII to a travel rule transfer */ Components.Schemas.CompliancePresentPIITravelRuleResponse
    }
  }
  namespace PreviewAnalysis {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.ComplianceWalletAnalysisRequest
    namespace Responses {
      export type $200 = Components.Schemas.ComplianceWalletAnalysisResponse
    }
  }
  namespace ProcessEthereumContractCall {
    namespace Parameters {
      export type LedgerId = string
    }
    export type PathParameters = {
      ledgerId: Parameters.LedgerId
    }
    export type RequestBody = Components.Schemas.CoreEthereumCallRequest
    namespace Responses {
      export type $200 = string // ^0[xX]([a-fA-F0-9]*)$
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace RejectIntent {
    export type HeaderParameters = {
      requestId?: Parameters.RequestId /* uuid */
    }
    namespace Parameters {
      export type RequestId = string // uuid
    }
    export type RequestBody = Components.Schemas.CoreRejectIntentBody
    namespace Responses {
      export type $202 = Components.Schemas.CoreIntentResponse
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
      export type $500 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace RunGenesis {
    export type RequestBody = Components.Schemas.CoreGenesisRequest
    namespace Responses {
      export interface $200 {}
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $409 = Components.Schemas.CoreErrorMessage
      export type $500 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace SponsorControllerCreateSponsor {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      accountId: Parameters.AccountId
    }
    export type RequestBody = Components.Schemas.GasStationCreateSponsorDto
    namespace Responses {
      export type $201 = Components.Schemas.GasStationSponsorCreatedResponseDto
      export interface $400 {}
      export interface $409 {}
    }
  }
  namespace SponsorControllerCreateSponsorLegacyDomain {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      accountId: Parameters.AccountId
    }
    export type RequestBody = Components.Schemas.GasStationCreateSponsorDto
    namespace Responses {
      export type $201 = Components.Schemas.GasStationSponsorCreatedResponseDto
      export interface $400 {}
      export interface $409 {}
    }
  }
  namespace SponsorControllerDeleteSponsor {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
      export type UserId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      accountId: Parameters.AccountId
    }
    export type QueryParameters = {
      userId: Parameters.UserId
    }
    namespace Responses {
      export interface $204 {}
      export interface $404 {}
    }
  }
  namespace SponsorControllerDeleteSponsorLegacyDomain {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
      export type UserId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      accountId: Parameters.AccountId
    }
    export type QueryParameters = {
      userId: Parameters.UserId
    }
    namespace Responses {
      export interface $204 {}
      export interface $404 {}
    }
  }
  namespace SponsorControllerGetSponsor {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      accountId: Parameters.AccountId
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorResponseDto
      export interface $404 {}
    }
  }
  namespace SponsorControllerGetSponsorLegacyDomain {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      accountId: Parameters.AccountId
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorResponseDto
      export interface $404 {}
    }
  }
  namespace SponsorControllerUpdateSponsor {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      accountId: Parameters.AccountId
    }
    export type RequestBody = Components.Schemas.GasStationUpdateSponsorDto
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorResponseDto
      export interface $400 {}
      export interface $404 {}
    }
  }
  namespace SponsorControllerUpdateSponsorLegacyDomain {
    namespace Parameters {
      export type AccountId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      accountId: Parameters.AccountId
    }
    export type RequestBody = Components.Schemas.GasStationUpdateSponsorDto
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorResponseDto
      export interface $400 {}
      export interface $404 {}
    }
  }
  namespace SponsorListControllerAddSponsoredAccount {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
      export type SponsoredAccountDomainId = string
      export type SponsoredAccountId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
      sponsoredAccountDomainId: Parameters.SponsoredAccountDomainId
      sponsoredAccountId: Parameters.SponsoredAccountId
    }
    namespace Responses {
      export interface $201 {}
      export interface $204 {}
      export interface $404 {}
      export interface $409 {}
    }
  }
  namespace SponsorListControllerAddSponsoredAccountLegacyDomain {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
      export type SponsoredAccountDomainId = string
      export type SponsoredAccountId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
      sponsoredAccountDomainId: Parameters.SponsoredAccountDomainId
      sponsoredAccountId: Parameters.SponsoredAccountId
    }
    namespace Responses {
      export interface $201 {}
      export interface $204 {}
      export interface $404 {}
      export interface $409 {}
    }
  }
  namespace SponsorListControllerAddSponsoredAccounts {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
    }
    export type RequestBody = Components.Schemas.GasStationAddSponsoredAccountsDto
    namespace Responses {
      export type $201 = Components.Schemas.GasStationSponsoredModificationResponseDto
      export interface $404 {}
    }
  }
  namespace SponsorListControllerAddSponsoredAccountsLegacyDomain {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
    }
    export type RequestBody = Components.Schemas.GasStationAddSponsoredAccountsDto
    namespace Responses {
      export type $201 = Components.Schemas.GasStationSponsoredModificationResponseDto
      export interface $404 {}
    }
  }
  namespace SponsorListControllerAddSponsoredDomains {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
    }
    export type RequestBody = Components.Schemas.GasStationAddSponsoredDomainsDto
    namespace Responses {
      export type $201 = Components.Schemas.GasStationSponsoredModificationResponseDto
      export interface $404 {}
    }
  }
  namespace SponsorListControllerAddSponsoredDomainsLegacyDomain {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
    }
    export type RequestBody = Components.Schemas.GasStationAddSponsoredDomainsDto
    namespace Responses {
      export type $201 = Components.Schemas.GasStationSponsoredModificationResponseDto
      export interface $404 {}
    }
  }
  namespace SponsorListControllerGetSponsorableAccounts {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
      export type Limit = number
      export type Page = number
      export type Search = string
      export type Status = "sponsored" | "not_sponsored" | "sponsored_by_other"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
    }
    export type QueryParameters = {
      status?: Parameters.Status
      search?: Parameters.Search
      limit?: Parameters.Limit
      page?: Parameters.Page
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorableAccountsResponseDto
    }
  }
  namespace SponsorListControllerGetSponsorableAccountsLegacyDomain {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
      export type Limit = number
      export type Page = number
      export type Search = string
      export type Status = "sponsored" | "not_sponsored" | "sponsored_by_other"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
    }
    export type QueryParameters = {
      status?: Parameters.Status
      search?: Parameters.Search
      limit?: Parameters.Limit
      page?: Parameters.Page
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorableAccountsResponseDto
    }
  }
  namespace SponsorListControllerGetSponsorableDomains {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
      export type Limit = number
      export type Page = number
      export type Search = string
      export type Status = "sponsored" | "not_sponsored" | "sponsored_by_other"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
    }
    export type QueryParameters = {
      status?: Parameters.Status
      search?: Parameters.Search
      limit?: Parameters.Limit
      page?: Parameters.Page
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorableDomainsResponseDto
    }
  }
  namespace SponsorListControllerGetSponsorableDomainsLegacyDomain {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
      export type Limit = number
      export type Page = number
      export type Search = string
      export type Status = "sponsored" | "not_sponsored" | "sponsored_by_other"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
    }
    export type QueryParameters = {
      status?: Parameters.Status
      search?: Parameters.Search
      limit?: Parameters.Limit
      page?: Parameters.Page
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorableDomainsResponseDto
    }
  }
  namespace SponsorListControllerRemoveSponsoredAccount {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
      export type SponsoredAccountDomainId = string
      export type SponsoredAccountId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
      sponsoredAccountDomainId: Parameters.SponsoredAccountDomainId
      sponsoredAccountId: Parameters.SponsoredAccountId
    }
    namespace Responses {
      export interface $204 {}
      export interface $404 {}
    }
  }
  namespace SponsorListControllerRemoveSponsoredAccountLegacyDomain {
    namespace Parameters {
      export type DomainId = string
      export type EntityId = string
      export type SponsoredAccountDomainId = string
      export type SponsoredAccountId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      entityId: Parameters.EntityId
      sponsoredAccountDomainId: Parameters.SponsoredAccountDomainId
      sponsoredAccountId: Parameters.SponsoredAccountId
    }
    namespace Responses {
      export interface $204 {}
      export interface $404 {}
    }
  }
  namespace SponsorsControllerGetAccountSponsor {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationAccountSponsorResponseDto
    }
  }
  namespace SponsorsControllerGetAccountSponsorLegacyDomain {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationAccountSponsorResponseDto
    }
  }
  namespace SponsorsControllerGetDomainSponsor {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationDomainSponsorResponseDto
    }
  }
  namespace SponsorsControllerGetDomainSponsorLegacyDomain {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationDomainSponsorResponseDto
    }
  }
  namespace SponsorsControllerGetValidSponsors {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type IncludeAll = boolean
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      includeAll?: Parameters.IncludeAll
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationValidSponsorsResponseDto
    }
  }
  namespace SponsorsControllerGetValidSponsorsLegacyDomain {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
      export type IncludeAll = boolean
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type QueryParameters = {
      includeAll?: Parameters.IncludeAll
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationValidSponsorsResponseDto
    }
  }
  namespace SponsorsControllerListSponsoredAccounts {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Limit = number
      export type SortBy = string
      export type SortOrder = "asc" | "desc"
      export type SponsorAccountId = string // uuid
      export type StartingAfter = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      sponsorAccountId?: Parameters.SponsorAccountId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsoredEntitiesResponseDto
      export interface $500 {}
      export interface $503 {}
    }
  }
  namespace SponsorsControllerListSponsoredAccountsLegacyDomain {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Limit = number
      export type SortBy = string
      export type SortOrder = "asc" | "desc"
      export type SponsorAccountId = string // uuid
      export type StartingAfter = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      sponsorAccountId?: Parameters.SponsorAccountId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsoredEntitiesResponseDto
      export interface $500 {}
      export interface $503 {}
    }
  }
  namespace SponsorsControllerListSponsoredDomains {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Limit = number
      export type SortBy = string
      export type SortOrder = "asc" | "desc"
      export type SponsorAccountId = string // uuid
      export type StartingAfter = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      sponsorAccountId?: Parameters.SponsorAccountId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsoredEntitiesResponseDto
      export interface $500 {}
      export interface $503 {}
    }
  }
  namespace SponsorsControllerListSponsoredDomainsLegacyDomain {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Limit = number
      export type SortBy = string
      export type SortOrder = "asc" | "desc"
      export type SponsorAccountId = string // uuid
      export type StartingAfter = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      limit?: Parameters.Limit
      startingAfter?: Parameters.StartingAfter
      sortBy?: Parameters.SortBy
      sortOrder?: Parameters.SortOrder
      sponsorAccountId?: Parameters.SponsorAccountId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsoredEntitiesResponseDto
      export interface $500 {}
      export interface $503 {}
    }
  }
  namespace SponsorsControllerListSponsors {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorsListResponseDto
    }
  }
  namespace SponsorsControllerListSponsorsLegacyDomain {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.GasStationSponsorsListResponseDto
    }
  }
  namespace TestChannel {
    namespace Parameters {
      export type ChannelId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      channelId: Parameters.ChannelId
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace TogglePreviewScreening {
    namespace Parameters {
      export type DomainId = string // uuid
      export type Enabled = boolean
      export type Provider = "ELLIPTIC" | "CHAINALYSIS"
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      provider: Parameters.Provider
    }
    export type QueryParameters = {
      enabled: Parameters.Enabled
    }
    namespace Responses {
      export interface $202 {}
    }
  }
  namespace Transferability {
    namespace Parameters {
      export type DestinationAccountId = string // uuid
      export type DomainId = string // uuid
      export type SourceAccountId = string // uuid
      export type TickerId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type QueryParameters = {
      sourceAccountId?: Parameters.SourceAccountId /* uuid */
      destinationAccountId?: Parameters.DestinationAccountId /* uuid */
      tickerId?: Parameters.TickerId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.CoreTransferabilityResponse
      export type $400 = string
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace UnlockOmnibus {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusOmnibusResponse
      export type $404 = Components.Schemas.OmnibusOmnibusResponse
    }
  }
  namespace UnlockTenant {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type TenantId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      tenantId: Parameters.TenantId /* uuid */
    }
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusTenantResponse
      export type $404 = Components.Schemas.OmnibusTenantResponse
    }
  }
  namespace UpdateChannel {
    namespace Parameters {
      export type ChannelId = string
      export type DomainId = string
    }
    export type PathParameters = {
      domainId: Parameters.DomainId
      channelId: Parameters.ChannelId
    }
    export type RequestBody = Components.Schemas.EDSChannelUpdate
  }
  namespace UpdateOmnibus {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
    }
    export type RequestBody = Components.Schemas.OmnibusUpdateOmnibusRequest
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusOmnibusResponse
      export type $404 = Components.Schemas.OmnibusOmnibusResponse
    }
  }
  namespace UpdateSweepThresholds {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.OmnibusBulkUpdateSweepThresholdsRequest
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusBulkUpdateSweepThresholdsResponse
      export type $400 = Components.Schemas.OmnibusBulkUpdateSweepThresholdsResponse
      export type $403 = Components.Schemas.OmnibusBulkUpdateSweepThresholdsResponse
      export type $404 = Components.Schemas.OmnibusBulkUpdateSweepThresholdsResponse
      export type $409 = Components.Schemas.OmnibusSweepThresholdConflictResponse
    }
  }
  namespace UpdateTenant {
    namespace Parameters {
      export type DomainId = string // uuid
      export type OmnibusId = string // uuid
      export type TenantId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      omnibusId: Parameters.OmnibusId /* uuid */
      tenantId: Parameters.TenantId /* uuid */
    }
    export type RequestBody = Components.Schemas.OmnibusCreateOrUpdateTenantRequest
    namespace Responses {
      export type $200 = Components.Schemas.OmnibusTenantResponse
      export type $404 = Components.Schemas.OmnibusTenantResponse
    }
  }
  namespace UpsertComplianceConfiguration {
    namespace Parameters {
      export type AccountId = string // uuid
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
      accountId: Parameters.AccountId /* uuid */
    }
    export type RequestBody = Components.Schemas.CoreUpsertComplianceConfigurationRequest
    namespace Responses {
      export type $200 = Components.Schemas.CoreComplianceConfiguration
      export type $400 = Components.Schemas.CoreErrorMessage
      export type $401 = Components.Schemas.CoreErrorMessage
      export type $404 = Components.Schemas.CoreErrorMessage
    }
  }
  namespace V1Domains$DomainIdUsersInvitations {
    namespace Get {
      namespace Parameters {
        export type Alias = string
        export type DomainId = string // uuid
        export type Limit = number // int32
        export type Roles = string[]
        export type SortBy = Components.Schemas.CoreExtensionsSortBy
        export type SortOrder = Components.Schemas.CoreExtensionsSortOrder
        export type StartingAfter = string // uuid
        export type Status = Components.Schemas.CoreExtensionsInvitationStatusQuery[]
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
      }
      export type QueryParameters = {
        limit?: Parameters.Limit /* int32 */
        startingAfter?: Parameters.StartingAfter /* uuid */
        sortOrder?: Parameters.SortOrder
        sortBy?: Parameters.SortBy
        status?: Parameters.Status
        alias?: Parameters.Alias
        "roles[]"?: Parameters.Roles
      }
      namespace Responses {
        export type $200 = Components.Schemas.CoreExtensionsInvitationPaginationResult
      }
    }
    namespace Post {
      namespace Parameters {
        export type DomainId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
      }
      export type RequestBody = Components.Schemas.CoreExtensionsInvitationIn
      namespace Responses {
        export type $200 = Components.Schemas.CoreExtensionsInvitationOut
      }
    }
  }
  namespace V1Domains$DomainIdUsersInvitations$Id {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
        export type Id = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        id: Parameters.Id /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.CoreExtensionsInvitationOut
      }
    }
  }
  namespace V1Domains$DomainIdUsersInvitations$IdCancel {
    namespace Post {
      namespace Parameters {
        export type DomainId = string // uuid
        export type Id = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        id: Parameters.Id /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.CoreExtensionsInvitationOut
      }
    }
  }
  namespace V1Domains$DomainIdUsersInvitations$IdComplete {
    namespace Post {
      namespace Parameters {
        export type DomainId = string // uuid
        export type Id = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        id: Parameters.Id /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.CoreExtensionsInvitationOut
      }
    }
  }
  namespace V1Domains$DomainIdUsersInvitations$IdRenew {
    namespace Post {
      namespace Parameters {
        export type DomainId = string // uuid
        export type Id = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        id: Parameters.Id /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.CoreExtensionsInvitationOut
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
        export type Limit = number // int32
        export type SortBy = Components.Schemas.VirtualAccountingVirtualLedgerSortBy
        export type SortOrder = Components.Schemas.VirtualAccountingSortOrder
        export type StartingAfter = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
      }
      export type QueryParameters = {
        limit?: Parameters.Limit /* int32 */
        startingAfter?: Parameters.StartingAfter /* uuid */
        sortOrder?: Parameters.SortOrder
        sortBy?: Parameters.SortBy
      }
      namespace Responses {
        export type $200 =
          Components.Schemas.VirtualAccountingVirtualLedgerOutPagedCollectionResponse
      }
    }
    namespace Post {
      namespace Parameters {
        export type DomainId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
      }
      export type RequestBody = Components.Schemas.VirtualAccountingVirtualLedgerIn
      namespace Responses {
        export type $201 = Components.Schemas.VirtualAccountingVirtualLedgerOut
        export interface $400 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerId {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.VirtualAccountingVirtualLedgerOut
        export interface $404 {}
      }
    }
    namespace Put {
      namespace Parameters {
        export type DomainId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
      }
      export type RequestBody = Components.Schemas.VirtualAccountingVirtualLedgerUpdate
      namespace Responses {
        export interface $204 {}
        export interface $400 {}
        export interface $404 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
        export type Limit = number // int32
        export type SortBy = Components.Schemas.VirtualAccountingVirtualAccountSortBy
        export type SortOrder = Components.Schemas.VirtualAccountingSortOrder
        export type StartingAfter = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
      }
      export type QueryParameters = {
        limit?: Parameters.Limit /* int32 */
        startingAfter?: Parameters.StartingAfter /* uuid */
        sortOrder?: Parameters.SortOrder
        sortBy?: Parameters.SortBy
      }
      namespace Responses {
        export type $200 =
          Components.Schemas.VirtualAccountingVirtualAccountOutPagedCollectionResponse
        export interface $404 {}
      }
    }
    namespace Post {
      namespace Parameters {
        export type DomainId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
      }
      export type RequestBody = Components.Schemas.VirtualAccountingVirtualAccountIn
      namespace Responses {
        export type $201 = Components.Schemas.VirtualAccountingVirtualAccountOut
        export interface $404 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountId {
    namespace Put {
      namespace Parameters {
        export type AccountId = string // uuid
        export type DomainId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
        accountId: Parameters.AccountId /* uuid */
      }
      export type RequestBody = Components.Schemas.VirtualAccountingVirtualAccountUpdate
      namespace Responses {
        export interface $204 {}
        export interface $404 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdAddresses {
    namespace Get {
      namespace Parameters {
        export type AccountId = string // uuid
        export type CustodyAccountId = string // uuid
        export type CustodyDomainId = string // uuid
        export type DomainId = string // uuid
        export type LedgerId = string
        export type Limit = number // int32
        export type StartingAfter = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
        accountId: Parameters.AccountId /* uuid */
      }
      export type QueryParameters = {
        limit?: Parameters.Limit /* int32 */
        startingAfter?: Parameters.StartingAfter /* uuid */
        ledgerId?: Parameters.LedgerId
        custodyAccountId?: Parameters.CustodyAccountId /* uuid */
        custodyDomainId?: Parameters.CustodyDomainId /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.VirtualAccountingLedgerAddressPagedCollectionResponse
        export interface $400 {}
        export interface $404 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdBalances {
    namespace Get {
      namespace Parameters {
        export type AccountId = string // uuid
        export type DomainId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
        accountId: Parameters.AccountId /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.VirtualAccountingBalanceCollectionResponse
        export interface $404 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdDepositIdentificationSources {
    namespace Post {
      namespace Parameters {
        export type AccountId = string // uuid
        export type DomainId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
        accountId: Parameters.AccountId /* uuid */
      }
      export type RequestBody =
        Components.Schemas.VirtualAccountingDepositIdentificationSourceBaseIn
      namespace Responses {
        export interface $200 {}
        export interface $400 {}
        export interface $404 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdBalances {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.VirtualAccountingBalanceCollectionResponse
        export interface $404 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdOperations {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
        export type Limit = number // int32
        export type SortBy = Components.Schemas.VirtualAccountingOperationSortBy
        export type SortOrder = Components.Schemas.VirtualAccountingSortOrder
        export type StartingAfter = string // uuid
        export type Status = number // int32
        export type TickerId = string // uuid
        export type VirtualAccountId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
      }
      export type QueryParameters = {
        limit?: Parameters.Limit /* int32 */
        startingAfter?: Parameters.StartingAfter /* uuid */
        sortOrder?: Parameters.SortOrder
        sortBy?: Parameters.SortBy
        virtualAccountId?: Parameters.VirtualAccountId /* uuid */
        status?: Parameters.Status /* int32 */
        tickerId?: Parameters.TickerId /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.VirtualAccountingOperationOutPagedCollectionResponse
        export interface $404 {}
      }
    }
    namespace Post {
      namespace Parameters {
        export type DomainId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
      }
      export type RequestBody = Components.Schemas.VirtualAccountingOperationIn
      namespace Responses {
        export type $201 = Components.Schemas.VirtualAccountingOperationOut
        export interface $400 {}
        export interface $404 {}
      }
    }
  }
  namespace V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdTransfers {
    namespace Get {
      namespace Parameters {
        export type DomainId = string // uuid
        export type Limit = number // int32
        export type SortBy = Components.Schemas.VirtualAccountingTransferSortBy
        export type SortOrder = Components.Schemas.VirtualAccountingSortOrder
        export type StartingAfter = string // uuid
        export type Status = number // int32
        export type TickerId = string // uuid
        export type VirtualAccountId = string // uuid
        export type VirtualLedgerId = string // uuid
      }
      export type PathParameters = {
        domainId: Parameters.DomainId /* uuid */
        virtualLedgerId: Parameters.VirtualLedgerId /* uuid */
      }
      export type QueryParameters = {
        limit?: Parameters.Limit /* int32 */
        startingAfter?: Parameters.StartingAfter /* uuid */
        sortOrder?: Parameters.SortOrder
        sortBy?: Parameters.SortBy
        virtualAccountId?: Parameters.VirtualAccountId /* uuid */
        status?: Parameters.Status /* int32 */
        tickerId?: Parameters.TickerId /* uuid */
      }
      namespace Responses {
        export type $200 = Components.Schemas.VirtualAccountingTransferBasePagedCollectionResponse
        export interface $404 {}
      }
    }
  }
  namespace V1UsersInvitations$IdOrCode {
    namespace Get {
      namespace Parameters {
        export type IdOrCode = string
      }
      export type PathParameters = {
        idOrCode: Parameters.IdOrCode
      }
      namespace Responses {
        export type $200 = Components.Schemas.CoreExtensionsPublicInvitationOut
      }
    }
    namespace Post {
      namespace Parameters {
        export type IdOrCode = string
      }
      export type PathParameters = {
        idOrCode: Parameters.IdOrCode
      }
      export type RequestBody = Components.Schemas.CoreExtensionsInvitationAnswerIn
      namespace Responses {
        export interface $200 {}
      }
    }
  }
  namespace V1Vaults$VaultIdOperationsPrepared {
    namespace Get {
      namespace Parameters {
        export type VaultId = string // uuid
      }
      export type PathParameters = {
        vaultId: Parameters.VaultId /* uuid */
      }
      namespace Responses {
        export type $200 = string // binary
      }
    }
  }
  namespace V1VaultsOperationsSigned {
    namespace Post {
      export type RequestBody = {
        files: string /* binary */[]
      }
      namespace Responses {
        export interface $200 {}
        export type $400 = Components.Schemas.CoreExtensionsErrorMessages
      }
    }
  }
  namespace ValidateComplianceDomainCreation {
    namespace Parameters {
      export type DomainId = string // uuid
    }
    export type PathParameters = {
      domainId: Parameters.DomainId /* uuid */
    }
    export type RequestBody = Components.Schemas.ComplianceValidateComplianceDomainCreationRequest
  }
}

export interface components {
  schemas: {
    Core_Account: Components.Schemas.CoreAccount
    Core_AccountAdditionalDetails: Components.Schemas.CoreAccountAdditionalDetails
    Core_AccountAddress: Components.Schemas.CoreAccountAddress
    Core_AccountAddressData: Components.Schemas.CoreAccountAddressData
    Core_AccountAddressReference: Components.Schemas.CoreAccountAddressReference
    Core_AccountAddressScope: Components.Schemas.CoreAccountAddressScope
    Core_AccountCreated: Components.Schemas.CoreAccountCreated
    Core_AccountKeyStrategy: Components.Schemas.CoreAccountKeyStrategy
    Core_AccountLedgerProcessingDetails: Components.Schemas.CoreAccountLedgerProcessingDetails
    Core_AccountLedgerProcessingDetails_Pending: Components.Schemas.CoreAccountLedgerProcessingDetailsPending
    Core_AccountLedgerProcessingDetails_Pending_Hint: Components.Schemas.CoreAccountLedgerProcessingDetailsPendingHint
    Core_AccountLedgerProcessingDetails_Preparing: Components.Schemas.CoreAccountLedgerProcessingDetailsPreparing
    Core_AccountLedgerProcessingDetails_Preparing_Hint: Components.Schemas.CoreAccountLedgerProcessingDetailsPreparingHint
    Core_AccountLedgerProcessingDetails_Recovering: Components.Schemas.CoreAccountLedgerProcessingDetailsRecovering
    Core_AccountLedgerProcessingDetails_Recovering_Hint: Components.Schemas.CoreAccountLedgerProcessingDetailsRecoveringHint
    Core_AccountLedgerProcessingDetails_Tracked: Components.Schemas.CoreAccountLedgerProcessingDetailsTracked
    Core_AccountLedgerProcessingDetails_Tracked_Hint: Components.Schemas.CoreAccountLedgerProcessingDetailsTrackedHint
    Core_AccountLedgerStatus: Components.Schemas.CoreAccountLedgerStatus
    Core_AccountProcessingDetails: Components.Schemas.CoreAccountProcessingDetails
    Core_AccountProcessingDetails_Completed: Components.Schemas.CoreAccountProcessingDetailsCompleted
    Core_AccountProcessingDetails_Interrupted: Components.Schemas.CoreAccountProcessingDetailsInterrupted
    Core_AccountProcessingDetails_Pending: Components.Schemas.CoreAccountProcessingDetailsPending
    Core_AccountProcessingDetails_Preparing: Components.Schemas.CoreAccountProcessingDetailsPreparing
    Core_AccountProcessingDetails_Recovering: Components.Schemas.CoreAccountProcessingDetailsRecovering
    Core_AccountProcessingDetails_Tracked: Components.Schemas.CoreAccountProcessingDetailsTracked
    Core_AccountProcessingStatus: Components.Schemas.CoreAccountProcessingStatus
    Core_AccountProviderInformation: Components.Schemas.CoreAccountProviderInformation
    Core_AccountProviderInformation_Vault: Components.Schemas.CoreAccountProviderInformationVault
    Core_AccountPublicKey: Components.Schemas.CoreAccountPublicKey
    Core_AccountPublicKeyExtendedOnly: Components.Schemas.CoreAccountPublicKeyExtendedOnly
    Core_AccountPublicKeyExtendedOnly_ExtendedPublicKey: Components.Schemas.CoreAccountPublicKeyExtendedOnlyExtendedPublicKey
    Core_AccountPublicKeyOnly: Components.Schemas.CoreAccountPublicKeyOnly
    Core_AccountPublicKeyOnly_PublicKey: Components.Schemas.CoreAccountPublicKeyOnlyPublicKey
    Core_AccountPublicKey_ExtendedPublicKey: Components.Schemas.CoreAccountPublicKeyExtendedPublicKey
    Core_AccountPublicKey_PublicKey: Components.Schemas.CoreAccountPublicKeyPublicKey
    Core_AccountReference: Components.Schemas.CoreAccountReference
    Core_AccountUpdated: Components.Schemas.CoreAccountUpdated
    Core_AccountsCollection: Components.Schemas.CoreAccountsCollection
    Core_AddressCreated: Components.Schemas.CoreAddressCreated
    Core_AddressDetails: Components.Schemas.CoreAddressDetails
    Core_AddressForChange: Components.Schemas.CoreAddressForChange
    Core_AddressReferenceCollection: Components.Schemas.CoreAddressReferenceCollection
    Core_AddressesCollection: Components.Schemas.CoreAddressesCollection
    Core_AddressesReference: Components.Schemas.CoreAddressesReference
    Core_AlgorandFeeStrategy: Components.Schemas.CoreAlgorandFeeStrategy
    Core_AlgorandFeeStrategy_Priority: Components.Schemas.CoreAlgorandFeeStrategyPriority
    Core_AlgorandOperation: Components.Schemas.CoreAlgorandOperation
    Core_AlgorandOperation_Payment: Components.Schemas.CoreAlgorandOperationPayment
    Core_AlgorandTickerProperties: Components.Schemas.CoreAlgorandTickerProperties
    Core_AlgorandTickerProperties_Native: Components.Schemas.CoreAlgorandTickerPropertiesNative
    Core_ApiAccount: Components.Schemas.CoreApiAccount
    Core_ApiAccountLedgerProcessing: Components.Schemas.CoreApiAccountLedgerProcessing
    Core_ApiAccountLedgerProcessing_Activated: Components.Schemas.CoreApiAccountLedgerProcessingActivated
    Core_ApiAccountLedgerProcessing_Activating: Components.Schemas.CoreApiAccountLedgerProcessingActivating
    Core_ApiAccountLedgerProcessing_Available: Components.Schemas.CoreApiAccountLedgerProcessingAvailable
    Core_ApiAccountLedgerProcessing_AwaitingLedgerActivation: Components.Schemas.CoreApiAccountLedgerProcessingAwaitingLedgerActivation
    Core_ApiAccountLedgerProcessing_Unavailable: Components.Schemas.CoreApiAccountLedgerProcessingUnavailable
    Core_ApiBackup: Components.Schemas.CoreApiBackup
    Core_ApiBackupData: Components.Schemas.CoreApiBackupData
    Core_ApiBackupData_VaultHSM: Components.Schemas.CoreApiBackupDataVaultHSM
    Core_ApiBackupData_VaultMPC: Components.Schemas.CoreApiBackupDataVaultMPC
    Core_ApiBroadcastingTransactionProcessingHint: Components.Schemas.CoreApiBroadcastingTransactionProcessingHint
    Core_ApiDryRunTransactionProcessingHint: Components.Schemas.CoreApiDryRunTransactionProcessingHint
    Core_ApiFailedTransactionProcessingHint: Components.Schemas.CoreApiFailedTransactionProcessingHint
    Core_ApiInterruptedTransactionCause: Components.Schemas.CoreApiInterruptedTransactionCause
    Core_ApiManifest: Components.Schemas.CoreApiManifest
    Core_ApiPendingAccountProcessingHint: Components.Schemas.CoreApiPendingAccountProcessingHint
    Core_ApiPendingTransactionProcessingHint: Components.Schemas.CoreApiPendingTransactionProcessingHint
    Core_ApiPreparingAccountProcessingHint: Components.Schemas.CoreApiPreparingAccountProcessingHint
    Core_ApiPreparingTransactionProcessingHint: Components.Schemas.CoreApiPreparingTransactionProcessingHint
    Core_ApiRecoveringAccountProcessingHint: Components.Schemas.CoreApiRecoveringAccountProcessingHint
    Core_ApiRoles: Components.Schemas.CoreApiRoles
    Core_ApiTicker: Components.Schemas.CoreApiTicker
    Core_ApiTickerData: Components.Schemas.CoreApiTickerData
    Core_ApiTransaction: Components.Schemas.CoreApiTransaction
    Core_ApiTransactionProcessingDetails: Components.Schemas.CoreApiTransactionProcessingDetails
    Core_ApiTransactionProcessingDetails_Broadcasting: Components.Schemas.CoreApiTransactionProcessingDetailsBroadcasting
    Core_ApiTransactionProcessingDetails_Completed: Components.Schemas.CoreApiTransactionProcessingDetailsCompleted
    Core_ApiTransactionProcessingDetails_Failed: Components.Schemas.CoreApiTransactionProcessingDetailsFailed
    Core_ApiTransactionProcessingDetails_Interrupted: Components.Schemas.CoreApiTransactionProcessingDetailsInterrupted
    Core_ApiTransactionProcessingDetails_Pending: Components.Schemas.CoreApiTransactionProcessingDetailsPending
    Core_ApiTransactionProcessingDetails_Prepared: Components.Schemas.CoreApiTransactionProcessingDetailsPrepared
    Core_ApiTransactionProcessingDetails_Preparing: Components.Schemas.CoreApiTransactionProcessingDetailsPreparing
    Core_ApiTransactionProcessingDetails_Reserved: Components.Schemas.CoreApiTransactionProcessingDetailsReserved
    Core_ApiTransfer: Components.Schemas.CoreApiTransfer
    Core_ApiTrustedBackup: Components.Schemas.CoreApiTrustedBackup
    Core_ApiVault: Components.Schemas.CoreApiVault
    Core_ApprovalDecision: Components.Schemas.CoreApprovalDecision
    Core_Approve: Components.Schemas.CoreApprove
    Core_ApproveIntentBody: Components.Schemas.CoreApproveIntentBody
    Core_Backup: Components.Schemas.CoreBackup
    Core_BackupAdditionalDetails: Components.Schemas.CoreBackupAdditionalDetails
    Core_BackupCreated: Components.Schemas.CoreBackupCreated
    Core_BackupData: Components.Schemas.CoreBackupData
    Core_BackupData_VaultHsm: Components.Schemas.CoreBackupDataVaultHsm
    Core_BackupData_VaultMpc: Components.Schemas.CoreBackupDataVaultMpc
    Core_BackupProcessingDetails: Components.Schemas.CoreBackupProcessingDetails
    Core_BackupProcessingDetails_Completed: Components.Schemas.CoreBackupProcessingDetailsCompleted
    Core_BackupProcessingDetails_Failed: Components.Schemas.CoreBackupProcessingDetailsFailed
    Core_BackupProcessingDetails_Pending: Components.Schemas.CoreBackupProcessingDetailsPending
    Core_BackupProcessingDetails_Preparing: Components.Schemas.CoreBackupProcessingDetailsPreparing
    Core_BackupProcessingStatus: Components.Schemas.CoreBackupProcessingStatus
    Core_BackupType: Components.Schemas.CoreBackupType
    Core_BackupUpdated: Components.Schemas.CoreBackupUpdated
    Core_BackupsCollection: Components.Schemas.CoreBackupsCollection
    Core_Balance: Components.Schemas.CoreBalance
    Core_BalanceWithConfirmedAmount: Components.Schemas.CoreBalanceWithConfirmedAmount
    Core_BalancesCollection: Components.Schemas.CoreBalancesCollection
    Core_BalancesUpdated: Components.Schemas.CoreBalancesUpdated
    Core_BitcoinFee: Components.Schemas.CoreBitcoinFee
    Core_BitcoinFeeStrategy: Components.Schemas.CoreBitcoinFeeStrategy
    Core_BitcoinFeeStrategy_Priority: Components.Schemas.CoreBitcoinFeeStrategyPriority
    Core_BitcoinFeeStrategy_SpecifiedRate: Components.Schemas.CoreBitcoinFeeStrategySpecifiedRate
    Core_BitcoinLikeVaultLedgerIdentifier: Components.Schemas.CoreBitcoinLikeVaultLedgerIdentifier
    Core_BitcoinOnLedgerDataInput: Components.Schemas.CoreBitcoinOnLedgerDataInput
    Core_BitcoinOnLedgerDataOutput: Components.Schemas.CoreBitcoinOnLedgerDataOutput
    Core_BitcoinOutputParameters: Components.Schemas.CoreBitcoinOutputParameters
    Core_BitcoinResourceStrategy: Components.Schemas.CoreBitcoinResourceStrategy
    Core_BitcoinResourceStrategy_OrderReplacement: Components.Schemas.CoreBitcoinResourceStrategyOrderReplacement
    Core_BitcoinTickerProperties: Components.Schemas.CoreBitcoinTickerProperties
    Core_BitcoinTickerProperties_Native: Components.Schemas.CoreBitcoinTickerPropertiesNative
    Core_CardanoFeeStrategy: Components.Schemas.CoreCardanoFeeStrategy
    Core_CardanoFeeStrategy_Priority: Components.Schemas.CoreCardanoFeeStrategyPriority
    Core_CardanoOperation: Components.Schemas.CoreCardanoOperation
    Core_CardanoOperation_DelegateRepresentative: Components.Schemas.CoreCardanoOperationDelegateRepresentative
    Core_CardanoOperation_DelegateStaking: Components.Schemas.CoreCardanoOperationDelegateStaking
    Core_CardanoOperation_RegisterStaking: Components.Schemas.CoreCardanoOperationRegisterStaking
    Core_CardanoOperation_Transfer: Components.Schemas.CoreCardanoOperationTransfer
    Core_CardanoOperation_UnregisterStaking: Components.Schemas.CoreCardanoOperationUnregisterStaking
    Core_CardanoOperation_WithdrawRewards: Components.Schemas.CoreCardanoOperationWithdrawRewards
    Core_CardanoOutputParameters: Components.Schemas.CoreCardanoOutputParameters
    Core_CardanoTickerProperties: Components.Schemas.CoreCardanoTickerProperties
    Core_CardanoTickerProperties_Native: Components.Schemas.CoreCardanoTickerPropertiesNative
    Core_ComplianceConfiguration: Components.Schemas.CoreComplianceConfiguration
    Core_ComplianceConfigurationUpdated: Components.Schemas.CoreComplianceConfigurationUpdated
    Core_ComplianceConfigurationsCollection: Components.Schemas.CoreComplianceConfigurationsCollection
    Core_ContractParameters: Components.Schemas.CoreContractParameters
    Core_ContractParameters_Raw: Components.Schemas.CoreContractParametersRaw
    Core_CreateAccountDryRunResult: Components.Schemas.CoreCreateAccountDryRunResult
    Core_CreateDomainGenesisPolicy: Components.Schemas.CoreCreateDomainGenesisPolicy
    Core_CreateDomainGenesisUser: Components.Schemas.CoreCreateDomainGenesisUser
    Core_CreateDomainsPayload: Components.Schemas.CoreCreateDomainsPayload
    Core_CreateLedgerGenesis: Components.Schemas.CoreCreateLedgerGenesis
    Core_CreateTransferOrderOutput: Components.Schemas.CoreCreateTransferOrderOutput
    Core_CreatedEntitiesReferences: Components.Schemas.CoreCreatedEntitiesReferences
    Core_CreatedEntitiesReferences_Policy: Components.Schemas.CoreCreatedEntitiesReferencesPolicy
    Core_CreatedEntitiesReferences_User: Components.Schemas.CoreCreatedEntitiesReferencesUser
    Core_CurrentFees: Components.Schemas.CoreCurrentFees
    Core_CurrentFees_Bitcoin: Components.Schemas.CoreCurrentFeesBitcoin
    Core_CurrentFees_Ethereum: Components.Schemas.CoreCurrentFeesEthereum
    Core_CurrentFees_Stellar: Components.Schemas.CoreCurrentFeesStellar
    Core_CurrentFees_XRPL: Components.Schemas.CoreCurrentFeesXRPL
    Core_CustodyType: Components.Schemas.CoreCustodyType
    Core_DecisionPayload: Components.Schemas.CoreDecisionPayload
    Core_DelegateRepresentativeParameters: Components.Schemas.CoreDelegateRepresentativeParameters
    Core_DelegateRepresentativeParameters_AlwaysAbstain: Components.Schemas.CoreDelegateRepresentativeParametersAlwaysAbstain
    Core_Domain: Components.Schemas.CoreDomain
    Core_DomainCreated: Components.Schemas.CoreDomainCreated
    Core_DomainUpdated: Components.Schemas.CoreDomainUpdated
    Core_DryRunTransactionParameters: Components.Schemas.CoreDryRunTransactionParameters
    Core_Endpoint: Components.Schemas.CoreEndpoint
    Core_EndpointCreated: Components.Schemas.CoreEndpointCreated
    Core_EndpointLedgerParameters: Components.Schemas.CoreEndpointLedgerParameters
    Core_EndpointLedgerParameters_Ethereum: Components.Schemas.CoreEndpointLedgerParametersEthereum
    Core_EndpointUpdated: Components.Schemas.CoreEndpointUpdated
    Core_EntityIdAndRevision: Components.Schemas.CoreEntityIdAndRevision
    Core_EntityMetadata: Components.Schemas.CoreEntityMetadata
    Core_EntityStringIdAndRevision: Components.Schemas.CoreEntityStringIdAndRevision
    Core_ErrorMessage: Components.Schemas.CoreErrorMessage
    Core_EthereumCallRequest: Components.Schemas.CoreEthereumCallRequest
    Core_EthereumCaller: Components.Schemas.CoreEthereumCaller
    Core_EthereumCaller_Account: Components.Schemas.CoreEthereumCallerAccount
    Core_EthereumCaller_Address: Components.Schemas.CoreEthereumCallerAddress
    Core_EthereumEIP1559Prices: Components.Schemas.CoreEthereumEIP1559Prices
    Core_EthereumFee: Components.Schemas.CoreEthereumFee
    Core_EthereumFeeStrategy: Components.Schemas.CoreEthereumFeeStrategy
    Core_EthereumFeeStrategy_Priority: Components.Schemas.CoreEthereumFeeStrategyPriority
    Core_EthereumFeeStrategy_SpecifiedRate: Components.Schemas.CoreEthereumFeeStrategySpecifiedRate
    Core_EthereumFeeStrategy_SpecifiedRateEIP1559: Components.Schemas.CoreEthereumFeeStrategySpecifiedRateEIP1559
    Core_EthereumLedgerLog: Components.Schemas.CoreEthereumLedgerLog
    Core_EthereumLikeVaultLedgerIdentifier: Components.Schemas.CoreEthereumLikeVaultLedgerIdentifier
    Core_EthereumResourceStrategy: Components.Schemas.CoreEthereumResourceStrategy
    Core_EthereumResourceStrategy_OrderReplacement: Components.Schemas.CoreEthereumResourceStrategyOrderReplacement
    Core_EthereumTickerProperties: Components.Schemas.CoreEthereumTickerProperties
    Core_EthereumTickerProperties_ERC1155: Components.Schemas.CoreEthereumTickerPropertiesERC1155
    Core_EthereumTickerProperties_ERC20: Components.Schemas.CoreEthereumTickerPropertiesERC20
    Core_EthereumTickerProperties_ERC721: Components.Schemas.CoreEthereumTickerPropertiesERC721
    Core_EthereumTickerProperties_Native: Components.Schemas.CoreEthereumTickerPropertiesNative
    Core_EventScope: Components.Schemas.CoreEventScope
    Core_EventsCollection: Components.Schemas.CoreEventsCollection
    Core_FeePriority: Components.Schemas.CoreFeePriority
    Core_Genesis: Components.Schemas.CoreGenesis
    Core_GenesisCryptoSetup: Components.Schemas.CoreGenesisCryptoSetup
    Core_GenesisData: Components.Schemas.CoreGenesisData
    Core_GenesisPayload: Components.Schemas.CoreGenesisPayload
    Core_GenesisRequest: Components.Schemas.CoreGenesisRequest
    Core_GenesisSucceeded: Components.Schemas.CoreGenesisSucceeded
    Core_GoverningStrategy: Components.Schemas.CoreGoverningStrategy
    Core_HarmonizeEvent: Components.Schemas.CoreHarmonizeEvent
    Core_HarmonizeEventPayload: Components.Schemas.CoreHarmonizeEventPayload
    Core_HederaFeeStrategy: Components.Schemas.CoreHederaFeeStrategy
    Core_HederaFeeStrategy_Priority: Components.Schemas.CoreHederaFeeStrategyPriority
    Core_HederaOperation: Components.Schemas.CoreHederaOperation
    Core_HederaOperation_AccountUpdate: Components.Schemas.CoreHederaOperationAccountUpdate
    Core_HederaOperation_TokenAssociate: Components.Schemas.CoreHederaOperationTokenAssociate
    Core_HederaOperation_TokenDissociate: Components.Schemas.CoreHederaOperationTokenDissociate
    Core_HederaOperation_Transfer: Components.Schemas.CoreHederaOperationTransfer
    Core_HederaTickerProperties: Components.Schemas.CoreHederaTickerProperties
    Core_HederaTickerProperties_FungibleToken: Components.Schemas.CoreHederaTickerPropertiesFungibleToken
    Core_HederaTickerProperties_Native: Components.Schemas.CoreHederaTickerPropertiesNative
    Core_HederaTickerProperties_NonFungibleToken: Components.Schemas.CoreHederaTickerPropertiesNonFungibleToken
    Core_HederaTransferOutput: Components.Schemas.CoreHederaTransferOutput
    Core_IntentClosed: Components.Schemas.CoreIntentClosed
    Core_IntentCreated: Components.Schemas.CoreIntentCreated
    Core_IntentDetails: Components.Schemas.CoreIntentDetails
    Core_IntentDryRunRequest: Components.Schemas.CoreIntentDryRunRequest
    Core_IntentDryRunResponse: Components.Schemas.CoreIntentDryRunResponse
    Core_IntentDryRunResponse_v0_AcknowledgeBackup: Components.Schemas.CoreIntentDryRunResponseV0AcknowledgeBackup
    Core_IntentDryRunResponse_v0_AddAccountLedgers: Components.Schemas.CoreIntentDryRunResponseV0AddAccountLedgers
    Core_IntentDryRunResponse_v0_AddTrustedPublicKeysForMigration: Components.Schemas.CoreIntentDryRunResponseV0AddTrustedPublicKeysForMigration
    Core_IntentDryRunResponse_v0_AttemptTransactionOrderCancellation: Components.Schemas.CoreIntentDryRunResponseV0AttemptTransactionOrderCancellation
    Core_IntentDryRunResponse_v0_CreateAccount: Components.Schemas.CoreIntentDryRunResponseV0CreateAccount
    Core_IntentDryRunResponse_v0_CreateBackup: Components.Schemas.CoreIntentDryRunResponseV0CreateBackup
    Core_IntentDryRunResponse_v0_CreateDomain: Components.Schemas.CoreIntentDryRunResponseV0CreateDomain
    Core_IntentDryRunResponse_v0_CreateEndpoint: Components.Schemas.CoreIntentDryRunResponseV0CreateEndpoint
    Core_IntentDryRunResponse_v0_CreateLedger: Components.Schemas.CoreIntentDryRunResponseV0CreateLedger
    Core_IntentDryRunResponse_v0_CreatePolicy: Components.Schemas.CoreIntentDryRunResponseV0CreatePolicy
    Core_IntentDryRunResponse_v0_CreateTicker: Components.Schemas.CoreIntentDryRunResponseV0CreateTicker
    Core_IntentDryRunResponse_v0_CreateTransactionOrder: Components.Schemas.CoreIntentDryRunResponseV0CreateTransactionOrder
    Core_IntentDryRunResponse_v0_CreateTransferOrder: Components.Schemas.CoreIntentDryRunResponseV0CreateTransferOrder
    Core_IntentDryRunResponse_v0_CreateUser: Components.Schemas.CoreIntentDryRunResponseV0CreateUser
    Core_IntentDryRunResponse_v0_CreateVault: Components.Schemas.CoreIntentDryRunResponseV0CreateVault
    Core_IntentDryRunResponse_v0_ExecuteExtension: Components.Schemas.CoreIntentDryRunResponseV0ExecuteExtension
    Core_IntentDryRunResponse_v0_LockAccount: Components.Schemas.CoreIntentDryRunResponseV0LockAccount
    Core_IntentDryRunResponse_v0_LockDomain: Components.Schemas.CoreIntentDryRunResponseV0LockDomain
    Core_IntentDryRunResponse_v0_LockEndpoint: Components.Schemas.CoreIntentDryRunResponseV0LockEndpoint
    Core_IntentDryRunResponse_v0_LockPolicy: Components.Schemas.CoreIntentDryRunResponseV0LockPolicy
    Core_IntentDryRunResponse_v0_LockTicker: Components.Schemas.CoreIntentDryRunResponseV0LockTicker
    Core_IntentDryRunResponse_v0_LockUser: Components.Schemas.CoreIntentDryRunResponseV0LockUser
    Core_IntentDryRunResponse_v0_LockVault: Components.Schemas.CoreIntentDryRunResponseV0LockVault
    Core_IntentDryRunResponse_v0_MigrateSilo3AccountBatch: Components.Schemas.CoreIntentDryRunResponseV0MigrateSilo3AccountBatch
    Core_IntentDryRunResponse_v0_NotarizeData: Components.Schemas.CoreIntentDryRunResponseV0NotarizeData
    Core_IntentDryRunResponse_v0_ReleaseQuarantinedTransfers: Components.Schemas.CoreIntentDryRunResponseV0ReleaseQuarantinedTransfers
    Core_IntentDryRunResponse_v0_RewrapVaultKeyMaterial: Components.Schemas.CoreIntentDryRunResponseV0RewrapVaultKeyMaterial
    Core_IntentDryRunResponse_v0_SetSystemProperty: Components.Schemas.CoreIntentDryRunResponseV0SetSystemProperty
    Core_IntentDryRunResponse_v0_SignManifest: Components.Schemas.CoreIntentDryRunResponseV0SignManifest
    Core_IntentDryRunResponse_v0_UnlockAccount: Components.Schemas.CoreIntentDryRunResponseV0UnlockAccount
    Core_IntentDryRunResponse_v0_UnlockDomain: Components.Schemas.CoreIntentDryRunResponseV0UnlockDomain
    Core_IntentDryRunResponse_v0_UnlockEndpoint: Components.Schemas.CoreIntentDryRunResponseV0UnlockEndpoint
    Core_IntentDryRunResponse_v0_UnlockPolicy: Components.Schemas.CoreIntentDryRunResponseV0UnlockPolicy
    Core_IntentDryRunResponse_v0_UnlockTicker: Components.Schemas.CoreIntentDryRunResponseV0UnlockTicker
    Core_IntentDryRunResponse_v0_UnlockUser: Components.Schemas.CoreIntentDryRunResponseV0UnlockUser
    Core_IntentDryRunResponse_v0_UnlockVault: Components.Schemas.CoreIntentDryRunResponseV0UnlockVault
    Core_IntentDryRunResponse_v0_UpdateAccount: Components.Schemas.CoreIntentDryRunResponseV0UpdateAccount
    Core_IntentDryRunResponse_v0_UpdateDomain: Components.Schemas.CoreIntentDryRunResponseV0UpdateDomain
    Core_IntentDryRunResponse_v0_UpdateDomainPermissions: Components.Schemas.CoreIntentDryRunResponseV0UpdateDomainPermissions
    Core_IntentDryRunResponse_v0_UpdateEndpoint: Components.Schemas.CoreIntentDryRunResponseV0UpdateEndpoint
    Core_IntentDryRunResponse_v0_UpdateLedger: Components.Schemas.CoreIntentDryRunResponseV0UpdateLedger
    Core_IntentDryRunResponse_v0_UpdatePolicy: Components.Schemas.CoreIntentDryRunResponseV0UpdatePolicy
    Core_IntentDryRunResponse_v0_UpdateTicker: Components.Schemas.CoreIntentDryRunResponseV0UpdateTicker
    Core_IntentDryRunResponse_v0_UpdateUser: Components.Schemas.CoreIntentDryRunResponseV0UpdateUser
    Core_IntentDryRunResponse_v0_UpdateVault: Components.Schemas.CoreIntentDryRunResponseV0UpdateVault
    Core_IntentDryRunResponse_v0_ValidateTickers: Components.Schemas.CoreIntentDryRunResponseV0ValidateTickers
    Core_IntentEntity: Components.Schemas.CoreIntentEntity
    Core_IntentError: Components.Schemas.CoreIntentError
    Core_IntentExecuted: Components.Schemas.CoreIntentExecuted
    Core_IntentLockStatus: Components.Schemas.CoreIntentLockStatus
    Core_IntentMetadata: Components.Schemas.CoreIntentMetadata
    Core_IntentReference: Components.Schemas.CoreIntentReference
    Core_IntentResponse: Components.Schemas.CoreIntentResponse
    Core_IntentState: Components.Schemas.CoreIntentState
    Core_IntentStatus: Components.Schemas.CoreIntentStatus
    Core_IntentType: Components.Schemas.CoreIntentType
    Core_IntentUpdated: Components.Schemas.CoreIntentUpdated
    Core_KeyType: Components.Schemas.CoreKeyType
    Core_Ledger: Components.Schemas.CoreLedger
    Core_LedgerCreated: Components.Schemas.CoreLedgerCreated
    Core_LedgerParameters: Components.Schemas.CoreLedgerParameters
    Core_LedgerParameters_Algorand: Components.Schemas.CoreLedgerParametersAlgorand
    Core_LedgerParameters_Bitcoin: Components.Schemas.CoreLedgerParametersBitcoin
    Core_LedgerParameters_Cardano: Components.Schemas.CoreLedgerParametersCardano
    Core_LedgerParameters_Ethereum: Components.Schemas.CoreLedgerParametersEthereum
    Core_LedgerParameters_Hedera: Components.Schemas.CoreLedgerParametersHedera
    Core_LedgerParameters_Solana: Components.Schemas.CoreLedgerParametersSolana
    Core_LedgerParameters_Stellar: Components.Schemas.CoreLedgerParametersStellar
    Core_LedgerParameters_Substrate: Components.Schemas.CoreLedgerParametersSubstrate
    Core_LedgerParameters_Tezos: Components.Schemas.CoreLedgerParametersTezos
    Core_LedgerParameters_Tron: Components.Schemas.CoreLedgerParametersTron
    Core_LedgerParameters_XRPL: Components.Schemas.CoreLedgerParametersXRPL
    Core_LedgerTransactionData: Components.Schemas.CoreLedgerTransactionData
    Core_LedgerTransactionFailure: Components.Schemas.CoreLedgerTransactionFailure
    Core_LedgerTransactionStatus: Components.Schemas.CoreLedgerTransactionStatus
    Core_LedgerUpdated: Components.Schemas.CoreLedgerUpdated
    Core_LockStatus: Components.Schemas.CoreLockStatus
    Core_LoginId: Components.Schemas.CoreLoginId
    Core_MPTokenIssuanceMetadata: Components.Schemas.CoreMPTokenIssuanceMetadata
    Core_MPTokenIssuanceMetadata_HexEncodedMetadata: Components.Schemas.CoreMPTokenIssuanceMetadataHexEncodedMetadata
    Core_Manifest: Components.Schemas.CoreManifest
    Core_ManifestAdditionalDetails: Components.Schemas.CoreManifestAdditionalDetails
    Core_ManifestContent: Components.Schemas.CoreManifestContent
    Core_ManifestContentType: Components.Schemas.CoreManifestContentType
    "Core_ManifestContent_EIP-191": Components.Schemas.CoreManifestContentEIP191
    Core_ManifestContent_JWT: Components.Schemas.CoreManifestContentJWT
    Core_ManifestContent_JWT_Header: Components.Schemas.CoreManifestContentJWTHeader
    Core_ManifestContent_JWT_Payload: Components.Schemas.CoreManifestContentJWTPayload
    Core_ManifestContent_Unsafe: Components.Schemas.CoreManifestContentUnsafe
    Core_ManifestCreated: Components.Schemas.CoreManifestCreated
    Core_ManifestProcessingDetails: Components.Schemas.CoreManifestProcessingDetails
    Core_ManifestProcessingDetails_Completed: Components.Schemas.CoreManifestProcessingDetailsCompleted
    Core_ManifestProcessingDetails_Failed: Components.Schemas.CoreManifestProcessingDetailsFailed
    Core_ManifestProcessingDetails_Pending: Components.Schemas.CoreManifestProcessingDetailsPending
    Core_ManifestProcessingDetails_Preparing: Components.Schemas.CoreManifestProcessingDetailsPreparing
    Core_ManifestProcessingStatus: Components.Schemas.CoreManifestProcessingStatus
    Core_ManifestUpdated: Components.Schemas.CoreManifestUpdated
    Core_ManifestValue: Components.Schemas.CoreManifestValue
    "Core_ManifestValue_EIP-191": Components.Schemas.CoreManifestValueEIP191
    Core_ManifestValue_JWT: Components.Schemas.CoreManifestValueJWT
    Core_ManifestValue_Unsafe: Components.Schemas.CoreManifestValueUnsafe
    Core_ManifestsCollection: Components.Schemas.CoreManifestsCollection
    Core_MeDomainReference: Components.Schemas.CoreMeDomainReference
    Core_MeReference: Components.Schemas.CoreMeReference
    Core_MeUserReference: Components.Schemas.CoreMeUserReference
    Core_MultiPurposeToken: Components.Schemas.CoreMultiPurposeToken
    Core_Network: Components.Schemas.CoreNetwork
    Core_NonFungibleTokenDestination: Components.Schemas.CoreNonFungibleTokenDestination
    Core_NonFungibleTokenDestination_NftTokenId: Components.Schemas.CoreNonFungibleTokenDestinationNftTokenId
    Core_NonFungibleTokenDestination_Ticker: Components.Schemas.CoreNonFungibleTokenDestinationTicker
    Core_NotaryApiKeyValue: Components.Schemas.CoreNotaryApiKeyValue
    Core_NotaryCollectionsKeyValue: Components.Schemas.CoreNotaryCollectionsKeyValue
    Core_NotaryCommunicationKeyValue: Components.Schemas.CoreNotaryCommunicationKeyValue
    Core_OnLedgerData: Components.Schemas.CoreOnLedgerData
    Core_OnLedgerData_Bitcoin: Components.Schemas.CoreOnLedgerDataBitcoin
    Core_OnLedgerData_Ethereum: Components.Schemas.CoreOnLedgerDataEthereum
    Core_OnLedgerData_Xrpl: Components.Schemas.CoreOnLedgerDataXrpl
    Core_Permissions: Components.Schemas.CorePermissions
    Core_Policy: Components.Schemas.CorePolicy
    Core_PolicyCondition: Components.Schemas.CorePolicyCondition
    Core_PolicyCondition_And: Components.Schemas.CorePolicyConditionAnd
    Core_PolicyCondition_Expression: Components.Schemas.CorePolicyConditionExpression
    Core_PolicyCondition_Or: Components.Schemas.CorePolicyConditionOr
    Core_PolicyCreated: Components.Schemas.CorePolicyCreated
    Core_PolicyReference: Components.Schemas.CorePolicyReference
    Core_PolicyScope: Components.Schemas.CorePolicyScope
    Core_PolicyUpdated: Components.Schemas.CorePolicyUpdated
    Core_PreferredAddressForChange: Components.Schemas.CorePreferredAddressForChange
    Core_Propose: Components.Schemas.CorePropose
    Core_ProposeIntentBody: Components.Schemas.CoreProposeIntentBody
    Core_ProposeTransactionOrderParameters: Components.Schemas.CoreProposeTransactionOrderParameters
    Core_ProposeUserIntentPayload: Components.Schemas.CoreProposeUserIntentPayload
    Core_Propose_v0_CreateTransactionOrder: Components.Schemas.CoreProposeV0CreateTransactionOrder
    Core_QuarantineApplied: Components.Schemas.CoreQuarantineApplied
    Core_QuarantineSkipped: Components.Schemas.CoreQuarantineSkipped
    Core_QuarantineStatus: Components.Schemas.CoreQuarantineStatus
    Core_ReadAccess: Components.Schemas.CoreReadAccess
    Core_ReadWriteSystemPropertyKeyValue: Components.Schemas.CoreReadWriteSystemPropertyKeyValue
    Core_ReadWriteSystemPropertyKeyValue_StateReviewAuthorityProperty: Components.Schemas.CoreReadWriteSystemPropertyKeyValueStateReviewAuthorityProperty
    Core_RecipientTransferParty: Components.Schemas.CoreRecipientTransferParty
    Core_RecipientTransferParty_Account: Components.Schemas.CoreRecipientTransferPartyAccount
    Core_RecipientTransferParty_Address: Components.Schemas.CoreRecipientTransferPartyAddress
    Core_Reject: Components.Schemas.CoreReject
    Core_RejectIntentBody: Components.Schemas.CoreRejectIntentBody
    Core_RemainingDomainUsers: Components.Schemas.CoreRemainingDomainUsers
    Core_RequestState: Components.Schemas.CoreRequestState
    Core_RequestStateHistory: Components.Schemas.CoreRequestStateHistory
    Core_RequestStateStatus: Components.Schemas.CoreRequestStateStatus
    Core_ResolvedEndpoint: Components.Schemas.CoreResolvedEndpoint
    Core_ResultLedger: Components.Schemas.CoreResultLedger
    Core_RootDomainSetup: Components.Schemas.CoreRootDomainSetup
    Core_ScriptingEngine: Components.Schemas.CoreScriptingEngine
    Core_SenderTransferParty: Components.Schemas.CoreSenderTransferParty
    Core_SenderTransferParty_Account: Components.Schemas.CoreSenderTransferPartyAccount
    Core_SenderTransferParty_Address: Components.Schemas.CoreSenderTransferPartyAddress
    Core_SkipQuarantineScope: Components.Schemas.CoreSkipQuarantineScope
    Core_SolanaFeeStrategy: Components.Schemas.CoreSolanaFeeStrategy
    Core_SolanaFeeStrategy_Priority: Components.Schemas.CoreSolanaFeeStrategyPriority
    Core_SolanaMintAccount: Components.Schemas.CoreSolanaMintAccount
    Core_SolanaMintAccount_Destination: Components.Schemas.CoreSolanaMintAccountDestination
    Core_SolanaMintAccount_Ticker: Components.Schemas.CoreSolanaMintAccountTicker
    Core_SolanaOperation: Components.Schemas.CoreSolanaOperation
    Core_SolanaOperation_Burn: Components.Schemas.CoreSolanaOperationBurn
    Core_SolanaOperation_CreateNonceAccount: Components.Schemas.CoreSolanaOperationCreateNonceAccount
    Core_SolanaOperation_FundAtaAccount: Components.Schemas.CoreSolanaOperationFundAtaAccount
    Core_SolanaOperation_InitializeMint: Components.Schemas.CoreSolanaOperationInitializeMint
    Core_SolanaOperation_MintTo: Components.Schemas.CoreSolanaOperationMintTo
    Core_SolanaOperation_Transfer: Components.Schemas.CoreSolanaOperationTransfer
    Core_SolanaOperation_TransferToken: Components.Schemas.CoreSolanaOperationTransferToken
    Core_SolanaTickerProperties: Components.Schemas.CoreSolanaTickerProperties
    Core_SolanaTickerProperties_Native: Components.Schemas.CoreSolanaTickerPropertiesNative
    Core_SolanaTickerProperties_Token: Components.Schemas.CoreSolanaTickerPropertiesToken
    Core_SolanaTokenType: Components.Schemas.CoreSolanaTokenType
    Core_SolanaTransferOutput: Components.Schemas.CoreSolanaTransferOutput
    Core_SortOrder: Components.Schemas.CoreSortOrder
    Core_StateReviewAuthorityValue: Components.Schemas.CoreStateReviewAuthorityValue
    Core_StellarAsset: Components.Schemas.CoreStellarAsset
    Core_StellarFee: Components.Schemas.CoreStellarFee
    Core_StellarFeeStrategy: Components.Schemas.CoreStellarFeeStrategy
    Core_StellarFeeStrategy_Priority: Components.Schemas.CoreStellarFeeStrategyPriority
    Core_StellarFeeStrategy_SpecifiedRate: Components.Schemas.CoreStellarFeeStrategySpecifiedRate
    Core_StellarMemo: Components.Schemas.CoreStellarMemo
    Core_StellarMemo_Hash: Components.Schemas.CoreStellarMemoHash
    Core_StellarMemo_Id: Components.Schemas.CoreStellarMemoId
    Core_StellarMemo_Return: Components.Schemas.CoreStellarMemoReturn
    Core_StellarMemo_Text: Components.Schemas.CoreStellarMemoText
    Core_StellarOperation: Components.Schemas.CoreStellarOperation
    Core_StellarOperation_AccountMerge: Components.Schemas.CoreStellarOperationAccountMerge
    Core_StellarOperation_ChangeTrust: Components.Schemas.CoreStellarOperationChangeTrust
    Core_StellarOperation_CreateAccount: Components.Schemas.CoreStellarOperationCreateAccount
    Core_StellarOperation_Payment: Components.Schemas.CoreStellarOperationPayment
    Core_StellarOperation_SetOptions: Components.Schemas.CoreStellarOperationSetOptions
    Core_StellarOption: Components.Schemas.CoreStellarOption
    Core_StellarOption_OptionHomeDomain: Components.Schemas.CoreStellarOptionOptionHomeDomain
    Core_StellarOption_OptionSetFlag: Components.Schemas.CoreStellarOptionOptionSetFlag
    Core_StellarTickerProperties: Components.Schemas.CoreStellarTickerProperties
    Core_StellarTickerProperties_Native: Components.Schemas.CoreStellarTickerPropertiesNative
    Core_StellarTickerProperties_Token: Components.Schemas.CoreStellarTickerPropertiesToken
    Core_Stellar_OptionFlag: Components.Schemas.CoreStellarOptionFlag
    Core_StringsMap: Components.Schemas.CoreStringsMap
    Core_SubstrateBalancesMethod: Components.Schemas.CoreSubstrateBalancesMethod
    Core_SubstrateBalancesMethod_TransferKeepAlive: Components.Schemas.CoreSubstrateBalancesMethodTransferKeepAlive
    Core_SubstrateChainType: Components.Schemas.CoreSubstrateChainType
    Core_SubstrateFeeParameters: Components.Schemas.CoreSubstrateFeeParameters
    Core_SubstrateFeeParameters_TransactionPayment: Components.Schemas.CoreSubstrateFeeParametersTransactionPayment
    Core_SubstrateFeeStrategy: Components.Schemas.CoreSubstrateFeeStrategy
    Core_SubstrateFeeStrategy_Priority: Components.Schemas.CoreSubstrateFeeStrategyPriority
    Core_SubstrateMethodFeeParameters: Components.Schemas.CoreSubstrateMethodFeeParameters
    Core_SubstrateMethodFeeParameters_MethodWeight: Components.Schemas.CoreSubstrateMethodFeeParametersMethodWeight
    Core_SubstrateMethodInfo: Components.Schemas.CoreSubstrateMethodInfo
    Core_SubstratePallet: Components.Schemas.CoreSubstratePallet
    Core_SubstratePalletInfo: Components.Schemas.CoreSubstratePalletInfo
    Core_SubstratePallet_Balances: Components.Schemas.CoreSubstratePalletBalances
    Core_SubstratePallet_Staking: Components.Schemas.CoreSubstratePalletStaking
    Core_SubstrateRuntimeInfo: Components.Schemas.CoreSubstrateRuntimeInfo
    Core_SubstrateStakingMethod: Components.Schemas.CoreSubstrateStakingMethod
    Core_SubstrateStakingMethod_Bond: Components.Schemas.CoreSubstrateStakingMethodBond
    Core_SubstrateStakingMethod_BondExtra: Components.Schemas.CoreSubstrateStakingMethodBondExtra
    Core_SubstrateStakingMethod_Chill: Components.Schemas.CoreSubstrateStakingMethodChill
    Core_SubstrateStakingMethod_Nominate: Components.Schemas.CoreSubstrateStakingMethodNominate
    Core_SubstrateStakingMethod_Rebond: Components.Schemas.CoreSubstrateStakingMethodRebond
    Core_SubstrateStakingMethod_SetController: Components.Schemas.CoreSubstrateStakingMethodSetController
    Core_SubstrateStakingMethod_SetPayee: Components.Schemas.CoreSubstrateStakingMethodSetPayee
    Core_SubstrateStakingMethod_Unbond: Components.Schemas.CoreSubstrateStakingMethodUnbond
    Core_SubstrateStakingMethod_WithdrawUnbonded: Components.Schemas.CoreSubstrateStakingMethodWithdrawUnbonded
    Core_SubstrateStakingPayee: Components.Schemas.CoreSubstrateStakingPayee
    Core_SubstrateStakingPayee_Account: Components.Schemas.CoreSubstrateStakingPayeeAccount
    Core_SubstrateStakingPayee_Controller: Components.Schemas.CoreSubstrateStakingPayeeController
    Core_SubstrateStakingPayee_Staked: Components.Schemas.CoreSubstrateStakingPayeeStaked
    Core_SubstrateStakingPayee_Stash: Components.Schemas.CoreSubstrateStakingPayeeStash
    Core_SubstrateTickerProperties: Components.Schemas.CoreSubstrateTickerProperties
    Core_SubstrateTickerProperties_Native: Components.Schemas.CoreSubstrateTickerPropertiesNative
    Core_SystemProperty: Components.Schemas.CoreSystemProperty
    Core_SystemPropertyId: Components.Schemas.CoreSystemPropertyId
    Core_SystemPropertySet: Components.Schemas.CoreSystemPropertySet
    Core_SystemProperty_NotaryApiKeySystemProperty: Components.Schemas.CoreSystemPropertyNotaryApiKeySystemProperty
    Core_SystemProperty_NotaryCollectionsKeySystemProperty: Components.Schemas.CoreSystemPropertyNotaryCollectionsKeySystemProperty
    Core_SystemProperty_NotaryCommunicationKeySystemProperty: Components.Schemas.CoreSystemPropertyNotaryCommunicationKeySystemProperty
    Core_SystemProperty_StateReviewAuthoritySystemProperty: Components.Schemas.CoreSystemPropertyStateReviewAuthoritySystemProperty
    Core_TezosFeeStrategy: Components.Schemas.CoreTezosFeeStrategy
    Core_TezosFeeStrategy_Priority: Components.Schemas.CoreTezosFeeStrategyPriority
    Core_TezosOperation: Components.Schemas.CoreTezosOperation
    Core_TezosOperation_Delegation: Components.Schemas.CoreTezosOperationDelegation
    Core_TezosOperation_Reveal: Components.Schemas.CoreTezosOperationReveal
    Core_TezosOperation_Transaction: Components.Schemas.CoreTezosOperationTransaction
    Core_TezosOperation_Undelegation: Components.Schemas.CoreTezosOperationUndelegation
    Core_TezosTickerProperties: Components.Schemas.CoreTezosTickerProperties
    Core_TezosTickerProperties_Native: Components.Schemas.CoreTezosTickerPropertiesNative
    Core_TickerCreated: Components.Schemas.CoreTickerCreated
    Core_TickerKind: Components.Schemas.CoreTickerKind
    Core_TickerLedgerDetails: Components.Schemas.CoreTickerLedgerDetails
    Core_TickerLedgerDetails_Algorand: Components.Schemas.CoreTickerLedgerDetailsAlgorand
    Core_TickerLedgerDetails_Bitcoin: Components.Schemas.CoreTickerLedgerDetailsBitcoin
    Core_TickerLedgerDetails_Cardano: Components.Schemas.CoreTickerLedgerDetailsCardano
    Core_TickerLedgerDetails_Ethereum: Components.Schemas.CoreTickerLedgerDetailsEthereum
    Core_TickerLedgerDetails_Hedera: Components.Schemas.CoreTickerLedgerDetailsHedera
    Core_TickerLedgerDetails_Solana: Components.Schemas.CoreTickerLedgerDetailsSolana
    Core_TickerLedgerDetails_Stellar: Components.Schemas.CoreTickerLedgerDetailsStellar
    Core_TickerLedgerDetails_Substrate: Components.Schemas.CoreTickerLedgerDetailsSubstrate
    Core_TickerLedgerDetails_Tezos: Components.Schemas.CoreTickerLedgerDetailsTezos
    Core_TickerLedgerDetails_Tron: Components.Schemas.CoreTickerLedgerDetailsTron
    Core_TickerLedgerDetails_XRPL: Components.Schemas.CoreTickerLedgerDetailsXRPL
    Core_TickerToValidate: Components.Schemas.CoreTickerToValidate
    Core_TickerUpdated: Components.Schemas.CoreTickerUpdated
    Core_TickerValidationStatusFilter: Components.Schemas.CoreTickerValidationStatusFilter
    Core_TickersCollection: Components.Schemas.CoreTickersCollection
    Core_TokenDestination: Components.Schemas.CoreTokenDestination
    Core_TokenDestination_Ticker: Components.Schemas.CoreTokenDestinationTicker
    Core_TokenDestination_TokenId: Components.Schemas.CoreTokenDestinationTokenId
    Core_TokenFee: Components.Schemas.CoreTokenFee
    Core_TokenOutput: Components.Schemas.CoreTokenOutput
    Core_TokenOutput_HederaFungibleTokenOutput: Components.Schemas.CoreTokenOutputHederaFungibleTokenOutput
    Core_TokenOutput_HederaNonFungibleTokenOutput: Components.Schemas.CoreTokenOutputHederaNonFungibleTokenOutput
    Core_TransactionCancellationDetails: Components.Schemas.CoreTransactionCancellationDetails
    Core_TransactionCancellationDetails_OffLedger: Components.Schemas.CoreTransactionCancellationDetailsOffLedger
    Core_TransactionCancellationDetails_OnLedger: Components.Schemas.CoreTransactionCancellationDetailsOnLedger
    Core_TransactionCreated: Components.Schemas.CoreTransactionCreated
    Core_TransactionDestination: Components.Schemas.CoreTransactionDestination
    Core_TransactionDestination_Account: Components.Schemas.CoreTransactionDestinationAccount
    Core_TransactionDestination_Address: Components.Schemas.CoreTransactionDestinationAddress
    Core_TransactionDestination_Endpoint: Components.Schemas.CoreTransactionDestinationEndpoint
    Core_TransactionDetected: Components.Schemas.CoreTransactionDetected
    Core_TransactionDryRun: Components.Schemas.CoreTransactionDryRun
    Core_TransactionDryRunResult: Components.Schemas.CoreTransactionDryRunResult
    Core_TransactionDryRunResult_Failure: Components.Schemas.CoreTransactionDryRunResultFailure
    Core_TransactionDryRunResult_Success: Components.Schemas.CoreTransactionDryRunResultSuccess
    Core_TransactionEstimate: Components.Schemas.CoreTransactionEstimate
    Core_TransactionEstimate_Algorand: Components.Schemas.CoreTransactionEstimateAlgorand
    Core_TransactionEstimate_Bitcoin: Components.Schemas.CoreTransactionEstimateBitcoin
    Core_TransactionEstimate_Cardano: Components.Schemas.CoreTransactionEstimateCardano
    Core_TransactionEstimate_Ethereum: Components.Schemas.CoreTransactionEstimateEthereum
    Core_TransactionEstimate_Failure: Components.Schemas.CoreTransactionEstimateFailure
    Core_TransactionEstimate_Hedera: Components.Schemas.CoreTransactionEstimateHedera
    Core_TransactionEstimate_Solana: Components.Schemas.CoreTransactionEstimateSolana
    Core_TransactionEstimate_Stellar: Components.Schemas.CoreTransactionEstimateStellar
    Core_TransactionEstimate_Substrate: Components.Schemas.CoreTransactionEstimateSubstrate
    Core_TransactionEstimate_Tezos: Components.Schemas.CoreTransactionEstimateTezos
    Core_TransactionEstimate_Tron: Components.Schemas.CoreTransactionEstimateTron
    Core_TransactionEstimate_XRPL: Components.Schemas.CoreTransactionEstimateXRPL
    Core_TransactionOrder: Components.Schemas.CoreTransactionOrder
    Core_TransactionOrderParameterType: Components.Schemas.CoreTransactionOrderParameterType
    Core_TransactionOrderParameters: Components.Schemas.CoreTransactionOrderParameters
    Core_TransactionOrderParameters_Algorand: Components.Schemas.CoreTransactionOrderParametersAlgorand
    Core_TransactionOrderParameters_Bitcoin: Components.Schemas.CoreTransactionOrderParametersBitcoin
    Core_TransactionOrderParameters_BitcoinRedirect: Components.Schemas.CoreTransactionOrderParametersBitcoinRedirect
    Core_TransactionOrderParameters_Cardano: Components.Schemas.CoreTransactionOrderParametersCardano
    Core_TransactionOrderParameters_Ethereum: Components.Schemas.CoreTransactionOrderParametersEthereum
    Core_TransactionOrderParameters_Hedera: Components.Schemas.CoreTransactionOrderParametersHedera
    Core_TransactionOrderParameters_Solana: Components.Schemas.CoreTransactionOrderParametersSolana
    Core_TransactionOrderParameters_Stellar: Components.Schemas.CoreTransactionOrderParametersStellar
    Core_TransactionOrderParameters_Substrate: Components.Schemas.CoreTransactionOrderParametersSubstrate
    Core_TransactionOrderParameters_Tezos: Components.Schemas.CoreTransactionOrderParametersTezos
    Core_TransactionOrderParameters_Tron: Components.Schemas.CoreTransactionOrderParametersTron
    Core_TransactionOrderParameters_XRPL: Components.Schemas.CoreTransactionOrderParametersXRPL
    Core_TransactionOrderReference: Components.Schemas.CoreTransactionOrderReference
    Core_TransactionProcessingStatus: Components.Schemas.CoreTransactionProcessingStatus
    Core_TransactionRelatedAccountReference: Components.Schemas.CoreTransactionRelatedAccountReference
    Core_TransactionUpdated: Components.Schemas.CoreTransactionUpdated
    Core_TransactionsCollection: Components.Schemas.CoreTransactionsCollection
    Core_TransferDryRunEstimate: Components.Schemas.CoreTransferDryRunEstimate
    Core_TransferDryRunEstimate_Failure: Components.Schemas.CoreTransferDryRunEstimateFailure
    Core_TransferDryRunEstimate_Success: Components.Schemas.CoreTransferDryRunEstimateSuccess
    Core_TransferKind: Components.Schemas.CoreTransferKind
    Core_TransferMetadata: Components.Schemas.CoreTransferMetadata
    Core_TransferMetadata_Algorand: Components.Schemas.CoreTransferMetadataAlgorand
    Core_TransferMetadata_Bitcoin: Components.Schemas.CoreTransferMetadataBitcoin
    Core_TransferMetadata_Cardano: Components.Schemas.CoreTransferMetadataCardano
    Core_TransferMetadata_Ethereum: Components.Schemas.CoreTransferMetadataEthereum
    Core_TransferMetadata_Hedera: Components.Schemas.CoreTransferMetadataHedera
    Core_TransferMetadata_Solana: Components.Schemas.CoreTransferMetadataSolana
    Core_TransferMetadata_Stellar: Components.Schemas.CoreTransferMetadataStellar
    Core_TransferMetadata_Substrate: Components.Schemas.CoreTransferMetadataSubstrate
    Core_TransferMetadata_Tezos: Components.Schemas.CoreTransferMetadataTezos
    Core_TransferMetadata_Tron: Components.Schemas.CoreTransferMetadataTron
    Core_TransferMetadata_XRPL: Components.Schemas.CoreTransferMetadataXRPL
    Core_TransferUpdated: Components.Schemas.CoreTransferUpdated
    Core_TransfersCollection: Components.Schemas.CoreTransfersCollection
    Core_TronFeeStrategy: Components.Schemas.CoreTronFeeStrategy
    Core_TronFeeStrategy_Priority: Components.Schemas.CoreTronFeeStrategyPriority
    Core_TronOperation: Components.Schemas.CoreTronOperation
    Core_TronOperation_NativeTransfer: Components.Schemas.CoreTronOperationNativeTransfer
    Core_TronOperation_TRC20Transfer: Components.Schemas.CoreTronOperationTRC20Transfer
    Core_TronTickerProperties: Components.Schemas.CoreTronTickerProperties
    Core_TronTickerProperties_Native: Components.Schemas.CoreTronTickerPropertiesNative
    Core_TronTickerProperties_TRC20: Components.Schemas.CoreTronTickerPropertiesTRC20
    Core_TrustedDomain: Components.Schemas.CoreTrustedDomain
    Core_TrustedDomainsCollection: Components.Schemas.CoreTrustedDomainsCollection
    Core_TrustedEndpoint: Components.Schemas.CoreTrustedEndpoint
    Core_TrustedEndpointsCollection: Components.Schemas.CoreTrustedEndpointsCollection
    Core_TrustedIntent: Components.Schemas.CoreTrustedIntent
    Core_TrustedIntentsCollection: Components.Schemas.CoreTrustedIntentsCollection
    Core_TrustedLedger: Components.Schemas.CoreTrustedLedger
    Core_TrustedLedgersCollection: Components.Schemas.CoreTrustedLedgersCollection
    Core_TrustedPoliciesCollection: Components.Schemas.CoreTrustedPoliciesCollection
    Core_TrustedPolicy: Components.Schemas.CoreTrustedPolicy
    Core_TrustedPublicKey: Components.Schemas.CoreTrustedPublicKey
    Core_TrustedPublicKeyAdded: Components.Schemas.CoreTrustedPublicKeyAdded
    Core_TrustedPublicKeyPurpose: Components.Schemas.CoreTrustedPublicKeyPurpose
    Core_TrustedPublicKeyUpdated: Components.Schemas.CoreTrustedPublicKeyUpdated
    Core_TrustedSystemPropertiesCollection: Components.Schemas.CoreTrustedSystemPropertiesCollection
    Core_TrustedSystemProperty: Components.Schemas.CoreTrustedSystemProperty
    Core_TrustedTransactionOrder: Components.Schemas.CoreTrustedTransactionOrder
    Core_TrustedTransactionOrdersCollection: Components.Schemas.CoreTrustedTransactionOrdersCollection
    Core_TrustedTrustedPublicKey: Components.Schemas.CoreTrustedTrustedPublicKey
    Core_TrustedTrustedPublicKeysCollection: Components.Schemas.CoreTrustedTrustedPublicKeysCollection
    Core_TrustedUser: Components.Schemas.CoreTrustedUser
    Core_TrustedUsersCollection: Components.Schemas.CoreTrustedUsersCollection
    Core_UpsertComplianceConfigurationRequest: Components.Schemas.CoreUpsertComplianceConfigurationRequest
    Core_User: Components.Schemas.CoreUser
    Core_UserCreated: Components.Schemas.CoreUserCreated
    Core_UserIntentPayload: Components.Schemas.CoreUserIntentPayload
    Core_UserOperationRejectionCode: Components.Schemas.CoreUserOperationRejectionCode
    Core_UserReference: Components.Schemas.CoreUserReference
    Core_UserUpdated: Components.Schemas.CoreUserUpdated
    Core_V3AccountToMigrate: Components.Schemas.CoreV3AccountToMigrate
    Core_ValidatedTickerKind: Components.Schemas.CoreValidatedTickerKind
    Core_Vault: Components.Schemas.CoreVault
    Core_VaultAccountKeyInformation: Components.Schemas.CoreVaultAccountKeyInformation
    Core_VaultAccountKeyInformation_Random: Components.Schemas.CoreVaultAccountKeyInformationRandom
    Core_VaultAccountKeyInformation_VaultDerived: Components.Schemas.CoreVaultAccountKeyInformationVaultDerived
    Core_VaultAccountProviderInformation_Key: Components.Schemas.CoreVaultAccountProviderInformationKey
    Core_VaultAccountProviderInformation_KeyId: Components.Schemas.CoreVaultAccountProviderInformationKeyId
    Core_VaultAccountProviderInformation_Key_VaultDerived: Components.Schemas.CoreVaultAccountProviderInformationKeyVaultDerived
    Core_VaultAccountProviderInformation_Key_VaultDerivedNonExtended: Components.Schemas.CoreVaultAccountProviderInformationKeyVaultDerivedNonExtended
    Core_VaultAccountProviderInformation_Key_VaultRandom: Components.Schemas.CoreVaultAccountProviderInformationKeyVaultRandom
    Core_VaultAdditionalDetails: Components.Schemas.CoreVaultAdditionalDetails
    Core_VaultBackupParameters: Components.Schemas.CoreVaultBackupParameters
    Core_VaultBackupParameters_VaultHsm: Components.Schemas.CoreVaultBackupParametersVaultHsm
    Core_VaultBackupParameters_VaultMpc: Components.Schemas.CoreVaultBackupParametersVaultMpc
    Core_VaultCreated: Components.Schemas.CoreVaultCreated
    Core_VaultDerivation: Components.Schemas.CoreVaultDerivation
    Core_VaultHsmBackupData: Components.Schemas.CoreVaultHsmBackupData
    Core_VaultKeyMaterialRewrapCompleted: Components.Schemas.CoreVaultKeyMaterialRewrapCompleted
    Core_VaultKeyMaterialRewrapFailed: Components.Schemas.CoreVaultKeyMaterialRewrapFailed
    Core_VaultKeyStrategy: Components.Schemas.CoreVaultKeyStrategy
    Core_VaultMpcBackupData: Components.Schemas.CoreVaultMpcBackupData
    Core_VaultParameters: Components.Schemas.CoreVaultParameters
    Core_VaultParameters_HSM: Components.Schemas.CoreVaultParametersHSM
    Core_VaultParameters_MPC: Components.Schemas.CoreVaultParametersMPC
    Core_VaultProcessingDetails: Components.Schemas.CoreVaultProcessingDetails
    Core_VaultProcessingDetails_Completed: Components.Schemas.CoreVaultProcessingDetailsCompleted
    Core_VaultProcessingDetails_Pending: Components.Schemas.CoreVaultProcessingDetailsPending
    Core_VaultProcessingDetails_Preparing: Components.Schemas.CoreVaultProcessingDetailsPreparing
    Core_VaultProcessingStatus: Components.Schemas.CoreVaultProcessingStatus
    Core_VaultUpdated: Components.Schemas.CoreVaultUpdated
    Core_VaultsCollection: Components.Schemas.CoreVaultsCollection
    Core_WorkflowCondition: Components.Schemas.CoreWorkflowCondition
    Core_WorkflowCondition_And: Components.Schemas.CoreWorkflowConditionAnd
    Core_WorkflowCondition_Or: Components.Schemas.CoreWorkflowConditionOr
    Core_WorkflowCondition_RoleQuorum: Components.Schemas.CoreWorkflowConditionRoleQuorum
    Core_WorkflowProgress: Components.Schemas.CoreWorkflowProgress
    Core_WorkflowStep: Components.Schemas.CoreWorkflowStep
    Core_WorkflowStepStatus: Components.Schemas.CoreWorkflowStepStatus
    Core_XrplClawbackCurrency: Components.Schemas.CoreXrplClawbackCurrency
    Core_XrplClawbackCurrency_Currency: Components.Schemas.CoreXrplClawbackCurrencyCurrency
    Core_XrplClawbackCurrency_MultiPurposeToken: Components.Schemas.CoreXrplClawbackCurrencyMultiPurposeToken
    Core_XrplClawbackCurrency_TickerId: Components.Schemas.CoreXrplClawbackCurrencyTickerId
    Core_XrplFee: Components.Schemas.CoreXrplFee
    Core_XrplFeeStrategy: Components.Schemas.CoreXrplFeeStrategy
    Core_XrplFeeStrategy_Priority: Components.Schemas.CoreXrplFeeStrategyPriority
    Core_XrplFeeStrategy_SpecifiedAdditionalFee: Components.Schemas.CoreXrplFeeStrategySpecifiedAdditionalFee
    Core_XrplIouCurrency: Components.Schemas.CoreXrplIouCurrency
    Core_XrplIouCurrency_Currency: Components.Schemas.CoreXrplIouCurrencyCurrency
    Core_XrplIouCurrency_TickerId: Components.Schemas.CoreXrplIouCurrencyTickerId
    Core_XrplMemo: Components.Schemas.CoreXrplMemo
    Core_XrplOnLedgerTokenData: Components.Schemas.CoreXrplOnLedgerTokenData
    Core_XrplOperation: Components.Schemas.CoreXrplOperation
    Core_XrplOperation_AccountSet: Components.Schemas.CoreXrplOperationAccountSet
    Core_XrplOperation_Clawback: Components.Schemas.CoreXrplOperationClawback
    Core_XrplOperation_DepositPreauth: Components.Schemas.CoreXrplOperationDepositPreauth
    Core_XrplOperation_EscrowFinish: Components.Schemas.CoreXrplOperationEscrowFinish
    Core_XrplOperation_MPTokenAuthorize: Components.Schemas.CoreXrplOperationMPTokenAuthorize
    Core_XrplOperation_MPTokenIssuanceCreate: Components.Schemas.CoreXrplOperationMPTokenIssuanceCreate
    Core_XrplOperation_MPTokenIssuanceDestroy: Components.Schemas.CoreXrplOperationMPTokenIssuanceDestroy
    Core_XrplOperation_MPTokenIssuanceSet: Components.Schemas.CoreXrplOperationMPTokenIssuanceSet
    Core_XrplOperation_OfferCreate: Components.Schemas.CoreXrplOperationOfferCreate
    Core_XrplOperation_Payment: Components.Schemas.CoreXrplOperationPayment
    Core_XrplOperation_TrustSet: Components.Schemas.CoreXrplOperationTrustSet
    Core_XrplPaymentCurrency: Components.Schemas.CoreXrplPaymentCurrency
    Core_XrplPaymentCurrency_Currency: Components.Schemas.CoreXrplPaymentCurrencyCurrency
    Core_XrplPaymentCurrency_MultiPurposeToken: Components.Schemas.CoreXrplPaymentCurrencyMultiPurposeToken
    Core_XrplPaymentCurrency_TickerId: Components.Schemas.CoreXrplPaymentCurrencyTickerId
    Core_XrplTickerProperties: Components.Schemas.CoreXrplTickerProperties
    Core_XrplTickerProperties_FungibleToken: Components.Schemas.CoreXrplTickerPropertiesFungibleToken
    Core_XrplTickerProperties_MultiPurposeToken: Components.Schemas.CoreXrplTickerPropertiesMultiPurposeToken
    Core_XrplTickerProperties_Native: Components.Schemas.CoreXrplTickerPropertiesNative
    Core_Xrpl_AccountSetFlag: Components.Schemas.CoreXrplAccountSetFlag
    Core_Xrpl_AssetQuantity: Components.Schemas.CoreXrplAssetQuantity
    Core_Xrpl_LimitAmount: Components.Schemas.CoreXrplLimitAmount
    Core_Xrpl_MPTokenAuthorizeFlag: Components.Schemas.CoreXrplMPTokenAuthorizeFlag
    Core_Xrpl_MPTokenIdentifier: Components.Schemas.CoreXrplMPTokenIdentifier
    Core_Xrpl_MPTokenIdentifier_MPTokenIssuanceId: Components.Schemas.CoreXrplMPTokenIdentifierMPTokenIssuanceId
    Core_Xrpl_MPTokenIdentifier_TickerId: Components.Schemas.CoreXrplMPTokenIdentifierTickerId
    Core_Xrpl_MPTokenIssuanceCreateFlag: Components.Schemas.CoreXrplMPTokenIssuanceCreateFlag
    Core_Xrpl_MPTokenIssuanceSetFlag: Components.Schemas.CoreXrplMPTokenIssuanceSetFlag
    Core_Xrpl_OfferCreateFlag: Components.Schemas.CoreXrplOfferCreateFlag
    Core_Xrpl_TrustSetFlag: Components.Schemas.CoreXrplTrustSetFlag
    Core_v0_AcknowledgeBackup: Components.Schemas.CoreV0AcknowledgeBackup
    Core_v0_AddAccountLedgers: Components.Schemas.CoreV0AddAccountLedgers
    Core_v0_AddTrustedPublicKeysForMigration: Components.Schemas.CoreV0AddTrustedPublicKeysForMigration
    Core_v0_AttemptTransactionOrderCancellation: Components.Schemas.CoreV0AttemptTransactionOrderCancellation
    Core_v0_CreateAccount: Components.Schemas.CoreV0CreateAccount
    Core_v0_CreateAccountProviderDetailsPayload: Components.Schemas.CoreV0CreateAccountProviderDetailsPayload
    Core_v0_CreateAccountProviderDetailsPayload_Vault: Components.Schemas.CoreV0CreateAccountProviderDetailsPayloadVault
    Core_v0_CreateBackup: Components.Schemas.CoreV0CreateBackup
    Core_v0_CreateDomain: Components.Schemas.CoreV0CreateDomain
    Core_v0_CreateEndpoint: Components.Schemas.CoreV0CreateEndpoint
    Core_v0_CreateLedger: Components.Schemas.CoreV0CreateLedger
    Core_v0_CreatePolicy: Components.Schemas.CoreV0CreatePolicy
    Core_v0_CreateTicker: Components.Schemas.CoreV0CreateTicker
    Core_v0_CreateTransactionOrder: Components.Schemas.CoreV0CreateTransactionOrder
    Core_v0_CreateTransferOrder: Components.Schemas.CoreV0CreateTransferOrder
    Core_v0_CreateUser: Components.Schemas.CoreV0CreateUser
    Core_v0_CreateVault: Components.Schemas.CoreV0CreateVault
    Core_v0_ExecuteExtension: Components.Schemas.CoreV0ExecuteExtension
    Core_v0_LockAccount: Components.Schemas.CoreV0LockAccount
    Core_v0_LockDomain: Components.Schemas.CoreV0LockDomain
    Core_v0_LockEndpoint: Components.Schemas.CoreV0LockEndpoint
    Core_v0_LockPolicy: Components.Schemas.CoreV0LockPolicy
    Core_v0_LockTicker: Components.Schemas.CoreV0LockTicker
    Core_v0_LockUser: Components.Schemas.CoreV0LockUser
    Core_v0_LockVault: Components.Schemas.CoreV0LockVault
    Core_v0_MigrateSilo3AccountBatch: Components.Schemas.CoreV0MigrateSilo3AccountBatch
    Core_v0_NotarizeData: Components.Schemas.CoreV0NotarizeData
    Core_v0_ReleaseQuarantinedTransfers: Components.Schemas.CoreV0ReleaseQuarantinedTransfers
    Core_v0_RewrapVaultKeyMaterial: Components.Schemas.CoreV0RewrapVaultKeyMaterial
    Core_v0_SetSystemProperty: Components.Schemas.CoreV0SetSystemProperty
    Core_v0_SignManifest: Components.Schemas.CoreV0SignManifest
    Core_v0_UnlockAccount: Components.Schemas.CoreV0UnlockAccount
    Core_v0_UnlockDomain: Components.Schemas.CoreV0UnlockDomain
    Core_v0_UnlockEndpoint: Components.Schemas.CoreV0UnlockEndpoint
    Core_v0_UnlockPolicy: Components.Schemas.CoreV0UnlockPolicy
    Core_v0_UnlockTicker: Components.Schemas.CoreV0UnlockTicker
    Core_v0_UnlockUser: Components.Schemas.CoreV0UnlockUser
    Core_v0_UnlockVault: Components.Schemas.CoreV0UnlockVault
    Core_v0_UpdateAccount: Components.Schemas.CoreV0UpdateAccount
    Core_v0_UpdateDomain: Components.Schemas.CoreV0UpdateDomain
    Core_v0_UpdateDomainPermissions: Components.Schemas.CoreV0UpdateDomainPermissions
    Core_v0_UpdateEndpoint: Components.Schemas.CoreV0UpdateEndpoint
    Core_v0_UpdateLedger: Components.Schemas.CoreV0UpdateLedger
    Core_v0_UpdatePolicy: Components.Schemas.CoreV0UpdatePolicy
    Core_v0_UpdateTicker: Components.Schemas.CoreV0UpdateTicker
    Core_v0_UpdateUser: Components.Schemas.CoreV0UpdateUser
    Core_v0_UpdateVault: Components.Schemas.CoreV0UpdateVault
    Core_v0_ValidateTickers: Components.Schemas.CoreV0ValidateTickers
    CoreExtensions_ErrorMessage: Components.Schemas.CoreExtensionsErrorMessage
    CoreExtensions_ErrorMessages: Components.Schemas.CoreExtensionsErrorMessages
    CoreExtensions_IntentLockStatus: Components.Schemas.CoreExtensionsIntentLockStatus
    CoreExtensions_InvitationAnswerIn: Components.Schemas.CoreExtensionsInvitationAnswerIn
    CoreExtensions_InvitationIn: Components.Schemas.CoreExtensionsInvitationIn
    CoreExtensions_InvitationOut: Components.Schemas.CoreExtensionsInvitationOut
    CoreExtensions_InvitationPaginationResult: Components.Schemas.CoreExtensionsInvitationPaginationResult
    CoreExtensions_InvitationStatus: Components.Schemas.CoreExtensionsInvitationStatus
    CoreExtensions_InvitationStatusQuery: Components.Schemas.CoreExtensionsInvitationStatusQuery
    CoreExtensions_Metadata: Components.Schemas.CoreExtensionsMetadata
    CoreExtensions_PublicInvitationOut: Components.Schemas.CoreExtensionsPublicInvitationOut
    CoreExtensions_PublicUserInvitationOut: Components.Schemas.CoreExtensionsPublicUserInvitationOut
    CoreExtensions_SortBy: Components.Schemas.CoreExtensionsSortBy
    CoreExtensions_SortOrder: Components.Schemas.CoreExtensionsSortOrder
    CoreExtensions_UserEditIn: Components.Schemas.CoreExtensionsUserEditIn
    CoreExtensions_UserEditOut: Components.Schemas.CoreExtensionsUserEditOut
    CoreExtensions_UserReference: Components.Schemas.CoreExtensionsUserReference
    VirtualAccounting_Actor: Components.Schemas.VirtualAccountingActor
    VirtualAccounting_ActorAddress: Components.Schemas.VirtualAccountingActorAddress
    VirtualAccounting_ActorType: Components.Schemas.VirtualAccountingActorType
    VirtualAccounting_ActorVirtualAccount: Components.Schemas.VirtualAccountingActorVirtualAccount
    VirtualAccounting_Balance: Components.Schemas.VirtualAccountingBalance
    VirtualAccounting_BalanceCollectionResponse: Components.Schemas.VirtualAccountingBalanceCollectionResponse
    VirtualAccounting_CustodyAccountDepositIdentificationSourceIn: Components.Schemas.VirtualAccountingCustodyAccountDepositIdentificationSourceIn
    VirtualAccounting_CustodyAccountExclusionList: Components.Schemas.VirtualAccountingCustodyAccountExclusionList
    VirtualAccounting_CustodyOperation: Components.Schemas.VirtualAccountingCustodyOperation
    VirtualAccounting_DepositIdentificationSourceBase: Components.Schemas.VirtualAccountingDepositIdentificationSourceBase
    VirtualAccounting_DepositIdentificationSourceBaseIn: Components.Schemas.VirtualAccountingDepositIdentificationSourceBaseIn
    VirtualAccounting_DepositIdentificationSourceCustodyAccount: Components.Schemas.VirtualAccountingDepositIdentificationSourceCustodyAccount
    VirtualAccounting_DepositIdentificationSourceStatus: Components.Schemas.VirtualAccountingDepositIdentificationSourceStatus
    VirtualAccounting_DepositIdentificationSourceType: Components.Schemas.VirtualAccountingDepositIdentificationSourceType
    VirtualAccounting_DepositIdentificationStrategy: Components.Schemas.VirtualAccountingDepositIdentificationStrategy
    VirtualAccounting_DepositIdentificationStrategyBase: Components.Schemas.VirtualAccountingDepositIdentificationStrategyBase
    VirtualAccounting_ExclusionList: Components.Schemas.VirtualAccountingExclusionList
    VirtualAccounting_ExclusionType: Components.Schemas.VirtualAccountingExclusionType
    VirtualAccounting_LedgerAddress: Components.Schemas.VirtualAccountingLedgerAddress
    VirtualAccounting_LedgerAddressPagedCollectionResponse: Components.Schemas.VirtualAccountingLedgerAddressPagedCollectionResponse
    VirtualAccounting_MaximizeSegregationDepositStrategy: Components.Schemas.VirtualAccountingMaximizeSegregationDepositStrategy
    VirtualAccounting_NewProvisioningStrategy: Components.Schemas.VirtualAccountingNewProvisioningStrategy
    VirtualAccounting_OperationIn: Components.Schemas.VirtualAccountingOperationIn
    VirtualAccounting_OperationOut: Components.Schemas.VirtualAccountingOperationOut
    VirtualAccounting_OperationOutPagedCollectionResponse: Components.Schemas.VirtualAccountingOperationOutPagedCollectionResponse
    VirtualAccounting_OperationPayload: Components.Schemas.VirtualAccountingOperationPayload
    VirtualAccounting_OperationSortBy: Components.Schemas.VirtualAccountingOperationSortBy
    VirtualAccounting_OperationStatus: Components.Schemas.VirtualAccountingOperationStatus
    VirtualAccounting_OperationTransfer: Components.Schemas.VirtualAccountingOperationTransfer
    VirtualAccounting_OperationType: Components.Schemas.VirtualAccountingOperationType
    VirtualAccounting_ProvisioningStrategyBase: Components.Schemas.VirtualAccountingProvisioningStrategyBase
    VirtualAccounting_ProvisioningStrategyType: Components.Schemas.VirtualAccountingProvisioningStrategyType
    VirtualAccounting_SortOrder: Components.Schemas.VirtualAccountingSortOrder
    VirtualAccounting_Transfer: Components.Schemas.VirtualAccountingTransfer
    VirtualAccounting_TransferBase: Components.Schemas.VirtualAccountingTransferBase
    VirtualAccounting_TransferBasePagedCollectionResponse: Components.Schemas.VirtualAccountingTransferBasePagedCollectionResponse
    VirtualAccounting_TransferKind: Components.Schemas.VirtualAccountingTransferKind
    VirtualAccounting_TransferSortBy: Components.Schemas.VirtualAccountingTransferSortBy
    VirtualAccounting_TransferStatus: Components.Schemas.VirtualAccountingTransferStatus
    VirtualAccounting_VaMetadata: Components.Schemas.VirtualAccountingVaMetadata
    VirtualAccounting_VirtualAccountIn: Components.Schemas.VirtualAccountingVirtualAccountIn
    VirtualAccounting_VirtualAccountOut: Components.Schemas.VirtualAccountingVirtualAccountOut
    VirtualAccounting_VirtualAccountOutPagedCollectionResponse: Components.Schemas.VirtualAccountingVirtualAccountOutPagedCollectionResponse
    VirtualAccounting_VirtualAccountSortBy: Components.Schemas.VirtualAccountingVirtualAccountSortBy
    VirtualAccounting_VirtualAccountUpdate: Components.Schemas.VirtualAccountingVirtualAccountUpdate
    VirtualAccounting_VirtualLedgerIn: Components.Schemas.VirtualAccountingVirtualLedgerIn
    VirtualAccounting_VirtualLedgerOut: Components.Schemas.VirtualAccountingVirtualLedgerOut
    VirtualAccounting_VirtualLedgerOutPagedCollectionResponse: Components.Schemas.VirtualAccountingVirtualLedgerOutPagedCollectionResponse
    VirtualAccounting_VirtualLedgerSortBy: Components.Schemas.VirtualAccountingVirtualLedgerSortBy
    VirtualAccounting_VirtualLedgerUpdate: Components.Schemas.VirtualAccountingVirtualLedgerUpdate
    Compliance_ErrorResponse: Components.Schemas.ComplianceErrorResponse
    Compliance_ProviderConnectRequest: Components.Schemas.ComplianceProviderConnectRequest
    Compliance_ProviderConnectionResponse: Components.Schemas.ComplianceProviderConnectionResponse
    Compliance_ProviderConnectionsResponse: Components.Schemas.ComplianceProviderConnectionsResponse
    Compliance_ConfigurationDetailResponse: Components.Schemas.ComplianceConfigurationDetailResponse
    Compliance_ConfigurationStepResponse: Components.Schemas.ComplianceConfigurationStepResponse
    Compliance_GetScreeningRulesResponse: Components.Schemas.ComplianceGetScreeningRulesResponse
    Compliance_ConfigureScreeningRulesRequest: Components.Schemas.ComplianceConfigureScreeningRulesRequest
    Compliance_RiskLevelAction_Elliptic: Components.Schemas.ComplianceRiskLevelActionElliptic
    Compliance_RiskLevelAction_Chainalysis: Components.Schemas.ComplianceRiskLevelActionChainalysis
    Compliance_TransactionScreeningRule_Elliptic: Components.Schemas.ComplianceTransactionScreeningRuleElliptic
    Compliance_TransactionScreeningRule_Chainalysis: Components.Schemas.ComplianceTransactionScreeningRuleChainalysis
    Compliance_PolicyPayloadRequest: Components.Schemas.CompliancePolicyPayloadRequest
    Compliance_PolicyResponse: Components.Schemas.CompliancePolicyResponse
    Compliance_ExceptionRoleResponse: Components.Schemas.ComplianceExceptionRoleResponse
    Compliance_DomainPayloadRequest: Components.Schemas.ComplianceDomainPayloadRequest
    Compliance_User: Components.Schemas.ComplianceUser
    Compliance_LoginId: Components.Schemas.ComplianceLoginId
    Compliance_ValidateComplianceDomainCreationRequest: Components.Schemas.ComplianceValidateComplianceDomainCreationRequest
    Compliance_ValidateComplianceDomainCreationResponse: Components.Schemas.ComplianceValidateComplianceDomainCreationResponse
    Compliance_ComplianceAnalysisRequest: Components.Schemas.ComplianceComplianceAnalysisRequest
    Compliance_ComplianceAnalysisRequestData: Components.Schemas.ComplianceComplianceAnalysisRequestData
    Compliance_ComplianceAnalysis: Components.Schemas.ComplianceComplianceAnalysis
    Compliance_ComplianceAnalysisResponse: Components.Schemas.ComplianceComplianceAnalysisResponse
    Compliance_WalletAnalysisRequest: Components.Schemas.ComplianceWalletAnalysisRequest
    Compliance_WalletAnalysisResponse: Components.Schemas.ComplianceWalletAnalysisResponse
    Compliance_ScreeningDetail_Elliptic: Components.Schemas.ComplianceScreeningDetailElliptic
    Compliance_ScreeningDetail_Chainalysis: Components.Schemas.ComplianceScreeningDetailChainalysis
    Compliance_ChainalysisAlert: Components.Schemas.ComplianceChainalysisAlert
    Compliance_CreateTransferRequest: Components.Schemas.ComplianceCreateTransferRequest
    Compliance_TransferPartyIdentifier: Components.Schemas.ComplianceTransferPartyIdentifier
    Compliance_InitiateTravelRuleResponse: Components.Schemas.ComplianceInitiateTravelRuleResponse
    Compliance_CreateTransfer201Response: Components.Schemas.ComplianceCreateTransfer201Response
    Compliance_GetTravelRuleTransferResponse: Components.Schemas.ComplianceGetTravelRuleTransferResponse
    Compliance_Transfer: Components.Schemas.ComplianceTransfer
    Compliance_TransferParty: Components.Schemas.ComplianceTransferParty
    Compliance_Agent: Components.Schemas.ComplianceAgent
    Compliance_AppendPIIRequest: Components.Schemas.ComplianceAppendPIIRequest
    Compliance_AppendPIITravelRuleResponse: Components.Schemas.ComplianceAppendPIITravelRuleResponse
    Compliance_AppendPIIResponse: Components.Schemas.ComplianceAppendPIIResponse
    Compliance_PresentPIIRequest: Components.Schemas.CompliancePresentPIIRequest
    Compliance_PresentPIITravelRuleResponse: Components.Schemas.CompliancePresentPIITravelRuleResponse
    Compliance_PresentPIIResponse: Components.Schemas.CompliancePresentPIIResponse
    Compliance_IVMS101: Components.Schemas.ComplianceIVMS101
    Compliance_IVMS101Originator: Components.Schemas.ComplianceIVMS101Originator
    Compliance_IVMS101Beneficiary: Components.Schemas.ComplianceIVMS101Beneficiary
    Compliance_IVMS101Person: Components.Schemas.ComplianceIVMS101Person
    Compliance_IVMS101NaturalPerson: Components.Schemas.ComplianceIVMS101NaturalPerson
    Compliance_IVMS101LegalPerson: Components.Schemas.ComplianceIVMS101LegalPerson
    Compliance_IVMS101Name: Components.Schemas.ComplianceIVMS101Name
    Compliance_IVMS101NameIdentifier: Components.Schemas.ComplianceIVMS101NameIdentifier
    Compliance_IVMS101LegalPersonName: Components.Schemas.ComplianceIVMS101LegalPersonName
    Compliance_IVMS101LegalPersonNameIdentifier: Components.Schemas.ComplianceIVMS101LegalPersonNameIdentifier
    Compliance_IVMS101DateAndPlaceOfBirth: Components.Schemas.ComplianceIVMS101DateAndPlaceOfBirth
    Compliance_IVMS101GeographicAddress: Components.Schemas.ComplianceIVMS101GeographicAddress
    Compliance_IVMS101NationalIdentification: Components.Schemas.ComplianceIVMS101NationalIdentification
    Compliance_TravelRuleDetailsRequest: Components.Schemas.ComplianceTravelRuleDetailsRequest
    Compliance_TravelRuleDetailsRequestData: Components.Schemas.ComplianceTravelRuleDetailsRequestData
    Compliance_TravelRuleDetailsResponse: Components.Schemas.ComplianceTravelRuleDetailsResponse
    Compliance_TravelRuleDetail: Components.Schemas.ComplianceTravelRuleDetail
    Compliance_CreateRelationshipRequest: Components.Schemas.ComplianceCreateRelationshipRequest
    Compliance_RelationshipList: Components.Schemas.ComplianceRelationshipList
    Compliance_RelationshipWithProofs: Components.Schemas.ComplianceRelationshipWithProofs
    Compliance_OwnershipProof: Components.Schemas.ComplianceOwnershipProof
    EDS_ChannelCreate: Components.Schemas.EDSChannelCreate
    EDS_WebhookChannelCreate: Components.Schemas.EDSWebhookChannelCreate
    EDS_Channel: Components.Schemas.EDSChannel
    EDS_ChannelUpdate: Components.Schemas.EDSChannelUpdate
    EDS_Event: Components.Schemas.EDSEvent
    GasStation_AlertLimitDto: Components.Schemas.GasStationAlertLimitDto
    GasStation_BalanceStatusDto: Components.Schemas.GasStationBalanceStatusDto
    GasStation_SponsorResponseDto: Components.Schemas.GasStationSponsorResponseDto
    GasStation_CreateSponsorDto: Components.Schemas.GasStationCreateSponsorDto
    GasStation_SponsorCreatedResponseDto: Components.Schemas.GasStationSponsorCreatedResponseDto
    GasStation_UpdateSponsorDto: Components.Schemas.GasStationUpdateSponsorDto
    GasStation_SponsorsListResponseDto: Components.Schemas.GasStationSponsorsListResponseDto
    GasStation_AccountSponsorResponseDto: Components.Schemas.GasStationAccountSponsorResponseDto
    GasStation_DomainSponsorResponseDto: Components.Schemas.GasStationDomainSponsorResponseDto
    GasStation_SponsoredEntityDto: Components.Schemas.GasStationSponsoredEntityDto
    GasStation_SponsoredEntitiesResponseDto: Components.Schemas.GasStationSponsoredEntitiesResponseDto
    GasStation_LedgerDto: Components.Schemas.GasStationLedgerDto
    GasStation_SponsorshipDetailsDto: Components.Schemas.GasStationSponsorshipDetailsDto
    GasStation_SponsorableDomainDto: Components.Schemas.GasStationSponsorableDomainDto
    GasStation_SponsorableDomainsResponseDto: Components.Schemas.GasStationSponsorableDomainsResponseDto
    GasStation_DomainIdentifierDto: Components.Schemas.GasStationDomainIdentifierDto
    GasStation_AddSponsoredDomainsDto: Components.Schemas.GasStationAddSponsoredDomainsDto
    GasStation_ConflictEntityDto: Components.Schemas.GasStationConflictEntityDto
    GasStation_SponsoredModificationResponseDto: Components.Schemas.GasStationSponsoredModificationResponseDto
    GasStation_LineageDto: Components.Schemas.GasStationLineageDto
    GasStation_SponsorableAccountDto: Components.Schemas.GasStationSponsorableAccountDto
    GasStation_SponsorableAccountsResponseDto: Components.Schemas.GasStationSponsorableAccountsResponseDto
    GasStation_AccountIdentifierDto: Components.Schemas.GasStationAccountIdentifierDto
    GasStation_AddSponsoredAccountsDto: Components.Schemas.GasStationAddSponsoredAccountsDto
    GasStation_AuditEventDto: Components.Schemas.GasStationAuditEventDto
    GasStation_EventsResponseDto: Components.Schemas.GasStationEventsResponseDto
    GasStation_ValidSponsorItemDto: Components.Schemas.GasStationValidSponsorItemDto
    GasStation_ValidSponsorsResponseDto: Components.Schemas.GasStationValidSponsorsResponseDto
    Core_AccountProvider: Components.Schemas.CoreAccountProvider
    Core_AccountProviderAction: Components.Schemas.CoreAccountProviderAction
    Core_AccountProviderAction_External: Components.Schemas.CoreAccountProviderActionExternal
    Core_AccountProviderAdditionalDetails: Components.Schemas.CoreAccountProviderAdditionalDetails
    Core_AccountProviderCreated: Components.Schemas.CoreAccountProviderCreated
    Core_AccountProviderInformation_External: Components.Schemas.CoreAccountProviderInformationExternal
    Core_AccountProviderKey: Components.Schemas.CoreAccountProviderKey
    Core_AccountProviderKeyStatus: Components.Schemas.CoreAccountProviderKeyStatus
    Core_AccountProviderProcessingDetails: Components.Schemas.CoreAccountProviderProcessingDetails
    Core_AccountProviderProcessingDetails_Completed: Components.Schemas.CoreAccountProviderProcessingDetailsCompleted
    Core_AccountProviderProcessingDetails_Pending: Components.Schemas.CoreAccountProviderProcessingDetailsPending
    Core_AccountProviderProcessingDetails_Preparing: Components.Schemas.CoreAccountProviderProcessingDetailsPreparing
    Core_AccountProviderProcessingStatus: Components.Schemas.CoreAccountProviderProcessingStatus
    Core_AccountProviderType: Components.Schemas.CoreAccountProviderType
    Core_AccountProviderType_ExternalProvider: Components.Schemas.CoreAccountProviderTypeExternalProvider
    Core_AccountProviderUpdated: Components.Schemas.CoreAccountProviderUpdated
    Core_ApiAccountProviderKey: Components.Schemas.CoreApiAccountProviderKey
    Core_ApiLocation: Components.Schemas.CoreApiLocation
    Core_ApiProvider: Components.Schemas.CoreApiProvider
    Core_ApiRelatedTransaction: Components.Schemas.CoreApiRelatedTransaction
    Core_DepositInstructions: Components.Schemas.CoreDepositInstructions
    Core_DepositInstructionsCreated: Components.Schemas.CoreDepositInstructionsCreated
    Core_DepositInstructionsDetails: Components.Schemas.CoreDepositInstructionsDetails
    Core_DepositInstructionsDetails_Address: Components.Schemas.CoreDepositInstructionsDetailsAddress
    Core_DepositInstructionsProviderDetails: Components.Schemas.CoreDepositInstructionsProviderDetails
    Core_DepositInstructionsProviderDetails_Completed: Components.Schemas.CoreDepositInstructionsProviderDetailsCompleted
    Core_DepositInstructionsProviderDetails_Failed: Components.Schemas.CoreDepositInstructionsProviderDetailsFailed
    Core_DepositInstructionsReference: Components.Schemas.CoreDepositInstructionsReference
    Core_DepositInstructionsUpdated: Components.Schemas.CoreDepositInstructionsUpdated
    Core_ExternalOperation: Components.Schemas.CoreExternalOperation
    Core_ExternalOperation_Transfer: Components.Schemas.CoreExternalOperationTransfer
    Core_ExternalProviderTransactionReference: Components.Schemas.CoreExternalProviderTransactionReference
    Core_ExternalTickerProperties: Components.Schemas.CoreExternalTickerProperties
    Core_ExternalTickerProperties_Asset: Components.Schemas.CoreExternalTickerPropertiesAsset
    Core_IntentDryRunResponse_v0_AddProviderKey: Components.Schemas.CoreIntentDryRunResponseV0AddProviderKey
    Core_IntentDryRunResponse_v0_ConnectProvider: Components.Schemas.CoreIntentDryRunResponseV0ConnectProvider
    Core_IntentDryRunResponse_v0_RequestDepositInstructions: Components.Schemas.CoreIntentDryRunResponseV0RequestDepositInstructions
    Core_LedgerParameters_External: Components.Schemas.CoreLedgerParametersExternal
    Core_Location: Components.Schemas.CoreLocation
    Core_LocationCreated: Components.Schemas.CoreLocationCreated
    Core_LocationUpdated: Components.Schemas.CoreLocationUpdated
    Core_LocationsCollection: Components.Schemas.CoreLocationsCollection
    Core_OnLedgerData_External: Components.Schemas.CoreOnLedgerDataExternal
    Core_Output: Components.Schemas.CoreOutput
    Core_ProvidersCollection: Components.Schemas.CoreProvidersCollection
    Core_TickerBalances: Components.Schemas.CoreTickerBalances
    Core_TickerLedgerDetails_External: Components.Schemas.CoreTickerLedgerDetailsExternal
    Core_TransactionEstimate_External: Components.Schemas.CoreTransactionEstimateExternal
    Core_TransactionOrderParameters_External: Components.Schemas.CoreTransactionOrderParametersExternal
    Core_TransferMetadata_External: Components.Schemas.CoreTransferMetadataExternal
    Core_Transferability: Components.Schemas.CoreTransferability
    Core_TransferabilityDestination: Components.Schemas.CoreTransferabilityDestination
    Core_TransferabilityDestination_Ticker: Components.Schemas.CoreTransferabilityDestinationTicker
    Core_TransferabilityResponse: Components.Schemas.CoreTransferabilityResponse
    Core_TransferabilitySource: Components.Schemas.CoreTransferabilitySource
    Core_TransferabilitySource_Ticker: Components.Schemas.CoreTransferabilitySourceTicker
    Core_TransferabilityUnderlying: Components.Schemas.CoreTransferabilityUnderlying
    Core_TransferabilityUnderlying_Ticker: Components.Schemas.CoreTransferabilityUnderlyingTicker
    Core_TrustedDepositInstructions: Components.Schemas.CoreTrustedDepositInstructions
    Core_TrustedDepositInstructionsCollection: Components.Schemas.CoreTrustedDepositInstructionsCollection
    Core_v0_AddProviderKey: Components.Schemas.CoreV0AddProviderKey
    Core_v0_ConnectProvider: Components.Schemas.CoreV0ConnectProvider
    Core_v0_CreateAccountProviderDetailsPayload_External: Components.Schemas.CoreV0CreateAccountProviderDetailsPayloadExternal
    Core_v0_RequestDepositInstructions: Components.Schemas.CoreV0RequestDepositInstructions
    Core_IntentAuthor: Components.Schemas.CoreIntentAuthor
    Core_IntentAuthor_Service: Components.Schemas.CoreIntentAuthorService
    Core_IntentAuthor_User: Components.Schemas.CoreIntentAuthorUser
    Core_IntentBody: Components.Schemas.CoreIntentBody
    Core_IntentDryRunResponse_v0_RegisterTrustedPublicKey: Components.Schemas.CoreIntentDryRunResponseV0RegisterTrustedPublicKey
    Core_IntentOrigin: Components.Schemas.CoreIntentOrigin
    Core_NotarySystemSignedIntentsEnabledValue: Components.Schemas.CoreNotarySystemSignedIntentsEnabledValue
    Core_NotarySystemSigningKeyValue: Components.Schemas.CoreNotarySystemSigningKeyValue
    Core_ReadWriteSystemPropertyKeyValue_NotarySystemSignedIntentsEnabledProperty: Components.Schemas.CoreReadWriteSystemPropertyKeyValueNotarySystemSignedIntentsEnabledProperty
    Core_SystemProperty_NotarySystemSignedIntentsEnabledSystemProperty: Components.Schemas.CoreSystemPropertyNotarySystemSignedIntentsEnabledSystemProperty
    Core_SystemProperty_NotarySystemSigningKeySystemProperty: Components.Schemas.CoreSystemPropertyNotarySystemSigningKeySystemProperty
    Core_SystemSigned: Components.Schemas.CoreSystemSigned
    Core_SystemSignedRequest: Components.Schemas.CoreSystemSignedRequest
    Core_SystemSigningInfo: Components.Schemas.CoreSystemSigningInfo
    Core_SystemSigningKey: Components.Schemas.CoreSystemSigningKey
    Core_UserSigned: Components.Schemas.CoreUserSigned
    Core_v0_RegisterTrustedPublicKey: Components.Schemas.CoreV0RegisterTrustedPublicKey
    Omnibus_OmnibusResponse: Components.Schemas.OmnibusOmnibusResponse
    Omnibus_TenantBalanceEntry: Components.Schemas.OmnibusTenantBalanceEntry
    Omnibus_UpdateOmnibusRequest: Components.Schemas.OmnibusUpdateOmnibusRequest
    Omnibus_TenantCustomProperty: Components.Schemas.OmnibusTenantCustomProperty
    Omnibus_TenantResponse: Components.Schemas.OmnibusTenantResponse
    Omnibus_CreateOrUpdateTenantRequest: Components.Schemas.OmnibusCreateOrUpdateTenantRequest
    Omnibus_JsonNullableListTenantCustomProperty: Components.Schemas.OmnibusJsonNullableListTenantCustomProperty
    Omnibus_CreateOmnibusResponse: Components.Schemas.OmnibusCreateOmnibusResponse
    Omnibus_UnsignedIntentPayload: Components.Schemas.OmnibusUnsignedIntentPayload
    Omnibus_UnsignedIntentPayload_author: Components.Schemas.OmnibusUnsignedIntentPayloadAuthor
    Omnibus_CreateOmnibusRequest: Components.Schemas.OmnibusCreateOmnibusRequest
    Omnibus_CreateWithdrawalResponse: Components.Schemas.OmnibusCreateWithdrawalResponse
    Omnibus_WithdrawalResponse: Components.Schemas.OmnibusWithdrawalResponse
    Omnibus_CreateWithdrawalRequest: Components.Schemas.OmnibusCreateWithdrawalRequest
    Omnibus_InternalTransferResponse: Components.Schemas.OmnibusInternalTransferResponse
    Omnibus_CreateInternalTransferRequest: Components.Schemas.OmnibusCreateInternalTransferRequest
    Omnibus_DepositAddress: Components.Schemas.OmnibusDepositAddress
    Omnibus_DepositWalletResponse: Components.Schemas.OmnibusDepositWalletResponse
    Omnibus_TenantPageMetadata: Components.Schemas.OmnibusTenantPageMetadata
    Omnibus_TenantPageResponse: Components.Schemas.OmnibusTenantPageResponse
    Omnibus_InternalTransferPageResponse: Components.Schemas.OmnibusInternalTransferPageResponse
    Omnibus_InternalTransferSummary: Components.Schemas.OmnibusInternalTransferSummary
    Omnibus_PageMetadata: Components.Schemas.OmnibusPageMetadata
    Omnibus_TenantRef: Components.Schemas.OmnibusTenantRef
    Omnibus_DepositWalletSummary: Components.Schemas.OmnibusDepositWalletSummary
    Omnibus_DepositWalletSummaryPageResponse: Components.Schemas.OmnibusDepositWalletSummaryPageResponse
    Omnibus_HelloWorldResponse: Components.Schemas.OmnibusHelloWorldResponse
    Export_PositionExportDto: Components.Schemas.ExportPositionExportDto
    Export_DateRangeDto: Components.Schemas.ExportDateRangeDto
    Export_MovementExportDto: Components.Schemas.ExportMovementExportDto
    Omnibus_BulkUpdateSweepThresholdsResponse: Components.Schemas.OmnibusBulkUpdateSweepThresholdsResponse
    Omnibus_SweepThresholdConflict: Components.Schemas.OmnibusSweepThresholdConflict
    Omnibus_SweepThresholdConflictResponse: Components.Schemas.OmnibusSweepThresholdConflictResponse
    Omnibus_BulkUpdateSweepThresholdsRequest: Components.Schemas.OmnibusBulkUpdateSweepThresholdsRequest
    Omnibus_SweepThresholdUpdate: Components.Schemas.OmnibusSweepThresholdUpdate
    Omnibus_SweepThresholdConfig: Components.Schemas.OmnibusSweepThresholdConfig
    Omnibus_SweepThresholdPageResponse: Components.Schemas.OmnibusSweepThresholdPageResponse
    Core_EndpointLedgerParameters_Hedera: Components.Schemas.CoreEndpointLedgerParametersHedera
    Core_EndpointLedgerParameters_Stellar: Components.Schemas.CoreEndpointLedgerParametersStellar
    Core_EndpointLedgerParameters_XRPL: Components.Schemas.CoreEndpointLedgerParametersXRPL
    Core_TransferDestinationTag: Components.Schemas.CoreTransferDestinationTag
    Core_TransferDestinationTag_Hedera: Components.Schemas.CoreTransferDestinationTagHedera
    Core_TransferDestinationTag_Stellar: Components.Schemas.CoreTransferDestinationTagStellar
    Core_TransferDestinationTag_XRPL: Components.Schemas.CoreTransferDestinationTagXRPL
    Omnibus_JsonNullableUUID: Components.Schemas.OmnibusJsonNullableUUID
    Omnibus_JsonNullableOmnibusHierarchyTenant_depositWallet: Components.Schemas.OmnibusJsonNullableOmnibusHierarchyTenantDepositWallet
    Omnibus_OmnibusHierarchyResponse: Components.Schemas.OmnibusOmnibusHierarchyResponse
    Omnibus_OmnibusHierarchyTenant: Components.Schemas.OmnibusOmnibusHierarchyTenant
    Export_ExportErrorDto: Components.Schemas.ExportExportErrorDto
    Export_ExportControlTotalsDto: Components.Schemas.ExportExportControlTotalsDto
    Export_ExportMetadataDto: Components.Schemas.ExportExportMetadataDto
    Export_PositionReportRowDto: Components.Schemas.ExportPositionReportRowDto
    Export_PositionReportResponseDto: Components.Schemas.ExportPositionReportResponseDto
    Export_MovementReportRowDto: Components.Schemas.ExportMovementReportRowDto
    Export_MovementReportResponseDto: Components.Schemas.ExportMovementReportResponseDto
    Export_OmnibusAccountTypeTotalsDto: Components.Schemas.ExportOmnibusAccountTypeTotalsDto
    Export_OmnibusControlTotalsDto: Components.Schemas.ExportOmnibusControlTotalsDto
    Export_OmnibusExportMetadataDto: Components.Schemas.ExportOmnibusExportMetadataDto
    Export_OmnibusPositionReportRowDto: Components.Schemas.ExportOmnibusPositionReportRowDto
    Export_OmnibusPositionReportResponseDto: Components.Schemas.ExportOmnibusPositionReportResponseDto
    Export_OmnibusPositionExportDto: Components.Schemas.ExportOmnibusPositionExportDto
    Core_AntiRewindMode: Components.Schemas.CoreAntiRewindMode
    Core_AntiRewindModeValue: Components.Schemas.CoreAntiRewindModeValue
    Core_AuthorizationReference: Components.Schemas.CoreAuthorizationReference
    Core_CantonOperation: Components.Schemas.CoreCantonOperation
    Core_CantonOperation_Accept: Components.Schemas.CoreCantonOperationAccept
    Core_CantonOperation_CreateNativeTransferPreapproval: Components.Schemas.CoreCantonOperationCreateNativeTransferPreapproval
    Core_CantonOperation_CreateParty: Components.Schemas.CoreCantonOperationCreateParty
    Core_CantonOperation_CreateTokenTransferPreapproval: Components.Schemas.CoreCantonOperationCreateTokenTransferPreapproval
    Core_CantonOperation_NativeTransfer: Components.Schemas.CoreCantonOperationNativeTransfer
    Core_CantonOperation_Reject: Components.Schemas.CoreCantonOperationReject
    Core_CantonOperation_TokenTransfer: Components.Schemas.CoreCantonOperationTokenTransfer
    Core_CantonOperation_Withdraw: Components.Schemas.CoreCantonOperationWithdraw
    Core_CantonTickerProperties: Components.Schemas.CoreCantonTickerProperties
    Core_CantonTickerProperties_Instrument: Components.Schemas.CoreCantonTickerPropertiesInstrument
    Core_CantonTickerProperties_Native: Components.Schemas.CoreCantonTickerPropertiesNative
    Core_EthereumFeeStrategy_Sponsored: Components.Schemas.CoreEthereumFeeStrategySponsored
    Core_EthereumOperation: Components.Schemas.CoreEthereumOperation
    Core_EthereumOperation_SetDelegation: Components.Schemas.CoreEthereumOperationSetDelegation
    Core_EthereumOperation_SubmitAuthorization: Components.Schemas.CoreEthereumOperationSubmitAuthorization
    Core_LedgerParameters_Canton: Components.Schemas.CoreLedgerParametersCanton
    Core_LedgerParameters_Sui: Components.Schemas.CoreLedgerParametersSui
    Core_OnLedgerData_Canton: Components.Schemas.CoreOnLedgerDataCanton
    Core_ReadWriteSystemPropertyKeyValue_AntiRewindModeProperty: Components.Schemas.CoreReadWriteSystemPropertyKeyValueAntiRewindModeProperty
    Core_SuiFeeStrategy: Components.Schemas.CoreSuiFeeStrategy
    Core_SuiFeeStrategy_Priority: Components.Schemas.CoreSuiFeeStrategyPriority
    Core_SuiOperation: Components.Schemas.CoreSuiOperation
    Core_SuiOperation_CoinTransfer: Components.Schemas.CoreSuiOperationCoinTransfer
    Core_SuiOperation_NativeTransfer: Components.Schemas.CoreSuiOperationNativeTransfer
    Core_SuiTickerProperties: Components.Schemas.CoreSuiTickerProperties
    Core_SuiTickerProperties_Coin: Components.Schemas.CoreSuiTickerPropertiesCoin
    Core_SuiTickerProperties_Native: Components.Schemas.CoreSuiTickerPropertiesNative
    Core_SystemProperty_AntiRewindModeSystemProperty: Components.Schemas.CoreSystemPropertyAntiRewindModeSystemProperty
    Core_TickerLedgerDetails_Canton: Components.Schemas.CoreTickerLedgerDetailsCanton
    Core_TickerLedgerDetails_Sui: Components.Schemas.CoreTickerLedgerDetailsSui
    Core_TransactionEstimate_Canton: Components.Schemas.CoreTransactionEstimateCanton
    Core_TransactionEstimate_Sui: Components.Schemas.CoreTransactionEstimateSui
    Core_TransactionOrderParameters_Canton: Components.Schemas.CoreTransactionOrderParametersCanton
    Core_TransactionOrderParameters_Sui: Components.Schemas.CoreTransactionOrderParametersSui
    Core_TransferMetadata_Canton: Components.Schemas.CoreTransferMetadataCanton
    Core_TransferMetadata_Sui: Components.Schemas.CoreTransferMetadataSui
    Core_VaultAccountProviderInformation_Key_VaultReserved: Components.Schemas.CoreVaultAccountProviderInformationKeyVaultReserved
    Core_ApiBatchSignerSigningData: Components.Schemas.CoreApiBatchSignerSigningData
    Core_ApiBatchSigningData: Components.Schemas.CoreApiBatchSigningData
    Core_ApiInitiateParametersComputeRequest: Components.Schemas.CoreApiInitiateParametersComputeRequest
    Core_ApiInitiateParametersComputeRequest_CmptSend: Components.Schemas.CoreApiInitiateParametersComputeRequestCmptSend
    Core_ApiInitiateParametersComputeResponse: Components.Schemas.CoreApiInitiateParametersComputeResponse
    Core_ApiInnerTransactionData: Components.Schemas.CoreApiInnerTransactionData
    Core_ApiParametersComputeCryptographicFields: Components.Schemas.CoreApiParametersComputeCryptographicFields
    Core_ApiParametersComputeCryptographicFields_Clawback: Components.Schemas.CoreApiParametersComputeCryptographicFieldsClawback
    Core_ApiParametersComputeCryptographicFields_Convert: Components.Schemas.CoreApiParametersComputeCryptographicFieldsConvert
    Core_ApiParametersComputeCryptographicFields_ConvertBack: Components.Schemas.CoreApiParametersComputeCryptographicFieldsConvertBack
    Core_ApiParametersComputeCryptographicFields_Send: Components.Schemas.CoreApiParametersComputeCryptographicFieldsSend
    Core_ApiParametersComputeStatusResponse: Components.Schemas.CoreApiParametersComputeStatusResponse
    Core_BatchEntry: Components.Schemas.CoreBatchEntry
    Core_BatchEntry_ParticipantOperation: Components.Schemas.CoreBatchEntryParticipantOperation
    Core_BatchEntry_SubmitterOperation: Components.Schemas.CoreBatchEntrySubmitterOperation
    Core_BatchInnerOperation: Components.Schemas.CoreBatchInnerOperation
    Core_BatchInnerOperation_AccountSet: Components.Schemas.CoreBatchInnerOperationAccountSet
    Core_BatchInnerOperation_Clawback: Components.Schemas.CoreBatchInnerOperationClawback
    Core_BatchInnerOperation_ConfidentialMPTConvert: Components.Schemas.CoreBatchInnerOperationConfidentialMPTConvert
    Core_BatchInnerOperation_ConfidentialMPTConvertBack: Components.Schemas.CoreBatchInnerOperationConfidentialMPTConvertBack
    Core_BatchInnerOperation_ConfidentialMPTMergeInbox: Components.Schemas.CoreBatchInnerOperationConfidentialMPTMergeInbox
    Core_BatchInnerOperation_ConfidentialMPTSend: Components.Schemas.CoreBatchInnerOperationConfidentialMPTSend
    Core_BatchInnerOperation_DepositPreauth: Components.Schemas.CoreBatchInnerOperationDepositPreauth
    Core_BatchInnerOperation_EscrowFinish: Components.Schemas.CoreBatchInnerOperationEscrowFinish
    Core_BatchInnerOperation_MPTokenAuthorize: Components.Schemas.CoreBatchInnerOperationMPTokenAuthorize
    Core_BatchInnerOperation_MPTokenIssuanceCreate: Components.Schemas.CoreBatchInnerOperationMPTokenIssuanceCreate
    Core_BatchInnerOperation_MPTokenIssuanceDestroy: Components.Schemas.CoreBatchInnerOperationMPTokenIssuanceDestroy
    Core_BatchInnerOperation_MPTokenIssuanceSet: Components.Schemas.CoreBatchInnerOperationMPTokenIssuanceSet
    Core_BatchInnerOperation_OfferCreate: Components.Schemas.CoreBatchInnerOperationOfferCreate
    Core_BatchInnerOperation_Payment: Components.Schemas.CoreBatchInnerOperationPayment
    Core_BatchInnerOperation_TicketCreate: Components.Schemas.CoreBatchInnerOperationTicketCreate
    Core_BatchInnerOperation_TrustSet: Components.Schemas.CoreBatchInnerOperationTrustSet
    Core_BatchSigner: Components.Schemas.CoreBatchSigner
    Core_CmptCryptographicFields: Components.Schemas.CoreCmptCryptographicFields
    Core_CmptCryptographicFields_Clawback: Components.Schemas.CoreCmptCryptographicFieldsClawback
    Core_CmptCryptographicFields_Convert: Components.Schemas.CoreCmptCryptographicFieldsConvert
    Core_CmptCryptographicFields_ConvertBack: Components.Schemas.CoreCmptCryptographicFieldsConvertBack
    Core_CmptCryptographicFields_Send: Components.Schemas.CoreCmptCryptographicFieldsSend
    Core_ElGamalKeyProvisioned: Components.Schemas.CoreElGamalKeyProvisioned
    Core_ElGamalKeyProvisioningFailed: Components.Schemas.CoreElGamalKeyProvisioningFailed
    Core_IntentDryRunResponse_v0_ProvisionElGamalKeyPair: Components.Schemas.CoreIntentDryRunResponseV0ProvisionElGamalKeyPair
    Core_KeyPurpose: Components.Schemas.CoreKeyPurpose
    Core_Participant: Components.Schemas.CoreParticipant
    Core_ParticipantSequencing: Components.Schemas.CoreParticipantSequencing
    Core_ParticipantSequencing_AccountSequence: Components.Schemas.CoreParticipantSequencingAccountSequence
    Core_ParticipantSequencing_Ticket: Components.Schemas.CoreParticipantSequencingTicket
    Core_Participant_Account: Components.Schemas.CoreParticipantAccount
    Core_Participant_Address: Components.Schemas.CoreParticipantAddress
    Core_Participant_Endpoint: Components.Schemas.CoreParticipantEndpoint
    Core_PurposeKey: Components.Schemas.CorePurposeKey
    Core_ResolvedSequencing: Components.Schemas.CoreResolvedSequencing
    Core_ResolvedSequencing_AccountSequence: Components.Schemas.CoreResolvedSequencingAccountSequence
    Core_ResolvedSequencing_Ticket: Components.Schemas.CoreResolvedSequencingTicket
    Core_Sequencing: Components.Schemas.CoreSequencing
    Core_Sequencing_AccountSequence: Components.Schemas.CoreSequencingAccountSequence
    Core_Sequencing_PlatformManaged: Components.Schemas.CoreSequencingPlatformManaged
    Core_Sequencing_Ticket: Components.Schemas.CoreSequencingTicket
    Core_Sponsorship: Components.Schemas.CoreSponsorship
    Core_SponsorshipMovement: Components.Schemas.CoreSponsorshipMovement
    Core_SponsorshipMovementsCollection: Components.Schemas.CoreSponsorshipMovementsCollection
    Core_SponsorshipRole: Components.Schemas.CoreSponsorshipRole
    Core_SponsorshipsCollection: Components.Schemas.CoreSponsorshipsCollection
    Core_XrplOperation_Batch: Components.Schemas.CoreXrplOperationBatch
    Core_XrplOperation_ConfidentialMPTClawback: Components.Schemas.CoreXrplOperationConfidentialMPTClawback
    Core_XrplOperation_ConfidentialMPTConvert: Components.Schemas.CoreXrplOperationConfidentialMPTConvert
    Core_XrplOperation_ConfidentialMPTConvertBack: Components.Schemas.CoreXrplOperationConfidentialMPTConvertBack
    Core_XrplOperation_ConfidentialMPTMergeInbox: Components.Schemas.CoreXrplOperationConfidentialMPTMergeInbox
    Core_XrplOperation_ConfidentialMPTSend: Components.Schemas.CoreXrplOperationConfidentialMPTSend
    Core_XrplOperation_SponsorshipSetAsSponsee: Components.Schemas.CoreXrplOperationSponsorshipSetAsSponsee
    Core_XrplOperation_SponsorshipSetAsSponsor: Components.Schemas.CoreXrplOperationSponsorshipSetAsSponsor
    Core_XrplOperation_TicketCreate: Components.Schemas.CoreXrplOperationTicketCreate
    Core_XrplSponsorshipParams: Components.Schemas.CoreXrplSponsorshipParams
    Core_XrplTickerProperties_ConfidentialMultiPurposeToken: Components.Schemas.CoreXrplTickerPropertiesConfidentialMultiPurposeToken
    Core_Xrpl_BatchExecutionMode: Components.Schemas.CoreXrplBatchExecutionMode
    Core_Xrpl_CmptCryptographicFields: Components.Schemas.CoreXrplCmptCryptographicFields
    Core_Xrpl_MPTokenIssuanceMutableFlag: Components.Schemas.CoreXrplMPTokenIssuanceMutableFlag
    Core_Xrpl_PaymentFlag: Components.Schemas.CoreXrplPaymentFlag
    Core_Xrpl_ResolvedAssetQuantity: Components.Schemas.CoreXrplResolvedAssetQuantity
    Core_Xrpl_ResolvedBatchInnerOperation: Components.Schemas.CoreXrplResolvedBatchInnerOperation
    Core_Xrpl_ResolvedBatchInnerOperation_AccountSet: Components.Schemas.CoreXrplResolvedBatchInnerOperationAccountSet
    Core_Xrpl_ResolvedBatchInnerOperation_Clawback: Components.Schemas.CoreXrplResolvedBatchInnerOperationClawback
    Core_Xrpl_ResolvedBatchInnerOperation_ConfidentialMPTSend: Components.Schemas.CoreXrplResolvedBatchInnerOperationConfidentialMPTSend
    Core_Xrpl_ResolvedBatchInnerOperation_DepositPreauth: Components.Schemas.CoreXrplResolvedBatchInnerOperationDepositPreauth
    Core_Xrpl_ResolvedBatchInnerOperation_EscrowFinish: Components.Schemas.CoreXrplResolvedBatchInnerOperationEscrowFinish
    Core_Xrpl_ResolvedBatchInnerOperation_MPTokenAuthorize: Components.Schemas.CoreXrplResolvedBatchInnerOperationMPTokenAuthorize
    Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceCreate: Components.Schemas.CoreXrplResolvedBatchInnerOperationMPTokenIssuanceCreate
    Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceDestroy: Components.Schemas.CoreXrplResolvedBatchInnerOperationMPTokenIssuanceDestroy
    Core_Xrpl_ResolvedBatchInnerOperation_MPTokenIssuanceSet: Components.Schemas.CoreXrplResolvedBatchInnerOperationMPTokenIssuanceSet
    Core_Xrpl_ResolvedBatchInnerOperation_OfferCreate: Components.Schemas.CoreXrplResolvedBatchInnerOperationOfferCreate
    Core_Xrpl_ResolvedBatchInnerOperation_Payment: Components.Schemas.CoreXrplResolvedBatchInnerOperationPayment
    Core_Xrpl_ResolvedBatchInnerOperation_TicketCreate: Components.Schemas.CoreXrplResolvedBatchInnerOperationTicketCreate
    Core_Xrpl_ResolvedBatchInnerOperation_TrustSet: Components.Schemas.CoreXrplResolvedBatchInnerOperationTrustSet
    Core_Xrpl_ResolvedClawbackCurrency: Components.Schemas.CoreXrplResolvedClawbackCurrency
    Core_Xrpl_ResolvedClawbackCurrency_Fungible: Components.Schemas.CoreXrplResolvedClawbackCurrencyFungible
    Core_Xrpl_ResolvedClawbackCurrency_MultiPurposeToken: Components.Schemas.CoreXrplResolvedClawbackCurrencyMultiPurposeToken
    Core_Xrpl_ResolvedIouCurrency: Components.Schemas.CoreXrplResolvedIouCurrency
    Core_Xrpl_ResolvedLimitAmount: Components.Schemas.CoreXrplResolvedLimitAmount
    Core_Xrpl_ResolvedMPTokenIdentifier: Components.Schemas.CoreXrplResolvedMPTokenIdentifier
    Core_Xrpl_ResolvedPaymentCurrency: Components.Schemas.CoreXrplResolvedPaymentCurrency
    Core_Xrpl_ResolvedPaymentCurrency_Fungible: Components.Schemas.CoreXrplResolvedPaymentCurrencyFungible
    Core_Xrpl_ResolvedPaymentCurrency_MultiPurposeToken: Components.Schemas.CoreXrplResolvedPaymentCurrencyMultiPurposeToken
    Core_Xrpl_SponsorFlag: Components.Schemas.CoreXrplSponsorFlag
    Core_Xrpl_SponsorshipMovement: Components.Schemas.CoreXrplSponsorshipMovement
    Core_Xrpl_SponsorshipSetFlag: Components.Schemas.CoreXrplSponsorshipSetFlag
    Core_v0_ProvisionElGamalKeyPair: Components.Schemas.CoreV0ProvisionElGamalKeyPair
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
  "/v1/backups/{backupId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getBackup"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/backups": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getBackups"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/backups/{backupId}/trusted-entity": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getBackupTrustedEntity"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getDomains"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/vaults": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getVaults"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/vaults/{vaultId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getVault"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/policies": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPolicies"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/policies/{policyId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getPolicy"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/users": {
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
  "/v1/domains/{domainId}/users/roles": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getKnownUserRoles"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/users/{userId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getUser"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/me": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getMe"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAccounts"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/addresses": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAllDomainsAddresses"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance-configurations": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["listComplianceConfigurations"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/compliance-configuration": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getComplianceConfiguration"]
    put: operations["upsertComplianceConfiguration"]
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAccount"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/addresses": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAddresses"]
    put?: never
    post: operations["generateNewExternalAddressDeprecated"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/addresses/{ledgerId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["generateNewExternalAddress"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/addresses/latest": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getLatestAddress"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/addresses/{accountAddressId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAccountAddress"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/confirmed-balance/{tickerId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAccountConfirmedBalance"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/balances": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAccountBalances"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/balances/refresh": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["forceUpdateAccountBalances"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/endpoints": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getEndpoints"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/endpoints/{endpointId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getEndpoint"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/transactions/orders": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getOrders"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/transactions/orders/{transactionOrderId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getOrder"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/transactions/transfers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTransfers"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/transactions/transfers/{transferId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTransfer"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/transactions": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTransactions"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/transactions/{transactionId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTransaction"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/transactions/dry-run": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["dryRunTransaction"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/manifests": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getManifests"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/manifests/{manifestId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getManifest"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/intents": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["createIntent"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/intents/approve": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["approveIntent"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/intents/reject": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["rejectIntent"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/genesis": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["runGenesis"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/intents": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getIntents"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/intents/{intentId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getIntent"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/intents/{intentId}/remaining-users": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getRemainingUsers"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/intents/dry-run": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["intentDryRun"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/tickers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTickers"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/tickers/{tickerId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTicker"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/ledgers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getLedgers"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/ledgers/{ledgerId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getLedger"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/ledgers/{ledgerId}/fees": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getLedgerFees"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/ledgers/{ledgerId}/ethereum/call": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["processEthereumContractCall"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/trusted-ledgers/{ledgerId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTrustedLedger"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/trusted-ledgers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTrustedLedgers"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/requests/{requestId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getRequestState"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/me/requests": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAllUserRequestsState"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/requests": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAllUserRequestsStateInDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/trusted-public-keys/trusted-collection": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTrustedPublicKeysTrustedCollection"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/trusted-public-keys/api": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTrustedPublicKeysApi"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/trusted-public-keys/messages": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTrustedPublicKeysMessages"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/events": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getEvents"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/properties": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getSystemProperties"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/users/invitations": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: Paths.V1Domains$DomainIdUsersInvitations.Get.QueryParameters
        header?: never
        path: Paths.V1Domains$DomainIdUsersInvitations.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdUsersInvitations.Get.Responses.$200
            "text/json": Paths.V1Domains$DomainIdUsersInvitations.Get.Responses.$200
          }
        }
      }
    }
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdUsersInvitations.Post.PathParameters
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": Paths.V1Domains$DomainIdUsersInvitations.Post.RequestBody
          "text/json": Paths.V1Domains$DomainIdUsersInvitations.Post.RequestBody
          "application/*+json": Components.Schemas.CoreExtensionsInvitationIn
        }
      }
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdUsersInvitations.Post.Responses.$200
            "text/json": Paths.V1Domains$DomainIdUsersInvitations.Post.Responses.$200
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
  "/v1/domains/{domainId}/users/invitations/{id}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdUsersInvitations$Id.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdUsersInvitations$Id.Get.Responses.$200
            "text/json": Paths.V1Domains$DomainIdUsersInvitations$Id.Get.Responses.$200
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
  "/v1/domains/{domainId}/users/invitations/{id}/cancel": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdUsersInvitations$IdCancel.Post.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdUsersInvitations$IdCancel.Post.Responses.$200
            "text/json": Paths.V1Domains$DomainIdUsersInvitations$IdCancel.Post.Responses.$200
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
  "/v1/domains/{domainId}/users/invitations/{id}/renew": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdUsersInvitations$IdRenew.Post.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdUsersInvitations$IdRenew.Post.Responses.$200
            "text/json": Paths.V1Domains$DomainIdUsersInvitations$IdRenew.Post.Responses.$200
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
  "/v1/domains/{domainId}/users/invitations/{id}/complete": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdUsersInvitations$IdComplete.Post.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdUsersInvitations$IdComplete.Post.Responses.$200
            "text/json": Paths.V1Domains$DomainIdUsersInvitations$IdComplete.Post.Responses.$200
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
  "/v1/users/invitations/{idOrCode}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1UsersInvitations$IdOrCode.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1UsersInvitations$IdOrCode.Get.Responses.$200
            "text/json": Paths.V1UsersInvitations$IdOrCode.Get.Responses.$200
          }
        }
      }
    }
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1UsersInvitations$IdOrCode.Post.PathParameters
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": Paths.V1UsersInvitations$IdOrCode.Post.RequestBody
          "text/json": Paths.V1UsersInvitations$IdOrCode.Post.RequestBody
          "application/*+json": Components.Schemas.CoreExtensionsInvitationAnswerIn
        }
      }
      responses: { 200: { headers: { [name: string]: unknown }; content?: never } }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/vaults/{vaultId}/operations/prepared": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Vaults$VaultIdOperationsPrepared.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/octet-stream": Paths.V1Vaults$VaultIdOperationsPrepared.Get.Responses.$200
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
  "/v1/vaults/operations/signed": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: {
      parameters: { query?: never; header?: never; path?: never; cookie?: never }
      requestBody?: {
        content: { "multipart/form-data": Paths.V1VaultsOperationsSigned.Post.RequestBody }
      }
      responses: {
        200: { headers: { [name: string]: unknown }; content?: never }
        400: {
          headers: { [name: string]: unknown }
          content: { "application/json": Paths.V1VaultsOperationsSigned.Post.Responses.$400 }
        }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/virtual-ledgers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: Paths.V1Domains$DomainIdVirtualLedgers.Get.QueryParameters
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: { "application/json": Paths.V1Domains$DomainIdVirtualLedgers.Get.Responses.$200 }
        }
      }
    }
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers.Post.PathParameters
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": Paths.V1Domains$DomainIdVirtualLedgers.Post.RequestBody
          "text/json": Paths.V1Domains$DomainIdVirtualLedgers.Post.RequestBody
          "application/*+json": Components.Schemas.VirtualAccountingVirtualLedgerIn
        }
      }
      responses: {
        201: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers.Post.Responses.$201
          }
        }
        400: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerId.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerId.Get.Responses.$200
          }
        }
        404: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    put: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerId.Put.PathParameters
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerId.Put.RequestBody
          "text/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerId.Put.RequestBody
          "application/*+json": Components.Schemas.VirtualAccountingVirtualLedgerUpdate
        }
      }
      responses: {
        204: { headers: { [name: string]: unknown }; content?: never }
        400: { headers: { [name: string]: unknown }; content?: never }
        404: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/balances": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdBalances.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdBalances.Get.Responses.$200
          }
        }
        404: { headers: { [name: string]: unknown }; content?: never }
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
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts.Get.QueryParameters
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts.Get.Responses.$200
          }
        }
        404: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts.Post.PathParameters
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts.Post.RequestBody
          "text/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts.Post.RequestBody
          "application/*+json": Components.Schemas.VirtualAccountingVirtualAccountIn
        }
      }
      responses: {
        201: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts.Post.Responses.$201
          }
        }
        404: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountId.Put.PathParameters
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountId.Put.RequestBody
          "text/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountId.Put.RequestBody
          "application/*+json": Components.Schemas.VirtualAccountingVirtualAccountUpdate
        }
      }
      responses: {
        204: { headers: { [name: string]: unknown }; content?: never }
        404: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/balances": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdBalances.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdBalances.Get.Responses.$200
          }
        }
        404: { headers: { [name: string]: unknown }; content?: never }
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
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/deposit-identification-sources": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdDepositIdentificationSources.Post.PathParameters
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdDepositIdentificationSources.Post.RequestBody
          "text/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdDepositIdentificationSources.Post.RequestBody
          "application/*+json": Components.Schemas.VirtualAccountingDepositIdentificationSourceBaseIn
        }
      }
      responses: {
        200: { headers: { [name: string]: unknown }; content?: never }
        400: { headers: { [name: string]: unknown }; content?: never }
        404: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/accounts/{accountId}/addresses": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdAddresses.Get.QueryParameters
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdAddresses.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdAccounts$AccountIdAddresses.Get.Responses.$200
          }
        }
        400: { headers: { [name: string]: unknown }; content?: never }
        404: { headers: { [name: string]: unknown }; content?: never }
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
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/operations": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdOperations.Get.QueryParameters
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdOperations.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdOperations.Get.Responses.$200
          }
        }
        404: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    put?: never
    post: {
      parameters: {
        query?: never
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdOperations.Post.PathParameters
        cookie?: never
      }
      requestBody?: {
        content: {
          "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdOperations.Post.RequestBody
          "text/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdOperations.Post.RequestBody
          "application/*+json": Components.Schemas.VirtualAccountingOperationIn
        }
      }
      responses: {
        201: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdOperations.Post.Responses.$201
          }
        }
        400: { headers: { [name: string]: unknown }; content?: never }
        404: { headers: { [name: string]: unknown }; content?: never }
      }
    }
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/virtual-ledgers/{virtualLedgerId}/transfers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: {
      parameters: {
        query?: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdTransfers.Get.QueryParameters
        header?: never
        path: Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdTransfers.Get.PathParameters
        cookie?: never
      }
      requestBody?: never
      responses: {
        200: {
          headers: { [name: string]: unknown }
          content: {
            "application/json": Paths.V1Domains$DomainIdVirtualLedgers$VirtualLedgerIdTransfers.Get.Responses.$200
          }
        }
        404: { headers: { [name: string]: unknown }; content?: never }
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
  "/v1/domains/{domainId}/compliance/providers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["GetAllProvidersForDomain"]
    put?: never
    post: operations["ConnectProvider"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/providers/{provider}/screening-rules": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["GetScreeningRulesForDomainAndProvider"]
    put?: never
    post: operations["ConfigureScreeningRulesForDomainAndProvider"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/providers/{provider}/toggle-preview-screening": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put: operations["TogglePreviewScreening"]
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/providers/{provider}/pause-connection": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put: operations["PauseProviderConnection"]
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/policy": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["CreatePolicyPayload"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/domain": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["CreateDomainPayload"]
    delete: operations["DeleteComplianceDomain"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/domain/validation": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["ValidateComplianceDomainCreation"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/analysis": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["analysis"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/analysis/preview": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["PreviewAnalysis"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/transactionType/{transactionType}/exception-role": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["GetExceptionRole"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/provider-connection": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["GetAllProviderConnectionForDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/policy/{policyType}/transaction/{transactionType}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["GetPolicy"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/providers/{provider}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post?: never
    delete: operations["DeleteProviderConnectionAndScreeningRules"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["CreateTravelRuleTransfer"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["GetTravelRuleTransfer"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/pii": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["AppendPIIToTransfer"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/encrypted-pii": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["PresentEncryptedPIIToTransferWithoutPolicy"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/messages/{travelRuleId}/policies/{travelRulePolicyId}/encrypted-pii": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["PresentEncryptedPIIToTransfer"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/travel-rule/details": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["GetTravelRuleDetails"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/compliance/travel-rule/providers/{provider}/relationships": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["ListRelationships"]
    put?: never
    post: operations["CreateRelationship"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/channels": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAllChannels"]
    put?: never
    post: operations["createChannel"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/channels/{channelId}/test": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["testChannel"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/channels/{channelId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getChannel"]
    put?: never
    post?: never
    delete: operations["deleteChannel"]
    options?: never
    head?: never
    patch: operations["updateChannel"]
    trace?: never
  }
  "/v1/domains/{domainId}/channels/{channelId}/events": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAllChannelEvents"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/channels/{channelId}/events/{eventId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getEvent"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/channels/events": {
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
  "/v1/domain/{domainId}/account/{accountId}/sponsor": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorController_getSponsor_legacyDomain"]
    put: operations["SponsorController_updateSponsor_legacyDomain"]
    post: operations["SponsorController_createSponsor_legacyDomain"]
    delete: operations["SponsorController_deleteSponsor_legacyDomain"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/sponsors": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_listSponsors_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/sponsors/account/{accountId}/sponsor": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_getAccountSponsor_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/sponsors/domain-sponsor": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_getDomainSponsor_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/sponsors/sponsored-accounts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_listSponsoredAccounts_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/sponsors/sponsored-domains": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_listSponsoredDomains_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/account/{entityId}/sponsorable-domains": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorListController_getSponsorableDomains_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/account/{entityId}/sponsored-domains": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["SponsorListController_addSponsoredDomains_legacyDomain"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/account/{entityId}/sponsorable-accounts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorListController_getSponsorableAccounts_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/account/{entityId}/sponsored-accounts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["SponsorListController_addSponsoredAccounts_legacyDomain"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/sponsor/events": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["EventController_getEvents_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/health": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["HealthController_liveness"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/ready": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["HealthController_readiness"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/account/{accountId}/sponsor": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorController_getSponsor"]
    put: operations["SponsorController_updateSponsor"]
    post: operations["SponsorController_createSponsor"]
    delete: operations["SponsorController_deleteSponsor"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/sponsors": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_listSponsors"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/sponsors/account/{accountId}/sponsor": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_getAccountSponsor"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/sponsors/account/{accountId}/valid-sponsors": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_getValidSponsors"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/sponsors/domain-sponsor": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_getDomainSponsor"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/sponsors/sponsored-accounts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_listSponsoredAccounts"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/sponsors/sponsored-domains": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_listSponsoredDomains"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/account/{entityId}/sponsorable-domains": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorListController_getSponsorableDomains"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/account/{entityId}/sponsored-domains": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["SponsorListController_addSponsoredDomains"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/account/{entityId}/sponsorable-accounts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorListController_getSponsorableAccounts"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/account/{entityId}/sponsored-accounts": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["SponsorListController_addSponsoredAccounts"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/account/{entityId}/sponsored-accounts/domains/{sponsoredAccountDomainId}/accounts/{sponsoredAccountId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put: operations["SponsorListController_addSponsoredAccount"]
    post?: never
    delete: operations["SponsorListController_removeSponsoredAccount"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/sponsor/events": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["EventController_getEvents"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/sponsors/account/{accountId}/valid-sponsors": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["SponsorsController_getValidSponsors_legacyDomain"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domain/{domainId}/account/{entityId}/sponsored-accounts/domains/{sponsoredAccountDomainId}/accounts/{sponsoredAccountId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put: operations["SponsorListController_addSponsoredAccount_legacyDomain"]
    post?: never
    delete: operations["SponsorListController_removeSponsoredAccount_legacyDomain"]
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/transferability": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["transferability"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/deposit-instructions/{instructions-id}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["deposit-instructions-by-id"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/deposit-instructions": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["deposit-instructions"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/providers/{providerId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getProvider"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/providers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getProviders"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/providers/{providerId}/locations": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getProviderLocations"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/system-signing/info": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getSystemSigningInfo"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getOmnibus"]
    put: operations["updateOmnibus"]
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getTenant"]
    put: operations["updateTenant"]
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getOmnibusByDomain"]
    put?: never
    post: operations["createOmnibus"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/unlock": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["unlockOmnibus"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["listTenants"]
    put?: never
    post: operations["createTenant"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/withdrawals": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["createWithdrawal"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/unlock": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["unlockTenant"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/lock": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["lockTenant"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/internal-transfers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["createInternalTransfer"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/tenants/{tenantId}/deposit-wallet": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getDepositWallet"]
    put?: never
    post: operations["createDepositWallet"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/lock": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["lockOmnibus"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/internal-transfers": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getInternalTransfers"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/deposit-wallets": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["listDepositWallets"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/exports/position": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["PositionReportController_generatePositionReport"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/exports/movement": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["MovementReportController_generateMovementReport"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/sweep-thresholds": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getSweepThresholds"]
    put: operations["updateSweepThresholds"]
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/internal-transfers/{operationId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getInternalTransfer"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/omnibus/{omnibusId}/hierarchy": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getOmnibusHierarchy"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/exports/position/omnibus": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["OmnibusPositionReportController_generateOmnibusPositionReport"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/sponsorships": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAccountSponsorships"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/sponsorship-movements": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getAccountSponsorshipMovements"]
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/parameters-compute": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get?: never
    put?: never
    post: operations["initiateParametersCompute"]
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  "/v1/domains/{domainId}/accounts/{accountId}/parameters-compute/{computeId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    get: operations["getParametersComputeStatus"]
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
  getBackup: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetBackup.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackup.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetBackup.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackup.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackup.Responses.$404 }
      }
    }
  }
  getBackups: {
    parameters: {
      query?: Paths.GetBackups.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackups.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetBackups.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackups.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackups.Responses.$404 }
      }
    }
  }
  getBackupTrustedEntity: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetBackupTrustedEntity.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackupTrustedEntity.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetBackupTrustedEntity.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackupTrustedEntity.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetBackupTrustedEntity.Responses.$404 }
      }
    }
  }
  getDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetDomain.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetDomain.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetDomain.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetDomain.Responses.$404 }
      }
    }
  }
  getDomains: {
    parameters: {
      query?: Paths.GetDomains.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetDomains.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetDomains.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetDomains.Responses.$401 }
      }
    }
  }
  getVaults: {
    parameters: {
      query?: Paths.GetVaults.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetVaults.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetVaults.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetVaults.Responses.$401 }
      }
    }
  }
  getVault: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetVault.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetVault.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetVault.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetVault.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetVault.Responses.$404 }
      }
    }
  }
  getPolicies: {
    parameters: {
      query?: Paths.GetPolicies.QueryParameters
      header?: never
      path: Paths.GetPolicies.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPolicies.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetPolicies.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPolicies.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPolicies.Responses.$404 }
      }
    }
  }
  getPolicy: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetPolicy.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPolicy.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetPolicy.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPolicy.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPolicy.Responses.$404 }
      }
    }
  }
  getUsers: {
    parameters: {
      query?: Paths.GetUsers.QueryParameters
      header?: never
      path: Paths.GetUsers.PathParameters
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
        content: { "text/plain": Paths.GetUsers.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUsers.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUsers.Responses.$404 }
      }
    }
  }
  getKnownUserRoles: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetKnownUserRoles.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetKnownUserRoles.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetKnownUserRoles.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetKnownUserRoles.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetKnownUserRoles.Responses.$404 }
      }
    }
  }
  getUser: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetUser.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUser.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetUser.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUser.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetUser.Responses.$404 }
      }
    }
  }
  getMe: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetMe.Responses.$200 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetMe.Responses.$401 }
      }
    }
  }
  getAccounts: {
    parameters: {
      query?: Paths.GetAccounts.QueryParameters
      header?: never
      path: Paths.GetAccounts.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccounts.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccounts.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccounts.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccounts.Responses.$404 }
      }
    }
  }
  getAllDomainsAddresses: {
    parameters: {
      query: Paths.GetAllDomainsAddresses.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllDomainsAddresses.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetAllDomainsAddresses.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllDomainsAddresses.Responses.$401 }
      }
    }
  }
  listComplianceConfigurations: {
    parameters: {
      query?: Paths.ListComplianceConfigurations.QueryParameters
      header?: never
      path: Paths.ListComplianceConfigurations.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListComplianceConfigurations.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListComplianceConfigurations.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListComplianceConfigurations.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListComplianceConfigurations.Responses.$404 }
      }
    }
  }
  getComplianceConfiguration: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetComplianceConfiguration.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetComplianceConfiguration.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetComplianceConfiguration.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetComplianceConfiguration.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetComplianceConfiguration.Responses.$404 }
      }
    }
  }
  upsertComplianceConfiguration: {
    parameters: {
      query?: never
      header?: never
      path: Paths.UpsertComplianceConfiguration.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.UpsertComplianceConfiguration.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpsertComplianceConfiguration.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpsertComplianceConfiguration.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpsertComplianceConfiguration.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpsertComplianceConfiguration.Responses.$404 }
      }
    }
  }
  getAccount: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetAccount.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccount.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccount.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccount.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccount.Responses.$404 }
      }
    }
  }
  getAddresses: {
    parameters: {
      query?: Paths.GetAddresses.QueryParameters
      header?: never
      path: Paths.GetAddresses.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAddresses.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAddresses.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAddresses.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAddresses.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAddresses.Responses.$409 }
      }
    }
  }
  generateNewExternalAddressDeprecated: {
    parameters: {
      query?: Paths.GenerateNewExternalAddressDeprecated.QueryParameters
      header?: never
      path: Paths.GenerateNewExternalAddressDeprecated.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddressDeprecated.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddressDeprecated.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddressDeprecated.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddressDeprecated.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddressDeprecated.Responses.$409 }
      }
    }
  }
  generateNewExternalAddress: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GenerateNewExternalAddress.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddress.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddress.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddress.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddress.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GenerateNewExternalAddress.Responses.$409 }
      }
    }
  }
  getLatestAddress: {
    parameters: {
      query?: Paths.GetLatestAddress.QueryParameters
      header?: never
      path: Paths.GetLatestAddress.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLatestAddress.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLatestAddress.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLatestAddress.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLatestAddress.Responses.$404 }
      }
    }
  }
  getAccountAddress: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetAccountAddress.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountAddress.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountAddress.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountAddress.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountAddress.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountAddress.Responses.$409 }
      }
    }
  }
  getAccountConfirmedBalance: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetAccountConfirmedBalance.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountConfirmedBalance.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountConfirmedBalance.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountConfirmedBalance.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountConfirmedBalance.Responses.$404 }
      }
    }
  }
  getAccountBalances: {
    parameters: {
      query?: Paths.GetAccountBalances.QueryParameters
      header?: never
      path: Paths.GetAccountBalances.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountBalances.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountBalances.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountBalances.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountBalances.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountBalances.Responses.$409 }
      }
    }
  }
  forceUpdateAccountBalances: {
    parameters: {
      query?: Paths.ForceUpdateAccountBalances.QueryParameters
      header?: never
      path: Paths.ForceUpdateAccountBalances.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ForceUpdateAccountBalances.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ForceUpdateAccountBalances.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ForceUpdateAccountBalances.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ForceUpdateAccountBalances.Responses.$409 }
      }
    }
  }
  getEndpoints: {
    parameters: {
      query?: Paths.GetEndpoints.QueryParameters
      header?: never
      path: Paths.GetEndpoints.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEndpoints.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetEndpoints.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEndpoints.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEndpoints.Responses.$404 }
      }
    }
  }
  getEndpoint: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetEndpoint.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEndpoint.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetEndpoint.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEndpoint.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEndpoint.Responses.$404 }
      }
    }
  }
  getOrders: {
    parameters: {
      query?: Paths.GetOrders.QueryParameters
      header?: never
      path: Paths.GetOrders.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOrders.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOrders.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOrders.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOrders.Responses.$404 }
      }
    }
  }
  getOrder: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetOrder.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOrder.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetOrder.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOrder.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOrder.Responses.$404 }
      }
    }
  }
  getTransfers: {
    parameters: {
      query?: Paths.GetTransfers.QueryParameters
      header?: never
      path: Paths.GetTransfers.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransfers.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransfers.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransfers.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransfers.Responses.$404 }
      }
    }
  }
  getTransfer: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetTransfer.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransfer.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTransfer.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransfer.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransfer.Responses.$404 }
      }
    }
  }
  getTransactions: {
    parameters: {
      query?: Paths.GetTransactions.QueryParameters
      header?: never
      path: Paths.GetTransactions.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransactions.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTransactions.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransactions.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransactions.Responses.$404 }
      }
    }
  }
  getTransaction: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetTransaction.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransaction.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTransaction.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransaction.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTransaction.Responses.$404 }
      }
    }
  }
  dryRunTransaction: {
    parameters: {
      query?: never
      header?: never
      path: Paths.DryRunTransaction.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.DryRunTransaction.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DryRunTransaction.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DryRunTransaction.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DryRunTransaction.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DryRunTransaction.Responses.$404 }
      }
      504: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DryRunTransaction.Responses.$504 }
      }
    }
  }
  getManifests: {
    parameters: {
      query?: Paths.GetManifests.QueryParameters
      header?: never
      path: Paths.GetManifests.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetManifests.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetManifests.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetManifests.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetManifests.Responses.$404 }
      }
    }
  }
  getManifest: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetManifest.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetManifest.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetManifest.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetManifest.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetManifest.Responses.$404 }
      }
    }
  }
  createIntent: {
    parameters: {
      query?: never
      header?: Paths.CreateIntent.HeaderParameters
      path?: never
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateIntent.RequestBody } }
    responses: {
      202: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateIntent.Responses.$202 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateIntent.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateIntent.Responses.$401 }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateIntent.Responses.$403 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateIntent.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateIntent.Responses.$409 }
      }
      503: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateIntent.Responses.$503 }
      }
    }
  }
  approveIntent: {
    parameters: {
      query?: never
      header?: Paths.ApproveIntent.HeaderParameters
      path?: never
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.ApproveIntent.RequestBody } }
    responses: {
      202: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ApproveIntent.Responses.$202 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ApproveIntent.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ApproveIntent.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ApproveIntent.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ApproveIntent.Responses.$409 }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ApproveIntent.Responses.$500 }
      }
    }
  }
  rejectIntent: {
    parameters: {
      query?: never
      header?: Paths.RejectIntent.HeaderParameters
      path?: never
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.RejectIntent.RequestBody } }
    responses: {
      202: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RejectIntent.Responses.$202 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RejectIntent.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RejectIntent.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RejectIntent.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RejectIntent.Responses.$409 }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RejectIntent.Responses.$500 }
      }
    }
  }
  runGenesis: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.RunGenesis.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.RunGenesis.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RunGenesis.Responses.$401 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RunGenesis.Responses.$409 }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.RunGenesis.Responses.$500 }
      }
    }
  }
  getIntents: {
    parameters: {
      query?: Paths.GetIntents.QueryParameters
      header?: never
      path: Paths.GetIntents.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetIntents.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetIntents.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetIntents.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetIntents.Responses.$404 }
      }
    }
  }
  getIntent: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetIntent.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetIntent.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetIntent.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetIntent.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetIntent.Responses.$404 }
      }
    }
  }
  getRemainingUsers: {
    parameters: {
      query?: Paths.GetRemainingUsers.QueryParameters
      header?: never
      path: Paths.GetRemainingUsers.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetRemainingUsers.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetRemainingUsers.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetRemainingUsers.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetRemainingUsers.Responses.$404 }
      }
    }
  }
  intentDryRun: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: { content: { "application/json": Paths.IntentDryRun.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.IntentDryRun.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.IntentDryRun.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.IntentDryRun.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.IntentDryRun.Responses.$404 }
      }
    }
  }
  getTickers: {
    parameters: {
      query?: Paths.GetTickers.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTickers.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTickers.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTickers.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTickers.Responses.$404 }
      }
    }
  }
  getTicker: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetTicker.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTicker.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTicker.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTicker.Responses.$404 }
      }
    }
  }
  getLedgers: {
    parameters: {
      query?: Paths.GetLedgers.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedgers.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetLedgers.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedgers.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedgers.Responses.$404 }
      }
    }
  }
  getLedger: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetLedger.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedger.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetLedger.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedger.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedger.Responses.$404 }
      }
    }
  }
  getLedgerFees: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetLedgerFees.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedgerFees.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetLedgerFees.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedgerFees.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedgerFees.Responses.$404 }
      }
      405: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetLedgerFees.Responses.$405 }
      }
    }
  }
  processEthereumContractCall: {
    parameters: {
      query?: never
      header?: never
      path: Paths.ProcessEthereumContractCall.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.ProcessEthereumContractCall.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ProcessEthereumContractCall.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.ProcessEthereumContractCall.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ProcessEthereumContractCall.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ProcessEthereumContractCall.Responses.$404 }
      }
    }
  }
  getTrustedLedger: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetTrustedLedger.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedLedger.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTrustedLedger.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedLedger.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedLedger.Responses.$404 }
      }
    }
  }
  getTrustedLedgers: {
    parameters: {
      query?: Paths.GetTrustedLedgers.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedLedgers.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTrustedLedgers.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedLedgers.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedLedgers.Responses.$404 }
      }
    }
  }
  getRequestState: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetRequestState.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetRequestState.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetRequestState.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetRequestState.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetRequestState.Responses.$404 }
      }
    }
  }
  getAllUserRequestsState: {
    parameters: {
      query?: Paths.GetAllUserRequestsState.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllUserRequestsState.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetAllUserRequestsState.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllUserRequestsState.Responses.$401 }
      }
    }
  }
  getAllUserRequestsStateInDomain: {
    parameters: {
      query?: Paths.GetAllUserRequestsStateInDomain.QueryParameters
      header?: never
      path: Paths.GetAllUserRequestsStateInDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllUserRequestsStateInDomain.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetAllUserRequestsStateInDomain.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllUserRequestsStateInDomain.Responses.$401 }
      }
    }
  }
  getTrustedPublicKeysTrustedCollection: {
    parameters: {
      query?: Paths.GetTrustedPublicKeysTrustedCollection.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysTrustedCollection.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTrustedPublicKeysTrustedCollection.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysTrustedCollection.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysTrustedCollection.Responses.$404 }
      }
    }
  }
  getTrustedPublicKeysApi: {
    parameters: {
      query?: Paths.GetTrustedPublicKeysApi.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysApi.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTrustedPublicKeysApi.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysApi.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysApi.Responses.$404 }
      }
    }
  }
  getTrustedPublicKeysMessages: {
    parameters: {
      query?: Paths.GetTrustedPublicKeysMessages.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysMessages.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetTrustedPublicKeysMessages.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysMessages.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTrustedPublicKeysMessages.Responses.$404 }
      }
    }
  }
  getEvents: {
    parameters: {
      query?: Paths.GetEvents.QueryParameters
      header?: never
      path: Paths.GetEvents.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEvents.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEvents.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEvents.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetEvents.Responses.$404 }
      }
    }
  }
  getSystemProperties: {
    parameters: {
      query?: Paths.GetSystemProperties.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSystemProperties.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetSystemProperties.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSystemProperties.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSystemProperties.Responses.$404 }
      }
    }
  }
  GetAllProvidersForDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetAllProvidersForDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllProvidersForDomain.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  ConnectProvider: {
    parameters: {
      query?: never
      header?: never
      path: Paths.ConnectProvider.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.ConnectProvider.RequestBody } }
    responses: {
      202: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ConnectProvider.Responses.$202 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  GetScreeningRulesForDomainAndProvider: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetScreeningRulesForDomainAndProvider.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetScreeningRulesForDomainAndProvider.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  ConfigureScreeningRulesForDomainAndProvider: {
    parameters: {
      query?: never
      header?: never
      path: Paths.ConfigureScreeningRulesForDomainAndProvider.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.ConfigureScreeningRulesForDomainAndProvider.RequestBody }
    }
    responses: {
      201: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  TogglePreviewScreening: {
    parameters: {
      query: Paths.TogglePreviewScreening.QueryParameters
      header?: never
      path: Paths.TogglePreviewScreening.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      202: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      405: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  PauseProviderConnection: {
    parameters: {
      query: Paths.PauseProviderConnection.QueryParameters
      header?: never
      path: Paths.PauseProviderConnection.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      202: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  CreatePolicyPayload: {
    parameters: {
      query?: never
      header?: never
      path: Paths.CreatePolicyPayload.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreatePolicyPayload.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content: { "*/*": string } }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  CreateDomainPayload: {
    parameters: {
      query?: never
      header?: never
      path: Paths.CreateDomainPayload.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateDomainPayload.RequestBody } }
    responses: {
      200: { headers: { [name: string]: unknown }; content: { "*/*": string } }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  DeleteComplianceDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.DeleteComplianceDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      202: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  ValidateComplianceDomainCreation: {
    parameters: {
      query?: never
      header?: never
      path: Paths.ValidateComplianceDomainCreation.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.ValidateComplianceDomainCreation.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceValidateComplianceDomainCreationResponse }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  analysis: {
    parameters: {
      query?: never
      header?: never
      path: Paths.Analysis.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.Analysis.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.Analysis.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  PreviewAnalysis: {
    parameters: {
      query?: never
      header?: never
      path: Paths.PreviewAnalysis.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.PreviewAnalysis.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PreviewAnalysis.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      405: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      501: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      502: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  GetExceptionRole: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetExceptionRole.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetExceptionRole.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  GetAllProviderConnectionForDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetAllProviderConnectionForDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAllProviderConnectionForDomain.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  GetPolicy: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetPolicyDup76.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetPolicyDup76.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  DeleteProviderConnectionAndScreeningRules: {
    parameters: {
      query?: never
      header?: never
      path: Paths.DeleteProviderConnectionAndScreeningRules.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      204: { headers: { [name: string]: unknown }; content?: never }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  CreateTravelRuleTransfer: {
    parameters: {
      query?: never
      header?: never
      path: Paths.CreateTravelRuleTransfer.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateTravelRuleTransfer.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateTravelRuleTransfer.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  GetTravelRuleTransfer: {
    parameters: {
      query?: Paths.GetTravelRuleTransfer.QueryParameters
      header?: never
      path: Paths.GetTravelRuleTransfer.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTravelRuleTransfer.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  AppendPIIToTransfer: {
    parameters: {
      query?: never
      header?: never
      path: Paths.AppendPIIToTransfer.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.AppendPIIToTransfer.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.AppendPIIToTransfer.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  PresentEncryptedPIIToTransferWithoutPolicy: {
    parameters: {
      query?: Paths.PresentEncryptedPIIToTransferWithoutPolicy.QueryParameters
      header?: never
      path: Paths.PresentEncryptedPIIToTransferWithoutPolicy.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.PresentEncryptedPIIToTransferWithoutPolicy.RequestBody }
    }
    responses: {
      202: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.PresentEncryptedPIIToTransferWithoutPolicy.Responses.$202
        }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  PresentEncryptedPIIToTransfer: {
    parameters: {
      query?: Paths.PresentEncryptedPIIToTransfer.QueryParameters
      header?: never
      path: Paths.PresentEncryptedPIIToTransfer.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.PresentEncryptedPIIToTransfer.RequestBody }
    }
    responses: {
      202: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.PresentEncryptedPIIToTransfer.Responses.$202 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  GetTravelRuleDetails: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetTravelRuleDetails.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.GetTravelRuleDetails.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTravelRuleDetails.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  ListRelationships: {
    parameters: {
      query?: Paths.ListRelationships.QueryParameters
      header?: never
      path: Paths.ListRelationships.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListRelationships.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  CreateRelationship: {
    parameters: {
      query?: never
      header?: never
      path: Paths.CreateRelationship.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateRelationship.RequestBody } }
    responses: {
      201: { headers: { [name: string]: unknown }; content?: never }
      400: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.ComplianceErrorResponse }
      }
    }
  }
  getAllChannels: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetAllChannels.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.EDSChannel[] }
      }
    }
  }
  createChannel: {
    parameters: {
      query?: never
      header?: never
      path: Paths.CreateChannel.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateChannel.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.EDSChannel }
      }
    }
  }
  testChannel: {
    parameters: {
      query?: never
      header?: never
      path: Paths.TestChannel.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: { 200: { headers: { [name: string]: unknown }; content?: never } }
  }
  getChannel: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetChannel.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.EDSChannel }
      }
    }
  }
  deleteChannel: {
    parameters: {
      query?: never
      header?: never
      path: Paths.DeleteChannel.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: { 200: { headers: { [name: string]: unknown }; content?: never } }
  }
  updateChannel: {
    parameters: {
      query?: never
      header?: never
      path: Paths.UpdateChannel.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.UpdateChannel.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.EDSChannel }
      }
    }
  }
  getAllChannelEvents: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetAllChannelEvents.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.EDSEvent[] }
      }
    }
  }
  getEvent: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetEvent.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: { headers: { [name: string]: unknown }; content: { "*/*": Components.Schemas.EDSEvent } }
    }
  }
  getAllEvents: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetAllEvents.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "*/*": Components.Schemas.EDSEvent[] }
      }
    }
  }
  SponsorController_getSponsor_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorControllerGetSponsorLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorControllerGetSponsorLegacyDomain.Responses.$200
        }
      }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorController_updateSponsor_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorControllerUpdateSponsorLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.SponsorControllerUpdateSponsorLegacyDomain.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorControllerUpdateSponsorLegacyDomain.Responses.$200
        }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorController_createSponsor_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorControllerCreateSponsorLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.SponsorControllerCreateSponsorLegacyDomain.RequestBody }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorControllerCreateSponsorLegacyDomain.Responses.$201
        }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      409: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorController_deleteSponsor_legacyDomain: {
    parameters: {
      query: Paths.SponsorControllerDeleteSponsorLegacyDomain.QueryParameters
      header?: never
      path: Paths.SponsorControllerDeleteSponsorLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      204: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorsController_listSponsors_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorsControllerListSponsorsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorsControllerListSponsorsLegacyDomain.Responses.$200
        }
      }
    }
  }
  SponsorsController_getAccountSponsor_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorsControllerGetAccountSponsorLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorsControllerGetAccountSponsorLegacyDomain.Responses.$200
        }
      }
    }
  }
  SponsorsController_getDomainSponsor_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorsControllerGetDomainSponsorLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorsControllerGetDomainSponsorLegacyDomain.Responses.$200
        }
      }
    }
  }
  SponsorsController_listSponsoredAccounts_legacyDomain: {
    parameters: {
      query?: Paths.SponsorsControllerListSponsoredAccountsLegacyDomain.QueryParameters
      header?: never
      path: Paths.SponsorsControllerListSponsoredAccountsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorsControllerListSponsoredAccountsLegacyDomain.Responses.$200
        }
      }
      500: { headers: { [name: string]: unknown }; content?: never }
      503: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorsController_listSponsoredDomains_legacyDomain: {
    parameters: {
      query?: Paths.SponsorsControllerListSponsoredDomainsLegacyDomain.QueryParameters
      header?: never
      path: Paths.SponsorsControllerListSponsoredDomainsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorsControllerListSponsoredDomainsLegacyDomain.Responses.$200
        }
      }
      500: { headers: { [name: string]: unknown }; content?: never }
      503: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorListController_getSponsorableDomains_legacyDomain: {
    parameters: {
      query?: Paths.SponsorListControllerGetSponsorableDomainsLegacyDomain.QueryParameters
      header?: never
      path: Paths.SponsorListControllerGetSponsorableDomainsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorListControllerGetSponsorableDomainsLegacyDomain.Responses.$200
        }
      }
    }
  }
  SponsorListController_addSponsoredDomains_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorListControllerAddSponsoredDomainsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody: {
      content: {
        "application/json": Paths.SponsorListControllerAddSponsoredDomainsLegacyDomain.RequestBody
      }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorListControllerAddSponsoredDomainsLegacyDomain.Responses.$201
        }
      }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorListController_getSponsorableAccounts_legacyDomain: {
    parameters: {
      query?: Paths.SponsorListControllerGetSponsorableAccountsLegacyDomain.QueryParameters
      header?: never
      path: Paths.SponsorListControllerGetSponsorableAccountsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorListControllerGetSponsorableAccountsLegacyDomain.Responses.$200
        }
      }
    }
  }
  SponsorListController_addSponsoredAccounts_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorListControllerAddSponsoredAccountsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody: {
      content: {
        "application/json": Paths.SponsorListControllerAddSponsoredAccountsLegacyDomain.RequestBody
      }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorListControllerAddSponsoredAccountsLegacyDomain.Responses.$201
        }
      }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  EventController_getEvents_legacyDomain: {
    parameters: {
      query?: Paths.EventControllerGetEventsLegacyDomain.QueryParameters
      header?: never
      path: Paths.EventControllerGetEventsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.EventControllerGetEventsLegacyDomain.Responses.$200 }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  HealthController_liveness: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.HealthControllerLiveness.Responses.$200 }
      }
      503: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.HealthControllerLiveness.Responses.$503 }
      }
    }
  }
  HealthController_readiness: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.HealthControllerReadiness.Responses.$200 }
      }
      503: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.HealthControllerReadiness.Responses.$503 }
      }
    }
  }
  SponsorController_getSponsor: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorControllerGetSponsor.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.SponsorControllerGetSponsor.Responses.$200 }
      }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorController_updateSponsor: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorControllerUpdateSponsor.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.SponsorControllerUpdateSponsor.RequestBody }
    }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.SponsorControllerUpdateSponsor.Responses.$200 }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorController_createSponsor: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorControllerCreateSponsor.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.SponsorControllerCreateSponsor.RequestBody }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.SponsorControllerCreateSponsor.Responses.$201 }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      409: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorController_deleteSponsor: {
    parameters: {
      query: Paths.SponsorControllerDeleteSponsor.QueryParameters
      header?: never
      path: Paths.SponsorControllerDeleteSponsor.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      204: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorsController_listSponsors: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorsControllerListSponsors.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.SponsorsControllerListSponsors.Responses.$200 }
      }
    }
  }
  SponsorsController_getAccountSponsor: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorsControllerGetAccountSponsor.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.SponsorsControllerGetAccountSponsor.Responses.$200 }
      }
    }
  }
  SponsorsController_getValidSponsors: {
    parameters: {
      query?: Paths.SponsorsControllerGetValidSponsors.QueryParameters
      header?: never
      path: Paths.SponsorsControllerGetValidSponsors.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.SponsorsControllerGetValidSponsors.Responses.$200 }
      }
    }
  }
  SponsorsController_getDomainSponsor: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorsControllerGetDomainSponsor.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.SponsorsControllerGetDomainSponsor.Responses.$200 }
      }
    }
  }
  SponsorsController_listSponsoredAccounts: {
    parameters: {
      query?: Paths.SponsorsControllerListSponsoredAccounts.QueryParameters
      header?: never
      path: Paths.SponsorsControllerListSponsoredAccounts.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorsControllerListSponsoredAccounts.Responses.$200
        }
      }
      500: { headers: { [name: string]: unknown }; content?: never }
      503: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorsController_listSponsoredDomains: {
    parameters: {
      query?: Paths.SponsorsControllerListSponsoredDomains.QueryParameters
      header?: never
      path: Paths.SponsorsControllerListSponsoredDomains.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.SponsorsControllerListSponsoredDomains.Responses.$200 }
      }
      500: { headers: { [name: string]: unknown }; content?: never }
      503: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorListController_getSponsorableDomains: {
    parameters: {
      query?: Paths.SponsorListControllerGetSponsorableDomains.QueryParameters
      header?: never
      path: Paths.SponsorListControllerGetSponsorableDomains.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorListControllerGetSponsorableDomains.Responses.$200
        }
      }
    }
  }
  SponsorListController_addSponsoredDomains: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorListControllerAddSponsoredDomains.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.SponsorListControllerAddSponsoredDomains.RequestBody }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorListControllerAddSponsoredDomains.Responses.$201
        }
      }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorListController_getSponsorableAccounts: {
    parameters: {
      query?: Paths.SponsorListControllerGetSponsorableAccounts.QueryParameters
      header?: never
      path: Paths.SponsorListControllerGetSponsorableAccounts.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorListControllerGetSponsorableAccounts.Responses.$200
        }
      }
    }
  }
  SponsorListController_addSponsoredAccounts: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorListControllerAddSponsoredAccounts.PathParameters
      cookie?: never
    }
    requestBody: {
      content: { "application/json": Paths.SponsorListControllerAddSponsoredAccounts.RequestBody }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorListControllerAddSponsoredAccounts.Responses.$201
        }
      }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorListController_addSponsoredAccount: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorListControllerAddSponsoredAccount.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      201: { headers: { [name: string]: unknown }; content?: never }
      204: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
      409: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorListController_removeSponsoredAccount: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorListControllerRemoveSponsoredAccount.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      204: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  EventController_getEvents: {
    parameters: {
      query?: Paths.EventControllerGetEvents.QueryParameters
      header?: never
      path: Paths.EventControllerGetEvents.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.EventControllerGetEvents.Responses.$200 }
      }
      400: { headers: { [name: string]: unknown }; content?: never }
      500: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorsController_getValidSponsors_legacyDomain: {
    parameters: {
      query?: Paths.SponsorsControllerGetValidSponsorsLegacyDomain.QueryParameters
      header?: never
      path: Paths.SponsorsControllerGetValidSponsorsLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.SponsorsControllerGetValidSponsorsLegacyDomain.Responses.$200
        }
      }
    }
  }
  SponsorListController_addSponsoredAccount_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorListControllerAddSponsoredAccountLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      201: { headers: { [name: string]: unknown }; content?: never }
      204: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
      409: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  SponsorListController_removeSponsoredAccount_legacyDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.SponsorListControllerRemoveSponsoredAccountLegacyDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      204: { headers: { [name: string]: unknown }; content?: never }
      404: { headers: { [name: string]: unknown }; content?: never }
    }
  }
  transferability: {
    parameters: {
      query?: Paths.Transferability.QueryParameters
      header?: never
      path: Paths.Transferability.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.Transferability.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.Transferability.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.Transferability.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.Transferability.Responses.$404 }
      }
    }
  }
  "deposit-instructions-by-id": {
    parameters: {
      query?: never
      header?: never
      path: Paths.DepositInstructionsById.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DepositInstructionsById.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DepositInstructionsById.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DepositInstructionsById.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DepositInstructionsById.Responses.$404 }
      }
    }
  }
  "deposit-instructions": {
    parameters: {
      query?: Paths.DepositInstructions.QueryParameters
      header?: never
      path: Paths.DepositInstructions.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DepositInstructions.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DepositInstructions.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.DepositInstructions.Responses.$401 }
      }
    }
  }
  getProvider: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetProvider.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetProvider.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetProvider.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetProvider.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetProvider.Responses.$404 }
      }
    }
  }
  getProviders: {
    parameters: {
      query?: Paths.GetProviders.QueryParameters
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetProviders.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetProviders.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetProviders.Responses.$401 }
      }
    }
  }
  getProviderLocations: {
    parameters: {
      query?: Paths.GetProviderLocations.QueryParameters
      header?: never
      path: Paths.GetProviderLocations.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetProviderLocations.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetProviderLocations.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetProviderLocations.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetProviderLocations.Responses.$404 }
      }
    }
  }
  getSystemSigningInfo: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSystemSigningInfo.Responses.$200 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSystemSigningInfo.Responses.$401 }
      }
    }
  }
  getOmnibus: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetOmnibus.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOmnibus.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOmnibus.Responses.$404 }
      }
    }
  }
  updateOmnibus: {
    parameters: {
      query?: never
      header?: never
      path: Paths.UpdateOmnibus.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.UpdateOmnibus.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateOmnibus.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateOmnibus.Responses.$404 }
      }
    }
  }
  getTenant: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetTenant.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTenant.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetTenant.Responses.$404 }
      }
    }
  }
  updateTenant: {
    parameters: {
      query?: never
      header?: never
      path: Paths.UpdateTenant.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.UpdateTenant.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateTenant.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateTenant.Responses.$404 }
      }
    }
  }
  getOmnibusByDomain: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetOmnibusByDomain.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOmnibusByDomain.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOmnibusByDomain.Responses.$404 }
      }
    }
  }
  createOmnibus: {
    parameters: {
      query?: never
      header?: never
      path: Paths.CreateOmnibus.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateOmnibus.RequestBody } }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateOmnibus.Responses.$201 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateOmnibus.Responses.$400 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateOmnibus.Responses.$409 }
      }
    }
  }
  unlockOmnibus: {
    parameters: {
      query?: never
      header?: never
      path: Paths.UnlockOmnibus.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UnlockOmnibus.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UnlockOmnibus.Responses.$404 }
      }
    }
  }
  listTenants: {
    parameters: {
      query?: Paths.ListTenants.QueryParameters
      header?: never
      path: Paths.ListTenants.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListTenants.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListTenants.Responses.$404 }
      }
    }
  }
  createTenant: {
    parameters: {
      query?: never
      header?: never
      path: Paths.CreateTenant.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateTenant.RequestBody } }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateTenant.Responses.$201 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateTenant.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateTenant.Responses.$409 }
      }
    }
  }
  createWithdrawal: {
    parameters: {
      query?: never
      header: Paths.CreateWithdrawal.HeaderParameters
      path: Paths.CreateWithdrawal.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateWithdrawal.RequestBody } }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateWithdrawal.Responses.$201 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateWithdrawal.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateWithdrawal.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateWithdrawal.Responses.$409 }
      }
    }
  }
  unlockTenant: {
    parameters: {
      query?: never
      header?: never
      path: Paths.UnlockTenant.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UnlockTenant.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UnlockTenant.Responses.$404 }
      }
    }
  }
  lockTenant: {
    parameters: {
      query?: never
      header?: never
      path: Paths.LockTenant.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.LockTenant.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.LockTenant.Responses.$404 }
      }
    }
  }
  createInternalTransfer: {
    parameters: {
      query?: never
      header: Paths.CreateInternalTransfer.HeaderParameters
      path: Paths.CreateInternalTransfer.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.CreateInternalTransfer.RequestBody } }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateInternalTransfer.Responses.$201 }
      }
      202: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateInternalTransfer.Responses.$202 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateInternalTransfer.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateInternalTransfer.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateInternalTransfer.Responses.$409 }
      }
      500: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateInternalTransfer.Responses.$500 }
      }
    }
  }
  getDepositWallet: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetDepositWallet.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetDepositWallet.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetDepositWallet.Responses.$404 }
      }
    }
  }
  createDepositWallet: {
    parameters: {
      query?: never
      header?: never
      path: Paths.CreateDepositWallet.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateDepositWallet.Responses.$200 }
      }
      201: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateDepositWallet.Responses.$201 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.CreateDepositWallet.Responses.$404 }
      }
    }
  }
  lockOmnibus: {
    parameters: {
      query?: never
      header?: never
      path: Paths.LockOmnibus.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.LockOmnibus.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.LockOmnibus.Responses.$404 }
      }
    }
  }
  getInternalTransfers: {
    parameters: {
      query?: Paths.GetInternalTransfers.QueryParameters
      header?: never
      path: Paths.GetInternalTransfers.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetInternalTransfers.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetInternalTransfers.Responses.$400 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetInternalTransfers.Responses.$404 }
      }
    }
  }
  listDepositWallets: {
    parameters: {
      query?: Paths.ListDepositWallets.QueryParameters
      header?: never
      path: Paths.ListDepositWallets.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListDepositWallets.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.ListDepositWallets.Responses.$404 }
      }
    }
  }
  PositionReportController_generatePositionReport: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: {
      content: {
        "application/json": Paths.PositionReportControllerGeneratePositionReport.RequestBody
      }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.PositionReportControllerGeneratePositionReport.Responses.$201
          "text/csv": string
        }
      }
      400: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.PositionReportControllerGeneratePositionReport.Responses.$400
        }
      }
      401: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.PositionReportControllerGeneratePositionReport.Responses.$401
        }
      }
      403: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.PositionReportControllerGeneratePositionReport.Responses.$403
        }
      }
      413: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.PositionReportControllerGeneratePositionReport.Responses.$413
        }
      }
      429: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.PositionReportControllerGeneratePositionReport.Responses.$429
        }
      }
      502: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.PositionReportControllerGeneratePositionReport.Responses.$502
        }
      }
    }
  }
  MovementReportController_generateMovementReport: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: {
      content: {
        "application/json": Paths.MovementReportControllerGenerateMovementReport.RequestBody
      }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.MovementReportControllerGenerateMovementReport.Responses.$201
          "text/csv": string
        }
      }
      400: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.MovementReportControllerGenerateMovementReport.Responses.$400
        }
      }
      401: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.MovementReportControllerGenerateMovementReport.Responses.$401
        }
      }
      403: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.MovementReportControllerGenerateMovementReport.Responses.$403
        }
      }
      413: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.MovementReportControllerGenerateMovementReport.Responses.$413
        }
      }
      429: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.MovementReportControllerGenerateMovementReport.Responses.$429
        }
      }
      502: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.MovementReportControllerGenerateMovementReport.Responses.$502
        }
      }
    }
  }
  getSweepThresholds: {
    parameters: {
      query?: Paths.GetSweepThresholds.QueryParameters
      header?: never
      path: Paths.GetSweepThresholds.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSweepThresholds.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSweepThresholds.Responses.$400 }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSweepThresholds.Responses.$403 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetSweepThresholds.Responses.$404 }
      }
    }
  }
  updateSweepThresholds: {
    parameters: {
      query?: never
      header?: never
      path: Paths.UpdateSweepThresholds.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.UpdateSweepThresholds.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateSweepThresholds.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateSweepThresholds.Responses.$400 }
      }
      403: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateSweepThresholds.Responses.$403 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateSweepThresholds.Responses.$404 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.UpdateSweepThresholds.Responses.$409 }
      }
    }
  }
  getInternalTransfer: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetInternalTransfer.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetInternalTransfer.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetInternalTransfer.Responses.$404 }
      }
    }
  }
  getOmnibusHierarchy: {
    parameters: {
      query?: Paths.GetOmnibusHierarchy.QueryParameters
      header?: never
      path: Paths.GetOmnibusHierarchy.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOmnibusHierarchy.Responses.$200 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetOmnibusHierarchy.Responses.$404 }
      }
    }
  }
  OmnibusPositionReportController_generateOmnibusPositionReport: {
    parameters: { query?: never; header?: never; path?: never; cookie?: never }
    requestBody: {
      content: {
        "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.RequestBody
      }
    }
    responses: {
      201: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$201
          "text/csv": string
        }
      }
      400: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$400
        }
      }
      401: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$401
        }
      }
      403: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$403
        }
      }
      404: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$404
        }
      }
      413: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$413
        }
      }
      422: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$422
        }
      }
      429: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$429
        }
      }
      502: {
        headers: { [name: string]: unknown }
        content: {
          "application/json": Paths.OmnibusPositionReportControllerGenerateOmnibusPositionReport.Responses.$502
        }
      }
    }
  }
  getAccountSponsorships: {
    parameters: {
      query: Paths.GetAccountSponsorships.QueryParameters
      header?: never
      path: Paths.GetAccountSponsorships.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountSponsorships.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountSponsorships.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountSponsorships.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountSponsorships.Responses.$404 }
      }
    }
  }
  getAccountSponsorshipMovements: {
    parameters: {
      query: Paths.GetAccountSponsorshipMovements.QueryParameters
      header?: never
      path: Paths.GetAccountSponsorshipMovements.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountSponsorshipMovements.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountSponsorshipMovements.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountSponsorshipMovements.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetAccountSponsorshipMovements.Responses.$404 }
      }
    }
  }
  initiateParametersCompute: {
    parameters: {
      query?: never
      header?: never
      path: Paths.InitiateParametersCompute.PathParameters
      cookie?: never
    }
    requestBody: { content: { "application/json": Paths.InitiateParametersCompute.RequestBody } }
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.InitiateParametersCompute.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.InitiateParametersCompute.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.InitiateParametersCompute.Responses.$401 }
      }
      409: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.InitiateParametersCompute.Responses.$409 }
      }
    }
  }
  getParametersComputeStatus: {
    parameters: {
      query?: never
      header?: never
      path: Paths.GetParametersComputeStatus.PathParameters
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetParametersComputeStatus.Responses.$200 }
      }
      400: {
        headers: { [name: string]: unknown }
        content: { "text/plain": Paths.GetParametersComputeStatus.Responses.$400 }
      }
      401: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetParametersComputeStatus.Responses.$401 }
      }
      404: {
        headers: { [name: string]: unknown }
        content: { "application/json": Paths.GetParametersComputeStatus.Responses.$404 }
      }
    }
  }
}
