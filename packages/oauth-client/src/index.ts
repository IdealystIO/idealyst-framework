export * from './types'
export * from './storage'

import type { OAuthConfig, OAuthClient, StorageAdapter } from './types'
import { WebOAuthClient } from './web-client'
import { NativeOAuthClient } from './native-client'
import { createDefaultStorage } from './storage'

export function createOAuthClient(
  config: OAuthConfig, 
  storage?: StorageAdapter
): OAuthClient {
  const storageAdapter = storage || createDefaultStorage()
  
  // Check if we're in React Native environment
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return new NativeOAuthClient(config, storageAdapter)
  }
  
  // Default to web client
  return new WebOAuthClient(config, storageAdapter)
}

// Common provider configurations
export const providers = {
  google: {
    issuer: 'https://accounts.google.com',
    scopes: ['openid', 'profile', 'email'],
  },
  
  github: {
    issuer: 'https://github.com',
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    scopes: ['user'],
  },
  
  microsoft: {
    issuer: 'https://login.microsoftonline.com/common/v2.0',
    scopes: ['openid', 'profile', 'email'],
  },
  
  auth0: (domain: string) => ({
    issuer: `https://${domain}`,
    scopes: ['openid', 'profile', 'email'],
  }),
  
  okta: (domain: string) => ({
    issuer: `https://${domain}`,
    scopes: ['openid', 'profile', 'email'],
  }),
} as const

export { WebOAuthClient } from './web-client'
export { NativeOAuthClient } from './native-client'