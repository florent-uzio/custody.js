---
"@florent-uzio/custody": patch
---

Move the hand-written `auth` and `xrpl` object literals out of `RippleCustody`'s constructor body into `createAuth`/`createXrpl` factories in `src/namespaces/`, matching the wiring idiom already used by every other namespace. This is an internal reorganization with no runtime behavior change; `client.auth.*` and `client.xrpl.*` keep the same shape.
