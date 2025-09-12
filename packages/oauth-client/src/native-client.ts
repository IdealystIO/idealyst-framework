import { authorize, refresh, revoke, type AuthConfiguration, type AuthorizeResult } from 'react-native-app-auth'
import type { OAuthClient, OAuthConfig, OAuthResult, OAuthTokens, StorageAdapter } from './types'

export class NativeOAuthClient implements OAuthClient {
  private config: OAuthConfig
  private storage: StorageAdapter
  private storageKey: string
  private authConfig: AuthConfiguration

  constructor(config: OAuthConfig, storage: StorageAdapter) {
    this.config = config
    this.storage = storage
    this.storageKey = `oauth_tokens_${config.clientId}`
    
    this.authConfig = {
      issuer: config.issuer,
      clientId: config.clientId,
      redirectUrl: config.redirectUrl,
      scopes: config.scopes || [],
      additionalParameters: config.additionalParameters || {},
      customHeaders: config.customHeaders || {},
      usesPkce: true,
      usesStateParam: true,
      
      // Optional endpoint overrides
      ...(config.authorizationEndpoint && { 
        authorizationEndpoint: config.authorizationEndpoint 
      }),
      ...(config.tokenEndpoint && { 
        tokenEndpoint: config.tokenEndpoint 
      }),
      ...(config.revocationEndpoint && { 
        revocationEndpoint: config.revocationEndpoint 
      }),
      ...(config.endSessionEndpoint && { 
        endSessionEndpoint: config.endSessionEndpoint 
      }),
    }
  }

  async authorize(): Promise<OAuthResult> {
    try {
      const result: AuthorizeResult = await authorize(this.authConfig)
      
      const tokens: OAuthTokens = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        idToken: result.idToken,
        tokenType: result.tokenType || 'Bearer',
        expiresAt: result.accessTokenExpirationDate 
          ? new Date(result.accessTokenExpirationDate) 
          : undefined,
        scopes: result.scopes,
      }

      await this.storeTokens(tokens)

      return { 
        tokens,
        user: result.additionalParameters 
      }
    } catch (error: any) {
      throw new Error(`Authorization failed: ${error.message || error}`)
    }
  }

  async refresh(refreshToken: string): Promise<OAuthResult> {
    try {
      const result = await refresh(this.authConfig, {
        refreshToken,
      })

      const tokens: OAuthTokens = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken || refreshToken, // Keep original if not returned
        idToken: result.idToken,
        tokenType: result.tokenType || 'Bearer',
        expiresAt: result.accessTokenExpirationDate 
          ? new Date(result.accessTokenExpirationDate)
          : undefined,
        scopes: result.scopes,
      }

      await this.storeTokens(tokens)

      return { 
        tokens,
        user: result.additionalParameters 
      }
    } catch (error: any) {
      throw new Error(`Token refresh failed: ${error.message || error}`)
    }
  }

  async revoke(token: string): Promise<void> {
    try {
      await revoke(this.authConfig, {
        tokenToRevoke: token,
        sendClientId: true,
      })
    } catch (error: any) {
      // Some providers return errors for already revoked tokens
      // Don't throw unless it's a network error
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        throw new Error(`Token revocation failed: ${error.message || error}`)
      }
    }
  }

  async logout(): Promise<void> {
    const tokens = await this.getStoredTokens()
    
    // Revoke tokens if available
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
}