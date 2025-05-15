export interface AuthCredentials {
  privateKeyPem?: string // Optional: SDK can generate if not provided
  publicKeyBase64?: string
}

export interface SDKConfig {
  credentials: AuthCredentials
  baseUrl?: string // Default: 'https://metaco.com'
  authBaseUrl?: string // Default: 'https://auth.metaco.com'
}
