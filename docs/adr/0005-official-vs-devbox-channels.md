# ADR-0005 — Official vs devbox spec channels

- Status: Accepted (design agreed 2026-07-08; implementation pending on
  `feat/multi-versions` / PR #138)
- Date: 2026-07-08
- Related: ADR-0001 (runtime gating), ADR-0003 (version resolution),
  ADR-0004 (type generation)

## Context

Bundled specs come from two provenances: **official** Ripple Custody releases
and **devbox** feature-branch builds. `info.x-app-version` is **not a unique
identity** across them:

- `openapi/devbox/…` reports `x-app-version: 1.35.0` but is a devbox build — it
  has XRPL Batch + Virtual Ledgers that the _higher-semver_ official `1.35.4`
  release lacks. A devbox "1.35.0" ≠ an official 1.35.0.
- **XRPL Batch is a shipped SDK feature** (`xrpl.proposeBatch`,
  `Core_XrplOperation_Batch`, #129) sourced **only** from the devbox spec. Batch
  is **preview/devbox-only** — not in any official release yet.

This broke the generation pipeline in two ways:

1. **Latent regression.** After the devbox spec was moved into
   `openapi/devbox/`, `loadDocs()` (which globs `openapi/` **flat**) silently
   stopped reading it. The committed generated files still contain Batch (stale),
   so **re-running `npm run generate:custody-types` would delete Batch** — a
   regression and a violation of the "generation is deterministic" invariant.
2. **Key collision.** `buildCapabilityDataset` keys each entry by bare
   `x-app-version`; a devbox and an official spec sharing a version string would
   collide, one silently overwriting the other.

Runtime auto-detection (ADR-0003) is already immune — it derives capabilities
from the **live spec** (paths + schemas), never from a version string or label.
The problem is confined to the **bundled/offline** layer.

## Decision

**1. Channel by folder.** Specs live under `openapi/official/` and
`openapi/devbox/`; a spec's channel is its immediate subdirectory name. A `.json`
sitting directly in `openapi/` is a build error. Server-provided JSON contents
are never edited (only relocated) — consistent with CLAUDE.md.

**2. One permissive superset (all channels).** Both official and devbox specs
merge into the single `custody-types.ts`, so devbox/preview features (Batch) stay
typed in the main namespace with no breaking change. This is the existing
philosophy from ADR-0001: _types = what any known version can do; the guard =
what this instance can do._ The default types already advertise features some
instances lack; devbox-Batch is more of the same, and the guard is the honesty
mechanism.

**3. Official is authoritative; devbox is additive-only.** Two-phase merge:
official specs build the superset (newest-wins among official; the base document
supplying `info`/`servers`/etc. is the **newest official** spec), then devbox
specs are unioned in **additively** — they may **add** new schemas/endpoints
(Batch flows in untouched) and union array members, but on an irreconcilable
**scalar conflict the official value wins** and a warning is emitted
(`devbox diverges from official at <path>; kept official`). A feature-branch
build can never silently redefine an officially-typed shape or hijack the
superset's identity.

**4. Offline capability dataset = official only.** `capabilities.generated.ts`
(`CAPABILITIES`) is built from **official specs only**. Therefore
`KnownAppVersion` — and the `apiVersion` option typed by it — enumerate
**official releases only**, keyed by bare `x-app-version` (safe: official
releases have unique versions). **Devbox specs are types-only.**

- `apiVersion` stays a plain official version string — **no `isDevbox` flag, no
  `channel` option, no composite key.** Offline-pinning any official version
  correctly **blocks preview features** (no official spec defines them) and will
  keep blocking them until a real official release ships them.
- A **real** devbox instance is served by auto-detection (ADR-0003), which reads
  its live spec. For offline-gating purposes a devbox preview build is the same
  as an unbundled version — and ADR-0003 already assigns unbundled versions to
  auto-detection.

**5. Generator safety.** Error if two specs in the **same channel** report the
same `x-app-version` (guards an intra-official collision).

**6. Auto-detect does not label instances as devbox.** Out of scope and
unnecessary — live-spec detection is already exact regardless of provenance.
Deferred.

## Consequences

- **Fixes the latent regression:** `loadDocs` recurses into channel subfolders;
  regeneration once again includes Batch and is deterministic (re-run = no diff).
- **No new public API surface.** No `isDevbox`, no `channel` option; `apiVersion`
  semantics are unchanged for users.
- **Graceful promotion path:** when an official release finally ships a preview
  feature, dropping its spec into `openapi/official/` lights it up in the offline
  dataset and `apiVersion` with **no code change**; the devbox spec can then be
  removed (or kept until parity).
- **Type honesty is unchanged from ADR-0001:** the default types remain a
  permissive superset; the runtime/offline guard is what blocks calls a resolved
  instance/version cannot serve.
- Pipeline changes are localized: `loadDocs` (recurse + tag channel),
  `mergeOpenApiDocs` (channel-aware two-phase merge), `buildCapabilityDataset`
  (official-only input). The runtime layer (`version-guard.ts`, `detect.ts`) is
  untouched.
- `CONTEXT.md` glossary gains **Channel**, **Official spec**, **Devbox spec**,
  **Preview feature**.

## Rejected alternatives

- **`isDevbox` client flag / `channel` option.** A runtime devbox flag is
  useless — auto-detection already reads the live spec — and would only modify an
  offline `apiVersion` pin, a niche not worth the surface.
- **Devbox in the offline dataset with channel-aware keys (`devbox:1.35.0`).**
  Forces `apiVersion` to carry a channel (composite string or a second option),
  enlarges the public surface, and only enables offline-pinning a preview build.
  Rejected in favour of types-only devbox.
- **Official-only stable types + a separate preview entrypoint for devbox
  features.** Honest defaults, but breaks the shipped `xrpl.proposeBatch` and
  revives the per-version-entrypoint feature ADR-0004 explicitly deferred.
- **Filename convention or sidecar manifest for channel.** Subfolders keep
  server file contents untouched and need no parsing.
- **Pure semver newest-wins across channels.** Correct for today's specs, but a
  future higher-versioned devbox build could override official types or become
  the base document.
