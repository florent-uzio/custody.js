import type { AxiosRequestConfig } from "axios"
import type { ApiService } from "../services/apis/api.service.js"
import { VersionGuard } from "../versioning/version-guard.js"
import { splitParams } from "./split-params.js"
import type { RequestConfig } from "./transport.types.js"

/**
 * A typed transport layer that wraps ApiService, handling URL template
 * interpolation and path/query parameter splitting automatically.
 *
 * Namespace factory functions use this instead of calling ApiService directly.
 */
export class TypedTransport {
  constructor(
    private readonly api: ApiService,
    private readonly guard: VersionGuard = new VersionGuard(undefined),
  ) {}

  /**
   * Makes a typed GET request.
   * Splits flat params into path and query params based on the URL template.
   */
  async get<T>(
    url: string,
    pathParams?: Record<string, unknown>,
    query?: unknown,
    _config?: RequestConfig,
  ): Promise<T> {
    await this.guard.checkEndpoint("GET", url)
    let resolvedUrl = url
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
      // Merge any non-path params from pathParams into query
      if (result.query) {
        query = { ...((query as Record<string, unknown>) ?? {}), ...result.query }
      }
    }
    return this.api.get<T>(resolvedUrl, query as AxiosRequestConfig["params"])
  }

  /**
   * Makes a typed POST request.
   * Resolves path params from the URL template before posting.
   */
  async post<T>(
    url: string,
    body: unknown,
    pathParams?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T> {
    await this.guard.checkEndpoint("POST", url)
    let resolvedUrl = url
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
    }
    return this.api.post<T>(resolvedUrl, body, config as AxiosRequestConfig & { sign?: boolean })
  }

  /**
   * Makes a typed PUT request.
   * Resolves path params from the URL template before sending.
   */
  async put<T>(
    url: string,
    body: unknown,
    pathParams?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T> {
    await this.guard.checkEndpoint("PUT", url)
    let resolvedUrl = url
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
    }
    return this.api.put<T>(resolvedUrl, body, config as AxiosRequestConfig)
  }

  /**
   * Makes a typed PATCH request.
   * Resolves path params from the URL template before sending.
   */
  async patch<T>(
    url: string,
    body: unknown,
    pathParams?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T> {
    await this.guard.checkEndpoint("PATCH", url)
    let resolvedUrl = url
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
    }
    return this.api.patch<T>(resolvedUrl, body, config as AxiosRequestConfig)
  }

  /**
   * Makes a typed DELETE request.
   * Resolves path params from the URL template before sending.
   */
  async delete<T>(
    url: string,
    pathParams?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T> {
    await this.guard.checkEndpoint("DELETE", url)
    let resolvedUrl = url
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
    }
    return this.api.delete<T>(resolvedUrl, config as AxiosRequestConfig)
  }
}
