import type { components, operations } from "../models/custody-types.js"

// Request bodies
export type GenerateMovementReportBody =
  operations["MovementReportController_generateMovementReport"]["requestBody"]["content"]["application/json"]
export type GeneratePositionReportBody =
  operations["PositionReportController_generatePositionReport"]["requestBody"]["content"]["application/json"]

export type GenerateOmnibusPositionReportBody =
  operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["requestBody"]["content"]["application/json"]

// Picks the 201 body for a `format`: the `text/csv` string for `CSV`, the
// `application/json` DTO for `JSON`. Distributes, so the `"CSV" | "JSON"`
// union gives the union of both.
type ReportContentFor<
  Content extends { "application/json": unknown; "text/csv": unknown },
  F extends string,
> = F extends "CSV" ? Content["text/csv"] : Content["application/json"]

// 201 responses: the JSON report DTO when `format` is `JSON`, the raw CSV
// string when `format` is `CSV`. `F` defaults to both formats.
type GenerateOmnibusPositionReportContent =
  operations["OmnibusPositionReportController_generateOmnibusPositionReport"]["responses"][201]["content"]
export type GenerateOmnibusPositionReportResponse<
  F extends GenerateOmnibusPositionReportBody["format"] =
    GenerateOmnibusPositionReportBody["format"],
> = ReportContentFor<GenerateOmnibusPositionReportContent, F>

type GenerateMovementReportContent =
  operations["MovementReportController_generateMovementReport"]["responses"][201]["content"]
export type GenerateMovementReportResponse<
  F extends GenerateMovementReportBody["format"] = GenerateMovementReportBody["format"],
> = ReportContentFor<GenerateMovementReportContent, F>

type GeneratePositionReportContent =
  operations["PositionReportController_generatePositionReport"]["responses"][201]["content"]
export type GeneratePositionReportResponse<
  F extends GeneratePositionReportBody["format"] = GeneratePositionReportBody["format"],
> = ReportContentFor<GeneratePositionReportContent, F>

// Shared component referenced by GenerateMovementReportBody
export type Export_DateRangeDto = components["schemas"]["Export_DateRangeDto"]
