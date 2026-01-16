import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function OAuthClientPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          OAuth Client
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Universal OAuth2 client for web and React Native. Provides a simple API to
          initiate OAuth flows with any provider through your backend server.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`import { createOAuthClient } from '@idealyst/oauth-client';`}
          language="typescript"
          title="Import"
        />

        <Text typography="body2" color="secondary" style={{ marginBottom: 24, marginTop: 16, lineHeight: 24 }}>
          The package automatically uses the correct implementation based on the platform:
          redirect-based flow for web and deep linking for React Native.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Basic Usage
        </Text>

        <CodeBlock
          code={`import { createOAuthClient } from '@idealyst/oauth-client';

const client = createOAuthClient({
  // Your backend OAuth endpoint
  oauthUrl: 'https://api.yourapp.com/auth/google',
  // Callback URL (deep link scheme for native)
  redirectUrl: 'com.yourapp://oauth/callback',
  additionalParameters: {
    scope: 'profile email',
  },
});

async function handleLogin() {
  try {
    const result = await client.authorize();
    console.log('Authorization code:', result.code);

    // Exchange the code for tokens on your server
    await fetch('/api/auth/token', {
      method: 'POST',
      body: JSON.stringify({ code: result.code }),
    });
  } catch (error) {
    console.error('OAuth failed:', error);
  }
}`}
          language="typescript"
          title="Google OAuth Example"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          How It Works
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              1. Client calls authorize()
            </Text>
            <Text typography="body2" color="tertiary">
              The client redirects (web) or opens a browser (native) to your oauthUrl endpoint.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              2. Server initiates OAuth flow
            </Text>
            <Text typography="body2" color="tertiary">
              Your backend redirects to the OAuth provider (Google, GitHub, etc.) with proper credentials.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              3. User authenticates
            </Text>
            <Text typography="body2" color="tertiary">
              The user logs in and grants permissions at the OAuth provider.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              4. Callback returns code
            </Text>
            <Text typography="body2" color="tertiary">
              The provider redirects to your redirectUrl with an authorization code.
              The client captures this and returns it from authorize().
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Configuration
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <ConfigCard
            name="oauthUrl"
            type="string"
            description="Your backend endpoint that initiates the OAuth flow. This endpoint should redirect to the OAuth provider."
            required
          />
          <ConfigCard
            name="redirectUrl"
            type="string"
            description="The callback URL. Use a deep link scheme (com.yourapp://) that works on both web and native."
            required
          />
          <ConfigCard
            name="additionalParameters"
            type="Record<string, string>"
            description="Extra query parameters to send to your OAuth endpoint (e.g., scope, prompt)."
          />
          <ConfigCard
            name="transformCallback"
            type="(params) => T"
            description="Optional function to transform callback parameters into a custom type."
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Custom Callback Types
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Use a transformer to extract specific parameters from the callback:
        </Text>

        <CodeBlock
          code={`interface CustomAuthResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const client = createOAuthClient<CustomAuthResult>({
  oauthUrl: 'https://api.yourapp.com/auth/google',
  redirectUrl: 'com.yourapp://oauth/callback',
  transformCallback: (params) => ({
    accessToken: params.access_token || '',
    refreshToken: params.refresh_token || '',
    expiresIn: parseInt(params.expires_in || '0', 10),
  }),
});

const result = await client.authorize();
console.log(result.accessToken); // Type-safe access`}
          language="typescript"
          title="Custom Result Type"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Platform Differences
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Web (WebOAuthClient)
            </Text>
            <Text typography="body2" color="tertiary" style={{ marginBottom: 8 }}>
              Uses window.location to redirect to the OAuth URL. On callback, parses
              query parameters from the URL and cleans up the browser history.
            </Text>
            <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
              Redirect-based flow, synchronous callback handling
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              React Native (NativeOAuthClient)
            </Text>
            <Text typography="body2" color="tertiary" style={{ marginBottom: 8 }}>
              Opens the OAuth URL in the system browser using Linking.openURL().
              Waits for a deep link callback with a 5-minute timeout.
            </Text>
            <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
              Deep link-based flow, async callback handling
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Multiple Providers
        </Text>

        <CodeBlock
          code={`// Create separate clients for each provider
const googleClient = createOAuthClient({
  oauthUrl: 'https://api.yourapp.com/auth/google',
  redirectUrl: 'com.yourapp://oauth/callback',
  additionalParameters: { scope: 'profile email' },
});

const githubClient = createOAuthClient({
  oauthUrl: 'https://api.yourapp.com/auth/github',
  redirectUrl: 'com.yourapp://oauth/callback',
  additionalParameters: { scope: 'user user:email' },
});

const appleClient = createOAuthClient({
  oauthUrl: 'https://api.yourapp.com/auth/apple',
  redirectUrl: 'com.yourapp://oauth/callback',
  additionalParameters: { scope: 'name email' },
});

// Usage in your login screen
function LoginScreen() {
  return (
    <View>
      <Button onPress={() => googleClient.authorize()}>
        Sign in with Google
      </Button>
      <Button onPress={() => githubClient.authorize()}>
        Sign in with GitHub
      </Button>
      <Button onPress={() => appleClient.authorize()}>
        Sign in with Apple
      </Button>
    </View>
  );
}`}
          language="tsx"
          title="Multiple OAuth Providers"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Backend Setup
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Your backend OAuth endpoint should redirect to the provider and handle the callback:
        </Text>

        <CodeBlock
          code={`// Example: Express.js backend endpoint
app.get('/auth/google', (req, res) => {
  const { redirect_uri, state, scope } = req.query;

  // Store state for CSRF verification
  // Then redirect to Google OAuth
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_CALLBACK_URL);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', scope || 'profile email');
  googleAuthUrl.searchParams.set('state', state);

  res.redirect(googleAuthUrl.toString());
});

// Google calls this after user authorizes
app.get('/auth/google/callback', async (req, res) => {
  const { code, state } = req.query;

  // Optionally exchange code for tokens here
  // Then redirect back to your app with the code
  const callbackUrl = new URL('com.yourapp://oauth/callback');
  callbackUrl.searchParams.set('code', code);
  callbackUrl.searchParams.set('state', state);

  res.redirect(callbackUrl.toString());
});`}
          language="typescript"
          title="Backend OAuth Endpoint"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Error Handling
        </Text>

        <CodeBlock
          code={`try {
  const result = await client.authorize();
  // Handle successful authorization
} catch (error) {
  if (error.message.includes('OAuth error')) {
    // OAuth provider returned an error
    console.error('Provider error:', error.message);
  } else if (error.message.includes('timeout')) {
    // User didn't complete auth in time (native only)
    console.error('Authorization timed out');
  } else if (error.message.includes('Authorization flow initiated')) {
    // Web redirect happened (not an error, flow is in progress)
  } else {
    console.error('Unexpected error:', error);
  }
}`}
          language="typescript"
          title="Error Handling"
        />
      </View>
    </Screen>
  );
}

function ConfigCard({
  name,
  type,
  description,
  required,
}: {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}) {
  return (
    <Card variant="outlined" style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Text weight="semibold">{name}</Text>
        <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
          {type}
        </Text>
        {required && (
          <Text typography="caption" color="danger">
            required
          </Text>
        )}
      </View>
      <Text typography="body2" color="tertiary">
        {description}
      </Text>
    </Card>
  );
}
