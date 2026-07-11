# ADR-0006 — Defer TypeScript 7 (pin to 5.9.x)

- Status: Accepted (2026-07-11, on `chore/upgrade-dependencies`)
- Date: 2026-07-11
- Related: ADR-0004 (type-generation pipeline — `openapi-typescript` /
  `generate:custody-types`)

## Context

TypeScript 7.0 went stable on 2026-07-08. It is the Go-native compiler (`tsgo`,
formerly the "Corsa" native port) and ships as the `typescript` npm package —
installing `typescript@7` replaces `tsc` with the native binary.

Empirically, this repo's core toolchain is fine on 7.0: `tsc` compiles the source
cleanly and the vitest suite is fully green (vitest transpiles with esbuild and
never invokes `tsc`, so it is insensitive to the compiler swap).

The blocker is that TS 7.0 **dropped the legacy compiler / language-service API**
(the TypeScript-authored "Strada" codebase, i.e. `ts.createLanguageService` and
the surrounding language-service host surface). A replacement API is **not
planned until TS 7.1**. Two of this repo's devtools call that removed API and are
therefore affected on 7.0:

- **`prettier-plugin-organize-imports`** (`check-format` / `format`) — organizes
  imports via the language service. On 7.0 it internally throws
  `TypeError: Cannot read properties of undefined (reading 'fileExists')` because
  `ts.createLanguageService` is `undefined`. The plugin wraps that call in a
  `try/catch` that swallows the error and returns the source unchanged, so the
  failure is **silent**: `npm run check-format` still exits `0`, but imports are
  no longer sorted or deduplicated. CI stays green while the guarantee is lost —
  a quiet degradation rather than a loud break.
- **`openapi-typescript`** (`generate:custody-types`) — depends on the same
  removed API; its published peer requirement is `typescript@^5.x`, and npm emits
  a peer-conflict warning when TS 7 is installed. It is expected-broken on 7.0 for
  the same reason. (Not exercised here: this repo does not regenerate types as
  part of the upgrade, per CLAUDE.md.)

`ts-node` was also incompatible with TS 7, but it was an unused, dead
devDependency and has been removed in this same upgrade rather than worked around.

Microsoft's recommended upgrade path is **5.9 → 6.0 → 7.0** (6.0 is the
transitional release that surfaces deprecations before the native cutover).

## Decision

Pin `typescript` to **`^5.9.x`** for now (bumped from 5.8 in this upgrade). Do
**not** adopt TypeScript 7 yet.

Revisit TS 7 adoption when **both** of the following hold:

1. TS 7.1 ships the replacement compiler/language-service API, and
2. `prettier-plugin-organize-imports` and `openapi-typescript` publish
   TS-7-compatible releases that target it.

## Consequences

- The SDK stays on the mature 5.x compiler; the build, tests, formatting, and
  type-generation pipeline all keep working exactly as before. No source changes
  are required to stay on 5.9.
- We forgo `tsgo`'s faster builds for now. Given the small size of this package,
  the current `tsc` build time is not a pain point, so the trade-off is
  comfortably in favour of a working devtool chain.
- Removing `ts-node` eliminates one TS-7 blocker preemptively and drops dead
  weight; nothing in the repo referenced it (scripts run via `node ./scripts/*.mjs`).

### TS 7.0 spike results (2026-07-11)

Measured by transiently installing `typescript@7.0.2` (`npm install --no-save`),
running each check, then restoring 5.9.3. The spike was not committed.

| Check           | Command                          | TS 5.9.3                | TS 7.0.2                                            |
| --------------- | -------------------------------- | ----------------------- | --------------------------------------------------- |
| Build           | `npx tsc`                        | pass                    | **pass** (exit 0)                                   |
| Tests           | `npx vitest run`                 | pass (415)              | **pass** (415, exit 0)                              |
| Format check    | `npm run check-format`           | pass, imports organized | exit 0, but **organize-imports silently disabled**¹ |
| Type generation | `npm run generate:custody-types` | pass                    | **broken** — same removed API²                      |

¹ The `check-format` command still exits `0` under TS 7.0, but
`prettier-plugin-organize-imports` no longer functions: it throws internally
(`ts.createLanguageService` is `undefined`) and its `try/catch` returns the code
unmodified. Verified directly — a file with an unused import and out-of-order
named imports was left untouched on 7.0. So the format toolchain is effectively
non-functional even though the command reports success.

² Not run during the spike (the repo does not regenerate types on upgrade, per
CLAUDE.md). Expected-broken: `openapi-typescript` requires `typescript@^5.x` and
relies on the same removed language-service API; npm reports the peer conflict on
a TS 7 install.

Bottom line: `tsc` and the test suite are already TS-7-ready, but the
formatting and type-generation devtools are not — and the format failure is
silent, which is the more dangerous mode. That, plus the pending TS 7.1 API,
makes deferral the safe call.
