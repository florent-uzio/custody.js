---
"custody": minor
---

feat(events): add `client.events.list({ domainId }, query?)` namespace, returning `Core_EventsCollection` from `GET /v1/domains/{domainId}/events`. Re-exports `Core_EventsCollection`, `Core_HarmonizeEvent`, `Core_HarmonizeEventPayload`, `Core_EventScope`, `GetEventsPathParams`, and `GetEventsQueryParams` from the package root.
