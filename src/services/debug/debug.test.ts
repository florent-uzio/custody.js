import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { CustodyDebugEvent } from "../../ripple-custody.types.js"
import { attachDebugInterceptors, consoleDebugLogger, resolveDebugLogger } from "./debug.js"

/**
 * Builds a real Axios instance whose adapter is stubbed, so the interceptors run
 * exactly as they do in production without any network.
 */
const createClient = (
  adapter: (config: InternalAxiosRequestConfig) => Promise<unknown>,
): { client: AxiosInstance; events: CustodyDebugEvent[] } => {
  const events: CustodyDebugEvent[] = []
  const client = axios.create({
    baseURL: "https://api.example.com",
    adapter: adapter as never,
  })
  attachDebugInterceptors(client, (event) => events.push(event), "api")
  return { client, events }
}

const ok =
  (data: unknown, status = 200) =>
  async (config: InternalAxiosRequestConfig) => ({
    data,
    status,
    statusText: "OK",
    headers: {},
    config,
  })

describe("resolveDebugLogger", () => {
  it("returns undefined when debugging is off", () => {
    expect(resolveDebugLogger(undefined)).toBeUndefined()
    expect(resolveDebugLogger(false)).toBeUndefined()
  })

  it("selects the built-in console sink for `true`", () => {
    expect(resolveDebugLogger(true)).toBe(consoleDebugLogger)
  })

  it("uses a caller-supplied logger as-is", () => {
    const logger = vi.fn()
    expect(resolveDebugLogger(logger)).toBe(logger)
  })
})

describe("attachDebugInterceptors", () => {
  it("emits a request event with the method, absolute url, params and body", async () => {
    const { client, events } = createClient(ok({}))

    await client.post("/v1/intents", { type: "Propose" }, { params: { limit: 10 } })

    expect(events[0]).toMatchObject({
      kind: "request",
      client: "api",
      method: "POST",
      url: "https://api.example.com/v1/intents",
      params: { limit: 10 },
      body: { type: "Propose" },
    })
  })

  it("masks the Authorization header", async () => {
    const { client, events } = createClient(ok({}))

    await client.get("/v1/accounts", { headers: { Authorization: "Bearer real.jwt.token" } })

    const request = events[0]
    expect(request.kind).toBe("request")
    if (request.kind !== "request") return
    expect(request.headers.Authorization).toBe("Bearer <redacted>")
    expect(JSON.stringify(request.headers)).not.toContain("real.jwt.token")
  })

  it("masks the token in the auth endpoint's response body", async () => {
    const original = { access_token: "real.jwt.token", token_type: "Bearer", expires_in: 14400 }
    const { client, events } = createClient(ok(original))

    await client.post("", new URLSearchParams())

    expect(events[1]).toMatchObject({
      kind: "response",
      body: { access_token: "<redacted>", token_type: "Bearer", expires_in: 14400 },
    })
    // The response the caller receives must be untouched
    expect(original.access_token).toBe("real.jwt.token")
  })

  it("leaves a response body without credential fields untouched", async () => {
    const body = { items: [{ id: "XRP" }] }
    const { client, events } = createClient(ok(body))

    await client.get("/v1/tickers")

    expect(events[1].kind === "response" && events[1].body).toBe(body)
  })

  it("expands a URLSearchParams body so the auth token request is readable", async () => {
    const { client, events } = createClient(ok({}))
    const form = new URLSearchParams({ grant_type: "password", challenge: "abc" })

    await client.post("", form)

    expect(events[0]).toMatchObject({
      kind: "request",
      body: { grant_type: "password", challenge: "abc" },
    })
  })

  it("pairs a request with a response event carrying status, duration and body", async () => {
    const { client, events } = createClient(ok({ id: "intent-1" }, 201))

    await client.post("/v1/intents", {})

    expect(events).toHaveLength(2)
    expect(events[1]).toMatchObject({
      kind: "response",
      client: "api",
      method: "POST",
      url: "https://api.example.com/v1/intents",
      status: 201,
      body: { id: "intent-1" },
    })
    expect(events[1].kind === "response" && events[1].durationMs).toBeGreaterThanOrEqual(0)
  })

  it("emits an error event with the status and error body on a failed response", async () => {
    const { client, events } = createClient(async (config) => {
      throw new AxiosError("Request failed with status code 401", "ERR_BAD_REQUEST", config, null, {
        data: { reason: "InvalidSignatureError" },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
      } as never)
    })

    await expect(client.post("/v1/intents", {})).rejects.toThrow()

    expect(events[1]).toMatchObject({
      kind: "error",
      status: 401,
      body: { reason: "InvalidSignatureError" },
      message: "Request failed with status code 401",
    })
  })

  it("omits the status when the request failed without a response", async () => {
    const { client, events } = createClient(async (config) => {
      throw new AxiosError("timeout of 100ms exceeded", "ECONNABORTED", config)
    })

    await expect(client.get("/v1/accounts")).rejects.toThrow()

    expect(events[1]).toMatchObject({ kind: "error", message: "timeout of 100ms exceeded" })
    expect(events[1].kind === "error" && events[1].status).toBeUndefined()
  })

  it("stays silent when a request interceptor failed before anything went on the wire", async () => {
    const { client, events } = createClient(ok({}))
    // Stands in for the auth interceptor failing to obtain a token: the error
    // reaches the response chain, but nothing was ever sent.
    client.interceptors.request.use(() => {
      throw new Error("Authentication request failed")
    })

    await expect(client.get("/v1/accounts")).rejects.toThrow("Authentication request failed")

    expect(events).toHaveLength(0)
  })

  it("does not fail the request when the logger throws", async () => {
    const client = axios.create({ baseURL: "https://api.example.com", adapter: ok({}) as never })
    attachDebugInterceptors(
      client,
      () => {
        throw new Error("logger blew up")
      },
      "api",
    )

    await expect(client.get("/v1/accounts")).resolves.toMatchObject({ status: 200 })
  })
})

describe("consoleDebugLogger", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("writes to stderr, never stdout, so it cannot corrupt piped output", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    consoleDebugLogger({
      kind: "request",
      client: "auth",
      method: "POST",
      url: "https://auth.example.com",
      headers: {},
    })

    expect(error).toHaveBeenCalledOnce()
    expect(error.mock.calls[0]?.[0]).toContain("[custody:auth] → POST https://auth.example.com")
    expect(log).not.toHaveBeenCalled()
  })

  it("reports a transport failure with no status as `no response`", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})

    consoleDebugLogger({
      kind: "error",
      client: "api",
      method: "GET",
      url: "https://api.example.com/v1/accounts",
      durationMs: 42,
      message: "timeout",
    })

    expect(error.mock.calls[0]?.[0]).toContain("no response")
  })
})
