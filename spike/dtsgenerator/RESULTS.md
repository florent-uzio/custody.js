# Spike: dtsgenerator 4.0.2 (ticket #318, map #314)

**Verdict: PASS (no `src/` codemod needed; generator-side workarounds required).**
With a generated adapter, `src/models/custody-types.ts` and `custody-internal-types.ts` export `paths` /
`operations` / `components` exactly as before, `npm run typecheck` and `npm test` pass with **zero `src/` changes**, and TS 7
(`tsc` 7.0.2) also passes. The raw tool does **not** work on the real specs out of the box (OOM, see risk 1), and
four generator-side workarounds are needed. Version tested: `dtsgenerator@4.0.2` (published 2026-11-14; 4.0.0 on 2026-11-08), exact-pinned.

## Numbers

| Item                                     | Result                                                                                                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version                                  | `dtsgenerator` 4.0.2 (nested `typescript` 6.0.3, provenance SLSA v1 present, 1 npm maintainer: horiuchi)                                                                                 |
| Raw run on merged public spec            | **OOM** (4 GB, 12 GB heap both exhausted); single spec >= 1.38.0 also OOMs                                                                                                               |
| Generation time                          | dtsGenerator 0.21 s (public) + 0.07 s (internal); whole script 1.1 s wall. Current `openapi-typescript` pipeline, same merged docs: 0.31 s                                               |
| Supply chain                             | `npm ls --all --parseable \| wc -l`: **313 -> 334 = +21 packages** (incl. dtsgenerator), +~24 MB (it nests its own TS 6.0.3). Repo `typescript` 5.9.3 untouched                          |
| Adapter (generated)                      | 1514 lines (public) + 730 lines (internal), emitted by `buildAdapter`/`emitOperation` (about 120 lines of generator code incl. MIME helpers). Zero hand-written per-type code            |
| Codemod of `src/`                        | not needed, and worse than the adapter (3343 `components[..][..]` + 212 `operations[..]` + 30 `paths[..]` refs, underscores dropped, `paths[...]` has no analogue)                       |
| `npm run typecheck` (TS 5.9.3)           | **148 errors** with dtsgenerator `interface`s as emitted; **0 errors** after the interface -> type-alias rewrite (workaround 4)                                                          |
| `npm test`                               | 859/859 tests, 41 files, `Type Errors: no errors` (incl. `exports.test-d.ts` text/csv narrowing)                                                                                         |
| `npm run build` (declaration emit, TS 7) | OK                                                                                                                                                                                       |
| TS 7.0.2                                 | generator runs (it uses its nested TS 6.0.3, unaffected by root TS); `tsc --noEmit` on `src/`: **0 errors**; semantic-diff file: same 83 mismatches as under TS 5.9.3; `npm test` passes |
| Semantic diff                            | **2685 items, 83 mismatches** (public 44/1911, internal 39/774), all explained by 5 root causes (below)                                                                                  |

### Semantic diff breakdown (Old = openapi-typescript 7.13.0 baseline, New = this spike; mutual assignability, one tsc error per item)

| Kind                              | Public items / mismatches | Internal items / mismatches |
| --------------------------------- | ------------------------- | --------------------------- |
| `components.schemas.*`            | 1174 / 28                 | 639 / 32                    |
| `parameters.path`                 | 165 / 0                   | 12 / 0                      |
| `parameters.query`                | 67 / 0                    | 10 / 0                      |
| `parameters.header`               | 5 / 0                     | -                           |
| request body (`application/json`) | 51 / 6                    | 21 / 2                      |
| request body optional/required    | 51 / 0                    | 21 / 0                      |
| each JSON response                | 398 / 10                  | 71 / 5                      |

Root causes (items can hit several; per-item detail in `out/explain.json`, `out/classification.json`):

