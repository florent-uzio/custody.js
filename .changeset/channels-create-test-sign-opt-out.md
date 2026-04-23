---
"custody": minor
---

feat(channels): add `client.channels.create` and `client.channels.test` — the first non-envelope `POST` calls in the SDK. Transport now supports an opt-out on signing: `ApiService.post` (and `TypedTransport.post` via `RequestConfig.sign`) accept `sign: false` to skip canonicalization/signed-envelope signing and send the body as-is. Default remains `sign: true`, so all existing signed-intent call sites are unaffected. `EDS_ChannelCreate` is exported from the package root as a discriminated union starting with `EDS_WebhookChannelCreate`, so future channel types can be added non-breakingly.
