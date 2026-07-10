# ADR-0004 — Type generation: merged superset + per-version capability data

- Status: Accepted (generation pipeline implemented in #134)
- Date: 2026-07-07 (revised 2026-07-08)
- Related: ADR-0001 (runtime gating), ADR-0002 (capability model)

> **Revision (2026-07-08, #134):** the original merge policy below said
> "newest-wins by semver." Implementation proved that unsafe: releases are
> non-monotonic, so the highest semver (1.35.4) is _feature-older_ than 1.35.0
> (it lacks XRPL Batch). Newest-wins would silently drop the Batch member from
> the `Core_XrplOperation` union and break the existing xrpl code. The merge is
> therefore a **structural union**, with newest-wins kept only as the fallback
> for genuinely irreconcilable scalar conflicts. See the Decision/Consequences
> below as amended.

## Context

Supporting many backends means the type layer must describe endpoints/schemas
that only _some_ versions have — the types generated from `1.35.0` alone cannot
even describe a `1.35.4` instance's 8 provider/deposit endpoints. The SDK's own
code (`urls.ts` → `keyof paths`, every `*.types.ts` → `operations[...]` /
`components[...]`) imports from **one** module and cannot import from many. And
the engineering team will release **30–50+** versions over time.

A natural instinct — "generate one full type file per version" — fails twice:
the hand-written SDK still needs a single universe to compile against (so
per-version files don't remove that need, they add to it), and 50 × ~15k lines
of ~99%-identical generated code bloats the repo, the bundle, and `tsc`.

Key insight: a **superset** type does not grow with the version _count_ — it
grows with the number of _distinct_ endpoints/schemas across all versions, which
converges fast (most releases share ~99% of schemas). What genuinely varies
per version is small **data** (which paths/schemas exist), not full types.

## Decision

`npm run generate:custody-types` produces two artifacts from `openapi/*.json`
(each spec keyed by its internal `info.x-app-version`, not its filename):

```
openapi/*.json  (many, manually committed)
   ├─► merge (structural union) ─► src/models/custody-types.ts
   │                               ONE superset the whole SDK compiles against
   └─► extract paths+schema names per spec ─► src/models/capabilities.generated.ts
                              tiny per-version capability data (offline/explicit fallback)
```

- **Superset** = structural union of every bundled spec's `paths`, `operations`,
  `components`: arrays (`oneOf`/`anyOf`/`allOf`/`enum`/`required`/`type`) are
  unioned and de-duplicated; objects are merged key-by-key, recursing into
  shared keys. This guarantees nothing any version defines is ever dropped —
  the whole point of a superset — regardless of which version has the richer
  shape.
- **Capability data** = per version, the set of `(method, path)` + the set of
  component-schema names. A few KB each; no need to run `openapi-typescript`
  per spec.
- Adding a version: commit its spec to `openapi/`, run generate, add a
  changeset. Obtaining the spec (fetch from an instance's `/api/OpenAPI`) is a
  separate manual/helper step.

## Consequences

- Scales to 50+ versions cheaply — one type file, small data.
- The runtime source of truth is still the **live spec** (ADR-0003); bundled
  capability data is only the offline / explicit-`apiVersion` fallback.
- **Merge policy is structural union** (not newest-wins). Conflicting composite
  schemas (differing `oneOf`/`enum` members, differing object properties) are
  unioned so the superset is the maximal shape across versions. Real data proved
  this necessary and bidirectional: 1.35.0's `Core_XrplOperation` has the Batch
  member 1.35.4 lacks, while 1.35.4's `Core_IntentType` has enum values 1.35.0
  lacks — only a union keeps both. **Newest-wins survives only as the fallback**
  for irreconcilable _scalar_ conflicts (e.g. `type: "string"` vs `"number"` on
  one schema), and the generate step emits a build-time warning whenever that
  fallback fires. A widened union can force a handful of call sites that assumed
  a narrower shape to discriminate explicitly (e.g. `findByAddress` now type-
  guards on `type === "AccountAddressReference"`); this is expected and correct.
- Endpoints lacking an `operationId` (e.g. the virtual-ledgers paths) still
  merge into `paths`, so `keyof paths` and URL typing work, but they have no
  `operations["..."]` entry — their request/response types must be referenced
  via `paths[...]`. Pre-existing spec-quality issue, not caused by this work.

## Rejected alternatives

- **One full type file per version**: doesn't remove the single-universe need;
  50× duplicate generated code; heavy `tsc`/bundle.
- **Per-version type files exposed as importable entrypoints**
  (`import type {...} from "@.../models/1.35.4"`): a real but separate feature;
  deferred until a consumer actually needs version-exact types.
- **Fetch specs at build time from instances**: non-deterministic builds coupled
  to instance availability.
- **Single primary spec + live-only**: smallest bundle, but types then miss
  endpoints absent from the primary and offline explicit gating can't cover them.
