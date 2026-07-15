---
"@florent-uzio/custody": minor
---

Add `verifyWebhookSecret` to authenticate inbound webhook deliveries. Ripple Custody does not sign or otherwise authenticate webhook deliveries — a channel's `url` carries no secret, key, or signature field — so this helper verifies a caller-managed secret embedded in the registered URL's query string (e.g. `?token=...`) instead. The webhook examples (`examples/webhooks/`) and README now demonstrate this trust boundary explicitly.
