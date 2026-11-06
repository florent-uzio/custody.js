import { describe, expectTypeOf, it } from "vitest"
import type { components } from "../../models/custody-types.js"
import type { Transport } from "../../transport/index.js"
import { createExports } from "../exports.js"
import type {
  GenerateMovementReportBody,
  GenerateOmnibusPositionReportBody,
  GeneratePositionReportBody,
} from "../exports.types.js"

type Schemas = components["schemas"]

const exports = createExports({} as Transport)

describe("exports report return type narrows by format", () => {
  it("generateMovementReport", () => {
    const body = {} as Omit<GenerateMovementReportBody, "format">
    expectTypeOf(
      exports.generateMovementReport({ ...body, format: "CSV" }),
    ).resolves.toEqualTypeOf<string>()
    expectTypeOf(
      exports.generateMovementReport({ ...body, format: "JSON" }),
    ).resolves.toEqualTypeOf<Schemas["Export_MovementReportResponseDto"]>()
    expectTypeOf(
      exports.generateMovementReport({} as GenerateMovementReportBody),
    ).resolves.toEqualTypeOf<Schemas["Export_MovementReportResponseDto"] | string>()
  })

  it("generatePositionReport", () => {
    const body = {} as Omit<GeneratePositionReportBody, "format">
    expectTypeOf(
      exports.generatePositionReport({ ...body, format: "CSV" }),
    ).resolves.toEqualTypeOf<string>()
    expectTypeOf(
      exports.generatePositionReport({ ...body, format: "JSON" }),
    ).resolves.toEqualTypeOf<Schemas["Export_PositionReportResponseDto"]>()
    expectTypeOf(
      exports.generatePositionReport({} as GeneratePositionReportBody),
    ).resolves.toEqualTypeOf<Schemas["Export_PositionReportResponseDto"] | string>()
  })

  it("generateOmnibusPositionReport", () => {
    const body = {} as Omit<GenerateOmnibusPositionReportBody, "format">
    expectTypeOf(
      exports.generateOmnibusPositionReport({ ...body, format: "CSV" }),
    ).resolves.toEqualTypeOf<string>()
    expectTypeOf(
      exports.generateOmnibusPositionReport({ ...body, format: "JSON" }),
    ).resolves.toEqualTypeOf<Schemas["Export_OmnibusPositionReportResponseDto"]>()
    expectTypeOf(
      exports.generateOmnibusPositionReport({} as GenerateOmnibusPositionReportBody),
    ).resolves.toEqualTypeOf<Schemas["Export_OmnibusPositionReportResponseDto"] | string>()
  })
})
