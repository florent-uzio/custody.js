import { timingSafeEqual } from "crypto"

export type VerifyWebhookSecretOptions = {
  /**
   * The inbound webhook request's URL, as received by the server (absolute,
   * or path+query such as Node's `req.url`).
   */
  url: string
  /** The secret this endpoint expects to find in the URL's query string. */
  expectedSecret: string
  /** Query parameter name carrying the secret. Defaults to `"token"`. */
  paramName?: string
}

/**
 * Verifies that an inbound webhook request carries the secret this endpoint
 * expects.
 *
 * Ripple Custody does not sign or otherwise authenticate webhook deliveries
 * (see `EDS_ChannelCreate`/`EDS_Channel` — there is no secret, key, or
 * signature field on a channel, only a plain `url`). The only authenticity
 * check available is a secret you embed yourself in the channel's registered
 * URL (e.g. `https://host/webhook?token=SECRET`) and verify on receipt.
 * Everything else about an inbound request is otherwise untrusted.
 */
export function verifyWebhookSecret(options: VerifyWebhookSecretOptions): boolean {
  const { url, expectedSecret, paramName = "token" } = options
  const actualSecret = new URL(url, "http://localhost").searchParams.get(paramName)

  if (!actualSecret) return false

  const actual = Buffer.from(actualSecret)
  const expected = Buffer.from(expectedSecret)

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
