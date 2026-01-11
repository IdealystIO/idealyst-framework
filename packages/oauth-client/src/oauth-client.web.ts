import type { OAuthClient, OAuthConfig, OAuthResult, OAuthCallbackParams } from './types'

export class WebOAuthClient<T = OAuthResult> implements OAuthClient<T> {
  private config: OAuthConfig<T>

  constructor(config: OAuthConfig<T>) {
    this.config = config
  }

  async authorize(): Promise<T> {
    const state = this.generateState()

    // Check if we're already in a callback
    const callbackParams = this.checkForCallback()

    if (callbackParams) {
      if (callbackParams.error) {
        throw new Error(`OAuth error: ${callbackParams.error}`)
      }

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)

      // Transform callback params if transformer provided, otherwise return as-is
      if (this.config.transformCallback) {
        return this.config.transformCallback(callbackParams)
      }

      // Default behavior: return all callback params as T
      return callbackParams as T
    }

    // Build OAuth URL and redirect
    const oauthUrl = this.buildOAuthUrl(state)
    window.location.href = oauthUrl

    // This won't be reached due to redirect
    throw new Error('Authorization flow initiated')
  }

  private checkForCallback(): OAuthCallbackParams | null {
    const urlParams = new URLSearchParams(window.location.search)
    const params: OAuthCallbackParams = {}

    // Collect all query parameters
    urlParams.forEach((value, key) => {
      params[key] = value
    })

    // Return null if no parameters found
    if (Object.keys(params).length === 0) {
      return null
    }

    return params
  }

  private buildOAuthUrl(state: string): string {
    const url = new URL(this.config.oauthUrl)
    
    url.searchParams.set('redirect_uri', this.config.redirectUrl)
    url.searchParams.set('state', state)

    // Add additional parameters
    if (this.config.additionalParameters) {
      Object.entries(this.config.additionalParameters).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }

    return url.toString()
  }

  private generateState(): string {
    // Generate random state for CSRF protection
    let result = ''
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}