import { RippleCustody } from "@florent-uzio/custody"
import "dotenv/config"
import {
  DOMAIN_ID,
  MMF_ID,
  RLUSD_ID,
  WALLET_MMF_ISSUER,
  WALLET_REPO_BUYER,
  WALLET_REPO_SELLER,
  WALLET_SUBMITTER,
  requireEnv
} from "./config.js"
import {
  getXRPLAddress,
  mergeInbox,
  proposeAndWait,
  refreshTickers
} from "./custody-helpers.js"
import { printBalances, sectionHeader } from "./output.js"
import type { Wallet } from "./types.js"

/**
 * Clear positions (0 confidential balances) for end-to-end repo lifecycle process
 *
 **/

//**** Preparation ****/
const prepare = async (custody: RippleCustody) => {
  // Fails fast when the login has no access to DOMAIN_ID. Nothing here needs
  // the user id any more — `intents.proposePayload` fills `author` in itself —
  // so `domains.me()` replaces the `users.me()` + `domains.find` bootstrap.
  await custody.domains.me({ domainId: DOMAIN_ID })
  WALLET_MMF_ISSUER.address = await getXRPLAddress(custody, WALLET_MMF_ISSUER.id)
  WALLET_REPO_SELLER.address = await getXRPLAddress(custody, WALLET_REPO_SELLER.id)
  WALLET_REPO_BUYER.address = await getXRPLAddress(custody, WALLET_REPO_BUYER.id)
  WALLET_SUBMITTER.address = await getXRPLAddress(custody, WALLET_SUBMITTER.id)
  await refreshTickers(custody)
}

const main = async () => {
  try {
    const custody = new RippleCustody({
      apiUrl: requireEnv("API_URL"),
      authUrl: requireEnv("AUTH_URL"),
      privateKey: requireEnv("PRIVATE_KEY"),
      publicKey: requireEnv("PUBLIC_KEY"),
      debug: process.env.DEBUG === "true",
    })

    await prepare(custody);
    
    console.log("Starting Positions:");
    const balStart = await printBalances(custody);

    // Clear inboxes
    if(balStart.sellerBalances.mmfConfidentialInbox > 0) await mergeInbox(custody, WALLET_REPO_SELLER, MMF_ID, "MMF");
    if(balStart.sellerBalances.rlusdConfidentialInbox > 0) await mergeInbox(custody, WALLET_REPO_SELLER, RLUSD_ID, "RLUSD");
    if(balStart.buyerBalances.mmfConfidentialInbox > 0) await mergeInbox(custody, WALLET_REPO_BUYER, MMF_ID, "MMF");
    if(balStart.buyerBalances.rlusdConfidentialInbox > 0) await mergeInbox(custody, WALLET_REPO_BUYER, RLUSD_ID, "RLUSD");
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Convert everything back
    const sellerMMF = balStart.sellerBalances.mmfConfidentialSpendable + balStart.sellerBalances.mmfConfidentialInbox
     , sellerRLUSD = balStart.sellerBalances.rlusdConfidentialSpendable + balStart.sellerBalances.rlusdConfidentialInbox
     , buyerMMF = balStart.buyerBalances.mmfConfidentialSpendable + balStart.buyerBalances.mmfConfidentialInbox
     , buyerRLUSD = balStart.buyerBalances.rlusdConfidentialSpendable + balStart.buyerBalances.rlusdConfidentialInbox;
    if(sellerMMF > 0) await convertBack(custody, WALLET_REPO_SELLER, MMF_ID, "MMF", sellerMMF.toString());
    if(sellerRLUSD > 0) await convertBack(custody, WALLET_REPO_SELLER, RLUSD_ID, "RLUSD", sellerRLUSD.toString());
    if(buyerMMF > 0) await convertBack(custody, WALLET_REPO_BUYER, MMF_ID, "MMF", buyerMMF.toString());
    if(buyerRLUSD > 0) await convertBack(custody, WALLET_REPO_BUYER, RLUSD_ID, "RLUSD", buyerRLUSD.toString());

    console.log("Cleared Positions:");
    await printBalances(custody);
  } catch (error) {
    console.log(error)
  }
}

async function convertBack(custody: RippleCustody, wallet: Wallet, mptId: string, txtMPT: string, amount: string) {
  console.log(`ConfidentialMPTConvertBack ${amount} ${txtMPT} (${wallet.name})`);
  const transaction = await proposeAndWait(
    custody,
    `ConfidentialMPTConvertBack ${amount} ${txtMPT} (${wallet.name})`,
    {
      Account: wallet.address,
      operation: {
        type: "ConfidentialMPTConvertBack",
        tokenIdentifier: { issuanceId: mptId, type: "MPTokenIssuanceId" },
        amount,
      },
    },
  )
}

main().catch((err) => console.log(err))
