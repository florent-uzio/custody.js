---
"@florent-uzio/custody": minor
---

`exports.generateMovementReport`, `generatePositionReport` and `generateOmnibusPositionReport` now narrow their return type by the body's `format`: `format: "CSV"` resolves to `string`, `format: "JSON"` to the report DTO. A `format` typed as `"CSV" | "JSON"` still gives the union. `GenerateMovementReportResponse`, `GeneratePositionReportResponse` and `GenerateOmnibusPositionReportResponse` take an optional format parameter (for example `GeneratePositionReportResponse<"JSON">`) that defaults to both formats.

```ts
const csv = await custody.exports.generatePositionReport({ ...filters, format: "CSV" }) // string
const report = await custody.exports.generatePositionReport({ ...filters, format: "JSON" }) // Export_PositionReportResponseDto
```
