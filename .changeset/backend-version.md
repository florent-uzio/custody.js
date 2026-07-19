---
"@florent-uzio/custody": minor
---

Add `client.backendVersion()` to read the resolved backend app version (from an explicit `apiVersion` or auto-detection, triggering detection if it hasn't run yet). Throws `CustodyError` if no version can ever be resolved or if live detection fails.
