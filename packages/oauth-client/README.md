# @idealyst/oauth-client

Universal OAuth2 client for web and React Native applications with a single API.

## Features

- 🌐 **Universal**: Works on both web and React Native with the same API
- 🔐 **Secure**: Uses PKCE for mobile, supports client secrets for web
- 🏪 **Storage**: Automatic token storage with customizable adapters
- 🔄 **Refresh**: Automatic token refresh handling
- 🚪 **Logout**: Proper logout with token revocation
- 📱 **Mobile**: Uses `react-native-app-auth` for secure system browser flow
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
npm install react-native-app-auth @react-native-async-storage/async-storage
# Follow react-native-app-auth setup instructions for iOS/Android
```

#### For Web:
No additional dependencies required.

## Quick Start

```typescript
import { createOAuthClient, providers } from '@idealyst/oauth-client'

// Create OAuth client (works on both web and mobile)
const client = createOAuthClient({
  ...providers.google,
  clientId: 'your-google-client-id',
  redirectUrl: 'com.yourapp://oauth/callback', // Mobile
  // redirectUrl: 'http://localhost:3000/auth/callback', // Web
})

// Authorize user - same API on web and mobile!
try {
  const result = await client.authorize()
  console.log('Access token:', result.tokens.accessToken)
  console.log('User data:', result.user)
} catch (error) {
  console.error('Authorization failed:', error)
}
```

## API Reference

### createOAuthClient(config, storage?)

Creates a platform-specific OAuth client with a unified API.

```typescript
const client = createOAuthClient({
  issuer: 'https://accounts.google.com',
  clientId: 'your-client-id',
  redirectUrl: 'your-app://oauth',
  scopes: ['openid', 'profile', 'email'],
  
  // Optional
  additionalParameters: { prompt: 'consent' },
  customHeaders: { 'X-Custom': 'value' },
})
```

**⚠️ Security**: Client secrets are **never** used in this library. All flows use PKCE for security, which is the OAuth 2.1 standard for public clients.

### OAuthClient Methods

#### authorize()
Initiates the OAuth flow and returns tokens.

```typescript
const result = await client.authorize()
// result.tokens: { accessToken, refreshToken, idToken, expiresAt, ... }
// result.user: Additional user data (provider-specific)
```

#### refresh(refreshToken)
Refreshes an expired access token.

```typescript
const result = await client.refresh(refreshToken)
```

#### getStoredTokens()
Retrieves stored tokens from storage.

```typescript
const tokens = await client.getStoredTokens()
if (tokens?.expiresAt && tokens.expiresAt < new Date()) {
  // Token is expired, refresh it
}
```

#### revoke(token)
Revokes a specific token.

```typescript
await client.revoke(accessToken)
```

#### logout()
Logs out the user, revokes tokens, and clears storage.

```typescript
await client.logout()
```

#### clearStoredTokens()
Manually clears stored tokens.

```typescript
await client.clearStoredTokens()
```

## Provider Configurations

Pre-configured settings for popular OAuth providers:

```typescript
import { providers } from '@idealyst/oauth-client'

// Google
const googleClient = createOAuthClient({
  ...providers.google,
  clientId: 'your-google-client-id',
  redirectUrl: 'your-redirect-url',
})

// GitHub
const githubClient = createOAuthClient({
  ...providers.github,
  clientId: 'your-github-client-id',
  redirectUrl: 'your-redirect-url',
})

// Microsoft
const msClient = createOAuthClient({
  ...providers.microsoft,
  clientId: 'your-microsoft-client-id',
  redirectUrl: 'your-redirect-url',
})

// Auth0
const auth0Client = createOAuthClient({
  ...providers.auth0('your-domain.auth0.com'),
  clientId: 'your-auth0-client-id',
  redirectUrl: 'your-redirect-url',
})

// Okta
const oktaClient = createOAuthClient({
  ...providers.okta('dev-123.okta.com'),
  clientId: 'your-okta-client-id',
  redirectUrl: 'your-redirect-url',
})
```

## Custom Storage

By default, the library uses `localStorage` on web and `AsyncStorage` on mobile. You can provide a custom storage adapter:

```typescript
import { createOAuthClient } from '@idealyst/oauth-client'

const customStorage = {
  async getItem(key: string): Promise<string | null> {
    // Your storage implementation
  },
  async setItem(key: string, value: string): Promise<void> {
    // Your storage implementation
  },
  async removeItem(key: string): Promise<void> {
    // Your storage implementation
  },
}

const client = createOAuthClient(config, customStorage)
```

## Platform-Specific Configuration

### Web Configuration

For web applications, use standard HTTP redirect URLs:

```typescript
const webClient = createOAuthClient({
  ...providers.google,
  clientId: 'your-google-client-id',
  redirectUrl: 'https://yourapp.com/auth/callback',
})
```

**⚠️ Security Note**: Client secrets should **NEVER** be included in client-side code. This library uses PKCE (Proof Key for Code Exchange) which provides security for public clients without requiring client secrets.

### Mobile Configuration

For mobile apps, you need to:

1. **Configure custom URL scheme** in your app
2. **Register the URL scheme** with your OAuth provider
3. **Use the custom URL** as redirect URL

```typescript
const mobileClient = createOAuthClient({
  ...providers.google,
  clientId: 'your-google-client-id',
  redirectUrl: 'com.yourapp://oauth/callback',
})
```

## React Native Setup

### iOS Configuration

1. Add URL scheme to your `Info.plist`:

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

1. Add intent filter to `android/app/src/main/AndroidManifest.xml`:

```xml
<activity android:name=".MainActivity">
  <intent-filter android:label="filter_react_native">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.yourapp" />
  </intent-filter>
</activity>
```

2. Follow the [react-native-app-auth setup guide](https://github.com/FormidableLabs/react-native-app-auth#setup) for additional configuration.

### OAuth Provider Setup

Register your custom URL scheme as a valid redirect URI in your OAuth provider:

- **Google**: Add `com.yourapp://oauth/callback` to "Authorized redirect URIs"
- **GitHub**: Set "Authorization callback URL" to `com.yourapp://oauth/callback`
- **Other providers**: Add the URL scheme to allowed callback URLs

## How Mobile OAuth Works

1. **App opens system browser** (Safari/Chrome) with OAuth URL
2. **User authenticates** in the browser (can use saved passwords, Touch ID, etc.)
3. **Provider redirects** to your custom URL scheme (`com.yourapp://oauth/callback`)
4. **OS recognizes the scheme** and opens your app
5. **react-native-app-auth** automatically extracts tokens and returns them

This provides the most secure OAuth flow for mobile apps, as recommended by OAuth 2.0 security best practices.

## Error Handling

```typescript
try {
  const result = await client.authorize()
} catch (error) {
  if (error.message.includes('User cancelled')) {
    // User cancelled the authorization
  } else if (error.message.includes('network')) {
    // Network error
  } else {
    // Other OAuth error
  }
}
```

## TypeScript

The library is fully typed. Import types as needed:

```typescript
import type { 
  OAuthConfig, 
  OAuthTokens, 
  OAuthResult, 
  OAuthClient 
} from '@idealyst/oauth-client'
```

## License

MIT