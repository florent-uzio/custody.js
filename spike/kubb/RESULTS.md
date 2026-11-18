# Spike: Kubb (`@kubb/core` + `adapter-oas` + `plugin-ts` + `parser-ts`)

Ticket #318, map #314. Branch `research/spike-kubb`. Nothing here is merged.

## Verdict: PASS (no `src/` codemod; a generated adapter)

- `npm run typecheck`: **0 errors**, `npm test`: **859/859 passed** (incl. type tests), `npm run build` (declaration emit) passes. No file under `src/` was edited. Only the two generated files in `src/models/` changed.
- The old `paths` / `operations` / `components` shape is reproduced by a **generated adapter** appended to Kubb's output.
- Semantic diff: **83 mismatches of 3055 checks** (2.7%), all explained by 5 root causes below. Four of the five (empty object, `allOf` over `oneOf`, `default`, and one derived) are cases where openapi-typescript was lossy or stricter; none broke the typecheck or any test. Nothing found in the required/optional, enum, `nullable` or `additionalProperties` classes beyond those root causes.
- TS 7 (`typescript@7.0.2`): generator runs, output byte-identical, `tsc --noEmit` 0 errors (0.6 s), tests pass, `npm run build` passes.
- Main cost is supply chain and churn (see risks), not output quality.

## Versions (exact, pinned in package.json)

| Package             | Version                                                 |
| ------------------- | ------------------------------------------------------- |
| `@kubb/core`        | 5.21.2                                                  |
| `@kubb/adapter-oas` | 5.21.2                                                  |
| `@kubb/plugin-ts`   | 5.5.6                                                   |
| `@kubb/parser-ts`   | 5.21.2 (peer of plugin-ts, required for the printer)    |
| TypeScript (repo)   | 5.9.3 (restored); TS 7 tested with 7.0.2 (npm `latest`) |
| Node                | 26.13.0                                                 |

Note: Kubb 5 no longer has `@kubb/plugin-oas`; the OpenAPI front end is `@kubb/adapter-oas`. The `kubb` meta package (111 packages: CLI, MCP, studio, keyring) is **not** needed for the programmatic API: `defineConfig` is the only thing it provides that we would miss, and we pass `parsers: [parserTs()]` ourselves.

## Numbers

| Metric                                    | Result                                                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Generate (both surfaces, in-memory input) | 1.5 s total (public ~0.5-0.7 s, internal ~0.7 s); old openapi-typescript script 1.1 s                    |
| Typecheck (`npm run typecheck`)           | 0 errors (baseline also 0)                                                                               |
| Tests                                     | 41 files / 859 tests pass                                                                                |
| TS 7 `tsc --noEmit`                       | 0 errors, 0.63 s                                                                                         |
| Adapter: generator code                   | ~125 LOC (`buildAdapter` in `generate.mjs`; whole script 303 LOC incl. copied `loadDocs`)                |
| Adapter: emitted code                     | public 3234 lines, internal 1172 lines of `paths` / `operations` / `components` (generated, not written) |
| Output size                               | public 34.6k lines (was 23.8k), internal 11.3k lines (was 7.7k): the Kubb types plus the adapter         |
| Adapter gaps (items it could not name)    | 0 unresolved on both surfaces                                                                            |
| `npm ls --all --parseable` lines          | 313 before, 348 after (+35 on this platform)                                                             |
| package-lock entries added                | 47 (12 are optional per-platform `@yuku-core/binding-*` native binaries, 1 installed here)               |
| Kubb diagnostics                          | 2 warnings per surface (`format: did`, a regex used as `format`), falls back to base type                |
| Semantic diff items                       | 3055 (public 2215, internal 840)                                                                         |
| Semantic mismatches                       | 83 (public 44, internal 39); 60 schema-level, 23 derived request/response items                          |

Items per kind (public / internal): schemas 1174 / 639, path params 165 / 12, query params 67 / 10, header params 5 / 0, request body JSON 50 / 21, JSON responses 398 / 71, plus structure checks (key sets of `paths`, `operations`, `components.schemas`; which methods exist per path; response status-code sets per operation): 356 / 87, all of which match.

## How it was done

`spike/kubb/generate.mjs`:

1. Copies `loadDocs`, imports `mergeOpenApiDocsBySurface` unchanged.
2. `createKubb({ input: <merged doc object>, adapter: adapterOas(), parsers: [parserTs()], storage: memoryStorage(), plugins: [pluginTs(...)] }).safeBuild()`. In-memory input works; nothing is written by Kubb.
3. `pluginTs` options that matter:
   - `output: { path: "types.ts" }`: a file extension switches Kubb to **single-file output** (no barrels, no per-type files). No custom bundler was needed.
   - `resolver.name`: Kubb passes operation-derived names with a space (`getAccount Path`) and schema names verbatim. Names with a space go through `resolverTs.name` (PascalCase), schema names are kept (`Core_Account` survives); any non-identifier char becomes `_`.
   - `enum: { type: "literal" }`: plain string-literal unions, no runtime `const`.
   - `printer: { nodes: { bigint: () => "number" } }`: Kubb maps `format: int64` to `bigint`, openapi-typescript to `number` (48 properties).
