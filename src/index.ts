import { config } from "dotenv"
import { RippleCustody } from "./ripple-custody"
import { KeypairAlgorithm } from "./services"
config()

const privateKey = process.env.PRIVATE_KEY ?? ""
const publicKey = process.env.PUBLIC_KEY ?? ""

const main = async () => {
  const custody = new RippleCustody({
    apiBaseUrl: "https://api.metaco.8rey67.m3t4c0.services",
    authBaseUrl: "https://auth.metaco.8rey67.m3t4c0.services",
    keypairAlgorithm: KeypairAlgorithm.SECP256K1,
    privateKey,
    publicKey,
  })
  const domains = await custody.getDomains()
  console.log("Domains:", domains)
}

main()
