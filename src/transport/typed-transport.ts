import type { AxiosRequestConfig } from "axios"
import type { ApiService } from "../services/apis/api.service.js"
import { VersionGuard } from "../versioning/version-guard.js"
import { splitParams } from "./split-params.js"
import type { RequestConfig, Transport } from "./transport.types.js"

/**
 * Strips the SDK-only keys from a request config before it reaches axios.
 * `surface` is consumed by the version guard; `sign` is consumed by ApiService,
 * which destructures it itself.
 */
function toAxiosConfig(
  config?: RequestConfig,
): (AxiosRequestConfig & { sign?: boolean }) | undefined {
  if (!config) return undefined
  const rest: RequestConfig = { ...config }
  delete rest.surface
  return rest as AxiosRequestConfig & { sign?: boolean }
}

/**
 * A typed transport layer that wraps ApiService, handling URL template
 * interpolation and path/query parameter splitting automatically.
 *
 * Namespace factory functions use this instead of calling ApiService directly.
 */
export class TypedTransport implements Transport {
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
    config?: RequestConfig,
  ): Promise<T> {
    await this.guard.checkEndpoint("GET", url, undefined, config?.surface)
    let resolvedUrl = url
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
      // Merge any non-path params from pathParams into query
      if (result.query) {
        query = { ...((query as Record<string, unknown>) ?? {}), ...result.query }
      }
    }
    return this.api.get<T>(
      resolvedUrl,
      query as AxiosRequestConfig["params"],
      toAxiosConfig(config),
    )
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
    await this.guard.checkEndpoint("POST", url, undefined, config?.surface)
    let resolvedUrl = url
    let mergedConfig = toAxiosConfig(config)
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
      // Non-path keys become query params, mirroring get()/delete().
      if (result.query) {
        mergedConfig = {
          ...(mergedConfig ?? {}),
          params: { ...((mergedConfig?.params as Record<string, unknown>) ?? {}), ...result.query },
        }
      }
    }
    return this.api.post<T>(resolvedUrl, body, mergedConfig)
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
    await this.guard.checkEndpoint("PUT", url, undefined, config?.surface)
    let resolvedUrl = url
    let mergedConfig = toAxiosConfig(config)
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
      // Non-path keys become query params, mirroring get()/delete().
      if (result.query) {
        mergedConfig = {
          ...(mergedConfig ?? {}),
          params: { ...((mergedConfig?.params as Record<string, unknown>) ?? {}), ...result.query },
        }
      }
    }
    return this.api.put<T>(resolvedUrl, body, mergedConfig)
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
    await this.guard.checkEndpoint("PATCH", url, undefined, config?.surface)
    let resolvedUrl = url
    let mergedConfig = toAxiosConfig(config)
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
      // Non-path keys become query params, mirroring get()/delete().
      if (result.query) {
        mergedConfig = {
          ...(mergedConfig ?? {}),
          params: { ...((mergedConfig?.params as Record<string, unknown>) ?? {}), ...result.query },
        }
      }
    }
    return this.api.patch<T>(resolvedUrl, body, mergedConfig)
  }

  /**
   * Makes a typed DELETE request.
   * Splits flat params into path and query params based on the URL template.
   */
  async delete<T>(
    url: string,
    pathParams?: Record<string, unknown>,
    query?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    await this.guard.checkEndpoint("DELETE", url, undefined, config?.surface)
    let resolvedUrl = url
    if (pathParams && Object.keys(pathParams).length > 0) {
      const result = splitParams(url, pathParams)
      resolvedUrl = result.url
      if (result.query) {
        query = { ...((query as Record<string, unknown>) ?? {}), ...result.query }
      }
    }
    return this.api.delete<T>(resolvedUrl, {
      ...toAxiosConfig(config),
      params: query as AxiosRequestConfig["params"],
    })
  }
}
