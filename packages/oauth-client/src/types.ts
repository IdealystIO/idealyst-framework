export interface OAuthConfig {
  // OAuth endpoint URL (e.g., "https://api.yourapp.com/auth/google")
  oauthUrl: string
  
  // Redirect URL for the client app (e.g., "com.yourapp://oauth/callback")
  redirectUrl: string
  
  // Optional additional parameters to send to OAuth endpoint
  additionalParameters?: Record<string, string>
}

export interface OAuthResult {
  code: string
  state?: string
}

export interface OAuthClient {
  authorize(): Promise<OAuthResult>
}