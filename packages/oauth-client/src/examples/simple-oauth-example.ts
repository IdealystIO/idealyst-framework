// Import will resolve to index.web.ts or index.native.ts based on platform
import { createOAuthClient } from '../index'

// Example: Simple OAuth flow (works on both web and mobile)
export async function setupGoogleOAuth() {
  const client = createOAuthClient({
    oauthUrl: 'https://api.yourapp.com/auth/google', // Your server endpoint
    redirectUrl: 'com.yourapp://oauth/callback', // Same for web and mobile
    additionalParameters: {
      scope: 'profile email'
    }
  })

  try {
    // Works on both web and mobile:
    // 1. Redirects to your server endpoint
    // 2. Server redirects to Google OAuth 
    // 3. Google redirects back to com.yourapp://oauth/callback?code=xyz
    // 4. Client returns the code
    const result = await client.authorize()
    
    console.log('Authorization code:', result.code)
    console.log('State:', result.state)
    
    // Now you can exchange the code for tokens on your server
    return result.code
  } catch (error) {
    console.error('OAuth error:', error)
    throw error
  }
}

// Example: GitHub OAuth
export async function setupGitHubOAuth() {
  const client = createOAuthClient({
    oauthUrl: 'https://api.yourapp.com/auth/github',
    redirectUrl: 'com.yourapp://oauth/callback',
    additionalParameters: {
      scope: 'user user:email'
    }
  })

  const result = await client.authorize()
  return result.code
}

// Example: Custom OAuth provider
export async function setupCustomOAuth() {
  const client = createOAuthClient({
    oauthUrl: 'https://api.yourapp.com/auth/custom-provider',
    redirectUrl: 'com.yourapp://oauth/callback',
    additionalParameters: {
      scope: 'read write',
      prompt: 'consent'
    }
  })

  const result = await client.authorize()
  return result.code
}