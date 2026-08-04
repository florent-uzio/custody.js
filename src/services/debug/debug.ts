import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios"
import { isBoolean, isObject, isUndefined } from "../../helpers/index.js"
import type {
  CustodyDebugClient,
  CustodyDebugEvent,
  CustodyDebugLogger,
  CustodyHttpMethod,
} from "../../ripple-custody.types.js"

/** What an `Authorization` header value is replaced with before it is logged. */
const REDACTED_AUTHORIZATION = "Bearer <redacted>"

/** What a redacted response body field is replaced with. */
const REDACTED = "<redacted>"

/**
 * Response body fields holding a credential that is usable on its own. The auth
 * token endpoint returns `access_token`, so masking the request's `Authorization`
 * header without masking these would leak the same token one line earlier.
 */
const REDACTED_BODY_FIELDS = new Set(["access_token", "id_token", "refresh_token"])

/**
 * Wall-clock start stamped on the outbound config so the matching response or
 * error can report how long the round trip took.
 */
type TimedRequestConfig = InternalAxiosRequestConfig & { _debugStartedAt?: number }

/**
 * Turns the `debug` client option into a logger, or `undefined` when debugging
 * is off. `true` selects the built-in console sink; a function is used as-is.
 */
export const resolveDebugLogger = (
  debug: boolean | CustodyDebugLogger | undefined,
): CustodyDebugLogger | undefined => {
  if (!debug) return undefined
  // Only `true` remains on the boolean branch, since `false` was filtered above.
  return isBoolean(debug) ? consoleDebugLogger : debug
}

/**
 * Built-in sink used by `debug: true`. Writes to `console.error` (stderr) so
 * diagnostics never mix into a program's stdout, which callers may be piping.
 */
export const consoleDebugLogger: CustodyDebugLogger = (event) => {
  const tag = `[custody:${event.client}]`

  if (event.kind === "request") {
    write(
      `${tag} → ${event.method} ${event.url}`,
      format({ headers: event.headers, params: event.params, body: event.body }),
    )
    return
  }

  const status = event.kind === "error" && isUndefined(event.status) ? "no response" : event.status
  const detail = event.kind === "error" ? ` — ${event.message}` : ""
  write(
    `${tag} ← ${status} ${event.method} ${event.url} (${event.durationMs}ms)${detail}`,
    format({ body: event.body }),
  )
}

/** Writes the headline, appending the details only when there are any. */
const write = (headline: string, details: string): void => {
  if (details) console.error(headline, details)
  else console.error(headline)
}

/**
 * Registers request and response interceptors that report every exchange on
 * `client` to `logger`.
 *
 * Must be called **before** any other interceptor is registered on the
 * instance, which puts this logger where it sees the most: Axios runs request
 * interceptors in reverse registration order, so registering first makes this
 * one run last and observe the final headers (including the `Authorization`
 * added by the auth interceptor); it runs response interceptors in registration
 * order, so registering first also means a failure is logged before a retry
 * interceptor can swallow it.
 */
export const attachDebugInterceptors = (
  client: AxiosInstance,
  logger: CustodyDebugLogger,
  clientName: CustodyDebugClient,
): void => {
  const emit = (event: CustodyDebugEvent) => {
    // A throwing logger is the caller's bug, but it must not fail the request.
    try {
      logger(event)
    } catch {
      // ignored on purpose
    }
  }

  client.interceptors.request.use((config: TimedRequestConfig) => {
    config._debugStartedAt = Date.now()
    emit({
      kind: "request",
      client: clientName,
      method: methodOf(config),
      url: urlOf(config),
      headers: redactHeaders(config),
      params: config.params,
      body: readableBody(config.data),
    })
    return config
  })

  client.interceptors.response.use(
    (response) => {
      emit({
        kind: "response",
        client: clientName,
        method: methodOf(response.config),
        url: urlOf(response.config),
        status: response.status,
        durationMs: elapsed(response.config),
        body: redactBody(response.data),
      })
      return response
    },
    (error: AxiosError) => {
      // No config means the failure happened in the request interceptor chain,
      // before anything went on the wire — so no `"request"` event was emitted
      // either, and reporting it would pair a response with nothing. The real
      // cause is already logged (a failed token request on the auth client) or
      // thrown straight to the caller.
      if (isUndefined(error.config)) return Promise.reject(error)

      emit({
        kind: "error",
        client: clientName,
        method: methodOf(error.config),
        url: urlOf(error.config),
        status: error.response?.status,
        durationMs: elapsed(error.config),
        body: redactBody(error.response?.data),
        message: error.message,
      })
      return Promise.reject(error)
    },
  )
}

/**
 * Axios fills in `config.method` (defaulting to `get`) before it builds the
 * interceptor chain, so the fallback only satisfies its optional typing.
 */
const methodOf = (config: InternalAxiosRequestConfig): CustodyHttpMethod =>
  config.method?.toUpperCase() ?? "UNKNOWN"

const urlOf = (config: InternalAxiosRequestConfig): string =>
  `${config.baseURL ?? ""}${config.url ?? ""}`

const elapsed = (config: InternalAxiosRequestConfig): number => {
  const startedAt = (config as TimedRequestConfig)._debugStartedAt
  return isUndefined(startedAt) ? 0 : Date.now() - startedAt
}

/**
 * Snapshots the outbound headers with the bearer token masked. Redaction is
 * unconditional: `debug: true` must never be the reason a live token lands in a
 * CI log, and a custom logger has no way to redact a value it was already given.
 */
const redactHeaders = (config: InternalAxiosRequestConfig): Record<string, unknown> => {
  const headers = config.headers.toJSON?.() ?? { ...config.headers }
  return Object.fromEntries(
    Object.entries(headers).map(([name, value]) =>
      name.toLowerCase() === "authorization" ? [name, REDACTED_AUTHORIZATION] : [name, value],
    ),
  )
}

/**
 * Masks credential-bearing fields in a response body, copying only when there is
 * something to mask so the caller's own object is never mutated.
 *
 * Shallow on purpose: the only response that carries a usable credential is the
 * auth token endpoint's, which is flat.
 */
const redactBody = (data: unknown): unknown => {
  if (!isObject<Record<string, unknown>>(data)) return data

  const offending = Object.keys(data).filter((key) => REDACTED_BODY_FIELDS.has(key))
  if (offending.length === 0) return data

  const masked = { ...data }
  for (const key of offending) masked[key] = REDACTED
  return masked
}

/**
 * Request bodies reach the interceptor before Axios serializes them, so most
 * are plain objects and pass through untouched. The auth token request sends
 * `URLSearchParams`, which logs as `{}` — expand it into its entries instead.
 */
const readableBody = (data: unknown): unknown =>
  data instanceof URLSearchParams ? Object.fromEntries(data) : data

/**
 * Pretty-prints the parts of an event that have a value. Falls back to the raw
 * value when it cannot be stringified (a circular body, a BigInt).
 */
const format = (parts: Record<string, unknown>): string => {
  const present = Object.fromEntries(
    Object.entries(parts).filter(([, value]) => !isUndefined(value)),
  )
  if (Object.keys(present).length === 0) return ""
  try {
    return JSON.stringify(present, null, 2)
  } catch {
    return String(present)
  }
}
