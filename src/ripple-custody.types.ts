import { AuthCredentials, CryptoAlgorithm } from "./services"

export interface SDKConfig {
  credentials: AuthCredentials
  apiBaseUrl?: string
  authBaseUrl?: string
  authData: AuthData
  cryptoAlgorithm?: CryptoAlgorithm
}

export type AuthData = {
  challenge?: string
  publicKey: string
  privateKey: string
}
