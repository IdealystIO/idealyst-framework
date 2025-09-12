import type { OAuthClient, OAuthConfig, OAuthResult } from './types'
import { Linking } from 'react-native'

export class NativeOAuthClient implements OAuthClient {
  private config: OAuthConfig

  constructor(config: OAuthConfig) {
    this.config = config
  }

  async authorize(): Promise<OAuthResult> {
    const state = this.generateState()
    const oauthUrl = this.buildOAuthUrl(state)
    
    // Open OAuth URL in system browser
    await Linking.openURL(oauthUrl)
    
    // Wait for deep link callback
    const callbackData = await this.waitForDeepLinkCallback()
    
    if (callbackData.error) {
      throw new Error(`OAuth error: ${callbackData.error}`)
    }
    
    if (callbackData.code) {
      return {
        code: callbackData.code,
        state: callbackData.state
      }
    }
    
    throw new Error('No authorization code received')
  }

  private async waitForDeepLinkCallback(): Promise<{ code?: string; error?: string; state?: string }> {
    return new Promise((resolve, reject) => {
      let subscription: any
      
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
      })

      // Listen for subsequent deep links
      subscription = Linking.addEventListener('url', handleUrl)

      // Timeout after 5 minutes
      setTimeout(() => {
        cleanup()
        reject(new Error('OAuth timeout - user did not complete authorization'))
      }, 5 * 60 * 1000)
    })
  }

  private parseDeepLink(url: string): { code?: string; error?: string; state?: string } | null {
    try {
      const parsedUrl = new URL(url)
      
      // Check if this is our OAuth callback
      const expectedScheme = new URL(this.config.redirectUrl).protocol.slice(0, -1)
      if (parsedUrl.protocol.slice(0, -1) !== expectedScheme) {
        return null
      }

      // Extract OAuth parameters
      const code = parsedUrl.searchParams.get('code')
      const error = parsedUrl.searchParams.get('error')
      const state = parsedUrl.searchParams.get('state')

      if (!code && !error) {
        return null
      }

      return { 
        code: code || undefined, 
        error: error || undefined, 
        state: state || undefined 
      }
    } catch (error) {
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