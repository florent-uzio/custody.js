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
  mockAxiosInstance.patch = vi.fn()
  mockAxiosInstance.delete = vi.fn()
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
      vi.fn().mockImplementation(function () {
        return { sign: vi.fn(() => "mock-signature") }
      }),
      { detectKeyType: mockDetectKeyType },
    ),
  }
})

import axios from "axios"
import type { CustodySigner } from "../../ripple-custody.types.js"
import { KeypairService } from "../keypairs/index.js"
import {
  encodeSignature,
  prepareSigningInput,
  signRawWithPrivateKey,
} from "../keypairs/signing-scheme.js"

describe("ApiService", () => {
  const mockApiUrl = "https://api.example.com"
  const mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIOrNTK/ChGQUdwitzdtwnhxfaBgRhR7vQaUxwXWTptnL
-----END PRIVATE KEY-----`
  const mockPublicKey = "mock-public-key"

  // The privateKey path signs via the real signing scheme (canonicalize is mocked
  // to JSON.stringify), so the expected request-body signature is deterministic
  // for the ed25519 mockPrivateKey.
  const expectedPrivateKeySignature = (request: unknown) =>
    encodeSignature(
      "ed25519",
      signRawWithPrivateKey(
        "ed25519",
        mockPrivateKey,
        prepareSigningInput("ed25519", JSON.stringify(request), "request-body"),
      ),
    )

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
    patch: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
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

    it("should throw CustodyError for a private key that passes detectKeyType but fails to parse", () => {
      // The mocked detectKeyType accepts anything, mimicking a corrupt PEM whose
      // base64 body still contains a recognizable algorithm OID.
      expect(
        () =>
          new ApiService({
            apiUrl: mockApiUrl,
            authFormData: { publicKey: mockPublicKey },
            authService: mockAuthService as any,
            privateKey: "-----BEGIN PRIVATE KEY-----\ngarbage\n-----END PRIVATE KEY-----",
          }),
      ).toThrow(CustodyError)
    })

  })

  describe("external signer", () => {
    const buildWithSigner = (signer: CustodySigner) => {
      vi.clearAllMocks()
      const service = new ApiService({
        apiUrl: mockApiUrl,
        authFormData: { publicKey: mockPublicKey },
        authService: mockAuthService as any,
        signer,
      })
      const call = mockAxiosInstance.interceptors.request.use.mock.calls.at(-1)
      return { service, requestInterceptor: call?.[0] as typeof requestInterceptor }
    }

    // secp256k1 keeps the encode step to plain base64, so assertions stay simple.
    const secpSigner = (sign: CustodySigner["sign"]): CustodySigner => ({
      algorithm: "secp256k1",
      sign,
    })
    const b64 = (s: string) => Buffer.from(s).toString("base64")

    it("signs the auth challenge with 'auth-challenge' context and encodes the result", async () => {
      mockAuthService.isTokenExpired.mockReturnValue(true)
      const sign = vi.fn(() => Buffer.from("chal-sig"))
      const { requestInterceptor: interceptor } = buildWithSigner(secpSigner(sign))

      await interceptor({ headers: {} } as InternalAxiosRequestConfig)

      expect(sign).toHaveBeenCalledWith({
        data: Buffer.from("mock-uuid-challenge"),
        context: "auth-challenge",
      })
      expect(mockAuthService.getToken).toHaveBeenCalledWith(
        expect.objectContaining({ signature: b64("chal-sig") }),
        false,
      )
    })

    it("signs the canonicalized body with 'request-body' context and encodes the result", async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: {} })
      const sign = vi.fn(() => Buffer.from("body-sig"))
      const { service } = buildWithSigner(secpSigner(sign))

      const body = { request: { type: "test", data: "value" }, signature: "" }
      await service.post("/test-endpoint", body)

      // canonicalize is mocked to JSON.stringify
      expect(sign).toHaveBeenCalledWith({
        data: Buffer.from(JSON.stringify(body.request)),
        context: "request-body",
      })
      expect(body.signature).toBe(b64("body-sig"))
    })

    it("awaits an async signer", async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: {} })
      const { service } = buildWithSigner(
        secpSigner(() => Promise.resolve(Buffer.from("async-sig"))),
      )

      const body = { request: { type: "test" }, signature: "" }
      await service.post("/test-endpoint", body)

      expect(body.signature).toBe(b64("async-sig"))
    })

    it("does not detect a key algorithm when using a signer", () => {
      buildWithSigner(secpSigner(() => Buffer.from("x")))
      expect(vi.mocked(KeypairService.detectKeyType)).not.toHaveBeenCalled()
    })

    it("wraps a throwing signer in a CustodyError on the POST body path", async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: {} })
      const hsmError = new Error("hsm offline")
      const { service } = buildWithSigner(
        secpSigner(() => {
          throw hsmError
        }),
      )

      const body = { request: { type: "test" }, signature: "" }
      const error = await service.post("/test-endpoint", body).catch((e) => e)

      expect(error).toBeInstanceOf(CustodyError)
      expect(error.message).toMatch(/External signer failed: hsm offline/)
      // Not double-wrapped: handleRequestError rethrows an existing CustodyError
      // as-is, so the cause is the original signer error, not a nested CustodyError.
      expect(error.cause).toBe(hsmError)
    })

    it("wraps a rejecting async signer in a CustodyError on the auth-challenge path", async () => {
      mockAuthService.isTokenExpired.mockReturnValue(true)
      const { requestInterceptor: interceptor } = buildWithSigner(
        secpSigner(() => Promise.reject(new Error("kms denied"))),
      )

      await expect(interceptor({ headers: {} } as InternalAxiosRequestConfig)).rejects.toThrow(
        /External signer failed: kms denied/,
      )
    })

    it("throws when the signer returns a non-Uint8Array signature", async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: {} })
      const { service } = buildWithSigner(secpSigner(() => "not-bytes" as any))

      const body = { request: { type: "test" }, signature: "" }
      await expect(service.post("/test-endpoint", body)).rejects.toThrow(CustodyError)
    })

    it("collapses concurrent expired-token refreshes into a single signer call", async () => {
      mockAuthService.isTokenExpired.mockReturnValue(true)
      let resolveToken: (token: string) => void = () => {}
      mockAuthService.getToken.mockReturnValue(
        new Promise((resolve) => {
          resolveToken = resolve
        }),
      )
      const sign = vi.fn(() => Buffer.from("sig"))
      const { requestInterceptor: interceptor } = buildWithSigner(secpSigner(sign))

      const p1 = interceptor({ headers: {} } as InternalAxiosRequestConfig)
      const p2 = interceptor({ headers: {} } as InternalAxiosRequestConfig)
      resolveToken("token")
      await Promise.all([p1, p2])

      expect(sign).toHaveBeenCalledTimes(1)
    })

    it("does not let an overtaken refresh clobber a newer forced refresh", async () => {
      // A non-forced refresh (A) is in flight when a 401 forces a new refresh (B)
      // that overtakes it. When A settles, its `.finally` must not null out B's
      // registration — otherwise a later caller starts a redundant third refresh.
      const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
      const sign = vi.fn(() => Buffer.from("sig"))
      const { requestInterceptor: interceptor } = buildWithSigner(secpSigner(sign))
      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls.at(
        -1,
      )?.[1] as typeof responseErrorInterceptor

      mockAuthService.isTokenExpired.mockReturnValue(true)
      const resolvers: Array<(token: string) => void> = []
      mockAuthService.getToken.mockImplementation(
        () => new Promise<string>((resolve) => resolvers.push(resolve)),
      )

      // Refresh A: non-forced (challenge signed once, getToken #1).
      const pA = interceptor({ headers: {} } as InternalAxiosRequestConfig)

      // Refresh B: forced by a 401, overtaking A (getToken #2).
      ;(mockAxiosInstance as any as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: {} })
      const originalRequest = { headers: {}, _retried: false }
      const pB = responseInterceptor({
        isAxiosError: true,
        response: { status: 401 },
        config: originalRequest,
      })

      await flush()
      expect(mockAuthService.getToken).toHaveBeenCalledTimes(2)

      // A settles first; its `.finally` must leave B's registration intact.
      resolvers[0]("token-A")
      await pA
      await flush()

      // A later caller reuses B rather than starting a third refresh.
      const pC = interceptor({ headers: {} } as InternalAxiosRequestConfig)
      await flush()
      expect(mockAuthService.getToken).toHaveBeenCalledTimes(2)
      expect(sign).toHaveBeenCalledTimes(2)

      resolvers[1]("token-B")
      await Promise.all([pB, pC])
    })

    it("pairs each concurrent refresh's signature with its own challenge", async () => {
      // Forced refreshes deliberately run alongside an in-flight one, so the
      // challenge cannot live on shared state: signing is awaited, and a sibling
      // overwriting it mid-await would post signature(A) against challenge(B) —
      // a `401 InvalidSignatureError` that looks random under concurrency.
      const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
      const release: Array<() => void> = []
      const sign = vi.fn(
        ({ data }: { data: Uint8Array }) =>
          new Promise<Uint8Array>((resolve) => {
            release.push(() => resolve(Buffer.from(`sig-for-${Buffer.from(data).toString()}`)))
          }),
      )
      const { requestInterceptor: interceptor } = buildWithSigner(secpSigner(sign))
      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls.at(
        -1,
      )?.[1] as typeof responseErrorInterceptor

      const { v4 } = await import("uuid")
      let issued = 0
      vi.mocked(v4).mockImplementation(((): string => `challenge-${++issued}`) as never)
      mockAuthService.isTokenExpired.mockReturnValue(true)
      mockAuthService.getToken.mockResolvedValue("token")

      // Refresh A (non-forced), then refresh B forced by a 401 while A is still
      // awaiting its signer — the window the shared field used to be clobbered in.
      const pA = interceptor({ headers: {} } as InternalAxiosRequestConfig)
      ;(mockAxiosInstance as any as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: {} })
      const pB = responseInterceptor({
        isAxiosError: true,
        response: { status: 401 },
        config: { headers: {}, _retried: false },
      })

      await flush()
      expect(release).toHaveLength(2)
      release.forEach((resolve) => resolve())
      await Promise.all([pA, pB])

      // Each refresh posted the signature it computed over the challenge it sent.
      expect(mockAuthService.getToken).toHaveBeenCalledTimes(2)
      for (const [authData] of mockAuthService.getToken.mock.calls) {
        expect(authData.signature).toBe(b64(`sig-for-${authData.challenge}`))
      }
      // Two distinct challenges really were in flight, so the pairing above is
      // not vacuously true.
      const challenges = mockAuthService.getToken.mock.calls.map(([authData]) => authData.challenge)
      expect(new Set(challenges).size).toBe(2)
    })

    it("throws when neither privateKey nor signer is provided", () => {
      expect(
        () =>
          new ApiService({
            apiUrl: mockApiUrl,
            authFormData: { publicKey: mockPublicKey },
            authService: mockAuthService as any,
          } as any),
      ).toThrow(CustodyError)
    })

    it("throws when both privateKey and signer are provided", () => {
      expect(
        () =>
          new ApiService({
            apiUrl: mockApiUrl,
            authFormData: { publicKey: mockPublicKey },
            authService: mockAuthService as any,
            privateKey: mockPrivateKey,
            signer: secpSigner(() => Buffer.from("sig")),
          } as any),
      ).toThrow(CustodyError)
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

    it("should forward config to GET request alongside params", async () => {
      const mockResponse = { data: { items: [] } }
      mockAxiosInstance.get.mockResolvedValue(mockResponse)

      const params = { limit: 10 }
      const config = { headers: { "X-Custom": "x" } }
      await apiService.get("/test-endpoint", params, config)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test-endpoint", { ...config, params })
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

    it("should preserve a text/plain error body in the thrown reason", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: "Invalid value for: body (Missing required field at 'type')",
        },
        message: "Request failed with status code 400",
      }
      mockAxiosInstance.get.mockRejectedValue(axiosError)

      try {
        await apiService.get("/test-endpoint")
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe(
          "GET API request failed: Invalid value for: body (Missing required field at 'type')",
        )
        expect((error as CustodyError).statusCode).toBe(400)
      }
    })

    it("should fall back to the axios message when the string body is blank", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 500, data: "   " },
        message: "Server error",
      }
      mockAxiosInstance.get.mockRejectedValue(axiosError)

      try {
        await apiService.get("/test-endpoint")
      } catch (error) {
        expect((error as CustodyError).message).toBe("GET API request failed: Server error")
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

    describe("500 query-parameter hint", () => {
      // The params are read off the request config axios attaches to the error,
      // which is what the SDK relies on rather than threading them through.
      const serverError = (status: number, params?: unknown) => ({
        isAxiosError: true,
        response: { status, data: { reason: "Internal server error" } },
        config: { params },
        message: "Request failed with status code 500",
      })

      it("names quarantineStatus on a 500 the parameter was sent with", async () => {
        mockAxiosInstance.get.mockRejectedValue(
          serverError(500, { "recipient.accountId": ["acc-1"], quarantineStatus: "Quarantined" }),
        )

        try {
          await apiService.get("/test-endpoint")
          expect.unreachable()
        } catch (error) {
          const { hint, message, reason } = error as CustodyError
          expect(hint).toContain("`quarantineStatus`")
          expect(hint).toContain("issues/238")
          expect(reason).toBe("Internal server error")
          expect(message).toBe(`Internal server error\n\n${hint}`)
        }
      })

      it("adds no hint on a 500 the parameter was not sent with", async () => {
        mockAxiosInstance.get.mockRejectedValue(serverError(500, { quarantined: true }))

        try {
          await apiService.get("/test-endpoint")
          expect.unreachable()
        } catch (error) {
          expect((error as CustodyError).hint).toBeUndefined()
        }
      })

      it("adds no hint when the parameter appears on a status other than 500", async () => {
        mockAxiosInstance.get.mockRejectedValue(
          serverError(400, { quarantineStatus: "Quarantined" }),
        )

        try {
          await apiService.get("/test-endpoint")
          expect.unreachable()
        } catch (error) {
          expect((error as CustodyError).hint).toBeUndefined()
        }
      })
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
      const expected = expectedPrivateKeySignature(body.request)
      await apiService.post("/test-endpoint", body)

      // Body should have been mutated with signature
      expect(body.signature).toBe(expected)
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/test-endpoint",
        expect.objectContaining({ signature: expected }),
        undefined,
      )
    })

    it("should auto-sign request when signature is undefined", async () => {
      const mockResponse = { data: { success: true } }
      mockAxiosInstance.post.mockResolvedValue(mockResponse)

      const body = { request: { type: "test" } } as any
      const expected = expectedPrivateKeySignature(body.request)
      await apiService.post("/test-endpoint", body)

      expect(body.signature).toBe(expected)
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
      const expected = expectedPrivateKeySignature(body.request)
      await apiService.post("/test-endpoint", body, { sign: true })

      expect(body.signature).toBe(expected)
    })

    describe("401 signature-failure hint", () => {
      const signatureError = (data: unknown) => ({
        isAxiosError: true,
        response: { status: 401, data },
        message: "Request failed",
      })

      const bodyWithFiveFlags = () => ({
        request: {
          payload: {
            parameters: {
              operation: { flags: ["a", "b", "c", "d", "e"] },
            },
          },
        },
        signature: "",
      })

      it("names the oversized array fields on a 401 signature failure", async () => {
        mockAxiosInstance.post.mockRejectedValue(
          signatureError({ reason: "InvalidSignatureError" }),
        )

        try {
          await apiService.post("/test-endpoint", bodyWithFiveFlags())
          expect.unreachable()
        } catch (error) {
          const { hint, message, reason } = error as CustodyError
          expect(hint).toContain("`request.payload.parameters.operation.flags`")
          expect(hint).toContain("issues/223")
          // The API's own reason stays pristine, but the hint rides along in
          // `message` so it shows up in stack traces
          expect(reason).toBe("InvalidSignatureError")
          expect(message).toBe(`InvalidSignatureError\n\n${hint}`)
        }
      })

      it("adds no hint when no array reaches 5 elements", async () => {
        mockAxiosInstance.post.mockRejectedValue(
          signatureError({ reason: "InvalidSignatureError" }),
        )

        const body = { request: { operation: { flags: ["a", "b", "c", "d"] } }, signature: "" }

        try {
          await apiService.post("/test-endpoint", body)
          expect.unreachable()
        } catch (error) {
          expect((error as CustodyError).hint).toBeUndefined()
          expect((error as CustodyError).message).toBe("InvalidSignatureError")
        }
      })

      it("adds no hint on a 401 that is not a signature failure", async () => {
        mockAxiosInstance.post.mockRejectedValue(signatureError({ reason: "Token expired" }))

        try {
          await apiService.post("/test-endpoint", bodyWithFiveFlags())
          expect.unreachable()
        } catch (error) {
          expect((error as CustodyError).hint).toBeUndefined()
          expect((error as CustodyError).message).toBe("Token expired")
        }
      })

      it("adds no hint when the request was not signed", async () => {
        mockAxiosInstance.post.mockRejectedValue(
          signatureError({ reason: "InvalidSignatureError" }),
        )

        try {
          await apiService.post("/test-endpoint", bodyWithFiveFlags(), { sign: false })
          expect.unreachable()
        } catch (error) {
          expect((error as CustodyError).hint).toBeUndefined()
          expect((error as CustodyError).message).toBe("InvalidSignatureError")
        }
      })

      it("appends the hint to the fallback message when the error body is not an object", async () => {
        mockAxiosInstance.post.mockRejectedValue(signatureError("InvalidSignatureError"))

        try {
          await apiService.post("/test-endpoint", bodyWithFiveFlags())
          expect.unreachable()
        } catch (error) {
          const { hint, reason } = error as CustodyError
          expect(reason).toContain("POST API request failed")
          expect(hint).toContain("`request.payload.parameters.operation.flags`")
        }
      })
    })

    describe("beforeSign", () => {
      it("signs and sends what the hook returns", async () => {
        mockAxiosInstance.post.mockResolvedValue({ data: {} })

        const service = new ApiService({
          apiUrl: mockApiUrl,
          authFormData: { publicKey: mockPublicKey },
          authService: mockAuthService as any,
          privateKey: mockPrivateKey,
          beforeSign: (request: any) => ({
            ...request,
            payload: { operation: { flags: [...request.payload.operation.flags].sort() } },
          }),
        })

        const body = {
          request: { type: "Propose", payload: { operation: { flags: ["b", "a"] } } },
          signature: "",
        }
        const sorted = { type: "Propose", payload: { operation: { flags: ["a", "b"] } } }
        await service.post("/test-endpoint", body)

        expect(body.request).toEqual(sorted)
        expect(body.signature).toBe(expectedPrivateKeySignature(sorted))
        expect(mockAxiosInstance.post).toHaveBeenCalledWith("/test-endpoint", body, undefined)
      })

      it("does not run when signing is skipped", async () => {
        mockAxiosInstance.post.mockResolvedValue({ data: {} })

        const beforeSign = vi.fn((request) => request)
        const service = new ApiService({
          apiUrl: mockApiUrl,
          authFormData: { publicKey: mockPublicKey },
          authService: mockAuthService as any,
          privateKey: mockPrivateKey,
          beforeSign,
        })

        await service.post("/test-endpoint", { name: "hook" }, { sign: false })

        expect(beforeSign).not.toHaveBeenCalled()
      })
    })
  })

  describe("patch", () => {
    it("should make PATCH request and return data", async () => {
      const mockResponse = { data: { id: "ch-1", name: "renamed" } }
      mockAxiosInstance.patch.mockResolvedValue(mockResponse)

      const body = { name: "renamed" }
      const result = await apiService.patch("/test-endpoint", body)

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith("/test-endpoint", body, undefined)
      expect(result).toEqual(mockResponse.data)
    })

    it("should forward body without canonicalization or signing", async () => {
      const canonicalize = (await import("canonicalize")).default
      vi.mocked(canonicalize).mockClear()

      mockAxiosInstance.patch.mockResolvedValue({ data: {} })

      const body = { name: "renamed", url: "https://example.com/webhook" }
      await apiService.patch("/test-endpoint", body)

      expect(vi.mocked(canonicalize)).not.toHaveBeenCalled()
      expect(body).not.toHaveProperty("signature")
    })

    it("should pass config to PATCH request", async () => {
      mockAxiosInstance.patch.mockResolvedValue({ data: {} })

      const config = { headers: { "X-Custom": "header" } }
      await apiService.patch("/test-endpoint", { name: "x" }, config)

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith("/test-endpoint", { name: "x" }, config)
    })

    it("should throw CustodyError on API error with error structure", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: { reason: "Not found", message: "Channel does not exist" },
        },
        message: "Request failed",
      }
      mockAxiosInstance.patch.mockRejectedValue(axiosError)

      try {
        await apiService.patch("/test-endpoint", { name: "x" })
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Not found")
        expect((error as CustodyError).statusCode).toBe(404)
      }
    })

    it("should throw CustodyError with fallback message on unexpected error format", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: "Internal Server Error",
        },
        message: "Server error",
      }
      mockAxiosInstance.patch.mockRejectedValue(axiosError)

      try {
        await apiService.patch("/test-endpoint", { name: "x" })
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toContain("PATCH API request failed")
        expect((error as CustodyError).statusCode).toBe(500)
      }
    })

    it("should wrap non-Axios errors as CustodyError", async () => {
      const genericError = new Error("Network failure")
      mockAxiosInstance.patch.mockRejectedValue(genericError)

      try {
        await apiService.patch("/test-endpoint", { name: "x" })
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Network failure")
        expect((error as CustodyError).cause).toBe(genericError)
      }
    })
  })

  describe("delete", () => {
    it("should make DELETE request and return data", async () => {
      const mockResponse = { data: undefined }
      mockAxiosInstance.delete.mockResolvedValue(mockResponse)

      const result = await apiService.delete("/test-endpoint")

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/test-endpoint", undefined)
      expect(result).toEqual(mockResponse.data)
    })

    it("should pass config to DELETE request", async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: undefined })

      const config = { headers: { "X-Custom": "header" } }
      await apiService.delete("/test-endpoint", config)

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/test-endpoint", config)
    })

    it("should throw CustodyError on API error with error structure", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: { reason: "Not found", message: "Channel does not exist" },
        },
        message: "Request failed",
      }
      mockAxiosInstance.delete.mockRejectedValue(axiosError)

      try {
        await apiService.delete("/test-endpoint")
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Not found")
        expect((error as CustodyError).statusCode).toBe(404)
      }
    })

    it("should throw CustodyError with fallback message on unexpected error format", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: "Internal Server Error",
        },
        message: "Server error",
      }
      mockAxiosInstance.delete.mockRejectedValue(axiosError)

      try {
        await apiService.delete("/test-endpoint")
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toContain("DELETE API request failed")
        expect((error as CustodyError).statusCode).toBe(500)
      }
    })

    it("should wrap non-Axios errors as CustodyError", async () => {
      const genericError = new Error("Network failure")
      mockAxiosInstance.delete.mockRejectedValue(genericError)

      try {
        await apiService.delete("/test-endpoint")
      } catch (error) {
        expect(error).toBeInstanceOf(CustodyError)
        expect((error as CustodyError).message).toBe("Network failure")
        expect((error as CustodyError).cause).toBe(genericError)
      }
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

    it("should force a fresh token on 401 retry even when the cached token still looks valid", async () => {
      // Cached token looks valid (not expired) — this is the scenario the retry exists for:
      // server-side revocation/key rotation despite an unexpired cache.
      mockAuthService.isTokenExpired.mockReturnValue(false)
      mockAuthService.getCurrentToken.mockReturnValue("cached-token-A")
      mockAuthService.getToken.mockResolvedValue("fresh-token-B")

      const retryData = { id: "123", retried: true }
      ;(mockAxiosInstance as any as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: retryData,
      })

      const originalConfig = {
        headers: { Authorization: "Bearer cached-token-A" },
        _retried: false,
      }
      const error401 = {
        isAxiosError: true,
        response: { status: 401, data: { reason: "Unauthorized" } },
        config: originalConfig,
      }

      await responseErrorInterceptor(error401)

      // getToken must be called with forceRefresh=true so it bypasses the cached-token early return
      expect(mockAuthService.getToken).toHaveBeenCalledWith(expect.anything(), true)
      expect(originalConfig.headers.Authorization).toBe("Bearer fresh-token-B")
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
      new ApiService({
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
        false,
      )
    })
  })
})
