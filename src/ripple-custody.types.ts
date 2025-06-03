import type { AuthFormData } from "./services/auth/auth.service.types.js"

export type SDKConfig = {
  apiBaseUrl: string
  authBaseUrl: string
  privateKey: string
} & Pick<AuthFormData, "publicKey">
