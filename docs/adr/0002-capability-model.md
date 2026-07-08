# ADR-0002 — Capability model: endpoint + feature, resolved from the live spec

- Status: Accepted (design; not yet implemented)
- Date: 2026-07-07
- Related: ADR-0001 (runtime gating), ADR-0003 (version resolution)

## Context

The guard from ADR-0001 needs a precise notion of "what can this version do?"
Two facts shape it:

1. Some differences are **endpoint-level**: whole paths exist or not
   (virtual-ledgers, providers, deposit-instructions).
2. The flagship difference — **XRPL Batch** — is **not** an endpoint. There is
   no `/batch` path. Batch is an operation _type_ (`Core_XrplOperation_Batch`
   plus 33 companion schemas) carried inside the **existing** `/v1/intents`
   endpoint, which exists in every version. An endpoint-only check would miss
   it entirely. MPToken operation types are the same shape.

## Decision

Model capabilities at **two granularities**, both derived automatically from a
spec (no hand-maintained version tables):

- **Endpoint capability** = `(method, path-template)`. Derived from the spec's
  `paths`. Gated centrally in `TypedTransport`, which already knows the URL
  template and method for every call — so no per-namespace annotation is needed.
- **Feature capability** = presence of a named `components.schemas` entry.
  Derived from the spec's schema names.

**Resolution source (runtime):** the guard checks against the **live spec** of
the target instance (ADR-0003), so gating is exact for that instance — immune to
the non-monotonic-version trap and correct even for versions never bundled.
Bundled per-version capability data (ADR-0004) is only the offline / explicit
fallback.

**Gate depth — method + content.** Dedicated methods declare their capability
(`xrpl.proposeBatch` → `Core_XrplOperation_Batch`). Generic union entry points
additionally inspect request **content**: `xrpl.proposeIntent({ operation: {
type: T }})` requires schema `Core_XrplOperation_${T}` — verified to hold for
every union member (`Core_XrplOperation_<type>` matches the discriminator value
exactly), so the mapping needs no lookup table. `xrpl.rawSign` (arbitrary XRPL
transaction) is **out of scope**: its transaction type is an XRPL amendment
concern, not a custody capability.

## Consequences

- Same operation is gated identically whichever method reaches it —
  `proposeBatch` and `proposeIntent({type:"Batch"})` behave the same.
- The guard lives in exactly two places: `TypedTransport` (endpoints) and the
  xrpl service (feature/content). Small and central.
- Adding a new gated XRPL operation type is automatic (naming convention) as
  long as the spec defines `Core_XrplOperation_<Type>`.
- Feature gating depends on spec schema-name stability; a rename would need a
  mapping entry.

## Rejected alternatives

- **Endpoint-level only**: simplest, but misses Batch/MPToken (the headline
  case) — they'd fail with a raw backend 4xx instead of a clear SDK error.
- **Curated method→min-version registry**: full control over messaging, but
  pure manual maintenance that drifts from the specs every release.
- **Map detected version-string → bundled manifest (floor)**: unsafe under
  non-monotonic versions (a `1.35.7` instance with Batch, floored to a `1.35.4`
  manifest, would wrongly block Batch) and degrades for unbundled versions.
