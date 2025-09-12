# @idealyst/oauth-client

Universal OAuth2 client for web and React Native applications with minimal server requirements.

## Features

- 🌐 **Universal**: Works on both web and React Native with the same API
- 🖥️ **Minimal Server**: Server only needs to redirect - no token handling required
- 🔗 **Deep Link Support**: Handles mobile OAuth callbacks via custom URL schemes  
- 🔐 **Secure**: Uses PKCE flow, client exchanges tokens directly with OAuth provider
- 🏪 **Storage**: Automatic token storage with customizable adapters
- 🔄 **Refresh**: Direct token refresh with OAuth provider
- 🎯 **TypeScript**: Fully typed for better developer experience

## Installation

```bash
npm install @idealyst/oauth-client
# or
yarn add @idealyst/oauth-client
```

### Additional Dependencies

#### For React Native:
```bash
npm install @react-native-async-storage/async-storage
```

#### For Web:
No additional dependencies required.

## Quick Start

```typescript
import { createOAuthClient } from '@idealyst/oauth-client'

const client = createOAuthClient({
  apiBaseUrl: 'https://api.yourapp.com',
  provider: 'google', // Your server endpoint: /auth/google (just redirects)
  redirectUrl: 'com.yourapp://oauth/callback',
  
  // OAuth provider config for direct token exchange
  issuer: 'https://accounts.google.com',
  clientId: 'your-google-client-id',
  
  scopes: ['profile', 'email'],
})

// Works on both web and mobile!
const result = await client.authorize()
console.log('Access token:', result.tokens.accessToken)
```

## How It Works

This library uses a hybrid approach that minimizes server requirements:

### Web Flow:
1. Client redirects to `GET /api/auth/google?redirect_uri=com.yourapp://oauth/callback&state=xyz&code_challenge=abc`
2. Server redirects to Google OAuth with server's client credentials + client's PKCE challenge
3. Google redirects back to `com.yourapp://oauth/callback?code=123&state=xyz`
4. Client automatically detects callback and exchanges code directly with Google using PKCE

### Mobile Flow:
1. App opens browser to `GET /api/auth/google?redirect_uri=com.yourapp://oauth/callback&state=xyz&code_challenge=abc`
2. Server redirects to Google OAuth with server's client credentials + client's PKCE challenge
3. Google redirects back to `com.yourapp://oauth/callback?code=123&state=xyz`
4. Mobile OS opens app via deep link, client exchanges code directly with Google using PKCE

## Minimal Server Setup

Your server only needs **ONE simple endpoint**:

### GET `/auth/{provider}` - OAuth Redirect

```javascript
app.get('/auth/:provider', (req, res) => {
  const { redirect_uri, state, scope, code_challenge, code_challenge_method } = req.query
  
  // Build OAuth URL with your server's credentials + client's PKCE
  const authUrl = buildOAuthUrl(req.params.provider, {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirect_uri, // Client's redirect URI
    state: state, // Client's state for CSRF protection
    scope: scope || 'profile email',
    response_type: 'code',
    code_challenge: code_challenge, // Client's PKCE challenge
    code_challenge_method: code_challenge_method || 'S256',
  })
  
  res.redirect(authUrl)
})
```

That's it! No token exchange, no callbacks, no database - just a simple redirect.

## React Native Setup

### iOS Configuration

Add URL scheme to your `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.yourapp.oauth</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.yourapp</string>
    </array>
  </dict>
</array>
```

### Android Configuration

Add intent filter to `android/app/src/main/AndroidManifest.xml`:

```xml
<activity android:name=".MainActivity">
  <intent-filter android:label="oauth_callback">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.yourapp" />
  </intent-filter>
</activity>
```

### Deep Link Handling (Automatic)

The client automatically handles OAuth deep links. The deep link handler is built-in and requires no additional setup.

## API Reference

### createOAuthClient(config, storage?)

```typescript
const client = createOAuthClient({
  // Your server (just redirects)
  apiBaseUrl: 'https://api.yourapp.com',
  provider: 'google',
  redirectUrl: 'com.yourapp://oauth/callback',
  
  // OAuth provider config (for direct token exchange)  
  issuer: 'https://accounts.google.com',
  clientId: 'your-google-client-id',
  tokenEndpoint: 'https://oauth2.googleapis.com/token', // Optional
  
  // Optional
  scopes: ['profile', 'email'],
  additionalParameters: { prompt: 'consent' },
  customHeaders: { 'Authorization': 'Bearer api-key' },
})
```

### OAuthClient Methods

#### authorize()
Initiates the OAuth flow and returns tokens.

```typescript
const result = await client.authorize()
// result.tokens: { accessToken, refreshToken, idToken, expiresAt, ... }
```

#### refresh(refreshToken)
Refreshes an expired access token directly with OAuth provider.

```typescript
const result = await client.refresh(refreshToken)
```

#### getStoredTokens()
Retrieves stored tokens from local storage.

```typescript
const tokens = await client.getStoredTokens()
if (tokens?.expiresAt && tokens.expiresAt < new Date()) {
  // Token is expired, refresh it
}
```

#### clearStoredTokens()
Clears stored tokens from local storage.

```typescript
await client.clearStoredTokens()
```

#### logout()
Clears stored tokens (server handles actual logout/revocation).

```typescript
await client.logout()
```

## Provider Examples

### Google OAuth

```typescript
const client = createOAuthClient({
  apiBaseUrl: 'https://api.yourapp.com',
  provider: 'google',
  redirectUrl: 'com.yourapp://oauth/callback',
  
  issuer: 'https://accounts.google.com',
  clientId: 'your-google-client-id',
  scopes: ['profile', 'email'],
})
```

### GitHub OAuth

```typescript
const client = createOAuthClient({
  apiBaseUrl: 'https://api.yourapp.com',
  provider: 'github',
  redirectUrl: 'com.yourapp://oauth/callback',
  
  issuer: 'https://github.com',
  clientId: 'your-github-client-id',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  scopes: ['user', 'user:email'],
})
```

## Token Management

```typescript
async function getValidTokens() {
  const storedTokens = await client.getStoredTokens()
  
  if (storedTokens) {
    // Check if expired
    if (storedTokens.expiresAt && storedTokens.expiresAt < new Date()) {
      if (storedTokens.refreshToken) {
        try {
          const refreshed = await client.refresh(storedTokens.refreshToken)
          return refreshed.tokens
        } catch (error) {
          // Refresh failed, need to re-authenticate
          await client.clearStoredTokens()
        }
      }
    } else {
      return storedTokens
    }
  }

  // No valid tokens, start OAuth flow
  const result = await client.authorize()
  return result.tokens
}
```

## Error Handling

```typescript
try {
  const result = await client.authorize()
} catch (error) {
  if (error.message.includes('User cancelled')) {
    // User cancelled the authorization
  } else if (error.message.includes('Invalid state')) {
    // CSRF protection triggered  
  } else if (error.message.includes('timeout')) {
    // User didn't complete OAuth in time (mobile)
  } else {
    // Other OAuth error
  }
}
```

## Security Benefits

✅ **No client secrets in client code** - Only client ID needed  
✅ **PKCE protection** - Secure code exchange without client secrets  
✅ **CSRF protection** - Uses state parameter  
✅ **Direct token exchange** - Client communicates directly with OAuth provider  
✅ **Minimal server attack surface** - Server only redirects, doesn't handle tokens  

## TypeScript

```typescript
import type { 
  ServerOAuthConfig,
  OAuthTokens, 
  OAuthResult, 
  OAuthClient 
} from '@idealyst/oauth-client'
```

## License

MIT