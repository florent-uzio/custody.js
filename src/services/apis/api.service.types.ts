import type {
  BeforeSignHook,
  CustodyDebugLogger,
  CustodySigner,
} from "../../ripple-custody.types.js"
import { type AuthFormData, AuthService } from "../auth/index.js"
import { type KeypairAlgorithm } from "../keypairs/index.js"

export type PartialAuthFormData = Pick<AuthFormData, "publicKey"> &
  Partial<Pick<AuthFormData, "challenge">>

export type ApiServiceOptions = {
  authFormData: PartialAuthFormData
  /**
   * Escape hatch applied to a request payload just before it is canonicalized
   * and signed. Off unless provided.
   */
  beforeSign?: BeforeSignHook
  authService: AuthService
  apiUrl: string
  /**
   * Logger for every exchange on the API client. Already resolved from the
   * client's `debug` option; `undefined` means debugging is off.
   */
  debug?: CustodyDebugLogger
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
}
