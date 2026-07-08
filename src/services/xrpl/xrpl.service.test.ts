import { beforeEach, describe, expect, it, vi } from "vitest"
import type { SubmittableTransaction } from "xrpl"
import { CustodyError } from "../../models/index.js"
import {
  resolveExplicitCapabilities,
  UnsupportedInVersionError,
  VersionGuard,
} from "../../versioning/version-guard.js"
import type { XrplPorts } from "./xrpl.ports.js"
import { XrplService } from "./xrpl.service.js"
import type {
  BatchPayloadInput,
  Core_BatchSigner,
  Core_IntentDryRunResponse_v0_CreateTransactionOrder,
  IntentContext,
} from "./xrpl.types.js"

// Mock the xrpl encoding and hashing functions
vi.mock("xrpl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("xrpl")>()
  return {
    encodeForSigning: vi.fn().mockReturnValue("deadbeef01020304"),
    isValidAddress: actual.isValidAddress,
    //TODO: restore Batch mocks once Batch is supported
    // encodeForSigningBatch: vi.fn().mockReturnValue("batchencoded0102"),
    // hashes: {
    //   hashSignedTx: vi.fn().mockReturnValue("TXHASH0123456789"),
    // },
  }
})

// ── Test helpers ────────────────────────────────────────────────

const mockDomainId = "domain-123"
const mockUserId = "user-123"
const mockAccountId = "account-123"
const mockLedgerId = "ledger-123"
const mockAddress = "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"

const mockContext: IntentContext = {
  domainId: mockDomainId,
  userId: mockUserId,
  accountId: mockAccountId,
  ledgerId: mockLedgerId,
  address: mockAddress,
}

// Real secp256k1 SPKI/DER public key encoded as base64 (uncompressed)
const mockBase64PublicKey =
  "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEbGnS71yQ3IPhmUXe6HDWZzMkTibxMd69oH1WZAPWLDFcw4uSV5FktyG4s2TRpLDnBf71dpho3Z8kST3ZmhRBAA=="
const expectedCompressedKey = "026C69D2EF5C90DC83E19945DEE870D66733244E26F131DEBDA07D566403D62C31"

const mockBase64Signature = Buffer.from("aabbccdd", "hex").toString("base64")

const mockBatchSigningData = {
  signingPayload: "deadbeefcafebabe",
  signingPayloadHash: "0011223344556677",
  executionMode: "AllOrNothing" as const,
  transactions: [],
}

const mockDryRunResponse: Core_IntentDryRunResponse_v0_CreateTransactionOrder = {
  type: "v0_CreateTransactionOrder",
  success: true,
  result: { type: "Successful" } as any,
  estimate: {
    type: "XRPL",
    minimumCostInDrops: "10",
    fee: "12",
    batchSigningData: mockBatchSigningData,
  },
}

function createTestPorts(overrides: Partial<XrplPorts> = {}): XrplPorts {
  return {
    resolveContext: overrides.resolveContext ?? (async () => mockContext),
    submitIntent: overrides.submitIntent ?? (async () => ({ requestId: "request-123" }) as any),
    dryRunIntent: overrides.dryRunIntent ?? (async () => mockDryRunResponse),
    getManifest:
      overrides.getManifest ??
      (async () => ({
        data: { value: { type: "Unsafe" as const, signature: mockBase64Signature } },
      })),
    getAccount:
      overrides.getAccount ??
      (async () => ({
        data: {
          providerDetails: {
            type: "Vault" as const,
            keys: [
              {
                id: "SECP256K1_CUSTODY_1" as const,
                publicKey: { value: mockBase64PublicKey },
              },
            ],
          },
        },
      })),
  } as XrplPorts
}

// ── Tests ───────────────────────────────────────────────────────

