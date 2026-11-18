# Maintained OpenAPI 3.0 to TypeScript type generators

Research for issue #315, under map #314. Date of research: 2026-11-18.

Question: which maintained libraries generate TypeScript **types** from OpenAPI 3.0.x and fit our ranked criteria? The criteria are (1) supply-chain posture, (2) can emit the `paths` / `operations` / `components` shape or one a mechanical codemod reaches, (3) a programmatic API that takes an in-memory document, (4) output and tool compatible with TypeScript 7 native (`tsgo`). Extras (clients, zod) are worth nothing. Owned options (vendoring or writing a generator) are covered by #316 and not evaluated here.

## Method and sources

- npm registry metadata: `npm view <pkg> --json` (versions, `time`, maintainers, dependencies, `dist.attestations`). Transitive package counts come from `npm install --package-lock-only` of each candidate alone.
- GitHub API (`gh api`): releases, commits, contributors, issues.
- Hands-on runs of each candidate in a scratch directory outside the repo, against a small OpenAPI 3.0.3 spec covering `operationId`, path/query params, request body, `$ref`, `allOf`, `oneOf`, `nullable`, `additionalProperties`, enum, and prefixed schema names (`Core_Thing`). Emitted output below is real output from these runs. Versions: TypeScript 7.0.2 and 6.0.3, Node 26.
- Nothing was added to this repo's `package.json`.

## Context facts

- `openapi-typescript` 7.13.0 (published 2026-02-11) is the last release. Maintenance mode was announced on 2026-09-19 in openapi-ts/openapi-typescript#2874: no more updates, security patches included, and it will not be handed off to a new maintainer (explicitly because of supply-chain attacks). The repo is not archived; its last push was 2026-09-25, and PRs opened since (2026-10 and 2026-11) show no maintainer activity in the issue list.
- No community fork or successor was found. Checked: GitHub fork list (the starred forks are all 2020-2024 snapshots), `npm search openapi-typescript` (only clients and helpers built on it), all comments in #2874. The one forward-looking comment (marcomuser) suggests a hey-api plugin that carries the philosophy forward, but only as a wish, with no repo or package.
- TypeScript 7 (`typescript@7.0.2`, latest) is the native port. `require("typescript")` no longer exposes the compiler API: no `ts.factory`, no `ts.SyntaxKind`. Verified: the module has 4 exports and `factory` is `undefined`. Any generator that builds output with the TS compiler API breaks if TS 7 is the top-level `typescript` of the project. `openapi-typescript` 7.13.0 fails exactly this way (`ts.factory.createKeywordTypeNode` on `undefined`; its peer range is `typescript ^5.x`).
- Our consumption today (outside the two generated files): 223 `operations["..."]` refs, 168 `components["schemas"][...]` refs, 30 `paths["..."]` refs. Generated files use `Core_*` / `Internal_*` prefixed schema names and an `operations` map keyed by `operationId`.

Current shape, for reference (`src/models/custody-types.ts`):

```ts
paths: { "/v1/.../accounts/{accountId}": { get: operations["getAccount"] } }
operations: { getAccount: { parameters: { path: { domainId: string, accountId: string }, query?: never },
  requestBody?: never, responses: { 200: { content: { "application/json": components["schemas"]["Core_ApiAccount"] } } } } }
```

## Candidate summary

| Candidate                                                  | Version / last release                        | Direct / transitive deps    | npm provenance | Maintainers (npm) | Output shape vs ours                                                                                                 | In-memory document                                | TS 7                                          |
| ---------------------------------------------------------- | --------------------------------------------- | --------------------------- | -------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| `@hey-api/openapi-ts`                                      | 0.99.0 (2026-06-22); `next` canary 2026-09-30 | 10 / 51                     | yes            | 1 (mrlubos)       | flat types; per-operation `XData` / `XResponses`; schema names keep `Core_` with `case: "preserve"`                  | yes (`input` accepts an object)                   | stable 0.99.0 breaks; `next` works (verified) |
| `@kubb/plugin-ts` (+ core, adapter-oas, parser-ts, `kubb`) | 5.5.6 / core 5.21.2 (2026-11-18, near-daily)  | 3 (plugin) / 111 (full set) | yes            | 1 (stijnvanhulle) | one file per type and per operation; `XOptions`, `XPath`, `XStatus200`; names pascal-cased, resolver is customisable | yes (`Input = string \| Record<string, unknown>`) | works (verified, parser is not TS-based)      |
| `dtsgenerator`                                             | 4.0.2 (2026-11-14); 4.0.0 only on 2026-11-08  | 9 / 25                      | yes            | 1 (horiuchi)      | `Components.Schemas.X`, `Paths.OpId.Parameters/Responses` namespaces; names pascal-cased                             | yes (`dtsGenerator({ contents: [schema] })`)      | works (verified; bundles its own TS 6.0.3)    |
| `swagger-typescript-api`                                   | 13.14.0 (2026-11-09)                          | 17 / 95                     | yes            | 2                 | schemas only with `--no-client`; runtime `enum`; names pascal-cased; operation types live inside a client class      | yes (`spec` option)                               | works (bundles TS ^6)                         |
| `orval`                                                    | 8.48.0 (2026-11-14)                           | 26 / 116                    | no             | 2                 | client-coupled; operation types are `XParams` / `XResponse200`; model files per schema                               | yes (`input.target` object)                       | ran under TS 7                                |
| `oazapfts`                                                 | 7.5.0 (2026-03-20)                            | 6 / 21                      | yes            | 3                 | client functions with inline anonymous types; no named operation types                                               | yes (`generateSource`)                            | works (bundles its own TS)                    |
| `@openapitools/openapi-generator-cli`                      | 2.42.2 (2026-11-11)                           | 17 / n/a                    | no             | 3                 | generates classes and client; needs a JRE and downloads the generator jar                                            | no (CLI and jar)                                  | n/a                                           |

