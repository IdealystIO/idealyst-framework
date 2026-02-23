/**
 * OAuth Client Package Guides
 *
 * Comprehensive documentation for @idealyst/oauth-client.
 */

export const oauthClientGuides: Record<string, string> = {
  "idealyst://oauth-client/overview": `# @idealyst/oauth-client

Cross-platform OAuth2 client with a simple, generic API.

## Installation

\`\`\`bash
yarn add @idealyst/oauth-client react-native-inappbrowser-reborn
# Then for iOS:
cd ios && pod install
\`\`\`

> \`react-native-inappbrowser-reborn\` is only required for React Native. Web projects do not need it.

## Platform Support

| Platform | Status | Browser |
|----------|--------|---------|
| Web      | ✅ Popup/redirect flow | Standard browser redirect |
| iOS      | ✅ ASWebAuthenticationSession | In-app auth sheet (no redirect prompt) |
| Android  | ✅ Chrome Custom Tabs | In-app browser overlay |

## Key Exports

\`\`\`typescript
import { createOAuthClient } from '@idealyst/oauth-client';
import type { OAuthConfig, OAuthResult, OAuthCallbackParams } from '@idealyst/oauth-client';
\`\`\`

## Quick Start

\`\`\`tsx
import { createOAuthClient } from '@idealyst/oauth-client';

const googleAuth = createOAuthClient({
  oauthUrl: 'https://api.yourapp.com/auth/google',
  redirectUrl: 'com.yourapp://oauth/callback',
});

// In your component:
const handleLogin = async () => {
  try {
    const result = await googleAuth.authorize();
    console.log('Auth code:', result.code);
  } catch (error) {
    console.error('Auth failed:', error);
  }
};
\`\`\`
`,

  "idealyst://oauth-client/api": `# @idealyst/oauth-client — API Reference

## createOAuthClient(config)

Factory function to create an OAuth client.

\`\`\`typescript
function createOAuthClient<T = OAuthResult>(config: OAuthConfig<T>): OAuthClient<T>;
\`\`\`

### OAuthConfig<T>

\`\`\`typescript
interface OAuthConfig<T = OAuthResult> {
  /** OAuth endpoint URL (your server's OAuth initiation endpoint) */
  oauthUrl: string;

  /** Redirect URL for the client app (e.g., "com.yourapp://oauth/callback") */
  redirectUrl: string;

  /** Additional query parameters to send to OAuth endpoint */
  additionalParameters?: Record<string, string>;

  /**
   * Transform raw callback params to desired type.
   * If not provided, extracts code + state from callback params.
   */
  transformCallback?: (params: OAuthCallbackParams) => T;
}
\`\`\`

### OAuthClient<T>

\`\`\`typescript
interface OAuthClient<T = OAuthResult> {
  /** Initiate OAuth flow. Opens browser/webview, returns result on completion. */
  authorize(): Promise<T>;
}
\`\`\`

### OAuthResult (default)

\`\`\`typescript
interface OAuthResult {
  code: string;    // Authorization code
  state?: string;  // CSRF state token
}
\`\`\`

### OAuthCallbackParams

\`\`\`typescript
type OAuthCallbackParams = Record<string, string | undefined>;
\`\`\`

All query parameters from the OAuth redirect are available here.
`,

  "idealyst://oauth-client/examples": `# @idealyst/oauth-client — Examples

## Basic Google OAuth

\`\`\`tsx
import React, { useState } from 'react';
import { View, Button, Text } from '@idealyst/components';
import { createOAuthClient } from '@idealyst/oauth-client';

const googleAuth = createOAuthClient({
  oauthUrl: 'https://api.yourapp.com/auth/google',
  redirectUrl: 'com.yourapp://oauth/callback',
});

function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleAuth.authorize();
      // Send result.code to your backend to exchange for tokens
      console.log('Authorization code:', result.code);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View padding="lg" gap="md">
      <Button
        onPress={handleGoogleLogin}
        intent="primary"
        loading={loading}
        leftIcon="google"
      >
        Sign in with Google
      </Button>
    </View>
  );
}
\`\`\`

## Custom Callback Transform

\`\`\`tsx
import { createOAuthClient } from '@idealyst/oauth-client';

interface CustomAuthResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Some OAuth servers return tokens directly in the callback
const auth = createOAuthClient<CustomAuthResult>({
  oauthUrl: 'https://api.yourapp.com/auth/provider',
  redirectUrl: 'com.yourapp://oauth/callback',
  additionalParameters: {
    response_type: 'token',
    scope: 'openid profile email',
  },
  transformCallback: (params) => ({
    accessToken: params.access_token || '',
    refreshToken: params.refresh_token || '',
    expiresIn: parseInt(params.expires_in || '3600', 10),
  }),
});
\`\`\`

## Multiple Providers

\`\`\`tsx
import { createOAuthClient } from '@idealyst/oauth-client';
import { config } from '@idealyst/config';

const REDIRECT_URL = config.getRequired('OAUTH_REDIRECT_URL');

const googleAuth = createOAuthClient({
  oauthUrl: config.getRequired('API_URL') + '/auth/google',
  redirectUrl: REDIRECT_URL,
});

const appleAuth = createOAuthClient({
  oauthUrl: config.getRequired('API_URL') + '/auth/apple',
  redirectUrl: REDIRECT_URL,
});

const githubAuth = createOAuthClient({
  oauthUrl: config.getRequired('API_URL') + '/auth/github',
  redirectUrl: REDIRECT_URL,
});

// Use in component:
function SocialLogin() {
  return (
    <View gap="sm">
      <Button onPress={() => googleAuth.authorize()} leftIcon="google">Google</Button>
      <Button onPress={() => appleAuth.authorize()} leftIcon="apple">Apple</Button>
      <Button onPress={() => githubAuth.authorize()} leftIcon="github">GitHub</Button>
    </View>
  );
}
\`\`\`
`,
};
