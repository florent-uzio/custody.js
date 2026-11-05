---
"@florent-uzio/custody": minor
---

Refresh the devbox 1.36.2 OpenAPI specs (public and internal) and regenerate types. Adds `accounts.getSponsorships` and `accounts.getSponsorshipMovements` for XRPL sponsorships (XLS-68). New types cover the `SponsorshipSetAsSponsor` / `SponsorshipSetAsSponsee` XRPL operations, the optional `sponsorship` params (`spfSponsorFee` / `spfSponsorReserve`) on XRPL transaction orders and Batch entries, and the Payment `tfSponsorCreatedAccount` flag. For Batch v1.1, `Core_ApiBatchSigningData` gains `signers[]`, which holds one `signingPayload` per BatchSigner, and deprecates the top-level `signingPayload` / `signingPayloadHash`. These are no longer signable, so sign `signers[i].signingPayload` instead. Dry-run and failure processing hints gain `InvalidBatchSignature`. The internal types gain the Web3 Connector session endpoints (`/internal/v1/me/domains/{domainId}/session…`).
