import { type AuthFormData, AuthService } from "../auth/index.js"
import { type KeypairAlgorithm } from "../keypairs/index.js"

export type PartialAuthFormData = Pick<AuthFormData, "publicKey"> &
  Partial<Pick<AuthFormData, "challenge">>

export type ApiServiceOptions = {
  authFormData: PartialAuthFormData
  authService: AuthService
  baseUrl: string
  keypairAlgorithm?: KeypairAlgorithm
  privateKey: string
}
