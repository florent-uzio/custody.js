---
"@florent-uzio/custody": minor
---

Bundle OpenAPI specs for `1.34.9`, `1.34.10`, and `1.38.0`. `1.34.10` renamed the Gas Station sponsor endpoints from `/v1/domain/{domainId}/...` to `/v1/domains/{domainId}/...`; `client.sponsors.*` now targets the current path (the previous singular `domain` route was deprecated server-side). Adds `client.sponsors.getValidSponsors()`, `client.sponsors.addSponsoredAccount()`, and `client.sponsors.removeSponsoredAccount()`. `1.38.0` adds `client.domains.getSweepThresholds()`, `client.domains.updateSweepThresholds()`, and `client.omnibus.getInternalTransfer()`.
