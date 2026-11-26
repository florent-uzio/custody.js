# Coding standards

Judgement calls for reviewing a diff. Each is a rule a linter or test cannot
express; mechanical rules live in `npm run ci` instead (oxlint, tsc, the
`docs/namespaces.md` check in `src/namespaces-doc.test.ts`, the public export
snapshot in `src/public-exports.test.ts`). The type rules in
[`CLAUDE.md`](CLAUDE.md) and the decisions in [`docs/adr/`](docs/adr/) apply on
top of these.

## One owner per flow

When two layers run the same recipe — a `transactions.*` or `intents.*`
namespace method and its `XrplService` counterpart, or a method and its
`…AndWait` twin — one function owns the recipe and each caller passes in only
what differs: its I/O as callbacks or ports, and how it resolves its inputs.

- Precedents: `waitForExecution` and `waitForOrderTransaction` take the lookup
  as a callback, so `XrplService` drives the same loop through its ports.
- An `…AndWait` method is the plain method followed by the wait, calling the
  plain one rather than restating its steps.
- A result shape built in more than one place (an early "nothing to do"
  return, an ids-plus-outcome object) is the sign a recipe has two owners.

Flag a restated recipe as a finding to fix in the same diff, not as a
follow-up.

## Whole collections

A `.list()`-style call returns one **cursor page**
([ADR-0008](docs/adr/0008-cursor-pagination.md)). Code that searches, filters,
counts or collects ids over `.items` walks the whole collection with
`paginate` — `tickers.findByXrplMptIssuanceId` is the reference. Reading one
page is correct only when the code wants exactly that page (a UI, a sample),
and says so.

## Public by declaration

Every `src/namespaces/**/*.types.ts` is re-exported from `src/index.ts` with
`export type *`, so each type added there is public API from the next
release. A diff of `src/__snapshots__/public-exports.txt` lists exactly
those additions and removals. For each new export, confirm a caller handles
it (a param, option or result type). A type only the SDK's own plumbing needs — a ports bag, an
internal callback shape — is a public-surface decision the changeset names,
not an accident of where it was declared.
