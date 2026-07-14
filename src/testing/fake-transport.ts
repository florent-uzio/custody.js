import { vi } from "vitest"
import type { Transport } from "../transport/index.js"

/**
 * In-memory `Transport` double for tests. Each verb is a `vi.fn()`, so tests
 * configure responses with `.mockResolvedValueOnce()` / `.mockRejectedValueOnce()`
 * and assert calls with `.toHaveBeenCalledWith()`, exactly like the ad hoc
 * `mockTransport` objects this replaces — just type-checked against the real
 * `Transport` interface instead of requiring an `as any` cast.
 *
 * Not part of the published package: excluded from the `tsc` build via
 * `src/testing/**` in tsconfig.json.
 */
export function createFakeTransport() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  } satisfies Transport
}
