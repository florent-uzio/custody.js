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
