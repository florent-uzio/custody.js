import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { createDomains, resolveDomainAndUser } from "../domains.js"
import type { Core_MeReference } from "../users.types.js"

const mockTransport = createFakeTransport()

/** A `/v1/me` reference with the given domains, each carrying a user reference. */
function meWithDomains(...domainIds: string[]): Core_MeReference {
  return {
    publicKey: "cHVibGlj",
    loginId: { id: "login-1", providerId: "provider-1" },
    domains: domainIds.map((id) => ({
      id,
      alias: `alias-${id}`,
      userReference: { id: `user-of-${id}`, alias: "me", roles: [] },
    })),
  }
}

describe("resolveDomainAndUser", () => {
  it("resolves the single domain when the login has exactly one", () => {
    expect(resolveDomainAndUser(meWithDomains("d-1"))).toEqual({
      domainId: "d-1",
      userId: "user-of-d-1",
    })
  })

  it("resolves the pinned domain when the login has several", () => {
    expect(resolveDomainAndUser(meWithDomains("d-1", "d-2"), "d-2")).toEqual({
      domainId: "d-2",
      userId: "user-of-d-2",
    })
  })

  it("throws when the login has several domains and none was pinned", () => {
    expect(() => resolveDomainAndUser(meWithDomains("d-1", "d-2"))).toThrow(/multiple domains/)
  })

  it("throws when the pinned domain is not one of the login's", () => {
    expect(() => resolveDomainAndUser(meWithDomains("d-1"), "d-9")).toThrow(
      /Domain with ID d-9 not found/,
    )
  })

  it("throws when the login has no domains", () => {
    expect(() => resolveDomainAndUser(meWithDomains())).toThrow(/no domains/)
  })

  it("throws when there is no login id", () => {
    const me: Core_MeReference = { ...meWithDomains("d-1"), loginId: undefined }
    expect(() => resolveDomainAndUser(me)).toThrow(/no login ID/)
  })

  it("throws a CustodyError, not a bare Error", () => {
    expect(() => resolveDomainAndUser(meWithDomains())).toThrow(CustodyError)
  })
})

describe("createDomains", () => {
  let domains: ReturnType<typeof createDomains>

  beforeEach(() => {
    vi.clearAllMocks()
    domains = createDomains(mockTransport)
  })

  describe("me", () => {
    it("resolves the pair from /v1/me", async () => {
      mockTransport.get.mockResolvedValue(meWithDomains("d-1"))

      await expect(domains.me()).resolves.toEqual({ domainId: "d-1", userId: "user-of-d-1" })
      expect(mockTransport.get).toHaveBeenCalledWith("/v1/me")
    })

    it("honours a pinned domainId", async () => {
      mockTransport.get.mockResolvedValue(meWithDomains("d-1", "d-2"))

      await expect(domains.me({ domainId: "d-2" })).resolves.toEqual({
        domainId: "d-2",
        userId: "user-of-d-2",
      })
    })

    it("throws on an ambiguous login rather than picking a domain", async () => {
      mockTransport.get.mockResolvedValue(meWithDomains("d-1", "d-2"))

      await expect(domains.me()).rejects.toThrow(/multiple domains/)
    })
  })
})
