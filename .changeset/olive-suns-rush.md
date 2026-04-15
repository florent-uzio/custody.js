---
"custody": patch
---

fix: flatten manifest polling retry logic in waitForManifestSignature

The nested `getManifestWithRetry` loop would throw a 404 that bypassed the outer `waitForManifestSignature` retry loop, causing `rawSignAndWait` and `rawSignInnerBatchAndWait` to fail immediately when the manifest wasn't ready yet.

- Merged `getManifestWithRetry` into `waitForManifestSignature` as a single retry loop that handles both 404s and missing signatures
- Removed `notFoundRetries` and `notFoundIntervalMs` from `WaitForSignatureOptions`
- Changed `maxRetries` default from 10 to 3
