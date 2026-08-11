---
"@florent-uzio/custody": patch
---

Fix `parametersComputeToCryptographicFields` mangling optional fields the parameters-compute response returns as `null`. The API sends an explicit `null` — not an omitted key — for material it has no value for, most visibly `auditorEncryptedAmount` when the issuance has no auditor key registered. The generated types declare those fields as merely optional, so the helper's `undefined`-only checks let a `null` through to the hex→base64 conversion and emitted the field as an empty string, which the API then rejects.

Every optional field in the helper — `senderEncryptedBalance`, `senderEncryptedBalanceVersion`, `auditorEncryptedAmount` on `Send`, `zkProof` and `auditorEncryptedAmount` on `Convert`, `auditorEncryptedAmount` on `ConvertBack` — is now omitted when it is `null` as well as when it is absent. The variant inference is null-aware for the same reason: a `null` `senderEncryptedAmount`, `amount`, `holderEncryptedAmount` or `balanceCommitment` no longer selects a variant just by being a present key, so a `Convert` response that spells out `balanceCommitment: null` is no longer read as a `ConvertBack`. A Clawback `amount` of `0` still discriminates. Values that are actually present convert exactly as before.
