import { RippleCustody } from "@florent-uzio/custody"

/**
 * Example: Propose a non-XRPL intent without hand-assembling the envelope
 *
 * `intents.propose` takes a fully-formed request — `type: "Propose"`, `author`,
 * `targetDomainId`, `expiryAt`, `id`, `customProperties` — which meant every
 * consumer rebuilt the same envelope, and looked its own `author.id` up first
 * through `users.me()` and a domain search.
 *
 * `proposePayload` takes only the payload and fills the rest in.
 */
const releaseQuarantinedTransfers = async () => {
  try {
    const custody = new RippleCustody({
      apiUrl: "https://custody-api-url",
      authUrl: "https://custody-auth-url/token",
      privateKey: process.env.PRIVATE_KEY ?? "",
      publicKey: process.env.PUBLIC_KEY ?? "",
    })

    // Fire-and-forget: the intent is proposed, and the ids to follow it up with
    // come back. This is the shape to use in production, where a custodian
    // approves the intent minutes later — see the note below
    const { requestId, domainId } = await custody.intents.proposePayload(
      {
        type: "v0_ReleaseQuarantinedTransfers",
        accountId: "00000000-0000-0000-0000-000000000000",
        transferIds: ["00000000-0000-0000-0000-000000000000"],
      },
      {
        // `domainId` is optional here — pass it only when the login has more
        // than one domain, otherwise the single one is resolved
        description: "Release the transfers held for review",
        expiryDays: 7,
      },
    )

    console.log({ requestId, domainId })

    // Pick it up whenever the approval lands — from a webhook, a scheduled
    // sweep, or a manual check
    const intent = await custody.intents.get({ domainId, intentId: requestId })
    console.log(intent.data.state.status)

    // ── Or, when an approval is not in the way ────────────────────────────
    //
    // `proposeAndWait` polls to a terminal status. The default budget is 10
    // attempts 3s apart — 30 seconds — so it fits development, auto-approved
    // policies and tests, not a human custodian who takes minutes. Raising
    // `maxRetries` does not fix that; use `proposePayload` above instead
    const result = await custody.intents.proposeAndWait(
      { type: "v0_NotarizeData", data: Buffer.from("hello").toString("base64") },
      { maxRetries: 20, intervalMs: 3000 },
    )

    if (result.isSuccess) {
      console.dir(result.intent.data, { depth: null })
      return
    }

    // Nothing throws on a rejected, expired or still-open intent. `reason` is
    // the sentence to log; `state.error` is what to branch on
    console.log(result.reason)
    // "Intent 1e9… was Rejected (PolicyViolation): approval threshold not met"
    // "Intent 1e9… was still awaiting approval after 20 attempts."

    if (!result.isTerminal) {
      // Still open — the intent is alive, so re-poll with
      // `intents.getAndWait({ domainId, intentId: result.requestId })` rather
      // than proposing it a second time
      console.log("Still pending:", result.requestId)
    }
  } catch (error) {
    console.log(error)
  }
}
