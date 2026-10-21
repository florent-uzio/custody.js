import type { components, operations } from "../models/custody-types.js"

// Request bodies
export type GenerateMovementReportBody =
  operations["MovementReportController_generateMovementReport"]["requestBody"]["content"]["application/json"]
export type GeneratePositionReportBody =
  operations["PositionReportController_generatePositionReport"]["requestBody"]["content"]["application/json"]

export type GenerateOmnibusPositionReportBody =
  operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["requestBody"]["content"]["application/json"]

// 201 response: `Export_OmnibusPositionReportResponseDto` when `format` is
// `JSON`, the raw CSV string when `format` is `CSV`.
type GenerateOmnibusPositionReportContent =
  operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][201]["content"]
export type GenerateOmnibusPositionReportResponse =
  GenerateOmnibusPositionReportContent[keyof GenerateOmnibusPositionReportContent]

// 201 responses: the JSON report DTO when `format` is `JSON`, the raw CSV
// string when `format` is `CSV`.
type GenerateMovementReportContent =
  operations["MovementReportController_generateMovementReport"]["responses"][201]["content"]
export type GenerateMovementReportResponse =
  GenerateMovementReportContent[keyof GenerateMovementReportContent]

type GeneratePositionReportContent =
  operations["PositionReportController_generatePositionReport"]["responses"][201]["content"]
export type GeneratePositionReportResponse =
  GeneratePositionReportContent[keyof GeneratePositionReportContent]

// Shared component referenced by GenerateMovementReportBody
export type Export_DateRangeDto = components["schemas"]["Export_DateRangeDto"]
