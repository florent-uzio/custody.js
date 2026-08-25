---
"@florent-uzio/custody": patch
---

Depend on the published `xrpl@^5.1.0` instead of the vendored `XRPLF/xrpl.js@confidential-mpts` builds. XRPLF released the XLS-96 confidential-MPT surface — `ConfidentialMPTClawback`, `ConfidentialMPTConvert`, `ConfidentialMPTConvertBack`, `ConfidentialMPTMergeInbox` and `ConfidentialMPTSend`, `MPTokenIssuanceSetFlags.tfMPTSetCanHoldConfidentialBalance`, and the `@xrplf/mpt-crypto` proof/ElGamal package — so `xrpl@5.1.0` (with `ripple-binary-codec@2.10.0` and `@xrplf/mpt-crypto@0.1.1`) now resolves everything from the npm registry. The `vendor/` directory and the `overrides` and `bundleDependencies` entries that pinned and packed those tarballs are gone, which shrinks the published tarball from ~5.2 MB to ~0.6 MB.

No SDK API changes. The one consumer-facing difference is that the published package no longer bundles its own copy of `xrpl`: applications that import `xrpl` directly to build confidential MPT transactions should install `xrpl@^5.1.0` themselves, which is now a plain registry install rather than a vendored build.
