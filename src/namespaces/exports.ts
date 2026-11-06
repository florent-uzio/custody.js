import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  GenerateMovementReportBody,
  GenerateMovementReportResponse,
  GenerateOmnibusPositionReportBody,
  GenerateOmnibusPositionReportResponse,
  GeneratePositionReportBody,
  GeneratePositionReportResponse,
} from "./exports.types.js"

/**
 * `client.exports.*` — movement, position and omnibus position report generation.
 *
 * Each method resolves to the JSON report DTO for `format: "JSON"` and to the
 * raw CSV `string` for `format: "CSV"`.
 */
export function createExports(t: Transport) {
  return {
    generateMovementReport: <F extends GenerateMovementReportBody["format"]>(
      body: GenerateMovementReportBody & { format: F },
    ): Promise<GenerateMovementReportResponse<F>> =>
      t.post(URLs.exportsMovement, body, undefined, { sign: false }),

    generatePositionReport: <F extends GeneratePositionReportBody["format"]>(
      body: GeneratePositionReportBody & { format: F },
    ): Promise<GeneratePositionReportResponse<F>> =>
      t.post(URLs.exportsPosition, body, undefined, { sign: false }),

    generateOmnibusPositionReport: <F extends GenerateOmnibusPositionReportBody["format"]>(
      body: GenerateOmnibusPositionReportBody & { format: F },
    ): Promise<GenerateOmnibusPositionReportResponse<F>> =>
      t.post(URLs.exportsOmnibusPosition, body, undefined, { sign: false }),
  } as const
}
