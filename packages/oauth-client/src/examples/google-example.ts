import { createOAuthClient, providers } from '../index'

// Example: Google OAuth - works on both web and mobile
export async function setupGoogleOAuth() {
  const client = createOAuthClient({
    ...providers.google,
    clientId: 'your-google-client-id',
    redirectUrl: 'com.yourapp://oauth/callback', // Mobile
    // redirectUrl: 'https://yourapp.com/auth/callback', // Web
    scopes: ['openid', 'profile', 'email'],
  })

  try {
    // Authorize user - same API on both platforms!
    const result = await client.authorize()
    console.log('Access token:', result.tokens.accessToken)
    console.log('User info:', result.user)

    // Token management works the same on both platforms
    const storedTokens = await client.getStoredTokens()
    if (storedTokens) {
      console.log('Stored tokens:', storedTokens)
      
      // Check if token needs refresh
      if (storedTokens.expiresAt && storedTokens.expiresAt < new Date()) {
        if (storedTokens.refreshToken) {
          const refreshed = await client.refresh(storedTokens.refreshToken)
          console.log('Refreshed tokens:', refreshed.tokens)
        }
      }
    }

    // Logout when done
    await client.logout()
    console.log('Logged out successfully')

  } catch (error) {
    console.error('OAuth error:', error)
  }
}

// Example: Multiple providers
export async function setupMultipleProviders() {
  const providers = [
    { name: 'Google', config: { ...providers.google, clientId: 'google-client-id' } },
    { name: 'GitHub', config: { ...providers.github, clientId: 'github-client-id' } },
    { name: 'Microsoft', config: { ...providers.microsoft, clientId: 'ms-client-id' } },
  ]

  for (const provider of providers) {
    try {
      const client = createOAuthClient({
        ...provider.config,
        redirectUrl: 'com.yourapp://oauth/callback',
      })
      
      const result = await client.authorize()
      console.log(`${provider.name} login successful:`, result.tokens.accessToken)
      return { provider: provider.name, tokens: result.tokens }
    } catch (error) {
      console.warn(`${provider.name} login failed:`, error)
    }
  }
  
  throw new Error('All OAuth providers failed')
}

// Example: Custom provider configuration
export async function setupCustomProvider() {
  const client = createOAuthClient({
    issuer: 'https://your-oauth-server.com',
    clientId: 'your-client-id',
    redirectUrl: 'com.yourapp://oauth/callback',
    scopes: ['read', 'write'],
    additionalParameters: {
      prompt: 'consent',
    },
    customHeaders: {
      'X-Custom-Header': 'value',
    },
  })

  try {
    const result = await client.authorize()
    return result.tokens
  } catch (error) {
    console.error('Custom OAuth error:', error)
    throw error
  }
}

// Example: Platform-specific configuration
export async function setupPlatformSpecificOAuth() {
  // Check if we're on mobile or web and configure accordingly
  const isMobile = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
  
  const client = createOAuthClient({
    ...providers.google,
    clientId: 'your-google-client-id',
    redirectUrl: isMobile 
      ? 'com.yourapp://oauth/callback'  // Mobile deep link
      : 'https://yourapp.com/auth/callback', // Web callback
    scopes: ['openid', 'profile', 'email'],
    // Note: No client secret needed - PKCE provides security for public clients
  })

  return await client.authorize()
}