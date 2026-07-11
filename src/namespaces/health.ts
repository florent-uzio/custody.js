import { URLs } from "../constants/urls.js"
import type { LivenessResponse, ReadinessResponse } from "../services/health/health.types.js"
import type { TypedTransport } from "../transport/index.js"

/**
 * Health-check namespace (`GET /v1/health`, `GET /v1/ready`).
 *
 * Exposed under `client.health.*` rather than as top-level methods so
 * `readiness()` does not collide with `RippleCustody.ready()` (which resolves
 * the runtime version guard).
 *
 * Both endpoints return `200` when healthy and `503` when not. Like every other
 * SDK call, a `503` rejects with a `CustodyError` (`statusCode: 503`) rather
 * than resolving with the unhealthy body — callers detect an unhealthy backend
 * via the thrown error.
 */
export function createHealth(t: TypedTransport) {
  return {
    /** Liveness check — `GET /v1/health`. */
    liveness: (): Promise<LivenessResponse> => t.get(URLs.health),

    /** Readiness check — `GET /v1/ready`. */
    readiness: (): Promise<ReadinessResponse> => t.get(URLs.ready),
  } as const
}
