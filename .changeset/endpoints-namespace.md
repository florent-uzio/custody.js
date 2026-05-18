---
"custody": minor
---

Added an `endpoints` namespace exposing the domain-scoped Endpoints API.

- `client.endpoints.list({ domainId }, query?)` returns `Core_TrustedEndpointsCollection`, backed by `GET /v1/domains/{domainId}/endpoints` (`getEndpoints`). The optional query bag supports paging (`limit`, `startingAfter`), sorting (`sortBy`, `sortOrder`), and the same metadata / `ledgerId` / `alias` / `address` / `lock` filters defined in the OpenAPI spec.
- `client.endpoints.get({ domainId, endpointId })` returns `Core_TrustedEndpoint`, backed by `GET /v1/domains/{domainId}/endpoints/{endpointId}` (`getEndpoint`).
- New public type exports from the SDK barrel: `Core_TrustedEndpoint`, `Core_TrustedEndpointsCollection`, `GetEndpointPathParams`, `GetEndpointsPathParams`, `GetEndpointsQueryParams`.
