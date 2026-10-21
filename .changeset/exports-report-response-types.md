---
"@florent-uzio/custody": patch
---

Type the `client.exports.generatePositionReport` and `client.exports.generateMovementReport` responses. They were declared as `Promise<void>`, but the spec (documented since 1.42.0) returns a 201 body: the JSON report DTO when `format` is `JSON`, or the raw CSV `string` when `format` is `CSV`. Callers that relied on the `void` return type may need a type adjustment.
