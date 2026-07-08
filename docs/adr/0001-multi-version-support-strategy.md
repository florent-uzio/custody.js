# ADR-0001 — Multi-version support via runtime capability gating

- Status: Accepted (design; not yet implemented)
- Date: 2026-07-07
- Related: ADR-0002 (capability model), ADR-0003 (version resolution),
  ADR-0004 (type generation)

## Context

The SDK is generated from a single OpenAPI spec and exposes one flat namespace
surface (`new RippleCustody(options)`, `client.domains.list()`, …). We need it
to work correctly against **many** Ripple Custody backend releases, because:

- The backend has **no API versioning** — every instance serves `/v1/...`.
- Releases are **not monotonic**: a higher `x-app-version` can have fewer
  endpoints than a lower one (`1.35.4` lacks XRPL Batch that `1.35.0` has;
  `1.35.0` lacks provider/deposit endpoints that `1.35.4` has).
- SDK users generally **do not know** their instance's release and will not
  inspect the spec manually.

The two stated goals pull in opposite directions: "tighten the API to a version"
(compile-time) vs "users don't know their version" (only knowable at runtime).
Compile-time narrowing requires the version as a static literal while writing
code — which the target users cannot supply.

## Decision

Enforce version compatibility with a **runtime capability guard**, not
compile-time type narrowing.

- The SDK compiles against one permissive **superset** type universe (ADR-0004).
- At runtime, a guard blocks a call only when the **resolved version**
  (ADR-0003) provably lacks the **capability** it needs (ADR-0002).
- The public constructor stays synchronous and unchanged — backward compatible
  with v2.4.0.

## Consequences

- Types are a permissive superset: TypeScript will let you _reference_ an
  endpoint your instance lacks; the runtime guard is what stops the call. This
  is a deliberate, consistent split (types = "what any known version can do";
  guard = "what this instance can do").
- No version generics thread through the namespaces — the architecture is
  otherwise untouched.
- The guard is a **DX aid, not a security boundary**: the backend remains the
  real authority (see ADR-0003 fail-open).
- Works with a runtime-detected version, which compile-time narrowing could not.

## Rejected alternatives

- **Compile-time narrowing** (`RippleCustody<"1.35.4">` hides absent members):
  requires a static version literal the target users don't have, and cannot use
  an auto-detected version. High generics complexity across every namespace.
- **Both (layered)**: static-literal narrowing _plus_ runtime guard. Most
  capable, but the compile-time half serves few users (they don't know their
  version) at large implementation cost.