4. Post-process: strip the banner and **un-export** the per-type declarations (see "Findings"), then append the generated adapter.
5. The adapter is built from the merged doc plus Kubb's `FileNode.sources[]` (`{ name, pointer }`), i.e. a JSON-pointer -> emitted-name table (`#/paths/<path>/<method>/responses/200`, `.../parameters`, `.../requestBody`, `#/components/schemas/<name>`). Looking names up by pointer avoids guessing Kubb's naming (it disambiguates collisions such as `GetPolicyPath2`).

Emitted shape (same as before): `paths` (each path with `parameters` stub and the 8 methods, `operations["id"]` or an inline object for the 28 operations that have no `operationId`), `webhooks`, `components` (`schemas: { "Core_X": Core_X }` plus the `never` sections), `$defs`, `operations`.

### Adapter vs codemod

The adapter is preferable here. A codemod to Kubb's natural output would rewrite 3,345 `components["schemas"]["X"]` references (mechanical: regex to bare `X` plus an import) and the ~190 `operations[...]` accesses to Kubb's `XPath` / `XQuery` / `XBody` / `XStatus200` names (also mechanical, but Kubb's names are PascalCased and numerically de-duplicated, so the mapping needs the pointer table anyway). It would also require exporting every type from the module, which immediately collides: `src/models/index.ts` does `export *` from both `custody-error.ts` and `custody-types.ts`, and `Core_ErrorMessage` exists in both (the only error on the first typecheck, 1 total). The adapter keeps `CLAUDE.md`'s mandated shape, so no codemod is needed. A codemod only makes sense if we later want to drop the `components["schemas"][...]` indirection.

## Typecheck and tests

First attempt (everything exported): 1 error, `src/models/index.ts(2,1): TS2308 Module "./custody-error.js" has already exported a member named 'Core_ErrorMessage'`. Category: namespace collision from `export *`. Fix: the generator un-exports the Kubb declarations, so the module's public surface is exactly `paths | webhooks | components | $defs | operations`, as before. Result: 0 errors.

Also fixed in the adapter before the final run (found through the tests, not typecheck): `text/csv` responses were emitted as `unknown`, which failed 3 type tests in `exports.test-d.ts`. The adapter now takes Kubb's per-media-type name, else the referenced component, else `string` for string schemas. 10 internal responses (binary, `*/*`) still map to `unknown`; no test or `src/` file reads them.

Kubb types an optional request body as `X | undefined`; the adapter wraps request bodies in `Exclude<..., undefined>` because `requestBody?:` already carries that (this removed 13 false semantic mismatches).

## Semantic diff (`semantic-diff-{public,internal}.ts`, categorised in `mismatches-*.json`)

Mutual assignability per item (`Eq<Old, New>`), one tsc error per mismatch, generated by `gen-semantic-diff.mjs`; categorised by `classify-mismatches.mjs` (walks Old/New with the TS checker). The 83 mismatches (the per-row counts are approximate, from a rough bucketing of the classifier output) collapse to these root causes:

| #   | Root cause                                                                                       | Count (public / internal, all items) | Old (openapi-typescript)                                                             | New (Kubb)                          | Which is right                                                                                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Object schema with no `properties` / `additionalProperties`                                      | 38 / 11                              | `Record<string, never>`                                                              | `object`                            | Spec says "any object". `object` is the looser, more honest type. e.g. `Core_v0_ExecuteExtension.payload`, `Core_IntentDetails.payload` (via the 51-member payload union), `Compliance_PolicyResponse.approvalWorkflow`, `Compliance_DomainPayloadRequest.permissions`, `GasStation_SponsorableDomainDto.parentId`, `Export_*.filters`, `Notification_*.entity` |
| 2   | `allOf: [ { oneOf } ]` (and `WithRequired` over a oneOf), plus schemas that merely contain these | 2 / 26 (incl. containers)            | `Omit<Union, "type">`, which collapses the union to its common properties (1 object) | the union is kept (3 to 11 members) | Kubb. e.g. `Internal_ApiTicker.ledgerDetails` (1 vs 11), `*.destination` (1 vs 3), `*.controller` (1 vs 3), `EDS_WebhookChannelCreate` (extra `id`, `name`, ... because old dropped them)                                                                                                                                                                       |
| 3   | `default` on a required property                                                                 | 2 / 0                                | `defaultNonNullable` makes it required                                               | optional                            | Kubb for requests; old for responses. `Export_MovementExportDto.custodyStatus` and `.ledgerStatus`                                                                                                                                                                                                                                                              |
| 4   | Derived: `oneOf` that contains a type from #1 or #2                                              | 2 / 2                                | n/a                                                                                  | n/a                                 | `Core_IntentBody`, `Internal_EvaluationContext.request`                                                                                                                                                                                                                                                                                                         |

No mismatches were found in: optional/required (other than #3), enums (all `enum` / `literal` sets equal), `nullable`, discriminated `oneOf` members (all 51 `Core_UserIntentPayload` members pair up by `type` and match), or non-trivial `additionalProperties` (typed maps are equal). Structure checks (key sets, methods per path, response status codes per operation) all match.

Caveat on the classifier: `Eq` is exact; the per-reason classification is a heuristic over checker types, spot-checked by reading the spec and both outputs for 6 schemas (`Core_IntentAuthor`, `EDS_WebhookChannelCreate`, `GasStation_SponsorableDomainDto`, `Export_MovementExportDto`, `Internal_ApiTicker`, `Internal_EvaluationContextReferences`). The internal `Internal_EvaluationContextReferences.*` and `Internal_Map_TransactionOrder` mismatches are counted under #2 (the classifier flags their index signatures; the real difference underneath is the `Omit<Union>` in the transaction-order schemas), inferred rather than individually proven.

Not covered (by the brief's design): JSDoc content, formats (`format: uuid` is only a JSDoc note in both), non-JSON media types, `readOnly` / `writeOnly`, security schemes.

Cosmetic differences: Kubb's JSDoc is noisier (`@type string`, `@minLength`, `@description Format: \`uuid\``); descriptions on responses (`/** @description ... */`) are not emitted by the adapter. Outputs are 45% longer.

## TS 7

`npm i -D typescript@7.0.2 --legacy-peer-deps` (openapi-typescript's peer is `^5`, hence the flag; irrelevant once it is removed).

- (a) Generator: runs, **output byte-identical** to the TS 5.9.3 run. Kubb parses with `yuku-parser` (native), not the TS compiler API, so it is TS-version independent.
- (b) `tsc --noEmit` 0 errors (0.63 s); `npm test` 859/859; `npm run build` OK. The semantic-diff and classifier steps were run on TS 5.9.3.
- TS restored to `^5.9.3` afterwards (package.json / lock contain only the four `@kubb/*` additions).

## Risks

1. **Supply chain and churn.** 47 new lockfile entries (35 installed on macOS), including `@readme/openapi-parser`, `ajv`, `undici`, `js-yaml@5` (nested next to our `js-yaml`), `@scalar/*`, and per-platform native binaries (`@yuku-core/binding-*`) with a native code parser. One maintainer, releases on consecutive days (core 5.21.0/1/2), `@kubb/*` packages versioned separately (core 5.21.2 vs plugin-ts 5.5.6), 5.x majors move fast. Needs exact pins plus a deliberate upgrade routine, and ideally a CI check that regenerating from the pinned version is a no-op.
2. **We depend on a non-obvious API surface.** The adapter relies on `FileNode.sources[].pointer` and Kubb's resolver receiving space-separated names for operation types; the resolver naming contract (`resolver.name` called with raw names) is only partly documented. `safeBuild()` does not set `success`; failures must be read from `diagnostics`. A Kubb minor could change generated names (the adapter looks names up by pointer, so it is resilient to that, but not to the pointer format).
3. **Behavioural drift versus openapi-typescript.** Root causes #1-#3 change types seen by SDK consumers (`object` instead of `Record<string, never>`; real unions instead of `Omit<Union>`). Typecheck and tests do not notice, so consumer-visible changes need a changeset and a note. Also `int64` -> `number` needs the printer override above, and `format: did` / regex-as-format fall back silently (2 warnings).

Smaller points: output is 45% larger (JSDoc noise); the schema name `X-191` is sanitised to `X_191` for the type alias, with `components["schemas"]["..-191"]` still keyed by the spec name; Kubb synthesises extra types (`CoreAccountAddressDataScopeEnum`, `*_ExtendedPublicKey` members) that are internal to the module and invisible after the un-export.

## Reproduce

The generated `src/models/*.ts` are **not** committed: the repo's pre-commit hook (lint-staged `oxlint --type-aware --fix` on `src/**/*.ts`) fails with "No files found to lint" because oxlint ignores them, and I did not bypass the hook. Copies of both generated files are under `spike/kubb/generated/`; `generate.mjs` rewrites `src/models/` (use `--out <dir>` to write elsewhere).

```
npm ci
./spike/kubb/run-all.sh   # generate, oxfmt, typecheck, tests, semantic diff, classify
```

Files: `generate.mjs`, `gen-semantic-diff.mjs`, `classify-mismatches.mjs`, `run-all.sh`, `tsconfig.json`, `baseline/` (old outputs), `generated/` (new outputs), `semantic-diff-*.ts|json`, `mismatches-*.json`, `generate-report.json`, `typecheck.txt`, `test.txt`, `ts7-typecheck.txt`, `added-packages.txt`.
