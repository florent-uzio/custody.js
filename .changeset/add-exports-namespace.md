---
"@florent-uzio/custody": minor
---

Add `exports` namespace with `generateMovementReport` and `generatePositionReport`, new in the 1.37.0 OpenAPI spec. Also bundles the 1.36.4 and 1.37.0 official specs (1.36.3 shipped no OpenAPI changes), which removes `omnibus.lock`/`omnibus.unlock` from the capability set for backends on 1.36.4+ — those endpoints were dropped from the server API in that release.
