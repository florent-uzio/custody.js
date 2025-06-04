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
  /**
   * Public key for authentication
   */
  publicKey: string
}
