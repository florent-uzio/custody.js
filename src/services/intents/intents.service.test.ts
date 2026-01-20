import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { URLs } from "../../constants/urls.js"
import { replacePathParams } from "../../helpers/index.js"
import { CustodyError } from "../../models/index.js"
import { IntentsService } from "./intents.service.js"

// Mock sleep helper
vi.mock("../../helpers/index.js", async () => {
  const actual = await vi.importActual("../../helpers/index.js")
  return {
    ...actual,
    sleep: vi.fn(() => Promise.resolve()),
  }
})

import { sleep } from "../../helpers/index.js"

// Mock ApiService
const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
}

describe("IntentsService", () => {
  let intentsService: IntentsService

  const mockDomainId = "domain-123"
  const mockIntentId = "intent-456"

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    intentsService = new IntentsService(mockApiService as any)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("proposeIntent", () => {
    it("should call api.post with correct URL and return intent response", async () => {
      const mockBody = {
        request: {
          type: "Propose",
          id: mockIntentId,
          author: { id: "user-1", domainId: mockDomainId },
        },
      }
      const mockResponse = { data: { id: mockIntentId, status: "Open" } }
      mockApiService.post.mockResolvedValue(mockResponse)

      const result = await intentsService.proposeIntent(mockBody as any)

      expect(mockApiService.post).toHaveBeenCalledWith(URLs.intents, mockBody)
      expect(result).toEqual(mockResponse)
    })
  })

  describe("approveIntent", () => {
    it("should call api.post with correct URL and return intent response", async () => {
      const mockBody = {
        request: {
          type: "Approve",
          id: mockIntentId,
          author: { id: "user-1", domainId: mockDomainId },
        },
      }
      const mockResponse = { data: { id: mockIntentId, status: "Approved" } }
      mockApiService.post.mockResolvedValue(mockResponse)

      const result = await intentsService.approveIntent(mockBody as any)

      expect(mockApiService.post).toHaveBeenCalledWith(URLs.intentsApprove, mockBody)
      expect(result).toEqual(mockResponse)
    })
  })

  describe("rejectIntent", () => {
    it("should call api.post with correct URL and return intent response", async () => {
      const mockBody = {
        request: {
          type: "Reject",
          id: mockIntentId,
          author: { id: "user-1", domainId: mockDomainId },
        },
      }
      const mockResponse = { data: { id: mockIntentId, status: "Rejected" } }
      mockApiService.post.mockResolvedValue(mockResponse)

      const result = await intentsService.rejectIntent(mockBody as any)

      expect(mockApiService.post).toHaveBeenCalledWith(URLs.intentsReject, mockBody)
      expect(result).toEqual(mockResponse)
    })
  })

  describe("getIntent", () => {
    it("should call api.get with correct URL and return intent", async () => {
      const mockIntent = {
        data: { id: mockIntentId, state: { status: "Open" } },
      }
      mockApiService.get.mockResolvedValue(mockIntent)

      const result = await intentsService.getIntent({
        domainId: mockDomainId,
        intentId: mockIntentId,
      })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.getIntent, { domainId: mockDomainId, intentId: mockIntentId }),
        undefined,
      )
      expect(result).toEqual(mockIntent)
    })

    it("should pass query parameters to api.get", async () => {
      const mockIntent = { data: { id: mockIntentId } }
      mockApiService.get.mockResolvedValue(mockIntent)

      const queryParams = { includeHistory: true }
      await intentsService.getIntent(
        { domainId: mockDomainId, intentId: mockIntentId },
        queryParams as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.getIntent, { domainId: mockDomainId, intentId: mockIntentId }),
        queryParams,
      )
    })
  })

  describe("getIntents", () => {
    it("should call api.get with correct URL and return intents", async () => {
      const mockIntents = {
        data: [
          { id: "intent-1", state: { status: "Open" } },
          { id: "intent-2", state: { status: "Approved" } },
        ],
      }
      mockApiService.get.mockResolvedValue(mockIntents)

      const result = await intentsService.getIntents({ domainId: mockDomainId })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.domainIntents, { domainId: mockDomainId }),
        undefined,
      )
      expect(result).toEqual(mockIntents)
    })

    it("should pass query parameters to api.get", async () => {
      const mockIntents = { data: [] }
      mockApiService.get.mockResolvedValue(mockIntents)

      const queryParams = { limit: 10, status: "Open" }
      await intentsService.getIntents({ domainId: mockDomainId }, queryParams as any)

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.domainIntents, { domainId: mockDomainId }),
        queryParams,
      )
    })
  })

  describe("dryRunIntent", () => {
    it("should call api.post with correct URL and return dry run response", async () => {
      const mockBody = {
        request: { type: "Propose", id: mockIntentId },
      }
      const mockResponse = {
        data: { id: mockIntentId, dryRun: true, result: "success" },
      }
      mockApiService.post.mockResolvedValue(mockResponse)

      const result = await intentsService.dryRunIntent(mockBody as any)

      expect(mockApiService.post).toHaveBeenCalledWith(URLs.intentsDryRun, mockBody)
      expect(result).toEqual(mockResponse)
    })
  })

  describe("remainingUsersIntent", () => {
    it("should call api.get with correct URL and return remaining users", async () => {
      const mockRemainingUsers = {
        data: [{ id: "user-1", name: "User 1" }],
      }
      mockApiService.get.mockResolvedValue(mockRemainingUsers)

      const result = await intentsService.remainingUsersIntent({
        domainId: mockDomainId,
        intentId: mockIntentId,
      })

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.intentRemainingUsers, {
          domainId: mockDomainId,
          intentId: mockIntentId,
        }),
        undefined,
      )
      expect(result).toEqual(mockRemainingUsers)
    })

    it("should pass query parameters to api.get", async () => {
      const mockRemainingUsers = { data: [] }
      mockApiService.get.mockResolvedValue(mockRemainingUsers)

      const queryParams = { includeRoles: true }
      await intentsService.remainingUsersIntent(
        { domainId: mockDomainId, intentId: mockIntentId },
        queryParams as any,
      )

      expect(mockApiService.get).toHaveBeenCalledWith(
        replacePathParams(URLs.intentRemainingUsers, {
          domainId: mockDomainId,
          intentId: mockIntentId,
        }),
        queryParams,
      )
    })
  })

  describe("waitForExecution", () => {
    const params = { domainId: mockDomainId, intentId: mockIntentId }

    it("should return immediately when intent is already Executed", async () => {
      const mockIntent = {
        data: { id: mockIntentId, state: { status: "Executed" } },
      }
      mockApiService.get.mockResolvedValue(mockIntent)

      const result = await intentsService.waitForExecution(params)

      expect(result.status).toBe("Executed")
      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(true)
      expect(result.intent).toEqual(mockIntent)
      expect(mockApiService.get).toHaveBeenCalledTimes(1)
      expect(sleep).not.toHaveBeenCalled()
    })

    it("should return immediately when intent is Failed", async () => {
      const mockIntent = {
        data: { id: mockIntentId, state: { status: "Failed" } },
      }
      mockApiService.get.mockResolvedValue(mockIntent)

      const result = await intentsService.waitForExecution(params)

      expect(result.status).toBe("Failed")
      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
    })

    it("should return immediately when intent is Expired", async () => {
      const mockIntent = {
        data: { id: mockIntentId, state: { status: "Expired" } },
      }
      mockApiService.get.mockResolvedValue(mockIntent)

      const result = await intentsService.waitForExecution(params)

      expect(result.status).toBe("Expired")
      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
    })

    it("should return immediately when intent is Rejected", async () => {
      const mockIntent = {
        data: { id: mockIntentId, state: { status: "Rejected" } },
      }
      mockApiService.get.mockResolvedValue(mockIntent)

      const result = await intentsService.waitForExecution(params)

      expect(result.status).toBe("Rejected")
      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(false)
    })

    it("should poll until intent reaches terminal status", async () => {
      const mockOpenIntent = {
        data: { id: mockIntentId, state: { status: "Open" } },
      }
      const mockExecutedIntent = {
        data: { id: mockIntentId, state: { status: "Executed" } },
      }

      mockApiService.get
        .mockResolvedValueOnce(mockOpenIntent)
        .mockResolvedValueOnce(mockOpenIntent)
        .mockResolvedValueOnce(mockExecutedIntent)

      const result = await intentsService.waitForExecution(params, {
        maxRetries: 5,
        intervalMs: 1000,
      })

      expect(result.status).toBe("Executed")
      expect(result.isTerminal).toBe(true)
      expect(result.isSuccess).toBe(true)
      expect(mockApiService.get).toHaveBeenCalledTimes(3)
      expect(sleep).toHaveBeenCalledTimes(2) // Sleep between attempts
    })

    it("should stop polling after maxRetries and return non-terminal result", async () => {
      const mockOpenIntent = {
        data: { id: mockIntentId, state: { status: "Open" } },
      }
      mockApiService.get.mockResolvedValue(mockOpenIntent)

      const result = await intentsService.waitForExecution(params, {
        maxRetries: 3,
        intervalMs: 1000,
      })

      expect(result.status).toBe("Open")
      expect(result.isTerminal).toBe(false)
      expect(result.isSuccess).toBe(false)
      expect(mockApiService.get).toHaveBeenCalledTimes(4) // 3 attempts + final check
      expect(sleep).toHaveBeenCalledTimes(2)
    })

    it("should use default maxRetries and intervalMs when not provided", async () => {
      const mockExecutedIntent = {
        data: { id: mockIntentId, state: { status: "Executed" } },
      }
      mockApiService.get.mockResolvedValue(mockExecutedIntent)

      await intentsService.waitForExecution(params)

      expect(mockApiService.get).toHaveBeenCalledTimes(1)
    })

    it("should call onStatusCheck callback on each poll", async () => {
      const mockOpenIntent = {
        data: { id: mockIntentId, state: { status: "Open" } },
      }
      const mockExecutedIntent = {
        data: { id: mockIntentId, state: { status: "Executed" } },
      }

      mockApiService.get
        .mockResolvedValueOnce(mockOpenIntent)
        .mockResolvedValueOnce(mockExecutedIntent)

      const onStatusCheck = vi.fn()

      await intentsService.waitForExecution(params, {
        maxRetries: 5,
        intervalMs: 1000,
        onStatusCheck,
      })

      expect(onStatusCheck).toHaveBeenCalledTimes(2)
      expect(onStatusCheck).toHaveBeenNthCalledWith(1, "Open", 1)
      expect(onStatusCheck).toHaveBeenNthCalledWith(2, "Executed", 2)
    })

    it("should retry on 404 errors with notFoundRetries", async () => {
      const notFoundError = new CustodyError({ reason: "Not found" }, 404)
      const mockIntent = {
        data: { id: mockIntentId, state: { status: "Executed" } },
      }

      mockApiService.get
        .mockRejectedValueOnce(notFoundError)
        .mockRejectedValueOnce(notFoundError)
        .mockResolvedValueOnce(mockIntent)

      const result = await intentsService.waitForExecution(params, {
        maxRetries: 5,
        notFoundRetries: 3,
        notFoundIntervalMs: 500,
      })

      expect(result.status).toBe("Executed")
      expect(result.isSuccess).toBe(true)
      expect(mockApiService.get).toHaveBeenCalledTimes(3)
      expect(sleep).toHaveBeenCalledWith(500) // notFoundIntervalMs
    })

    it("should throw non-404 errors immediately", async () => {
      const serverError = new CustodyError({ reason: "Server error" }, 500)
      mockApiService.get.mockRejectedValueOnce(serverError)

      await expect(intentsService.waitForExecution(params)).rejects.toThrow(CustodyError)
      expect(mockApiService.get).toHaveBeenCalledTimes(1)
    })

    it("should throw last 404 error after exhausting notFoundRetries", async () => {
      const notFoundError = new CustodyError({ reason: "Not found" }, 404)
      mockApiService.get.mockRejectedValue(notFoundError)

      await expect(
        intentsService.waitForExecution(params, {
          maxRetries: 2,
          notFoundRetries: 2,
        }),
      ).rejects.toThrow(CustodyError)

      expect(mockApiService.get).toHaveBeenCalledTimes(2) // notFoundRetries
    })

    it("should not sleep after the last polling attempt", async () => {
      const mockOpenIntent = {
        data: { id: mockIntentId, state: { status: "Open" } },
      }
      mockApiService.get.mockResolvedValue(mockOpenIntent)

      await intentsService.waitForExecution(params, {
        maxRetries: 2,
        intervalMs: 1000,
      })

      // Should sleep once (between attempt 1 and 2), but not after attempt 2
      expect(sleep).toHaveBeenCalledTimes(1)
    })
  })
})
