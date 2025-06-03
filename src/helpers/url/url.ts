/**
 * Get the hostname from a URL or domain string.
 * If the input does not start with "http://" or "https://", it will prepend "https://".
 */
export const getHostname = (input: string) => {
  const normalized =
    input.startsWith("http://") || input.startsWith("https://") ? input : `https://${input}`

  return new URL(normalized).hostname
}
