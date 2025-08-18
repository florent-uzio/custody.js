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

  const id = await custody.createIntent({
    request: {
      type: "Propose",
      targetDomainId: "",
      payload: {
        type: "v0_CreateTransactionOrder",
        parameters: {
          type: "XRPL",
          amount: "1000",
          operation: {
            type: "TrustSet",
            limitAmount: {
              currency: {
                code: "sss",
                issuer: "d",
                type: "Currency"
              },
              value: "11000"
            },
            enableRippling: true,
            flags: ["tfClearFreeze"]
          },feeStrategy: {
            priority: "Medium",
            "type": "Priority"
          },
          memos: [],
        },
        accountId: "2",
       id: "1",
       customProperties: {}
      },
      author: {
        id: "1",
        domainId: "1"
      },
      expiryAt: "2025-08-18T00:00:00Z",
      customProperties: {},
      id: "1"
    },
    signature: ""
  })
}

// main()
