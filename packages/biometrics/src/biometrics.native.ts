// ============================================================================
// Native Biometric Authentication
// Uses expo-local-authentication for fingerprint, FaceID, iris
// ============================================================================

import type {
  BiometricType,
  SecurityLevel,
  AuthenticateOptions,
  AuthResult,
} from './types';

let LocalAuthentication: typeof import('expo-local-authentication') | null =
  null;

try {
  LocalAuthentication = require('expo-local-authentication');
} catch {
  // expo-local-authentication not installed — all functions degrade gracefully
}

/**
 * Check whether any biometric hardware is available and enrolled.
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (!LocalAuthentication) return false;

  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return isEnrolled;
  } catch {
    return false;
  }
}

/**
 * Return the biometric types available on this device.
 */
export async function getBiometricTypes(): Promise<BiometricType[]> {
  if (!LocalAuthentication) return [];

  try {
    const types =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    const result: BiometricType[] = [];

    for (const t of types) {
      switch (t) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          result.push('fingerprint');
          break;
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          result.push('facial_recognition');
          break;
        case LocalAuthentication.AuthenticationType.IRIS:
          result.push('iris');
          break;
      }
    }

    return result;
  } catch {
    return [];
  }
}

/**
 * Get the security level of biometric auth on the device.
 */
export async function getSecurityLevel(): Promise<SecurityLevel> {
  if (!LocalAuthentication) return 'none';

  try {
    const level = await LocalAuthentication.getEnrolledLevelAsync();

    switch (level) {
      case LocalAuthentication.SecurityLevel.NONE:
        return 'none';
      case LocalAuthentication.SecurityLevel.SECRET:
        return 'device_credential';
      case LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK:
        return 'biometric_weak';
      case LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG:
        return 'biometric_strong';
      default:
        return 'none';
    }
  } catch {
    return 'none';
  }
}

/**
 * Prompt the user for biometric authentication.
 */
export async function authenticate(
  options?: AuthenticateOptions,
): Promise<AuthResult> {
  if (!LocalAuthentication) {
    return {
      success: false,
      error: 'not_available',
      message: 'expo-local-authentication is not installed',
    };
  }

  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: options?.promptMessage ?? 'Authenticate',
      cancelLabel: options?.cancelLabel,
      fallbackLabel: options?.fallbackLabel,
      disableDeviceFallback: options?.disableDeviceFallback,
    });

    if (result.success) {
      return { success: true };
    }

    // Map expo error codes to our AuthError type
    const errorCode = result.error;
    switch (errorCode) {
      case 'not_available':
        return { success: false, error: 'not_available', message: result.warning };
      case 'not_enrolled':
        return { success: false, error: 'not_enrolled', message: result.warning };
      case 'user_cancel':
        return { success: false, error: 'user_cancel', message: result.warning };
      case 'lockout':
        return { success: false, error: 'lockout', message: result.warning };
      case 'system_cancel':
        return { success: false, error: 'system_cancel', message: result.warning };
      case 'passcode_not_set':
        return {
          success: false,
          error: 'passcode_not_set',
          message: result.warning,
        };
      case 'authentication_failed':
        return {
          success: false,
          error: 'authentication_failed',
          message: result.warning,
        };
      default:
        return {
          success: false,
          error: 'unknown',
          message: result.warning ?? 'Authentication failed',
        };
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: 'unknown',
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Cancel an in-progress authentication (Android only).
 */
export async function cancelAuthentication(): Promise<void> {
  if (!LocalAuthentication) return;

  try {
    await LocalAuthentication.cancelAuthenticate();
  } catch {
    // Ignore — may not be supported or no auth in progress
  }
}
