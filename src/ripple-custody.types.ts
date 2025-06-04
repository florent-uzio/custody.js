import type { AuthFormData } from "./services/auth/auth.service.types.js"

export type RippleCustodyClientOptions = {
  /**
   * Base URL for the API endpoints
   *
   * Example: "https://metaco.8rey62.m3t4c0.services"
   */
  baseUrl: string
  /**
   * Private key for signing requests
   */
  privateKey: string
} & Pick<AuthFormData, "publicKey">
