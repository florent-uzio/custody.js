import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { createIntents } from "../intents.js"

vi.mock("../../helpers/index.js", async () => {
  const actual = await vi.importActual("../../helpers/index.js")
  return {
    ...actual,
    sleep: vi.fn(() => Promise.resolve()),
  }
})

const mockTransport = {
  get: vi.fn(),
  post: vi.fn(),
}

describe("createIntents", () => {
  let intents: ReturnType<typeof createIntents>

  beforeEach(() => {
    vi.clearAllMocks()
    intents = createIntents(mockTransport as any)
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
})
