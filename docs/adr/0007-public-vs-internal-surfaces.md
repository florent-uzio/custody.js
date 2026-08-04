# ADR-0007 — Public vs internal API surfaces

- Status: Accepted (2026-08-04, on `feat/internal-openapi-surface`)
- Date: 2026-08-04
- Related: ADR-0004 (type-generation pipeline), ADR-0005 (official vs devbox
  channels)

## Context

Ripple Custody instances serve a second, **internal** API alongside the public
one — endpoints under `/internal/v1/…` and `/api/notifications/…` used by
internal tooling (pending vaults, prepared transactions, manifests, rewraps,
CMPT callbacks, mobile notification registration, …). It is published as its own
OpenAPI document: `openapi-1-36-2-internal.json` sits next to the public
`openapi-1-36-2.json` of the very same build, and an instance serves it at
`<apiUrl>/api/OpenAPI?scope=internal&layout=` — the same endpoint auto-detection
already uses for the public document, with a non-empty `scope`. (Verified: that
URL on the `xrpl-cmpt` devbox returns a document byte-identical to the bundled
file.)

Two properties of that document decide the design:

1. **It is disjoint from the public API.** Comparing the two `1.36.2` devbox
   specs: **0 shared paths** (21 under `/internal/v1/…` and 10 under
   `/api/notifications/…`, a prefix the public spec does not use at all) and
   **0 shared component schemas** (internal schemas are `Internal_*`,
   `InternalCoreExtensions_*`, `Notification_*`; public ones are `Core_*`,
   `GasStation_*`, `CoreExtensions_*`). They are two APIs, not two versions of
   one.
2. **Its `operationId`s are not globally unique.** `getUsers`
   (`GET /internal/v1/users`) and `getAllEvents` (`GET /internal/v1/events`)
   already exist in the public specs on entirely different paths
   (`/v1/domains/{domainId}/users`, `/v1/domains/{domainId}/channels/events`).
   `openapi-typescript` keys `operations` by `operationId`, so a single merged
   document silently resolves each name to whichever spec merged last.

Internal specs are not a third **channel** (ADR-0005): channel is _provenance_
and decides merge precedence, and the internal API exists in both provenances —
a devbox build has one, and so will an official release. Surface and channel are
orthogonal.

An internal spec also carries the **same `x-app-version`** as its public sibling
(both `1.36.2`), which collides with the `buildCapabilityDataset` duplicate-version
guard from ADR-0005 §5.

## Decision

**1. Surface is a second axis, expressed as a nested folder.** A spec's
**surface** is `internal` when it lives in `openapi/<channel>/internal/`, and
`public` when it sits at the channel root. Channel keeps its ADR-0005 meaning.

```
openapi/
  official/*.json             → official, public
  official/internal/*.json    → official, internal
  devbox/*.json               → devbox,   public
  devbox/internal/*.json      → devbox,   internal
```

`internal/` is the **only** nested folder a channel may contain; any other
subdirectory is a build error, so a mistyped folder cannot silently drop specs
from generation — the failure mode ADR-0005 was written to close.

**2. One generated types file per surface.** `mergeOpenApiDocsBySurface` splits
the tagged docs by surface and runs the unchanged ADR-0005 two-phase merge
(official authoritative, devbox additive) **within** each surface, producing:

- `src/models/custody-types.ts` — public superset (unchanged output);
- `src/models/custody-internal-types.ts` — internal superset, written only when
  internal specs are bundled.

Each file therefore has its own `operations` map, and
`operations["getUsers"]` is unambiguous in both. Internal namespaces import from
`custody-internal-types.js`; the CLAUDE.md rule that all types come from the
generated file is unchanged, only the file depends on the surface.

**3. `src/models/index.ts` does not re-export the internal types.** Both files
export `paths` / `operations` / `components`, so a second `export *` would
collide. Internal types stay an explicit import from
`../models/custody-internal-types.js`.

**4. The offline capability dataset unions both surfaces of a release.** A real
`1.38.0` instance serves both APIs, so `CAPABILITIES["1.38.0"]` lists the
endpoints and schemas of both its specs. `buildCapabilityDataset` therefore
takes surface-tagged docs, unions same-version entries, and keeps the ADR-0005
duplicate guard **per surface** (two official _public_ specs claiming one
version is still an error). It remains **official-only** — devbox internal
specs are types-only, exactly like devbox public specs.

**5. No runtime or public API surface changes.** `apiVersion` still enumerates
official releases and nothing about the client distinguishes surfaces. Internal
namespaces are out of scope for this ADR; they are built on later branches
against the generated internal types.

## Consequences

- Regenerating produces a **byte-identical** `custody-types.ts` apart from its
  header comment — adding the internal surface cannot regress public types.
- Dropping `openapi/official/internal/openapi-1-38-0-internal.json` in needs
  **no code change**: it merges into the internal superset and unions into
  `CAPABILITIES["1.38.0"]`, gating internal endpoints under an `apiVersion` pin
  just like public ones.
- The capability-parity test (`src/versioning/capability-parity.test.ts`) covers
  both surfaces of both channels, so the runtime and generator extractors stay
  in agreement on internal specs too.
- `custody-internal-types.ts` compiles into `dist` even before any internal
  namespace exists. It is types-only, unreferenced and unexported, so it adds no
  runtime code and no public API.
- CONTEXT.md gains **Surface**, **Public spec** and **Internal spec**.

## Rejected alternatives

- **`internal` as a third channel (`openapi/internal/`).** Conflates provenance
  with API surface: an internal spec would have no channel, so the
  official-authoritative / devbox-additive rule could not apply to it, and an
  official internal spec and a devbox internal spec would sit in one undifferentiated
  pool.
- **One merged `custody-types.ts` for both surfaces.** Simplest diff, but
  `operations["getUsers"]` and `operations["getAllEvents"]` become last-write-wins,
  leaving those internal endpoints reachable only through a hand-written
  `paths[…]` fallback — a hazard that grows with every future internal endpoint
  that reuses a public `operationId`.
- **Renaming colliding internal `operationId`s during the merge** (e.g.
  `getUsers` → `internal_getUsers`). Keeps one file but invents identifiers that
  appear in no spec, and the rename would fire only on collision, so a namespace
  author could not predict the key to use.
- **Symmetric `public/` + `internal/` folders inside each channel.** Marginally
  tidier, but moves all 15 existing official specs for no functional gain;
  "channel root = public" is a one-line rule.
- **Filename suffix (`*-internal.json`) as the surface marker.** Depends on the
  server's asset naming rather than on our layout, and ADR-0005 already settled
  on folders over filename conventions.
