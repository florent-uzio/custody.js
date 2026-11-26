import { RippleCustody } from "@florent-uzio/custody"

/**
 * Example: Release the funds Ripple Custody holds in quarantine
 *
 * Custody quarantines incoming transfers for compliance review. Until they are
 * released the amount is unavailable: the holder's next send fails its dry run
 * with `Not enough available funds (CurrentlyNotEnoughFunds)`, although the
 * tokens are on the ledger.
 *
 * `xrpl.releaseQuarantinedTransfers` takes the holder's r-address, finds its
 * quarantined transfers (every page of them) and proposes one
 * `v0_ReleaseQuarantinedTransfers` intent for them.
 */
const releaseQuarantinedTransfers = async () => {
  try {
    const custody = new RippleCustody({
      apiUrl: "https://custody-api-url",
      authUrl: "https://custody-auth-url/token",
      privateKey: process.env.PRIVATE_KEY ?? "",
      publicKey: process.env.PUBLIC_KEY ?? "",
    })

    // A release bypasses custody's compliance review of those transfers, so
    // there is no default: name the transfers, or ask for `all: true`.
    // `issuanceId` narrows it to one MPT, under both its public and (if the
    // issuance is confidential) its confidential ticker. Use `tickerId` for XRP
    // or an IOU.
    const result = await custody.xrpl.releaseQuarantinedTransfers(
      {
        address: "r...", // The holder that received the transfers
        all: true,
        issuanceId: "00000AA1...", // Optional: only this MPT
      },
      { description: "Release received MPT for spending" },
    )

    if (!result.proposed) {
      // Nothing quarantined — no intent was proposed. Custody registers an
      // incoming transfer a few seconds after the ledger validates it, so
      // straight after a receive, check again shortly
      console.log("Nothing to release")
      return
    }

    // Fire-and-forget: in production a custodian approves the release later.
    // Keep the ids and pick the intent up with `intents.getAndWait`
    console.log({
      intentId: result.intentId,
      domainId: result.domainId,
      transferIds: result.transferIds,
    })

    // ── Or, when no approval is in the way ───────────────────────────────
    //
    // `releaseQuarantinedTransfersAndWait` also polls the intent. A release
    // has no ledger transaction, so it is done once the intent is `Executed`
    const waited = await custody.xrpl.releaseQuarantinedTransfersAndWait({
      address: "r...",
      transferIds: ["00000000-0000-0000-0000-000000000000"], // Or name them
    })

    if (waited.proposed && !waited.isSuccess) {
      console.log(waited.reason)
    }
  } catch (error) {
    console.log(error)
  }
}
