import { isObject, isUndefined } from "../../helpers/index.js"

/** Tracking issue explaining the backend defect this hint points at. */
const ISSUE_URL = "https://github.com/florent-uzio/custody.js/issues/238"

/** The query parameter the backend fails on. */
const BROKEN_PARAM = "quarantineStatus"

/**
 * Builds a diagnostic hint for a `500` on a request that filtered on
 * `quarantineStatus`, a parameter some Ripple Custody versions answer with an
 * internal error on the transfers endpoint.
 *
 * The parameter is declared in every bundled OpenAPI spec, and the SDK sends
 * exactly what the spec describes — so the failure looks like nothing at all
 * from the caller's side: a bare `Internal server error` with no indication of
 * which filter caused it. This hint names the parameter and the substitute,
 * rather than leaving the 500 to be bisected by hand.
 *
 * The parameter is not rewritten automatically. `Core_QuarantineStatus` has
 * three values and the deprecated `quarantined` boolean has two, so only
 * `Quarantined` has an exact equivalent (`quarantined: true`); `false`
 * conflates `Released`, `Skipped` and the `null` the API returns on fee
 * transfers. Silently substituting it would turn a loud 500 into wrong data for
 * a caller asking about `Skipped`.
 *
 * @param params - The query parameters the failed request was sent with.
 * @returns The hint to append to the error reason, or `undefined` when the
 * request did not filter on `quarantineStatus` and this defect cannot be why it
 * failed.
 * @see {@link https://github.com/florent-uzio/custody.js/issues/238}
 */
export const quarantineStatusHint = (params: unknown): string | undefined => {
  if (!isObject(params) || isUndefined(params[BROKEN_PARAM])) return undefined

  return (
    `The request filtered on \`${BROKEN_PARAM}\`, which some Ripple Custody versions answer ` +
    `with a 500 on the transfers endpoint. Filtering on the deprecated \`quarantined\` boolean ` +
    `instead returns the same rows for \`Quarantined\` (\`quarantined: true\`) — note it cannot ` +
    `express \`Skipped\`, which shares \`quarantined: false\` with \`Released\`. See ${ISSUE_URL}.`
  )
}
