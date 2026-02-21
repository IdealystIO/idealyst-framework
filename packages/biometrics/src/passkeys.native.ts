// ============================================================================
// Native Passkeys (FIDO2 / WebAuthn via react-native-passkeys)
// ============================================================================

import type {
  PasskeyCreateOptions,
  PasskeyCreateResult,
  PasskeyGetOptions,
  PasskeyGetResult,
  PasskeyError,
} from './types';

let Passkey: {
  isSupported: () => boolean;
  create: (request: unknown) => Promise<unknown>;
  get: (request: unknown) => Promise<unknown>;
} | null = null;

try {
  const mod = require('react-native-passkeys');
  Passkey = mod.Passkey ?? mod.default ?? mod;
} catch {
  // react-native-passkeys not installed — functions throw PasskeyError
}

/**
 * Check if passkeys are supported on this device.
 */
export async function isPasskeySupported(): Promise<boolean> {
  if (!Passkey) return false;

  try {
    return Passkey.isSupported();
  } catch {
    return false;
  }
}

/**
 * Create a new passkey (registration / attestation).
 *
 * @throws {PasskeyError} on failure
 */
export async function createPasskey(
  options: PasskeyCreateOptions,
): Promise<PasskeyCreateResult> {
  if (!Passkey) {
    throw {
      code: 'not_supported',
      message: 'react-native-passkeys is not installed',
    } satisfies PasskeyError;
  }

  try {
    const result = (await Passkey.create({
      challenge: options.challenge,
      rp: options.rp,
      user: options.user,
      pubKeyCredParams: options.pubKeyCredParams ?? [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      timeout: options.timeout,
      authenticatorSelection: options.authenticatorSelection ?? {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
      excludeCredentials: options.excludeCredentials,
      attestation: options.attestation ?? 'none',
    })) as PasskeyCreateResult;

    return result;
  } catch (err: unknown) {
    throw mapNativeError(err);
  }
}

/**
 * Get an existing passkey (authentication / assertion).
 *
 * @throws {PasskeyError} on failure
 */
export async function getPasskey(
  options: PasskeyGetOptions,
): Promise<PasskeyGetResult> {
  if (!Passkey) {
    throw {
      code: 'not_supported',
      message: 'react-native-passkeys is not installed',
    } satisfies PasskeyError;
  }

  try {
    const result = (await Passkey.get({
      challenge: options.challenge,
      rpId: options.rpId,
      allowCredentials: options.allowCredentials,
      timeout: options.timeout,
      userVerification: options.userVerification ?? 'preferred',
    })) as PasskeyGetResult;

    return result;
  } catch (err: unknown) {
    throw mapNativeError(err);
  }
}

// ============================================================================
// Helpers
// ============================================================================

function mapNativeError(err: unknown): PasskeyError {
  if (
    err !== null &&
    typeof err === 'object' &&
    'code' in err &&
    'message' in err
  ) {
    const e = err as { code: string; message: string };

    // react-native-passkeys error codes
    if (
      e.code === 'cancelled' ||
      e.code === 'UserCancelled' ||
      e.message.includes('cancel')
    ) {
      return { code: 'cancelled', message: e.message };
    }
    if (e.code === 'InvalidStateError' || e.code === 'invalid_state') {
      return { code: 'invalid_state', message: e.message };
    }
    if (e.code === 'NotAllowedError' || e.code === 'not_allowed') {
      return { code: 'not_allowed', message: e.message };
    }
    if (e.code === 'NotSupportedError' || e.code === 'not_supported') {
      return { code: 'not_supported', message: e.message };
    }

    return { code: 'unknown', message: e.message };
  }

  return {
    code: 'unknown',
    message: err instanceof Error ? err.message : 'Unknown passkey error',
  };
}