Notes on the summary table:

- "Transitive" counts are packages in a lockfile for that candidate alone, `--legacy-peer-deps`. For reference, `openapi-typescript` 7.13.0 is 6 direct / 32 transitive.
- Provenance means `dist.attestations` with a SLSA predicate is present on the latest version in the registry.
- `orval` and `oazapfts` both ran under a top-level `typescript@7.0.2`; I did not inspect what `orval` imports from `typescript`, which is moot because it is out on shape.
- In-memory API claims for `swagger-typescript-api`, `orval` and `oazapfts` come from their documented APIs and were not run programmatically. They are not shortlisted, so this does not affect the conclusion. The in-memory claims for hey-api, Kubb and dtsgenerator were checked in type definitions and (hey-api, Kubb) by running.

## Candidate detail

### @hey-api/openapi-ts

- **Supply chain.** 10 direct deps, 51 transitive, provenance present, MIT. Single npm maintainer. Release history: weekly stable releases through 2026-06-22 (0.99.0), then only canaries. Default branch: last commit 2026-09-30 (js-yaml bump); the monorepo had 2453 commits from the lead. In issue #4235 a user notes that PRs are locked and there have been no commits to main for weeks, and asks about the single-maintainer bus factor; no maintainer answer found as of 2026-10-26. Security: GHSA-hhx9-57xq-r5rw (medium, `< 0.97.3`) concerns the generated client's `buildClientParams` template, not type output, so it is irrelevant to a types-only use. The project has an optional funding prompt and a hosted registry (`api_key`, `get.heyapi.dev`); neither is needed for local files.
- **Shape (verified).** With `@hey-api/typescript` and `case: "preserve"`, schema names stay as `Core_Thing`:

  ```ts
  export type Core_Thing = Core_Base & {
    kind: Core_Kind
    note?: string | null
    meta?: { [key: string]: string }
  }
  export type GetThingData = {
    body?: never
    path: { id: string }
    query?: { limit?: number }
    url: "/v1/things/{id}"
  }
  export type GetThingResponses = { /** ok */ 200: Core_Thing }
  export type GetThingResponse = GetThingResponses[keyof GetThingResponses]
  ```

  Not 1:1 with `openapi-typescript`, but a mechanical codemod reaches it: `components["schemas"]["Core_X"]` becomes `Core_X`; `operations["getThing"]["parameters"]["path"]` becomes `GetThingData["path"]`; the request body becomes `GetThingData["body"]`; `responses[200]["content"]["application/json"]` becomes `GetThingResponses[200]`. Identifiers are PascalCase of `operationId` (collision risk to check on real specs, hence separate public and internal outputs). The `paths[...]` lookups (30 refs, operationId-less endpoints) have no direct equivalent: it derives an id from method and path, which would need mapping.

