export type RequestConfig = {
  timeout?: number
  signal?: AbortSignal
  headers?: Record<string, string>
  /**
   * POST-only. When `false`, the request body is sent as-is (no canonicalization
   * or signed-envelope signing). Defaults to `true`.
   */
  sign?: boolean
}

/**
 * The 5 verb methods namespaces consume to talk to the custody API.
 *
 * Production: `TypedTransport` (HTTP, via `ApiService`).
 * Tests: `createFakeTransport()` (in-memory, `src/testing/fake-transport.ts`).
 */
export interface Transport {
  get<T>(
    url: string,
    pathParams?: Record<string, unknown>,
    query?: unknown,
    config?: RequestConfig,
  ): Promise<T>

  post<T>(
    url: string,
    body: unknown,
    pathParams?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T>

  put<T>(
    url: string,
    body: unknown,
    pathParams?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T>

  patch<T>(
    url: string,
    body: unknown,
    pathParams?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T>

  delete<T>(
    url: string,
    pathParams?: Record<string, unknown>,
    query?: unknown,
    config?: RequestConfig,
  ): Promise<T>
}
