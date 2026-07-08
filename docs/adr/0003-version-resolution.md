# ADR-0003 — Version resolution: auto-detect live, lazy, fail-open

- Status: Accepted (implemented in #136, #137)
- Date: 2026-07-07
- Related: ADR-0001 (runtime gating), ADR-0002 (capability model)

## Context

The guard needs a **resolved version** and its capability set. Constraints:
users don't know their version and won't check; the current constructor is
synchronous and shipped (v2.4.0); the live spec is fetchable at
`<apiUrl>/api/OpenAPI?scope=&layout=` (the same source the `rc-version` skill
uses, apparently unauthenticated).

## Decision

**Resolution order:** explicit `apiVersion` → auto-detection → _unresolved_.

- **Explicit `apiVersion`** (opt-in): skips detection, gates against the bundled
  capability data for that version (ADR-0004). If the value isn't among bundled
  versions, throw at construction listing the known versions.
- **Auto-detection** (default): on the **first** API call, fetch the live spec,
  build the capability set from it (ADR-0002), and cache it for the client's
  lifetime. Concurrent first calls **dedupe** to a single fetch.
  - The constructor stays **synchronous** — no breaking change.
  - `await client.ready()` is offered to front-load detection and surface its
    errors explicitly.
  - Opt-out via a client option (e.g. `autoDetectVersion: false`).

**Single unresolved rule — fail-open + warn.** Whenever no version is resolved —
detection failed (unreachable/malformed spec) **or** auto-detect is disabled and
no `apiVersion` was given — the guard is **disabled**: all calls pass through,
one warning is emitted, and the backend rejects anything unsupported itself.

This **replaces** the original "default to the highest version" idea. Defaulting
to the highest bundled version would gate confidently _wrong_ against any
instance that isn't exactly that version (blocking endpoints it has, allowing
features it lacks) — see the non-monotonic finding in `CONTEXT.md`.

## Consequences

- Backward compatible: existing `new RippleCustody(options)` code is unchanged
  and gains gating for free once an instance is reachable.
- The first call carries one extra network round-trip (cached thereafter).
- Gating quality depends on the live spec being reachable and well-formed; when
  it isn't, the SDK degrades to today's behavior (no gating) rather than to
  wrong gating.
- One rule ("no resolved version → no gate") governs every unresolved path —
  easy to reason about and document.

## Rejected alternatives

- **Async factory as the only entry point** (`await RippleCustody.create`):
  cleaner ordering but forces migration off the sync constructor. May still be
  added later as a convenience; not the primary contract.
- **Explicit `resolveVersion()` required before use**: easy to forget; every
  caller pays boilerplate.
- **Hard-fail on detection failure**: couples all traffic to one endpoint's
  uptime; a transient hiccup breaks otherwise-valid calls.
- **Fail-closed to latest bundled** / **default to highest**: confidently wrong
  under non-monotonic versions.
