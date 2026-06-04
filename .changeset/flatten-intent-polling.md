---
"@florent-uzio/custody": minor
---

fix: flatten intent polling retry logic in `waitForExecution` (`intents.getAndWait`)

The nested `getIntentWithRetry` loop would throw a 404 that bypassed the outer
`waitForExecution` retry loop, causing `getAndWait` to fail immediately when the
intent was not yet available (e.g. right after proposing) instead of polling for it.

- Merged `getIntentWithRetry` into `waitForExecution` as a single retry loop that
  treats a 404 as "not available yet" and keeps polling until `maxRetries`.
- A persistent 404 (intent never materializes) now throws a `CustodyError` with
  `statusCode` 404 after `maxRetries` attempts.
- Fixed the timeout path: the result is now derived from the last observed intent,
  so it can no longer report a terminal status with `isTerminal: false`.
- Removed `notFoundRetries` and `notFoundIntervalMs` from `WaitForExecutionOptions`.
