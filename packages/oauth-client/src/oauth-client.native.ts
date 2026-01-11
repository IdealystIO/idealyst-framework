import type { OAuthClient, OAuthConfig, OAuthResult, OAuthCallbackParams } from './types'
import { Linking } from 'react-native'

export class NativeOAuthClient<T = OAuthResult> implements OAuthClient<T> {
  private config: OAuthConfig<T>

  constructor(config: OAuthConfig<T>) {
    this.config = config
  }

  async authorize(): Promise<T> {
    const state = this.generateState()
    const oauthUrl = this.buildOAuthUrl(state)

    // Open OAuth URL in system browser
    await Linking.openURL(oauthUrl)

    // Wait for deep link callback
    const callbackParams = await this.waitForDeepLinkCallback()

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

  private async waitForDeepLinkCallback(): Promise<OAuthCallbackParams> {
    return new Promise((resolve, reject) => {
      let subscription: any
      let timeoutId: NodeJS.Timeout | null = null
      
      const handleUrl = (event: { url: string }) => {
        const callbackData = this.parseDeepLink(event.url)
        if (callbackData) {
          cleanup()
          resolve(callbackData)
        }
      }

      const cleanup = () => {
        if (subscription?.remove) {
          subscription.remove()
        } else if (subscription) {
          // For newer React Native versions
          subscription()
        }
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }

      // Check for initial URL (if app was opened from deep link)
      Linking.getInitialURL().then((url: string | null) => {
        if (url) {
          const callbackData = this.parseDeepLink(url)
          if (callbackData) {
            cleanup()
            resolve(callbackData)
            return
          }
        }
      }).catch(error => {
        console.warn('Failed to get initial URL:', error)
      })

      // Listen for subsequent deep links
      subscription = Linking.addEventListener('url', handleUrl)

      // Timeout after 5 minutes
      timeoutId = setTimeout(() => {
        cleanup()
        reject(new Error('OAuth timeout - user did not complete authorization'))
      }, 5 * 60 * 1000)
    })
  }

  private parseDeepLink(url: string): OAuthCallbackParams | null {
    try {
      // Handle custom scheme URLs (e.g., com.myapp://oauth/callback?code=123)
      const parsedUrl = new URL(url)

      // Check if this is our OAuth callback
      const expectedScheme = new URL(this.config.redirectUrl).protocol.slice(0, -1)
      if (parsedUrl.protocol.slice(0, -1) !== expectedScheme) {
        return null
      }

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
      console.warn('Failed to parse deep link URL:', url, error)
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