| #   | Root cause                                                                                                                                                                                                                                                                                              | Items | Direction                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------- |
| 1   | **additionalProperties / free-form object**: old `Record<string, never>` / `{[x: string]: never}`, new `{[key: string]: any}` (e.g. `Core_v0_ExecuteExtension.payload`, `Compliance_PolicyResponse.approvalWorkflow`, `Export_*Metadata.filters`, `GasStation_AuditEventDto.payload`)                   | 63    | New is more permissive (`any`), arguably more truthful than `never`                                      |
| 2   | **allOf + `Omit<union,"type">`**: old collapses `Internal_TransactionDestination` minus `type` to `{}`; new keeps the Account/Address/Endpoint union (e.g. `Internal_SubstrateStakingMethod_*`, cascades into `Internal_TransactionOrder`, `Internal_Propose*`, `getExampleContextV0`, `intentContext`) | 28    | New is more precise                                                                                      |
| 3   | **allOf + outer `required` + discriminator**: old output is `{type:"EDS_WebhookChannelCreate"} & Omit<..., "type"> & {type?: "WEBHOOK"}`, which reduces to `never`; new is the plain flat object (`EDS_WebhookChannelCreate`, `createChannel` body)                                                     | 2     | New is correct, old was broken                                                                           |
| 4   | **schema `default` => required**: old (`defaultNonNullable`) makes `custodyStatus`/`ledgerStatus` required in `Export_MovementExportDto` and the movement-export request body; new keeps them optional (spec has them non-required with a `default`)                                                    | 2     | optional/required difference; any caller that reads these fields as non-undefined would now need a guard |
| 5   | **oneOf discriminator mapping**: `Internal_ApiTicker.ledgerDetails` (and the 2 internal schemas embedding it): old merges the variants into one member, new emits one member per mapping (Algorand, Bitcoin, ... XRPL)                                                                                  | 3     | New is more precise                                                                                      |
| -   | cascade only (deeper nesting below the diff depth cutoff)                                                                                                                                                                                                                                               | 2     | same causes                                                                                              |

Zero mismatches on: every `parameters.path/query/header`, every request-body optionality, all enum/nullable differences (no `nullable`/enum
regression found), required/optional on all but the 2 `default` items. No `any` leaks beyond the 14 free-form sites (old output has 8 `any`, in comments).
Not diff-checked (the assertion only compares `application/json`): non-JSON media types, which the adapter fills itself (see below).

## Reaching our shape: the generated adapter

`spike/dtsgenerator/generate.mjs` (inputs: copied `loadDocs`, the real `mergeOpenApiDocsBySurface`):

1. **sanitize** the merged doc (workarounds 1-3 below), then `dtsGenerator({contents:[parseSchema(doc)]})`.
2. Rewrite `declare namespace` to `export declare namespace` (so the file is a module; `import type { components } from ...` works) and `export interface X {` to `export type X = {` (workaround 4).
3. Emit, from the **original** merged doc: `components.schemas` (`"Core_Foo": Components.Schemas.CoreFoo`, underscores restored, with a collision assertion), `operations` (per `operationId`:
   `parameters.{query,header,path,cookie}` with the same optional/required rule as openapi-typescript, `requestBody`, `responses.<code>.{headers,content}`),
   and `paths` (each method refs `operations[...]`, or an inline operation for the 24 public + 4 internal operations without an `operationId`, as before).
   Names map through dtsgenerator's own `toTypeName`/`convertKeyToTypeName` (deep import of `dtsgenerator/dist/core/validateIdentifier.js`, plus a 5-line reimplementation of the non-exported `convertKeyToTypeName`).
   Non-JSON media types: `text/*` with `type: string` -> `string`, `$ref` -> component, no-schema/unknown -> `unknown`.

Why not a plugin: dtsgenerator's `preProcess` hook sees schemas after ids are fixed, and `postProcess` is a TS transformer on already-mangled identifiers, so restoring `Core_X` there is no simpler. No built-in name-mapping option exists
(`@dtsgenerator/replace-namespace`/`decorate-typename` do not restore underscores). Result: namespaces stay mangled (`Components.Schemas.CoreFoo`), the adapter provides the exact old keys. Name uniqueness holds for `components.schemas` (1174/1174 public, 639/639 internal).

## Required workarounds (all in generate.mjs)

