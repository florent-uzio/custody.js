import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { createIntents } from "../intents.js"
import type { Core_ProposeIntentBody, Core_ProposeUserIntentPayload } from "../intents.types.js"
import type { Core_MeReference } from "../users.types.js"

vi.mock("../../helpers/index.js", async () => {
  const actual = await vi.importActual("../../helpers/index.js")
  return {
    ...actual,
    sleep: vi.fn(() => Promise.resolve()),
  }
})

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

/**
 * The signed `request` envelope of the nth `POST /v1/intents` call.
 * The transport double types its body as `unknown`, so the cast is the test
 * asserting what the namespace is contracted to send.
 */
function proposedRequest(nth = 0): Core_ProposeIntentBody["request"] {
  const call = mockTransport.post.mock.calls[nth]
  if (!call) {
    throw new Error(`No POST call at index ${nth}`)
  }
  return (call[1] as Core_ProposeIntentBody).request
}

describe("createIntents", () => {
  let intents: ReturnType<typeof createIntents>

  beforeEach(() => {
    vi.clearAllMocks()
    intents = createIntents(mockTransport)
  })

  describe("getAndWait (waitForExecution)", () => {
    const params = { domainId: "d-1", intentId: "i-1" }

    it("should return immediately when intent is in terminal status", async () => {
      mockTransport.get.mockResolvedValue({
        data: { state: { status: "Executed" } },
      })

      const result = await intents.getAndWait(params)

      expect(result).toEqual({
        status: "Executed",
        isTerminal: true,
        isSuccess: true,
        intent: { data: { state: { status: "Executed" } } },
      })
    })

    it("should return isSuccess false for Failed status", async () => {
      mockTransport.get.mockResolvedValue({
        data: { state: { status: "Failed" } },
      })

      const result = await intents.getAndWait(params)

      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
      expect(result.status).toBe("Failed")
    })

    it("should poll until terminal status is reached", async () => {
      mockTransport.get
        .mockResolvedValueOnce({ data: { state: { status: "Open" } } })
        .mockResolvedValueOnce({ data: { state: { status: "Approved" } } })
        .mockResolvedValueOnce({ data: { state: { status: "Executed" } } })

      const result = await intents.getAndWait(params, { maxRetries: 5 })

      expect(result.isSuccess).toBe(true)
      expect(mockTransport.get).toHaveBeenCalledTimes(3)
    })

    it("should return non-terminal result when max retries exceeded", async () => {
      mockTransport.get.mockResolvedValue({
        data: { state: { status: "Executing" } },
      })

      const result = await intents.getAndWait(params, { maxRetries: 2 })

      // 2 attempts in the polling loop, no extra fetch afterwards
      expect(mockTransport.get).toHaveBeenCalledTimes(2)
      expect(result.isTerminal).toBe(false)
      expect(result.isSuccess).toBe(false)
      expect(result.status).toBe("Executing")
    })

    it("should call onStatusCheck callback on each attempt", async () => {
      const onStatusCheck = vi.fn()
      mockTransport.get
        .mockResolvedValueOnce({ data: { state: { status: "Open" } } })
        .mockResolvedValueOnce({ data: { state: { status: "Executed" } } })

      await intents.getAndWait(params, { onStatusCheck })

      expect(onStatusCheck).toHaveBeenCalledWith("Open", 1)
      expect(onStatusCheck).toHaveBeenCalledWith("Executed", 2)
    })

    it("should handle Rejected as terminal status", async () => {
      mockTransport.get.mockResolvedValue({
        data: { state: { status: "Rejected" } },
      })

      const result = await intents.getAndWait(params)

      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
    })

    it("should handle Expired as terminal status", async () => {
      mockTransport.get.mockResolvedValue({
        data: { state: { status: "Expired" } },
      })

      const result = await intents.getAndWait(params)

      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
    })

    it("should retry on 404 errors during initial fetch", async () => {
      const notFoundError = new CustodyError({ reason: "Not found" }, 404)
      mockTransport.get
        .mockRejectedValueOnce(notFoundError)
        .mockResolvedValueOnce({ data: { state: { status: "Executed" } } })

      const result = await intents.getAndWait(params)

      expect(result.isSuccess).toBe(true)
    })

    it("should keep polling through repeated 404s until terminal (regression)", async () => {
      const notFoundError = new CustodyError({ reason: "Not found" }, 404)
      mockTransport.get
        .mockRejectedValueOnce(notFoundError)
        .mockRejectedValueOnce(notFoundError)
        .mockRejectedValueOnce(notFoundError)
        .mockRejectedValueOnce(notFoundError)
        .mockResolvedValueOnce({ data: { state: { status: "Executed" } } })

      const result = await intents.getAndWait(params, { maxRetries: 10 })

      expect(result.isSuccess).toBe(true)
      expect(mockTransport.get).toHaveBeenCalledTimes(5)
    })

    it("should throw 404 when the intent never materializes", async () => {
      const notFoundError = new CustodyError({ reason: "Not found" }, 404)
      mockTransport.get.mockRejectedValue(notFoundError)

      await expect(intents.getAndWait(params, { maxRetries: 2 })).rejects.toMatchObject({
        statusCode: 404,
      })
    })

    it("should throw non-404 errors immediately", async () => {
      const serverError = new CustodyError({ reason: "Server error" }, 500)
      mockTransport.get.mockRejectedValue(serverError)

      await expect(intents.getAndWait(params)).rejects.toThrow("Server error")
    })
  })

  describe("reason", () => {
    const params = { domainId: "d-1", intentId: "i-1" }

    it("is undefined on success", async () => {
      mockTransport.get.mockResolvedValue({ data: { id: "i-1", state: { status: "Executed" } } })

      expect((await intents.getAndWait(params)).reason).toBeUndefined()
    })

    it("prefers state.error over the status alone", async () => {
      mockTransport.get.mockResolvedValue({
        data: {
          id: "i-1",
          state: {
            status: "Rejected",
            error: { code: "PolicyViolation", message: "approval threshold not met" },
          },
        },
      })

      expect((await intents.getAndWait(params)).reason).toBe(
        "Intent i-1 was Rejected (PolicyViolation): approval threshold not met",
      )
    })

    it("falls back to the status when custody reported no error", async () => {
      mockTransport.get.mockResolvedValue({ data: { id: "i-1", state: { status: "Expired" } } })

      expect((await intents.getAndWait(params)).reason).toBe(
        "Intent i-1 did not execute (status: Expired).",
      )
    })

    it("names an exhausted Open wait as awaiting approval, not as a failure", async () => {
      mockTransport.get.mockResolvedValue({ data: { id: "i-1", state: { status: "Open" } } })

      const result = await intents.getAndWait(params, { maxRetries: 3 })

      expect(result.isSuccess).toBe(false)
      expect(result.reason).toBe("Intent i-1 was still awaiting approval after 3 attempts.")
    })

    it("names the status for other exhausted waits", async () => {
      mockTransport.get.mockResolvedValue({ data: { id: "i-1", state: { status: "Executing" } } })

      expect((await intents.getAndWait(params, { maxRetries: 2 })).reason).toBe(
        "Intent i-1 was still Executing after 2 attempts.",
      )
    })
  })

  describe("proposePayload", () => {
    const payload: Core_ProposeUserIntentPayload = {
      type: "v0_ReleaseQuarantinedTransfers",
      accountId: "a-1",
      transferIds: ["t-1"],
    }

    beforeEach(() => {
      mockTransport.get.mockResolvedValue(meWithDomains("d-1"))
      mockTransport.post.mockResolvedValue({ requestId: "r-1" })
    })

    it("wraps the payload in an envelope built from the resolved context", async () => {
      const result = await intents.proposePayload(payload)

      expect(result).toEqual({
        requestId: "r-1",
        intentId: proposedRequest().id,
        domainId: "d-1",
      })

      expect(mockTransport.post.mock.calls[0]?.[0]).toBe("/v1/intents")
      expect(proposedRequest()).toMatchObject({
        type: "Propose",
        author: { domainId: "d-1", id: "user-of-d-1" },
        targetDomainId: "d-1",
        customProperties: {},
        payload,
      })
    })

    it("generates a request id when none was supplied", async () => {
      await intents.proposePayload(payload)

      expect(proposedRequest().id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7/)
    })

    it("echoes a caller-supplied request id unchanged", async () => {
      await intents.proposePayload(payload, { requestId: "fixed-id" })

      expect(proposedRequest().id).toBe("fixed-id")
    })

    it("expires in a day by default, and honours expiryDays", async () => {
      await intents.proposePayload(payload)
      await intents.proposePayload(payload, { expiryDays: 30 })

      const day = 24 * 60 * 60 * 1000
      const elapsed =
        new Date(proposedRequest(1).expiryAt).getTime() -
        new Date(proposedRequest(0).expiryAt).getTime()
      expect(elapsed).toBeGreaterThan(28 * day)
    })

    it("omits description entirely when not provided, since the request is signed", async () => {
      await intents.proposePayload(payload)

      expect("description" in proposedRequest()).toBe(false)
    })

    it("includes description and custom properties when provided", async () => {
      await intents.proposePayload(payload, {
        description: "release the funds",
        requestCustomProperties: { ticket: "OPS-1" },
      })

      expect(proposedRequest()).toMatchObject({
        description: "release the funds",
        customProperties: { ticket: "OPS-1" },
      })
    })

    it("pins the domain when the login has several", async () => {
      mockTransport.get.mockResolvedValue(meWithDomains("d-1", "d-2"))

      const result = await intents.proposePayload(payload, { domainId: "d-2" })

      expect(result.domainId).toBe("d-2")
      expect(proposedRequest().author).toEqual({ domainId: "d-2", id: "user-of-d-2" })
    })

    it("throws rather than guessing when the login is ambiguous", async () => {
      mockTransport.get.mockResolvedValue(meWithDomains("d-1", "d-2"))

      await expect(intents.proposePayload(payload)).rejects.toThrow(/multiple domains/)
      expect(mockTransport.post).not.toHaveBeenCalled()
    })
  })

  describe("proposeAndWait", () => {
    const payload: Core_ProposeUserIntentPayload = { type: "v0_NotarizeData", data: "aGk=" }

    beforeEach(() => {
      mockTransport.post.mockResolvedValue({ requestId: "r-1" })
    })

    it("proposes, then polls the intent it just created", async () => {
      mockTransport.get
        .mockResolvedValueOnce(meWithDomains("d-1"))
        .mockResolvedValue({ data: { id: "r-1", state: { status: "Executed" } } })

      const result = await intents.proposeAndWait(payload)

      expect(result).toMatchObject({
        requestId: "r-1",
        intentId: proposedRequest().id,
        domainId: "d-1",
        status: "Executed",
        isTerminal: true,
        isSuccess: true,
      })
      expect(result.reason).toBeUndefined()
      // The wait polls the intent id the envelope was built with — a
      // different id from the server's own `requestId`.
      expect(mockTransport.get).toHaveBeenLastCalledWith(
        "/v1/domains/{domainId}/intents/{intentId}",
        {
          domainId: "d-1",
          intentId: proposedRequest().id,
        },
      )
    })

    it("reports an intent awaiting approval as non-terminal rather than throwing", async () => {
      mockTransport.get
        .mockResolvedValueOnce(meWithDomains("d-1"))
        .mockResolvedValue({ data: { id: "r-1", state: { status: "Open" } } })

      const result = await intents.proposeAndWait(payload, { maxRetries: 2 })

      expect(result.isTerminal).toBe(false)
      expect(result.isSuccess).toBe(false)
      expect(result.status).toBe("Open")
      expect(result.reason).toContain("awaiting approval")
      // Still usable: the caller can pick the intent up later by these ids.
      expect(result.requestId).toBe("r-1")
      expect(result.domainId).toBe("d-1")
    })

    it("reports a rejected intent without throwing", async () => {
      mockTransport.get.mockResolvedValueOnce(meWithDomains("d-1")).mockResolvedValue({
        data: {
          id: "r-1",
          state: { status: "Rejected", error: { code: "Denied", message: "nope" } },
        },
      })

      const result = await intents.proposeAndWait(payload)

      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
      expect(result.reason).toBe("Intent r-1 was Rejected (Denied): nope")
    })

    it("takes both envelope and polling options from the one bag", async () => {
      mockTransport.get
        .mockResolvedValueOnce(meWithDomains("d-1"))
        .mockResolvedValue({ data: { id: "r-1", state: { status: "Executing" } } })

      const result = await intents.proposeAndWait(payload, {
        requestId: "fixed-id",
        maxRetries: 4,
      })

      expect(proposedRequest().id).toBe("fixed-id")
      expect(result.reason).toContain("after 4 attempts")
    })
  })
})
