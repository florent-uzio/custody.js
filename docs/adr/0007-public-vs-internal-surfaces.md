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

**5. Gating is per surface, and an unresolved surface fails open.**
`TypedTransport` calls `guard.checkEndpoint` on every verb, so without this the
guard would reject all 42 internal endpoints the moment gating became active —
they appear in no public spec. `ResolvedCapabilities` therefore carries the
`surfaces` it actually describes, and `assertEndpoint` returns early for a
surface that is not among them. This is the guard's existing fail-open
philosophy applied per surface: it only judges what it has enumerated, and the
backend stays the ultimate authority. Endpoints and schemas remain flat unions
(the two surfaces are disjoint, so there is nothing to disambiguate); only the
`surfaces` set is new. `capabilities.generated.ts` gains a matching
`surfaces: [...]` field per version.

Call sites opt in through `RequestConfig`, which the internal namespaces set
alongside the `sign: false` every internal endpoint needs:

```ts
t.post(InternalURLs.pendingVault, body, undefined, { sign: false, surface: "internal" })
```

`sign: false` is not a preference — `ApiService.post` canonicalizes `body.request`
and writes `body.signature`, and **no** internal request body has a `request`
property, so the default would throw inside the SDK before the call went out.

**6. Auto-detection fetches both documents, best-effort.** An instance serves
the internal document at `?scope=internal&layout=`, so `detectCapabilities`
fetches it concurrently with the public one. The public fetch is required (a
failure fails open as before); the internal fetch is **tolerated** — an instance
that predates it, or doesn't expose it, resolves to `surfaces: ["public"]` and
internal calls pass through. The internal URL is derived from `apiUrl`, so no
new client option is needed; a caller-supplied `specSource` (an override of spec
fetching wholesale, typically a test) disables internal detection rather than
issuing an HTTP call behind it.

**7. No public API surface changes.** `apiVersion` still enumerates official
releases; `surface` is an internal plumbing detail of `RequestConfig`. Internal
namespaces are out of scope for this ADR: they are built on later branches
against the generated internal types, and will hang off a single
`client.internal.*` property so their `operationId` overlap with the public API
(`getUsers`, `getAllEvents`) never surfaces as a naming collision on the client.

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
- **One extra HTTP request per client**, once, lazily, when auto-detection runs
  (the default). It is concurrent with the public fetch, so it costs no extra
  wall-clock, and it is skipped entirely when `apiVersion` is pinned or
  `specSource` is supplied.
- Namespace branches start on working plumbing: an internal namespace is an
  ordinary namespace that imports the internal types and passes
  `{ sign: false, surface: "internal" }`. No transport, auth or service changes.
- CONTEXT.md gains **Surface**, **Public spec** and **Internal spec**.

## Follow-up

Realized on `feat/internal-cb-in-decryption`: `client.internal.cbInDecryption`
(CB_IN decryption, `/internal/v1/cmpt-cb-in`) is the first internal namespace,
and it needed no plumbing change — only `src/constants/internal-urls.ts`
(`InternalURLs`, typed against the internal `paths` and, unlike the public
`URLs`, deliberately non-exhaustive with no completeness assertion, since the
SDK names only the internal endpoints it implements). The resulting conventions
are recorded in CONTEXT.md under **Internal namespace**.

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
- **Skipping internal detection and always failing open on that surface.**
  Cheaper by one request, but the SDK would give up on the internal API the
  capability errors it provides everywhere else, for no structural reason — the
  document is right there at `?scope=internal`.
- **Separate per-surface endpoint/schema sets on `ResolvedCapabilities`.**
  Needed only if the surfaces could define the same `METHOD /path`. They can't
  (0 shared paths, and the prefixes `/internal/v1` and `/api/notifications` are
  unused by the public API), so a flat union plus a `surfaces` marker carries
  the same information with less structure.
- **New `internalOpenApiUrl` / `internalSpecSource` client options.** Public
  surface area for a URL that is mechanically derivable from `apiUrl`.