1. **Strip `minItems`/`maxItems`** (OOM fix). dtsgenerator expands them into tuple types; the specs have `maxItems: 2147483647` (15 occurrences across the bundled spec files; first in 1.38.0, `Omnibus_SweepThresholdConflictResponse.conflicts`), plus `1000`, `100` and `50`. Bisected: removing only that schema fixes the OOM. Keeping `minItems: 1` after dropping `maxItems` yields `[T, ...T[]]` tuples and **2 typecheck errors** in `src/services/xrpl/xrpl.builders.ts` / `xrpl.adapters.ts` (`CoreBatchEntry[]` not assignable to the tuple), so both are stripped (matches the old `T[]`). A plugin-free `--keep-min-items` flag exists to reproduce.
2. **Keep only the JSON media type** when a body/response has JSON plus others: dtsgenerator merges all valid media types' schemas into one type per response (would corrupt `exports` text/csv vs JSON). Adapter re-adds the other keys from the original doc.
3. **Rename colliding operationIds**: `getPolicy` (core) and `GetPolicy` (compliance) both become `Paths.GetPolicy`, and dtsgenerator _silently merges_ the two namespaces (wrong `PathParameters`: we saw `getPolicy` get `policyType`/`transactionType`). Detected in the first semantic diff; the generator now asserts and renames. This is a silent-failure class (also paths without `operationId` map to `Paths.<MangledPath>.<Method>`).
4. **`interface` -> `type`**: dtsgenerator emits `export interface` (1253 in public); interfaces lack an implicit index signature, so 147 call sites passing `PathParameters`/`QueryParameters` to `Record<string, unknown>` params fail (TS2345) plus 1 TS2352. A one-line regex rewrite to type aliases fixes all (no `extends` is ever emitted).

First ~20 of the 148 pre-fix errors (all identical): `TS2345 Argument of type 'PathParameters' is not assignable to parameter of type 'Record<string, unknown>' (Index signature for type 'string' is missing)` in `src/namespaces/accounts.ts` (22), `sponsors.ts` (17), `omnibus/*` (20), `channels.ts` (9), `virtual-ledgers/*` (14), `user-invitations.ts` (8), `transactions.ts` (7), ... (full list: `out/typecheck-errors-interfaces.txt`). An earlier adapter bug (97 `TS2694 ... has no exported member '$400'`) came from responses/media types without a schema; fixed in the adapter, not a tool limitation.

## Risks (top ones first)

1. **Maturity / stability of the fresh 4.0 line**: 4.0.0 on 2026-11-08, 4.0.2 six days later, after 2 years with no release; single maintainer; and it falls over (OOM, unbounded) on a valid, common springdoc pattern (`maxItems: 2147483647`) with no guard. A future Custody spec with a big `maxItems` is neutralised only by our strip step; other unforeseen expansion bugs are possible. Needs exact pin + the generator's own smoke check (we run the semantic diff).
2. **Reliance on internals and silent merges**: name mangling (`toTypeName`, non-exported `convertKeyToTypeName`) is reached by deep import; collisions in `Paths.*` namespaces (operationIds differing only by case/underscore, or path-derived names) merge silently instead of failing. The generator must keep its collision assertions; renamed operationIds are an invisible deviation.
3. **Fidelity gaps by design**: one type per response (no per-media-type types; adapter patches the 1 text/csv + JSON case by rule), free-form objects become `{[k]: any}` (loosening vs old `never`), `default` no longer forces required (2 spots), output is ambient namespaces + adapter (about 2.2k generated lines on top of 550 KB of namespaced types; adds a second naming layer for debugging).

Smaller notes: output is CJS default-export interop (`mod.default`); ESM `import dtsGenerator from` yields a non-function. `lint-staged` (`oxlint --type-aware` on staged `src/**/*.ts`) fails with "No files found to lint" when only the generated (ignored) `src/models` files are staged, so the generated outputs are committed as copies under `spike/dtsgenerator/generated/` (oxfmt-formatted by the hook) rather than in `src/models/`; run `node spike/dtsgenerator/generate.mjs` to regenerate them in place (the 1.1 s run is deterministic).

## Reproduce

```
npm ci
node spike/dtsgenerator/generate.mjs            # writes src/models/custody{,-internal}-types.ts
npm run typecheck && npm test
node spike/dtsgenerator/semantic-diff-gen.mjs && npx tsc -p spike/dtsgenerator/tsconfig.json > spike/dtsgenerator/out/semantic-diff-tsc.txt
node spike/dtsgenerator/semantic-diff-report.mjs && node spike/dtsgenerator/explain.mjs && node spike/dtsgenerator/classify.mjs
```

Files: `generate.mjs` (generator + adapter), `load-docs.mjs` (copied), `semantic-diff-gen.mjs` -> `semantic-diff.{public,internal}.ts` (+ `.manifest.json`; one assertion per line, two files instead of one because there are two surfaces),
`explain.mjs`/`classify.mjs` (TS-checker structural diff and root-cause bucketing), `bisect*.mjs` (OOM bisect), `baseline/` (old outputs), `generated/` (new outputs), `out/` (raw tsc/analysis output).
TS 7: `npm i -D typescript@7.0.2` (top-level `typescript` is 7.0.2 on npm `latest`); restored to `^5.9.3` afterwards.
