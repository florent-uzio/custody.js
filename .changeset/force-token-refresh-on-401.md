---
"@florent-uzio/custody": patch
---

The automatic 401 retry now always fetches a fresh token instead of re-sending the cached one, recovering from server-side revocation and key rotation.
