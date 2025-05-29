import { config } from "dotenv"
import { RippleCustody } from "./ripple-custody.js"
import { KeypairAlgorithm } from "./services/index.js"
config()

const privateKey = process.env.PRIVATE_KEY ?? ""
const publicKey = process.env.PUBLIC_KEY ?? ""

const main = async () => {
  // const ke = new KeypairService(KeypairAlgorithm.ED25519)
  // const { privateKey, publicKey } = ke.generate()
  // console.log("Generated Keypair:", { privateKey, publicKey })
  const custody = new RippleCustody({
    apiBaseUrl: "https://api.metaco.8rey67.m3t4c0.services",
    authBaseUrl: "https://auth.metaco.8rey67.m3t4c0.services",
    keypairAlgorithm: KeypairAlgorithm.ED25519,
    privateKey,
    publicKey,
  })
  const domains = await custody.getDomains()
  console.log("Domains:", domains)
}

main()
