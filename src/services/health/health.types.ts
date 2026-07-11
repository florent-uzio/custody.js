import type { operations } from "../../models/custody-types.js"

// Response types

export type LivenessResponse =
  operations["HealthController_liveness"]["responses"]["200"]["content"]["application/json"]

export type ReadinessResponse =
  operations["HealthController_readiness"]["responses"]["200"]["content"]["application/json"]
