---
"custody": minor
---

feat/eds — EDS Channels & Events support

New namespaces on RippleCustody

client.events

- list(params, query?) — fetches a paginated Core_EventsCollection from the Core events endpoint.

client.channels (EDS — Event Delivery Service)

- list(params) — list all channels for a domain
- get(params) — get a single channel
- create(params, body) — create a channel (sent unsigned, no signed-envelope wrapping)
- update(params, body) — update a channel via PATCH
- delete(params) — delete a channel
- test(params) — trigger a test delivery on a channel
- listEvents(params) — list events for a specific channel
- getEvent(params) — get a single channel event
- listAllEvents(params) — list events across all channels for a domain

New helper

parseEventPayload(event: EDS_Event): Core_HarmonizeEvent — parses the JSON-encoded payload string on an EDS_Event into a fully typed Core_HarmonizeEvent. Narrows the inner payload.type discriminator so callers can switch on the event variant. Throws CustodyError on missing payload, invalid JSON, or missing type discriminator.

Transport layer changes

- Added patch<T> and delete<T> methods to TypedTransport and ApiService
- Added sign?: boolean option to post() — when false, the request body is forwarded as-is without canonicalization or signed-envelope wrapping (used by channel create/test which use a flat body format)

New types exported from package root:

EDS_Channel, EDS_ChannelCreate, EDS_ChannelUpdate, EDS_Event, EDS_WebhookChannelCreate, all channel path-param types, plus Core_EventScope, Core_EventsCollection, Core_HarmonizeEvent Core_HarmonizeEventPayload, and the event path/query param types.
