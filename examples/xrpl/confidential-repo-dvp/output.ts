import type { RippleCustody } from "@florent-uzio/custody"
import { WALLET_REPO_BUYER, WALLET_REPO_SELLER, working_data } from "./config.js"
import { getBalances } from "./custody-helpers.js"
import type { Balances } from "./types.js"

//**** Output Helper Functions ****/
// sectionHeader
// printBalances

export function sectionHeader(title: string) {
  console.log("=========================================================")
  console.log(title)
  console.log("=========================================================")
}

export async function printBalances(custody: RippleCustody): Promise<Balances> {
  const mmfDenom = Math.pow(10, working_data.scaleMMF)
  const rlusdDenom = Math.pow(10, working_data.scaleRLUSD)

  // REDUCING CONCURRENCY TO ENSURE STABILITY - WILL ASSESS FOR LATER ENHANCEMENT
  const [sellerBalances, buyerBalances] = await Promise.all([
    getBalances(custody, WALLET_REPO_SELLER.id),
    getBalances(custody, WALLET_REPO_BUYER.id),
  ])
  // const sellerBalances = await getBalances(custody, WALLET_REPO_SELLER.id);
  // const buyerBalances = await getBalances(custody, WALLET_REPO_BUYER.id);

  if (isNaN(buyerBalances.rlusdConfidentialInbox / rlusdDenom)) console.log("NAN!")

  console.log(`Repo Seller (${WALLET_REPO_SELLER.id} / ${WALLET_REPO_SELLER.address}):`)
  console.log(
    `  MMF Total: ${(sellerBalances.mmfPublic + sellerBalances.mmfConfidentialSpendable + sellerBalances.mmfConfidentialInbox) / mmfDenom}`,
  )
  console.log(`    Public: ${sellerBalances.mmfPublic / mmfDenom}`)
  console.log(`    Confidential Spendable: ${sellerBalances.mmfConfidentialSpendable / mmfDenom}`)
  console.log(`    Confidential Inbox: ${sellerBalances.mmfConfidentialInbox / mmfDenom}`)
  console.log(
    `  RLUSD Total: ${(sellerBalances.rlusdPublic + sellerBalances.rlusdConfidentialSpendable + sellerBalances.rlusdConfidentialInbox) / rlusdDenom}`,
  )
  console.log(`    Public: ${sellerBalances.rlusdPublic / rlusdDenom}`)
  console.log(
    `    Confidential Spendable: ${sellerBalances.rlusdConfidentialSpendable / rlusdDenom}`,
  )
  console.log(`    Confidential Inbox: ${sellerBalances.rlusdConfidentialInbox / rlusdDenom}`)

  console.log(`Repo Buyer (${WALLET_REPO_BUYER.id} / ${WALLET_REPO_BUYER.address}):`)
  console.log(
    `  MMF Total: ${(buyerBalances.mmfPublic + buyerBalances.mmfConfidentialSpendable + buyerBalances.mmfConfidentialInbox) / mmfDenom}`,
  )
  console.log(`    Public: ${buyerBalances.mmfPublic / mmfDenom}`)
  console.log(`    Confidential Spendable: ${buyerBalances.mmfConfidentialSpendable / mmfDenom}`)
  console.log(`    Confidential Inbox: ${buyerBalances.mmfConfidentialInbox / mmfDenom}`)
  console.log(
    `  RLUSD Total: ${(buyerBalances.rlusdPublic + buyerBalances.rlusdConfidentialSpendable + buyerBalances.rlusdConfidentialInbox) / rlusdDenom}`,
  )
  console.log(`    Public: ${buyerBalances.rlusdPublic / rlusdDenom}`)
  console.log(
    `    Confidential Spendable: ${buyerBalances.rlusdConfidentialSpendable / rlusdDenom}`,
  )
  console.log(`    Confidential Inbox: ${buyerBalances.rlusdConfidentialInbox / rlusdDenom}`)

  return { sellerBalances, buyerBalances }
}
