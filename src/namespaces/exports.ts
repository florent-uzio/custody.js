import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  GenerateMovementReportBody,
  GenerateOmnibusPositionReportBody,
  GenerateOmnibusPositionReportResponse,
  GeneratePositionReportBody,
} from "./exports.types.js"

/** `client.exports.*` — movement, position and omnibus position report generation. */
export function createExports(t: Transport) {
  return {
    generateMovementReport: (body: GenerateMovementReportBody): Promise<void> =>
      t.post(URLs.exportsMovement, body, undefined, { sign: false }),

    generatePositionReport: (body: GeneratePositionReportBody): Promise<void> =>
      t.post(URLs.exportsPosition, body, undefined, { sign: false }),

    generateOmnibusPositionReport: (
      body: GenerateOmnibusPositionReportBody,
    ): Promise<GenerateOmnibusPositionReportResponse> =>
      t.post(URLs.exportsOmnibusPosition, body, undefined, { sign: false }),
  } as const
}
