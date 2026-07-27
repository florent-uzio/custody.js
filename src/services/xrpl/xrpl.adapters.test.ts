import { describe, expect, it } from "vitest"
import type { Batch, BatchSigner } from "xrpl"
import {
  AccountSetAsfFlags,
  BatchFlags,
  MPTokenAuthorizeFlags,
  MPTokenIssuanceCreateFlags,
  MPTokenIssuanceSetFlags,
  OfferCreateFlags,
  TrustSetFlags,
} from "xrpl"
import {
  batchSignersToCustodyBatchSigners,
  batchToCustodyBatchPayload,
  batchToCustodyInnerTransactions,
} from "./xrpl.adapters.js"

type RawTx = Batch["RawTransactions"][number]["RawTransaction"]

const SUBMITTER = "rSender123"

const makeRawTransactions = (
  tx: RawTx,
  outerAccount: string = SUBMITTER,
): Pick<Batch, "Account" | "RawTransactions"> => ({
  Account: outerAccount,
  RawTransactions: [{ RawTransaction: tx }],
})

const baseTx = {
  Account: SUBMITTER,
  Sequence: 1,
  Fee: "12",
  SigningPubKey: "",
  TxnSignature: "",
}

// ─── batchSignersToCustodyBatchSigners ────────────────────────────────────────

describe("batchSignersToCustodyBatchSigners", () => {
  it("maps participant, publicKey and signature", () => {
    const input: BatchSigner[] = [
      {
        BatchSigner: {
          Account: "rSigner1",
          SigningPubKey: "PUBKEY1",
          TxnSignature: "SIG1",
        },
      },
    ]
    expect(batchSignersToCustodyBatchSigners(input)).toEqual([
      {
        participant: { type: "Address", address: "rSigner1" },
        publicKey: "PUBKEY1",
        signature: "SIG1",
      },
    ])
  })

  it("falls back to empty strings when SigningPubKey / TxnSignature are undefined", () => {
    const input: BatchSigner[] = [
      {
        BatchSigner: {
          Account: "rSigner2",
          SigningPubKey: undefined,
          TxnSignature: undefined,
        },
      },
    ]
    expect(batchSignersToCustodyBatchSigners(input)).toEqual([
      {
        participant: { type: "Address", address: "rSigner2" },
        publicKey: "",
        signature: "",
      },
    ])
  })

  it("maps multiple signers", () => {
    const input: BatchSigner[] = [
      { BatchSigner: { Account: "rA", SigningPubKey: "PK_A", TxnSignature: "SIG_A" } },
      { BatchSigner: { Account: "rB", SigningPubKey: "PK_B", TxnSignature: "SIG_B" } },
    ]
    const result = batchSignersToCustodyBatchSigners(input)
    expect(result).toHaveLength(2)
    expect(result[1]).toEqual({
      participant: { type: "Address", address: "rB" },
      publicKey: "PK_B",
      signature: "SIG_B",
    })
  })
})

// ─── batchToCustodyInnerTransactions ───────────────────────────────────────

