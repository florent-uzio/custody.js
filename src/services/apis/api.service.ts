import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"
import crypto from "crypto"
import qs from "qs"
import { v4 as uuidv4 } from "uuid"
import { DEFAULT_TIMEOUT_MS } from "../../constants/index.js"
import { canonicalizeRequest, isObject, isString, isUndefined } from "../../helpers/index.js"
import { CustodyError, type Core_ErrorMessage } from "../../models/custody-error.js"
import type { BeforeSignHook, CustodySignContext } from "../../ripple-custody.types.js"
import { AuthService } from "../auth/auth.service.js"
import { attachDebugInterceptors } from "../debug/index.js"
import { KeypairService } from "../keypairs/index.js"
import {
  assertValidRawSignature,
  encodeSignature,
  prepareSigningInput,
  signRawWithPrivateKey,
} from "../keypairs/signing-scheme.js"
import { type ApiServiceOptions, type PartialAuthFormData } from "./api.service.types.js"
import { signatureMismatchHint } from "./signature-hint.js"

/**
 * ApiService handles authenticated API requests and token management
 */
export class ApiService {
  private readonly apiClient: AxiosInstance
  private readonly authFormData: PartialAuthFormData
  private readonly authService: AuthService
  private readonly apiUrl: string
  private challenge: string
  /**
   * Signs a message for the given context and returns the base64 signature the
   * server expects. Built once from either the provided `privateKey` or the
   * external `signer`; both run through the same signing scheme (prepare → raw
   * primitive → encode), differing only in where the raw primitive executes.
   */
  private readonly sign: (message: string, context: CustodySignContext) => Promise<string>
  /** Optional caller hook applied to a request body just before it is signed. */
  private readonly beforeSign?: BeforeSignHook
  /**
   * In-flight token refresh, shared across concurrent callers so an expired
   * token triggers a single sign + token request (matters for metered signers).
   */
  private tokenRefresh: Promise<string> | null = null

  constructor(options: ApiServiceOptions) {
    this.authService = options.authService
    this.apiUrl = options.apiUrl
    this.authFormData = options.authFormData
    this.beforeSign = options.beforeSign

    const { privateKey, signer } = options

    if (privateKey && signer) {
      throw new CustodyError({
        reason: "Provide either `privateKey` or `signer`, not both.",
      })
    }
    if (!privateKey && !signer) {
      throw new CustodyError({
        reason: "Provide either a `privateKey` or a `signer` to sign requests.",
      })
    }

    const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS

    // Create Axios instance for API requests
    this.apiClient = axios.create({
      baseURL: this.apiUrl,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Set params serializer to handle arrays the way Ripple Custody expects
    this.apiClient.defaults.paramsSerializer = (params) =>
      qs.stringify(params, { arrayFormat: "repeat" })

    // Registered before every other interceptor so the debug logger observes
    // the final request (Authorization included) and sees a failure before the
    // 401 retry below can absorb it. See attachDebugInterceptors.
    if (options.debug) {
      attachDebugInterceptors(this.apiClient, options.debug, "api")
    }

    // Add request interceptor to inject JWT token into headers
    this.apiClient.interceptors.request.use(
      async (config) => {
        const token = await this.getValidToken()
        config.headers.Authorization = `Bearer ${token}`
        return config
      },
      (error) => Promise.reject(error),
    )

    // Add response interceptor to handle 401 errors by refreshing the token and retrying once
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Only retry once and only on 401 responses
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retried
        ) {
          originalRequest._retried = true

          // Generate a fresh challenge and force-refresh the token
          const token = await this.getValidToken(true)
          originalRequest.headers.Authorization = `Bearer ${token}`

          return this.apiClient(originalRequest)
        }

        return Promise.reject(error)
      },
    )

