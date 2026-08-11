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

const mockElGamalKey = Buffer.from("0102030405060708", "hex").toString("base64")
const mockIssuanceId = "00000C1EC6D1B4AB2CA3E5F9B85C7E1F8D2A3B4C5D6E7F80"
const mockTransactionId = "d3c2f1a0-1234-4b5c-8d9e-0f1a2b3c4d5e"

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
            purposeKeys: [
              { ledgerId: mockLedgerId, purpose: "ElGamal" as const, publicKey: mockElGamalKey },
            ],
          },
        },
      })),
    listTransactions:
      overrides.listTransactions ?? (async () => ({ items: [{ id: mockTransactionId }] }) as any),
    getTransaction:
      overrides.getTransaction ??
      (async () =>
        ({
          id: mockTransactionId,
          ledgerTransactionData: {
            ledgerData: {
              type: "Xrpl" as const,
              tokenData: { issuanceId: mockIssuanceId },
            },
          },
        }) as any),
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
    it("rejects an invalid Account before calling the submit port", async () => {
      const submitIntent = vi.fn(async () => ({ requestId: "request-123" }) as any)
      ports = createTestPorts({ submitIntent })
      service = new XrplService(ports)

      await expect(
        service.proposeIntent({
          Account: "not-an-address",
          operation: {
            type: "Payment",
            amount: "1000000",
            destination: { type: "Address", address: mockAddress },
          },
        }),
      ).rejects.toThrow("Invalid address: not-an-address")
      expect(submitIntent).not.toHaveBeenCalled()
    })

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
      const result = await service.getPublicKey(mockAddress)
      expect(result).toBe(expectedCompressedKey)
    })

    it("should resolve domain and account from the address", async () => {
      let capturedAddress: string | undefined
      let capturedOpts: any
      let capturedAccountLookup: [string, string] | undefined
      ports = createTestPorts({
        resolveContext: async (address, opts) => {
          capturedAddress = address
          capturedOpts = opts
          return mockContext
        },
        getAccount: async (domainId, accountId) => {
          capturedAccountLookup = [domainId, accountId]
          return {
            data: {
              providerDetails: {
                type: "Vault",
                keys: [{ id: "SECP256K1_CUSTODY_1", publicKey: { value: mockBase64PublicKey } }],
              },
            },
          } as any
        },
      })
      service = new XrplService(ports)

      await service.getPublicKey(mockAddress, {
        domainId: mockDomainId,
        ledgerId: mockLedgerId,
      })

      expect(capturedAddress).toBe(mockAddress)
      expect(capturedOpts).toEqual({ domainId: mockDomainId, ledgerId: mockLedgerId })
      expect(capturedAccountLookup).toEqual([mockDomainId, mockAccountId])
    })

    it("should throw before any request when the address is invalid", async () => {
      let resolveCalled = false
      ports = createTestPorts({
        resolveContext: async () => {
          resolveCalled = true
          return mockContext
        },
      })
      service = new XrplService(ports)

      await expect(service.getPublicKey("not-an-address")).rejects.toThrow(
        "Invalid address: not-an-address",
      )
      expect(resolveCalled).toBe(false)
    })

    it("should throw when the account is not a Vault account", async () => {
      ports = createTestPorts({
        getAccount: async () =>
          ({
            data: { providerDetails: { type: "External" } },
          }) as any,
      })
      service = new XrplService(ports)

      await expect(service.getPublicKey(mockAddress)).rejects.toThrow(
        "Account is not a Vault account",
      )
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

      await expect(service.getPublicKey(mockAddress)).rejects.toThrow(
        "Public key not found for key ID SECP256K1_CUSTODY_1",
      )
    })

    it("should throw when keys array is undefined", async () => {
      ports = createTestPorts({
        getAccount: async () =>
          ({
            data: { providerDetails: { type: "Vault" } },
          }) as any,
      })
      service = new XrplService(ports)

      await expect(service.getPublicKey(mockAddress)).rejects.toThrow(
        "Public key not found for key ID SECP256K1_CUSTODY_1",
      )
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

      await expect(service.getPublicKey(mockAddress)).rejects.toThrow(
        "Public key not found for key ID SECP256K1_CUSTODY_1",
      )
    })
  })

  // ── provisionElGamalKeyPair ───────────────────────────────────

  describe("provisionElGamalKeyPair", () => {
    it("should submit a v0_ProvisionElGamalKeyPair intent with correct structure", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.provisionElGamalKeyPair(mockAddress)

      expect(capturedBody.request.type).toBe("Propose")
      expect(capturedBody.request.author).toEqual({ domainId: mockDomainId, id: mockUserId })
      expect(capturedBody.request.targetDomainId).toBe(mockDomainId)
      expect(capturedBody.request.payload).toEqual({
        accountId: mockAccountId,
        ledgerId: mockLedgerId,
        type: "v0_ProvisionElGamalKeyPair",
      })
    })

    it("should carry no payload id, fee strategy or parameters", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      // The payload id option belongs to transaction orders; this intent has no
      // such field, so passing one must not leak into the payload.
      await service.provisionElGamalKeyPair(mockAddress, { payloadId: "payload-123" })

      expect(capturedBody.request.payload).not.toHaveProperty("id")
      expect(capturedBody.request.payload).not.toHaveProperty("parameters")
    })

    it("should honour requestId and description on the envelope", async () => {
      let capturedBody: any
      ports = createTestPorts({
        submitIntent: async (body) => {
          capturedBody = body
          return { requestId: "request-123" } as any
        },
      })
      service = new XrplService(ports)

      await service.provisionElGamalKeyPair(mockAddress, {
        requestId: "request-abc",
        description: "Provision issuer ElGamal key",
      })

      expect(capturedBody.request.id).toBe("request-abc")
      expect(capturedBody.request.description).toBe("Provision issuer ElGamal key")
    })

    it("should propagate resolveContext failures", async () => {
      ports = createTestPorts({
        resolveContext: async () => {
          throw new CustodyError({ reason: "Account not found for address" })
        },
      })
      service = new XrplService(ports)

      await expect(service.provisionElGamalKeyPair(mockAddress)).rejects.toThrow(
        "Account not found for address",
      )
    })

    it("should throw before any request when the address is invalid", async () => {
      let resolveCalled = false
      ports = createTestPorts({
        resolveContext: async () => {
          resolveCalled = true
          return mockContext
        },
      })
      service = new XrplService(ports)

      await expect(service.provisionElGamalKeyPair("not-an-address")).rejects.toThrow(
        "Invalid address: not-an-address",
      )
      expect(resolveCalled).toBe(false)
    })
  })

  // ── getElGamalPublicKey ───────────────────────────────────────

  describe("getElGamalPublicKey", () => {
    it("should return the base64 ElGamal key for the ledger unchanged", async () => {
      const result = await service.getElGamalPublicKey(mockAddress)

      expect(result).toBe(mockElGamalKey)
    })

    it("should resolve domain, account and ledger from the address", async () => {
      let capturedAddress: string | undefined
      let capturedOpts: any
      let capturedAccountLookup: [string, string] | undefined
      ports = createTestPorts({
        resolveContext: async (address, opts) => {
          capturedAddress = address
          capturedOpts = opts
          return mockContext
        },
        getAccount: async (domainId, accountId) => {
          capturedAccountLookup = [domainId, accountId]
          return {
            data: {
              providerDetails: {
                type: "Vault",
                purposeKeys: [
                  { ledgerId: mockLedgerId, purpose: "ElGamal", publicKey: mockElGamalKey },
                ],
              },
            },
          } as any
        },
      })
      service = new XrplService(ports)

      await service.getElGamalPublicKey(mockAddress, {
        domainId: mockDomainId,
        ledgerId: mockLedgerId,
      })

      expect(capturedAddress).toBe(mockAddress)
      expect(capturedOpts).toEqual({ domainId: mockDomainId, ledgerId: mockLedgerId })
      expect(capturedAccountLookup).toEqual([mockDomainId, mockAccountId])
    })

    it("should throw before any request when the address is invalid", async () => {
      let resolveCalled = false
      ports = createTestPorts({
        resolveContext: async () => {
          resolveCalled = true
          return mockContext
        },
      })
      service = new XrplService(ports)

      await expect(service.getElGamalPublicKey("not-an-address")).rejects.toThrow(
        "Invalid address: not-an-address",
      )
      expect(resolveCalled).toBe(false)
    })

    it("should propagate resolveContext failures for an ambiguous address", async () => {
      ports = createTestPorts({
        resolveContext: async () => {
          throw new CustodyError({
            reason: `Multiple accounts found for address ${mockAddress}. Please specify ledgerId and/or domainId to disambiguate.`,
          })
        },
      })
      service = new XrplService(ports)

      await expect(service.getElGamalPublicKey(mockAddress)).rejects.toThrow(
        "Multiple accounts found for address",
      )
    })

    it("should select the key matching the resolved ledger", async () => {
      ports = createTestPorts({
        getAccount: async () =>
          ({
            data: {
              providerDetails: {
                type: "Vault",
                purposeKeys: [
                  { ledgerId: "other-ledger", purpose: "ElGamal", publicKey: "othercCg=" },
                  { ledgerId: mockLedgerId, purpose: "ElGamal", publicKey: mockElGamalKey },
                ],
              },
            },
          }) as any,
      })
      service = new XrplService(ports)

      const result = await service.getElGamalPublicKey(mockAddress)

      expect(result).toBe(mockElGamalKey)
    })

    it("should throw when the account is not a Vault account", async () => {
      ports = createTestPorts({
        getAccount: async () =>
          ({
            data: { providerDetails: { type: "External" } },
          }) as any,
      })
      service = new XrplService(ports)

      await expect(service.getElGamalPublicKey(mockAddress)).rejects.toThrow(
        "Account is not a Vault account",
      )
    })

    it("should throw when no ElGamal key is provisioned for that ledger", async () => {
      ports = createTestPorts({
        resolveContext: async () => ({ ...mockContext, ledgerId: "another-ledger" }),
      })
      service = new XrplService(ports)

      await expect(service.getElGamalPublicKey(mockAddress)).rejects.toThrow(
        "No ElGamal key provisioned for account",
      )
    })
  })

  // ── findElGamalPublicKey ──────────────────────────────────────

  describe("findElGamalPublicKey", () => {
    it("should return the key when one is provisioned for the resolved ledger", async () => {
      const result = await service.findElGamalPublicKey(mockAddress)

      expect(result).toBe(mockElGamalKey)
    })

    it("should return undefined rather than throw when no key is provisioned", async () => {
      ports = createTestPorts({
        resolveContext: async () => ({ ...mockContext, ledgerId: "another-ledger" }),
      })
      service = new XrplService(ports)

      await expect(service.findElGamalPublicKey(mockAddress)).resolves.toBeUndefined()
    })

    it("should still throw for an invalid address, before any request", async () => {
      let resolveCalled = false
      ports = createTestPorts({
        resolveContext: async () => {
          resolveCalled = true
          return mockContext
        },
      })
      service = new XrplService(ports)

      await expect(service.findElGamalPublicKey("not-an-address")).rejects.toThrow(
        "Invalid address: not-an-address",
      )
      expect(resolveCalled).toBe(false)
    })

    it("should still throw when the account is not a Vault account", async () => {
      ports = createTestPorts({
        getAccount: async () => ({ data: { providerDetails: { type: "External" } } }) as any,
      })
      service = new XrplService(ports)

      await expect(service.findElGamalPublicKey(mockAddress)).rejects.toThrow(
        "Account is not a Vault account",
      )
    })
  })

  // ── getElGamalPublicKeyAndWait ────────────────────────────────

  describe("getElGamalPublicKeyAndWait", () => {
    /** An account whose vault has not written the ElGamal key yet. */
    const noKeyYet = { data: { providerDetails: { type: "Vault", purposeKeys: [] } } } as any

    it("should return the key without polling when it is already readable", async () => {
      let calls = 0
      ports = createTestPorts({
        getAccount: async () => {
          calls++
          return {
            data: {
              providerDetails: {
                type: "Vault",
                purposeKeys: [
                  { ledgerId: mockLedgerId, purpose: "ElGamal", publicKey: mockElGamalKey },
                ],
              },
            },
          } as any
        },
      })
      service = new XrplService(ports)

      const result = await service.getElGamalPublicKeyAndWait(mockAddress, {
        maxRetries: 3,
        intervalMs: 0,
      })

      expect(result).toBe(mockElGamalKey)
      expect(calls).toBe(1)
    })

    it("should keep polling until the vault has written the key", async () => {
      const accounts = [
        noKeyYet,
        noKeyYet,
        {
          data: {
            providerDetails: {
              type: "Vault",
              purposeKeys: [
                { ledgerId: mockLedgerId, purpose: "ElGamal", publicKey: mockElGamalKey },
              ],
            },
          },
        } as any,
      ]
      const onAttempt = vi.fn()
      ports = createTestPorts({ getAccount: async () => accounts.shift() })
      service = new XrplService(ports)

      const result = await service.getElGamalPublicKeyAndWait(mockAddress, {
        maxRetries: 5,
        intervalMs: 0,
        onAttempt,
      })

      expect(result).toBe(mockElGamalKey)
      expect(onAttempt).toHaveBeenCalledTimes(3)
    })

    it("should resolve the address once, not on every attempt", async () => {
      let resolveCalls = 0
      ports = createTestPorts({
        resolveContext: async () => {
          resolveCalls++
          return mockContext
        },
        getAccount: async () => noKeyYet,
      })
      service = new XrplService(ports)

      await expect(
        service.getElGamalPublicKeyAndWait(mockAddress, { maxRetries: 3, intervalMs: 0 }),
      ).rejects.toThrow("after 3 attempts")
      expect(resolveCalls).toBe(1)
    })

    it("should name the account and ledger when retries are exhausted", async () => {
      ports = createTestPorts({ getAccount: async () => noKeyYet })
      service = new XrplService(ports)

      await expect(
        service.getElGamalPublicKeyAndWait(mockAddress, { maxRetries: 2, intervalMs: 0 }),
      ).rejects.toThrow(
        `No ElGamal key provisioned for account ${mockAccountId} (${mockAddress}) on ledger ${mockLedgerId} after 2 attempts.`,
      )
    })

    it("should throw before any request when the address is invalid", async () => {
      let resolveCalled = false
      ports = createTestPorts({
        resolveContext: async () => {
          resolveCalled = true
          return mockContext
        },
      })
      service = new XrplService(ports)

      await expect(service.getElGamalPublicKeyAndWait("not-an-address")).rejects.toThrow(
        "Invalid address: not-an-address",
      )
      expect(resolveCalled).toBe(false)
    })

    it("should surface a transport failure rather than retrying it away", async () => {
      let calls = 0
      ports = createTestPorts({
        getAccount: async () => {
          calls++
          throw new CustodyError({ reason: "Unauthorized" }, 401)
        },
      })
      service = new XrplService(ports)

      await expect(
        service.getElGamalPublicKeyAndWait(mockAddress, { maxRetries: 3, intervalMs: 0 }),
      ).rejects.toThrow("Unauthorized")
      expect(calls).toBe(1)
    })
  })

  // ── getMptIssuanceId ──────────────────────────────────────────

  describe("getMptIssuanceId", () => {
    it("should query the domain's transactions by order reference", async () => {
      let capturedDomainId: string | undefined
      let capturedQuery: any
      ports = createTestPorts({
        listTransactions: async (domainId, query) => {
          capturedDomainId = domainId
          capturedQuery = query
          return { items: [{ id: mockTransactionId }] } as any
        },
      })
      service = new XrplService(ports)

      const result = await service.getMptIssuanceId({
        domainId: mockDomainId,
        payloadId: "payload-123",
      })

      expect(capturedDomainId).toBe(mockDomainId)
      expect(capturedQuery).toEqual({ "orderReference.Id": "payload-123" })
      expect(result).toBe(mockIssuanceId)
    })

    it("should read the ledger data off the transaction detail, not the collection", async () => {
      let capturedDomainId: string | undefined
      let capturedTransactionId: string | undefined
      ports = createTestPorts({
        getTransaction: async (domainId, transactionId) => {
          capturedDomainId = domainId
          capturedTransactionId = transactionId
          return {
            ledgerTransactionData: {
              ledgerData: { type: "Xrpl", tokenData: { issuanceId: mockIssuanceId } },
            },
          } as any
        },
      })
      service = new XrplService(ports)

      const result = await service.getMptIssuanceId({
        domainId: mockDomainId,
        payloadId: "payload-123",
      })

      expect(capturedDomainId).toBe(mockDomainId)
      expect(capturedTransactionId).toBe(mockTransactionId)
      expect(result).toBe(mockIssuanceId)
    })

    it("should keep looking when an earlier transaction carries no token data", async () => {
      const details: Record<string, any> = {
        "tx-transfer": { ledgerTransactionData: { ledgerData: { type: "Xrpl" } } },
        "tx-issuance": {
          ledgerTransactionData: {
            ledgerData: { type: "Xrpl", tokenData: { issuanceId: mockIssuanceId } },
          },
        },
      }
      ports = createTestPorts({
        listTransactions: async () =>
          ({ items: [{ id: "tx-transfer" }, { id: "tx-issuance" }] }) as any,
        getTransaction: async (_domainId, transactionId) => details[transactionId],
      })
      service = new XrplService(ports)

      const result = await service.getMptIssuanceId({
        domainId: mockDomainId,
        payloadId: "payload-123",
      })

      expect(result).toBe(mockIssuanceId)
    })

    it("should throw when the order has registered no transaction", async () => {
      ports = createTestPorts({ listTransactions: async () => ({ items: [] }) as any })
      service = new XrplService(ports)

      await expect(
        service.getMptIssuanceId({ domainId: mockDomainId, payloadId: "payload-123" }),
      ).rejects.toThrow("No transaction registered for transaction order payload-123")
    })

    it("should throw when the transaction is not yet on-chain", async () => {
      ports = createTestPorts({ getTransaction: async () => ({}) as any })
      service = new XrplService(ports)

      await expect(
        service.getMptIssuanceId({ domainId: mockDomainId, payloadId: "payload-123" }),
      ).rejects.toThrow("carries no MPT issuance ID")
    })

    it("should throw when the transaction carries no token data", async () => {
      ports = createTestPorts({
        getTransaction: async () =>
          ({ ledgerTransactionData: { ledgerData: { type: "Xrpl" } } }) as any,
      })
      service = new XrplService(ports)

      await expect(
        service.getMptIssuanceId({ domainId: mockDomainId, payloadId: "payload-123" }),
      ).rejects.toThrow("carries no MPT issuance ID")
    })
  })

  // ── getMptIssuanceIdAndWait ───────────────────────────────────

  describe("getMptIssuanceIdAndWait", () => {
    /** Detail response for a transaction carrying the issuance the ledger minted. */
    const onChain = {
      ledgerTransactionData: {
        ledgerData: { type: "Xrpl", tokenData: { issuanceId: mockIssuanceId } },
      },
    } as any

    it("should return the issuance ID without polling when it is already readable", async () => {
      let calls = 0
      ports = createTestPorts({
        getTransaction: async () => {
          calls++
          return onChain
        },
      })
      service = new XrplService(ports)

      const result = await service.getMptIssuanceIdAndWait(
        { domainId: mockDomainId, payloadId: "payload-123" },
        { maxRetries: 3, intervalMs: 0 },
      )

      expect(result).toBe(mockIssuanceId)
      expect(calls).toBe(1)
    })

    it("should keep polling until the transaction is registered with its ledger data", async () => {
      const listResponses = [{ items: [] } as any, { items: [{ id: mockTransactionId }] } as any]
      const details = [{} as any, onChain] // registered, ledger data not filled in yet
      const onAttempt = vi.fn()
      ports = createTestPorts({
        listTransactions: async () =>
          listResponses.shift() ?? { items: [{ id: mockTransactionId }] },
        getTransaction: async () => details.shift(),
      })
      service = new XrplService(ports)

      const result = await service.getMptIssuanceIdAndWait(
        { domainId: mockDomainId, payloadId: "payload-123" },
        { maxRetries: 5, intervalMs: 0, onAttempt },
      )

      expect(result).toBe(mockIssuanceId)
      expect(onAttempt).toHaveBeenCalledTimes(3)
    })

    it("should throw with the last observed reason when retries are exhausted", async () => {
      ports = createTestPorts({ getTransaction: async () => ({}) as any })
      service = new XrplService(ports)

      await expect(
        service.getMptIssuanceIdAndWait(
          { domainId: mockDomainId, payloadId: "payload-123" },
          { maxRetries: 2, intervalMs: 0 },
        ),
      ).rejects.toThrow(
        "No MPT issuance ID for transaction order payload-123 after 2 attempts. " +
          "Transaction order payload-123 carries no MPT issuance ID.",
      )
    })

    it("should surface a transport failure rather than retrying it away", async () => {
      ports = createTestPorts({
        listTransactions: async () => {
          throw new CustodyError({ reason: "Unauthorized" }, 401)
        },
      })
      service = new XrplService(ports)

      await expect(
        service.getMptIssuanceIdAndWait(
          { domainId: mockDomainId, payloadId: "payload-123" },
          { maxRetries: 5, intervalMs: 0 },
        ),
      ).rejects.toThrow("Unauthorized")
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

    it("rejects an invalid Account before calling the submit port", async () => {
      const submitIntent = vi.fn(async () => ({ requestId: "request-123" }) as any)
      ports = createTestPorts({ submitIntent })
      service = new XrplService(ports)

      await expect(
        service.rawSign({ ...mockXrplTransaction, Account: "not-an-address" }),
      ).rejects.toThrow("Invalid address: not-an-address")
      expect(submitIntent).not.toHaveBeenCalled()
    })

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
      expect(tx.SigningPubKey).toBeUndefined()
      expect(result.signedTransaction.TxnSignature).toBe("AABBCCDD")
      expect(result.signedTransaction.SigningPubKey).toBe(expectedCompressedKey)
    })

    it("should not mutate the input transaction object", async () => {
      const tx = { ...mockXrplTransaction }
      const before = JSON.stringify(tx)

      const result = await service.rawSignAndWait(tx, {
        polling: { maxRetries: 1, intervalMs: 0 },
      })

      expect(JSON.stringify(tx)).toBe(before)
      expect(result.signedTransaction.TxnSignature).toBe("AABBCCDD")
      expect(result.signedTransaction.SigningPubKey).toBe(expectedCompressedKey)
      expect(result.signedTransaction).not.toBe(tx)
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
        "Invalid signerAccount: not-an-address",
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
    const submitterAddress = "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w"
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

    it("passes domainId and ledgerId to resolveContext", async () => {
      const resolveContext = vi.fn(async () => mockContext)
      ports = createTestPorts({ resolveContext, dryRunIntent: async () => mockDryRunResponse })
      service = new XrplService(ports)

      await service.dryRunBatch(batchPayload, {
        domainId: "domain-456",
        ledgerId: "ledger-456",
      })

      // The dry-run must resolve the submitter the same way proposeBatch does:
      // dropping ledgerId here would sign for a different ledger than step 3 submits to.
      expect(resolveContext).toHaveBeenCalledWith(submitterAddress, {
        domainId: "domain-456",
        ledgerId: "ledger-456",
      })
    })

    it("rejects an invalid submitter address before calling the dry-run port", async () => {
      const dryRunIntent = vi.fn(async () => mockDryRunResponse)
      ports = createTestPorts({ dryRunIntent })
      service = new XrplService(ports)

      await expect(
        service.dryRunBatch({ ...batchPayload, Account: "not-an-address" }),
      ).rejects.toThrow("Invalid address: not-an-address")
      expect(dryRunIntent).not.toHaveBeenCalled()
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
      const getManifest = vi.fn(
        async () =>
          ({
            data: { value: { type: "Unsafe" as const, signature: mockBase64Signature } },
          }) as any,
      )
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
    const submitterAddress = "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w"
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

    it("rejects an invalid submitter address before calling the submit port", async () => {
      const submitIntent = vi.fn(async () => ({ requestId: "request-123" }) as any)
      ports = createTestPorts({ submitIntent })
      service = new XrplService(ports)

      await expect(
        service.proposeBatch({ ...batchPayload, Account: "not-an-address" }, batchSigners),
      ).rejects.toThrow("Invalid address: not-an-address")
      expect(submitIntent).not.toHaveBeenCalled()
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
  // A resolved instance that exposes Batch — what auto-detection derives from a
  // live devbox spec. No official bundled version has Batch (ADR-0005).
  const guardWithBatch = () => {
    const base = resolveExplicitCapabilities("1.35.0")
    return new VersionGuard({
      appVersion: "1.35.0-devbox",
      endpoints: base.endpoints,
      schemas: new Set([...base.schemas, "Core_XrplOperation_Batch"]),
    })
  }

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

  it("blocks proposeBatch on an official version that lacks Batch (1.35.0)", async () => {
    const submitIntent = vi.fn(async () => ({ requestId: "r" }) as any)
    const service = new XrplService(createTestPorts({ submitIntent }), guardFor("1.35.0"))

    await expect(service.proposeBatch(batchPayload, [])).rejects.toBeInstanceOf(
      UnsupportedInVersionError,
    )
    expect(submitIntent).not.toHaveBeenCalled()
  })

  it("allows proposeBatch when the resolved instance exposes Batch (auto-detected devbox)", async () => {
    const submitIntent = vi.fn(async () => ({ requestId: "r" }) as any)
    const service = new XrplService(createTestPorts({ submitIntent }), guardWithBatch())

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
