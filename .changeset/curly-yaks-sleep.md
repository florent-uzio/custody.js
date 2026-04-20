---
"custody": patch
---

fix: guard against undefined body in `ApiService.post()` signature check

POST requests with no body (e.g. `userInvitations.complete`, `cancel`, `renew`) crashed with `Cannot read properties of undefined (reading 'signature')` because the signing logic accessed `body.signature` without a null check.
