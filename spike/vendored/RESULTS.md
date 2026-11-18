# Spike: `vendored` (pruned openapi-typescript 7.13.0) — ticket #318, map #314

**Verdict: PASS** (no adapter, no codemod). Output is byte-identical to the baseline for both surfaces.
Open item: TS 7 keeps the generator alive only through a TS 5 alias (see TS 7 section).

## What was done

- Vendored the shipped `dist/*.mjs` of `openapi-typescript@7.13.0` (plain ESM, no build step) into
  `spike/vendored/openapi-typescript/`, with the upstream `LICENSE` (MIT, Copyright 2020 Drew Powers)
  and a header note in `index.mjs`.
- Pruned (all verified by byte-identical output):
  - CLI, `.cjs`/`.d.ts`/sourcemaps, `lib/redoc.mjs`, `paths-enum`, `webhooks-object`.
  - Every option branch our `openapiTS(merged)` call never sets: `alphabetize`, `arrayLength`,
    `enum`/`enumValues`/`conditionalEnums`/`dedupeEnums` (TS enums, `as const` arrays), `excludeDeprecated`,
    `exportType`, `immutable`, `rootTypes*`, `pathParamsAsTypes`, `generatePathParams`, `readWriteMarkers`,
    `transform`/`postTransform`/`transformProperty`/`inject`, `propertiesRequiredByDefault`,
    `emptyObjectsUnknown`, `additionalProperties`, debug/timing/colour logging.
  - Schema features with zero uses in the merged specs (`anyOf`, `const`, `type: [..]`, tuples/`prefixItems`,
    `patternProperties`, `$defs`, `not`, header `content`, non-schema `components.*`, `webhooks`) are removed
    and replaced by an explicit `throw "Unsupported ..."`, so a future spec cannot be silently mistyped.
  - `@redocly/openapi-core` replaced by `validate.mjs` (39 LOC): OpenAPI 3.x version gate, duplicate
    `operationId` error, and a check that every `$ref` is a local, resolvable `#/...` pointer (the precondition
    that makes Redocly's bundle an identity). `parseRef`/`escapePointer` re-implemented in `lib/ref-utils.mjs` (15 LOC).
- `spike/vendored/generate.mjs` copies `loadDocs`, uses the real `merge.mjs`, feeds each merged doc to the
  vendored generator and writes to `spike/vendored/out/` (does not touch `src/models`).
- The vendored code imports `typescript-printer` (npm alias of `typescript@5.9.3`), not `typescript`
  (needed for the TS 7 question; same package for TS 5).

## Numbers

| Item                                                                      | Result                                                                                                                                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adapter LOC / codemod                                                     | 0 / none needed (shape is upstream's own)                                                                                                                           |
| Output vs baseline, public (`custody-types.ts`, after `oxfmt`)            | byte-identical (`cmp`)                                                                                                                                              |
| Output vs baseline, internal (`custody-internal-types.ts`, after `oxfmt`) | byte-identical (`cmp`)                                                                                                                                              |
| Raw (pre-`oxfmt`) printer output vs real generator                        | byte-identical, both surfaces                                                                                                                                       |
| `npm run typecheck` (TS 5.9.3)                                            | 0 errors                                                                                                                                                            |
| `npm test`                                                                | 41 files, 859 tests passed                                                                                                                                          |
| Semantic diff, public                                                     | 1929 items, 0 mismatches                                                                                                                                            |
| Semantic diff, internal                                                   | 816 items, 0 mismatches (negative control confirmed the harness fails on a wrong assertion)                                                                         |
| Mismatch categories                                                       | none (output is identical, so the semantic diff is vacuous by construction; it is kept as a harness for the later candidates and for a future hand-written printer) |
| Vendored LOC (pruned, JS)                                                 | 1359 across 18 `.mjs` files as pruned (dist style); 1566 after the repo's `oxfmt` reformat (incl. validate.mjs + ref-utils.mjs added)                               |
| Upstream LOC, same scope                                                  | 2406 (shipped `dist/*.mjs`); 3855 TS in upstream `src/` incl. 735 of type declarations                                                                              |
| Pruned away                                                               | about 1050 LOC of dist (about 44 percent, like-for-like 2406 to 1359) plus the CLI                                                                                  |
| Runtime deps after vendoring                                              | 1 (`typescript`, used for AST + printer). Upstream: 6 direct, 33 transitive                                                                                         |
| `npm ls --all --parseable` line count                                     | 313 before; 289 after (openapi-typescript removed, `typescript-printer` alias added). TS 7 added on top: 290                                                        |
| Generation time (full script wall clock)                                  | 0.73 s vendored vs 1.17 s real script (generator-only: about 135 ms)                                                                                                |

Note: `openapi-typescript` was uninstalled in this worktree, so the real `scripts/generate-custody-types/generate.mjs`
no longer runs on this branch; a real adoption would repoint it at the vendored module. Warnings printed
(9 discriminator-mapping warnings per run) are upstream's `patchDiscriminatorEnum` and are unchanged; the real script
additionally prints merge-divergence warnings that the spike script does not reproduce.

## TS 7 (typescript 7.0.2 installed top-level; `npm view typescript` latest = 7.0.2)

TS 7's `typescript` package exposes only `version` and `versionMajorMinor` to Node (`ts.factory`, `createSourceFile`,
`createPrinter`, `SyntaxKind` are gone), so a vendored generator that `import ts from "typescript"` cannot run on it.

**(a) Alias approach works.** With `"typescript": "^7.0.2"` and `"typescript-printer": "npm:typescript@^5.9.3"` in
devDependencies, the unchanged vendored generator runs and produces output byte-identical to the TS 5 run.
Under TS 7's `tsc`: `tsc --noEmit` on `src/` passes with 0 errors, `npm run build` passes, the semantic-diff
file typechecks, and `npm test` still passes (859/859). The generated file needs nothing TS 5-specific.
Unrelated to the generator: `npm run typecheck:examples` fails under TS 7 with `TS5102: Option 'baseUrl' has been removed`
(`tsconfig.examples.json`); a one-line config fix, not exercised here.
Cost of the alias: one extra copy of TS 5 (about 23 MB) installed as a devDependency, only needed at generation time,
which also means we cannot drop TS 5 as long as we vendor a `ts.factory`-based generator. It is a stopgap: TS 5.9 is the
last 5.x and will not get new syntax support, though our output uses only basic type syntax.

**(b) Cost of a printer rewrite (emit strings, no `ts`).** 94 `ts.factory.*` call sites (24 `createPropertySignature`,
18 `createTypeLiteralNode`, 9 `createIdentifier`, 5 each `createLiteralTypeNode`/`createKeywordTypeNode`, 4 each
`createTypeReferenceNode`/`createNumericLiteral`, 3 `createUnionTypeNode`, the rest 1 to 2) plus about 26 other `ts` API uses
(16 `SyntaxKind`, `createPrinter`, `createSourceFile` x2, `addSyntheticLeadingComment`, 4 `ts.is*` checks) in 12 of the 18
files (about 1250 of 1359 LOC are AST-adjacent, but the real rewrite is mostly mechanical: 42 of the 94 sites are
property-signature/type-literal boilerplate that a `prop()` / `obj()` string helper collapses). Subtle places that need
care, not just substitution: `tsIsPrimitive`/`tsDedupe` and `tsWithRequired` inspect node kinds; `operations` is built by
mutating an interface node's `members`; the JSDoc emission goes through `addSyntheticLeadingComment`; and the `WithRequired`
helper is injected via `stringToAST`. Because `oxfmt` reformats the output, the printer only has to match on tokens,
parentheses and quoting, which the byte-identical check gives us for free. Estimate: 1 to 2 days, ending near 500 to 700 LOC
with no `typescript` dependency at all, and the existing byte-identical `cmp` is the acceptance test.

## Risks

1. TS 7 forces a decision: either keep a TS 5 alias just for the printer (works today, dead-end dependency) or do the
   printer rewrite (1 to 2 days, verifiable by `cmp`). Vendoring does not avoid this, it only localises it.
2. We now own a fork: upstream fixes (new discriminator handling, OpenAPI 3.1) do not arrive. The `throw` guards
   convert silent divergence into a loud build failure when a new spec uses an unsupported keyword, but each such
   failure becomes our work.
3. Validation is weaker than Redocly's `minimal` ruleset (only version, unique `operationId`, resolvable local `$ref`);
   malformed specs from future releases could generate bad types instead of failing early.
4. Vendored `dist` is compiled JS (type annotations gone, `void 0` style); readable, but a diff against upstream `src/`
   for future cherry-picks is noisier than if we had vendored the TS sources.

## Files

- `spike/vendored/openapi-typescript/` — the pruned vendor (`LICENSE`, `index.mjs`, `validate.mjs`, `lib/`, `transform/`)
- `spike/vendored/generate.mjs` — spike generator; `out/` — its (oxfmt-formatted) output; `baseline/` — pre-spike outputs
- `spike/vendored/semantic-diff-gen.mjs` -> `semantic-diff.ts` (2745 assertions), `tsconfig.json`
- `package.json` / `package-lock.json` — `openapi-typescript` removed, `typescript-printer` alias added, `typescript` set to `^7.0.2`
