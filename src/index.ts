import { config } from "dotenv"
import { RippleCustody } from "./ripple-custody.js"
config()

const privateKey = process.env.PRIVATE_KEY ?? ""
const publicKey = process.env.PUBLIC_KEY ?? ""

const main = async () => {
  // const ke = new KeypairService("secp256k1")
  // const { privateKey, publicKey } = ke.generate()

  // const resp = KeypairService.detectKeyType(privateKey)
  // console.log("Detected Key Type:", resp)
  // console.log("Generated Keypair:", { privateKey, publicKey })
  const custody = new RippleCustody({
    baseUrl: "metaco.8rey67.m3t4c0.services",
    privateKey,
    publicKey,
  })
  const domains = await custody.getDomains()
  console.log("Domains:", JSON.stringify(domains))
}

// main()
