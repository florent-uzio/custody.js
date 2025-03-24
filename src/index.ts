import { v4 as uuidv4 } from "uuid"
import { AuthService } from "./services/auth.service"
import { CryptoService } from "./services/keypair.service"
// const privateKeyPem = `-----BEGIN EC PRIVATE KEY-----
// MHQCAQEEINFsnpHF+1B6yBZ/O3AbcdNkHrEdgqLiKtk7Sa5xmCMKoAcGBSuBBAAK
// oUQDQgAE1vVFPhh0oYSg13YDMBXDdW4fWXwckuKiGI6J8bZKUyGLisARc1xiMYBu
// gs4ZryKI4Wxzu1NIbSqbUysp+H+gAw==
// -----END EC PRIVATE KEY-----`

// const privateKey2 = `-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEINFsnpHF+1B6yBZ/O3AbcdNkHrEdgqLiKtk7Sa5xmCMKoAcGBSuBBAAKoUQDQgAE1vVFPhh0oYSg13YDMBXDdW4fWXwckuKiGI6J8bZKUyGLisARc1xiMYBugs4ZryKI4Wxzu1NIbSqbUysp+H+gAw==\n-----END EC PRIVATE KEY-----`

// const publicKey =
//   "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE1vVFPhh0oYSg13YDMBXDdW4fWXwckuKiGI6J8bZKUyGLisARc1xiMYBugs4ZryKI4Wxzu1NIbSqbUysp+H+gAw=="

const publicKey =
  "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOYGYFXBKH/kp/0IYEPmi/UWlnoBzqPkVJQ+MkITioyyiLLBHnjDCkRzJyPPlW/uQc4WzaW/1P9GBo8oHh4P+qw=="

const privateKKey = `-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIPiVH02UDoRm2ENdox12UHyTB7EDY3jEGJKECYLGWwvwoAoGCCqGSM49AwEHoUQDQgAEOYGYFXBKH/kp/0IYEPmi/UWlnoBzqPkVJQ+MkITioyyiLLBHnjDCkRzJyPPlW/uQc4WzaW/1P9GBo8oHh4P+qw==\n-----END EC PRIVATE KEY-----`

const main = async () => {
  try {
    const uuid = uuidv4()
    const keypairService = new CryptoService()
    const { signature } = keypairService.signMessage(privateKKey, uuid)
    console.log(signature)

    // Initialize services
    const authService = new AuthService()
    // const apiService = new ApiService(authService)

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
  } catch (error) {
    console.error("Error in main execution:", error)
  }
}

main()
