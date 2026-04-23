---
"custody": minor
---

feat(channels): add `client.channels` namespace with read methods — `list`, `get`, `listEvents`, `getEvent`, `listAllEvents` — plus a `parseEventPayload(event: EDS_Event): Core_HarmonizeEvent` helper that JSON-parses EDS event payloads and narrows on the `Core_HarmonizeEventPayload` discriminator. Re-exports `EDS_Channel`, `EDS_Event`, `EDS_ChannelUpdate`, `EDS_WebhookChannelCreate`, every channels path-param type, and `parseEventPayload` from the package root. Write methods (create/update/delete/test) follow in later slices once the transport layer gains PATCH, DELETE, and `post({ sign: false })`.