describe("batchToCustodyInnerTransactions", () => {
  describe("Payment", () => {
    it("converts XRP payment", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "Payment",
        Destination: "rDest456",
        Amount: "1000000",
      }
      expect(batchToCustodyInnerTransactions(makeRawTransactions(tx))).toEqual([
        {
          type: "SubmitterOperation",
          sequencing: { type: "AccountSequence", value: 1 },
          operation: {
            type: "Payment",
            destination: { type: "Address", address: "rDest456" },
            amount: "1000000",
          },
        },
      ])
    })

    it("converts IOU payment", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "Payment",
        Destination: "rDest456",
        Amount: { currency: "USD", issuer: "rIssuer", value: "100" },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "Payment",
        destination: { type: "Address", address: "rDest456" },
        amount: "100",
        currency: { type: "Currency", code: "USD", issuer: "rIssuer" },
      })
    })

    it("includes destinationTag when present", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "Payment",
        Destination: "rDest456",
        Amount: "1000000",
        DestinationTag: 42,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toMatchObject({ destinationTag: 42 })
    })

    it("omits destinationTag when absent", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "Payment",
        Destination: "rDest456",
        Amount: "1000000",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).not.toHaveProperty("destinationTag")
    })

    it("converts MPT payment", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "Payment",
        Destination: "rDest456",
        Amount: { mpt_issuance_id: "00000001ABC123", value: "500" },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "Payment",
        destination: { type: "Address", address: "rDest456" },
        amount: "500",
        currency: { type: "MultiPurposeToken", issuanceId: "00000001ABC123" },
      })
    })
  })

  describe("OfferCreate", () => {
    it("converts with no flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "OfferCreate",
        TakerGets: "1000000",
        TakerPays: { currency: "USD", issuer: "rIssuer", value: "50" },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "OfferCreate",
        takerGets: { amount: "1000000" },
        takerPays: { amount: "50", currency: { type: "Currency", code: "USD", issuer: "rIssuer" } },
        flags: [],
      })
    })

    it("converts numeric flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "OfferCreate",
        TakerGets: "1000000",
        TakerPays: "2000000",
        Flags: OfferCreateFlags.tfSell | OfferCreateFlags.tfFillOrKill,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toContain("tfSell")
      expect(op.flags).toContain("tfFillOrKill")
      expect(op.flags).not.toContain("tfImmediateOrCancel")
    })

    it("converts object flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "OfferCreate",
        TakerGets: "1000000",
        TakerPays: "2000000",
        Flags: { tfImmediateOrCancel: true, tfFillOrKill: false, tfSell: false },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toEqual(["tfImmediateOrCancel"])
    })
  })

  describe("TrustSet", () => {
    it("converts with no flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "TrustSet",
        LimitAmount: { currency: "EUR", issuer: "rIssuer", value: "1000" },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "TrustSet",
        limitAmount: {
          currency: { type: "Currency", code: "EUR", issuer: "rIssuer" },
          value: "1000",
        },
        flags: [],
      })
    })

    it("converts numeric flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "TrustSet",
        LimitAmount: { currency: "EUR", issuer: "rIssuer", value: "1000" },
        Flags: TrustSetFlags.tfSetFreeze | TrustSetFlags.tfSetfAuth,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toContain("tfSetFreeze")
      expect(op.flags).toContain("tfSetfAuth")
      expect(op.flags).not.toContain("tfClearFreeze")
    })
  })

  describe("AccountSet", () => {
    it("converts setFlag", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "AccountSet",
        SetFlag: AccountSetAsfFlags.asfRequireDest,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "AccountSet",
        setFlag: "asfRequireDest",
      })
    })

    it("converts clearFlag", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "AccountSet",
        ClearFlag: AccountSetAsfFlags.asfGlobalFreeze,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "AccountSet",
        clearFlag: "asfGlobalFreeze",
      })
    })

    it("converts transferRate", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "AccountSet",
        TransferRate: 1005000000,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toMatchObject({ type: "AccountSet", transferRate: 1005000000 })
    })

    it("throws for unsupported ASF flag", () => {
      const tx = {
        ...baseTx,
        TransactionType: "AccountSet",
        SetFlag: 999,
      }
      expect(() => batchToCustodyInnerTransactions(makeRawTransactions(tx as RawTx))).toThrow(
        "Unsupported AccountSet flag: 999",
      )
    })
  })

  describe("TicketCreate", () => {
    it("converts ticketCount", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "TicketCreate",
        TicketCount: 5,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({ type: "TicketCreate", ticketCount: 5 })
    })
  })

  describe("Clawback", () => {
    it("converts IOU clawback", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "Clawback",
        Amount: { currency: "USD", issuer: "rIssuer", value: "50" },
        Holder: "rHolder123",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "Clawback",
        currency: { type: "Currency", code: "USD", issuer: "rIssuer" },
        holder: { type: "Address", address: "rHolder123" },
        value: "50",
      })
    })

    it("converts MPT clawback", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "Clawback",
        Amount: { mpt_issuance_id: "00000001ABC123", value: "100" },
        Holder: "rHolder456",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "Clawback",
        currency: { type: "MultiPurposeToken", issuanceId: "00000001ABC123" },
        holder: { type: "Address", address: "rHolder456" },
        value: "100",
      })
    })
  })

  describe("DepositPreauth", () => {
    it("converts authorize", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "DepositPreauth",
        Authorize: "rAuthorized123",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "DepositPreauth",
        authorize: { type: "Address", address: "rAuthorized123" },
      })
    })

    it("converts unauthorize", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "DepositPreauth",
        Unauthorize: "rRemoved456",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "DepositPreauth",
        unauthorize: { type: "Address", address: "rRemoved456" },
      })
    })

    it("omits absent authorize/unauthorize fields", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "DepositPreauth",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).not.toHaveProperty("authorize")
      expect(result.operation).not.toHaveProperty("unauthorize")
    })
  })

  describe("EscrowFinish", () => {
    it("converts required fields only", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "EscrowFinish",
        Owner: "rOwner123",
        OfferSequence: 42,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "EscrowFinish",
        owner: { type: "Address", address: "rOwner123" },
        offerSequence: 42,
      })
    })

    it("converts optional condition, fulfillment, credentialIds", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "EscrowFinish",
        Owner: "rOwner123",
        OfferSequence: 7,
        Condition: "A0258020ABCD",
        Fulfillment: "A0228020EFGH",
        CredentialIDs: ["CRED1", "CRED2"],
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "EscrowFinish",
        owner: { type: "Address", address: "rOwner123" },
        offerSequence: 7,
        condition: "A0258020ABCD",
        fulfillment: "A0228020EFGH",
        credentialIds: ["CRED1", "CRED2"],
      })
    })
  })

  describe("MPTokenAuthorize", () => {
    it("converts with no flags and no holder", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenAuthorize",
        MPTokenIssuanceID: "00000001ISSUANCE",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "MPTokenAuthorize",
        tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "00000001ISSUANCE" },
        flags: [],
      })
    })

    it("converts numeric tfMPTUnauthorize flag", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenAuthorize",
        MPTokenIssuanceID: "00000001ISSUANCE",
        Flags: MPTokenAuthorizeFlags.tfMPTUnauthorize,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toContain("tfMPTUnauthorize")
    })

    it("converts object flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenAuthorize",
        MPTokenIssuanceID: "00000001ISSUANCE",
        Flags: { tfMPTUnauthorize: true },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toEqual(["tfMPTUnauthorize"])
    })

    it("includes holder when present", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenAuthorize",
        MPTokenIssuanceID: "00000001ISSUANCE",
        Holder: "rHolder789",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { holder: unknown }
      expect(op.holder).toEqual({ type: "Address", address: "rHolder789" })
    })
  })

  describe("MPTokenIssuanceCreate", () => {
    it("converts with no optional fields", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceCreate",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({ type: "MPTokenIssuanceCreate", flags: [] })
    })

    it("converts numeric flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceCreate",
        Flags:
          MPTokenIssuanceCreateFlags.tfMPTCanTransfer | MPTokenIssuanceCreateFlags.tfMPTCanClawback,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toContain("tfMPTCanTransfer")
      expect(op.flags).toContain("tfMPTCanClawback")
      expect(op.flags).not.toContain("tfMPTCanLock")
    })

    it("converts object flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceCreate",
        Flags: { tfMPTCanLock: true, tfMPTRequireAuth: true },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toEqual(["tfMPTCanLock", "tfMPTRequireAuth"])
    })

    it("converts all optional fields", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceCreate",
        AssetScale: 2,
        TransferFee: 500,
        MaximumAmount: "1000000000",
        MPTokenMetadata: "DEADBEEF",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toMatchObject({
        type: "MPTokenIssuanceCreate",
        assetScale: 2,
        transferFee: 500,
        maximumAmount: "1000000000",
        metadata: { type: "HexEncodedMetadata", value: "DEADBEEF" },
      })
    })
  })

  describe("MPTokenIssuanceDestroy", () => {
    it("converts tokenIdentifier", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceDestroy",
        MPTokenIssuanceID: "00000002DESTROY",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "MPTokenIssuanceDestroy",
        tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "00000002DESTROY" },
      })
    })
  })

  describe("MPTokenIssuanceSet", () => {
    it("converts with no optional holder", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceSet",
        MPTokenIssuanceID: "00000003SET",
        Flags: MPTokenIssuanceSetFlags.tfMPTLock,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "MPTokenIssuanceSet",
        tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "00000003SET" },
        flags: ["tfMPTLock"],
        mutableFlags: [],
      })
    })

    it("converts tfMPTUnlock flag", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceSet",
        MPTokenIssuanceID: "00000003SET",
        Flags: MPTokenIssuanceSetFlags.tfMPTUnlock,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toEqual(["tfMPTUnlock"])
    })

    it("converts object flags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceSet",
        MPTokenIssuanceID: "00000003SET",
        Flags: { tfMPTLock: true, tfMPTUnlock: false },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[] }
      expect(op.flags).toEqual(["tfMPTLock"])
    })

    it("includes holder when present", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceSet",
        MPTokenIssuanceID: "00000003SET",
        Flags: 0,
        Holder: "rHolderXYZ",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { holder: unknown }
      expect(op.holder).toEqual({ type: "Address", address: "rHolderXYZ" })
    })

    it("maps the tfMPTSetCanHoldConfidentialBalance bit onto mutableFlags", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceSet",
        MPTokenIssuanceID: "00000003SET",
        Flags:
          MPTokenIssuanceSetFlags.tfMPTLock |
          MPTokenIssuanceSetFlags.tfMPTSetCanHoldConfidentialBalance,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[]; mutableFlags: string[] }
      expect(op.flags).toEqual(["tfMPTLock"])
      expect(op.mutableFlags).toEqual(["MPTSetCanConfidentialAmount"])
    })

    it("maps the confidential flag from the object form too", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceSet",
        MPTokenIssuanceID: "00000003SET",
        Flags: { tfMPTSetCanHoldConfidentialBalance: true },
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { flags: string[]; mutableFlags: string[] }
      expect(op.flags).toEqual([])
      expect(op.mutableFlags).toEqual(["MPTSetCanConfidentialAmount"])
    })

    it("passes through the issuer and auditor encryption keys", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceSet",
        MPTokenIssuanceID: "00000003SET",
        Flags: 0,
        IssuerEncryptionKey: `02${"AB".repeat(32)}`,
        AuditorEncryptionKey: `03${"CD".repeat(32)}`,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as {
        issuerEncryptionKey: string
        auditorEncryptionKey: string
      }
      expect(op.issuerEncryptionKey).toBe(`02${"AB".repeat(32)}`)
      expect(op.auditorEncryptionKey).toBe(`03${"CD".repeat(32)}`)
    })

    it("omits the encryption keys when absent", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "MPTokenIssuanceSet",
        MPTokenIssuanceID: "00000003SET",
        Flags: 0,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).not.toHaveProperty("issuerEncryptionKey")
      expect(result.operation).not.toHaveProperty("auditorEncryptionKey")
    })
  })

  describe("ConfidentialMPTConvert", () => {
    it("maps the issuance and the plaintext amount", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "ConfidentialMPTConvert",
        MPTokenIssuanceID: "00000004CVT",
        MPTAmount: "1000",
        HolderEncryptedAmount: "AA",
        IssuerEncryptedAmount: "BB",
        BlindingFactor: "CC",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "ConfidentialMPTConvert",
        tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "00000004CVT" },
        amount: "1000",
      })
    })
  })

  describe("ConfidentialMPTConvertBack", () => {
    it("maps the issuance and the plaintext amount", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "ConfidentialMPTConvertBack",
        MPTokenIssuanceID: "00000005CVB",
        MPTAmount: "250",
        HolderEncryptedAmount: "AA",
        IssuerEncryptedAmount: "BB",
        BlindingFactor: "CC",
        ZKProof: "DD",
        BalanceCommitment: "EE",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "ConfidentialMPTConvertBack",
        tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "00000005CVB" },
        amount: "250",
      })
    })
  })

  describe("ConfidentialMPTMergeInbox", () => {
    it("maps the issuance only", () => {
      const tx: RawTx = {
        ...baseTx,
        TransactionType: "ConfidentialMPTMergeInbox",
        MPTokenIssuanceID: "00000006MRG",
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).toEqual({
        type: "ConfidentialMPTMergeInbox",
        tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "00000006MRG" },
      })
    })
  })

  describe("ConfidentialMPTSend", () => {
    const sendTx: RawTx = {
      ...baseTx,
      TransactionType: "ConfidentialMPTSend",
      MPTokenIssuanceID: "00000007SND",
      Destination: "rDestinationXYZ",
      SenderEncryptedAmount: "0102",
      DestinationEncryptedAmount: "0304",
      IssuerEncryptedAmount: "0506",
      ZKProof: "0708",
      AmountCommitment: "090A",
      BalanceCommitment: "0B0C",
    }

    it("maps the destination and base64-encodes the cryptographic fields", () => {
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(sendTx))
      expect(result.operation).toEqual({
        type: "ConfidentialMPTSend",
        tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "00000007SND" },
        destination: { type: "Address", address: "rDestinationXYZ" },
        cryptographicFields: {
          type: "Send",
          senderEncryptedAmount: Buffer.from("0102", "hex").toString("base64"),
          destinationEncryptedAmount: Buffer.from("0304", "hex").toString("base64"),
          issuerEncryptedAmount: Buffer.from("0506", "hex").toString("base64"),
          balanceCommitment: Buffer.from("0B0C", "hex").toString("base64"),
          amountCommitment: Buffer.from("090A", "hex").toString("base64"),
          zkProof: Buffer.from("0708", "hex").toString("base64"),
        },
      })
    })

    it("includes the auditor ciphertext when present", () => {
      const tx: RawTx = { ...sendTx, AuditorEncryptedAmount: "0D0E" }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      const op = result.operation as { cryptographicFields: { auditorEncryptedAmount: string } }
      expect(op.cryptographicFields.auditorEncryptedAmount).toBe(
        Buffer.from("0D0E", "hex").toString("base64"),
      )
    })

    it("drops the DestinationTag and CredentialIDs, which have no Custody counterpart", () => {
      const tx: RawTx = { ...sendTx, DestinationTag: 42, CredentialIDs: ["ABC"] }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.operation).not.toHaveProperty("destinationTag")
      expect(result.operation).not.toHaveProperty("credentialIds")
    })
  })

  describe("unsupported transaction type", () => {
    it("throws for unknown type", () => {
      const tx = {
        ...baseTx,
        TransactionType: "EscrowCreate",
      } as unknown as RawTx
      expect(() => batchToCustodyInnerTransactions(makeRawTransactions(tx))).toThrow(
        "Unsupported transaction type: EscrowCreate",
      )
    })
  })

  describe("sequencing", () => {
    it("uses Ticket sequencing when TicketSequence is present", () => {
      const tx: RawTx = {
        ...baseTx,
        Sequence: undefined,
        TransactionType: "TicketCreate",
        TicketCount: 1,
        TicketSequence: 10,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.sequencing).toEqual({ type: "Ticket", value: 10 })
    })

    it("falls back to AccountSequence value 0 when Sequence is undefined", () => {
      const tx: RawTx = {
        ...baseTx,
        Sequence: undefined,
        TransactionType: "TicketCreate",
        TicketCount: 1,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx))
      expect(result.sequencing).toEqual({ type: "AccountSequence", value: 0 })
    })
  })

  describe("participant vs submitter", () => {
    it("emits SubmitterOperation when inner Account matches outer Batch.Account", () => {
      const tx: RawTx = {
        ...baseTx,
        Account: SUBMITTER,
        TransactionType: "TicketCreate",
        TicketCount: 1,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx, SUBMITTER))
      expect(result).toEqual({
        type: "SubmitterOperation",
        sequencing: { type: "AccountSequence", value: 1 },
        operation: { type: "TicketCreate", ticketCount: 1 },
      })
      expect(result).not.toHaveProperty("participant")
    })

    it("emits ParticipantOperation when inner Account differs from outer Batch.Account", () => {
      const tx: RawTx = {
        ...baseTx,
        Account: "rParticipant999",
        TransactionType: "TicketCreate",
        TicketCount: 1,
      }
      const [result] = batchToCustodyInnerTransactions(makeRawTransactions(tx, SUBMITTER))
      expect(result).toEqual({
        type: "ParticipantOperation",
        participant: { type: "Address", address: "rParticipant999" },
        sequencing: { type: "AccountSequence", value: 1 },
        operation: { type: "TicketCreate", ticketCount: 1 },
      })
    })
  })
})