- **Programmatic API (verified).** `createClient({ input: <parsed object>, output: { path }, plugins: [...] })`; the `input` type is `ApiRegistryShorthands | string | Record<string, unknown>`. The merge pipeline in `generate.mjs` survives. Output is written to disk, not returned as a string, so `astToString` is replaced by a file write plus a header.
- **TS 7.** Stable 0.99.0 fails at import when TS 7 is the top-level `typescript` (open issue hey-api#4235, 23 comments; peer range `>=5.5.3 || >=6.0.0`). The `next` tag `0.0.0-next-20260930190945` runs under `typescript@7.0.2` (verified here, and confirmed by users in the issue), but it is a canary with no semver, and Renovate treats it as inside the advisory range. Generated output compiled under TS 7 `tsc` with zero errors.

### @kubb (plugin-ts, core, adapter-oas, parser-ts)

- **Supply chain.** `@kubb/plugin-ts` has 3 direct deps; a working setup (`kubb` meta package, core, adapter-oas, parser-ts, plugin-ts) is 111 packages including a keyring native module via `@kubb/cli`, MCP and studio packages via the `kubb` meta package. Provenance present on all `@kubb/*` packages checked. Single npm maintainer; commits are dominated by the lead (5710), with an AI agent and bots next (1009, 756, 609). Cadence is extreme: 5.21.0, 5.21.1, 5.21.2 on three consecutive days, 964 versions of plugin-ts, canaries every few minutes. That is large exposure for a dependency used once at build time, and pinning is the only mitigation.
- **Shape (verified).** One file per type under `types/`; enums become a runtime `const` unless configured; names pascal-cased:

  ```ts
  export type CoreThing = CoreBase & {
    kind: CoreKindKey
    note?: string | null
    meta?: { [key: string]: string }
  }
  export type GetThingOptions = {
    body?: never
    path: GetThingPath
    query?: GetThingQuery
    headers?: never
  }
  export type GetThingResponses = { "200": GetThingStatus200 }
  ```

  The resolver (`ResolverTs`) is a documented extension point for naming, so `Core_` names are probably preservable; I did not test that. In my minimal config the cross-file imports were not emitted for the plain `types/*.ts` files, so a real setup needs more configuration (not investigated). Much more bespoke than hey-api to reach our shape.

- **Programmatic API (verified).** `Config.input: string | Record<string, unknown>`, plus `createKubb` with `AbortSignal` in `@kubb/core`. Note that `defineConfig` is exported from the `kubb` meta package, not `@kubb/core`.
- **TS 7 (verified).** Ran to completion with `typescript@7.0.2` installed. It parses with `yuku-parser` (native, own AST), not the TS compiler API. The peer on `@typescript/typescript6` is an optional compatibility alias.

### dtsgenerator

- **Supply chain.** 9 direct deps, 25 transitive: the smallest tree after `oazapfts`. Provenance present. Single maintainer (horiuchi), 939 commits since 2014, i.e. a decade of history. But 4.0.0 (2026-11-08), 4.0.1 and 4.0.2 landed within a week after 2 years without a release since 3.19.2 (2024-06-11): a fresh major, not yet seasoned. Bundles `typescript ^6.0.3` as a direct dependency.
- **Shape (verified).** Ambient namespaces, not `paths`/`operations`:

  ```ts
  declare namespace Components {
    namespace Schemas {
      export interface CoreThing {
        id: string
        kind: CoreKind
        note?: string | null
        meta?: { [name: string]: string }
      }
    }
  }
  declare namespace Paths {
    namespace GetThing {
      export interface PathParameters {
        id: Parameters.Id
      }
      export interface QueryParameters {
        limit?: Parameters.Limit
      }
      namespace Responses {
        export type $200 = Components.Schemas.CoreThing
      }
    }
  }
  ```

  Mechanical codemod: `components["schemas"]["Core_X"]` becomes `Components.Schemas.CoreX` (underscore dropped: a collision-check item); `operations["getThing"]["parameters"]["path"]` becomes `Paths.GetThing.PathParameters`; `responses[200]...` becomes `Paths.GetThing.Responses.$200`; `requestBody` becomes `Paths.GetThing.RequestBody`. `allOf` is flattened into one interface. Path-template keyed lookups (`paths["/v1/..."]`) are not provided. Output is ambient (`declare namespace`), so the file would need `export` wrapping or `import type` friendly rewriting to fit our module-style imports.

- **Programmatic API (verified in d.ts).** `dtsGenerator({ contents: [schemaObject], config })` returns a string, the closest analogue to `openapiTS` + `astToString`.
- **TS 7 (verified).** Ran under top-level `typescript@7.0.2` because its own TS 6.0.3 is nested. Output compiled under TS 7 `tsc` cleanly.

### swagger-typescript-api

17 direct / 95 transitive deps (bundles `@biomejs/wasm-nodejs`, `swagger2openapi`, `@apidevtools/swagger-parser`), provenance present, 2 maintainers, active (13.14.0 on 2026-11-09). With `--no-client` it only emitted schemas, as pascal-cased names with a runtime `enum` (`export enum CoreKind`), which changes semantics for string-literal enum consumers. Operation types are only produced inside the client template, not as named per-operation types. Heavier than the shortlist on deps and further from the shape. Not shortlisted.

### orval

26 direct / 116 transitive, no npm provenance, 2 maintainers, very active (8.48.0 on 2026-11-14). It is client-first: the run emitted a generated fetch client (`api.ts` with headers helpers, URL builders) plus per-schema model files and per-operation `XParams` / `XResponse200` types. Types-only is not a supported mode, and the client output is worth nothing here. Not shortlisted.

### oazapfts

6 direct / 21 transitive, provenance present, 3 maintainers, but the latest release is 2026-03-20 (8 months ago). It emits client functions with response types inlined (`oazapfts.fetchJson<{ status: 200; data: CoreThing }>`), with no named per-operation request/response types. Not reachable by a mechanical codemod. Not shortlisted.

### @openapitools/openapi-generator-cli

An npm wrapper that downloads the Java generator jar at runtime and needs a JRE; no npm provenance; 17 direct deps including NestJS packages. Only a CLI, no in-memory API. The `typescript` generators emit class-based clients. Rejected on criteria 1 and 3.

### Other tools seen

`openapi-zod-client` (last release 2025-02-10, zod output, out of scope) and `@ts-rest/open-api` (the reverse direction: contract to spec). Not candidates.

## Scoring against the ranked criteria

Legend: strong / ok / weak.

| Candidate                | (1) Supply chain                                                                                                                | (2) Shape                                                                      | (3) In-memory API | (4) TS 7                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------- | ---------------------------- |
| `@hey-api/openapi-ts`    | weak (single maintainer, project stalled since 2026-09-30, locked PRs, no stable release since June) but 51 deps and provenance | ok (codemod reaches `components` and `operations`; `paths[...]` needs mapping) | strong            | weak on stable, ok on `next` |
| `@kubb/*`                | weak to ok (provenance, but 111 deps, single maintainer, near-daily releases)                                                   | weak (per-file output, needs resolver config)                                  | strong            | strong                       |
| `dtsgenerator`           | ok (25 deps, provenance, long-lived single maintainer, but a one-week-old 4.0)                                                  | ok (namespace shape; codemod reaches `components` and `operations`)            | strong            | strong                       |
| `swagger-typescript-api` | ok (95 deps)                                                                                                                    | weak (runtime enums, client-coupled operation types)                           | strong            | strong                       |
| `orval`                  | weak (116 deps, no provenance)                                                                                                  | weak (client-coupled)                                                          | strong            | ran under TS 7               |
| `oazapfts`               | ok (21 deps, but stale 8 months)                                                                                                | weak (anonymous inline types)                                                  | strong            | strong                       |
| `openapi-generator-cli`  | weak (jar download, no provenance)                                                                                              | weak                                                                           | none              | n/a                          |

## Shortlist to spike (at most 3)

1. **`@hey-api/openapi-ts`.** Closest to our shape: `case: "preserve"` keeps `Core_*` names and per-operation `XData` / `XResponses` types make the `operations[...]` codemod mechanical (223 refs). In-memory input works. The risk to spike for is supply chain: single maintainer, stalled since 2026-09-30, and TS 7 works only on the `next` canary (stable 0.99.0 fails). Spike against `0.99.0` with the TS 6 alias and against `next` with TS 7, and decide whether to pin a canary.
2. **`dtsgenerator` 4.x.** Smallest dependency tree (25 packages), provenance, decade-old project, TS 7 safe because it bundles TS 6, and the only candidate whose string-returning API mirrors `openapiTS` + `astToString`. Output is ambient namespaces (`Paths.GetThing.Responses.$200`) and drops underscores, so the spike must check name collisions across the merged public and internal specs, how to turn ambient output into an importable module, and whether the fresh 4.0 line is stable on our large specs.
3. **`@kubb/plugin-ts` (with `@kubb/adapter-oas` and `@kubb/parser-ts`).** The only candidate with a verified stable release that is both in-memory capable and TS 7 independent today, with provenance on every package. The spike must answer whether a custom `resolver` can emit one file with `Core_*` names and an operation-keyed shape, and whether its 111-package tree and release churn are acceptable behind a strict pin. It is the fallback if hey-api's TS 7 situation does not resolve.

Not shortlisted: `swagger-typescript-api`, `orval`, `oazapfts`, `openapi-generator-cli`, for the reasons above.

## Caveats

- All shape and TS 7 observations come from a small synthetic spec, not the real merged Custody specs (the acceptance bar needs a full semantic diff of `nullable`, `oneOf`/`allOf`, `additionalProperties`, required/optional on those). That is what the spikes must do.
- `swagger-typescript-api` and `orval` were run through their CLIs with default options; non-default options might change what they emit.
- Maintainer and activity facts are as of 2026-11-18 and can change quickly; hey-api's status in particular is unresolved.
