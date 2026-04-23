---
"custody": minor
---

feat(channels): add `client.channels.delete` — the first use of `DELETE` in the SDK. Transport now supports DELETE: `ApiService.delete` and `TypedTransport.delete` mirror the existing `get` (no body, error wrapping into `CustodyError`). `client.channels.delete({ domainId, channelId })` issues `DELETE /v1/domains/{domainId}/channels/{channelId}` and resolves to `void`. Closes out the Events/EDS PRD transport work.