    if (privateKey) {
      // Validate provided private key
      const privateKeyAlgorithm = KeypairService.detectKeyType(privateKey)
      if (privateKeyAlgorithm === "unknown") {
        throw new CustodyError({
          reason: "Unsupported private key algorithm. Please provide a valid private key.",
        })
      }

      // detectKeyType only inspects OIDs in the base64 body, so a corrupt PEM can
      // still pass it. Parse the key once here to fail fast at construction
      // instead of with a raw Node crypto error on the first request.
      try {
        crypto.createPrivateKey(privateKey)
      } catch (error) {
        throw new CustodyError(
          {
            reason: `Invalid private key: failed to parse PEM. ${error instanceof Error ? error.message : String(error)}`,
          },
          undefined,
          error instanceof Error ? error : undefined,
        )
      }

      // Sign via the shared signing scheme (same prep + encode as the external
      // signer path), so both paths produce identical signatures for a given
      // message and context — the `context` drives hashing, not content-sniffing.
      this.sign = async (message, context) => {
        const data = prepareSigningInput(privateKeyAlgorithm, message, context)
        const rawSignature = signRawWithPrivateKey(privateKeyAlgorithm, privateKey, data)
        return encodeSignature(privateKeyAlgorithm, rawSignature)
      }
    } else {
      // External signer: the SDK owns prep + encode; the signer runs only the
      // raw primitive so the key never enters the SDK.
      const { algorithm, sign } = signer!
      this.sign = async (message, context) => {
        const data = prepareSigningInput(algorithm, message, context)

        let rawSignature: Uint8Array
        try {
          rawSignature = await sign({ data, context })
        } catch (error) {
          throw new CustodyError(
            {
              reason: `External signer failed: ${error instanceof Error ? error.message : String(error)}`,
            },
            undefined,
            error instanceof Error ? error : undefined,
          )
        }

        assertValidRawSignature(algorithm, rawSignature)
        return encodeSignature(algorithm, rawSignature)
      }
    }

