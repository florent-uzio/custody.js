---
"@florent-uzio/custody": patch
---

Name the `quarantineStatus` filter as the likely cause when a request fails with a bare `500 Internal server error`. Some Ripple Custody versions answer any transfers query carrying `quarantineStatus` with an internal error, even though the parameter is declared in every bundled OpenAPI spec — so `client.transactions.transfers({ domainId }, { quarantineStatus: "Quarantined" })` fails with nothing to go on, and the filter responsible has to be found by bisecting the query. The `hint` on `CustodyError` now points at it, and at the substitute: filtering on the deprecated `quarantined` boolean returns the same rows for `Quarantined` (`quarantined: true`).

The parameter is not rewritten automatically. `Core_QuarantineStatus` has three values and the boolean has two, so only `Quarantined` has an exact equivalent — `quarantined: false` conflates `Released`, `Skipped` and the `null` the API returns on fee transfers — and silently substituting it would turn a loud 500 into wrong data for a caller filtering on `Skipped`. The hint fires only on a `500` whose request actually carried the parameter, and hedges on which server versions are affected, since only devbox `1.36.2` was observed. See [#238](https://github.com/florent-uzio/custody.js/issues/238).
