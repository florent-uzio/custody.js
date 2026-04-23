---
"custody": minor
---

feat(channels): add `client.channels.update` — the first use of `PATCH` in the SDK. Transport now supports PATCH: `ApiService.patch` and `TypedTransport.patch` mirror the existing `put` (no canonicalization, no signing, error wrapping into `CustodyError`). `client.channels.update({ domainId, channelId }, body)` issues `PATCH /v1/domains/{domainId}/channels/{channelId}` with an `EDS_ChannelUpdate` body and returns `EDS_Channel`.
