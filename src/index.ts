import { config } from "dotenv"
import { RippleCustody } from "./ripple-custody"
config()

const privateKey = process.env.PRIVATE_KEY ?? ""
const publicKey = process.env.PUBLIC_KEY ?? ""
const domain = process.env.DOMAIN ?? ""

const run = true

const main = async () => {
  const custody = new RippleCustody()
  const domains = await custody.getDomains()
  console.log("Domains:", domains)
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
