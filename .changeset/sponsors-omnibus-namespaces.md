---
"@florent-uzio/custody": minor
---

Promote Gas Station sponsorship and omnibus/tenant accounting from `client.domains.*` into their own first-class `client.sponsors.*` and `client.omnibus.*` namespaces.

- `client.sponsors` — flat namespace, methods dropped the redundant `Sponsor` prefix where the namespace already implies it (e.g. `domains.createSponsor()` -> `sponsors.create()`, `domains.listSponsorEvents()` -> `sponsors.listEvents()`). Methods that describe sponsored/sponsorable accounts and domains keep their descriptive names (`getAccountSponsor`, `listSponsoredAccounts`, `getSponsorableDomains`, etc).
- `client.omnibus` — core omnibus operations (`get`, `create`, `getById`, `update`, `lock`, `unlock`, `listInternalTransfers`, `listDepositWallets`) at the top level, with tenant operations nested under `client.omnibus.tenants.*` (including `client.omnibus.tenants.depositWallet.*`).

This removes the corresponding methods from `client.domains`, which now only exposes `list` and `get`. Since these surfaces are new and not yet depended on, there is no deprecated alias kept on `domains` — call sites should move directly to `client.sponsors.*` / `client.omnibus.*`.
