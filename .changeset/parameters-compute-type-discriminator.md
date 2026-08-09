---
"@florent-uzio/custody": patch
---

Fix `client.accounts.initiateParametersCompute()` and `client.accounts.initiateParametersComputeAndWait()`, which failed with `400 Invalid value for: body (Missing required field at 'type')` for every possible input. The API requires the request union's `type` discriminator, but — alone among the spec's single-member sealed unions — this schema does not declare its mapping, so the generated body type omits the field and there was no way to call the endpoint as typed. Both methods now inject `type: "cmpt-send"` before POSTing, so the field never has to be supplied; `InitiateParametersComputeBody` carries it as an optional property typed by the new `ParametersComputeType` export, and a caller-supplied value is preserved for when the union gains a second member. The override goes away once the spec declares the discriminator.

Also surface the API's reason when an error response has a `text/plain` body instead of the usual JSON error shape — the second half of the same bug report, and what made the above take a while to diagnose. Only object bodies were preserved, so the validation text was discarded and the caller saw axios's generic `POST API request failed: Request failed with status code 400`, with the real reason only reachable by unwrapping `error.cause.response.data` by hand. String bodies are now used as the `CustodyError` reason, keeping the existing `<VERB> API request failed:` prefix so log greps still match; a blank body still falls back to the axios message. This affects every endpoint that declares a `text/plain` error response, which is where the most useful validation text lives.

See [#229](https://github.com/florent-uzio/custody.js/issues/229).
