export interface OAuthConfig {
  clientId: string
  redirectUrl: string
  additionalParameters?: Record<string, string>
  customHeaders?: Record<string, string>
  scopes?: string[]
  
  // Provider endpoints
  issuer: string
  authorizationEndpoint?: string
  tokenEndpoint?: string
  revocationEndpoint?: string
  endSessionEndpoint?: string
  
  // Mobile-specific  
  androidPackageName?: string
  iosUrlScheme?: string
}

export interface OAuthTokens {
  accessToken: string
  refreshToken?: string
  idToken?: string
  tokenType?: string
  expiresAt?: Date
  scopes?: string[]
}

export interface OAuthResult {
  tokens: OAuthTokens
  user?: any
}

export interface OAuthClient {
  authorize(): Promise<OAuthResult>
  refresh(refreshToken: string): Promise<OAuthResult>
  revoke(token: string): Promise<void>
  logout(): Promise<void>
  getStoredTokens(): Promise<OAuthTokens | null>
  clearStoredTokens(): Promise<void>
}

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}