describe("XrplService", () => {
  let service: XrplService
  let ports: XrplPorts

  beforeEach(() => {
    ports = createTestPorts()
    service = new XrplService(ports)
  })

  // ── proposeIntent ─────────────────────────────────────────────

  describe("proposeIntent", () => {
    it("should submit a Payment intent with correct structure", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "Payment",
          amount: "1000000",
          destination: { type: "Address", address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH" },
          destinationTag: 0,
        },
      })

      expect(capturedBody.request.author.domainId).toBe(mockDomainId)
      expect(capturedBody.request.author.id).toBe(mockUserId)
      expect(capturedBody.request.type).toBe("Propose")
      expect(capturedBody.request.payload.type).toBe("v0_CreateTransactionOrder")
      expect(capturedBody.request.payload.accountId).toBe(mockAccountId)
      expect(capturedBody.request.payload.ledgerId).toBe(mockLedgerId)
      expect(capturedBody.request.payload.parameters.type).toBe("XRPL")
      expect(capturedBody.request.payload.parameters.operation).toMatchObject({
        type: "Payment",
        amount: "1000000",
        destination: { type: "Address", address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH" },
        destinationTag: 0,
      })
      expect(capturedBody.request.payload.parameters.feeStrategy).toEqual({
        priority: "Low",
        type: "Priority",
      })
    })

    it("should submit a TrustSet intent", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "TrustSet",
          limitAmount: {
            currency: { type: "Currency", code: "USD", issuer: "rIssuer" },
            value: "1000",
          },
          flags: [],
        },
      })

      expect(capturedBody.request.payload.parameters.operation).toMatchObject({
        type: "TrustSet",
        limitAmount: {
          currency: { type: "Currency", code: "USD", issuer: "rIssuer" },
          value: "1000",
        },
      })
    })

    it("should submit a Clawback intent", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "Clawback",
          currency: { type: "Currency", code: "USD", issuer: "rIssuer" },
          holder: { type: "Address", address: "rHolder" },
          value: "50",
        },
      })

      expect(capturedBody.request.payload.parameters.operation.type).toBe("Clawback")
    })

    it("should submit a DepositPreauth intent", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "DepositPreauth",
          authorize: { type: "Address", address: "rAuthorize" },
        },
      })

      expect(capturedBody.request.payload.parameters.operation).toMatchObject({
        type: "DepositPreauth",
        authorize: { type: "Address", address: "rAuthorize" },
      })
    })

    it("should submit an MPTokenAuthorize intent", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "MPTokenAuthorize",
          tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "abc123" },
          flags: [],
        },
      })

      expect(capturedBody.request.payload.parameters.operation.type).toBe("MPTokenAuthorize")
    })

    it("should submit an OfferCreate intent", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "OfferCreate",
          takerGets: { amount: "1000000" },
          takerPays: {
            amount: "100",
            currency: { type: "Currency", code: "USD", issuer: "rIssuer" },
          },
          flags: ["tfSell"],
        },
      })

      expect(capturedBody.request.payload.parameters.operation.type).toBe("OfferCreate")
    })

    it("should submit an AccountSet intent", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent({
        Account: mockAddress,
        operation: { type: "AccountSet", setFlag: "asfRequireDest" },
      })

      expect(capturedBody.request.payload.parameters.operation).toMatchObject({
        type: "AccountSet",
        setFlag: "asfRequireDest",
      })
    })

    // TODO: Restore ticketCreate when it is in an official release
    // it("should submit a TicketCreate intent", async () => {
    //   let capturedBody: any
    //   ports = createTestPorts({
    //     submitIntent: async (body) => {
    //       capturedBody = body
    //       return { requestId: "request-123" } as any
    //     },
    //   })
    //   service = new XrplService(ports)

    //   await service.proposeIntent({
    //     Account: mockAddress,
    //     operation: { type: "TicketCreate", ticketCount: 5 },
    //   })

    //   expect(capturedBody.request.payload.parameters.operation).toMatchObject({
    //     type: "TicketCreate",
    //     ticketCount: 5,
    //   })
    // })

    //TODO: restore Batch intent test once Batch is supported
    // it("should submit a Batch intent", async () => {
    //   let capturedBody: any
    //   ports = createTestPorts({
    //     submitIntent: async (body) => {
    //       capturedBody = body
    //       return { requestId: "request-123" } as any
    //     },
    //   })
    //   service = new XrplService(ports)
    //
    //   await service.proposeIntent({
    //     Account: mockAddress,
    //     operation: {
    //       type: "Batch",
    //       executionMode: "AllOrNothing",
    //       batchSigners: [],
    //       innerTransactions: [],
    //     },
    //   })
    //
    //   expect(capturedBody.request.payload.parameters.operation.type).toBe("Batch")
    // })

    it("should submit MPTokenIssuanceCreate, MPTokenIssuanceSet, MPTokenIssuanceDestroy intents", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      // MPTokenIssuanceCreate
      await service.proposeIntent({
        Account: mockAddress,
        operation: { type: "MPTokenIssuanceCreate", flags: ["tfMPTCanTransfer"] },
      })
      expect(capturedBody.request.payload.parameters.operation.type).toBe("MPTokenIssuanceCreate")

      // MPTokenIssuanceSet
      await service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "MPTokenIssuanceSet",
          tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "abc" },
          flags: ["tfMPTLock"],
        },
      })
      expect(capturedBody.request.payload.parameters.operation.type).toBe("MPTokenIssuanceSet")

      // MPTokenIssuanceDestroy
      await service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "MPTokenIssuanceDestroy",
          tokenIdentifier: { type: "MPTokenIssuanceId", issuanceId: "abc" },
        },
      })
      expect(capturedBody.request.payload.parameters.operation.type).toBe("MPTokenIssuanceDestroy")
    })

    it("should apply custom options (feePriority, expiryDays, customProperties)", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent(
        {
          Account: mockAddress,
          operation: {
            type: "Payment",
            amount: "100",
            destination: { type: "Address", address: "rDest" },
          },
        },
        {
          feePriority: "High",
          expiryDays: 7,
          requestCustomProperties: { reference: "test-ref" },
          payloadCustomProperties: { note: "test" },
        },
      )

      expect(capturedBody.request.payload.parameters.feeStrategy.priority).toBe("High")
      expect(capturedBody.request.customProperties).toEqual({ reference: "test-ref" })
      expect(capturedBody.request.payload.customProperties).toEqual({ note: "test" })
      const expiryDate = new Date(capturedBody.request.expiryAt)
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() + 7)
      expect(Math.abs(expiryDate.getTime() - expectedDate.getTime())).toBeLessThan(1000)
    })

    it("should use provided requestId and payloadId", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeIntent(
        {
          Account: mockAddress,
          operation: {
            type: "Payment",
            amount: "100",
            destination: { type: "Address", address: "rDest" },
          },
        },
        { requestId: "custom-req-id", payloadId: "custom-pay-id" },
      )

      expect(capturedBody.request.id).toBe("custom-req-id")
      expect(capturedBody.request.payload.id).toBe("custom-pay-id")
    })

    it("should pass domainId to resolveContext", async () => {
      const resolveContext = vi.fn(async () => ({
        ...mockContext,
        domainId: "domain-456",
      }))
      ports = createTestPorts({ resolveContext })
      service = new XrplService(ports)

      await service.proposeIntent(
        {
          Account: mockAddress,
          operation: {
            type: "Payment",
            amount: "100",
            destination: { type: "Address", address: "rDest" },
          },
        },
        { domainId: "domain-456" },
      )

      expect(resolveContext).toHaveBeenCalledWith(mockAddress, {
        domainId: "domain-456",
        ledgerId: undefined,
      })
    })

    it("should propagate resolveContext errors", async () => {
      ports = createTestPorts({
        resolveContext: async () => {
          throw new CustodyError({ reason: "User has no login ID" })
        },
      })
      service = new XrplService(ports)

      await expect(
        service.proposeIntent({
          Account: mockAddress,
          operation: {
            type: "Payment",
            amount: "100",
            destination: { type: "Address", address: "rDest" },
          },
        }),
      ).rejects.toThrow("User has no login ID")
    })

    it("should propagate account not found errors", async () => {
      ports = createTestPorts({
        resolveContext: async () => {
          throw new CustodyError({ reason: `Account not found for address ${mockAddress}` })
        },
      })
      service = new XrplService(ports)

      await expect(
        service.proposeIntent({
          Account: mockAddress,
          operation: {
            type: "Payment",
            amount: "100",
            destination: { type: "Address", address: "rDest" },
          },
        }),
      ).rejects.toThrow(`Account not found for address ${mockAddress}`)
    })
  })

  // ── getPublicKey ──────────────────────────────────────────────

  describe("getPublicKey", () => {
    it("should return the compressed public key for a Vault account", async () => {
      const result = await service.getPublicKey({
        domainId: mockDomainId,
        accountId: mockAccountId,
      })
      expect(result).toBe(expectedCompressedKey)
    })

    it("should throw when the account is not a Vault account", async () => {
      ports = createTestPorts({
        getAccount: async () =>
          ({
            data: { providerDetails: { type: "External" } },
          }) as any,
      })
      service = new XrplService(ports)

      await expect(
        service.getPublicKey({ domainId: mockDomainId, accountId: mockAccountId }),
      ).rejects.toThrow("Account is not a Vault account")
    })

    it("should throw when SECP256K1_CUSTODY_1 key is not found", async () => {
      ports = createTestPorts({
        getAccount: async () =>
          ({
            data: {
              providerDetails: {
                type: "Vault",
                keys: [{ id: "ED25519_CUSTODY_1", publicKey: { value: "somekey" } }],
              },
            },
          }) as any,
      })
      service = new XrplService(ports)

      await expect(
        service.getPublicKey({ domainId: mockDomainId, accountId: mockAccountId }),
      ).rejects.toThrow("Public key not found for key ID SECP256K1_CUSTODY_1")
    })

    it("should throw when keys array is undefined", async () => {
      ports = createTestPorts({
        getAccount: async () =>
          ({
            data: { providerDetails: { type: "Vault" } },
          }) as any,
      })
      service = new XrplService(ports)

      await expect(
        service.getPublicKey({ domainId: mockDomainId, accountId: mockAccountId }),
      ).rejects.toThrow("Public key not found for key ID SECP256K1_CUSTODY_1")
    })

    it("should throw when the key exists but publicKey is undefined", async () => {
      ports = createTestPorts({
        getAccount: async () =>
          ({
            data: {
              providerDetails: {
                type: "Vault",
                keys: [{ id: "SECP256K1_CUSTODY_1" }],
              },
            },
          }) as any,
      })
      service = new XrplService(ports)

      await expect(
        service.getPublicKey({ domainId: mockDomainId, accountId: mockAccountId }),
      ).rejects.toThrow("Public key not found for key ID SECP256K1_CUSTODY_1")
    })
  })

  // ── rawSign ───────────────────────────────────────────────────

  describe("rawSign", () => {
    const mockXrplTransaction: SubmittableTransaction = {
      TransactionType: "Payment",
      Account: mockAddress,
      Destination: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      Amount: "1000000",
      Fee: "12",
      Sequence: 1,
    }

    it("should submit a raw sign intent with correct structure", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      const result = await service.rawSign(mockXrplTransaction)

      expect(result).toEqual({ requestId: "request-123" })
      expect(capturedBody.request.author.domainId).toBe(mockDomainId)
      expect(capturedBody.request.author.id).toBe(mockUserId)
      expect(capturedBody.request.type).toBe("Propose")
      expect(capturedBody.request.payload.type).toBe("v0_SignManifest")
      expect(capturedBody.request.payload.accountId).toBe(mockAccountId)
      expect(capturedBody.request.payload.ledgerId).toBe(mockLedgerId)
      expect(capturedBody.request.payload.content.type).toBe("Unsafe")
      // Verify base64 encoding
      const content = capturedBody.request.payload.content.value
      const decodedHex = Buffer.from(content, "base64").toString("hex")
      expect(decodedHex).toBe("deadbeef01020304")
    })

    it("should apply custom options", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.rawSign(mockXrplTransaction, {
        expiryDays: 7,
        requestCustomProperties: { reference: "raw-sign-test" },
      })

      expect(capturedBody.request.customProperties).toEqual({ reference: "raw-sign-test" })
    })

    it("should use provided requestId and payloadId", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.rawSign(mockXrplTransaction, {
        requestId: "custom-req",
        payloadId: "custom-pay",
      })

      expect(capturedBody.request.id).toBe("custom-req")
      expect(capturedBody.request.payload.id).toBe("custom-pay")
    })

    it("should pass domainId to resolveContext", async () => {
      const resolveContext = vi.fn(async () => ({
        ...mockContext,
        domainId: "domain-456",
        userId: "user-456",
      }))
      ports = createTestPorts({ resolveContext })
      service = new XrplService(ports)

      await service.rawSign(mockXrplTransaction, { domainId: "domain-456" })

      expect(resolveContext).toHaveBeenCalledWith(mockAddress, {
        domainId: "domain-456",
        ledgerId: undefined,
      })
    })

    it("should propagate resolveContext errors", async () => {
      ports = createTestPorts({
        resolveContext: async () => {
          throw new CustodyError({ reason: "User has no login ID" })
        },
      })
      service = new XrplService(ports)

      await expect(service.rawSign(mockXrplTransaction)).rejects.toThrow("User has no login ID")
    })
  })

  // ── rawSignAndWait ────────────────────────────────────────────

  describe("rawSignAndWait", () => {
    const mockXrplTransaction: SubmittableTransaction = {
      TransactionType: "Payment",
      Account: mockAddress,
      Destination: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      Amount: "1000000",
      Fee: "12",
      Sequence: 1,
    }

    it("should auto-set SigningPubKey and return signature", async () => {
      const tx = { ...mockXrplTransaction }
      const result = await service.rawSignAndWait(tx, {
        polling: { maxRetries: 1, intervalMs: 0 },
      })

      expect(result.signature).toBe("AABBCCDD")
      expect(result.signingPubKey).toBe(expectedCompressedKey)
      expect(tx.SigningPubKey).toBe(expectedCompressedKey)
      expect(result.signedTransaction.TxnSignature).toBe("AABBCCDD")
      expect(result.signedTransaction.SigningPubKey).toBe(expectedCompressedKey)
    })

    it("should not override SigningPubKey if already set", async () => {
      const getAccount = vi.fn()
      ports = createTestPorts({ getAccount })
      service = new XrplService(ports)

      const tx = { ...mockXrplTransaction, SigningPubKey: "EXISTING_PUB_KEY" }
      const result = await service.rawSignAndWait(tx, {
        polling: { maxRetries: 1, intervalMs: 0 },
      })

      expect(result.signingPubKey).toBe("EXISTING_PUB_KEY")
      expect(getAccount).not.toHaveBeenCalled()
      expect(result.signedTransaction.TxnSignature).toBe("AABBCCDD")
      expect(result.signedTransaction.SigningPubKey).toBe("EXISTING_PUB_KEY")
    })

    it("should throw CustodyError on timeout", async () => {
      ports = createTestPorts({
        getManifest: async () => ({ data: { value: undefined } }) as any,
      })
      service = new XrplService(ports)

      const tx = { ...mockXrplTransaction, SigningPubKey: "PK" }
      await expect(
        service.rawSignAndWait(tx, { polling: { maxRetries: 2, intervalMs: 0 } }),
      ).rejects.toThrow("Manifest signature not available after maximum retries")
    })

    it("should call onAttempt callback", async () => {
      let callCount = 0
      ports = createTestPorts({
        getManifest: async () => {
          callCount++
          if (callCount === 1) return { data: {} } as any
          return {
            data: { value: { type: "Unsafe" as const, signature: mockBase64Signature } },
          } as any
        },
      })
      service = new XrplService(ports)

      const onAttempt = vi.fn()
      const tx = { ...mockXrplTransaction, SigningPubKey: "PK" }
      await service.rawSignAndWait(tx, {
        polling: { maxRetries: 3, intervalMs: 0, onAttempt },
      })

      expect(onAttempt).toHaveBeenCalledWith(1)
      expect(onAttempt).toHaveBeenCalledWith(2)
      expect(onAttempt).toHaveBeenCalledTimes(2)
    })

    it("should retry on 404 manifest", async () => {
      let callCount = 0
      ports = createTestPorts({
        getManifest: async () => {
          callCount++
          if (callCount === 1) throw new CustodyError({ reason: "Not found" }, 404)
          return {
            data: { value: { type: "Unsafe" as const, signature: mockBase64Signature } },
          } as any
        },
      })
      service = new XrplService(ports)

      const tx = { ...mockXrplTransaction, SigningPubKey: "PK" }
      const result = await service.rawSignAndWait(tx, {
        polling: { maxRetries: 2, intervalMs: 0 },
      })

      expect(result.signature).toBe("AABBCCDD")
      expect(result.signedTransaction.TxnSignature).toBe("AABBCCDD")
    })

    it("should throw CustodyError if signerAccount is not a valid XRPL address", async () => {
      const tx = { ...mockXrplTransaction, SigningPubKey: "PK" }
      await expect(service.rawSignAndWait(tx, { signerAccount: "not-an-address" })).rejects.toThrow(
        "Invalid signerAccount address: not-an-address",
      )
    })

    it("should use signerAccount to resolve context and build intent", async () => {
      const signerAddress = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
      const signerContext: IntentContext = {
        ...mockContext,
        accountId: "signer-account-id",
        ledgerId: "signer-ledger-id",
        address: signerAddress,
      }
      const resolveContext = vi.fn(async () => signerContext)
      let capturedBody: any
      ports = createTestPorts({
        resolveContext,
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "r" } as any
        },
      })
      service = new XrplService(ports)

      const tx = { ...mockXrplTransaction, SigningPubKey: "EXISTING_PUB_KEY" }
      await service.rawSignAndWait(tx, {
        signerAccount: signerAddress,
        polling: { maxRetries: 1, intervalMs: 0 },
      })

      expect(resolveContext).toHaveBeenCalledWith(signerAddress, {
        domainId: undefined,
        ledgerId: undefined,
      })
      expect(capturedBody.request.payload.accountId).toBe("signer-account-id")
      expect(capturedBody.request.payload.ledgerId).toBe("signer-ledger-id")
    })

    it("should fetch SigningPubKey from signerAccount when not pre-set", async () => {
      const signerAddress = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
      const signerContext: IntentContext = {
        ...mockContext,
        accountId: "signer-account-id",
        address: signerAddress,
      }
      const resolveContext = vi.fn(async () => signerContext)
      const getAccount = vi.fn(
        async () =>
          ({
            data: {
              providerDetails: {
                type: "Vault" as const,
                keys: [
                  { id: "SECP256K1_CUSTODY_1" as const, publicKey: { value: mockBase64PublicKey } },
                ],
              },
            },
          }) as any,
      )
      ports = createTestPorts({ resolveContext, getAccount })
      service = new XrplService(ports)

      const tx = { ...mockXrplTransaction }
      const result = await service.rawSignAndWait(tx, {
        signerAccount: signerAddress,
        polling: { maxRetries: 1, intervalMs: 0 },
      })

      expect(getAccount).toHaveBeenCalledWith(signerContext.domainId, "signer-account-id")
      expect(result.signingPubKey).toBe(expectedCompressedKey)
    })
  })

  // ── dryRunBatch ───────────────────────────────────────────────

  describe("dryRunBatch", () => {
    const submitterAddress = "rSubmitterAddress"
    const batchPayload: BatchPayloadInput = {
      Account: submitterAddress,
      executionMode: "AllOrNothing",
      entries: [
        {
          type: "SubmitterOperation",
          sequencing: { type: "PlatformManaged" },
          operation: {
            type: "Payment",
            destination: { type: "Address", address: "rDestination" },
            amount: "1000",
          },
        },
      ],
    }

    it("returns batchSigningData from the dry-run estimate", async () => {
      const result = await service.dryRunBatch(batchPayload)
      expect(result).toEqual(mockBatchSigningData)
    })

    it("submits a v0_CreateTransactionOrder dry-run with empty batchSigners and PlatformManaged sequencing", async () => {
      let capturedBody: any
      ports = createTestPorts({
        dryRunIntent: async (body) => {
          capturedBody = body
          return mockDryRunResponse
        },
      })
      service = new XrplService(ports)

      await service.dryRunBatch(batchPayload)

      expect(capturedBody.payload.type).toBe("v0_CreateTransactionOrder")
      expect(capturedBody.payload.parameters.type).toBe("XRPL")
      const op = capturedBody.payload.parameters.operation
      expect(op.type).toBe("Batch")
      expect(op.batchSigners).toEqual([])
      expect(op.sequencing).toEqual({ type: "PlatformManaged" })
      expect(op.executionMode).toBe("AllOrNothing")
      expect(op.entries).toEqual(batchPayload.entries)
    })

    it("preserves caller-provided sequencing and lastLedgerSequence", async () => {
      let capturedBody: any
      ports = createTestPorts({
        dryRunIntent: async (body) => {
          capturedBody = body
          return mockDryRunResponse
        },
      })
      service = new XrplService(ports)

      await service.dryRunBatch({
        ...batchPayload,
        entries: [
          {
            type: "SubmitterOperation",
            sequencing: { type: "AccountSequence", value: 7 },
            operation: {
              type: "Payment",
              destination: { type: "Address", address: "rDestination" },
              amount: "1000",
            },
          },
        ],
        sequencing: { type: "AccountSequence", value: 42 },
        lastLedgerSequence: 999,
      })

      expect(capturedBody.payload.parameters.operation.sequencing).toEqual({
        type: "AccountSequence",
        value: 42,
      })
      expect(capturedBody.payload.parameters.operation.lastLedgerSequence).toBe(999)
    })

    it("throws when the dry run reports failure", async () => {
      ports = createTestPorts({
        dryRunIntent: async () => ({
          type: "v0_CreateTransactionOrder",
          success: false,
          errors: ["Insufficient XRP"],
          result: { type: "Failure" } as any,
          estimate: { type: "XRPL", minimumCostInDrops: "10", fee: "12" },
        }),
      })
      service = new XrplService(ports)

      await expect(service.dryRunBatch(batchPayload)).rejects.toThrow(/Insufficient XRP/)
    })

    it("throws when the response carries no batchSigningData", async () => {
      ports = createTestPorts({
        dryRunIntent: async () => ({
          type: "v0_CreateTransactionOrder",
          success: true,
          result: { type: "Successful" } as any,
          estimate: { type: "XRPL", minimumCostInDrops: "10", fee: "12" },
        }),
      })
      service = new XrplService(ports)

      await expect(service.dryRunBatch(batchPayload)).rejects.toThrow(/batchSigningData/)
    })

    it("rejects a mixed sequencing configuration before calling the dry-run port", async () => {
      const dryRunIntent = vi.fn(async () => mockDryRunResponse)
      ports = createTestPorts({ dryRunIntent })
      service = new XrplService(ports)

      await expect(
        service.dryRunBatch({
          ...batchPayload,
          sequencing: { type: "AccountSequence", value: 1 },
        }),
      ).rejects.toThrow(/Mixed configurations are not allowed/)
      expect(dryRunIntent).not.toHaveBeenCalled()
    })
  })

  // ── signBatchPayloadAndWait ───────────────────────────────────

  describe("signBatchPayloadAndWait", () => {
    it("signs the hex payload and returns both BatchSigner shapes", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "r-1" } as any
        },
      })
      service = new XrplService(ports)

      const result = await service.signBatchPayloadAndWait("deadbeef", mockAddress, {
        polling: { maxRetries: 1, intervalMs: 0 },
      })

      const expectedBase64 = Buffer.from("deadbeef", "hex").toString("base64")
      expect(capturedBody.request.payload.type).toBe("v0_SignManifest")
      expect(capturedBody.request.payload.content).toEqual({
        value: expectedBase64,
        type: "Unsafe",
      })

      expect(result.signature).toBe("AABBCCDD")
      expect(result.signingPubKey).toBe(expectedCompressedKey)
      expect(result.batchSigner).toEqual({
        BatchSigner: {
          Account: mockAddress,
          SigningPubKey: expectedCompressedKey,
          TxnSignature: "AABBCCDD",
        },
      })
      expect(result.custodyBatchSigner).toEqual({
        participant: { type: "Address", address: mockAddress },
        publicKey: expectedCompressedKey,
        signature: "AABBCCDD",
      })
    })

    it("skips the address lookup when accountId and ledgerId are provided", async () => {
      const resolveContext = vi.fn(async () => mockContext)
      ports = createTestPorts({ resolveContext })
      service = new XrplService(ports)

      await service.signBatchPayloadAndWait("deadbeef", mockAddress, {
        accountId: "explicit-account",
        ledgerId: "explicit-ledger",
        polling: { maxRetries: 1, intervalMs: 0 },
      })

      // Still resolves once to obtain domain/user context
      expect(resolveContext).toHaveBeenCalledTimes(1)
    })

    it("throws CustodyError when signerAddress is invalid", async () => {
      await expect(service.signBatchPayloadAndWait("deadbeef", "not-an-address")).rejects.toThrow(
        "Invalid signerAddress: not-an-address",
      )
    })

    it("throws CustodyError when the signature never arrives", async () => {
      ports = createTestPorts({
        getManifest: async () => ({ data: { value: undefined } }) as any,
      })
      service = new XrplService(ports)

      await expect(
        service.signBatchPayloadAndWait("deadbeef", mockAddress, {
          polling: { maxRetries: 2, intervalMs: 0 },
        }),
      ).rejects.toThrow("Manifest signature not available after maximum retries")
    })
  })

  // ── signBatchPayload ──────────────────────────────────────────

  describe("signBatchPayload", () => {
    it("proposes the sign intent and returns a handle without waiting", async () => {
      let capturedBody: any
      const getManifest = vi.fn(async () => ({
        data: { value: { type: "Unsafe" as const, signature: mockBase64Signature } },
      }))
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "r-1" } as any
        },
        getManifest,
      })
      service = new XrplService(ports)

      const handle = await service.signBatchPayload("deadbeef", mockAddress)

      const expectedBase64 = Buffer.from("deadbeef", "hex").toString("base64")
      expect(capturedBody.request.payload.type).toBe("v0_SignManifest")
      expect(capturedBody.request.payload.content).toEqual({
        value: expectedBase64,
        type: "Unsafe",
      })

      // Never polls the manifest
      expect(getManifest).not.toHaveBeenCalled()

      expect(handle.payloadId).toBe(capturedBody.request.payload.id)
      expect(handle.domainId).toBe(mockDomainId)
      expect(handle.accountId).toBe(mockAccountId)
      expect(handle.signerAddress).toBe(mockAddress)
      expect(handle.signingPubKey).toBe(expectedCompressedKey)
      expect(handle.intentResponse).toEqual({ requestId: "r-1" })
    })

    it("throws CustodyError when signerAddress is invalid", async () => {
      await expect(service.signBatchPayload("deadbeef", "not-an-address")).rejects.toThrow(
        "Invalid signerAddress: not-an-address",
      )
    })
  })

  // ── getBatchSignature ─────────────────────────────────────────

  describe("getBatchSignature", () => {
    const params = {
      payloadId: "payload-123",
      domainId: mockDomainId,
      accountId: mockAccountId,
      signerAddress: mockAddress,
      signingPubKey: expectedCompressedKey,
    }

    it("returns both BatchSigner shapes when the signature is available", async () => {
      const result = await service.getBatchSignature(params)

      expect(result).toEqual({
        signature: "AABBCCDD",
        signingPubKey: expectedCompressedKey,
        batchSigner: {
          BatchSigner: {
            Account: mockAddress,
            SigningPubKey: expectedCompressedKey,
            TxnSignature: "AABBCCDD",
          },
        },
        custodyBatchSigner: {
          participant: { type: "Address", address: mockAddress },
          publicKey: expectedCompressedKey,
          signature: "AABBCCDD",
        },
      })
    })

    it("fetches the manifest only once by default", async () => {
      const getManifest = vi.fn(async () => ({ data: { value: undefined } }) as any)
      ports = createTestPorts({ getManifest })
      service = new XrplService(ports)

      const result = await service.getBatchSignature(params)

      expect(result).toBeUndefined()
      expect(getManifest).toHaveBeenCalledTimes(1)
    })

    it("returns undefined on a 404 manifest", async () => {
      ports = createTestPorts({
        getManifest: async () => {
          throw new CustodyError({ reason: "not found" }, 404)
        },
      })
      service = new XrplService(ports)

      await expect(service.getBatchSignature(params)).resolves.toBeUndefined()
    })

    it("polls when maxRetries is provided", async () => {
      const getManifest = vi.fn(async () => ({ data: { value: undefined } }) as any)
      ports = createTestPorts({ getManifest })
      service = new XrplService(ports)

      const result = await service.getBatchSignature(params, { maxRetries: 3, intervalMs: 0 })

      expect(result).toBeUndefined()
      expect(getManifest).toHaveBeenCalledTimes(3)
    })
  })

  // ── proposeBatch ──────────────────────────────────────────────

  describe("proposeBatch", () => {
    const submitterAddress = "rSubmitterAddress"
    const batchPayload: BatchPayloadInput = {
      Account: submitterAddress,
      executionMode: "AllOrNothing",
      entries: [
        {
          type: "SubmitterOperation",
          sequencing: { type: "PlatformManaged" },
          operation: {
            type: "Payment",
            destination: { type: "Address", address: "rDestination" },
            amount: "1000",
          },
        },
      ],
    }
    const batchSigners: Core_BatchSigner[] = [
      {
        participant: { type: "Address", address: "rParticipant" },
        publicKey: "PK",
        signature: "SIG",
      },
    ]

    it("submits a v0_CreateTransactionOrder propose with the provided batchSigners", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeBatch(batchPayload, batchSigners)

      expect(capturedBody.request.type).toBe("Propose")
      expect(capturedBody.request.payload.type).toBe("v0_CreateTransactionOrder")
      const op = capturedBody.request.payload.parameters.operation
      expect(op.type).toBe("Batch")
      expect(op.batchSigners).toEqual(batchSigners)
      expect(op.sequencing).toEqual({ type: "PlatformManaged" })
    })

    it("passes domainId and ledgerId to resolveContext", async () => {
      const resolveContext = vi.fn(async () => mockContext)
      ports = createTestPorts({ resolveContext })
      service = new XrplService(ports)

      await service.proposeBatch(batchPayload, batchSigners, {
        domainId: "domain-456",
        ledgerId: "ledger-456",
      })

      expect(resolveContext).toHaveBeenCalledWith(submitterAddress, {
        domainId: "domain-456",
        ledgerId: "ledger-456",
      })
    })

    it("reuses caller-provided requestId and payloadId for dry-run/propose pairing", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.proposeBatch(batchPayload, batchSigners, {
        requestId: "shared-request",
        payloadId: "shared-payload",
      })

      expect(capturedBody.request.id).toBe("shared-request")
      expect(capturedBody.request.payload.id).toBe("shared-payload")
    })

    it("rejects a mixed sequencing configuration before calling the submit port", async () => {
      const submitIntent = vi.fn(async () => ({ requestId: "request-123" }) as any)
      ports = createTestPorts({ submitIntent })
      service = new XrplService(ports)

      await expect(
        service.proposeBatch(
          { ...batchPayload, sequencing: { type: "AccountSequence", value: 1 } },
          batchSigners,
        ),
      ).rejects.toThrow(/Mixed configurations are not allowed/)
      expect(submitIntent).not.toHaveBeenCalled()
    })
  })
})

