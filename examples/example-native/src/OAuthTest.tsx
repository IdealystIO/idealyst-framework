import React, { useState } from 'react';
import { Alert, Linking } from 'react-native';
import { View, Text, Button } from '@idealyst/components';
import { createOAuthClient } from '@idealyst/oauth-client';

const OAuthTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const testOAuth = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const oauthClient = createOAuthClient({
        oauthUrl: 'https://accounts.google.com/oauth/authorize',
        redirectUrl: 'com.examplenative://oauth/callback',
        additionalParameters: {
          client_id: 'your-google-client-id',
          response_type: 'code',
          scope: 'openid profile email',
        }
      });

      const authResult = await oauthClient.authorize();
      setResult(`Success! Authorization code: ${authResult.code.substring(0, 20)}...`);
      Alert.alert('OAuth Success', `Got authorization code: ${authResult.code.substring(0, 20)}...`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult(`Error: ${errorMessage}`);
      Alert.alert('OAuth Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const testDeepLink = async () => {
    try {
      // Test opening a deep link manually
      const testUrl = 'com.examplenative://oauth/callback?code=test_code_123&state=test_state';
      const canOpen = await Linking.canOpenURL(testUrl);
      if (canOpen) {
        await Linking.openURL(testUrl);
      } else {
        Alert.alert('Deep Link Test', 'Cannot open deep link URL');
      }
    } catch (error) {
      Alert.alert('Deep Link Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const checkInitialUrl = async () => {
    try {
      const url = await Linking.getInitialURL();
      Alert.alert('Initial URL', url ? `Got: ${url}` : 'No initial URL');
    } catch (error) {
      Alert.alert('Initial URL Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <View spacing="lg" style={{ padding: 20 }}>
      <Text size="large" weight="bold" align="center">
        OAuth Client Test
      </Text>
      
      <Text size="medium">
        This screen tests the OAuth client with deep link handling for React Native.
      </Text>

      <View spacing="md">
        <Button
          variant="contained"
          intent="primary"
          onPress={testOAuth}
          disabled={isLoading}
        >
          {isLoading ? 'Testing OAuth...' : 'Test OAuth Flow'}
        </Button>

        <Button
          variant="outlined"
          intent="neutral"
          onPress={testDeepLink}
        >
          Test Deep Link
        </Button>

        <Button
          variant="outlined"
          intent="neutral"
          onPress={checkInitialUrl}
        >
          Check Initial URL
        </Button>
      </View>

      {result && (
        <View style={{ 
          padding: 15, 
          backgroundColor: result.startsWith('Error') ? '#ffebee' : '#e8f5e8',
          borderRadius: 8,
          marginTop: 10
        }}>
          <Text 
            size="small" 
            style={{ 
              color: result.startsWith('Error') ? '#c62828' : '#2e7d32',
              fontFamily: 'monospace'
            }}
          >
            {result}
          </Text>
        </View>
      )}

      <View spacing="sm" style={{ marginTop: 20 }}>
        <Text size="small" weight="bold">Setup Instructions:</Text>
        <Text size="small">
          1. Configure deep links in Android/iOS
        </Text>
        <Text size="small">
          2. Replace 'your-google-client-id' with actual client ID
        </Text>
        <Text size="small">
          3. Test the OAuth flow by tapping "Test OAuth Flow"
        </Text>
      </View>
    </View>
  );
};

export default OAuthTest;