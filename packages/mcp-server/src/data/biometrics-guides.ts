export const biometricsGuides: Record<string, string> = {
  "idealyst://biometrics/overview": `# @idealyst/biometrics Overview

Cross-platform biometric authentication and passkeys (WebAuthn/FIDO2) for React and React Native applications.

## Features

- **Local Biometric Auth** — FaceID, TouchID, fingerprint, iris to gate access
- **Passkeys (WebAuthn/FIDO2)** — Passwordless login with cryptographic credentials
- **Cross-Platform** — Single API for React Native (iOS/Android) and Web
- **React Native** — Uses expo-local-authentication for biometrics, react-native-passkeys for passkeys
- **Web** — Uses WebAuthn API for both biometrics and passkeys
- **Graceful Degradation** — Falls back cleanly when native modules aren't installed
- **TypeScript** — Full type safety and IntelliSense support

## Installation

\`\`\`bash
yarn add @idealyst/biometrics

# React Native — biometric auth:
yarn add expo-local-authentication
cd ios && pod install

# React Native — passkeys (optional):
yarn add react-native-passkeys
cd ios && pod install
\`\`\`

## Quick Start — Biometric Auth

\`\`\`tsx
import { isBiometricAvailable, authenticate } from '@idealyst/biometrics';

// Check availability
const available = await isBiometricAvailable();

// Prompt user
if (available) {
  const result = await authenticate({
    promptMessage: 'Verify your identity',
  });

  if (result.success) {
    // Authenticated!
  } else {
    console.log(result.error, result.message);
  }
}
\`\`\`

## Quick Start — Passkeys

\`\`\`tsx
import { isPasskeySupported, createPasskey, getPasskey } from '@idealyst/biometrics';

// Check support
const supported = await isPasskeySupported();

// Register a new passkey
const credential = await createPasskey({
  challenge: serverChallenge,
  rp: { id: 'example.com', name: 'My App' },
  user: { id: userId, name: email, displayName: name },
});
// Send credential to server for verification

// Sign in with passkey
const assertion = await getPasskey({
  challenge: serverChallenge,
  rpId: 'example.com',
});
// Send assertion to server for verification
\`\`\`

## Platform Details

- **React Native (biometrics)**: Uses \`expo-local-authentication\` — FaceID, TouchID, fingerprint, iris
- **React Native (passkeys)**: Uses \`react-native-passkeys\` — system passkey UI on iOS 16+ and Android 9+
- **Web (biometrics)**: Uses WebAuthn with \`userVerification: 'required'\` to trigger platform authenticator
- **Web (passkeys)**: Uses \`navigator.credentials.create/get\` with the PublicKey API
`,

  "idealyst://biometrics/api": `# Biometrics API Reference

Complete API reference for @idealyst/biometrics.

---

## Biometric Authentication Functions

### isBiometricAvailable

Check whether biometric auth hardware is available and enrolled.

\`\`\`tsx
await isBiometricAvailable(): Promise<boolean>

// Native: checks hardware + enrollment via expo-local-authentication
// Web: checks PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
\`\`\`

### getBiometricTypes

Return the biometric types available on this device.

\`\`\`tsx
await getBiometricTypes(): Promise<BiometricType[]>

type BiometricType = 'fingerprint' | 'facial_recognition' | 'iris';

// Native: returns specific types (fingerprint, facial_recognition, iris)
// Web: returns ['fingerprint'] as generic indicator, or [] if unavailable
\`\`\`

### getSecurityLevel

Get the security level of biometric authentication on the device.

\`\`\`tsx
await getSecurityLevel(): Promise<SecurityLevel>

type SecurityLevel = 'none' | 'device_credential' | 'biometric_weak' | 'biometric_strong';

// Native: maps expo-local-authentication SecurityLevel enum
// Web: returns 'biometric_strong' if platform authenticator available, else 'none'
\`\`\`

### authenticate

Prompt the user for biometric authentication.

\`\`\`tsx
await authenticate(options?: AuthenticateOptions): Promise<AuthResult>
\`\`\`

**AuthenticateOptions:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| promptMessage | string | 'Authenticate' | Message shown alongside the biometric prompt |
| cancelLabel | string | — | Label for the cancel button |
| fallbackLabel | string | — | iOS: label for passcode fallback button |
| disableDeviceFallback | boolean | false | Prevent PIN/passcode fallback after biometric failure |
| requireStrongBiometric | boolean | false | Android: require Class 3 (strong) biometric |

**AuthResult:**

\`\`\`tsx
type AuthResult =
  | { success: true }
  | { success: false; error: AuthError; message?: string };

type AuthError =
  | 'not_available'
  | 'not_enrolled'
  | 'user_cancel'
  | 'lockout'
  | 'system_cancel'
  | 'passcode_not_set'
  | 'authentication_failed'
  | 'unknown';
\`\`\`

### cancelAuthentication

Cancel an in-progress authentication prompt (Android only). No-op on iOS and web.

\`\`\`tsx
await cancelAuthentication(): Promise<void>
\`\`\`

---

## Passkey Functions

### isPasskeySupported

Check if passkeys (WebAuthn/FIDO2) are supported on this device/browser.

\`\`\`tsx
await isPasskeySupported(): Promise<boolean>

// Web: checks PublicKeyCredential + isUserVerifyingPlatformAuthenticatorAvailable
// Native: checks react-native-passkeys Passkey.isSupported()
\`\`\`

### createPasskey

Create a new passkey credential (registration / attestation ceremony).

\`\`\`tsx
await createPasskey(options: PasskeyCreateOptions): Promise<PasskeyCreateResult>
\`\`\`

**PasskeyCreateOptions:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| challenge | string | Yes | Base64url-encoded challenge from server |
| rp | { id: string; name: string } | Yes | Relying party info |
| user | { id: string; name: string; displayName: string } | Yes | User info (id is base64url) |
| pubKeyCredParams | PublicKeyCredentialParam[] | No | Defaults to ES256 + RS256 |
| timeout | number | No | Timeout in ms (default 60000) |
| authenticatorSelection | object | No | Authenticator criteria |
| excludeCredentials | CredentialDescriptor[] | No | Prevent re-registration |
| attestation | string | No | 'none' \\| 'indirect' \\| 'direct' \\| 'enterprise' |

**PasskeyCreateResult:**

| Property | Type | Description |
|----------|------|-------------|
| id | string | Credential ID (base64url) |
| rawId | string | Raw credential ID (base64url) |
| type | 'public-key' | Always 'public-key' |
| response.clientDataJSON | string | Client data (base64url) |
| response.attestationObject | string | Attestation object (base64url) |

### getPasskey

Authenticate with an existing passkey (assertion ceremony).

\`\`\`tsx
await getPasskey(options: PasskeyGetOptions): Promise<PasskeyGetResult>
\`\`\`

**PasskeyGetOptions:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| challenge | string | Yes | Base64url-encoded challenge from server |
| rpId | string | No | Relying party ID |
| allowCredentials | CredentialDescriptor[] | No | Allowed credentials (empty = discoverable) |
| timeout | number | No | Timeout in ms (default 60000) |
| userVerification | string | No | 'required' \\| 'preferred' \\| 'discouraged' |

**PasskeyGetResult:**

| Property | Type | Description |
|----------|------|-------------|
| id | string | Credential ID (base64url) |
| rawId | string | Raw credential ID (base64url) |
| type | 'public-key' | Always 'public-key' |
| response.clientDataJSON | string | Client data (base64url) |
| response.authenticatorData | string | Authenticator data (base64url) |
| response.signature | string | Signature (base64url) |
| response.userHandle | string \\| undefined | User handle (base64url) |

### PasskeyError

Both \`createPasskey\` and \`getPasskey\` throw a \`PasskeyError\` on failure:

\`\`\`tsx
interface PasskeyError {
  code: 'not_supported' | 'cancelled' | 'invalid_state' | 'not_allowed' | 'unknown';
  message: string;
}

try {
  const result = await createPasskey(options);
} catch (err) {
  const passkeyErr = err as PasskeyError;
  console.log(passkeyErr.code, passkeyErr.message);
}
\`\`\`

---

## Base64url Helpers

Shared utilities for encoding/decoding WebAuthn binary data.

\`\`\`tsx
import { base64urlToBuffer, bufferToBase64url } from '@idealyst/biometrics';

// Convert base64url string to ArrayBuffer
const buffer: ArrayBuffer = base64urlToBuffer(base64urlString);

// Convert ArrayBuffer to base64url string
const str: string = bufferToBase64url(arrayBuffer);
\`\`\`
`,

  "idealyst://biometrics/examples": `# Biometrics Examples

Complete code examples for common @idealyst/biometrics patterns.

## Gate Screen Access with Biometrics

\`\`\`tsx
import { isBiometricAvailable, authenticate } from '@idealyst/biometrics';
import { useEffect, useState } from 'react';

function ProtectedScreen({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = async () => {
    const available = await isBiometricAvailable();
    if (!available) {
      // No biometrics — fall back to PIN or allow access
      setUnlocked(true);
      return;
    }

    const result = await authenticate({
      promptMessage: 'Unlock to continue',
      cancelLabel: 'Cancel',
    });

    if (result.success) {
      setUnlocked(true);
    } else {
      setError(result.message ?? 'Authentication failed');
    }
  };

  useEffect(() => {
    unlock();
  }, []);

  if (!unlocked) {
    return (
      <View>
        <Text>Please authenticate to continue</Text>
        {error && <Text intent="negative">{error}</Text>}
        <Button label="Try Again" onPress={unlock} />
      </View>
    );
  }

  return <>{children}</>;
}
\`\`\`

## Confirm Sensitive Action

\`\`\`tsx
import { authenticate } from '@idealyst/biometrics';

async function confirmTransfer(amount: number, recipient: string) {
  const result = await authenticate({
    promptMessage: \`Confirm transfer of $\${amount} to \${recipient}\`,
    disableDeviceFallback: false,
  });

  if (!result.success) {
    throw new Error(result.message ?? 'Authentication required');
  }

  // Proceed with transfer
  await api.transfer({ amount, recipient });
}
\`\`\`

## Show Biometric Info

\`\`\`tsx
import {
  isBiometricAvailable,
  getBiometricTypes,
  getSecurityLevel,
} from '@idealyst/biometrics';

function BiometricSettings() {
  const [info, setInfo] = useState({
    available: false,
    types: [] as string[],
    level: 'none',
  });

  useEffect(() => {
    async function load() {
      const [available, types, level] = await Promise.all([
        isBiometricAvailable(),
        getBiometricTypes(),
        getSecurityLevel(),
      ]);
      setInfo({ available, types, level });
    }
    load();
  }, []);

  return (
    <Card>
      <Text>Biometric available: {info.available ? 'Yes' : 'No'}</Text>
      <Text>Types: {info.types.join(', ') || 'None'}</Text>
      <Text>Security level: {info.level}</Text>
    </Card>
  );
}
\`\`\`

## Passkey Registration Flow

\`\`\`tsx
import { isPasskeySupported, createPasskey } from '@idealyst/biometrics';
import type { PasskeyError } from '@idealyst/biometrics';

async function registerPasskey(user: { id: string; email: string; name: string }) {
  const supported = await isPasskeySupported();
  if (!supported) {
    alert('Passkeys are not supported on this device');
    return;
  }

  // 1. Get challenge from server
  const { challenge, rpId, rpName } = await api.getRegistrationChallenge();

  try {
    // 2. Create the passkey
    const credential = await createPasskey({
      challenge,
      rp: { id: rpId, name: rpName },
      user: {
        id: user.id,
        name: user.email,
        displayName: user.name,
      },
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required',
      },
    });

    // 3. Send to server for verification and storage
    await api.verifyRegistration({
      id: credential.id,
      rawId: credential.rawId,
      clientDataJSON: credential.response.clientDataJSON,
      attestationObject: credential.response.attestationObject,
    });

    alert('Passkey registered successfully!');
  } catch (err) {
    const passkeyErr = err as PasskeyError;
    if (passkeyErr.code === 'cancelled') {
      // User cancelled — do nothing
      return;
    }
    alert(\`Failed to register passkey: \${passkeyErr.message}\`);
  }
}
\`\`\`

## Passkey Login Flow

\`\`\`tsx
import { getPasskey } from '@idealyst/biometrics';
import type { PasskeyError } from '@idealyst/biometrics';

async function loginWithPasskey() {
  // 1. Get challenge from server
  const { challenge, rpId } = await api.getAuthenticationChallenge();

  try {
    // 2. Authenticate with passkey
    const assertion = await getPasskey({
      challenge,
      rpId,
      userVerification: 'required',
    });

    // 3. Send to server for verification
    const session = await api.verifyAuthentication({
      id: assertion.id,
      rawId: assertion.rawId,
      clientDataJSON: assertion.response.clientDataJSON,
      authenticatorData: assertion.response.authenticatorData,
      signature: assertion.response.signature,
      userHandle: assertion.response.userHandle,
    });

    return session;
  } catch (err) {
    const passkeyErr = err as PasskeyError;
    if (passkeyErr.code === 'cancelled') return null;
    throw passkeyErr;
  }
}
\`\`\`

## Login Screen with Passkey + Fallback

\`\`\`tsx
import { isPasskeySupported, getPasskey } from '@idealyst/biometrics';
import type { PasskeyError } from '@idealyst/biometrics';

function LoginScreen() {
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isPasskeySupported().then(setPasskeyAvailable);
  }, []);

  const handlePasskeyLogin = async () => {
    setLoading(true);
    try {
      const { challenge, rpId } = await api.getAuthenticationChallenge();
      const assertion = await getPasskey({ challenge, rpId });
      const session = await api.verifyAuthentication(assertion);
      navigateToHome(session);
    } catch (err) {
      const e = err as PasskeyError;
      if (e.code !== 'cancelled') {
        showError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text variant="headline">Welcome Back</Text>

      {passkeyAvailable && (
        <Button
          label="Sign in with Passkey"
          iconName="fingerprint"
          onPress={handlePasskeyLogin}
          loading={loading}
        />
      )}

      <Button
        label="Sign in with Email"
        intent="neutral"
        onPress={navigateToEmailLogin}
      />
    </View>
  );
}
\`\`\`

## Best Practices

1. **Always check availability first** — Call \`isBiometricAvailable()\` or \`isPasskeySupported()\` before prompting
2. **Provide fallbacks** — Not all devices support biometrics. Offer PIN/password alternatives
3. **Handle cancellation gracefully** — Users may cancel the prompt. Don't show errors for \`user_cancel\` / \`cancelled\`
4. **Use try/catch for passkeys** — Passkey functions throw \`PasskeyError\` on failure
5. **Server-side validation** — Always verify passkey responses on your server. The client is untrusted
6. **Base64url encoding** — All binary WebAuthn data is encoded as base64url strings for transport
7. **Set rpId correctly** — The relying party ID must match your domain. On native, it's your associated domain
8. **Lockout handling** — After too many failed biometric attempts, the device locks out. Handle the \`lockout\` error
9. **iOS permissions** — FaceID requires \`NSFaceIDUsageDescription\` in Info.plist
10. **Android associated domains** — Passkeys on Android require a Digital Asset Links file at \`/.well-known/assetlinks.json\`
`,
};
