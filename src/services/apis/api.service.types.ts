import { AuthFormData, AuthService } from "../auth"
import { KeypairAlgorithm } from "../keypairs"

export type PartialAuthFormData = //Omit<AuthFormData, "signature" | "challenge"> &
  Pick<AuthFormData, "publicKey"> & Partial<Pick<AuthFormData, "challenge">>

export type ApiServiceOptions = {
  authService: AuthService
  apiBaseUrl: string
  keypairAlgorithm?: KeypairAlgorithm
  authFormData: PartialAuthFormData
  privateKey: string
}
