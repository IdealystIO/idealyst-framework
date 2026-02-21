// ============================================================================
// Web Biometric Authentication
// Uses WebAuthn's userVerification to check for platform authenticator
// ============================================================================

import type {
  BiometricType,
  SecurityLevel,
  AuthenticateOptions,
  AuthResult,
} from './types';

/**
 * Check if a user-verifying platform authenticator is available.
 * This indicates the device has biometric or PIN-based auth (e.g. Windows Hello,
 * Touch ID in Safari, Android biometric prompt in Chrome).
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (
    typeof window === 'undefined' ||
    typeof PublicKeyCredential === 'undefined'
  ) {
    return false;
  }

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/**
 * On web, we cannot distinguish between fingerprint, face, etc.
 * If a platform authenticator is available, we report it generically.
 */
export async function getBiometricTypes(): Promise<BiometricType[]> {
  const available = await isBiometricAvailable();
  // Web cannot distinguish biometric type — report fingerprint as a generic indicator
  return available ? ['fingerprint'] : [];
}

/**
 * On web, security level is binary: either a platform authenticator exists
 * (biometric_strong) or it doesn't (none).
 */
export async function getSecurityLevel(): Promise<SecurityLevel> {
  const available = await isBiometricAvailable();
  return available ? 'biometric_strong' : 'none';
}

/**
 * Trigger a WebAuthn user-verification ceremony.
 *
 * This creates a throwaway credential with `userVerification: 'required'`
 * which forces the browser to verify the user via biometrics or device PIN.
 * The credential itself is not stored — this is purely for local verification.
 */
export async function authenticate(
  options?: AuthenticateOptions,
): Promise<AuthResult> {
  if (!(await isBiometricAvailable())) {
    return {
      success: false,
      error: 'not_available',
      message: 'No platform authenticator available',
    };
  }

  try {
    // Generate a random challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Generate a random user ID
    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: options?.promptMessage ?? 'Biometric Verification',
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: 'biometric-check',
          displayName: 'Biometric Verification',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'discouraged',
        },
        timeout: 60000,
        attestation: 'none',
      },
    });

    return credential ? { success: true } : {
      success: false,
      error: 'authentication_failed',
      message: 'No credential returned',
    };
  } catch (err: unknown) {
    const error = err as DOMException;

    if (error.name === 'NotAllowedError') {
      return {
        success: false,
        error: 'user_cancel',
        message: error.message || 'User cancelled or not allowed',
      };
    }

    if (error.name === 'InvalidStateError') {
      // Credential already exists for this rp+user — still means auth succeeded
      return { success: true };
    }

    return {
      success: false,
      error: 'unknown',
      message: error.message || 'Unknown error during authentication',
    };
  }
}

/**
 * No-op on web — cancellation is handled by the browser's native UI.
 */
export async function cancelAuthentication(): Promise<void> {
  // Not supported on web; the browser handles dismissal
}
