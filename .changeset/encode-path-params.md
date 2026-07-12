---
"@florent-uzio/custody": patch
---

Path parameters are now percent-encoded during URL template interpolation, preventing IDs containing reserved characters from rewriting the request path.
