import type { CustodySigner } from "../../ripple-custody.types.js"
import { type AuthFormData, AuthService } from "../auth/index.js"
import { type KeypairAlgorithm } from "../keypairs/index.js"

export type PartialAuthFormData = Pick<AuthFormData, "publicKey"> &
  Partial<Pick<AuthFormData, "challenge">>

export type ApiServiceOptions = {
  authFormData: PartialAuthFormData
  authService: AuthService
  apiUrl: string
  keypairAlgorithm?: KeypairAlgorithm
  /**
   * Private key (PEM) the SDK signs with internally. Provide exactly one of
   * `privateKey` or `signer`.
   */
  privateKey?: string
  /**
   * External signer callback. Provide exactly one of `privateKey` or `signer`.
   */
  signer?: CustodySigner
  /**
   * Request timeout in milliseconds.
   * If not provided, defaults to 30 seconds.
   */
  timeout?: number
  /**
   * When `true`, every outbound API request is logged to `console.log`.
   */
  debug?: boolean
}
