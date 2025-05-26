import { AuthFormData, KeypairAlgorithm } from "./services"

export type SDKConfig = {
  apiBaseUrl: string
  authBaseUrl: string
  keypairAlgorithm?: KeypairAlgorithm
  privateKey: string
} & Pick<AuthFormData, "publicKey">
