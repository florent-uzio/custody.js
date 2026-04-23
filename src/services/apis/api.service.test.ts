import { type InternalAxiosRequestConfig } from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DEFAULT_TIMEOUT_MS } from "../../constants/index.js"
import { CustodyError } from "../../models/custody-error.js"
import { ApiService } from "./api.service.js"

// Mock dependencies
vi.mock("axios", () => {
  // Make the instance callable (Axios instances are callable for retries)
  const mockAxiosInstance: any = vi.fn(() => Promise.resolve({ data: {} }))
  mockAxiosInstance.get = vi.fn()
  mockAxiosInstance.post = vi.fn()
  mockAxiosInstance.defaults = { paramsSerializer: null }
  mockAxiosInstance.interceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  }

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      isAxiosError: vi.fn((error: any) => error?.isAxiosError === true),
    },
  }
})

vi.mock("uuid", () => ({
  v4: vi.fn(() => "mock-uuid-challenge"),
}))

vi.mock("canonicalize", () => ({
  default: vi.fn((obj) => JSON.stringify(obj)),
}))

vi.mock("../keypairs/index.js", () => {
  const mockDetectKeyType = vi.fn((_privateKey: string | Buffer) => "ed25519" as const)
  return {
    KeypairService: Object.assign(
      vi.fn().mockImplementation(() => ({
        sign: vi.fn(() => "mock-signature"),
      })),
      { detectKeyType: mockDetectKeyType },
    ),
  }
})

import axios from "axios"
import { KeypairService } from "../keypairs/index.js"

