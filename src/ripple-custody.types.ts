export type RippleCustodyClientOptions = {
  /**
   * API URL for the API endpoints
   *
   * Example: "https://api.metaco.8rey62.m3t4c0.services"
   */
  apiUrl: string
  /**
   * Authentication URL for the API endpoints
   *
   * Example: "https://auth.metaco.8rey62.m3t4c0.services"
   */
  authUrl: string
  /**
   * Private key for signing requests
   */
  privateKey: string
  /**
   * Public key for authentication
   */
  publicKey: string
  /**
   * Request timeout in milliseconds.
   *
   * @default 30000 (30 seconds)
   */
  timeout?: number
}
