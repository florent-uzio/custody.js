import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { DEFAULT_TIMEOUT_MS } from "../../constants/index.js"
import { CustodyError } from "../../models/custody-error.js"
import { AuthService } from "./auth.service.js"
import type { AuthFormData } from "./auth.service.types.js"

// Mock axios
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn(),
    })),
    isAxiosError: vi.fn(),
  },
}))

import axios from "axios"

describe("AuthService", () => {
  const mockAuthUrl = "https://auth.example.com"
  const mockAuthData: AuthFormData = {
    challenge: "test-challenge",
    publicKey: "test-public-key",
    signature: "test-signature",
  }
  const mockAccessToken = "mock-access-token-123"

  let authService: AuthService
  let mockAxiosInstance: { post: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    // Setup mock axios instance
    mockAxiosInstance = {
      post: vi.fn().mockResolvedValue({
        data: { access_token: mockAccessToken },
      }),
    }
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any)

    authService = new AuthService({ authUrl: mockAuthUrl })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("constructor", () => {
    it("should create axios client with correct configuration", () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: mockAuthUrl,
        timeout: DEFAULT_TIMEOUT_MS,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    })

    it("should use custom timeout when provided", () => {
      const customTimeout = 60_000
      new AuthService({ authUrl: mockAuthUrl, timeout: customTimeout })

      expect(axios.create).toHaveBeenLastCalledWith({
        baseURL: mockAuthUrl,
        timeout: customTimeout,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    })
  })

  describe("getToken", () => {
    it("should fetch a new token when no token exists", async () => {
      const token = await authService.getToken(mockAuthData)

      expect(token).toBe(mockAccessToken)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)
      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/token", expect.any(URLSearchParams))
    })

    it("should send correct form data when fetching token", async () => {
      await authService.getToken(mockAuthData)

      const callArgs = mockAxiosInstance.post.mock.calls[0]
      const formData = callArgs?.[1] as URLSearchParams

      expect(formData.get("grant_type")).toBe("password")
      expect(formData.get("client_id")).toBe("customer_api")
      expect(formData.get("signature")).toBe(mockAuthData.signature)
      expect(formData.get("challenge")).toBe(mockAuthData.challenge)
      expect(formData.get("public_key")).toBe(mockAuthData.publicKey)
    })

    it("should return cached token when token is still valid", async () => {
      // First call - fetches token
      await authService.getToken(mockAuthData)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)

      // Second call - should use cached token
      const token = await authService.getToken(mockAuthData)
      expect(token).toBe(mockAccessToken)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1) // Still 1
    })

    it("should fetch new token when cached token is expired", async () => {
      // First call - fetches token
      await authService.getToken(mockAuthData)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)

      // Advance time past expiration (4 hours + buffer)
      vi.advanceTimersByTime(4 * 60 * 60 * 1000 + 1)

      // Second call - should fetch new token
      await authService.getToken(mockAuthData)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2)
    })

    it("should fetch new token when within 5-minute buffer of expiration", async () => {
      // First call - fetches token
      await authService.getToken(mockAuthData)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)

      // Advance time to 5 minutes before expiration (within buffer)
      const fourHoursMinusFiveMinutes = 4 * 60 * 60 * 1000 - 5 * 60 * 1000 + 1
      vi.advanceTimersByTime(fourHoursMinusFiveMinutes)

      // Second call - should fetch new token (within buffer)
      await authService.getToken(mockAuthData)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2)
    })

    it("should handle concurrent token requests with single fetch (race condition prevention)", async () => {
      // Simulate slow token fetch
      let resolveToken: (value: { data: { access_token: string } }) => void
      mockAxiosInstance.post.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveToken = resolve
          }),
      )

      // Start multiple concurrent requests
      const promise1 = authService.getToken(mockAuthData)
      const promise2 = authService.getToken(mockAuthData)
      const promise3 = authService.getToken(mockAuthData)

      // Resolve the single fetch
      resolveToken!({ data: { access_token: mockAccessToken } })

      // All promises should resolve to the same token
      const [token1, token2, token3] = await Promise.all([promise1, promise2, promise3])

      expect(token1).toBe(mockAccessToken)
      expect(token2).toBe(mockAccessToken)
      expect(token3).toBe(mockAccessToken)

      // Only one fetch should have been made
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)
    })

    it("should clear refresh promise after successful fetch", async () => {
      await authService.getToken(mockAuthData)

      // Advance time to expire the token
      vi.advanceTimersByTime(4 * 60 * 60 * 1000 + 1)

      // Should be able to fetch again (promise was cleared)
      await authService.getToken(mockAuthData)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2)
    })

    it("should clear refresh promise after failed fetch", async () => {
      const error = new Error("Auth failed")
      mockAxiosInstance.post.mockRejectedValueOnce(error)

      // First call fails
      await expect(authService.getToken(mockAuthData)).rejects.toThrow(CustodyError)

      // Reset mock to succeed
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { access_token: mockAccessToken },
      })

      // Second call should work (promise was cleared)
      const token = await authService.getToken(mockAuthData)
      expect(token).toBe(mockAccessToken)
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2)
    })

    it("should throw CustodyError with API error data when axios error has response", async () => {
      const axiosError = {
        response: {
          status: 401,
          statusText: "Unauthorized",
          data: { reason: "Invalid credentials", message: "Authentication failed" },
        },
      }
      mockAxiosInstance.post.mockRejectedValueOnce(axiosError)
      vi.mocked(axios.isAxiosError).mockReturnValue(true)

      await expect(authService.getToken(mockAuthData)).rejects.toMatchObject({
        name: "CustodyError",
        message: "Invalid credentials",
        statusCode: 401,
        errorMessage: "Authentication failed",
      })
    })

    it("should throw CustodyError with generic message for non-axios errors", async () => {
      const error = new Error("Network error")
      mockAxiosInstance.post.mockRejectedValueOnce(error)
      vi.mocked(axios.isAxiosError).mockReturnValue(false)

      await expect(authService.getToken(mockAuthData)).rejects.toMatchObject({
        name: "CustodyError",
        message: "Authentication request failed",
        cause: error,
      })
    })
  })

  describe("isTokenExpired", () => {
    it("should return true when no token has been fetched", () => {
      expect(authService.isTokenExpired()).toBe(true)
    })

    it("should return false immediately after fetching token", async () => {
      await authService.getToken(mockAuthData)
      expect(authService.isTokenExpired()).toBe(false)
    })

    it("should return true when token is expired", async () => {
      await authService.getToken(mockAuthData)

      // Advance past expiration
      vi.advanceTimersByTime(4 * 60 * 60 * 1000 + 1)

      expect(authService.isTokenExpired()).toBe(true)
    })

    it("should return true when within 5-minute buffer of expiration", async () => {
      await authService.getToken(mockAuthData)

      // Advance to just within the 5-minute buffer
      const justWithinBuffer = 4 * 60 * 60 * 1000 - 5 * 60 * 1000 + 1
      vi.advanceTimersByTime(justWithinBuffer)

      expect(authService.isTokenExpired()).toBe(true)
    })

    it("should return false when outside 5-minute buffer", async () => {
      await authService.getToken(mockAuthData)

      // Advance to just outside the 5-minute buffer
      const justOutsideBuffer = 4 * 60 * 60 * 1000 - 5 * 60 * 1000 - 1000
      vi.advanceTimersByTime(justOutsideBuffer)

      expect(authService.isTokenExpired()).toBe(false)
    })
  })

  describe("getCurrentToken", () => {
    it("should return null when no token has been fetched", () => {
      expect(authService.getCurrentToken()).toBe("")
    })

    it("should return the current token after fetching", async () => {
      await authService.getToken(mockAuthData)
      expect(authService.getCurrentToken()).toBe(mockAccessToken)
    })

    it("should return the token even if expired (no validation)", async () => {
      await authService.getToken(mockAuthData)

      // Advance past expiration
      vi.advanceTimersByTime(4 * 60 * 60 * 1000 + 1)

      // getCurrentToken doesn't validate, just returns the stored token
      expect(authService.getCurrentToken()).toBe(mockAccessToken)
    })
  })
})
