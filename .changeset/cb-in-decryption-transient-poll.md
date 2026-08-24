---
"@florent-uzio/custody": minor
---

`client.internal.cbInDecryption.getStatusAndWait` / `initiateAndWait` now treat
a `400` from the CB_IN status endpoint as transient and keep polling, alongside
the `404` they already retried. Instances return `400` while several CB_IN
decryptions are in flight concurrently, which made concurrent inbox reads
(`Promise.all` over several issuances) fail for reasons unrelated to the
request.

Retries exhausting no longer relabels the failure: previously the wait threw a
synthesized `404 "…not found after N attempts"` regardless of what the status
checks actually returned. It now rethrows the last transient error with the
server's own `reason` and `statusCode`, with the attempt count carried in the
`hint` and the original error as `cause` — so a genuinely malformed request id
surfaces as the `400` it is instead of a misleading "not found".
