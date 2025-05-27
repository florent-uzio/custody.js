import { AuthFormData } from "./services/auth/auth.service.types"
import { KeypairAlgorithm } from "./services/keypairs/keypairs.types"

export type SDKConfig = {
  apiBaseUrl: string
  authBaseUrl: string
  keypairAlgorithm?: KeypairAlgorithm
  privateKey: string
} & Pick<AuthFormData, "publicKey">
