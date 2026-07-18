import type { components, operations } from "../models/custody-types.js"

// Request bodies. Both endpoints respond 201 with no body, so there's no
// response type to export here.
export type GenerateMovementReportBody =
  operations["MovementReportController_generateMovementReport"]["requestBody"]["content"]["application/json"]
export type GeneratePositionReportBody =
  operations["PositionReportController_generatePositionReport"]["requestBody"]["content"]["application/json"]

// Shared component referenced by GenerateMovementReportBody
export type Export_DateRangeDto = components["schemas"]["Export_DateRangeDto"]