describe("XrplService version gating", () => {
  const guardFor = (version: string) => new VersionGuard(resolveExplicitCapabilities(version))

  const batchPayload: BatchPayloadInput = {
    Account: mockAddress,
    executionMode: "AllOrNothing",
    entries: [
      {
        type: "SubmitterOperation",
        sequencing: { type: "PlatformManaged" },
        operation: {
          type: "Payment",
          destination: { type: "Address", address: "rDestination" },
          amount: "1000",
        },
      },
    ],
  }

  it("blocks proposeBatch on a version without the Batch feature (1.35.4)", async () => {
    const submitIntent = vi.fn(async () => ({ requestId: "r" }) as any)
    const service = new XrplService(createTestPorts({ submitIntent }), guardFor("1.35.4"))

    await expect(service.proposeBatch(batchPayload, [])).rejects.toBeInstanceOf(
      UnsupportedInVersionError,
    )
    expect(submitIntent).not.toHaveBeenCalled()
  })

  it("allows proposeBatch on a version with the Batch feature (1.35.0)", async () => {
    const submitIntent = vi.fn(async () => ({ requestId: "r" }) as any)
    const service = new XrplService(createTestPorts({ submitIntent }), guardFor("1.35.0"))

    await expect(service.proposeBatch(batchPayload, [])).resolves.toBeDefined()
    expect(submitIntent).toHaveBeenCalled()
  })

  it("blocks dryRunBatch on 1.35.4 before hitting the dry-run port", async () => {
    const dryRunIntent = vi.fn(async () => mockDryRunResponse)
    const service = new XrplService(createTestPorts({ dryRunIntent }), guardFor("1.35.4"))

    await expect(service.dryRunBatch(batchPayload)).rejects.toBeInstanceOf(
      UnsupportedInVersionError,
    )
    expect(dryRunIntent).not.toHaveBeenCalled()
  })

  it("blocks proposeIntent carrying a Batch operation on 1.35.4", async () => {
    const submitIntent = vi.fn(async () => ({ requestId: "r" }) as any)
    const service = new XrplService(createTestPorts({ submitIntent }), guardFor("1.35.4"))

    await expect(
      service.proposeIntent({ Account: mockAddress, operation: { type: "Batch" } as any }),
    ).rejects.toBeInstanceOf(UnsupportedInVersionError)
    expect(submitIntent).not.toHaveBeenCalled()
  })

  it("allows proposeIntent with a Payment operation on 1.35.4", async () => {
    const service = new XrplService(createTestPorts(), guardFor("1.35.4"))

    await expect(
      service.proposeIntent({
        Account: mockAddress,
        operation: {
          type: "Payment",
          amount: "1000000",
          destination: { type: "Address", address: mockAddress },
          destinationTag: 0,
        },
      }),
    ).resolves.toBeDefined()
  })

  it("never gates rawSign", async () => {
    const service = new XrplService(createTestPorts(), guardFor("1.35.4"))

    await expect(
      service.rawSign({
        TransactionType: "Payment",
        Account: mockAddress,
        Amount: "1000",
        Destination: mockAddress,
      } as SubmittableTransaction),
    ).resolves.toBeDefined()
  })
})
