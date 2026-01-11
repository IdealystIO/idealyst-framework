/**
 * Raw callback parameters from OAuth redirect
 * Contains all query parameters returned by the OAuth provider
 */
export type OAuthCallbackParams = Record<string, string | undefined>

/**
 * Default OAuth result with standard code and state
 */
export interface OAuthResult {
  code: string
  state?: string
}

/**
 * OAuth configuration options
 */
export interface OAuthConfig<T = OAuthResult> {
  // OAuth endpoint URL (e.g., "https://api.yourapp.com/auth/google")
  oauthUrl: string

  // Redirect URL for the client app (e.g., "com.yourapp://oauth/callback")
  redirectUrl: string

  // Optional additional parameters to send to OAuth endpoint
  additionalParameters?: Record<string, string>

  /**
   * Optional transformer to convert raw callback params to desired type
   * If not provided, returns all callback params as-is (typed as T)
   */
  transformCallback?: (params: OAuthCallbackParams) => T
}

/**
 * OAuth client interface with generic result type
 * @template T - The type returned from authorize(), defaults to OAuthResult
 */
export interface OAuthClient<T = OAuthResult> {
  authorize(): Promise<T>
}