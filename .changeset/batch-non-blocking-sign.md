---
"@florent-uzio/custody": minor
---

Add non-blocking variants for signing Batch payloads. `xrpl.signBatchPayload` proposes the raw sign intent and returns a serializable handle without waiting for the manifest signature, and `xrpl.getBatchSignature` fetches the signature (single-shot by default, optional polling) for that handle once the custody instance operator has approved it. Use these when operator approval happens out-of-band; `signBatchPayloadAndWait` remains for the synchronous case.

`signBatchPayload` (and therefore `signBatchPayloadAndWait`) now validates `signerAddress` with `isValidAddress` and throws a `CustodyError` if it is not a valid XRPL address.