    // Use provided challenge or generate a new one
    this.challenge = this.authFormData.challenge ? this.authFormData.challenge : uuidv4()
  }

  /**
   * Retrieves a valid JWT token, refreshing if needed.
   * @param forceRefresh - Whether to force a token refresh.
   * @returns {Promise<string>} The valid JWT token.
   */
  private async getValidToken(forceRefresh = false): Promise<string> {
    if (!forceRefresh && !this.authService.isTokenExpired()) {
      return this.authService.getCurrentToken() || ""
    }

    // Collapse concurrent refreshes so an expired token signs once, not once
    // per in-flight request. A forced refresh (401 retry) always signs anew.
    if (!forceRefresh && this.tokenRefresh) {
      return this.tokenRefresh
    }

    const refresh = (async () => {
      // Generate a fresh challenge for each token refresh to avoid stale challenge rejection
      this.challenge = this.authFormData.challenge ? this.authFormData.challenge : uuidv4()

      const authData = {
        signature: await this.sign(this.challenge, "auth-challenge"),
        challenge: this.challenge,
        publicKey: this.authFormData.publicKey,
      }
      return this.authService.getToken(authData, forceRefresh)
    })()

    // Only clear the registration if it's still the one we set — a forced
    // refresh (401 retry) can overtake an older in-flight refresh, and the older
    // one's `.finally` must not clobber the newer registration (which would let a
    // later caller start a redundant third refresh).
    const tracked = refresh.finally(() => {
      if (this.tokenRefresh === tracked) this.tokenRefresh = null
    })
    this.tokenRefresh = tracked
    return tracked
  }

  /**
   * Returns the set-reordering diagnostic when a signed request body was
   * rejected with a 401 signature failure, so a mismatch caused by the backend
   * re-serializing set-typed array fields is named rather than left to be
   * investigated. Returns `undefined` for any other 401 (e.g. token issues).
   */
  private signatureFailureHint(
    error: AxiosError<Core_ErrorMessage>,
    signedRequest: unknown,
  ): string | undefined {
    if (isUndefined(signedRequest) || error.response?.status !== 401) return undefined

    const errorData = error.response.data
    const errorText = isString(errorData)
      ? errorData
      : `${errorData?.reason ?? ""} ${errorData?.message ?? ""}`
    if (!/signature/i.test(errorText)) return undefined

    return signatureMismatchHint(signedRequest)
  }

  /**
   * Maps a failed request error into a CustodyError and throws it.
   * Shared by all HTTP verb methods.
   *
   * @param signedRequest - The `request` payload that was signed, when the call
   * signed one. Used only to build the 401 signature-failure hint.
   */
  private handleRequestError(error: unknown, verb: string, signedRequest?: unknown): never {
    // Already a CustodyError (e.g. a signer failure thrown inside post()) — don't
    // re-wrap it in another CustodyError.
    if (error instanceof CustodyError) throw error
    if (axios.isAxiosError<Core_ErrorMessage>(error)) {
      const errorData = error.response?.data
      const hint = this.signatureFailureHint(error, signedRequest)
      if (isObject(errorData)) {
        throw new CustodyError(errorData, error.response?.status, error, hint)
      }
      throw new CustodyError(
        { reason: `${verb} API request failed: ${error.message}` },
        error.response?.status,
        error,
        hint,
      )
    }
    throw new CustodyError(
      { reason: error instanceof Error ? error.message : "Unknown error occurred" },
      undefined,
      error instanceof Error ? error : undefined,
    )
  }

  /**
   * Makes a GET request to the API.
   * @param url - The endpoint URL.
   * @returns {Promise<T>} The response data.
   * @throws {CustodyError} If the request fails with a typed error response.
   */
  public async get<T>(
    url: string,
    params?: AxiosRequestConfig["params"],
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.apiClient.get<T>(url, { ...config, params })
      return response.data
    } catch (error) {
      this.handleRequestError(error, "GET")
    }
  }

  /**
   * Makes a POST request to the API.
   * @param url - The endpoint URL.
   * @param body - The request payload.
   * @param config - Axios config; set `sign: false` to skip canonicalization/signing.
   * @returns {Promise<T>} The response data.
   * @throws {CustodyError} If the request fails with a typed error response.
   */
  public async post<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig & { sign?: boolean },
  ): Promise<T> {
    const { sign, ...rest } = config ?? {}
    // Preserve `undefined` when no config was passed so axios receives its own default
    const axiosConfig: AxiosRequestConfig | undefined = config ? rest : undefined
    // The payload that ends up signed, if any — kept for the 401 signature hint
    let signedRequest: unknown
    try {
      // Sign the request (default) unless the caller opted out
      if (sign !== false && body && (!body.signature || body.signature === "")) {
        // Let the caller reshape the payload first; whatever it returns is both
        // signed and sent, so the signed bytes stay the bytes on the wire
        if (this.beforeSign) body.request = this.beforeSign(body.request)
        signedRequest = body.request

        // Canonicalize the request body
        const canonicalizedRequest = canonicalizeRequest(signedRequest)

        // Sign the canonicalized request
        body.signature = await this.sign(canonicalizedRequest, "request-body")
      }

      const response = await this.apiClient.post<T>(url, body, axiosConfig)
      return response.data
    } catch (error) {
      this.handleRequestError(error, "POST", signedRequest)
    }
  }

  /**
   * Makes a PUT request to the API.
   * @param url - The endpoint URL.
   * @param body - The request payload (sent as-is; no canonicalization or signing).
   * @returns {Promise<T>} The response data.
   * @throws {CustodyError} If the request fails with a typed error response.
   */
  public async put<T>(url: string, body: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.apiClient.put<T>(url, body, config)
      return response.data
    } catch (error) {
      this.handleRequestError(error, "PUT")
    }
  }

  /**
   * Makes a PATCH request to the API.
   * @param url - The endpoint URL.
   * @param body - The request payload (sent as-is; no canonicalization or signing).
   * @returns {Promise<T>} The response data.
   * @throws {CustodyError} If the request fails with a typed error response.
   */
  public async patch<T>(url: string, body: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.apiClient.patch<T>(url, body, config)
      return response.data
    } catch (error) {
      this.handleRequestError(error, "PATCH")
    }
  }

  /**
   * Makes a DELETE request to the API.
   * @param url - The endpoint URL.
   * @returns {Promise<T>} The response data.
   * @throws {CustodyError} If the request fails with a typed error response.
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.apiClient.delete<T>(url, config)
      return response.data
    } catch (error) {
      this.handleRequestError(error, "DELETE")
    }
  }
}
