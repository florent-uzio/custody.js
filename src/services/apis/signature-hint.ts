import { isObject } from "../../helpers/index.js"

/**
 * Number of elements at which the backend's set-backed array fields stop
 * preserving insertion order (Scala's `Set1..Set4` are insertion-ordered; 5+
 * becomes a `HashSet`).
 */
const SET_REORDER_THRESHOLD = 5

/** Tracking issue explaining the backend defect this hint points at. */
const ISSUE_URL = "https://github.com/florent-uzio/custody.js/issues/223"

/**
 * Collects the dotted paths of every array in `value` holding at least
 * {@link SET_REORDER_THRESHOLD} elements, recursing through objects and arrays.
 */
const collectLargeArrayPaths = (value: unknown, path: string, paths: string[]): void => {
  if (Array.isArray(value)) {
    if (value.length >= SET_REORDER_THRESHOLD) paths.push(path)
    value.forEach((item, index) => collectLargeArrayPaths(item, `${path}[${index}]`, paths))
    return
  }
  if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      collectLargeArrayPaths(child, `${path}.${key}`, paths)
    }
  }
}

/**
 * Builds a diagnostic hint for a `401 InvalidSignatureError` on a signed request
 * body, when the signed payload contains an array long enough to hit a known
 * Ripple Custody backend defect.
 *
 * The API deserializes some array fields (e.g. `operation.flags`) into an
 * unordered set and re-serializes that set when verifying the request-body
 * signature. Up to four elements the set keeps insertion order and the
 * round-trip is faithful; at five or more it is hash-ordered and re-emits one
 * fixed order, so the server verifies different bytes than the SDK signed.
 *
 * The SDK does not reorder anything — JCS (RFC 8785) preserves array order by
 * design, and the SDK signs exactly the bytes it puts on the wire. This hint
 * only names the arrays that could have triggered the mismatch, so the failure
 * is obvious instead of invisible. Callers who need the request to go through
 * before the backend is fixed can reorder the field themselves via the
 * `beforeSign` client option.
 *
 * @param request - The `request` payload that was canonicalized and signed.
 * @returns The hint to append to the error reason, or `undefined` if the payload
 * contains no array large enough to be a plausible cause.
 * @see {@link https://github.com/florent-uzio/custody.js/issues/223}
 */
export const signatureMismatchHint = (request: unknown): string | undefined => {
  const paths: string[] = []
  collectLargeArrayPaths(request, "request", paths)

  if (paths.length === 0) return undefined

  return (
    `The signed body contains array field(s) with ${SET_REORDER_THRESHOLD}+ elements ` +
    `(${paths.map((path) => `\`${path}\``).join(", ")}). The API may re-serialize set-typed ` +
    `fields in a different order than sent, which breaks signature verification. Reordering ` +
    `the field via the \`beforeSign\` client option works around it. See ${ISSUE_URL}.`
  )
}
