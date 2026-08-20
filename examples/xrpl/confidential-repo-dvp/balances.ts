import 'dotenv/config';
import { RippleCustody } from "@florent-uzio/custody";
import {
  DOMAIN_ID,
  WALLET_MMF_ISSUER,
  WALLET_REPO_BUYER,
  WALLET_REPO_SELLER,
  WALLET_SUBMITTER,
  working_data
} from "./config.js"
import {
  getXRPLAddress,
  refreshTickers
} from "./custody-helpers.js"
import { printBalances } from "./output.js"

//**** SUMMARY  ****/
// Get balances for the wallets related to the repo e2e example


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


//**** MAIN E2E PROCESS ****/
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
        console.log();
        await printBalances(custody);
        console.log();
    
    } catch (error) {
        console.log(error)
    }
}

main()

/** Fails fast on a missing .env entry rather than passing `undefined` on. */
export function requireEnv(name: string) {
  const value = process.env[name]
  if (value === undefined || value === "") throw new Error(`Missing environment variable ${name}.`)
  return value
}