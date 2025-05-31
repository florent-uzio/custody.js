import { config } from "dotenv"
import { KeypairAlgorithm, KeypairService } from "./services/index.js"
config()

const privateKey = process.env.PRIVATE_KEY ?? ""
const publicKey = process.env.PUBLIC_KEY ?? ""

const main = async () => {
  const ke = new KeypairService(KeypairAlgorithm.SECP256K1)
  const { privateKey, publicKey } = ke.generate()

  const resp = ke.detectKeyType(privateKey)
  console.log("Detected Key Type:", resp)
  // console.log("Generated Keypair:", { privateKey, publicKey })
  // const custody = new RippleCustody({
  //   apiBaseUrl: "https://api.metaco.8rey67.m3t4c0.services",
  //   authBaseUrl: "https://auth.metaco.8rey67.m3t4c0.services",
  //   keypairAlgorithm: KeypairAlgorithm.ED25519,
  //   privateKey,
  //   publicKey,
  // })
  // const domains = await custody.getDomains()
  // console.log("Domains:", JSON.stringify(domains))
}

main()
