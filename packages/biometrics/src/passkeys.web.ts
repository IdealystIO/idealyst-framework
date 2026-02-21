// ============================================================================
// Web Passkeys (WebAuthn / FIDO2)
// Uses navigator.credentials.create / get with publicKey
// ============================================================================

import type {
  PasskeyCreateOptions,
  PasskeyCreateResult,
  PasskeyGetOptions,
  PasskeyGetResult,
  PasskeyError,
} from './types';
import { base64urlToBuffer, bufferToBase64url } from './types';

/**
 * Check if WebAuthn / passkeys are supported in this browser.
 */
export async function isPasskeySupported(): Promise<boolean> {
  if (
    typeof window === 'undefined' ||
    typeof PublicKeyCredential === 'undefined'
  ) {
    return false;
  }

  try {
    // Check for conditional mediation support (autofill-assisted passkeys)
    // Falls back to basic PublicKeyCredential check
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    // PublicKeyCredential exists but the check failed — still likely supported
    return typeof navigator.credentials !== 'undefined';
  }
}

/**
 * Create a new passkey (WebAuthn registration / attestation).
 *
 * @throws {PasskeyError} on failure
 */
export async function createPasskey(
  options: PasskeyCreateOptions,
): Promise<PasskeyCreateResult> {
  if (typeof PublicKeyCredential === 'undefined') {
    throw {
      code: 'not_supported',
      message: 'WebAuthn is not supported in this browser',
    } satisfies PasskeyError;
  }

  const publicKey: PublicKeyCredentialCreationOptions = {
    challenge: base64urlToBuffer(options.challenge),
    rp: options.rp,
    user: {
      id: base64urlToBuffer(options.user.id),
      name: options.user.name,
      displayName: options.user.displayName,
    },
    pubKeyCredParams: options.pubKeyCredParams ?? [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    timeout: options.timeout ?? 60000,
    authenticatorSelection: options.authenticatorSelection ?? {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
    excludeCredentials: options.excludeCredentials?.map((cred) => ({
      type: cred.type,
      id: base64urlToBuffer(cred.id),
      transports: cred.transports,
    })),
    attestation: options.attestation ?? 'none',
  };

  let credential: PublicKeyCredential;

  try {
    const result = await navigator.credentials.create({ publicKey });
    if (!result) {
      throw {
        code: 'unknown',
        message: 'navigator.credentials.create returned null',
      } satisfies PasskeyError;
    }
    credential = result as PublicKeyCredential;
  } catch (err: unknown) {
    throw mapDOMError(err);
  }

  const response =
    credential.response as AuthenticatorAttestationResponse;

  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: 'public-key',
    response: {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      attestationObject: bufferToBase64url(response.attestationObject),
    },
  };
}

/**
 * Get an existing passkey (WebAuthn authentication / assertion).
 *
 * @throws {PasskeyError} on failure
 */
export async function getPasskey(
  options: PasskeyGetOptions,
): Promise<PasskeyGetResult> {
  if (typeof PublicKeyCredential === 'undefined') {
    throw {
      code: 'not_supported',
      message: 'WebAuthn is not supported in this browser',
    } satisfies PasskeyError;
  }

  const publicKey: PublicKeyCredentialRequestOptions = {
    challenge: base64urlToBuffer(options.challenge),
    rpId: options.rpId,
    allowCredentials: options.allowCredentials?.map((cred) => ({
      type: cred.type,
      id: base64urlToBuffer(cred.id),
      transports: cred.transports,
    })),
    timeout: options.timeout ?? 60000,
    userVerification: options.userVerification ?? 'preferred',
  };

  let credential: PublicKeyCredential;

  try {
    const result = await navigator.credentials.get({ publicKey });
    if (!result) {
      throw {
        code: 'unknown',
        message: 'navigator.credentials.get returned null',
      } satisfies PasskeyError;
    }
    credential = result as PublicKeyCredential;
  } catch (err: unknown) {
    throw mapDOMError(err);
  }

  const response =
    credential.response as AuthenticatorAssertionResponse;

  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: 'public-key',
    response: {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      authenticatorData: bufferToBase64url(response.authenticatorData),
      signature: bufferToBase64url(response.signature),
      userHandle: response.userHandle
        ? bufferToBase64url(response.userHandle)
        : undefined,
    },
  };
}

// ============================================================================
// Helpers
// ============================================================================

function mapDOMError(err: unknown): PasskeyError {
  if (
    err !== null &&
    typeof err === 'object' &&
    'code' in err &&
    'message' in err
  ) {
    // Already a PasskeyError
    return err as PasskeyError;
  }

  const error = err as DOMException;

  switch (error.name) {
    case 'NotAllowedError':
      return { code: 'cancelled', message: error.message || 'User cancelled' };
    case 'InvalidStateError':
      return {
        code: 'invalid_state',
        message: error.message || 'Credential already exists',
      };
    case 'NotSupportedError':
      return { code: 'not_supported', message: error.message || 'Not supported' };
    case 'SecurityError':
      return {
        code: 'not_allowed',
        message: error.message || 'Security error (wrong origin or RP ID)',
      };
    default:
      return {
        code: 'unknown',
        message: error.message || 'Unknown error',
      };
  }
}
