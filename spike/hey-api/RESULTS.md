# Spike: `@hey-api/openapi-ts` (ticket #318, map #314)

**Verdict: PASS** (no codemod; one 107-line _generated_ adapter). Semantic diff has 83 / 2607 mismatches, all explained by 4 root causes (below). Under TS 7 it only works on the `next` canary, not on stable 0.99.0.

## Versions used where

| Step                                               | @hey-api/openapi-ts                                                                   | typescript |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| 1-4, 6 (generate, typecheck, tests, semantic diff) | `0.99.0` (stable, commit `16de593`)                                                   | `5.9.3`    |
| 5 TS 7 (a)                                         | `0.99.0` stable: **crashes**                                                          | `7.0.2`    |
| 5 TS 7 (a, b)                                      | `0.0.0-next-20260930190945`: generates fine; typecheck + tests + semantic diff re-run | `7.0.2`    |

The head commit's `package.json` holds the `next` + TS 7.0.2 pair (installed with `--legacy-peer-deps`, because `openapi-typescript@7.13.0` still declares `typescript ^5.x`).

## Numbers

| Item                                                                  | Result                                                                                                                                                                                                                               |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Generation time (both surfaces, incl. merge)                          | ~1.2-1.7 s (stable/TS5 and next/TS7 alike)                                                                                                                                                                                           |
| Raw hey-api output                                                    | `src/models/hey-api/{public,internal}/types.gen.ts`: 17,621 + 5,780 lines (old `openapi-typescript`: 23,759 + 7,683)                                                                                                                 |
| Adapter emitted into `custody-types.ts` / `custody-internal-types.ts` | 4,420 + 1,445 lines, produced by `emitAdapter()` in `generate.mjs` = **107 lines of generator code**, 0 hand-written per-type code                                                                                                   |
| `npm run typecheck` (TS 5, stable)                                    | **0 errors**                                                                                                                                                                                                                         |
| `npx tsc -p tsconfig.typecheck.json` (`*.test-d.ts`)                  | 0 errors after the adapter maps non-JSON content types (see "Adapter"); 6 errors before that fix                                                                                                                                     |
| `npm run typecheck:examples`                                          | 0 errors                                                                                                                                                                                                                             |
| `npm test`                                                            | 41 files / 859 tests pass (stable and next)                                                                                                                                                                                          |
| Semantic diff, public                                                 | 1,854 items, **44 mismatches** (28 schema, 6 body, 10 response, 0 path, 0 query)                                                                                                                                                     |
| Semantic diff, internal                                               | 753 items, **39 mismatches** (32 schema, 2 body, 5 response, 0 path, 0 query)                                                                                                                                                        |
| Semantic diff total                                                   | 2,607 items, 83 mismatches (3.2%); identical count under `next` + TS 7                                                                                                                                                               |
| Supply chain (`npm ls --all --parseable \| wc -l`)                    | 313 before, 355 after (+42 packages incl. hey-api itself)                                                                                                                                                                            |
| hey-api direct deps (0.99.0)                                          | 10: `commander`, `@lukeed/ms`, `ansi-colors`, `get-tsconfig`, `color-support`, `@hey-api/{types,shared,spec-types,codegen-core,json-schema-ref-parser}`; peer `typescript`                                                           |
| Maintainers / provenance / cadence                                    | 1 npm maintainer (`mrlubos`); SLSA provenance attestation present on 0.99.0; stable releases roughly weekly to biweekly through Jun 2026, **0.99.0 (2026-06-22) is the latest stable**, only `next` canaries since (last 2026-09-30) |

## TS 7 result