describe("ApiService", () => {
  const mockApiUrl = "https://api.example.com"
  const mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIOrNTK/ChGQUdwitzdtwnhxfaBgRhR7vQaUxwXWTptnL
-----END PRIVATE KEY-----`
  const mockPublicKey = "mock-public-key"

  // Mock AuthService
  const mockAuthService = {
    isTokenExpired: vi.fn(() => false),
    getToken: vi.fn(() => Promise.resolve("mock-jwt-token")),
    getCurrentToken: vi.fn(() => "mock-jwt-token"),
  }

  let apiService: ApiService
  let mockAxiosInstance: {
    get: ReturnType<typeof vi.fn>
    post: ReturnType<typeof vi.fn>
    defaults: { paramsSerializer: unknown }
    interceptors: {
      request: { use: ReturnType<typeof vi.fn> }
      response: { use: ReturnType<typeof vi.fn> }
    }
  }
  let requestInterceptor: (
    config: InternalAxiosRequestConfig,
  ) => Promise<InternalAxiosRequestConfig>
  let responseErrorInterceptor: (error: any) => Promise<any>

  beforeEach(() => {
    vi.clearAllMocks()

    // Get reference to mock axios instance
    mockAxiosInstance = vi.mocked(axios.create)() as unknown as typeof mockAxiosInstance

    // Reset AuthService mocks
    mockAuthService.isTokenExpired.mockReturnValue(false)
    mockAuthService.getToken.mockResolvedValue("mock-jwt-token")
    mockAuthService.getCurrentToken.mockReturnValue("mock-jwt-token")

    // Create ApiService
    apiService = new ApiService({
      apiUrl: mockApiUrl,
      authFormData: { publicKey: mockPublicKey },
      authService: mockAuthService as any,
      privateKey: mockPrivateKey,
    })

    // Capture the request interceptor
    const requestInterceptorCall = mockAxiosInstance.interceptors.request.use.mock.calls[0]
    requestInterceptor = requestInterceptorCall?.[0]

    // Capture the response error interceptor
    const responseInterceptorCall = mockAxiosInstance.interceptors.response.use.mock.calls[0]
    responseErrorInterceptor = responseInterceptorCall?.[1]
  })

  describe("constructor", () => {
    it("should create axios client with correct configuration", () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: mockApiUrl,
        timeout: DEFAULT_TIMEOUT_MS,
        headers: {
          "Content-Type": "application/json",
        },
      })
    })

    it("should use custom timeout when provided", () => {
      const customTimeout = 60_000
      vi.clearAllMocks()

      new ApiService({
        apiUrl: mockApiUrl,
        authFormData: { publicKey: mockPublicKey },
        authService: mockAuthService as any,
        privateKey: mockPrivateKey,
        timeout: customTimeout,
      })

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: mockApiUrl,
        timeout: customTimeout,
        headers: {
          "Content-Type": "application/json",
        },
      })
    })

    it("should register request interceptor", () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(1)
      expect(typeof requestInterceptor).toBe("function")
    })

    it("should register response interceptor", () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(1)
      expect(typeof responseErrorInterceptor).toBe("function")
    })

    it("should throw error for unsupported private key algorithm", () => {
      vi.mocked(KeypairService.detectKeyType).mockReturnValue("unknown")

      expect(
        () =>
          new ApiService({
            apiUrl: mockApiUrl,
            authFormData: { publicKey: mockPublicKey },
            authService: mockAuthService as any,
            privateKey: "invalid-key",
          }),
      ).toThrow("Unsupported private key algorithm")

      // Reset for other tests
      vi.mocked(KeypairService.detectKeyType).mockReturnValue("ed25519")
    })

    it("should use provided challenge if available", async () => {
      const customChallenge = "custom-challenge"
      vi.clearAllMocks()

      new ApiService({
        apiUrl: mockApiUrl,
        authFormData: { publicKey: mockPublicKey, challenge: customChallenge },
        authService: mockAuthService as any,
        privateKey: mockPrivateKey,
      })

      // The challenge is used internally, we verify it doesn't generate a new one
      const { v4 } = await import("uuid")
      // v4 should not be called when challenge is provided
      expect(vi.mocked(v4)).not.toHaveBeenCalled()
    })
  })

  describe("request interceptor", () => {
    it("should inject JWT token into request headers", async () => {
      const mockConfig = {
        headers: {},
      } as InternalAxiosRequestConfig

      const result = await requestInterceptor(mockConfig)

      expect(result.headers.Authorization).toBe("Bearer mock-jwt-token")
    })

    it("should use cached token when not expired", async () => {
      mockAuthService.isTokenExpired.mockReturnValue(false)

      const mockConfig = { headers: {} } as InternalAxiosRequestConfig
      await requestInterceptor(mockConfig)

      expect(mockAuthService.getCurrentToken).toHaveBeenCalled()
      expect(mockAuthService.getToken).not.toHaveBeenCalled()
    })

    it("should refresh token when expired", async () => {
      mockAuthService.isTokenExpired.mockReturnValue(true)
      mockAuthService.getToken.mockResolvedValue("new-jwt-token")

      const mockConfig = { headers: {} } as InternalAxiosRequestConfig
      const result = await requestInterceptor(mockConfig)

      expect(mockAuthService.getToken).toHaveBeenCalled()
      expect(result.headers.Authorization).toBe("Bearer new-jwt-token")
    })
  })

  describe("get", () => {
    it("should make GET request and return data", async () => {
      const mockResponse = { data: { id: "123", name: "test" } }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const result = await apiService.get("/test-endpoint")

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test-endpoint", { params: undefined })
      expect(result).toEqual(mockResponse.data)
    })

    it("should pass query params to GET request", async () => {
      const mockResponse = { data: { items: [] } }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const params = { limit: 10, offset: 0 }
      await apiService.get("/test-endpoint", params)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test-endpoint", { params })
    })

    it("should throw CustodyError on API error with error structure", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { reason: "Bad request", message: "Invalid parameters" },
        },
        message: "Request failed",
      }
      mockAxiosInstance.get.mockRejectedValue(axiosError)

      await expect(apiService.get("/test-endpoint")).rejects.toThrow(CustodyError)

      try {
        await apiService.get("/test-endpoint")
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Bad request")
        expect((error as CustodyError).statusCode).toBe(400)
      }
    })

    it("should throw CustodyError with fallback message on unexpected error format", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: "Internal Server Error", // Not an object
        },
        message: "Server error",
      }
      mockAxiosInstance.get.mockRejectedValue(axiosError)

      try {
        await apiService.get("/test-endpoint")
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toContain("GET API request failed")
        expect((error as CustodyError).statusCode).toBe(500)
      }
    })

    it("should wrap non-Axios errors as CustodyError", async () => {
      const genericError = new Error("Network failure")
      mockAxiosInstance.get.mockRejectedValue(genericError)

      try {
        await apiService.get("/test-endpoint")
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Network failure")
        expect((error as CustodyError).cause).toBe(genericError)
      }
    })

    it("should handle unknown error types", async () => {
      mockAxiosInstance.get.mockRejectedValue("string error")

      try {
        await apiService.get("/test-endpoint")
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Unknown error occurred")
      }
    })
  })

  describe("post", () => {
    it("should make POST request and return data", async () => {
      const mockResponse = { data: { id: "456", status: "created" } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const body = { request: { type: "test" }, signature: "existing-signature" }
      const result = await apiService.post("/test-endpoint", body)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/test-endpoint", body, undefined)
      expect(result).toEqual(mockResponse.data)
    })

    it("should auto-sign request when signature is missing", async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const body = { request: { type: "test", data: "value" }, signature: "" }
      await apiService.post("/test-endpoint", body)

      // Body should have been mutated with signature
      expect(body.signature).toBe("mock-signature")
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/test-endpoint",
        expect.objectContaining({ signature: "mock-signature" }),
        undefined,
      )
    })

    it("should auto-sign request when signature is undefined", async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const body = { request: { type: "test" } } as any
      await apiService.post("/test-endpoint", body)

      expect(body.signature).toBe("mock-signature")
    })

    it("should preserve existing signature", async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const existingSignature = "pre-existing-signature"
      const body = { request: { type: "test" }, signature: existingSignature }
      await apiService.post("/test-endpoint", body)

      expect(body.signature).toBe(existingSignature)
    })

    it("should pass config to POST request", async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const body = { request: {}, signature: "sig" }
      const config = { headers: { "X-Custom": "header" } }
      await apiService.post("/test-endpoint", body, config)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/test-endpoint", body, config)
    })

    it("should throw CustodyError when canonicalization fails", async () => {
      const canonicalize = (await import("canonicalize")).default
      vi.mocked(canonicalize).mockReturnValueOnce(undefined as any)

      const body = { request: { type: "test" }, signature: "" }

      await expect(apiService.post("/test-endpoint", body)).rejects.toThrow(CustodyError)

      try {
        vi.mocked(canonicalize).mockReturnValueOnce(undefined as any)
        await apiService.post("/test-endpoint", { request: {}, signature: "" })
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Failed to canonicalize request body")
      }
    })

    it("should throw CustodyError on API error with error structure", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: { reason: "Forbidden", message: "Insufficient permissions" },
        },
        message: "Request failed",
      }
      mockAxiosInstance.post.mockRejectedValue(axiosError)

      try {
        await apiService.post("/test-endpoint", { request: {}, signature: "sig" })
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Forbidden")
        expect((error as CustodyError).statusCode).toBe(403)
        expect((error as CustodyError).errorMessage).toBe("Insufficient permissions")
      }
    })

    it("should throw CustodyError with fallback message on unexpected error format", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 502,
          data: null,
        },
        message: "Bad gateway",
      }
      mockAxiosInstance.post.mockRejectedValue(axiosError)

      try {
        await apiService.post("/test-endpoint", { request: {}, signature: "sig" })
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toContain("POST API request failed")
        expect((error as CustodyError).statusCode).toBe(502)
      }
    })

    it("should wrap non-Axios errors as CustodyError", async () => {
      const genericError = new Error("Serialization failed")
      mockAxiosInstance.post.mockRejectedValue(genericError)

      try {
        await apiService.post("/test-endpoint", { request: {}, signature: "sig" })
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Serialization failed")
      }
    })

    it("should skip signing when body is undefined", async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const result = await apiService.post("/test-endpoint", undefined)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/test-endpoint", undefined, undefined)
      expect(result).toEqual(mockResponse.data)
    })

    it("should skip signing/canonicalization when sign: false is passed", async () => {
      const canonicalize = (await import("canonicalize")).default
      vi.mocked(canonicalize).mockClear()

      const mockResponse = { data: { id: "ch-1" } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      // Flat body (no `request`/`signature` envelope) — would blow up if canonicalization ran
      const body = { name: "hook", url: "https://example.com/webhook" }
      await apiService.post("/test-endpoint", body, { sign: false })

      expect(vi.mocked(canonicalize)).not.toHaveBeenCalled()
      expect(body).not.toHaveProperty("signature")
      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/test-endpoint", body, {})
    })

    it("should still sign when sign: true is passed explicitly", async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const body = { request: { type: "test" }, signature: "" }
      await apiService.post("/test-endpoint", body, { sign: true })

      expect(body.signature).toBe("mock-signature")
    })
  })

  describe("response interceptor (401 retry)", () => {
    it("should retry request with refreshed token on 401", async () => {
      mockAuthService.isTokenExpired.mockReturnValue(true)
      mockAuthService.getToken.mockResolvedValue("refreshed-jwt-token")

      const retryData = { id: "123", retried: true }
      // Mock the callable axios instance for retry
      ;(mockAxiosInstance as any as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: retryData,
      })

      const originalConfig = { headers: { Authorization: "Bearer old-token" }, _retried: false }
      const error401 = {
        isAxiosError: true,
        response: { status: 401, data: { reason: "Unauthorized" } },
        config: originalConfig,
      }

      const result = await responseErrorInterceptor(error401)

      // Token should have been refreshed
      expect(mockAuthService.getToken).toHaveBeenCalled()
      // Original request should be marked as retried
      expect(originalConfig._retried).toBe(true)
      // Authorization header should be updated
      expect(originalConfig.headers.Authorization).toBe("Bearer refreshed-jwt-token")
      // Should return the retried response
      expect(result).toEqual({ data: retryData })
    })

    it("should not retry on non-401 errors", async () => {
      const error500 = {
        isAxiosError: true,
        response: { status: 500, data: { reason: "Server Error" } },
        config: { headers: {} },
      }

      await expect(responseErrorInterceptor(error500)).rejects.toEqual(error500)
      expect(mockAuthService.getToken).not.toHaveBeenCalled()
    })

    it("should not retry if already retried (_retried flag)", async () => {
      const error401 = {
        isAxiosError: true,
        response: { status: 401, data: { reason: "Unauthorized" } },
        config: { headers: {}, _retried: true },
      }

      await expect(responseErrorInterceptor(error401)).rejects.toEqual(error401)
      expect(mockAuthService.getToken).not.toHaveBeenCalled()
    })

    it("should not retry when config is missing", async () => {
      const error401 = {
        isAxiosError: true,
        response: { status: 401, data: { reason: "Unauthorized" } },
        config: undefined,
      }

      await expect(responseErrorInterceptor(error401)).rejects.toEqual(error401)
    })
  })

  describe("challenge refresh", () => {
    it("should generate a fresh challenge on token refresh", async () => {
      const { v4 } = await import("uuid")
      vi.mocked(v4).mockClear()

      mockAuthService.isTokenExpired.mockReturnValue(true)
      mockAuthService.getToken.mockResolvedValue("new-token")

      const mockConfig = { headers: {} } as InternalAxiosRequestConfig
      await requestInterceptor(mockConfig)

      // v4 should have been called to generate a fresh challenge
      expect(vi.mocked(v4)).toHaveBeenCalled()
    })

    it("should not regenerate challenge when user provided one", async () => {
      const { v4 } = await import("uuid")
      vi.mocked(v4).mockClear()
      vi.clearAllMocks()

      const customChallenge = "user-provided-challenge"
      const serviceWithChallenge = new ApiService({
        apiUrl: mockApiUrl,
        authFormData: { publicKey: mockPublicKey, challenge: customChallenge },
        authService: mockAuthService as any,
        privateKey: mockPrivateKey,
      })

      mockAuthService.isTokenExpired.mockReturnValue(true)
      mockAuthService.getToken.mockResolvedValue("new-token")

      // Capture the new request interceptor
      const newInterceptorCall = mockAxiosInstance.interceptors.request.use.mock.calls.at(-1)
      const newRequestInterceptor = newInterceptorCall?.[0]

      const mockConfig = { headers: {} } as InternalAxiosRequestConfig
      await newRequestInterceptor(mockConfig)

      // getToken should have been called with the user-provided challenge
      expect(mockAuthService.getToken).toHaveBeenCalledWith(
        expect.objectContaining({ challenge: customChallenge }),
      )
    })
  })
})
