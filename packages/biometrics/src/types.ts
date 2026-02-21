// ============================================================================
// Biometric Authentication Types
// ============================================================================

export type BiometricType = 'fingerprint' | 'facial_recognition' | 'iris';

export type SecurityLevel =
  | 'none'
  | 'device_credential'
  | 'biometric_weak'
  | 'biometric_strong';

export type AuthError =
  | 'not_available'
  | 'not_enrolled'
  | 'user_cancel'
  | 'lockout'
  | 'system_cancel'
  | 'passcode_not_set'
  | 'authentication_failed'
  | 'unknown';

export interface AuthenticateOptions {
  /** Message displayed alongside the biometric prompt. */
  promptMessage?: string;
  /** Label for the cancel button. */
  cancelLabel?: string;
  /** iOS: label for the passcode fallback button. */
  fallbackLabel?: string;
  /** Prevent PIN/passcode fallback after biometric failure. */
  disableDeviceFallback?: boolean;
  /** Android: require Class 3 (strong) biometric instead of weak. */
  requireStrongBiometric?: boolean;
}

export type AuthResult =
  | { success: true }
  | { success: false; error: AuthError; message?: string };

// ============================================================================
// Passkey Types (WebAuthn / FIDO2)
// ============================================================================

export interface PublicKeyCredentialParam {
  type: 'public-key';
  /** COSE algorithm identifier. -7 = ES256, -257 = RS256. */
  alg: number;
}

export interface CredentialDescriptor {
  type: 'public-key';
  /** Credential ID as base64url string. */
  id: string;
  transports?: Array<'usb' | 'ble' | 'nfc' | 'internal' | 'hybrid'>;
}

export interface PasskeyCreateOptions {
  /** Base64url-encoded challenge from server. */
  challenge: string;
  /** Relying party information. */
  rp: {
    id: string;
    name: string;
  };
  /** User information. */
  user: {
    /** Base64url-encoded user ID. */
    id: string;
    name: string;
    displayName: string;
  };
  /** Supported public key credential parameters. Defaults to ES256 + RS256. */
  pubKeyCredParams?: PublicKeyCredentialParam[];
  /** Timeout in milliseconds. */
  timeout?: number;
  /** Authenticator selection criteria. */
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    residentKey?: 'required' | 'preferred' | 'discouraged';
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
  /** Credentials to exclude (prevent re-registration). */
  excludeCredentials?: CredentialDescriptor[];
  /** Attestation conveyance preference. */
  attestation?: 'none' | 'indirect' | 'direct' | 'enterprise';
}

export interface PasskeyCreateResult {
  /** Credential ID as base64url string. */
  id: string;
  /** Raw credential ID as base64url string. */
  rawId: string;
  type: 'public-key';
  response: {
    /** Base64url-encoded client data JSON. */
    clientDataJSON: string;
    /** Base64url-encoded attestation object. */
    attestationObject: string;
  };
}

export interface PasskeyGetOptions {
  /** Base64url-encoded challenge from server. */
  challenge: string;
  /** Relying party ID. */
  rpId?: string;
  /** Allowed credentials. If empty, discoverable credentials are used. */
  allowCredentials?: CredentialDescriptor[];
  /** Timeout in milliseconds. */
  timeout?: number;
  /** User verification requirement. */
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

export interface PasskeyGetResult {
  /** Credential ID as base64url string. */
  id: string;
  /** Raw credential ID as base64url string. */
  rawId: string;
  type: 'public-key';
  response: {
    /** Base64url-encoded client data JSON. */
    clientDataJSON: string;
    /** Base64url-encoded authenticator data. */
    authenticatorData: string;
    /** Base64url-encoded signature. */
    signature: string;
    /** Base64url-encoded user handle (may be absent). */
    userHandle?: string;
  };
}

export interface PasskeyError {
  code: 'not_supported' | 'cancelled' | 'invalid_state' | 'not_allowed' | 'unknown';
  message: string;
}

// ============================================================================
// Base64url Helpers (shared)
// ============================================================================

export function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