// ─── batchToCustodyBatchPayload ────────────────────────────────

const innerPaymentTx: RawTx = {
  ...baseTx,
  TransactionType: "Payment",
  Destination: "rDestination",
  Amount: "1000",
}

const makeBatch = (overrides: Partial<Batch> = {}): Batch => ({
  TransactionType: "Batch",
  Account: SUBMITTER,
  Flags: BatchFlags.tfAllOrNothing,
  RawTransactions: [{ RawTransaction: innerPaymentTx }],
  ...overrides,
})

describe("batchToCustodyBatchPayload", () => {
  describe("executionMode", () => {
    it.each([
      ["tfAllOrNothing", BatchFlags.tfAllOrNothing, "AllOrNothing"],
      ["tfOnlyOne", BatchFlags.tfOnlyOne, "OnlyOne"],
      ["tfUntilFailure", BatchFlags.tfUntilFailure, "UntilFailure"],
      ["tfIndependent", BatchFlags.tfIndependent, "Independent"],
    ])("maps numeric flag %s → %s", (_, flagValue, expected) => {
      const result = batchToCustodyBatchPayload(makeBatch({ Flags: flagValue as number }))
      expect(result.executionMode).toBe(expected)
    })

    it.each([
      [{ tfAllOrNothing: true }, "AllOrNothing"],
      [{ tfOnlyOne: true }, "OnlyOne"],
      [{ tfUntilFailure: true }, "UntilFailure"],
      [{ tfIndependent: true }, "Independent"],
    ])("maps object flag %j → %s", (flagObj, expected) => {
      const result = batchToCustodyBatchPayload(makeBatch({ Flags: flagObj as unknown as number }))
      expect(result.executionMode).toBe(expected)
    })

    it("throws when Flags is missing", () => {
      const batch = makeBatch()
      delete (batch as { Flags?: unknown }).Flags
      expect(() => batchToCustodyBatchPayload(batch)).toThrow(/Flags is required/)
    })

    it("throws when no execution-mode flag is set (numeric)", () => {
      expect(() => batchToCustodyBatchPayload(makeBatch({ Flags: 0 }))).toThrow(
        /does not set a recognized execution-mode flag/,
      )
    })

    it("throws when multiple execution-mode flags are set (numeric)", () => {
      expect(() =>
        batchToCustodyBatchPayload(
          makeBatch({ Flags: BatchFlags.tfAllOrNothing | BatchFlags.tfOnlyOne }),
        ),
      ).toThrow(/multiple execution-mode flags/)
    })

    it("throws when multiple execution-mode flags are set (object)", () => {
      expect(() =>
        batchToCustodyBatchPayload(
          makeBatch({
            Flags: { tfAllOrNothing: true, tfIndependent: true } as unknown as number,
          }),
        ),
      ).toThrow(/multiple execution-mode flags/)
    })
  })

  describe("sequencing", () => {
    it("maps Sequence to AccountSequence when present", () => {
      const result = batchToCustodyBatchPayload(makeBatch({ Sequence: 42 }))
      expect(result.sequencing).toEqual({ type: "AccountSequence", value: 42 })
    })

    it("omits sequencing when Sequence is absent (defers to service default)", () => {
      const batch = makeBatch()
      delete (batch as { Sequence?: number }).Sequence
      const result = batchToCustodyBatchPayload(batch)
      expect(result).not.toHaveProperty("sequencing")
    })
  })

  describe("lastLedgerSequence", () => {
    it("passes through when present", () => {
      const result = batchToCustodyBatchPayload(makeBatch({ LastLedgerSequence: 12345 }))
      expect(result.lastLedgerSequence).toBe(12345)
    })

    it("omits when absent", () => {
      const result = batchToCustodyBatchPayload(makeBatch())
      expect(result).not.toHaveProperty("lastLedgerSequence")
    })
  })

  it("preserves Account and converts entries via batchToCustodyInnerTransactions", () => {
    const submitterInner: RawTx = {
      ...baseTx,
      Account: SUBMITTER,
      TransactionType: "Payment",
      Destination: "rDest1",
      Amount: "500",
    }
    const participantInner: RawTx = {
      ...baseTx,
      Account: "rParticipant",
      TransactionType: "Payment",
      Destination: "rDest2",
      Amount: "750",
    }
    const result = batchToCustodyBatchPayload(
      makeBatch({
        RawTransactions: [{ RawTransaction: submitterInner }, { RawTransaction: participantInner }],
      }),
    )

    expect(result.Account).toBe(SUBMITTER)
    expect(result.entries).toHaveLength(2)
    expect(result.entries[0]!.type).toBe("SubmitterOperation")
    expect(result.entries[1]!.type).toBe("ParticipantOperation")
  })

  it("ignores BatchSigners on the input — collected separately for proposeBatch", () => {
    const result = batchToCustodyBatchPayload(
      makeBatch({
        BatchSigners: [
          {
            BatchSigner: {
              Account: "rIgnoredSigner",
              SigningPubKey: "PK",
              TxnSignature: "SIG",
            },
          },
        ],
      }),
    )
    expect(result).not.toHaveProperty("batchSigners")
  })
})
