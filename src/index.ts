import { config } from "dotenv"
import { v4 as uuidv4 } from "uuid"
import { ApiService, AuthService } from "./services"
import { CryptoService } from "./services/keypair.service"
config()

const privateKey = process.env.PRIVATE_KEY ?? ""
const publicKey = process.env.PUBLIC_KEY ?? ""
const domain = process.env.DOMAIN ?? ""

const run = true

const main = async () => {
  try {
    const uuid = uuidv4()

    const keypairService = new CryptoService()
    if (!run) {
      const res = keypairService.generateSecp256k1KeyPair()

      console.log(res.privateKey)
      console.log(res.publicKey)
    }
    if (run) {
      const { signature } = keypairService.signMessage(privateKey, uuid)
      // console.log(signature)

      // Initialize services
      const authService = new AuthService()
      const apiService = new ApiService(authService, domain)

      // Initial authentication
      const authData = {
        signature: signature,
        challenge: uuid,
        publicKey,
      }

      const token = await authService.getToken(authData)
      console.log(token)
      console.log("Initial authentication successful")

      // Make API calls
      // const domains = await apiService.getDomains()
      // console.log("Domains:", domains)

      // const users = await apiService.getUsers()
      // console.log("Users:", users)
    }
  } catch (error) {
    console.error("Error in main execution:", error)
  }
}

main()
