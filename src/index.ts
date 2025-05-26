import { config } from "dotenv"
import { RippleCustody } from "./ripple-custody"
import { KeypairAlgorithm } from "./services"
config()

const privateKey = process.env.PRIVATE_KEY ?? ""
const publicKey = process.env.PUBLIC_KEY ?? ""
const domain = process.env.DOMAIN ?? ""

const run = true

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

  // try {
  //   const keypairService = new KeypairService()
  //   const uuid = "2ba68f22-e0f7-43ab-bdfe-9775354a6ccf"
  //   const signature = keypairService.sign(privateKey, uuid)
  //   console.log("Signature:", signature)
  // } catch (error) {
  //   console.error("Error signing message:", error)
  // }

  // try {
  //   const uuid = uuidv4()

  //   const keypairService = new Secp256k1Service()
  //   if (!run) {
  //     const res = keypairService.generateSecp256k1KeyPair()

  //     console.log(res.privateKey)
  //     console.log(res.publicKey)
  //   }
  //   if (run) {
  //     const { signature } = keypairService.signMessage(privateKey, uuid)
  //     // console.log(signature)

  //     // Initialize services
  //     const authService = new AuthService()
  //     const apiService = new ApiService(authService, domain)

  //     // Initial authentication
  //     const authData = {
  //       signature: signature,
  //       challenge: uuid,
  //       publicKey,
  //     }

  //     const token = await authService.getToken(authData)
  //     console.log(token)
  //     console.log("Initial authentication successful")

  //     // Make API calls
  //     // const domains = await apiService.getDomains()
  //     // console.log("Domains:", domains)

  //     // const users = await apiService.getUsers()
  //     // console.log("Users:", users)
  //   }
  // } catch (error) {
  //   console.error("Error in main execution:", error)
  // }
}

main()
