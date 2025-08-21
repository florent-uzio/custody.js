/**
 * Get the hostname from a URL or domain string.
 * If the input does not start with "http://" or "https://", it will prepend "https://".
 */
export const getHostname = (input: string) => {
  const normalized =
    input.startsWith("http://") || input.startsWith("https://") ? input : `https://${input}`

  return new URL(normalized).hostname
}

/**
 * Replace path parameters in a URL template with actual values.
 *
 * @param urlTemplate - URL template with placeholders like "{domainId}", "{intentId}"
 * @param params - Object containing parameter values to replace
 * @returns URL with all placeholders replaced with actual values
 *
 * @example
 * ```typescript
 * const url = replacePathParams(
 *   "/v1/domains/{domainId}/intents/{intentId}",
 *   { domainId: "123", intentId: "456" }
 * )
 * // Returns: "/v1/domains/123/intents/456"
 * ```
 */
export const replacePathParams = <T extends Record<string, string | number>>(
  urlTemplate: string,
  params: T,
): string => {
  let result = urlTemplate

  // Replace each parameter in the URL template
  for (const [key, value] of Object.entries(params)) {
    const placeholder = `{${key}}`
    if (result.includes(placeholder)) {
      result = result.replace(
        new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        String(value),
      )
    }
  }

  return result
}

/**
 * Type-safe version of replacePathParams that ensures all required parameters are provided.
 *
 * @param urlTemplate - URL template with placeholders
 * @param params - Object containing all required parameter values
 * @returns URL with all placeholders replaced
 *
 * @example
 * ```typescript
 * const url = replacePathParamsSafe(
 *   "/v1/domains/{domainId}/intents/{intentId}" as const,
 *   { domainId: "123", intentId: "456" }
 * )
 * ```
 */
export const replacePathParamsSafe = <T extends string, P extends Record<string, string | number>>(
  urlTemplate: T,
  params: P,
): string => {
  return replacePathParams(urlTemplate, params)
}
