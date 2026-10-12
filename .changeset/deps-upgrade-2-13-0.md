---
"@florent-uzio/custody": patch
---

Upgrade dependencies ahead of the 2.13.0 stable release. Runtime: `axios` ^1.20.0, `qs` ^6.16.0, `uuid` ^14.0.3 and `xrpl` ^5.3.0. Dev tooling: `vitest`, `@vitest/ui` and `@vitest/coverage-v8` move to 5.x, `dotenv` to 18.x, plus minor/patch bumps of `@types/node`, `eslint`, `prettier`, `tsx` and `typescript-eslint`. No SDK API changes.

Held back on purpose: `typescript` stays on 5.9.x (ADR-0006), `canonicalize` stays on 3.x (5.x rewrites the signing canonicalizer and requires Node >= 22), and `@changesets/cli` stays on 2.x until after the stable promotion.
