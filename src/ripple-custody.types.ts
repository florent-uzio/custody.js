import type { AuthFormData } from "./services/auth/auth.service.types.js"
import type { KeypairAlgorithm } from "./services/keypairs/keypairs.types.js"

export type SDKConfig = {
  apiBaseUrl: string
  authBaseUrl: string
  keypairAlgorithm?: KeypairAlgorithm
  privateKey: string
} & Pick<AuthFormData, "publicKey">