- **Stable 0.99.0 + TS 7.0.2: generator fails.** `TypeError: Cannot read properties of undefined (reading 'AnyKeyword')` at `init-*.mjs` (`ts.SyntaxKind.AnyKeyword`): TS 7's top-level `typescript` no longer exposes the compiler JS API that hey-api's emitter uses (consistent with hey-api issue #4235).
- **`next` canary + TS 7.0.2: (a) generator runs; (b) generated output and `src/` typecheck with TS 7's `tsc`** (`npm run typecheck`: 0 errors; vitest: 859 pass; semantic diff: same 83 mismatches).
- Unrelated TS 7 config breakage found incidentally (not caused by hey-api): `tsconfig.examples.json` uses removed `baseUrl` (TS5102); `tsconfig.typecheck.json` run lacks implicit `@types/node` (21 errors: `Buffer`, `crypto`, `captureStackTrace`). Both are tsconfig fixes for the TS 7 migration, independent of the generator choice.

## Adapter (step 2)

hey-api output is not in our shape: it emits flat per-operation `<operationId>Data` (`body`/`path`/`query`/`url`), `<operationId>Responses`, `<operationId>Errors`, and top-level schema types (with `case: "preserve"`, `Core_*` names survive). `generate.mjs` therefore emits, from the same merged doc, a file that exports `components`, `operations`, `paths` built on those types:

- `components["schemas"][K]` = `H.K`
- `operations[id]["parameters"]["path"|"query"]` = `H.<id>Data["path"|"query"]` (required-ness from the spec: `path` when path params exist, `query?`/`query` by `required`)
- `requestBody` = `Exclude<H.<id>Data["body"], undefined>` per JSON content type, `?` from `requestBody.required`
- `responses[code]["content"]["application/json"]` = `At<H.<id>Responses & H.<id>Errors, code>`
- `paths[path][method]` = `operations[id]`.

Details that needed handling (all in the generator, none per-type):

1. **operationId sanitising.** hey-api turns `.`/`-` into `_` (`NotificationController.getEntity` -> `NotificationController_getEntityData`, `deposit-instructions-by-id` -> `deposit_instructions_by_idData`; schema `Core_ManifestContent_EIP-191` -> `..._EIP_191`).
2. **operationId-less endpoints** (the invitations / virtual-ledgers endpoints our `paths[...]` lookups rely on): hey-api names them `get__v1_domains_by_domainId_...`; `fallbackId` reproduces that rule and fails loudly if a name is missing (`missingOps`: 0).
3. **Non-JSON content types are lost by hey-api** (it emits one type per status). The `*.test-d.ts` for `exports` failed until the adapter mapped `text/csv`, `text/plain` schemas of kind `string`/number/boolean/`$ref` itself. 16 media entries with other shapes (multipart body, `*/*` or `text/html` with inline object schemas) fall back to `unknown`; nothing in `src/` consumes them (typecheck is clean).
4. **Header params** (5 ops: `createIntent`, `approveIntent`, `rejectIntent`, `createWithdrawal`, `createInternalTransfer`) are not exposed (`header?: never`); not in the semantic diff either. `src/` does not read them from the types.

**Codemod preferable?** No. The adapter is 107 lines and makes `src/` (45 files) compile unchanged, so a codemod to `XData`/`XResponses` names would touch ~3,800 indexed-access sites for no gain. If the team later wanted to drop the adapter, the rewrite would be mechanical for `operations[...]["parameters"]` / `components["schemas"][...]` (regex-able) but not for `responses[...]["content"][...]` and requestBody (needs status-code resolution).

## Semantic diff (step 4)

Files: `semantic-diff.public.ts`, `semantic-diff.internal.ts` (generated by `gen-semantic-diff.mjs`; one `const _n: Eq<Old, New> = true` per item; `tsc` output in `semantic-diff.tsc.txt` / `semantic-diff.ts7.tsc.txt`; list in `mismatches.txt`). Items: every `components.schemas` entry, and per operation (looked up through `paths[path][method]` on both sides, since the old `operations` map has no entries for operationId-less endpoints) path params, query params, JSON body, each JSON response. Old = `baseline/old-public.ts` / `old-internal.ts` (openapi-typescript 7.13.0 output).

Categories of the 83 mismatches (leaf analysis in `leaf-mismatches.mjs`; remaining ones are transitive through a mismatching referenced schema):

1. **Empty-object / free-form `additionalProperties`: 12 of the 18 leaf schemas** (public: `Core_v0_ExecuteExtension`, `Compliance_PolicyPayloadRequest`, `Compliance_PolicyResponse`, `Compliance_DomainPayloadRequest`, `GasStation_SponsorableDomainDto`, `GasStation_AuditEventDto`, `Export_ExportMetadataDto`, `Export_OmnibusExportMetadataDto`; internal: `Internal_v0_ExecuteExtension`, `Notification_SignWeb`, `Notification_EntityToSign`, `Notification_ExtendedEntityToSign`). A property typed `type: object` with no properties is `Record<string, never>` in old, `{ [key: string]: unknown }` in new. The new type is looser (accepts any value) and arguably closer to the spec; callers that assign keep compiling, but readers of those fields now get `unknown` instead of `never`.
2. **Property with a spec `default` is required in old, optional in new: 1 leaf schema** `Export_MovementExportDto` (`custodyStatus`, `ledgerStatus` have `default` in the spec). openapi-typescript (`defaultNonNullable`) marks them required; hey-api marks them optional. For request bodies, new is looser (callers may omit them, matching the spec); for a response schema with defaults it would lose the "always present" guarantee. Only this one leaf is affected today, which is also the only genuine optional/required difference.
3. **Discriminator `Omit<X, "type">` (allOf/oneOf with discriminator): 4 leaf schemas** (`Internal_ApiTicker`, `Internal_SubstrateStakingMethod_Bond`, `Internal_SubstrateStakingMethod_SetController`, `Internal_TransactionOrderParameters_XRPL`). Old output wraps a `$ref` to a discriminated parent in `Omit<..., "type">` (e.g. `ledgerDetails: Omit<Internal_TickerLedgerDetails, "type">`); hey-api keeps the full referenced type, so `type` becomes required there. Stricter in new: a payload that omitted `type` in those nested places no longer type-checks.
4. **allOf + discriminator mapping: 1 leaf schema** `EDS_WebhookChannelCreate`: old is `{type: "EDS_WebhookChannelCreate"} & (Omit<...,"type"> & {url: string; type?: "WEBHOOK"})` (the two `type` constraints intersect to `never`); new is `Omit<EDS_ChannelCreate,'type'> & {url; type: 'EDS_WebhookChannelCreate'}`. Different, and arguably saner in new. Drives the `createChannel` body mismatch.
5. **Transitive (42 schemas + 23 body/response items = 65):** `Core_Propose`, `Core_UserIntentPayload`, `Core_IntentEntity`, `Core_TrustedIntent`, `Core_ProposeIntentBody`, etc. mismatch only because they reference a leaf above (mainly `Core_v0_ExecuteExtension` through the intent-payload union, and `Internal_TransactionOrderParameters_XRPL`); consequently `createIntent`/`getIntents`/`getIntent`/`intentDryRun` bodies and responses show up, as do the `Export_*`, `Notification*` and `GetPolicy` operations.
6. **No mismatches** in: optional-vs-required (outside item 2), enums, `nullable`, plain `oneOf`/discriminated unions (hey-api emits `({type:'X'} & X) | …`, mutually assignable with the old union), naming/missing (0 missing schemas, 0 missing operations after sanitising), path params (0 of the operations with path params), query params (0).

Not covered: header params, non-JSON content types, `paths[...]["parameters"]` path-item level, `$defs`/`webhooks` exports (old file exports them; `src/` does not use them).

## Risks

1. **Single-maintainer, stable line stalled; TS 7 needs a canary.** Stable 0.99.0 (2026-06-22) cannot run on TS 7; the only TS 7-capable build is a dated `0.0.0-next-*` tag that is not semver-comparable and not a release. Adopting it pins a canary in a repo whose pipeline otherwise targets stable (criterion 1 and 4 in tension).
2. **Output shape is not natively ours; the adapter encodes hey-api's naming rules.** Operation naming (`<id>Data`, sanitising of `.`/`-`, `get__v1_..._by_x` fallback for operationId-less endpoints) and "one type per status, non-JSON dropped" are undocumented behaviours that can change between releases; the adapter fails loudly on missing names but not on silently-changed shapes. The generated semantic-diff is the guard and should become a CI check.
3. **Subtle type semantics change** (items 1-4): `{[k: string]: unknown}` replaces `Record<string, never>` for free-form objects and discriminator `Omit<..., "type">` disappears, making a few nested `type` fields required. Compiles today, but is a behaviour change for SDK consumers' inferred types.

Also: +42 packages (vs. 0 for vendoring), and `openapi-typescript` plus `typescript@7` still conflict on peer ranges (`--legacy-peer-deps` was needed) until the old dependency is removed.

## Reproduce

```
node spike/hey-api/generate.mjs                    # writes src/models/{custody,custody-internal}-types.ts + src/models/hey-api/**
node spike/hey-api/gen-semantic-diff.mjs
npx tsc -p spike/hey-api/tsconfig.json > spike/hey-api/semantic-diff.tsc.txt
node spike/hey-api/list-mismatches.mjs && node spike/hey-api/leaf-mismatches.mjs
```
