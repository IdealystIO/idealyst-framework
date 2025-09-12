import type { OAuthClient, OAuthConfig, OAuthResult, OAuthTokens, StorageAdapter } from './types'

export class WebOAuthClient implements OAuthClient {
  private config: OAuthConfig
  private storage: StorageAdapter
  private storageKey: string

  constructor(config: OAuthConfig, storage: StorageAdapter) {
    this.config = config
    this.storage = storage
    this.storageKey = `oauth_tokens_${config.clientId}`
  }

  async authorize(): Promise<OAuthResult> {
    const codeVerifier = this.generateCodeVerifier()
    const codeChallenge = await this.generateCodeChallenge(codeVerifier)
    const state = this.generateState()

    // Store PKCE values for later use
    sessionStorage.setItem('oauth_code_verifier', codeVerifier)
    sessionStorage.setItem('oauth_state', state)

    const authUrl = this.buildAuthUrl(codeChallenge, state)

    // Check if we're already in a redirect callback
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const returnedState = urlParams.get('state')
    const error = urlParams.get('error')

    if (error) {
      throw new Error(`OAuth error: ${error}`)
    }

    if (code && returnedState) {
      // Validate state
      const storedState = sessionStorage.getItem('oauth_state')
      if (storedState !== returnedState) {
        throw new Error('Invalid state parameter')
      }

      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code, codeVerifier)
      await this.storeTokens(tokens)

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)

      return { tokens }
    }

    // Redirect to authorization server
    window.location.href = authUrl
    
    // This won't be reached due to redirect, but TypeScript needs it
    throw new Error('Authorization flow initiated')
  }

  async refresh(refreshToken: string): Promise<OAuthResult> {
    const tokenEndpoint = this.config.tokenEndpoint || `${this.config.issuer}/token`
    
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.clientId,
    })

    // Note: Client secrets should NEVER be in client-side code
    // This is for public clients only (PKCE provides security)

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...this.config.customHeaders,
      },
      body: body.toString(),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const data = await response.json()
    const tokens = this.parseTokenResponse(data)
    await this.storeTokens(tokens)

    return { tokens }
  }

  async revoke(token: string): Promise<void> {
    const revokeEndpoint = this.config.revocationEndpoint || `${this.config.issuer}/revoke`
    
    const body = new URLSearchParams({
      token,
      client_id: this.config.clientId,
    })

    // Note: Client secrets should NEVER be in client-side code
    // Using public client flow only

    const response = await fetch(revokeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...this.config.customHeaders,
      },
      body: body.toString(),
    })

    if (!response.ok && response.status !== 404) {
      throw new Error(`Token revocation failed: ${response.statusText}`)
    }
  }

  async logout(): Promise<void> {
    const tokens = await this.getStoredTokens()
    
    if (tokens?.accessToken) {
      try {
        await this.revoke(tokens.accessToken)
      } catch (error) {
        console.warn('Failed to revoke access token:', error)
      }
    }

    if (tokens?.refreshToken) {
      try {
        await this.revoke(tokens.refreshToken)
      } catch (error) {
        console.warn('Failed to revoke refresh token:', error)
      }
    }

    await this.clearStoredTokens()

    // Redirect to end session endpoint if available
    if (this.config.endSessionEndpoint && tokens?.idToken) {
      const endSessionUrl = new URL(this.config.endSessionEndpoint)
      endSessionUrl.searchParams.set('id_token_hint', tokens.idToken)
      endSessionUrl.searchParams.set('post_logout_redirect_uri', this.config.redirectUrl)
      window.location.href = endSessionUrl.toString()
    }
  }

  async getStoredTokens(): Promise<OAuthTokens | null> {
    const stored = await this.storage.getItem(this.storageKey)
    if (!stored) return null

    try {
      const tokens = JSON.parse(stored)
      return {
        ...tokens,
        expiresAt: tokens.expiresAt ? new Date(tokens.expiresAt) : undefined,
      }
    } catch {
      return null
    }
  }

  async clearStoredTokens(): Promise<void> {
    await this.storage.removeItem(this.storageKey)
  }

  private async storeTokens(tokens: OAuthTokens): Promise<void> {
    const serializable = {
      ...tokens,
      expiresAt: tokens.expiresAt?.toISOString(),
    }
    await this.storage.setItem(this.storageKey, JSON.stringify(serializable))
  }

  private buildAuthUrl(codeChallenge: string, state: string): string {
    const authEndpoint = this.config.authorizationEndpoint || `${this.config.issuer}/auth`
    const url = new URL(authEndpoint)

    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', this.config.clientId)
    url.searchParams.set('redirect_uri', this.config.redirectUrl)
    url.searchParams.set('code_challenge', codeChallenge)
    url.searchParams.set('code_challenge_method', 'S256')
    url.searchParams.set('state', state)

    if (this.config.scopes?.length) {
      url.searchParams.set('scope', this.config.scopes.join(' '))
    }

    // Add additional parameters
    if (this.config.additionalParameters) {
      Object.entries(this.config.additionalParameters).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }

    return url.toString()
  }

  private async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<OAuthTokens> {
    const tokenEndpoint = this.config.tokenEndpoint || `${this.config.issuer}/token`
    
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUrl,
      client_id: this.config.clientId,
      code_verifier: codeVerifier,
    })

    // Note: Client secrets should NEVER be in client-side code
    // PKCE provides security for public clients

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...this.config.customHeaders,
      },
      body: body.toString(),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Token exchange failed: ${response.statusText} - ${errorData}`)
    }

    const data = await response.json()
    return this.parseTokenResponse(data)
  }

  private parseTokenResponse(data: any): OAuthTokens {
    const expiresAt = data.expires_in 
      ? new Date(Date.now() + data.expires_in * 1000)
      : undefined

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      tokenType: data.token_type || 'Bearer',
      expiresAt,
      scopes: data.scope ? data.scope.split(' ') : undefined,
    }
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  private generateState(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
}