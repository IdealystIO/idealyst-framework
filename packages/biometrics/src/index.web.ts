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
