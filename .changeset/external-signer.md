---
"@florent-uzio/custody": minor
---

Add support for an external `signer` as an alternative to `privateKey`, so the
private key can stay outside the SDK (e.g. in an HSM/KMS). Provide exactly one of
`privateKey` or `signer` when constructing `RippleCustody`; `publicKey` remains
required in both modes.

The SDK owns canonicalization, hashing, and signature encoding. A `signer` is
`{ algorithm, sign }`, where `sign({ data, context })` runs only the raw signing
primitive for its `algorithm` and returns the raw signature bytes:

- `ed25519`: the 64-byte raw Ed25519 signature over `data` (`data` is already
  SHA-256 hashed for request bodies).
- `secp256k1` / `secp256r1`: the DER-encoded ECDSA-SHA256 signature over `data`.

The `context` (`"auth-challenge"` | `"request-body"`) is passed through for
HSM/KMS policy engines. A throwing/rejecting signer, or one that returns an
invalid signature, surfaces a clear `CustodyError`, and concurrent token
refreshes collapse into a single signer call.

Also export `toSignablePayload(request)`, which returns the canonical JSON string
the SDK signs for a request body (the pre-hash input), plus the `CustodySigner`,
`CustodySignRequest`, and `CustodySignContext` types.
