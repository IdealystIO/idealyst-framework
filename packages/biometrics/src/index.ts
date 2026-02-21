// Default entry — re-exports types.
// Platform-specific entry points (index.web.ts, index.native.ts) provide real implementations.
export * from './types';
export {
  isBiometricAvailable,
  getBiometricTypes,
  getSecurityLevel,
  authenticate,
  cancelAuthentication,
} from './biometrics.web';
export {
  isPasskeySupported,
  createPasskey,
  getPasskey,
} from './passkeys.web';
