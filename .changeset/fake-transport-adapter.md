---
"@florent-uzio/custody": patch
---

Extract a `Transport` interface (the 5 verb methods namespaces consume) from the concrete `TypedTransport` class, and ship a typed in-memory `FakeTransport` test double (`src/testing/fake-transport.ts`, not part of the published package) that satisfies it. All namespace factories now accept `Transport` instead of the concrete class, so tests no longer need an `as any` cast to pass a fake transport — `TypedTransport`'s private fields previously made that impossible to type correctly. Also fixed `TypedTransport.get()`'s `config` parameter, which was silently dropped instead of being forwarded like the other 4 verbs.
