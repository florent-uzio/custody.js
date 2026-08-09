import { beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { CustodyError } from "../../models/index.js"
import type { Core_AccountAddressReference } from "../../namespaces/accounts.types.js"
import type {
  Core_IntentDryRunRequest,
  Core_ProposeIntentBody,
} from "../../namespaces/intents.types.js"
import type { Core_MeReference } from "../../namespaces/users.types.js"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { createHttpPorts } from "./xrpl.http-adapters.js"

const mockTransport = createFakeTransport()

function makeMe(overrides: Partial<Core_MeReference> = {}): Core_MeReference {
  return {
    publicKey: "cHVibGljS2V5",
    loginId: { id: "login-1", providerId: "harmonize" },
    domains: [
      {
        id: "domain-1",
        alias: "domain-1-alias",
        userReference: { id: "user-1", alias: "user-1-alias", roles: [] },
      },
    ],
    ...overrides,
  }
}

function makeAddressRef(
  overrides: Partial<Core_AccountAddressReference> = {},
): Core_AccountAddressReference {
  return {
    id: "ref-id",
    address: "rAddress123",
    ledgerId: "xrpl-mainnet",
    domainId: "domain-1",
    accountId: "acc-1",
    createdAt: "2025-01-01T00:00:00Z",
    custodyType: "SelfCustody",
    type: "AccountAddressReference",
    ...overrides,
  }
}

// Dispatches /v1/me to `me` and /v1/addresses to `{ items: refs }`, mirroring
// how resolveContext makes two distinct GETs through the same transport.
function mockMeAndAddresses(me: Core_MeReference, refs: Core_AccountAddressReference[]) {
  mockTransport.get.mockImplementation((url: string) =>
    url === URLs.me ? Promise.resolve(me) : Promise.resolve({ items: refs }),
  )
}

describe("createHttpPorts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("resolveContext", () => {
    it("resolves domainId/userId from the single domain and merges the matched account", async () => {
      const me = makeMe()
      const ref = makeAddressRef()
      mockMeAndAddresses(me, [ref])
      const ports = createHttpPorts(mockTransport)

      const result = await ports.resolveContext("rAddress123")

      expect(result).toEqual({
        domainId: "domain-1",
        userId: "user-1",
        accountId: "acc-1",
        ledgerId: "xrpl-mainnet",
        address: "rAddress123",
      })
      expect(mockTransport.get).toHaveBeenNthCalledWith(1, URLs.me)
      expect(mockTransport.get).toHaveBeenNthCalledWith(2, URLs.addresses, undefined, {
        address: "rAddress123",
      })
    })

    it("uses opts.domainId to select among multiple domains", async () => {
      const me = makeMe({
        domains: [
          {
            id: "domain-1",
            alias: "a1",
            userReference: { id: "user-1", alias: "u1", roles: [] },
          },
          {
            id: "domain-2",
            alias: "a2",
            userReference: { id: "user-2", alias: "u2", roles: [] },
          },
        ],
      })
      const ref = makeAddressRef({ domainId: "domain-2" })
      mockMeAndAddresses(me, [ref])
      const ports = createHttpPorts(mockTransport)

      const result = await ports.resolveContext("rAddress123", { domainId: "domain-2" })

      expect(result.domainId).toBe("domain-2")
      expect(result.userId).toBe("user-2")
    })

    it("uses opts.ledgerId to disambiguate among multiple matching addresses", async () => {
      const me = makeMe()
      const mainnetRef = makeAddressRef({ ledgerId: "xrpl-mainnet", accountId: "acc-mainnet" })
      const testnetRef = makeAddressRef({ ledgerId: "xrpl-testnet", accountId: "acc-testnet" })
      mockMeAndAddresses(me, [mainnetRef, testnetRef])
      const ports = createHttpPorts(mockTransport)

      const result = await ports.resolveContext("rAddress123", { ledgerId: "xrpl-testnet" })

      expect(result.accountId).toBe("acc-testnet")
      expect(result.ledgerId).toBe("xrpl-testnet")
    })

    // Characterizes a discrepancy from the plan: findByAddressOrThrow (called via
    // findByAddress) only ever sends `{ address }` to the transport — ledgerId/domainId
    // are used to filter the returned `items` in-memory, never forwarded to the query.
    it("forwards only {address} to the /v1/addresses query, regardless of ledgerId/domainId opts", async () => {
      const me = makeMe()
      const ref = makeAddressRef()
      mockMeAndAddresses(me, [ref])
      const ports = createHttpPorts(mockTransport)

      await ports.resolveContext("rAddress123", { domainId: "domain-1", ledgerId: "xrpl-mainnet" })

      expect(mockTransport.get).toHaveBeenNthCalledWith(2, URLs.addresses, undefined, {
        address: "rAddress123",
      })
    })
  })

  // resolveContext runs the /v1/me and address lookups concurrently via
  // Promise.all, so the address call must resolve for the domain-resolution
  // error (not an "address not found" rejection) to be the one that surfaces.
  describe("resolveContext — resolveDomainAndUser error branches", () => {
    it("throws when loginId is missing", async () => {
      const me = makeMe({ loginId: undefined })
      mockMeAndAddresses(me, [makeAddressRef()])
      const ports = createHttpPorts(mockTransport)

      await expect(ports.resolveContext("rAddress123")).rejects.toThrow(CustodyError)
      await expect(ports.resolveContext("rAddress123")).rejects.toThrow("User has no login ID")
    })

    it("throws when the user has no domains", async () => {
      const me = makeMe({ domains: [] })
      mockMeAndAddresses(me, [makeAddressRef()])
      const ports = createHttpPorts(mockTransport)

      await expect(ports.resolveContext("rAddress123")).rejects.toThrow("User has no domains")
    })

    it("throws when the provided domainId is not found among the user's domains", async () => {
      const me = makeMe()
      // resolveContext now fires the address lookup in parallel with /v1/me, so
      // the address must resolve for the domain-resolution error to surface. The
      // ref carries the queried domainId so findByAddressOrThrow matches it.
      mockMeAndAddresses(me, [makeAddressRef({ domainId: "domain-missing" })])
      const ports = createHttpPorts(mockTransport)

      await expect(
        ports.resolveContext("rAddress123", { domainId: "domain-missing" }),
      ).rejects.toThrow("Domain with ID domain-missing not found for user")
    })

    it("throws when the domain matched by the provided domainId has no user reference", async () => {
      const me = makeMe({
        domains: [{ id: "domain-1", alias: "a1", userReference: undefined as any }],
      })
      mockMeAndAddresses(me, [makeAddressRef()])
      const ports = createHttpPorts(mockTransport)

      await expect(ports.resolveContext("rAddress123", { domainId: "domain-1" })).rejects.toThrow(
        "Domain domain-1 has no user reference",
      )
    })

    it("throws when the user has multiple domains and no domainId is provided", async () => {
      const me = makeMe({
        domains: [
          {
            id: "domain-1",
            alias: "a1",
            userReference: { id: "user-1", alias: "u1", roles: [] },
          },
          {
            id: "domain-2",
            alias: "a2",
            userReference: { id: "user-2", alias: "u2", roles: [] },
          },
        ],
      })
      mockMeAndAddresses(me, [makeAddressRef()])
      const ports = createHttpPorts(mockTransport)

      await expect(ports.resolveContext("rAddress123")).rejects.toThrow(
        "User has multiple domains. Please specify domainId in the options parameter.",
      )
    })

    it("throws when the single primary domain has no id", async () => {
      const me = makeMe({
        domains: [
          {
            id: undefined as any,
            alias: "a1",
            userReference: { id: "user-1", alias: "u1", roles: [] },
          },
        ],
      })
      mockMeAndAddresses(me, [makeAddressRef()])
      const ports = createHttpPorts(mockTransport)

      await expect(ports.resolveContext("rAddress123")).rejects.toThrow(
        "User has no primary domain",
      )
    })

    it("throws when the single primary domain has no user reference", async () => {
      const me = makeMe({
        domains: [{ id: "domain-1", alias: "a1", userReference: undefined as any }],
      })
      mockMeAndAddresses(me, [makeAddressRef()])
      const ports = createHttpPorts(mockTransport)

      await expect(ports.resolveContext("rAddress123")).rejects.toThrow(
        "Primary domain has no user reference",
      )
    })
  })

  describe("submitIntent", () => {
    it("posts the body to URLs.intents with no path params or config", async () => {
      const body = { id: "intent-1" } as any as Core_ProposeIntentBody
      mockTransport.post.mockResolvedValue({ requestId: "req-1" })
      const ports = createHttpPorts(mockTransport)

      const result = await ports.submitIntent(body)

      expect(mockTransport.post).toHaveBeenCalledWith(URLs.intents, body)
      expect(result).toEqual({ requestId: "req-1" })
    })
  })

  describe("dryRunIntent", () => {
    it("posts the body to URLs.intentsDryRun with sign: false and no path params", async () => {
      const body = { id: "intent-1" } as any as Core_IntentDryRunRequest
      mockTransport.post.mockResolvedValue({ type: "Successful" })
      const ports = createHttpPorts(mockTransport)

      const result = await ports.dryRunIntent(body)

      expect(mockTransport.post).toHaveBeenCalledWith(URLs.intentsDryRun, body, undefined, {
        sign: false,
      })
      expect(result).toEqual({ type: "Successful" })
    })
  })

  describe("getManifest", () => {
    it("gets URLs.accountManifest with domainId/accountId/manifestId", async () => {
      mockTransport.get.mockResolvedValue({ id: "manifest-1" })
      const ports = createHttpPorts(mockTransport)

      const result = await ports.getManifest("domain-1", "acc-1", "manifest-1")

      expect(mockTransport.get).toHaveBeenCalledWith(URLs.accountManifest, {
        domainId: "domain-1",
        accountId: "acc-1",
        manifestId: "manifest-1",
      })
      expect(result).toEqual({ id: "manifest-1" })
    })
  })

  describe("getAccount", () => {
    it("gets URLs.account with domainId/accountId", async () => {
      mockTransport.get.mockResolvedValue({ id: "account-1" })
      const ports = createHttpPorts(mockTransport)

      const result = await ports.getAccount("domain-1", "acc-1")

      expect(mockTransport.get).toHaveBeenCalledWith(URLs.account, {
        domainId: "domain-1",
        accountId: "acc-1",
      })
      expect(result).toEqual({ id: "account-1" })
    })
  })

  describe("listTransactions", () => {
    it("gets URLs.transactions with domainId and passes the query through", async () => {
      mockTransport.get.mockResolvedValue({ items: [] })
      const ports = createHttpPorts(mockTransport)

      const result = await ports.listTransactions("domain-1", { "orderReference.Id": "order-1" })

      expect(mockTransport.get).toHaveBeenCalledWith(
        URLs.transactions,
        { domainId: "domain-1" },
        { "orderReference.Id": "order-1" },
      )
      expect(result).toEqual({ items: [] })
    })
  })

  describe("getTransaction", () => {
    it("gets URLs.transaction with domainId and transactionId", async () => {
      mockTransport.get.mockResolvedValue({ id: "tx-1" })
      const ports = createHttpPorts(mockTransport)

      const result = await ports.getTransaction("domain-1", "tx-1")

      expect(mockTransport.get).toHaveBeenCalledWith(URLs.transaction, {
        domainId: "domain-1",
        transactionId: "tx-1",
      })
      expect(result).toEqual({ id: "tx-1" })
    })
  })
})
