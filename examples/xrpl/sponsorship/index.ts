import { RippleCustody } from "@florent-uzio/custody"

/**
 * Example: XRPL sponsorship (XLS-68) with Ripple Custody
 *
 * A sponsor account pays the transaction fees and/or owner reserves of a
 * sponsee account:
 * 1. The sponsor creates a sponsorship for the sponsee (`SponsorshipSetAsSponsor`)
 * 2. The sponsee sends a transaction the sponsor pays for (order-level `sponsorship`)
 * 3. Both sides read the sponsorship and its movements back
 *
 * Not to be confused with `custody.sponsors` (Gas Station), a separate feature.
 */
const DOMAIN_ID = "your-domain-id"
const LEDGER_ID = "xrpl-testnet"
const SPONSOR = "r..." // Custody account that pays
const SPONSEE = "r..." // Custody account that is paid for
const SPONSEE_ACCOUNT_ID = "your-sponsee-account-id"

const sponsorship = async () => {
  const custody = new RippleCustody({
    apiUrl: "https://custody-api-url",
    authUrl: "https://custody-auth-url/token",
    privateKey: process.env.PRIVATE_KEY ?? "",
    publicKey: process.env.PUBLIC_KEY ?? "",
  })

  // ── 1. The sponsor funds a sponsorship for the sponsee ─────────
  // feeAmountDelta (drops) tops up the fee budget; remainingOwnerCountDelta
  // adds owner-reserve slots. `tfRequireSignForFee` would make the sponsor
  // co-sign every fee it pays — left off here.
  const created = await custody.xrpl.proposeIntentAndWait({
    Account: SPONSOR,
    operation: {
      type: "SponsorshipSetAsSponsor",
      sponsee: { type: "Address", address: SPONSEE },
      feeAmountDelta: "1000000",
      remainingOwnerCountDelta: 1,
      flags: [],
    },
  })
  if (!created.isSuccess) {
    console.log("Sponsorship not created:", created.intent.status)
    return
  }

  // ── 2. The sponsee sends a transaction the sponsor pays for ─────
  // `sponsorship` sits next to `Account` and `operation`, like `memos`.
  // spfSponsorReserve is rejected on transaction types whose reserve cannot be
  // sponsored (OfferCreate, TicketCreate, ConfidentialMPT operations): use
  // only spfSponsorFee for those.
  const trustSet = await custody.xrpl.proposeIntentAndWait({
    Account: SPONSEE,
    operation: {
      type: "TrustSet",
      limitAmount: {
        currency: { type: "Currency", code: "USD", issuer: "r..." },
        value: "10000",
      },
      flags: [],
    },
    sponsorship: {
      sponsor: { type: "Address", address: SPONSOR },
      flags: ["spfSponsorFee", "spfSponsorReserve"],
    },
  })
  console.log("Sponsored TrustSet succeeded:", trustSet.isSuccess)

  // ── 3. Read the sponsorship and its movements back ─────────────
  const accountRef = { domainId: DOMAIN_ID, accountId: SPONSEE_ACCOUNT_ID }

  const sponsorships = await custody.accounts.getSponsorships(accountRef, { ledgerId: LEDGER_ID })
  console.dir(sponsorships.items, { depth: null })

  const movements = await custody.accounts.getSponsorshipMovements(accountRef, {
    ledgerId: LEDGER_ID,
  })
  console.dir(movements.items, { depth: null })
}

sponsorship().catch(console.error)
