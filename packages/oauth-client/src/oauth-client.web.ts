import type { OAuthClient, OAuthConfig, OAuthResult } from './types'

export class WebOAuthClient implements OAuthClient {
  private config: OAuthConfig

  constructor(config: OAuthConfig) {
    this.config = config
  }

  async authorize(): Promise<OAuthResult> {
    const state = this.generateState()

    // Check if we're already in a callback
    const callbackData = this.checkForCallback()
    
    if (callbackData) {
      const { code, error, returnedState } = callbackData
      
      if (error) {
        throw new Error(`OAuth error: ${error}`)
      }

      if (code) {
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
        
        return { 
          code,
          state: returnedState || undefined
        }
      }
    }

    // Build OAuth URL and redirect
    const oauthUrl = this.buildOAuthUrl(state)
    window.location.href = oauthUrl
    
    // This won't be reached due to redirect
    throw new Error('Authorization flow initiated')
  }

  private checkForCallback(): { code?: string; error?: string; returnedState?: string } | null {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    const state = urlParams.get('state')
    
    if (code || error) {
      return {
        code: code || undefined,
        error: error || undefined,
        returnedState: state || undefined,
      }
    }
    
    return null
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