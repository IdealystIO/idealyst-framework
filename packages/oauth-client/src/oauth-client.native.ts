import type { OAuthClient, OAuthConfig, OAuthResult, OAuthCallbackParams } from './types'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'

export class NativeOAuthClient<T = OAuthResult> implements OAuthClient<T> {
  private config: OAuthConfig<T>

  constructor(config: OAuthConfig<T>) {
    this.config = config
  }

  async authorize(): Promise<T> {
    const state = this.generateState()
    const oauthUrl = this.buildOAuthUrl(state)

    // Use InAppBrowser's auth session (ASWebAuthenticationSession on iOS, Chrome Custom Tabs on Android)
    const redirectScheme = new URL(this.config.redirectUrl).protocol.slice(0, -1)

    if (!(await InAppBrowser.isAvailable())) {
      throw new Error('InAppBrowser is not available on this device')
    }

    const result = await InAppBrowser.openAuth(oauthUrl, redirectScheme, {
      ephemeralWebSession: false,
      showTitle: false,
      enableUrlBarHiding: true,
      enableDefaultShare: false,
    })

    if (result.type === 'cancel' || result.type === 'dismiss') {
      throw new Error('User cancelled the authorization')
    }

    if (result.type !== 'success' || !result.url) {
      throw new Error('OAuth flow failed unexpectedly')
    }

    const callbackParams = this.parseRedirectUrl(result.url)

    if (!callbackParams) {
      throw new Error('Failed to parse OAuth callback parameters')
    }

    if (callbackParams.error) {
      throw new Error(`OAuth error: ${callbackParams.error}`)
    }

    // Transform callback params if transformer provided, otherwise return as-is
    if (this.config.transformCallback) {
      return this.config.transformCallback(callbackParams)
    }

    // Default behavior: return all callback params as T
    return callbackParams as T
  }

  private parseRedirectUrl(url: string): OAuthCallbackParams | null {
    try {
      const parsedUrl = new URL(url)

      // Collect all query parameters
      const params: OAuthCallbackParams = {}

      // Get all parameters from query string
      parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value
      })

      // Also check the hash fragment for parameters (some OAuth providers use this)
      if (Object.keys(params).length === 0 && parsedUrl.hash) {
        const hashParams = new URLSearchParams(parsedUrl.hash.substring(1))
        hashParams.forEach((value, key) => {
          params[key] = value
        })
      }

      // Return null if no parameters found
      if (Object.keys(params).length === 0) {
        return null
      }

      return params
    } catch (error) {
      console.warn('Failed to parse redirect URL:', url, error)
      return null
    }
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
